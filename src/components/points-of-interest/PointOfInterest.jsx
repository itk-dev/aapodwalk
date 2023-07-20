import { React, useState, useEffect, useContext } from "react";
import LatLongContext from "../../context/latitude-longitude-context";
import {
  getDistanceBetweenCoordinates,
  getAngleFromLocationToDestination,
} from "../../util/helper";
import PermissionContext from "../../context/permission-context";
import AudioContext from "../../context/audio-context";
import Image from "../Image";

function PointOfInterest({
  pointOfInterest: { latitude, longitude, name, image, id, subtitles, podcast },
}) {
  const startBtn = document.querySelector(".start-btn");
  const { lat, long } = useContext(LatLongContext);
  const { setSource } = useContext(AudioContext);
  const [proximity, setProximity] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [viewSubtitles, setViewSubtitles] = useState(false);
  const [compass, setCompass] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [angle, setAngle] = useState(0);
  const { geolocationAvailable } = useContext(PermissionContext);
  let handlerAvailable = true;
  let locationHandlerAvailable = true;
  const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

  function handler(e) {
    if (handlerAvailable === false) return;
    handlerAvailable = false;
    setTimeout(() => {
      handlerAvailable = true;
    }, 750);
    navigator.geolocation.getCurrentPosition(locationHandler);
    const cmps = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    setCompass(cmps);
  }
  function locationHandler(pos) {
    if (locationHandlerAvailable === false) return;
    locationHandlerAvailable = false;
    setTimeout(() => {
      locationHandlerAvailable = true;
    }, 750);
    setAngle(
      getAngleFromLocationToDestination(
        pos.coords.latitude,
        pos.coords.longitude,
        latitude,
        longitude
      )
    );
  }
  function startCompass() {
    if (isIOS) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          }
        })
        .catch();
    }
  }
  useEffect(() => {
    if (compass && angle) {
      let arrowRotation = compass - angle;
      if (arrowRotation < 0) {
        arrowRotation %= 180;
      }
      setRotation(arrowRotation);
    }
  }, [compass, angle]);
  useEffect(() => {
    if (
      latitude &&
      longitude &&
      lat &&
      long &&
      geolocationAvailable === "granted"
    ) {
      const distance = getDistanceBetweenCoordinates(
        lat,
        long,
        latitude,
        longitude
      );
      setProximity(distance);
      setUnlocked(distance < 10000); // todo magic number/get from config
    }
  }, [latitude, longitude, lat, long, geolocationAvailable]);

  function isExperienceIdInLocalstorage() {
    const currentLocalStorage = localStorage.getItem("unlocked-experiences");
    if (currentLocalStorage) {
      const updateLocalStorage = JSON.parse(currentLocalStorage);
      if (updateLocalStorage.includes(id)) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (isExperienceIdInLocalstorage()) {
      return;
    }
    if (unlocked) {
      const currentLocalStorage = localStorage.getItem("unlocked-experiences");
      if (currentLocalStorage) {
        // add to existing unlocked steps
        const updateLocalStorage = JSON.parse(currentLocalStorage);

        updateLocalStorage.push(id);
        localStorage.setItem(
          "unlocked-experiences",
          JSON.stringify(updateLocalStorage)
        );
      } else {
        // add new "unlocked steps"
        localStorage.setItem("unlocked-experiences", JSON.stringify([id]));
      }
    }
  }, [unlocked]);

  useEffect(() => {
    if (isExperienceIdInLocalstorage()) {
      setUnlocked(true);
    }
    startBtn.addEventListener("click", startCompass);

    if (!isIOS) {
      window.addEventListener("deviceorientationabsolute", handler, true);
    }
  }, []);

  return (
    <>
      <h2>{name}</h2>
      <Image src={image} />
      <div>
        {!unlocked && (
          <label htmlFor="distance">
            afstand
            {/* todo this is slow and would benefit from loading screen / skeleton componenet */}
            <div id="distance">{proximity} m</div>
          </label>
        )}
      </div>
      {unlocked && (
        <button type="button" onClick={() => setSource(podcast)}>
          Play
        </button>
      )}
      {unlocked && (
        <button type="button" onClick={() => setViewSubtitles(!viewSubtitles)}>
          Se tekst
        </button>
      )}
      {!unlocked && <div>kan ikke tilgås</div>}
      {viewSubtitles && <div>{subtitles}</div>}
      <p>angle {angle}</p>
      <img
        alt=""
        style={{
          width: 100,
          transform: `rotate(${rotation}deg)`,
        }}
        src="data:image/png;base64,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"
      />
      <button type="button" onClick={() => startCompass()}>
        Vis mig vej (react defineret)
      </button>
    </>
  );
}

export default PointOfInterest;

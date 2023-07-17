import { React, useState, useEffect, useContext } from "react";
import LatLongContext from "../../context/latitude-longitude-context";
import { getDistanceBetweenCoordinates } from "../../util/helper";
import PermissionContext from "../../context/permission-context";
import AudioContext from "../../context/audio-context";
import Image from "../Image";

function PointOfInterest({
  pointOfInterest: { latitude, longitude, name, image, id, subtitles, podcast },
}) {
  const { lat, long } = useContext(LatLongContext);
  const { setSource } = useContext(AudioContext);
  const [proximity, setProximity] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [viewSubtitles, setViewSubtitles] = useState(false);
  const { geolocationAvailable } = useContext(PermissionContext);

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
    </>
  );
}

export default PointOfInterest;

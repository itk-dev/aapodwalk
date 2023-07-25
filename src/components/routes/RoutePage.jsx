import { React, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../util/useFetch";
import PointOfInterest from "../points-of-interest/PointOfInterest";
import { getAngleFromLocationToDestination } from "../../util/helper";
import BackButton from "../BackButton";
import { ReactComponent as LocationArrow } from "../../icons/location-arrow-solid.svg";
import AudioContext from "../../context/audio-context";

function RoutePage() {
  const { id } = useParams();
  const { data } = useFetch(`routes/${id}`);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState(null);
  const [orientation, setOrientation] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [angle, setAngle] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [destinationName, setDestinationName] = useState(null);
  const [userLatitude, setUserLatitude] = useState(0);
  const [userLongitude, setUserLongitude] = useState(0);
  const { audio } = useContext(AudioContext);
  let handlerAvailable = true;
  let locationHandlerAvailable = true;
  const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

  useEffect(() => {
    if (data) {
      setSelectedRoute(data);
      setPointsOfInterest(data.pointsOfInterest["hydra:member"]);
    }
  }, [data]);

  useEffect(() => {
    if (orientation && angle) {
      setRotation(orientation - angle);
    }
  }, [orientation, angle]);

  function locationHandler(pos) {
    setTimeout(() => {
      setAngle(
        getAngleFromLocationToDestination(
          pos.coords.latitude,
          pos.coords.longitude,
          latitude,
          longitude
        )
      );
    }, 3000);
  }

  function deviceOrientationHandler(e) {
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(locationHandler);
      const orientaionValue = e.webkitCompassHeading || Math.abs(e.alpha - 360);
      setOrientation(orientaionValue);
    }, 3000);
  }

  function startWaypointer() {
    if (isIOS) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener(
              "deviceorientation",
              deviceOrientationHandler,
              true
            );
          }
        })
        .catch();
    }
  }

  useEffect(() => {
    if (!isIOS) {
      window.addEventListener(
        "deviceorientationabsolute",
        deviceOrientationHandler,
        true
      );
    }
  }, []);

  useEffect(() => {
    if (pointsOfInterest) {
      console.log(pointsOfInterest);
      setLatitude(pointsOfInterest[0].latitude);
      setLongitude(pointsOfInterest[0].longitude);
      setDestinationName(pointsOfInterest[0].name);
    }
  }, [pointsOfInterest]);

  if (selectedRoute === null) return null;

  return (
    <div className="flex flex-col place-items-start pb-20">
      <BackButton>Afslut</BackButton>
      <h1 className="text-xl font-bold my-3">{selectedRoute.name}</h1>
      <div className="overflow-y-auto h-4/6 relative w-full bg-white dark:bg-zinc-700 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-lg flex flex-col divide-y dark:divide-zinc-200/5">
        {pointsOfInterest &&
          pointsOfInterest
            .toReversed()
            .map((pointOfInterest) => (
              <PointOfInterest
                pointOfInterest={pointOfInterest}
                key={pointOfInterest.id}
              />
            ))}
      </div>
      {/* TODO: Make room for audio player below when playing */}
      <div className="fixed left-3 bottom-3 right-3 bg-zinc-200 dark:bg-zinc-700 flex gap-3 rounded-lg p-3 pb-15 divide-x dark:divide-zinc-200/5">
        <div>
          <span className="block text-sm text-bold">Afstand til del 1</span>
          <span className="block">180 meter</span>
          <button
            className="bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-800 rounded text-sm py-1 px-3"
            type="button"
            onClick={() => startWaypointer()}
          >
            Vis mig vej
          </button>
        </div>
        <div className="pl-3">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-bold">Retning</span>
            <span className="w-1/2">
              <LocationArrow
                className="inline w-5"
                style={{
                  transform: `rotate(${-rotation}deg)`,
                }}
              />
            </span>
          </div>
          <div className="text-xs text-zinc-500">
            Lat: {userLatitude}/{latitude}
          </div>
          <div className="text-xs text-zinc-500">
            Long: {userLongitude}/{longitude}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoutePage;

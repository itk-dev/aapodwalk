import { React, useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../util/useFetch";
import PointOfInterest from "../points-of-interest/PointOfInterest";
import LatLongContext from "../../context/latitude-longitude-context";
import {
  getAngleFromLocationToDestination,
  getRelevantDestinationPoint,
  getDistanceBetweenCoordinates,
} from "../../util/helper";
import PermissionContext from "../../context/permission-context";
import BackButton from "../BackButton";
import { ReactComponent as LocationArrow } from "../../icons/location-arrow-solid.svg";
import AudioContext from "../../context/audio-context";

function RoutePage() {
  const { id } = useParams();
  const bottomRef = useRef(null);
  const { data } = useFetch(`routes/${id}`);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState(null);
  const [orientation, setOrientation] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [angle, setAngle] = useState(0);
  const [destinationLatitude, setDestinationLatitude] = useState(0);
  const [destinationLongitude, setDestinationLongitude] = useState(0);
  const [destinationDistance, setDestinationDistance] = useState(null);
  const [destination, setDestination] = useState(null);
  const [destinationIndex, setDestinationIndex] = useState(0);
  const [nextUnlockableId, setNextUnlockableId] = useState(null);
  const { userLatitude, userLongitude } = useContext(LatLongContext);
  const { geolocationAvailable } = useContext(PermissionContext);
  const { audio } = useContext(AudioContext);
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
    if (
      destinationLatitude &&
      destinationLongitude &&
      userLatitude &&
      userLongitude &&
      geolocationAvailable === "granted"
    ) {
      const distance = getDistanceBetweenCoordinates(
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude
      );
      setDestinationDistance(distance);
    }
  }, [
    destinationLatitude,
    destinationLongitude,
    userLatitude,
    userLongitude,
    geolocationAvailable,
  ]);

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
          destinationLatitude,
          destinationLongitude
        )
      );
    }, 3000);
  }

  useEffect(() => {
    if (pointsOfInterest && bottomRef) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [bottomRef, pointsOfInterest]);

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

  const destinationChanged = () => {
    if (pointsOfInterest) {
      const destinationPoint = getRelevantDestinationPoint(pointsOfInterest);
      const index = pointsOfInterest.findIndex(
        (poi) => destinationPoint[0].id === poi.id
      );
      setDestinationIndex(index);
      setDestination(destinationPoint[0]);
      setNextUnlockableId(destinationPoint[0].id);

      setDestinationLatitude(destinationPoint[0].latitude);
      setDestinationLongitude(destinationPoint[0].longitude);
    }
  };
  useEffect(() => {
    destinationChanged();
  }, [pointsOfInterest]);

  if (selectedRoute === null) return null;

  return (
    <div className="flex flex-col place-items-start pb-28">
      <BackButton>Afslut</BackButton>
      <h1 className="text-xl font-bold my-3">{selectedRoute.name}</h1>
      <div className="relative w-full rounded-lg flex flex-col-reverse gap-1">
        {pointsOfInterest &&
          pointsOfInterest.map((pointOfInterest, index) => (
            <PointOfInterest
              pointOfInterest={pointOfInterest}
              key={pointOfInterest.id}
              index={index + 1}
              destinationChanged={destinationChanged}
              nextUnlockableId={nextUnlockableId}
            />
          ))}
      </div>
      {/* TODO: Make room for audio player below when playing */}
      <div className="fixed left-3 bottom-3 right-3 bg-zinc-200 dark:bg-zinc-700 flex gap-3 rounded-lg p-3 pb-15 divide-x dark:divide-zinc-200/5">
        <div>
          <div className="text-sm text-bold">
            Afstand til del
            <span className="ml-1 px-2 font-bold rounded-full bg-emerald-700 text-zinc-100 text-sm">
              {destinationIndex + 1}
            </span>
          </div>
          <div className="">
            {destinationDistance && `${destinationDistance} meter`}
          </div>
        </div>
        <div className="pl-3">
          {/* TODO: Make this check for compass */}
          {(!orientation || !angle) && (
            <button
              className="bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-800 rounded text-sm py-1 px-3"
              type="button"
              onClick={() => startWaypointer()}
            >
              Vis mig vej
            </button>
          )}
          {/* TODO: Make this check for compass */}
          {orientation && angle && (
            <div>
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
              {/* <div className="text-xs text-zinc-500">
                Lat: {userLatitude}/{latitude}
              </div>
              <div className="text-xs text-zinc-500">
                Long: {userLongitude}/{longitude}
              </div> */}
            </div>
          )}
        </div>
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

export default RoutePage;

/* eslint-disable jsx-a11y/media-has-caption */
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
import ApiEndpointContext from "../../context/api-endpoint-context";

function RoutePage() {
  const { id } = useParams();
  const bottomRef = useRef(null);
  const { data } = useFetch(`routes/${id}`);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState(null);
  const [orientation, setOrientation] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [angle, setAngle] = useState(null);
  const [destinationLatitude, setDestinationLatitude] = useState(0);
  const [destinationLongitude, setDestinationLongitude] = useState(0);
  const [destinationDistance, setDestinationDistance] = useState(null);
  const [destinationIndex, setDestinationIndex] = useState(0);
  const [nextUnlockableId, setNextUnlockableId] = useState(null);
  const [routeComplete, setRouteComplete] = useState(false);
  const [source, setSource] = useState(null);
  const [accuracy, setAccuracy] = useState(0);
  const { userLatitude, userLongitude } = useContext(LatLongContext);
  const { geolocationAvailable } = useContext(PermissionContext);
  const audioRef = useRef();
  const { fileUrl } = useContext(ApiEndpointContext);
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [source]);

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
      setAccuracy();
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
    navigator.geolocation.getCurrentPosition(locationHandler);
    setTimeout(() => {
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
      if (destinationPoint.length === 0) {
        return setRouteComplete(true);
      }
      const index = pointsOfInterest.findIndex(
        (poi) => destinationPoint[0].id === poi.id
      );
      setDestinationIndex(index);
      setNextUnlockableId(destinationPoint[0].id);
      setDestinationLatitude(destinationPoint[0].latitude);
      setDestinationLongitude(destinationPoint[0].longitude);
    }
    return false;
  };
  useEffect(() => {
    destinationChanged();
  }, [pointsOfInterest]);

  if (selectedRoute === null) return null;

  return (
    <div className="flex flex-col place-items-start pb-36">
      <BackButton>Afslut</BackButton>
      <h1 className="text-xl font-bold my-3">{selectedRoute.name}</h1>
      <div className="relative w-full rounded-lg flex flex-col-reverse gap-1 pl-3">
        {pointsOfInterest &&
          pointsOfInterest.map((pointOfInterest, index) => (
            <PointOfInterest
              pointOfInterest={pointOfInterest}
              key={pointOfInterest.id}
              index={index + 1}
              destinationChanged={destinationChanged}
              nextUnlockableId={nextUnlockableId}
              setSource={setSource}
              accuracy={accuracy}
            />
          ))}
      </div>
      <div className="fixed flex flex-col left-3 bottom-0 right-3 bg-zinc-200 dark:bg-zinc-900 gap-3 rounded-t-lg p-3 pb-15 divide-y dark:divide-zinc-200/5">
        {routeComplete && <h3>You completed the route. Congratulations!</h3>}
        {!routeComplete && (
          <div className="flex flex-row justify-between">
            <div>
              <p className="text-xs text-zinc-500">Find vej til næste del</p>
              <div className="text-sm font-bold">
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
              {(!orientation || !angle) && (
                <button
                  className="bg-zinc-700 dark:bg-zinc-200 text-zinc-200 dark:text-zinc-800 rounded text-sm py-1 px-3"
                  type="button"
                  onClick={() => startWaypointer()}
                >
                  Vis mig vej
                </button>
              )}
              {orientation && angle && (
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm text-bold mr-5 my-auto">
                      Retning
                    </span>
                    <span className="w-1/2">
                      <LocationArrow
                        className="inline w-10"
                        style={{
                          transform: `rotate(${-rotation}deg)`,
                        }}
                      />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {source && audioRef && (
          <div className="pt-2">
            <p className="text-xs text-zinc-500">Igangværende afspilning</p>
            {/* TODO: Get the real name instead of Pizza 1 */}
            <p className="text-sm font-bold ">Pizza 1</p>
            <audio className="w-full" ref={audioRef} controls>
              <source src={`${fileUrl}${source}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

export default RoutePage;

import { React, useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Image from "../Image";
import RouteContext from "../../context/RouteContext";
import Footprints from "../../icons/footprints.svg?url";
import DistanceComponent from "./DistanceComponent";
import DirectionArrow from "./DirectionArrow";
import OrderComponent from "./OrderComponent";
import PointOverlay from "./PointOverlay";
import LatLongContext from "../../context/latitude-longitude-context";
import PermissionContext from "../../context/permission-context";
import { isDeviceIOS, isDeviceAndroid } from "../../util/helper";

function Point({ point, order }) {
  const { latitude, longitude, name, image, id, subtitles, proximityToUnlock = 100 } = point;
  const { nextUnlockablePointId, listOfUnlocked, activePointId, setActivePointId } = useContext(RouteContext);
  const { openStreetMapConsent, setOpenStreetMapConsent } = useContext(PermissionContext);
  const { lat, long } = useContext(LatLongContext);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const isActive = activePointId === id;

  useEffect(() => {
    if (!hasScrolled && nextUnlockablePointId === id) {
      const elementToScrollTo = document.getElementById(id);
      if (elementToScrollTo) {
        elementToScrollTo.scrollIntoView({ behavior: "smooth" });
        setHasScrolled(true);
      }
    }
  }, [nextUnlockablePointId]);

  useEffect(() => {
    if (listOfUnlocked) {
      // The point is not locked if the id is in the list of unlocked.
      setUnlocked(listOfUnlocked.includes(id));
    }
  }, [listOfUnlocked, id]);

  function isNextPointToUnlock() {
    // The point is the next in line to be unlocked:
    // - The id matches that of the next in line to be unlocked
    // - It has not already been unlocked
    // - The user gives access to geolocation
    return nextUnlockablePointId === id && !unlocked && lat && long;
  }

  // Opens navigation to the point's coordinates using the device's preferred maps app.
  // - iOS: Apple Maps directions URL (the native default on iOS).
  // - Android: geo: URI, which triggers the OS intent chooser so the user can open
  //   in their preferred maps app (Google Maps, Waze, OsmAnd, etc.).
  //   Trade-off: the geo: URI shows the destination as a pin rather than auto-starting
  //   turn-by-turn directions — the user taps "Navigate" once in their chosen app.
  // - Fallback: Google Maps directions URL for desktop and other platforms.
  function openNativeNavigation() {
    let url;
    if (isDeviceIOS) {
      url = `https://maps.apple.com/?daddr=${latitude},${longitude}`;
    } else if (isDeviceAndroid) {
      url = `geo:${latitude},${longitude}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    window.location.href = url;
  }

  function isLocked() {
    // The point is locked if:
    // - It is locked, and it is not the next to be unlocked or
    // - The user does not allow geo location access
    return (!unlocked && nextUnlockablePointId !== id) || !(lat && long);
  }

  function getAriaLabelForButton() {
    if (isNextPointToUnlock) {
      return `Dette punkt er det næste på ruten der skal åbnes. Det bliver åbnet ved at indenfor ${proximityToUnlock} meter af punktet`;
    }
    if (isLocked()) {
      return `Dette punkt er låst. For at åbne det skal det være det næste punkt på ruten, og du skal være indenfor ${proximityToUnlock} meter af punktet`;
    }
    return "Dette punkt er åbent. Du kan lytte til det ved at klikke på det.";
  }

  return (
    <div id={id} className="relative">
      {isNextPointToUnlock() && (
        <p className="text-center text-sm font-bold text-emerald-400 dark:text-emerald-600 -mb-1">Næste punkt</p>
      )}
      <button
        type="button"
        onClick={() => setActivePointId(id)}
        className={`relative text-left w-full ${unlocked ? "" : "pointer-events-none"}`}
        aria-label={getAriaLabelForButton()}
      >
        <div
          className={`bg-emerald-400 dark:bg-zinc-700 flex flex-row relative h-32 my-2 rounded flex items-center ${
            unlocked ? "" : "opacity-35 blur-sm bg-zinc-100 dark:bg-zinc-900"
          }`}
        >
          <Image src={image} className="w-24 h-24 rounded grow w-1/4 ml-2 object-cover" />
          <div className="w-3/4 ml-2">
            <OrderComponent order={order} />
            <h2 className="text-xl font-bold">{name}</h2>
            <div className="line-clamp-2 text-zinc-900 dark:text-zinc-300 mr-2">{subtitles}</div>
          </div>
        </div>
      </button>
      {isLocked() && (
        <FontAwesomeIcon
          icon={faLock}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
        />
      )}
      {unlocked && (
        <PointOverlay
          point={point}
          order={order}
          active={isActive}
          toggleActive={() => setActivePointId(isActive ? null : id)}
        />
      )}
      {isNextPointToUnlock() && (
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-start justify-around px-4">
          <button type="button" onClick={openNativeNavigation} className="flex flex-col items-center cursor-pointer">
            <div className="h-12 flex items-center justify-center">
              <img src={Footprints} alt="" className="h-10 w-10" />
            </div>
            <span className="text-xs font-bold mt-1 whitespace-nowrap text-emerald-400 dark:text-emerald-600">
              Åbn navigation
            </span>
          </button>
          {openStreetMapConsent && (
            <Link
              to={`/see-on-map/${latitude}/${longitude}`}
              className="flex flex-col items-center cursor-pointer text-emerald-400 dark:text-emerald-600"
            >
              <div className="h-12 flex items-center justify-center">
                <FontAwesomeIcon style={{ height: "1.4rem", width: "1.4rem" }} icon={faMapLocationDot} />
              </div>
              <span className="text-xs font-bold mt-1 whitespace-nowrap">Åbn kort</span>
              <span className="sr-only">Se punkt {name} på kort</span>
            </Link>
          )}
          {!openStreetMapConsent && (
            <button
              type="button"
              onClick={() => setOpenStreetMapConsent(null)}
              className="flex flex-col items-center cursor-pointer text-emerald-400 dark:text-emerald-600"
            >
              <div className="h-12 flex items-center justify-center">
                <FontAwesomeIcon style={{ height: "1.4rem", width: "1.4rem" }} icon={faMapLocationDot} />
              </div>
              <span className="text-xs font-bold mt-1 whitespace-nowrap">Åbn kort</span>
              <span className="sr-only">Tag stilling til tilladelser i forhold til kortet igen</span>
            </button>
          )}
          <div className="flex flex-col items-center">
            <div className="h-12 flex flex-col items-center justify-center">
              <DirectionArrow
                latitude={latitude}
                longitude={longitude}
                classes="h-6 w-6 text-emerald-400 dark:text-emerald-600"
              />
              <DistanceComponent data={point} classes="" />
            </div>
            <span className="text-xs font-bold mt-1 whitespace-nowrap text-emerald-400 dark:text-emerald-600">
              Afstand
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Point;

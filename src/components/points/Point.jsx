import { React, useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Image from "../Image";
import RouteContext from "../../context/RouteContext";
import Footprints from "../../icons/footprints.svg?url";
import LatLongContext from "../../context/latitude-longitude-context";
import PermissionContext from "../../context/permission-context";
import { isDeviceIOS, isDeviceAndroid } from "../../util/helper";
import DistanceComponent from "./DistanceComponent";
import DirectionArrow from "./DirectionArrow";
import OrderComponent from "./OrderComponent";
import PointOverlay from "./PointOverlay";

function Point({ point, order }) {
  const { latitude, longitude, name, image, id, subtitles, proximityToUnlock = 100 } = point;
  const { nextUnlockablePointId, listOfUnlocked, setListOfUnlocked, activePointId, setActivePointId, selectedRoute } =
    useContext(RouteContext);
  const { openStreetMapConsent, setOpenStreetMapConsent } = useContext(PermissionContext);
  const { lat, long } = useContext(LatLongContext);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  // `unlocking` is the transition state — true while we're animating from the
  // "next-to-unlock" appearance to the unlocked appearance. The decoration
  // buttons fade out and the card crossfades to its unlocked styling during
  // this window, then `unlocked` flips to true and `unlocking` back to false.
  const [unlocking, setUnlocking] = useState(false);
  // Anything that arrives within ~1s of mount is treated as the localStorage
  // rehydration of already-unlocked POIs and skipped past the animation
  // (otherwise every previously-unlocked card would animate on every page
  // load, which would be a lot of motion). useState's lazy initializer is
  // the React-blessed place to call impure functions like Date.now() — it
  // runs once during initial render, not on subsequent renders.
  const [mountTime] = useState(() => Date.now());
  const distanceClickCount = useRef(0);
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
    if (!listOfUnlocked) return;
    const shouldBeUnlocked = listOfUnlocked.includes(id);
    const isInitialLoad = Date.now() - mountTime < 1000;

    if (shouldBeUnlocked && !unlocked && !unlocking) {
      if (isInitialLoad) {
        // Already unlocked when the page loaded — no animation.
        setUnlocked(true);
      } else {
        // Fresh unlock — play the transition animation.
        setUnlocking(true);
      }
    } else if (!shouldBeUnlocked && unlocked) {
      setUnlocked(false);
    }
  }, [listOfUnlocked, id, unlocked, unlocking]);

  useEffect(() => {
    if (!unlocking) return undefined;
    const timer = setTimeout(() => {
      setUnlocked(true);
      setUnlocking(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [unlocking]);

  // Dev-only simulator: ten taps on the distance column flips this POI into
  // the unlocked state, so the unlock animation can be exercised without
  // physically walking into proximity. Stripped from production builds via
  // import.meta.env.DEV so end users can't accidentally activate it.
  function simulateProximityUnlock() {
    if (listOfUnlocked.includes(id)) return;
    setListOfUnlocked([...listOfUnlocked, id]);
    const storageKey = `unlocked-experiences-${selectedRoute?.id}`;
    const currentLocalStorage = localStorage.getItem(storageKey);
    if (currentLocalStorage) {
      const updateLocalStorage = JSON.parse(currentLocalStorage);
      if (!updateLocalStorage.includes(id)) {
        updateLocalStorage.push(id);
        localStorage.setItem(storageKey, JSON.stringify(updateLocalStorage));
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify([id]));
    }
  }

  function handleDistanceClick() {
    if (!import.meta.env.DEV) return;
    distanceClickCount.current += 1;
    if (distanceClickCount.current >= 10) {
      distanceClickCount.current = 0;
      simulateProximityUnlock();
    }
  }

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
    // During the unlock animation the POI shouldn't display the lock icon
    // (it's mid-celebration). Otherwise the existing rules apply.
    if (unlocking) return false;
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
      <button
        type="button"
        onClick={() => setActivePointId(id)}
        className={`relative text-left w-full ${unlocked || unlocking ? "" : "pointer-events-none"}`}
        aria-label={getAriaLabelForButton()}
      >
        <div
          className={`bg-emerald-400 dark:bg-zinc-700 flex flex-row relative h-32 my-2 rounded flex items-center transition-all duration-500 ease-out ${
            unlocked || unlocking ? "" : "opacity-35 blur-sm bg-zinc-100 dark:bg-zinc-900"
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
      {(isNextPointToUnlock() || unlocking) && (
        <p
          className={`absolute top-4 left-0 right-0 text-center text-xs font-bold text-emerald-400 dark:text-emerald-600 transition-opacity duration-500 pointer-events-none ${
            unlocking ? "opacity-0" : "opacity-100"
          }`}
        >
          Næste punkt
        </p>
      )}
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
      {(isNextPointToUnlock() || unlocking) && (
        <div
          className={`absolute top-[60%] left-0 right-0 -translate-y-1/2 flex items-start justify-around px-4 transition-opacity duration-500 ${
            unlocking ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
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
          {/* Distance column. In dev builds, tapping it 10 times unlocks the
              POI without needing real proximity — see `handleDistanceClick`. */}
          <button type="button" onClick={handleDistanceClick} className="flex flex-col items-center cursor-pointer">
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
          </button>
        </div>
      )}
    </div>
  );
}

export default Point;

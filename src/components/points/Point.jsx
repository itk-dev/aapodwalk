import { React, useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Image from "../Image";
import RouteContext from "../../context/RouteContext";
import Footprints from "../../icons/footprints.svg?url";
import DistanceComponent from "./DistanceComponent";
import OrderComponent from "./OrderComponent";
import PointOverlay from "./PointOverlay";
import LatLongContext from "../../context/latitude-longitude-context";
import { useScrollToLocation } from "../hooks/UseScrollIntoView";

function Point({ point, order }) {
  const { latitude, longitude, name, image, id, subtitles, proximityToUnlock = 100 } = point;
  const { nextUnlockablePointId, listOfUnlocked } = useContext(RouteContext);
  const { lat, long } = useContext(LatLongContext);
  const [unlocked, setUnlocked] = useState(false);
  const [playThis, setPlayThis] = useState(false);

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

  function isLocked() {
    // The point is locked if:
    // - It is locked, and it is not the next to be unlocked or
    // - The user does not allow geo location access
    return (!unlocked && nextUnlockablePointId !== id) || !(lat && long);
  }

  useScrollToLocation(nextUnlockablePointId === id, id);

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
        onClick={() => setPlayThis(true)}
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
        <PointOverlay point={point} order={order} active={playThis} toggleActive={() => setPlayThis(!playThis)} />
      )}
      {isNextPointToUnlock() && (
        <>
          <Link
            to={`/see-on-map/${latitude}/${longitude}`}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col cursor-pointer text-emerald-400 dark:text-emerald-600"
          >
            <FontAwesomeIcon className="h-9" icon={faMapLocationDot} />
            <span className="sr-only">Se punkt {name} på kort</span>
          </Link>
          <DistanceComponent
            data={point}
            classes="absolute top-1/2 right-5 transform -translate-x-1/2 -translate-y-1/2 text-xl"
          />
          <img
            src={Footprints}
            alt=""
            className="h-16 h-16 absolute top-1/2 left-12 transform -translate-x-1/2 -translate-y-1/2"
          />
        </>
      )}
    </div>
  );
}

export default Point;

import { React, useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faMap } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Image from "../Image";
import RouteContext from "../../context/RouteContext";
import Footprints from "../../icons/footprints.svg?url";
import DistanceComponent from "./DistanceComponent";
import OrderComponent from "./OrderComponent";
import PointOverlay from "./PointOverlay";
import LatLongContext from "../../context/latitude-longitude-context";

function Point({
  point: { latitude, longitude, name, image, id, subtitles, proximityToUnlock = 100, mediaEmbedCode },
  order,
}) {
  const { nextUnlockablePointId, listOfUnlocked } = useContext(RouteContext);
  const { lat, long } = useContext(LatLongContext);
  const [unlocked, setUnlocked] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [embed, setEmbed] = useState(null);
  const { search } = useLocation();
  const { replace } = useHistory();

  useEffect(() => {
    const query = new URLSearchParams(search);
    const pointId = query.get("point");
    if (pointId && Number(pointId) === id) {
      setOverlay(true);
    }
  }, [id, search]);

  useEffect(() => {
    let searchParams = null;

    if (overlay) {
      const paramsString = `point=${id}`;
      searchParams = new URLSearchParams(paramsString);
    } else {
      searchParams = new URLSearchParams("");
    }

    replace({ search: searchParams.toString() });
  }, [overlay, id, replace]);

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

  function playThis() {
    setEmbed(mediaEmbedCode);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => playThis()}
        className={`relative text-left w-full ${unlocked ? "" : "pointer-events-none"}`}
      >
        <div
          className={`bg-zinc-100 dark:bg-zinc-900 flex flex-row relative h-32 my-2 rounded flex items-center ${
            unlocked ? "" : "opacity-35"
          }`}
        >
          <Image src={image} className="w-24 h-24 rounded grow w-1/4 ml-2 object-cover" />
          <div className="w-3/4 ml-2">
            <OrderComponent order={order} />
            <h2 className="text-xl font-bold">{name}</h2>
            <div className="line-clamp-2 text-zinc-300 mr-2">{subtitles}</div>
          </div>
          {isLocked() && (
            <FontAwesomeIcon
              icon={faLock}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
            />
          )}
        </div>
      </button>
      {embed && (
        <div
          className={`${
            overlay
              ? "absolute top-0 left-0 right-0 z-50"
              : "fixed bottom-0 left-0 right-0 bg-zinc-100 dark:bg-zinc-900"
          }`}
        >
          {!overlay && (
            <div className="p-3 flex justify-between">
              <h3>{name}</h3>
              <button
                className="text-emerald-400 dark:text-emerald-800 font-bold text-sm"
                type="button"
                onClick={() => setOverlay(true)}
              >
                Se mere
              </button>
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: embed }} />
        </div>
      )}
      {overlay && unlocked && (
        <PointOverlay description={subtitles} closeOverlay={() => setOverlay(false)} title={name} order={order} />
      )}
      {isNextPointToUnlock() && (
        <>
          <Link
            to={`/see-on-map/${latitude}/${longitude}`}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col cursor-pointer text-emerald-400 dark:text-emerald-800"
          >
            <FontAwesomeIcon icon={faMap} />
            Se på kort
          </Link>
          <DistanceComponent
            classes="absolute top-1/2 right-5 transform -translate-x-1/2 -translate-y-1/2"
            id={id}
            latitude={latitude}
            longitude={longitude}
            proximityToUnlock={proximityToUnlock}
          />
          <img
            src={Footprints}
            alt=""
            className="w-10 h-10 absolute top-1/2 left-12 transform -translate-x-1/2 -translate-y-1/2"
          />
        </>
      )}
    </div>
  );
}

export default Point;

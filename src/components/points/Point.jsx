import { React, useState, useEffect, useContext } from "react";
import PermissionContext from "../../context/permission-context";
import Image from "../Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import RouteContext from "../../context/RouteContext";
import Footprints from "../../icons/footprints.svg?url";
import OrientationArrow from "./OrientationArrow";
import DistanceComponent from "./DistanceComponent";

function Point({ point: { latitude, longitude, name, image, id, subtitles, proximityToUnlock = 100 }, order }) {
  const { nextUnlockablePointId, listOfUnlocked } = useContext(RouteContext);
  const { userAllowedAccessToGeoLocation } = useContext(PermissionContext);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (listOfUnlocked) {
      setUnlocked(listOfUnlocked.indexOf(id) > -1);
    }
  }, [listOfUnlocked, id]);


  return (
    <div className="relative">
      <div
        className={`bg-zinc-100 dark:bg-zinc-900 flex flex-row relative h-32 my-2 rounded flex items-center ${
          unlocked ? "" : "opacity-35"
        }`}
      >
        <Image src={image} className="w-24 h-24 rounded-full grow w-1/4 ml-2" />
        <div className="w-3/4 ml-2">
          <div className="flex place-content-center rounded text-xl w-6 h-6 bg-black justify-center mb-2 items-center flex dark:bg-emerald-800">
            {order}
          </div>
          <h2 className="text-xl font-bold">{name}</h2>
          <div className="line-clamp-2 text-zinc-300 mr-2">{subtitles}</div>
        </div>
        {((!unlocked && nextUnlockablePointId !== id) || !userAllowedAccessToGeoLocation) && (
          <FontAwesomeIcon
            icon={faLock}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
          />
        )}
      </div>
      {nextUnlockablePointId === id && !unlocked && userAllowedAccessToGeoLocation && (
        <>
          <OrientationArrow id={id} />
          <DistanceComponent classes="absolute top-1/2 right-5 transform -translate-x-1/2 -translate-y-1/2 dark:text-emerald-600 font-bold" id={id} latitude={latitude} longitude={longitude} proximityToUnlock={proximityToUnlock} />
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

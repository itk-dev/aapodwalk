import { React, useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Image from "../Image";
import { getDistanceBetweenCoordinates } from "../../util/helper";
import LatLongContext from "../../context/latitude-longitude-context";
import PermissionContext from "../../context/permission-context";

function Route({ route }) {
  const [proximity, setProximity] = useState();
  console.log(route);
  const { latitude, longitude } = route.pointsOfInterest[0];
  const { lat, long } = useContext(LatLongContext);
  const { geolocationAvailableContext: geolocationAvailable } = useContext(PermissionContext);

  useEffect(() => {
    if (latitude && longitude && lat && long && geolocationAvailable !== "denied") {
      const distance = getDistanceBetweenCoordinates(lat, long, latitude, longitude);
      setProximity(distance);
    }
  }, [latitude, longitude, geolocationAvailable]);

  return (
    <Link
      className="bg-zinc-100 dark:bg-zinc-900 flex flex-row relative h-32 my-2 rounded"
      to={`/route/${route["@id"]}`}
    >
      <div className="flex-none w-36">
        <Image className="object-cover h-full" src={route.image} />
      </div>
      <div className="flex-initial text-left leading-none py-3 pl-3 pr-6 mb-6">
        <div className="text-emerald-400 dark:text-emerald-800 font-bold text-sm flex justify-between">
          <div className="truncate w-4/5">
            {route.tags.map(({ title }) => (
              <span>{title} </span>
            ))}
          </div>
          <span>{proximity} m</span>
        </div>
        <h2 className="mb-2 font-bold">{route.name}</h2>
        <div className="text-xs line-clamp-3">{route.description}</div>
      </div>
    </Link>
  );
}

export default Route;

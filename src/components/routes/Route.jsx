import { React, useContext } from "react";
import { Link } from "react-router-dom";
import Image from "../Image";
import SelectedRouteContext from "../../context/RouteContext";
import DistanceComponent from "../points/DistanceComponent";
import TagList from "../tags/TagList";
import LatLongContext from "../../context/latitude-longitude-context";

function Route({ route }) {
  // The below is to calculate the proximity between user and first point in route
  const { latitude, longitude } = route.points[0];
  const { lat, long } = useContext(LatLongContext);
  const { setSelectedRoute } = useContext(SelectedRouteContext);

  return (
    <Link
      className="bg-emerald-400 dark:bg-zinc-900 flex flex-row relative h-32 my-2 rounded"
      to={`/route/${route.id}`}
      onClick={() => setSelectedRoute(route)}
    >
      <div className="flex-none w-36">
        <Image className="object-cover h-full" src={route.image} />
      </div>
      <div className="flex flex-col py-3 pl-3 pr-6 overflow-hidden w-full">
        <div className="text-emerald-400 dark:text-emerald-800 font-bold text-sm flex justify-between">
          <div className="truncate w-4/5">
            <TagList tags={route.tags} />
          </div>
          {lat && long && (
            <DistanceComponent
              id={null}
              latitude={latitude}
              longitude={longitude}
              classes="truncate w-1/5 text-right text-sm"
              proximityToUnlock={null}
            />
          )}
        </div>
        <h2 className="mb-2 font-bold">{route.title}</h2>
        <div className="text-xs line-clamp-3">{route.description}</div>
      </div>
    </Link>
  );
}

export default Route;

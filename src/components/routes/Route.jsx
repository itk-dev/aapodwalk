import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../util/useFetch";
import Image from "../Image";

function Route({ id }) {
  const { data } = useFetch(`routes/${id}`);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (data) {
      setRoute(data);
    }
  }, [data]);

  if (route === null) return null;

  return (
    <Link
      className="bg-zinc-100 dark:bg-zinc-700 flex flex-row relative h-32"
      to={`/route/${id}`}
    >
      <div className="flex-none w-36">
        <Image className="object-cover h-full" src={route.image} />
      </div>
      <div className="flex-initial text-left leading-none py-3 pl-3 pr-6 mb-6">
        <h2 className="mb-2 font-bold">{route.name}</h2>
        <div className="text-xs line-clamp-3">{route.description}</div>
      </div>
    </Link>
  );
}

export default Route;

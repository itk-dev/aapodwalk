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
    <Link className="bg-zinc-100 dark:bg-zinc-700 flex" to={`/route/${id}`}>
      <Image className="flex-1 w-32" src={route.image} />
      <div className="flex-initial text-left leading-none p-3">
        <span className="block mb-1">{route.name}</span>
        <span className="text-xs ">{route.description}</span>
      </div>
    </Link>
  );
}

export default Route;

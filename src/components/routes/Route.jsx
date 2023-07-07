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
    <span>
      <Link className="" to={`/route/${id}`}>
        {route.name}
      </Link>
      <div>{route.description}</div>
      <Image src={route.image} />
    </span>
  );
}

export default Route;

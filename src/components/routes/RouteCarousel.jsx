import { React } from "react";
import Route from "./Route";
import { getIdFromApiEndpoint } from "../../util/helper";

function RouteCarousel({ routes }) {
  return (
    <>
      {routes.map((route) => (
        <Route key={route} id={getIdFromApiEndpoint(route)} />
      ))}
    </>
  );
}

export default RouteCarousel;

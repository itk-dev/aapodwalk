import { React, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../util/useFetch";
import RouteContext from "../../context/RouteContext";
import PointsList from "../points/PointsList";

function RoutePage() {
  const { id } = useParams();
  const { selectedRoute, setSelectedRoute } = useContext(RouteContext);
  const [dataFetched, setDataFetched] = useState(false);
  function isRouteAlreadySet() {
    return selectedRoute === null && dataFetched;
  }

  // If the selected route is null (if the user enters with a link) we fetch the route with the id from the url
  const { data: fetchedRoute } = useFetch(isRouteAlreadySet() ? null : `routes/${id}`);

  useEffect(() => {
    if (fetchedRoute) {
      setSelectedRoute(fetchedRoute);
      setDataFetched(true);
    }
  }, [fetchedRoute, setSelectedRoute]);

  if (selectedRoute === null) return null;

  return <PointsList points={selectedRoute.pointsOfInterest} />;
}

export default RoutePage;

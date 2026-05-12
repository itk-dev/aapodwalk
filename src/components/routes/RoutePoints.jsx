import { React, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../util/useFetch";
import RouteContext from "../../context/RouteContext";
import PointsList from "../points/PointsList";
import { useDeviceOrientationAutoPermission } from "../points/DirectionArrow";

function RoutePoints() {
  const { id } = useParams();
  const { selectedRoute, setSelectedRoute, setListOfUnlocked, setActivePointId } = useContext(RouteContext);
  const [dataFetched, setDataFetched] = useState(false);
  useDeviceOrientationAutoPermission();

  // Close any previously open POI player whenever the user (re-)enters the
  // POI list. Without this, clicking a POI → leaving the route → returning
  // would re-open the same POI overlay because activePointId persists in
  // App-level RouteContext, and the autoplay-on-mount effect would fire
  // again. Each visit to /points/:id should start with no POI active.
  useEffect(() => {
    if (setActivePointId) setActivePointId(null);
  }, [setActivePointId]);
  function isRouteAlreadySet() {
    return selectedRoute === null && dataFetched;
  }

  useEffect(() => {
    const experiencesFromLocalStorage = localStorage.getItem(`unlocked-experiences-${id}`);
    if (experiencesFromLocalStorage) {
      // add to existing unlocked steps
      setListOfUnlocked(JSON.parse(experiencesFromLocalStorage));
    }
  }, []);

  // If the selected route is null (if the user enters with a link) we fetch the route with the id from the url
  const { data: fetchedRoute } = useFetch(isRouteAlreadySet() ? null : `routes/${id}`);

  useEffect(() => {
    if (fetchedRoute) {
      setSelectedRoute(fetchedRoute);
      setDataFetched(true);
    }
  }, [fetchedRoute, setSelectedRoute]);

  if (selectedRoute === null) return null;

  return <PointsList points={selectedRoute.points} />;
}

export default RoutePoints;

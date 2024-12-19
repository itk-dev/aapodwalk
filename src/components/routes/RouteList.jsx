import { React, useEffect, useState, useContext } from "react";
import useFetch from "../../util/useFetch";
import Route from "./Route";
import SelectedTagContext from "../../context/SelectedTagContext";
import RoutesLoading from "./RoutesLoading";
import { sortByProximity, routesFilteredByTag } from "../../util/helper";
import LatLongContext from "../../context/latitude-longitude-context";
import ErrorContext from "../../context/MessageContext";

function RouteList() {
  const { selectedTag } = useContext(SelectedTagContext);
  const { setErrorText, setError } = useContext(ErrorContext);
  const { lat, long } = useContext(LatLongContext);
  const { data, error, loading } = useFetch("routes");
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (data) {
      let filteredData = [];
      if (selectedTag === null) {
        filteredData = sortByProximity(data["hydra:member"], lat, long);
      } else {
        filteredData = routesFilteredByTag(data["hydra:member"], selectedTag);
      }
      setRoutes(filteredData);
    }
  }, [data, selectedTag]);

  useEffect(() => {
    if (error) {
      setError(true);
      setErrorText("Der skete en fejl da ruterne skulle hentes. Prøv at genindlæs siden.");
    }
  }, [error]);

  if (loading) return <RoutesLoading />;
  if (error) return null;
  if (routes.length === 0) return <div className="mt-10">Der er desværre ikke nogle ruter</div>;

  return (
    <div className="mt-10">
      {routes.map((route) => (
        <Route route={route} key={route.id} />
      ))}
    </div>
  );
}

export default RouteList;

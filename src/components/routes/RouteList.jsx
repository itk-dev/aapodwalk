import { React, useMemo, useContext } from "react";
import SelectedTagContext from "../../context/SelectedTagContext";
import { sortByProximity, routesFilteredByTag } from "../../util/helper";
import LatLongContext from "../../context/latitude-longitude-context";
import Route from "./Route";

function RouteList({ routes: rawRoutes, error, loading }) {
  const { selectedTag } = useContext(SelectedTagContext);
  const { lat, long } = useContext(LatLongContext);

  const routes = useMemo(() => {
    if (!rawRoutes || rawRoutes.length === 0) return [];
    return selectedTag === null
      ? sortByProximity(rawRoutes, lat, long)
      : routesFilteredByTag(rawRoutes, selectedTag);
  }, [rawRoutes, selectedTag, lat, long]);

  if (loading || error) return null;
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

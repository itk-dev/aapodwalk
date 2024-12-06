import { React, useEffect, useState, useContext } from "react";
import useFetch from "../../util/useFetch";
import Route from "./Route";
import SelectedTagContext from "../../context/SelectedTagContext";

const RouteList = () => {
  const { selectedTag } = useContext(SelectedTagContext);
  const { data } = useFetch(`routes`);
  const [routes, setRoutes] = useState([]);

  function isATagSelected(tags) {
    return tags.filter(({ id }) => id === selectedTag).length > 0;
  }

  useEffect(() => {
    if (data) {
      if (selectedTag === null) {
        // Todo do the stuff with routes in close proximity
        setRoutes(data["hydra:member"]);
      } else {
        const filteredData = data["hydra:member"].filter(function ({ tags }) {
          return isATagSelected(tags);
        });
        setRoutes(filteredData);
      }
    }
  }, [data, selectedTag]);

  if (routes.length === 0) return null;

  return (
    <div className="mt-10">
      {routes.map((route) => (
        <Route route={route} key={route.id} />
      ))}
    </div>
  );
};

export default RouteList;

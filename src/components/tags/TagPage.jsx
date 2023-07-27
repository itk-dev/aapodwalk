import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../util/useFetch";
import SelectedRoute from "../routes/SelectedRoute";
import {
  getIdFromApiEndpoint,
  getIdsFromApiEndpoints,
} from "../../util/helper";
import RouteCarousel from "../routes/RouteCarousel";

// A tag page displays routes connected to the tag-id
function TagPage() {
  const { id } = useParams();
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const { data: selectedRouteData } = useFetch(`routes/${selectedRouteId}`);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const { data } = useFetch(`tags/${id}`);
  const [displayedRoutes, setDisplayedRoutes] = useState(null);
  const [hideMapOverlay, setHideMapOverlay] = useState(false);
  const [idArray, setIdArray] = useState(null);

  useEffect(() => {
    if (data) {
      setDisplayedRoutes(data.routes);
      setSelectedRouteId(getIdFromApiEndpoint(data.routes[0]));
    }
  }, [data]);

  useEffect(() => {
    if (selectedRouteData) {
      setSelectedRoute(selectedRouteData);
    }
  }, [selectedRouteData]);

  const onCarouselChange = (newId) => {
    setSelectedRouteId(idArray[newId]);
  };

  useEffect(() => {
    if (displayedRoutes) {
      setIdArray(getIdsFromApiEndpoints(displayedRoutes));
    }
  }, [displayedRoutes]);

  if (selectedRoute === null) return null;

  return (
    <>
      <SelectedRoute
        displayedRoutes={displayedRoutes}
        onCarouselChange={onCarouselChange}
        selectedRoute={selectedRoute}
        hideMapOverlay={hideMapOverlay}
      />
      <RouteCarousel
        routes={displayedRoutes}
        onCarouselChange={onCarouselChange}
        hideMapOverlay={hideMapOverlay}
        setHideMapOverlay={setHideMapOverlay}
        selectedRoute={selectedRoute}
      />
    </>
  );
}
export default TagPage;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../util/useFetch";
import SelectedRoute from "../routes/SelectedRoute";
import RouteCarousel from "../routes/RouteCarousel";
import {
  getIdFromApiEndpoint,
  getIdsFromApiEndpoints,
} from "../../util/helper";

function TagPage() {
  const { id } = useParams();
  const [displayedRoutes, setDisplayedRoutes] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [idArray, setIdArray] = useState(null);
  const { data } = useFetch(`tags/${id}`);

  useEffect(() => {
    if (displayedRoutes) {
      setIdArray(getIdsFromApiEndpoints(displayedRoutes));
    }
  }, [displayedRoutes]);

  useEffect(() => {
    if (data) {
      setDisplayedRoutes(data.routes);
      setSelectedRouteId(getIdFromApiEndpoint(data.routes[0]));
    }
  }, [data]);

  const onCarouselChange = (carouselIndex) => {
    const selectedId = idArray[carouselIndex];
    setSelectedRouteId(selectedId);
  };

  if (selectedRouteId === null) return null;

  return (
    <>
      <SelectedRoute id={selectedRouteId} />
      <RouteCarousel
        routes={displayedRoutes}
        onCarouselChange={onCarouselChange}
      />
    </>
  );
}
export default TagPage;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../util/useFetch";
import SelectedRoute from "../routes/SelectedRoute";
import {
  getIdFromApiEndpoint,
  getIdsFromApiEndpoints,
} from "../../util/helper";
import RouteCarousel from "../routes/RouteCarousel";
import { ReactComponent as IconCirclePlay } from "../../icons/circle-play-solid.svg";
import { ReactComponent as IconMap } from "../../icons/map-solid.svg";

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
      {/* <div className="absolute bottom-6 left-6 md:left-auto right-6 flex flex-col gap-3">
        <div id="buttons" className="flex gap-3 justify-end">
          <button
            className="p-2 rounded text-zinc-100 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-100 drop-shadow"
            type="button"
            // TODO: Change onClick to toggle map layer
            // onClick={() => setSource(podcast)}
          >
            <IconMap className="w-6 h-6" />
            <span className="sr-only">Vis kortet</span>
          </button>
          <button
            className="p-2 rounded text-zinc-100 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-100 drop-shadow"
            type="button"
            // TODO: Change onClick to go to selected route
            // onClick={() => setSource(podcast)}
          >
            <IconCirclePlay className="w-6 h-6" />
            <span className="sr-only">Afspil</span>
          </button>
        </div>
        <RouteCarousel
          routes={displayedRoutes}
          onCarouselChange={onCarouselChange}
        />
      </div> */}
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

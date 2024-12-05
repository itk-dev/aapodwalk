import { React } from "react";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import Route from "./Route";
import { getIdFromApiEndpoint } from "../../util/helper";
import IconMap from "../../icons/map-solid.svg?url";
import IconCirclePlay from "../../icons/circle-play-solid.svg?url";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

function RouteCarousel({ routes, onCarouselChange, hideMapOverlay, setHideMapOverlay, selectedRoute }) {
  return (
    <>
      {!hideMapOverlay && (
        <div className="absolute flex justify-end items-end h-56 left-0 bottom-0 right-0 rounded-lg overflow-hidden w-full">
          <button aria-label="Afspil" type="button" className="h-10 mr-3 mb-5 mt-5 p-2 rounded bg-white drop-shadow">
            <Link to={selectedRoute && `/route/${selectedRoute.id}`}>
              <img src={IconCirclePlay} className="w-6 h-6" alt={`Link to ${selectedRoute.name}`} />
            </Link>
          </button>
          <button
            aria-label="Åben/luk kortvisning"
            onClick={() => setHideMapOverlay(!hideMapOverlay)}
            type="button"
            className="h-10 mr-5 mb-5 mt-5 p-2 rounded bg-white drop-shadow"
          >
            <img src={IconMap} className="w-6 h-6" alt="" />
          </button>
          <Carousel
            className="absolute left-0 bottom-0 right-0 m-5 rounded-lg overflow-hidden max-h-96 md:max-w-lg"
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            autoplay
            infiniteLoop
            showArrows
            swipeable
            useKeyboardArrows
            emulateTouch
            onChange={(index) => onCarouselChange(index)}
          >
            {routes.map((route) => {
              const id = getIdFromApiEndpoint(route);
              return <Route key={id} id={id} />;
            })}
          </Carousel>
        </div>
      )}
      {hideMapOverlay && (
        <button
          aria-label="Åben/luk kortvisning"
          onClick={() => setHideMapOverlay(!hideMapOverlay)}
          type="button"
          className="h-10 absolute bottom-5 right-5 p-2 rounded text-zinc-100 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-100 drop-shadow"
        >
          <img src={IconMap} className="w-6 h-6" alt="" />
        </button>
      )}
    </>
  );
}

export default RouteCarousel;

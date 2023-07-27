import { React, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import Route from "./Route";
import { getIdFromApiEndpoint } from "../../util/helper";
import { ReactComponent as IconCirclePlay } from "../../icons/circle-play-solid.svg";
import { ReactComponent as IconMap } from "../../icons/map-solid.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

function RouteCarousel({
  routes,
  onCarouselChange,
  hideMapOverlay,
  setHideMapOverlay,
  selectedRoute,
}) {
  return (
    <>
      {!hideMapOverlay && (
        <div className="absolute flex justify-end h-56 left-0 bottom-0 right-0 rounded-lg overflow-hidden w-full">
          <button
            type="button"
            className="h-10 mr-3 mt-5 p-2 rounded text-zinc-100 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-100 drop-shadow"
          >
            <Link
              className=""
              to={selectedRoute && `/route/${selectedRoute.id}`}
            >
              <IconCirclePlay className="w-6 h-6" />
            </Link>
          </button>
          <button
            onClick={() => setHideMapOverlay(!hideMapOverlay)}
            type="button"
            className="h-10 mr-5 mt-5 p-2 rounded text-zinc-100 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-100 drop-shadow"
          >
            <IconMap className="w-6 h-6" />
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
          onClick={() => setHideMapOverlay(!hideMapOverlay)}
          type="button"
          className="h-10 absolute bottom-5 right-5 p-2 rounded text-zinc-100 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-100 drop-shadow"
        >
          <IconMap className="w-6 h-6" />
        </button>
      )}
    </>
  );
}

export default RouteCarousel;

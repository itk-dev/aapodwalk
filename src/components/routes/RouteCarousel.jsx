import { React, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import Route from "./Route";
import { getIdFromApiEndpoint } from "../../util/helper";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

function RouteCarousel({
  routes,
  onCarouselChange,
  hideMapOverlay,
  setHideMapOverlay,
  selectedRoute,
}) {
  return (
    <div className="absolute flex justify-end h-40 left-0 bottom-0 right-0 rounded-lg overflow-hidden w-full">
      <button
        onClick={() => setHideMapOverlay(!hideMapOverlay)}
        type="button"
        className=" bg-black p-2 h-10 mr-5 rounded"
      >
        {hideMapOverlay && "Hide map"}
        {!hideMapOverlay && "Show map"}
      </button>
      {!hideMapOverlay && (
        <>
          <button type="button" className="bg-black p-2 h-10 mr-5 rounded">
            <Link
              className=""
              to={selectedRoute && `/route/${selectedRoute.id}`}
            >
              Select Route
            </Link>
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
        </>
      )}
    </div>
  );
}

export default RouteCarousel;

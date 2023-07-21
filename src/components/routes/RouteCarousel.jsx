import { React } from "react";
import { Carousel } from "react-responsive-carousel";
import Route from "./Route";
import { getIdFromApiEndpoint } from "../../util/helper";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

function RouteCarousel({ routes, onCarouselChange }) {
  return (
    <Carousel
      className="absolute left-0 bottom-0 right-0 m-5 rounded-lg overflow-hidden max-h-96 md:max-w-lg"
      showThumbs={false}
      showStatus={false}
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
  );
}

export default RouteCarousel;

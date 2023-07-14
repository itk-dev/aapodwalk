import { React } from "react";
import { Carousel } from "react-responsive-carousel";
import Route from "./Route";
import { getIdFromApiEndpoint } from "../../util/helper";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

function RouteCarousel({ routes, onCarouselChange }) {
  return (
    <Carousel
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
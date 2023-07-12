import { React } from "react";
import { Carousel } from "react-responsive-carousel";
import Route from "./Route";
import { getIdFromApiEndpoint } from "../../util/helper";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

function RouteCarousel({ routes }) {
  return (
    <Carousel
      showThumbs={false}
      showStatus={false}
      autoplay
      infiniteLoop
      showArrows
      swipeable
      // onChange={(index) => setSelectedExperienceHandler(index)}
    >
      {routes.map((route) => (
        <Route key={route} id={getIdFromApiEndpoint(route)} />
      ))}
    </Carousel>
  );
}

export default RouteCarousel;

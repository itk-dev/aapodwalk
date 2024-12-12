import { React, useState, useContext } from "react";
import LocationArrow from "../../icons/location-arrow.svg?url";
import LatLongContext from "../../context/latitude-longitude-context";

function OrientationArrow() {
  const [orientation, setOrientation] = useState(null);
  const { heading } = useContext(LatLongContext);

  // if (!orientation) return null;

  return (
    <div className="flex justify-between">
      <span className="w-1/2">
        <div className="inline w-10">
          {heading}
          {/* <img
            src={LocationArrow}
            style={{
              transform: `rotate(${-rotation}deg)`,
            }}
            alt=""
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
          /> */}
        </div>
      </span>
    </div>
  );
}

export default OrientationArrow;

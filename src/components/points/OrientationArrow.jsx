import { React, useState, useContext, useEffect } from "react";
import LocationArrow from "../../icons/location-arrow.svg?url";
import LatLongContext from "../../context/latitude-longitude-context";
import { isDeviceIOS } from "../../util/helper";

function OrientationArrow() {
  const [orientation, setOrientation] = useState("ikke sat");
  const { heading } = useContext(LatLongContext);

  function deviceOrientationHandler(e) {
    console.log(e);
    navigator.geolocation.getCurrentPosition(locationHandler);
    setTimeout(() => {
      const orientaionValue = e.webkitCompassHeading || Math.abs(e.alpha - 360);
      console.log(orientaionValue);
      setOrientation(orientaionValue);
    }, 3000);
  }

  function startWaypointer() {
    if (isDeviceIOS) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", deviceOrientationHandler, true);
          }
        })
        .catch();
    }
  }

  useEffect(() => {
    if (!isDeviceIOS) {
      window.addEventListener("deviceorientationabsolute", deviceOrientationHandler, true);
    }
    startWaypointer();
  }, []);

  return (
    <div className="flex justify-between">
      <span className="w-1/2">
        <div className="inline w-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
            {orientation}
          </div>
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

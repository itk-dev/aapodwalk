import { React, useState, useContext, useEffect } from "react";
import LocationArrow from "../../icons/location-arrow.svg?url";
import { isDeviceIOS } from "../../util/helper";
import RouteContext from "../../context/RouteContext";

const OrientationArrow = ({ id }) => {
  const [orientation, setOrientation] = useState(null);
  const { nextUnlockablePointId } = useContext(RouteContext);
  const isIOS = isDeviceIOS;

  function deviceOrientationHandler(e) {
    navigator.geolocation.getCurrentPosition(locationHandler);
    setTimeout(() => {
      const orientaionValue = e.webkitCompassHeading || Math.abs(e.alpha - 360);
      setOrientation(orientaionValue);
    }, 3000);
  }

  useEffect(() => {
    if (id === nextUnlockablePointId) {
      startWaypointer();
    }
  }, [nextUnlockablePointId, id]);

  function startWaypointer() {
    if (isIOS) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", deviceOrientationHandler, true);
          }
        })
        .catch();
    } else {
      window.addEventListener("deviceorientationabsolute", deviceOrientationHandler, true);
    }
  }

  if (!orientation) return null;

  return (
    <div className="flex justify-between">
      <span className="w-1/2">
        <div className="inline w-10">
          <img
            src={LocationArrow}
            style={{
              transform: `rotate(${-rotation}deg)`,
            }}
            alt=""
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
          />
        </div>
      </span>
    </div>
  );
};

export default OrientationArrow;

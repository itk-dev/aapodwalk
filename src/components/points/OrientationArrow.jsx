import { React, useState, useEffect } from "react";
import LocationArrow from "../../icons/location-arrow.svg?url";
import { getAngleFromLocationToDestination, isDeviceIOS } from "../../util/helper";

function OrientationArrow(destinationLatitude, destinationLongitude) {
  const [orientation, setOrientation] = useState("ikke sat");
  const [angle, setAngle] = useState(null);
  const [rotation, setRotation] = useState(0);

  function locationHandler(pos) {
    setTimeout(() => {
      setAngle(
        getAngleFromLocationToDestination(
          pos.coords.latitude,
          pos.coords.longitude,
          destinationLatitude,
          destinationLongitude
        )
      );
    }, 3000);
  }

  function deviceOrientationHandler(e) {
    navigator.geolocation.getCurrentPosition(locationHandler);
    setTimeout(() => {
      const orientaionValue = e.webkitCompassHeading || Math.abs(e.alpha - 360);
      setOrientation(orientaionValue);
    }, 30000);
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
    if (orientation && angle) {
      setRotation(orientation - angle);
    }
  }, [orientation, angle]);

  useEffect(() => {
    if (!isDeviceIOS) {
      window.addEventListener("deviceorientationabsolute", deviceOrientationHandler, true);
    }
    startWaypointer();
  }, []);

  return (
    <img
      src={LocationArrow}
      style={{
        transform: `rotate(${-rotation}deg)`,
      }}
      alt=""
      className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    />
  );
}

export default OrientationArrow;

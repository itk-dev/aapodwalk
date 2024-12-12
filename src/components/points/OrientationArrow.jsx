import { React, useState, useEffect, useContext } from "react";
import LocationArrow from "../../icons/location-arrow.svg?url";
import { getAngleFromLocationToDestination, isDeviceIOS } from "../../util/helper";
import LatLongContext from "../../context/latitude-longitude-context";

function OrientationArrow({ destinationLatitude, destinationLongitude }) {
  const [orientation, setOrientation] = useState("ikke sat");
  const { lat, long } = useContext(LatLongContext);
  const [angle, setAngle] = useState(null);
  const [rotation, setRotation] = useState(0);

  function startAngleHandler() {
    setTimeout(() => {
      setAngle(getAngleFromLocationToDestination(lat, long, destinationLatitude, destinationLongitude));
    }, 3000);
  }

  function deviceOrientationHandler(e) {
    startAngleHandler();
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
    <>
      <div>agnle: {angle}</div>
      <div>rot: {rotation}</div>
      <div>ori:{orientation}</div>
      <img
        src={LocationArrow}
        style={{
          transform: `rotate(${-rotation}deg)`,
        }}
        alt=""
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}

export default OrientationArrow;

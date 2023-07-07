import { useContext, useEffect, useState } from "react";
import LatLongContext from "../context/latitude-longitude-context";
import PermissionContext from "../context/permission-context";
import { getDistanceBetweenCoordinates } from "../util/helper";

function Info() {
  const { lat, long } = useContext(LatLongContext);
  const { geolocationAvailable } = useContext(PermissionContext);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (lat !== null && long !== null) {
      // todoo
      // eslint-disable-next-line no-shadow
      const distance = getDistanceBetweenCoordinates(
        lat,
        long,
        56.153574116526194,
        10.21435188437761
      );
      setDistance(distance);
    }
  }, [lat, long]);

  return (
    <div className="text-white">
      <h1 className="text-pink-800 text-5xl">Info</h1>
      <br />
      <p>geolocation available: {geolocationAvailable === "granted"}</p>
      <p>lat: {lat}</p>
      <p>long: {long}</p>

      <br />
      <p>Afstand fra DOKK1</p>
      <p>{distance} Meter</p>
    </div>
  );
}
export default Info;

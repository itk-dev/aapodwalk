import { useContext, useEffect, useState } from "react";
import LatLongContext from "../context/latitude-longitude-context";
import PermissionContext from "../context/permission-context";
import { getDistanceBetweenCoordinates } from "../util/helper";

function Info() {
  const { lat, long } = useContext(LatLongContext);
  const { userAllowedAccessToGeoLocation } = useContext(PermissionContext);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (lat !== null && long !== null) {
      const localDistance = getDistanceBetweenCoordinates(
        userAllowedAccessToGeoLocation,
        lat,
        long,
        56.153574116526194, // Todo, as of now this is hardcoded to the center of Aarhus, this is perhaps not a good solution in the long run.
        10.21435188437761,
      );
      setDistance(localDistance);
    }
  }, [lat]);

  return (
    <div className="text-white">
      <h1 className="text-pink-800 text-5xl">Info</h1>
      <br />
      <p>geolocation available: {userAllowedAccessToGeoLocation}</p>
      <p>lat: {lat}</p>
      <p>long: {long}</p>

      <br />
      <p>Afstand fra DOKK1</p>
      <p>{distance} Meter</p>
    </div>
  );
}
export default Info;

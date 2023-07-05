import { React, useState, useEffect, useContext } from "react";
import useFetch from "../../util/useFetch";
import LatLongContext from "../../context/latitude-longitude-context";
import { getDistanceBetweenCoordinates } from "../../util/helper";
import ApiEndpointContext from "../../context/api-endpoint-context";
import PermissionContext from "../../context/permission-context";

function PointOfInterest({ id }) {
  const [pointOfInterest, setPointOfInterest] = useState(null);
  const { data } = useFetch(`point_of_interests/${id}`);
  const { lat, long } = useContext(LatLongContext);
  const { fileUrl } = useContext(ApiEndpointContext);

  const [proximity, setProximity] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const { geolocationAvailable } = useContext(PermissionContext);

  useEffect(() => {
    if (pointOfInterest && lat && long && geolocationAvailable === "granted") {
      const distance = getDistanceBetweenCoordinates(
        lat,
        long,
        pointOfInterest.latitude,
        pointOfInterest.longitude
      );
      setProximity(distance);
      setUnlocked(distance < 50); // todo magic number
    }
  }, [pointOfInterest, lat, long, geolocationAvailable]);

  function isExperienceIdInLocalstorage() {
    const currentLocalStorage = localStorage.getItem("unlocked-experiences");
    if (currentLocalStorage) {
      const updateLocalStorage = JSON.parse(currentLocalStorage);
      if (updateLocalStorage.includes(id)) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (isExperienceIdInLocalstorage()) {
      return;
    }
    if (unlocked) {
      const currentLocalStorage = localStorage.getItem("unlocked-experiences");
      if (currentLocalStorage) {
        // add to existing unlocked steps
        const updateLocalStorage = JSON.parse(currentLocalStorage);

        updateLocalStorage.push(id);
        localStorage.setItem(
          "unlocked-experiences",
          JSON.stringify(updateLocalStorage)
        );
      } else {
        // add new "unlocked steps"
        localStorage.setItem("unlocked-experiences", JSON.stringify([id]));
      }
    }
  }, [unlocked]);

  useEffect(() => {
    if (isExperienceIdInLocalstorage()) {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setPointOfInterest(data);
    }
  }, [data]);

  if (pointOfInterest === null) return null;

  return (
    <>
      <h2>{pointOfInterest.name}</h2>
      <img src={`${fileUrl}${pointOfInterest.image}`} alt="" />
      <div>
        <label htmlFor="distance">
          afstand
          <div id="distance">{proximity} m</div>
        </label>
      </div>
      {unlocked && <div>kan tilgås</div>}
      {!unlocked && <div>kan ikke tilgås</div>}
    </>
  );
}

export default PointOfInterest;

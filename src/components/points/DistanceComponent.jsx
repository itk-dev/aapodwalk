import { React, useMemo, useContext, useEffect } from "react";
import { getDistanceBetweenCoordinates } from "../../util/helper";
import LatLongContext from "../../context/latitude-longitude-context";
import RouteContext from "../../context/RouteContext";

function DistanceComponent({ id, latitude, longitude, classes, proximityToUnlock }) {
  const { listOfUnlocked, setListOfUnlocked, nextUnlockablePointId, selectedRoute } = useContext(RouteContext);
  const { lat, long } = useContext(LatLongContext);
  const distance = useMemo(
    () => getDistanceBetweenCoordinates(true, lat, long, latitude, longitude),
    [lat, long, latitude, longitude],
  );

  useEffect(() => {
    if (!listOfUnlocked.includes(id) && proximityToUnlock !== null) {
      const unlock = proximityToUnlock > distance && nextUnlockablePointId === id;
      if (unlock) {
        unlockThisPoint(id);
      }
    }
  }, [id, listOfUnlocked, nextUnlockablePointId, proximityToUnlock, distance]);

  function unlockThisPoint(id) {
    setListOfUnlocked([...listOfUnlocked, ...[id]]);
    const storageKey = `unlocked-experiences-${selectedRoute?.id}`;
    const currentLocalStorage = localStorage.getItem(storageKey);
    if (currentLocalStorage) {
      // add to existing unlocked steps
      const updateLocalStorage = JSON.parse(currentLocalStorage);

      if (!updateLocalStorage.includes(id)) {
        updateLocalStorage.push(id);
        localStorage.setItem(storageKey, JSON.stringify(updateLocalStorage));
      }
    } else {
      // add new "unlocked steps"
      localStorage.setItem(storageKey, JSON.stringify([id]));
    }
  }

  return <div className={classes}>{distance} m</div>;
}

export default DistanceComponent;

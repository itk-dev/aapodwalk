import { React, useMemo, useContext, useEffect } from "react";
import { getDistanceBetweenCoordinates } from "../../util/helper";
import LatLongContext from "../../context/latitude-longitude-context";
import RouteContext from "../../context/RouteContext";

function DistanceComponent({ data: { id = null, latitude, longitude, proximityToUnlock = null }, classes }) {
  const { listOfUnlocked, setListOfUnlocked, nextUnlockablePointId, selectedRoute } = useContext(RouteContext);
  const { lat, long } = useContext(LatLongContext);
  const distance = useMemo(
    () => getDistanceBetweenCoordinates(lat, long, latitude, longitude),
    [lat, long, latitude, longitude],
  );
  function unlockThisPoint() {
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

  useEffect(() => {
    if (!listOfUnlocked.includes(id) && proximityToUnlock !== null) {
      const unlock = proximityToUnlock > distance && nextUnlockablePointId === id;
      if (unlock) {
        unlockThisPoint();
      }
    }
  }, [id, listOfUnlocked, nextUnlockablePointId, proximityToUnlock, distance]);

  // Format distance: show "0 m" for falsy/zero values,
  // convert to km with one decimal when >= 1000 m, otherwise show meters.
  const formattedDistance =
    distance === false || distance === 0
      ? "0 m"
      : distance >= 1000
        ? `${(distance / 1000).toFixed(1)} km`
        : `${distance} m`;

  return (
    <div className={`${classes} text-emerald-400 dark:text-emerald-600 font-bold text-sm`}>
      <span className="sr-only">Der er </span>
      {formattedDistance} <span className="sr-only"> til denne</span>
    </div>
  );
}

export default DistanceComponent;

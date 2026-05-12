import { React, useContext, useEffect } from "react";
import RouteContext from "../../context/RouteContext";
import Point from "./Point";

function PointsList({ points }) {
  const { listOfUnlocked, setNextUnlockablePointId, activePointId } = useContext(RouteContext);

  function getIdFromPoint(point) {
    return point?.id || null;
  }

  function getNextPointToUnlock(id) {
    return points[listOfUnlocked.indexOf(id) + 1];
  }

  useEffect(() => {
    if (points) {
      // The first is the next to unlock
      setNextUnlockablePointId(getIdFromPoint(points[0]));

      for (const { id } of points) {
        if (listOfUnlocked.includes(id)) {
          setNextUnlockablePointId(getIdFromPoint(getNextPointToUnlock(id)));
        }
      }
    }
  }, [listOfUnlocked, points, setNextUnlockablePointId]);

  return (
    // When the player bar is open at the bottom, the last POI gets hidden
    // behind it. Reserve room equal to the bar's height (5rem) + safe-area
    // inset so the user can scroll the last card fully into view.
    <div className={activePointId ? "pb-[calc(5rem+env(safe-area-inset-bottom))]" : ""}>
      {points &&
        [...points]
          .reverse()
          .map((point, index) => <Point point={point} key={point.id} order={points.length - index} />)}
      {!points && <div>Der er desværre ikke nogle punkter på denne rute</div>}
    </div>
  );
}

export default PointsList;

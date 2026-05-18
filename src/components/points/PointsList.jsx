import { React, useContext, useEffect } from "react";
import RouteContext from "../../context/RouteContext";
import Point from "./Point";

function PointsList({ points }) {
  const { listOfUnlocked, setNextUnlockablePointId, activePointId } = useContext(RouteContext);

  useEffect(() => {
    if (!points) return;
    // The next POI to unlock is always the first one in route order that
    // hasn't been unlocked yet. Walking `points` (not `listOfUnlocked`)
    // guarantees we follow the route's order even if listOfUnlocked is in
    // a different order or contains stale IDs from a previously visited
    // route — otherwise an index-based lookup against listOfUnlocked can
    // shift and skip the next POI.
    const nextPoint = points.find(({ id }) => !listOfUnlocked.includes(id));
    setNextUnlockablePointId(nextPoint ? nextPoint.id : null);
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

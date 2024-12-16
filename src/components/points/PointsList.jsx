import { React, useContext, useEffect } from "react";
import Point from "./Point";
import RouteContext from "../../context/RouteContext";

function PointsList({ points }) {
  const { listOfUnlocked, setNextUnlockablePointId, selectedRoute } = useContext(RouteContext);

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

  function isThisLastPointInList(index) {
    return index + 1 !== points.length;
  }

  return (
    <>
      <h1 className="text-ms font-bol fixed w-full top-16 pb-2 bg-zinc-100 dark:bg-zinc-800 z-40">
        {selectedRoute.title}
      </h1>
      {points &&
        [...points]
          .reverse()
          .map((point, index) => (
            <Point
              point={point}
              scrollIntoView={isThisLastPointInList(index)}
              key={point.id}
              order={points.length - index}
            />
          ))}
      {!points && <div>Der er desværre ikke nogle punkter på denne rute</div>}
    </>
  );
}

export default PointsList;

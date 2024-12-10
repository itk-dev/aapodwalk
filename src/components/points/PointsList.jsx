import { React, useContext, useEffect } from "react";
import Point from "./Point";
import RouteContext from "../../context/RouteContext";

const PointsList = ({ points }) => {
  const { listOfUnlocked, setNextUnlockablePointId, selectedRoute } = useContext(RouteContext);

  function getIdFromPoint(point) {
    return point?.id || null;
  }

  function getNextPointToUnlock(id) {
    return points[listOfUnlocked.indexOf(id) + 1];
  }

  useEffect(() => {
    // The first is the next to unlock
    setNextUnlockablePointId(getIdFromPoint(points[0]));

    for (const { id } of points) {
      if (listOfUnlocked.includes(id)) {
        setNextUnlockablePointId(getIdFromPoint(getNextPointToUnlock(id)));
      }
    }
  }, [listOfUnlocked, points, setNextUnlockablePointId]);
  
  return (
    <>
      <h1 className="text-ms font-bold mb-2">{selectedRoute.title}</h1>
      {[...points].reverse().map((point, index) => (
        <Point point={point} key={point.id} order={points.length - index} />
      ))}
    </>
  );
};

export default PointsList;

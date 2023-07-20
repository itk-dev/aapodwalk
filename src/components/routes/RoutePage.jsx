import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../util/useFetch";
import PointOfInterest from "../points-of-interest/PointOfInterest";

function RoutePage() {
  const { id } = useParams();
  const { data } = useFetch(`routes/${id}`);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState(null);

  useEffect(() => {
    if (data) {
      setSelectedRoute(data);
      setPointsOfInterest(data.pointsOfInterest["hydra:member"]);
    }
  }, [data]);

  if (selectedRoute === null) return null;
  return (
    <>
      <h1>{selectedRoute.name}</h1>
      {pointsOfInterest &&
        pointsOfInterest
          .toReversed()
          .map((pointOfInterest) => (
            <PointOfInterest
              pointOfInterest={pointOfInterest}
              key={pointOfInterest.id}
            />
          ))}
    </>
  );
}

export default RoutePage;

import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../util/useFetch";
import { getIdFromApiEndpoint } from "../../util/helper";
import PointOfInterest from "../points-of-interest/PointOfInterest";

function RoutePage() {
  const { id } = useParams();
  const { data } = useFetch(`routes/${id}`);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    if (data) {
      setSelectedRoute(data);
    }
  }, [data]);

  if (selectedRoute === null) return null;

  return (
    <>
      <h1>{selectedRoute.name}</h1>
      {selectedRoute.pointsOfInterest.toReversed().map((pointOfInterest) => (
        <PointOfInterest
          key={pointOfInterest}
          id={getIdFromApiEndpoint(pointOfInterest)}
        />
      ))}
    </>
  );
}

export default RoutePage;

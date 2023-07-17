import { React, useEffect, useState } from "react";
import MapWrapper from "../map/MapWrapper";
import { getFeaturesForMap } from "../../util/helper";

function SelectedRoute({ selectedRoute }) {
  const [featuresForMap, setFeaturesForMap] = useState(null);

  useEffect(() => {
    if (selectedRoute) {
      setFeaturesForMap(
        getFeaturesForMap(selectedRoute.pointsOfInterest["hydra:member"])
      );
    }
  }, [selectedRoute]);

  if (selectedRoute === null || featuresForMap === null) return null;

  return (
    <>
      <MapWrapper mapData={featuresForMap} goToView={featuresForMap[0]} />
      <h1>{selectedRoute.name}</h1>
      <div>
        <label htmlFor="distance">
          Distance
          <div id="distance">{selectedRoute.distance}</div>
        </label>
        <label htmlFor="poi">
          Dele
          <div id="poi">{selectedRoute.pointsOfInterest.length}</div>
        </label>
        {/* todo skeleton screen (I think I recall tailwind having these ootb) or some wait indication */}
        {/* todo how to sum up podcasts */}
        <label htmlFor="length">
          Afspilningstid
          {/* todo */}
          <div id="length" />
        </label>
      </div>
    </>
  );
}

export default SelectedRoute;

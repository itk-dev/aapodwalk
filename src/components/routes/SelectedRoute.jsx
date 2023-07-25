import { React, useEffect, useState } from "react";
import MapWrapper from "../map/MapWrapper";
import { getFeaturesForMap } from "../../util/helper";
import BackButton from "../BackButton";

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
      <BackButton>Kategorier</BackButton>
      <div className="relative ml-2">
        <h1 className="text-4xl font-bold mt-10 mb-5">{selectedRoute.name}</h1>
        <div className="info-box bg-zinc-100 dark:bg-zinc-700 rounded p-3 w-32">
          <label htmlFor="distance" className="mb-5">
            <span className="text-xs">Distance</span>
            <div id="distance" className="text-lg">
              {selectedRoute.distance}
            </div>
          </label>
          <label htmlFor="poi" className="mb-5">
            <span className="text-xs">Dele</span>
            <div id="poi" className="text-lg">
              {selectedRoute.pointsOfInterest.length}
            </div>
          </label>
          {/* todo skeleton screen (I think I recall tailwind having these ootb) or some wait indication */}
          {/* todo how to sum up podcasts */}
          <label htmlFor="length">
            <span className="text-xs">Afspilningstid</span>
            {/* todo */}
            <div id="length" className="text-lg" />
          </label>
        </div>
      </div>
    </>
  );
}

export default SelectedRoute;

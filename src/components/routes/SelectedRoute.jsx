import { React, useEffect, useState } from "react";
import MapWrapper from "../map/MapWrapper";
import BackButton from "../BackButton";

function SelectedRoute({ selectedRoute, hideMapOverlay }) {
  const [featuresForMap, setFeaturesForMap] = useState(null);

  useEffect(() => {
    if (selectedRoute) {
      setFeaturesForMap(selectedRoute.pointsOfInterest["hydra:member"]);
    }
  }, [selectedRoute]);

  if (selectedRoute === null || featuresForMap === null) return null;

  return (
    <>
      <MapWrapper
        mapData={featuresForMap}
        goToView={selectedRoute}
        hideMapOverlay={hideMapOverlay}
      />
      <BackButton>Kategorier</BackButton>
      {!hideMapOverlay && (
        <div className="flex flex-col ml-2">
          {/* TODO: show the real category instead of "Valgt kategory" */}
          <div className="flex mt-10 text-sm font-bold text-emerald-800 dark:text-emerald-400 drop-shadow">
            Valgt kategori
          </div>
          <div className="flex">
            <h1 className="text-4xl font-bold mb-5 drop-shadow">
              {selectedRoute.name}
            </h1>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-700 rounded p-3 w-32 drop-shadow">
            <label htmlFor="distance" className="block mb-2">
              <p className="text-xs">Distance</p>
              <p className="font-bold">{selectedRoute.distance}</p>
            </label>
            <label htmlFor="poi" className="block mb-2">
              <p className="text-xs">Afsnit</p>
              <p className="font-bold">{selectedRoute.partcount}</p>
            </label>
            {/* todo skeleton screen (I think I recall tailwind having these ootb) or some wait indication. https://tailwindcss.com/docs/animation#pulse */}
            {/* todo how to sum up podcasts */}
            <label htmlFor="length" className="block">
              <p className="text-xs">Afspilningstid</p>
              <p className="font-bold">{selectedRoute.totalduration} min</p>
            </label>
          </div>
        </div>
      )}
    </>
  );
}

export default SelectedRoute;

import { React, useEffect, useState } from "react";
import MapWrapper from "../map/MapWrapper";
import { getFeaturesForMap } from "../../util/helper";
import BackButton from "../BackButton";

function SelectedRoute({ selectedRoute, hideMapOverlay }) {
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
      <MapWrapper
        mapData={featuresForMap}
        goToView={selectedRoute}
        hideMapOverlay={hideMapOverlay}
      />
      <BackButton>Kategorier</BackButton>
      {!hideMapOverlay && (
        <div className="relative ml-2">
          {/* TODO: show the real category instead of "Valgt kategory" */}
          <p className="mt-10 text-sm font-bold text-emerald-800 dark:text-emerald-400 drop-shadow">
            Valgt kategori
          </p>
          <h1 className="text-4xl font-bold mb-5 drop-shadow">
            {selectedRoute.name}
          </h1>
          <div
            id="info-box"
            className="bg-zinc-100 dark:bg-zinc-700 rounded p-3 w-32 drop-shadow"
          >
            <label htmlFor="distance" className="block mb-5">
              <b>Distance</b>
              <br /> {selectedRoute.distance}
            </label>
            <label htmlFor="poi" className="block mb-2">
              <b>Afsnit</b> <br /> {selectedRoute.partcount}
            </label>
            {/* todo skeleton screen (I think I recall tailwind having these ootb) or some wait indication. https://tailwindcss.com/docs/animation#pulse */}
            {/* todo how to sum up podcasts */}
            <label htmlFor="length" className="block">
              <b>Afspilningstid</b> <br /> {selectedRoute.totalduration} min
            </label>
          </div>
        </div>
      )}
    </>
  );
}

export default SelectedRoute;

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
          <label htmlFor="distance" className="mb-5">
            <span className="text-xs">Distance</span>
            <div id="distance" className="text-lg">
              {selectedRoute.distance}
            </div>
          </label>
          <label htmlFor="poi" className="mb-5">
            <span className="text-xs">Afsnit</span>
            <div id="poi" className="text-lg">
              {selectedRoute.pointsOfInterest.length}
            </div>
          </label>
          {/* todo skeleton screen (I think I recall tailwind having these ootb) or some wait indication. https://tailwindcss.com/docs/animation#pulse */}
          {/* todo how to sum up podcasts */}
          <label htmlFor="length">
            <span className="text-xs">Afspilningstid</span>
            {/* todo */}
            <div id="length" className="text-lg" />
          </label>
        </div>
      </div>
      {!hideMapOverlay && (
        <div className="relative ml-2">
          <h1 className="text-4xl font-bold mt-10 mb-5">
            {selectedRoute.name}
          </h1>
          <div className="info-box bg-zinc-100 dark:bg-zinc-700 rounded p-3 w-32">
            <label htmlFor="distance" className="block mb-1">
              <span className="text-xs">
                <b>Distance</b>
                <br /> {selectedRoute.distance}
              </span>
              {/* <div id="distance" className="text-lg">
              
            </div> */}
            </label>
            <label htmlFor="poi" className="block mb-1">
              <span className="text-xs">
                <b>Dele</b> <br /> {selectedRoute.partcount}
              </span>
              <div id="poi" className="text-lg">
                {selectedRoute.pointsOfInterest.length}
              </div>
            </label>
            {/* todo skeleton screen (I think I recall tailwind having these ootb) or some wait indication */}
            {/* todo how to sum up podcasts */}
            <label htmlFor="length" className="block">
              <span className="text-xs">
                <b>Afspilningstid</b> <br /> {selectedRoute.totalduration} min
              </span>
              {/* todo */}
              <div id="length" className="text-lg" />
            </label>
          </div>
        </div>
      )}
    </>
  );
}

export default SelectedRoute;

import { React, useEffect, useState } from "react";
import MapWrapper from "../map/MapWrapper";
import { getFeaturesForMap } from "../../util/helper";
import BackButton from "../BackButton";
import { ReactComponent as IconCirclePlay } from "../../icons/circle-play-solid.svg";
import { ReactComponent as IconMap } from "../../icons/map-solid.svg";

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

  console.log(selectedRoute)

  return (
    <>
      <MapWrapper mapData={featuresForMap} goToView={featuresForMap[0]} />
      <BackButton>Kategorier</BackButton>
      <div className="relative ml-2">
        {/* TODO: show the real category instead of "Valgt kategory" */}
        <p className="mt-10 text-sm font-bold text-emerald-800 dark:text-emerald-400 drop-shadow">Valgt kategori</p>
        <h1 className="text-4xl font-bold mb-5 drop-shadow">{selectedRoute.name}</h1>
        <div id="info-box" className="bg-zinc-100 dark:bg-zinc-700 rounded p-3 w-32 drop-shadow">
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
        <div id="buttons" className="relative mt-5 flex gap-3">
          <button
            className="p-2 rounded text-zinc-100 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-100 drop-shadow"
            type="button"
            // TODO: Change onClick to go to selected route
            //onClick={() => setSource(podcast)}
            >
            <IconCirclePlay className="w-6 h-6" />
            <span className="sr-only">Afspil</span>
          </button>
          <button
            className="p-2 rounded text-zinc-100 dark:text-zinc-800 bg-zinc-800 dark:bg-zinc-100 drop-shadow"
            type="button"
            // TODO: Change onClick to toggle map layer
            //onClick={() => setSource(podcast)}
            >
            <IconMap className="w-6 h-6" />
            <span className="sr-only">Vis kortet</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default SelectedRoute;

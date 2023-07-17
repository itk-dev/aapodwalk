import { React, useEffect, useState } from "react";
import MapWrapper from "../map/MapWrapper";
import PointOfInterestFetcher from "../points-of-interest/PointOfInterestFetcher";
import {
  getIdFromApiEndpoint,
  uniqueArrayById,
  getFeaturesForMap,
} from "../../util/helper";

function SelectedRoute({ selectedRoute }) {
  const [featuresForMap, setFeaturesForMap] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);

  useEffect(() => {
    if (selectedRoute) {
      setFeaturesForMap(getFeaturesForMap(pointsOfInterest));
    }
  }, [pointsOfInterest]);

  const latLongCallBack = (lat, long, poiId, name) => {
    const pointOfInterstIds = selectedRoute.pointsOfInterest.map((e) =>
      getIdFromApiEndpoint(e)
    );
    const copyPointsOfInterest = [...pointsOfInterest].filter((poi) =>
      pointOfInterstIds.includes(poi.id)
    );
    copyPointsOfInterest.push({ id: poiId, lat, long, name });
    setPointsOfInterest(uniqueArrayById(copyPointsOfInterest));
  };

  if (selectedRoute === null || featuresForMap === null) return null;

  return (
    <>
      <MapWrapper mapData={featuresForMap} goToView={selectedRoute} />
      {selectedRoute.pointsOfInterest &&
        selectedRoute.pointsOfInterest.length > 0 &&
        selectedRoute.pointsOfInterest.map((pointOfInterestRoute) => (
          <PointOfInterestFetcher
            latLongCallBack={latLongCallBack}
            key={pointOfInterestRoute}
            id={getIdFromApiEndpoint(pointOfInterestRoute)}
          />
        ))}
      <h1>{selectedRoute.name}</h1>
      <div>
        <label htmlFor="distance">
          Distance
          <div id="distance">{selectedRoute.distance}</div>
        </label>
        {selectedRoute.pointsOfInterest &&
          selectedRoute.pointsOfInterest.length > 0 && (
            <label htmlFor="poi">
              Dele
              <div id="poi">{selectedRoute.pointsOfInterest.length}</div>
            </label>
          )}
        {/* todo skeleton screen (I think I recall tailwind having these ootb) or some wait indication */}
        {/* todo how to sum up podcasts */}
        <label htmlFor="length">
          Afspilningstid
          <div id="length">{selectedRoute.pointsOfInterest.length}</div>
        </label>
      </div>
    </>
  );
}

export default SelectedRoute;

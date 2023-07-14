import { React, useEffect, useState, useContext } from "react";
import useFetch from "../../util/useFetch";
import MapWrapper from "../map/MapWrapper";
import ApiEndpointContext from "../../context/api-endpoint-context";
import PointOfInterestFetcher from "../points-of-interest/PointOfInterestFetcher";
import {
  getIdFromApiEndpoint,
  uniqueArrayById,
  getFeaturesForMap,
} from "../../util/helper";

function SelectedRoute({ id }) {
  const { data } = useFetch(`routes/${id}`);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [featuresForMap, setFeaturesForMap] = useState([]);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);

  useEffect(() => {
    if (data) {
      setSelectedRoute(data);
      setPointsOfInterest([]);
    }
  }, [data]);

  useEffect(() => {
    if (pointsOfInterest.length > 0) {
      setFeaturesForMap(getFeaturesForMap(pointsOfInterest));
    }
  }, [pointsOfInterest]);

  const { mapUsername, mapPassword } = useContext(ApiEndpointContext);

  const latLongCallBack = (lat, long, poiId, name) => {
    const copyPointsOfInterest = [...pointsOfInterest];
    copyPointsOfInterest.push({ id: poiId, lat, long, name });
    setPointsOfInterest(uniqueArrayById(copyPointsOfInterest));
  };
  if (selectedRoute === null) return null;
  return (
    <>
      <MapWrapper
        config={{
          df_map_username: mapUsername,
          df_map_password: mapPassword,
        }}
        mapData={featuresForMap}
        goToView={selectedRoute}
      />

      {selectedRoute.pointsOfInterest.map((POI) => (
        <PointOfInterestFetcher
          latLongCallBack={latLongCallBack}
          key={POI}
          id={getIdFromApiEndpoint(POI)}
        />
      ))}
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
          <div id="length">{selectedRoute.pointsOfInterest.length}</div>
        </label>
      </div>
    </>
  );
}

export default SelectedRoute;

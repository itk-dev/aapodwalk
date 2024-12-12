import { React, useContext } from "react";
import { useParams } from "react-router-dom";
import LatLongContext from "../context/latitude-longitude-context";
import MapWrapper from "./map/MapWrapper";

function SeeOnMap() {
  const { latitude, longitude } = useParams();
  const { lat, long } = useContext(LatLongContext);

  return (
    <>
      {latitude && longitude && lat && long && (
        <MapWrapper
          focusable={false}
          withIndex={false}
          additionalClass="h-screen"
          mapData={[
            { latitude, longitude }, // Point
            { latitude: lat, longitude: long }, // Where I am
          ]}
        />
      )}
    </>
  );
}

export default SeeOnMap;

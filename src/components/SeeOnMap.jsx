import { React } from "react";
import { useParams } from "react-router-dom";
import MapWrapper from "./map/MapWrapper";

function SeeOnMap() {
  const { latitude, longitude } = useParams();

  return (
    <>
      {latitude && longitude && (
        <MapWrapper
          focusable={false}
          withIndex={false}
          additionalClass="h-screen"
          mapData={[
            { latitude, longitude }, // Point
          ]}
        />
      )}
    </>
  );
}

export default SeeOnMap;

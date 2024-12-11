import { useState, useContext } from "react";
import Map from "./Map";
import PermissionContext from "../../context/permission-context";
import "./map-wrapper.css";
import CloseButton from "../CloseButton";

function MapWrapper({ mapData }) {
  const [focusOnMap, setFocusOnMap] = useState(false);
  const { openStreetMapConsent } = useContext(PermissionContext);

  if (!openStreetMapConsent) return null;

  return (
    <>
      <button
        type="button"
        className={
          focusOnMap
            ? "map-container absolute left-0 top-0 right-0 z-50 h-screen"
            : "map-container absolute left-0 top-0 right-0 z-0"
        }
        onClick={() => setFocusOnMap(true)}
      >
        {focusOnMap && <Map zoomControl={true} mapData={mapData} />}
        {!focusOnMap && <Map zoomControl={false} additionalClass="opacity-10" mapData={mapData} />}
      </button>
      {focusOnMap && <CloseButton closeOverlay={() => setFocusOnMap(false)} label="luk kortvising" />}
    </>
  );
}
export default MapWrapper;

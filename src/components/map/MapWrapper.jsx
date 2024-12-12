import { useState, useContext } from "react";
import Map from "./Map";
import PermissionContext from "../../context/permission-context";
import "./map-wrapper.css";
import CloseButton from "../CloseButton";

function MapWrapper({ mapData, additionalClass = "", focusable, withIndex }) {
  const [focusOnMap, setFocusOnMap] = useState(!focusable || false);
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
        {focusOnMap && <Map withIndex={withIndex} zoomControl mapData={mapData} />}
        {!focusOnMap && focusable && (
          <Map withIndex={withIndex} zoomControl={false} additionalClass={additionalClass} mapData={mapData} />
        )}
      </button>
      {focusOnMap && focusable && (
        <CloseButton
          additionalClasses="dark:bg-emerald-800 dark:text-white bg-white"
          closeOverlay={() => setFocusOnMap(false)}
          label="luk kortvising"
        />
      )}
    </>
  );
}
export default MapWrapper;

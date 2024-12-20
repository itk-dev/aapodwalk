import { useState, useContext } from "react";
import MapComponent from "./MapComponent";
import PermissionContext from "../../context/permission-context";
import CloseButton from "../CloseButton";
import { FocusTrap } from "focus-trap-react";
import "./map-wrapper.css";

function MapWrapper({ mapData, additionalClass = "", focusable, withIndex }) {
  const [focusOnMap, setFocusOnMap] = useState(!focusable || false);
  const { openStreetMapConsent } = useContext(PermissionContext);
  if (!openStreetMapConsent) return null;

  return (
    <>
      {focusOnMap && focusable && (
        <FocusTrap>
          <div className="map-container absolute left-0 top-0 right-0 h-full">
            <CloseButton
              additionalClasses="dark:bg-emerald-800 dark:text-white bg-white z-50"
              closeOverlay={() => setFocusOnMap(false)}
              label="luk kortvising"
            />
            <MapComponent focusOnMap={focusOnMap} withIndex={withIndex} mapData={mapData} additionalClass="z-40" />
          </div>
        </FocusTrap>
      )}
      {focusOnMap && !focusable && (
        <div className="map-container absolute left-0 top-0 right-0 h-full">
          <MapComponent focusOnMap={focusOnMap} withIndex={withIndex} mapData={mapData} additionalClass="z-40" />
        </div>
      )}
      {!focusOnMap && (
        <button type="button" onClick={() => setFocusOnMap(true)}>
          {!focusOnMap && focusable && (
            <div
              className={
                focusOnMap
                  ? "map-container absolute left-0 top-0 right-0 h-full"
                  : "map-container absolute left-0 top-0 right-0"
              }
              // I wish to hide the map from tabbing order for everyone. But this seems impossible. So now I am hiding
              // it from screen users. (This is the map for presentation, not the map for navigation)
              aria-hidden={true}
            >
              <MapComponent
                focusOnMap={focusOnMap}
                withIndex={withIndex}
                additionalClass={`${additionalClass}`}
                mapData={mapData}
              />
            </div>
          )}
          <span className="sr-only">Åben kortvisning</span>
        </button>
      )}
    </>
  );
}
export default MapWrapper;

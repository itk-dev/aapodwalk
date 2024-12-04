import { useState, useContext } from "react";
import Xmark from "../../icons/xmark-solid.svg?url";
import Map from "./Map";
import "./map-wrapper.css";
import PermissionContext from "../../context/permission-context";

function MapWrapper({ mapData }) {
  const [focusOnMap, setFocusOnMap] = useState(false);
  const { openStreetMapConsent } = useContext(PermissionContext);

  if (!openStreetMapConsent) return null;

  return (
    <>
      <div
        className={
          focusOnMap
            ? "map-container absolute left-0 top-0 right-0 z-50 m-0 h-screen"
            : "map-container absolute left-0 top-0 right-0 z-0 "
        }
        onClick={() => setFocusOnMap(true)}
      >
        {focusOnMap && <Map zoomControl={true} mapData={mapData}></Map>}
        {!focusOnMap && <Map zoomControl={false} additionalClass="opacity-55" mapData={mapData}></Map>}
      </div>
      {focusOnMap && (
        <button
          className=" flex place-content-center dark:bg-zinc-800 dark:text-white text-sm absolute right-0 top-0 z-50 w-9 h-9 bg-white"
          type="button"
          onClick={() => setFocusOnMap(false)}
        >
          <img src={Xmark} alt="" className="z-50 w-9 h-9" />
          <span class="sr-only">Luk kortvisning</span>
        </button>
      )}
    </>
  );
}
export default MapWrapper;

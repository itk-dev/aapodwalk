import { useState, useContext } from "react";
import Xmark from "../../icons/xmark-solid.svg?url";
import Map from "./Map";
import PermissionContext from "../../context/permission-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./map-wrapper.css";

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
      {focusOnMap && (
        <button
          className="flex place-content-center items-center dark:bg-emerald-800 dark:text-white text-sm absolute right-3 rounded-full top-3 z-50 w-9 h-9 bg-white"
          type="button"
          onClick={() => setFocusOnMap(false)}
        >
          <FontAwesomeIcon className="z-50 w-5 h-5" icon={faClose} />
          <span class="sr-only">Luk kortvisning</span>
        </button>
      )}
    </>
  );
}
export default MapWrapper;

import { MapContainer, TileLayer } from "react-leaflet";
import { useContext, useEffect, useState } from "react";
import LatLongContext from "../../context/latitude-longitude-context";
import { getIndexedPinSvg, getPinSvg, mapArrayForOuterBounds, getYouAreHerePin } from "../../util/helper";
import MapMarker from "./MapMarker";
import "leaflet/dist/leaflet.css";
import "./map-wrapper.css";

function MapComponent({ mapData, additionalClass = "", withIndex, focusOnMap }) {
  const { lat, long } = useContext(LatLongContext);
  const [outerBounds, setOuterBounds] = useState(null);
  function getLabelForPin(index) {
    return index + 1;
  }

  useEffect(() => {
    if (mapData.length > -1 && lat && long) {
      setOuterBounds(mapArrayForOuterBounds(mapData, lat, long));
    }
  }, [mapData, lat, long]);

  if (outerBounds === null) return null;

  return (
    <MapContainer
      dragging={focusOnMap}
      doubleClickZoom={focusOnMap}
      scrollWheelZoom={focusOnMap}
      attributionControl={focusOnMap}
      zoomControl={focusOnMap}
      bounds={outerBounds}
      className={`${additionalClass} rounded ${focusOnMap ? "" : "pointer-events-none"}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mapData.map(({ latitude, longitude }, index) => (
        <MapMarker
          key={latitude}
          latitude={latitude}
          longitude={longitude}
          iconHtml={withIndex ? getIndexedPinSvg(getLabelForPin(index)) : getPinSvg()}
        />
      ))}
      {lat && long && <MapMarker latitude={lat} longitude={long} iconHtml={getYouAreHerePin()} />}
    </MapContainer>
  );
}
export default MapComponent;

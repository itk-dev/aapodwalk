import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map-wrapper.css";
import { useContext } from "react";
import LatLongContext from "../../context/latitude-longitude-context";
import YouAreHere from "../../icons/you-are-here-icon.svg?raw";
import { getIndexedPinSvg, getPinSvg } from "../../util/helper";

function Map({ mapData, zoomControl, additionalClass = "", withIndex }) {
  const { lat, long } = useContext(LatLongContext);

  function getLabelForPin(index) {
    return index + 1;
  }

  return (
    <MapContainer
      center={[56.15355732197891, 10.213148468411132]} // Aarhus <3
      zoom={14}
      className={`${additionalClass} rounded`}
      zoomControl={zoomControl}
      scrollWheelZoom={zoomControl}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mapData.map(({ latitude, longitude }, index) => (
        <Marker
          key={latitude}
          position={[latitude, longitude]}
          icon={L.divIcon({
            html: withIndex ? getIndexedPinSvg(getLabelForPin(index)) : getPinSvg(),
            // The empty string classname below seems like something to remove, but if I remove it, a little square
            // appears in the map... Not sure why
            className: "",
            iconSize: [24, 24], // If icon size is changed, it should equally be changed in the map-wrapper.css
            iconAnchor: [24, 24], // 24 centers it, 24 makes the pointy end point on the right coordinates
          })}
        />
      ))}
      {lat && long && (
        <Marker
          key="me"
          icon={L.divIcon({
            html: YouAreHere,
            // The empty string classname below seems like something to remove, but if I remove it, a little square
            // appears in the map... Not sure why
            className: "",
            iconSize: [24, 24], // If icon size is changed, it should equally be changed in the map-wrapper.css
            iconAnchor: [24, 24], // 24 centers it, 24 makes the pointy end point on the right coordinates
          })}
          position={[lat, long]}
        />
      )}
    </MapContainer>
  );
}
export default Map;

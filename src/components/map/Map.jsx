import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map-wrapper.css";

function Map({ mapData, zoomControl, additionalClass = "" }) {
  return (
    <MapContainer
      center={[56.15355732197891, 10.213148468411132]} // Aarhus <3
      zoom={14}
      className={additionalClass}
      zoomControl={zoomControl}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mapData.map(({ latitude, longitude }, index) => (
        <Marker
          key={index}
          position={[latitude, longitude]}
          icon={L.divIcon({
            html: `
              <div class="pin">
                <span>${index}</span>
              </div>
            `,
            // The empty string classname below seems like something to remove, but if I remove it, a little square
            // appears in the map... Not sure why
            className: "",
            iconSize: [24, 24], // If icon size is changed, it should equally be changed in the map-wrapper.css
            iconAnchor: [12, 24], // 12 centers it, 24 makes the pointy end point on the right coordinates
          })}
        />
      ))}
    </MapContainer>
  );
}
export default Map;

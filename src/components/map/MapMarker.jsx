import { Marker } from "react-leaflet";
import L from "leaflet";

const MapMarker = ({ iconHtml, latitude, longitude }) => {
  return (
    <Marker
      key={latitude}
      position={[latitude, longitude]}
      icon={L.divIcon({
        html: iconHtml,
        // The empty string classname below seems like something to remove, but if I remove it, a little square
        // appears in the map... Not sure why
        className: "",
        iconSize: [24, 24], // If icon size is changed, it should equally be changed in the map-wrapper.css
        iconAnchor: [24, 24], // 24 centers it, 24 makes the pointy end point on the right coordinates
      })}
    />
  );
};

export default MapMarker;

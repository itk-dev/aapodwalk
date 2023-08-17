import React, { useState, useEffect, useRef, useContext } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import VectorSource from "ol/source/Vector";
import TileWMS from "ol/source/TileWMS";
import Projection from "ol/proj/Projection";
import Proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { latlngToUTM } from "../../util/helper";
import ApiEndpointContext from "../../context/api-endpoint-context";
import "./map-wrapper.css";

function MapWrapper({ mapData, goToView, hideMapOverlay }) {
  const { mapUsername, mapPassword } = useContext(ApiEndpointContext);
  const [map, setMap] = useState();
  const [vectorLayer, setVectorLayer] = useState(null);
  const mapElement = useRef();
  const dkprojection = new Projection({
    // Projection settings for Denmark
    code: "EPSG:25832",
    extent: [-1877994.66, 3638086.74, 3473041.38, 9494203.2],
  });
  const northingInitial =
    mapData.length > 0 ? mapData[0].northing : 574969.6851;
  const eastingInitial = mapData.length > 0 ? mapData[0].easting : 6223950.2116;
  const view = new View({
    center: [northingInitial, eastingInitial],
    resolutions: [
      1638.4, 819.2, 409.6, 204.8, 102.4, 51.2, 25.6, 12.8, 6.4, 3.2, 1.6, 0.8,
      0.4, 0.2, 0.1,
    ],
    projection: dkprojection,
  });

  const layers = [
    new TileLayer({
      // Map tiles
      title: "WMS skærmkort (DAF)",
      type: "base",
      visible: true,
      source: new TileWMS({
        url: `https://services.datafordeler.dk/Dkskaermkort/topo_skaermkort/1.0.0/wms?username=${mapUsername}&password=${mapPassword}`,
        params: {
          LAYERS: "dtk_skaermkort",
          VERSION: "1.1.1",
          TRANSPARENT: "FALSE",
          FORMAT: "image/png",
          STYLES: "",
        },
        attributions:
          '<p>Kort fra <a href="https://datafordeler.dk" target="_blank">Datafordeleren</a>.',
      }),
    }),
  ];

  useEffect(() => {
    if (goToView && map) {
      const { centerlatitude, centerlongitude, zoomValue } = goToView;
      const [destinationLat, destinationLong] = latlngToUTM(
        centerlatitude,
        centerlongitude
      );
      map.getView().animate({
        center: [destinationLat, destinationLong],
        zoom: zoomValue,
        rotation: 0,
        duration: 800,
      });
    }
  }, [goToView, map, hideMapOverlay]);

  useEffect(() => {
    if (!mapData) {
      return;
    }

    const firstIconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        scale: 1.2,
        // Todo change icon
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAlCAMAAACEemK6AAABXFBMVEUAAAAAgP8AZv8AgP8Abf8AYP8Acf8XdP8Vav8Udv8Lb/8KcP8PbP8Pcf8Ocf8Mbv8Lb/8NcP8Nb/8Nbf8Mb/8Mbf8MbvsLbfsPb/sObvsObPwNcPwNbvwMbfwObfwNbvwNbv0Mbv0Ob/0Obf0Mbf0Mbv0Mbv0Obv0Nbv0Nbf0Nbv0Nbv0Mb/0Mbv0Mbf0Obv0Ob/0Obv0Nb/0Nbf0Nbv0Nbv0Nbv0Nbv0Mbv0Mb/1ppv4Nbvwvgv4NbvwNbvwNb/y81/8Nb/2jyf4Nbf0kfP0Nbv0Nbv2PvP45if4Nbv0dd/0Nbv0Nbv0Nbv0Nbv0Nbv0Nbv1SmP4Nbv0Nbv08iv0Nb/0Nbv0Nbv32+f8Rcf3u9f8Mbv281/4Nbv2cxP4Nbv17sP4Nbv0Nbv0Xdf1foP4Nbv0Nbv0Nbv0Nbv07if1Umf5cnf6Nu/6x0P7H3f/t9P/u9f/2+f/4+//////ZrbbCAAAAaHRSTlMABAUGBwgJCwwNFxkhIiQsLjk8PT4/QURFSElQUVRZZGZrbG58fX+Ai4yNjpGSk5SWl5iam5ydoKSmv8PExcfLztLT1NTW2Nna3Nzd3t/l5+jo7O3v8PLz8/T09ff4+Pn5+vv7+/z9/kqOLf8AAAABYktHRHNBCT3OAAABKklEQVQYGW3BhVYCQQAF0CeoWBjYid2Nio2Fiig22IGCz475/3Nk2RlY2LkXSnGbPxC5jwT8rcXI5RqIUYn2u2DRFKFVpBEZ3kfmindB6qSdF2k1t7R7rEVK4QF1wk4APdTrBgqOqHdYgAZmbO3c3J0xox4jVBaF4YPKEFYoLQvTO6UlhCmtCdMXpRCuKV0I0y+la8QoXQnTD6UoNiltCNMnpXXMUtr7E4a/V0o+tFDZ/RFCfL9RaYbjlMrl8cPzE5UTBzBBvXEAFXHqJCqRskCdeRiqk7RLVCFtjnYzMJVFmS9WDqmP+XqhOIPMtV2EjLoXWiU9sPDRahpWJSFm7ZcihydJJVmPPMNUBpHPsUpTwAkb9zkN525otNPQAa0pkpPQKxwLjjqR9Q+OaxIua1fKFgAAAABJRU5ErkJggg==",
      }),
    });
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        scale: 0.7,
        // Todo change icon
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAlCAMAAACEemK6AAABXFBMVEUAAAAAgP8AZv8AgP8Abf8AYP8Acf8XdP8Vav8Udv8Lb/8KcP8PbP8Pcf8Ocf8Mbv8Lb/8NcP8Nb/8Nbf8Mb/8Mbf8MbvsLbfsPb/sObvsObPwNcPwNbvwMbfwObfwNbvwNbv0Mbv0Ob/0Obf0Mbf0Mbv0Mbv0Obv0Nbv0Nbf0Nbv0Nbv0Mb/0Mbv0Mbf0Obv0Ob/0Obv0Nb/0Nbf0Nbv0Nbv0Nbv0Nbv0Mbv0Mb/1ppv4Nbvwvgv4NbvwNbvwNb/y81/8Nb/2jyf4Nbf0kfP0Nbv0Nbv2PvP45if4Nbv0dd/0Nbv0Nbv0Nbv0Nbv0Nbv0Nbv1SmP4Nbv0Nbv08iv0Nb/0Nbv0Nbv32+f8Rcf3u9f8Mbv281/4Nbv2cxP4Nbv17sP4Nbv0Nbv0Xdf1foP4Nbv0Nbv0Nbv0Nbv07if1Umf5cnf6Nu/6x0P7H3f/t9P/u9f/2+f/4+//////ZrbbCAAAAaHRSTlMABAUGBwgJCwwNFxkhIiQsLjk8PT4/QURFSElQUVRZZGZrbG58fX+Ai4yNjpGSk5SWl5iam5ydoKSmv8PExcfLztLT1NTW2Nna3Nzd3t/l5+jo7O3v8PLz8/T09ff4+Pn5+vv7+/z9/kqOLf8AAAABYktHRHNBCT3OAAABKklEQVQYGW3BhVYCQQAF0CeoWBjYid2Nio2Fiig22IGCz475/3Nk2RlY2LkXSnGbPxC5jwT8rcXI5RqIUYn2u2DRFKFVpBEZ3kfmindB6qSdF2k1t7R7rEVK4QF1wk4APdTrBgqOqHdYgAZmbO3c3J0xox4jVBaF4YPKEFYoLQvTO6UlhCmtCdMXpRCuKV0I0y+la8QoXQnTD6UoNiltCNMnpXXMUtr7E4a/V0o+tFDZ/RFCfL9RaYbjlMrl8cPzE5UTBzBBvXEAFXHqJCqRskCdeRiqk7RLVCFtjnYzMJVFmS9WDqmP+XqhOIPMtV2EjLoXWiU9sPDRahpWJSFm7ZcihydJJVmPPMNUBpHPsUpTwAkb9zkN525otNPQAa0pkpPQKxwLjjqR9Q+OaxIua1fKFgAAAABJRU5ErkJggg==",
      }),
    });

    // Define feature array and apply styling
    const features = [];

    mapData.forEach(({ northing, easting, name }, index) => {
      const feature = new Feature({
        geometry: new Point([northing, easting]),
        name,
      });
      if (index === 0) {
        feature.setStyle(firstIconStyle);
      } else {
        feature.setStyle(iconStyle);
      }

      features.push(feature);
    });

    const vLayer = new VectorLayer({
      // Resource features
      name: "Vector",
      source: new VectorSource({
        features,
      }),
    });

    if (map) {
      setVectorLayer(vLayer);
    }
  }, [mapData, map]);

  useEffect(() => {
    // Handles removing old layers and adding new ones
    if (map && vectorLayer) {
      map
        .getLayers()
        .getArray()
        .forEach((value) => {
          // Loop vectorLayers and remove old
          if (value.get("name") === "Vector") {
            map.removeLayer(value);
          }
        });
      map.addLayer(vectorLayer); // Add newly defined vectorLayer
    }
  }, [vectorLayer, map]);

  useEffect(() => {
    if (mapData) {
      // Current map instances
      const mapChildren = mapElement.current.children;

      let mapAlreadyLoaded = false;

      // Check if map is already loaded
      Object.values(mapChildren).forEach((mapChild) => {
        if (mapChild.className.indexOf("ol-viewport") !== -1) {
          mapAlreadyLoaded = true;
        }
      });

      // Return if map is already loaded
      if (mapAlreadyLoaded) {
        return;
      }

      // Proj4 projection definition
      Proj4.defs(
        "EPSG:25832",
        "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
      );

      register(Proj4);

      // Map definition
      const initialMap = new Map({
        layers,
        target: mapElement.current,
        view,
        controls: [],
      });

      // save map and vector layer references to state
      setMap(initialMap);
    }
  }, [mapData]);

  // TODO: Remove zoom and info btn

  return (
    <div className="map-container absolute left-0 top-0 h-screen px-3 pt-12 pb-3 touch-none">
      <div ref={mapElement} className="map rounded-xl overflow-hidden" id="map">
        <div id="tooltip" className="tooltip" />
      </div>
      {!hideMapOverlay && (
        <div className="map-color-overlay absolute left-0 top-0 bottom-0 right-0 w-screen h-screen bg-zinc-400 dark:bg-zinc-800 opacity-70 dark:opacity-80" />
      )}
    </div>
  );
}
export default MapWrapper;

import React, { useEffect, useState, useMemo, useRef, useContext } from "react";
import { Routes, Navigate, Route, useNavigate } from "react-router-dom";
import TagPage from "./components/tags/TagPage";
import LatLongContext from "./context/latitude-longitude-context";
import AudioContext from "./context/audio-context";
import CacheContext from "./context/cache-context";
import PermissionContext from "./context/permission-context";
import Info from "./components/info";
import TagsList from "./components/tags/TagsList";
import RoutePage from "./components/routes/RoutePage";
import ApiEndpointContext from "./context/api-endpoint-context";

// import "./App.css";

function App() {
  const [geolocationAvailable, setGeolocationAvailable] = useState();
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [heading, setHeading] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [source, setSource] = useState(null);
  const [cache, setCache] = useState({});
  const audioRef = useRef();
  const navigate = useNavigate();

  const cacheContext = useMemo(
    () => ({
      setCache,
      cache,
    }),
    [setCache, cache]
  );

  const contextLatLong = useMemo(
    () => ({
      lat,
      long,
      heading,
      speed,
    }),
    [lat, long, heading, speed]
  );

  const audio = useMemo(
    () => ({
      setSource,
    }),
    [setSource]
  );
  const geolocationAvailableContext = useMemo(
    () => ({
      geolocationAvailable,
    }),
    [geolocationAvailable]
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [source]);

  const updateLocation = () => {
    if (lat === null || long === null) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        setHeading(position.coords.heading);
        setSpeed(position.coords.speed);
      });
    }
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        setHeading(position.coords.heading);
        setSpeed(position.coords.speed);
      });
      updateLocation();
    }, 3000);
  };

  const handlePermissions = async () => {
    if (navigator.permissions && navigator.permissions.query) {
      // Not apple
      const permissions = await navigator.permissions.query({
        name: "geolocation",
      });
      const { state } = permissions;
      setGeolocationAvailable(state);
      permissions.onchange = (event) => {
        // todo
        // eslint-disable-next-line no-shadow
        const { state } = event.target;
        setGeolocationAvailable(state);
      };
      if (state === "granted") {
        updateLocation();
      } else if (state === "prompt") {
        updateLocation();
      }
    } else {
      // apple
      updateLocation();
    }
  };

  const requestPermissions = async () => {
    handlePermissions();
  };

  useEffect(() => {
    // todo some sort of spinner or some indication that something is happening
    requestPermissions();
  }, []);

  const { fileUrl } = useContext(ApiEndpointContext);

  return (
    <div className="App">
      <div>
        <button type="button" onClick={() => navigate(-1)}>
          go back
        </button>
      </div>
      <LatLongContext.Provider value={contextLatLong}>
        <CacheContext.Provider value={cacheContext}>
          <AudioContext.Provider value={audio}>
            <PermissionContext.Provider value={geolocationAvailableContext}>
              <Routes>
                <Route path="/" element={<TagsList />} />
                <Route path="tag/:id" element={<TagPage />} />
                <Route path="route/:id" element={<RoutePage />} />
                <Route
                  path="info"
                  element={<Info geolocationAvailable={geolocationAvailable} />}
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </PermissionContext.Provider>
          </AudioContext.Provider>
        </CacheContext.Provider>
      </LatLongContext.Provider>
      {audioRef && source && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio ref={audioRef} controls src={`${fileUrl}${source}`} />
      )}
    </div>
  );
}

export default App;

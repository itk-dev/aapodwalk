import React, { useEffect, useState, useMemo, useRef } from "react";
import { Routes, Navigate, Route, useNavigate } from "react-router-dom";
import TagPage from "./components/tags/TagPage";
import LatLongContext from "./context/latitude-longitude-context";
import AudioContext from "./context/audio-context";
import CacheContext from "./context/cache-context";
import PermissionContext from "./context/permission-context";
import Info from "./components/info";
import TagsList from "./components/tags/TagsList";
import RoutePage from "./components/routes/RoutePage";
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
      // audioRef.current.play();
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
    }, 2000);
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
  return (
    <div className="App">
      <div>
        <button type="button" onClick={() => navigate(-1)}>
          go back
        </button>
      </div>
      <LatLongContext.Provider value={contextLatLong}>
        <CacheContext.Provider value={{ cache, setCache }}>
          <AudioContext.Provider value={audio}>
            <PermissionContext.Provider value={geolocationAvailableContext}>
              <Routes>
                <Route path="/" element={<TagsList />} />
                {/* <Route path="/" element={<ExperienceList />} /> */}
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
      {/* todo */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      {/* {audioRef && source && ( */}
      {/* <div className="fixed bottom-0 left-0 right-0 h-20 flex bg-gray-400">
        <audio className="m-auto" ref={audioRef} controls>
          <source src={source} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div> */}
      {/* )} */}
    </div>
  );
}

export default App;

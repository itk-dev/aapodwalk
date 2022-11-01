import React, { useEffect, useState, useMemo, useRef } from "react";
import { Routes, Navigate, Route } from "react-router-dom";
import ExperienceList from "./components/experience-list";
import ExperiencePage from "./components/experience-page";
import LatLongContext from "./context/latitude-longitude-context";
import AudioContext from "./context/audio-context";
import PermissionContext from "./context/permission-context";
import Info from "./components/info";
import "./App.css";

function App() {
  const [geolocationAvailable, setGeolocationAvailable] = useState();
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [source, setSource] = useState(null);
  const audioRef = useRef();
  const contextLatLong = useMemo(
    () => ({
      lat,
      long,
    }),
    [lat, long]
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
      });
    }
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
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
      } else {
        // eslint-disable-next-line no-console
        console.log(permissions);
        // eslint-disable-next-line no-console
        console.log("Ingen tilladelse");
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
      <LatLongContext.Provider value={contextLatLong}>
        <AudioContext.Provider value={audio}>
          <PermissionContext.Provider value={geolocationAvailableContext}>
            <Routes>
              <Route path="/" element={<ExperienceList />} />
              <Route path="experience/:id" element={<ExperiencePage />} />
              <Route
                path="info"
                element={<Info geolocationAvailable={geolocationAvailable} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </PermissionContext.Provider>
        </AudioContext.Provider>
      </LatLongContext.Provider>
      {/* todo */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      {audioRef && source && (
        <audio className="m-auto" ref={audioRef} controls>
          <source src={source} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default App;

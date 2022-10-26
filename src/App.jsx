import React, { useEffect, useState, useRef } from "react";
import getDistanceBetweenCoordinates from "./util/helper";
import Cards from "./components/cards";
import Experience from "./components/experience";
import "./App.css";

function App() {
  const [view, setView] = useState("Hjem");
  const [geolocationAvailable, setGeolocationAvailable] = useState();
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [source, setSource] = useState(null);
  const [distance, setDistance] = useState(null);
  const [experienceId, setExperienceId] = useState(null);
  const [storedData, setStoredData] = useState(
    localStorage.getItem("datastore") ?? '{"unlocks":{"experiences":{}}}'
  );
  const audioRef = useRef();

  useEffect(() => {
    if (storedData !== "null") {
      localStorage.setItem("datastore", storedData); // Save
    }
  }, [storedData]);

  const changeAudio = (audio) => {
    setSource(audio);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  };
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
    requestPermissions();
  }, []);

  const handleExperienceClick = (expId) => {
    setView("experience");
    setExperienceId(expId);
  };

  useEffect(() => {
    if (lat !== null && long !== null) {
      // todoo
      // eslint-disable-next-line no-shadow
      const distance = getDistanceBetweenCoordinates(
        lat,
        long,
        56.153574116526194,
        10.21435188437761
      );
      setDistance(distance);
    }
  }, [lat, long]);
  return (
    <div className="App">
      {/*       
      <div>
        <button onClick={changeView} className={(view === "Hjem" ? "bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded")}>Hjem</button>
        <button onClick={changeView} className={(view === "Info" ? "bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded")}>Info</button>
        <button onClick={changeView} className={(view === "Lyd" ? "bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded")}>Lyd</button>
        <button onClick={changeView} className={(view === "Kort" ? "bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded")}>Kort</button>
      </div>
      <br /> */}
      {view === "Hjem" && (
        <div>
          <Cards
            lat={lat}
            long={long}
            handleExperienceClick={handleExperienceClick}
          />
        </div>
      )}
      {view === "Info" && (
        <div>
          <h1>
            <b>Hjem</b>
          </h1>
          <p>
            geolocation available:{" "}
            {geolocationAvailable === "granted" ? "true" : "false"}
          </p>
          <p>lat: {lat}</p>
          <p>long: {long}</p>

          <br />
          <p>Afstand fra DOKK1</p>
          <p>{distance} Meter</p>
        </div>
      )}
      {view === "experience" && (
        <div>
          <Experience
            experienceId={experienceId}
            setView={setView}
            lat={lat}
            long={long}
            storedData={storedData}
            setStoredData={setStoredData}
            changeAudio={changeAudio}
            geolocationAvailable={geolocationAvailable}
          />
          {/* <button className={(source === "/lib/journey-roa.mp3" ? `bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50`:`bg-blue-500 text-white font-bold py-2 px-4 rounded`)} data-audio="/lib/journey-roa.mp3" onClick={changeAudio}>Test lyd 1</button> */}
        </div>
      )}
      {view === "Kort" && (
        <h1>
          <b>Kort</b>
        </h1>
      )}

      <div className="audio-player-container flex">
        <div className=" m-auto">
          {/* todo */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio className="m-auto" ref={audioRef} controls>
            <source src={source} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
}

export default App;
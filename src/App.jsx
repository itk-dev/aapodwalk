import React, { useEffect, useState, useMemo } from "react";
import { Routes, Navigate, Route } from "react-router-dom";
import TagPage from "./components/tags/TagPage";
import LatLongContext from "./context/latitude-longitude-context";
import CacheContext from "./context/cache-context";
import PermissionContext from "./context/permission-context";
import Info from "./components/info";
import TagsList from "./components/tags/TagsList";
import RoutePage from "./components/routes/RoutePage";
import PersonalInformationPolicyPage from "./components/PersonalInformationPolicyPage";

function App() {
  const [geolocationAvailable, setGeolocationAvailable] = useState();
  const [openStreetMapConsent, setOpenStreetMapConsent] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [heading, setHeading] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [cache, setCache] = useState({});
  const [hasAllowedGeolocation, setHasAllowedGeolocation] = useState(true);

  const cacheContext = useMemo(
    () => ({
      setCache,
      cache,
    }),
    [setCache, cache],
  );

  const contextLatLong = useMemo(
    () => ({
      lat,
      long,
      heading,
      speed,
    }),
    [lat, long, heading, speed],
  );

  const geolocationAvailableContext = useMemo(
    () => ({
      geolocationAvailable,
    }),
    [geolocationAvailable],
  );

  const updateLocation = () => {
    if (lat === null || long === null) {
      navigator.geolocation.getCurrentPosition((position) => {
        setHasAllowedGeolocation(true);
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        setHeading(position.coords.heading);
        setSpeed(position.coords.speed);
      });
    }
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        setHasAllowedGeolocation(true);
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
        if (event.target.state === "granted") {
          setHasAllowedGeolocation(true);
        }
        if (event.target.state === "denied") {
          setHasAllowedGeolocation(false);
        }
        // todo
        // eslint-disable-next-line no-shadow
        const { state } = event.target;
        setGeolocationAvailable(state);
      };
      if (state === "granted") {
        updateLocation();
        setHasAllowedGeolocation(true);
      } else if (state === "prompt") {
        updateLocation();
        setHasAllowedGeolocation(false);
      } else if (state === "denied") {
        setHasAllowedGeolocation(false);
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

  useEffect(() => {
    const localStorageConsent = localStorage.getItem("data-consent");
    if (localStorageConsent) {
      setOpenStreetMapConsent(localStorageConsent === "true");
    }
  }, []);

  return (
    <>
      {hasAllowedGeolocation && (
        <div className="App h-full min-h-screen w-screen p-3 text-zinc-800 dark:text-white bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <LatLongContext.Provider value={contextLatLong}>
            <CacheContext.Provider value={cacheContext}>
              <PermissionContext.Provider
                value={{
                  geolocationAvailableContext,
                  openStreetMapConsent,
                  setOpenStreetMapConsent,
                }}
              >
                <Routes>
                  <Route path="/" element={<TagsList />} />
                  <Route path="tag/:id" element={<TagPage />} />
                  <Route path="route/:id" element={<RoutePage />} />
                  <Route path="info" element={<Info geolocationAvailable={geolocationAvailable} />} />
                  <Route path="/personal-information-policy" element={<PersonalInformationPolicyPage/>} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </PermissionContext.Provider>
            </CacheContext.Provider>
          </LatLongContext.Provider>
        </div>
      )}
      {!hasAllowedGeolocation && <h1>Geolokation er krævet</h1>}
    </>
  );
}

export default App;

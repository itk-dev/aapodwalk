import React, { useEffect, useState, useMemo } from "react";
import { Switch, Route } from "react-router-dom";
import LatLongContext from "./context/latitude-longitude-context";
import PermissionContext from "./context/permission-context";
import RouteContext from "./context/RouteContext";
import Info from "./components/info";
import FrontPage from "./components/FrontPage";
import RoutePage from "./components/routes/RoutePage";
import RoutePoints from "./components/routes/RoutePoints";
import PersonalInformationPolicyPage from "./components/PersonalInformationPolicyPage";
import Navbar from "./components/Navbar";
import FAQ from "./components/FAQ";

function App() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [listOfUnlocked, setListOfUnlocked] = useState([]);
  const [nextUnlockablePointId, setNextUnlockablePointId] = useState(null);
  const [openStreetMapConsent, setOpenStreetMapConsent] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [userAllowedAccessToGeoLocation, setUserAllowedAccessToGeoLocation] = useState(false);

  const contextLatLong = useMemo(
    () => ({
      lat,
      long,
    }),
    [lat, long]
  );

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
    }, 3000);
  };

  const handlePermissions = async () => {
    if (navigator.permissions?.query) {
      // Not apple
      const permissions = await navigator.permissions.query({
        name: "geolocation",
      });
      const { state } = permissions;
      permissions.onchange = (event) => {
        if (event.target.state === "granted") {
          setUserAllowedAccessToGeoLocation(true);
        }
        if (event.target.state === "denied") {
          setUserAllowedAccessToGeoLocation(false);
        }
      };
      if (state === "granted") {
        updateLocation();
        setUserAllowedAccessToGeoLocation(true);
      } else if (state === "prompt") {
        updateLocation();
        setUserAllowedAccessToGeoLocation(true);
      } else if (state === "denied") {
        setUserAllowedAccessToGeoLocation(false);
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
  }, [userAllowedAccessToGeoLocation]);

  useEffect(() => {
    // Consent for handling data with regards to open street map
    const localStorageConsent = localStorage.getItem("data-consent");
    if (localStorageConsent) {
      setOpenStreetMapConsent(localStorageConsent === "true");
    }
  }, []);

  return (
    <div className="App flex flex-col h-full pt-24 min-h-screen dark:text-white w-screen pl-3 pr-3 pb-3 text-zinc-800 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
      <LatLongContext.Provider value={contextLatLong}>
        <PermissionContext.Provider
          value={{
            userAllowedAccessToGeoLocation,
            openStreetMapConsent,
            setOpenStreetMapConsent,
          }}
        >
          <RouteContext.Provider
            value={{
              selectedRoute,
              setSelectedRoute,
              nextUnlockablePointId,
              setNextUnlockablePointId,
              listOfUnlocked,
              setListOfUnlocked,
            }}
          >
            <Navbar />
            <div className="relative grow overflow-hidden">
              <Switch>
                <Route path="/route/:id">
                  <RoutePage />
                </Route>
                <Route path="/points/:id">
                  <RoutePoints />
                </Route>
                <Route path="/faq">
                  <FAQ />
                </Route>
                <Route path="/personal-information-policy">
                  <PersonalInformationPolicyPage />
                </Route>
                <Route path="/navigation-help">
                  <div>Todo</div>
                </Route>
                <Route path="/info">
                  <Info />
                </Route>
                <Route path="/">
                  <FrontPage />
                </Route>
              </Switch>
            </div>
          </RouteContext.Provider>
        </PermissionContext.Provider>
      </LatLongContext.Provider>
    </div>
  );
}

export default App;

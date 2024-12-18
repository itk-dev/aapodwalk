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
import SkipLinks from "./components/SkipLinks";
import FAQ from "./components/FAQ";
import SeeOnMap from "./components/SeeOnMap";
import MessageContext from "./context/MessageContext";
import { Link } from "react-router-dom";
import NavigationHelp from "./components/NavigationHelp";

function App() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [listOfUnlocked, setListOfUnlocked] = useState([]);
  const [nextUnlockablePointId, setNextUnlockablePointId] = useState(null);
  const [openStreetMapConsent, setOpenStreetMapConsent] = useState(null);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [info, setInfo] = useState(false);
  const [infoText, setInfoText] = useState("");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const locationUpdateInterval = 30000;

  const contextLatLong = useMemo(
    () => ({
      lat,
      long,
    }),
    [lat, long],
  );

  function handlePermissionInfoBanner() {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state !== "granted") {
        setInfo(true);
        setInfoText(
          <span>
            Du har ikke accepteret, at vi må få adgang til din lokation. For at denne applikation skal fungere, skal den
            bruge din lokation. Hvis du vil vide mere om hvordan du giver denne angang, kan du besøge{" "}
            <Link className="underline" to="/navigation-help">
              Hjælp til navigation
            </Link>
          </span>,
        );
      }
    });
  }

  useEffect(() => {
    handlePermissionInfoBanner();
  }, []);

  function startLocationPrompter() {
    setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
    }, locationUpdateInterval);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
    startLocationPrompter();
  }, []);

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
          value={useMemo(() => ({ openStreetMapConsent, setOpenStreetMapConsent }), [openStreetMapConsent])}
        >
          <RouteContext.Provider
            value={useMemo(
              () => ({
                selectedRoute,
                setSelectedRoute,
                nextUnlockablePointId,
                setNextUnlockablePointId,
                listOfUnlocked,
                setListOfUnlocked,
              }),
              [selectedRoute, nextUnlockablePointId, listOfUnlocked],
            )}
          >
            <SkipLinks />
            <Navbar />
            <main id="main" className="relative grow overflow-hidden">
              <a id="main-content" href="/" tabIndex="-1" className="sr-only">
                Hovedindhold
              </a>
              <MessageContext.Provider
                value={useMemo(
                  () => ({
                    error,
                    setError,
                    errorText,
                    setErrorText,
                    info,
                    setInfo,
                    infoText,
                    setInfoText,
                  }),
                  [error, errorText, info, infoText],
                )}
              >
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
                    <NavigationHelp />
                  </Route>
                  <Route path="/info">
                    <Info />
                  </Route>
                  <Route path="/see-on-map/:latitude/:longitude">
                    <SeeOnMap />
                  </Route>
                  <Route path="/">
                    <FrontPage />
                  </Route>
                </Switch>
              </MessageContext.Provider>
            </main>
          </RouteContext.Provider>
        </PermissionContext.Provider>
      </LatLongContext.Provider>
    </div>
  );
}

export default App;

import React, { useEffect, useState, useMemo } from "react";
import { Switch, Route, Link, useLocation } from "react-router-dom";
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
import NavigationHelp from "./components/NavigationHelp";
import MapConsentBanner from "./components/MapConsentBanner";

function App() {
  const { pathname } = useLocation();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [listOfUnlocked, setListOfUnlocked] = useState([]);
  const [nextUnlockablePointId, setNextUnlockablePointId] = useState(null);
  const [activePointId, setActivePointId] = useState(null);
  const [openStreetMapConsent, setOpenStreetMapConsent] = useState(null);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [info, setInfo] = useState(false);
  const [infoText, setInfoText] = useState("");
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const contextLatLong = useMemo(
    () => ({
      lat,
      long,
    }),
    [lat, long],
  );

  const permissionDeniedBanner = (
    <span>
      Du har ikke accepteret, at vi må få adgang til din lokation. For at denne applikation skal fungere, skal den bruge
      din lokation. Hvis du vil vide mere om hvordan du giver denne adgang, kan du besøge{" "}
      <Link className="underline" to="/navigation-help">
        Hjælp til navigation
      </Link>
    </span>
  );

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "denied") {
            setInfo(true);
            setInfoText(permissionDeniedBanner);
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setInfo(false);
        setInfoText("");
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setInfo(true);
          setInfoText(permissionDeniedBanner);
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError(true);
          setErrorText("Din lokation kunne ikke bestemmes.");
        } else if (err.code === err.TIMEOUT) {
          setError(true);
          setErrorText("Forespørgslen om din lokation tog for lang tid.");
        }
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    // Consent for handling data with regards to open street map
    const localStorageConsent = localStorage.getItem("data-consent");
    if (localStorageConsent) {
      setOpenStreetMapConsent(localStorageConsent === "true");
    }
  }, []);

  useEffect(() => {
    if (openStreetMapConsent === null) {
      localStorage.removeItem("data-consent");
    } else {
      localStorage.setItem("data-consent", openStreetMapConsent);
    }
  }, [openStreetMapConsent]);

  // Reset scroll on every route change so the user lands at the top of the new view
  // (back navigation, forward navigation, deep link — useEffect on pathname covers all).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="App md:max-w-4xl ml-auto mr-auto flex flex-col h-full pt-24 min-h-screen dark:text-white w-screen pl-3 pr-3 pb-3 text-zinc-800 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
      <LatLongContext value={contextLatLong}>
        <PermissionContext
          value={useMemo(() => ({ openStreetMapConsent, setOpenStreetMapConsent }), [openStreetMapConsent])}
        >
          <RouteContext
            value={useMemo(
              () => ({
                selectedRoute,
                setSelectedRoute,
                nextUnlockablePointId,
                setNextUnlockablePointId,
                listOfUnlocked,
                setListOfUnlocked,
                activePointId,
                setActivePointId,
              }),
              [selectedRoute, nextUnlockablePointId, listOfUnlocked, activePointId],
            )}
          >
            <SkipLinks />
            <Navbar />
            <main id="main" className="relative grow overflow-hidden">
              <a id="main-content" href="/" tabIndex="-1" className="sr-only">
                Hovedindhold
              </a>
              <MessageContext
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
                <MapConsentBanner />
              </MessageContext>
            </main>
          </RouteContext>
        </PermissionContext>
      </LatLongContext>
    </div>
  );
}

export default App;

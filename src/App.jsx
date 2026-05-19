import React, { useEffect, useLayoutEffect, useState, useMemo } from "react";
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
  // Heading (degrees clockwise from true north), speed (m/s) and accuracy (m)
  // from the GPS — used by DirectionArrow to prefer course-over-ground over the
  // magnetic compass when the user is walking, since the compass is unreliable
  // in urban canyons and near steel/electronics.
  const [gpsHeading, setGpsHeading] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const contextLatLong = useMemo(
    () => ({
      lat,
      long,
      gpsHeading,
      speed,
      accuracy,
    }),
    [lat, long, gpsHeading, speed, accuracy],
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
        // heading is NaN when speed === 0 and null when the platform can't supply it;
        // normalise both to null so consumers can do a single Number.isFinite check.
        setGpsHeading(Number.isFinite(position.coords.heading) ? position.coords.heading : null);
        setSpeed(Number.isFinite(position.coords.speed) ? position.coords.speed : null);
        setAccuracy(Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null);
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

  // Reset scroll on every route change so the user lands at the top of the new view.
  // useLayoutEffect runs before the browser paints, avoiding a flash at the old scroll position.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // The static loader in index.html keeps the screen covered from the very first byte,
  // before the JS bundle has even parsed. Once React has mounted and committed (which
  // includes any in-page loading overlay), we hand off to React and fade out the static
  // loader. A short delay leaves room for the first paint to fully composite on iOS Safari.
  useEffect(() => {
    const hideTimeout = window.setTimeout(() => window.__hideInitialLoader?.(), 100);
    return () => clearTimeout(hideTimeout);
  }, []);

  return (
    <div
      className={`App md:max-w-4xl ml-auto mr-auto flex flex-col h-full ${
        pathname.startsWith("/points/") ? "pt-24" : "pt-16"
      } min-h-dvh dark:text-white w-screen pl-3 pr-3 pb-3 text-zinc-800 bg-zinc-100 dark:bg-zinc-800 overflow-hidden`}
    >
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
                <div key={pathname} className="page-fade-in h-full">
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
                </div>
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

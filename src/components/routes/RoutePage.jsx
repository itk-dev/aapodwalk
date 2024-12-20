import { React, useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import PermissionContext from "../../context/permission-context";
import RouteContext from "../../context/RouteContext";
import useFetch from "../../util/useFetch";
import MapWrapper from "../map/MapWrapper";
import TagList from "../tags/TagList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

function RoutePage() {
  const { id } = useParams();
  const { openStreetMapConsent, setOpenStreetMapConsent } = useContext(PermissionContext);
  const { selectedRoute, setSelectedRoute, setListOfUnlocked } = useContext(RouteContext);
  const [dataFetched, setDataFetched] = useState(false);
  const [focusOnText, setFocusOnText] = useState(false);
  function isRouteAlreadySet() {
    return selectedRoute === null && dataFetched;
  }

  useEffect(() => {
    const experiencesFromLocalStorage = localStorage.getItem(`unlocked-experiences-${id}`);
    if (experiencesFromLocalStorage) {
      // add to existing unlocked steps
      setListOfUnlocked(JSON.parse(experiencesFromLocalStorage));
    }
  }, []);

  // If the selected route is null (if the user enters with a link) we fetch the route with the id from the url
  const { data: fetchedRoute } = useFetch(isRouteAlreadySet() ? null : `routes/${id}`);

  useEffect(() => {
    if (fetchedRoute) {
      setSelectedRoute(fetchedRoute);
      setDataFetched(true);
    }
  }, [fetchedRoute, setSelectedRoute]);

  if (selectedRoute === null) return null;

  function resetPermission() {
    setFocusOnText(false);
    setOpenStreetMapConsent(null);
  }

  const { title, tags, points, totalDuration, distance, description } = selectedRoute;
  const consentText =
    "Du har ikke givet samtykke, derfor kan vi ikke vise et kort her. Vil du ændre det, kan du trykke her.";

  return (
    <>
      <div className="p-5 absolute left-0 top-0 right-0 bottom-0 flex flex-col justify-between">
        <div>
          <TagList classes="relative text-lg" tags={tags} />
          <h1 className="text-4xl font-extrabold relative word-break">{title}</h1>
        </div>
        <div className="flex flex-col items-end">
          {openStreetMapConsent && <div className="w-3/5 mb-10 text-end">Tryk på kortet for at undersøge ruten</div>}

          {!openStreetMapConsent && !focusOnText && (
            <button type="button" onClick={() => setFocusOnText(true)} className="opacity-35 mb-10 text-center">
              {consentText}
            </button>
          )}
          {!openStreetMapConsent && focusOnText && (
            <button type="button" onClick={() => resetPermission()} className="mb-10 text-center">
              {consentText}
            </button>
          )}
          <div className="bg-emerald-400 w-full dark:bg-emerald-800 mb-3 rounded-md p-3 flex relative">
            <div>
              <div className="font-bold">Distance</div>
              <div className="text-xl">{distance}</div>
            </div>
            <div className="ml-6">
              <div className="font-bold">Dele</div>
              <div className="text-xl">{points.length} styk</div>
            </div>
            <div className="ml-6">
              <div className="font-bold">Afspilningstid</div>
              <div className="text-xl">{totalDuration} minutter</div>
            </div>
          </div>
          <div className="relative dark:bg-zinc-800 w-full flex flex-col rounded-lg p-3 mb-3 bg-emerald-400">
            {description}
          </div>
          <Link
            className="flex items-center mr-1 rounded relative px-5 mt-1 h-9 text-center w-max font-bold bg-zinc-200 text-black z-50"
            to={`/points/${id}`}
          >
            <FontAwesomeIcon icon={faPlayCircle} className="mr-1" />
            Start ruten
          </Link>
        </div>
      </div>
      <MapWrapper withIndex focusable additionalClass="opacity-10" mapData={points} />
    </>
  );
}

export default RoutePage;

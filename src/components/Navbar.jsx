import { React, useContext } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { faQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../icons/logo.svg?url";
import RouteContext from "../context/RouteContext";
import BackButton from "./BackButton";
import GpsSignalIndicator from "./GpsSignalIndicator";

const HELP_PATHS = ["/faq", "/navigation-help", "/personal-information-policy"];

const Navbar = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const { selectedRoute } = useContext(RouteContext);
  const isOnRouteNavigation = pathname.startsWith("/points/");
  const showRouteTitle = isOnRouteNavigation && selectedRoute?.title;
  const isHelpRoot = pathname === "/faq";
  const isInHelp = HELP_PATHS.includes(pathname);

  function toggleHelp() {
    if (isHelpRoot) {
      // From the FAQ root, one step back returns to whatever screen the user
      // opened FAQ from. Fall back home if FAQ was a deep-link entry.
      if (history.length > 1) history.goBack();
      else history.replace("/");
    } else if (isInHelp) {
      // On a subpage of help (navigation-help / personal-information-policy),
      // the X means "exit help entirely" — skip past the intermediate /faq
      // entry so a single tap leaves the help context.
      if (history.length > 2) history.go(-2);
      else history.replace("/");
    } else {
      history.push("/faq");
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-3 bg-zinc-100 dark:bg-zinc-800 shadow-md">
      <div className="flex justify-between items-center">
        {pathname === "/" && (
          <Link to="/">
            <span className="sr-only">Hjem</span>
            <img src={Logo} alt="" className="w-10 h-10" />
          </Link>
        )}
        {pathname !== "/" && !isHelpRoot && <BackButton />}
        {isHelpRoot && <span aria-hidden="true" />}
        <button
          type="button"
          onClick={toggleHelp}
          aria-expanded={isInHelp}
          aria-label={isInHelp ? "Luk hjælp og vejledning" : "Åbn hjælp og vejledning"}
          className="flex place-content-center rounded-full text-xl w-9 h-9 bg-emerald-400 dark:bg-black justify-center items-center"
        >
          <FontAwesomeIcon icon={isInHelp ? faXmark : faQuestion} />
        </button>
      </div>
      {showRouteTitle && (
        <div className="relative mt-2">
          <h1 className="text-center text-base font-bold truncate px-14">{selectedRoute.title}</h1>
          {isOnRouteNavigation && <GpsSignalIndicator className="absolute right-0 top-1/2 -translate-y-1/2 w-9" />}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { React, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../icons/logo.svg?url";
import RouteContext from "../context/RouteContext";
import BackButton from "./BackButton";
import GpsSignalIndicator from "./GpsSignalIndicator";

const Navbar = () => {
  const { pathname } = useLocation();
  const { selectedRoute } = useContext(RouteContext);
  const isOnRouteNavigation = pathname.startsWith("/points/");
  const showRouteTitle = isOnRouteNavigation && selectedRoute?.title;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-3 bg-zinc-100 dark:bg-zinc-800 shadow-md">
      <div className="flex justify-between items-center">
        {pathname === "/" && (
          <Link to="/">
            <span className="sr-only">Hjem</span>
            <img src={Logo} alt="" className="w-10 h-10" />
          </Link>
        )}
        {pathname !== "/" && <BackButton />}
        <Link
          className="flex place-content-center rounded-full text-xl w-9 h-9 bg-emerald-400 dark:bg-black justify-center items-center"
          to="/faq"
        >
          <FontAwesomeIcon icon={faQuestion} />
          <span className="sr-only">FAQ</span>
        </Link>
      </div>
      {showRouteTitle && (
        <div className="relative mt-2">
          <h1 className="text-center text-base font-bold truncate px-14">{selectedRoute.title}</h1>
          {isOnRouteNavigation && <GpsSignalIndicator className="absolute right-0 top-1/2 -translate-y-1/2" />}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { React } from "react";
import Logo from "../icons/logo.svg?url";
import BackButton from "./BackButton";
import { Link, useLocation } from "react-router-dom";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 p-3 bg-zinc-100 dark:bg-zinc-800">
      <div className="mb-6 mt-4 flex justify-between">
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
    </nav>
  );
};

export default Navbar;

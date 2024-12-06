import { React } from "react";
import Logo from "../icons/logo.svg?url";
import BackButton from "./BackButton";
import { Link, useLocation } from "react-router-dom";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = ({}) => {
  const { pathname } = useLocation();

  return (
    <div className="mb-6 mt-4 flex justify-between">
      {pathname === "/" && <img src={Logo} alt="" className="w-10 h-10" />}
      {pathname !== "/" && <BackButton />}
      <Link
        className="flex place-content-center rounded-full text-xl w-9 h-9 bg-black justify-center items-center flex"
        to={`/faq`}
      >
        <FontAwesomeIcon icon={faQuestion} />
        <span className="sr-only">FAQ</span>
      </Link>
    </div>
  );
};

export default Navbar;

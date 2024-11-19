import { React } from "react";
import { useNavigate } from "react-router-dom";
import Xmark from "../icons/xmark-solid.svg?url";
import AngleLeft from "../icons/angle-left-solid.svg?url";

function BackButton({ children }) {
  const navigate = useNavigate();

  return (
    <button
      className="relative flex place-content-center dark:bg-zinc-800 dark:text-white text-sm"
      type="button"
      onClick={() => navigate(-1)}
    >
      <span className="block bg-zinc-300 dark:bg-zinc-700 place-content-center px-3 mr-2 rounded">
        {children === "Afslut" ? (
          <img src={Xmark} alt="Tilbage" className="inline w-2" />
        ) : (
          <img src={AngleLeft} alt="Tilbage" className="inline w-2" />
        )}
      </span>
      {children}
    </button>
  );
}

export default BackButton;

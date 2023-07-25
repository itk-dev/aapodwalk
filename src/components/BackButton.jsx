import { React } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as AngleLeft } from "../icons/angle-left-solid.svg";
import { ReactComponent as Xmark } from "../icons/xmark-solid.svg";

function BackButton({ children }) {
  const navigate = useNavigate();

  return (
    <button
      className="relative flex place-content-center dark:bg-zinc-800 dark:text-white text-sm"
      type="button"
      onClick={() => navigate(-1)}
    >
      <span className="bg-zinc-300 dark:bg-zinc-700 flex place-content-center px-3 mr-2 rounded">
        {children === "Afslut" ? (
          <Xmark className="inline w-2" />
        ) : (
          <AngleLeft className="inline w-2" />
        )}
      </span>
      {children}
    </button>
  );
}

export default BackButton;

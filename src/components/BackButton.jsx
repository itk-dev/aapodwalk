import { React } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      className="relative flex items-center dark:bg-zinc-800 dark:text-white text-sm"
      type="button"
      onClick={() => navigate(-1)}
    >
      <div className="block bg-zinc-300 dark:bg-zinc-900 place-content-center px-3 mr-2 rounded h-7">
        <FontAwesomeIcon icon={faAngleLeft} />
      </div>
      Tilbage
    </button>
  );
}

export default BackButton;

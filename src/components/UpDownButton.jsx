import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

function UpDownButton({ toggleOverlay, label, up }) {
  return (
    <button
      className="dark:bg-emerald-800 dark:text-white bg-white flex place-content-center items-center text-sm absolute right-14 rounded-full top-3 w-9 h-9"
      type="button"
      onClick={() => toggleOverlay()}
    >
      {!up && <FontAwesomeIcon className="w-5 h-5" icon={faAngleDown} />}
      {up && <FontAwesomeIcon className="w-5 h-5" icon={faAngleUp} />}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export default UpDownButton;

import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const CloseButton = ({ closeOverlay, label = "luk" }) => {
  return (
    <button
      className="flex place-content-center items-center dark:bg-emerald-800 dark:text-white text-sm absolute right-3 rounded-full top-3 z-50 w-9 h-9 bg-white"
      type="button"
      onClick={() => closeOverlay()}
    >
      <FontAwesomeIcon className="z-50 w-5 h-5" icon={faClose} />
      <span class="sr-only">{label}</span>
    </button>
  );
};

export default CloseButton;

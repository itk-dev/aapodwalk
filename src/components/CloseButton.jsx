import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

function CloseButton({ closeOverlay, label = "luk", additionalClasses = "" }) {
  return (
    <button
      className={`flex place-content-center items-center text-sm absolute right-3 rounded-full top-3 z-50 w-9 h-9 ${additionalClasses}`}
      type="button"
      onClick={() => closeOverlay()}
    >
      <FontAwesomeIcon className="z-50 w-5 h-5" icon={faClose} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

export default CloseButton;

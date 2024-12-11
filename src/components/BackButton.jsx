import { React, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

function BackButton() {
  const history = useHistory();

  return (
    <button
      className="relative flex items-center dark:bg-zinc-800 dark:text-white text-sm"
      type="button"
      onClick={() => history.goBack()}
    >
      <div className="block bg-zinc-300 dark:bg-zinc-900 place-content-center px-3 mr-2 rounded h-7">
        <FontAwesomeIcon icon={faAngleLeft} />
      </div>
      Tilbage
    </button>
  );
}

export default BackButton;

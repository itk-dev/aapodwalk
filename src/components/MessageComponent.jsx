import { React, useContext } from "react";
import MessageContext from "../context/MessageContext";
import CloseButton from "./CloseButton";

function MessageComponent() {
  const { error, setError, errorText, setErrorText, info, setInfo, infoText, setInfoText } = useContext(MessageContext);

  function resetError() {
    setError(false);
    setErrorText("");
  }
  function resetInfo() {
    setInfo(false);
    setInfoText("");
  }

  return (
    <>
      {error && (
        <div
          role="banner"
          className="relative dark:bg-red-50 bg-red-50 text-black border-l-4 border-solid border-red-400 pl-5 pr-10 py-10 mb-2"
        >
          <CloseButton
            closeOverlay={() => resetError()}
            label="Luk denne fejlbesked"
            additionalClasses="dark:bg-transparent dark:text-zinc-400"
          />
          {errorText}
        </div>
      )}
      {info && (
        <div
          role="banner"
          className="relative dark:bg-red-50 bg-yellow-50 text-black border-l-4 border-solid border-yellow-400 pl-5 pr-10 py-10 mb-2"
        >
          <CloseButton
            closeOverlay={() => resetInfo()}
            label="Luk denne infomation"
            additionalClasses="dark:bg-transparent dark:text-zinc-400"
          />
          {infoText}
        </div>
      )}
    </>
  );
}

export default MessageComponent;

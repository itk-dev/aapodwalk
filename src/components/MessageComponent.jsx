import { React, useContext } from "react";
import MessageContext from "../context/MessageContext";
import Message from "./Message";

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
        <Message
          closeButtonLabel="Luk denne fejlbesked"
          additionalClasses="border-red-400 bg-red-50"
          close={() => resetError()}
          label={errorText}
        />
      )}
      {info && (
        <Message
          closeButtonLabel="Luk denne infomation"
          additionalClasses="border-yellow-400 bg-yellow-50"
          close={() => resetInfo()}
          label={infoText}
        />
      )}
    </>
  );
}

export default MessageComponent;

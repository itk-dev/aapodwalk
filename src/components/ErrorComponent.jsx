import { React, useContext } from "react";
import ErrorContext from "../context/ErrorContext";
import CloseButton from "./CloseButton";

function ErrorComponent() {
  const { errorText, error, setError, setErrorText } = useContext(ErrorContext);

  function resetError() {
    setError(false);
    setError(setErrorText);
  }

  if (!error) return null;
  return (
    <div className="relative dark:bg-red-50 bg-red-50 text-black border-l-4 border-solid border-red-400 pl-5 pr-10 py-10">
      <CloseButton
        closeOverlay={() => resetError()}
        label="Luk denne fejlbesked"
        additionalClasses="dark:bg-transparent dark:text-zinc-400"
      />
      {errorText}
    </div>
  );
}

export default ErrorComponent;

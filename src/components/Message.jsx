import { React } from "react";
import CloseButton from "./CloseButton";

const Message = ({ close, closeButtonLabel, additionalClasses, label }) => {
  return (
    <>
      <div
        role="banner"
        className={`relative text-black border-l-4 border-solid pl-5 pr-10 py-10 mb-2 ${additionalClasses}`}
      >
        <CloseButton
          closeOverlay={() => close()}
          label={closeButtonLabel}
          additionalClasses="dark:bg-transparent dark:text-zinc-400"
        />
        {label}
      </div>
    </>
  );
};

export default Message;

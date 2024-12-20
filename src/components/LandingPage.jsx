import { React, useState, useEffect } from "react";
import Steps from "../icons/steps.svg?url";
import CloseButton from "./CloseButton";

const LandingPage = () => {
  const [infoClosed, setInfoClosed] = useState(localStorage.getItem("info-closed") === "true");

  useEffect(() => {
    if (infoClosed) {
      localStorage.setItem("info-closed", true);
    }
  }, [infoClosed]);

  if (infoClosed) return null;

  return (
    <div className="bg-emerald-400 dark:bg-emerald-800 mb-3 rounded-md p-3 flex">
      <div className="w-3/5">
        <h1 className="text-2xl font-extrabold">Lyt til Aarhus med disse Podwalks</h1>
        <p className="mt-5">
          Oplev Aarhus gennem podcasts, hvor du går rundt og lytter til historier og lokal viden, der giver nyt liv til
          gaderne og stederne omkring dig.
        </p>
        <p className="mt-5 font-bold">Vælg en rute nedenfor og start din lytteoplevelse.</p>
      </div>
      <div className="w-2/5 flex justify-center relative">
        <img src={Steps} alt="" />
      </div>
      <CloseButton
        label="Luk introduktion"
        closeOverlay={() => setInfoClosed(true)}
        additionalClasses="flex justify-center items-center dark:bg-emerald-700 w-9 h-9 rounded-full justify-content-center"
      />
    </div>
  );
};

export default LandingPage;

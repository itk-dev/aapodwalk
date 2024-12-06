import { React, useState, useEffect } from "react";
import Steps from "../icons/steps.svg?url";
import Xmark from "../icons/xmark-solid.svg?url";

const LandingPage = ({}) => {
  const [infoClosed, setInfoClosed] = useState(localStorage.getItem("info-closed") === "true");

  useEffect(() => {
    if (infoClosed) {
      localStorage.setItem("info-closed", true);
    }
  }, [infoClosed]);

  if (infoClosed) return null;

  return (
    <div className="block bg-emerald-400 dark:bg-emerald-800 mb-3 rounded-md p-3 flex">
      <div className="w-3/5">
        <h1 className="text-2xl font-extrabold">Lyt til Aarhus med disse Podwalks</h1>
        <p className="mt-5">
          Oplev Aarhus gennem podcasts, hvor du går rundt og lytter til historier og lokal viden, der giver nyt liv til
          gaderne og stederne omkring dig.
        </p>
        <p className="mt-5 font-bold">Vælg en rute nedenfor og start din lytteoplevelse.</p>
      </div>
      <div className="w-2/5 flex justify-center relative">
        <button
          className="flex justify-center items-center dark:bg-emerald-700 dark:text-white absolute right-0 top-0 w-9 h-9 rounded-full justify-content-center"
          type="button"
          onClick={() => setInfoClosed(true)}
        >
          <img src={Xmark} alt="" className="w-6 h-6" />
          <span className="sr-only">Luk introduktion</span>
        </button>
        <img src={Steps} alt="Tilbage" />
      </div>
    </div>
  );
};

export default LandingPage;

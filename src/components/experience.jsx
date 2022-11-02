import { useState, useEffect } from "react";
import useFetch from "../util/useFetch";
import ExperienceList from "./experience-list";

function Experience({
  experienceId,
  setView,
  lat,
  long,
  storedData,
  setStoredData,
  changeAudio,
  geolocationAvailable,
}) {
  const [currentExperience, setCurrentExperience] = useState(null);
  // todo promise this will be changed
  const { data } = useFetch(
    `${process.env.REACT_APP_API}/experiences/${experienceId}`
  );

  useEffect(() => {
    if (data) {
      setCurrentExperience(data);
    }
  }, [data, experienceId]);

  const returnToMainMenu = () => {
    setView("Hjem");
  };

  if (!currentExperience) return null;

  return (
    <>
      <button
        type="button"
        className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-auto mt-5"
        onClick={returnToMainMenu}
      >
        ← Tilbage
      </button>
      <div>
        <h1 className="text-3xl text-white">{currentExperience.name}</h1>
        <p className="text-white px-2">
          Bevæg dig tæt nok på oplevelsens checkpoints for at låse op for en ny
          lydbid 🤠
        </p>
        <ExperienceList
          experienceId={experienceId}
          steps={currentExperience.steps}
          lat={lat}
          long={long}
          storedData={storedData}
          setStoredData={setStoredData}
          changeAudio={changeAudio}
          geolocationAvailable={geolocationAvailable}
        />
      </div>
    </>
  );
}
export default Experience;

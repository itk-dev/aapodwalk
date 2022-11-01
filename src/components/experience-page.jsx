import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../util/useFetch";
import StepsList from "./steps-list";

function Experience() {
  const { id } = useParams();
  const [currentExperience, setCurrentExperience] = useState(null);
  const { data } = useFetch(`/experiences/${id}`);

  useEffect(() => {
    if (data) {
      setCurrentExperience(data);
    }
  }, [data]);

  if (!currentExperience) return null;

  return (
    <>
      <Link
        className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-auto mt-5"
        to="/"
      >
        ← Tilbage
      </Link>
      <h1 className="text-3xl text-white">{currentExperience.name}</h1>
      <p className="text-white px-2">
        Bevæg dig tæt nok på oplevelsens checkpoints for at låse op for en ny
        lydbid 🤠
      </p>
      {currentExperience.stepsId && (
        <StepsList stepsId={currentExperience.stepsId} />
      )}
    </>
  );
}
export default Experience;

import React, { useEffect, useState } from "react";
import useFetch from "../util/useFetch";
import "./experience-list.css";
import Step from "./step";

function StepsList({ stepsId }) {
  const [steps, setSteps] = useState([]);
  
  const { data } = useFetch(
    `/steps/${stepsId}`
  );

  useEffect(() => {
    if (data) {
      setSteps(data.steps);
    }
  }, [data]);

  return (
    <div className="flex flex-col">
      {steps.map((value) => (
        <Step step={value} />
      ))}
    </div>
  );
}
export default StepsList;

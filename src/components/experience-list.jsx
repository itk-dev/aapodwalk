import { useState, useEffect } from "react";
import useFetch from "../util/useFetch";
import "./cards.css";
import Experience from "./experience";

function ExperienceList() {
  const [experiences, setExperiences] = useState(null);
  const { data } = useFetch(`/experiences`);

  useEffect(() => {
    if (data) {
      setExperiences(data);
    }
  }, [data]);

  return (
    <div className="cards-container">
      {/* eslint-disable-next-line no-shadow */}
      {experiences &&
        experiences.map((experience) => (
          <Experience key={experience.id} experience={experience} />
        ))}
    </div>
  );
}
export default ExperienceList;

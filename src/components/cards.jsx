import { useCallback, useState, useEffect } from "react";
import getDistanceBetweenCoordinates from "../util/helper";
import useFetch from "../util/useFetch";
import "./cards.css";

function Cards({ lat, long, handleExperienceClick }) {
  const [experiences, setExperiences] = useState(null);
  const { data } = useFetch(`http://localhost:3004/experiences`);

  useEffect(() => {
    if (data) {
      setExperiences(data);
    }
  }, [data]);

  const getProximity = (thislat, thislong) => {
    if (lat === null || long === null) {
      return false;
    }
    const distance = getDistanceBetweenCoordinates(
      lat,
      long,
      thislat,
      thislong
    );
    return distance;
  };

  const experienceClick = useCallback((event) => {
    const experienceId = event.target.getAttribute("data-experienceid");
    const experienceName = event.target.getAttribute("data-experiencename");
    handleExperienceClick(experienceId, experienceName);
  }, []);

  return (
    <div className="cards-container">
      {/* eslint-disable-next-line no-shadow */}
      {experiences &&
        experiences.map(({ name, id, lat, long }) => (
          <div
            className={`flex m-5 border border-gray-900 justify-center ${
              !id ? "grayscale" : ""
            } `}
            key={id}
          >
            <div
              className="h-30 h-auto w-30 flex-none bg-cover rounded-t rounded-t-none rounded-l text-center overflow-hidden"
              title="test"
            />
            <div className="py-20 flex flex-col justify-between leading-normal">
              <div>
                {id && (
                  <button
                    type="button"
                    onClick={experienceClick}
                    data-experiencename={name}
                    data-experienceid={id}
                    className="flex font-bold text-lg text-white cursor-pointer flex-col"
                  >
                    {name}
                  </button>
                )}
                {!id && (
                  <div className="font-bold text-lg text-white pointer-events-none flex justify-center">
                    Eventyr i dyrehaven{" "}
                    <img
                      alt=""
                      className="inline-block h-5 my-auto ml-1"
                      src="data:image/png;base64,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"
                    />
                  </div>
                )}
                {getProximity(lat, long) && (
                  <span className="text-white">
                    {getProximity(lat, long)} Meter
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
export default Cards;

import React, { useEffect } from "react";
import getDistanceBetweenCoordinates from "../util/helper";
import "./experience-list.css";

function ExperienceList({
  steps,
  lat,
  long,
  storedData,
  setStoredData,
  changeAudio,
  geolocationAvailable,
}) {
  useEffect(() => {
    if (storedData !== "null") {
      localStorage.setItem("datastore", storedData); // Save
    }
  }, [storedData]);

  const getStoredDataObj = () => {
    if (storedData === "null") {
      return false;
    }
    const dataObj = JSON.parse(storedData);
    if (Object.keys(dataObj).length === 0) {
      return false;
    }
    return dataObj;
  };

  const addUnlock = (eventId) => {
    let storage = storedData;
    if (storage === "undefined") {
      storage = "{}";
    }
    let textForStorage;
    storage = JSON.parse(storage);

    if (Object.keys(storage).length === 0) {
      textForStorage = {
        unlocks: {
          experiences: {
            [eventId]: true,
          },
        },
      };
    } else {
      // storage exists
      const exists = eventId in storage.unlocks.experiences; // Event exists in storage
      if (!exists) {
        // If not, add to storage
        storage.unlocks.experiences[eventId] = true;
      }
      textForStorage = storage;
    }
    textForStorage = JSON.stringify(textForStorage); // Convert to json
    setStoredData(textForStorage);
  };

  const handleExperienceClick = (event) => {
    const eventId = event.target.getAttribute("id");
    const media = event.target.getAttribute("data-media");
    const data = getStoredDataObj();

    const preventUnlock = event.target.getAttribute("data-preventunlock");
    if (preventUnlock === "false") {
      addUnlock(eventId);
      changeAudio(media);
    } else if (data && eventId in data.unlocks.experiences) {
      changeAudio(media);
    }
  };

  return (
    <div>
      {steps &&
        Object.values(steps).map((value) => {
          let unlocked = false;
          const data = getStoredDataObj();
          const preventUnlock = getDistanceBetweenCoordinates(
            lat,
            long,
            value.coordinates.lat,
            value.coordinates.long
          );
          if (data && value.id in data.unlocks.experiences) {
            unlocked = true;
          } else if (!preventUnlock && data) {
            unlocked = true;
            if (value.id && value.id in data.unlocks.experiences === false) {
              addUnlock(value.id);
            }
          }
          return (
            <button
              type="button"
              id={value.id}
              className={
                unlocked
                  ? "experience-point relative overflow-hidden my-2 h-28"
                  : "experience-point relative overflow-hidden my-2 h-28 grayscale"
              }
              onClick={handleExperienceClick}
              data-media={value.media}
              data-name={value.name}
              data-preventunlock={getDistanceBetweenCoordinates(
                lat,
                long,
                value.coordinates.lat,
                value.coordinates.long
              )}
              key={value.name}
            >
              <img
                className="absolute inset-0 m-auto brightness-50 z-0 pointer-events-none min-w-full"
                src={value.image}
                alt="" // todo
              />
              <div className="py-6 z-10 absolute w-full h-full flex flex-col pointer-events-none">
                {unlocked === true && (
                  <div className="m-auto">
                    <p className="m-auto text-white pointer-events-none">
                      <b>{value.name}</b>
                    </p>
                  </div>
                )}
                {unlocked === false && (
                  <div className="m-auto">
                    <p className="m-auto mb-px text-white pointer-events-none">
                      <b>{value.name}</b>{" "}
                      <img
                        className="inline-block h-3 my-auto ml-1"
                        alt="" // todo
                        src="data:image/png;base64,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"
                      />
                    </p>
                    <p className="m-auto mt-px text-white pointer-events-none">
                      {geolocationAvailable !== "denied" &&
                        getDistanceBetweenCoordinates(
                          lat,
                          long,
                          value.coordinates.lat,
                          value.coordinates.long
                        ) &&
                        `${getDistanceBetweenCoordinates(
                          lat,
                          long,
                          value.coordinates.lat,
                          value.coordinates.long
                        )} meter`}{" "}
                    </p>
                  </div>
                )}
              </div>
            </button>
          );
        })}
    </div>
  );
}
export default ExperienceList;

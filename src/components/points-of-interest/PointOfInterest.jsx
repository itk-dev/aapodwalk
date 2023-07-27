import { React, useState, useEffect, useContext } from "react";
import LatLongContext from "../../context/latitude-longitude-context";
import {
  getDistanceBetweenCoordinates,
  isExperienceIdInLocalstorage,
} from "../../util/helper";
import PodcastWrapper from "./PodcastWrapper";
import PermissionContext from "../../context/permission-context";
import Image from "../Image";
import { ReactComponent as CirclePlay } from "../../icons/circle-play-solid.svg";
import { ReactComponent as ClosedCap } from "../../icons/closed-captioning-solid.svg";
import { ReactComponent as RulerHorizontal } from "../../icons/ruler-horizontal-solid.svg";
import { ReactComponent as Xmark } from "../../icons/xmark-solid.svg";

function PointOfInterest({
  pointOfInterest: {
    latitude,
    longitude,
    name,
    image,
    id,
    subtitles,
    podcast,
    IFrameUrl,
  },
  index,
  destinationChanged,
  nextUnlockableId,
  setSource,
}) {
  const { lat, long } = useContext(LatLongContext);
  const [proximity, setProximity] = useState(null);
  const [viewSubtitles, setViewSubtitles] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const { geolocationAvailable } = useContext(PermissionContext);

  useEffect(() => {
    if (
      latitude &&
      longitude &&
      lat &&
      long &&
      geolocationAvailable === "granted"
    ) {
      const distance = getDistanceBetweenCoordinates(
        lat,
        long,
        latitude,
        longitude
      );
      setProximity(distance);
      if (!unlocked && id === nextUnlockableId) {
        setUnlocked(distance < 50); // todo magic number/get from config
      }
    }
  }, [latitude, longitude, lat, long, geolocationAvailable]);

  useEffect(() => {
    if (isExperienceIdInLocalstorage(id)) {
      return;
    }
    if (unlocked) {
      const currentLocalStorage = localStorage.getItem("unlocked-experiences");
      if (currentLocalStorage) {
        // add to existing unlocked steps
        const updateLocalStorage = JSON.parse(currentLocalStorage);

        updateLocalStorage.push(id);
        localStorage.setItem(
          "unlocked-experiences",
          JSON.stringify(updateLocalStorage)
        );
        destinationChanged();
      } else {
        // add new "unlocked steps"
        localStorage.setItem("unlocked-experiences", JSON.stringify([id]));
      }
    }
  }, [unlocked]);

  useEffect(() => {
    if (isExperienceIdInLocalstorage(id)) {
      setUnlocked(true);
    }
  }, []);

  return (
    <div
      className={
        unlocked
          ? `relative flex items-start gap-4 p-2 bg-white dark:bg-zinc-700 rounded-lg`
          : `relative flex items-start gap-4 p-2 bg-white dark:bg-zinc-700 rounded-lg opacity-30`
      }
    >
      <div className="absolute -left-3 px-2 font-bold rounded-full bg-emerald-700 text-zinc-100 text-sm">
        {index}
      </div>
      <Image src={image} className="w-24 h-24 rounded-full" />
      <div className="flex flex-col">
        <h2 className="text-zinc-900 text-sm font-bold dark:text-zinc-200 my-3">
          {name}
        </h2>
        <div className="text-zinc-500 text-sm font-medium dark:text-zinc-400">
          {!unlocked && (
            <label htmlFor="distance">
              <RulerHorizontal className="w-4 inline mr-3" />
              <span className="sr-only">Afstand</span>
              {/* todo this is slow and would benefit from loading screen / skeleton componenet */}
              <span className="text-md" id="distance">
                {proximity} m
              </span>
            </label>
          )}
          <div className="flex gap-2">
            {unlocked && (
              <button
                className="p-1 rounded text-zinc-800 bg-zinc-100"
                type="button"
                onClick={() => setSource(podcast)}
              >
                <CirclePlay className="w-6" />
                <span className="sr-only">Afspil</span>
              </button>
            )}
            {unlocked && (
              <button
                className="p-1 rounded text-zinc-800 bg-zinc-100"
                type="button"
                onClick={() => setViewSubtitles(!viewSubtitles)}
              >
                {viewSubtitles ? (
                  <Xmark className="h-6 w-6 text-zinc-800" />
                ) : (
                  <ClosedCap className="h-6 w-6 text-zinc-800" />
                )}
                <span className="sr-only">Se tekst</span>
              </button>
            )}
          </div>
          {viewSubtitles && (
            <div className="bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-white p-2 rounded mt-2">
              {subtitles}
            </div>
          )}
          {!unlocked && <div>Lås op ved at gå tættere på</div>}
        </div>
      </div>
      {unlocked && IFrameUrl && <PodcastWrapper IFrameUrl={IFrameUrl} />}
    </div>
  );
}

export default PointOfInterest;

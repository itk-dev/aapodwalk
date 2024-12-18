import { React, useState, useEffect } from "react";
import OrderComponent from "./OrderComponent";
import CloseButton from "../CloseButton";
import { FocusTrap } from "focus-trap-react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import UpDownButton from "../UpDownButton";

function PointOverlay({ point: { name, subtitles, mediaEmbedCode, id }, toggleActive, active, order }) {
  const { replace } = useHistory();
  const { search } = useLocation();
  const [fullScreen, setFullScreen] = useState(false);

  function resetSearchParams() {
    replace({ search: new URLSearchParams("").toString() });
  }

  useEffect(() => {
    const query = new URLSearchParams(search);
    const pointId = query.get("point");
    if (pointId && Number(pointId) === id) {
      toggleActive();
      setFullScreen(true);
    }
  }, []);

  useEffect(() => {
    let searchParams = null;

    if (fullScreen) {
      const paramsString = `point=${id}`;
      searchParams = new URLSearchParams(paramsString);
      replace({ search: searchParams.toString() });
    } else {
      resetSearchParams();
    }
  }, [fullScreen, id, replace]);

  function close() {
    // Local state closed
    setFullScreen(false);
    resetSearchParams();
    toggleActive();
  }

  if (!active) return null;

  return (
    <FocusTrap>
      <section
        className={`${
          fullScreen
            ? "fixed bottom-0 left-0 right-0 top-0 bg-zinc-100 dark:bg-zinc-900 z-50 rounded m-2 p-4 flex justify-between flex-col"
            : "bg-zinc-100 dark:bg-zinc-900 z-50 rounded fixed bottom-0 left-0 right-0 bg-zinc-100 dark:bg-zinc-900"
        }`}
      >
        <CloseButton
          additionalClasses="dark:bg-emerald-800 dark:text-white bg-white z-50"
          closeOverlay={() => close()}
          label="luk afspilningen"
        />
        <UpDownButton toggleOverlay={() => setFullScreen(!fullScreen)} up={!fullScreen} label="Åben punkt" />

        <div className="p-4 flex justify-between">
          <div className="flex align-between">
            {fullScreen && <OrderComponent order={order} />}
            <h3 className="ml-2">{name}</h3>
          </div>
        </div>
        {mediaEmbedCode && (
          <div
            className={`${fullScreen ? "fixed left-1 top-1/4 right-1 transform -translate-y-1/4" : ""}`}
            dangerouslySetInnerHTML={{ __html: mediaEmbedCode }}
          />
        )}
        {fullScreen && <p className="ml-2">{subtitles}</p>}
      </section>
    </FocusTrap>
  );
}

export default PointOverlay;

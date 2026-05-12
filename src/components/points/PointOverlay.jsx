import { React, useState, useEffect, useLayoutEffect, useRef, memo } from "react";
import { FocusTrap } from "focus-trap-react";
import { useHistory , useLocation } from "react-router-dom";
import CloseButton from "../CloseButton";
import UpDownButton from "../UpDownButton";
import OrderComponent from "./OrderComponent";

// The videotool iframe must NOT be re-rendered or replaced by React after it
// first mounts — every reconciliation pass on the host element is a chance
// for the embedded player to reload, which causes the audible "pausing /
// flashing" and the `play() interrupted by a new load request` console error.
//
// We bypass React's reconciliation for this subtree by:
//   1. memoizing the component (parent re-renders don't enter this subtree),
//   2. injecting the embed HTML imperatively in a layout effect so React
//      never owns the iframe element. After the layout effect runs once,
//      React only sees an empty `<div>` and leaves it alone.
const MediaEmbed = memo(function MediaEmbed({ html }) {
  const hostRef = useRef(null);
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    host.innerHTML = html;
    return () => {
      host.innerHTML = "";
    };
  }, [html]);
  return <div ref={hostRef} />;
});

const FOCUS_TRAP_OPTIONS = { allowOutsideClick: true };

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
    <FocusTrap focusTrapOptions={FOCUS_TRAP_OPTIONS}>
      <section
        className={`z-40 ${
          fullScreen
            ? "fixed bottom-0 left-0 right-0 top-28 bg-zinc-100 dark:bg-zinc-900 rounded m-2 p-4 flex justify-between flex-col"
            : "bg-zinc-100 dark:bg-zinc-900 rounded fixed bottom-0 left-0 right-0 bg-zinc-100 dark:bg-zinc-900"
        }`}
      >
        <CloseButton
          additionalClasses="dark:bg-emerald-800 dark:text-white bg-white"
          closeOverlay={() => close()}
          label="luk afspilningen"
        />
        <UpDownButton
          toggleOverlay={() => setFullScreen(!fullScreen)}
          up={!fullScreen}
          label={`${
            !fullScreen
              ? "Åben modal med information om dette punkt på ruten"
              : "Luk modal med information om dette punkt på ruten"
          }`}
        />
        <div className="p-4 flex justify-between">
          <div className="flex align-between">
            {fullScreen && <OrderComponent order={order} />}
            <h3 className="ml-2">{name}</h3>
          </div>
        </div>
        {mediaEmbedCode && (
          <div
            className={`relative overflow-hidden [&_iframe]:!max-w-full [&_iframe]:!w-full ${
              fullScreen ? "mx-1 mt-2 aspect-video" : "mx-3 mb-3 aspect-video"
            }`}
          >
            <MediaEmbed html={mediaEmbedCode} />
          </div>
        )}
        {fullScreen && <p className="ml-2">{subtitles}</p>}
      </section>
    </FocusTrap>
  );
}

export default PointOverlay;

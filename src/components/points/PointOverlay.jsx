import { React, useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { FocusTrap } from "focus-trap-react";
import { useHistory, useLocation } from "react-router-dom";
import CloseButton from "../CloseButton";
import UpDownButton from "../UpDownButton";
import OrderComponent from "./OrderComponent";
import MediaPlayer, { isDirectMediaUrl } from "./MediaPlayer";

const FOCUS_TRAP_OPTIONS = { allowOutsideClick: true };

// localStorage key for per-POI playback resume. Each POI gets its own slot
// so listening progress on one doesn't bleed into another.
function getProgressStorageKey(pointId) {
  return `media-progress-${pointId}`;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function PointOverlay({
  point: { name, subtitles, mediaUrl, mediaIsAudio, mediaEmbedCode, id },
  toggleActive,
  active,
  order,
}) {
  const { replace } = useHistory();
  const { search } = useLocation();
  // Default minimized: clicking an unlocked POI starts in the bottom bar.
  const [fullScreen, setFullScreen] = useState(false);

  // We need state — not a useRef — so the effect below re-binds whenever the
  // underlying <audio>/<video> element actually mounts. With useRef the
  // effect only ran once, listeners stayed attached to a stale element after
  // any re-mount, and `isPlaying` / `currentTime` never updated.
  const [audioEl, setAudioEl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // True while the audio is fetching/buffering and not yet playing — used to
  // swap the play/pause icon for a spinner so the UI doesn't look stuck.
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const hasDirectMedia = isDirectMediaUrl(mediaUrl);
  const hasMedia = !!mediaUrl || !!mediaEmbedCode;

  // Calling `play()` here — inside the ref callback — runs during React's
  // commit phase, which is still synchronous within the click handler that
  // mounted/re-opened this PointOverlay. That keeps us inside the browser's
  // user-gesture window (especially important on iOS Safari).
  //
  // The callback fires whenever the underlying <audio> element mounts. With
  // the current architecture that's exactly once per "open the POI"
  // gesture: opening adds the element to the DOM, closing (active=false →
  // PointOverlay returns null) removes it, re-opening adds a fresh one.
  // So no gate is needed — every audio-mount is an open, and every open
  // should auto-play.
  const setAudioRef = useCallback(
    (el) => {
      if (el) {
        // Show the loading spinner from the moment the audio element mounts —
        // until the `playing` event fires there's nothing audible to confirm
        // the click did anything.
        setIsLoading(true);
        // Restore any previously saved progress for this POI before starting
        // playback. Browsers queue the seek until enough data is loaded, so
        // setting currentTime on a freshly mounted element with `src` set is
        // safe even though metadata may not have loaded yet.
        const saved = parseFloat(localStorage.getItem(getProgressStorageKey(id)) || "0");
        if (Number.isFinite(saved) && saved > 0) {
          el.currentTime = saved;
        }
        el.play().catch(() => {
          // Rejection is harmless — the play button is the visible fallback,
          // but clear the spinner since playback never started.
          setIsLoading(false);
        });
      }
      setAudioEl(el);
    },
    [id],
  );

  useEffect(() => {
    if (!audioEl) return undefined;
    const storageKey = getProgressStorageKey(id);
    const onPlay = () => setIsPlaying(true);
    const onPlaying = () => {
      setIsPlaying(true);
      // We're now actually outputting audio — hide the spinner.
      setIsLoading(false);
    };
    const onWaiting = () => {
      // The browser ran out of buffered data mid-playback; show the spinner
      // again until enough is loaded for the next `playing` event.
      setIsLoading(true);
    };
    const onPause = () => {
      setIsPlaying(false);
      setIsLoading(false);
      // Save the current position when the user pauses so closing the player
      // (or letting it auto-close on navigation) preserves it.
      if (Number.isFinite(audioEl.currentTime) && audioEl.currentTime > 0) {
        localStorage.setItem(storageKey, String(audioEl.currentTime));
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setIsLoading(false);
      // Clear the saved position when playback completes — reopening the POI
      // should start over rather than resume at the very end.
      localStorage.removeItem(storageKey);
    };
    const onTime = () => setCurrentTime(audioEl.currentTime);
    const onMeta = () => setDuration(audioEl.duration || 0);
    audioEl.addEventListener("play", onPlay);
    audioEl.addEventListener("playing", onPlaying);
    audioEl.addEventListener("waiting", onWaiting);
    audioEl.addEventListener("pause", onPause);
    audioEl.addEventListener("ended", onEnded);
    audioEl.addEventListener("timeupdate", onTime);
    audioEl.addEventListener("loadedmetadata", onMeta);
    // Sync initial state — the element may already have metadata or be paused
    // by the time we attach (no event will replay).
    setIsPlaying(!audioEl.paused);
    setCurrentTime(audioEl.currentTime || 0);
    setDuration(audioEl.duration || 0);
    return () => {
      // Save the latest position on unmount (close button, navigation away,
      // POI switch). If we're within the last second of the track, treat
      // that as completed and clear the saved progress instead.
      const t = audioEl.currentTime;
      const d = audioEl.duration;
      if (Number.isFinite(t) && t > 0) {
        if (Number.isFinite(d) && d > 0 && t >= d - 1) {
          localStorage.removeItem(storageKey);
        } else {
          localStorage.setItem(storageKey, String(t));
        }
      }
      audioEl.removeEventListener("play", onPlay);
      audioEl.removeEventListener("playing", onPlaying);
      audioEl.removeEventListener("waiting", onWaiting);
      audioEl.removeEventListener("pause", onPause);
      audioEl.removeEventListener("ended", onEnded);
      audioEl.removeEventListener("timeupdate", onTime);
      audioEl.removeEventListener("loadedmetadata", onMeta);
    };
  }, [audioEl, id]);

  function togglePlay() {
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play().catch(() => {
        /* iOS may reject autoplay-style requests; ignore. */
      });
    } else {
      audioEl.pause();
    }
  }

  // Pointer-driven scrubbing. setPointerCapture keeps the timeline element
  // receiving pointermove events even if the pointer drifts outside its
  // bounds, so the user can drag past the bar edge without losing the grab.
  // A ref (not state) tracks the drag flag — we don't want a re-render per
  // pointermove tick.
  const isDraggingRef = useRef(false);

  function seekToClientX(timelineEl, clientX) {
    if (!audioEl || !duration) return;
    const rect = timelineEl.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    // eslint-disable-next-line react-hooks/immutability -- audioEl is a DOM element; setting currentTime is the standard Media API seek call.
    audioEl.currentTime = duration * ratio;
  }

  function onTimelinePointerDown(e) {
    if (!audioEl || !duration) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    seekToClientX(e.currentTarget, e.clientX);
  }

  function onTimelinePointerMove(e) {
    if (!isDraggingRef.current) return;
    seekToClientX(e.currentTarget, e.clientX);
  }

  function onTimelinePointerUp(e) {
    if (!isDraggingRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    isDraggingRef.current = false;
  }

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
    if (fullScreen) {
      replace({ search: new URLSearchParams(`point=${id}`).toString() });
    } else {
      resetSearchParams();
    }
  }, [fullScreen, id, replace]);

  function close() {
    setFullScreen(false);
    resetSearchParams();
    toggleActive();
  }

  if (!active) return null;

  // The section spans `bottom: 0` in both modes — that's what keeps the
  // player bar pinned to the viewport bottom. Width is always full viewport
  // (left-0 right-0, no m-*). Only the `top` property changes:
  //   - minimized: top = viewport height minus the bar's height,
  //                so only the bar is visible
  //   - maximized: top = 7rem (just below the navbar)
  // Both values are explicit, so the CSS `transition: top` smoothly animates
  // the height growing upwards. The bar itself has a fixed `h-20` (5rem)
  // when we have a real <audio>/<video> element, which is what the calc
  // depends on.
  const barHeightRem = hasDirectMedia ? 5 : null;
  // We size the section with `top + height` (both expressed in dvh) instead
  // of `top + bottom: 0`. `bottom: 0` anchors to the layout viewport (vh),
  // which on iOS Safari and Arc Search includes the area covered by the
  // browser's bottom chrome — so the section extends underneath it and the
  // bar at the bottom of the flex column gets hidden. With `top + height`
  // both edges are computed in dvh space, so the bottom of the section
  // lands exactly at the visible viewport bottom (above any browser UI).
  // padding-bottom = safe-area inset keeps the bar's content above the
  // home indicator while the section's bg color still fills the inset.
  const sectionStyle = barHeightRem
    ? {
        top: fullScreen ? "7rem" : `calc(100dvh - ${barHeightRem}rem - env(safe-area-inset-bottom))`,
        height: fullScreen ? "calc(100dvh - 7rem)" : `calc(${barHeightRem}rem + env(safe-area-inset-bottom))`,
        // Override the `bottom-0` utility from className so the browser uses
        // top + height (both in dvh space). With bottom: 0 left in, the
        // section would also extend down to the layout viewport bottom and
        // ignore height.
        bottom: "auto",
        transition: "top 300ms ease-out, height 300ms ease-out",
      }
    : {
        top: fullScreen ? "7rem" : "auto",
        paddingBottom: "env(safe-area-inset-bottom)",
        transition: "top 300ms ease-out",
      };
  return (
    <FocusTrap focusTrapOptions={FOCUS_TRAP_OPTIONS}>
      <section
        style={sectionStyle}
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-100 dark:bg-zinc-900 rounded-t-lg shadow-md overflow-hidden"
      >
        {/* Expanded content. Absolutely positioned above the bar so its
            padding (p-4) and content (title + paragraph) can't force the
            section's flex flow to grow and push the bar out the bottom.
            Bottom is pinned to `bar height + safe-area`, so when the
            section is short (minimized) this div has 0 visible height; when
            the section is tall (maximized) it fills the new space. opacity
            handles the fade. */}
        <div
          className={`absolute top-0 left-0 right-0 overflow-y-auto p-4 pr-3 transition-opacity duration-300 ${
            fullScreen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            bottom: barHeightRem
              ? `calc(${barHeightRem}rem + env(safe-area-inset-bottom))`
              : "env(safe-area-inset-bottom)",
          }}
        >
          <div className="flex">
            <OrderComponent order={order} />
            <h3 className="ml-2 text-xl font-bold">{name}</h3>
          </div>
          {subtitles && <p className="mt-3 whitespace-pre-line">{subtitles}</p>}
        </div>

        {/* Player bar — absolutely pinned at the bottom of the section,
            above the safe-area inset. Stays visually stationary as the
            section's top edge animates up and down. */}
        <div
          className={`absolute left-0 right-0 ${hasDirectMedia ? "h-20" : ""} p-3 pr-24 flex items-center gap-3`}
          style={{ bottom: "env(safe-area-inset-bottom)" }}
        >
          <CloseButton
            // top-1/2! overrides the default top-3 baked into CloseButton so
            // the button is vertically centered in the player bar instead of
            // pinned to its top edge.
            additionalClasses="dark:bg-emerald-800 dark:text-white bg-white top-1/2! -translate-y-1/2"
            closeOverlay={close}
            label="luk afspilningen"
          />
          <UpDownButton
            toggleOverlay={() => setFullScreen(!fullScreen)}
            up={!fullScreen}
            label={
              !fullScreen
                ? "Åben modal med information om dette punkt på ruten"
                : "Luk modal med information om dette punkt på ruten"
            }
          />

          {hasDirectMedia ? (
            <>
              <button
                type="button"
                onClick={togglePlay}
                className="shrink-0 w-10 h-10 rounded-full bg-white dark:bg-emerald-800 dark:text-white flex items-center justify-center text-sm"
                aria-label={isLoading ? "Indlæser" : isPlaying ? "Pause" : "Afspil"}
              >
                {isLoading ? (
                  <span
                    className="block h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{name}</div>
                {/* Timeline. The outer div is the interactive area (taller
                    than the visible track for an easier tap/drag target) and
                    handles pointer events. The dot is rendered with
                    pointer-events-none so the user grabs the timeline itself,
                    not the dot — that way pointer capture stays on the
                    timeline element through the whole drag. */}
                <div
                  role="slider"
                  tabIndex={0}
                  aria-label="Spol i lyden"
                  aria-valuemin={0}
                  aria-valuemax={Math.floor(duration) || 0}
                  aria-valuenow={Math.floor(currentTime) || 0}
                  onPointerDown={onTimelinePointerDown}
                  onPointerMove={onTimelinePointerMove}
                  onPointerUp={onTimelinePointerUp}
                  onPointerCancel={onTimelinePointerUp}
                  className="relative w-full h-4 mt-1 cursor-pointer touch-none flex items-center"
                >
                  <span className="absolute left-0 right-0 h-1 rounded bg-zinc-300 dark:bg-zinc-700" />
                  {/* Fill + dot are hidden while the audio is still loading
                      so they don't visibly jump from 0:00 to the resumed
                      position the moment metadata arrives. They appear when
                      playback actually starts. */}
                  {!isLoading && (
                    <>
                      <span
                        className="absolute left-0 h-1 rounded bg-emerald-400 dark:bg-emerald-600"
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                      />
                      <span
                        className="absolute w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-600 -translate-x-1/2 pointer-events-none"
                        style={{ left: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                      />
                    </>
                  )}
                </div>
                <div className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              {/* Hidden HTML5 audio element drives the custom UI above via
                  the callback ref. controls={false} hides the browser's
                  built-in chrome since we render our own. */}
              <div className="sr-only">
                <MediaPlayer
                  ref={setAudioRef}
                  mediaUrl={mediaUrl}
                  mediaIsAudio={mediaIsAudio}
                  mediaEmbedCode={mediaEmbedCode}
                  controls={false}
                />
              </div>
            </>
          ) : hasMedia ? (
            <>
              <div className="shrink-0 min-w-0 max-w-[40%]">
                <div className="text-sm font-bold truncate">{name}</div>
              </div>
              <div className="flex-1 min-w-0">
                <MediaPlayer
                  ref={setAudioRef}
                  mediaUrl={mediaUrl}
                  mediaIsAudio={mediaIsAudio}
                  mediaEmbedCode={mediaEmbedCode}
                  controls
                />
              </div>
            </>
          ) : (
            <div className="flex-1">
              <div className="text-sm font-bold truncate">{name}</div>
            </div>
          )}
        </div>
      </section>
    </FocusTrap>
  );
}

export default PointOverlay;

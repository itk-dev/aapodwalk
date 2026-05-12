import { React, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import OrderComponent from "./OrderComponent";
import CloseButton from "../CloseButton";
import { FocusTrap } from "focus-trap-react";
import { useHistory, useLocation } from "react-router-dom";
import UpDownButton from "../UpDownButton";
import MediaPlayer, { isDirectMediaUrl } from "./MediaPlayer";

const FOCUS_TRAP_OPTIONS = { allowOutsideClick: true };

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
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
  const setAudioRef = useCallback((el) => {
    if (el) {
      el.play().catch(() => {
        /* Rejection is harmless — the play button is the visible fallback. */
      });
    }
    setAudioEl(el);
  }, []);

  useEffect(() => {
    if (!audioEl) return undefined;
    const onPlay = () => setIsPlaying(true);
    const onPlaying = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(audioEl.currentTime);
    const onMeta = () => setDuration(audioEl.duration || 0);
    audioEl.addEventListener("play", onPlay);
    audioEl.addEventListener("playing", onPlaying);
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
      audioEl.removeEventListener("play", onPlay);
      audioEl.removeEventListener("playing", onPlaying);
      audioEl.removeEventListener("pause", onPause);
      audioEl.removeEventListener("ended", onEnded);
      audioEl.removeEventListener("timeupdate", onTime);
      audioEl.removeEventListener("loadedmetadata", onMeta);
    };
  }, [audioEl]);

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

  function handleSeek(e) {
    if (!audioEl || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audioEl.currentTime = duration * ratio;
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
          className={`absolute left-0 right-0 ${
            hasDirectMedia ? "h-20" : ""
          } p-3 pr-24 flex items-center gap-3`}
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
                aria-label={isPlaying ? "Pause" : "Afspil"}
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{name}</div>
                <button
                  type="button"
                  onClick={handleSeek}
                  className="block w-full h-1 rounded bg-zinc-300 dark:bg-zinc-700 relative mt-1"
                  aria-label="Spol i lyden"
                >
                  <span
                    className="absolute left-0 top-0 bottom-0 bg-emerald-400 dark:bg-emerald-600 rounded"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                  />
                </button>
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

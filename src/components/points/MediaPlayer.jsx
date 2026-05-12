import { React, forwardRef, useLayoutEffect, useRef, useState, memo } from "react";

// Treats any non-empty mediaUrl as a candidate for native HTML5 playback.
// Used by PointOverlay to decide whether to wire up the custom Spotify-style
// minimized bar — that bar talks to a real <audio>/<video> element via ref,
// so we only enable it when MediaPlayer is going to attempt HTML5.
export function isDirectMediaUrl(url) {
  return !!url;
}

// Decide whether to render an <audio> or <video> element. The explicit
// `mediaIsAudio` flag from the API wins; otherwise we sniff the URL for
// hints (videotool's signed download URLs include `ftype=mp3` / `q=audio`
// in the query string, and most direct file URLs have a recognisable
// extension). When nothing tells us either way, default to audio — this is
// a podwalk, not a video site, and a podcast-shaped audio file rendered as
// <video> works but the player UI looks wrong.
function detectIsAudio(url, flag) {
  if (flag === true) return true;
  if (flag === false) return false;
  if (!url) return true;
  if (/[?&]ftype=(mp3|m4a|wav|aac|ogg)\b/i.test(url)) return true;
  if (/[?&]ftype=(mp4|webm|ogv|mov)\b/i.test(url)) return false;
  if (/[?&]q=audio\b/i.test(url)) return true;
  if (/[?&]q=video\b/i.test(url)) return false;
  if (/\.(mp3|m4a|wav|aac|ogg)([?#]|$)/i.test(url)) return true;
  if (/\.(mp4|webm|ogv|mov)([?#]|$)/i.test(url)) return false;
  return true;
}

// Imperatively inject the videotool iframe HTML so React's reconciler never
// touches the iframe after the first paint. Same pattern as before — keeps
// videotool's player from reloading on parent re-renders.
const EmbedHtmlPlayer = memo(function EmbedHtmlPlayer({ html }) {
  const hostRef = useRef(null);
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    host.innerHTML = html;
    return () => {
      host.innerHTML = "";
    };
  }, [html]);
  return <div ref={hostRef} className="w-full h-full" />;
});

// Strategy:
//   1. If `mediaUrl` is set, render a native HTML5 <audio>/<video> element.
//      Full programmatic access via the forwarded ref.
//   2. If the browser fires `error` on that element (the URL didn't return
//      playable bytes), flip to the iframe embed fallback.
//   3. If `mediaUrl` is empty and only `mediaEmbedCode` is provided, render
//      the iframe directly.
const MediaPlayer = forwardRef(function MediaPlayer(
  { mediaUrl, mediaIsAudio, mediaEmbedCode, controls = true, className = "" },
  ref,
) {
  const [nativeFailed, setNativeFailed] = useState(false);

  if (mediaUrl && !nativeFailed) {
    const treatAsAudio = detectIsAudio(mediaUrl, mediaIsAudio);
    const onError = () => setNativeFailed(true);
    return treatAsAudio ? (
      <audio
        ref={ref}
        src={mediaUrl}
        controls={controls}
        preload="auto"
        onError={onError}
        className={`w-full rounded ${className}`}
      />
    ) : (
      <video
        ref={ref}
        src={mediaUrl}
        controls={controls}
        playsInline
        preload="auto"
        onError={onError}
        className={`w-full rounded aspect-video ${className}`}
      />
    );
  }

  if (mediaEmbedCode) {
    return (
      <div
        className={`relative overflow-hidden aspect-video [&_iframe]:!max-w-full [&_iframe]:!w-full ${className}`}
      >
        <EmbedHtmlPlayer html={mediaEmbedCode} />
      </div>
    );
  }

  return null;
});

export default MediaPlayer;

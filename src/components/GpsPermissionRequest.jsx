import { React, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const STATUS = {
  IDLE: "idle",
  REQUESTING: "requesting",
  GRANTED: "granted",
  DENIED: "denied",
  UNAVAILABLE: "unavailable",
  NO_GEOLOCATION: "no_geolocation",
  INSECURE: "insecure",
  TIMEOUT: "timeout",
};

// Geolocation can hang silently when system-level Location Services are off
// (notably on macOS Chrome/Safari), so we shadow the browser timeout with our
// own fallback. The geolocation `timeout` option is the upper bound — the
// fallback should be a touch longer so it only fires if the platform never
// invokes either callback.
const GEOLOCATION_TIMEOUT_MS = 10000;
const FALLBACK_TIMEOUT_MS = 12000;

function GpsPermissionRequest() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [grantedHintVisible, setGrantedHintVisible] = useState(false);
  const fallbackTimerRef = useRef(null);
  const settledRef = useRef(false);

  useEffect(() => {
    if (!navigator.permissions?.query) return;
    let cancelled = false;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (cancelled) return;
        // Only trust the API for "granted" — iOS Safari (especially in standalone
        // PWA mode) is known to report "denied" for sites that have never been
        // asked, which would lock the pill before the user ever sees a prompt.
        // DENIED is only set from the actual getCurrentPosition error callback.
        if (result.state === "granted") setStatus(STATUS.GRANTED);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  function settle(next) {
    if (settledRef.current) return;
    settledRef.current = true;
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setStatus(next);
  }

  function requestPermission() {
    if (!navigator.geolocation) {
      setStatus(STATUS.NO_GEOLOCATION);
      return;
    }
    if (window.isSecureContext === false) {
      setStatus(STATUS.INSECURE);
      return;
    }

    settledRef.current = false;
    setStatus(STATUS.REQUESTING);

    fallbackTimerRef.current = setTimeout(() => settle(STATUS.TIMEOUT), FALLBACK_TIMEOUT_MS);

    try {
      navigator.geolocation.getCurrentPosition(
        () => settle(STATUS.GRANTED),
        (err) => {
          if (err.code === err.PERMISSION_DENIED) settle(STATUS.DENIED);
          else if (err.code === err.POSITION_UNAVAILABLE) settle(STATUS.UNAVAILABLE);
          else if (err.code === err.TIMEOUT) settle(STATUS.TIMEOUT);
          else settle(STATUS.UNAVAILABLE);
        },
        { enableHighAccuracy: true, timeout: GEOLOCATION_TIMEOUT_MS, maximumAge: 0 },
      );
    } catch {
      settle(STATUS.NO_GEOLOCATION);
    }
  }

  const isGranted = status === STATUS.GRANTED;
  const isRequesting = status === STATUS.REQUESTING;
  const isBlocked = status === STATUS.DENIED;
  const pillUnsupported = status === STATUS.NO_GEOLOCATION || status === STATUS.INSECURE;
  const pillDisabled = isRequesting || pillUnsupported || isBlocked;

  function togglePill() {
    if (pillDisabled) return;
    if (isGranted) {
      setGrantedHintVisible((visible) => !visible);
    } else {
      requestPermission();
    }
  }

  let pillLabel;
  if (isRequesting) pillLabel = "Venter på svar…";
  else if (isGranted) pillLabel = "Adgang slået til";
  else if (isBlocked) pillLabel = "Blokeret — kan kun slås til via telefonens indstillinger";
  else pillLabel = "Adgang slået fra — tryk for at slå til";

  return (
    <section className="bg-emerald-400 dark:bg-zinc-900 flex flex-col relative my-2 rounded font-bold p-5 mt-5">
      <span>Tillad Podwalk adgang til din lokation</span>
      <p className="font-normal mt-2 text-sm">
        {isGranted
          ? "Podwalk har adgang til din lokation. Du kan slå adgangen fra igen via din enheds indstillinger."
          : "Hvis kortet ikke kan finde dig, eller du ved et uheld har afvist adgangen, kan du bede browseren om at spørge igen."}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isGranted}
          aria-label="Lokationsadgang"
          onClick={togglePill}
          disabled={pillDisabled}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
            isGranted ? "bg-emerald-600" : "bg-zinc-400 dark:bg-zinc-600"
          } ${pillDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span
            className={`inline-flex h-5 w-5 items-center justify-center transform rounded-full bg-white shadow transition-transform ${
              isGranted ? "translate-x-6" : "translate-x-1"
            }`}
          >
            {isBlocked && <FontAwesomeIcon icon={faLock} aria-hidden="true" className="text-zinc-500 text-[10px]" />}
          </span>
        </button>
        <span className="font-normal text-sm">{pillLabel}</span>
      </div>
      {isGranted && grantedHintVisible && (
        <p className="font-normal mt-3 text-sm" role="status">
          Adgangen styres af din enheds indstillinger og kan ikke slås fra herinde.{" "}
          <Link className="underline" to="/navigation-help">
            Se hvordan du fjerner adgangen igen
          </Link>
          .
        </p>
      )}
      {status === STATUS.DENIED && (
        <p className="font-normal mt-3 text-sm" role="alert">
          Browseren husker, at adgangen tidligere er blevet afvist, og spørger derfor ikke igen. Du skal slå adgangen
          til i din enheds indstillinger.{" "}
          <Link className="underline" to="/navigation-help">
            Se vejledningen til iOS, Android og computer
          </Link>
          .
        </p>
      )}
      {status === STATUS.UNAVAILABLE && (
        <p className="font-normal mt-3 text-sm" role="alert">
          Din enhed kunne ikke bestemme din position. Lokationstjenester er sandsynligvis slået fra på systemniveau.{" "}
          <Link className="underline" to="/navigation-help">
            Se hvordan du slår lokationstjenester til
          </Link>
          .
        </p>
      )}
      {status === STATUS.TIMEOUT && (
        <p className="font-normal mt-3 text-sm" role="alert">
          Browseren svarede ikke i tide. Det sker typisk, hvis lokationstjenester er slået fra på din enhed, eller hvis
          du har overset systemprompten. Tjek dine indstillinger og prøv igen.{" "}
          <Link className="underline" to="/navigation-help">
            Se vejledningen
          </Link>
          .
        </p>
      )}
      {status === STATUS.INSECURE && (
        <p className="font-normal mt-3 text-sm" role="alert">
          Lokationstjenester kræver en sikker forbindelse (HTTPS). Åbn Podwalk via https-adressen og prøv igen.
        </p>
      )}
      {status === STATUS.NO_GEOLOCATION && (
        <p className="font-normal mt-3 text-sm" role="alert">
          Din browser understøtter ikke lokationstjenester. Prøv en anden browser, f.eks. Safari eller Chrome.
        </p>
      )}
    </section>
  );
}

export default GpsPermissionRequest;

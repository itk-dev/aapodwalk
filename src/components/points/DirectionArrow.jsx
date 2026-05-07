import { React, useState, useEffect, useMemo, useContext, useRef } from "react";
import { getBearingBetweenCoordinates } from "../../util/helper";
import LatLongContext from "../../context/latitude-longitude-context";

// Renders a small arrow that rotates to point from the user's current location toward
// (latitude, longitude). When device-orientation isn't available or the user denies
// permission, the component renders nothing — the meters readout from DistanceComponent
// is enough on its own.
//
// Heading source quirks:
// - iOS Safari exposes `event.webkitCompassHeading`: clockwise from true north, absolute.
// - Other browsers expose `event.alpha`: counter-clockwise from the device's initial
//   orientation, only reliably absolute when `event.absolute === true`. Some Android
//   browsers report alpha relative to boot orientation, in which case the arrow may
//   be wrong; we accept that limitation in v1.

const PERMISSION_STORAGE_KEY = "device-orientation-permission";
const PERMISSION_EVENT = "device-orientation-permission-changed";

function getInitialPermissionState() {
  if (typeof window === "undefined" || !window.DeviceOrientationEvent) {
    return "unsupported";
  }
  const cached = sessionStorage.getItem(PERMISSION_STORAGE_KEY);
  if (cached === "granted" || cached === "denied") {
    return cached;
  }
  // iOS Safari requires an explicit user-gesture-driven request.
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    return "unknown";
  }
  return "granted";
}

function readHeading(event) {
  if (typeof event.webkitCompassHeading === "number") {
    return event.webkitCompassHeading;
  }
  if (event.absolute === true && typeof event.alpha === "number") {
    return (360 - event.alpha) % 360;
  }
  return null;
}

// Hook for pages that want the device-orientation permission requested
// automatically on the user's first gesture. iOS Safari rejects
// `DeviceOrientationEvent.requestPermission()` outside a trusted gesture,
// so we attach a one-shot capture-phase click listener and trigger the
// request from there. Other platforms either don't need permission
// (Android Chrome) or don't support orientation events at all — both
// cases short-circuit immediately.
export function useDeviceOrientationAutoPermission() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.DeviceOrientationEvent) return undefined;
    if (typeof DeviceOrientationEvent.requestPermission !== "function") return undefined;
    const cached = sessionStorage.getItem(PERMISSION_STORAGE_KEY);
    if (cached === "granted" || cached === "denied") return undefined;

    let triggered = false;
    async function handler() {
      if (triggered) return;
      triggered = true;
      window.removeEventListener("click", handler, true);
      window.removeEventListener("touchend", handler, true);
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        const next = result === "granted" ? "granted" : "denied";
        sessionStorage.setItem(PERMISSION_STORAGE_KEY, next);
        window.dispatchEvent(new CustomEvent(PERMISSION_EVENT, { detail: next }));
      } catch {
        sessionStorage.setItem(PERMISSION_STORAGE_KEY, "denied");
        window.dispatchEvent(new CustomEvent(PERMISSION_EVENT, { detail: "denied" }));
      }
    }
    window.addEventListener("click", handler, true);
    window.addEventListener("touchend", handler, true);
    return () => {
      window.removeEventListener("click", handler, true);
      window.removeEventListener("touchend", handler, true);
    };
  }, []);
}

function DirectionArrow({ latitude, longitude, classes }) {
  const { lat, long } = useContext(LatLongContext);
  const [compass, setCompass] = useState(null);
  const [permissionState, setPermissionState] = useState(getInitialPermissionState);
  const sawUsableHeading = useRef(false);

  const bearing = useMemo(() => getBearingBetweenCoordinates(lat, long, latitude, longitude), [
    lat,
    long,
    latitude,
    longitude,
  ]);

  // Pick up permission resolution dispatched by useDeviceOrientationAutoPermission
  // (or any other code path that updates the cache), so the arrow starts working
  // mid-session without needing a remount.
  useEffect(() => {
    function onChange(e) {
      if (e.detail === "granted" || e.detail === "denied") {
        setPermissionState(e.detail);
      }
    }
    window.addEventListener(PERMISSION_EVENT, onChange);
    return () => window.removeEventListener(PERMISSION_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (permissionState !== "granted") return undefined;

    function handler(event) {
      const heading = readHeading(event);
      if (heading === null) return;
      sawUsableHeading.current = true;
      setCompass(heading);
    }

    const eventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(eventName, handler, true);

    // If we never get a usable heading (e.g. desktop fires the event with empty alpha),
    // give up and hide the arrow rather than show a stuck one.
    const giveUpTimer = window.setTimeout(() => {
      if (!sawUsableHeading.current) {
        setPermissionState("unsupported");
      }
    }, 1500);

    return () => {
      window.removeEventListener(eventName, handler, true);
      window.clearTimeout(giveUpTimer);
    };
  }, [permissionState]);

  if (permissionState !== "granted") {
    return null;
  }

  if (bearing === null || compass === null) {
    return null;
  }

  const rotation = bearing - compass;

  // Outer span owns positioning (Tailwind translate utilities); inner span owns the
  // rotation. Splitting them avoids the inline `transform` overriding Tailwind's
  // positional transforms on the same element.
  return (
    <span className={classes} aria-hidden="true">
      <span
        className="block w-full h-full transition-transform duration-100 ease-linear"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
          <path d="M16 2 L22 18 L16 14 L10 18 Z" />
        </svg>
      </span>
    </span>
  );
}

export default DirectionArrow;

import { React, useContext } from "react";
import LatLongContext from "../context/latitude-longitude-context";

// Thresholds (metres of horizontal accuracy reported by `position.coords.accuracy`).
// Typical open-sky GPS is 5-20m; urban canyons routinely degrade to 30-100m.
const GOOD_ACCURACY_M = 15;
const POOR_ACCURACY_M = 30;

function GpsSignalIndicator({ className = "" }) {
  const { accuracy } = useContext(LatLongContext);
  if (typeof accuracy !== "number") return null;

  let colorClass;
  let ariaLabel;
  if (accuracy <= GOOD_ACCURACY_M) {
    colorClass = "bg-emerald-500";
    ariaLabel = "GPS-signal er god";
  } else if (accuracy <= POOR_ACCURACY_M) {
    colorClass = "bg-yellow-400";
    ariaLabel = "GPS-signal er upålidelig";
  } else {
    colorClass = "bg-red-500";
    ariaLabel = "GPS-signal er dårlig";
  }

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`inline-flex flex-col items-center gap-1 ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full ring-1 ring-black/10 dark:ring-white/20 transition-colors duration-300 ${colorClass}`}
      />
      <span className="text-[8px] font-medium uppercase leading-none text-zinc-700 dark:text-white">signal</span>
    </span>
  );
}

export default GpsSignalIndicator;

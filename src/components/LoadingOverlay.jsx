import { React } from "react";
import { createPortal } from "react-dom";
import Logo from "../icons/logo.svg?url";

const LoadingOverlay = ({ loading }) => {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!loading}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerald-400 dark:bg-emerald-800 transition-opacity ease-out ${
        loading ? "opacity-100 duration-0" : "opacity-0 pointer-events-none duration-500"
      }`}
    >
      <img src={Logo} alt="" className="w-28 h-28 motion-safe:animate-pulse" />
      <span className="mt-3 text-sm text-white">loading...</span>
    </div>,
    document.body,
  );
};

export default LoadingOverlay;

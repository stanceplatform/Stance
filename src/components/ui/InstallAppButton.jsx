import React from "react";
import { usePWAInstall } from "../../hooks/usePWAInstall";

export default function InstallAppButton({ className = "" }) {
  const { canInstall, install, isInstalled } = usePWAInstall();
  if (isInstalled || !canInstall) return null;

  return (
    <button
      onClick={install}
      className={
        className ||
        "px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
      }
    >
      Install Stance
    </button>
  );
}

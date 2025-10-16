import React, { useMemo } from "react";

function isIOSSafari() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  return isIOS && isSafari;
}

export default function IosInstallHint() {
  const show = useMemo(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    return isIOSSafari() && !standalone;
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md rounded-xl border bg-white shadow p-3 text-sm">
      <b>Install Stance</b><br />
      Open the <span className="inline-block px-1 border rounded">Share</span> menu and tap
      <b> Add to Home Screen</b>.
    </div>
  );
}

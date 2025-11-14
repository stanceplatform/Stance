import React, { useMemo } from "react";
import { usePWAInstall } from "../../hooks/usePWAInstall";

function isChromeMobile() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isChrome = /Chrome/i.test(ua) && !/Edg|OPR|SamsungBrowser/i.test(ua);
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  return isChrome && isMobile;
}

export default function ChromeInstallHint() {
  const { isInstalled, canInstall } = usePWAInstall();
  
  const show = useMemo(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    // Show if Chrome mobile, not installed, and beforeinstallprompt didn't fire
    return isChromeMobile() && !standalone && !isInstalled && !canInstall;
  }, [isInstalled, canInstall]);

  if (!show) return null;

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md rounded-xl border bg-white shadow-lg p-4 text-sm z-50">
      <div className="font-semibold mb-2 text-[#212121]">Install Stance</div>
      {isIOS ? (
        <div className="text-[#707070] space-y-1">
          <p>Tap the <span className="inline-block px-1.5 py-0.5 border rounded font-medium">Share</span> button in Chrome menu, then select</p>
          <p className="font-medium text-[#212121]">"Add to Home Screen"</p>
        </div>
      ) : isAndroid ? (
        <div className="text-[#707070] space-y-1">
          <p>Tap the <span className="inline-block px-1.5 py-0.5 border rounded font-medium">Menu</span> (⋮) button, then select</p>
          <p className="font-medium text-[#212121]">"Install app" or "Add to Home screen"</p>
        </div>
      ) : (
        <div className="text-[#707070]">
          <p>Use the browser menu to install this app</p>
        </div>
      )}
    </div>
  );
}


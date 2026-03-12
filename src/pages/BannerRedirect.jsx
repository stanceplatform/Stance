import React, { useEffect } from 'react';
import { openAndroidApp } from '../utils/openMobileApp';
import { BANNER_FALLBACK_URL } from '../utils/constants';

/**
 * Banner redirect page when users click Stance banner/ad in another app.
 * Banner link: https://stance-development.vercel.app/app
 *
 * - Android: try to open app (intent); when Flutter is ready it will open; else Play Store.
 * - iOS: no App Store yet → redirect to base URL (web).
 * - Fallback: redirect to base URL.
 */
const BannerRedirect = () => {
  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    if (isAndroid) {
      // Intent: opens app when Flutter supports it; fallback = Play Store
      openAndroidApp('home');
      return;
    }

    if (isIOS) {
      window.location.replace(BANNER_FALLBACK_URL);
      return;
    }

    window.location.replace(BANNER_FALLBACK_URL);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
};

export default BannerRedirect;

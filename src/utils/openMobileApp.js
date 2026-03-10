/**
 * Constants for Android App integration.
 * Update these when confirmed by the Flutter developer.
 */
export const ANDROID_PACKAGE_NAME = "com.stance.app";
export const APP_SCHEME = "stance"; // TODO: Confirm with Flutter dev
export const DEEP_LINK_PATH = "home"; // Default path to open in app

/**
 * Opens the Android app if installed, otherwise redirects to Play Store.
 * Uses the intent:// scheme which is the most reliable way on modern Android.
 * 
 * @param {string} path - Optional deep link path (e.g. "product/123")
 */
export const openAndroidApp = (path = DEEP_LINK_PATH) => {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;

  if (!isAndroid) {
    // Fallback for Desktop/iOS/Unsupported - Open Play Store page
    window.open(playStoreUrl, "_blank");
    return;
  }

  /**
   * Intent URI format:
   * intent://[path]#Intent;scheme=[scheme];package=[package];S.browser_fallback_url=[fallback];end
   */
  const intentUri = `intent://${path}#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE_NAME};S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;

  // Attempt to open the intent
  window.location.href = intentUri;
};

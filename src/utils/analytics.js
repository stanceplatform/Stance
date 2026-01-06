import ReactGA from "react-ga4";

const initializeAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (measurementId) {
    ReactGA.initialize(measurementId);
    console.log("GA Initialized");
  } else {
    console.warn("GA Measurement ID not found");
  }
};

const trackEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

const setUserId = (userId) => {
  if (userId) {
    ReactGA.set({ user_id: userId });
  }
};

const sendEvent = (eventName, params) => {
  if (import.meta.env.DEV) {
    console.log(`[GA4 Event] ${eventName}`, params);
  }
  ReactGA.event(eventName, params);
};

export default { initializeAnalytics, trackEvent, setUserId, sendEvent };

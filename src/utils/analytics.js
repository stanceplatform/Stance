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

export default { initializeAnalytics, trackEvent };

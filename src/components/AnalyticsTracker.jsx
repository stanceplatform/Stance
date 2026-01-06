import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactGA from 'react-ga4';
import analytics from '../utils/analytics';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA only once (safe to call multiple times with react-ga4 checks, but good practice to keep it organized)
    // Actually, it's better to initialize in a top-level component or just ensure it checks if initialized.
    // However, for simplicity, we rely on the utility being called or just initializing here if not already.
    // Given the utility structure, let's just use ReactGA directly for pageviews as per react-ga4 docs

    // Ensure initialized if not already (safeguard)
    // But ideally AppRoutes should init it. Let's assume initialized or call init here.
    analytics.initializeAnalytics();
  }, []);

  // Track User ID
  const { user } = useAuth();
  useEffect(() => {
    if (user?.uid) {
      analytics.setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    // Send pageview with a custom path
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

export default AnalyticsTracker;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactGA from 'react-ga4';
import analytics from '../utils/analytics';
import hotjar from '../utils/hotjar';
import mixpanel from '../utils/mixpanel';

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

    // Initialize Hotjar
    hotjar.initializeHotjar();

    // Initialize Mixpanel
    mixpanel.initializeMixpanel();

    // Track "App Opened" only once per session (Client Rule 3)
    // We use a simple session check variable or rely on Mixpanel's session logic
    // For simplicity here, we track it on mount if the referer was external or empty, 
    // but typically "App Opened" is "Session Started". 
    // Since this component might remount, we should be careful. 
    // Ideally, this runs once in the App root. 
    // Assuming AnalyticsTracker is at root:
    mixpanel.trackEvent("App Opened", { platform: "web" });
  }, []);

  // Track User ID
  const { user } = useAuth();
  useEffect(() => {
    // Check for user.id (DB) or user.uid (Firebase style fallback)
    const userId = user?.id || user?._id || user?.uid;

    if (userId) {
      // Set user ID in Google Analytics
      analytics.setUserId(userId);

      // Identify user in Hotjar with additional attributes
      hotjar.identifyUser(userId, {
        email: user.email,
        displayName: user.displayName || user.name || user.username || 'Unknown'
      });

      // Identify user in Mixpanel (Client Rule 4)
      mixpanel.identifyUser(userId, {
        $email: user.email,
        $name: user.displayName || user.name || user.username || 'Unknown',
        signup_date: user.metadata?.creationTime || user.createdAt,
        signup_source: "web_app",
        setOption: 'once'
      });
    }
  }, [user]);

  useEffect(() => {
    // Send pageview with a custom path
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

export default AnalyticsTracker;

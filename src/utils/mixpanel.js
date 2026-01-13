import mixpanel from 'mixpanel-browser';

/**
 * Initialize Mixpanel tracking
 */
const initializeMixpanel = () => {
    const token = import.meta.env.VITE_MIXPANEL_TOKEN;
    if (token) {
        mixpanel.init(token, {
            debug: import.meta.env.DEV, // Enable debug mode in development
            track_pageview: true,       // Automatically track page views
            persistence: 'localStorage' // Standard persistence
        });
        console.log('Mixpanel Initialized');
    } else {
        // Only warn if we are not in CI/test environment to avoid noise
        if (import.meta.env.DEV) {
            console.warn('Mixpanel Token not found');
        }
    }
};

/**
 * Identify a user in Mixpanel
 * @param {string} userId - Unique user identifier
 * @param {object} traits - User traits (email, name, etc.)
 */
const identifyUser = (userId, traits = {}) => {
    const token = import.meta.env.VITE_MIXPANEL_TOKEN;
    if (token && userId) {
        // 1. Identify the user (links anonymous ID to this user ID)
        mixpanel.identify(userId);

        // 2. Set user people properties (profile data)
        if (Object.keys(traits).length > 0) {
            mixpanel.people.set(traits);
        }

        console.log('Mixpanel user identified:', userId);
    }
};

/**
 * Track a custom event
 * @param {string} eventName - Name of the event 
 * @param {object} properties - Additional event properties
 */
const trackEvent = (eventName, properties = {}) => {
    const token = import.meta.env.VITE_MIXPANEL_TOKEN;
    if (token) {
        mixpanel.track(eventName, properties);
        if (import.meta.env.DEV) {
            console.log(`[Mixpanel Event] ${eventName}`, properties);
        }
    }
};

export default { initializeMixpanel, identifyUser, trackEvent };

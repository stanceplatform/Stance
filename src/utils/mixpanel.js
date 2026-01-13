import mixpanel from 'mixpanel-browser';

/**
 * Initialize Mixpanel tracking
 */
const initializeMixpanel = () => {
    const token = import.meta.env.VITE_MIXPANEL_TOKEN;
    if (token) {
        mixpanel.init(token, {
            debug: import.meta.env.DEV,
            track_pageview: false, // ❌ DISABLE Auto-track page views (Client Rule 1)
            persistence: 'localStorage', // ✅ Use localStorage (Client Rule 2)
            ignore_dnt: true // Optional: usually desired for analytics accuracy
        });
        console.log('Mixpanel Initialized (Manual Mode)');
    } else {
        if (import.meta.env.DEV) {
            console.warn('Mixpanel Token not found');
        }
    }
};

/**
 * Identify a user in Mixpanel
 * @param {string} userId - Unique user identifier
 * @param {object} traits - User traits
 * @param {boolean} isNewSignup - If true, sets immutable properties
 */
const identifyUser = (userId, traits = {}) => {
    const token = import.meta.env.VITE_MIXPANEL_TOKEN;
    if (token && userId) {
        // 1. Identify: Links this session to the user ID
        mixpanel.identify(userId);

        // 2. Set Once: These properties will NEVER be overwritten (Client Rule 4)
        // Useful for 'First Login Date', 'Signup Source'
        if (traits.setOption === 'once') {
            delete traits.setOption; // Cleanup
            mixpanel.people.set_once(traits);
        } else {
            // Standard update for mutable things like 'Plan', 'Last Login'
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

import Hotjar from '@hotjar/browser';

/**
 * Initialize Hotjar tracking
 */
const initializeHotjar = () => {
    const siteId = import.meta.env.VITE_HOTJAR_SITE_ID;
    const hotjarVersion = 6; // Current Hotjar snippet version

    if (siteId) {
        try {
            Hotjar.init(parseInt(siteId), hotjarVersion);
            console.log('Hotjar initialized successfully');
        } catch (error) {
            console.error('Hotjar initialization failed:', error);
        }
    } else {
        console.warn('Hotjar Site ID not found in environment variables');
    }
};

/**
 * Identify a user in Hotjar
 * @param {string} userId - Unique user identifier
 * @param {object} attributes - Additional user attributes
 */
const identifyUser = (userId, attributes = {}) => {
    if (userId) {
        try {
            Hotjar.identify(userId, attributes);
            console.log('Hotjar user identified:', userId);
        } catch (error) {
            console.error('Hotjar identify failed:', error);
        }
    }
};

/**
 * Tag a recording with custom data
 * @param {string[]} tags - Array of tags to add
 */
const tagRecording = (tags = []) => {
    if (tags.length > 0) {
        try {
            tags.forEach(tag => Hotjar.event(tag));
        } catch (error) {
            console.error('Hotjar tag recording failed:', error);
        }
    }
};

/**
 * Check if Hotjar is ready (always returns true after init)
 * @returns {boolean}
 */
const isHotjarReady = () => {
    return true; // Hotjar.init() is synchronous, so always ready after call
};

/**
 * Send custom events to Hotjar
 * @param {string} eventName - Name of the event
 */
const sendHotjarEvent = (eventName) => {
    try {
        Hotjar.event(eventName);
        if (import.meta.env.DEV) {
            console.log(`[Hotjar Event] ${eventName}`);
        }
    } catch (error) {
        console.error('Hotjar event failed:', error);
    }
};

export default {
    initializeHotjar,
    identifyUser,
    tagRecording,
    isHotjarReady,
    sendHotjarEvent
};

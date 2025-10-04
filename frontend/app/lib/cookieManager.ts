export type CookieCategory =
  | 'essential'
  | 'functional'
  | 'analytics'
  | 'marketing';

export interface CookieConsent {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: string;
}

export interface DetectedCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: string;
  size: number;
  category: CookieCategory;
}

const CONSENT_VERSION = '1.0';
const CONSENT_EXPIRY_DAYS = 180; // 6 months
const STORAGE_KEY = 'bantuhive_cookie_consent';

// Default consent (only essential enabled)
export const DEFAULT_CONSENT: CookieConsent = {
  essential: true, // Always true, can't be disabled
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: Date.now(),
  version: CONSENT_VERSION,
};

// Cookie categories with their purposes
export const COOKIE_CATEGORIES = {
  essential: {
    title: 'Essential Cookies',
    description:
      'Required for the website to function properly. These cannot be disabled.',
    cookies: ['bantuhive_cookie_consent', 'session_id', 'csrf_token'],
  },
  functional: {
    title: 'Functional Cookies',
    description:
      'Enable enhanced functionality and personalization, such as remembering your preferences.',
    cookies: ['user_preferences', 'language', 'currency'],
  },
  analytics: {
    title: 'Analytics Cookies',
    description:
      'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    cookies: ['_ga', '_gid', '_gat', 'analytics_session'],
  },
  marketing: {
    title: 'Marketing Cookies',
    description:
      'Used to track visitors across websites to display relevant advertisements.',
    cookies: ['_fbp', 'fr', 'ads_id', 'conversion_id'],
  },
};

// Get saved consent from localStorage
export const getSavedConsent = (): CookieConsent | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const consent: CookieConsent = JSON.parse(saved);

    // Check if consent has expired
    const expiryDate = new Date(consent.timestamp);
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);

    if (new Date() > expiryDate || consent.version !== CONSENT_VERSION) {
      return null; // Expired or version mismatch
    }

    return consent;
  } catch {
    return null;
  }
};

// Save consent to localStorage
export const saveConsent = (consent: CookieConsent): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...consent,
        timestamp: Date.now(),
        version: CONSENT_VERSION,
      }),
    );
  } catch (error) {
    console.error('Failed to save cookie consent:', error);
  }
};

// Check if user needs to give consent
export const needsConsent = (): boolean => {
  return getSavedConsent() === null;
};

// Get all cookies from document
export const getAllCookies = (): DetectedCookie[] => {
  const cookies: DetectedCookie[] = [];
  const cookieStrings = document.cookie.split(';');

  cookieStrings.forEach((cookieString) => {
    const [name, value] = cookieString.trim().split('=');
    if (name) {
      // Determine category based on cookie name
      let category: CookieCategory = 'essential';

      for (const [cat, info] of Object.entries(COOKIE_CATEGORIES)) {
        if (info.cookies.some((c) => name.includes(c) || c.includes(name))) {
          category = cat as CookieCategory;
          break;
        }
      }

      cookies.push({
        name,
        value: value || '',
        domain: window.location.hostname,
        path: '/',
        expires: 'Session',
        size: name.length + (value?.length || 0),
        category,
      });
    }
  });

  return cookies;
};

// Delete a specific cookie
export const deleteCookie = (name: string, domain?: string): void => {
  const domains = domain
    ? [domain]
    : [
        window.location.hostname,
        '.' + window.location.hostname,
        window.location.hostname.replace(/^www\./, ''),
      ];

  const paths = ['/', '/path', '/path/to'];

  domains.forEach((d) => {
    paths.forEach((p) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${d}; path=${p}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}`;
    });
  });
};

// Delete cookies by category
export const deleteCookiesByCategory = (category: CookieCategory): void => {
  if (category === 'essential') return; // Can't delete essential cookies

  const cookies = getAllCookies();
  cookies.forEach((cookie) => {
    if (cookie.category === category) {
      deleteCookie(cookie.name, cookie.domain);
    }
  });
};

// Apply consent: delete cookies for disabled categories
export const applyConsent = (consent: CookieConsent): void => {
  Object.entries(consent).forEach(([category, enabled]) => {
    if (
      !enabled &&
      category !== 'essential' &&
      category !== 'timestamp' &&
      category !== 'version'
    ) {
      deleteCookiesByCategory(category as CookieCategory);
    }
  });
};

// Block/Unblock scripts based on consent
export const manageScripts = (consent: CookieConsent): void => {
  // Analytics scripts
  if (consent.analytics) {
    // Enable analytics scripts
    console.log('Analytics enabled');
  } else {
    // Disable analytics scripts
    console.log('Analytics disabled');
  }

  // Marketing scripts
  if (consent.marketing) {
    // Enable marketing scripts
    console.log('Marketing enabled');
  } else {
    // Disable marketing scripts
    console.log('Marketing disabled');
  }

  // Functional scripts
  if (consent.functional) {
    // Enable functional scripts
    console.log('Functional enabled');
  } else {
    // Disable functional scripts
    console.log('Functional disabled');
  }
};

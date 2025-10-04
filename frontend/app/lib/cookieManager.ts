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
const CONSENT_EXPIRY_DAYS = 180;
const STORAGE_KEY = 'bantuhive_cookie_consent';

export const DEFAULT_CONSENT: CookieConsent = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: Date.now(),
  version: CONSENT_VERSION,
};

export const COOKIE_CATEGORIES = {
  essential: {
    title: 'Essential Cookies',
    description: 'Required for the website to function properly.',
    cookies: [
      'bantuhive_cookie_consent',
      'session_id',
      'csrf_token',
      'token',
      'user',
    ],
  },
  functional: {
    title: 'Functional Cookies',
    description: 'Enable enhanced functionality and personalization.',
    cookies: ['user_preferences', 'language', 'currency', 'theme'],
  },
  analytics: {
    title: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website.',
    cookies: ['_ga', '_gid', '_gat', '_gcl_au', '_fbp', 'amplitude_id'],
  },
  marketing: {
    title: 'Marketing Cookies',
    description: 'Used to track visitors across websites for advertising.',
    cookies: ['_gcl_aw', '_gcl_dc', 'fr', 'NID', 'IDE', 'test_cookie'],
  },
};

// Enhanced cookie detection with better categorization
export const getAllCookies = (): DetectedCookie[] => {
  const cookies: DetectedCookie[] = [];

  try {
    const cookieStrings = document.cookie.split(';');

    cookieStrings.forEach((cookieString) => {
      const [name, ...valueParts] = cookieString.trim().split('=');
      const value = valueParts.join('='); // Handle cookies with = in value

      if (name) {
        let category: CookieCategory = 'essential';
        const lowerName = name.toLowerCase();

        // Enhanced categorization logic
        if (
          COOKIE_CATEGORIES.functional.cookies.some(
            (cookie) =>
              lowerName.includes(cookie.toLowerCase()) ||
              cookie.toLowerCase().includes(lowerName),
          )
        ) {
          category = 'functional';
        } else if (
          COOKIE_CATEGORIES.analytics.cookies.some(
            (cookie) =>
              lowerName.includes(cookie.toLowerCase()) ||
              cookie.toLowerCase().includes(lowerName),
          )
        ) {
          category = 'analytics';
        } else if (
          COOKIE_CATEGORIES.marketing.cookies.some(
            (cookie) =>
              lowerName.includes(cookie.toLowerCase()) ||
              cookie.toLowerCase().includes(lowerName),
          )
        ) {
          category = 'marketing';
        } else if (
          COOKIE_CATEGORIES.essential.cookies.some(
            (cookie) =>
              lowerName.includes(cookie.toLowerCase()) ||
              cookie.toLowerCase().includes(lowerName),
          )
        ) {
          category = 'essential';
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
  } catch (error) {
    console.error('Error reading cookies:', error);
  }

  return cookies;
};

// Enhanced consent management
export const getSavedConsent = (): CookieConsent | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const consent: CookieConsent = JSON.parse(saved);

    // Check version and expiry
    const expiryDate = new Date(consent.timestamp);
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);

    if (new Date() > expiryDate || consent.version !== CONSENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return consent;
  } catch {
    return null;
  }
};

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

export const needsConsent = (): boolean => {
  return getSavedConsent() === null;
};

export const deleteCookie = (name: string, domain?: string): void => {
  try {
    const domains = domain
      ? [domain]
      : [
          window.location.hostname,
          '.' + window.location.hostname,
          window.location.hostname.replace(/^www\./, ''),
        ];

    const paths = ['/', '/admin', '/auth', '/dashboard'];

    domains.forEach((d) => {
      paths.forEach((p) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${d}; path=${p}; secure; samesite=lax`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${p}; secure; samesite=lax`;
      });
    });
  } catch (error) {
    console.error('Error deleting cookie:', error);
  }
};

export const deleteCookiesByCategory = (category: CookieCategory): void => {
  if (category === 'essential') return;

  const cookies = getAllCookies();
  cookies.forEach((cookie) => {
    if (cookie.category === category) {
      deleteCookie(cookie.name, cookie.domain);
    }
  });
};

export const applyConsent = (consent: CookieConsent): void => {
  // Delete cookies for disabled categories
  (['functional', 'analytics', 'marketing'] as CookieCategory[]).forEach(
    (category) => {
      if (!consent[category]) {
        deleteCookiesByCategory(category);
      }
    },
  );
};

// Enhanced script management
export const manageScripts = (consent: CookieConsent): void => {
  // Remove existing non-essential scripts
  const nonEssentialScripts = document.querySelectorAll(
    'script[data-category="analytics"], script[data-category="marketing"], script[data-category="functional"]',
  );

  nonEssentialScripts.forEach((script) => script.remove());

  // Load scripts based on consent
  if (consent.analytics) {
    loadAnalyticsScripts();
  }

  if (consent.marketing) {
    loadMarketingScripts();
  }

  if (consent.functional) {
    loadFunctionalScripts();
  }

  // Update feature visibility
  updateFeatureVisibility(consent);
};

// Feature visibility management
export const updateFeatureVisibility = (consent: CookieConsent): void => {
  // Analytics features
  const analyticsElements = document.querySelectorAll(
    '[data-requires="analytics"]',
  );
  analyticsElements.forEach((el) => {
    (el as HTMLElement).style.display = consent.analytics ? 'block' : 'none';
  });

  // Marketing features
  const marketingElements = document.querySelectorAll(
    '[data-requires="marketing"]',
  );
  marketingElements.forEach((el) => {
    (el as HTMLElement).style.display = consent.marketing ? 'block' : 'none';
  });

  // Functional features
  const functionalElements = document.querySelectorAll(
    '[data-requires="functional"]',
  );
  functionalElements.forEach((el) => {
    (el as HTMLElement).style.display = consent.functional ? 'block' : 'none';
  });
};

// Example script loaders - implement based on your actual scripts
const loadAnalyticsScripts = (): void => {
  // Load Google Analytics, etc.
  console.log('Loading analytics scripts...');
};

const loadMarketingScripts = (): void => {
  // Load Facebook Pixel, etc.
  console.log('Loading marketing scripts...');
};

const loadFunctionalScripts = (): void => {
  // Load functional scripts
  console.log('Loading functional scripts...');
};

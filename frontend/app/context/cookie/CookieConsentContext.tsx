import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CookieConsent,
  DEFAULT_CONSENT,
  getSavedConsent,
  saveConsent,
  needsConsent,
  applyConsent,
  manageScripts,
} from '@/app/lib/cookieManager';

interface CookieConsentContextType {
  consent: CookieConsent;
  showBanner: boolean;
  showSettings: boolean;
  updateConsent: (newConsent: Partial<CookieConsent>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  closeBanner: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      'useCookieConsent must be used within CookieConsentProvider',
    );
  }
  return context;
};

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Check for saved consent on mount
  useEffect(() => {
    const saved = getSavedConsent();
    if (saved) {
      setConsent(saved);
      applyConsent(saved);
      manageScripts(saved);
      setShowBanner(false);
    } else {
      setShowBanner(needsConsent());
    }
  }, []);

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    const updated = { ...consent, ...newConsent, essential: true }; // Essential always true
    setConsent(updated);
    saveConsent(updated);
    applyConsent(updated);
    manageScripts(updated);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    updateConsent({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    updateConsent({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        showBanner,
        showSettings,
        updateConsent,
        acceptAll,
        rejectAll,
        openSettings,
        closeSettings,
        closeBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

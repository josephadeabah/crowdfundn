import { useCookieConsent } from '@/app/context/cookie/CookieConsentContext';
import { Button } from '@/app/components/ui/button';
import { Cookie, Settings } from 'lucide-react';

export const CookieBanner = () => {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="w-full bg-white shadow-elegant backdrop-blur-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center max-w-7xl mx-auto">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-bantu-green to-bantu-orange flex items-center justify-center shadow-glass-lg">
              <Cookie className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold mb-1 text-card-foreground">
              We Value Your Privacy
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We're committed to your privacy. Our site uses cookies for website
              functionality, analytics, and ads. You can tailor your experience
              by accepting all cookies, customizing settings, or declining
              non-essentials in 'Preferences'. No action means no consent. You
              have full control to modify your choices at any time. For more
              details see our{' '}
              <a
                href="/info/cookies"
                className="text-bantu-green hover:text-bantu-orange underline"
              >
                Cookie Policy
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <a
              href="#"
              onClick={openSettings}
              className="bg-white text-gray-700 transition-smooth rounded-none px-3 py-1.5 flex items-center justify-center text-xs font-medium underline"
            >
              Preferences
            </a>
            <Button
              onClick={rejectAll}
              className="bg-gray-500 hover:bg-gray-700 text-white transition-smooth rounded-none text-xs px-3 py-1.5 h-auto"
            >
              Reject All
            </Button>
            <Button
              onClick={acceptAll}
              className="bg-gray-500 hover:bg-gray-700 text-white transition-smooth rounded-none text-xs px-3 py-1.5 h-auto"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

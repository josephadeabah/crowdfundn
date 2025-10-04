import { useCookieConsent } from '@/app/context/cookie/CookieConsentContext';
import { Button } from '@/app/components/ui/button';
import { Cookie, Settings } from 'lucide-react';

export const CookieBanner = () => {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="w-full bg-card shadow-elegant backdrop-blur-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center max-w-7xl mx-auto">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-bantu-green to-bantu-orange flex items-center justify-center shadow-glass-lg">
              <Cookie className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">
              We Value Your Privacy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We're committed to your privacy. Our site uses cookies for website
              functionality, analytics, and ads. You can tailor your experience
              by accepting all cookies, customizing settings, or declining
              non-essentials in 'Preferences'. No action means no consent. You
              have full control to modify your choices in 'Privacy Options' at
              any time. For more details see our{' '}
              <a
                href="/info/cookies"
                className="text-bantu-green hover:text-bantu-orange underline"
              >
                Cookie Policy
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="#"
              onClick={openSettings}
              className="gap-2 bg-gray-500 hover:bg-gray-700 text-white transition-smooth rounded-none px-4 py-2 flex items-center justify-center text-sm font-medium underline"
            >
              <Settings className="w-4 h-4 text-white mr-2" />
              Preferences
            </a>
            <Button
              onClick={rejectAll}
              className="bg-gray-500 hover:bg-gray-700 text-white transition-smooth rounded-none"
            >
              Reject All
            </Button>
            <Button
              onClick={acceptAll}
              className="bg-gray-500 hover:bg-gray-700 text-white transition-smooth rounded-none"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

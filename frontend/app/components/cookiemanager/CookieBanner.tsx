import { useCookieConsent } from '@/app/context/cookie/CookieConsentContext';
import { Button } from '@/app/components/ui/button';
import { Cookie, Settings } from 'lucide-react';

export const CookieBanner = () => {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-2xl shadow-elegant backdrop-blur-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bantu-green to-bantu-orange flex items-center justify-center shadow-glass-lg">
                <Cookie className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                We Value Your Privacy
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                BantuHive uses cookies to enhance your experience, provide
                personalized content, and analyze our traffic. You can customize
                your preferences or accept all cookies to support our platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                onClick={openSettings}
                variant="outline"
                className="gap-2 transition-smooth hover:border-bantu-green hover:text-bantu-green"
              >
                <Settings className="w-4 h-4" />
                Customize
              </Button>
              <Button
                onClick={rejectAll}
                variant="outline"
                className="transition-smooth hover:border-destructive hover:text-destructive"
              >
                Reject All
              </Button>
              <Button
                onClick={acceptAll}
                className="bg-gradient-to-r from-bantu-green to-bantu-orange hover:opacity-90 transition-smooth shadow-glass-lg text-white"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

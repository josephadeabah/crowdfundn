import { useState } from 'react';
import { useCookieConsent } from '@/app/context/cookie/CookieConsentContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { COOKIE_CATEGORIES, CookieCategory } from '@/app/lib/cookieManager';
import { Shield, BarChart3, Target, Sparkles, Save } from 'lucide-react';

const categoryIcons: Record<CookieCategory, any> = {
  essential: Shield,
  functional: Sparkles,
  analytics: BarChart3,
  marketing: Target,
};

export const CookieSettings = () => {
  const { consent, showSettings, closeSettings, updateConsent } =
    useCookieConsent();
  const [tempConsent, setTempConsent] = useState(consent);

  const handleToggle = (category: CookieCategory) => {
    if (category === 'essential') return; // Can't toggle essential
    setTempConsent((prev: typeof consent) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    updateConsent(tempConsent);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      ...consent,
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setTempConsent(allAccepted);
    updateConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected = {
      ...consent,
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setTempConsent(allRejected);
    updateConsent(allRejected);
  };

  return (
    <Dialog open={showSettings} onOpenChange={closeSettings}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-bantu-green to-bantu-orange bg-clip-text text-transparent">
            Cookie Settings
          </DialogTitle>
          <DialogDescription>
            Manage your cookie preferences. You can enable or disable different
            types of cookies below.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="preferences"
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger value="preferences" className="rounded-none">
              Preferences
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-none">
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="preferences"
            className="flex-1 overflow-y-auto space-y-4 mt-4"
          >
            {(
              Object.entries(COOKIE_CATEGORIES) as [
                CookieCategory,
                typeof COOKIE_CATEGORIES.essential,
              ][]
            ).map(([category, info]) => {
              const Icon = categoryIcons[category];
              const isEnabled = tempConsent[category];
              const isEssential = category === 'essential';

              return (
                <div
                  key={category}
                  className="border border-border rounded-xl p-4 transition-smooth hover:border-bantu-green/50 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isEnabled
                            ? 'bg-bantu-light-green text-bantu-dark-green'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-card-foreground">
                            {info.title}
                          </h4>
                          {isEssential && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-bantu-light-green text-bantu-dark-green font-medium">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {info.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => handleToggle(category)}
                      disabled={isEssential}
                      className="flex-shrink-0"
                    />
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent
            value="details"
            className="flex-1 overflow-y-auto space-y-4 mt-4"
          >
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                  What are cookies?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cookies are small text files that are placed on your device
                  when you visit a website. They help websites remember your
                  preferences and provide a better user experience.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                  How we use cookies
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  BantuHive uses cookies to:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-bantu-green">•</span>
                    <span>
                      Keep you signed in and remember your preferences
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-bantu-green">•</span>
                    <span>
                      Understand how you use our platform to improve our
                      services
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-bantu-green">•</span>
                    <span>
                      Personalize your experience and show relevant content
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-bantu-green">•</span>
                    <span>Measure the effectiveness of our campaigns</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                  Your rights
                </h3>
                <p className="text-sm text-muted-foreground">
                  You have the right to accept or reject non-essential cookies.
                  You can change your preferences at any time through this
                  settings panel. Note that disabling certain cookies may affect
                  your experience on BantuHive.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 text-card-foreground">
                  Data retention
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your cookie preferences are stored for 6 months. After this
                  period, you will be asked to review your preferences again.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            onClick={handleRejectAll}
            className="flex-1 gap-2 bg-gray-500 hover:bg-gray-700 text-white transition-smooth rounded-none"
          >
            Reject All
          </Button>
          <Button
            onClick={handleAcceptAll}
            className="flex-1 gap-2 bg-gray-500 hover:bg-gray-700 text-white transition-smooth rounded-none"
          >
            Accept All
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 gap-2 bg-gray-500 hover:bg-gray-700 text-white transition-smooth rounded-none"
          >
            <Save className="w-4 h-4 text-white" />
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
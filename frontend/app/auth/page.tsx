import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8 animate-fade-up">
        <div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-trust to-growth bg-clip-text text-transparent">
            BantuHive
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            The All-in-One Fundraiser Management Software Platform
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The all-in-one, gamified crowdfunding and micro-investment platform
            giving individuals and organizations across Ghana and its diaspora
            the power to fund and co-own high-impact startups and projects that
            shape the country's future.
          </p>
        </div>

        <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-xs">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                      💝 Donation|Grant-Based
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                      🎁 Reward-Based
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                      📈 Equity Investment
                    </div>
                  </div>

          <div className="flex gap-4 justify-center">
            <Button asChild variant="ghost" size="lg" className="bg-bantu-green">
              <Link href="/auth/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

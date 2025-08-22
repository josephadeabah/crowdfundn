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
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-trust/10 text-trust px-3 py-1 rounded-full">
              💝 Donation|Grant-Based
            </span>
            <span className="bg-growth/10 text-growth px-3 py-1 rounded-full">
              🎁 Reward-Based
            </span>
            <span className="bg-accent/10 text-accent px-3 py-1 rounded-full">
              📈 Equity Investment
            </span>
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

import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-10 animate-fade-up max-w-4xl w-full">
        {/* Main Heading */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-trust to-growth bg-clip-text text-transparent leading-tight">
              BantuHive
            </h1>
          </div>

          <div className="space-y-4">
            <p className="text-2xl md:text-3xl text-muted-foreground font-light leading-relaxed">
              The All-in-One Fundraiser Management Software Platform
            </p>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-8 font-normal">
              Revolutionizing Ghana's startup ecosystem through equity
              crowdfunding. Invest in tomorrow's unicorns, earn rewards, and
              grow wealth while fueling Africa's next generation of innovative
              businesses.
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-6">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <div className="bg-green-100 text-green-800 px-5 py-3 rounded-full font-semibold text-sm md:text-base flex items-center gap-2">
              💝 Donation|Grant-Based
            </div>
            <div className="bg-blue-100 text-blue-800 px-5 py-3 rounded-full font-semibold text-sm md:text-base flex items-center gap-2">
              🎁 Reward-Based
            </div>
            <div className="bg-purple-100 text-purple-800 px-5 py-3 rounded-full font-semibold text-sm md:text-base flex items-center gap-2">
              📈 Equity Investment
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-bantu-green text-white px-8 py-6 text-lg font-semibold hover:bg-bantu-green/90 transition-colors shadow-lg hover:shadow-xl"
            >
              <Link href="/auth/register">Get Started</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold border-2 hover:bg-accent transition-colors"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="pt-8">
          <div className="flex justify-center space-x-2 opacity-60">
            <div
              className="w-2 h-2 bg-trust rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-2 h-2 bg-growth rounded-full animate-bounce"
              style={{ animationDelay: '200ms' }}
            />
            <div
              className="w-2 h-2 bg-bantu-green rounded-full animate-bounce"
              style={{ animationDelay: '400ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

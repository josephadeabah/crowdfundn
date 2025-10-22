import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  Rocket,
  Handshake,
  Users,
  Coins,
  Globe,
  Gift,
  TrendingUp,
  Shield,
  Sparkles,
  Target,
} from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero div */}
      <div className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-fundify-primary/5 via-gray-50 to-accent/5"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent text-fundify-primary">
              How BantuHive Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Simplified fundraising to bring your ideas to life and create
              positive impact
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-fundify-primary shadow-medium hover:shadow-large transition-all"
                >
                  Start a Campaign
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/info/faqs">
                <Button size="lg" variant="outline" className="shadow-soft">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline div */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-20">The Journey</h2>

          <div className="space-y-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-slide-up">
              <div className="flex-1 order-2 md:order-1">
                <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-fundify-primary to-fundify-primary/70 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-soft">
                    1
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Choose Your Type
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Select donation-based, reward-based, or equity crowdfunding
                    based on your project goals and supporter offerings.
                  </p>
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-full">
                    <Rocket className="h-7 w-7 text-fundify-primary" />
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="rounded-2xl overflow-hidden shadow-large">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                    alt="Campaign creation"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-slide-up">
              <div className="flex-1">
                <div className="rounded-2xl overflow-hidden shadow-large">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                    alt="Partnership"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-fundify-primary to-fundify-primary/70 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-soft">
                    2
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Build Your Campaign
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Craft a compelling story with your funding goal, timeline,
                    and rewards or equity terms for supporters.
                  </p>
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-full">
                    <Handshake className="h-7 w-7 text-fundify-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-slide-up">
              <div className="flex-1 order-2 md:order-1">
                <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-fundify-primary to-fundify-primary/70 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-soft">
                    3
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Get Verified
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Complete our due diligence to
                    verify credibility and potential impact.
                  </p>
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-full">
                    <Shield className="h-7 w-7 text-fundify-primary" />
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="rounded-2xl overflow-hidden shadow-large">
                  <img
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop"
                    alt="Verification"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-slide-up">
              <div className="flex-1">
                <div className="rounded-2xl overflow-hidden shadow-large">
                  <img
                    src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=400&fit=crop"
                    alt="Launch"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-fundify-primary to-fundify-primary/70 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-soft">
                    4
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Launch & Promote
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Go live and leverage our marketing tools to reach your
                    audience across all funding types.
                  </p>
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-full">
                    <Sparkles className="h-7 w-7 text-fundify-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-center gap-12 animate-slide-up">
              <div className="flex-1 order-2 md:order-1">
                <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-large transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-fundify-primary to-fundify-primary/70 rounded-xl flex items-center justify-center text-white font-bold mb-6 shadow-soft">
                    5
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Fulfill & Deliver
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Deliver on your promises—rewards, updates, or equity
                    relationships—and build lasting trust.
                  </p>
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary rounded-full">
                    <Target className="h-7 w-7 text-fundify-primary" />
                  </div>
                </div>
              </div>
              <div className="flex-1 order-1 md:order-2">
                <div className="rounded-2xl overflow-hidden shadow-large">
                  <img
                    src="https://images.unsplash.com/photo-1521791055366-0d553872125f?w=600&h=400&fit=crop"
                    alt="Success"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Types */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Three Ways to Fund</h2>
            <p className="text-xl text-muted-foreground">
              Choose the right path for your vision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-all border border-border">
              <div className="text-5xl mb-6">💝</div>
              <h3 className="text-2xl font-bold mb-4">Donation</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Social impact projects and community initiatives focused on
                solving local problems.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  No equity given up
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Community-driven
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Transparent reporting
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-all border border-border">
              <div className="text-5xl mb-6">🎁</div>
              <h3 className="text-2xl font-bold mb-4">Rewards</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Creative projects with exclusive rewards, early access, or
                limited edition items.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Pre-order products
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Exclusive perks
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Creative support
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-all border border-border">
              <div className="text-5xl mb-6">📈</div>
              <h3 className="text-2xl font-bold mb-4">Equity</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                High-growth startups offering ownership stakes with potential
                financial returns.
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Ownership stakes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Growth potential
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-fundify-primary"></div>
                  Due diligence
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose */}
      <div className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why BantuHive?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Fully Regulated',
                desc: 'SEC licensed with investor protections',
              },
              {
                icon: Sparkles,
                title: 'Engaging Platform',
                desc: 'Gamified experience that makes funding fun',
              },
              {
                icon: Globe,
                title: 'Diaspora-Friendly',
                desc: 'Invest from anywhere in the world',
              },
              {
                icon: TrendingUp,
                title: 'Transparent',
                desc: 'Real-time updates and tracking',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                  <item.icon className="h-8 w-8 text-fundify-primary" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA div */}
      <div className="py-24 bg-gradient-to-br from-fundify-primary via-fundify-primary to-fundify-primary/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands using BantuHive to bring ideas to life
          </p>
          <Link href="/">
            <Button
              size="lg"
              variant="secondary"
              className="shadow-large hover:scale-105 transition-transform"
            >
              Start Your Campaign
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

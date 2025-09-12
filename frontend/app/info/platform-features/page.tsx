import {
  Shield,
  FileText,
  Users,
  MessageSquare,
  Award,
  BarChart3,
  TrendingUp,
  Search,
  FileCheck,
  Bell,
  Share2,
  Mail,
  Calendar,
  Zap,
  Target,
  Globe,
  Lock,
  BadgeCheck,
} from 'lucide-react';

const Features = () => {
  return (
    <div className="min-h-screen bg-white text-gray-700">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary text-center">
            Platform Features
          </h1>

          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Campaign Management
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Smart Campaign Builder
                  </h3>
                  <p className="text-sm">
                    Intuitive interface to create compelling campaigns with rich
                    media support.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Real-time Analytics
                  </h3>
                  <p className="text-sm">
                    Track performance metrics, donor engagement, and campaign
                    progress with detailed insights.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-green-600">
                    Multi-funding Models
                  </h3>
                  <p className="text-sm">
                    Support for donation, reward-based, and equity crowdfunding
                    in one platform.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Payment & Security
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Mobile Money Integration
                  </h3>
                  <p className="text-sm">
                    Seamless integration with MTN, Vodafone, and AirtelTigo
                    mobile money services.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Bank-grade Security
                  </h3>
                  <p className="text-sm">
                    256-bit SSL encryption, PCI DSS compliance, and fraud
                    detection systems.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-green-600">
                    Escrow Services
                  </h3>
                  <p className="text-sm">
                    Secure fund holding and automated disbursement based on
                    milestone completion.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Investor Tools
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Portfolio Dashboard
                  </h3>
                  <p className="text-sm mb-3">
                    Comprehensive overview of all investments with performance
                    tracking and updates.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>• Investment performance metrics</li>
                    <li>• Dividend and return tracking</li>
                    <li>• Project milestone notifications</li>
                    <li>• Automated certificate generation</li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Technical & Marketing
                  </h3>
                  <p className="text-sm mb-3">Support Plans</p>
                  <ul className="text-xs space-y-1">
                    <li>
                      • Choose the perfect support plan for your crowdfunding
                      campaign
                    </li>
                    <li>
                      • Get expert guidance tailored to your fundraising goals
                    </li>
                    <li>
                      • Dedicated technical assistance to keep your campaign
                      running smoothly
                    </li>
                    <li>
                      • Marketing strategies designed to boost visibility and
                      attract backers
                    </li>
                    <li>• Ongoing optimization for maximum campaign success</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                KYC & Compliance
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-trust" />
                    <h3 className="font-semibold text-trust">
                      Tiered KYC System
                    </h3>
                  </div>
                  <p className="text-sm mb-3">
                    Multi-level verification system with progressive
                    requirements.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>• Level 1: Issuer identity verification</li>
                    <li>• Level 2: Investor due diligence</li>
                    <li>• Level 3: Full accreditation verification</li>
                    <li>• Level 4: Mentorship verification</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <FileCheck className="w-5 h-5 text-growth" />
                    <h3 className="font-semibold text-growth">
                      Automated Certificate Generation
                    </h3>
                  </div>
                  <p className="text-sm mb-3">
                    Instant digital certificates for investments and compliance.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>• Investment confirmation certificates</li>
                    <li>• Equity ownership certificates</li>
                    <li>• Mentorship completion certificates</li>
                  </ul>
                </div>

                {/* <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <BadgeCheck className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-600">
                      Regulatory Compliance
                    </h3>
                  </div>
                  <p className="text-sm">
                    Automated generation of SEC Ghana and tax compliance reports
                    with complete audit trails.
                  </p>
                </div> */}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Community & Engagement
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-trust" />
                    <h3 className="font-semibold text-trust">
                      Investor Community Hub
                    </h3>
                  </div>
                  <p className="text-sm mb-3">
                    Connect with other investors and founders.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>• Discussion forums and groups</li>
                    <li>• Live Q&A sessions with founders</li>
                    <li>• Investor networking events</li>
                    <li>• Expert webinars and workshops</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-growth" />
                    <h3 className="font-semibold text-growth">
                      Real-time Updates
                    </h3>
                  </div>
                  <p className="text-sm mb-3">
                    Stay informed with comprehensive update system.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>• Project milestone notifications</li>
                    <li>• Financial performance updates</li>
                    <li>• Market intelligence alerts</li>
                    <li>• Regulatory change notifications</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-600">
                      Recognition System
                    </h3>
                  </div>
                  <p className="text-sm">
                    Gamified engagement with badges and rewards for active
                    participation and successful investments.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Marketing & Analytics
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Share2 className="w-5 h-5 text-trust" />
                    <h3 className="font-semibold text-trust">
                      Social Media Integration
                    </h3>
                  </div>
                  <p className="text-sm">
                    One-click sharing to Facebook, Twitter, WhatsApp, and other
                    platforms with automated campaign promotion.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-growth" />
                    <h3 className="font-semibold text-growth">
                      Marketing Automation
                    </h3>
                  </div>
                  <p className="text-sm">
                    Built-in email campaigns, newsletters, investor update
                    automation, and targeted communication tools.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Advanced Features
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-trust" />
                    <h3 className="font-semibold text-trust text-sm">
                      Smart Notifications
                    </h3>
                  </div>
                  <p className="text-xs">
                    AI-powered alerts for investment opportunities and risks.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-growth" />
                    <h3 className="font-semibold text-growth text-sm">
                      Goal Tracking
                    </h3>
                  </div>
                  <p className="text-xs">
                    Set and monitor investment goals with progress tracking.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-600 text-sm">
                      Multi-currency
                    </h3>
                  </div>
                  <p className="text-xs">
                    Support for GHS, USD, EUR, GBP with auto-conversion.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-warning" />
                    <h3 className="font-semibold text-warning text-sm">
                      Document Vault
                    </h3>
                  </div>
                  <p className="text-xs">
                    Secure storage for all investment documents and
                    certificates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;

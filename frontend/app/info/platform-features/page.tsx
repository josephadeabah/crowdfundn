const Features = () => {
  return (
    <div className="min-h-screen bg-background">
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
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Due Diligence Tools
                  </h3>
                  <p className="text-sm mb-3">
                    Advanced tools for evaluating investment opportunities and
                    risks.
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>• Financial statement analysis</li>
                    <li>• Market research integration</li>
                    <li>• Risk assessment matrices</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Compliance & Reporting
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    KYC/AML Automation
                  </h3>
                  <p className="text-sm">
                    Automated identity verification and anti-money laundering
                    compliance checks.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Regulatory Reporting
                  </h3>
                  <p className="text-sm">
                    Automated generation of SEC Ghana and tax compliance
                    reports.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-green-600">
                    Audit Trail
                  </h3>
                  <p className="text-sm">
                    Complete transaction history and compliance documentation
                    for regulatory review.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Marketing & Engagement
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Social Media Integration
                  </h3>
                  <p className="text-sm">
                    One-click sharing to Facebook, Twitter, WhatsApp, and other
                    platforms.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Email Marketing Suite
                  </h3>
                  <p className="text-sm">
                    Built-in email campaigns, newsletters, and investor update
                    automation.
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

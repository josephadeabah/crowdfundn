const InvestorGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary">
            Investor Guide
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Everything you need to know about investing through BantuHive's
            crowdfunding platform.
          </p>

          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Getting Started as an Investor
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Account Setup
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Complete KYC verification with Ghana Card</li>
                    <li>• Provide proof of address and income</li>
                    <li>• Set up secure payment methods</li>
                    <li>• Complete investor suitability assessment</li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Investment Limits
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Individual investors: GHS 50,000/year maximum</li>
                    <li>• Accredited investors: Higher limits apply</li>
                    <li>• Minimum investment: GHS 50 per project</li>
                    <li>• 48-hour cooling-off period for all investments</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Investment Types
              </h2>
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border border-accent/20">
                  <h3 className="font-semibold mb-3 text-growth">
                    Donation/Grant Support
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>What it is:</strong>
                      <p className="mt-1">
                        Financial support for social causes with no expectation
                        of financial return.
                      </p>
                    </div>
                    <div>
                      <strong>Benefits:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Tax deductions for charitable giving</li>
                        <li>• Direct social impact</li>
                        <li>• Regular impact reports</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border border-trust/20">
                  <h3 className="font-semibold mb-3 text-trust">
                    Reward-Based Investment
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>What it is:</strong>
                      <p className="mt-1">
                        Pre-purchase products or services at discounted rates or
                        exclusive access.
                      </p>
                    </div>
                    <div>
                      <strong>Benefits:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Early access to products</li>
                        <li>• Discounted pricing</li>
                        <li>• Exclusive rewards and experiences</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border border-growth/20">
                  <h3 className="font-semibold mb-3 text-growth">
                    Equity Investment
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>What it is:</strong>
                      <p className="mt-1">
                        Purchasing ownership stakes in companies with potential
                        for financial returns.
                      </p>
                    </div>
                    <div>
                      <strong>Benefits:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Potential capital appreciation</li>
                        <li>• Dividend payments</li>
                        <li>• Voting rights in company decisions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Due Diligence Framework
              </h2>
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Financial Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Revenue Model:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Understand how the company makes money</li>
                        <li>• Analyze market size and potential</li>
                        <li>• Review growth projections</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Financial Health:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Review audited financial statements</li>
                        <li>• Assess cash flow and burn rate</li>
                        <li>• Evaluate debt and equity structure</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">
                    Management Team Assessment
                  </h3>
                  <div className="text-sm space-y-2">
                    <p>• Track record and relevant experience</p>
                    <p>• Leadership and execution capabilities</p>
                    <p>• Transparency in communication</p>
                    <p>• Alignment of interests with investors</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Risk Management
              </h2>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-destructive">
                    Common Risks
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      • <strong>Market Risk:</strong> Changes in economic
                      conditions
                    </li>
                    <li>
                      • <strong>Liquidity Risk:</strong> Difficulty selling
                      investments
                    </li>
                    <li>
                      • <strong>Company Risk:</strong> Business failure or poor
                      performance
                    </li>
                    <li>
                      • <strong>Regulatory Risk:</strong> Changes in laws and
                      regulations
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Risk Mitigation
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      • <strong>Diversification:</strong> Spread investments
                      across sectors
                    </li>
                    <li>
                      • <strong>Due Diligence:</strong> Thorough research before
                      investing
                    </li>
                    <li>
                      • <strong>Investment Limits:</strong> Never invest more
                      than you can afford to lose
                    </li>
                    <li>
                      • <strong>Regular Monitoring:</strong> Track performance
                      and updates
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Portfolio Management
              </h2>
              <div className="space-y-4">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3">
                    Diversification Strategy
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>By Sector:</strong>
                      <p className="mt-1">
                        Technology, Agriculture, Healthcare, Finance,
                        Manufacturing
                      </p>
                    </div>
                    <div>
                      <strong>By Stage:</strong>
                      <p className="mt-1">
                        Early-stage, Growth-stage, Mature companies
                      </p>
                    </div>
                    <div>
                      <strong>By Geography:</strong>
                      <p className="mt-1">
                        Accra, Kumasi, Takoradi, Rural areas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3">
                    Monitoring Your Investments
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Regular review of company updates and reports</li>
                    <li>• Track key performance indicators (KPIs)</li>
                    <li>• Engage with management through investor updates</li>
                    <li>
                      • Utilize BantuHive's portfolio dashboard for insights
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Tax Implications
              </h2>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="font-semibold mb-4">Ghana Tax Considerations</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <strong>Capital Gains Tax:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• 15% on gains from equity investments</li>
                      <li>• Exemptions for certain long-term holdings</li>
                      <li>• Proper documentation required</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Dividend Tax:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• 8% withholding tax on dividend income</li>
                      <li>• Tax certificates provided by companies</li>
                      <li>• Quarterly reporting requirements</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  *This is general information only. Consult a qualified tax
                  professional for advice specific to your situation.
                </p>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Investor Support</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <strong>Investment Advisory</strong>
                  <p>Email: investors@bantuhive.com</p>
                  <p>Phone: +233 (0) 302 123 4567</p>
                  <p>Investment Hotline: +233 (0) 200 000 000</p>
                </div>
                <div>
                  <strong>Educational Resources</strong>
                  <p>Webinars: Every Wednesday 2:00 PM GMT</p>
                  <p>One-on-one consultations available</p>
                  <p>Investor community forum access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorGuide;

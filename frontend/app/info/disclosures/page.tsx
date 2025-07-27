const Disclosures = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary">
            Investment Disclosures
          </h1>

          <div className="space-y-8 text-foreground">
            <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
              <h2 className="text-xl font-semibold mb-4 text-destructive">
                ⚠️ Important Risk Warning
              </h2>
              <p className="leading-relaxed font-medium">
                Investing in startups and early-stage businesses involves
                substantial risk of loss and is suitable only for persons who
                can afford to lose their entire investment. You should not
                invest more than you can afford to lose.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                General Investment Risks
              </h2>
              <div className="space-y-4">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-destructive">
                    Loss of Capital Risk
                  </h3>
                  <p className="text-sm leading-relaxed">
                    You may lose some or all of your investment. Startups and
                    early-stage companies have high failure rates, and there is
                    no guarantee that you will receive any return on your
                    investment or recover your initial capital.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-destructive">
                    Liquidity Risk
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Investments in private companies are highly illiquid. There
                    is no established secondary market for these securities, and
                    you may not be able to sell your investment when you want to
                    or at a favorable price.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-destructive">
                    Dilution Risk
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Your ownership percentage may be reduced in future funding
                    rounds as companies issue additional shares to new
                    investors, potentially diminishing the value of your
                    investment.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Platform-Specific Risks
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Technology Risk</h3>
                  <p className="leading-relaxed mb-2">
                    BantuHive's platform relies on technology systems that may
                    experience downtime, security breaches, or technical
                    failures that could affect your ability to access your
                    account or execute transactions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Regulatory Risk</h3>
                  <p className="leading-relaxed mb-2">
                    Changes in securities laws or regulations in Ghana or other
                    jurisdictions may affect the operation of the platform or
                    the value of your investments.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Crowdfunding Risk
                  </h3>
                  <p className="leading-relaxed mb-2">
                    Crowdfunding investments are speculative and may not be
                    suitable for all investors. Limited information may be
                    available about the companies you invest in compared to
                    publicly traded companies.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Investor Eligibility & Suitability
              </h2>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="font-semibold mb-3">
                  Before Investing, Consider Whether:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ You can afford to lose your entire investment</li>
                  <li>✓ You understand that returns are not guaranteed</li>
                  <li>
                    ✓ You can commit funds for an extended period (typically
                    5-10 years)
                  </li>
                  <li>✓ You have sufficient liquidity in other investments</li>
                  <li>✓ You understand the risks of early-stage investing</li>
                  <li>
                    ✓ This investment fits your overall investment strategy
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Due Diligence Limitations
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed">
                  While BantuHive conducts basic verification of companies on
                  the platform, we do not guarantee the accuracy or completeness
                  of information provided by issuers. Investors are responsible
                  for conducting their own due diligence.
                </p>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    Information Limitations
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>
                      Financial projections are estimates and may not be
                      achieved
                    </li>
                    <li>Past performance does not guarantee future results</li>
                    <li>Company valuations may be subjective or optimistic</li>
                    <li>Management experience may be limited</li>
                    <li>Market assumptions may prove incorrect</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Fees & Charges
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Investor Fees
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Platform fee: 2% of investment amount</li>
                    <li>• Payment processing: 1.5% per transaction</li>
                    <li>
                      • Currency conversion: 0.5% (for diaspora investors)
                    </li>
                    <li>• Account maintenance: Free</li>
                    <li>
                      • Exit fees: 1% of proceeds (equity investments only)
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Issuer Fees
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Listing fee: 1% of target raise</li>
                    <li>• Success fee: 5% of funds raised</li>
                    <li>• Due diligence: GHS 2,000 - 10,000</li>
                    <li>• Legal documentation: GHS 5,000 - 15,000</li>
                    <li>• Ongoing reporting: GHS 500/quarter</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Tax Implications
              </h2>
              <div className="space-y-4">
                <div className="bg-accent/10 p-6 rounded-lg border border-accent/20">
                  <h3 className="font-semibold mb-3 text-growth">
                    Tax Advisory Notice
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Tax treatment of investments through BantuHive depends on
                    your individual circumstances and may change. You should
                    consult with a qualified tax advisor regarding the tax
                    implications of your investments.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Potential Tax Obligations
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>
                      Capital gains tax on profitable exits (may qualify for
                      reduced rates)
                    </li>
                    <li>Income tax on dividends received</li>
                    <li>Withholding tax for non-resident investors</li>
                    <li>Currency gains/losses for diaspora investors</li>
                    <li>
                      Annual reporting requirements to Ghana Revenue Authority
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Investor Protections
              </h2>
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Legal Protections</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>All investments governed by Ghanaian law</li>
                  <li>Standardized investment documentation</li>
                  <li>Regular reporting requirements for issuers</li>
                  <li>Dispute resolution mechanisms</li>
                  <li>SEC Ghana oversight and regulation</li>
                </ul>

                <h3 className="text-lg font-medium mb-2 mt-4">
                  Platform Protections
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Segregated client money accounts</li>
                  <li>Professional indemnity insurance</li>
                  <li>Cyber security measures and data protection</li>
                  <li>Annual independent audits</li>
                  <li>Investor complaint resolution process</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Important Notices</h2>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Not Investment Advice:</strong> Information on this
                  platform does not constitute investment advice. All investment
                  decisions are your responsibility.
                </p>
                <p>
                  <strong>Forward-Looking Statements:</strong> Any projections
                  or forecasts are estimates only and should not be relied upon
                  as fact.
                </p>
                <p>
                  <strong>Cooling-Off Period:</strong> You have 48 hours to
                  cancel any investment after commitment.
                </p>
                <p>
                  <strong>Regular Updates:</strong> This disclosure document is
                  updated quarterly. Please review the latest version before
                  investing.
                </p>
                <p className="font-semibold">
                  Last Updated: January 2025 | Document Version: 1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclosures;

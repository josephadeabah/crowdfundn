const InvestmentCompliance = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary">
            Investment Compliance
          </h1>

          <div className="space-y-8 text-foreground">
            <div className="bg-card p-6 rounded-lg border border-accent/20">
              <h2 className="text-xl font-semibold mb-4 text-orange-600">
                Compliance Framework
              </h2>
              <p className="leading-relaxed">
                BantuHive maintains the highest standards of investment
                compliance in accordance with Ghanaian law and international
                best practices to protect both investors and issuers on our
                platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Anti-Money Laundering (AML) Compliance
              </h2>
              <div className="space-y-4">
                <p className="leading-relaxed">
                  BantuHive implements comprehensive AML procedures in
                  compliance with the Anti-Money Laundering Act, 2020 (Act 1044)
                  and guidance from the Financial Intelligence Centre (FIC) of
                  Ghana.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold mb-3 text-trust">
                      Customer Due Diligence
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        • Identity verification with Ghana Card or Passport
                      </li>
                      <li>• Address verification with utility bills</li>
                      <li>• Source of funds documentation</li>
                      <li>• Enhanced due diligence for high-risk customers</li>
                      <li>• Ongoing monitoring of transactions</li>
                    </ul>
                  </div>
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold mb-3 text-growth">
                      Transaction Monitoring
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Real-time transaction screening</li>
                      <li>• Suspicious activity detection algorithms</li>
                      <li>• Threshold reporting to FIC Ghana</li>
                      <li>• Currency transaction reports (CTRs)</li>
                      <li>• Sanctions list screening</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-secondary">
                Know Your Customer (KYC) Requirements
              </h2>
              <p className="leading-relaxed mb-4">
                All platform users must complete comprehensive KYC verification
                before participating in any investment activities:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Individual Investors
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Valid government-issued photo ID (Ghana Card, Passport, or
                      Driver's License)
                    </li>
                    <li>
                      Proof of address (utility bill or bank statement within 3
                      months)
                    </li>
                    <li>Tax Identification Number (TIN)</li>
                    <li>Employment and income verification</li>
                    <li>Investment experience questionnaire</li>
                    <li>Risk tolerance assessment</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Corporate Investors
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Certificate of incorporation from Registrar General's
                      Department
                    </li>
                    <li>Memorandum and Articles of Association</li>
                    <li>Board resolution authorizing investments</li>
                    <li>
                      Beneficial ownership declaration (Form 5 - Beneficial
                      Ownership)
                    </li>
                    <li>Authorized signatories documentation</li>
                    <li>Audited financial statements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Investor Protection Measures
              </h2>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Suitability Assessment
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Investment objectives evaluation</li>
                    <li>Financial situation analysis</li>
                    <li>Risk tolerance measurement</li>
                    <li>Investment experience review</li>
                    <li>Concentration limits enforcement</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Risk Disclosure</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Comprehensive risk warnings</li>
                    <li>Investment-specific risk factors</li>
                    <li>Liquidity risk notifications</li>
                    <li>Market risk explanations</li>
                    <li>Platform risk disclosures</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Compliance Monitoring & Reporting
              </h2>
              <div className="space-y-4">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3">Internal Controls</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Designated Compliance Officer (DCO)</li>
                    <li>• Regular compliance audits and reviews</li>
                    <li>• Staff training and certification programs</li>
                    <li>• Policy updates and regulatory change management</li>
                    <li>• Incident reporting and remediation procedures</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3">External Reporting</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Quarterly compliance reports to SEC Ghana</li>
                    <li>• Suspicious transaction reports to FIC Ghana</li>
                    <li>• Annual independent compliance audit</li>
                    <li>• Regulatory examination cooperation</li>
                    <li>• Investor complaint tracking and resolution</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Data Protection & Privacy
              </h2>
              <p className="leading-relaxed mb-4">
                In compliance with the Data Protection Act, 2012 (Act 843) and
                emerging data privacy regulations:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Secure data storage with encryption at rest and in transit
                </li>
                <li>
                  Limited data collection for legitimate business purposes only
                </li>
                <li>Regular security assessments and penetration testing</li>
                <li>Data breach notification procedures</li>
                <li>Customer data access and deletion rights</li>
              </ul>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Compliance Contact</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Chief Compliance Officer</strong>
                </p>
                <p>BantuHive Ltd</p>
                <p>Email: compliance@bantuhive.com</p>
                <p>Phone: +233 (0) 302 123 4567</p>
                <p>Address: East Legon, Accra, Ghana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCompliance;

const TrustSafety = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary">
            Trust & Safety
          </h1>

          <div className="space-y-8 text-gray-700">
            <div className="bg-card p-6 rounded-lg border border-trust/20">
              <h2 className="text-xl font-semibold mb-4 text-trust">
                Our Commitment to Safety
              </h2>
              <p className="leading-relaxed">
                BantuHive prioritizes the safety and security of all users
                through comprehensive verification, monitoring, and protection
                measures designed to create a trustworthy crowdfunding
                environment.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Project Verification
              </h2>
              <div className="space-y-4">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Rigorous Screening Process
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Business registration verification</li>
                    <li>• Founder background checks</li>
                    <li>• Financial statement review</li>
                    <li>• Market validation assessment</li>
                    <li>• Legal compliance verification</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Ongoing Monitoring
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Regular progress reporting requirements</li>
                    <li>• Milestone tracking and verification</li>
                    <li>• Financial audit compliance</li>
                    <li>• Investor communication standards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Investor Protection
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Fund Security
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Escrow account protection</li>
                    <li>• Insurance coverage</li>
                    <li>• Fraud detection systems</li>
                    <li>• Secure payment processing</li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Transparency Measures
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time fund tracking</li>
                    <li>• Public project updates</li>
                    <li>• Audited financial reports</li>
                    <li>• Open communication channels</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Platform Security
              </h2>
              <div className="space-y-4">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3">Technical Security</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 256-bit SSL encryption for all data transmission</li>
                    <li>• Multi-factor authentication (MFA)</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• SOC 2 Type II compliance</li>
                    <li>• GDPR-compliant data handling</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Risk Management
              </h2>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Investment Risks</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Clear risk disclosure for all investment types</li>
                    <li>Suitability assessments for investors</li>
                    <li>Investment limits based on income</li>
                    <li>Cooling-off periods for major investments</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Fraud Prevention</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>AI-powered fraud detection algorithms</li>
                    <li>Identity verification through Ghana Card</li>
                    <li>Banking relationship verification</li>
                    <li>Suspicious activity monitoring</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-600">
                Dispute Resolution
              </h2>
              <div className="bg-card p-6 rounded-lg border">
                <p className="leading-relaxed mb-4">
                  We maintain a structured dispute resolution process to handle
                  conflicts fairly and efficiently:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Internal mediation services</li>
                  <li>External arbitration through Ghana Arbitration Centre</li>
                  <li>Legal recourse through Ghana Commercial Courts</li>
                  <li>Insurance claims processing for covered events</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Report Safety Concerns
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Trust & Safety Team</strong>
                </p>
                <p>Email: safety@bantuhive.com</p>
                <p>Phone: +233 (0) 302 123 4567</p>
                <p>24/7 Emergency Hotline: +233 (0) 200 000 000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSafety;

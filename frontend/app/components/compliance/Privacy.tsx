import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">
            How we protect and handle your personal information
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-muted-foreground mb-8">
              <strong>Last Updated:</strong> December 2024
              <br />
              <strong>Effective Date:</strong> January 1, 2025
            </p>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                BantuHive Ltd. ("we," "our," or "us") respects your privacy and
                is committed to protecting your personal data. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our crowdfunding platform in
                compliance with Ghana's Data Protection Act, 2012 (Act 843).
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. Data Controller Information
              </h2>
              <div className="bg-muted p-6 rounded-lg">
                <p>
                  <strong>BantuHive Ltd.</strong>
                </p>
                <p>Company Registration: CS185241124</p>
                <p>Data Protection Officer: privacy@bantuhive.com</p>
                <p>Address: Digital Address: GA-594-7744, Takoradi, Ghana</p>
                <p>Phone: +233 (0) 200 415 683</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold mb-3">
                3.1 Personal Information
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Full name and contact details (email, phone, address)</li>
                <li>Date of birth and nationality</li>
                <li>Government-issued identification documents</li>
                <li>Tax identification numbers</li>
                <li>Employment and income information</li>
                <li>Bank account and payment information</li>
                <li>Investment experience and sophistication levels</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">
                3.2 Technical Information
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Usage patterns and platform interactions</li>
                <li>Cookies and tracking technologies</li>
                <li>Location data (with consent)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">
                3.3 Financial Information
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Transaction history and amounts</li>
                <li>Investment portfolio information</li>
                <li>Source of funds documentation</li>
                <li>Risk assessment data</li>
                <li>Anti-money laundering (AML) checks</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. How We Use Your Information
              </h2>

              <h3 className="text-xl font-semibold mb-3">
                4.1 Platform Operations
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Account creation and management</li>
                <li>Processing investments and transactions</li>
                <li>Facilitating crowdfunding campaigns</li>
                <li>Providing customer support</li>
                <li>Sending important platform updates</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">
                4.2 Regulatory Compliance
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Know Your Customer (KYC) verification</li>
                <li>Anti-Money Laundering (AML) monitoring</li>
                <li>Securities regulation compliance</li>
                <li>Tax reporting requirements</li>
                <li>Regulatory reporting to SEC Ghana and BoG</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">
                4.3 Risk Management
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Fraud prevention and detection</li>
                <li>Investment suitability assessments</li>
                <li>Platform security monitoring</li>
                <li>Dispute resolution support</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                5. Legal Basis for Processing
              </h2>
              <p>We process your personal data based on:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  <strong>Contract:</strong> To fulfill our services agreement
                  with you
                </li>
                <li>
                  <strong>Legal Obligation:</strong> To comply with financial
                  regulations
                </li>
                <li>
                  <strong>Legitimate Interest:</strong> For fraud prevention and
                  platform security
                </li>
                <li>
                  <strong>Consent:</strong> For marketing communications and
                  optional features
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Information Sharing and Disclosure
              </h2>

              <h3 className="text-xl font-semibold mb-3">
                6.1 Regulatory Authorities
              </h3>
              <p>We may share information with:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>Securities and Exchange Commission Ghana (SEC Ghana)</li>
                <li>Bank of Ghana (BoG)</li>
                <li>Ghana Revenue Authority (GRA)</li>
                <li>Financial Intelligence Centre (FIC)</li>
                <li>Other regulatory bodies as required by law</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">
                6.2 Service Providers
              </h3>
              <p>We work with trusted third-party providers for:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  Payment processing (MTN Mobile Money, Vodafone Cash, banks)
                </li>
                <li>Identity verification services</li>
                <li>Cloud hosting and data storage</li>
                <li>Email and communication services</li>
                <li>Legal and professional services</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">6.3 Platform Users</h3>
              <p>Limited information may be shared with:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>Project creators (for investment tracking)</li>
                <li>Other investors (aggregated, anonymized data)</li>
                <li>Public project information (as disclosed by creators)</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
              <p>We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>SSL/TLS encryption for data transmission</li>
                <li>AES-256 encryption for data storage</li>
                <li>Multi-factor authentication requirements</li>
                <li>Regular security audits and penetration testing</li>
                <li>Employee background checks and training</li>
                <li>Segregated network infrastructure</li>
                <li>Regular backup and disaster recovery procedures</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
              <p>
                We retain personal data for different periods based on purpose:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  <strong>Account Information:</strong> 7 years after account
                  closure
                </li>
                <li>
                  <strong>Transaction Records:</strong> 10 years (regulatory
                  requirement)
                </li>
                <li>
                  <strong>KYC Documentation:</strong> 5 years after last
                  transaction
                </li>
                <li>
                  <strong>Marketing Data:</strong> Until consent is withdrawn
                </li>
                <li>
                  <strong>Legal Records:</strong> As required by applicable law
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Your Rights</h2>
              <p>Under Ghana's Data Protection Act, you have the right to:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  <strong>Access:</strong> Request copies of your personal data
                </li>
                <li>
                  <strong>Rectification:</strong> Correct inaccurate or
                  incomplete data
                </li>
                <li>
                  <strong>Erasure:</strong> Request deletion (subject to legal
                  obligations)
                </li>
                <li>
                  <strong>Restriction:</strong> Limit processing in certain
                  circumstances
                </li>
                <li>
                  <strong>Portability:</strong> Receive data in a
                  machine-readable format
                </li>
                <li>
                  <strong>Object:</strong> Opt-out of certain processing
                  activities
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> For consent-based
                  processing
                </li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at privacy@bantuhive.com
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. International Transfers
              </h2>
              <p>
                Some of our service providers may be located outside Ghana. We
                ensure adequate protection through:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  Adequacy decisions by Ghana's Data Protection Commission
                </li>
                <li>Standard contractual clauses</li>
                <li>Binding corporate rules</li>
                <li>Certification schemes</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                11. Cookies and Tracking
              </h2>
              <p>We use cookies and similar technologies for:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>Essential platform functionality</li>
                <li>Security and fraud prevention</li>
                <li>Analytics and performance monitoring</li>
                <li>Personalized user experience</li>
                <li>Marketing and advertising (with consent)</li>
              </ul>
              <p className="mt-4">
                See our Cookie Policy for detailed information.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                12. Children's Privacy
              </h2>
              <p>
                BantuHive is not intended for individuals under 18 years of age.
                We do not knowingly collect personal information from children
                under 18.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                13. Updates to This Policy
              </h2>
              <p>
                We may update this Privacy Policy periodically. Material changes
                will be communicated via email or prominent platform notices at
                least 30 days before taking effect.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                14. Contact Information
              </h2>
              <p>For privacy-related questions or concerns:</p>
              <div className="mt-4">
                <p>
                  <strong>Data Protection Officer</strong>
                </p>
                <p>Email: privacy@bantuhive.com</p>
                <p>Phone: +233 (0) 302 123 456</p>
                <p>Address: Digital Address: GA-594-7744, Takoradi, Ghana</p>
              </div>
              <p className="mt-4">
                You also have the right to lodge a complaint with Ghana's Data
                Protection Commission if you believe we have violated your
                privacy rights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

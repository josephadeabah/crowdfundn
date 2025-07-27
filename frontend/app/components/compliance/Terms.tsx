import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl opacity-90">
            Legal terms governing your use of BantuHive
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
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using BantuHive ("Platform"), operated by
                BantuHive Ltd., a company registered in Ghana, you agree to be
                bound by these Terms of Service ("Terms"). If you do not agree
                to these Terms, you may not use our Platform.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. Platform Description
              </h2>
              <p>
                BantuHive is a crowdfunding and micro-investment platform that
                facilitates three types of funding:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  <strong>Donation/Grant-Based:</strong> Non-repayable funding
                  for projects and causes
                </li>
                <li>
                  <strong>Reward-Based:</strong> Funding in exchange for
                  products, services, or perks
                </li>
                <li>
                  <strong>Equity Investment:</strong> Investment in exchange for
                  ownership stakes in companies
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. Regulatory Compliance
              </h2>
              <p>
                BantuHive operates under the regulatory framework of Ghana,
                including but not limited to:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  Securities and Exchange Commission Ghana (SEC Ghana)
                  regulations
                </li>
                <li>Bank of Ghana (BoG) payment services regulations</li>
                <li>Companies Act, 2019 (Act 992)</li>
                <li>Data Protection Act, 2012 (Act 843)</li>
                <li>Electronic Transactions Act, 2008 (Act 772)</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. User Eligibility
              </h2>
              <p>To use BantuHive, you must:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  Be at least 18 years old or the age of majority in your
                  jurisdiction
                </li>
                <li>Have legal capacity to enter into binding agreements</li>
                <li>Provide accurate and complete registration information</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>
                  Not be prohibited from using financial services under any
                  applicable law
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                5. Project Creator Obligations
              </h2>
              <p>As a project creator, you agree to:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  Provide truthful, accurate, and complete information about
                  your project
                </li>
                <li>Use funds raised only for the stated project purposes</li>
                <li>
                  Fulfill all promised rewards and deliverables in a timely
                  manner
                </li>
                <li>Maintain transparent communication with funders</li>
                <li>
                  Comply with all applicable securities laws for equity
                  offerings
                </li>
                <li>Provide regular progress updates to stakeholders</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Investor/Funder Rights and Responsibilities
              </h2>
              <p>As an investor or funder, you understand that:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  All investments carry risk, including total loss of capital
                </li>
                <li>Past performance does not guarantee future results</li>
                <li>
                  You must conduct your own due diligence before investing
                </li>
                <li>
                  Equity investments are subject to securities regulations
                </li>
                <li>Rewards and deliverables are not guaranteed</li>
                <li>
                  Refunds are subject to project-specific terms and our refund
                  policy
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Platform Fees</h2>
              <p>BantuHive charges the following fees:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  Platform fee: 5% of funds raised for successful campaigns
                </li>
                <li>
                  Payment processing fees: 2.9% + GHS 1.50 per transaction
                </li>
                <li>Equity transaction fees: 2% of investment amount</li>
                <li>Premium features: As detailed in our pricing page</li>
              </ul>
              <p className="mt-4">
                All fees are clearly disclosed before transactions are
                completed.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                8. Prohibited Activities
              </h2>
              <p>You may not use BantuHive to:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>Fund illegal activities or prohibited businesses</li>
                <li>
                  Engage in fraudulent, deceptive, or misleading practices
                </li>
                <li>Violate intellectual property rights</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Circumvent platform security measures</li>
                <li>Create multiple accounts to evade restrictions</li>
                <li>Engage in money laundering or terrorist financing</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                9. Intellectual Property
              </h2>
              <p>
                BantuHive respects intellectual property rights. Users retain
                ownership of their content but grant BantuHive a license to use,
                display, and promote their projects. Users must not infringe on
                third-party intellectual property rights.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. Dispute Resolution
              </h2>
              <p>
                Disputes will be resolved through binding arbitration in
                accordance with the Alternative Dispute Resolution Act, 2010
                (Act 798) of Ghana. The arbitration will be conducted in Accra,
                Ghana, in English.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                11. Limitation of Liability
              </h2>
              <p>
                BantuHive's liability is limited to the maximum extent permitted
                by Ghanaian law. We are not liable for project failures,
                investment losses, or indirect damages.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
              <p>
                We may terminate or suspend accounts for violations of these
                Terms. Users may terminate their accounts at any time, subject
                to ongoing obligations.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
              <p>
                These Terms are governed by the laws of Ghana. Any legal
                proceedings must be brought in the courts of Ghana.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                14. Changes to Terms
              </h2>
              <p>
                We may update these Terms periodically. Users will be notified
                of material changes via email or platform notifications.
                Continued use constitutes acceptance of updated Terms.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                15. Contact Information
              </h2>
              <p>For questions about these Terms, contact us at:</p>
              <div className="mt-4">
                <p>
                  <strong>BantuHive Ltd.</strong>
                </p>
                <p>Email: legal@bantuhive.com</p>
                <p>Phone: +233 (0) 302 123 456</p>
                <p>Address: Digital Address: GA-594-7744, Takoradi, Ghana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;

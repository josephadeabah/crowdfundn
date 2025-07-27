import React from 'react';

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl opacity-90">
            How we use cookies and tracking technologies
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
                This Cookie Policy explains how BantuHive Ltd. ("we," "our," or
                "us") uses cookies and similar tracking technologies on our
                crowdfunding platform. This policy should be read alongside our
                Privacy Policy and Terms of Service.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                2. What Are Cookies?
              </h2>
              <p>
                Cookies are small text files that are placed on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences, analyzing how you
                use our platform, and improving our services.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                Types of Cookies We Use:
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Session Cookies:</strong> Temporary cookies that
                  expire when you close your browser
                </li>
                <li>
                  <strong>Persistent Cookies:</strong> Cookies that remain on
                  your device for a set period
                </li>
                <li>
                  <strong>First-Party Cookies:</strong> Set directly by
                  BantuHive
                </li>
                <li>
                  <strong>Third-Party Cookies:</strong> Set by our service
                  providers and partners
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. How We Use Cookies
              </h2>

              <h3 className="text-xl font-semibold mb-3">
                3.1 Essential Cookies
              </h3>
              <div className="bg-muted p-6 rounded-lg mb-4">
                <p>
                  <strong>Purpose:</strong> These cookies are necessary for the
                  platform to function properly.
                </p>
                <p>
                  <strong>Legal Basis:</strong> Legitimate interest (platform
                  functionality)
                </p>
                <p>
                  <strong>Opt-out:</strong> Not possible - required for basic
                  functionality
                </p>
              </div>
              <ul className="list-disc pl-6">
                <li>User authentication and session management</li>
                <li>Security and fraud prevention</li>
                <li>Load balancing and system stability</li>
                <li>Form submission and data validation</li>
                <li>Shopping cart and transaction processing</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                3.2 Functional Cookies
              </h3>
              <div className="bg-muted p-6 rounded-lg mb-4">
                <p>
                  <strong>Purpose:</strong> Enhance your user experience with
                  personalized features.
                </p>
                <p>
                  <strong>Legal Basis:</strong> Legitimate interest (improved
                  user experience)
                </p>
                <p>
                  <strong>Opt-out:</strong> Available through cookie preferences
                </p>
              </div>
              <ul className="list-disc pl-6">
                <li>Language and currency preferences</li>
                <li>Dark/light mode settings</li>
                <li>Customized dashboard layouts</li>
                <li>Recently viewed projects</li>
                <li>Investment portfolio preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                3.3 Analytics Cookies
              </h3>
              <div className="bg-muted p-6 rounded-lg mb-4">
                <p>
                  <strong>Purpose:</strong> Help us understand how users
                  interact with our platform.
                </p>
                <p>
                  <strong>Legal Basis:</strong> Legitimate interest (platform
                  improvement)
                </p>
                <p>
                  <strong>Opt-out:</strong> Available through cookie preferences
                </p>
              </div>
              <ul className="list-disc pl-6">
                <li>Page views and user journey tracking</li>
                <li>Feature usage analytics</li>
                <li>Performance monitoring</li>
                <li>Error tracking and debugging</li>
                <li>A/B testing for platform improvements</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                3.4 Marketing Cookies
              </h3>
              <div className="bg-muted p-6 rounded-lg mb-4">
                <p>
                  <strong>Purpose:</strong> Deliver relevant advertising and
                  measure campaign effectiveness.
                </p>
                <p>
                  <strong>Legal Basis:</strong> Consent
                </p>
                <p>
                  <strong>Opt-out:</strong> Available through cookie preferences
                </p>
              </div>
              <ul className="list-disc pl-6">
                <li>Targeted advertising on social media platforms</li>
                <li>Retargeting campaigns</li>
                <li>Email marketing optimization</li>
                <li>Conversion tracking</li>
                <li>Interest-based advertising</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. Third-Party Cookies
              </h2>
              <p>
                We work with trusted third-party providers who may set cookies
                on our platform:
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Provider
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Purpose
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Google Analytics
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Website analytics and performance
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Analytics
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Facebook Pixel
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Social media advertising
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Marketing
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Hotjar
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        User experience analytics
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Analytics
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Intercom
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Customer support chat
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Functional
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Paystack
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Payment processing
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Essential
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                5. Ghana-Specific Considerations
              </h2>
              <p>
                In compliance with Ghana's Data Protection Act, 2012 (Act 843)
                and emerging digital privacy regulations:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>We obtain clear consent for non-essential cookies</li>
                <li>We provide granular control over cookie preferences</li>
                <li>
                  We respect Do Not Track signals where technically feasible
                </li>
                <li>We regularly review and update our cookie practices</li>
                <li>
                  We maintain records of consent for regulatory compliance
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Managing Your Cookie Preferences
              </h2>

              <h3 className="text-xl font-semibold mb-3">
                6.1 BantuHive Cookie Settings
              </h3>
              <p>You can manage your cookie preferences at any time by:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>Clicking the "Cookie Preferences" link in our footer</li>
                <li>Accessing your account settings and selecting "Privacy"</li>
                <li>
                  Using the cookie banner that appears on your first visit
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                6.2 Browser Settings
              </h3>
              <p>Most browsers allow you to:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>View and delete cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies (may affect website functionality)</li>
                <li>Set preferences for third-party cookies</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                6.3 Browser-Specific Instructions
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Chrome:</strong> Settings &gt; Privacy and Security
                  &gt; Cookies and other site data
                </li>
                <li>
                  <strong>Firefox:</strong> Settings &gt; Privacy &amp; Security
                  &gt; Cookies and Site Data
                </li>
                <li>
                  <strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage
                  Website Data
                </li>
                <li>
                  <strong>Edge:</strong> Settings &gt; Site permissions &gt;
                  Cookies and site data
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Mobile Apps</h2>
              <p>
                Our mobile applications may use similar tracking technologies:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>Device identifiers and mobile advertising IDs</li>
                <li>App usage analytics</li>
                <li>Push notification tokens</li>
                <li>Location data (with explicit permission)</li>
                <li>Biometric authentication data (stored locally)</li>
              </ul>
              <p className="mt-4">
                You can manage these settings through your device's privacy
                settings or within the app preferences.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
              <p>Cookie data is retained for varying periods:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>
                  <strong>Session Cookies:</strong> Deleted when browser is
                  closed
                </li>
                <li>
                  <strong>Functional Cookies:</strong> 1-2 years
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> 2 years
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> 13 months (Google), varies
                  by provider
                </li>
                <li>
                  <strong>Security Cookies:</strong> 30 days
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>Withdraw consent for non-essential cookies at any time</li>
                <li>Access information about cookies stored on your device</li>
                <li>
                  Request deletion of cookie data (subject to technical
                  limitations)
                </li>
                <li>
                  Lodge a complaint with Ghana's Data Protection Commission
                </li>
                <li>Receive clear information about our cookie practices</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. Updates to This Policy
              </h2>
              <p>
                We may update this Cookie Policy to reflect changes in
                technology, law, or our practices. Material changes will be
                communicated through:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>Email notifications to registered users</li>
                <li>Prominent notices on our platform</li>
                <li>Updated cookie banners</li>
                <li>Push notifications in mobile apps</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                11. Contact Information
              </h2>
              <p>For questions about our cookie practices:</p>
              <div className="mt-4">
                <p>
                  <strong>BantuHive Ltd.</strong>
                </p>
                <p>Email: privacy@bantuhive.com</p>
                <p>Cookie Questions: cookies@bantuhive.com</p>
                <p>Phone: +233 (0) 302 123 456</p>
                <p>Address: Digital Address: GA-594-7744, Takoradi, Ghana</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Useful Links</h2>
              <ul className="list-disc pl-6">
                <li>
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.dataprotection.org.gh"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ghana Data Protection Commission
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.allaboutcookies.org"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    All About Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;

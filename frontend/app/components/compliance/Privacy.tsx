import PolicyLayout from '@/app/info/data-protection/PolicyLayout';

const Privacy = () => {
  const tableOfContents = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'information-collected', title: '2. Information We Collect' },
    { id: 'how-we-use', title: '3. How We Use Your Information' },
    { id: 'information-sharing', title: '4. Information Sharing' },
    { id: 'cookies', title: '5. Cookies and Tracking' },
    { id: 'data-security', title: '6. Data Security' },
    { id: 'your-rights', title: '7. Your Rights' },
    {
      id: 'fundraiser-accountability',
      title: '8. Fundraiser Accountability & Fund Misuse Penalties',
    },
    { id: 'childrens-privacy', title: "9. Children's Privacy" },
    { id: 'third-party-links', title: '10. Third-Party Links' },
    { id: 'payment-processing', title: '11. Payment Processing' },
    { id: 'changes', title: '12. Changes to This Policy' },
    { id: 'contact', title: '13. Contact Information' },
  ];

  return (
    <PolicyLayout
      title="Privacy Policy"
      lastUpdated="January 14, 2025"
      tableOfContents={tableOfContents}
    >
      {/* div 1 */}
      <div id="introduction" className="policy-section">
        <h2>1. Introduction</h2>
        <p>
          Welcome to BantuHive Ltd ("the Company," "we," "us," or "our"). This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our donations and investment
          crowdfunding platform, including our website at www.bantuhive.com and
          our mobile applications (collectively, the "Platform").
        </p>
        <p>
          By accessing or using our Platform, you agree to the terms of this
          Privacy Policy. If you do not agree with the terms of this Privacy
          Policy, please do not access the Platform.
        </p>
        <h3>1.1 Our Commitment</h3>
        <p>
          BantuHive Ltd is committed to protecting your privacy and ensuring
          that your personal information is handled in a safe and responsible
          manner. We comply with the Data Protection Act, 2012 (Act 843) of
          Ghana and implement industry-standard security measures to protect
          your data.
        </p>
        <h3>1.2 Scope</h3>
        <p>
          This Privacy Policy applies to all users of our Platform, including:
        </p>
        <ul>
          <li>Donors who contribute to fundraising campaigns</li>
          <li>Investors who participate in investment crowdfunding</li>
          <li>Fundraisers who create and manage campaigns</li>
          <li>Beneficiaries who receive funds from campaigns</li>
          <li>Visitors who browse our website without registering</li>
        </ul>
      </div>

      {/* div 2 */}
      <div id="information-collected" className="policy-section">
        <h2>2. Information We Collect</h2>
        <h3>2.1 Personal Information You Provide</h3>
        <p>
          When you register for an account, create a campaign, or make a
          donation or investment, we collect information you directly provide,
          including:
        </p>
        <ul>
          <li>
            <strong>Identity Information:</strong> Full name, date of birth,
            gender, nationality
          </li>
          <li>
            <strong>Contact Information:</strong> Email address, phone number,
            physical address
          </li>
          <li>
            <strong>Identification Documents:</strong> Ghana Card number,
            passport, driver's license (for KYC verification)
          </li>
          <li>
            <strong>Financial Information:</strong> Bank account details, mobile
            money numbers, payment card information
          </li>
          <li>
            <strong>Profile Information:</strong> Profile photo, biography,
            social media links
          </li>
          <li>
            <strong>Campaign Information:</strong> Campaign descriptions,
            images, videos, beneficiary details
          </li>
        </ul>
        <h3>2.2 Information Collected Automatically</h3>
        <p>
          When you access our Platform, we automatically collect certain
          information:
        </p>
        <ul>
          <li>
            <strong>Device Information:</strong> Device type, operating system,
            browser type, unique device identifiers
          </li>
          <li>
            <strong>Log Information:</strong> IP address, access times, pages
            viewed, referring URL
          </li>
          <li>
            <strong>Location Information:</strong> General location based on IP
            address, precise location if you grant permission
          </li>
          <li>
            <strong>Usage Information:</strong> Features used, actions taken,
            transaction history
          </li>
        </ul>
        <h3>2.3 Information from Third Parties</h3>
        <p>We may receive information about you from third parties:</p>
        <ul>
          <li>Identity verification services for KYC compliance</li>
          <li>Payment processors and financial institutions</li>
          <li>Credit reference bureaus (for investment crowdfunding)</li>
          <li>Social media platforms if you choose to link accounts</li>
        </ul>
      </div>

      {/* div 3 */}
      <div id="how-we-use" className="policy-section">
        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <h3>3.1 Providing Our Services</h3>
        <ul>
          <li>Create and manage your account</li>
          <li>Process donations and investments</li>
          <li>Facilitate fund transfers to beneficiaries</li>
          <li>Enable communication between users</li>
          <li>Provide customer support</li>
        </ul>
        <h3>3.2 Compliance and Security</h3>
        <ul>
          <li>Verify your identity (KYC requirements)</li>
          <li>
            Detect and prevent fraud, money laundering, and other illegal
            activities
          </li>
          <li>Comply with legal and regulatory requirements</li>
          <li>Protect the rights and safety of our users and third parties</li>
        </ul>
        <h3>3.3 Improvements and Analytics</h3>
        <ul>
          <li>Analyze usage patterns to improve our services</li>
          <li>Develop new features and functionality</li>
          <li>Conduct research and analysis</li>
          <li>Personalize your experience</li>
        </ul>
        <h3>3.4 Communications</h3>
        <ul>
          <li>Send transaction confirmations and receipts</li>
          <li>Provide updates on campaigns you've supported or created</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Notify you of policy changes and platform updates</li>
        </ul>
      </div>

      {/* div 4 */}
      <div id="information-sharing" className="policy-section">
        <h2>4. Information Sharing and Disclosure</h2>
        <p>
          We do not sell your personal information. We may share your
          information in the following circumstances:
        </p>
        <h3>4.1 With Your Consent</h3>
        <p>
          We share information when you have given us explicit consent, such as
          when you choose to make your donation public or share campaign
          updates.
        </p>
        <h3>4.2 Service Providers</h3>
        <p>
          We share information with third-party service providers who perform
          services on our behalf:
        </p>
        <ul>
          <li>Payment processors and mobile money providers</li>
          <li>Cloud hosting and data storage providers</li>
          <li>Identity verification services</li>
          <li>Email and SMS communication services</li>
          <li>Analytics and monitoring services</li>
        </ul>
        <h3>4.3 Legal Requirements</h3>
        <p>
          We may disclose information when required by law or in response to
          valid legal process:
        </p>
        <ul>
          <li>Court orders and subpoenas</li>
          <li>Requests from law enforcement or regulatory authorities</li>
          <li>
            To comply with anti-money laundering and counter-terrorism financing
            regulations
          </li>
          <li>To protect our legal rights or defend against legal claims</li>
        </ul>
        <h3>4.4 Campaign Transparency</h3>
        <p>
          Certain information may be visible to other users for platform
          transparency:
        </p>
        <ul>
          <li>Fundraiser profiles and campaign information are public</li>
          <li>
            Donor names may be displayed unless you choose to donate anonymously
          </li>
          <li>Investment amounts may be visible to campaign organizers</li>
        </ul>
        <h3>4.5 Business Transfers</h3>
        <p>
          In the event of a merger, acquisition, or sale of assets, your
          information may be transferred as part of that transaction. We will
          notify you of any such change and the choices you may have.
        </p>
      </div>

      {/* div 5 */}
      <div id="cookies" className="policy-section">
        <h2>5. Cookies and Tracking Technologies</h2>
        <h3>5.1 What Are Cookies?</h3>
        <p>
          Cookies are small text files stored on your device when you visit our
          Platform. We use cookies and similar technologies to enhance your
          experience, analyze usage, and provide personalized content.
        </p>
        <h3>5.2 Types of Cookies We Use</h3>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Required for the Platform to
            function properly. These enable core features like security, session
            management, and accessibility.
          </li>
          <li>
            <strong>Performance Cookies:</strong> Help us understand how users
            interact with the Platform by collecting anonymous usage data.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> Remember your preferences
            and settings to provide a more personalized experience.
          </li>
          <li>
            <strong>Marketing Cookies:</strong> Track your activity across
            websites to deliver relevant advertisements (only with your
            consent).
          </li>
        </ul>
        <h3>5.3 Managing Cookies</h3>
        <p>
          You can control cookies through your browser settings. Please note
          that disabling certain cookies may affect the functionality of our
          Platform. You can also manage your cookie preferences through our
          cookie consent banner.
        </p>
        <h3>5.4 Do Not Track</h3>
        <p>
          Some browsers have a "Do Not Track" feature. We currently do not
          respond to Do Not Track signals, but we respect your privacy choices
          through our cookie preference settings.
        </p>
      </div>

      {/* div 6 */}
      <div id="data-security" className="policy-section">
        <h2>6. Data Security</h2>
        <p>
          We implement robust security measures to protect your personal
          information:
        </p>
        <h3>6.1 Technical Safeguards</h3>
        <ul>
          <li>256-bit SSL/TLS encryption for all data transmissions</li>
          <li>AES-256 encryption for stored sensitive data</li>
          <li>Secure, PCI-DSS compliant payment processing</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Firewalls and intrusion detection systems</li>
          <li>Secure cloud infrastructure with redundancy</li>
        </ul>
        <h3>6.2 Organizational Safeguards</h3>
        <ul>
          <li>Strict access controls based on job responsibilities</li>
          <li>Employee background checks and confidentiality agreements</li>
          <li>Regular security awareness training</li>
          <li>Incident response and breach notification procedures</li>
        </ul>
        <h3>6.3 Your Role in Security</h3>
        <p>
          While we take extensive measures to protect your data, you also play a
          role in keeping your account secure:
        </p>
        <ul>
          <li>Use a strong, unique password for your account</li>
          <li>Enable two-factor authentication when available</li>
          <li>Do not share your login credentials with others</li>
          <li>Log out of shared or public devices</li>
          <li>Report any suspicious activity immediately</li>
        </ul>
      </div>

      {/* div 7 */}
      <div id="your-rights" className="policy-section">
        <h2>7. Your Privacy Rights</h2>
        <p>
          Under the Data Protection Act, 2012 (Act 843) and our commitment to
          your privacy, you have the following rights:
        </p>
        <h3>7.1 Right to Access</h3>
        <p>
          You can request a copy of the personal information we hold about you.
          We will provide this information within 30 days of receiving your
          request.
        </p>
        <h3>7.2 Right to Correction</h3>
        <p>
          You can update or correct your personal information at any time
          through your account settings or by contacting us.
        </p>
        <h3>7.3 Right to Deletion</h3>
        <p>
          You can request deletion of your personal data, subject to legal
          retention requirements. Some data may need to be retained for
          regulatory compliance.
        </p>
        <h3>7.4 Right to Restrict Processing</h3>
        <p>
          You can request that we limit how we use your personal information in
          certain circumstances.
        </p>
        <h3>7.5 Right to Data Portability</h3>
        <p>
          You can request your data in a commonly used, machine-readable format
          to transfer to another service.
        </p>
        <h3>7.6 Right to Object</h3>
        <p>
          You can object to processing of your personal data for marketing
          purposes at any time. You can unsubscribe from marketing
          communications using the link in our emails or through your account
          settings.
        </p>
        <h3>7.7 Exercising Your Rights</h3>
        <p>
          To exercise any of these rights, please contact us at
          privacy@bantuhive.com or through your account settings. We will verify
          your identity before processing your request.
        </p>
      </div>

      {/* div 8 - Fundraiser Accountability */}
      <div id="fundraiser-accountability" className="policy-section">
        <h2>8. Fundraiser Accountability & Fund Misuse Penalties</h2>
        <p>
          BantuHive Ltd maintains strict policies to ensure all funds raised on
          our platform are used for their intended purposes. Misuse of
          funds—whether from donations or investments— constitutes a serious
          violation subject to civil and criminal penalties under Ghanaian law.
        </p>

        <h3>8.1 Applicable Ghana Laws</h3>
        <p>Fund misuse may result in prosecution under the following laws:</p>
        <ul>
          <li>
            <strong>Criminal Offences Act, 1960 (Act 29):</strong> Fraud and
            defrauding by false pretenses carry penalties of up to 10 years
            imprisonment.
          </li>
          <li>
            <strong>Anti-Money Laundering Act, 2020 (Act 1044):</strong> Fund
            misappropriation constituting money laundering is punishable by up
            to 10 years imprisonment and/or substantial fines.
          </li>
          <li>
            <strong>Securities Industry Act, 2016 (Act 929):</strong> Investment
            fraud is subject to SEC enforcement, including fines and
            imprisonment up to 10 years.
          </li>
          <li>
            <strong>Electronic Transactions Act, 2008 (Act 772):</strong> Online
            fraud carries penalties of up to 15 years imprisonment.
          </li>
        </ul>

        <h3>8.2 Fundraiser Obligations</h3>
        <p>By creating a campaign on BantuHive Ltd, fundraisers agree to:</p>
        <ul>
          <li>Use all funds exclusively for the stated campaign purpose</li>
          <li>Maintain accurate records of all expenditures</li>
          <li>
            Provide progress updates and proof of fund usage when requested
          </li>
          <li>
            Return unused funds or obtain donor/investor consent for alternative
            use
          </li>
          <li>Comply with all applicable tax and regulatory requirements</li>
          <li>Cooperate fully with any audits or investigations</li>
        </ul>

        <h3>8.3 Consequences of Fund Misuse</h3>
        <h4>8.3.1 Platform Actions</h4>
        <ul>
          <li>
            Immediate suspension of account and freezing of pending
            disbursements
          </li>
          <li>Permanent ban from all BantuHive Ltd services</li>
          <li>Recovery of misused funds through legal action</li>
          <li>Reporting to relevant authorities for criminal investigation</li>
          <li>Public disclosure of verified fraud cases</li>
        </ul>

        <h4>8.3.2 Criminal Penalties</h4>
        <ul>
          <li>
            Imprisonment ranging from 2 to 15 years depending on the offense and
            amount
          </li>
          <li>Fines as determined by the courts</li>
          <li>Restitution orders requiring full repayment to victims</li>
          <li>Asset forfeiture and seizure of proceeds of crime</li>
          <li>Credit bureau reporting affecting future financial access</li>
        </ul>

        <h4>8.3.3 Civil Liability</h4>
        <ul>
          <li>Full restitution of misused funds to donors/investors</li>
          <li>Compensatory damages for harm caused</li>
          <li>Punitive damages as determined by courts</li>
          <li>Legal costs and interest on misappropriated amounts</li>
        </ul>

        <h3>8.4 Monitoring and Enforcement</h3>
        <p>We actively monitor campaigns and fund usage through:</p>
        <ul>
          <li>
            Enhanced due diligence and identity verification for all fundraisers
          </li>
          <li>Milestone-based fund releases requiring proof of progress</li>
          <li>Random and risk-based audits of fund expenditure</li>
          <li>Whistleblower reporting mechanisms for suspected fraud</li>
          <li>Automated detection of suspicious withdrawal patterns</li>
        </ul>

        <h3>8.5 Cooperation with Authorities</h3>
        <p>
          BantuHive Ltd cooperates fully with law enforcement and regulatory
          bodies including:
        </p>
        <ul>
          <li>
            Ghana Police Service (EOCO - Economic and Organized Crime Office)
          </li>
          <li>Financial Intelligence Centre (FIC)</li>
          <li>Securities and Exchange Commission (SEC)</li>
          <li>Bank of Ghana</li>
          <li>Attorney General's Department</li>
        </ul>

        <h3>8.6 Reporting Suspected Misuse</h3>
        <p>If you suspect fund misuse, please report it immediately:</p>
        <ul>
          <li>
            <strong>Email:</strong> compliance@bantuhive.com
          </li>
          <li>
            <strong>Hotline:</strong> +233 XX XXX XXXX (available 24/7)
          </li>
          <li>
            <strong>Online:</strong> Through the "Report Campaign" feature on
            any campaign page
          </li>
        </ul>
        <p>
          All reports are treated confidentially, and whistleblowers are
          protected from retaliation under the Whistleblowers Act, 2006 (Act
          720).
        </p>
      </div>

      {/* div 9 */}
      <div id="childrens-privacy" className="policy-section">
        <h2>9. Children's Privacy</h2>
        <p>
          Our Platform is not intended for children under the age of 18. We do
          not knowingly collect personal information from children under 18
          years of age. If you are a parent or guardian and believe your child
          has provided us with personal information, please contact us
          immediately at privacy@bantuhive.com.
        </p>
        <p>
          If we discover that we have collected personal information from a
          child under 18, we will take steps to delete that information as
          quickly as possible.
        </p>
        <h3>9.1 Campaigns Benefiting Children</h3>
        <p>
          While children cannot use our Platform directly, fundraising campaigns
          may benefit children. In such cases:
        </p>
        <ul>
          <li>
            The campaign must be created by a parent, guardian, or authorized
            adult
          </li>
          <li>
            We limit the disclosure of identifying information about child
            beneficiaries
          </li>
          <li>
            Parental consent is required for any information relating to the
            child
          </li>
        </ul>
      </div>

      {/* div 10 */}
      <div id="third-party-links" className="policy-section">
        <h2>10. Third-Party Links and Services</h2>
        <p>
          Our Platform may contain links to third-party websites, services, or
          applications that are not operated by us. This Privacy Policy does not
          apply to those third-party services.
        </p>
        <h3>10.1 Third-Party Services We Integrate</h3>
        <ul>
          <li>
            <strong>Payment Providers:</strong> Mobile money operators, banks,
            card networks
          </li>
          <li>
            <strong>Social Media:</strong> Facebook, Twitter, LinkedIn,
            Instagram
          </li>
          <li>
            <strong>Analytics:</strong> Google Analytics, Mixpanel
          </li>
          <li>
            <strong>Communication:</strong> Email and SMS service providers
          </li>
        </ul>
        <h3>10.2 Your Responsibility</h3>
        <p>
          We encourage you to review the privacy policies of any third-party
          websites or services before providing your personal information. We
          are not responsible for the privacy practices of these third parties.
        </p>
      </div>

      {/* div 11 */}
      <div id="payment-processing" className="policy-section">
        <h2>11. Payment Processing</h2>
        <h3>11.1 Payment Methods</h3>
        <p>We accept various payment methods including:</p>
        <ul>
          <li>
            Mobile money (MTN Mobile Money, Vodafone Cash, AirtelTigo Money)
          </li>
          <li>Bank transfers</li>
          <li>Debit and credit cards (Visa, Mastercard)</li>
        </ul>
        <h3>11.2 Payment Security</h3>
        <p>
          Payment information is processed by our PCI-DSS compliant payment
          partners. We do not store complete payment card numbers on our
          servers. All payment transactions are encrypted and processed
          securely.
        </p>
        <h3>11.3 Financial Information Retention</h3>
        <p>
          We retain transaction records as required by law and for dispute
          resolution purposes. Bank account and mobile money numbers are stored
          securely for processing payouts to fundraisers.
        </p>
      </div>

      {/* div 12 */}
      <div id="changes" className="policy-section">
        <h2>12. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technology, legal requirements, or for other
          operational reasons.
        </p>
        <h3>12.1 Notification of Changes</h3>
        <p>When we make changes to this Privacy Policy, we will:</p>
        <ul>
          <li>Update the "Last Updated" date at the top of this policy</li>
          <li>Post a notice on our Platform announcing the changes</li>
          <li>
            Send an email notification to registered users for material changes
          </li>
          <li>Obtain your consent where required by law</li>
        </ul>
        <h3>12.2 Your Continued Use</h3>
        <p>
          Your continued use of our Platform after any changes to this Privacy
          Policy constitutes your acceptance of those changes. We encourage you
          to review this Privacy Policy periodically.
        </p>
      </div>

      {/* div 13 */}
      <div id="contact" className="policy-section">
        <h2>13. Contact Information</h2>
        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or our data practices, please contact us:
        </p>
        <h3>13.1 Data Protection Officer</h3>
        <ul>
          <li>
            <strong>Email:</strong> dpo@bantuhive.com
          </li>
          <li>
            <strong>Phone:</strong> +233 XX XXX XXXX
          </li>
        </ul>
        <h3>13.2 General Inquiries</h3>
        <ul>
          <li>
            <strong>Email:</strong> privacy@bantuhive.com
          </li>
          <li>
            <strong>Address:</strong> BantuHive Ltd, [Address], Accra, Ghana
          </li>
          <li>
            <strong>Website:</strong> www.bantuhive.com/contact
          </li>
        </ul>
        <h3>13.3 Regulatory Authority</h3>
        <p>
          If you are not satisfied with our response to your privacy concerns,
          you may contact the Data Protection Commission of Ghana:
        </p>
        <ul>
          <li>
            <strong>Address:</strong> No. 7 Olusegun Obasanjo Way, Airport
            Residential Area, Accra
          </li>
          <li>
            <strong>Website:</strong> www.dataprotection.org.gh
          </li>
        </ul>
        <p className="mt-8 p-4 bg-muted rounded-lg">
          <strong>Document Information</strong>
          <br />
          Version: 1.0
          <br />
          Effective Date: January 14, 2025
          <br />
          Next Review Date: January 14, 2026
          <br />
          Approved By: Board of Directors, BantuHive Ltd
        </p>
      </div>
    </PolicyLayout>
  );
};

export default Privacy;

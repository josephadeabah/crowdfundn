import PolicyLayout from "./PolicyLayout";

const DataProtection = () => {
  const tableOfContents = [
    { id: "introduction", title: "1. Introduction" },
    { id: "definitions", title: "2. Definitions" },
    { id: "scope", title: "3. Scope of Policy" },
    { id: "principles", title: "4. Data Protection Principles" },
    { id: "lawful-basis", title: "5. Lawful Basis for Processing" },
    { id: "data-subject-rights", title: "6. Data Subject Rights" },
    { id: "data-security", title: "7. Data Security Measures" },
    { id: "data-breach", title: "8. Data Breach Procedures" },
    { id: "international-transfers", title: "9. International Data Transfers" },
    { id: "retention", title: "10. Data Retention" },
    { id: "fundraiser-accountability", title: "11. Fundraiser Accountability & Fund Misuse" },
    { id: "dpo", title: "12. Data Protection Officer" },
    { id: "complaints", title: "13. Complaints Procedure" },
    { id: "review", title: "14. Policy Review" },
  ];

  return (
    <PolicyLayout
      title="Data Protection Policy"
      lastUpdated="January 14, 2025"
      tableOfContents={tableOfContents}
    >
      {/* Section 1 */}
      <section id="introduction" className="policy-section">
        <h2>1. Introduction</h2>
        <p>
          BantuHive Ltd ("the Company," "we," "us," or "our") is committed to protecting the personal data 
          of all individuals who interact with our donations and investment crowdfunding platform. This 
          Data Protection Policy outlines our commitment to data protection and explains how we ensure 
          compliance with the Data Protection Act, 2012 (Act 843) of Ghana and other applicable data 
          protection laws.
        </p>
        <p>
          As a licensed crowdfunding platform operating in Ghana, we recognize that the proper handling 
          of personal data is essential to maintaining trust with our users, donors, investors, and 
          fundraisers. This policy applies to all personal data processed by BantuHive Ltd in the course 
          of our business operations.
        </p>
        <h3>1.1 Purpose of This Policy</h3>
        <p>
          This Data Protection Policy aims to:
        </p>
        <ul>
          <li>Ensure compliance with the Data Protection Act, 2012 (Act 843) and related regulations</li>
          <li>Protect the rights and freedoms of data subjects</li>
          <li>Establish clear procedures for handling personal data</li>
          <li>Define responsibilities for data protection within the organization</li>
          <li>Provide guidance to employees on data protection matters</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section id="definitions" className="policy-section">
        <h2>2. Definitions</h2>
        <p>For the purposes of this policy, the following definitions apply:</p>
        <ul>
          <li>
            <strong>Personal Data:</strong> Any information relating to an identified or identifiable 
            natural person (data subject), including but not limited to name, identification number, 
            location data, online identifier, or factors specific to the physical, physiological, 
            genetic, mental, economic, cultural, or social identity of that person.
          </li>
          <li>
            <strong>Sensitive Personal Data:</strong> Personal data revealing racial or ethnic origin, 
            political opinions, religious or philosophical beliefs, trade union membership, genetic 
            data, biometric data, health data, or data concerning a natural person's sex life or 
            sexual orientation.
          </li>
          <li>
            <strong>Data Subject:</strong> An identified or identifiable natural person whose personal 
            data is processed by BantuHive Ltd.
          </li>
          <li>
            <strong>Data Controller:</strong> BantuHive Ltd, which determines the purposes and means 
            of processing personal data.
          </li>
          <li>
            <strong>Data Processor:</strong> Any natural or legal person who processes personal data 
            on behalf of BantuHive Ltd.
          </li>
          <li>
            <strong>Processing:</strong> Any operation performed on personal data, including collection, 
            recording, organization, structuring, storage, adaptation, alteration, retrieval, 
            consultation, use, disclosure, dissemination, restriction, erasure, or destruction.
          </li>
        </ul>
      </section>

      {/* Section 3 */}
      <section id="scope" className="policy-section">
        <h2>3. Scope of Policy</h2>
        <h3>3.1 Applicability</h3>
        <p>This policy applies to:</p>
        <ul>
          <li>All personal data processed by BantuHive Ltd</li>
          <li>All employees, contractors, and third parties acting on behalf of BantuHive Ltd</li>
          <li>All systems, services, and processes used to handle personal data</li>
          <li>All locations where personal data is processed, including our offices, remote work environments, and cloud services</li>
        </ul>
        <h3>3.2 Categories of Data Subjects</h3>
        <p>We process personal data relating to the following categories of individuals:</p>
        <ul>
          <li>Registered platform users (donors and investors)</li>
          <li>Fundraisers and campaign organizers</li>
          <li>Beneficiaries of campaigns</li>
          <li>Website visitors</li>
          <li>Business partners and service providers</li>
          <li>Employees and job applicants</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section id="principles" className="policy-section">
        <h2>4. Data Protection Principles</h2>
        <p>
          BantuHive Ltd adheres to the following data protection principles as mandated by the 
          Data Protection Act, 2012 (Act 843):
        </p>
        <h3>4.1 Lawfulness, Fairness, and Transparency</h3>
        <p>
          Personal data shall be processed lawfully, fairly, and in a transparent manner. We ensure 
          that data subjects are informed about how their data is collected and used.
        </p>
        <h3>4.2 Purpose Limitation</h3>
        <p>
          Personal data shall be collected for specified, explicit, and legitimate purposes and not 
          further processed in a manner incompatible with those purposes.
        </p>
        <h3>4.3 Data Minimization</h3>
        <p>
          Personal data collected shall be adequate, relevant, and limited to what is necessary for 
          the purposes for which it is processed.
        </p>
        <h3>4.4 Accuracy</h3>
        <p>
          Personal data shall be accurate and, where necessary, kept up to date. We take reasonable 
          steps to ensure inaccurate data is rectified or erased without delay.
        </p>
        <h3>4.5 Storage Limitation</h3>
        <p>
          Personal data shall be kept in a form that permits identification of data subjects for no 
          longer than is necessary for the purposes for which the data is processed.
        </p>
        <h3>4.6 Integrity and Confidentiality</h3>
        <p>
          Personal data shall be processed in a manner that ensures appropriate security, including 
          protection against unauthorized or unlawful processing and against accidental loss, 
          destruction, or damage.
        </p>
        <h3>4.7 Accountability</h3>
        <p>
          BantuHive Ltd is responsible for and must be able to demonstrate compliance with these 
          principles.
        </p>
      </section>

      {/* Section 5 */}
      <section id="lawful-basis" className="policy-section">
        <h2>5. Lawful Basis for Processing</h2>
        <p>
          BantuHive Ltd processes personal data only when there is a lawful basis to do so. The 
          lawful bases we rely on include:
        </p>
        <h3>5.1 Consent</h3>
        <p>
          Where the data subject has given clear consent for us to process their personal data for 
          a specific purpose. Consent can be withdrawn at any time.
        </p>
        <h3>5.2 Contractual Necessity</h3>
        <p>
          Processing is necessary for the performance of a contract with the data subject or to take 
          steps at their request before entering into a contract.
        </p>
        <h3>5.3 Legal Obligation</h3>
        <p>
          Processing is necessary for compliance with a legal obligation to which BantuHive Ltd is 
          subject, including anti-money laundering regulations and tax requirements.
        </p>
        <h3>5.4 Legitimate Interests</h3>
        <p>
          Processing is necessary for the purposes of legitimate interests pursued by BantuHive Ltd 
          or a third party, except where such interests are overridden by the interests, rights, or 
          freedoms of the data subject.
        </p>
      </section>

      {/* Section 6 */}
      <section id="data-subject-rights" className="policy-section">
        <h2>6. Data Subject Rights</h2>
        <p>
          Under the Data Protection Act, 2012 (Act 843), data subjects have the following rights 
          which BantuHive Ltd is committed to upholding:
        </p>
        <h3>6.1 Right to Access</h3>
        <p>
          Data subjects have the right to request access to their personal data and to obtain 
          information about how it is processed.
        </p>
        <h3>6.2 Right to Rectification</h3>
        <p>
          Data subjects have the right to request correction of inaccurate personal data without 
          undue delay.
        </p>
        <h3>6.3 Right to Erasure</h3>
        <p>
          Data subjects have the right to request the deletion of their personal data in certain 
          circumstances, subject to legal retention requirements.
        </p>
        <h3>6.4 Right to Restrict Processing</h3>
        <p>
          Data subjects have the right to request restriction of processing of their personal data 
          in certain circumstances.
        </p>
        <h3>6.5 Right to Data Portability</h3>
        <p>
          Data subjects have the right to receive their personal data in a structured, commonly used, 
          and machine-readable format.
        </p>
        <h3>6.6 Right to Object</h3>
        <p>
          Data subjects have the right to object to processing of their personal data in certain 
          circumstances, including for direct marketing purposes.
        </p>
        <h3>6.7 Exercising Your Rights</h3>
        <p>
          To exercise any of these rights, please contact our Data Protection Officer at 
          dpo@bantuhive.com. We will respond to all legitimate requests within 30 days.
        </p>
      </section>

      {/* Section 7 */}
      <section id="data-security" className="policy-section">
        <h2>7. Data Security Measures</h2>
        <p>
          BantuHive Ltd implements appropriate technical and organizational measures to ensure the 
          security of personal data:
        </p>
        <h3>7.1 Technical Measures</h3>
        <ul>
          <li>256-bit SSL/TLS encryption for data in transit</li>
          <li>AES-256 encryption for data at rest</li>
          <li>Multi-factor authentication for system access</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Intrusion detection and prevention systems</li>
          <li>Regular software updates and security patches</li>
          <li>Secure backup and disaster recovery procedures</li>
        </ul>
        <h3>7.2 Organizational Measures</h3>
        <ul>
          <li>Role-based access controls limiting data access to authorized personnel</li>
          <li>Regular data protection training for all employees</li>
          <li>Confidentiality agreements with employees and contractors</li>
          <li>Documented security policies and procedures</li>
          <li>Regular audits of data processing activities</li>
          <li>Vendor due diligence and data processing agreements</li>
        </ul>
      </section>

      {/* Section 8 */}
      <section id="data-breach" className="policy-section">
        <h2>8. Data Breach Procedures</h2>
        <h3>8.1 Breach Identification</h3>
        <p>
          A personal data breach means a breach of security leading to the accidental or unlawful 
          destruction, loss, alteration, unauthorized disclosure of, or access to personal data.
        </p>
        <h3>8.2 Breach Response</h3>
        <p>
          In the event of a data breach, BantuHive Ltd will:
        </p>
        <ul>
          <li>Immediately investigate and contain the breach</li>
          <li>Assess the risk to affected individuals</li>
          <li>Notify the Data Protection Commission within 72 hours where required</li>
          <li>Notify affected data subjects without undue delay where there is a high risk to their rights and freedoms</li>
          <li>Document all breaches and remedial actions taken</li>
          <li>Implement measures to prevent future breaches</li>
        </ul>
        <h3>8.3 Reporting a Breach</h3>
        <p>
          All employees must report suspected data breaches immediately to the Data Protection 
          Officer at dpo@bantuhive.com or through our internal incident reporting system.
        </p>
      </section>

      {/* Section 9 */}
      <section id="international-transfers" className="policy-section">
        <h2>9. International Data Transfers</h2>
        <p>
          BantuHive Ltd may transfer personal data to countries outside Ghana in the course of 
          our business operations. When we do so, we ensure appropriate safeguards are in place:
        </p>
        <ul>
          <li>Transfers to countries with adequate data protection laws as determined by the Data Protection Commission</li>
          <li>Standard contractual clauses approved by the Data Protection Commission</li>
          <li>Binding corporate rules for intra-group transfers</li>
          <li>Explicit consent from the data subject after being informed of the risks</li>
        </ul>
        <p>
          We primarily use cloud service providers with data centers in Ghana, Europe, and other 
          jurisdictions that provide adequate protection for personal data.
        </p>
      </section>

      {/* Section 10 */}
      <section id="retention" className="policy-section">
        <h2>10. Data Retention</h2>
        <p>
          BantuHive Ltd retains personal data only for as long as necessary to fulfill the purposes 
          for which it was collected, or as required by law:
        </p>
        <ul>
          <li><strong>Account Information:</strong> Retained for the duration of the account plus 7 years after closure for regulatory compliance</li>
          <li><strong>Transaction Records:</strong> Retained for 7 years as required by tax and anti-money laundering regulations</li>
          <li><strong>Campaign Data:</strong> Retained for 7 years after campaign completion</li>
          <li><strong>Communication Records:</strong> Retained for 3 years unless required longer for legal purposes</li>
          <li><strong>Website Analytics:</strong> Retained for 2 years in anonymized form</li>
        </ul>
        <p>
          When personal data is no longer required, it is securely deleted or anonymized in 
          accordance with our data destruction procedures.
        </p>
      </section>

      {/* Section 11 - Fundraiser Accountability & Fund Misuse */}
      <section id="fundraiser-accountability" className="policy-section">
        <h2>11. Fundraiser Accountability & Fund Misuse Penalties</h2>
        <p>
          BantuHive Ltd is committed to ensuring that all funds raised through our platform—whether 
          through donations or investment crowdfunding—are used for their intended purposes. Misuse 
          of funds constitutes a serious breach of trust and is subject to severe penalties under 
          Ghanaian law.
        </p>

        <h3>11.1 Legal Framework for Fund Misuse in Ghana</h3>
        <p>
          Fund misuse on our platform may constitute criminal offenses under multiple Ghanaian laws:
        </p>
        <ul>
          <li>
            <strong>Criminal Offences Act, 1960 (Act 29):</strong> Fraud and obtaining money by 
            false pretenses is punishable by imprisonment of up to 10 years under Sections 131-136.
          </li>
          <li>
            <strong>Anti-Money Laundering Act, 2020 (Act 1044):</strong> Misappropriation of funds 
            may constitute money laundering, punishable by imprisonment of up to 10 years and/or 
            a fine of up to 7,500 penalty units.
          </li>
          <li>
            <strong>Securities Industry Act, 2016 (Act 929):</strong> For investment crowdfunding, 
            misrepresentation or fraud is punishable by imprisonment of up to 10 years and fines 
            as determined by the Securities and Exchange Commission (SEC).
          </li>
          <li>
            <strong>Companies Act, 2019 (Act 992):</strong> Directors and officers who misappropriate 
            company funds face personal liability, disqualification, and criminal prosecution.
          </li>
          <li>
            <strong>Electronic Transactions Act, 2008 (Act 772):</strong> Cyber fraud and electronic 
            deception carry penalties of up to 15 years imprisonment.
          </li>
        </ul>

        <h3>11.2 Fundraiser Obligations</h3>
        <p>All fundraisers on BantuHive Ltd must:</p>
        <ul>
          <li>Provide accurate and truthful information about their campaign purpose</li>
          <li>Use funds exclusively for the stated purpose as described in the campaign</li>
          <li>Maintain detailed records of all fund expenditures</li>
          <li>Provide regular progress updates and financial accountability reports</li>
          <li>Respond promptly to donor/investor inquiries about fund usage</li>
          <li>Return unused funds to donors/investors or redirect them with proper consent</li>
          <li>Comply with all applicable tax and regulatory requirements</li>
        </ul>

        <h3>11.3 Platform Monitoring and Enforcement</h3>
        <p>
          BantuHive Ltd employs rigorous monitoring to detect and prevent fund misuse:
        </p>
        <ul>
          <li>
            <strong>Verification Checks:</strong> Enhanced due diligence on all fundraisers, including 
            identity verification, address verification, and background checks where applicable.
          </li>
          <li>
            <strong>Fund Release Controls:</strong> Milestone-based fund releases for large campaigns, 
            requiring proof of progress before subsequent disbursements.
          </li>
          <li>
            <strong>Expenditure Audits:</strong> Random and risk-based audits of fund usage, including 
            requests for receipts, invoices, and bank statements.
          </li>
          <li>
            <strong>Whistleblower Mechanism:</strong> Secure reporting channels for donors, investors, 
            and the public to report suspected misuse.
          </li>
          <li>
            <strong>Real-time Monitoring:</strong> Automated systems to detect suspicious patterns 
            in fund withdrawals and usage.
          </li>
        </ul>

        <h3>11.4 Penalties for Fund Misuse - Donations</h3>
        <p>
          Fundraisers who misuse donated funds face the following consequences:
        </p>
        <ul>
          <li>
            <strong>Immediate Account Suspension:</strong> Upon substantiated allegations, the 
            fundraiser's account and any pending disbursements will be frozen.
          </li>
          <li>
            <strong>Fund Recovery:</strong> BantuHive Ltd will pursue recovery of misused funds 
            through all available legal means, including civil litigation and asset freezing orders.
          </li>
          <li>
            <strong>Criminal Referral:</strong> Cases of fraud will be reported to the Ghana Police 
            Service (Economic and Organized Crime Office - EOCO) and the Attorney General's 
            Department for prosecution.
          </li>
          <li>
            <strong>Civil Liability:</strong> Fundraisers will be liable for full restitution to 
            donors, plus damages, interest, and legal costs.
          </li>
          <li>
            <strong>Platform Ban:</strong> Permanent prohibition from using BantuHive Ltd services, 
            with information shared with other crowdfunding platforms as permitted by law.
          </li>
          <li>
            <strong>Public Disclosure:</strong> Publication of verified fraud cases on our platform 
            and to relevant authorities to protect the public.
          </li>
        </ul>

        <h3>11.5 Penalties for Fund Misuse - Investment Crowdfunding</h3>
        <p>
          Misuse of investment funds carries additional regulatory consequences:
        </p>
        <ul>
          <li>
            <strong>SEC Reporting:</strong> Immediate notification to the Securities and Exchange 
            Commission of Ghana for regulatory investigation and enforcement action.
          </li>
          <li>
            <strong>Investor Protection:</strong> Activation of any investor protection mechanisms, 
            including escrow fund releases and insurance claims where applicable.
          </li>
          <li>
            <strong>Director Disqualification:</strong> Pursuit of court orders disqualifying 
            directors from holding corporate positions under the Companies Act.
          </li>
          <li>
            <strong>Asset Freezing:</strong> Application for court orders to freeze personal and 
            corporate assets of responsible parties.
          </li>
          <li>
            <strong>Criminal Prosecution:</strong> Referral for criminal prosecution for securities 
            fraud, which may result in imprisonment and substantial fines.
          </li>
          <li>
            <strong>Credit Bureau Reporting:</strong> Reporting to credit reference bureaus, affecting 
            the individual's ability to access financial services.
          </li>
        </ul>

        <h3>11.6 Dispute Resolution Process</h3>
        <p>
          When fund misuse is suspected, the following process applies:
        </p>
        <ul>
          <li>
            <strong>Step 1 - Investigation:</strong> BantuHive Ltd conducts a thorough internal 
            investigation within 14 business days of receiving a complaint.
          </li>
          <li>
            <strong>Step 2 - Fundraiser Response:</strong> The fundraiser is given 7 business days 
            to provide evidence of proper fund usage.
          </li>
          <li>
            <strong>Step 3 - Independent Review:</strong> For disputed cases, an independent 
            review panel may be convened including legal and financial experts.
          </li>
          <li>
            <strong>Step 4 - Determination:</strong> A formal determination is issued with findings 
            and remedial actions required.
          </li>
          <li>
            <strong>Step 5 - Enforcement:</strong> Penalties are enforced, and the matter is 
            escalated to authorities if criminal conduct is identified.
          </li>
        </ul>

        <h3>11.7 Cooperation with Authorities</h3>
        <p>
          BantuHive Ltd fully cooperates with law enforcement and regulatory authorities:
        </p>
        <ul>
          <li>Ghana Police Service (Economic and Organized Crime Office)</li>
          <li>Financial Intelligence Centre (FIC)</li>
          <li>Securities and Exchange Commission (SEC)</li>
          <li>Bank of Ghana</li>
          <li>Attorney General's Department</li>
          <li>National Investigation Bureau (NIB)</li>
        </ul>
        <p>
          We maintain detailed records of all transactions and user activities for a minimum of 
          7 years to support any investigations or legal proceedings.
        </p>

        <h3>11.8 Donor and Investor Protections</h3>
        <p>
          BantuHive Ltd implements the following protections for donors and investors:
        </p>
        <ul>
          <li>Escrow arrangements for funds until milestone verification</li>
          <li>Transparent tracking of fund usage and disbursements</li>
          <li>Regular progress reports from fundraisers</li>
          <li>Refund mechanisms for campaigns that fail to deliver</li>
          <li>Insurance coverage for verified fraud cases (subject to policy limits)</li>
          <li>Legal support for collective action against fraudulent fundraisers</li>
        </ul>
      </section>

      {/* Section 12 */}
      <section id="dpo" className="policy-section">
        <h2>12. Data Protection Officer</h2>
        <p>
          BantuHive Ltd has appointed a Data Protection Officer (DPO) who is responsible for 
          overseeing data protection compliance. The DPO can be contacted for any questions 
          regarding this policy or our data protection practices:
        </p>
        <ul>
          <li><strong>Email:</strong> dpo@bantuhive.com</li>
          <li><strong>Address:</strong> BantuHive Ltd, [Address], Accra, Ghana</li>
          <li><strong>Phone:</strong> +233 XX XXX XXXX</li>
        </ul>
        <h3>11.1 Responsibilities of the DPO</h3>
        <ul>
          <li>Advising on data protection obligations and compliance</li>
          <li>Monitoring compliance with data protection laws and internal policies</li>
          <li>Providing guidance on data protection impact assessments</li>
          <li>Serving as the contact point for the Data Protection Commission</li>
          <li>Handling data subject requests and complaints</li>
        </ul>
      </section>

      {/* Section 13 */}
      <section id="complaints" className="policy-section">
        <h2>13. Complaints Procedure</h2>
        <p>
          If you have concerns about how BantuHive Ltd handles your personal data, we encourage 
          you to raise them with us first:
        </p>
        <h3>13.1 Internal Complaints</h3>
        <p>
          Contact our Data Protection Officer at dpo@bantuhive.com. We will investigate your 
          complaint and respond within 30 days.
        </p>
        <h3>13.2 Regulatory Complaints</h3>
        <p>
          If you are not satisfied with our response, you have the right to lodge a complaint with 
          the Data Protection Commission of Ghana:
        </p>
        <ul>
          <li><strong>Data Protection Commission</strong></li>
          <li>No. 7 Olusegun Obasanjo Way</li>
          <li>Airport Residential Area, Accra</li>
          <li>Website: www.dataprotection.org.gh</li>
        </ul>
      </section>

      {/* Section 14 */}
      <section id="review" className="policy-section">
        <h2>14. Policy Review</h2>
        <p>
          This Data Protection Policy is reviewed annually or whenever there are significant changes 
          to our data processing activities, legal requirements, or regulatory guidance. All updates 
          will be communicated to relevant stakeholders and published on our website.
        </p>
        <p>
          <strong>Version:</strong> 1.0<br />
          <strong>Effective Date:</strong> January 14, 2025<br />
          <strong>Next Review Date:</strong> January 14, 2026<br />
          <strong>Approved By:</strong> Board of Directors, BantuHive Ltd
        </p>
      </section>
    </PolicyLayout>
  );
};

export default DataProtection;
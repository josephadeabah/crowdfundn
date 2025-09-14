import React from 'react';

const RiskFramework = () => {
  return (
    <div className="min-h-screen bg-white text-gray-700">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Risk Management Framework
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Comprehensive risk management policies and procedures for
              BantuHive Ltd's crowdfunding platform operations in compliance
              with SEC Ghana regulations.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Executive Summary */}
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                Executive Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This Risk Management Framework establishes BantuHive Ltd's
                approach to identifying, assessing, managing, and monitoring
                risks associated with operating a crowdfunding platform. The
                framework ensures compliance with SEC Ghana regulations while
                protecting investors, maintaining market integrity, and
                supporting sustainable business operations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-accent/20 p-4 rounded">
                  <h4 className="font-semibold mb-2">Framework Scope</h4>
                  <p className="text-sm text-muted-foreground">
                    Covers operational, financial, regulatory, and technology
                    risks
                  </p>
                </div>
                <div className="bg-accent/20 p-4 rounded">
                  <h4 className="font-semibold mb-2">Review Frequency</h4>
                  <p className="text-sm text-muted-foreground">
                    Quarterly assessments with annual comprehensive reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Governance Structure */}
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                Risk Governance Structure
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Board of Directors
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Ultimate accountability for risk management oversight
                    </li>
                    <li>Approval of risk appetite and tolerance levels</li>
                    <li>Quarterly review of risk management effectiveness</li>
                    <li>Appointment of Chief Risk Officer (CRO)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Risk Committee</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Monthly risk assessment meetings</li>
                    <li>Review and approve risk policies and procedures</li>
                    <li>Monitor key risk indicators and metrics</li>
                    <li>Escalate material risks to the Board</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Three Lines of Defense
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-accent/20 p-4 rounded">
                      <h4 className="font-semibold mb-2">First Line</h4>
                      <p className="text-sm text-muted-foreground">
                        Business operations with embedded risk controls
                      </p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded">
                      <h4 className="font-semibold mb-2">Second Line</h4>
                      <p className="text-sm text-muted-foreground">
                        Risk management and compliance functions
                      </p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded">
                      <h4 className="font-semibold mb-2">Third Line</h4>
                      <p className="text-sm text-muted-foreground">
                        Internal audit providing independent assurance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Identification and Assessment */}
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                Risk Categories and Assessment
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    1. Operational Risks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">
                        Platform Technology Risk
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        System failures, cyber attacks, data breaches
                      </p>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        High Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">
                        Fraud and Misconduct
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Project fraud, identity theft, money laundering
                      </p>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        High Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">
                        Operational Failure
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Process failures, human error, service disruption
                      </p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Medium Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">Third-Party Risk</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Payment processor, cloud provider failures
                      </p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Medium Impact
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    2. Financial Risks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">Credit Risk</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Issuer default, investor losses
                      </p>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        High Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">Liquidity Risk</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Insufficient funds for operations
                      </p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Medium Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">Market Risk</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Economic downturns affecting fundraising
                      </p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Medium Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">
                        Foreign Exchange Risk
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Currency fluctuations affecting returns
                      </p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Low Impact
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    3. Regulatory and Compliance Risks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">SEC Non-Compliance</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Regulatory violations, license revocation
                      </p>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        High Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">AML/KYC Failures</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Money laundering, terrorist financing
                      </p>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        High Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">
                        Data Protection Violations
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        GDPR/privacy law breaches
                      </p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Medium Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">Tax Compliance</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Tax reporting obligations
                      </p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Medium Impact
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    4. Strategic and Reputational Risks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">
                        Reputational Damage
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Negative publicity, loss of trust
                      </p>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        High Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">Competition Risk</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Market share loss to competitors
                      </p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Medium Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">
                        Business Model Risk
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Changes in market demand
                      </p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Medium Impact
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">Key Personnel Risk</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Loss of critical staff
                      </p>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Medium Impact
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Mitigation Strategies */}
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                Risk Mitigation Strategies
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Technology and Cybersecurity Controls
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Multi-layered security architecture with encryption,
                      firewalls, and intrusion detection
                    </li>
                    <li>Regular security audits and penetration testing</li>
                    <li>
                      24/7 system monitoring and incident response procedures
                    </li>
                    <li>
                      Backup and disaster recovery systems with RTO less than 4
                      hours
                    </li>
                    <li>SOC 2 Type II compliance certification</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Due Diligence and Project Screening
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Multi-stage project evaluation process with financial,
                      legal, and business analysis
                    </li>
                    <li>
                      Background checks on project owners and key personnel
                    </li>
                    <li>
                      Third-party verification of financial statements and
                      business plans
                    </li>
                    <li>
                      Ongoing monitoring of funded projects with milestone
                      reporting
                    </li>
                    <li>Escrow services for investor fund protection</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Investor Protection Measures
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Comprehensive risk disclosure and investor education
                    </li>
                    <li>
                      Investment limits based on investor sophistication and net
                      worth
                    </li>
                    <li>Cooling-off periods for investment decisions</li>
                    <li>
                      Segregated client accounts with institutional custodians
                    </li>
                    <li>Investor compensation scheme participation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Operational Risk Controls
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Documented procedures for all critical business processes
                    </li>
                    <li>Segregation of duties and maker-checker controls</li>
                    <li>
                      Regular staff training on risk management and compliance
                    </li>
                    <li>
                      Business continuity planning with alternative operating
                      locations
                    </li>
                    <li>
                      Professional indemnity and cyber liability insurance
                      coverage
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Risk Monitoring and Reporting */}
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                Risk Monitoring and Reporting
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Key Risk Indicators (KRIs)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-accent/20">
                          <th className="border border-border p-3 text-left">
                            Risk Category
                          </th>
                          <th className="border border-border p-3 text-left">
                            Key Indicator
                          </th>
                          <th className="border border-border p-3 text-left">
                            Threshold
                          </th>
                          <th className="border border-border p-3 text-left">
                            Frequency
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3">
                            Operational
                          </td>
                          <td className="border border-border p-3">
                            System uptime
                          </td>
                          <td className="border border-border p-3">
                            {'>'} 99.5%
                          </td>
                          <td className="border border-border p-3">Daily</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">Credit</td>
                          <td className="border border-border p-3">
                            Default rate
                          </td>
                          <td className="border border-border p-3">{'<'} 5%</td>
                          <td className="border border-border p-3">Monthly</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">
                            Liquidity
                          </td>
                          <td className="border border-border p-3">
                            Cash reserves
                          </td>
                          <td className="border border-border p-3">
                            {'>'} 6 months operating expenses
                          </td>
                          <td className="border border-border p-3">Weekly</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3">
                            Compliance
                          </td>
                          <td className="border border-border p-3">
                            Regulatory breaches
                          </td>
                          <td className="border border-border p-3">
                            Zero tolerance
                          </td>
                          <td className="border border-border p-3">Daily</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Reporting Structure
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-accent/20 p-4 rounded">
                      <h4 className="font-semibold mb-2">Daily Reports</h4>
                      <p className="text-sm text-muted-foreground">
                        Operational metrics, system alerts, transaction
                        monitoring
                      </p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded">
                      <h4 className="font-semibold mb-2">Monthly Reports</h4>
                      <p className="text-sm text-muted-foreground">
                        Risk dashboard, KRI analysis, incident summary
                      </p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded">
                      <h4 className="font-semibold mb-2">Quarterly Reports</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive risk assessment, stress testing, Board
                        reporting
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Management */}
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                Incident Management and Response
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Incident Classification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded p-4 border-red-300">
                      <h4 className="font-semibold mb-2 text-red-700">
                        Critical (P1)
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        System down, data breach, regulatory violation
                      </p>
                      <p className="text-xs text-red-600">
                        Response: Immediate ({'<'} 15 minutes)
                      </p>
                    </div>
                    <div className="border rounded p-4 border-yellow-300">
                      <h4 className="font-semibold mb-2 text-yellow-700">
                        High (P2)
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Service degradation, security incident
                      </p>
                      <p className="text-xs text-yellow-600">
                        Response: Within 1 hour
                      </p>
                    </div>
                    <div className="border rounded p-4 border-green-300">
                      <h4 className="font-semibold mb-2 text-green-700">
                        Medium (P3)
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Minor service issues, process failures
                      </p>
                      <p className="text-xs text-green-600">
                        Response: Within 4 hours
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Response Procedures
                  </h3>
                  <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                    <li>Immediate containment and impact assessment</li>
                    <li>
                      Notification to relevant stakeholders (management,
                      regulators, customers)
                    </li>
                    <li>Investigation and root cause analysis</li>
                    <li>Implementation of corrective actions</li>
                    <li>Post-incident review and lessons learned</li>
                    <li>Update of policies and procedures as needed</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Business Continuity */}
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                Business Continuity and Disaster Recovery
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Recovery Objectives
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-accent/20 p-4 rounded">
                      <h4 className="font-semibold mb-2">
                        Recovery Time Objective (RTO)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Critical systems: 4 hours
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Non-critical systems: 24 hours
                      </p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded">
                      <h4 className="font-semibold mb-2">
                        Recovery Point Objective (RPO)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Transactional data: 1 hour
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Configuration data: 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Continuity Strategies
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Geographically distributed data centers with real-time
                      replication
                    </li>
                    <li>
                      Cloud-based infrastructure with automatic failover
                      capabilities
                    </li>
                    <li>Alternative operating locations for critical staff</li>
                    <li>
                      Vendor agreements for emergency hardware and services
                    </li>
                    <li>Regular business continuity testing and simulations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Detailed Risk Policy */}
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                BantuHive Risk Management Policy
              </h2>

              <div className="space-y-8">
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        1. Policy Overview and Objectives
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        BantuHive Ltd's Risk Management Policy establishes the
                        foundational framework for identifying, assessing,
                        managing, and monitoring all material risks that could
                        impact our crowdfunding operations. This comprehensive
                        policy serves as the cornerstone of our risk management
                        approach, ensuring that all stakeholders understand
                        their roles and responsibilities in maintaining
                        effective risk governance throughout the organization.
                        The policy is designed to support our strategic
                        objectives while protecting investor interests,
                        maintaining regulatory compliance, and preserving the
                        integrity of Ghana's capital markets. Our risk
                        management philosophy emphasizes proactive risk
                        identification and mitigation rather than reactive
                        responses to materialized risks. This approach enables
                        us to anticipate potential challenges and implement
                        appropriate controls before risks can adversely impact
                        our operations, stakeholders, or the broader ecosystem.
                        The policy recognizes that effective risk management is
                        not merely about avoiding risks but about understanding
                        and managing them to optimize our risk-return profile
                        while supporting sustainable business growth. We
                        acknowledge that risk management is an ongoing process
                        that requires constant vigilance, regular assessment,
                        and continuous improvement to remain effective in our
                        dynamic operating environment. The policy establishes
                        clear accountability structures, ensuring that risk
                        management responsibilities are appropriately
                        distributed across all levels of the organization, from
                        the Board of Directors to front-line operational staff.
                        Furthermore, this policy serves as a communication tool,
                        ensuring that all personnel understand the importance of
                        risk management and their specific roles in maintaining
                        our risk management framework's effectiveness.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        2. Risk Governance Structure and Authority
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        The risk governance structure at BantuHive Ltd operates
                        through a multi-tiered framework that ensures
                        appropriate oversight, accountability, and
                        decision-making authority at each organizational level.
                        At the apex of our governance structure, the Board of
                        Directors maintains ultimate responsibility for risk
                        oversight, including the establishment of our risk
                        appetite, approval of key risk policies, and monitoring
                        of our overall risk profile. The Board exercises its
                        risk governance responsibilities through regular review
                        of risk reports, approval of material risk management
                        decisions, and ensuring that adequate resources are
                        allocated to support effective risk management
                        activities. The Risk Committee, established as a
                        sub-committee of the Board, provides specialized
                        expertise and dedicated focus on risk matters, meeting
                        monthly to review risk assessments, monitor key risk
                        indicators, and evaluate the effectiveness of our risk
                        management strategies. This committee comprises
                        independent directors with relevant expertise in
                        finance, technology, and regulatory matters, ensuring
                        that risk oversight benefits from diverse perspectives
                        and specialized knowledge. The Chief Risk Officer (CRO)
                        serves as the senior executive responsible for
                        implementing the Board's risk strategy and managing
                        day-to-day risk management activities. The CRO maintains
                        independence from business lines to ensure objective
                        risk assessment and reporting, with direct access to the
                        Board and Risk Committee. Supporting the CRO, department
                        heads and risk coordinators throughout the organization
                        ensure that risk management principles are embedded in
                        daily operations and decision-making processes. This
                        distributed approach to risk governance ensures that
                        risk considerations are integrated into all business
                        activities while maintaining clear accountability and
                        reporting lines throughout the organization.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        3. Risk Appetite and Tolerance Framework
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        BantuHive's risk appetite framework defines the amount
                        and types of risk we are willing to accept in pursuit of
                        our strategic objectives and stakeholder value creation.
                        Our risk appetite is calibrated to ensure that we can
                        fulfill our mission of democratizing access to capital
                        while maintaining the highest standards of investor
                        protection and regulatory compliance. The framework
                        establishes both qualitative and quantitative parameters
                        for different risk categories, providing clear guidance
                        for decision-making across all organizational levels. We
                        maintain a conservative approach to operational and
                        compliance risks, reflecting our commitment to
                        maintaining the trust and confidence of investors,
                        regulators, and the broader market ecosystem. For
                        operational risks, our tolerance level is set at minimal
                        acceptable levels, with zero tolerance for regulatory
                        breaches, fraud, or activities that could compromise
                        investor funds or personal data. Our technology risk
                        appetite reflects the critical importance of platform
                        reliability and security, with stringent uptime
                        requirements and comprehensive cybersecurity measures.
                        In contrast, we maintain a moderate risk appetite for
                        strategic and business risks that are inherent to our
                        growth objectives, including market expansion
                        initiatives and product development activities. Credit
                        risk appetite is carefully calibrated to balance our
                        role in supporting innovative projects with our
                        responsibility to protect investor interests, utilizing
                        comprehensive due diligence processes and
                        diversification strategies. The risk appetite framework
                        is regularly reviewed and updated to reflect changes in
                        our business strategy, market conditions, and regulatory
                        environment. All risk appetite statements are
                        accompanied by specific tolerance levels, early warning
                        indicators, and escalation procedures to ensure that
                        risk exposures remain within acceptable boundaries and
                        that appropriate action is taken when tolerance levels
                        are approached or exceeded.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        4. Operational Risk Management Framework
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Operational risk management at BantuHive encompasses the
                        identification, assessment, and mitigation of risks
                        arising from inadequate or failed internal processes,
                        people, systems, or external events. Our operational
                        risk framework is built upon the foundation of robust
                        process documentation, clear procedural guidelines, and
                        comprehensive control mechanisms that ensure consistent
                        and reliable service delivery to our stakeholders. We
                        maintain detailed operational procedures for all
                        critical business functions, including project
                        onboarding, investor verification, fund processing, and
                        customer service activities. These procedures are
                        regularly reviewed and updated to reflect best
                        practices, regulatory requirements, and lessons learned
                        from operational incidents. Our operational risk
                        assessment process involves systematic identification of
                        potential failure points within each business process,
                        evaluation of their likelihood and potential impact, and
                        implementation of appropriate control measures. Process
                        controls include segregation of duties, maker-checker
                        procedures, automated validation checks, and regular
                        supervisory reviews to ensure that operations conform to
                        established standards and regulatory requirements. Human
                        resources risk management includes comprehensive
                        recruitment procedures, regular training programs,
                        performance monitoring, and succession planning for key
                        positions to minimize the impact of personnel changes on
                        operational continuity. We maintain robust backup
                        procedures and alternative processing capabilities to
                        ensure business continuity in the event of operational
                        disruptions. External operational risks, including those
                        arising from third-party service providers, are managed
                        through comprehensive vendor due diligence, contractual
                        risk allocation, and ongoing performance monitoring. Our
                        operational risk management framework includes regular
                        risk and control assessments, incident tracking and
                        analysis, and continuous improvement initiatives to
                        enhance operational resilience and efficiency.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        5. Technology and Cybersecurity Risk Management
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Technology and cybersecurity risk management represents
                        a critical component of our risk framework, given our
                        dependence on digital platforms and the sensitive nature
                        of the financial and personal data we process. Our
                        cybersecurity strategy is built upon a multi-layered
                        defense approach that includes network security,
                        application security, data protection, and user access
                        controls. We implement industry-leading security
                        technologies, including advanced firewalls, intrusion
                        detection systems, encryption protocols, and continuous
                        monitoring tools to protect against cyber threats. Our
                        security architecture follows the principle of defense
                        in depth, ensuring that multiple security layers protect
                        our systems and data even if individual controls are
                        compromised. Regular security assessments, including
                        vulnerability scans, penetration testing, and security
                        audits, help identify and address potential weaknesses
                        before they can be exploited by malicious actors. We
                        maintain comprehensive incident response procedures that
                        enable rapid detection, containment, and recovery from
                        cybersecurity incidents, minimizing potential damage and
                        ensuring swift restoration of normal operations.
                        Employee cybersecurity training programs ensure that all
                        personnel understand their role in maintaining security
                        and can recognize and respond appropriately to potential
                        threats. Our technology risk management extends beyond
                        cybersecurity to include system reliability, performance
                        monitoring, and capacity planning to ensure that our
                        platform can meet operational demands under various
                        scenarios. We maintain robust backup and disaster
                        recovery capabilities, including geographically
                        distributed data centers and real-time data replication,
                        to ensure business continuity in the event of technology
                        failures. Third-party technology risks are managed
                        through rigorous vendor security assessments,
                        contractual security requirements, and ongoing
                        monitoring of service provider security postures. Our
                        technology governance includes regular review of our
                        technology strategy, infrastructure investments, and
                        emerging technology adoption to ensure that our
                        technology capabilities continue to support our business
                        objectives while maintaining appropriate security and
                        risk management standards.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        6. Credit and Investment Risk Assessment
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Credit and investment risk management forms the core of
                        our risk framework, given our role as an facilitating
                        investment in early-stage projects and companies. Our
                        credit risk assessment process begins with comprehensive
                        due diligence on all projects seeking funding through
                        our platform, including analysis of business models,
                        financial projections, management capabilities, and
                        market opportunities. We employ a multi-stage evaluation
                        process that combines quantitative financial analysis
                        with qualitative assessments of project viability,
                        management competence, and market potential. Our due
                        diligence process includes verification of financial
                        information, legal structure review, background checks
                        on key personnel, and assessment of intellectual
                        property and competitive positioning. We maintain
                        detailed scoring models that systematically evaluate
                        projects across multiple risk dimensions, enabling
                        consistent and objective risk assessment while
                        supporting transparency in our decision-making process.
                        Portfolio diversification strategies are implemented to
                        limit concentration risk across industries, geographic
                        regions, project stages, and individual investments,
                        ensuring that our platform's risk profile remains
                        balanced and manageable. We establish investment limits
                        for individual projects and overall portfolio exposure
                        to prevent excessive concentration in any single
                        investment or risk category. Ongoing monitoring of
                        invested projects includes regular financial reporting,
                        milestone tracking, and performance assessment to
                        identify potential problems early and take appropriate
                        remedial action. Our investment risk framework includes
                        stress testing and scenario analysis to evaluate
                        portfolio performance under various economic and market
                        conditions, ensuring that we understand potential losses
                        and can take appropriate action to protect investor
                        interests. We maintain clear escalation procedures for
                        projects experiencing difficulties, including
                        restructuring options, additional oversight
                        requirements, and, when necessary, write-off procedures.
                        The credit risk framework is regularly reviewed and
                        updated to reflect market conditions, regulatory
                        changes, and lessons learned from portfolio performance,
                        ensuring that our risk assessment capabilities continue
                        to evolve and improve over time.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        7. Market and Liquidity Risk Management
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Market and liquidity risk management at BantuHive
                        addresses the potential adverse effects of market
                        volatility and liquidity constraints on our operations
                        and the investments facilitated through our platform.
                        Market risk encompasses the potential for losses arising
                        from changes in market conditions, including economic
                        downturns, sector-specific challenges, and broader
                        financial market volatility that could affect project
                        valuations and fundraising success rates. Our market
                        risk assessment includes regular analysis of economic
                        indicators, industry trends, and market sentiment to
                        identify potential challenges and opportunities in our
                        operating environment. We maintain diversified exposure
                        across different sectors and project types to minimize
                        the impact of sector-specific downturns while ensuring
                        that our platform remains resilient to market
                        volatility. Liquidity risk management focuses on
                        ensuring that we maintain adequate liquid resources to
                        meet our operational obligations and support business
                        continuity under various scenarios. We maintain
                        conservative liquidity management policies that include
                        minimum cash reserves, diversified funding sources, and
                        contingency financing arrangements to ensure operational
                        continuity even during periods of market stress. Our
                        liquidity planning includes stress testing scenarios
                        that evaluate our liquidity position under various
                        adverse conditions, including significant withdrawal of
                        investor funds, operational disruptions, or market
                        downturns that could affect our revenue streams. We
                        monitor key liquidity indicators daily and maintain
                        early warning systems that alert management to potential
                        liquidity concerns before they become critical. Market
                        risk monitoring includes regular assessment of portfolio
                        performance, sector concentration analysis, and
                        evaluation of macroeconomic factors that could affect
                        our business. We maintain flexible business strategies
                        that can be adapted to changing market conditions,
                        including the ability to adjust our project selection
                        criteria, modify our marketing strategies, and implement
                        cost management measures as needed. Our market and
                        liquidity risk framework includes comprehensive
                        reporting to senior management and the Board, ensuring
                        that market risks are understood and appropriately
                        managed at all organizational levels.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        8. Regulatory and Compliance Risk Framework
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Regulatory and compliance risk management represents a
                        fundamental pillar of our risk framework, reflecting the
                        critical importance of maintaining full compliance with
                        all applicable laws, regulations, and supervisory
                        requirements in Ghana and other jurisdictions where we
                        operate. Our compliance framework is designed to ensure
                        adherence to Securities and Exchange Commission
                        regulations, anti-money laundering requirements, data
                        protection laws, and all other relevant regulatory
                        obligations. We maintain a comprehensive compliance
                        monitoring program that includes regular regulatory
                        updates, impact assessments of new regulations, and
                        implementation of necessary policy and procedural
                        changes to ensure ongoing compliance. Our legal and
                        compliance team conducts regular compliance reviews,
                        coordinates with external legal counsel on complex
                        regulatory matters, and maintains ongoing dialogue with
                        regulatory authorities to ensure clear understanding of
                        regulatory expectations and requirements. We have
                        implemented robust know-your-customer (KYC) and
                        anti-money laundering (AML) procedures that exceed
                        minimum regulatory requirements, including enhanced due
                        diligence for higher-risk customers and transactions,
                        ongoing monitoring of customer activities, and
                        comprehensive reporting of suspicious activities to
                        relevant authorities. Our compliance training program
                        ensures that all employees understand their regulatory
                        obligations and can identify and escalate potential
                        compliance issues appropriately. We maintain detailed
                        compliance policies and procedures that are regularly
                        updated to reflect regulatory changes and best
                        practices, with clear accountability structures and
                        regular compliance testing to ensure policy
                        effectiveness. Regulatory risk assessment includes
                        ongoing monitoring of the regulatory environment,
                        participation in industry consultations, and proactive
                        engagement with regulators to stay informed of evolving
                        requirements and expectations. We maintain comprehensive
                        documentation of all compliance activities, including
                        training records, testing results, and regulatory
                        communications, to demonstrate our commitment to
                        regulatory compliance and facilitate regulatory
                        examinations. Our compliance framework includes regular
                        internal audits and independent compliance reviews to
                        provide objective assessment of our compliance
                        effectiveness and identify areas for improvement.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        9. Reputational Risk Management Strategy
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Reputational risk management at BantuHive recognizes
                        that our reputation represents one of our most valuable
                        assets and a critical factor in our ability to attract
                        investors, projects, and maintain regulatory support.
                        Our reputational risk framework encompasses proactive
                        measures to build and maintain stakeholder trust, as
                        well as reactive procedures to address potential
                        reputational threats when they arise. We maintain the
                        highest standards of business conduct, transparency, and
                        customer service to build a strong foundation of
                        stakeholder trust and confidence. Our reputational risk
                        assessment includes regular monitoring of public
                        perception, media coverage, social media sentiment, and
                        stakeholder feedback to identify potential reputational
                        concerns before they escalate into significant issues.
                        We have established clear communication protocols and
                        crisis management procedures to ensure rapid and
                        appropriate response to reputational threats, including
                        designated spokespersons, pre-approved messaging
                        frameworks, and coordination with external
                        communications professionals when necessary. Our
                        commitment to transparency includes regular publication
                        of performance data, regulatory compliance reports, and
                        stakeholder communications that demonstrate our
                        dedication to accountability and open communication. We
                        maintain robust customer service standards and complaint
                        resolution procedures to ensure that stakeholder
                        concerns are addressed promptly and fairly, preventing
                        minor issues from escalating into reputational problems.
                        Employee conduct standards and training programs ensure
                        that all personnel understand their role in protecting
                        and enhancing our reputation through professional
                        behavior, ethical decision-making, and commitment to our
                        values. We carefully manage our relationships with
                        media, regulators, and other stakeholders through
                        proactive engagement, honest communication, and
                        demonstration of our commitment to our mission and
                        values. Social responsibility initiatives and community
                        engagement activities help build positive stakeholder
                        relationships and demonstrate our commitment to
                        supporting Ghana's economic development and financial
                        inclusion objectives. Our reputational risk monitoring
                        includes regular stakeholder surveys, media monitoring,
                        and social media analysis to track public perception and
                        identify emerging reputational risks that require
                        management attention.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        10. Third-Party and Vendor Risk Management
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Third-party and vendor risk management at BantuHive
                        addresses the risks arising from our reliance on
                        external service providers, technology vendors, and
                        other business partners who support our operations. Our
                        vendor risk management framework begins with
                        comprehensive due diligence on all potential service
                        providers, including assessment of their financial
                        stability, operational capabilities, security posture,
                        and regulatory compliance status. We maintain detailed
                        vendor selection criteria that evaluate not only cost
                        and service capabilities but also risk management
                        practices, business continuity planning, and alignment
                        with our values and regulatory requirements. Contractual
                        risk management includes careful negotiation of service
                        level agreements, liability allocation, data protection
                        requirements, and business continuity provisions to
                        ensure that vendor relationships support rather than
                        compromise our risk management objectives. We implement
                        ongoing vendor monitoring programs that include regular
                        performance reviews, financial health assessments, and
                        compliance audits to ensure that vendors continue to
                        meet our standards and requirements throughout the
                        relationship. Critical vendor relationships are subject
                        to enhanced monitoring and management, including regular
                        business reviews, contingency planning, and alternative
                        vendor identification to minimize the impact of
                        potential service disruptions. Our vendor risk framework
                        includes specific requirements for technology vendors,
                        including security assessments, penetration testing, and
                        ongoing security monitoring to ensure that third-party
                        technology services meet our cybersecurity standards. We
                        maintain comprehensive vendor incident management
                        procedures that enable rapid response to vendor-related
                        problems, including service disruptions, security
                        incidents, or compliance failures. Data protection and
                        confidentiality requirements are carefully managed
                        through contractual provisions, ongoing monitoring, and
                        regular audits to ensure that vendors appropriately
                        protect sensitive information. We regularly review our
                        vendor portfolio to identify concentration risks, assess
                        the criticality of different vendor relationships, and
                        develop contingency plans for managing vendor failures
                        or service disruptions. Our vendor risk management
                        includes regular updates to our vendor policies and
                        procedures to reflect best practices, regulatory
                        changes, and lessons learned from vendor management
                        experiences.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        11. Business Continuity and Disaster Recovery Planning
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Business continuity and disaster recovery planning at
                        BantuHive ensures that we can maintain critical
                        operations and rapidly recover from significant
                        disruptions, whether they arise from natural disasters,
                        technology failures, cybersecurity incidents, or other
                        unexpected events. Our business continuity framework is
                        built upon comprehensive risk assessment that identifies
                        potential disruption scenarios, evaluates their
                        likelihood and potential impact, and develops
                        appropriate response strategies for each identified
                        risk. We maintain detailed business impact analyses for
                        all critical business functions, establishing recovery
                        time objectives (RTO) and recovery point objectives
                        (RPO) that guide our continuity planning and resource
                        allocation decisions. Critical business functions,
                        including investor transactions, project monitoring,
                        customer service, and regulatory reporting, are
                        supported by robust backup procedures, alternative
                        processing capabilities, and clear escalation protocols
                        to ensure minimal disruption during crisis situations.
                        Our technology disaster recovery capabilities include
                        geographically distributed data centers, real-time data
                        replication, automated failover systems, and
                        comprehensive backup procedures that enable rapid
                        restoration of technology services following system
                        failures or other disruptions. We maintain alternative
                        operating locations and remote work capabilities that
                        enable critical staff to continue working even if our
                        primary facilities are unavailable, ensuring that
                        essential business functions can be maintained during
                        facility-related disruptions. Regular business
                        continuity testing, including tabletop exercises, system
                        failover tests, and full-scale disaster recovery
                        simulations, validate our continuity plans and identify
                        areas for improvement. Our crisis management procedures
                        include clear command and control structures,
                        communication protocols, and decision-making authorities
                        that enable rapid and coordinated response to crisis
                        situations. We maintain comprehensive vendor contingency
                        plans that address potential disruptions to critical
                        third-party services, including alternative vendor
                        arrangements and emergency service provisions. Employee
                        emergency preparedness includes training programs,
                        emergency contact procedures, and clear guidelines for
                        responding to various emergency situations. Our business
                        continuity planning includes regular plan updates,
                        lessons learned integration, and continuous improvement
                        initiatives to ensure that our preparedness remains
                        effective and current.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        12. Anti-Money Laundering and Financial Crime Prevention
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Anti-money laundering (AML) and financial crime
                        prevention represents a critical component of our risk
                        management framework, reflecting our commitment to
                        preventing our platform from being used for illicit
                        financial activities. Our AML program exceeds regulatory
                        minimum requirements and includes comprehensive customer
                        due diligence, ongoing transaction monitoring, and
                        robust reporting procedures designed to detect and
                        prevent money laundering, terrorist financing, and other
                        financial crimes. Customer due diligence procedures
                        include identity verification, source of funds
                        verification, beneficial ownership identification, and
                        politically exposed person (PEP) screening for all
                        platform users. Enhanced due diligence procedures apply
                        to higher-risk customers, including those from high-risk
                        jurisdictions, politically exposed persons, and
                        customers engaged in cash-intensive businesses. Our
                        transaction monitoring system employs sophisticated
                        algorithms and pattern recognition technology to
                        identify unusual or suspicious transaction patterns that
                        may indicate money laundering or other illicit
                        activities. We maintain comprehensive suspicious
                        activity reporting procedures that ensure timely and
                        accurate reporting to relevant authorities when
                        potential financial crimes are identified. Our AML
                        training program ensures that all employees understand
                        their obligations under anti-money laundering laws and
                        can identify and respond appropriately to potential red
                        flags or suspicious activities. We maintain detailed AML
                        policies and procedures that are regularly updated to
                        reflect regulatory changes, industry best practices, and
                        emerging financial crime trends. Record-keeping
                        requirements are strictly maintained, with comprehensive
                        documentation of all customer due diligence activities,
                        transaction monitoring results, and suspicious activity
                        reports. We conduct regular AML risk assessments to
                        identify emerging threats, evaluate the effectiveness of
                        our controls, and implement necessary enhancements to
                        our AML program. Sanctions screening procedures ensure
                        that we do not facilitate transactions involving
                        sanctioned individuals, entities, or jurisdictions, with
                        regular updates to our sanctions databases and automated
                        screening of all transactions and customer
                        relationships. Our AML program includes regular
                        independent testing and auditing to provide objective
                        assessment of program effectiveness and identify areas
                        for improvement. We maintain ongoing dialogue with law
                        enforcement and regulatory authorities to stay informed
                        of emerging threats and contribute to broader financial
                        crime prevention efforts.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        13. Data Protection and Privacy Risk Management
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Data protection and privacy risk management at BantuHive
                        addresses the critical importance of protecting personal
                        and sensitive information entrusted to us by investors,
                        project creators, and other stakeholders. Our data
                        protection framework is designed to comply with
                        applicable privacy laws, including Ghana's Data
                        Protection Act and international standards such as GDPR
                        where applicable, while maintaining the highest
                        standards of data security and privacy protection. We
                        implement privacy-by-design principles throughout our
                        systems and processes, ensuring that data protection
                        considerations are integrated into all business
                        activities from the outset rather than added as an
                        afterthought. Our data governance framework includes
                        comprehensive data classification procedures, access
                        controls, retention policies, and disposal procedures
                        that ensure appropriate handling of different types of
                        data throughout their lifecycle. We maintain detailed
                        privacy policies and procedures that clearly explain how
                        we collect, use, process, and protect personal data,
                        with regular updates to reflect changes in our practices
                        or applicable laws. Data minimization principles guide
                        our data collection and processing activities, ensuring
                        that we collect only the information necessary for
                        legitimate business purposes and retain it only for as
                        long as required by law or business necessity. We
                        implement robust technical and organizational security
                        measures to protect personal data against unauthorized
                        access, disclosure, alteration, or destruction,
                        including encryption, access controls, audit trails, and
                        regular security assessments. Employee privacy training
                        ensures that all personnel understand their data
                        protection obligations and can handle personal data
                        appropriately in their daily work activities. We
                        maintain comprehensive procedures for responding to data
                        subject requests, including access requests, correction
                        requests, and deletion requests, ensuring that
                        individual privacy rights are respected and fulfilled
                        promptly. Data breach response procedures enable rapid
                        detection, containment, assessment, and notification of
                        data privacy incidents, minimizing potential harm to
                        affected individuals and ensuring compliance with breach
                        notification requirements. We conduct regular privacy
                        impact assessments for new projects, systems, and
                        processes to identify and mitigate potential privacy
                        risks before they can affect individuals' privacy
                        rights. Cross-border data transfer procedures ensure
                        that personal data shared with international partners or
                        service providers receives appropriate protection
                        regardless of the jurisdiction where it is processed.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        14. Environmental, Social, and Governance (ESG) Risk
                        Integration
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Environmental, Social, and Governance (ESG) risk
                        management at BantuHive reflects our commitment to
                        sustainable business practices and responsible
                        investment facilitation. Our ESG framework recognizes
                        that environmental, social, and governance factors can
                        significantly impact the long-term success of both our
                        platform and the projects we support. Environmental risk
                        assessment includes evaluation of climate-related risks,
                        resource sustainability, and environmental impact of
                        projects seeking funding through our platform. We
                        encourage and prioritize projects that demonstrate
                        positive environmental impact or contribute to
                        sustainability objectives, while carefully assessing the
                        environmental risks associated with different types of
                        projects. Social risk management encompasses assessment
                        of labor practices, community impact, human rights
                        considerations, and social sustainability of supported
                        projects. We maintain clear standards for project
                        eligibility that exclude projects with significant
                        adverse social impacts and prioritize those that
                        contribute to positive social outcomes such as job
                        creation, community development, or social inclusion.
                        Governance risk assessment includes evaluation of
                        corporate governance standards, transparency practices,
                        ethical business conduct, and stakeholder engagement for
                        both our own operations and the projects we support. We
                        maintain high standards of corporate governance
                        including independent board oversight, transparent
                        reporting, stakeholder engagement, and ethical business
                        practices. ESG due diligence is integrated into our
                        project evaluation process, ensuring that environmental,
                        social, and governance factors are considered alongside
                        traditional financial and business criteria. We provide
                        ESG guidance and support to project creators, helping
                        them understand and address ESG considerations that can
                        improve their long-term success and attractiveness to
                        socially conscious investors. Stakeholder engagement
                        includes regular dialogue with investors, project
                        creators, community representatives, and other
                        stakeholders to understand ESG expectations and ensure
                        that our practices align with stakeholder values and
                        societal needs. ESG reporting includes regular
                        disclosure of our ESG performance, supported projects'
                        ESG impact, and progress toward sustainability
                        objectives, demonstrating our commitment to transparency
                        and accountability. We participate in industry
                        initiatives and best practice sharing to contribute to
                        broader ESG advancement in the crowdfunding and
                        investment sector. Our ESG framework includes regular
                        review and updates to reflect evolving best practices,
                        stakeholder expectations, and regulatory developments in
                        the ESG space.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        15. Concentration Risk Management and Diversification
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Concentration risk management at BantuHive addresses the
                        potential adverse effects of excessive exposure to
                        individual investments, sectors, geographic regions, or
                        other risk factors that could disproportionately impact
                        our platform's performance. Our concentration risk
                        framework establishes clear limits and monitoring
                        procedures to ensure appropriate diversification across
                        multiple dimensions of our business and investment
                        activities. Geographic concentration limits ensure that
                        our platform maintains balanced exposure across
                        different regions within Ghana and, where applicable,
                        other markets, preventing excessive dependence on any
                        single geographic area that could be affected by local
                        economic, political, or regulatory changes. Sector
                        diversification guidelines limit our exposure to
                        individual industries or business sectors, encouraging a
                        balanced portfolio that can withstand sector-specific
                        downturns while supporting innovation across multiple
                        areas of the economy. Individual project concentration
                        limits prevent excessive exposure to any single
                        investment opportunity, ensuring that the failure of any
                        individual project cannot disproportionately impact our
                        platform's overall performance or investor returns. We
                        monitor concentration risk across multiple dimensions
                        including project size, investor base, funding
                        mechanisms, and risk ratings to ensure comprehensive
                        diversification. Time-based concentration analysis
                        ensures that our funding activities are appropriately
                        distributed across different time periods, preventing
                        excessive concentration of investment activity during
                        specific periods that could create liquidity or
                        operational challenges. Investor concentration
                        monitoring ensures that our platform maintains a diverse
                        investor base and is not overly dependent on a small
                        number of large investors whose withdrawal could
                        significantly impact our operations. Funding source
                        diversification ensures that our own operational funding
                        comes from multiple sources, reducing dependence on any
                        single revenue stream or funding source. We maintain
                        dynamic concentration monitoring systems that provide
                        real-time visibility into concentration levels across
                        all relevant dimensions, enabling proactive management
                        of concentration risks before they exceed acceptable
                        levels. Stress testing includes concentration risk
                        scenarios that evaluate the potential impact of losses
                        in heavily concentrated areas, informing our
                        diversification strategies and risk management
                        decisions. Regular concentration risk reporting to
                        senior management and the Board ensures that
                        concentration levels are understood and appropriately
                        managed at all organizational levels. Our concentration
                        risk framework includes specific escalation procedures
                        and corrective actions that are triggered when
                        concentration levels approach or exceed established
                        limits.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        16. Stress Testing and Scenario Analysis Framework
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Stress testing and scenario analysis at BantuHive
                        provide critical insights into our resilience under
                        adverse conditions and inform our risk management
                        strategies and capital planning decisions. Our stress
                        testing framework encompasses multiple types of analyses
                        including sensitivity testing, scenario analysis, and
                        reverse stress testing to provide comprehensive
                        understanding of our risk exposures and potential
                        vulnerabilities. Macroeconomic stress scenarios evaluate
                        the potential impact of economic downturns, inflation,
                        currency devaluation, and other macroeconomic factors on
                        our operations and the projects we support. These
                        scenarios help us understand how broader economic
                        conditions could affect investor demand, project success
                        rates, and our overall business performance.
                        Sector-specific stress tests examine the potential
                        impact of downturns in key industry sectors, regulatory
                        changes affecting specific industries, or other
                        sector-specific challenges that could impact
                        concentrated areas of our portfolio. Operational stress
                        scenarios evaluate our resilience to operational
                        disruptions including technology failures, cyber
                        attacks, key personnel losses, and third-party service
                        provider failures. Liquidity stress testing assesses our
                        ability to meet operational obligations and maintain
                        business continuity under various liquidity stress
                        scenarios including significant investor withdrawals,
                        revenue declines, or unexpected expense increases.
                        Credit stress testing evaluates potential losses from
                        project defaults under various economic scenarios,
                        helping us understand the adequacy of our risk
                        assessment procedures and capital reserves. Regulatory
                        stress scenarios assess the potential impact of
                        regulatory changes, compliance failures, or regulatory
                        enforcement actions on our operations and financial
                        position. Reverse stress testing identifies scenarios
                        that could threaten our business viability, helping us
                        understand our vulnerabilities and develop appropriate
                        contingency plans. Stress testing results inform our
                        risk appetite calibration, capital planning, liquidity
                        management, and business strategy decisions, ensuring
                        that our risk management framework remains robust under
                        various adverse conditions. We conduct stress testing on
                        a regular schedule and also perform ad-hoc testing in
                        response to emerging risks or significant changes in our
                        operating environment. Stress testing governance
                        includes independent validation of models and
                        assumptions, regular model updates to reflect changing
                        conditions, and comprehensive documentation of
                        methodologies and results. Results are regularly
                        reported to senior management and the Board, including
                        specific recommendations for risk management
                        enhancements or strategic adjustments based on stress
                        testing insights.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        17. Risk Reporting and Communication Protocols
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Risk reporting and communication at BantuHive ensures
                        that risk information is accurately captured,
                        appropriately analyzed, and effectively communicated to
                        relevant stakeholders at all levels of the organization.
                        Our risk reporting framework provides regular,
                        comprehensive, and actionable risk information that
                        supports informed decision-making and effective risk
                        management oversight. Daily risk reports provide
                        operational management with timely information on key
                        risk indicators, system performance metrics, transaction
                        anomalies, and emerging risk issues that require
                        immediate attention. These reports enable rapid response
                        to developing risk situations and support day-to-day
                        risk management activities. Weekly risk summaries
                        consolidate key risk metrics and trends for department
                        heads and senior management, providing visibility into
                        risk performance and early warning of potential issues
                        that may require management intervention. Monthly risk
                        dashboards provide comprehensive risk assessment
                        including key risk indicator performance, incident
                        summaries, control effectiveness metrics, and
                        forward-looking risk assessments for senior management
                        and the Risk Committee. Quarterly risk reports provide
                        detailed analysis of our overall risk profile, including
                        comprehensive assessment of all risk categories, stress
                        testing results, risk appetite performance, and
                        strategic risk considerations for Board review. Ad-hoc
                        risk reports are generated in response to significant
                        risk events, regulatory changes, or other developments
                        that require immediate stakeholder notification and
                        management attention. Risk communication protocols
                        ensure that risk information is communicated to
                        appropriate audiences with relevant detail levels,
                        ensuring that each stakeholder group receives the
                        information they need to fulfill their risk management
                        responsibilities. Escalation procedures provide clear
                        guidelines for when and how risk issues should be
                        escalated to higher levels of management, ensuring that
                        significant risks receive appropriate attention and
                        resources. Risk reporting includes both quantitative
                        metrics and qualitative assessments, providing
                        comprehensive understanding of our risk profile and the
                        effectiveness of our risk management activities. We
                        maintain robust data governance and quality assurance
                        procedures to ensure that risk reports are accurate,
                        consistent, and reliable. Risk communication training
                        ensures that personnel responsible for risk reporting
                        understand their responsibilities and can communicate
                        risk information effectively to their intended
                        audiences. Regular feedback mechanisms enable report
                        recipients to provide input on report content, format,
                        and frequency to ensure that risk reporting continues to
                        meet stakeholder needs and support effective risk
                        management.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        18. Risk Culture and Training Development
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Risk culture development at BantuHive recognizes that
                        effective risk management requires not just policies and
                        procedures but a shared understanding and commitment to
                        risk management principles throughout the organization.
                        Our risk culture initiatives are designed to embed risk
                        awareness and responsibility into our organizational
                        DNA, ensuring that every employee understands their role
                        in managing risk and feels empowered to identify and
                        address potential risk issues. Leadership commitment to
                        risk management is demonstrated through visible support
                        for risk management activities, allocation of adequate
                        resources to risk management functions, and integration
                        of risk considerations into strategic decision-making
                        processes. Senior management regularly communicates the
                        importance of risk management and models appropriate
                        risk management behaviors in their own activities.
                        Comprehensive risk training programs ensure that all
                        employees receive appropriate risk management education
                        based on their roles and responsibilities. New employee
                        orientation includes fundamental risk management
                        training that introduces our risk management philosophy,
                        key policies and procedures, and individual
                        responsibilities for risk management. Role-specific
                        training provides detailed guidance on risk management
                        requirements for different job functions, ensuring that
                        employees understand the specific risks associated with
                        their work and the controls they must implement. Regular
                        refresher training keeps risk management knowledge
                        current and addresses emerging risks, regulatory
                        changes, and lessons learned from risk events. Risk
                        awareness campaigns and communications help maintain
                        focus on risk management throughout the organization,
                        celebrating good risk management practices and sharing
                        lessons learned from risk events. We encourage open
                        communication about risk issues, including establishment
                        of reporting channels that enable employees to raise
                        risk concerns without fear of retaliation. Risk
                        performance metrics are integrated into employee
                        performance evaluations, ensuring that risk management
                        effectiveness is recognized and rewarded.
                        Cross-functional risk committees and working groups
                        provide opportunities for collaboration on risk
                        management issues and help ensure that risk
                        considerations are integrated into business processes
                        and decision-making. Regular risk culture assessments
                        help us understand the effectiveness of our culture
                        initiatives and identify areas for improvement. We
                        benchmark our risk culture against industry best
                        practices and regularly review and update our culture
                        development strategies to ensure they remain effective
                        and relevant.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        19. Risk Monitoring and Key Risk Indicator Systems
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Risk monitoring and key risk indicator (KRI) systems at
                        BantuHive provide early warning of potential risk issues
                        and enable proactive risk management intervention before
                        risks materialize into significant problems. Our
                        comprehensive monitoring framework includes both
                        automated and manual monitoring procedures that provide
                        continuous visibility into our risk profile across all
                        risk categories. Key risk indicators are carefully
                        selected metrics that provide insight into changing risk
                        levels and the effectiveness of our risk controls. These
                        indicators are calibrated with appropriate thresholds
                        that trigger management attention and potential
                        corrective action when exceeded. Technology-enabled
                        monitoring systems provide real-time tracking of key
                        operational metrics including system performance,
                        transaction volumes, error rates, and security events,
                        enabling immediate response to developing issues.
                        Automated alerting systems notify appropriate personnel
                        when KRI thresholds are breached or when unusual
                        patterns are detected that may indicate emerging risk
                        issues. Financial monitoring includes tracking of key
                        financial metrics such as liquidity ratios, operational
                        costs, revenue trends, and capital adequacy to ensure
                        financial stability and identify potential financial
                        stress. Compliance monitoring includes automated
                        screening for regulatory violations, ongoing assessment
                        of compliance with internal policies, and tracking of
                        compliance training completion and testing results.
                        Portfolio monitoring includes analysis of project
                        performance, default rates, sector concentrations, and
                        other investment-related metrics that could indicate
                        emerging credit or concentration risks. Customer
                        satisfaction and reputational monitoring includes
                        tracking of customer complaints, media coverage, social
                        media sentiment, and other indicators of stakeholder
                        satisfaction and reputational health. Vendor performance
                        monitoring includes tracking of service level
                        compliance, security incident reports, and other
                        indicators of third-party risk management effectiveness.
                        Environmental monitoring includes assessment of external
                        factors such as economic indicators, regulatory
                        developments, and competitive landscape changes that
                        could affect our risk profile. Regular KRI effectiveness
                        reviews ensure that our indicators remain relevant and
                        predictive of risk issues, with updates and enhancements
                        implemented as needed. Monitoring results are integrated
                        into our risk reporting framework, providing management
                        with comprehensive visibility into our risk profile and
                        the effectiveness of our risk management activities.
                        Response procedures are clearly defined for each KRI,
                        ensuring that appropriate action is taken when
                        monitoring identifies potential risk issues.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-primary">
                        20. Policy Review, Updates, and Continuous Improvement
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Policy review, updates, and continuous improvement
                        processes at BantuHive ensure that our risk management
                        framework remains effective, current, and aligned with
                        best practices, regulatory requirements, and our
                        evolving business needs. Our policy review framework
                        includes scheduled periodic reviews as well as
                        event-driven reviews triggered by significant changes in
                        our operating environment. Annual comprehensive policy
                        reviews evaluate the overall effectiveness of our risk
                        management framework, including assessment of policy
                        coverage, control effectiveness, and alignment with our
                        strategic objectives and risk appetite. These reviews
                        incorporate lessons learned from risk events, audit
                        findings, regulatory examinations, and industry best
                        practices to identify opportunities for framework
                        enhancement. Quarterly policy updates address regulatory
                        changes, emerging risks, and operational improvements
                        identified through ongoing monitoring and assessment
                        activities. Event-driven reviews are conducted in
                        response to significant risk events, regulatory changes,
                        system implementations, or business strategy changes
                        that could affect our risk profile or the adequacy of
                        our risk management approach. Stakeholder feedback is
                        actively solicited and incorporated into policy reviews,
                        including input from employees, regulators, auditors,
                        and other relevant parties who interact with our risk
                        management framework. Benchmarking against industry best
                        practices helps ensure that our policies and procedures
                        remain current with evolving risk management standards
                        and incorporate lessons learned by other organizations
                        in our industry. Impact assessment procedures evaluate
                        the potential effects of proposed policy changes on our
                        operations, costs, and risk profile, ensuring that
                        policy updates achieve their intended objectives while
                        minimizing unintended consequences. Change management
                        procedures ensure that policy updates are properly
                        communicated, training is provided where necessary, and
                        implementation is effectively monitored to ensure
                        successful adoption. Documentation standards ensure that
                        all policies are clearly written, regularly updated, and
                        properly version controlled, with change histories
                        maintained to support regulatory examinations and audit
                        activities. Effectiveness measurement includes regular
                        assessment of policy compliance, control performance,
                        and achievement of risk management objectives to ensure
                        that our policies are not just well-written but actually
                        effective in managing risks. Continuous improvement
                        initiatives actively seek opportunities to enhance our
                        risk management framework through process automation,
                        technology upgrades, training improvements, and other
                        enhancements that can improve efficiency and
                        effectiveness. Regular communication of policy updates
                        and improvements helps maintain organizational awareness
                        of our risk management evolution and reinforces our
                        commitment to continuous improvement and excellence in
                        risk management.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Framework Review and Updates */}
            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                Framework Review and Continuous Improvement
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Review Schedule
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Annual comprehensive framework review by Board of
                      Directors
                    </li>
                    <li>Quarterly risk assessment updates by Risk Committee</li>
                    <li>Monthly operational risk reviews by management</li>
                    <li>
                      Ad-hoc reviews triggered by significant incidents or
                      regulatory changes
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Key Performance Indicators
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">
                        Risk Culture Metrics
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Staff risk training completion rate, incident reporting
                        frequency
                      </p>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">
                        Control Effectiveness
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Control testing results, audit findings resolution
                      </p>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">
                        Regulatory Compliance
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Compliance rating, regulatory communications
                      </p>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold mb-2">Financial Impact</h4>
                      <p className="text-sm text-muted-foreground">
                        Risk-adjusted returns, insurance claims, loss provisions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-accent/20 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">
                Risk Management Contacts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Chief Risk Officer</h3>
                  <p className="text-sm text-muted-foreground">
                    Email: risk@bantuhive.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phone: +233 (0) 302 123 456
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Emergency: +233 (0) 244 567 890
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Risk Committee Secretary
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Email: riskcommittee@bantuhive.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phone: +233 (0) 302 123 457
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-accent">
                <p className="text-sm text-muted-foreground">
                  <strong>Document Version:</strong> 1.0 |{' '}
                  <strong>Last Updated:</strong> September 2024 |{' '}
                  <strong>Next Review:</strong> December 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskFramework;

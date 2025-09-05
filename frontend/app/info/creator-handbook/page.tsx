const CreatorHandbook = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary">
            Creator Handbook
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Your complete guide to launching successful crowdfunding campaigns
            on BantuHive.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-secondary">
                Getting Started
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Campaign Planning
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Define your funding goal and timeline</li>
                    <li>• Research your target audience</li>
                    <li>• Prepare compelling project documentation</li>
                    <li>• Create a detailed budget breakdown</li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Legal Requirements
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Business registration in Ghana</li>
                    <li>• Tax identification number (TIN)</li>
                    <li>• SEC Ghana compliance documentation</li>
                    <li>• Banking relationships establishment</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-secondary">
                Campaign Creation
              </h2>
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">
                    Writing Your Campaign Story
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Hook:</strong> Start with a compelling problem
                      statement or vision
                    </div>
                    <div>
                      <strong>Solution:</strong> Explain how your project
                      addresses the problem
                    </div>
                    <div>
                      <strong>Impact:</strong> Describe the positive change
                      you'll create
                    </div>
                    <div>
                      <strong>Call to Action:</strong> Clear next steps for
                      potential supporters
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">
                    Visual Content Guidelines
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Images:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• High-resolution (minimum 1920x1080)</li>
                        <li>• Professional lighting and composition</li>
                        <li>• Showcase product or team authentically</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Videos:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• 2-3 minutes optimal length</li>
                        <li>• Clear audio quality</li>
                        <li>• Include captions for accessibility</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-secondary">
                Marketing Your Campaign
              </h2>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Pre-Launch Strategy
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Build an email list of interested supporters</li>
                    <li>• Create social media buzz and teasers</li>
                    <li>• Reach out to local media and bloggers</li>
                    <li>• Engage with relevant communities</li>
                    <li>• Plan your launch day activities</li>
                  </ul>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    During Campaign
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Regular updates to supporters</li>
                    <li>• Respond promptly to questions</li>
                    <li>• Share milestones and achievements</li>
                    <li>• Leverage supporter networks</li>
                    <li>• Host live Q&A sessions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-secondary">
                Funding Models
              </h2>
              <div className="space-y-4">
                <div className="bg-card p-6 rounded-lg border border-accent/20">
                  <h3 className="font-semibold mb-3 text-accent">
                    🎁 Donation/Grant-Based
                  </h3>
                  <p className="text-sm mb-3">
                    Best for: Social causes, community projects, charitable
                    initiatives
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• No financial returns to supporters</li>
                    <li>• Focus on social impact and community benefit</li>
                    <li>• Detailed impact reporting required</li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg border border-trust/20">
                  <h3 className="font-semibold mb-3 text-trust">
                    🎁 Reward-Based
                  </h3>
                  <p className="text-sm mb-3">
                    Best for: Product launches, creative projects, pre-orders
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>
                      • Offer products, services, or experiences as rewards
                    </li>
                    <li>• Set clear delivery timelines and expectations</li>
                    <li>
                      • Include various reward tiers for different contribution
                      levels
                    </li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-lg border border-growth/20">
                  <h3 className="font-semibold mb-3 text-growth">
                    📈 Equity Investment
                  </h3>
                  <p className="text-sm mb-3">
                    Best for: Scalable businesses, startups seeking growth
                    capital
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Offer ownership stakes in exchange for investment</li>
                    <li>• Requires comprehensive financial documentation</li>
                    <li>• Subject to additional SEC Ghana regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-secondary">
                Equity Fundraising Deep Dive
              </h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-growth/10 to-trust/10 p-6 rounded-lg border border-growth/20">
                  <h3 className="text-xl font-semibold mb-4 text-growth">
                    Understanding Equity Fundraising
                  </h3>
                  <p className="text-sm mb-4">
                    Equity fundraising allows you to raise capital by selling
                    ownership shares in your company to investors. This funding
                    model is ideal for scalable businesses with high growth
                    potential.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 text-trust">
                        Key Benefits
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• No debt obligations or interest payments</li>
                        <li>• Access to larger funding amounts</li>
                        <li>• Investor expertise and networks</li>
                        <li>• Validation from professional investors</li>
                        <li>• Potential for follow-on funding rounds</li>
                      </ul>
                    </div>
                    <div className="bg-card p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 text-accent">
                        Key Considerations
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Dilution of ownership and control</li>
                        <li>• Investor expectations for returns</li>
                        <li>• Ongoing reporting requirements</li>
                        <li>• Exit pressure and timelines</li>
                        <li>• Complex legal documentation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 text-secondary">
                    Legal Requirements & Compliance
                  </h3>
                  <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-trust">
                        SEC Ghana Registration
                      </h4>
                      <ul className="text-sm space-y-2">
                        <li>
                          • <strong>Prospectus Filing:</strong> Detailed company
                          and offering information
                        </li>
                        <li>
                          • <strong>Financial Statements:</strong> Audited
                          financial records (3 years)
                        </li>
                        <li>
                          • <strong>Due Diligence Report:</strong> Independent
                          verification of claims
                        </li>
                        <li>
                          • <strong>Legal Opinions:</strong> Corporate structure
                          and compliance verification
                        </li>
                        <li>
                          • <strong>Registration Fees:</strong> 0.5% of total
                          offering amount
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-growth">
                        Ongoing Compliance
                      </h4>
                      <ul className="text-sm space-y-2">
                        <li>
                          • <strong>Quarterly Reports:</strong> Financial
                          performance updates
                        </li>
                        <li>
                          • <strong>Annual Audits:</strong> Independent
                          financial verification
                        </li>
                        <li>
                          • <strong>Material Change Disclosures:</strong>{' '}
                          Significant business updates
                        </li>
                        <li>
                          • <strong>Shareholder Meetings:</strong> Regular
                          investor communications
                        </li>
                        <li>
                          • <strong>Continuous Disclosure:</strong> Transparent
                          information sharing
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 text-secondary">
                    Valuation & Pricing Strategy
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Valuation Methods</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Revenue Multiple:</strong>
                          <p>
                            3-10x annual recurring revenue based on growth rate
                            and market
                          </p>
                        </div>
                        <div>
                          <strong>Comparable Analysis:</strong>
                          <p>
                            Similar companies' valuations in your industry and
                            stage
                          </p>
                        </div>
                        <div>
                          <strong>Discounted Cash Flow:</strong>
                          <p>Present value of projected future cash flows</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-trust">
                          Pre-Money Valuation
                        </h4>
                        <p className="text-sm">
                          Your company's value before receiving new investment.
                          This determines how much equity you'll give up for the
                          funding amount.
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-growth">
                          Post-Money Valuation
                        </h4>
                        <p className="text-sm">
                          Pre-money valuation plus investment amount. This is
                          your company's total value after the funding round.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 text-secondary">
                    Investment Terms & Structure
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-trust">
                          Share Classes
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <strong>Ordinary Shares:</strong> Basic ownership
                            with voting rights
                          </div>
                          <div>
                            <strong>Preference Shares:</strong> Priority in
                            liquidation, often with dividend rights
                          </div>
                          <div>
                            <strong>Employee Options:</strong> Stock options for
                            key team members
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-growth">
                          Investor Rights
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <strong>Liquidation Preference:</strong> 1x-2x
                            preference in exit scenarios
                          </div>
                          <div>
                            <strong>Anti-Dilution:</strong> Protection against
                            down rounds
                          </div>
                          <div>
                            <strong>Board Representation:</strong> Seats on
                            company board
                          </div>
                          <div>
                            <strong>Information Rights:</strong> Regular
                            financial reporting
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 text-secondary">
                    Due Diligence Preparation
                  </h3>
                  <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-trust">
                        Financial Documentation
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• 3-year audited financial statements</li>
                        <li>• Monthly management accounts</li>
                        <li>• Cash flow projections (5 years)</li>
                        <li>• Revenue pipeline and forecasts</li>
                        <li>• Budget vs. actual analysis</li>
                        <li>• Key performance indicators</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-growth">
                        Legal & Corporate
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Certificate of incorporation</li>
                        <li>• Shareholder agreements</li>
                        <li>• Board resolutions and minutes</li>
                        <li>• Material contracts and agreements</li>
                        <li>• Intellectual property portfolio</li>
                        <li>• Employment agreements</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-accent">
                        Business Operations
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Business plan and strategy</li>
                        <li>• Market analysis and competition</li>
                        <li>• Customer contracts and retention</li>
                        <li>• Product development roadmap</li>
                        <li>• Team structure and capabilities</li>
                        <li>• Risk analysis and mitigation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 text-secondary">
                    Investor Relations & Communication
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">
                        Regular Reporting Schedule
                      </h4>
                      <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div>
                          <strong>Monthly Updates:</strong>
                          <ul className="mt-2 space-y-1">
                            <li>• Key metrics and KPIs</li>
                            <li>• Financial performance summary</li>
                            <li>• Operational highlights</li>
                            <li>• Challenges and solutions</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Quarterly Reports:</strong>
                          <ul className="mt-2 space-y-1">
                            <li>• Detailed financial statements</li>
                            <li>• Strategic initiatives progress</li>
                            <li>• Market and competitive analysis</li>
                            <li>• Forward-looking guidance</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-trust">
                          Best Practices
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Proactive communication</li>
                          <li>• Transparent problem sharing</li>
                          <li>• Regular investor meetings</li>
                          <li>• Leverage investor expertise</li>
                        </ul>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-growth">
                          Warning Signs
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Delayed or missing reports</li>
                          <li>• Hiding negative developments</li>
                          <li>• Lack of strategic vision</li>
                          <li>• Poor financial controls</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 text-secondary">
                Post-Campaign Management
              </h2>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="font-semibold mb-4">
                  Fulfillment & Communication
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <strong>Immediate Actions:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Thank all supporters personally</li>
                      <li>• Begin reward production/fulfillment</li>
                      <li>• Set up regular update schedule</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Ongoing Obligations:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• Monthly progress reports</li>
                      <li>• Financial transparency</li>
                      <li>• Timely reward delivery</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <strong>Creator Support Team</strong>
                  <p>Email: creators@bantuhive.com</p>
                  <p>Phone: +233 (0) 302 123 4567</p>
                </div>
                <div>
                  <strong>Office Hours Support</strong>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM GMT</p>
                  <p>Saturday: 10:00 AM - 2:00 PM GMT</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorHandbook;

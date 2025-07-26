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
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
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
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
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
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
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
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                Funding Models
              </h2>
              <div className="space-y-4">
                <div className="bg-card p-6 rounded-lg border border-accent/20">
                  <h3 className="font-semibold mb-3 text-growth">
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
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
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
            </div>

            <div className="bg-muted p-6 rounded-lg">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorHandbook;

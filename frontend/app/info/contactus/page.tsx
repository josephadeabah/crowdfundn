const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary text-center">
            Contact Us
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get in touch with BantuHive. We're here to help with your
            crowdfunding, investment, or platform questions.
          </p>

          <div className="space-y-12">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-green-600">
                  Send Us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+233 XXX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select inquiry type</option>
                      <option value="campaign">
                        Campaign Creation Support
                      </option>
                      <option value="investment">Investment Guidance</option>
                      <option value="technical">Technical Support</option>
                      <option value="compliance">Compliance Questions</option>
                      <option value="partnership">
                        Partnership Opportunities
                      </option>
                      <option value="media">Media & Press</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6 text-green-600">
                  Get in Touch
                </h2>
                <div className="space-y-8">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold mb-3 text-trust">
                      Main Office
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">BantuHive Ltd</p>
                      <p>27 Independence Avenue, Synergy Office Space</p>
                      <p>Takoradi Mall, Western Region</p>
                      <p>Takoradi | Ghana</p>
                    </div>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold mb-3 text-growth">
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Phone:</strong> +233 (0) 551 563 081
                      </p>
                      <p>
                        <strong>WhatsApp:</strong> +233 (0) 551 563 081
                      </p>
                      <p>
                        <strong>Email:</strong> help@bantuhive.com
                      </p>
                      <p>
                        <strong>Support:</strong> help@bantuhive.com
                      </p>
                    </div>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold mb-3 text-green-600">
                      Business Hours
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM GMT
                      </p>
                      <p>
                        <strong>Saturday:</strong> 9:00 AM - 3:00 PM GMT
                      </p>
                      <p>
                        <strong>Sunday:</strong> Closed
                      </p>
                      <p className="text-muted-foreground mt-2">
                        *Emergency support available 24/7 for active campaigns
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-8 text-green-600 text-center">
                Specialized Contact
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-lg border text-center">
                  <h3 className="font-semibold mb-3 text-trust">
                    Campaign Support
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>creators@bantuhive.com</p>
                    <p>+233 (0) 302 123 4568</p>
                    <p className="text-muted-foreground">
                      Campaign creation and management assistance
                    </p>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border text-center">
                  <h3 className="font-semibold mb-3 text-growth">
                    Investment Support
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>investors@bantuhive.com</p>
                    <p>+233 (0) 302 123 4569</p>
                    <p className="text-muted-foreground">
                      Investment guidance and portfolio support
                    </p>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border text-center">
                  <h3 className="font-semibold mb-3 text-green-600">
                    Compliance
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>compliance@bantuhive.com</p>
                    <p>+233 (0) 302 123 4570</p>
                    <p className="text-muted-foreground">
                      Regulatory and legal compliance matters
                    </p>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-lg border text-center">
                  <h3 className="font-semibold mb-3 text-growth">
                    Partnerships
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>partnerships@bantuhive.com</p>
                    <p>+233 (0) 302 123 4571</p>
                    <p className="text-muted-foreground">
                      Business partnerships and collaborations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-8 text-green-600 text-center">
                Frequently Asked Questions
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold mb-2 text-trust">
                      How quickly will I get a response?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We aim to respond to all inquiries within 24 hours during
                      business hours. Urgent matters are typically addressed
                      within 4 hours.
                    </p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold mb-2 text-growth">
                      Do you offer phone consultations?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, we offer scheduled phone consultations for campaign
                      planning, investment guidance, and technical support. Book
                      through our support team.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold mb-2 text-green-600">
                      Can I visit your office?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Absolutely! We welcome office visits by appointment.
                      Please call ahead to schedule a meeting with our team
                      members.
                    </p>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-semibold mb-2 text-growth">
                      Do you provide training?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We offer webinars, workshops, and one-on-one training
                      sessions for both campaign creators and investors. Check
                      our events calendar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Emergency Contact
              </h2>
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-muted-foreground mb-6">
                  For urgent matters outside business hours (active campaign
                  issues, security concerns, payment problems), please use our
                  emergency contact channels.
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2">
                      24/7 Emergency Hotline
                    </h3>
                    <p className="text-lg font-bold text-destructive">
                      +233 (0) 551 563 081
                    </p>
                    <p className="text-muted-foreground">
                      For urgent platform issues
                    </p>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <h3 className="font-semibold mb-2">Security Issues</h3>
                    <p className="font-medium">help@bantuhive.com</p>
                    <p className="text-muted-foreground">
                      For account security concerns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

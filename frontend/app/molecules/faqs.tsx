import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export const faqs = [
  {
    question: 'What is Bantu Hive?',
    answer:
      'Bantu Hive is Africa’s leading crowdfunding platform that connects people with causes they care about. Whether you’re raising funds for a personal project, a community initiative, or a charitable cause, Bantu Hive makes it easy to share your story and receive support.',
  },
  {
    question: 'Who can use Bantu Hive?',
    answer:
      "Anyone! Whether you're an individual, an organization, or a donor looking to make a difference, Bantu Hive is open to all.'",
  },
  {
    question: 'Is Bantu Hive secure?',
    answer:
      'Absolutely! We use industry-standard encryption to ensure all your information and transactions are safe and secure.',
  },
  {
    question: 'How do I start a campaign?',
    answer:
      'Starting a campaign is easy! Simply sign up, create your campaign from your dashboard, and fill in the necessary details like your goal, category, and description. Check out our <a href="/articles/how-to-get-started" target="_blank" class="text-orange-600">guide on starting a campaign</a> for step-by-step instructions.',
  },
  {
    question: 'How do I promote my campaign?',
    answer:
      'You can promote your campaign by sharing it on social media, via email, or by using the ("Promote", Coming Soon!!!) feature on Bantu Hive to boost visibility on our platform.',
  },
  {
    question: 'How do I withdraw funds from my campaign?',
    answer:
      'You can withdraw funds by linking your bank account or mobile money account in the payment settings, selecting your campaign under "Transfers," and requesting a withdrawal as long as you have raised at least GHS60. Withdrawals can take up to 3 working days to be processed, depending on the bank or instant via mobile money. For detailed steps, <a href="/terms" target="_blank" class="text-orange-600">visit our fund withdrawal guide.</a>',
  },
  {
    question: 'Are there any fees for using Bantu Hive?',
    answer:
      'Bantu Hive charges a small service fee on donations to cover platform maintenance and operational costs. Details about the fees are available on our <a href="/pricing" target="_blank" class="text-orange-600">pricing</a> page. Withdrawal fees may be charged by the 3rd party provider/ Bank and Bantu Hive has no control over these.',
  },
  {
    question: 'Can my donor request a reversal of funds?',
    answer:
      'A donor can request a refund on Bantu Hive if and only if the funds are still active on the campaign and not withdrawn.',
  },
  {
    question: 'How do backers support my campaign?',
    answer:
      'Backers can support your campaign by donating directly through Bantu Hive’s secure payment gateway. You can also promote your campaign with our promotion tools. Your supporters can also share your campaign with others to increase visibility and attract more donations.',
  },
  {
    question: 'How do I find a cause to support?',
    answer:
      'You can explore campaigns through the <a href="/explore/category" target="_blank" class="text-orange-600">"Donate"</a> page, featured lists, or by filtering campaigns by country and cause. Learn more in our guide on finding a cause.',
  },
  {
    question: 'How do I donate?',
    answer:
      'Navigate to the campaign page, choose a one-time or subscription-based donation, and follow the steps to complete your payment. Visit our donation guide for detailed instructions.',
  },
  {
    question: 'Can I donate anonymously?',
    answer:
      'Yes! When donating, you have the option to remain anonymous. Your contribution will still make a difference without revealing your identity.',
  },
  {
    question: 'What is the maximum I can donate?',
    answer:
      'As a donor, you can donate up to USD10,000 equivalent on the site. You can contact our support team at help@bantuhive.com to receive dispensation for higher donation amounts.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept a variety of payment methods, including credit/debit cards, mobile money, and other secure options available through our payment gateway.',
  },
  {
    question: 'I forgot my password. How can I reset it?',
    answer:
      'Click on the "Forgot Password" link on the login page. Enter your registered email, and we’ll send you instructions to reset your password.',
  },
  {
    question:
      'I’m having trouble uploading a photo for my campaign. What should I do?',
    answer:
      'Ensure your photo meets the size and format requirements (e.g., JPG or PNG under 5MB). If issues persist, contact our support team at help@bantuhive.com.',
  },
  {
    question: 'What should I do if I encounter a bug on the site?',
    answer:
      'Please contact us at help@bantuhive.com with details about the issue. We’ll get it resolved as quickly as possible!',
  },
  {
    question: 'How do I create an account on Bantu Hive?',
    answer:
      'Click "Start A Project" on the homepage and follow the steps to create your account. Check out our signup guide for a detailed walkthrough.',
  },
  {
    question: 'Can I delete my account?',
    answer:
      'If you wish to delete your account, please contact our support team at help@bantuhive.com, and we’ll assist you.',
  },
  {
    question: 'Can I update my profile details?',
    answer:
      'Yes, you can update your profile details anytime by going to the "Settings" div of your dashboard.',
  },
  {
    question: 'Still have questions?',
    answer:
      'If you didn’t find the answer you were looking for, don’t worry! Reach out to us at help@bantuhive.com, and our team will be happy to assist you.',
  },
];

const faq = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is BantuHive?',
        a: "BantuHive is Ghana's premier crowdfunding and micro-investment platform that offers three funding models: donation/grant-based, reward-based, and equity investment. We connect entrepreneurs with investors and supporters across Ghana and its diaspora.",
      },
      {
        q: 'Who can use BantuHive?',
        a: 'BantuHive is open to Ghanaian citizens, residents, and diaspora members aged 18 and above. Companies must be registered in Ghana to raise funds, while investors can participate from anywhere in the world.',
      },
      {
        q: 'How do I get started as an investor?',
        a: 'Simply create an account, complete our KYC verification process, and start browsing investment opportunities. You can begin investing with as little as GHS 50.',
      },
      {
        q: 'How do I raise funds for my business?',
        a: 'Create a detailed campaign including your business plan, financial projections, and funding requirements. Our team will review your application and help you launch your campaign once approved.',
      },
    ],
  },
  {
    category: 'Investment & Returns',
    questions: [
      {
        q: 'What are the minimum and maximum investment amounts?',
        a: 'Minimum investment is GHS 50 per project. For individual investors, the maximum annual investment is GHS 50,000. Accredited investors have higher limits based on their qualification.',
      },
      {
        q: 'What returns can I expect?',
        a: 'Returns vary by investment type. Donation-based funding provides social impact returns. Reward-based offers products or perks. Equity investments may provide dividends and capital appreciation, though all investments carry risk of loss.',
      },
      {
        q: 'How long before I see returns?',
        a: 'Investment timelines vary. Reward-based campaigns typically deliver within 6-12 months. Equity investments are long-term (3-7 years typically) with potential for earlier liquidity events.',
      },
      {
        q: 'Can I sell my equity investments?',
        a: "Equity investments are generally illiquid. However, we're developing a secondary market and may facilitate certain exit opportunities as companies grow.",
      },
    ],
  },
  {
    category: 'Security & Regulation',
    questions: [
      {
        q: 'Is BantuHive regulated?',
        a: 'Yes, BantuHive is licensed by the Securities and Exchange Commission of Ghana (SEC Ghana) and operates under strict regulatory oversight to protect investors.',
      },
      {
        q: 'How are my funds protected?',
        a: "Client funds are held in segregated accounts with SEC Ghana-approved banks, separate from BantuHive's operational funds. We also maintain comprehensive insurance coverage.",
      },
      {
        q: 'What due diligence do you perform?',
        a: 'We conduct thorough verification of all companies including business registration, financial statements, management background checks, and market validation before listing.',
      },
      {
        q: 'How do you verify investor eligibility?',
        a: 'We require comprehensive KYC documentation including government ID, proof of address, income verification, and investment experience assessment before allowing participation.',
      },
    ],
  },
  {
    category: 'Fees & Charges',
    questions: [
      {
        q: 'What fees do investors pay?',
        a: 'Investors pay a 2% platform fee on investments plus 1.5% payment processing fee. There are no account maintenance fees. Diaspora investors pay a 0.5% currency conversion fee.',
      },
      {
        q: 'What do entrepreneurs pay?',
        a: 'Entrepreneurs pay a 1% listing fee and 5% success fee on funds raised. Additional costs include due diligence (GHS 2,000-10,000) and legal documentation (GHS 5,000-15,000).',
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No. All fees are clearly disclosed upfront. We provide a detailed fee schedule in our investment documentation and during the onboarding process.',
      },
      {
        q: 'Do you charge ongoing fees?',
        a: 'Investors have no ongoing fees. Entrepreneurs pay GHS 500 quarterly for ongoing reporting and support services during the investment period.',
      },
    ],
  },
  {
    category: 'Tax & Legal',
    questions: [
      {
        q: 'What are the tax implications of investing?',
        a: 'Tax treatment depends on investment type and your jurisdiction. Ghana residents may benefit from capital gains tax reductions for venture investments held 3+ years. Consult a tax advisor for personalized guidance.',
      },
      {
        q: 'Do I get tax benefits for impact investing?',
        a: 'Yes, qualifying impact investments may receive favorable tax treatment including reduced capital gains rates and enhanced loss relief provisions.',
      },
      {
        q: 'What legal protections do I have?',
        a: 'All investments are governed by standardized legal documentation under Ghanaian law. You receive shareholder rights, information access, and dispute resolution mechanisms.',
      },
      {
        q: 'Can diaspora investors face legal issues?',
        a: 'BantuHive complies with international regulations. However, diaspora investors should consult local legal and tax advisors regarding compliance in their residence jurisdiction.',
      },
    ],
  },
  {
    category: 'Platform Features',
    questions: [
      {
        q: 'How do I track my investments?',
        a: "Your investor dashboard provides real-time updates on all investments including financial performance, company milestones, and impact metrics. You'll receive regular reports from portfolio companies.",
      },
      {
        q: 'Can I invest from mobile devices?',
        a: 'Yes, our platform is fully mobile-optimized. We also offer mobile apps for iOS and Android with full investment and tracking functionality.',
      },
      {
        q: 'Do you offer investment advice?',
        a: 'We provide educational resources and company information but do not offer personalized investment advice. All investment decisions are your responsibility based on disclosed information.',
      },
      {
        q: 'How do I contact customer support?',
        a: 'Contact our support team via email (support@bantuhive.com), phone (+233 302 123 4567), or live chat on our platform. Support hours are 8AM-6PM GMT Monday-Friday.',
      },
    ],
  },
];

const FAQsPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="p-3 md:p-0 text-gray-700 dark:bg-gray-800 dark:text-gray-50">
      {/* FAQs div */}
      <div id="faqs" className="py-20 max-w-7xl mx-auto mb-10">
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-primary text-center">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-center text-muted-foreground mb-12">
                Find answers to common questions about investing and raising
                funds on BantuHive
              </p>

              <div className="space-y-12">
                {faq.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h2 className="text-2xl font-semibold mb-6 text-green-600">
                      {category.category}
                    </h2>
                    <div className="space-y-6">
                      {category.questions.map((faqobj, faqIndex) => (
                        <div
                          key={faqIndex}
                          className="bg-card p-6 rounded-lg border"
                        >
                          <h3 className="text-lg font-semibold mb-3 text-primary">
                            {faqobj.q}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {faqobj.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="text-center text-lg py-8">
            Bantu Hive connects communities and people with the funding they
            need, to create lasting impact.
          </div>
          <div className="mx-auto px-12">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 border-b border-gray-50 pb-4">
                <button
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={expandedFAQ === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-lg font-semibold dark:text-gray-100">
                    {faq.question}
                  </span>
                  {expandedFAQ === index ? (
                    <FiChevronUp className="h-6 w-6" />
                  ) : (
                    <FiChevronDown className="h-6 w-6" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div
                    id={`faq-answer-${index}`}
                    className="prose mt-2 dark:text-gray-100 animate-fadeIn"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 bg-primary/5 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our team is here to help. Contact us for personalized assistance
              with your investment or fundraising needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@bantuhive.com"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Email Support
              </a>
              <a
                href="tel:+233302123456"
                className="bg-secondary text-green-600-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer.replace(/<[^>]+>/g, ''), // Remove HTML tags for JSON-LD
              },
            })),
          }),
        }}
      />
    </div>
  );
};

export default FAQsPage;

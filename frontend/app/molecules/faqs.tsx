import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQsPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
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
        'You can promote your campaign by sharing it on social media, via email, or by using the "Promote" feature on Bantu Hive to boost visibility on our platform. Coming Soon!!!.',
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
        'Yes, you can update your profile details anytime by going to the "Settings" section of your dashboard.',
    },
    {
      question: 'Still have questions?',
      answer:
        'If you didn’t find the answer you were looking for, don’t worry! Reach out to us at help@bantuhive.com, and our team will be happy to assist you.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <section className="p-3 md:p-0 text-gray-700 dark:bg-gray-800 dark:text-gray-50">
      {/* FAQs Section */}
      <div id="faqs" className="py-20 max-w-7xl mx-auto mb-10">
        <div className="">
          <h2 className="text-3xl font-bold text-center mb-12">
            Bantu Hive FAQs
          </h2>
          <div className="text-center text-lg py-8">
            Bantu Hive connects communities and people with the funding they
            need, to create lasting impact.
          </div>
          <div className="mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 border-b border-gray-50 pb-4">
                <button
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={expandedFAQ === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-lg font-semibold px-4 dark:text-gray-100">
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
                    className="prose mt-2 dark:text-gray-100 px-4 animate-fadeIn"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQsPage;

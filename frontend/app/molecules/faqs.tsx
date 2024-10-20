import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQsPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is BantuHive?',
      answer:
        'BantuHive is a crowdfunding platform designed to help individuals and organizations raise funds for causes, projects, and events. It connects fundraisers with backers who are passionate about making a difference.',
    },
    {
      question: 'How do I start a fundraising campaign?',
      answer:
        'To start a campaign on BantuHive, simply create an account, navigate to the "Start a Campaign" section, and fill out the necessary details about your cause, funding goal, and rewards for backers.',
    },
    {
      question: 'What fees does BantuHive charge?',
      answer:
        'BantuHive charges a platform fee of 2% on the total funds raised, plus payment processing fees of 1.9% for each transaction. These fees help us maintain the platform and ensure secure transactions.',
    },
    {
      question: 'How do I withdraw the funds I raise?',
      answer:
        'You can withdraw your funds by linking your bank account or digital wallet to your BantuHive account. Once your campaign ends, funds will be transferred to you after processing, which can take up to 4 business days.',
    },
    {
      question: 'What types of projects can I fundraise for?',
      answer:
        'BantuHive supports a wide range of causes, from personal needs and charity events to business projects, community initiatives, and more. We encourage campaigns that align with positive impact and community-building.',
    },
    {
      question: 'How do backers support my campaign?',
      answer:
        'Backers can support your campaign by donating directly through BantuHive’s secure payment gateway. You can also promote your campaign with our promotion tools. Your supporters can also share your campaign with others to increase visibility and attract more donations.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="p-3 md:p-0 bg-green-900 text-gray-50 dark:bg-gray-800 dark:text-gray-50">
      {/* FAQs Section */}
      <div id="faqs" className="py-20 max-w-7xl mx-auto mb-10">
        <div className="">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-50">
            BantuHive FAQs
          </h2>
          <div className="text-center text-lg py-8">
            BantuHive connects communities and entrepreneurs with the funding
            they need, leveraging the power of Africa’s people and its diaspora
            to create lasting impact.
          </div>
          <div className="mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4">
                <button
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={expandedFAQ === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-lg font-semibold text-gray-50 dark:text-gray-100">
                    {faq.question}
                  </span>
                  {expandedFAQ === index ? (
                    <FiChevronUp className="h-6 w-6 text-gray-50" />
                  ) : (
                    <FiChevronDown className="h-6 w-6 text-gray-50" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div
                    id={`faq-answer-${index}`}
                    className="mt-2 text-gray-50 dark:text-gray-100 animate-fadeIn"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;

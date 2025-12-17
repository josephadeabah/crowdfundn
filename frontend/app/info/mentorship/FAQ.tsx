// components/mentorship/FAQ.tsx
'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'founders' | 'mentors' | 'general';
}

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState<string>('all');

  const faqs: FAQItem[] = [
    {
      question: 'Who is eligible to request a mentor?',
      answer:
        'Any founder with an active, published fundraising campaign on our platform can request a mentor. Ensure your campaign details are complete and your business model is clearly explained to attract the right mentors.',
      category: 'founders',
    },
    {
      question: 'How do mentors select which ventures to support?',
      answer:
        "Mentors review your campaign details, pitch deck, and specific mentorship request. They typically look for alignment with their expertise, the venture's potential, and the founder's coachability. A clear, well-prepared request increases your chances of acceptance.",
      category: 'founders',
    },
    {
      question: "What does 'capacity limits' mean for mentors?",
      answer:
        'To ensure quality engagement, each mentor can only support up to 5 ventures simultaneously. This ensures they have sufficient time and attention for each founder. Mentors become available again as they complete engagements with current founders.',
      category: 'general',
    },
    {
      question: 'How do I become a mentor?',
      answer:
        "Verified users can apply to become mentors by navigating to Account → Settings → KYC. Complete the verification process, provide details about your expertise and experience, and submit for review. Once approved, you'll appear in the mentor directory.",
      category: 'mentors',
    },
    {
      question: 'What kind of commitment is expected from mentors?',
      answer:
        "Mentors typically commit to regular check-ins (weekly or bi-weekly) for 1-2 months per venture. The exact commitment varies based on the founder's needs and the mentor's availability. You set your own availability preferences in your mentor profile.",
      category: 'mentors',
    },
    {
      question: 'Is there a cost for mentorship?',
      answer:
        'No, our mentorship program is free for founders with active campaigns. Mentors volunteer their time to give back to the entrepreneurial community. Some mentors may offer premium paid consulting outside the platform, but core mentorship is free.',
      category: 'general',
    },
    {
      question: "What if I'm not satisfied with my mentor match?",
      answer:
        "You can request a new mentor after 2 weeks if the match isn't working. We encourage open communication first, but understand that not every pairing is perfect. You can also end the mentorship at any time through your dashboard.",
      category: 'founders',
    },
    {
      question: 'Can I mentor in multiple categories?',
      answer:
        "Yes, during the application process you can select multiple areas of expertise. Many mentors have experience across fundraising, product development, marketing, and scaling operations. You'll be matched based on the intersection of your expertise and founder needs.",
      category: 'mentors',
    },
  ];

  const filteredFAQs =
    filter === 'all' ? faqs : faqs.filter((faq) => faq.category === filter);

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our mentorship program
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Questions
            </button>
            <button
              onClick={() => setFilter('founders')}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${filter === 'founders' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              For Founders
            </button>
            <button
              onClick={() => setFilter('mentors')}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${filter === 'mentors' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              For Mentors
            </button>
            <button
              onClick={() => setFilter('general')}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${filter === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              General
            </button>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  className="w-full text-left p-6 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${faq.category === 'founders' ? 'bg-blue-100 text-blue-600' : faq.category === 'mentors' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}
                    >
                      {faq.category === 'founders'
                        ? '🚀'
                        : faq.category === 'mentors'
                          ? '👨‍🏫'
                          : '❓'}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-500 transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {activeIndex === index && (
                  <div className="p-6 bg-white border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>

                    {faq.category === 'founders' &&
                      faq.question.includes('eligible') && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-800 mb-2">
                            Pro Tip:
                          </div>
                          <p className="text-blue-700 text-sm">
                            Complete your founder profile with details about
                            your background, team, and traction to increase
                            mentor interest by 60%.
                          </p>
                        </div>
                      )}

                    {faq.category === 'mentors' &&
                      faq.question.includes('become a mentor') && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                          <div className="font-medium text-green-800 mb-2">
                            Application Tip:
                          </div>
                          <p className="text-green-700 text-sm">
                            Mentors with specific case studies of past successes
                            get approved 3x faster. Include metrics and outcomes
                            when possible.
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Help */}
          <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Still have questions?
                </h3>
                <p className="text-gray-700">
                  Our support team is here to help you with any questions about
                  the mentorship program.
                </p>
              </div>
              <a
                href="/info/contactus"
                className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

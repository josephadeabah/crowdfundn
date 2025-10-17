// components/campaign/CampaignFAQs.tsx
import React from 'react';
import { SingleCampaignResponseDataType } from '../types/campaigns.types';

interface CampaignFAQsProps {
  campaign: SingleCampaignResponseDataType | null;
  isEquityCampaign: boolean;
}

const CampaignFAQs: React.FC<CampaignFAQsProps> = ({
  campaign,
  isEquityCampaign,
}) => {
  if (!isEquityCampaign) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Investment Information
        </h3>
        <p className="text-gray-600">
          Investment FAQs apply only to licensed equity crowdfunding campaigns
          in Ghana.
        </p>
      </div>
    );
  }

  const ghanaFAQs = [
    {
      question: 'Who can invest in this equity campaign?',
      answer:
        'Any individual or institutional investor above 18 years of age can invest, subject to identity verification (KYC) and anti-money laundering checks. Both Ghanaian and approved foreign investors may participate in line with SEC Ghana crowdfunding rules.',
    },
    {
      question: 'What is the minimum investment amount?',
      answer:
        'Each campaign sets its own minimum investment, but it must not be lower than the platform’s approved minimum threshold. This ensures fairness and compliance with SEC Ghana’s crowdfunding guidelines.',
    },
    {
      question: 'How does the 48-hour cooling-off period work?',
      answer:
        'After committing your investment, you have up to 48 hours to cancel and receive a full refund — no questions asked. Once this period expires, your commitment becomes final unless the campaign fails to reach its minimum target.',
    },
    {
      question: 'What happens after I invest?',
      answer:
        'Your funds are held securely in an escrow or trust account with a licensed financial institution until the campaign closes. If the campaign meets its minimum goal, the funds are released to the issuer and you will receive a digital investment certificate confirming your equity ownership.',
    },
    {
      question: 'Can I sell my shares later?',
      answer:
        'Currently, Ghana has no public secondary market for privately issued shares through crowdfunding. You may, however, transfer or sell your shares privately in compliance with Ghana’s Companies Act and SEC regulations.',
    },
    {
      question: 'What are the risks of investing?',
      answer:
        'All investments carry risk, including potential loss of capital. Early-stage businesses can fail or take longer to become profitable. Returns are not guaranteed, and investors should invest only what they can afford to lose.',
    },
    {
      question: 'How are my funds protected before the campaign closes?',
      answer:
        'Investor funds are kept in a segregated escrow or trust account managed by a licensed bank or trustee. The platform cannot access these funds until the campaign’s minimum target is met and verified by the intermediary.',
    },
    {
      question: 'What information will I receive as an investor?',
      answer:
        "Investors will receive updates on the company's progress, financial performance, and major milestones. Platforms are required under SEC rules to ensure issuers provide timely updates to investors at least quarterly.",
    },
    {
      question: 'Can foreign investors participate?',
      answer:
        'Yes, foreign investors are permitted, provided they comply with Ghana’s foreign exchange and investment regulations. All international investors must complete KYC verification and agree to SEC Ghana’s investor protection terms.',
    },
    {
      question:
        "What happens if the campaign doesn't reach its minimum funding goal?",
      answer:
        'If the campaign fails to meet its minimum funding target, all investor funds are refunded in full from the escrow account. No fees or deductions are applied to refunds under SEC Ghana’s crowdfunding guidelines.',
    },
    {
      question: 'Are my returns guaranteed?',
      answer:
        'No. Equity investments depend on the future performance of the company. Dividends or capital gains are not guaranteed and may depend on profitability or future exit events.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💡</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
          Investment FAQs
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Key information for investors participating in{' '}
          {campaign?.company_info?.name || 'this company'}’s equity crowdfunding
          campaign.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {ghanaFAQs.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-green-300 transition-colors"
          >
            <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-start">
              <span className="text-green-600 mr-3 flex-shrink-0">Q:</span>
              {faq.question}
            </h3>
            <p className="text-gray-700 leading-relaxed flex items-start">
              <span className="text-gray-500 mr-3 flex-shrink-0">A:</span>
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* SEC Ghana Compliance Notice */}
      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-start">
          <span className="text-green-600 text-lg mr-3 mt-0.5">✅</span>
          <div>
            <h4 className="font-semibold text-green-800 mb-2">
              SEC Ghana Crowdfunding Compliance Notice
            </h4>
            <p className="text-green-700 text-sm leading-relaxed">
              This campaign is operated in compliance with the Securities and
              Exchange Commission (SEC) of Ghana’s Crowdfunding Guidelines
              (2024). All investor funds are managed in accordance with SEC
              investor protection, anti-money laundering (AML), and escrow
              requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Important Legal Disclaimer */}
      <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex items-start">
          <span className="text-yellow-600 text-lg mr-3 mt-0.5">⚠️</span>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">
              Important Legal Notice
            </h4>
            <p className="text-yellow-700 text-sm leading-relaxed">
              Investments on this platform are made under Ghana’s Securities and
              Exchange Commission (SEC) Crowdfunding Guidelines (2024). Equity
              crowdfunding involves risk, including the potential loss of
              capital. This content is for educational purposes only and does
              not constitute investment advice. Please consult a licensed
              advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignFAQs;

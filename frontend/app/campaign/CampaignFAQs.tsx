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
  // Only show FAQs for equity campaigns
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
          Investment FAQs are available for equity investment campaigns only.
        </p>
      </div>
    );
  }

  const ghanaFAQs = [
    {
      question: 'Who can invest in this equity campaign?',
      answer:
        'Both accredited and non-accredited investors in Ghana can participate. There are no specific income or net worth requirements for equity crowdfunding in Ghana under current regulations.',
    },
    {
      question: 'What is the minimum investment amount?',
      answer:
        'The minimum investment for this campaign is GHS 0.50. This makes equity investment accessible to a wide range of investors across Ghana.',
    },
    {
      question: 'How does the 48-hour cancellation window work?',
      answer:
        'After making an investment, you have 48 hours to cancel it. This gives you time to reconsider your decision. After 48 hours, your investment becomes final and cannot be cancelled.',
    },
    {
      question: 'What happens after I invest?',
      answer:
        "Once the campaign closes successfully, you will receive a digital investment certificate and become a shareholder in the company. You'll own a percentage of the business based on your investment amount.",
    },
    {
      question: 'Can I sell my shares later?',
      answer:
        'Currently, there is no established secondary market for these shares in Ghana. However, the company may provide liquidity options in the future, or you may be able to sell your shares through private arrangements, subject to applicable securities regulations.',
    },
    {
      question: 'What are the risks of equity investment?',
      answer:
        "Like all investments, equity crowdfunding carries risks including potential loss of capital. Startups and growing businesses may fail, and there's no guarantee of returns. Only invest money you can afford to lose.",
    },
    {
      question: 'How are my funds protected?',
      answer:
        'Your investment funds are held securely through our payment partners. Bantuhive follows strict financial protocols to ensure the safety of investor funds throughout the campaign process.',
    },
    {
      question: 'What information will I receive as an investor?',
      answer:
        "You will receive regular updates about the company's progress, financial performance, and major developments. The frequency and detail of these updates depend on the company's communication policy.",
    },
    {
      question: 'Can international investors participate?',
      answer:
        'Currently, this offering is primarily focused on Ghana-based investors. International investors should consult with legal advisors regarding cross-border investment regulations in their jurisdiction.',
    },
    {
      question: "What happens if the campaign doesn't reach its funding goal?",
      answer:
        "If the campaign doesn't reach its minimum funding target, all investments will be refunded to investors in full. You will not be charged any fees if the campaign is unsuccessful.",
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
          Important information about investing in{' '}
          {campaign?.company_info?.name || 'this company'}. Please read
          carefully before making your investment decision.
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

      {/* Important Disclaimer */}
      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex items-start">
          <span className="text-yellow-600 text-lg mr-3 mt-0.5">⚠️</span>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">
              Important Notice
            </h4>
            <p className="text-yellow-700 text-sm leading-relaxed">
              Equity investment involves risk, including potential loss of
              capital. This information is for educational purposes only and
              does not constitute investment advice. You should consult with a
              qualified financial advisor before making any investment
              decisions. Past performance is not indicative of future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignFAQs;

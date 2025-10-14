import React from 'react';
import Link from 'next/link';

const FooterWarning: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 mb-6 pt-8">
        <div className="">
          <h4 className="font-bold text-sm mb-4 text-gray-900">
            Important Investment Notice
          </h4>

          <div className="space-y-4 text-xs leading-relaxed text-gray-600">
            <p className="font-medium text-gray-900">
              IN MAKING AN INVESTMENT DECISION, INVESTORS MUST RELY ON THEIR OWN
              EXAMINATION OF THE ISSUER AND THE TERMS OF THE OFFERING, INCLUDING
              THE MERITS AND RISKS INVOLVED. INVESTMENTS ON BANTUHIVE ARE
              SPECULATIVE, ILLIQUID, AND INVOLVE A HIGH DEGREE OF RISK,
              INCLUDING THE POSSIBLE LOSS OF YOUR ENTIRE INVESTMENT.
            </p>

            <p>
              www.BantuHive.com is a website owned and operated by BantuHive LLC
              ("BantuHive").
            </p>

            <p className="font-semibold text-gray-900">
              Securities offered on BantuHive are regulated by the Securities
              and Exchange Commission, Ghana (SEC Ghana)
            </p>

            <p>
              All investment opportunities on this platform comply with SEC
              Ghana regulations and have undergone proper regulatory review.
              BantuHive operates under the supervision and guidelines set forth
              by SEC Ghana to ensure compliance with securities laws and
              investor protection standards.
            </p>

            <p>
              BantuHive conducts thorough due diligence and verification of all
              information provided by issuers. We verify the adequacy, accuracy,
              and completeness of offering materials to maintain the highest
              standards of transparency and investor protection. However,
              investors should conduct their own independent research and
              consult with financial advisors before making any investment
              decisions.
            </p>

            <p>
              Investing in private securities involves significant risks and is
              not suitable for all investors. These investments are highly
              speculative, illiquid, and carry a high degree of risk, including
              the potential loss of your entire investment. You should only
              invest capital that you can afford to lose completely.
            </p>

            <p>
              Private company securities typically lack an established secondary
              market, BantuHive does not offer a secondary market for liquidity
              at the moment. Each investment opportunity carries unique risks
              specific to the company, industry, and market conditions.
              Prospective investors should carefully review all offering
              documents and seek professional advice.
            </p>

            <p>
              By accessing this site and any pages herein, you acknowledge and
              agree to be bound by our{' '}
              <Link
                href="/info/terms"
                className="text-green-800 hover:underline"
              >
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link
                href="/info/privacy"
                className="text-green-800 hover:underline"
              >
                Privacy Policy
              </Link>
              , which may be updated periodically without prior notice.
            </p>

            <p className="font-semibold text-gray-900">
              International Investors
            </p>

            <p>
              Investment opportunities are offered in compliance with Ghana
              securities regulations and African market standards. International
              investors are responsible for ensuring that their participation
              complies with the laws and regulations of their country of
              residence. We strongly recommend consulting with legal, tax, and
              financial advisors in your jurisdiction before investing.
            </p>

            <p>
              For additional information or customer support, please contact us
              at contact@bantuhive.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterWarning;

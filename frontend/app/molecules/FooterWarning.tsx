import React from 'react';
import Link from 'next/link';

const FooterWarning: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 mb-6 pt-8">
        <div>
          <h4 className="font-bold text-sm mb-4 text-gray-900">
            Important Investment Notice
          </h4>

          <div className="space-y-4 text-xs leading-relaxed text-gray-600">
            <p className="font-medium text-gray-900">
              INVESTMENTS IN STARTUPS AND SMES ARE SPECULATIVE, ILLIQUID, AND
              INVOLVE A HIGH DEGREE OF RISK, INCLUDING THE POSSIBLE LOSS OF YOUR
              ENTIRE INVESTMENT. PARTICIPANTS MUST RELY ON THEIR OWN EXAMINATION
              OF EACH ISSUER AND THE TERMS OF ANY OFFERING, INCLUDING THE MERITS
              AND RISKS INVOLVED.
            </p>

            <p>
              www.bantuhive.com is owned and operated by BantuHive Ltd.
              (“BantuHive”), a private technology platform facilitating capital
              introduction between issuers and invited participants.
            </p>

            {/* <p className="font-semibold text-gray-900">Platform Status</p> */}

            <div className="border border-amber-300 bg-amber-50 rounded-md p-4">
              <p className="text-xs font-semibold text-amber-900 leading-relaxed">
                PLATFORM STATUS NOTICE: BantuHive is currently operating in a
                controlled, invite-only private pilot phase. The platform's
                investment crowdfunding is not open to the general public.
                Strictly invite-only.
              </p>
            </div>

            <p>
              BantuHive does not provide investment advice, recommendations, or
              guarantees. All information relating to investment opportunities
              is provided by issuers, and participants are encouraged to conduct
              their own independent due diligence before committing capital.
            </p>

            <p>
              BantuHive does not hold client funds. Payment processing and fund
              transfers are facilitated through regulated third-party payment
              service providers.
            </p>

            <p>
              Investments in private securities are not suitable for all
              investors. These investments are highly speculative, subject to
              business, market, and liquidity risks, and may result in the loss
              of the entire invested amount. Participants should only commit
              capital they can afford to lose.
            </p>

            <p>
              Private company securities typically lack an established secondary
              market. BantuHive does not currently provide a secondary market or
              liquidity mechanism for investments.
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
              , which may be updated periodically.
            </p>

            <p className="font-semibold text-gray-900">
              International Participants
            </p>

            <p>
              Participation in private investment opportunities may be subject
              to the laws and regulations of your country of residence.
              International participants are responsible for ensuring their
              compliance with applicable legal, tax, and regulatory requirements
              and should seek independent professional advice where appropriate.
            </p>

            <p>
              For additional information or support, please contact us at{' '}
              <span className="font-medium">contact@bantuhive.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterWarning;

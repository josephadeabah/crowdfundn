import React from 'react';
import {
  AlertTriangle,
  Clock,
  Shield,
  PieChart,
  TrendingDown,
  Lock,
} from 'lucide-react';

const RiskWarning = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Risk Warning
            </h1>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Clock className="h-4 w-4 mr-1" />
              <span>Estimated reading time: 2 min</span>
            </div>
            <p className="text-gray-700">
              Due to the potential for losses, the Securities and Exchange
              Commission (SEC) Ghana considers this investment to be high risk.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          What are the key risks?
        </h2>

        {/* Risk 1 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-100 p-2 rounded-full">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              1. You could lose all the money you invest
            </h3>
          </div>
          <div className="ml-11 space-y-3 text-gray-700">
            <p>
              • Most investments are shares in start-up businesses or bonds
              issued by them. Investors in these shares or bonds often lose 100%
              of the money they invested, as most start-up businesses fail.
            </p>
            <p>
              • Checks on the businesses you are investing in, such as how well
              they are expected to perform, may not have been carried out by the
              platform you are investing through. You should do your own
              research before investing.
            </p>
          </div>
        </div>

        {/* Risk 2 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              2. You won't get your money back quickly
            </h3>
          </div>
          <div className="ml-11 space-y-3 text-gray-700">
            <p>
              • Even if the business you invest in is successful, it will likely
              take several years to get your money back.
            </p>
            <p>
              • The most likely way to get your money back is if the business is
              bought by another business or lists its shares on an exchange such
              as the Ghana Stock Exchange. These events are not common.
            </p>
            <p>
              • Start-up businesses very rarely pay you back through dividends.
              You should not expect to get your money back this way.
            </p>
            <p>
              • BantuHive may work with companies to give you an opportunity to
              sell your investment early through a secondary sale, but there is
              no guarantee you will find a buyer at the price you are willing to
              sell.
            </p>
          </div>
        </div>

        {/* Risk 3 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <PieChart className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              3. Don't put all your eggs in one basket
            </h3>
          </div>
          <div className="ml-11 space-y-3 text-gray-700">
            <p>
              • Putting all your money into a single business or type of
              investment is risky. Spreading your money across different
              investments makes you less dependent on any one to do well.
            </p>
            <p>
              • A good rule of thumb is not to invest more than 10% of your
              money in high-risk investments.
            </p>
          </div>
        </div>

        {/* Risk 4 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <TrendingDown className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              4. The value of your investment can be reduced
            </h3>
          </div>
          <div className="ml-11 space-y-3 text-gray-700">
            <p>
              • If your investment is shares, the percentage of the business
              that you own will decrease if the business issues more shares.
              This could mean that the value of your investment reduces,
              depending on how much the business grows. Most start-up businesses
              issue multiple rounds of shares.
            </p>
            <p>
              • These new shares could have additional rights that your shares
              don't have, such as the right to receive a fixed dividend, which
              could further reduce your chances of getting a return on your
              investment.
            </p>
          </div>
        </div>

        {/* Risk 5 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <Shield className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              5. You are unlikely to be protected if something goes wrong
            </h3>
          </div>
          <div className="ml-11 space-y-3 text-gray-700">
            <p>
              • Protection from the Securities and Exchange Commission (SEC)
              Ghana does not cover poor investment performance.
            </p>
            <p>
              • While SEC Ghana regulates investment platforms, it does not
              guarantee individual investments or protect against losses from
              business failure.
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 rounded-lg p-5 mt-8">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Protecting Yourself
            </h3>
          </div>
          <p className="text-gray-700 mb-4">
            If you are interested in learning more about how to protect
            yourself, visit the SEC Ghana's website. For further information
            about investment-based crowdfunding, consult with a qualified
            financial advisor familiar with Ghana's investment landscape.
          </p>
          <div className="bg-amber-100 border border-amber-200 rounded-md p-4">
            <p className="text-amber-800 text-sm font-medium">
              ⚠️ Remember: Investing in startups and early-stage businesses
              carries high risks, including the potential loss of your entire
              investment. Only invest money you can afford to lose.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          This risk warning is provided by BantuHive in accordance with SEC
          Ghana guidelines.
        </p>
        <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default RiskWarning;

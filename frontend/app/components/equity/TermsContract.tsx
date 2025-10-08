import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import InfoTooltip from '@/app/components/tooltip/tooltip';

const CONTRACT_OPTIONS = {
  standard: [
    {
      id: 'equity-shares',
      label: 'Equity Shares',
      tooltip: `Standard ownership stake with voting rights and dividend entitlements under Ghana's Companies Act.\n\n<a href="/investment-contracts/equity-shares" target="_blank" class="text-blue-400 hover:underline">Learn more about Equity Shares</a>`,
    },
    {
      id: 'preference-shares',
      label: 'Preference Shares',
      tooltip: `Priority shares with fixed dividend rights and preferential treatment in liquidation.\n\n<a href="/investment-contracts/preference-shares" target="_blank" class="text-blue-400 hover:underline">Learn more about Preference Shares</a>`,
    },
    {
      id: 'share-options',
      label: 'Share Option Agreements',
      tooltip: `Agreements granting the right to purchase shares at a predetermined price in the future.\n\n<a href="/investment-contracts/share-options" target="_blank" class="text-blue-400 hover:underline">Learn more about Share Option Agreements</a>`,
    },
    {
      id: 'convertible-securities',
      label: 'Convertible Securities',
      tooltip: `Financial instruments that can be converted into other securities, typically equity shares.\n\n<a href="/investment-contracts/convertible-securities" target="_blank" class="text-blue-400 hover:underline">Learn more about Convertible Securities</a>`,
    },
    {
      id: 'secured-debt',
      label: 'Secured and Unsecured Debt',
      tooltip: `Debt instruments with or without collateral backing, offering different risk-return profiles.\n\n<a href="/investment-contracts/debt-instruments" target="_blank" class="text-blue-400 hover:underline">Learn more about Debt Instruments</a>`,
    },
    {
      id: 'redeemable-equity',
      label: 'Redeemable Equity Agreements',
      tooltip: `Equity instruments that can be redeemed or repurchased by the company under specified conditions.\n\n<a href="/investment-contracts/redeemable-equity" target="_blank" class="text-blue-400 hover:underline">Learn more about Redeemable Equity</a>`,
    },
    {
      id: 'sustainable-debt',
      label: 'Sustainable, Social and Green Debt',
      tooltip: `Debt instruments financing environmentally and socially sustainable projects with specific use of proceeds.\n\n<a href="/investment-contracts/sustainable-debt" target="_blank" class="text-blue-400 hover:underline">Learn more about Sustainable Debt</a>`,
    },
    {
      id: 'quasi-equity',
      label: 'Quasi-Equity',
      tooltip: `Hybrid instruments with equity-like features but structured as debt. Offers flexible returns based on performance.\n\n<a href="/investment-contracts/quasi-equity" target="_blank" class="text-blue-400 hover:underline">Learn more about Quasi-Equity</a>`,
    },
    {
      id: 'convertible-bonds',
      label: 'Convertible Bonds',
      tooltip: `Debt instruments that can convert into equity under agreed conditions.\n\n<a href="/investment-contracts/convertible-bonds" target="_blank" class="text-blue-400 hover:underline">Learn more about Convertible Bonds</a>`,
    },
    {
      id: 'debt-securities',
      label: 'Debt Securities',
      tooltip: `Fixed-income investments with guaranteed returns and repayment obligations.\n\n<a href="/investment-contracts/debt-securities" target="_blank" class="text-blue-400 hover:underline">Learn more about Debt Securities</a>`,
    },
  ],
  contractual: [
    {
      id: 'revenue-sharing',
      label: 'Revenue Sharing',
      tooltip: `Investors receive a percentage of company revenues until a multiple of their investment is repaid.\n\n<a href="/investment-contracts/revenue-sharing" target="_blank" class="text-blue-400 hover:underline">Learn more about Revenue Sharing</a>`,
    },
    {
      id: 'profit-sharing',
      label: 'Profit Sharing',
      tooltip: `Investors share in profits without ownership or voting rights.\n\n<a href="/investment-contracts/profit-sharing" target="_blank" class="text-blue-400 hover:underline">Learn more about Profit Sharing</a>`,
    },
    {
      id: 'offtake-agreements',
      label: 'Offtake Agreements',
      tooltip: `Contracts where a buyer agrees to purchase future production or output from a company.\n\n<a href="/investment-contracts/offtake-agreements" target="_blank" class="text-blue-400 hover:underline">Learn more about Offtake Agreements</a>`,
    },
    {
      id: 'leasing-agreements',
      label: 'Leasing Agreements',
      tooltip: `Contracts for the use of assets where investors provide equipment or property in exchange for periodic payments.\n\n<a href="/investment-contracts/leasing-agreements" target="_blank" class="text-blue-400 hover:underline">Learn more about Leasing Agreements</a>`,
    },
    {
      id: 'factoring-agreements',
      label: 'Factoring Agreements',
      tooltip: `Financing arrangement where businesses sell their accounts receivable to investors at a discount.\n\n<a href="/investment-contracts/factoring-agreements" target="_blank" class="text-blue-400 hover:underline">Learn more about Factoring Agreements</a>`,
    },
    {
      id: 'rental-agreements',
      label: 'Rental Agreements',
      tooltip: `Contracts for temporary use of property or assets in exchange for regular payments.\n\n<a href="/investment-contracts/rental-agreements" target="_blank" class="text-blue-400 hover:underline">Learn more about Rental Agreements</a>`,
    },
    {
      id: 'repurchase-agreements',
      label: 'Repurchase or Buy-back Agreements',
      tooltip: `Contracts where a company agrees to repurchase securities from investors at a future date and price.\n\n<a href="/investment-contracts/repurchase-agreements" target="_blank" class="text-blue-400 hover:underline">Learn more about Repurchase Agreements</a>`,
    },
    {
      id: 'royalty-agreements',
      label: 'Royalty Agreements',
      tooltip: `Investors receive a percentage of revenue or profit from specific products, services, or intellectual property.\n\n<a href="/investment-contracts/royalty-agreements" target="_blank" class="text-blue-400 hover:underline">Learn more about Royalty Agreements</a>`,
    },
    {
      id: 'impact-linked-investments',
      label: 'Impact-linked Investment Agreements',
      tooltip: `Financial returns are tied to the achievement of specific social or environmental impact metrics.\n\n<a href="/investment-contracts/impact-linked-investments" target="_blank" class="text-blue-400 hover:underline">Learn more about Impact-linked Investments</a>`,
    },
    {
      id: 'blended-investments',
      label: 'Blended Investment Agreements',
      tooltip: `Combines different types of capital (commercial, philanthropic, public) to achieve both financial and social returns.\n\n<a href="/investment-contracts/blended-investments" target="_blank" class="text-blue-400 hover:underline">Learn more about Blended Investments</a>`,
    },
    {
      id: 'other',
      label: 'Other / Custom Agreement',
      tooltip: `Work with legal counsel to draft a custom investment contract for your specific needs.\n\n<a href="/info/contactus" target="_blank" class="text-blue-400 hover:underline">Contact us for custom agreements</a>`,
    },
  ],
};

interface TermsContractProps {
  contractType: string;
  setContractType: (value: string) => void;
}

const TermsContract = ({
  contractType,
  setContractType,
}: TermsContractProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">
          Choose an investment contract structure
        </h3>

        <RadioGroup
          value={contractType}
          onValueChange={setContractType}
          className="space-y-4"
        >
          {/* Standard Investment Instruments */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Standard Investment Instruments
            </h4>
            <div className="space-y-3 pl-2 border-l-2 border-green-500">
              {CONTRACT_OPTIONS.standard.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.label}</Label>
                  <InfoTooltip
                    id={`${option.id}-tooltip`}
                    content={option.tooltip}
                    className="ml-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className="my-4 border-gray-200" />

          {/* Contractual Agreements */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Contractual Agreements
            </h4>
            <div className="space-y-3 pl-2 border-l-2 border-blue-400">
              {CONTRACT_OPTIONS.contractual.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.label}</Label>
                  <InfoTooltip
                    id={`${option.id}-tooltip`}
                    content={option.tooltip}
                    className="ml-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TermsContract;

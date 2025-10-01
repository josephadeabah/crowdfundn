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

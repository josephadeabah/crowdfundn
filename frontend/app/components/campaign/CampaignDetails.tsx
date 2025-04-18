import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';
import DateRangePicker from '@/app/components/ui/DateRangePicker';
import { Category } from '@/app/utils/helpers/categories';
import {
  Accordion,
  AccordionContentWrapper,
  AccordionItemWrapper,
  AccordionTriggerWrapper,
} from '../accordion/Accordion';
import PitchBasics from '../equity/PitchBasics';
import PitchTeam from '../equity/PitchTeam';
import TermsContract from '../equity/TermsContract';
import FundingGoals from '../equity/FundingGoals';

interface CampaignDetailsProps {
  title: string;
  setTitle: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  currencyCode: string;
  setCurrencyCode: (value: string) => void;
  goalAmount: string;
  setGoalAmount: (value: string) => void;
  startDate?: Date | string;
  setStartDate: (value: Date | string | undefined) => void;
  endDate?: Date | string;
  setEndDate: (value: Date | string | undefined) => void;
  onContinue: () => void;
  currencies: Array<{ code: string; symbol: string }>;
  categories: Category[];
  // Pitch section props
  teamMembers: Array<any>;
  setTeamMembers: (value: Array<any>) => void;
  companyInfo: {
    name: string;
    description: string;
    headquarters: string;
    website: string;
  };
  onCompanyInfoChange: (info: CampaignDetailsProps['companyInfo']) => void;
  // Terms section props
  contractType: string;
  setContractType: (value: string) => void;
  onFilesUpload: (files: File[]) => void;
  // Raise section props
  minRaise: string;
  setMinRaise: (value: string) => void;
  maxRaise: string;
  setMaxRaise: (value: string) => void;
  showEquitySections?: boolean;
}

const CampaignDetails = ({
  title,
  setTitle,
  category,
  setCategory,
  location,
  setLocation,
  currencyCode,
  setCurrencyCode,
  goalAmount,
  setGoalAmount,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onContinue,
  currencies,
  categories,
  // Pitch section
  teamMembers = [],
  setTeamMembers = () => {},
  companyInfo,
  onCompanyInfoChange,
  // Terms section
  contractType = '',
  setContractType = () => {},
  onFilesUpload,
  // Funding Goals
  minRaise,
  setMinRaise,
  maxRaise,
  setMaxRaise,
  showEquitySections = false,
}: CampaignDetailsProps) => {
  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find((c) => c.code === code);
    return currency ? currency.symbol : '₵';
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-5">
        <h2 className="text-xl font-semibold mb-4 text-emerald-900">
          Campaign Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="form-label">Campaign Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your campaign title..."
              className="block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where is your project based?"
                className="block w-full px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                disabled={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Currency</label>
              <Select value={currencyCode} onValueChange={setCurrencyCode}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="form-label">Funding Goal</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {getCurrencySymbol(currencyCode)}
                </span>
                <input
                  type="number"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="Amount"
                  className="block w-full pl-7 px-4 py-2 rounded-md border focus:outline-none text-gray-900 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Campaign Duration</label>
            <DateRangePicker
              startDate={startDate instanceof Date ? startDate : undefined}
              endDate={endDate instanceof Date ? endDate : undefined}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          {!showEquitySections && (
            <div className="w-full mb-2 border border-gray-200 rounded-md my-8">
              <span className="text-sm font-semibold mb-4 text-gray-500 p-4 italic">
                Only use the below if you're raising to give out equity to
                investors otherwise skip the below
              </span>
              <Accordion type="multiple" className="w-full space-y-2">
                {/* Part 1: The Company Intro */}
                <AccordionItemWrapper value="pitch">
                  <AccordionTriggerWrapper>
                    <span className="font-medium">Company Intro</span>
                  </AccordionTriggerWrapper>
                  <AccordionContentWrapper>
                    <div className="space-y-6">
                      <PitchBasics
                        companyInfo={companyInfo}
                        onCompanyInfoChange={onCompanyInfoChange}
                      />
                      <PitchTeam
                        teamMembers={teamMembers}
                        setTeamMembers={setTeamMembers}
                      />
                    </div>
                  </AccordionContentWrapper>
                </AccordionItemWrapper>

                {/* Part 2: The Terms */}
                <AccordionItemWrapper value="terms">
                  <AccordionTriggerWrapper>
                    <span className="font-medium">Terms & Documents</span>
                  </AccordionTriggerWrapper>
                  <AccordionContentWrapper>
                    <div className="space-y-6">
                      <TermsContract
                        contractType={contractType}
                        setContractType={setContractType}
                        onFilesUpload={onFilesUpload}
                      />
                    </div>
                  </AccordionContentWrapper>
                </AccordionItemWrapper>

                {/* Part 3: The Raise */}
                <AccordionItemWrapper value="raise">
                  <AccordionTriggerWrapper>
                    <span className="font-medium">The Raise</span>
                  </AccordionTriggerWrapper>
                  <AccordionContentWrapper>
                    <div className="space-y-6">
                      <FundingGoals
                        minRaise={minRaise}
                        setMinRaise={setMinRaise}
                        maxRaise={maxRaise}
                        setMaxRaise={setMaxRaise}
                      />
                    </div>
                  </AccordionContentWrapper>
                </AccordionItemWrapper>
              </Accordion>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              onClick={onContinue}
              className="ml-auto bg-emerald-700 text-white"
            >
              Continue to Content
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignDetails;

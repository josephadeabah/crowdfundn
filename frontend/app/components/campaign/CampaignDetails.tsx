'use client';
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
import FileUpload from './FileUpload';

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
  companyInfo: {
    name: string;
    description: string;
    headquarters: string;
    website: string;
    contract_term?: string;
  };
  onCompanyInfoChange: (info: CampaignDetailsProps['companyInfo']) => void;
  // Terms section props
  contractType?: string;
  setContractType?: (value: string) => void;
  // Raise section props
  minRaise?: string;
  setMinRaise?: (value: string) => void;
  maxRaise?: string;
  setMaxRaise?: (value: string) => void;
  valuation: string;
  setValuation: (value: string) => void;
  equityOffered: string;
  setEquityOffered: (value: string) => void;
  // New equity offering fields
  minimumTarget?: string;
  setMinimumTarget?: (value: string) => void;
  pricePerShare?: string;
  setPricePerShare?: (value: string) => void;
  minShares?: string;
  setMinShares?: (value: string) => void;
  maxShares?: string;
  setMaxShares?: (value: string) => void;
  sharesOffered?: string;
  setSharesOffered?: (value: string) => void;
  stockType?: string;
  setStockType?: (value: string) => void;
  fundingRound?: string;
  setFundingRound?: (value: string) => void;
  secFilingUrl?: string;
  setSecFilingUrl?: (value: string) => void;
  offeringCircularUrl?: string;
  setOfferingCircularUrl?: (value: string) => void;
  offeringMemorandum?: string;
  setOfferingMemorandum?: (value: string) => void;
  offeringMemorandumFile?: File | null;
  setOfferingMemorandumFile?: (value: File | null) => void;
  stockTypes?: Array<{ value: string; label: string }>;
  fundingRounds?: Array<{ value: string; label: string }>;
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
  companyInfo = {
    name: '',
    description: '',
    headquarters: '',
    website: '',
    contract_term: '',
  },
  onCompanyInfoChange = () => {},
  // Terms section
  contractType = '',
  setContractType = () => {},
  // Funding Goals
  minRaise = '',
  setMinRaise = () => {},
  maxRaise = '',
  setMaxRaise = () => {},
  valuation,
  setValuation = () => {},
  equityOffered,
  setEquityOffered = () => {},
  // New equity offering fields
  minimumTarget = '',
  setMinimumTarget = () => {},
  pricePerShare = '',
  setPricePerShare = () => {},
  minShares = '',
  setMinShares = () => {},
  maxShares = '',
  setMaxShares = () => {},
  sharesOffered = '',
  setSharesOffered = () => {},
  stockType = '',
  setStockType = () => {},
  fundingRound = '',
  setFundingRound = () => {},
  secFilingUrl = '',
  setSecFilingUrl = () => {},
  offeringCircularUrl = '',
  setOfferingCircularUrl = () => {},
  offeringMemorandum = '',
  setOfferingMemorandum = () => {},
  offeringMemorandumFile = null,
  setOfferingMemorandumFile = () => {},
  stockTypes = [],
  fundingRounds = [],
  showEquitySections = false,
}: CampaignDetailsProps) => {
  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find((c) => c.code === code);
    return currency ? currency.symbol : '₵';
  };

  const isEquityCampaign =
    companyInfo.name ||
    minRaise ||
    maxRaise ||
    valuation ||
    equityOffered ||
    contractType;

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

          {showEquitySections && (
            <div className="w-full mb-2 border border-gray-200 rounded-md my-8">
              <span className="text-sm font-semibold mb-4 text-gray-500 p-4 italic">
                Only use the below if you're raising to give out equity to investors otherwise click Continue to Content
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
                    </div>
                  </AccordionContentWrapper>
                </AccordionItemWrapper>

                {/* Part 2: The Terms */}
                <AccordionItemWrapper value="terms">
                  <AccordionTriggerWrapper>
                    <span className="font-medium">Contract Terms</span>
                  </AccordionTriggerWrapper>
                  <AccordionContentWrapper>
                    <div className="space-y-6">
                      <TermsContract
                        contractType={contractType}
                        setContractType={setContractType}
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
                        valuation={valuation}
                        setValuation={setValuation}
                        equityOffered={equityOffered}
                        setEquityOffered={setEquityOffered}
                      />
                    </div>
                  </AccordionContentWrapper>
                </AccordionItemWrapper>

                {/* Part 4: Equity Offering Details */}
                {isEquityCampaign && (
                  <AccordionItemWrapper value="equity-offering">
                    <AccordionTriggerWrapper>
                      <span className="font-medium">
                        Equity Offering Details
                      </span>
                    </AccordionTriggerWrapper>
                    <AccordionContentWrapper>
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Equity Offering Structure
                        </h3>

                        {/* Minimum Target */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Funding Target
                          </label>
                          <input
                            type="number"
                            value={minimumTarget}
                            onChange={(e) => setMinimumTarget(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Minimum amount needed to proceed"
                          />
                        </div>

                        {/* Stock Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Type
                          </label>
                          <select
                            value={stockType}
                            onChange={(e) => setStockType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Stock Type</option>
                            {stockTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Funding Round */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Funding Round
                          </label>
                          <select
                            value={fundingRound}
                            onChange={(e) => setFundingRound(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Funding Round</option>
                            {fundingRounds.map((round) => (
                              <option key={round.value} value={round.value}>
                                {round.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* SEC Filing URL */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SEC Filing URL
                          </label>
                          <input
                            type="url"
                            value={secFilingUrl}
                            onChange={(e) => setSecFilingUrl(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://sec.gov/..."
                          />
                        </div>

                        {/* Offering Circular URL */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Offering Circular URL
                          </label>
                          <input
                            type="url"
                            value={offeringCircularUrl}
                            onChange={(e) =>
                              setOfferingCircularUrl(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/offering-circular"
                          />
                        </div>

                        {/* Offering Memorandum - File Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Offering Memorandum (File Upload)
                          </label>
                          <FileUpload
                            file={offeringMemorandumFile}
                            onFileChange={setOfferingMemorandumFile}
                            accept=".pdf,.doc,.docx"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Upload the offering memorandum document (PDF, DOC,
                            DOCX)
                          </p>
                        </div>

                        {/* Offering Memorandum - Text Field (alternative) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Offering Memorandum (Text Description)
                          </label>
                          <textarea
                            value={offeringMemorandum}
                            onChange={(e) =>
                              setOfferingMemorandum(e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Or provide a text description of the offering memorandum..."
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Provide either a file upload OR a text description,
                            not both
                          </p>
                        </div>
                      </div>
                    </AccordionContentWrapper>
                  </AccordionItemWrapper>
                )}
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

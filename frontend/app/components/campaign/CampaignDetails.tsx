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

interface CampaignDetailsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  currencyCode: string;
  setCurrencyCode: (value: string) => void;
  goalAmount: string;
  setGoalAmount: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (value: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (value: Date | undefined) => void;
  onContinue: () => void;
  currencies: Array<{ code: string; symbol: string }>;
  categories: string[];
}

const CampaignDetails = ({
  title,
  setTitle,
  description,
  setDescription,
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
}: CampaignDetailsProps) => {
  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find((c) => c.code === code);
    return currency ? currency.symbol : 'GHS';
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
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald/60"
            />
          </div>

          <div>
            <label className="form-label">Short Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your campaign..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald/60"
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
                    <SelectItem key={cat} value={cat}>
                      {cat}
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
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald/60"
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
                  className="w-full pl-7 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald/60"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Campaign Duration</label>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={onContinue} className="ml-auto">
              Continue to Content
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignDetails;

import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { industries, stages } from './dealRoomData';

interface DealFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedIndustry: string;
  onIndustryChange: (value: string) => void;
  selectedStage: string;
  onStageChange: (value: string) => void;
}

export function DealFilters({
  searchQuery,
  onSearchChange,
  selectedIndustry,
  onIndustryChange,
  selectedStage,
  onStageChange,
}: DealFiltersProps) {
  return (
    <div className="w-full">
      {/* Desktop Filters */}
      <div className="hidden md:flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search deals, companies, founders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border border-gray-300 focus:border-emerald-600"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <Select value={selectedIndustry} onValueChange={onIndustryChange}>
            <SelectTrigger className="w-[160px] bg-white border border-gray-300">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStage} onValueChange={onStageChange}>
            <SelectTrigger className="w-[140px] bg-white border border-gray-300">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="bg-white border border-gray-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Filters - Horizontally Scrollable */}
      <div className="md:hidden w-full">
        {/* Search on Mobile */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search deals, companies, founders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border border-gray-300 focus:border-emerald-600"
          />
        </div>

        {/* Scrollable Filter Row */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="shrink-0">
            <Select value={selectedIndustry} onValueChange={onIndustryChange}>
              <SelectTrigger className="w-[140px] bg-white border border-gray-300">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="shrink-0">
            <Select value={selectedStage} onValueChange={onStageChange}>
              <SelectTrigger className="w-[120px] bg-white border border-gray-300">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="shrink-0">
            <Button className="bg-white border border-gray-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search deals, companies, founders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card border-border/50 focus:broder-emerald-500"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select value={selectedIndustry} onValueChange={onIndustryChange}>
          <SelectTrigger className="w-[160px] bg-card border-border/50">
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
          <SelectTrigger className="w-[140px] bg-card border-border/50">
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

        <Button
          variant="outline"
          size="icon"
          className="bg-card border-border/50 hover:bg-emerald-600 hover:text-emerald-600 hover:broder-emerald-500"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calender';

interface DatePickerProps {
  date?: Date;
  onSelect: (date?: Date) => void;
  className?: string;
  fromDate?: Date;
  toDate?: Date;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onSelect,
  className,
  fromDate,
  toDate,
  disabled = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          fromDate={fromDate}
          toDate={toDate}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}

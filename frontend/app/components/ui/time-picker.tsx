'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  minTime?: string;
  maxTime?: string;
  disabled?: boolean;
}

export function TimePicker({
  value,
  onChange,
  className,
  minTime,
  maxTime,
  disabled = false,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Check if time is within bounds
        if (minTime && timeString < minTime) continue;
        if (maxTime && timeString > maxTime) continue;

        const displayTime = new Date(
          `2000-01-01T${timeString}`,
        ).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        slots.push({ value: timeString, display: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const displayValue = value
    ? new Date(`2000-01-01T${value}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'Select time';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 z-[100]">
        <div className="max-h-60 overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-1">
            {timeSlots.map((slot) => (
              <Button
                key={slot.value}
                variant={value === slot.value ? 'default' : 'ghost'}
                className="justify-start"
                onClick={() => {
                  onChange(slot.value);
                  setOpen(false);
                }}
                disabled={disabled}
              >
                {slot.display}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
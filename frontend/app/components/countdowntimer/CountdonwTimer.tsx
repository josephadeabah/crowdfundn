// app/components/countdown-timer/CountdownTimer.tsx
'use client';
import { useState, useEffect } from 'react';
import { cn } from '@/app/lib/utils';

interface CountdownTimerProps {
  timeString: string;
  className?: string;
  onComplete?: () => void;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const parseTimeString = (timeString: string): number => {
  const hourMatch = timeString.match(/(\d+)h/);
  const minuteMatch = timeString.match(/(\d+)m/);

  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;

  return hours * 3600 + minutes * 60;
};

const formatNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const CountdownTimer = ({
  timeString,
  className,
  onComplete,
}: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => {
    const totalSeconds = parseTimeString(timeString);
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      total: totalSeconds,
    };
  });

  useEffect(() => {
    if (timeRemaining.total <= 0) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTotal = prev.total - 1;

        if (newTotal <= 0) {
          clearInterval(interval);
          onComplete?.();
          return { hours: 0, minutes: 0, seconds: 0, total: 0 };
        }

        return {
          hours: Math.floor(newTotal / 3600),
          minutes: Math.floor((newTotal % 3600) / 60),
          seconds: newTotal % 60,
          total: newTotal,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining.total, onComplete]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="text-lg font-mono tabular-nums">
        {formatNumber(value)}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <TimeUnit value={timeRemaining.hours} label="Hours" />
      <div className="text-lg">:</div>
      <TimeUnit value={timeRemaining.minutes} label="Minutes" />
      <div className="text-lg">:</div>
      <TimeUnit value={timeRemaining.seconds} label="Seconds" />
    </div>
  );
};

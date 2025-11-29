import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/app/lib/utils';

export interface AdvancedSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showValue?: boolean;
  showMinMax?: boolean;
  showSteps?: boolean;
  formatValue?: (value: number) => string;
  variant?: 'default' | 'glow' | 'minimal';
}

const AdvancedSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  AdvancedSliderProps
>(
  (
    {
      className,
      showValue = false,
      showMinMax = false,
      showSteps = false,
      formatValue = (val) => val.toString(),
      variant = 'default',
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const [currentValue, setCurrentValue] = React.useState<number[]>(
      value || defaultValue || [min],
    );

    React.useEffect(() => {
      if (value) {
        setCurrentValue(value);
      }
    }, [value]);

    const handleValueChange = (newValue: number[]) => {
      setCurrentValue(newValue);
      props.onValueChange?.(newValue);
    };

    // Calculate steps for markers
    const steps = showSteps
      ? Array.from(
          { length: Math.floor((max - min) / step) + 1 },
          (_, i) => min + i * step,
        )
      : [];

    const isRange = currentValue.length > 1;

    return (
      <div className="w-full space-y-3">
        {showMinMax && (
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatValue(min)}</span>
            <span>{formatValue(max)}</span>
          </div>
        )}

        <div className="relative">
          <SliderPrimitive.Root
            ref={ref}
            className={cn(
              'relative flex w-full touch-none select-none items-center',
              className,
            )}
            value={currentValue}
            onValueChange={handleValueChange}
            min={min}
            max={max}
            step={step}
            {...props}
          >
            <SliderPrimitive.Track
              className={cn(
                'relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 transition-all',
                variant === 'glow' && 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
              )}
            >
              <SliderPrimitive.Range
                className={cn(
                  'absolute h-full bg-emerald-500 transition-all',
                  variant === 'glow' && 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
                  variant === 'minimal' && 'bg-emerald-600',
                )}
              />
            </SliderPrimitive.Track>

            {/* Step markers */}
            {showSteps && (
              <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
                {steps.map((stepValue) => {
                  const percentage = ((stepValue - min) / (max - min)) * 100;
                  const isInRange = isRange
                    ? stepValue >= currentValue[0] &&
                      stepValue <= currentValue[1]
                    : stepValue <= currentValue[0];

                  return (
                    <div
                      key={stepValue}
                      className={cn(
                        'w-1 h-1 rounded-full transition-all duration-300',
                        isInRange
                          ? 'bg-white/80'
                          : 'bg-gray-400/30',
                      )}
                      style={{ left: `${percentage}%` }}
                    />
                  );
                })}
              </div>
            )}

            {currentValue.map((val, index) => (
              <SliderPrimitive.Thumb
                key={index}
                className={cn(
                  'relative block h-5 w-5 rounded-full border-2 border-emerald-600 bg-white ring-offset-white transition-all duration-300 group',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
                  'disabled:pointer-events-none disabled:opacity-50',
                  'hover:scale-110 hover:border-emerald-700 active:scale-95',
                  variant === 'glow' &&
                    'shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)]',
                  variant === 'default' && 'shadow-md hover:shadow-lg',
                  variant === 'minimal' &&
                    'border-emerald-600 hover:border-emerald-700',
                )}
              >
                {showValue && (
                  <div
                    className={cn(
                      'absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200',
                      'bg-emerald-600 text-white shadow-lg',
                      'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100',
                      variant === 'glow' &&
                        'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
                    )}
                  >
                    {formatValue(val)}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-600 rotate-45" />
                  </div>
                )}
              </SliderPrimitive.Thumb>
            ))}
          </SliderPrimitive.Root>
        </div>

        {showValue && !props.disabled && (
          <div className="flex justify-center gap-4 text-sm font-medium text-gray-900">
            {isRange ? (
              <>
                <span className="text-emerald-600">
                  {formatValue(currentValue[0])}
                </span>
                <span className="text-gray-500">—</span>
                <span className="text-emerald-600">
                  {formatValue(currentValue[1])}
                </span>
              </>
            ) : (
              <span className="text-emerald-600">
                {formatValue(currentValue[0])}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

AdvancedSlider.displayName = 'AdvancedSlider';

export { AdvancedSlider };
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/app/lib/utils";

export interface AdvancedSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showValue?: boolean;
  showMinMax?: boolean;
  showSteps?: boolean;
  formatValue?: (value: number) => string;
  variant?: "default" | "glow" | "minimal";
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
      variant = "default",
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [currentValue, setCurrentValue] = React.useState<number[]>(
      value || defaultValue || [min]
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
          (_, i) => min + i * step
        )
      : [];

    const isRange = currentValue.length > 1;

    return (
      <div className="w-full space-y-3">
        {showMinMax && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatValue(min)}</span>
            <span>{formatValue(max)}</span>
          </div>
        )}

        <div className="relative">
          <SliderPrimitive.Root
            ref={ref}
            className={cn(
              "relative flex w-full touch-none select-none items-center",
              className
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
                "relative h-2 w-full grow overflow-hidden rounded-full bg-slider-track transition-all",
                variant === "glow" && "shadow-[0_0_10px_hsl(var(--slider-track))]"
              )}
            >
              <SliderPrimitive.Range
                className={cn(
                  "absolute h-full bg-slider-range transition-all",
                  variant === "glow" && "shadow-[0_0_15px_hsl(var(--slider-range))]",
                  variant === "minimal" && "bg-primary"
                )}
              />
            </SliderPrimitive.Track>

            {/* Step markers */}
            {showSteps && (
              <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
                {steps.map((stepValue) => {
                  const percentage = ((stepValue - min) / (max - min)) * 100;
                  const isInRange = isRange
                    ? stepValue >= currentValue[0] && stepValue <= currentValue[1]
                    : stepValue <= currentValue[0];

                  return (
                    <div
                      key={stepValue}
                      className={cn(
                        "w-1 h-1 rounded-full transition-all duration-300",
                        isInRange ? "bg-primary-foreground/80" : "bg-muted-foreground/30"
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
                  "relative block h-5 w-5 rounded-full border-2 border-slider-thumb bg-background ring-offset-background transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "hover:scale-110 hover:border-slider-thumb-hover active:scale-95",
                  variant === "glow" &&
                    "shadow-[0_0_15px_hsl(var(--slider-thumb-shadow))] hover:shadow-[0_0_25px_hsl(var(--slider-thumb-shadow))]",
                  variant === "default" && "shadow-md hover:shadow-lg",
                  variant === "minimal" && "border-primary hover:border-primary-glow"
                )}
              >
                {showValue && (
                  <div
                    className={cn(
                      "absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200",
                      "bg-primary text-primary-foreground shadow-lg",
                      "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100",
                      variant === "glow" && "shadow-[0_0_15px_hsl(var(--primary-glow))]"
                    )}
                  >
                    {formatValue(val)}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
                  </div>
                )}
              </SliderPrimitive.Thumb>
            ))}
          </SliderPrimitive.Root>
        </div>

        {showValue && !props.disabled && (
          <div className="flex justify-center gap-4 text-sm font-medium text-foreground">
            {isRange ? (
              <>
                <span className="text-primary">{formatValue(currentValue[0])}</span>
                <span className="text-muted-foreground">—</span>
                <span className="text-primary">{formatValue(currentValue[1])}</span>
              </>
            ) : (
              <span className="text-primary">{formatValue(currentValue[0])}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

AdvancedSlider.displayName = "AdvancedSlider";

export { AdvancedSlider };
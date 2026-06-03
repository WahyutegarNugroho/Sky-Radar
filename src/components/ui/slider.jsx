import * as React from "react";
import { cn } from "@/lib/utils";

function Slider({ className, defaultValue, value, min = 0, max = 100, step = 1, onValueChange, ...props }) {
  const isControlled = value !== undefined;
  const actualValue = isControlled ? value[0] : defaultValue ? defaultValue[0] : min;
  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    if (onValueChange) onValueChange([val]);
  };
  return (
    <div className={cn("relative flex w-full touch-none items-center", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={isControlled ? actualValue : undefined}
        defaultValue={!isControlled ? actualValue : undefined}
        onChange={handleChange}
        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/50 transition-shadow disabled:opacity-50 disabled:pointer-events-none [&::-webkit-slider-runnable-track]:bg-gray-200/50 [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-brand [&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-110 [&::-moz-range-track]:bg-gray-200/50 [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:h-1.5 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-brand [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:active:scale-110"
        {...props}
      />
    </div>
  );
}

export { Slider };

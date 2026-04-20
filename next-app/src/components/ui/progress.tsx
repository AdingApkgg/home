"use client";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { value: number; label?: string }
>(({ className, value, label, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-5 w-full overflow-hidden rounded-full bg-white/15", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full flex items-center justify-end bg-white/80 text-[11px] font-medium text-zinc-900 transition-transform duration-500 px-2"
      style={{ width: `${value}%` }}
    >
      {label && <span className="whitespace-nowrap">{label}</span>}
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

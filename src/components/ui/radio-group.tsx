import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn("grid gap-2", className)} {...props} />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { label: React.ReactNode }
>(({ className, label, ...props }, ref) => (
  // Radix's Item is a <button role="radio">, not an <input>. The whole tile
  // acts as the click target via has-[:checked]; we don't need a separate
  // <label htmlFor>, which would have no effect on a button anyway.
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "group flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/85 transition-colors hover:bg-white/10 data-[state=checked]:border-ring/70 data-[state=checked]:bg-ring/15 data-[state=checked]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
      className,
    )}
    {...props}
  >
    <span
      aria-hidden
      className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/50 group-data-[state=checked]:border-ring"
    >
      <RadioGroupPrimitive.Indicator>
        <span className="block h-1.5 w-1.5 rounded-full bg-ring" />
      </RadioGroupPrimitive.Indicator>
    </span>
    <span>{label}</span>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

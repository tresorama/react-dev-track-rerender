import type React from "react";
import { cn } from "../shadcn/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  [
    "py-1.5 px-4 inline-flex items-center gap-2 rounded-sm overflow-hidden",
    "tracking-tight font-light",
    "transition-all duration-200",
    "cursor-pointer disabled:opacity-50",
    "[&>svg]:size-[1em]",
    // "[&>input[type=checkbox]]:accent-orange-500"
  ].join(" "),
  {
    variants: {
      variant: {
        // default: "bg-linear-[-15deg] from-background from-[-0%] to-muted to-[180%] border text-muted-foreground hover:to-[50%] hover:text-foreground hover:border-foreground/30",
        // default: "bg-muted text-foreground border border-foreground/20 hover:bg-foreground/10",
        default: "bg-muted text-foreground border hover:bg-foreground/30",
        primary: "bg-primary text-background border border-foreground/20 hover:bg-primary/80",
        outline: "bg-transparent text-foreground border border-foreground/20 hover:bg-foreground/10",
      },
      size: {
        md: "text-sm",
        sm: "text-xs",
        icon: "p-2 text-sm",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  });

type UiButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export const UiButton = ({ children, variant, size, ...rest }: UiButtonProps) => {
  const cl = buttonVariants({ variant, size });
  return (
    <button
      type="button"
      {...rest}
      data-name="UiButton"
      className={cn(cl, rest.className)}
    >
      {children}
    </button>
  );
};
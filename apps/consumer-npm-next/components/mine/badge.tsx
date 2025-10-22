import { cn } from "../shadcn/lib/utils";

export const UiBadge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: React.ComponentProps<'span'>['className'];
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium uppercase text-green-800",
      className
    )}
  >
    {children}
  </span>
);
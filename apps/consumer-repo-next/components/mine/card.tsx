import { cn } from "../shadcn/lib/utils";

type UiCardProps = React.ComponentProps<"div">;

export const UiCard = ({ children, ...props }: UiCardProps) => (
  <div
    {...props}
    data-name="UiCard"
    className={cn(
      // "px-4 py-4 border rounded bg-linear-[-15deg] from-muted from-[-0%] to-muted/50 to-[100%]",
      // "px-4 py-4 border rounded bg-muted/30 border-muted",
      "px-4 py-4 border rounded bg-muted/20 border-foreground/10",
      props.className
    )}
  >
    {children}
  </div>
);
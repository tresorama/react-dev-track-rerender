import { cn } from "../shadcn/lib/utils";

export const UiToggler = ({
  leftText,
  leftClassName,
  rightText,
  rightClassName,
  checked,
  onCheckedChange
}: {
  leftText: string;
  leftClassName?: React.ComponentProps<'div'>['className'];
  rightText: string;
  rightClassName?: React.ComponentProps<'div'>['className'];
  checked: boolean;
  onCheckedChange: (newChecked: boolean) => void;
}) => (
  <div className="w-auto p-1 flex gap-0 rounded-sm bg-muted/20 text-sm text-muted-foreground border border-foreground/5">
    <UiTogglerItem
      text={leftText}
      onClick={() => onCheckedChange(checked)}
      isActive={!checked}
      className={leftClassName}
    />
    <UiTogglerItem
      text={rightText}
      onClick={() => onCheckedChange(!checked)}
      isActive={checked}
      className={rightClassName}
    />
  </div>
);

const UiTogglerItem = ({
  text,
  onClick,
  isActive,
  className,
}: {
  text: string;
  onClick: () => void;
  isActive: boolean;
  className?: React.ComponentProps<'div'>['className'];
}) => (
  <div
    data-state={isActive ? 'active' : 'inactive'}
    onClick={onClick}
    className={cn(
      "px-2.5 py-1 rounded-[inherit] data-[state=active]:bg-background/50 data-[state=active]:text-foreground cursor-pointer select-none",
      className
    )}
  >
    {text}
  </div>
);
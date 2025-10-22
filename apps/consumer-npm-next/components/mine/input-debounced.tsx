import { useState } from "react";
import { useDebounce } from "react-use";

import { Input } from "@/components/shadcn/ui/input";


type UiInputDebouncedProps = {
  initialValue?: string;
  onChange: (newValue: string) => void;
} & Omit<React.ComponentProps<typeof Input>, "value" | "onChange">;

export function UiInputDebounced({
  initialValue = '',
  onChange,
  ...props
}: UiInputDebouncedProps) {

  const [localValue, setLocalValue] = useState(() => initialValue);

  useDebounce(
    () => onChange(localValue),
    1000,
    [localValue]
  );

  return (
    <Input
      {...props}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
}
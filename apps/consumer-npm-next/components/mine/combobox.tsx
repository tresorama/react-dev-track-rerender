"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/components/shadcn/lib/utils";
import { UiButton as Button } from "@/components/mine/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/ui/popover";

export type ComboboxOption = {
  value: string;
  label: React.ReactNode;
};

export function UiCombobox<
  TOptions extends ComboboxOption[],
  TOption extends ComboboxOption = TOptions[number]
>({
  options,
  value,
  onChangeOption,
  textPlaceholder = 'Select one',
  textEmptyResult = 'No results',
}: {
  options: TOption[],
  value?: TOption['value'],
  onChangeOption: (option: TOption | null) => void,
  textPlaceholder?: string,
  textEmptyResult?: string;

}) {
  const [open, setOpen] = React.useState(false);
  const activeOption = options.find((option) => option.value === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {activeOption && typeof activeOption.label !== 'string' ? (
        <PopoverTrigger>
          {activeOption.label}
        </PopoverTrigger>
      ) : (
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {activeOption ? activeOption.label : textPlaceholder}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      )}
      <PopoverContent
        className="w-[200px] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={textPlaceholder} />
          <CommandList>
            <CommandEmpty>{textEmptyResult}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const newOption = options.find(option => option.value === currentValue) ?? null;
                    onChangeOption(newOption);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
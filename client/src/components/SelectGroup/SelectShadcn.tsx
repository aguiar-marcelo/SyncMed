"use client";
import { useEffect, useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SelectProps {
  placeholder: string;
  options: { label: string; value: string | number }[];
  selectedValue: number | undefined;
  onValueChange: (value: number | undefined) => void;
  className?: string;
  disabled?: boolean;
}

export default function SelectFilter({
  placeholder,
  options,
  selectedValue,
  onValueChange,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((op) =>
      op.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, options]);
  
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        asChild
        className="h-12.5 justify-between border border-stroke bg-gray bg-opacity-0 text-[16px] font-light hover:border-primary dark:border-form-strokedark dark:bg-form-input dark:hover:border-primary"
      >
        <Button
          role="combobox"
          className="z-20 w-full rounded border text-black transition hover:bg-transparent dark:bg-form-input dark:text-white dark:hover:bg-transparent"
        >
          {selectedValue ? (
            options.find((op) => op.value === selectedValue)?.label
          ) : (
            <span className="opacity-85">{placeholder}</span>
          )}
          <ChevronsUpDown className="!size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!w[100%] border bg-white bg-opacity-0 p-0 dark:bg-form-input">
        <Command className="border border-stroke dark:border-form-strokedark dark:bg-form-input">
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
            className="h-9 bg-transparent"
          />
          <CommandList className="bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar]:w-2">
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandGroup className="bg-transparent">
              {filteredOptions.map((op) => (
                <CommandItem
                  className="cursor-pointer border-b border-stroke !bg-transparent hover:!bg-gray-100 dark:border-form-strokedark dark:hover:!bg-black"
                  key={op.value.toString()}
                  value={op.label} // Agora o value é o label para filtragem correta
                  onSelect={() => {
                    onValueChange(+op.value);
                    setOpen(false);
                  }}
                >
                  {op.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue === op.value ? "opacity-100" : "opacity-0",
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

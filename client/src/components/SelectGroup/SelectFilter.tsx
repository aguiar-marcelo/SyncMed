import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React from "react";
import Select, {
  components,
  DropdownIndicatorProps,
} from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  placeholder: string;
  options: Option[];
  selectedValue: number | null;
  onValueChange: (value: number | null) => void;
  className?: string;
  disabled?: boolean;
}

const DropdownIndicator: React.FC<DropdownIndicatorProps<Option, false>> = (
  props,
) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="!size-6 opacity-80"/>
    </components.DropdownIndicator>
  );
};

export default function SelectFilter({
  placeholder,
  options,
  selectedValue,
  onValueChange,
  className,
  disabled = false,
}: SelectProps) {
  return (
    <Select
      classNamePrefix="select"
      placeholder={placeholder}
      components={{ DropdownIndicator }}
      options={options}
      onChange={(newValue) => onValueChange(Number(newValue?.value))}
      value={selectedValue !== null ? options.find((o) => +o.value === selectedValue) : null}
      isDisabled={disabled}
      unstyled
      noOptionsMessage={() => "Sem registros"}
      classNames={{
        clearIndicator: ({ isFocused }) =>
          cn(
            isFocused ? "text-neutral-600" : "text-neutral-200",
            "p-2",
            isFocused ? "hover:text-neutral-800" : "hover:text-neutral-400",
          ),
        container: () => cn("w-full"),
        control: ({ isDisabled, isFocused }) =>
          cn(
            "bg-transparent dark:bg-form-input border-stroke dark:border-form-strokedark hover:border-primary dark:hover:border-primary",
            isDisabled ? "opacity-50" : "opacity-100",
            isDisabled
              ? "border-neutral-100"
              : isFocused
                ? "border-purple-800"
                : "",
            "rounded",
            "border",
            isFocused && "border-primary",
          ),
        dropdownIndicator: ({ isFocused }) =>
          cn("px-2 text-body dark:text-bodydark"),
        group: () => cn("py-2"),
        groupHeading: () =>
          cn(
            "text-neutral-400",
            "text-xs",
            "font-medium",
            "mb-1",
            "px-3",
            "uppercase",
          ),
        indicatorsContainer: () => cn(),
        indicatorSeparator: ({ isDisabled }) =>
          cn(isDisabled ? "bg-neutral-100" : "bg-neutral-200", "my-2"),
        input: () => cn("text-body dark:text-bodydark"),
        loadingIndicator: ({ isFocused }) =>
          cn(isFocused ? "text-neutral-600" : "text-neutral-200", "p-2"),
        loadingMessage: () => cn("text-neutral-400", "py-2", "px-3"),
        menu: () =>
          cn(
            "bg-white dark:bg-form-input",
            "rounded",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.1)]",
            "my-1",
          ),
        menuList: () =>
          cn(
            "py-1 max-h-60 overflow-y-auto text-sm [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2",
          ),
        menuPortal: () => cn("z-99"),
        multiValue: () => cn("bg-neutral-100", "rounded-sm", "m-0.5"),
        multiValueLabel: () =>
          cn("rounded-sm", "text-neutral-800", "text-sm", "p-[3]", "pl-[6]"),
        multiValueRemove: ({ isFocused }) =>
          cn(
            "rounded-sm",
            isFocused && "bg-red-500",
            "px-1",
            "hover:bg-red-500",
            "hover:text-red-800",
          ),
        noOptionsMessage: () => cn("text-neutral-500", "py-2", "px-3"),
        option: ({ isDisabled, isFocused, isSelected }) =>
          cn(
            "text-body dark:text-bodydark py-2 px-3",
            isSelected
              ? "bg-primary text-neutral-100"
              : isFocused
                ? "!cursor-pointer bg-slate-200 dark:bg-slate-700"
                : "bg-transparent",
          ),
        placeholder: () => cn(""),
        singleValue: ({ isDisabled }) => cn("text-body dark:text-bodydark"),
        valueContainer: () => cn("px-5 py-3", className),
      }}
    />
  );
}

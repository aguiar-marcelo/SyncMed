"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

type Props = {
  value?: Date;
  onChange: (v?: Date) => void;
  label?: string;
  disableFuture?: boolean;
  fromYear?: number;
  toYear?: number;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
};

export default function DatePickerField({
  value,
  onChange,
  label = "Data",
  disableFuture = true,
  fromYear = 1920,
  toYear = new Date().getFullYear(),
  className,
  inputClassName,
  placeholder = "dd/mm/aaaa",
}: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setSelected(value), [value]);

  // Fechar ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const handleSelect = (d?: Date) => {
    setSelected(d);
    onChange(d);
    if (d) setOpen(false);
  };

  return (
    <div className={className} ref={ref}>
      {/* Trigger com aparência de input */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          inputClassName ??
          "h-[46px] w-full rounded border-[1.5px] border-stroke bg-transparent px-5 text-left text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        }
      >
        {selected ? (
          format(selected, "dd/MM/yyyy")
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-2 rounded-md border border-stroke bg-white p-2 shadow-md dark:border-strokedark dark:bg-boxdark">
          <DayPicker
            mode="single"
            locale={ptBR}
            selected={selected}
            onSelect={handleSelect}
            fromYear={fromYear}
            toYear={toYear}
            weekStartsOn={1}
            showOutsideDays
            disabled={disableFuture ? { after: new Date() } : undefined}
            style={{
              ["--rdp-accent-color" as any]: "#5e5eff",
              ["--rdp-day_button-width" as any]: "35px",
              ["--rdp-day_button-height" as any]: "28px",
            }}
            classNames={{
              caption_label: "text-sm pl-1.5",
              month_caption: `${getDefaultClassNames().month_caption} h-8 flex items-center`,
              weekday: `${getDefaultClassNames().weekday} text-[10px] !p-0`,
              day: "w-6 h-6 text-[11px] rounded-md hover:bg-white/10",
              selected: `${getDefaultClassNames().selected} !font-normal !text-[12px]`,
            }}
          />
        </div>
      )}
    </div>
  );
}

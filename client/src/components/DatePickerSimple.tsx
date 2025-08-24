"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

// Tipagem mínima: value opcional, onChange recebe Date | undefined
type Props = {
  value?: Date;
  onChange: (v?: Date) => void;
  label?: string;
  disableFuture?: boolean;
  fromYear?: number;
  toYear?: number;
  className?: string;
  inputClassName?: string;
};

export default function DatePickerSimple({
  value,
  onChange,
  label = "Data",
  disableFuture = true,
  fromYear = 1920,
  toYear = new Date().getFullYear(),
  className,
  inputClassName,
}: Props) {
  const [selected, setSelected] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (d?: Date) => {
    setSelected(d);
    onChange(d);
  };

  return (
    <div className={className}>
      
      {/* Campo de visualização (read-only) para ficar igual aos inputs */}
      <input
        type="text"
        readOnly
        value={selected ? format(selected, "dd/MM/yyyy") : ""}
        placeholder="dd/mm/aaaa"
        className={
          inputClassName ??
          "mb-3 w-full h-[46px] rounded border-[1.5px] border-stroke bg-transparent px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        }
      />

      {/* Calendário inline: sem popover, sem z-index, sem interferência */}
      <div className="rounded-md border border-stroke  dark:border-strokedark dark:bg-boxdark">
        <DayPicker
          mode="single"
          locale={ptBR}
          selected={selected}
          onSelect={handleSelect}
          fromYear={fromYear}
          toYear={toYear}
          weekStartsOn={1}
          showOutsideDays
          captionLayout="dropdown"
          disabled={disableFuture ? { after: new Date() } : undefined}
          // Tailwind classes para harmonizar com seu tema (sem CSS extra)
          className="p-2"
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button:
              "h-7 w-7 p-0 rounded border border-slate-200 bg-transparent opacity-70 hover:opacity-100 dark:border-slate-700",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "grid grid-cols-7",
            head_cell:
              "text-slate-500 rounded-md w-9 h-9 font-normal text-[0.8rem] place-self-center dark:text-slate-400",
            row: "grid grid-cols-7",
            cell:
              "h-9 w-9 p-0 place-self-center text-center text-sm relative focus-within:relative focus-within:z-20",
            day:
              "h-9 w-9 p-0 rounded hover:bg-slate-100 aria-selected:opacity-100 dark:hover:bg-slate-800",
            day_selected:
              "bg-slate-900 text-slate-50 hover:bg-slate-900 dark:bg-slate-50 dark:text-slate-900",
            day_today:
              "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
            day_outside:
              "text-slate-400 dark:text-slate-500 aria-selected:bg-slate-100/50 dark:aria-selected:bg-slate-800/50",
            day_disabled: "text-slate-400 opacity-50",
          }}
        />
      </div>

      {/* Botão limpar (opcional) */}
      {selected && (
        <button
          type="button"
          onClick={() => handleSelect(undefined)}
          className="mt-2 inline-flex h-9 items-center justify-center rounded border border-stroke px-3 text-sm hover:bg-slate-50 dark:border-strokedark dark:hover:bg-slate-800"
        >
          Limpar data
        </button>
      )}
    </div>
  );
}

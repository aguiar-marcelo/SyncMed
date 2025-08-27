"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { format, parse, parseISO, isValid } from "date-fns";
import { Calendar } from "lucide-react";
import "react-day-picker/dist/style.css";

type Props = {
  value?: Date | string;
  onChange: (v?: Date | string) => void;
  emitAs?: "date" | "string";
  disableFuture?: boolean;
  toYear?: number;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
};

function toDate(v?: Date | string): Date | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return isValid(v) ? v : undefined;
  const s = String(v).trim();
  const iso = parseISO(s);
  if (isValid(iso)) return iso;
  const br = parse(s, "dd/MM/yyyy", new Date());
  if (isValid(br)) return br;
  const ymd = parse(s, "yyyy-MM-dd", new Date());
  if (isValid(ymd)) return ymd;
  return undefined;
}

function toYMDStartOfDayString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${y}-${m}-${day}T00:00:00`;
}

export default function DatePicker({
  value,
  onChange,
  emitAs = "string",
  disableFuture = true,
  toYear = new Date().getFullYear(),
  className,
  inputClassName,
  placeholder = "dd/mm/aaaa",
}: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(toDate(value));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setSelected(toDate(value)), [value]);

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
    if (emitAs === "date") onChange(d);
    else onChange(d ? toYMDStartOfDayString(d) : undefined);
    if (d) setOpen(false);
  };

  return (
    <div className={className} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          inputClassName ??
          "flex h-[46px] w-full items-center gap-2 rounded border-[1.5px] border-stroke bg-transparent px-5 text-left text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        }
      >
        <Calendar size={17} />
        {selected ? (
          format(selected, "dd/MM/yyyy")
        ) : (
          <span className="mt-1 text-slate-400">{placeholder}</span>
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 rounded-md border border-stroke bg-white p-2 shadow-md dark:border-strokedark dark:bg-boxdark">
          <DayPicker
            mode="single"
            locale={ptBR}
            selected={selected}
            onSelect={handleSelect}
            toYear={toYear}
            weekStartsOn={1}
            showOutsideDays
            captionLayout="dropdown"
            defaultMonth={selected}
            disabled={disableFuture ? { after: new Date() } : undefined}
            style={
              {
                "--rdp-accent-color": "#441b7a",
                "--rdp-day_button-width": "35px",
                "--rdp-day_button-height": "35px",
              } as React.CSSProperties
            }
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

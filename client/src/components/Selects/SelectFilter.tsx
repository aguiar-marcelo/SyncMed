"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

export type SelectItem = { id: number; name: string };

type Props = {
  items: SelectItem[];
  placeholder?: string;
  value?: number | null;
  onChange: (item: SelectItem | null) => void;
  className?: string;
  disabled?: boolean;
  noResultsText?: string;
};

export default function SelectFilter({
  items,
  placeholder = "Selecione...",
  value = null,
  onChange,
  className,
  disabled,
  noResultsText = "Nenhum resultado",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const comboboxId = useId();

  const selected = useMemo(
    () => (value == null ? null : items.find((i) => i.id === value) || null),
    [value, items],
  );

  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const filtered = useMemo(() => {
    if (!query) return items;
    const nq = norm(query);
    return items.filter((i) => norm(i.name).includes(nq));
  }, [items, query]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
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

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) setQuery(selected?.name ?? "");
  }, [selected, open]);

  const choose = (item: SelectItem | null) => {
    onChange(item);
    setOpen(false);
    if (item) setQuery(item.name);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      scrollIntoView(activeIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      scrollIntoView(activeIndex - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) choose(item);
    }
  };

  const scrollIntoView = (index: number) => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[index] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ block: "nearest" });
  };

  return (
    <div ref={rootRef} className={className}>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className="flex h-[50px] w-full items-center justify-between rounded border-[1.5px] border-stroke bg-transparent px-3 text-left text-black outline-none transition focus:border-primary disabled:cursor-not-allowed dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`list-${comboboxId}`}
        >
          <span className="truncate pr-2 text-sm">
            {selected ? (
              selected.name
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )}
          </span>
          <div className="flex items-center gap-1">
            {selected && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  choose(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    choose(null);
                  }
                }}
                className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Limpar seleção"
              >
                <X size={16} />
              </span>
            )}

            <ChevronDown size={18} />
          </div>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-stroke bg-white shadow-md dark:border-strokedark dark:bg-boxdark">
            <div className="p-2">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={"Digite"}
                className="h-[40px] w-full rounded border border-stroke bg-transparent px-3 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                aria-autocomplete="list"
                role="combobox"
                aria-expanded={open}
                aria-controls={`list-${comboboxId}`}
              />
            </div>

            <ul
              ref={listRef}
              id={`list-${comboboxId}`}
              role="listbox"
              className="max-h-60 overflow-auto py-1"
            >
              {filtered.length === 0 && (
                <li className="px-3 py-2 text-sm text-slate-500">
                  {noResultsText}
                </li>
              )}
              {filtered.map((item, idx) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={selected?.id === item.id}
                  onMouseDown={(e) => e.preventDefault()} 
                  onClick={() => choose(item)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`cursor-pointer px-3 py-2 text-sm ${
                    idx === activeIndex ? "bg-black/5 dark:bg-white/10" : ""
                  } ${selected?.id === item.id ? "font-medium" : ""}`}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

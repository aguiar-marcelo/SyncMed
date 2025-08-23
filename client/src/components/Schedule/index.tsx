"use client";
import {
  CirclePlus,
  Pencil,
  ChevronUp,
  ChevronDown,
  Stethoscope,
  Search,
  User,
  User2,
  Calendar,
} from "lucide-react";
import { format, parse, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import TitlePage from "../Breadcrumbs/Breadcrumb";
import { ThreeDot } from "react-loading-indicators";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Sched = {
  date: string;
  hour: string;
  professional: { id: number; name: string; specialty: string };
  patient: { id: number; name: string };
  canceled: boolean;
};

const test: Sched[] = [
  {
    date: "22-08-2025",
    hour: "08:00",
    professional: {
      id: 1,
      name: "Alessandra Barbosa",
      specialty: "Ginecologia",
    },
    patient: { id: 1, name: "Maria Silva" },
    canceled: false,
  },
  {
    date: "21-08-2025",
    hour: "08:00",
    professional: { id: 1, name: "Marcelo Santos", specialty: "Cardiologia" },
    patient: { id: 1, name: "Joao Silva" },
    canceled: false,
  },
  {
    date: "22-08-2025",
    hour: "08:00",
    professional: { id: 1, name: "João Souza Lima", specialty: "Pediatria" },
    patient: { id: 1, name: "Pedro dos Santos" },
    canceled: false,
  },
  {
    date: "22-08-2025",
    hour: "08:00",
    professional: {
      id: 1,
      name: "Alessandra Barbosa",
      specialty: "Ginecologia",
    },
    patient: { id: 1, name: "Maria Silva" },
    canceled: false,
  },
];

export default function Schedule() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [schedullings, setSchedullings] = useState<Sched[]>(test);
  const [search, setSearch] = useState<string>("");

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const toDate = (s: string) => parse(s, "dd-MM-yyyy", new Date());

  const [selected, setSelected] = useState<Date | undefined>(() =>
    toDate(test[0].date),
  );

  const daysWithRecordsSet = useMemo(() => {
    const set = new Set<string>();
    schedullings.forEach((s) => set.add(format(toDate(s.date), "yyyy-MM-dd")));
    return set;
  }, [schedullings]);

  const filteredBySelected = useMemo(() => {
    if (!selected) return schedullings;
    return schedullings.filter((s) => isSameDay(toDate(s.date), selected));
  }, [schedullings, selected]);

  const getNestedValue = (obj: any, path: string) =>
    path.split(".").reduce((acc, key) => acc?.[key], obj);

  const sortedSchedullings = [...filteredBySelected].sort((a, b) => {
    if (!sortColumn) return 0;
    let aValue = getNestedValue(a, sortColumn);
    let bValue = getNestedValue(b, sortColumn);
    if (aValue === null || aValue === undefined) aValue = "";
    if (bValue === null || bValue === undefined) bValue = "";
    if (typeof aValue === "boolean") aValue = aValue ? 1 : 0;
    if (typeof bValue === "boolean") bValue = bValue ? 1 : 0;
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    if (sortDirection === "desc") setSortColumn(null);
  };

  const modifiers = {
    hasRecords: (day: Date) =>
      daysWithRecordsSet.has(format(day, "yyyy-MM-dd")),
  };

  const modifiersClassNames = {
    hasRecords:
      "relative after:content-[''] after:w-1.5 after:h-1.5 after:rounded-full after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[-5] after:bg-primary",
  };

  return (
    <div className="grid grid-cols-1 gap-9">
      <div className="flex flex-col gap-5">
        <TitlePage pageName="Agenda">
          <button className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-1 text-[0.7rem] text-white">
            <CirclePlus size={14} />
            Criar Agendamento
          </button>
        </TitlePage>

        <div className="mt-2 text-black dark:text-white">
          <div className="flex items-start justify-between gap-5">
            <div className="w-full rounded-2xl bg-[#f5f5f5] pb-3 dark:bg-[#0b0b12]">
              <div className="flex items-center justify-between px-5 pt-4">
                <span className="flex items-center gap-2">
                  <Calendar size={13} />
                  <h3 className="text-sm font-medium">
                    {selected && format(selected, "dd/MM/yyyy")}
                  </h3>
                </span>
              </div>

              {loading ? (
                <div className="my-20 flex justify-center">
                  <ThreeDot color="#3C50E0" speedPlus={2} />
                </div>
              ) : (
                <div className="max-h-[78vh] overflow-y-auto text-sm [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2">
                  <table className="w-full table-auto border-separate border-spacing-y-2 px-5 pb-4 text-sm">
                    <thead className="sticky top-0 z-10 bg-[#f5f5f5] dark:bg-[#11121d]">
                      <tr className="text-left">
                        {[
                          { key: "hour", label: "", style: "pl-5" },
                          { key: "patient.name", label: "Paciente" },
                          { key: "professional.name", label: "Profissional" },
                          {
                            key: "professional.specialty",
                            label: "Especialidade",
                          },
                        ].map(({ key, label, style }) => (
                          <th
                            key={key}
                            onClick={() => handleSort(key)}
                            className="py-2"
                          >
                            <span
                              className={`flex min-w-30 cursor-pointer text-xs font-normal text-black dark:text-white ${style || ""}`}
                            >
                              {label}
                              {sortColumn === key &&
                                (sortDirection === "asc" ? (
                                  <ChevronUp size={17} />
                                ) : (
                                  <ChevronDown size={17} />
                                ))}
                            </span>
                          </th>
                        ))}
                        <th className="w-[40px] py-3 text-black dark:text-white"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSchedullings
                        .filter(
                          (u) =>
                            u.patient.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            u.professional.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            u.professional.specialty
                              .toLowerCase()
                              .includes(search.toLowerCase()),
                        )
                        .map((s, i: number) => (
                          <tr
                            key={"scheduling" + i}
                            className="bg-white dark:bg-[#11121d]"
                          >
                            <td className="w-20 rounded-l-xl py-2 pl-5 md:pl-5">
                              <h5 className="font-medium text-black dark:text-white">
                                {s.hour}
                              </h5>
                            </td>
                            <td className="py-2">
                              <p className="text-black dark:text-white">
                                {s.patient.name}
                              </p>
                            </td>
                            <td className="py-2">
                              <p className="text-black dark:text-white">
                                {s.professional.name}
                              </p>
                            </td>
                            <td className="py-2">
                              <p className="flex items-center gap-1 font-semibold text-[#5e5eff]">
                                <Stethoscope size={14} />
                                {s.professional.specialty}
                              </p>
                            </td>
                            <td className="rounded-r-xl py-2 pr-4">
                              <div className="flex justify-end text-right">
                                <button className="p-1 hover:text-primary">
                                  <Pencil size={20} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="rounded-2xl bg-[#020326] px-4 py-3 pb-5 text-white">
              <div className="w-68 mx-auto rounded-2xl bg-white/10 px-2 pb-2">
                <DayPicker
                  mode="single"
                  locale={ptBR}
                  selected={selected}
                  onSelect={setSelected}
                  showOutsideDays
                  disabled={(day) => false}
                  style={{
                    ["--rdp-accent-color" as any]: "#5e5eff",
                    ["--rdp-day_button-width" as any]: "35px",
                    ["--rdp-day_button-height" as any]: "28px",
                  }}
                  classNames={{
                    caption_label: "text-sm pl-1.5",
                    month_caption: `${getDefaultClassNames().month_caption} h-8 flex items-center`,
                    weekday: `${getDefaultClassNames().weekday} !p-0`,
                    root: `${getDefaultClassNames().root} shadow-lg text-[10px]`,
                    day: "w-6 h-6 text-[11px] rounded-md hover:bg-white/10",
                    selected: `${getDefaultClassNames().selected} !font-normal !text-[12px]`,
                  }}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                />
                <div className="ml-1 mt-1 flex items-center gap-2 text-[10px] text-gray-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />{" "}
                  Dias com agendamentos
                </div>
              </div>
              <div className="font-montserrat mt-5 font-semibold">
                Profissionais
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                  <Search size={13} className="opacity-60" />
                </div>
                <input
                  type="text"
                  id="input-group-1"
                  className="mt-2 block w-full rounded-full border-gray-300 bg-white/10 p-2.5 ps-10 text-sm text-white focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Pesquisar..."
                />
              </div>

              <div className="mt-4 max-h-60 overflow-y-auto text-sm [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2">
                {Array.from({ length: 5 }).map((p, i) => (
                  <button
                    key={"professional" + i}
                    className="mb-5 flex w-full items-center gap-3 pl-1"
                  >
                    <User2
                      size={38}
                      className="rounded-full border-2 border-[#5e5eff] bg-gray-200 text-gray-500"
                    />
                    <div className="text-[12px]">
                      <div>Robert Knove</div>
                      <div className="mt-[-2px] text-left text-[11px] opacity-50">
                        Cardiologista
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

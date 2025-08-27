"use client";
import {
  CirclePlus,
  Stethoscope,
  Search,
  User2,
  Calendar,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCallback, useEffect, useMemo, useState } from "react";
import TitlePage from "../Breadcrumbs/Breadcrumb";
import { ThreeDot } from "react-loading-indicators";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";
import RegisterSchedullingModal from "./RegisterSchedullingModal";
import { useSchedulling } from "@/contexts/SchedulingContext";
import { Professional, Schedulling } from "@/types/api";
import { getSchedullingsByDate } from "@/services/schedulling";
import { useAuth } from "@/contexts/AuthContext";

export default function Schedule() {
  const { accessToken } = useAuth();
  const { professionals, schedullingsAllDates } = useSchedulling();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(() => new Date());
  const [professionalId, setProfessionalId] = useState<number>();
  const [proSearch, setProSearch] = useState<string>("");
  const [selectedPros, setSelectedPros] = useState<Professional[]>([]);

  const [schedullingsByDate, setSchedullingsByDate] = useState<Schedulling[]>(
    [],
  );

  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const filteredProfessionals = useMemo(() => {
    const nq = norm(proSearch);
    const selectedIds = new Set(selectedPros.map((p) => p.id));
    return (professionals as Professional[])
      .filter((p) => !selectedIds.has(p.id))
      .filter((p) => {
        if (!proSearch) return true;
        const name = norm(p.name);
        const spec = norm(p.specialty?.name ?? "");
        return name.includes(nq) || spec.includes(nq);
      });
  }, [professionals, proSearch, selectedPros]);

  const fetchSchedullingsByDate = useCallback(async () => {
    if (!accessToken || !date) return;
    try {
      setLoading(true);
      const data = await getSchedullingsByDate(
        format(date, "yyyy-MM-dd"),
        professionalId,
      );
      setSchedullingsByDate(data);
    } catch (error: unknown) {
      if (error instanceof Error) console.error(error.message);
      setSchedullingsByDate([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, date, professionalId]);

  const daysWithRecordsSet = useMemo(() => {
    return new Set<string>(schedullingsAllDates ?? []);
  }, [schedullingsAllDates]);

  const modifiers = {
    hasRecords: (day: Date) =>
      daysWithRecordsSet.has(format(day, "yyyy-MM-dd")),
  };

  useEffect(() => {
    if (!date) return;
    fetchSchedullingsByDate();
  }, [date, professionalId, fetchSchedullingsByDate]);

  return (
    <div className="grid grid-cols-1 gap-9">
      <div className="flex flex-col gap-5">
        <TitlePage pageName="Agenda">
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-1 text-[0.7rem] text-white hover:bg-opacity-90"
          >
            <CirclePlus size={14} />
            Agendar Consulta
          </button>
        </TitlePage>

        <div className="mt-2 text-black dark:text-white">
          <div className="flex items-start justify-between gap-5">
            <div className="w-full rounded-2xl bg-[#f5f5f5] pb-3 dark:bg-[#0b0b12]">
              <div className="flex items-center justify-between px-5 pt-4">
                <span className="flex items-center gap-2">
                  <Calendar size={13} />
                  <h3 className="text-sm font-medium">
                    {date && format(date, "dd/MM/yyyy")}
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
                            key: "professional.specialty.name",
                            label: "Especialidade",
                          },
                          {
                            key: "obs",
                            label: "Obs.",
                          },
                        ].map(({ key, label, style }) => (
                          <th key={key} className="py-2">
                            <span
                              className={`flex min-w-30 cursor-default text-xs font-normal text-black dark:text-white ${style || ""}`}
                            >
                              {label}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {schedullingsByDate.map((s, i: number) => (
                        <tr
                          key={"scheduling" + i}
                          className="bg-white dark:bg-[#11121d]"
                        >
                          <td className="w-20 rounded-l-xl py-2 pl-5 md:pl-5">
                            <h5 className="font-medium text-black dark:text-white">
                              {s.hour.slice(0, 5)}
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
                              {s.professional.specialty.name}
                            </p>
                          </td>
                          <td className="rounded-r-xl py-2 pr-4">{s.obs}</td>
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
                  selected={date}
                  onSelect={setDate}
                  showOutsideDays
                  style={
                    {
                      "--rdp-accent-color": "#5e5eff",
                      "--rdp-day_button-width": "35px",
                      "--rdp-day_button-height": "30px",
                    } as React.CSSProperties
                  }
                  classNames={{
                    caption_label: "text-sm pl-1.5",
                    month_caption: `${getDefaultClassNames().month_caption} h-8 flex items-center`,
                    weekday: `${getDefaultClassNames().weekday} !p-0`,
                    root: `${getDefaultClassNames().root} shadow-lg text-[10px]`,
                    day: "w-6 h-6 text-[11px] rounded-md hover:bg-white/10",
                    selected: `${getDefaultClassNames().selected} !font-normal !text-[12px]`,
                  }}
                  modifiers={modifiers}
                  modifiersClassNames={{
                    hasRecords:
                      "relative after:content-[''] after:w-1.5 after:h-1.5 after:rounded-full after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[-4] after:bg-[#fdba74]",
                  }}
                />
                <div className="ml-1 mt-1 flex items-center gap-2 text-[11px] text-gray-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-orange-300" />{" "}
                  Dias com agendamentos
                </div>
              </div>
              <div className="mt-5 font-montserrat font-semibold">
                Profissionais
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                  <Search size={13} className="opacity-60" />
                </div>
                <input
                  type="text"
                  id="input-group-1"
                  value={proSearch}
                  onChange={(e) => setProSearch(e.target.value)}
                  className="mt-2 block w-full rounded-full border-gray-300 bg-white/10 p-2.5 ps-10 text-sm text-white placeholder:text-[11px] focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Pesquisar por nome ou especialidade..."
                />
              </div>
              {selectedPros.length > 0 && (
                <div className="mt-3 flex max-w-[23rem] flex-wrap gap-1">
                  {selectedPros.map((p) => (
                    <div
                      key={`sel-${p.id}`}
                      className="flex items-center gap-2 rounded-full bg-white/15 px-3 text-[0.6rem]"
                    >
                      <span>{p.name}</span>
                      <span
                        role="button"
                        onClick={() => {
                          setSelectedPros((prev) =>
                            prev.filter((sp) => sp.id !== p.id),
                          );
                          if (professionalId === p.id)
                            setProfessionalId(undefined);
                        }}
                        aria-label={`Remover ${p.name}`}
                      >
                        <X size={14} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 max-h-60 overflow-y-auto text-sm [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2">
                {filteredProfessionals.map((p) => (
                  <button
                    key={`professional-${p.id}`}
                    onClick={() => {
                      setSelectedPros((prev) =>
                        prev.find((x) => x.id === p.id) ? prev : [...prev, p],
                      );
                      setProfessionalId(p.id);
                    }}
                    className="mb-2 flex w-full items-center gap-3 rounded-lg py-2 pl-1 hover:bg-white/10"
                  >
                    <User2
                      size={38}
                      className="rounded-full border-2 border-[#5e5eff] bg-gray-200 text-gray-500"
                    />
                    <div className="text-left text-[12px]">
                      <div>{p.name}</div>
                      <div className="mt-[-2px] text-left text-[11px] font-extralight opacity-70">
                        {p.specialty.name}
                      </div>
                    </div>
                  </button>
                ))}
                {filteredProfessionals.length === 0 && (
                  <div className="py-6 text-center text-xs text-white/60">
                    Nenhum profissional encontrado
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <RegisterSchedullingModal
          onClose={() => {
            setIsModalOpen(false);
            fetchSchedullingsByDate();
          }}
        />
      )}
    </div>
  );
}

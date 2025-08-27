"use client";
import React, { useMemo, useState, FormEvent, useEffect } from "react";
import { addMinutes, format, isAfter, parse } from "date-fns";
import { Modal } from "../Modal/page";
import SelectFilter from "../Selects/SelectFilter";
import { useSchedulling } from "@/contexts/SchedulingContext";
import DatePicker from "../DatePickerField";
import { Schedulling } from "@/types/api";
import {
  getSchedullingsByDate,
  postAddSchedulling,
} from "@/services/schedulling";
import axios from "axios";

interface RegisterSchedullingModalProps {
  onClose: () => void;
}

export default function RegisterSchedullingModal({
  onClose,
}: RegisterSchedullingModalProps) {
  const { professionals, patients, FetchSchedullingsAllDates } =
    useSchedulling();
  const [loading, setLoading] = useState<boolean>(false);
  const [schedullingsByDate, setSchedullingsByDate] = useState<Schedulling[]>(
    [],
  );
  const [date, setDate] = useState<Date | string | undefined>();
  const [patientId, setPatientId] = useState<number | null>(null);
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [obs, setObs] = useState<string>("");

  const timeSlots = useMemo(() => {
    const start = parse("08:00", "HH:mm", new Date());
    const end = parse("17:30", "HH:mm", new Date());
    const out: string[] = [];
    let t = start;
    while (!isAfter(t, end)) {
      out.push(format(t, "HH:mm"));
      t = addMinutes(t, 30);
    }
    return out;
  }, []);

  const busyHoursSet = useMemo(() => {
    const set = new Set<string>();
    for (const s of schedullingsByDate) {
      try {
        const hhmm = format(parse(s.hour, "HH:mm:ss", new Date()), "HH:mm");
        set.add(hhmm);
      } catch (_) {}
    }
    return set;
  }, [schedullingsByDate]);

  const fetchSchedullingsByDate = async () => {
    if (!date || !professionalId) return;
    try {
      setLoading(true);
      const data = await getSchedullingsByDate(
        format(date, "yyyy-MM-dd"),
        professionalId,
      );
      setSchedullingsByDate(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      setSchedullingsByDate([]);
    } finally {
      setLoading(false);
    }
  };

  const AddSchedulling = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date) return;
    if (!patientId) return;
    if (!professionalId) return;
    if (!selectedHour) return;

    try {
      setLoading(true);
      await postAddSchedulling(
        format(date || "", "yyyy-MM-dd"),
        selectedHour,
        patientId,
        professionalId,
        obs,
      );
      console.log("Paciente editado(a) com sucesso!", "success");
      cleanForm();
      FetchSchedullingsAllDates();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          alert(
            "Este paciente ja possui consulta nesta data com este profissional!",
          );
          return;
        }
        console.error(err.message);
      } else if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Erro ao agendar consulta");
      }
    } finally {
      setLoading(false);
    }

    onClose();
  };

  const cleanForm = () => {
    setPatientId(null);
    setProfessionalId(null);
    setSelectedHour(null);
    setObs("");
  };

  useEffect(() => {
    if (!date) return;
    fetchSchedullingsByDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, professionalId]);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="w-[55vw] p-1">
        <div className="border-b pb-3 text-center text-lg font-medium">
          Nova Consulta
        </div>

        <form onSubmit={AddSchedulling} className="mt-4">
          <div className="grid grid-cols-3 gap-4 border-b pb-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                Data <span className="text-meta-1">*</span>
              </label>
              <DatePicker
                value={date}
                onChange={(d) => setDate(d)}
                className="relative w-full"
                inputClassName="w-full h-[50px] flex items-center gap-2 rounded border-[1.5px] border-stroke bg-transparent px-4 text-left text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                Paciente <span className="text-meta-1">*</span>
              </label>
              <SelectFilter
                items={patients}
                placeholder="Buscar paciente..."
                value={patientId}
                onChange={(item) => setPatientId(item?.id ?? null)}
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                Profissional <span className="text-meta-1">*</span>
              </label>
              <SelectFilter
                items={professionals}
                placeholder="Buscar profissional..."
                value={professionalId}
                onChange={(item) => setProfessionalId(item?.id ?? null)}
              />
            </div>
          </div>

          <div className="mt-3 border-b pb-3">
            {
              <>
                <label className="mb-1 block text-sm font-medium text-black dark:text-white">
                  Horários <span className="text-meta-1">*</span>
                </label>

                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                  {timeSlots.map((hhmm) => {
                    const busy = busyHoursSet.has(hhmm);
                    const selected = selectedHour === hhmm;
                    return (
                      <button
                        type="button"
                        key={hhmm}
                        disabled={busy}
                        onClick={() => setSelectedHour(hhmm)}
                        className={`rounded-md px-2 py-1 text-[12px] transition ${
                          busy
                            ? "cursor-not-allowed bg-gray-200/60 text-gray-500 line-through dark:bg-gray-700/50"
                            : selected
                              ? "bg-primary text-white"
                              : "bg-white/10 text-black hover:bg-primary/10 dark:text-white"
                        }`}
                        title={
                          busy ? "Horário indisponível" : `Selecionar ${hhmm}`
                        }
                      >
                        {hhmm}
                      </button>
                    );
                  })}
                </div>
              </>
            }
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-medium text-black dark:text-white">
              Observação
            </label>
            <textarea
              id="obs"
              value={obs}
              className="flex h-[50px] w-full items-center justify-between rounded border-[1.5px] border-stroke bg-transparent px-3 text-left text-black outline-none transition focus:border-primary disabled:cursor-not-allowed dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setObs(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="hover::bg-opacity-90 mt-10 w-full rounded bg-primary p-2 text-white disabled:cursor-not-allowed disabled:opacity-80"
            disabled={!date || !patientId || !professionalId || !selectedHour}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Modal>
  );
}

import { Professional, Schedulling, Specialty } from "@/types/api";
import { axiosClient as api } from "./api";

export async function getSchedullingsAllDates(): Promise<string[]> {
  const { data } = await api.get("/Schedulling/scheduled-dates");

  return data;
}

export async function getSchedullingsByDate(
  date: string,
  professionalId?: number,
): Promise<Schedulling[]> {
  const { data } = await api.get("/Schedulling/by-date", {
    params: { date, professionalId },
  });

  return data;
}

export async function postAddSchedulling(
  date: string,
  hour: string,
  idPatient: number,
  idProfessional: number,
  obs: string,
) {
  const { data } = await api.post("/Schedulling", {
    date,
    hour,
    idPatient,
    idProfessional,
    obs,
  });
  return data;
}

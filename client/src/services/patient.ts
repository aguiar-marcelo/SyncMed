import { Patient } from "@/types/api";
import { axiosClient as api } from "./api";

export async function getPatientList(
  page = 1,
  limit = 10,
): Promise<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  data: Patient[];
}> {
  const { data } = await api.get("/Patient/paged", {
    params: { page, limit },
  });

  return data;
}

export async function postAddPatient(
  name: string,
  cpf: string,
  birthDate: string,
  contact: string,
  contactSecundary: string,
  email: string,
) {
  const { data } = await api.post("/Patient", {
    name,
    cpf,
    birthDate,
    contact,
    contactSecundary,
    email,
  });
  return data;
}

export async function putEditPatient(
  id: number,
  name: string,
  cpf: string,
  birthDate: string,
  contact: string,
  contactSecundary: string,
  email: string,
) {
  const { data } = await api.put(`/Patient/${id}`, {
    name,
    cpf,
    birthDate,
    contact,
    contactSecundary,
    email,
  });
  return data;
}

export async function deletePatient(id: number) {
  const { data } = await api.delete(`/Patient/${id}`);

  return data;
}

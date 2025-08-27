import { Professional, Specialty } from "@/types/api";
import { axiosClient as api } from "./api";

export async function getProfessionals(): Promise<Professional[]> {
  const { data } = await api.get("/Professional");

  return data;
}

export async function getProfessionalList(
  page = 1,
  limit = 10,
): Promise<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  data: Professional[];
}> {
  const { data } = await api.get("/Professional/paged", {
    params: { page, limit },
  });

  return data;
}

export async function postAddProfessional(
  name: string,
  contact: string,
  contactSecundary: string,
  email: string,
  idSpecialty: number,
) {
  const { data } = await api.post("/Professional", {
    name,
    contact,
    contactSecundary,
    email,
    idSpecialty,
  });
  return data;
}

export async function putEditProfessional(
  id: number,
  name: string,
  contact: string,
  contactSecundary: string,
  email: string,
  idSpecialty: number,
) {
  const { data } = await api.put(`/Professional/${id}`, {
    name,
    contact,
    contactSecundary,
    email,
    idSpecialty,
  });
  return data;
}

export async function deleteProfessional(id: number) {
  const { data } = await api.delete(`/Professional/${id}`);

  return data;
}

export async function getSpecialtys(): Promise<Specialty[]> {
  const { data } = await api.get("/Professional/Specialtys");

  return data;
}

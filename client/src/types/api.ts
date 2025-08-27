export type Patient = {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  contact: string;
  contactSecundary: string;
  email: string;
};

export type Professional = {
  id: number;
  name: string;
  contact: string;
  contactSecundary: string;
  email: string;
  specialty: Specialty;
};

export type Specialty = {
  id: number;
  name: string;
};

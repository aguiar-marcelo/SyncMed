"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Patient, Professional, Specialty } from "@/types/api";
import { getProfessionals, getSpecialtys } from "@/services/professional";
import { getPatients } from "@/services/patient";
import { getSchedullingsAllDates } from "@/services/schedulling";
import { useAuth } from "./AuthContext";

interface SchedullingContextData {
  specialtys: Specialty[];
  professionals: Professional[];
  patients: Patient[];
  schedullingsAllDates: string[];
  FetchSchedullingsAllDates: () => Promise<void>;
}

const SchedullingContext = createContext<SchedullingContextData | undefined>(
  undefined,
);

export const SchedullingProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth();
  const [specialtys, setSpecialtys] = useState<Specialty[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [schedullingsAllDates, setSchedullingsAllDates] = useState<string[]>(
    [],
  );

  const FetchProducts = async () => {
    const response = await getSpecialtys();
    setSpecialtys(response);
  };
  const FetchProfessionals = async () => {
    const response = await getProfessionals();
    setProfessionals(response);
  };
  const FetchPatients = async () => {
    const response = await getPatients();
    setPatients(response);
  };
  const FetchSchedullingsAllDates = async () => {
    const response = await getSchedullingsAllDates();
    setSchedullingsAllDates(response);
  };

  useEffect(() => {
    FetchProducts();
    FetchProfessionals();
    FetchPatients();
    FetchSchedullingsAllDates();
  }, []);

  return (
    <SchedullingContext.Provider
      value={{
        specialtys,
        professionals,
        patients,
        schedullingsAllDates,
        FetchSchedullingsAllDates,
      }}
    >
      {children}
    </SchedullingContext.Provider>
  );
};

export const useSchedulling = () => {
  const context = useContext(SchedullingContext);
  if (!context) {
    throw new Error(
      "useSchedulling must be used within an SchedullingProvider",
    );
  }
  return context;
};

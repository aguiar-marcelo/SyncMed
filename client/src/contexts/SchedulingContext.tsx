"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Specialty } from "@/types/api";
import { getSpecialtys } from "@/services/professional";

interface SchedullingContextData {
  specialtys: Specialty[];
}

const SchedullingContext = createContext<SchedullingContextData | undefined>(
  undefined,
);

export const SchedullingProvider = ({ children }: { children: ReactNode }) => {
  const [specialtys, setSpecialtys] = useState<Specialty[]>([]);

  const FetchProducts = async () => {
    const response = await getSpecialtys();
    setSpecialtys(response);
  };
  useEffect(() => {
    FetchProducts();
  }, []);

  return (
    <SchedullingContext.Provider
      value={{
        specialtys,
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

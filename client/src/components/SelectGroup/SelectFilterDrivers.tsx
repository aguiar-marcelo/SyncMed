import { getDriversSearch } from "@/services/scheduling";
import { debounce } from "lodash";
import { ThreeDot } from "react-loading-indicators";
import InputMask from "react-input-mask";
import React, { useEffect, useState, useCallback } from "react";
import RegisterDriverModal from "../../components/Scheduling/Scheduling/RegisterDriverModal";
import Image from "next/image";

interface SelectFilterDriversProps {
  placeholder: string;
  selectedValue: number | null;
  onValueChange: (
    id: number | null,
    name: string | null,
    cel: string | null,
  ) => void;
}

export default function SelectFilterDrivers({
  placeholder,
  selectedValue,
  onValueChange,
}: SelectFilterDriversProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [driverName, setDriverName] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cpfToRegister, setCpfToRegister] = useState("");
  const [driverPhoto, setDriverPhoto] = useState<string | null>(null);

  const fetchDriver = useCallback(
    debounce(async (cpf: string) => {
      setIsLoading(true);
      try {
        const drivers = await getDriversSearch(cpf);
        if (drivers.length > 0) {
          const driver = drivers[0];
          setDriverName(driver.nome || "");
          setDriverPhoto(driver.foto || null);

          const formattedCel =
            driver.cel
              ?.replace(/\D/g, "")
              .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3") || null;

          onValueChange(driver.id, driver.nome, formattedCel);
          setNotFound(false);
        } else {
          setDriverName(null);
          setDriverPhoto(null);
          onValueChange(null, null, null);
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erro ao buscar motorista:", error);
        setDriverName(null);
        setDriverPhoto(null);
        onValueChange(null, null, null);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [onValueChange],
  );

  useEffect(() => {
    if (inputValue.replace(/\D/g, "").length === 11 && !driverName) {
      fetchDriver(inputValue.replace(/\D/g, ""));
    } else {
      setDriverName(null);
      setNotFound(false);
    }
  }, [inputValue]);

  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <InputMask
        mask="999.999.999-99"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-48 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        placeholder={placeholder}
      />

      <div>
        {isLoading ? (
          <div className="flex justify-center">
            <ThreeDot color="#3C50E0" speedPlus={2} />
          </div>
        ) : driverName ? (
          <div className="flex items-center gap-3">
            {driverPhoto && (
              <Image
                src={driverPhoto}
                alt="Foto do motorista"
                className="h-13 w-10 rounded-xl border object-cover"
              />
            )}

            <p className="font-medium text-black dark:text-white">
              {driverName}
            </p>
          </div>
        ) : notFound ? (
          <div className="flex items-center gap-8">
            <p className="whitespace-nowrap font-medium text-red-600 dark:text-red-400">
              Não Encontrado
            </p>
            <button
              onClick={() => {
                setCpfToRegister(inputValue);
                setIsModalOpen(true);
              }}
              className="whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Cadastrar Motorista
            </button>
          </div>
        ) : null}
      </div>

      {isModalOpen && (
        <RegisterDriverModal
          onClose={() => setIsModalOpen(false)}
          onDriverRegistered={(driver) => {
            setIsModalOpen(false);
            setInputValue(driver.cpf.slice(0, -1));
            setTimeout(() => {
              setInputValue(driver.cpf);
            }, 100);
          }}
          initialCpf={cpfToRegister}
        />
      )}
    </div>
  );
}

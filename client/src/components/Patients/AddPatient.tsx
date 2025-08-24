"use client";
import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import Select from "../SelectGroup/Select";
import { IMaskInput } from "react-imask";
import TitlePage from "../Breadcrumbs/Breadcrumb";
import DatePickerField from "../DatePickerField";

export default function AddPatient() {
  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [dateBirth, setDateBirth] = useState<string>("");
  const [grupo, setGrupo] = useState<number>();

  const AddPatient = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const cleanForm = () => {
    setName("");
    setCpf("");
    setContact("");
    setGrupo(undefined);
  };

  return (
    <div className="grid grid-cols-1 gap-9">
      <div className="flex flex-col gap-5">
        <TitlePage pageName="Novo Paciente" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6 xl:p-6.5">
            <div className="mt-4">
              <form onSubmit={AddPatient}>
                <div className="mb-3 flex flex-col gap-6 lg:flex-row">
                  <div className="w-full lg:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Nome <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={name}
                      onChange={({ target }) =>
                        setName(target.value.toUpperCase())
                      }
                      onBlur={() => setName(name.toUpperCase())}
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      CPF <span className="text-meta-1">*</span>
                    </label>
                    <div className="flex items-center">
                      <IMaskInput
                        mask="000.000.000-00"
                        value={cpf}
                        onAccept={(v: string) => setCpf(v)}
                        placeholder="000.000.000-00"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Data de nascimento <span className="text-meta-1">*</span>
                    </label>
                    <DatePickerField
                      label="Data de nascimento"
                      value={dateBirth}
                      onChange={setDateBirth}
                      className="relative w-full" // relative para posicionar o popover
                      inputClassName="w-full h-[46px] rounded border-[1.5px] border-stroke bg-transparent px-5 text-left text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-3 flex flex-col gap-6 lg:flex-row">
                  <div className="w-full lg:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Contato <span className="text-meta-1">*</span>
                    </label>
                    <IMaskInput
                      mask="(00) 00000-0000"
                      value={contact}
                      onAccept={(v: string) => setContact(v)}
                      placeholder="(00) 00000-0000"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Inscrição estadual <span className="text-meta-1">*</span>
                    </label>
                    <div className="flex items-center">
                      {/* <InputMask
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={ie}
                        onChange={({ target }) => setIe(target.value)}
                        mask="999.999.999.999.999"
                        maskChar=""
                        placeholder="000.000.000.000.000"
                      /> */}
                    </div>
                  </div>
                </div>
                <div className="mb-3 flex justify-end gap-6 lg:flex-row">
                  <button
                    type="submit"
                    className="mt-5 flex w-1/3 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

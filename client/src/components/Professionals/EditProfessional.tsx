"use client";
import { ChevronLeft } from "lucide-react";
import { FormEvent, useState } from "react";
import Select from "../SelectGroup/Select";
import { IMaskInput } from "react-imask";
import { format, parse } from "date-fns";
import DatePicker from "../DatePickerField";
import TitlePage from "../Breadcrumbs/Breadcrumb";

export default function EditProfessional({
  editProfessional,
  goBack,
}: {
  editProfessional: any;
  goBack: () => void;
}) {
  const [name, setName] = useState<string>(editProfessional.name);
  const [specialty, setSpecialty] = useState<number>(
    editProfessional.specialty.id,
  );
  const [email, setEmail] = useState<string>(editProfessional.email);
  const [contact, setContact] = useState<string>(editProfessional.contact);
  const [secundaryContact, setSecundaryContact] = useState<string>(
    editProfessional.secundaryContact,
  );

  const EditProfessional = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div className="mt-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-6 xl:p-6.5">
        <button className="ml-[-10px] pr-2 text-left" onClick={goBack}>
          <ChevronLeft size={30} />
        </button>
        <div className="mt-3">
          <form onSubmit={EditProfessional}>
            <div className="mb-3 flex flex-col gap-6 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Nome <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={name}
                  onChange={({ target }) => setName(target.value.toUpperCase())}
                  onBlur={() => setName(name.toUpperCase())}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Especialidade <span className="text-meta-1">*</span>
                </label>
                <Select
                  placeholder="Selecione"
                  selectedValue={specialty}
                  options={[].map((e) => ({
                    label: e.nome,
                    value: e.id,
                  }))}
                  onValueChange={(value) => setSpecialty(+value)}
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
                  2º Contato
                </label>
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={contact}
                  onAccept={(v: string) => setContact(v)}
                  placeholder="(00) 00000-0000"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Email <span className="text-meta-1">*</span>
                </label>
                <input
                  type="email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={email}
                  onChange={({ target }) =>
                    setEmail(target.value.toLowerCase())
                  }
                  onBlur={() => setName(name.toLowerCase())}
                />
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
  );
}

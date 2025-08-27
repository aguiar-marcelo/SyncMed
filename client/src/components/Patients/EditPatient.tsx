"use client";
import { ChevronLeft } from "lucide-react";
import { FormEvent, useState } from "react";
import { IMaskInput } from "react-imask";
import { format } from "date-fns";
import DatePicker from "../DatePickerField";
import { Patient } from "@/types/api";
import { putEditPatient } from "@/services/patient";

export default function EditPatient({
  editPatient,
  goBack,
}: {
  editPatient: Patient;
  goBack: () => void;
}) {
  const [name, setName] = useState<string>(editPatient.name);
  const [cpf, setCpf] = useState<string>(editPatient.cpf);
  const [birthDate, setBirthDate] = useState<Date | string | undefined>(
    editPatient.birthDate,
  );
  const [contact, setContact] = useState<string>(editPatient.contact);
  const [contactSecundary, setContactSecundary] = useState<string>(
    editPatient.contactSecundary,
  );
  const [email, setEmail] = useState<string>(editPatient.email);

  const EditPatient = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //criar alerta

    try {
      await putEditPatient(
        editPatient.id,
        name.trim().toUpperCase(),
        cpf.replace(/\D/g, ""),
        format(birthDate || "", "yyyy-MM-dd"),
        contact.replace(/\D/g, ""),
        contactSecundary.replace(/\D/g, ""),
        email.trim().toLowerCase(),
      );
      console.log("Paciente editado(a) com sucesso!", "success");
      goBack();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Erro ao adicionar paciente");
      }
    }
  };

  return (
    <div className="mt-5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-6 xl:p-6.5">
        <button className="ml-[-10px] pr-2 text-left" onClick={goBack}>
          <ChevronLeft size={30} />
        </button>
        <div className="mt-3">
          <form onSubmit={EditPatient}>
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
                  Data de nascimento
                  <span className="text-meta-1">*</span>
                </label>
                <DatePicker
                  value={birthDate}
                  onChange={(d) => setBirthDate(d)}
                  className="relative w-full"
                  inputClassName="w-full h-[50px] flex items-center gap-2 rounded border-[1.5px] border-stroke bg-transparent px-4 text-left text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                  value={contactSecundary}
                  onAccept={(v: string) => setContactSecundary(v)}
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

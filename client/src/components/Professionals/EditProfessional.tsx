"use client";
import { ChevronLeft } from "lucide-react";
import { FormEvent, useState } from "react";
import Select from "../Selects/Select";
import { IMaskInput } from "react-imask";
import { Professional } from "@/types/api";
import { useSchedulling } from "@/contexts/SchedulingContext";
import { putEditProfessional } from "@/services/professional";
import { showAlert } from "../Alert/page";
import { validateEmail } from "@/lib/utils";

export default function EditProfessional({
  editProfessional,
  goBack,
}: {
  editProfessional: Professional;
  goBack: () => void;
}) {
  const [name, setName] = useState<string>(editProfessional.name);
  const [specialty, setSpecialty] = useState<number>(
    editProfessional.specialty.id ?? undefined,
  );
  const [contact, setContact] = useState<string>(editProfessional.contact);
  const [contactSecundary, setContactSecundary] = useState<string>(
    editProfessional.contactSecundary || "",
  );
  const [email, setEmail] = useState<string>(editProfessional.email);
  const { specialtys } = useSchedulling();

  const EditProfessional = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      showAlert("Digite o nome!", "warning");
      return;
    }
    if (!contact.trim()) {
      showAlert("Digite o contato principal!", "warning");
      return;
    }
    if (!validateEmail(email)) {
      showAlert("Digite um email valido!", "warning");
      return;
    }
    if (!specialty) {
      showAlert("Selecione uma especialidade!", "warning");
      return;
    }

    try {
      await putEditProfessional(
        editProfessional.id,
        name.trim().toUpperCase(),
        contact.replace(/\D/g, ""),
        contactSecundary.replace(/\D/g, ""),
        email.trim().toLowerCase(),
        specialty,
      );
      showAlert("Profissional editado(a) com sucesso!", "success");
      goBack();
    } catch (error: unknown) {
      showAlert("Erro ao editar profissional!", "error");
      console.error(error);
    }
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
                  options={specialtys.map((e) => ({
                    label: e.name,
                    value: e.id,
                  }))}
                  onValueChange={(value) => {
                    if (!value) return;
                    setSpecialty(+value);
                  }}
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

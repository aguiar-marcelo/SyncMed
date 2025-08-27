"use client";
import { FormEvent, useState } from "react";
import Select from "../Selects/Select";
import { IMaskInput } from "react-imask";
import TitlePage from "../Breadcrumbs/Breadcrumb";
import { useSchedulling } from "@/contexts/SchedulingContext";
import { postAddProfessional } from "@/services/professional";

export default function AddProfessional() {
  const [name, setName] = useState<string>("");
  const [specialty, setSpecialty] = useState<number>();
  const [email, setEmail] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [contactSecundary, setContactSecundary] = useState<string>("");
  const { specialtys } = useSchedulling();

  const AddProfessional = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!specialty) return;

    //criar alerta

    try {
      await postAddProfessional(
        name.trim().toUpperCase(),
        contact.replace(/\D/g, ""),
        contactSecundary.replace(/\D/g, ""),
        email.trim().toLowerCase(),
        specialty,
      );
      console.log("Profissional editado(a) com sucesso!", "success");
      cleanForm();
    } catch (error: any) {
      //criar alerta
      console.error(error.message || "Erro ao adicionar profissional");
    }
  };

  const cleanForm = () => {
    setName("");
    setSpecialty(undefined);
    setEmail("");
    setContact("");
    setContactSecundary("");
  };

  return (
    <div className="grid grid-cols-1 gap-9">
      <div className="flex flex-col gap-5">
        <TitlePage pageName="Novo Profissional" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6 xl:p-6.5">
            <div className="mt-4">
              <form onSubmit={AddProfessional}>
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
                      Especialidade <span className="text-meta-1">*</span>
                    </label>
                    <Select
                      placeholder="Selecione"
                      selectedValue={specialty}
                      options={specialtys.map((e) => ({
                        label: e.name,
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
                        setEmail(target.value.toLocaleLowerCase())
                      }
                      onBlur={() => setName(name.toLocaleLowerCase())}
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
      </div>
    </div>
  );
}

"use client";
import { ChevronLeft } from "lucide-react";
import { FormEvent, useState } from "react";
import Select from "../SelectGroup/Select";
import { IMaskInput } from "react-imask";

export default function EditPatient({
  editPatient,
  goBack,
}: {
  editPatient: any;
  goBack: () => void;
}) {
  const [razSocial, setRazSocial] = useState<string>(editPatient.raz_social);
  const [nomeReduzido, setNomeReduzido] = useState<string>(
    editPatient.nome_reduzido,
  );
  const [cnpj, setCnpj] = useState<string>(editPatient.cnpj);
  const [ie, setIe] = useState<string>(editPatient.ie);
  const [grupo, setGrupo] = useState<number>(editPatient.grupo.id);

  return (
    <div>
      <button className="ml-[-10px] pr-2 text-left" onClick={goBack}>
        <ChevronLeft size={30} />
      </button>
      <div className="mt-4">
        <form onSubmit={() => {}}>
          <div className="mb-3 flex flex-col gap-6 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Razão social <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={razSocial}
                onChange={({ target }) =>
                  setRazSocial(target.value.toUpperCase())
                }
                onBlur={() => setRazSocial(razSocial.toUpperCase())}
              />
            </div>
            <div className="w-full lg:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Nome reduzido <span className="text-meta-1">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={nomeReduzido}
                  onChange={({ target }) =>
                    setNomeReduzido(target.value.toUpperCase())
                  }
                  onBlur={() => setNomeReduzido(nomeReduzido.toUpperCase())}
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Especialidade <span className="text-meta-1">*</span>
              </label>
              <Select
                placeholder="Selecione"
                selectedValue={grupo}
                options={[].map((e) => ({
                  label: "",
                  value: "",
                }))}
                onValueChange={(value) => setGrupo(+value)}
              />
            </div>
          </div>
          <div className="mb-3 flex flex-col gap-6 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                CNPJ <span className="text-meta-1">*</span>
              </label>
              {/* <InputMask
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 uppercase text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={cnpj}
                onChange={({ target }) => setCnpj(target.value)}
                mask="99.999.999/9999-99"
                maskChar=""
                maskPlaceholder=""
                placeholder="00.000.000/0000-00"
              /> */}
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
                  maskPlaceholder=""
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
  );
}

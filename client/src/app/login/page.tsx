import { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import DotGridIcon from "@/components/LoginForm/DotGridIcon";
import { Notebook, Stethoscope, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | SyncMed",
};

export default function Login() {
  return (
    <div className="flex h-dvh w-full">
      <div className="linear-to-bl h-full w-3/5 bg-gradient-to-r from-violet-500 to-primary">
        <DotGridIcon
          color="#ffffff50"
          size="5vw"
          className="absolute left-5 top-5"
        />
        <DotGridIcon
          color="#ffffff50"
          size="7vw"
          className="absolute bottom-3 left-[52%]"
        />
        <div className="ml-[15%] mt-[22%] w-3/5 text-white">
          <span className="font-poppins text-lg font-medium lg:text-[2.7rem]">
            Controle de <br />
            Consultas Clínicas
          </span>
          <div className="mt-5 text-[10px] lg:text-[14px] font-light">
            <div className="mt-5 flex items-center gap-2">
              <Notebook
                size={27}
                strokeWidth={1.5}
                className="rounded-full bg-white/40 p-1"
              />
              Registro de agendamentos
            </div>
            <div className="mt-5 flex items-center gap-2">
              <Stethoscope
                size={27}
                strokeWidth={2}
                className="rounded-full bg-white/40 p-1"
              />
              Cadastro de profissionais da saúde
            </div>
            <div className="mt-5 flex items-center gap-2">
              <User
                size={27}
                strokeWidth={1.5}
                className="rounded-full bg-white/40 p-1"
              />
              Cadastro de pacientes
            </div>
          </div>
        </div>
      </div>
      <LoginForm />
    </div>
  );
}

"use client";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { OrbitProgress } from "react-loading-indicators";
import { ButtonLoading } from "../ButtonLoading/Page";
import { Eye, EyeClosed, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, error } = useAuth();

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    setLoading(true);
    await signIn(email, password).then(() => setLoading(false));
  }

  return (
    <div className="h-full w-2/5 bg-white p-8">
      <div className="">
        <div>
          <Image
            src="/images/logo-roxo.png"
            alt="Logo konex"
            width="500"
            height="500"
            className="w-35"
          />
        </div>
        <form onSubmit={login} className="mt-[18%]">
          <span className="font-montserrat text-lg font-semibold text-black-2 lg:text-[1.7rem]">
            Login
          </span>
          <div className="relative mt-6 text-left">
            <label
              htmlFor="user"
              className="font- pointer-events-none text-sm text-black-2 opacity-70"
            >
              Usuário
            </label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 p-2 px-3 text-black"
              name="email"
              type="text"
              required
            />
          </div>
          <div className="relative mt-3 text-left">
            <label
              htmlFor="pass"
              className="font- pointer-events-none text-sm text-black-2 opacity-70"
            >
              Senha
            </label>
            <input
              className="w-full rounded-md border border-gray-300 p-2 px-3 text-black"
              name="password"
              type={showPassword ? "text" : "password"}
              required
            />
            <span
              className="absolute right-4 top-9 cursor-pointer text-[#962ef7]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size="20" /> : <Eye size="20" />}
            </span>

            {error && (
              <div className="mb-[-1rem] mt-5 border border-red bg-red-100 p-1 text-center text-sm text-red">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "mt-10 flex w-full items-center justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90",
                loading && "opacity-90",
              )}
            >
              {loading ? (
                <OrbitProgress
                  style={{
                    fontSize: 5,
                    display: "flex",
                    justifyItems: "center",
                  }}
                  color="#fff"
                  dense
                  speedPlus={1}
                />
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

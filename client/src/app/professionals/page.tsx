import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Professionals from "@/components/Professionals/Professionals";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profissionais | SyncMed",
  description: "",
};

export default async function ProfessionalsPage() {
  return (
    <>
      <DefaultLayout>
        <Professionals />
      </DefaultLayout>
    </>
  );
}

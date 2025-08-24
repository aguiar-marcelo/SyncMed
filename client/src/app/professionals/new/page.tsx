import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddProfessional from "@/components/Professionals/AddProfessional";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profissionais | SyncMed",
  description: "",
};

export default async function ProfessionalAddPage() {
  return (
    <>
      <DefaultLayout>
        <AddProfessional />
      </DefaultLayout>
    </>
  );
}

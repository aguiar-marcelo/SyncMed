import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Patients from "@/components/Patients/Patients";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pacientes | SyncMed",
  description: "",
};

export default async function PatientsPage() {
  return (
    <>
      <DefaultLayout>
        <Patients />
      </DefaultLayout>
    </>
  );
}

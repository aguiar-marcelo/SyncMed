import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddPatient from "@/components/Patients/AddPatient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paciente | SyncMed",
  description: "",
};

export default async function PatientEditPage() {
  return (
    <>
      <DefaultLayout>
        <AddPatient />
      </DefaultLayout>
    </>
  );
}

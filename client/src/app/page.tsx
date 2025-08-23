import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Schedule from "@/components/Schedule";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda | SyncMed",
  description: "",
};

export default async function Home() {
  return (
    <>
      <DefaultLayout>
        <Schedule />
      </DefaultLayout>
    </>
  );
}

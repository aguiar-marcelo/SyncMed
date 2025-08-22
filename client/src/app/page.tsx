import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | SyncMed",
  description: "",
};

export default async function Home() {
  return (
    <>
      <DefaultLayout>
        <div></div>
      </DefaultLayout>
    </>
  );
}

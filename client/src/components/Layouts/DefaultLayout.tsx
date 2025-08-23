"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex min-h-screen bg-white dark:bg-boxdark-2 dark:text-bodydark ">
        <div className="relative flex flex-1 flex-col lg:ml-15">
          {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:px-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

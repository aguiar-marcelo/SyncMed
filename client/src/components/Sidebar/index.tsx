"use client";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import useLocalStorage from "@/hooks/useLocalStorage";
import ClickOutside from "@/components/ClickOutside";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    menuItems: [
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-notebook-icon lucide-notebook"
          >
            <path d="M2 6h4" />
            <path d="M2 10h4" />
            <path d="M2 14h4" />
            <path d="M2 18h4" />
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <path d="M16 2v20" />
          </svg>
        ),
        label: "Agenda",
        route: "/",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-user-icon lucide-user"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ),
        label: "Pacientes",
        route: "/patients",
      },
      {
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-stethoscope-icon lucide-stethoscope"
          >
            <path d="M11 2v2" />
            <path d="M5 2v2" />
            <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
            <path d="M8 15a6 6 0 0 0 12 0v-3" />
            <circle cx="20" cy="10" r="2" />
          </svg>
        ),
        label: "Profissionais",
        route: "/professionals",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [sidebarHover, setSidebarHover] = useState<boolean>(false);

  const isExpanded = sidebarOpen || sidebarHover;

  const [showExpandedLogo, setShowExpandedLogo] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;

    if (isExpanded) {
      t = setTimeout(() => setShowExpandedLogo(true), 100); 
    } else {
      setShowExpandedLogo(false);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [isExpanded]);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className={`text-shadow-stone-800 fixed left-0 top-0 z-99 flex h-screen flex-col overflow-hidden rounded-r-2xl bg-[#fafafa] text-black shadow-6 shadow-slate-200 duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarHover ? "w-45" : "w-15"} ${sidebarOpen ? "w-65" : ""} `}
      >
        <div className="flex h-17 items-center justify-center py-1 pt-2">
          <Link href="/">
            <div
              className="relative h-10 overflow-hidden transition-[width] duration-300 ease-in-out"
              style={{ width: isExpanded ? 107 : 40 }}
            >
              <Image
                src="/images/logo-roxo.png"
                alt="Logo roxo"
                width={107}
                height={22}
                priority
                className={`absolute left-0 top-0 h-[35px] w-auto transition-opacity duration-300 ease-in-out ${
                  showExpandedLogo ? "opacity-100" : "opacity-0"
                }`}
              />
              <Image
                src="/images/logo-roxo-simples.png"
                alt="Logo roxo compacto"
                width={60}
                height={42}
                priority
                className={`absolute left-0 top-0 h-[35px] w-auto transition-opacity duration-300 ease-in-out ${
                  showExpandedLogo ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        <div className="no-scrollbar flex flex-col duration-200 ease-linear">
          <nav className="mt-5 py-4">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                      sidebarHover={sidebarHover}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 flex w-full items-center justify-center overflow-hidden border-strokedark px-4 py-4">
          {/* <Image
            width={sidebarOpen || sidebarHover ? 107 : 40}
            height={sidebarOpen || sidebarHover ? 22 : 22}
            src={"/img"}
            alt="Logo"
            priority
          /> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;

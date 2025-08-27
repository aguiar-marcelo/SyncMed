import React, { useCallback, useEffect } from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";

export interface NavItem {
  route: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

type SidebarItemProps = {
  item: NavItem;
  pageName: string;
  setPageName: (value: string) => void;
  sidebarHover: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  pageName,
  setPageName,
  sidebarHover,
}) => {
  const pathname = usePathname();

  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const isActive = (node: NavItem): boolean => {
    if (node.route.split("/")[1] === pathname.split("/")[1]) return true;
    if (node.children && node.children.length > 0) {
      return node.children.some((child) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  const resetPageName = useCallback(() => {
    setPageName("");
  }, [setPageName]);

  useEffect(() => {
    resetPageName();
  }, [sidebarHover, resetPageName]);

  return (
    <li>
      <Link
        href={item.route}
        onClick={handleClick}
        className={`${isItemActive ? "!font-semibold text-primary" : ""} relative flex h-12 items-center gap-3 rounded-sm text-sm font-light text-bodydark2 transition duration-300 ease-in-out hover:text-primary ${
          sidebarHover ? "px-5" : "justify-left flex pl-5"
        }`}
      >
        <span>{item.icon}</span>
        {isItemActive && (
          <span className="absolute left-[-7] h-[100%] rounded-xl border-6 border-primary bg-primary"></span>
        )}
        {sidebarHover && (
          <>
            {item.label}
            {item.children && (
              <svg
                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                  pageName === item.label.toLowerCase() && "rotate-180"
                }`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                  fill=""
                />
              </svg>
            )}
          </>
        )}
      </Link>

      {item.children && (
        <div
          className={`translate transform overflow-hidden ${
            pageName !== item.label.toLowerCase() && "hidden"
          }`}
        >
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;

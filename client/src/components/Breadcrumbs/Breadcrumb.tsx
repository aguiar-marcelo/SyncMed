import { CirclePlus } from "lucide-react";

interface TitlePageProps {
  pageName: string;
  children?: React.ReactNode;
}
const TitlePage = ({ pageName, children }: TitlePageProps) => {
  return (
    //class="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent"
    <div className="sticky top-5 z-20 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-start  backdrop-blur flex-none transition-colors duration-500 lg:z-50 bg-white/95 supports-backdrop-blur:bg-white/10 dark:bg-transparent">
      <h2 className="font-inter text-title-md font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      {children}
    </div>
  );
};

export default TitlePage;

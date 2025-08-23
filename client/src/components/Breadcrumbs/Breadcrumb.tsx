import { CirclePlus } from "lucide-react";

interface TitlePageProps {
  pageName: string;
  children?: React.ReactNode;
}
const TitlePage = ({ pageName, children }: TitlePageProps) => {
  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-start">
      <h2 className="text-title-md font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      {children}
    </div>
  );
};

export default TitlePage;

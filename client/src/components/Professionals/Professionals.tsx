"use client";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Pencil,
  Plus,
  Stethoscope,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ThreeDot } from "react-loading-indicators";
import EditProfessional from "./EditProfessional";
import TitlePage from "../Breadcrumbs/Breadcrumb";
import { formatContact } from "@/lib/utils";
import Select from "../Selects/Select";
import { Professional } from "@/types/api";
import {
  deleteProfessional,
  getProfessionalList,
} from "@/services/professional";
import { Modal } from "../Modal/page";
import { useSchedulling } from "@/contexts/SchedulingContext";

export default function Professionals() {
  const { specialtys } = useSchedulling();
  const [loading, setLoading] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [editProfessional, setEditProfessional] = useState<
    Professional | undefined
  >();
  const [search, setSearch] = useState<string>("");

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [professionalToDelete, setProfessionalToDelete] =
    useState<Professional | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const FetchProfessionals = async (page: number = 1) => {
    try {
      setLoading(true);
      const results = await getProfessionalList(page, 10);
      setProfessionals(results.data);
      setCurrentPage(results.currentPage);
      setTotalPages(results.totalPages);
    } catch (err) {
      // criar alert
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  const FetchDeleteProfessional = async (id: number) => {
    try {
      await deleteProfessional(id);
      await FetchProfessionals();
    } catch (error) {
      console.error(error);
      // criar alert
    }
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const sortedProfessionals = [...professionals].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue = getNestedValue(a, sortColumn);
    let bValue = getNestedValue(b, sortColumn);

    if (aValue === null || aValue === undefined) aValue = "";
    if (bValue === null || bValue === undefined) bValue = "";

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    FetchProfessionals(currentPage);
  }, [currentPage]);

  const openConfirmDelete = (professional: Professional) => {
    setProfessionalToDelete(professional);
    setConfirmModalOpen(true);
  };

  const closeConfirmDelete = () => {
    if (deleting) return;
    setConfirmModalOpen(false);
    setProfessionalToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!professionalToDelete) return;
    try {
      setDeleting(true);
      await FetchDeleteProfessional((professionalToDelete as any).id as number);
      setConfirmModalOpen(false);
      setProfessionalToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-9">
      <div className="flex flex-col">
        <TitlePage pageName="Profissionais" />
        <div className="text-black dark:text-white">
          <div className="flex items-start justify-between gap-5">
            <div className="w-full pb-3 dark:bg-[#0b0b12]">
              {!editProfessional ? (
                <>
                  <div className="mb-4.5 flex justify-between gap-6 border-b pb-4 md:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        &nbsp;
                      </label>
                      <input
                        type="text"
                        placeholder="Pesquisar..."
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    <Link href="/professionals/new">
                      <button className="mt-8 flex h-12.5 items-center justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        <Plus />
                      </button>
                    </Link>
                  </div>

                  {loading ? (
                    <div className="my-20 flex justify-center">
                      <ThreeDot color="#3C50E0" speedPlus={2} />
                    </div>
                  ) : (
                    <>
                      <table className="w-full table-auto text-sm">
                        <thead>
                          <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            {[
                              { key: "name", label: "Nome" },
                              { key: "specialty.id", label: "Especialidade" },
                              { key: "contact", label: "Contato" },
                              {
                                key: "secundaryContact",
                                label: "Contato Secundário",
                              },
                              { key: "email", label: "Email" },
                            ].map(({ key, label }) => (
                              <th
                                key={key}
                                className="cursor-pointer px-5 py-3"
                                onClick={() => handleSort(key)}
                              >
                                <span className="flex items-center text-black dark:text-white">
                                  {label}
                                  {sortColumn === key &&
                                    (sortDirection === "asc" ? (
                                      <ChevronUp size={16} />
                                    ) : (
                                      <ChevronDown size={16} />
                                    ))}
                                </span>
                              </th>
                            ))}
                            <th className="w-[40px] py-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedProfessionals
                            .filter((u) =>
                              Object.values(u)
                                .join(" ")
                                .toLowerCase()
                                .includes(search.toLowerCase()),
                            )
                            .map((professional, i) => (
                              <tr
                                key={"professional" + i}
                                className="border-b border-gray-200 odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                              >
                                <td className="px-5 py-3">
                                  {professional.name}
                                </td>
                                <td className="px-5 py-3">
                                  <p className="flex items-center gap-1 font-semibold text-[#5e5eff]">
                                    <Stethoscope size={16} />
                                    {specialtys.find(
                                      (s) => s.id == professional.specialty.id,
                                    )?.name || "-"}
                                  </p>
                                </td>
                                <td className="px-5 py-3">
                                  {formatContact(professional.contact)}
                                </td>
                                <td className="px-5 py-3">
                                  {professional.contactSecundary
                                    ? formatContact(
                                        professional.contactSecundary,
                                      )
                                    : "-"}
                                </td>
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-2">
                                    <span>{professional.email}</span>
                                    <button
                                      type="button"
                                      className="hover:text-[#5e5eff]"
                                      onClick={() =>
                                        navigator.clipboard.writeText(
                                          professional.email,
                                        )
                                      }
                                    >
                                      <Copy size={14} />
                                    </button>
                                  </div>
                                </td>
                                <td className="flex gap-2 px-5 py-3">
                                  <button
                                    className="p-1 hover:text-[#5e5eff]"
                                    onClick={() =>
                                      setEditProfessional(professional)
                                    }
                                    aria-label={`Editar profissional ${professional.name}`}
                                  >
                                    <Pencil size={18} />
                                  </button>
                                  <button
                                    className="p-1 hover:text-red-600"
                                    onClick={() =>
                                      openConfirmDelete(professional)
                                    }
                                    aria-label={`Excluir profissional ${professional.name}`}
                                  >
                                    <Trash size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <div className="mt-6 flex items-center justify-center gap-4">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="rounded bg-gray-200 p-2 text-black hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-meta-4 dark:text-white"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm text-black dark:text-white">
                          Página {currentPage} de {totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="rounded bg-gray-200 p-2 text-black hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-meta-4 dark:text-white"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <EditProfessional
                  editProfessional={editProfessional}
                  goBack={() => {
                    setEditProfessional(undefined);
                    FetchProfessionals();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={confirmModalOpen} onClose={closeConfirmDelete}>
        <div className="p-3">
          <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
            Confirmar exclusão
          </h3>
          <p className="mb-6 text-sm text-gray-700 dark:text-gray-300">
            Tem certeza que deseja excluir o(a) profissional{" "}
            <span className="font-medium text-black dark:text-white">
              {professionalToDelete?.name}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeConfirmDelete}
              disabled={deleting}
              className="rounded border border-gray-300 px-4 py-2 text-sm text-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

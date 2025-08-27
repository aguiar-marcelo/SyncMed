import React, { useEffect, useState, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  closeOnClickOutside?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  closeOnClickOutside = true,
  onClose,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", close);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", close);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, closeOnClickOutside]); // ✅ Agora inclui closeOnClickOutside

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="relative rounded-lg border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div>{children}</div>
      </div>
    </div>
  );
};

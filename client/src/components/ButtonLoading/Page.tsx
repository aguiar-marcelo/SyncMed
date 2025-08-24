"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { OrbitProgress } from "react-loading-indicators";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function ButtonLoading({
  onClick,
  className,
  children,
  disabled = false,
}: ButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={cn(
        "flex w-full items-center justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90",
        disabled && !loading && "opacity-50",
        className,
      )}
      onClick={handleClick}
      disabled={loading || disabled}
    >
      {loading ? (
        <OrbitProgress
          style={{
            fontSize: 5,
            display: "flex",
            justifyItems: "center",
          }}
          color="#fff"
          dense
          speedPlus={1}
        />
      ) : (
        children
      )}
    </button>
  );
}

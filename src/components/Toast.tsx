import React from "react";

export type ToastState = {
  type: "success" | "error" | "info";
  message: string;
} | null;

export default function Toast({
  type = "info",
  message,
  onClose,
}: {
  type?: "success" | "error" | "info";
  message?: string;
  onClose: () => void;
}) {
  if (!message) return null;

  const base =
    "fixed top-20 right-4 z-[1000] max-w-sm rounded-xl shadow-lg px-4 py-3 text-sm border";
  const styles =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-900"
      : type === "error"
        ? "bg-red-50 border-red-200 text-red-900"
        : "bg-slate-50 border-slate-200 text-slate-900";

  return (
    <div className={`${base} ${styles}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">{message}</div>
        <button
          className="text-slate-600 hover:text-slate-900"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

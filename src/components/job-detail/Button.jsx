import { Heart } from "lucide-react";

export function PrimaryButton({ text = "Ứng tuyển ngay", onClick , className}) {
  return (
    <button
      onClick={onClick}
      className={` ${className} inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-5 py-3 font-semibold hover:bg-indigo-700 transition shadow-sm`}
    >
      {text}
    </button>
  );
}

export function SecondaryButton({ text, onClick, icon, className }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center ${className} justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium hover:bg-slate-50 transition`}
    >
      {text}
      {icon}
    </button>
  );
}

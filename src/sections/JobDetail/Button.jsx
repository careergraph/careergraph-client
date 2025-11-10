export function PrimaryButton({
  text = "Ứng tuyển ngay",
  onClick,
  className,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className ?? ""} inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
        disabled
          ? "cursor-not-allowed bg-slate-300 text-white"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
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

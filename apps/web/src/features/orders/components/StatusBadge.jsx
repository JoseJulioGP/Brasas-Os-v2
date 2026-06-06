import { FaClock, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

const ESTADOS = {
  pendiente:  { color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/20", label: "Pendiente"  },
  preparando: { color: "text-blue-400",   bg: "bg-blue-500/15",   border: "border-blue-500/20",   label: "En Proceso" },
  entregado:  { color: "text-green-400",  bg: "bg-green-500/15",  border: "border-green-500/20",  label: "Completado" },
  completado: { color: "text-green-400",  bg: "bg-green-500/15",  border: "border-green-500/20",  label: "Completado" },
  cancelado:  { color: "text-red-400",    bg: "bg-red-500/15",    border: "border-red-500/20",    label: "Cancelado"  },
};

export const StatusBadge = ({ estado }) => {
  const key  = (estado || "").toLowerCase();
  const info = ESTADOS[key] || ESTADOS.pendiente;
  const Icon = (key === "entregado" || key === "completado") ? FaCheck : key === "cancelado" ? FaTimes : key === "preparando" ? FaSpinner : FaClock;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${info.bg} ${info.color} font-body border ${info.border}`}>
      <Icon className="text-[10px]" />
      {info.label}
    </span>
  );
};

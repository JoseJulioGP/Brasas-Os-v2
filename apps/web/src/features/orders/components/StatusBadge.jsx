import { FaClock, FaCheck, FaTimes } from "react-icons/fa";

const ESTADOS = {
<<<<<<< HEAD
  PENDIENTE: { color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/20", label: "Pendiente" },
  EN_PROCESO: { color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/20", label: "En Proceso" },
  COMPLETADO: { color: "text-green-400", bg: "bg-green-500/15", border: "border-green-500/20", label: "Completado" },
  CANCELADO: { color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/20", label: "Cancelado" },
};

export const StatusBadge = ({ estado }) => {
  const info = ESTADOS[estado] || ESTADOS.PENDIENTE;
  const Icon = estado === "COMPLETADO" ? FaCheck : estado === "CANCELADO" ? FaTimes : FaClock;
=======
  pendiente:  { color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/20", label: "Pendiente" },
  preparando: { color: "text-blue-400",   bg: "bg-blue-500/15",   border: "border-blue-500/20",   label: "En Proceso" },
  entregado:  { color: "text-green-400",  bg: "bg-green-500/15",  border: "border-green-500/20",  label: "Completado" },
  cancelado:  { color: "text-red-400",    bg: "bg-red-500/15",    border: "border-red-500/20",    label: "Cancelado"  },
};

export const StatusBadge = ({ estado }) => {
  const info = ESTADOS[estado] || ESTADOS.pendiente;
  const Icon = estado === "entregado" ? FaCheck : estado === "cancelado" ? FaTimes : FaClock;
>>>>>>> 47bba80be1627d21fba2a8195396ca4b89bcaebf
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${info.bg} ${info.color} font-body border ${info.border}`}>
      <Icon className="text-[10px]" />
      {info.label}
    </span>
  );
};

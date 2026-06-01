const ACCION_STYLES = {
  CREAR:     { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20" },
  EDITAR:    { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/20"   },
  ELIMINAR:  { bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/20"     },
  COMPLETAR: { bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/20"    },
  CANCELAR:  { bg: "bg-red-500/10",     text: "text-red-300",     border: "border-red-500/15"     },
  LOGIN:     { bg: "bg-white/[0.06]",   text: "text-white/50",    border: "border-white/[0.08]"   },
  LOGOUT:    { bg: "bg-white/[0.06]",   text: "text-white/50",    border: "border-white/[0.08]"   },
};

const DEFAULT = { bg: "bg-white/[0.06]", text: "text-white/40", border: "border-white/[0.06]" };

export const ActionBadge = ({ tipo }) => {
  const s = ACCION_STYLES[tipo] || DEFAULT;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body border ${s.bg} ${s.text} ${s.border}`}>
      {tipo || "—"}
    </span>
  );
};

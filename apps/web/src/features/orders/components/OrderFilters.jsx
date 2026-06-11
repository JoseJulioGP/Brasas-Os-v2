import { useState, useRef, useEffect } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";

const ESTADOS = [
  { value: "",           label: "Todos los estados" },
  { value: "pendiente",  label: "Pendiente"          },
  { value: "preparando", label: "En Proceso"          },
  { value: "completado", label: "Completado"          },
  { value: "cancelado",  label: "Cancelado"           },
];

const EstadoSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = ESTADOS.find(e => e.value === value) || ESTADOS[0];

  return (
    <div ref={ref} className="relative w-full md:w-52">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 flex items-center justify-between gap-2 hover:border-white/[0.12] focus:outline-none transition-colors font-body">
        <span>{selected.label}</span>
        <FaChevronDown className={`text-white/30 text-xs transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#111] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
          {ESTADOS.map(({ value: v, label }) => (
            <button key={v} type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(v); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors font-body
                ${value === v
                  ? "bg-orange-500/10 text-orange-400"
                  : "text-white/60 hover:bg-white/[0.05] hover:text-white/90"
                }`}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const OrderFilters = ({ search, onSearchChange, estado, onEstadoChange }) => (
  <div className="relative z-20 mb-6 animate-fade-in-up opacity-0 stagger-1">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
        <input type="text" placeholder="Buscar por ID..." value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors font-body" />
      </div>
      <EstadoSelect value={estado} onChange={onEstadoChange} />
    </div>
  </div>
);

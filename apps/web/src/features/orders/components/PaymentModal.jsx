import { useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaMoneyBillWave, FaExchangeAlt, FaCheckCircle } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

const METODOS = [
  {
    key:   "efectivo",
    label: "Efectivo",
    icon:  FaMoneyBillWave,
    color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    desc:  "El cliente paga en efectivo",
  },
  {
    key:   "transferencia",
    label: "Transferencia",
    icon:  MdPayment,
    color: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    desc:  "Pago por transferencia bancaria",
  },
  {
    key:   "ambos",
    label: "Ambos",
    icon:  FaExchangeAlt,
    color: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    desc:  "Parte en efectivo, parte en transferencia",
  },
];

export const PaymentModal = ({ isOpen, onClose, onConfirm, total = 0 }) => {
  const [metodo,       setMetodo]       = useState("");
  const [efectivo,     setEfectivo]     = useState("");
  const [transferencia,setTransferencia]= useState("");

  if (!isOpen) return null;

  const fmt = (n) => Number(n || 0).toLocaleString("es-CO");

  const totalAmbos  = Number(efectivo || 0) + Number(transferencia || 0);
  const diferencia  = total - totalAmbos;
  const ambosOk     = metodo === "ambos"
    ? totalAmbos > 0 && Math.abs(diferencia) < 1
    : true;

  const canConfirm = metodo && (metodo !== "ambos" || ambosOk);

  const handleConfirm = () => {
    const pago = metodo === "ambos"
      ? { metodo: "ambos", efectivo: Number(efectivo), transferencia: Number(transferencia) }
      : { metodo };
    onConfirm(pago);
    // Reset
    setMetodo(""); setEfectivo(""); setTransferencia("");
  };

  const handleClose = () => {
    setMetodo(""); setEfectivo(""); setTransferencia("");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-[#0f0f0e] border border-white/[0.08] rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60 animate-fade-in-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-bold text-[#f5f0eb]" style={{ fontFamily: "Georgia, serif" }}>
              Método de pago
            </h2>
            <p className="text-xs text-white/30 mt-0.5">
              Total: <span className="text-orange-400 font-mono font-bold">${fmt(total)}</span>
            </p>
          </div>
          <button onClick={handleClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/[0.06] transition-all">
            <FaTimes className="text-sm" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">

          {/* Opciones */}
          <div className="space-y-2">
            {METODOS.map(({ key, label, icon: Icon, color, desc }) => (
              <button key={key} type="button" onClick={() => setMetodo(key)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-left
                  ${metodo === key ? color : "border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.12] hover:text-white/60"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  metodo === key ? "bg-current/10" : "bg-white/[0.04]"
                }`}>
                  <Icon className="text-base" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-[11px] opacity-60">{desc}</p>
                </div>
                {metodo === key && (
                  <FaCheckCircle className="text-sm shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Split payment inputs */}
          {metodo === "ambos" && (
            <div className="pt-2 space-y-3 border-t border-white/[0.06]">
              <p className="text-xs text-white/35 uppercase tracking-wider font-medium">Detalle del pago</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-emerald-400/70 font-medium uppercase tracking-wider">
                    Efectivo
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/30">$</span>
                    <input
                      type="number" min="0" step="100"
                      value={efectivo}
                      onChange={e => setEfectivo(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white/[0.04] border border-emerald-500/20 rounded-xl pl-7 pr-3 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 outline-none focus:border-emerald-500/40 font-mono transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-blue-400/70 font-medium uppercase tracking-wider">
                    Transferencia
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/30">$</span>
                    <input
                      type="number" min="0" step="100"
                      value={transferencia}
                      onChange={e => setTransferencia(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white/[0.04] border border-blue-500/20 rounded-xl pl-7 pr-3 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 outline-none focus:border-blue-500/40 font-mono transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Verificación */}
              <div className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                Math.abs(diferencia) < 1
                  ? "bg-emerald-500/8 border border-emerald-500/20 text-emerald-400"
                  : "bg-white/[0.03] border border-white/[0.06] text-white/30"
              }`}>
                <span>Total ingresado</span>
                <span className="font-bold">${fmt(totalAmbos)}</span>
              </div>

              {totalAmbos > 0 && Math.abs(diferencia) >= 1 && (
                <p className={`text-[11px] text-center font-mono ${diferencia > 0 ? "text-amber-400" : "text-red-400"}`}>
                  {diferencia > 0
                    ? `Faltan $${fmt(diferencia)}`
                    : `Excede $${fmt(-diferencia)}`}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all">
              Cancelar
            </button>
            <button type="button" onClick={handleConfirm} disabled={!canConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-900/30">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

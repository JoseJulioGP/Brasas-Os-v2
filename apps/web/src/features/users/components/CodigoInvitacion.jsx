import { useEffect, useState } from "react";
import { FaKey, FaSync, FaCopy, FaCheck } from "react-icons/fa";
import { usersService } from "../services/usersService";

export const CodigoInvitacion = () => {
  const [codigo, setCodigo]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [error, setError]         = useState(null);

  const cargar = async () => {
    try {
      const data = await usersService.getCodigoInvitacion();
      setCodigo(data.codigo_invitacion || null);
    } catch {
      setError("No se pudo cargar el código");
    }
  };

  useEffect(() => { cargar(); }, []);

  const generar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersService.generarCodigoInvitacion();
      setCodigo(data.codigo_invitacion);
    } catch {
      setError("Error al generar el código");
    } finally {
      setLoading(false);
    }
  };

  const copiar = () => {
    if (!codigo) return;
    navigator.clipboard.writeText(codigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <FaKey className="text-orange-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#f5f0eb] font-body">Código de empleados</h3>
          <p className="text-xs text-white/30 font-body">Comparte este código para que tus empleados se registren</p>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 font-body mb-3">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-center">
          {codigo ? (
            <span className="text-2xl font-number font-bold text-orange-400 tracking-[0.4em]">{codigo}</span>
          ) : (
            <span className="text-sm text-white/30 font-body">Sin código generado</span>
          )}
        </div>

        {codigo && (
          <button
            onClick={copiar}
            title="Copiar código"
            className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            {copied ? <FaCheck className="text-green-400 text-sm" /> : <FaCopy className="text-sm" />}
          </button>
        )}

        <button
          onClick={generar}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all font-body"
        >
          <FaSync className={`text-xs ${loading ? "animate-spin" : ""}`} />
          {codigo ? "Regenerar" : "Generar"}
        </button>
      </div>

      {codigo && (
        <p className="text-[11px] text-white/20 font-body mt-3">
          Al regenerar el código, el anterior queda inválido para nuevos registros.
        </p>
      )}
    </div>
  );
};

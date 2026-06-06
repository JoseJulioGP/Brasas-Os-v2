import { useEffect, useState } from "react";
import { FaUsers, FaUser, FaEnvelope, FaCircle } from "react-icons/fa";
import { usersService } from "../services/usersService";
import { CodigoInvitacion } from "./CodigoInvitacion";

const fmt = (fecha) =>
  fecha
    ? new Date(fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

export const MisEmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [isLoading, setIsLoading]  = useState(false);
  const [error, setError]          = useState(null);

  const cargar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usersService.getMisEmpleados();
      setEmpleados(Array.isArray(data) ? data : []);
    } catch {
      setError("No se pudieron cargar los empleados");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in-up opacity-0">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <FaUsers className="text-xl text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#f5f0eb]">Mi Equipo</h1>
            <p className="text-sm text-white/40 font-body">Empleados registrados en tu local</p>
          </div>
        </div>

        {/* Código de invitación */}
        <div className="mb-8 animate-fade-in-up opacity-0 stagger-1">
          <CodigoInvitacion />
        </div>

        {/* Lista de empleados */}
        <div className="animate-fade-in-up opacity-0 stagger-2">
          <h2 className="text-sm font-medium text-white/40 font-body uppercase tracking-wider mb-3">
            Empleados ({empleados.length})
          </h2>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-body mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="relative">
                <div className="w-10 h-10 border-2 border-orange-500/20 rounded-full" />
                <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" />
              </div>
            </div>
          ) : empleados.length === 0 ? (
            <div className="glass rounded-2xl p-14 text-center">
              <FaUsers className="text-5xl text-white/10 mx-auto mb-4" />
              <p className="text-white/40 font-body text-lg">Aún no tienes empleados registrados</p>
              <p className="text-white/20 text-sm font-body mt-1">
                Comparte el código de invitación para que se registren
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {empleados.map((emp) => (
                <div key={emp.id} className="glass rounded-2xl p-4 glass-hover">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                      <FaUser className="text-white/30 text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#f5f0eb] font-body truncate">{emp.nombre}</p>
                        <FaCircle className={`text-[6px] shrink-0 ${emp.activo ? "text-green-400" : "text-red-400"}`} />
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <FaEnvelope className="text-[10px] text-white/20" />
                        <p className="text-xs text-white/40 font-body truncate">{emp.email}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-white/30 font-body">Desde</p>
                      <p className="text-xs text-white/50 font-number">{fmt(emp.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

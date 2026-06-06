import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaFire, FaUserTie, FaStore, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";


/* ---------- Field ---------- */
const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium tracking-wider uppercase text-white/40">
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-white/25">{hint}</p>}
  </div>
);

/* ---------- Input ---------- */
const Input = ({ icon: Icon, type = "text", ...props }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none" />}
    <input
      type={type}
      {...props}
      className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl py-3 text-sm text-[#f5f0eb] placeholder:text-white/20 outline-none focus:border-orange-500/40 focus:bg-orange-500/[0.03] focus:ring-1 focus:ring-orange-500/20 transition-all duration-200"
      style={{ paddingLeft: Icon ? "2.75rem" : "1rem", paddingRight: "1rem" }}
    />
  </div>
);

/* ---------- Password ---------- */
const PasswordInput = ({ label, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <Field label={label}>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...props}
          className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl pl-4 pr-12 py-3 text-sm text-[#f5f0eb] placeholder:text-white/20 outline-none focus:border-orange-500/40 focus:bg-orange-500/[0.03] focus:ring-1 focus:ring-orange-500/20 transition-all duration-200"
        />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
          {show ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
        </button>
      </div>
    </Field>
  );
};

/* ---------- RegisterPage ---------- */
export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [tipo, setTipo]                         = useState("jefe");
  const [nombre, setNombre]                     = useState("");
  const [email, setEmail]                       = useState("");
  const [password, setPassword]                 = useState("");
  const [confirm, setConfirm]                   = useState("");
  const [codigo, setCodigo]                     = useState("");
  const [validationError, setValidationError]   = useState("");

  const displayError = validationError || error;

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError("");

    if (!nombre || !email || !password) return setValidationError("Completá todos los campos");
    if (password.length < 6) return setValidationError("La contraseña debe tener al menos 6 caracteres");
    if (password !== confirm) return setValidationError("Las contraseñas no coinciden");
    if (tipo === "empleado" && codigo.length !== 6) return setValidationError("El código debe tener 6 dígitos");

    try {
      await register(nombre, email, password, tipo, tipo === "empleado" ? codigo : null);
      navigate(tipo === "empleado" ? "/empleado/pedidos" : "/dashboard");
    } catch {}
  };

  const switchTipo = (t) => { setTipo(t); clearError(); setValidationError(""); setCodigo(""); };

  return (
    <div className="min-h-screen bg-[#080807] flex items-stretch">
      {/* ── Brand panel ── */}
      <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between p-14 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a00] via-[#0d0602] to-[#080807]" />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/60 via-transparent to-transparent" />

        {/* Decorative ember glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <FaFire className="text-orange-400 text-sm" />
            </div>
            <span className="text-white/60 text-sm font-medium tracking-wide">Brasas OS</span>
          </button>
        </div>

        <div className="relative z-10">
          {tipo === "jefe" ? (
            <>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-orange-400/70 mb-4">Para dueños de restaurante</p>
              <h2 className="text-4xl font-bold text-white leading-tight mb-5" style={{ fontFamily: "Georgia, serif" }}>
                Tu local,<br />
                <span className="text-orange-400">tu control.</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                Creá tu espacio en segundos. Gestioná menú, inventario y pedidos desde un solo lugar.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-orange-400/70 mb-4">Para empleados</p>
              <h2 className="text-4xl font-bold text-white leading-tight mb-5" style={{ fontFamily: "Georgia, serif" }}>
                Unite al<br />
                <span className="text-orange-400">equipo.</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                Tu jefe te compartió un código de 6 dígitos. Ingresalo para unirte a su local automáticamente.
              </p>
            </>
          )}
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Brasas OS</p>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 relative">
        <div className="absolute inset-0 bg-[#0a0a09]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#f5f0eb] mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Crear cuenta
            </h1>
            <p className="text-sm text-white/30">¿Cómo querés unirte?</p>
          </div>

          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-2 mb-8 p-1 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
            {[
              { key: "jefe",     Icon: FaUserTie, label: "Soy Jefe",     sub: "Creo mi local" },
              { key: "empleado", Icon: FaStore,   label: "Soy Empleado", sub: "Tengo un código" },
            ].map(({ key, Icon, label, sub }) => (
              <button key={key} type="button" onClick={() => switchTipo(key)}
                className={`flex flex-col items-center gap-1 py-3.5 px-3 rounded-xl text-center transition-all duration-300 ${
                  tipo === key
                    ? "bg-orange-500/15 border border-orange-500/30 text-orange-300"
                    : "text-white/30 hover:text-white/50 border border-transparent"
                }`}>
                <Icon className="text-lg mb-0.5" />
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-[10px] opacity-60">{sub}</span>
              </button>
            ))}
          </div>

          {/* Error */}
          {displayError && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-xs text-red-400">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nombre completo">
              <Input placeholder="Juan García" value={nombre} onChange={e => setNombre(e.target.value)} />
            </Field>

            <Field label="Correo electrónico">
              <Input type="email" placeholder="juan@restaurante.com" value={email} onChange={e => setEmail(e.target.value)} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <PasswordInput label="Contraseña" placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} />
              <PasswordInput label="Confirmar" placeholder="••••••" value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>

            {/* Employee code */}
            {tipo === "empleado" && (
              <Field label="Código de invitación" hint="Pedíselo al jefe de tu local">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-[#f5f0eb] placeholder:text-white/20 outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all duration-200 tracking-[0.3em] text-center font-mono"
                />
              </Field>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2">
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creando cuenta...</>
              ) : (
                tipo === "empleado" ? "Unirme al local" : "Crear mi local"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/30">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

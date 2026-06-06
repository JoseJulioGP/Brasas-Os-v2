import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaFire, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium tracking-wider uppercase text-white/40">{label}</label>
    {children}
  </div>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#080807] flex items-stretch">

      {/* ── Brand panel ── */}
      <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between p-14 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a00] via-[#0d0602] to-[#080807]" />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/70 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-600/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <FaFire className="text-orange-400 text-sm" />
            </div>
            <span className="text-white/60 text-sm font-medium tracking-wide">Brasas OS</span>
          </button>
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-orange-400/70 mb-4">Sistema de gestión</p>
          <h2 className="text-5xl font-bold text-white leading-tight mb-5" style={{ fontFamily: "Georgia, serif" }}>
            Bienvenido<br />
            <span className="text-orange-400">de vuelta.</span>
          </h2>
          <p className="text-white/35 text-sm leading-relaxed max-w-xs">
            Gestioná ventas, inventario y pedidos de tu restaurante en un solo lugar.
          </p>

          {/* Stats strip */}
          <div className="flex gap-6 mt-10">
            {[
              { value: "100%", label: "Control" },
              { value: "En tiempo", label: "Real" },
              { value: "Multi", label: "Rol" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-lg font-bold text-orange-300" style={{ fontFamily: "Georgia, serif" }}>{value}</p>
                <p className="text-[11px] text-white/30 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Brasas OS. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 relative">
        <div className="absolute inset-0 bg-[#0a0a09]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-800/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm mx-auto">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <FaFire className="text-orange-400 text-xs" />
            </div>
            <span className="text-white/50 text-sm font-medium">Brasas OS</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#f5f0eb] mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Iniciar sesión
            </h1>
            <p className="text-sm text-white/30">Ingresá a tu cuenta para continuar</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Correo electrónico">
              <input
                type="email"
                placeholder="tu@restaurante.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-[#f5f0eb] placeholder:text-white/20 outline-none focus:border-orange-500/40 focus:bg-orange-500/[0.03] focus:ring-1 focus:ring-orange-500/20 transition-all duration-200"
              />
            </Field>

            <Field label="Contraseña">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl pl-4 pr-12 py-3 text-sm text-[#f5f0eb] placeholder:text-white/20 outline-none focus:border-orange-500/40 focus:bg-orange-500/[0.03] focus:ring-1 focus:ring-orange-500/20 transition-all duration-200"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </Field>

            {/* Remember / Forgot */}
            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-white/[0.12] bg-white/[0.03] group-hover:border-orange-500/40 transition-colors" />
                <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">Recordarme</span>
              </label>
              <Link to="#" className="text-xs text-orange-400/70 hover:text-orange-400 transition-colors">
                ¿Olvidaste la contraseña?
              </Link>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2">
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Ingresando...</>
              ) : "Ingresar"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="text-[11px] text-white/20 uppercase tracking-widest">o</span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>

          <p className="text-center text-xs text-white/30">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

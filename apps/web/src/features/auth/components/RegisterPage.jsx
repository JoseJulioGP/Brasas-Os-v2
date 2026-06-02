import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form } from "@heroui/react";
import { FaUser, FaEnvelope, FaUserPlus, FaStore, FaUserTie, FaKey } from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";
import { AuthLayout } from "./AuthLayout";
import { AuthBrandPanel } from "./AuthBrandPanel";
import { AuthFormHeader } from "./AuthFormHeader";
import { AuthInput } from "./AuthInput";
import { AuthPasswordInput } from "./AuthPasswordInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { ErrorAlert } from "./ErrorAlert";

const RoleCard = ({ icon: Icon, title, desc, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 font-body
      ${selected
        ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
        : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white/70"
      }`}
  >
    <Icon className="text-2xl" />
    <span className="text-sm font-semibold">{title}</span>
    <span className="text-[11px] text-center opacity-70">{desc}</span>
  </button>
);

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [tipoRegistro, setTipoRegistro]       = useState("jefe");
  const [nombre, setNombre]                   = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codigo, setCodigo]                   = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError("");

    if (!nombre || !email || !password) {
      setValidationError("Nombre, email y contraseña son requeridos");
      return;
    }
    if (password.length < 6) {
      setValidationError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Las contraseñas no coinciden");
      return;
    }
    if (tipoRegistro === "empleado") {
      if (!codigo || codigo.length !== 6) {
        setValidationError("El código de invitación debe tener 6 dígitos");
        return;
      }
    }

    try {
      await register(nombre, email, password, tipoRegistro, tipoRegistro === "empleado" ? codigo : null);
      navigate(tipoRegistro === "empleado" ? "/empleado/pedidos" : "/dashboard");
    } catch {}
  };

  return (
    <AuthLayout
      brandPanel={
        <AuthBrandPanel
          mode="register"
          image="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop"
          title="Brasas OS"
          subtitle="Únete a la plataforma de gestión gastronómica más eficiente"
        />
      }
    >
      <AuthFormHeader
        icon={FaUserPlus}
        title="Crear Cuenta"
        subtitle="¿Cómo quieres registrarte?"
      />

      <div className="flex gap-3 w-full max-w-md mx-auto mb-6">
        <RoleCard
          icon={FaUserTie}
          title="Jefe"
          desc="Crea y administra tu local"
          selected={tipoRegistro === "jefe"}
          onClick={() => { setTipoRegistro("jefe"); clearError(); setValidationError(""); }}
        />
        <RoleCard
          icon={FaStore}
          title="Empleado"
          desc="Únete con código de invitación"
          selected={tipoRegistro === "empleado"}
          onClick={() => { setTipoRegistro("empleado"); clearError(); setValidationError(""); }}
        />
      </div>

      <ErrorAlert error={validationError || error} />

      <Form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
        <AuthInput
          label="Nombre completo"
          labelPlacement="outside"
          type="text"
          placeholder="Juan Pérez"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          isRequired
          icon={FaUser}
        />

        <AuthInput
          label="Correo electrónico"
          labelPlacement="outside"
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isRequired
          icon={FaEnvelope}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <AuthPasswordInput
            label="Contraseña"
            labelPlacement="outside"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
          />
          <AuthPasswordInput
            label="Confirmar"
            labelPlacement="outside"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isRequired
          />
        </div>

        {tipoRegistro === "empleado" && (
          <div className="w-full">
            <label className="block text-xs text-white/50 font-body mb-1.5">
              Código de invitación
            </label>
            <div className="relative">
              <FaKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f5f0eb] placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-colors font-number tracking-[0.4em] text-center"
              />
            </div>
            <p className="text-[11px] text-white/30 font-body mt-1">
              Pídele el código de 6 dígitos al jefe de tu local
            </p>
          </div>
        )}

        <AuthSubmitButton isLoading={isLoading}>
          {tipoRegistro === "empleado" ? "Unirme al local" : "Crear mi local"}
        </AuthSubmitButton>
      </Form>

      <p className="text-center mt-8 text-sm text-white/40 font-body">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-orange-400 hover:underline font-semibold">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
};

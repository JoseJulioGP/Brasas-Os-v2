import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form } from "@heroui/react";
import { FaUser, FaEnvelope, FaUserPlus } from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";
import { AuthLayout } from "./AuthLayout";
import { AuthBrandPanel } from "./AuthBrandPanel";
import { AuthFormHeader } from "./AuthFormHeader";
import { AuthInput } from "./AuthInput";
import { AuthPasswordInput } from "./AuthPasswordInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { ErrorAlert } from "./ErrorAlert";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    try {
      await register(nombre, email, password);
      navigate("/dashboard");
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
        subtitle="Regístrate para empezar a gestionar"
      />

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

        <AuthSubmitButton isLoading={isLoading}>
          Crear cuenta
        </AuthSubmitButton>
      </Form>

      <p className="text-center mt-8 text-sm text-white/40 font-body">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-orange-400 hover:underline font-semibold">
          Inicia sesión
        </Link>
      </p>

      <p className="mt-8 text-center text-[10px] text-white/30 font-body px-8">
        Al registrarte, aceptas nuestros términos de servicio y políticas de
        privacidad para el sistema de gestión de restaurantes.
      </p>
    </AuthLayout>
  );
};
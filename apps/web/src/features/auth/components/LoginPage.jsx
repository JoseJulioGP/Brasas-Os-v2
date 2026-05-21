import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Checkbox } from "@heroui/react";
import { FaEnvelope, FaConciergeBell } from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";
import { AuthLayout } from "./AuthLayout";
import { AuthBrandPanel } from "./AuthBrandPanel";
import { AuthFormHeader } from "./AuthFormHeader";
import { AuthInput } from "./AuthInput";
import { AuthPasswordInput } from "./AuthPasswordInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthDivider } from "./AuthDivider";
import { SocialLoginButton } from "./SocialLoginButton";
import { ErrorAlert } from "./ErrorAlert";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {}
  };

  return (
    <AuthLayout
      brandPanel={
        <AuthBrandPanel
          mode="login"
          image="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop"
          title="Brasas OS"
          subtitle="Administra tu restaurante de manera fácil y eficiente"
        />
      }
    >
      <div className="absolute bottom-6 w-full left-0 text-center">
        <p className="text-xs text-white/30 font-body">
          © {new Date().getFullYear()}{" "}
          <span className="text-orange-400 font-medium">Brasas OS</span>.
          Todos los derechos reservados.
        </p>
      </div>

      <AuthFormHeader
        icon={FaConciergeBell}
        title="¡Bienvenido!"
        subtitle="Inicia sesión para continuar"
      />

      <ErrorAlert error={error} />

      <Form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
        <AuthInput
          label="Correo electrónico"
          labelPlacement="outside"
          type="email"
          placeholder="ejemplo@restaurante.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isRequired
          icon={FaEnvelope}
        />

        <AuthPasswordInput
          labelPlacement="outside"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isRequired
        />

        <div className="flex justify-between items-center w-full mt-2 mb-4">
          <Checkbox
            size="sm"
            color="warning"
            classNames={{ label: "text-white/50 text-sm font-body" }}
          >
            Recordarme
          </Checkbox>
          <Link
            to="#"
            className="text-sm text-orange-400 hover:underline font-medium font-body"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <AuthSubmitButton isLoading={isLoading}>
          Iniciar sesión
        </AuthSubmitButton>
      </Form>

      <AuthDivider />

      <div className="max-w-md mx-auto w-full mb-6">
        <SocialLoginButton />
      </div>

      <p className="text-center text-sm text-white/40 font-body">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-orange-400 hover:underline font-semibold">
          Regístrate
        </Link>
      </p>
    </AuthLayout>
  );
};
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Form, Checkbox } from "@heroui/react";
import { FaEnvelope, FaGoogle, FaArrowRight } from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";
import { getRedirectPath } from "../../../utils/authUtils";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      const user = await login(email, password);
      const redirectPath = getRedirectPath(user.rol);
      navigate(redirectPath);
    } catch {}
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      <AuthBackground
        circles={[
          "absolute top-1/4 -left-20 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px]",
          "absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]",
        ]}
      />

      <div className="flex flex-col lg:flex-row w-full max-w-5xl min-h-[680px] animate-fade-in-up">
        <AuthBrandSection subtitle="Administra tu restaurante de manera fácil y eficiente" />

        <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-center relative stagger-5 animate-fade-in-up opacity-0">
          <div className="glass rounded-2xl p-7 md:p-9 glow-border">
            <AuthCardHeader title="Bienvenido" subtitle="Inicia sesión para continuar" />

            <AuthErrorAlert error={error} />

            <Form onSubmit={handleSubmit} className="space-y-5 w-full">
              <Input
                label="Correo electrónico"
                labelPlacement="outside"
                type="email"
                placeholder="ejemplo@restaurante.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
                variant="bordered"
                size="lg"
                className="w-full"
                startContent={<FaEnvelope className="text-white/40 mr-2 text-sm shrink-0" />}
                classNames={{
                  label: "font-body font-medium text-white/70 pb-1 text-sm",
                  input: "font-body text-[#f5f0eb]",
                  inputWrapper: "bg-white/[0.03] border-white/10 hover:border-orange-500/30 group-data-[focus=true]:border-orange-500/50 group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-orange-500/20",
                }}
              />

              <PasswordInput
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />

              <div className="flex justify-between items-center w-full pt-1">
                <Checkbox size="sm" color="warning" classNames={{ label: "text-white/50 text-sm font-body" }}>
                  Recordarme
                </Checkbox>
                <Link to="#" className="text-sm text-orange-400 hover:text-orange-300 font-medium font-body transition-colors duration-200">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-bold bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 hover:brightness-110 transition-all duration-300 font-body"
                isLoading={isLoading}
                endContent={!isLoading && <FaArrowRight className="ml-1" />}
              >
                Iniciar sesión
              </Button>
            </Form>

            <div className="flex items-center gap-4 my-6 w-full">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-xs text-white/30 font-body tracking-wide uppercase">o continúa con</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <Button
              variant="bordered"
              size="lg"
              className="w-full font-semibold text-white/60 border-white/10 hover:bg-white/[0.06] hover:border-white/20 font-body transition-all duration-200"
              startContent={<FaGoogle className="text-red-400/80 mr-2" />}
            >
              Continuar con Google
            </Button>

            <p className="text-center mt-6 text-sm text-white/40 font-body">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200">
                Regístrate
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-white/20 font-body tracking-wide">
            &copy; {new Date().getFullYear()} <span className="text-orange-400/50 font-medium">Brasas OS</span>. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

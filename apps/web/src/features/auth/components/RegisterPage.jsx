import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Form } from "@heroui/react";
import { FaEnvelope, FaUser, FaArrowRight, FaChartBar, FaUsers, FaBox } from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";
import { AuthBackground } from "./AuthBackground";
import { AuthBrandSection } from "./AuthBrandSection";
import { AuthCardHeader } from "./AuthCardHeader";
import { PasswordInput } from "./PasswordInput";
import { AuthErrorAlert } from "./AuthErrorAlert";

const registerFeatures = [
  { icon: FaChartBar, color: "text-orange-400", text: "Analíticas en tiempo real" },
  { icon: FaUsers, color: "text-orange-400", text: "Gestión de equipos" },
  { icon: FaBox, color: "text-orange-400", text: "Control de suministros" },
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      useAuthStore.setState({ error: "Las contraseñas no coinciden" });
      return;
    }

    try {
      const user = await register(nombre, email, password);
      const redirectPath = getRedirectPath(user.rol);
      navigate(redirectPath);
    } catch {}
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      <AuthBackground
        circles={[
          "absolute top-1/3 -right-20 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px]",
          "absolute bottom-1/3 -left-20 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]",
        ]}
      />

      <div className="flex flex-col lg:flex-row w-full max-w-5xl min-h-[700px] animate-fade-in-up">
        <AuthBrandSection
          subtitle="Únete a la plataforma de gestión gastronómica más eficiente"
          subtitleClassName="text-base max-w-xs"
          iconSize="text-4xl"
          logoSize="w-24 h-24"
          featureSize="w-10 h-10"
          featureIconSize="text-base"
          featuresSpace="space-y-5"
          features={registerFeatures}
          noTopMargin
        />

        <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-center stagger-5 animate-fade-in-up opacity-0">
          <div className="glass rounded-2xl p-7 md:p-9 glow-border">
            <AuthCardHeader title="Crear Cuenta" subtitle="Regístrate para empezar a gestionar" iconSize="text-xl" wrapperSize="w-14 h-14" />

            <AuthErrorAlert error={error} />

            <Form onSubmit={handleSubmit} className="space-y-5 w-full">
              <Input
                label="Nombre completo"
                labelPlacement="outside"
                type="text"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                isRequired
                variant="bordered"
                size="lg"
                className="w-full"
                startContent={<FaUser className="text-white/40 mr-2 text-sm shrink-0" />}
                classNames={{
                  label: "font-body font-medium text-white/70 pb-1 text-sm",
                  input: "font-body text-[#f5f0eb]",
                  inputWrapper: "bg-white/[0.03] border-white/10 hover:border-orange-500/30 group-data-[focus=true]:border-orange-500/50 group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-orange-500/20",
                }}
              />

              <Input
                label="Correo electrónico"
                labelPlacement="outside"
                type="email"
                placeholder="correo@ejemplo.com"
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

              <div className="space-y-5 w-full">
                <PasswordInput
                  label="Contraseña"
                  placeholder="Crea una contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  size="lg"
                  showToggle={false}
                />

                <PasswordInput
                  label="Confirmar contraseña"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  size="lg"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-bold bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 hover:brightness-110 transition-all duration-300 font-body"
                isLoading={isLoading}
                endContent={!isLoading && <FaArrowRight className="ml-1" />}
              >
                Crear cuenta
              </Button>
            </Form>

            <p className="text-center mt-6 text-sm text-white/40 font-body">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200">
                Inicia sesión
              </Link>
            </p>

            <p className="mt-5 text-center text-[11px] text-white/25 font-body leading-relaxed">
              Al registrarte, aceptas nuestros{" "}
              <span className="text-white/40 hover:text-white/60 cursor-pointer transition-colors">términos de servicio</span> y{" "}
              <span className="text-white/40 hover:text-white/60 cursor-pointer transition-colors">políticas de privacidad</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

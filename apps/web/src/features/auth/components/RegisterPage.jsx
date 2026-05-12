import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Input,
  Button,
  Form,
  Alert,
} from "@heroui/react";
import {
  FaFire,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaChartBar,
  FaUsers,
  FaBox,
  FaArrowRight,
} from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      useAuthStore.setState({ error: "Las contraseñas no coinciden" });
      return;
    }

    try {
      await register(nombre, email, password);
      navigate("/");
    } catch {}
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/20 via-transparent to-transparent animate-gradient-shift" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />

      <div className="flex flex-col lg:flex-row w-full max-w-5xl min-h-[700px] animate-fade-in-up">
        <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-center">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-6 animate-float stagger-1">
              <FaFire className="text-4xl text-orange-500" />
            </div>
            <h1 className="text-5xl font-heading font-bold text-[#f5f0eb] mb-3 stagger-2 animate-fade-in-up opacity-0">
              Brasas OS
            </h1>
            <p className="text-base text-white/60 font-body mb-10 max-w-xs stagger-3 animate-fade-in-up opacity-0">
              Únete a la plataforma de gestión gastronómica más eficiente
            </p>

            <div className="space-y-5 text-left w-full max-w-sm stagger-4 animate-fade-in-up opacity-0">
              <div className="flex items-center gap-4 glass rounded-xl p-3 glass-hover">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <FaChartBar className="text-orange-400" />
                </div>
                <p className="text-sm font-medium text-white/90 font-body">Analíticas en tiempo real</p>
              </div>
              <div className="flex items-center gap-4 glass rounded-xl p-3 glass-hover">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <FaUsers className="text-orange-400" />
                </div>
                <p className="text-sm font-medium text-white/90 font-body">Gestión de equipos</p>
              </div>
              <div className="flex items-center gap-4 glass rounded-xl p-3 glass-hover">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <FaBox className="text-orange-400" />
                </div>
                <p className="text-sm font-medium text-white/90 font-body">Control de suministros</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center stagger-5 animate-fade-in-up opacity-0">
          <div className="glass rounded-2xl p-8 md:p-10 glow-border">
            <div className="flex flex-col items-center mb-7 text-center">
              <div className="w-14 h-14 rounded-full glass flex items-center justify-center mb-3">
                <FaFire className="text-xl text-orange-400" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-[#f5f0eb]">Crear Cuenta</h2>
              <p className="text-white/50 text-sm font-body">Regístrate para empezar a gestionar</p>
            </div>

            {error && (
              <Alert color="danger" variant="flat" className="mb-5">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="space-y-4 w-full">
              <Input
                label="Nombre completo"
                labelPlacement="outside"
                type="text"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                isRequired
                variant="bordered"
                size="md"
                startContent={<FaUser className="text-white/40 mr-2 text-sm" />}
                classNames={{
                  label: "font-body font-medium text-white/70 pb-1",
                  input: "font-body text-[#f5f0eb]",
                  inputWrapper: "bg-white/[0.03] border-white/10 hover:border-orange-500/30 group-data-[focus=true]:border-orange-500/50",
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
                size="md"
                startContent={<FaEnvelope className="text-white/40 mr-2 text-sm" />}
                classNames={{
                  label: "font-body font-medium text-white/70 pb-1",
                  input: "font-body text-[#f5f0eb]",
                  inputWrapper: "bg-white/[0.03] border-white/10 hover:border-orange-500/30 group-data-[focus=true]:border-orange-500/50",
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contraseña"
                  labelPlacement="outside"
                  type={isVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  variant="bordered"
                  size="md"
                  startContent={<FaLock className="text-white/40 mr-2 text-sm" />}
                  classNames={{
                    label: "font-body font-medium text-white/70 pb-1",
                    input: "font-body text-[#f5f0eb]",
                    inputWrapper: "bg-white/[0.03] border-white/10 hover:border-orange-500/30 group-data-[focus=true]:border-orange-500/50",
                  }}
                />

                <Input
                  label="Confirmar"
                  labelPlacement="outside"
                  type={isVisible ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isRequired
                  variant="bordered"
                  size="md"
                  endContent={
                    <button type="button" onClick={toggleVisibility}>
                      {isVisible ? <FaEyeSlash className="text-white/40" /> : <FaEye className="text-white/40" />}
                    </button>
                  }
                  classNames={{
                    label: "font-body font-medium text-white/70 pb-1",
                    input: "font-body text-[#f5f0eb]",
                    inputWrapper: "bg-white/[0.03] border-white/10 hover:border-orange-500/30 group-data-[focus=true]:border-orange-500/50",
                  }}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-bold bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:bg-orange-500 transition-all duration-300 font-body mt-2"
                isLoading={isLoading}
                endContent={!isLoading && <FaArrowRight className="ml-2" />}
              >
                Crear cuenta
              </Button>
            </Form>

            <p className="text-center mt-7 text-sm text-white/50 font-body">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-orange-400 hover:text-orange-300 font-bold">
                Inicia sesión
              </Link>
            </p>

            <p className="mt-6 text-center text-[10px] text-white/30 px-4 font-body leading-relaxed">
              Al registrarte, aceptas nuestros términos de servicio y políticas de privacidad para el sistema de gestión de restaurantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Input,
  Button,
  Form,
  Alert,
  Checkbox,
} from "@heroui/react";
import {
  FaFire,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChartBar,
  FaUsers,
  FaBox,
  FaGoogle,
  FaArrowRight,
} from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";
import { getRedirectPath } from "../../../utils/authUtils";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

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
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/20 via-transparent to-transparent animate-gradient-shift" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />

      <div className="flex flex-col lg:flex-row w-full max-w-5xl min-h-[680px] animate-fade-in-up">
        <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-center">
          <div className="relative z-10 flex flex-col items-center text-center mt-8">
            <div className="w-28 h-28 rounded-full glass flex items-center justify-center mb-6 animate-float stagger-1">
              <FaFire className="text-5xl text-orange-500" />
            </div>
            <h1 className="text-5xl font-heading font-bold text-[#f5f0eb] mb-3 stagger-2 animate-fade-in-up opacity-0">
              Brasas OS
            </h1>
            <p className="text-lg text-white/60 font-body mb-14 max-w-sm stagger-3 animate-fade-in-up opacity-0">
              Administra tu restaurante de manera fácil y eficiente
            </p>

            <div className="space-y-6 text-left w-full max-w-sm stagger-4 animate-fade-in-up opacity-0">
              <div className="flex items-center gap-4 glass rounded-xl p-3 glass-hover">
                <div className="w-11 h-11 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <FaChartBar className="text-lg text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white/90">Control total</h3>
                  <p className="text-xs text-white/50">Ventas, productos y reportes</p>
                </div>
              </div>

              <div className="flex items-center gap-4 glass rounded-xl p-3 glass-hover">
                <div className="w-11 h-11 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <FaUsers className="text-lg text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white/90">Gestión de personal</h3>
                  <p className="text-xs text-white/50">Roles y permisos</p>
                </div>
              </div>

              <div className="flex items-center gap-4 glass rounded-xl p-3 glass-hover">
                <div className="w-11 h-11 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <FaBox className="text-lg text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white/90">Inventario inteligente</h3>
                  <p className="text-xs text-white/50">Control de stock y proveedores</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-14 flex flex-col justify-center relative stagger-5 animate-fade-in-up opacity-0">
          <div className="glass rounded-2xl p-8 md:p-10 glow-border">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-4">
                <FaFire className="text-2xl text-orange-400" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-[#f5f0eb] mb-1">Bienvenido</h2>
              <p className="text-white/50 text-sm font-body">Inicia sesión para continuar</p>
            </div>

            {error && (
              <Alert color="danger" variant="flat" className="mb-5">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="space-y-5 w-full">
              <div className="w-full">
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
                  startContent={<FaEnvelope className="text-white/40 mr-2 text-sm" />}
                  classNames={{
                    label: "font-body font-medium text-white/70 pb-1",
                    input: "font-body text-[#f5f0eb]",
                    inputWrapper: "bg-white/[0.03] border-white/10 hover:border-orange-500/30 group-data-[focus=true]:border-orange-500/50",
                  }}
                />
              </div>

              <div className="w-full">
                <Input
                  label="Contraseña"
                  labelPlacement="outside"
                  type={isVisible ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  variant="bordered"
                  size="lg"
                  startContent={<FaLock className="text-white/40 mr-2 text-sm" />}
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <FaEyeSlash className="text-xl text-white/40 pointer-events-none" />
                      ) : (
                        <FaEye className="text-xl text-white/40 pointer-events-none" />
                      )}
                    </button>
                  }
                  classNames={{
                    label: "font-body font-medium text-white/70 pb-1",
                    input: "font-body text-[#f5f0eb]",
                    inputWrapper: "bg-white/[0.03] border-white/10 hover:border-orange-500/30 group-data-[focus=true]:border-orange-500/50",
                  }}
                />
              </div>

              <div className="flex justify-between items-center w-full mt-2 mb-2">
                <Checkbox size="sm" color="warning" classNames={{ label: "text-white/50 text-sm font-body" }}>
                  Recordarme
                </Checkbox>
                <Link to="#" className="text-sm text-orange-400 hover:text-orange-300 font-medium font-body">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-bold bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:bg-orange-500 transition-all duration-300 font-body"
                isLoading={isLoading}
                endContent={!isLoading && <FaArrowRight className="ml-2" />}
              >
                Iniciar sesión
              </Button>
            </Form>

            <div className="flex items-center gap-4 my-7 w-full">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-xs text-white/40 font-body">o continúa con</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <div className="w-full mb-5">
              <Button
                variant="bordered"
                size="lg"
                className="w-full font-semibold text-white/70 border-white/10 hover:bg-white/[0.06] hover:border-white/20 font-body"
                startContent={<FaGoogle className="text-red-400 mr-2" />}
              >
                Continuar con Google
              </Button>
            </div>

            <p className="text-center text-sm text-white/50 font-body">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-orange-400 hover:text-orange-300 font-semibold">
                Regístrate
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-white/30 font-body">
              © {new Date().getFullYear()} <span className="text-orange-400/60 font-medium">Brasas OS</span>. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Form, Alert, Checkbox } from "@heroui/react";
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
  FaConciergeBell,
  FaStar,
} from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: '#050505' }}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.4) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.5) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.3) 0%, transparent 60%)', filter: 'blur(80px)' }} />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

      <div className="flex flex-col lg:flex-row w-full max-w-5xl min-h-[700px] relative z-10" style={{ backgroundColor: 'rgba(17,17,16,0.8)', backdropFilter: 'blur(20px)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
        {/* Panel Izquierdo */}
        <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-center overflow-hidden" style={{ borderRadius: '2rem 0 0 2rem' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.95) 0%, rgba(180,50,10,0.98) 50%, rgba(120,40,10,0.95) 100%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
          
          {/* Decorative elements */}
          <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-white/30" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
          <div className="absolute bottom-12 left-12 w-2 h-2 rounded-full bg-white/20" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
          <FaStar className="absolute top-20 left-20 text-white/10 text-xl" style={{ animation: 'spin 20s linear infinite' }} />
          <FaStar className="absolute bottom-32 right-16 text-white/10 text-lg" style={{ animation: 'spin 15s linear infinite reverse' }} />

          <div className="relative z-10 flex flex-col items-center text-center mt-8">
            <div className="relative">
              <div className="absolute inset-0 w-28 h-28 rounded-full bg-white/20 blur-xl" />
              <div className="w-28 h-28 border-[3px] border-white/50 rounded-full flex items-center justify-center mb-6 shadow-2xl relative" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <FaFire className="text-5xl text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-3 text-white tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              Brasas OS
            </h1>
            <p className="text-lg text-white/90 mb-14 max-w-sm leading-relaxed">
              Administra tu restaurante de manera fácil y eficiente
            </p>

            <div className="space-y-6 text-left w-full max-w-sm">
              {[
                { icon: FaChartBar, title: "Control total", desc: "Ventas, productos y reportes" },
                { icon: FaUsers, title: "Gestión de personal", desc: "Roles y permisos" },
                { icon: FaBox, title: "Inventario inteligente", desc: "Control de stock y proveedores" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <item.icon className="text-xl text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight text-white group-hover:text-orange-200 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative" style={{ backgroundColor: '#0a0a0a' }}>
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32" style={{ background: 'radial-gradient(circle at top right, rgba(234,88,12,0.1) 0%, transparent 70%)' }} />
          
          <div className="flex flex-col items-center mb-10 text-center relative">
            <div className="relative mb-4">
              <div className="absolute inset-0 w-20 h-20 bg-orange-500/20 rounded-full blur-xl" />
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.2) 0%, rgba(234,88,12,0.05) 100%)', border: '1px solid rgba(234,88,12,0.3)' }}>
                <FaConciergeBell className="text-4xl text-orange-500" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-2 text-white tracking-tight">
              ¡Bienvenido!
            </h2>
            <p className="text-gray-500">Inicia sesión para continuar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Alert color="danger" variant="flat">
                {error}
              </Alert>
            </div>
          )}

          <Form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute -left-3 top-1/2 w-1 h-8 rounded-full transition-all duration-300" style={{ backgroundColor: '#ea580c', opacity: 0 }} />
              <Input
                label="Correo electrónico"
                labelPlacement="outside"
                type="email"
                placeholder="tu@restaurante.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
                variant="bordered"
                size="lg"
                startContent={<FaEnvelope className="text-gray-500 mr-3" />}
                classNames={{ 
                  label: "font-semibold text-gray-400 pb-2 text-sm",
                  input: "text-gray-100 text-base",
                  inputWrapper: "border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-orange-500/50 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20"
                }}
              />
            </div>

            <div className="relative">
              <Input
                label="Contraseña"
                labelPlacement="outside"
                type={isVisible ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                variant="bordered"
                size="lg"
                startContent={<FaLock className="text-gray-500 mr-3" />}
                endContent={
                  <button className="focus:outline-none transition-transform hover:scale-110" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <FaEyeSlash className="text-gray-500 text-lg" />
                    ) : (
                      <FaEye className="text-gray-500 text-lg" />
                    )}
                  </button>
                }
                classNames={{ 
                  label: "font-semibold text-gray-400 pb-2 text-sm",
                  input: "text-gray-100 text-base",
                  inputWrapper: "border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-orange-500/50 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20"
                }}
              />
            </div>

            <div className="flex justify-between items-center w-full mt-2 mb-6">
              <Checkbox
                size="sm"
                color="warning"
                classNames={{ label: "text-gray-500 text-sm cursor-pointer" }}
              >
                <span className="text-gray-500">Recordarme</span>
              </Checkbox>
              <Link to="#" className="text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' }}
              isLoading={isLoading}
              endContent={!isLoading && <FaArrowRight className="ml-2" />}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Iniciar sesión
            </Button>
          </Form>

          <div className="flex items-center gap-4 my-8 max-w-md mx-auto w-full">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)' }} />
            <span className="text-sm text-gray-600 font-medium">o continúa con</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1), transparent)' }} />
          </div>

          <Button
            variant="bordered"
            size="lg"
            className="w-full font-semibold transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800/50"
            style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            startContent={<FaGoogle className="text-red-400 mr-3" />}
          >
            <span className="text-gray-400">Continuar con Google</span>
          </Button>

          <p className="text-center text-sm text-gray-500 mt-8">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-orange-500 hover:text-orange-400 font-bold transition-colors hover:underline">
              Regístrate
            </Link>
          </p>

          <div className="absolute bottom-6 w-full left-0 text-center">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()}{" "}
              <span className="text-orange-500/70 font-medium">Brasas OS</span>.
              Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};
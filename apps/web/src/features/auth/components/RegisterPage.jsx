import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Form, Alert } from "@heroui/react";
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
  FaUserPlus,
  FaStar,
  FaCheck,
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
  const [validationError, setValidationError] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

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

  const features = [
    { icon: FaChartBar, text: "Analíticas en tiempo real" },
    { icon: FaUsers, text: "Gestión de equipos" },
    { icon: FaBox, text: "Control de suministros" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: '#050505' }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.4) 0%, transparent 70%)', filter: 'blur(80px)', animation: 'float 12s ease-in-out infinite' }} />
        <div className="absolute bottom-1/3 -left-40 w-[450px] h-[450px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.5) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.3) 0%, transparent 50%)', filter: 'blur(100px)' }} />
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

      <div className="flex flex-col lg:flex-row w-full max-w-5xl min-h-[800px] relative z-10" style={{ backgroundColor: 'rgba(17,17,16,0.8)', backdropFilter: 'blur(20px)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
        {/* Panel Izquierdo */}
        <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-center overflow-hidden" style={{ borderRadius: '2rem 0 0 2rem' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.95) 0%, rgba(180,50,10,0.98) 50%, rgba(120,40,10,0.95) 100%)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />
          
          {/* Decorative elements */}
          <FaStar className="absolute top-16 left-16 text-white/10 text-2xl" style={{ animation: 'spin 25s linear infinite' }} />
          <FaStar className="absolute top-32 right-12 text-white/10 text-lg" style={{ animation: 'spin 18s linear infinite reverse' }} />
          <FaStar className="absolute bottom-20 right-24 text-white/10 text-xl" style={{ animation: 'spin 22s linear infinite' }} />
          <div className="absolute top-12 right-12 w-2 h-2 bg-white/40 rounded-full" style={{ animation: 'pulse 2.5s ease-in-out infinite' }} />
          <div className="absolute bottom-16 left-16 w-3 h-3 bg-white/30 rounded-full" style={{ animation: 'pulse 3s ease-in-out infinite' }} />

          <div className="relative z-10 flex flex-col items-center text-center mt-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 w-24 h-24 bg-white/20 rounded-full blur-xl" />
              <div className="w-24 h-24 border-[3px] border-white/50 rounded-full flex items-center justify-center shadow-2xl relative" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <FaFire className="text-5xl text-white" />
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <FaCheck className="text-orange-500 text-xs" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-3 text-white tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              Brasas OS
            </h1>
            <p className="text-base text-white/90 mb-12 max-w-sm leading-relaxed">
              Únete a la plataforma de gestión gastronómica más eficiente
            </p>

            <div className="space-y-5 text-left w-full max-w-xs mx-auto">
              {features.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <item.icon className="text-lg text-white" />
                  </div>
                  <p className="text-sm font-medium text-white group-hover:text-orange-200 transition-colors">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative" style={{ backgroundColor: '#0a0a0a' }}>
          <div className="absolute top-0 left-0 w-40 h-40" style={{ background: 'radial-gradient(circle at top left, rgba(234,88,12,0.08) 0%, transparent 60%)' }} />
          
          <div className="flex flex-col items-center mb-8 text-center relative">
            <div className="relative mb-4">
              <div className="absolute inset-0 w-18 h-18 bg-orange-500/20 rounded-full blur-xl" />
              <div className="w-18 h-18 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.2) 0%, rgba(234,88,12,0.05) 100%)', border: '1px solid rgba(234,88,12,0.3)' }}>
                <FaUserPlus className="text-3xl text-orange-500" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white tracking-tight mb-1">
              Crear Cuenta
            </h2>
            <p className="text-gray-500 text-sm">
              Regístrate para empezar a gestionar
            </p>
          </div>

          {(error || validationError) && (
            <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Alert color="danger" variant="flat">
                {validationError || error}
              </Alert>
            </div>
          )}

          <Form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
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
              startContent={<FaUser className="text-gray-500 mr-3" />}
              classNames={{ 
                label: "font-semibold text-gray-400 pb-2 text-sm",
                input: "text-gray-100 text-base",
                inputWrapper: "border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-orange-500/50 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20"
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
              startContent={<FaEnvelope className="text-gray-500 mr-3" />}
              classNames={{ 
                label: "font-semibold text-gray-400 pb-2 text-sm",
                input: "text-gray-100 text-base",
                inputWrapper: "border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-orange-500/50 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20"
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Contraseña"
                labelPlacement="outside"
                type={isVisible ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                variant="bordered"
                size="lg"
                startContent={<FaLock className="text-gray-500 mr-3" />}
                classNames={{ 
                  label: "font-semibold text-gray-400 pb-2 text-sm",
                  input: "text-gray-100 text-base",
                  inputWrapper: "border-gray-800 bg-gray-900/50 transition-all duration-300 hover:border-orange-500/50 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20"
                }}
              />

              <Input
                label="Confirmar"
                labelPlacement="outside"
                type={isVisible ? "text" : "password"}
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isRequired
                variant="bordered"
                size="lg"
                endContent={
                  <button type="button" onClick={toggleVisibility} className="focus:outline-none transition-transform hover:scale-110">
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

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mt-3"
              style={{ background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' }}
              isLoading={isLoading}
              endContent={!isLoading && <FaArrowRight className="ml-2" />}
            >
              Crear cuenta
            </Button>
          </Form>

          <p className="text-center text-sm text-gray-500 mt-8">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-orange-500 hover:text-orange-400 font-bold transition-colors hover:underline">
              Inicia sesión
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-gray-600 px-4">
            Al registrarte, aceptas nuestros términos de servicio y políticas de privacidad para el sistema de gestión de restaurantes.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};
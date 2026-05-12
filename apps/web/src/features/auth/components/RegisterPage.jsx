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
  FaUserPlus
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
    } catch {
      // Error manejado por el store
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Contenedor principal idéntico al Login */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[750px]">
        
        {/* Panel Izquierdo - Coherencia visual con Brasas OS */}
        <div className="hidden lg:flex lg:w-1/2 relative p-12 text-white flex-col justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop")' }}
          />
          <div className="absolute inset-0 bg-orange-600/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/60 to-orange-900/95" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 border-2 border-white/50 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FaFire className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Brasas OS</h1>
            <p className="text-lg text-white/80 mb-10">Únete a la plataforma de gestión gastronómica más eficiente</p>

            <div className="space-y-6 text-left w-full max-w-xs mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                  <FaChartBar className="text-white" />
                </div>
                <p className="text-sm font-medium">Analíticas en tiempo real</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                  <FaUsers className="text-white" />
                </div>
                <p className="text-sm font-medium">Gestión de equipos</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                  <FaBox className="text-white" />
                </div>
                <p className="text-sm font-medium">Control de suministros</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Formulario de Registro */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3">
              <FaUserPlus className="text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
            <p className="text-gray-500 text-sm">Regístrate para empezar a gestionar</p>
          </div>

          {error && (
            <Alert color="danger" variant="flat" className="mb-6">
              {error}
            </Alert>
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
              size="md"
              startContent={<FaUser className="text-gray-400 mr-2 text-sm" />}
              classNames={{ label: "font-semibold text-gray-700" }}
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
              startContent={<FaEnvelope className="text-gray-400 mr-2 text-sm" />}
              classNames={{ label: "font-semibold text-gray-700" }}
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
                startContent={<FaLock className="text-gray-400 mr-2 text-sm" />}
                classNames={{ label: "font-semibold text-gray-700" }}
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
                    {isVisible ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </button>
                }
                classNames={{ label: "font-semibold text-gray-700" }}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold bg-[#ea580c] text-white shadow-md hover:bg-orange-700 mt-4"
              isLoading={isLoading}
              endContent={!isLoading && <FaArrowRight className="ml-2" />}
            >
              Crear cuenta
            </Button>
          </Form>

          <p className="text-center mt-8 text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-orange-600 hover:underline font-bold">
              Inicia sesión
            </Link>
          </p>

          <p className="mt-8 text-center text-[10px] text-gray-400 px-8">
            Al registrarte, aceptas nuestros términos de servicio y políticas de privacidad para el sistema de gestión de restaurantes.
          </p>
        </div>
      </div>
    </div>
  );
};
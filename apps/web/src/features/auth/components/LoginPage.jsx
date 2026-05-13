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
} from "react-icons/fa";
import { useAuthStore } from "../stores/useAuthStore";

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
      await login(email, password);
      navigate("/");
    } catch {
      // Error manejado por el store
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Contenedor principal estilo tarjeta (Card) */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[700px]">
        {/* Panel Izquierdo - Imagen y Características */}
        <div className="hidden lg:flex lg:w-1/2 relative p-12 text-white flex-col justify-center">
          {/* Imagen de fondo de restaurante con overlays naranjas */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop")',
            }}
          />
          <div className="absolute inset-0 bg-orange-600/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/60 to-orange-900/95" />

          {/* Contenido principal izquierdo */}
          <div className="relative z-10 flex flex-col items-center text-center mt-8">
            <div className="w-24 h-24 border-3 border-white rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FaFire className="text-5xl" />
            </div>
            {/* Título de tu restaurante conservado */}
            <h1 className="text-4xl font-bold mb-2">Brasas OS</h1>
            <p className="text-lg text-white/90 mb-12 max-w-sm">
              Administra tu restaurante de manera fácil y eficiente
            </p>

            {/* Lista de características */}
            <div className="space-y-8 text-left w-full max-w-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                  <FaChartBar className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Control total
                  </h3>
                  <p className="text-sm text-white/80">
                    Ventas, productos y reportes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                  <FaUsers className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Gestión de personal
                  </h3>
                  <p className="text-sm text-white/80">Roles y permisos</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                  <FaBox className="text-xl text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    Inventario inteligente
                  </h3>
                  <p className="text-sm text-white/80">
                    Control de stock y proveedores
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Formulario de Login */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
              <FaConciergeBell className="text-3xl" />
            </div>
            <h2 className="text-4xl font-bold text-orange-600 mb-2">
              ¡Bienvenido!
            </h2>
            <p className="text-gray-500">Inicia sesión para continuar</p>
          </div>

          {error && (
            <Alert color="danger" variant="flat" className="mb-6">
              {error}
            </Alert>
          )}

          <Form
            onSubmit={handleSubmit}
            className="space-y-5 w-full max-w-md mx-auto"
          >
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
                startContent={
                  <FaEnvelope className="text-gray-400 mr-2 text-sm" />
                }
                classNames={{ label: "font-semibold text-gray-700 pb-1" }}
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
                startContent={<FaLock className="text-gray-400 mr-2 text-sm" />}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <FaEyeSlash className="text-xl text-gray-400 pointer-events-none" />
                    ) : (
                      <FaEye className="text-xl text-gray-400 pointer-events-none" />
                    )}
                  </button>
                }
                classNames={{ label: "font-semibold text-gray-700 pb-1" }}
              />
            </div>

            {/* Opciones extra de login */}
            <div className="flex justify-between items-center w-full mt-2 mb-4">
              <Checkbox
                size="sm"
                color="warning"
                classNames={{ label: "text-gray-600 text-sm" }}
              >
                Recordarme
              </Checkbox>
              <Link
                to="#"
                className="text-sm text-orange-600 hover:underline font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-bold bg-[#ea580c] text-white shadow-md hover:bg-orange-700"
              isLoading={isLoading}
              endContent={!isLoading && <FaArrowRight className="ml-2" />}
            >
              Iniciar sesión
            </Button>
          </Form>

          {/* Separador */}
          <div className="flex items-center gap-4 my-8 max-w-md mx-auto w-full">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400 font-medium">
              o continúa con
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Botón de Google */}
          <div className="max-w-md mx-auto w-full mb-6">
            <Button
              variant="bordered"
              size="lg"
              className="w-full font-semibold text-gray-600 border-gray-300 hover:bg-gray-50"
              startContent={<FaGoogle className="text-red-500 mr-2" />}
            >
              Continuar con Google
            </Button>
          </div>

          {/* Mantener la funcionalidad de Registro del original */}
          <p className="text-center text-sm text-gray-500">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-orange-600 hover:underline font-semibold"
            >
              Regístrate
            </Link>
          </p>

          {/* Footer */}
          <div className="absolute bottom-6 w-full left-0 text-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()}{" "}
              <span className="text-orange-600 font-medium">Brasas OS</span>.
              Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

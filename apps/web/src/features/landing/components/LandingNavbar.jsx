import { useNavigate } from "react-router-dom";
import { FaFire } from "react-icons/fa";

export const LandingNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <FaFire className="text-orange-400 text-sm" />
          </div>
          <span className="font-heading font-bold text-lg text-[#f5f0eb]">Brasas OS</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors font-body"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 text-sm font-bold bg-orange-600 text-white rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 font-body"
          >
            Registrarse
          </button>
        </div>
      </div>
    </nav>
  );
};

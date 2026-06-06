import { useNavigate } from "react-router-dom";
import { FaFire } from "react-icons/fa";

export const LandingNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-[#080807]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between py-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
            <FaFire className="text-orange-400 text-xs" />
          </div>
          <span className="font-bold text-[#f5f0eb] text-base" style={{ fontFamily: "Georgia, serif" }}>
            Brasas OS
          </span>
        </div>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-white/35">
          {["Funcionalidades", "Por qué Brasas OS", "Precios"].map(item => (
            <button key={item}
              className="hover:text-white/70 transition-colors">
              {item}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors font-medium">
            Iniciar sesión
          </button>
          <button onClick={() => navigate("/register")}
            className="px-4 py-2 text-sm font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all shadow-md shadow-orange-600/20">
            Empezar gratis
          </button>
        </div>
      </div>
    </nav>
  );
};

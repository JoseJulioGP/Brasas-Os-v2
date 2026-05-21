import { FaFire } from "react-icons/fa";

export const LandingFooter = () => (
  <footer className="border-t border-white/[0.06] py-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <FaFire className="text-orange-400 text-xs" />
          </div>
          <span className="font-heading font-bold text-[#f5f0eb]">Brasas OS</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-white/30 font-body">
          <span>© {new Date().getFullYear()} Brasas OS</span>
          <span className="hidden sm:inline">Inteligencia financiera para restaurantes</span>
        </div>
      </div>
    </div>
  </footer>
);

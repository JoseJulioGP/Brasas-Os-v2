import { FaFire } from "react-icons/fa";

const features = {
  login: [
    { icon: FaChartBar, title: "Control total", desc: "Ventas, productos y reportes" },
    { icon: FaUsers, title: "Gestión de personal", desc: "Roles y permisos" },
    { icon: FaBox, title: "Inventario inteligente", desc: "Control de stock y proveedores" },
  ],
  register: [
    { icon: FaChartBar, title: "Analíticas en tiempo real", desc: "" },
    { icon: FaUsers, title: "Gestión de equipos", desc: "" },
    { icon: FaBox, title: "Control de suministros", desc: "" },
  ],
};

import { FaChartBar, FaUsers, FaBox } from "react-icons/fa";

export const AuthBrandPanel = ({ mode = "login", image, title, subtitle }) => {
  const items = features[mode] || features.login;

  return (
    <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-center">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${image}")` }} />
      <div className="absolute inset-0 bg-orange-600/90 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/60 to-orange-900/95" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 border-3 border-white/30 rounded-full flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm bg-white/10">
          <FaFire className="text-5xl text-white" />
        </div>
        <h1 className="text-4xl font-heading font-bold text-[#f5f0eb] mb-2">{title}</h1>
        <p className="text-lg text-white/70 mb-12 max-w-sm font-body">{subtitle}</p>

        <div className="space-y-8 text-left w-full max-w-sm">
          {items.map((feat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <feat.icon className="text-xl text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight text-white">{feat.title}</h3>
                {feat.desc && <p className="text-sm text-white/70">{feat.desc}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { FaFire } from "react-icons/fa";

export const AuthCardHeader = ({ title, subtitle, iconSize = "text-2xl", wrapperSize = "w-16 h-16" }) => {
  return (
    <div className="flex flex-col items-center mb-8 text-center">
      <div className={`${wrapperSize} rounded-full glass flex items-center justify-center mb-4 relative`}>
        <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-md" />
        <FaFire className={`${iconSize} text-orange-400 relative z-10`} />
      </div>
      <h2 className="text-3xl font-heading font-bold text-[#f5f0eb] mb-1.5">{title}</h2>
      <p className="text-white/40 text-sm font-body">{subtitle}</p>
    </div>
  );
};

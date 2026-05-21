export const FeatureCard = ({ icon: Icon, title, desc, accent }) => (
  <div className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-xl ${accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300`}>
        <Icon className="text-2xl text-orange-400" />
      </div>
      <h3 className="text-xl font-heading font-bold text-[#f5f0eb] mb-3">{title}</h3>
      <p className="text-white/50 font-body leading-relaxed text-sm">{desc}</p>
    </div>
  </div>
);

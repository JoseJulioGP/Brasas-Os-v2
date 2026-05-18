export const AuthFormHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center mb-10 text-center animate-fade-in-up opacity-0">
    <div className="w-16 h-16 glass rounded-full flex items-center justify-center mb-4">
      <Icon className="text-3xl text-orange-400" />
    </div>
    <h2 className="text-4xl font-heading font-bold text-[#f5f0eb] mb-2">{title}</h2>
    <p className="text-white/50 font-body">{subtitle}</p>
  </div>
);

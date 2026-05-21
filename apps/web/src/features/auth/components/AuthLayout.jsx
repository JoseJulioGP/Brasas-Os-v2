export const AuthLayout = ({ children, brandPanel }) => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-noise pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent animate-gradient-shift pointer-events-none" />
    <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-[#111110] rounded-3xl shadow-2xl overflow-hidden min-h-[700px] border border-white/[0.06] relative z-10">
      {brandPanel}
      <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-[#0a0a0a] relative">
        {children}
      </div>
    </div>
  </div>
);

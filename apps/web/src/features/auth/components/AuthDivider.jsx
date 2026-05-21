export const AuthDivider = ({ text = "o continúa con" }) => (
  <div className="flex items-center gap-4 my-8 max-w-md mx-auto w-full">
    <div className="flex-1 h-px bg-white/[0.06]" />
    <span className="text-sm text-white/30 font-medium font-body">{text}</span>
    <div className="flex-1 h-px bg-white/[0.06]" />
  </div>
);

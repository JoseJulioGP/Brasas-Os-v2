export const AuthBackground = ({ circles }) => {
  return (
    <>
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/20 via-transparent to-transparent animate-gradient-shift" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,88,12,0.08),transparent_70%)]" />
      {circles?.map((circle, i) => (
        <div key={i} className={`${circle} pointer-events-none`} />
      ))}
    </>
  );
};

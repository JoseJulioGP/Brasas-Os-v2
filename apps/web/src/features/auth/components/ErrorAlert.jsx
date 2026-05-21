export const ErrorAlert = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-body animate-fade-in max-w-md mx-auto w-full">
      {error}
    </div>
  );
};

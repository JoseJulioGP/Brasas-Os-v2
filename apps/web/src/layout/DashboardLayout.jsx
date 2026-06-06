import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="lg:pl-[240px] min-h-screen pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
};

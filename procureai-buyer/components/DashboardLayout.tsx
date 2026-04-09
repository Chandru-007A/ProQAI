import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "buyer" | "vendor";
}

export default function DashboardLayout({ children, role = "buyer" }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-subtle)" }}>
      <Sidebar role={role} />
      <main
        className="flex-1 flex flex-col"
        style={{ marginLeft: "var(--sidebar-width)" }}
      >
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

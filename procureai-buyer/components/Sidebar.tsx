"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  BarChart3,
  ShoppingCart,
  X,
  Menu,
  LogOut,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const buyerNav = [
  { href: "/dashboard",       label: "Dashboard",  icon: LayoutDashboard },
  { href: "/inventory",       label: "Inventory",  icon: Package },
  { href: "/rfq",             label: "RFQ",        icon: FileText },
  { href: "/analysis",        label: "AI Analysis",icon: BarChart3 },
];

const vendorNav = [
  { href: "/vendor-dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/vendor-rfqs",      label: "RFQs",       icon: ShoppingCart },
];

interface SidebarProps {
  role?: "buyer" | "vendor";
}

export default function Sidebar({ role = "buyer" }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = role === "vendor" ? vendorNav : buyerNav;

  const handleLogout = () => {
    router.push("/");
  };

  const SidebarContent = () => (
    <aside className="sidebar animate-slide-left">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--primary)" }}
          >
            <Cpu size={16} color="#fff" />
          </div>
          <div>
            <p className="text-sm font-700 tracking-tight" style={{ color: "var(--fg)", fontWeight: 700 }}>
              ProQ<span style={{ color: "var(--primary)" }}>.AI</span>
            </p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 rounded"
          style={{ color: "var(--fg-muted)" }}
          aria-label="Close Sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Role Badge */}
      <div className="px-5 py-3">
        <span
          className={clsx("badge text-xs", role === "vendor" ? "badge-cyan" : "badge-blue")}
        >
          {role === "vendor" ? "Vendor Portal" : "Buyer Portal"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx("sidebar-link group", active && "active")}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {active && (
                <ChevronRight size={14} style={{ opacity: 0.5 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[var(--border)]">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-left"
          style={{ color: "var(--danger)" }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 btn btn-secondary btn-sm p-2"
        aria-label="Open Sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-30"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden fixed inset-y-0 left-0 z-40">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}

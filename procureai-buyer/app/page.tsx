import Link from "next/link";
import {
  Cpu,
  ArrowRight,
  Zap,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  Users,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: <Zap size={22} />,
    title: "AI-Powered RFQ",
    desc: "Auto-generate optimized RFQs based on inventory levels and demand predictions.",
    color: "var(--primary)",
    bg: "var(--primary-light)",
  },
  {
    icon: <BarChart2 size={22} />,
    title: "Smart Vendor Analysis",
    desc: "AI compares bids on price, quality, and delivery to surface the best vendor instantly.",
    color: "var(--success)",
    bg: "var(--success-light)",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "Cost Savings Tracking",
    desc: "Live dashboards visualize cost reductions and procurement performance across every order.",
    color: "var(--warning)",
    bg: "var(--warning-light)",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Approval Workflows",
    desc: "Built-in company approval gates before any RFQ is dispatched to vendors.",
    color: "var(--info)",
    bg: "var(--info-light)",
  },
  {
    icon: <Users size={22} />,
    title: "Vendor Portal",
    desc: "Dedicated portal for vendors to receive RFQs, get AI quote suggestions, and submit bids.",
    color: "var(--primary)",
    bg: "var(--primary-light)",
  },
  {
    icon: <FileText size={22} />,
    title: "Inventory Intelligence",
    desc: "Continuous AI monitoring detects low stock early and triggers replenishment workflows.",
    color: "var(--success)",
    bg: "var(--success-light)",
  },
];

const flow = [
  "Add Inventory",
  "AI Monitoring",
  "Demand Prediction",
  "RFQ Generation",
  "Company Approval",
  "Vendor Quotes",
  "AI Analysis",
  "Best Vendor",
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* ── Nav Bar ── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-8 py-4"
        style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Cpu size={16} color="#fff" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            ProQ<span style={{ color: "var(--primary)" }}>.AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn btn-secondary btn-sm">Sign In</Link>
          <Link href="/login" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="px-6 py-20 text-center animate-fade-in" style={{ background: "var(--bg)" }}>
          <div className="max-w-3xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "var(--primary-light)", color: "var(--primary)" }}
            >
              <Zap size={12} />
              AI-Powered Procurement Platform
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-5" style={{ color: "var(--fg)" }}>
              Smarter Procurement,{" "}
              <span style={{ color: "var(--primary)" }}>Powered by AI</span>
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: "var(--fg-muted)" }}>
              ProQ.AI automates your entire procurement lifecycle — from inventory monitoring and
              demand prediction to AI-driven vendor selection and cost optimization.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/login"
                className="btn btn-primary btn-lg"
                style={{ fontSize: 15 }}
              >
                Buyer Portal <ArrowRight size={16} />
              </Link>
              <Link
                href="/login?role=vendor"
                className="btn btn-outline btn-lg"
                style={{ fontSize: 15 }}
              >
                Vendor Portal
              </Link>
            </div>
          </div>
        </section>

        {/* ── Flow ── */}
        <section
          className="px-6 py-12"
          style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: "var(--fg-muted)" }}>
              End-to-End Procurement Flow
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {flow.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className="px-4 py-2 rounded-full text-sm font-medium animate-fade-in"
                    style={{
                      background: i === 0 || i === flow.length - 1 ? "var(--primary)" : "var(--bg)",
                      color: i === 0 || i === flow.length - 1 ? "#fff" : "var(--fg)",
                      border: "1.5px solid var(--border)",
                      animationDelay: `${i * 0.06}s`,
                    }}
                  >
                    {step}
                  </div>
                  {i < flow.length - 1 && (
                    <ArrowRight size={14} style={{ color: "var(--fg-subtle)", flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Portal Cards ── */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--fg)" }}>
              Choose Your Portal
            </h2>
            <p className="text-center mb-10 text-sm" style={{ color: "var(--fg-muted)" }}>
              Two role-based experiences tailored to buyers and vendors
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buyer */}
              <div className="card-base card-hover p-8 animate-fade-in stagger-1">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "var(--primary-light)" }}
                >
                  <BarChart2 size={24} style={{ color: "var(--primary)" }} />
                </div>
                <h3 className="text-xl font-bold mb-2">Buyer Portal</h3>
                <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
                  Manage inventory, generate RFQs, approve purchase orders, and let AI pick
                  the best vendor — all in one place.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Inventory Management", "AI-Driven RFQ Generation", "Approval Workflows", "Vendor Analysis & Comparison"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                      <span style={{ color: "var(--success)", fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="btn btn-primary w-full">
                  Enter Buyer Portal <ArrowRight size={15} />
                </Link>
              </div>

              {/* Vendor */}
              <div className="card-base card-hover p-8 animate-fade-in stagger-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "var(--info-light)" }}
                >
                  <Users size={24} style={{ color: "var(--info)" }} />
                </div>
                <h3 className="text-xl font-bold mb-2">Vendor Portal</h3>
                <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
                  Receive RFQ notifications, get AI-powered pricing suggestions, and submit
                  competitive bids with ease.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Real-time RFQ Notifications", "AI Quote Suggestions", "Bid Submission", "Win Rate Analytics"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                      <span style={{ color: "var(--success)", fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login?role=vendor" className="btn btn-outline w-full">
                  Enter Vendor Portal <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section className="px-6 py-16" style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">Everything You Need</h2>
            <p className="text-center text-sm mb-10" style={{ color: "var(--fg-muted)" }}>
              Built for modern procurement teams
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="card-base card-hover p-6 animate-fade-in"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: f.bg, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer
        className="px-8 py-6 flex items-center justify-between flex-wrap gap-3 text-sm"
        style={{ borderTop: "1px solid var(--border)", color: "var(--fg-muted)" }}
      >
        <span>© 2025 ProQ.AI — Intelligent Procurement</span>
        <span>Contact admin for account access</span>
      </footer>
    </div>
  );
}

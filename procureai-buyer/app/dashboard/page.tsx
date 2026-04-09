"use client";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import {
  FileText, DollarSign, ShoppingCart, Users,
  AlertTriangle, Plus, Package, BarChart3, Clock,
  CheckCircle, Bell, Truck,
} from "lucide-react";

const stats = [
  {
    icon: <FileText size={18} style={{ color: "var(--primary)" }} />,
    label: "Active RFQs",
    value: "12",
    delta: "3 this week",
    deltaPositive: true,
    iconBg: "var(--primary-light)",
  },
  {
    icon: <DollarSign size={18} style={{ color: "var(--success)" }} />,
    label: "Cost Savings (MTD)",
    value: "₹2.4L",
    delta: "12.5%",
    deltaPositive: true,
    iconBg: "var(--success-light)",
  },
  {
    icon: <ShoppingCart size={18} style={{ color: "var(--warning)" }} />,
    label: "Total Orders",
    value: "48",
    delta: "8",
    deltaPositive: true,
    iconBg: "var(--warning-light)",
  },
  {
    icon: <Users size={18} style={{ color: "var(--info)" }} />,
    label: "Active Vendors",
    value: "24",
    delta: "2",
    deltaPositive: true,
    iconBg: "var(--info-light)",
  },
];

const activities = [
  { icon: <FileText size={14} />, color: "var(--primary)", bg: "var(--primary-light)", text: "New RFQ #RFQ-2025-041 created for Office Supplies", time: "2 min ago" },
  { icon: <AlertTriangle size={14} />, color: "var(--warning)", bg: "var(--warning-light)", text: "Low stock alert: Printer Paper (A4) — only 12 reams left", time: "15 min ago" },
  { icon: <CheckCircle size={14} />, color: "var(--success)", bg: "var(--success-light)", text: "Bid accepted from TechVendors Co. for IT Equipment RFQ", time: "1 hr ago" },
  { icon: <Truck size={14} />, color: "var(--info)", bg: "var(--info-light)", text: "Order #ORD-004 dispatched by Global Supplies Ltd.", time: "3 hr ago" },
  { icon: <Bell size={14} />, color: "var(--danger)", bg: "var(--danger-light)", text: "RFQ #RFQ-2025-038 expires in 24 hours — 2 bids pending", time: "5 hr ago" },
  { icon: <CheckCircle size={14} />, color: "var(--success)", bg: "var(--success-light)", text: "AI selected PrimeStar Traders as best vendor for Stationery", time: "Yesterday" },
];

const alerts = [
  { text: "Printer Paper A4 — low stock", type: "warning" },
  { text: "RFQ #038 expires tomorrow", type: "danger" },
  { text: "3 bids awaiting review", type: "info" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="Buyer Dashboard"
        subtitle="Overview of your procurement activities"
        actions={
          <Link href="/rfq" className="btn btn-primary btn-sm">
            <Plus size={14} /> New RFQ
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.06} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 card-base animate-fade-in stagger-3">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-semibold text-sm">Recent Activity</h2>
            <span className="text-xs" style={{ color: "var(--fg-muted)" }}>Last 24 hours</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {activities.map((a, i) => (
              <div
                key={i}
                className="px-5 py-3.5 flex items-start gap-3 hover:bg-[var(--bg-subtle)] transition-colors animate-fade-in"
                style={{ animationDelay: `${0.15 + i * 0.05}s` }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: a.bg, color: a.color }}
                >
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug" style={{ color: "var(--fg)" }}>{a.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--fg-subtle)" }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Alerts */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="card-base animate-fade-in stagger-4">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <h2 className="font-semibold text-sm">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              <Link href="/rfq" className="btn btn-primary w-full">
                <Plus size={14} /> Create RFQ
              </Link>
              <Link href="/inventory" className="btn btn-secondary w-full">
                <Package size={14} /> View Inventory
              </Link>
              <Link href="/dashboard" className="btn btn-secondary w-full">
                <Users size={14} /> Manage Vendors
              </Link>
              <Link href="/analysis" className="btn btn-secondary w-full">
                <BarChart3 size={14} /> View Analytics
              </Link>
            </div>
          </div>

          {/* Alerts */}
          <div className="card-base animate-fade-in stagger-5">
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
              <AlertTriangle size={14} style={{ color: "var(--warning)" }} />
              <h2 className="font-semibold text-sm">Alerts</h2>
              <span
                className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--danger-light)", color: "var(--danger)" }}
              >
                {alerts.length}
              </span>
            </div>
            <div className="p-4 space-y-2">
              {alerts.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: a.type === "warning" ? "var(--warning-light)" : a.type === "danger" ? "var(--danger-light)" : "var(--info-light)",
                    color: a.type === "warning" ? "#b45309" : a.type === "danger" ? "var(--danger)" : "#0e7490",
                  }}
                >
                  <Clock size={13} />
                  {a.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

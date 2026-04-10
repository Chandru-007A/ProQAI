"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import {
  FileText, DollarSign, ShoppingCart, Users,
  AlertTriangle, Plus, Package, BarChart3, Clock,
  CheckCircle, Bell, Truck,
} from "lucide-react";

export default function DashboardPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rfq")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRfqs(data);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: string) => {
    await fetch(`/api/rfq/${id}/approve`, { method: "POST" });
    // Refresh
    const res = await fetch("/api/rfq");
    const data = await res.json();
    if (Array.isArray(data)) setRfqs(data);
  };

  const activeRfqs = rfqs.filter(r => r.status !== "CLOSED").length;
  const inReviewRfqs = rfqs.filter(r => r.status === "REVIEW");
  
  const stats = [
    {
      icon: <FileText size={18} style={{ color: "var(--primary)" }} />,
      label: "Active RFQs",
      value: activeRfqs.toString(),
      delta: "Auto-updated",
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
      label: "Pending Approvals",
      value: inReviewRfqs.length.toString(),
      delta: "Needs action",
      deltaPositive: false,
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
        {/* RFQ List */}
        <div className="lg:col-span-2 card-base animate-fade-in stagger-3">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-semibold text-sm">Recent RFQs</h2>
            <Link href="/analysis" className="text-xs text-blue-600 hover:underline">View All Analysis</Link>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {loading ? (
              <div className="px-5 py-8 text-center text-sm" style={{ color: "var(--fg-muted)" }}>Loading RFQs...</div>
            ) : rfqs.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm" style={{ color: "var(--fg-muted)" }}>No RFQs found</div>
            ) : (
              rfqs.slice(0, 10).map((rfq, i) => (
                <div
                  key={rfq.id}
                  className="px-5 py-4 flex items-start gap-4 hover:bg-[var(--bg-subtle)] transition-colors animate-fade-in"
                  style={{ animationDelay: `${0.15 + i * 0.05}s` }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: rfq.status === "REVIEW" ? "var(--warning-light)" : "var(--primary-light)", color: rfq.status === "REVIEW" ? "var(--warning)" : "var(--primary)" }}
                  >
                    {rfq.status === "REVIEW" ? <AlertTriangle size={16} /> : <FileText size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm leading-snug" style={{ color: "var(--fg)" }}>{rfq.title}</p>
                      <span className="badge text-[10px] ml-2" style={{ background: rfq.status === "REVIEW" ? "var(--warning-light)" : "var(--bg-muted)" }}>{rfq.status}</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--fg-subtle)" }}>
                      {rfq.items?.length || 0} items · {new Date(rfq.createdAt).toLocaleDateString()}
                    </p>
                    {rfq.status === "REVIEW" && (
                      <div className="mt-3">
                         <button onClick={() => handleApprove(rfq.id)} className="btn btn-primary btn-sm">
                           <CheckCircle size={14} /> Approve & Send to Vendors
                         </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
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
              <Link href="/analysis" className="btn btn-secondary w-full">
                <BarChart3 size={14} /> View Analysis & Bids
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

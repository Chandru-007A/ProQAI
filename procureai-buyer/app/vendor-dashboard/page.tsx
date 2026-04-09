"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import {
  ShoppingCart, Clock, TrendingUp, Star,
  CheckCircle, XCircle, Send, Cpu, ChevronDown, ChevronUp,
} from "lucide-react";

const stats = [
  { icon: <ShoppingCart size={18} style={{ color: "var(--primary)" }} />, label: "RFQs Received",  value: "18",   delta: "4 this week", deltaPositive: true,  iconBg: "var(--primary-light)" },
  { icon: <Clock        size={18} style={{ color: "var(--warning)" }} />, label: "Pending Bids",   value: "5",    delta: "2",           deltaPositive: false, iconBg: "var(--warning-light)" },
  { icon: <TrendingUp   size={18} style={{ color: "var(--success)" }} />, label: "Win Rate",       value: "68%",  delta: "5%",          deltaPositive: true,  iconBg: "var(--success-light)" },
  { icon: <Star         size={18} style={{ color: "var(--info)"   }} />, label: "Avg Response",    value: "4.2h", delta: "0.8h",        deltaPositive: true,  iconBg: "var(--info-light)"    },
];

interface RFQItem {
  id: string;
  title: string;
  buyer: string;
  budget: string;
  deadline: string;
  status: "New" | "Bidding" | "Submitted" | "Won" | "Lost";
  items: string[];
  aiSuggestion: string;
  suggestedPrice: string;
}

const rfqs: RFQItem[] = [
  {
    id: "RFQ-2025-041",
    title: "Q2 Office Stationery",
    buyer: "Acme Corp.",
    budget: "₹60,000",
    deadline: "Apr 15, 2025",
    status: "New",
    items: ["Printer Paper A4 × 200", "Sticky Notes × 50", "Markers × 30"],
    aiSuggestion: "Based on market rates and your cost structure, bid ₹47,500 for highest win probability.",
    suggestedPrice: "47500",
  },
  {
    id: "RFQ-2025-039",
    title: "IT Equipment Refresh",
    buyer: "GlobalTech Ltd.",
    budget: "₹2,00,000",
    deadline: "Apr 18, 2025",
    status: "Bidding",
    items: ["USB-C Hub × 20", "Laptop Stands × 15", "Keyboards × 25"],
    aiSuggestion: "Competitor avg is ₹1,82,000. Suggest bidding ₹1,75,000 with express delivery to win.",
    suggestedPrice: "175000",
  },
  {
    id: "RFQ-2025-038",
    title: "Hygiene & Consumables",
    buyer: "ProCure Industries",
    budget: "₹35,000",
    deadline: "Apr 12, 2025",
    status: "Submitted",
    items: ["Hand Sanitizer 5L × 10", "Tissue Paper × 30"],
    aiSuggestion: "Your bid is competitive. Delivery time is the key differentiator — confirm within 3 days.",
    suggestedPrice: "32000",
  },
];

export default function VendorDashboardPage() {
  const [expandedRfq, setExpandedRfq] = useState<string | null>("RFQ-2025-041");
  const [bids, setBids] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string[]>([]);

  const statusStyle: Record<string, { color: string; bg: string }> = {
    New:       { color: "var(--primary)", bg: "var(--primary-light)" },
    Bidding:   { color: "#b45309",        bg: "var(--warning-light)" },
    Submitted: { color: "var(--success)",  bg: "var(--success-light)" },
    Won:       { color: "var(--success)",  bg: "var(--success-light)" },
    Lost:      { color: "var(--danger)",   bg: "var(--danger-light)"  },
  };

  return (
    <DashboardLayout role="vendor">
      <PageHeader
        title="Vendor Dashboard"
        subtitle="Manage incoming RFQs and submit competitive quotes"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.06} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFQ List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-sm animate-fade-in" style={{ color: "var(--fg-muted)" }}>
            Active RFQs — {rfqs.length} available
          </h2>
          {rfqs.map((rfq, i) => {
            const expanded = expandedRfq === rfq.id;
            const isSubmitted = submitted.includes(rfq.id);
            const s = statusStyle[rfq.status];

            return (
              <div
                key={rfq.id}
                className="card-base animate-fade-in"
                style={{ animationDelay: `${0.1 + i * 0.07}s` }}
              >
                <button
                  onClick={() => setExpandedRfq(expanded ? null : rfq.id)}
                  className="w-full px-5 py-4 flex items-start justify-between gap-3 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{rfq.title}</span>
                      <span className="badge" style={{ background: s.bg, color: s.color }}>
                        {rfq.status}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
                      {rfq.id} · {rfq.buyer} · Budget: {rfq.budget} · Due: {rfq.deadline}
                    </p>
                  </div>
                  {expanded ? <ChevronUp size={16} style={{ color: "var(--fg-muted)", flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: "var(--fg-muted)", flexShrink: 0 }} />}
                </button>

                {expanded && (
                  <div
                    className="px-5 pb-5"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    {/* Items */}
                    <div className="pt-4 mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>
                        Required Items
                      </p>
                      <ul className="space-y-1.5">
                        {rfq.items.map(item => (
                          <li key={item} className="flex items-center gap-2 text-sm">
                            <span style={{ color: "var(--border-strong)" }}>•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Suggestion */}
                    <div
                      className="p-3 rounded-lg mb-4 flex items-start gap-3"
                      style={{ background: "var(--primary-light)", border: "1px solid var(--primary-muted)" }}
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--primary)" }}
                      >
                        <Cpu size={13} color="#fff" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--primary)" }}>AI Suggestion</p>
                        <p className="text-xs leading-snug" style={{ color: "var(--fg)" }}>{rfq.aiSuggestion}</p>
                      </div>
                    </div>

                    {/* Quote Submission */}
                    {isSubmitted ? (
                      <div
                        className="p-3 rounded-lg flex items-center gap-2"
                        style={{ background: "var(--success-light)", color: "var(--success)" }}
                      >
                        <CheckCircle size={15} />
                        <span className="text-sm font-medium">
                          Quote submitted: ₹{parseInt(bids[rfq.id] || rfq.suggestedPrice).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="label-base">Your Bid Price (₹)</label>
                          <input
                            type="number"
                            className="input-base"
                            placeholder={rfq.suggestedPrice}
                            value={bids[rfq.id] ?? rfq.suggestedPrice}
                            onChange={e => setBids(prev => ({ ...prev, [rfq.id]: e.target.value }))}
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <button
                            onClick={() => setSubmitted(prev => [...prev, rfq.id])}
                            className="btn btn-primary"
                          >
                            <Send size={14} /> Submit
                          </button>
                          <button className="btn btn-danger">
                            <XCircle size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Performance Sidebar */}
        <div className="space-y-5">
          {/* Win Rate */}
          <div className="card-base p-5 animate-fade-in stagger-2">
            <h2 className="font-semibold text-sm mb-4">Performance</h2>
            <div className="space-y-4">
              {[
                { label: "Win Rate",         value: 68, color: "var(--success)" },
                { label: "On-Time Delivery", value: 94, color: "var(--primary)" },
                { label: "Quality Score",    value: 91, color: "var(--info)"    },
                { label: "Response Rate",    value: 87, color: "var(--warning)" },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--fg-muted)" }}>
                    <span>{m.label}</span>
                    <span className="font-semibold" style={{ color: "var(--fg)" }}>{m.value}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "var(--bg-muted)" }}>
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${m.value}%`, background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-base p-4 animate-fade-in stagger-3">
            <h2 className="font-semibold text-sm mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <button className="btn btn-primary w-full btn-sm">
                <ShoppingCart size={14} /> View All RFQs
              </button>
              <button className="btn btn-secondary w-full btn-sm">
                <TrendingUp size={14} /> My Analytics
              </button>
            </div>
          </div>

          {/* AI Tip */}
          <div
            className="card-base p-4 animate-fade-in stagger-4"
            style={{ background: "var(--primary-light)", borderColor: "var(--primary)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={14} style={{ color: "var(--primary)" }} />
              <p className="text-xs font-semibold" style={{ color: "var(--primary)" }}>AI Tip</p>
            </div>
            <p className="text-xs leading-snug" style={{ color: "var(--fg)" }}>
              Vendors who respond within 6 hours have a 2.4× higher win rate. You have 2 RFQs
              closing today — act now!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

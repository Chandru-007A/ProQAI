"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import {
  ShoppingCart, Clock, TrendingUp, Star,
  CheckCircle, XCircle, Send, Cpu, ChevronDown, ChevronUp,
} from "lucide-react";

export default function VendorDashboardPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [bidsMap, setBidsMap] = useState<Record<string, any>>({});
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const [expandedRfq, setExpandedRfq] = useState<string | null>(null);
  const [bidsInput, setBidsInput] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch RFQs assigned to vendor
    fetch("/api/rfq")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRfqs(data);
        setLoading(false);
      });

    // Fetch existing bids by vendor
    fetch("/api/bids")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const bMap: any = {};
          data.forEach(b => { bMap[b.rfqId] = b; });
          setBidsMap(bMap);
        }
      });
  }, []);

  const getAiSuggestion = async (rfqId: string) => {
    if (aiSuggestions[rfqId]) return;
    setAiSuggestions(prev => ({ ...prev, [rfqId]: "Generating suggestion..." }));
    
    try {
      const res = await fetch("/api/ai/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfqId })
      });
      const data = await res.json();
      setAiSuggestions(prev => ({ ...prev, [rfqId]: data.suggestion || "Try bidding competitively for an edge." }));
      if (data.recommendedPrice) {
        setBidsInput(prev => ({ ...prev, [rfqId]: data.recommendedPrice }));
      }
    } catch (e) {
      setAiSuggestions(prev => ({ ...prev, [rfqId]: "Failed to generate suggestion." }));
    }
  };

  const submitBid = async (rfqId: string) => {
    const price = bidsInput[rfqId];
    if (!price) return;

    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfqId, price })
      });
      const data = await res.json();
      if (res.ok) {
        setBidsMap(prev => ({ ...prev, [rfqId]: data }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const stats = [
    { icon: <ShoppingCart size={18} style={{ color: "var(--primary)" }} />, label: "RFQs Received",  value: rfqs.length.toString(),   delta: "Updated", deltaPositive: true,  iconBg: "var(--primary-light)" },
    { icon: <Clock        size={18} style={{ color: "var(--warning)" }} />, label: "Pending Bids",   value: (rfqs.length - Object.keys(bidsMap).length).toString(),    delta: "-",           deltaPositive: false, iconBg: "var(--warning-light)" },
    { icon: <TrendingUp   size={18} style={{ color: "var(--success)" }} />, label: "Win Rate",       value: "68%",  delta: "5%",          deltaPositive: true,  iconBg: "var(--success-light)" },
    { icon: <Star         size={18} style={{ color: "var(--info)"   }} />, label: "Avg Response",    value: "4.2h", delta: "0.8h",        deltaPositive: true,  iconBg: "var(--info-light)"    },
  ];

  const statusStyle: Record<string, { color: string; bg: string }> = {
    SENT:      { color: "var(--primary)", bg: "var(--primary-light)" },
    CLOSED:      { color: "var(--danger)",   bg: "var(--danger-light)"  },
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
          
          {loading ? <p className="text-sm">Loading...</p> : rfqs.map((rfq, i) => {
            const expanded = expandedRfq === rfq.id;
            const existingBid = bidsMap[rfq.id];
            const s = statusStyle[rfq.status] || { color: "gray", bg: "#f0f0f0" };

            return (
              <div
                key={rfq.id}
                className="card-base animate-fade-in"
                style={{ animationDelay: `${0.1 + i * 0.07}s` }}
              >
                <button
                  onClick={() => {
                    setExpandedRfq(expanded ? null : rfq.id);
                  }}
                  className="w-full px-5 py-4 flex items-start justify-between gap-3 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{rfq.title}</span>
                      <span className="badge" style={{ background: s.bg, color: s.color }}>
                        {rfq.status}
                      </span>
                      {existingBid && <span className="badge badge-green text-[10px]">Submitted</span>}
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
                      Budget: ₹{rfq.budget} · Due: {new Date(rfq.deadline || new Date()).toLocaleDateString()}
                    </p>
                  </div>
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {expanded && (
                  <div className="px-5 pb-5" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="pt-4 mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--fg-muted)" }}>Required Items</p>
                      <ul className="space-y-1.5">
                        {rfq.items.map((item: any) => (
                          <li key={item.id} className="flex items-center gap-2 text-sm">
                            <span style={{ color: "var(--border-strong)" }}>•</span> {item.name} × {item.qty} {item.unit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <button onClick={() => getAiSuggestion(rfq.id)} className="btn btn-sm btn-outline mb-2">
                        <Cpu size={14} /> Get AI Bid Suggestion
                      </button>
                      {aiSuggestions[rfq.id] && (
                        <div className="p-3 rounded-lg flex items-start flex-col gap-2" style={{ background: "var(--primary-light)", border: "1px solid var(--primary-muted)" }}>
                          <p className="text-xs">{aiSuggestions[rfq.id]}</p>
                        </div>
                      )}
                    </div>

                    {existingBid ? (
                      <div className="p-3 rounded-lg flex items-center gap-2" style={{ background: "var(--success-light)", color: "var(--success)" }}>
                        <CheckCircle size={15} />
                        <span className="text-sm font-medium">Quote submitted: ₹{existingBid.price.toLocaleString("en-IN")}</span>
                        {existingBid.aiScore && <span className="badge badge-gray text-xs ml-auto">Rank {existingBid.aiRank} - Score {existingBid.aiScore}</span>}
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="label-base">Your Bid Price (₹)</label>
                          <input
                            type="number"
                            className="input-base"
                            placeholder={"Enter price"}
                            value={bidsInput[rfq.id] || ""}
                            onChange={e => setBidsInput(prev => ({ ...prev, [rfq.id]: e.target.value }))}
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <button onClick={() => submitBid(rfq.id)} className="btn btn-primary">
                            <Send size={14} /> Submit
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
                    <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${m.value}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Trophy, Award, TrendingDown, RefreshCw } from "lucide-react";

export default function AnalysisPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [selectedRfqId, setSelectedRfqId] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetch("/api/rfq")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sentRfqs = data.filter(r => r.status === "SENT" || r.status === "CLOSED");
          setRfqs(sentRfqs);
          if (sentRfqs.length > 0) {
            setSelectedRfqId(sentRfqs[0].id);
          }
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedRfqId) {
      loadAnalysis();
    }
  }, [selectedRfqId]);

  const loadAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/analysis/${selectedRfqId}`);
      const data = await res.json();
      setAnalysisData(data);
    } catch (e) {
      console.error(e);
    }
    setAnalyzing(false);
  };

  const trendData = [
    { month: "Oct", savings: 18000 },
    { month: "Nov", savings: 22000 },
    { month: "Dec", savings: 19500 },
    { month: "Jan", savings: 28000 },
    { month: "Feb", savings: 31000 },
    { month: "Mar", savings: 27500 },
    { month: "Apr", savings: 35000 },
  ];

  const pieData = [
    { name: "Excellent (>92%)", value: 40, color: "var(--primary)" },
    { name: "Good (80–92%)",    value: 45, color: "var(--info)"    },
    { name: "Fair (<80%)",      value: 15, color: "var(--danger)"  },
  ];

  if (loading) return <DashboardLayout role="buyer"><div className="p-8">Loading...</div></DashboardLayout>;

  if (rfqs.length === 0) return <DashboardLayout role="buyer"><div className="p-8">No RFQs available for analysis. Appove and send some RFQs first!</div></DashboardLayout>;

  const bids = analysisData?.bids || [];
  const winner = analysisData?.winner;
  const recommendation = analysisData?.recommendation;

  const barData = bids.map((v: any) => ({ name: v.vendor.name.split(" ")[0], price: v.price }));

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="AI Analysis"
        subtitle="Vendor quote comparison and AI-powered best-value recommendation"
      />

      <div className="mb-6 flex gap-4 items-center animate-fade-in">
        <label className="text-sm font-semibold">Select RFQ:</label>
        <select
          className="input-base max-w-xs"
          value={selectedRfqId}
          onChange={(e) => setSelectedRfqId(e.target.value)}
        >
          {rfqs.map(r => (
            <option key={r.id} value={r.id}>{r.title} ({r._count?.bids || 0} bids)</option>
          ))}
        </select>
        <button onClick={loadAnalysis} className="btn btn-secondary btn-sm" disabled={analyzing}>
          <RefreshCw size={14} className={analyzing ? "animate-spin" : ""} /> Refresh Analysis
        </button>
      </div>

      {analyzing ? (
        <div className="p-10 text-center animate-pulse">Running AI Analysis on Bids...</div>
      ) : bids.length === 0 ? (
        <div className="p-10 text-center text-gray-500 card-base">No bids received yet for this RFQ.</div>
      ) : (
        <>
          {/* AI Recommendation */}
          <div
            className="card-base p-5 mb-6 animate-fade-in flex items-start gap-4"
            style={{ background: "var(--primary-light)", borderColor: "var(--primary)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--primary)" }}
            >
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--primary)" }}>
                AI Recommendation
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--fg)" }}>
                {recommendation}
              </p>
            </div>
          </div>

          {/* Winner Card */}
          {winner && (
            <div className="card-base p-6 mb-6 animate-fade-in stagger-1 ai-glow">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--primary-light)" }}
                  >
                    <Trophy size={22} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--fg-muted)" }}>
                      Best Value Vendor
                    </p>
                    <h2 className="text-xl font-bold" style={{ color: "var(--fg)" }}>{winner.vendor.name}</h2>
                  </div>
                </div>
                <span className="badge badge-blue text-sm px-3 py-1.5">
                  🏆 Best Value
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className="p-4 rounded-xl text-center"
                  style={{ background: "var(--bg-subtle)", border: "1.5px solid var(--border)" }}
                >
                  <p className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                    ₹{winner.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>Bid Price</p>
                </div>
                <div
                  className="p-4 rounded-xl text-center"
                  style={{ background: "var(--bg-subtle)", border: "1.5px solid var(--border)" }}
                >
                  <p className="text-2xl font-bold" style={{ color: "var(--success)" }}>
                    {winner.qualityScore}%
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>Quality Score</p>
                </div>
                <div
                  className="p-4 rounded-xl text-center"
                  style={{ background: "var(--success-light)", border: "1.5px solid var(--success)" }}
                >
                  <p className="text-2xl font-bold" style={{ color: "var(--success)" }}>
                    ₹{winner.savings?.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>Est. Savings</p>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Comparison Table */}
          <div className="card-base mb-6 overflow-hidden animate-fade-in stagger-2">
            <div className="px-5 py-4 border-b border-[var(--border)]">
              <h2 className="font-semibold text-sm">Vendor Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Vendor</th>
                    <th>Bid Price</th>
                    <th>Quality</th>
                    <th>Delivery</th>
                    <th>Rating</th>
                    <th>Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((v: any, i: number) => (
                    <tr
                      key={v.id}
                      style={{
                        background: i === 0 ? "var(--primary-light)" : undefined,
                        animationDelay: `${i * 0.06}s`,
                      }}
                      className="animate-fade-in"
                    >
                      <td className="font-bold">{v.aiRank || i+1}</td>
                      <td>
                        <div className="flex items-center gap-2 font-medium">
                          {i === 0 && <Award size={14} style={{ color: "var(--primary)" }} />}
                          {v.vendor.name}
                        </div>
                      </td>
                      <td className="font-semibold">₹{v.price.toLocaleString("en-IN")}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: 60, background: "var(--border)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${v.qualityScore}%`, background: v.qualityScore > 92 ? "var(--success)" : "var(--primary)" }}
                            />
                          </div>
                          <span className="text-sm">{v.qualityScore}%</span>
                        </div>
                      </td>
                      <td>{v.deliveryDays} Days</td>
                      <td>⭐ {v.vendor.rating}</td>
                      <td>
                        <div className="flex items-center gap-1" style={{ color: "var(--success)" }}>
                          <TrendingDown size={13} />
                          <span className="font-medium text-sm">₹{v.savings?.toLocaleString("en-IN")}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Price Comparison Bar */}
            <div className="card-base p-5 animate-fade-in stagger-3">
              <h2 className="font-semibold text-sm mb-5">Price Comparison</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--fg-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--fg-muted)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Bid"]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }}
                  />
                  <Bar dataKey="price" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Savings Trend */}
            <div className="card-base p-5 animate-fade-in stagger-4">
              <h2 className="font-semibold text-sm mb-5">Monthly Savings Trend (Mock)</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--fg-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--fg-muted)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Savings"]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="var(--success)"
                    strokeWidth={3}
                    dot={{ fill: "var(--success)", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

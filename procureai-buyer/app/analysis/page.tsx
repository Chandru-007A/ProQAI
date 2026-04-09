"use client";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Trophy, Award, TrendingDown } from "lucide-react";

const vendors = [
  { name: "PrimeStar Traders",    bid: 47500, quality: 96, delivery: 98, rating: 4.8, status: "Winner",    savings: 12500 },
  { name: "TechVendors Co.",      bid: 52000, quality: 91, delivery: 94, rating: 4.6, status: "Runner-up",  savings: 8000  },
  { name: "Global Supplies Ltd.", bid: 55000, quality: 88, delivery: 90, rating: 4.4, status: "Reviewed",   savings: 5000  },
  { name: "BestBuy Wholesale",    bid: 58500, quality: 84, delivery: 87, rating: 4.1, status: "Reviewed",   savings: 1500  },
];

const barData = vendors.map(v => ({ name: v.name.split(" ")[0], price: v.bid }));

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

const statusBadge: Record<string, string> = {
  Winner:    "badge-blue",
  "Runner-up": "badge-cyan",
  Reviewed:  "badge-gray",
};

export default function AnalysisPage() {
  const winner = vendors[0];

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="AI Analysis"
        subtitle="Vendor quote comparison and AI-powered best-value recommendation"
      />

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
            Based on a weighted analysis of price, quality, delivery performance, and vendor history,{" "}
            <strong style={{ color: "var(--primary)" }}>{winner.name}</strong> offers the best overall value.
            Selecting this vendor would save{" "}
            <strong style={{ color: "var(--success)" }}>₹{winner.savings.toLocaleString("en-IN")}</strong>{" "}
            compared to the average bid.
          </p>
        </div>
      </div>

      {/* Winner Card */}
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
              <h2 className="text-xl font-bold" style={{ color: "var(--fg)" }}>{winner.name}</h2>
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
              ₹{winner.bid.toLocaleString("en-IN")}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>Bid Price</p>
          </div>
          <div
            className="p-4 rounded-xl text-center"
            style={{ background: "var(--bg-subtle)", border: "1.5px solid var(--border)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "var(--success)" }}>
              {winner.quality}%
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>Quality Score</p>
          </div>
          <div
            className="p-4 rounded-xl text-center"
            style={{ background: "var(--success-light)", border: "1.5px solid var(--success)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "var(--success)" }}>
              ₹{winner.savings.toLocaleString("en-IN")}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>Est. Savings</p>
          </div>
        </div>
      </div>

      {/* Vendor Comparison Table */}
      <div className="card-base mb-6 overflow-hidden animate-fade-in stagger-2">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-sm">Vendor Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Bid Price</th>
                <th>Quality</th>
                <th>Delivery</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Savings</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, i) => (
                <tr
                  key={v.name}
                  style={{
                    background: i === 0 ? "var(--primary-light)" : undefined,
                    animationDelay: `${i * 0.06}s`,
                  }}
                  className="animate-fade-in"
                >
                  <td>
                    <div className="flex items-center gap-2 font-medium">
                      {i === 0 && <Award size={14} style={{ color: "var(--primary)" }} />}
                      {v.name}
                    </div>
                  </td>
                  <td className="font-semibold">₹{v.bid.toLocaleString("en-IN")}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: 60, background: "var(--border)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${v.quality}%`, background: v.quality > 92 ? "var(--success)" : "var(--primary)" }}
                        />
                      </div>
                      <span className="text-sm">{v.quality}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: 60, background: "var(--border)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${v.delivery}%`, background: "var(--info)" }}
                        />
                      </div>
                      <span className="text-sm">{v.delivery}%</span>
                    </div>
                  </td>
                  <td>⭐ {v.rating}</td>
                  <td>
                    <span className={`badge ${statusBadge[v.status]}`}>{v.status}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1" style={{ color: "var(--success)" }}>
                      <TrendingDown size={13} />
                      <span className="font-medium text-sm">₹{v.savings.toLocaleString("en-IN")}</span>
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
          <h2 className="font-semibold text-sm mb-5">Monthly Savings Trend</h2>
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

      {/* Quality Pie */}
      <div className="card-base p-5 max-w-sm animate-fade-in stagger-5">
        <h2 className="font-semibold text-sm mb-4">Quality Distribution</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(val) => <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>{val}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}

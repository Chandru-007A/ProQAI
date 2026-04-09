"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Search, Plus, AlertTriangle, RefreshCw, Eye, Edit3, Filter } from "lucide-react";

type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  status: StockStatus;
  updatedAt: string;
  aiPrediction?: string | null;
}

const badgeClass: Record<StockStatus, string> = {
  IN_STOCK: "badge badge-green",
  LOW_STOCK: "badge badge-yellow",
  OUT_OF_STOCK: "badge badge-red",
};

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StockStatus | "All">("All");

  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setInventoryData(data);
        setLoading(false);
      });
  }, []);

  const runAIPrediction = async () => {
    // Basic toast replacement would go here
    await fetch("/api/inventory/ai-predict");
    // Reload items to get the new aiPredictions
    const res = await fetch("/api/inventory");
    const data = await res.json();
    if (Array.isArray(data)) setInventoryData(data);
  };

  const filtered = inventoryData.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || item.status === filter;
    return matchSearch && matchFilter;
  });

  const lowCount = inventoryData.filter((i) => i.status === "LOW_STOCK").length;
  const outCount = inventoryData.filter((i) => i.status === "OUT_OF_STOCK").length;

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="Inventory Management"
        subtitle="Monitor stock levels, AI demand predictions, and trigger reorders"
        actions={
          <button className="btn btn-primary btn-sm">
            <Plus size={14} /> Add Item
          </button>
        }
      />

      {/* AI Monitoring Banner */}
      <div
        className="card-base p-4 mb-6 animate-fade-in flex items-start gap-4"
        style={{ borderColor: "var(--primary)", background: "var(--primary-light)" }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--primary)" }}
        >
          <span className="text-white text-sm font-bold">AI</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: "var(--primary)" }}>
            AI Monitoring
          </p>
          <p className="text-sm mt-0.5" style={{ color: "var(--fg)" }}>
            Detected <strong>{lowCount} low stock</strong> and{" "}
            <strong>{outCount} out-of-stock</strong> items. Click below to run the Gemini model for demand predictions.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={runAIPrediction} className="btn btn-outline btn-sm flex-shrink-0">
            Run Prediction
          </button>
          <a href="/rfq" className="btn btn-primary btn-sm flex-shrink-0">
            Generate RFQ
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="card-base mb-5 animate-fade-in stagger-1">
        <div className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--fg-subtle)" }}
            />
            <input
              className="input-base"
              style={{ paddingLeft: 34 }}
              placeholder="Search by name or SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="inventory-search"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: "var(--fg-muted)" }} />
            {(["All", "IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="btn btn-sm"
                style={{
                  background: filter === f ? "var(--primary)" : "var(--bg-muted)",
                  color: filter === f ? "#fff" : "var(--fg-muted)",
                  borderColor: filter === f ? "var(--primary)" : "var(--border)",
                  fontSize: 12,
                }}
              >
                {f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden animate-fade-in stagger-2">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>AI Prediction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10" style={{ color: "var(--fg-muted)" }}>
                    Loading inventory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10" style={{ color: "var(--fg-muted)" }}>
                    No items match your search
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                    <td>
                      <div className="font-medium" style={{ color: "var(--fg)" }}>{item.name}</div>
                      <div className="text-xs" style={{ color: "var(--fg-subtle)" }}>
                        Updated: {new Date(item.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>{item.sku}</span>
                    </td>
                    <td>
                      <span className="badge badge-gray">{item.category}</span>
                    </td>
                    <td>
                      <span className="font-semibold">{item.currentStock}</span>
                      <span className="text-xs ml-1" style={{ color: "var(--fg-subtle)" }}>{item.unit}</span>
                    </td>
                    <td style={{ color: "var(--fg-muted)" }}>
                      {item.reorderLevel} {item.unit}
                    </td>
                    <td>
                      <span className={badgeClass[item.status]}>
                        {item.status === "LOW_STOCK" && <AlertTriangle size={10} />}
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      {item.aiPrediction ? (
                        <span className="badge badge-blue text-xs max-w-xs block truncate leading-tight py-1">{item.aiPrediction}</span>
                      ) : (
                        <span style={{ color: "var(--fg-subtle)", fontSize: 12 }}>—</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button className="btn btn-secondary btn-sm p-1.5" title="View"><Eye size={13} /></button>
                        <button className="btn btn-secondary btn-sm p-1.5" title="Edit"><Edit3 size={13} /></button>
                        <button
                          className="btn btn-sm p-1.5"
                          title="Reorder"
                          style={{
                            background: item.status !== "IN_STOCK" ? "var(--primary)" : "var(--bg-muted)",
                            color: item.status !== "IN_STOCK" ? "#fff" : "var(--fg-muted)",
                            borderColor: item.status !== "IN_STOCK" ? "var(--primary)" : "var(--border)",
                          }}
                        >
                          <RefreshCw size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div
            className="px-5 py-3 text-xs flex items-center justify-between"
            style={{ borderTop: "1px solid var(--border)", color: "var(--fg-muted)", background: "var(--bg-subtle)" }}
          >
            <span>Showing {filtered.length} of {inventoryData.length} items</span>
            <span>{lowCount} low · {outCount} out of stock</span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

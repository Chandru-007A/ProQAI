"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Plus, Trash2, Send, CheckCircle, Clock, ChevronRight } from "lucide-react";

interface LineItem {
  id: string;
  name: string;
  qty: string;
  unit: string;
  estPrice: string;
}

type Step = "DRAFT" | "REVIEW" | "APPROVED" | "SENT";

export default function RFQPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("DRAFT");
  const [rfqId, setRfqId] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", name: "", qty: "", unit: "Units", estPrice: "" },
  ]);

  const [vendorList, setVendorList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/vendors").then(res => res.json()).then(data => {
      if(Array.isArray(data)) setVendorList(data);
    });
  }, []);

  const addItem = () =>
    setItems(prev => [...prev, { id: Date.now().toString(), name: "", qty: "", unit: "Units", estPrice: "" }]);

  const removeItem = (id: string) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const updateItem = (id: string, field: keyof LineItem, value: string) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, [field]: value } : i)));

  const toggleVendor = (id: string) =>
    setSelectedVendors(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);

  const total = items.reduce((sum, i) => {
    const qty = parseFloat(i.qty) || 0;
    const price = parseFloat(i.estPrice) || 0;
    return sum + qty * price;
  }, 0);

  const handleSubmit = async () => {
    if (step === "DRAFT") {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, budget, deadline, items, vendorIds: selectedVendors
        })
      });
      const data = await res.json();
      if(res.ok) {
        setRfqId(data.id);
        
        // Immediately submit for review
        await fetch(`/api/rfq/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "REVIEW" })
        });
        setStep("REVIEW");
      }
    }
  };

  const handleApprove = async () => {
    if(rfqId) {
      await fetch(`/api/rfq/${rfqId}/approve`, { method: "POST" });
      setStep("APPROVED");
    }
  };
  
  const handleSend = async () => {
    if(rfqId) {
      await fetch(`/api/rfq/${rfqId}/send`, { method: "POST" });
      setStep("SENT");
    }
  };

  const stepConfig: Record<Step, { label: string; color: string; bg: string }> = {
    DRAFT:    { label: "Draft",    color: "var(--fg-muted)",  bg: "var(--bg-muted)" },
    REVIEW:   { label: "In Review",color: "var(--warning)",   bg: "var(--warning-light)" },
    APPROVED: { label: "Approved", color: "var(--success)",   bg: "var(--success-light)" },
    SENT:     { label: "Sent to Vendors", color: "var(--primary)", bg: "var(--primary-light)" },
  };

  if (step === "SENT") {
    return (
      <DashboardLayout role="buyer">
        <div className="flex flex-col items-center justify-center min-h-96 animate-fade-in">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{ background: "var(--success-light)" }}
          >
            <CheckCircle size={32} style={{ color: "var(--success)" }} />
          </div>
          <h2 className="text-xl font-bold mb-2">RFQ Sent Successfully!</h2>
          <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
            Your RFQ has been dispatched to {selectedVendors.length} vendor(s). You&apos;ll receive bids shortly.
          </p>
          <div className="flex gap-3">
            <button onClick={() => router.push("/dashboard")} className="btn btn-secondary">Back to Dashboard</button>
            <button onClick={() => router.push("/analysis")} className="btn btn-primary">View Bids →</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stepsOrder: Step[] = ["DRAFT", "REVIEW", "APPROVED", "SENT"];

  return (
    <DashboardLayout role="buyer">
      <PageHeader
        title="RFQ Generation"
        subtitle="Create a Request for Quotation and send it to your vendors"
        actions={
          <span className="badge" style={{ background: stepConfig[step].bg, color: stepConfig[step].color }}>
            {stepConfig[step].label}
          </span>
        }
      />

      {/* Progress Steps */}
      <div className="card-base p-4 mb-6 animate-fade-in">
        <div className="flex items-center gap-2">
          {stepsOrder.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: s === step ? "var(--primary)" : (stepsOrder.indexOf(s) < stepsOrder.indexOf(step) ? "var(--success)" : "var(--bg-muted)"),
                    color: s === step || stepsOrder.indexOf(s) < stepsOrder.indexOf(step) ? "#fff" : "var(--fg-muted)",
                  }}
                >
                  {stepsOrder.indexOf(s) < stepsOrder.indexOf(step) ? "✓" : i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:block" style={{ color: s === step ? "var(--primary)" : "var(--fg-muted)" }}>
                  {stepConfig[s].label}
                </span>
              </div>
              {i < 3 && <ChevronRight size={14} style={{ color: "var(--border-strong)", flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Approval Banner */}
      {step === "REVIEW" && (
        <div
          className="card-base p-4 mb-5 animate-fade-in flex flex-wrap items-center gap-4"
          style={{ borderColor: "var(--warning)", background: "var(--warning-light)" }}
        >
          <Clock size={18} style={{ color: "var(--warning)" }} />
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: "#92400e" }}>Awaiting Company Approval</p>
            <p className="text-xs" style={{ color: "#b45309" }}>This RFQ requires manager sign-off before being sent to vendors.</p>
          </div>
          <button onClick={handleApprove} className="btn btn-primary btn-sm">
            <CheckCircle size={14} /> Approve &amp; Continue
          </button>
        </div>
      )}

      {step === "APPROVED" && (
        <div
          className="card-base p-4 mb-5 animate-fade-in flex flex-wrap items-center gap-4"
          style={{ borderColor: "var(--success)", background: "var(--success-light)" }}
        >
          <CheckCircle size={18} style={{ color: "var(--success)" }} />
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: "#065f46" }}>Approved! Ready to send to vendors.</p>
          </div>
          <button onClick={handleSend} className="btn btn-primary btn-sm">
            <Send size={14} /> Send to Vendors
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* RFQ Details */}
          <div className="card-base p-5 animate-fade-in stagger-1">
            <h2 className="font-semibold mb-4 text-sm">RFQ Details</h2>
            <div className="space-y-4">
              <div>
                <label className="label-base">RFQ Title *</label>
                <input
                  className="input-base"
                  placeholder="e.g. Q2 Office Stationery Procurement"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={step !== "DRAFT"}
                />
              </div>
              <div>
                <label className="label-base">Description</label>
                <textarea
                  className="input-base resize-none"
                  rows={3}
                  placeholder="Specify requirements, quality standards, or special conditions…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  disabled={step !== "DRAFT"}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Budget (₹)</label>
                  <input
                    type="number"
                    className="input-base"
                    placeholder="e.g. 50000"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    disabled={step !== "DRAFT"}
                  />
                </div>
                <div>
                  <label className="label-base">Deadline</label>
                  <input
                    type="date"
                    className="input-base"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    disabled={step !== "DRAFT"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card-base animate-fade-in stagger-2">
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="font-semibold text-sm">Line Items</h2>
              {step === "DRAFT" && (
                <button onClick={addItem} className="btn btn-secondary btn-sm">
                  <Plus size={13} /> Add Item
                </button>
              )}
            </div>
            <div className="p-5">
              <div className="hidden sm:grid grid-cols-12 gap-3 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>
                <div className="col-span-4">Item Name</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-2">Unit</div>
                <div className="col-span-3">Est. Price (₹)</div>
                <div className="col-span-1"></div>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 sm:col-span-4">
                      <input
                        className="input-base"
                        placeholder="Item name"
                        value={item.name}
                        onChange={e => updateItem(item.id, "name", e.target.value)}
                        disabled={step !== "DRAFT"}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <input
                        type="number"
                        className="input-base"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={e => updateItem(item.id, "qty", e.target.value)}
                        disabled={step !== "DRAFT"}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <select
                        className="input-base"
                        value={item.unit}
                        onChange={e => updateItem(item.id, "unit", e.target.value)}
                        disabled={step !== "DRAFT"}
                      >
                        {["Units","Pcs","Kgs","Ltrs","Boxes","Reams","Sets"].map(u => (
                          <option key={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3 sm:col-span-3">
                      <input
                        type="number"
                        className="input-base"
                        placeholder="0.00"
                        value={item.estPrice}
                        onChange={e => updateItem(item.id, "estPrice", e.target.value)}
                        disabled={step !== "DRAFT"}
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-1 flex justify-end">
                      {items.length > 1 && step === "DRAFT" && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="btn btn-sm p-1.5"
                          style={{ color: "var(--danger)", background: "var(--danger-light)", border: "none" }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {total > 0 && (
                <div
                  className="mt-4 pt-4 flex justify-end text-sm font-semibold"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  Estimated Total: ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vendor Selection */}
        <div className="space-y-5">
          <div className="card-base animate-fade-in stagger-3">
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="font-semibold text-sm">Select Vendors</h2>
              <span className="badge badge-blue">{selectedVendors.length} selected</span>
            </div>
            <div className="p-4 space-y-2">
              {vendorList.map(v => (
                <label
                  key={v.id}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: selectedVendors.includes(v.id) ? "var(--primary-light)" : "var(--bg-subtle)",
                    border: `1.5px solid ${selectedVendors.includes(v.id) ? "var(--primary)" : "transparent"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedVendors.includes(v.id)}
                    onChange={() => step === "DRAFT" && toggleVendor(v.id)}
                    disabled={step !== "DRAFT"}
                    className="w-4 h-4 accent-blue-600 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--fg)" }}>{v.name}</p>
                    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                      {v.category} · ⭐ {v.rating}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={step !== "DRAFT"}
            id="rfq-submit"
            className="btn btn-primary btn-lg w-full animate-fade-in stagger-4"
          >
            <Send size={16} />
            {step === "DRAFT" ? "Submit for Approval" : "Submitted"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

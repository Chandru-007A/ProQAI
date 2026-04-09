import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialise the Gemini client — runs server-side only
function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") return null;
  return new GoogleGenerativeAI(apiKey);
}

const client = getClient();

// ─── Helper: run a Gemini prompt, graceful fallback ──────────────────────────
async function generate(prompt: string): Promise<string | null> {
  if (!client) return null;
  try {
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("[Gemini] generation error:", err);
    return null;
  }
}

// ─── 1. Demand Prediction ────────────────────────────────────────────────────
export interface InventorySignal {
  name: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
}

export async function predictDemand(items: InventorySignal[]): Promise<
  Record<string, { prediction: string; urgency: "high" | "medium" | "low"; qty: number }>
> {
  const lowItems = items.filter((i) => i.currentStock <= i.reorderLevel);

  const prompt = `You are an AI procurement analyst. Analyze these inventory items and predict replenishment needs.

Items with stock at or below reorder level:
${JSON.stringify(lowItems, null, 2)}

For each item in the list, respond with ONLY a JSON array like this (no markdown, no explanation):
[
  {
    "sku": "...",
    "prediction": "Short 1-sentence action recommendation",
    "urgency": "high|medium|low",
    "qty": <recommended_reorder_quantity_as_integer>
  }
]`;

  const raw = await generate(prompt);
  const result: Record<string, { prediction: string; urgency: "high" | "medium" | "low"; qty: number }> = {};

  if (raw) {
    try {
      const jsonStr = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(jsonStr) as { sku: string; prediction: string; urgency: "high" | "medium" | "low"; qty: number }[];
      for (const entry of parsed) {
        result[entry.sku] = {
          prediction: entry.prediction,
          urgency: entry.urgency,
          qty: entry.qty,
        };
      }
    } catch {
      // fallback below
    }
  }

  // Rule-based fallback for items not covered by Gemini
  for (const item of lowItems) {
    if (!result[item.sku]) {
      const deficit = item.reorderLevel - item.currentStock;
      result[item.sku] = {
        prediction: `Reorder ${item.reorderLevel * 2} ${item.unit} to restore safety stock.`,
        urgency: item.currentStock === 0 ? "high" : "medium",
        qty: item.reorderLevel * 2,
      };
    }
  }

  return result;
}

// ─── 2. Quote Suggestion ─────────────────────────────────────────────────────
export interface QuoteInput {
  rfqTitle: string;
  budget: number;
  items: { name: string; qty: number; unit: string }[];
  vendorCategory: string;
  vendorRating: number;
}

export async function suggestQuote(input: QuoteInput): Promise<{
  suggestedPrice: number;
  rationale: string;
}> {
  const prompt = `You are an AI procurement advisor helping a vendor win a bid.

RFQ: "${input.rfqTitle}"
Buyer budget: ₹${input.budget}
Items required: ${JSON.stringify(input.items)}
Vendor category: ${input.vendorCategory}
Vendor rating: ${input.vendorRating}/5

Suggest the optimal bid price to maximize win probability while maintaining margin.
Respond ONLY with JSON (no markdown):
{
  "suggestedPrice": <number>,
  "rationale": "One sentence rationale"
}`;

  const raw = await generate(prompt);

  if (raw) {
    try {
      const jsonStr = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(jsonStr) as { suggestedPrice: number; rationale: string };
      return parsed;
    } catch {
      /* fallback */
    }
  }

  // Rule-based fallback: suggest 87% of budget
  return {
    suggestedPrice: Math.round(input.budget * 0.87),
    rationale:
      "Suggested price is approximately 87% of buyer budget, balancing competitiveness and margin.",
  };
}

// ─── 3. Vendor Ranking ───────────────────────────────────────────────────────
export interface BidSignal {
  vendorId: string;
  vendorName: string;
  price: number;
  rating: number;
  deliveryDays: number;
  qualityScore: number;
}

export async function rankVendors(
  rfqTitle: string,
  budget: number,
  bids: BidSignal[]
): Promise<
  {
    vendorId: string;
    rank: number;
    aiScore: number;
    reason: string;
    savings: number;
  }[]
> {
  const avgPrice = bids.reduce((s, b) => s + b.price, 0) / bids.length;

  const prompt = `You are an AI procurement decision engine. Rank these vendor bids for the RFQ: "${rfqTitle}" (Budget: ₹${budget}).

Bids:
${JSON.stringify(bids, null, 2)}

Score each vendor 0-100 considering: price competitiveness (40%), quality score (30%), delivery speed (20%), rating (10%).

Respond ONLY with a JSON array, no markdown:
[
  {
    "vendorId": "...",
    "rank": 1,
    "aiScore": 87.5,
    "reason": "One sentence key reason"
  }
]`;

  const raw = await generate(prompt);
  let aiResults: { vendorId: string; rank: number; aiScore: number; reason: string }[] = [];

  if (raw) {
    try {
      const jsonStr = raw.replace(/```json|```/g, "").trim();
      aiResults = JSON.parse(jsonStr);
    } catch {
      /* fallback */
    }
  }

  // Rule-based fallback if Gemini fails
  if (!aiResults.length) {
    const scored = bids.map((b) => {
      const priceScore  = Math.max(0, 100 - ((b.price - Math.min(...bids.map(x => x.price))) / (Math.max(...bids.map(x => x.price)) - Math.min(...bids.map(x => x.price)) || 1)) * 100);
      const score = priceScore * 0.4 + b.qualityScore * 0.3 + Math.max(0, 100 - b.deliveryDays * 3) * 0.2 + b.rating * 10 * 0.1;
      return { vendorId: b.vendorId, aiScore: Math.round(score * 10) / 10 };
    });
    scored.sort((a, b) => b.aiScore - a.aiScore);
    aiResults = scored.map((s, i) => ({
      vendorId: s.vendorId,
      rank: i + 1,
      aiScore: s.aiScore,
      reason: i === 0 ? "Best overall score on price, quality, and delivery." : "Competitive bid with good metrics.",
    }));
  }

  return aiResults.map((r) => {
    const bid = bids.find((b) => b.vendorId === r.vendorId)!;
    return {
      vendorId: r.vendorId,
      rank: r.rank,
      aiScore: r.aiScore,
      reason: r.reason,
      savings: Math.round(avgPrice - (bid?.price ?? avgPrice)),
    };
  });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Pricing logic, kept in sync with the client-side quote form.
const SERVICE_BASE: Record<string, number> = {
  mowing: 45,
  fertilization: 65,
  aeration: 180,
  "leaf-removal": 90,
  "spring-cleanup": 120,
  "snow-removal": 60,
};

const LOT_MULT: Record<string, number> = {
  small: 1.0,
  medium: 1.3,
  large: 1.7,
  xlarge: 2.2,
};

const FREQ_DISCOUNT: Record<string, number> = {
  weekly: 0.1,
  biweekly: 0.05,
  monthly: 0,
  onetime: 0,
};

const FREQ_VISITS: Record<string, number> = {
  weekly: 4,
  biweekly: 2,
  monthly: 1,
  onetime: 1,
};

function computeEstimate(
  service: string,
  lotSize: string,
  frequency: string
): number {
  const base = SERVICE_BASE[service] ?? 45;
  const mult = LOT_MULT[lotSize] ?? 1.3;
  const disc = FREQ_DISCOUNT[frequency] ?? 0;
  const visits = FREQ_VISITS[frequency] ?? 1;
  const perVisit = Math.round(base * mult * (1 - disc));
  return frequency === "onetime" ? perVisit : perVisit * visits;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();

    if (!name || !phone || !address) {
      return NextResponse.json(
        {
          ok: false,
          error: "Name, phone, and address are required.",
        },
        { status: 400 }
      );
    }

    const email = String(body.email ?? "").trim();
    const serviceType = String(body.service ?? "mowing");
    const lotSize = String(body.lotSize ?? "medium");
    const frequency = String(body.frequency ?? "weekly");
    const message = String(body.message ?? "").trim() || null;

    // Recompute the estimate on the server (source of truth)
    const estimatedPrice = computeEstimate(serviceType, lotSize, frequency);

    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone,
        address,
        serviceType,
        lotSize,
        frequency,
        estimatedPrice,
        message,
        status: "new",
      },
    });

    return NextResponse.json({
      ok: true,
      id: lead.id,
      estimatedPrice,
      message: "Quote request received. We'll call you within 1 business hour.",
    });
  } catch (err) {
    console.error("[POST /api/quote] error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again or call us." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await db.lead.count();
    return NextResponse.json({
      ok: true,
      totalLeads: count,
      message: "Quote API is live.",
    });
  } catch (err) {
    console.error("[GET /api/quote] error:", err);
    return NextResponse.json(
      { ok: true, totalLeads: 0, message: "Quote API is live." },
      { status: 200 }
    );
  }
}

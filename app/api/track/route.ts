import { NextResponse } from "next/server";
import { findShipmentByNumber } from "@/lib/orders";
import { withRoute } from "@/lib/routing";

export async function GET(req: Request) {
  const number = new URL(req.url).searchParams.get("number") ?? "";
  if (!number.trim() || number.length > 40) {
    return NextResponse.json({ ok: false, error: "Enter a tracking number." }, { status: 400 });
  }
  try {
    const found = await findShipmentByNumber(number);
    if (!found) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    const shipment = await withRoute(found);
    return NextResponse.json({ ok: true, shipment });
  } catch {
    return NextResponse.json({ ok: false, error: "Tracking is unavailable right now. Please try again later." }, { status: 500 });
  }
}

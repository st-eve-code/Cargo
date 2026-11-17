import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { AddressNotFound, createOrder, listOrders } from "@/lib/orders";
import { parseOrderInput } from "@/lib/orderOptions";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, orders: await listOrders() });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not read the orders." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const body: unknown = await req.json().catch(() => null);
  const parsed = parseOrderInput(body);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  try {
    const created = await createOrder(parsed.value);
    return NextResponse.json({ ok: true, ...created }, { status: 201 });
  } catch (e) {
    if (e instanceof AddressNotFound) return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
    return NextResponse.json({ ok: false, error: "The address lookup is unavailable right now. Please try again." }, { status: 503 });
  }
}

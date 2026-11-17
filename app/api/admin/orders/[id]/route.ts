import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { AddressNotFound, deleteOrder, updateOrder } from "@/lib/orders";
import { parseOrderInput } from "@/lib/orderOptions";

type Ctx = { params: Promise<{ id: string }> };

const orderId = async (ctx: Ctx): Promise<number | null> => {
  const id = Number((await ctx.params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const id = await orderId(ctx);
  if (!id) return NextResponse.json({ ok: false, error: "Invalid order." }, { status: 400 });
  const body: unknown = await req.json().catch(() => null);
  const parsed = parseOrderInput(body);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  try {
    const found = await updateOrder(id, parsed.value);
    if (!found) return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof AddressNotFound) return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
    return NextResponse.json({ ok: false, error: "The address lookup is unavailable right now. Please try again." }, { status: 503 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const id = await orderId(ctx);
  if (!id) return NextResponse.json({ ok: false, error: "Invalid order." }, { status: 400 });
  try {
    const removed = await deleteOrder(id);
    if (!removed) return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not remove the order." }, { status: 500 });
  }
}

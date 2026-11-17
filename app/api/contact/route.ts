import { NextResponse } from "next/server";
import { MailNotConfigured, sendEnquiry, type Enquiry } from "@/lib/mail";
import { site } from "@/lib/site";

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "Please enter your name, a valid email and a message." }, { status: 400 });
  }
  const r = body as Record<string, unknown>;

  if (text(r.company, 200)) return NextResponse.json({ ok: true }); // honeypot filled: pretend success

  const enquiry: Enquiry = {
    kind: r.kind === "quote" ? "quote" : "contact",
    name: text(r.name, 120),
    email: text(r.email, 200),
    phone: text(r.phone, 60),
    service: text(r.service, 120),
    message: text(r.message, 5000),
  };

  if (!enquiry.name || !enquiry.message || !/^\S+@\S+\.\S+$/.test(enquiry.email)) {
    return NextResponse.json({ ok: false, error: "Please enter your name, a valid email and a message." }, { status: 400 });
  }
  if (typeof r.message === "string" && r.message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Your message is too long." }, { status: 400 });
  }

  try {
    await sendEnquiry(enquiry);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof MailNotConfigured) {
      return NextResponse.json({ ok: false, error: `We could not send your message right now. Please email us at ${site.email}.` }, { status: 503 });
    }
    console.error("[contact] email failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: `We could not send your message right now. Please email us at ${site.email}.` }, { status: 502 });
  }
}

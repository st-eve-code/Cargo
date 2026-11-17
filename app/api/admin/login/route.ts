import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_SECONDS, adminConfigured, passwordMatches, sessionToken } from "@/lib/admin";
import { clearFailures, isBlocked, recordFailure } from "@/lib/loginLimit";

const clientKey = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";

export async function POST(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });

  const key = clientKey(req);
  if (isBlocked(key)) return NextResponse.json({ ok: false, error: "too_many_attempts" }, { status: 429 });

  const body: unknown = await req.json().catch(() => null);
  const password = typeof body === "object" && body !== null && "password" in body && typeof body.password === "string" ? body.password : "";
  if (!passwordMatches(password)) {
    recordFailure(key);
    return NextResponse.json({ ok: false, error: "wrong_password" }, { status: 401 });
  }

  clearFailures(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken() ?? "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return res;
}

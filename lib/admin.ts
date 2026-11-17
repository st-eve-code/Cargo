import { createHmac, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/* server only. The admin password is never stored in plain text: .env holds ADMIN_PASSWORD_HASH,
   a scrypt hash made by `npm run admin:password`. The session cookie is an HMAC keyed with that hash,
   so changing the password signs everyone out. */

export const SESSION_COOKIE = "admin_session";
export const SESSION_SECONDS = 60 * 60 * 8;

const storedHash = (): string | null => process.env.ADMIN_PASSWORD_HASH || null;

/* format: scrypt:N:r:p:salt(hex):key(hex) */
function verifyHash(input: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [N, r, p] = [Number(parts[1]), Number(parts[2]), Number(parts[3])];
  const salt = Buffer.from(parts[4], "hex");
  const key = Buffer.from(parts[5], "hex");
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p) || key.length === 0) return false;
  const derived = scryptSync(input, salt, key.length, { N, r, p, maxmem: 64 * 1024 * 1024 });
  return timingSafeEqual(derived, key);
}

export function adminConfigured(): boolean {
  return storedHash() !== null;
}

export function passwordMatches(input: string): boolean {
  const stored = storedHash();
  if (!stored) return false;
  return verifyHash(input, stored);
}

export function sessionToken(): string | null {
  const stored = storedHash();
  if (!stored) return null;
  return createHmac("sha256", stored).update("pioneer-admin-session").digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const expected = sessionToken();
  if (!expected) return false;
  const jar = await cookies();
  const given = jar.get(SESSION_COOKIE)?.value;
  if (!given || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

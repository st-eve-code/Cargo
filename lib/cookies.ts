/* client side cookie helpers. Two cookies are used:
   pc_consent  accepted | declined. Set by the cookie notice.
   pc_recent   the last tracking numbers this visitor looked up. Only written when cookies are accepted. */

import { useSyncExternalStore } from "react";

export type Consent = "accepted" | "declined";

export const CONSENT_COOKIE = "pc_consent";
export const RECENT_COOKIE = "pc_recent";
const RECENT_MAX = 5;
const DAYS = 180;
const CHANGED = "pc-cookies-changed";

const readCookie = (name: string): string | null => {
  const hit = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  if (!hit) return null;
  try {
    return decodeURIComponent(hit.slice(name.length + 1));
  } catch {
    return null; // a malformed value is treated as missing instead of breaking the page
  }
};

const writeCookie = (name: string, value: string) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${DAYS * 86400}; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
};

const notify = () => window.dispatchEvent(new Event(CHANGED));

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGED, onChange);
  return () => window.removeEventListener(CHANGED, onChange);
}

export function getConsent(): Consent | null {
  const v = readCookie(CONSENT_COOKIE);
  return v === "accepted" || v === "declined" ? v : null;
}

export function setConsent(c: Consent): void {
  writeCookie(CONSENT_COOKIE, c);
  if (c === "declined") deleteCookie(RECENT_COOKIE);
  notify();
}

export function addRecent(number: string): void {
  if (getConsent() !== "accepted") return;
  const others = readRecent().filter((n) => n !== number);
  writeCookie(RECENT_COOKIE, JSON.stringify([number, ...others].slice(0, RECENT_MAX)));
  notify();
}

export function clearRecent(): void {
  deleteCookie(RECENT_COOKIE);
  notify();
}

function readRecent(): string[] {
  const raw = readCookie(RECENT_COOKIE);
  if (!raw) return [];
  try {
    const list: unknown = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((n): n is string => typeof n === "string").slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}

/* the raw cookie text keeps the snapshot stable between renders */
export function useRecent(): string[] {
  const raw = useSyncExternalStore(subscribe, () => readCookie(RECENT_COOKIE) ?? "", () => "");
  if (!raw) return [];
  try {
    const list: unknown = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((n): n is string => typeof n === "string").slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

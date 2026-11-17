/* server only. Stops password guessing: after 5 wrong passwords from one address, that address is blocked for 15 minutes. */

const MAX_FAILURES = 5;
const BLOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; blockedUntil: number }>();

export function isBlocked(key: string): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (entry.blockedUntil > Date.now()) return true;
  if (entry.blockedUntil !== 0) failures.delete(key);
  return false;
}

export function recordFailure(key: string): void {
  const entry = failures.get(key) ?? { count: 0, blockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_FAILURES) {
    entry.blockedUntil = Date.now() + BLOCK_MS;
    entry.count = 0;
  }
  failures.set(key, entry);
}

export function clearFailures(key: string): void {
  failures.delete(key);
}

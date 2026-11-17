/* server only. Stops password guessing: after 5 wrong passwords from one address, that address is blocked for 15 minutes. */

const MAX_FAILURES = 5;
const BLOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; blockedUntil: number; last: number }>();

/* drops addresses that are not blocked and have been quiet for a full block window */
function prune(now: number): void {
  for (const [key, entry] of failures) {
    if (entry.blockedUntil <= now && now - entry.last > BLOCK_MS) failures.delete(key);
  }
}

export function isBlocked(key: string): boolean {
  const entry = failures.get(key);
  if (!entry) return false;
  if (entry.blockedUntil > Date.now()) return true;
  if (entry.blockedUntil !== 0) failures.delete(key);
  return false;
}

export function recordFailure(key: string): void {
  const now = Date.now();
  prune(now);
  const entry = failures.get(key) ?? { count: 0, blockedUntil: 0, last: now };
  entry.count += 1;
  entry.last = now;
  if (entry.count >= MAX_FAILURES) {
    entry.blockedUntil = now + BLOCK_MS;
    entry.count = 0;
  }
  failures.set(key, entry);
}

export function clearFailures(key: string): void {
  failures.delete(key);
}

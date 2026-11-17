// Sets the admin password. Only a scrypt hash is written to .env, never the password itself.
// Usage: npm run admin:password -- "your new password"   (at least 8 characters)
import { randomBytes, scryptSync } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error('Usage: npm run admin:password -- "your new password" (at least 8 characters)');
  process.exit(1);
}

const N = 16384, r = 8, p = 1;
const salt = randomBytes(16);
const key = scryptSync(password, salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 });
const hashLine = `ADMIN_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${key.toString("hex")}`;

const file = ".env";
let text = existsSync(file) ? readFileSync(file, "utf8") : "";
text = text.replace(/^ADMIN_PASSWORD=.*\r?\n?/m, ""); // remove an old plain-text password, if any
text = /^ADMIN_PASSWORD_HASH=.*$/m.test(text)
  ? text.replace(/^ADMIN_PASSWORD_HASH=.*$/m, hashLine)
  : `${text.trimEnd()}\n${hashLine}\n`.replace(/^\n/, "");
writeFileSync(file, text);
console.log("Admin password updated in .env. Restart the dev server (npm run dev) for it to take effect.");

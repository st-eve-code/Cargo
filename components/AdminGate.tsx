"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGate({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      if (res.status === 429) setError("Too many wrong attempts. Please wait 15 minutes and try again.");
      else if (res.status === 503) setError("The admin password is not set up yet. Run npm run admin:password.");
      else setError("That is not the password.");
    } catch {
      setError("Could not reach the server. Please try again.");
    }
    setBusy(false);
  };

  return (
    <main className="ad ad-gate">
      <form className="ad-card" onSubmit={submit}>
        <h1>Admin</h1>
        <label htmlFor="ad-pw">What&apos;s the password?</label>
        <input id="ad-pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} disabled={!configured || busy} autoFocus />
        <button type="submit" disabled={!configured || busy || pw === ""}>{busy ? "Checking..." : "Enter"}</button>
        {error && <p className="ad-error" role="alert">{error}</p>}
      </form>
    </main>
  );
}

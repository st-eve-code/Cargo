"use client";

import { setConsent, useConsent } from "@/lib/cookies";

export default function CookieNotice() {
  const consent = useConsent();
  if (consent !== null) return null;

  return (
    <section className="cookie" aria-label="Cookies">
      <p>
        We use cookies to remember the tracking numbers you look up, so you can find them again next time.
        Essential cookies, such as the admin login, are always on.
      </p>
      <div className="cookie-actions">
        <button type="button" className="cookie-ghost" onClick={() => setConsent("declined")}>Decline</button>
        <button type="button" onClick={() => setConsent("accepted")}>Accept</button>
      </div>
    </section>
  );
}

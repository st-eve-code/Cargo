"use client";

import Link from "next/link";
import { useEffect } from "react";

/* Keep legacy /order links working without making this page request-dynamic. */
export default function OrderRedirect() {
  useEffect(() => {
    const tracking = new URLSearchParams(window.location.search).get("tracking");
    const destination = tracking
      ? `/tracking?tracking=${encodeURIComponent(tracking)}`
      : "/tracking";
    window.location.replace(destination);
  }, []);

  return <p>Redirecting to tracking… <Link href="/tracking">Continue to tracking</Link></p>;
}

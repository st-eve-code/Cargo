import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Suspense } from "react";
import { adminConfigured, isAdmin } from "@/lib/admin";
import { listOrders } from "@/lib/orders";
import AdminGate from "@/components/AdminGate";
import AdminConsole from "@/components/AdminConsole";

export const metadata: Metadata = {
  title: `Admin — ${site.name}`,
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminRoot />
    </Suspense>
  );
}

async function AdminRoot() {
  if (!(await isAdmin())) return <AdminGate configured={adminConfigured()} />;
  const orders = await listOrders();
  return <AdminConsole orders={orders} />;
}

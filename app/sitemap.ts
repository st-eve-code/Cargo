import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const pages: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/services", priority: 0.8 },
  { path: "/request-quote", priority: 0.8 },
  { path: "/contact", priority: 0.7 },
  { path: "/tracking", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map((p) => ({ url: `${site.url}${p.path}`, lastModified, changeFrequency: "weekly", priority: p.priority }));
}

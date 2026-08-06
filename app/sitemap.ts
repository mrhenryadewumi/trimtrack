import type { MetadataRoute } from "next";

const BASE_URL = "https://www.trimtrack.fit";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/onboarding", priority: 0.8, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.5, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.5, changeFrequency: "monthly" },
    { path: "/support", priority: 0.5, changeFrequency: "monthly" },
    { path: "/account/delete", priority: 0.3, changeFrequency: "monthly" },
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

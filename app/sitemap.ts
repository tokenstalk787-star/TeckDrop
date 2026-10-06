import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://teckdrop.vercel.app";
  return [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/airdrops`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/daily`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/calendar`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/dashboard`, changeFrequency: "weekly", priority: 0.6 },
  ];
}
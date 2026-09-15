import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // Includes Googlebot, Bingbot, OAI-SearchBot, GPTBot, ClaudeBot and
    // PerplexityBot. Keep HTML, scripts, styles and public media accessible.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/studio", "/*/*_res"] },
    sitemap: "https://estoyonline.es/sitemap.xml",
  };
}

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { config as loadEnv } from "dotenv";
import { resolveSeoForRequest } from "./seoResolver.mjs";

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const indexPath = path.join(distDir, "index.html");

const PORT = Number(process.env.PORT || 4173);
const app = express();

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function injectSeoTags(html, seo) {
  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    seo.keywords
      ? `<meta name="keywords" content="${escapeHtml(seo.keywords)}" />`
      : "",
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");

  return html.replace("</head>", `    ${tags}\n  </head>`);
}

app.use(
  express.static(distDir, {
    index: false,
    maxAge: "7d",
  }),
);

app.get("/{*splat}", async (req, res) => {
  try {
    const html = await fs.readFile(indexPath, "utf-8");
    const seo = await resolveSeoForRequest({
      pathname: req.path,
      search: req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "",
      env: process.env,
    });

    const output = injectSeoTags(html, seo);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(output);
  } catch (error) {
    res
      .status(500)
      .send(`SEO server error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
});

app.listen(PORT, () => {
  console.log(`[seo-server] Running on http://localhost:${PORT}`);
  console.log(`[seo-server] Serving ${distDir}`);
});

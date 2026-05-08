import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { CODE, SITE } from "./src/consts.ts";

// Vercel auto-detects Astro static sites; no adapter needed.
export default defineConfig({
  site: SITE.url,
  integrations: [sitemap()],
  build: {
    format: "directory",
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: CODE.themeLight,
        dark: CODE.themeDark,
      },
      wrap: true,
    },
  },
});

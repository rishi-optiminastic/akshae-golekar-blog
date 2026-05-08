// =============================================================================
// BLOG CONFIGURATION
// =============================================================================
// Everything you can customize lives in this file. Edit values, save, and the
// site updates. No need to touch component files for normal customization.
// =============================================================================

// -----------------------------------------------------------------------------
// SITE — name, description, domain, author
// -----------------------------------------------------------------------------
export const SITE = {
  title: "Akshae Golekar",
  description: "Writing on ideas, work, and life by Akshae Golekar.",
  url: "https://akshaegolekar.com",
  author: "Akshae Golekar",
  authorEmail: "hi@akshaegolekar.com",
  language: "en",
  locale: "en-US",
  // Optional logo/avatar shown next to site title in the header.
  // Drop the file in `public/` and set the path here. Leave empty to hide.
  logo: "", // e.g. "/avatar.png"
  // Default Open Graph image (1200×630). Drop in public/ and reference here.
  defaultOgImage: "/og-default.png",
};

// -----------------------------------------------------------------------------
// NAV — top-of-page navigation links
// -----------------------------------------------------------------------------
export const NAV = [
  { label: "Home", href: "/" },
  { label: "Writing", href: "/blog/" },
  { label: "About", href: "/about/" },
  { label: "RSS", href: "/rss.xml" },
];

// -----------------------------------------------------------------------------
// SOCIAL — links shown in the footer (leave a value blank to hide that icon)
// -----------------------------------------------------------------------------
export const SOCIAL = {
  twitter: "https://twitter.com/akshaegolekar",
  github: "",
  linkedin: "",
  instagram: "",
  youtube: "",
  mastodon: "",
  email: "hi@akshaegolekar.com",
};

// -----------------------------------------------------------------------------
// FONTS — pick any Google Font (or fall back to a system stack)
// -----------------------------------------------------------------------------
// Steps to change a font:
//   1. Pick a font at https://fonts.google.com
//   2. Update the corresponding CSS family below.
//   3. Update `googleFontsUrl` to include the new family (the Google Fonts
//      page gives you the import URL — just paste it).
//   4. Set `googleFontsUrl: null` if you only want system fonts (fastest).
// -----------------------------------------------------------------------------
export const FONTS = {
  heading: "'Lora', ui-serif, Georgia, 'Iowan Old Style', serif",
  body: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,500;0,700;1,500&family=JetBrains+Mono:wght@400;500&display=swap" as
      | string
      | null,
};

// -----------------------------------------------------------------------------
// THEME — colors for light + dark mode, layout sizes
// -----------------------------------------------------------------------------
// Tip: pick palettes from https://coolors.co or use these tested combinations:
//   - Warm orange (current): accent #c2410c (light), #ffb454 (dark)
//   - Cool blue:             accent #2563eb (light), #60a5fa (dark)
//   - Forest green:          accent #059669 (light), #34d399 (dark)
//   - Magenta:               accent #be185d (light), #f472b6 (dark)
// -----------------------------------------------------------------------------
export const THEME = {
  light: {
    bg: "#fafaf7",
    bgSoft: "#ffffff",
    text: "#16161a",
    textMuted: "#5a5a66",
    accent: "#c2410c",
    accentSoft: "rgba(194, 65, 12, 0.12)",
    border: "#e6e6e0",
    selectionBg: "#c2410c",
    selectionText: "#ffffff",
    codeBg: "#f4f4ee",
  },
  dark: {
    bg: "#0b0b0c",
    bgSoft: "#131316",
    text: "#ececec",
    textMuted: "#9a9aa3",
    accent: "#ffb454",
    accentSoft: "rgba(255, 180, 84, 0.16)",
    border: "#26262b",
    selectionBg: "#ffb454",
    selectionText: "#0b0b0c",
    codeBg: "#16161a",
  },
  // "auto" follows the OS setting; "light" or "dark" forces a single mode.
  defaultMode: "auto" as "auto" | "light" | "dark",
  // Reading width and base font size.
  maxWidth: "720px",
  bodyFontSize: "17px",
  // Border radius used for images, code blocks, buttons, etc.
  radius: "8px",
  // Link style: "underline" (always underlined), "hover" (underline on hover),
  // "highlight" (soft accent background behind link text)
  linkStyle: "hover" as "underline" | "hover" | "highlight",
};

// -----------------------------------------------------------------------------
// CODE — syntax highlighting themes (Shiki, built into Astro)
// -----------------------------------------------------------------------------
// Browse all themes: https://shiki.style/themes
// Popular picks: github-light, github-dark, dracula, one-dark-pro, nord,
//                monokai, vitesse-light, vitesse-dark, catppuccin-mocha
// -----------------------------------------------------------------------------
export const CODE = {
  themeLight: "github-light",
  themeDark: "github-dark",
};

// -----------------------------------------------------------------------------
// FEATURES — turn things on/off
// -----------------------------------------------------------------------------
export const FEATURES = {
  readingTime: true,    // "5 min read" estimate on posts
  shareButtons: true,   // share-on-X / copy-link buttons after each post
  tags: true,           // show #tags on posts
  backToTop: true,      // floating back-to-top button on long posts
  newsletter: false,    // signup form (configure NEWSLETTER below)
  comments: false,      // comments under posts (configure GISCUS below)
  tableOfContents: false, // auto-generated TOC from h2/h3 headings
};

// -----------------------------------------------------------------------------
// NEWSLETTER — only used if FEATURES.newsletter = true
// -----------------------------------------------------------------------------
export const NEWSLETTER = {
  provider: "buttondown" as "buttondown" | "substack",
  // Buttondown: your username. Substack: full domain like "yourblog.substack.com"
  identifier: "akshaegolekar",
  title: "Get new posts in your inbox",
  description: "No spam, just new writing. Unsubscribe anytime.",
};

// -----------------------------------------------------------------------------
// GISCUS — comments via GitHub Discussions (only if FEATURES.comments = true)
// Set up at https://giscus.app and paste the values from the generated snippet.
// -----------------------------------------------------------------------------
export const GISCUS = {
  repo: "yourname/blog-comments",
  repoId: "",
  category: "General",
  categoryId: "",
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
};

// -----------------------------------------------------------------------------
// ANALYTICS — privacy-friendly, free options
// -----------------------------------------------------------------------------
export const ANALYTICS = {
  // "none" disables analytics entirely
  provider: "none" as "none" | "plausible" | "umami" | "vercel",
  // Plausible: your domain (e.g. "akshaegolekar.com")
  // Umami: full script URL (e.g. "https://analytics.example.com/script.js")
  identifier: "",
};

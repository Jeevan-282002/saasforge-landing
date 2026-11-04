# Django SaaS Foundation — Official Marketing Website

> **"Build Your SaaS Product. Not Your SaaS Infrastructure."**

This repository contains the standalone, production-ready developer marketing website and commercial lead-generation landing page for **Django SaaS Foundation**.

* **Marketing Website Repository:** [https://github.com/Jeevan-282002/saasforge-landing](https://github.com/Jeevan-282002/saasforge-landing)
* **Technical Foundation Repository (Source of Truth):** [https://github.com/Jeevan-282002/Saas-Boilerplate](https://github.com/Jeevan-282002/Saas-Boilerplate)
* **Target Deployment Platform:** Cloudflare Pages (Free Static Hosting)

---

## 1. Technology Stack

* **Framework:** [Astro](https://astro.build/) (Static Output, zero runtime overhead)
* **Language:** TypeScript (Strict checking enabled)
* **Styling:** Tailwind CSS (Custom developer dark theme inspired by Linear, Vercel, Supabase, and Stripe)
* **Icons:** Lucide Icons & handcrafted SVG architectural schemas
* **Enquiry Management:** Native Early Access Lead Engine with server-side validation, rate limiting, and local/webhook lead storage
* **SEO & Meta:** OpenGraph SVG banner, JSON-LD schema, `@astrojs/sitemap`, `robots.txt`

---

## 2. Project Architecture & Directory Structure

```
saasforge-landing/
├── public/
│   ├── favicon.svg             # Brand diamond SVG favicon
│   ├── og-image.svg            # 1200x630 OpenGraph social preview image
│   └── robots.txt              # Search engine crawler directive
├── src/
│   ├── config/
│   │   └── siteConfig.ts       # Centralized branding, copy, links, & metrics
│   ├── layouts/
│   │   └── Layout.astro        # Base layout, meta tags, OpenGraph, JSON-LD, analytics
│   ├── components/
│   │   ├── Navbar.astro        # Sticky glassmorphism header & mobile navigation drawer
│   │   ├── Hero.astro          # Hero section with interactive architecture preview
│   │   ├── Problem.astro       # Pain points & time wasted rebuilding SaaS plumbing
│   │   ├── Solution.astro      # Foundation vs custom product development breakdown
│   │   ├── Features.astro      # 12 verified technical feature cards
│   │   ├── Architecture.astro  # 5-layer system design & QuotaRegistry code walkthrough
│   │   ├── TestingValidation.astro # Verified test suite metrics & responsible engineering notice
│   │   ├── DeveloperExperience.astro # 7-step quickstart with interactive tabbed terminal
│   │   ├── DocumentationLinks.astro # Direct links to verified repository markdown files
│   │   ├── EarlyAccess.astro   # Primary conversion section with 3 enquiry paths
│   │   ├── FAQ.astro           # 10 comprehensive developer FAQs
│   │   ├── FinalCTA.astro      # High-impact closing call to action
│   │   ├── Footer.astro        # Brand footer, site map, copyright & legal notices
│   │   └── EnquiryModal.astro  # Custom production-quality Early Access application modal
│   ├── pages/
│   │   ├── index.astro         # Primary landing page
│   │   └── privacy.astro       # Privacy policy & data handling disclosure
│   └── styles/
│       └── global.css          # Custom scrollbars, glassmorphism, animations
├── astro.config.mjs            # Astro configuration with sitemap & Tailwind
├── tailwind.config.mjs         # Theme extension (colors, dark surfaces, fonts)
├── tsconfig.json               # Strict TypeScript configuration
├── wrangler.toml               # Cloudflare Pages deployment configuration
├── .env.example                # Template for environment variables
└── package.json                # Project dependencies & build scripts
```

---

## 3. Local Development

### Prerequisites

* Node.js v18.0.0+ (Tested on Node v24.22.1)
* pnpm (or npm / yarn)

### Quickstart

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

4. **Run production build:**
   ```bash
   pnpm build
   ```
   Output files will be generated in `dist/`.

5. **Preview production build:**
   ```bash
   pnpm preview --port 4321
   ```

---

## 4. Customer Enquiry & Early Access Lead Management

This landing page features a fully custom, production-quality Early Access application modal with a dedicated secure backend endpoint at `/api/early-access`.

### A. Architecture & Lead Storage

Incoming applications are validated on the server, sanitized against XSS, protected by a bot honeypot, rate-limited per IP, and saved directly to disk:

* **File Storage:** `data/leads.jsonl` (append-only log) and `data/leads.json` (structured array).
* **Optional Webhook Sync:** If `GOOGLE_SHEETS_WEBHOOK_URL` or `LEAD_WEBHOOK_URL` is set, submissions are automatically and asynchronously forwarded to your Google Apps Script Web App, Zapier, Make, or CRM without blocking user responses or exposing secrets.

### B. Form Fields Implemented

1. **Full Name** *(Required)*
2. **Work Email** *(Required)*
3. **Phone Number** *(Required - Validated for 10-digit Indian mobile numbers starting with 6, 7, 8, or 9)*
4. **Company / Startup Name** *(Optional)*
5. **Your Role** *(Required)*:
   * Founder
   * Django Developer
   * Software Agency
   * Freelancer
   * Other
6. **What are you planning to build?** *(Required)*:
   * SaaS Application
   * Multi-Tenant Application
   * Client Project
   * Internal Business Application
   * Other
7. **Expected Project Timeline** *(Required)*:
   * Immediately
   * Within 1 Month
   * Within 3 Months
   * Just Exploring
8. **Additional Requirements** *(Optional)*:
   * Multi-tenancy specifications, expected tenant scale, or questions.

---

## 5. Deployment Guide

### Option 1: Cloudflare Pages (Recommended)

Cloudflare Pages provides global CDN distribution, automatic SSL, and continuous deployment from Git on their generous free static tier.

#### Method A: Git Integration via Cloudflare Dashboard

1. Push your changes to the GitHub repository: `https://github.com/Jeevan-282002/saasforge-landing`
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Compute (Workers) > Workers & Pages > Create application > Pages > Connect to Git**.
3. Select the `saasforge-landing` repository.
4. Configure Build Settings:
   * **Framework preset:** `Astro`
   * **Build command:** `pnpm build` (or `npm run build`)
   * **Build output directory:** `dist`
5. Environment Variables:
   * (Optional) `GOOGLE_SHEETS_WEBHOOK_URL` = your Google Apps Script or CRM webhook endpoint
   * Add `NODE_VERSION` = `20` or `22`
6. Click **Save and Deploy**.
7. Connect your custom domain under **Custom domains** tab (e.g. `djangosaasfoundation.com` or `saasforge.dev`).

#### Method B: Wrangler CLI Deployment

```bash
pnpm add -g wrangler
wrangler pages deploy dist --project-name=saasforge-landing
```

---

### Option 2: Render (Static Site)

1. Log in to [Render](https://dashboard.render.com/) and select **New +** → **Static Site**.
2. Connect `https://github.com/Jeevan-282002/saasforge-landing`.
3. Configure settings:
   * **Name:** `django-saas-foundation`
   * **Branch:** `main`
   * **Build Command:** `pnpm build` (or `npm install && npm run build`)
   * **Publish Directory:** `dist`
4. Under **Environment Variables** (Optional):
   * `GOOGLE_SHEETS_WEBHOOK_URL` = your Google Sheets webhook endpoint
5. Click **Create Static Site**.

---

## 6. Technical Source of Truth & Verified Metrics

All technical claims on this marketing site are grounded in the verified capabilities of the original repository:
[https://github.com/Jeevan-282002/Saas-Boilerplate](https://github.com/Jeevan-282002/Saas-Boilerplate)

* **Configuration A (Full Integration Suite):** 152 passed, 2 skipped
* **Configuration B (Foundation Only):** 105 passed, 11 skipped
* **Fresh Database Migrations:** 20 core platform tables, 0 demo tables
* **Database Isolation Checks:** 9/9 passed
* **Database Router Checks:** 3/3 passed
* **Code Quality:** Ruff: 0 errors

---

## 7. License & Credits

* **Marketing Website Code:** MIT License
* **Django SaaS Foundation:** Commercial Source-Available License (Maintainer: [@Jeevan-282002](https://github.com/Jeevan-282002))
* **Disclaimer:** Django SaaS Foundation is an independent product and is not affiliated with or endorsed by the Django Software Foundation.

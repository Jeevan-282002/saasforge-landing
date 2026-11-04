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
* **Enquiry Management:** [Tally Forms](https://tally.so) embed / modal integration with local development fallback
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
│   │   └── EnquiryModal.astro  # Tally embed / interactive lead preview modal
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

## 4. Customer Enquiry & Lead Management (Tally Forms)

This landing page collects developer enquiries without requiring a separate backend database. It uses **Tally Forms** ([https://tally.so](https://tally.so)).

### A. Environment Configuration

Add the public URL of your Tally form to your environment:

```env
PUBLIC_TALLY_FORM_URL=https://tally.so/r/laBxAB
```

> **Development Mode Notice:** If `PUBLIC_TALLY_FORM_URL` is empty, the website will display a helpful development preview banner and render an interactive demonstration form. It will not fake successful submissions or make unauthorized network calls.

### B. Form Fields Implemented

1. **Full Name** *(Required)*
2. **Email Address** *(Required)*
3. **Enquiry Type** *(Required)*:
   * Request Early Access
   * Commercial Licensing Enquiry
   * General Question
   * Partnership / Collaboration
4. **I am a** *(Required)*:
   * Individual Developer
   * Freelancer
   * Startup Founder
   * Software Agency
   * Engineering Team
   * Other
5. **Organization Name** *(Optional)*
6. **Capabilities of Interest**:
   * Multi-tenancy
   * 4-Tier RBAC
   * Quota Engine
   * Audit Logging
   * Celery & Outbox
   * Complete Core
7. **What are you planning to build?**
8. **Additional Message or Specific Questions**

### C. Setting Up Tally Notifications & Lead Storage

Follow these steps to manage incoming customer enquiries in Tally:

1. **Create Form:** Go to [Tally.so](https://tally.so), create a free account, and create a form matching the fields listed above.
2. **Enable Email Notifications:**
   * In your Tally form editor, navigate to **Settings** → **Email notifications**.
   * Toggle **"Notify me when a response is submitted"**.
   * Enter your preferred email address to receive real-time notifications for every enquiry.
3. **Connect Google Sheets:**
   * In Tally, navigate to **Integrations** → **Google Sheets**.
   * Authenticate your Google account and select an existing spreadsheet or create a new one (e.g. `Django SaaS Foundation Leads`).
   * Every new submission will automatically populate a new row with timestamps, email, organization, and answers.
4. **Export Data:**
   * At any time, you can export submissions from your Tally dashboard as a CSV or Excel file for CRM import.
5. **Copy Form URL:**
   * Copy the public form URL (e.g., `https://tally.so/r/wXXXXX`).
   * Add it to your `.env` file or Cloudflare Pages environment variables as `PUBLIC_TALLY_FORM_URL`.

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
   * Add `PUBLIC_TALLY_FORM_URL` = `https://tally.so/r/YOUR_FORM_ID`
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
4. Under **Environment Variables**, add:
   * `PUBLIC_TALLY_FORM_URL` = your Tally link
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

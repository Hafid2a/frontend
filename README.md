# نجد NAJD — Ecommerce Frontend

Premium Saudi men's grooming brand frontend. Next.js 16, TypeScript, Tailwind CSS v4, RTL Arabic-first.

## Stack

- **Next.js 16** App Router
- **TypeScript** strict
- **Tailwind CSS v4** (CSS-first config)
- **Framer Motion** animations
- **Zustand** (persisted cart + checkout state)
- **TanStack Query v5** (order fetching)
- **Zod + React Hook Form** (checkout/contact validation)
- **next/font** (IBM Plex Sans Arabic + Inter)

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Fill in your env vars (see below)
# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g. `https://najdofficial.com`) |
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `https://api.najdofficial.com`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta/Facebook Pixel ID (optional) |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | TikTok Pixel ID (optional) |
| `NEXT_PUBLIC_SNAP_PIXEL_ID` | Snapchat Pixel ID (optional) |

## Docker Build

```bash
# Build image
docker build -t najd-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.najdofficial.com \
  -e NEXT_PUBLIC_SITE_URL=https://najdofficial.com \
  najd-frontend
```

The Dockerfile uses `output: standalone` for optimized production builds.

## Easypanel

- **Builder:** Prefer **Dockerfile** (this repo uses **Node 20**). If you use **Nixpacks**, keep branch **`main`** so you get `nixpacks.toml` + `.nvmrc` (Node 20), or set env **`NIXPACKS_NODE_VERSION=20`** for the service.
- **Stale builds:** If deploy logs show **`GIT_SHA=ce32d43…`** (or any old hash), Easypanel is not cloning current `main`. Open **Source** → branch **`main`** → **Deploy**; remove a custom **`GIT_SHA`** env var if you added one.
- **Auto hook:** This repo ships `.github/workflows/easypanel-deploy-hook.yml` — add GitHub secret **`EASYPANEL_DEPLOY_WEBHOOK`** (Easypanel “Deploy Webhook” URL) to trigger redeploy on each push to `main`.

## Page Structure

| Route | Description |
|---|---|
| `/` | Home — Hero, products, reviews, FAQ |
| `/products` | Collection — filter chips, comparison table |
| `/products/[slug]` | Product landing — offer selector, mechanism, reviews |
| `/about` | Brand story, quality standards |
| `/contact` | WhatsApp CTA, contact form, delivery FAQ |
| `/thank-you/[orderId]` | Order confirmation, fetches order from API |

## Products

| Slug | Name | Problem |
|---|---|---|
| `najd-clear` | نجد كلير | حبوب الحلاقة والشعر تحت الجلد |
| `najd-align` | نجد ألاين | فوضى اللحية الكثيفة |
| `najd-rest` | نجد ريست | آثار السهر والهالات |

## Offers Pricing

| Qty | Price | Notes |
|---|---|---|
| 1 | 199 SAR | — |
| 2 | 279 SAR | **الأكثر اختياراً** (default) |
| 3 | 349 SAR | **أفضل قيمة** |

## Checkout Flow

1. User selects offer → Added to Zustand cart
2. Cart drawer opens (slides from right, RTL)
3. Cross-sell suggestion shown in cart
4. "أكمل الطلب" → CheckoutModal (COD only)
5. Name + Saudi phone validation (normalizes to +9665XXXXXXXX)
6. POST `/orders` to backend
7. If upsell returned → UpsellModal with 10-15s countdown at 99 SAR
8. Redirect to `/thank-you/[orderId]`

## API Endpoints Used

```
POST /orders          → create order
POST /orders/:id/upsell → accept upsell
GET  /orders/:id      → get order detail (thank you page)
```

## Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `najd-green` | `#0F3D2E` | Primary CTA, accents |
| `deep-night` | `#07110D` | Page background |
| `warm-sand` | `#C8A96A` | Gold accents, prices |
| `stone` | `#F4F0E7` | Primary text |
| `charcoal` | `#1C1C1A` | Cards, modals |
| `muted` | `#7A7468` | Secondary text |

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

### `ERR_CONNECTION_REFUSED` في المتصفح

المتصفح يحاول فتح عنوانًا **ولا يوجد أي برنامج يستمع على ذلك المنفذ**:

| ما تفتحه | المطلوب |
|----------|---------|
| `http://localhost:3000` | شغّل الواجهة: من مجلد `frontend` نفّذ `npm run dev` |
| طلبات إلى الـ API تفشل (سلة، طلب، صفحة الشكر) | مع **`NEXT_PUBLIC_MOCK_ORDERS=false`** الطلبات تمشي لـ **`/api/backend/...`** (نفس دومين الموقع) ثم الخادم يوجّه للباكند — **ما محتاج** تضبط CORS للمتصفح. تأكد الباكند شغال وأن **`NEXT_PUBLIC_API_URL`** (أو **`API_URL`** على السيرفر) صحيح. أو **`NEXT_PUBLIC_MOCK_ORDERS=true`** للتطوير بدون باكند. |

للباكند الحقيقي: من `backend` استخدم Docker (`docker compose up --build`) ثم [http://localhost:8000/health](http://localhost:8000/health). عندها يمكنك ضبط `NEXT_PUBLIC_MOCK_ORDERS=false` واستخدام `NEXT_PUBLIC_API_URL=http://localhost:8000` (أو `http://127.0.0.1:8000`).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_MOCK_ORDERS` | `true` = طلبات وهمية داخل Next — **بدون MaxMind** (كل الطلبات تمر). `false` = الباكند الحقيقي |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g. `https://najdofficial.com`) |
| `NEXT_PUBLIC_API_URL` | عنوان الباكند للبروكسي (`/api/backend/...`) وللروابط العامة |
| `API_URL` / `BACKEND_URL` | (اختياري، سيرفر فقط) إن وُجد، يُفضَّل للاتصال الداخلي مثل `http://backend:8000` |
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

- **متغيرات جاهزة:** انسخ ملف [`deploy/easypanel-frontend.env`](./deploy/easypanel-frontend.env) إلى **Variables** خدمة الفرونت (احذف تكرار `NEXT_PUBLIC_SITE_URL` ولا تضع `localhost` على السيرفر).
- **تشغيل الإنتاج:** `output: 'standalone'` — **`npm start`** ينفّذ `node .next/standalone/server.js` (لا تستعمل `next start`). Dockerfile يشغّل `node server.js` داخل مجلد الـ standalone.
- **واجهة Next + بروكسي الطلبات:** على **خدمة الفرونت** عيّن **`API_URL=http://<اسم-خدمة-الباكند>:8000`** (من **شبكة Docker الداخلية**). يمكنك عدة عناوين مفصولة بفاصلة؛ يُجرّب بالترتيب ثم تلقائياً `backend` و`api` و`host.docker.internal`. لا تستخدم `localhost` إلا إن الباكند فنفس الحاوية.
- **Builder:** Use **Dockerfile** if you can (this repo is **Node 20** end-to-end). Nixpacks defaults to **Node 18**, which **cannot** build Next.js 16.
- **Nixpacks + Node 20:** In the service **Environment** (build-time), set **`NIXPACKS_NODE_VERSION=20`**. Relying only on `nixpacks.toml` `[variables]` is **not** enough—Nixpacks reads version before that. A **`.nvmrc`** with `20` in the deployed tree also works (present on `main` after the Node 20 pin commits).
- **Stale builds:** If logs show **`GIT_SHA=ce32d43…`**, you are **not** on current **`main`** (no `.nvmrc` / pinned Node there). Fix **Source** branch to **`main`**, redeploy, and delete any custom **`GIT_SHA`** env var.
- **Webhook:** Repo includes `.github/workflows/easypanel-deploy-hook.yml` — secret **`EASYPANEL_DEPLOY_WEBHOOK`** = Easypanel deploy URL triggers redeploys on push.

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
6. POST إلى `/api/backend/orders` (يُحوّلها Next للباكند؛ تفادي CORS)
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

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
| `http://localhost:8000/health` (أو عنوان `NEXT_PUBLIC_API_URL`) لا يفتح | شغّل الباكند (مثلًا من جذر المشروع: `docker compose up --build`). بدون مستمع على 8000 سيفشل أي طلب للـ API. |
| تجربة سريعة بلا باكند | في `.env.local` ضَع **`NEXT_PUBLIC_MOCK_ORDERS=true`** ثم **`npm run dev`** من جديد — الطلبات تذهب إلى **`/api/orders`** داخل Next فقط. |

### «لا يوجد اتصال بالخادم» / «فشل الطلب» / `Failed to fetch`

المتصفح يتصل **مباشرة** بـ **`NEXT_PUBLIC_API_URL`** (مسار **`/api/backend` معطّل في هذا الفرع**؛ انظر [`app/api/backend/[...path]/route.ts`](./app/api/backend/%5B...path%5D/route.ts) و[`lib/api.ts`](./lib/api.ts)).

1. افتح من **نفس المتصفح**: `NEXT_PUBLIC_API_URL` + **`/health`** (مثال: `http://localhost:8000/health`). إن لم يعمل، الإصلاح ليس CORS بل تشغيل الـ API أو العنوان/المنفذ.
2. إن `/health` يعمل لكن الطلب من الموقع يفشل: راجع **`CORS_ORIGINS`** على الباكند — لازم يتضمن **أصل الموقع بالضبط** (مثل `https://example.com` و`https://www.example.com` إن استخدمتهما؛ و`http://127.0.0.1:3000` منفصل عن `http://localhost:3000`).
3. **`NEXT_PUBLIC_*` تُثبَّت وقت `npm run build`**: على Docker/Easypanel مرّر **`NEXT_PUBLIC_API_URL=https://api.example.com`** عند البناء (عنوان **عام** يصل إليه الزائر، وليس اسم خدمة داخل Docker مثل `http://backend:8000`).
4. إن الموقع **HTTPS** والـ API **HTTP** على دومين عام، المتصفح قد يمنع المحتوى المختلط — استعمل **HTTPS** للـ API في الإنتاج.

للباكند الحقيقي: من `backend` استخدم Docker (`docker compose up --build`) ثم [http://localhost:8000/health](http://localhost:8000/health). عندها يمكنك ضبط `NEXT_PUBLIC_MOCK_ORDERS=false` واستخدام `NEXT_PUBLIC_API_URL=http://localhost:8000` (أو `http://127.0.0.1:8000`).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_MOCK_ORDERS` | `true` = طلبات وهمية داخل Next — **بدون MaxMind** (كل الطلبات تمر). `false` = الباكند الحقيقي |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g. `https://najdofficial.com`) |
| `NEXT_PUBLIC_API_URL` | عنوان الـ API **العام** الذي يستدعيه **المتصفح** مباشرة (طلبات الطلب والـ upsell و`thank-you`). يُشتق أيضًا من `API_BASE_URL` أو `API_URL` عند البناء إن لم تُضبط صراحةً (انظر `next.config.ts`). |
| `API_BASE_URL` / `API_URL` | (اختياري) بديل لاشتقاق `NEXT_PUBLIC_API_URL` وقت البناء — يجب أن يكون **قابلاً للوصول من المتصفح**، ليس اسم خدمة Docker داخلي فقط. |
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
- **عنوان الـ API للمتصفح:** عيّن **`NEXT_PUBLIC_API_URL=https://api.example.com`** (أو دومينك) **عند البناء**. الطلبات لا تمر عبر `/api/backend` في هذا الفرع؛ لا تضع عنوانًا داخليًا (`http://backend:8000`) إن كان الزائر لا يستطيع فتحه من المتصفح. على الباكند أضف أصل الواجهة إلى **`CORS_ORIGINS`**.
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

| Slug | Name | Focus |
|---|---|---|
| `najd-night-dew` | نجد ندى الليل | ترطيب مظهر البشرة ليلاً |
| `najd-night-calm` | نجد لمسة الهدوء | مظهر أهدأ بعد يوم طويل |
| `najd-night-glow` | نجد لمعة الراحة | تأثير بصري خفيف للإشراق |

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
6. مع **`NEXT_PUBLIC_MOCK_ORDERS=false`**: `POST` إلى **`{NEXT_PUBLIC_API_URL}/orders`** من المتصفح (يتطلّب CORS صحيح على الباكند). مع **`true`**: `POST` إلى **`/api/orders`** (وهمي داخل Next).
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
| `najd-green` | `#C75B7E` | Primary CTA, accents (rose) |
| `deep-night` | `#120A14` | Page background (plum-black) |
| `warm-sand` | `#E8B9A8` | Accents / rose-gold highlights |
| `stone` | `#FDF8FA` | Primary text on dark surfaces |
| `charcoal` | `#1C141F` | Cards, modals |
| `muted` | `#A89DA3` | Secondary text |

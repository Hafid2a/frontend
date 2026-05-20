FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# تُثبَّت في حزمة المتصفح — مرّرها عند docker build / Easypanel
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_MOCK_ORDERS=false
ARG NEXT_PUBLIC_USE_API_PROXY=false
ARG NEXT_PUBLIC_SITE_URL=
ARG NEXT_PUBLIC_META_PIXEL_ID=
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID=
ARG NEXT_PUBLIC_SNAP_PIXEL_ID=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MOCK_ORDERS=$NEXT_PUBLIC_MOCK_ORDERS
ENV NEXT_PUBLIC_USE_API_PROXY=$NEXT_PUBLIC_USE_API_PROXY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID
ENV NEXT_PUBLIC_TIKTOK_PIXEL_ID=$NEXT_PUBLIC_TIKTOK_PIXEL_ID
ENV NEXT_PUBLIC_SNAP_PIXEL_ID=$NEXT_PUBLIC_SNAP_PIXEL_ID
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# يستمع على كل الواجهات (Docker / Easypanel) — غيّر PORT في المنصة إن لزم (مثلاً 80)
ENV NODE_OPTIONS=--dns-result-order=ipv4first
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# عند NEXT_PUBLIC_USE_API_PROXY=true: مرّر BACKEND_INTERNAL_URL وقت التشغيل (مثل http://backend:8000).
# بدون بروكسي: مرّر NEXT_PUBLIC_API_URL وقت البناء كعنوان API يصل إليه المتصفح + CORS على الباكند.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# يستمع على كل الواجهات (Docker / Easypanel) — غيّر PORT في المنصة إن لزم (مثلاً 80)
ENV NODE_OPTIONS=--dns-result-order=ipv4first
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# وقت التشغيل: الطلبات من المتصفح إلى NEXT_PUBLIC_API_URL (تُبنى عند npm run build)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]

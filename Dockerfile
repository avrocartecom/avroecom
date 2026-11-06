# ==============================================================================
# AVRO CUSTOMER STOREFRONT & BACKOFFICE — PRODUCTION DOCKERFILE
# ==============================================================================

FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
ENV NODE_ENV production

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl curl

ENV NODE_ENV production
ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app ./

RUN mkdir -p /app/public/uploads/products && \
    chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3001

HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["npm", "start"]

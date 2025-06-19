# syntax=docker.io/docker/dockerfile:1

############################################
# 1) Install dependencies with Bun
############################################
FROM oven/bun:1-alpine AS deps
WORKDIR /app
# Copy only manifest + lock so Docker layer caches unless you change deps
COPY package.json bun.lockb* ./
# Install exactly what's in bun.lockb (or generate one if none exists)
RUN bun install --frozen-lockfile

############################################
# 2) Build with Bun
############################################
FROM oven/bun:1-alpine AS builder
WORKDIR /app
# Reuse installed deps
COPY --from=deps /app/node_modules ./node_modules
# Copy in the rest of your source
COPY . .
# Build your Next.js app
RUN bun run build

############################################
# 3) Runtime using Node
############################################
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Create a non‐root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy in only the pieces needed at runtime
COPY --from=builder /app/public               ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone   ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static       ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]

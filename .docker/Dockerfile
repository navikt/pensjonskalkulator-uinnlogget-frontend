FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs node_modules ./node_modules
COPY --chown=nextjs:nodejs next.config.mjs ./
COPY --chown=nextjs:nodejs public ./public/
COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static
COPY --chown=nextjs:nodejs middleware.ts ./

USER nextjs

ENV PORT=3000

EXPOSE 3000


CMD ["node", "server.js"]

# ENV NODE_ENV=production

# WORKDIR /app

# COPY next.config.mjs ./
# COPY .next ./.next
# COPY public ./public
# COPY node_modules ./node_modules

# ENV PORT=8080

# CMD ["./node_modules/next/dist/bin/next", "start"]
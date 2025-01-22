FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json .npmrc ./
COPY --chown=nextjs:nodejs node_modules ./node_modules
COPY . .
# COPY --chown=nextjs:nodejs next.config.mjs ./
# COPY --chown=nextjs:nodejs public ./public/

RUN npm run build

USER nextjs

ENV PORT=3000

EXPOSE 3000


CMD ["node", ".next/standalone/server.js"]

# ENV NODE_ENV=production

# WORKDIR /app

# COPY next.config.mjs ./
# COPY .next ./.next
# COPY public ./public
# COPY node_modules ./node_modules

# ENV PORT=8080

# CMD ["./node_modules/next/dist/bin/next", "start"]
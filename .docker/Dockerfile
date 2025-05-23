FROM gcr.io/distroless/nodejs20-debian12@sha256:a69b487c1d156e3aeaab0ffb587f46248c8e891e289081a3c28f7104a69c4515

ENV NODE_ENV=production

WORKDIR /app

COPY next.config.mjs ./
COPY .next ./.next
COPY public ./public
COPY node_modules ./node_modules
COPY dist server
COPY package.json .

ENV PORT=8080

CMD ["server/server.js"]

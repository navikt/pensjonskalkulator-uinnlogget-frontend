FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22

ENV NODE_ENV=production
ENV TZ="Europe/Oslo"

WORKDIR /app

COPY next.config.mjs ./
COPY .next ./.next
COPY public ./public
COPY node_modules ./node_modules
COPY dist server
COPY package.json .

ENV PORT=8080

CMD ["server/server.js"]

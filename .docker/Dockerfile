FROM node:20

ENV TZ="Europe/Oslo"

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
CMD ["npm","start"]
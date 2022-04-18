FROM node:16

EXPOSE 8080

ENV NODE_ENV=production PORT=8080

WORKDIR /app

RUN groupadd app && useradd -d /app -g app app && chown app:app /app

USER app

COPY package.json package-lock.json ./

RUN npm ci --no-fund

COPY . ./

CMD ["node", "./lib/index.js"]

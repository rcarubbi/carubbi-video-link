FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install  

COPY . .

FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app .


EXPOSE 3000

CMD ["node", "src/server.js"]

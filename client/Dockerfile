FROM node:20-alpine AS builder

RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --strict

COPY . .

ARG SIGNALING_SERVER_URL

ENV VITE_SIGNALING_SERVER_URL=${SIGNALING_SERVER_URL}

RUN pnpm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

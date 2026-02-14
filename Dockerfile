# 构建应用
FROM node:18-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN [ ! -e ".env" ] && cp .env.example .env || true
RUN pnpm build

# 最小化镜像
FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/.output/public ./public

EXPOSE 12445
CMD ["serve", "public", "-l", "12445"]

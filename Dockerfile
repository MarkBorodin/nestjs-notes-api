FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-alpine AS production

RUN corepack enable && corepack prepare pnpm@10.26.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/src/main.js"]

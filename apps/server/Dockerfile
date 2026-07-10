FROM node:20-alpine AS base
ARG PNPM_VERSION=10.24.0
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/server/package.json ./apps/server/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile || pnpm install

FROM deps AS build
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server
RUN pnpm --filter @collabe-md/shared build
RUN pnpm --filter @collabe-md/server build

FROM build AS deploy
RUN pnpm --filter @collabe-md/server deploy --prod --legacy /app/deploy

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deploy /app/deploy/package.json ./
COPY --from=deploy /app/deploy/node_modules ./node_modules
COPY --from=build /app/apps/server/dist ./dist
EXPOSE 3001 3002
CMD ["node", "dist/index.js"]

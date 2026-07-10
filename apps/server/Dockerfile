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

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/server/dist ./dist
COPY --from=build /app/apps/server/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/shared/dist ./node_modules/@collabe-md/shared/dist
COPY --from=build /app/packages/shared/package.json ./node_modules/@collabe-md/shared/package.json
EXPOSE 3001 3002
CMD ["node", "dist/index.js"]

FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock turbo.json ./

COPY apps/web/package.json ./apps/web/
COPY packages/core/package.json ./packages/core/

RUN yarn install --frozen-lockfile
COPY . .

RUN --mount=type=secret,id=VITE_TOLGEE_CDN \
    VITE_TOLGEE_CDN="$(cat /run/secrets/VITE_TOLGEE_CDN)" \
    npx turbo run build --filter=web

FROM node:22-alpine
RUN yarn global add serve

COPY --from=builder /app/apps/web/dist /app
EXPOSE 5173

CMD ["serve", "-s", "/app", "-l", "5173"]

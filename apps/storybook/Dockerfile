# syntax=docker/dockerfile:1.7
# Storybook do Luck como site estático: build com Node + pnpm, servido por nginx sem root.
#
#   docker build -f apps/storybook/Dockerfile -t luck-storybook .
#   docker run --rm -p 8080:8080 luck-storybook
#
# O contexto de build é a RAIZ do monorepo (o Storybook depende de tokens, styles e core).

ARG NODE_VERSION=24.21.0
ARG NGINX_VERSION=1.30.5

# ---------- build ----------
FROM node:${NODE_VERSION}-slim AS build

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    CI=true \
    # Sem hooks de git dentro da imagem.
    LEFTHOOK=0 \
    STORYBOOK_DISABLE_TELEMETRY=1

# Mesma versão do packageManager do package.json.
RUN npm install -g pnpm@12.6.0 --no-fund --no-audit

WORKDIR /repo

# 1) Só os manifestos: a camada de dependências é reaproveitada enquanto o lockfile não mudar.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/tokens/package.json packages/tokens/
COPY packages/styles/package.json packages/styles/
COPY packages/core/package.json packages/core/
COPY packages/react/package.json packages/react/
COPY packages/angular/package.json packages/angular/
COPY packages/vue/package.json packages/vue/
COPY apps/storybook/package.json apps/storybook/

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile \
      --filter @luck/storybook... \
      --filter @luck/core...

# 2) Código-fonte e build: tokens → styles → core → Storybook.
COPY packages/tokens packages/tokens
COPY packages/styles packages/styles
COPY packages/core packages/core
COPY apps/storybook apps/storybook

RUN pnpm build:core \
 && pnpm --filter @luck/storybook build

# ---------- runtime ----------
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION}-alpine AS runtime

LABEL org.opencontainers.image.title="Luck · Storybook" \
      org.opencontainers.image.description="Documentação visual do Luck, o design system do ecossistema WL3" \
      org.opencontainers.image.source="https://github.com/welllucky/luck"

COPY apps/storybook/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /repo/apps/storybook/storybook-static /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1

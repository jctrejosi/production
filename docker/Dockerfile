# syntax=docker/dockerfile:1
# ============================================================
# Imagen ÚNICA de PRODDSI (Suite Producción y Abastecimiento).
#
# La suite es hoy una sola pieza: la SPA React/Vite de `Interface_web/`.
# El contenedor sirve el build estático con Caddy en :8080 (sin TLS) y vive
# en la red `shared_edge`; el edge compartido (`edge_caddy`, repo ecommerce)
# es el único que publica 80/443 y termina TLS.
#
# Construir: docker compose -f docker/docker-compose.yml build
# ============================================================

# ── 1. Build de la SPA ──────────────────────────────────────
FROM node:22-bookworm-slim AS build
ENV CI=true
# pnpm fijado a la misma versión con la que se generó pnpm-lock.yaml.
RUN npm install -g --force pnpm@10.34.3 --no-fund --no-audit

WORKDIR /build
# Solo el manifiesto y el lockfile primero: la capa de dependencias se cachea
# y solo se invalida cuando cambian.
COPY Interface_web/package.json Interface_web/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY Interface_web/ ./
# `build` = tsc --noEmit && vite build → falla el build si hay errores de tipos.
RUN pnpm run build

# ── 2. Runtime estático (Caddy, sin TLS) ────────────────────
FROM caddy:2.11.7 AS runtime

# Config propia: :8080, sin admin API, sin auto-HTTPS, cabeceras de seguridad.
COPY docker/Caddyfile /etc/caddy/Caddyfile
# Solo el resultado del build; nunca node_modules ni fuentes.
COPY --from=build /build/dist /srv

# El proceso corre sin privilegios (ver docker-compose.yml: user 1000:1000).
EXPOSE 8080

# La imagen oficial marca /usr/bin/caddy con `cap_net_bind_service` (para poder
# escuchar en :80/:443 como no-root). Con `cap_drop: ALL` esa capability no está
# en el bounding set y el kernel rechaza ejecutarlo (`operation not permitted`).
# Una copia con `cp` pierde los xattrs, así que el binario arranca limpio.
RUN cp /usr/bin/caddy /usr/local/bin/caddy \
 && chmod 0755 /usr/local/bin/caddy

ENTRYPOINT ["/usr/local/bin/caddy"]
CMD ["run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

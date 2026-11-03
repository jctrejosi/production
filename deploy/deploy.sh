#!/usr/bin/env bash
# ============================================================
# Despliegue de producción de PRODDSI en el VPS
# (Windows + WSL Ubuntu + Docker).
#
# Uso:
#   bash deploy/deploy.sh                 # despliega origin/dev
#   bash deploy/deploy.sh <sha|ref>       # despliega un commit/ref concreto
#   DEPLOY_PATH=/ruta bash deploy/deploy.sh
#
# Lo usan GitHub Actions (runner self-hosted) y el operador a mano.
# Es idempotente: deja el checkout en `dev`, reconstruye la imagen, recrea
# el contenedor y espera a que el healthcheck quede `healthy`.
#
# No hay base de datos ni secretos: el sitio es estático.
# ============================================================
set -Eeuo pipefail

ROOT="${DEPLOY_PATH:-/home/deploy/production}"
TARGET="${1:-origin/dev}"
COMPOSE_FILE="$ROOT/docker/docker-compose.yml"
APP_CONTAINER="production_web"
EDGE_CONTAINER="edge_caddy"
PUBLIC_HOST="${PUBLIC_HOST:-production.jcti.xyz}"
PUBLIC_URL="${PUBLIC_URL:-https://${PUBLIC_HOST}/}"

timestamp() { date '+%Y-%m-%d %H:%M:%S'; }
log()  { printf '[deploy %s] %s\n' "$(timestamp)" "$*"; }
warn() { printf '[deploy %s] AVISO: %s\n' "$(timestamp)" "$*" >&2; }
die()  { printf '[deploy %s] ERROR: %s\n' "$(timestamp)" "$*" >&2; exit 1; }

cd "$ROOT" 2>/dev/null || die "No existe DEPLOY_PATH=$ROOT"
[[ -f "$COMPOSE_FILE" ]] || die "Falta $COMPOSE_FILE"
command -v git    >/dev/null || die "git no está instalado"
command -v docker >/dev/null || die "docker no está en PATH"
docker info >/dev/null 2>&1 || die "Docker no responde (revisa systemctl status docker)"

# El checkout puede heredar un core.sshCommand con ruta de Windows
# (C:/PROGRA~1/Git/usr/bin/ssh.exe), que no sirve dentro de WSL. Si hay clave
# de despliegue, se usa solo para estos comandos.
GIT_SSH_KEY="${GIT_SSH_KEY:-/etc/mercaldas/deploy_key}"
if [[ -r "$GIT_SSH_KEY" ]]; then
  export GIT_SSH_COMMAND="${GIT_SSH_COMMAND:-ssh -i $GIT_SSH_KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new}"
fi

# El checkout puede pertenecer a otro usuario de Windows; se marca como
# confiable solo para estos comandos y se desactivan hooks (p. ej. LFS).
git_here() {
  git -c safe.directory="$ROOT" -c core.hooksPath=/nonexistent -C "$ROOT" "$@"
}

log "Repositorio: $ROOT"
log "Objetivo   : $TARGET"

git_here fetch --prune origin '+refs/heads/dev:refs/remotes/origin/dev'
git_here rev-parse --verify --quiet "$TARGET^{commit}" >/dev/null \
  || die "El commit/ref '$TARGET' no existe tras el fetch"

# Checkout determinista: descarta cambios locales en archivos versionados
# (en producción no se editan a mano). Los archivos ignorados no se tocan.
git_here checkout -f -B dev "$TARGET"
COMMIT="$(git_here rev-parse --short=12 HEAD)"
SUBJECT="$(git_here log -1 --pretty=%s)"
log "Checkout en dev: $COMMIT — $SUBJECT"

docker compose -f "$COMPOSE_FILE" config --quiet \
  || die "docker compose config falló (revisa docker/docker-compose.yml)"

log "Construyendo imagen proddsi/web:latest…"
docker compose -f "$COMPOSE_FILE" build web

log "Levantando/actualizando el contenedor…"
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

log "Esperando healthcheck de $APP_CONTAINER…"
STATUS=""
for _ in $(seq 1 60); do
  STATUS="$(docker inspect -f \
    '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
    "$APP_CONTAINER" 2>/dev/null || true)"
  case "$STATUS" in
    healthy)
      log "Contenedor healthy."
      break
      ;;
    unhealthy|exited|dead)
      docker logs --tail 150 "$APP_CONTAINER" 2>&1 || true
      die "El contenedor quedó en estado '$STATUS'."
      ;;
  esac
  sleep 3
done

if [[ "$STATUS" != "healthy" ]]; then
  docker logs --tail 150 "$APP_CONTAINER" 2>&1 || true
  die "Timeout esperando healthy (último estado: '${STATUS:-desconocido}')."
fi

# El edge es de otro proyecto (ecommerce). Se avisa si no está o no publica
# este host, pero no se modifica desde aquí.
if docker inspect "$EDGE_CONTAINER" >/dev/null 2>&1; then
  if ! docker exec "$EDGE_CONTAINER" cat /etc/caddy/Caddyfile 2>/dev/null \
      | grep -q "$APP_CONTAINER"; then
    warn "El Caddyfile de $EDGE_CONTAINER no menciona $APP_CONTAINER."
    warn "Actualiza el repo ecommerce (docker/edge/Caddyfile) y recarga el edge."
  fi
else
  warn "No existe $EDGE_CONTAINER: nadie publica 80/443."
fi

# Comprobación de punta a punta por el edge (TLS + DNS).
if command -v curl >/dev/null 2>&1 && docker inspect "$EDGE_CONTAINER" >/dev/null 2>&1; then
  if curl -fsS --max-time 20 --cacert /etc/mercaldas/edge-tls/origin.pem --resolve "${PUBLIC_HOST}:443:127.0.0.1" "$PUBLIC_URL" >/dev/null 2>&1; then
    log "HTTPS público OK: $PUBLIC_URL"
  else
    warn "El contenedor está sano, pero $PUBLIC_URL no respondió por el edge."
    warn "Revisa DNS A → IP pública, el Caddyfile del edge y docker logs $EDGE_CONTAINER."
  fi
fi

docker compose -f "$COMPOSE_FILE" ps
log "Despliegue completado: $COMMIT"

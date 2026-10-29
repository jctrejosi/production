#!/usr/bin/env node
"use strict";

/**
 * prod.js — despliegue de producción de PRODDSI (Suite Producción).
 *
 * Levanta la SPA (Interface_web) dentro de UN contenedor Docker y la deja
 * lista para que el edge compartido (`edge_caddy`, repo ecommerce) la publique
 * en 80/443 con TLS. No instalas Node, pnpm ni nada en el host: todo ocurre
 * dentro de la imagen.
 *
 * Uso:
 *   node prod.js                  comprueba puertos, construye y levanta
 *   node prod.js --update         igual, pero solo reconstruye si hay cambios
 *   node prod.js --dns            muestra los registros DNS que debes crear
 *   node prod.js --check-ports    solo verifica el puerto (no construye ni levanta)
 *   node prod.js --status         estado del contenedor + comprobación pública
 *   node prod.js --logs           últimas 120 líneas de log de Caddy
 *   node prod.js --restart        reinicia el contenedor
 *   node prod.js --down           detiene y elimina el contenedor
 *   node prod.js --help           esta ayuda
 *
 * La configuración (dominio, IP pública, puerto) vive en `prod.config.json`.
 * Nada de esto es secreto: es un sitio estático, sin base de datos ni API.
 */

const { spawnSync } = require("node:child_process");
const dns = require("node:dns");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");

const ROOT = __dirname;
const CONFIG_FILE = path.join(ROOT, "prod.config.json");
const COMPOSE_FILE = path.join(ROOT, "docker", "docker-compose.yml");
const APP_CONTAINER = "production_web";
const EDGE_CONTAINER = "edge_caddy";
const SHARED_NETWORK = "shared_edge";
const DEFAULT_PORT = 30440;

const USE_COLOR = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
const C = USE_COLOR
  ? {
      reset: "\x1b[0m",
      bold: "\x1b[1m",
      dim: "\x1b[2m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      red: "\x1b[31m",
      cyan: "\x1b[36m",
    }
  : { reset: "", bold: "", dim: "", green: "", yellow: "", red: "", cyan: "" };

const line = (msg = "") => console.log(msg);
const ok = (msg) => line(`  ${C.green}✅${C.reset} ${msg}`);
const warn = (msg) => line(`  ${C.yellow}⚠️${C.reset}  ${msg}`);
const die = (msg) => {
  console.error(`\n${C.red}✖ ${msg}${C.reset}\n`);
  process.exit(1);
};

// ─────────────────────────────────────────────────────────────────────────────
// Configuración y argumentos
// ─────────────────────────────────────────────────────────────────────────────

function loadConfig() {
  let raw;
  try {
    raw = fs.readFileSync(CONFIG_FILE, "utf8");
  } catch {
    die(`No encuentro ${CONFIG_FILE}.`);
  }
  let cfg;
  try {
    cfg = JSON.parse(raw);
  } catch (err) {
    die(`prod.config.json no es JSON válido: ${err.message}`);
  }
  cfg.mode = cfg.mode === "direct" ? "direct" : "edge";
  cfg.edgePorts = cfg.edgePorts || {};
  cfg.hosts = cfg.hosts || {};
  cfg.baseDomain = cfg.baseDomain || cfg.hosts.app;
  if (!cfg.baseDomain) die("prod.config.json: falta baseDomain (o hosts.app).");
  return cfg;
}

function parseArgs(argv) {
  const opts = {
    dns: false,
    checkPorts: false,
    status: false,
    logs: false,
    restart: false,
    down: false,
    update: false,
    help: false,
  };
  for (const arg of argv) {
    switch (arg) {
      case "--dns":
        opts.dns = true;
        break;
      case "--check-ports":
        opts.checkPorts = true;
        break;
      case "--status":
        opts.status = true;
        break;
      case "--logs":
        opts.logs = true;
        break;
      case "--restart":
        opts.restart = true;
        break;
      case "--down":
        opts.down = true;
        break;
      case "--update":
        opts.update = true;
        break;
      case "-h":
      case "--help":
        opts.help = true;
        break;
      default:
        die(`Argumento no reconocido: ${arg}. Usa --help.`);
    }
  }
  return opts;
}

function parseHostPort(value, fallback) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return { host: "127.0.0.1", port: fallback };
  const idx = raw.lastIndexOf(":");
  if (idx === -1) return { host: "127.0.0.1", port: Number(raw) };
  return { host: raw.slice(0, idx), port: Number(raw.slice(idx + 1)) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Ejecución de comandos
// ─────────────────────────────────────────────────────────────────────────────

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, {
    encoding: "utf8",
    stdio: opts.inherit ? "inherit" : "pipe",
  });
  if (res.error) {
    if (opts.allowFail) return { status: 1, stdout: "", stderr: res.error.message };
    die(`No pude ejecutar ${cmd}: ${res.error.message}`);
  }
  if (res.status !== 0 && !opts.allowFail) {
    if (res.stdout) process.stdout.write(res.stdout);
    if (res.stderr) process.stderr.write(res.stderr);
    die(`Falló: ${cmd} ${args.join(" ")}`);
  }
  return { status: res.status, stdout: res.stdout || "", stderr: res.stderr || "" };
}

const docker = (args, opts = {}) => run("docker", args, opts);
const compose = (args, opts = {}) =>
  run("docker", ["compose", "-f", COMPOSE_FILE, ...args], opts);

function checkDocker() {
  if (docker(["info"], { allowFail: true }).status !== 0) {
    die("Docker no responde. Arráncalo (systemctl start docker) y reintenta.");
  }
  const v = docker(["compose", "version"], { allowFail: true });
  if (v.status !== 0) die("Falta el plugin `docker compose` (v2).");
}

function ensureSharedNetwork() {
  if (docker(["network", "inspect", SHARED_NETWORK], { allowFail: true }).status === 0) {
    return true;
  }
  warn(`No existe la red ${SHARED_NETWORK}; la creo (la normal es que la cree el edge).`);
  docker(["network", "create", SHARED_NETWORK], { allowFail: true });
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Estado y puertos
// ─────────────────────────────────────────────────────────────────────────────

function containerInfo(name) {
  const res = docker(["inspect", name], { allowFail: true });
  if (res.status !== 0) return null;
  try {
    return JSON.parse(res.stdout)[0] || null;
  } catch {
    return null;
  }
}

function containerRunning(name) {
  const info = containerInfo(name);
  return Boolean(info && info.State && info.State.Running);
}

function isPortFree(host, port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.unref();
    srv.once("error", (err) => {
      srv.close(() => {});
      resolve(!(err.code === "EADDRINUSE" || err.code === "EACCES"));
    });
    srv.listen({ host, port, exclusive: true }, () => {
      srv.close(() => resolve(true));
    });
  });
}

/** Describe quién ocupa el puerto: primero contenedores, luego procesos del host. */
function describePortOwner(port) {
  const ps = docker(["ps", "--format", "{{.Names}}\t{{.Ports}}"], { allowFail: true });
  if (ps.status === 0) {
    for (const row of ps.stdout.split("\n")) {
      if (!row.includes(`:${port}->`)) continue;
      const name = row.split("\t")[0];
      if (name) return `contenedor ${name}`;
    }
  }

  const probes = [
    ["ss", ["-ltnp"]],
    ["lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"]],
    ["netstat", ["-ano"]],
  ];
  for (const [cmd, args] of probes) {
    const res = run(cmd, args, { allowFail: true });
    if (res.status !== 0) continue;
    const hits = res.stdout
      .split("\n")
      .filter((l) => l.includes(`:${port}`) && l.trim() !== "");
    if (hits.length) return hits[0].trim();
  }
  return "un proceso no identificado";
}

async function checkHostPort(cfg) {
  const { host, port } = parseHostPort(cfg.edgePorts.http, DEFAULT_PORT);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    die(`Puerto inválido en prod.config.json (edgePorts.http): ${cfg.edgePorts.http}`);
  }

  if (containerRunning(APP_CONTAINER)) {
    ok(`${APP_CONTAINER} ya está en marcha; se recreará con el mismo puerto.`);
    return { host, port };
  }

  if (await isPortFree(host, port)) {
    ok(`${host}:${port} está libre.`);
    return { host, port };
  }

  die(
    `El puerto ${host}:${port} está ocupado por ${describePortOwner(port)}.\n` +
      `   Detén ese servicio o cambia "edgePorts.http" en prod.config.json.`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP
// ─────────────────────────────────────────────────────────────────────────────

function httpGet(url, timeoutMs = 8000, address = null) {
  return new Promise((resolve) => {
    const mod = url.startsWith("https:") ? require("node:https") : require("node:http");
    const options = { timeout: timeoutMs, headers: { "user-agent": "proddsi-prod/1.0" } };
    // `address` fuerza la IP de destino conservando Host y SNI: sirve para
    // validar el edge desde el propio VPS cuando no hay hairpin NAT.
    if (address) {
      options.lookup = (hostname, opts, cb) =>
        opts && opts.all ? cb(null, [{ address, family: 4 }]) : cb(null, address, 4);
    }
    const req = mod.get(url, options, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        if (body.length < 4096) body += chunk;
      });
      res.on("end", () =>
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode, body }),
      );
    });
    req.on("timeout", () => req.destroy(new Error(`timeout tras ${timeoutMs} ms`)));
    req.on("error", (err) => resolve({ ok: false, error: err.message }));
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────────────────────────────────────
// Flujo de despliegue
// ─────────────────────────────────────────────────────────────────────────────

async function waitHealthy(tries = 60) {
  let status = "desconocido";
  for (let i = 0; i < tries; i += 1) {
    const info = containerInfo(APP_CONTAINER);
    status = info && info.State
      ? (info.State.Health && info.State.Health.Status) || info.State.Status
      : "inexistente";
    if (status === "healthy") {
      ok(`${APP_CONTAINER} healthy.`);
      return true;
    }
    if (status === "unhealthy" || status === "exited" || status === "dead") {
      compose(["logs", "--tail", "120", "--no-color"], { inherit: true });
      die(`El contenedor quedó en estado '${status}'.`);
    }
    await sleep(3000);
  }
  compose(["logs", "--tail", "120", "--no-color"], { inherit: true });
  die(`Timeout esperando healthy (último estado: '${status}').`);
}

async function checkLocal(cfg) {
  const { host, port } = parseHostPort(cfg.edgePorts.http, DEFAULT_PORT);
  const res = await httpGet(`http://${host === "0.0.0.0" ? "127.0.0.1" : host}:${port}/`);
  if (!res.ok) {
    warn(`El contenedor no respondió en ${host}:${port} (${res.error || `HTTP ${res.status}`}).`);
    return false;
  }
  if (!res.body.includes("PRODDSI")) {
    warn("El contenedor responde, pero el HTML no parece ser el build de PRODDSI.");
    return false;
  }
  ok(`Contenedor sirviendo en http://127.0.0.1:${port}/`);
  return true;
}

function edgeStatus(cfg) {
  if (!containerRunning(EDGE_CONTAINER)) {
    warn(`No está corriendo ${EDGE_CONTAINER}: nadie publica 80/443.`);
    return false;
  }
  const res = docker(["exec", EDGE_CONTAINER, "cat", "/etc/caddy/Caddyfile"], { allowFail: true });
  if (res.status !== 0) {
    warn(`No pude leer el Caddyfile de ${EDGE_CONTAINER}.`);
    return false;
  }
  if (!res.stdout.includes(APP_CONTAINER)) {
    warn(`El Caddyfile del edge aún no publica ${APP_CONTAINER}.`);
    line(`     Añade el bloque al repo ecommerce (docker/edge/Caddyfile) y recarga:`);
    line(`     docker exec ${EDGE_CONTAINER} caddy reload --config /etc/caddy/Caddyfile`);
    return false;
  }
  ok(`El edge publica ${cfg.hosts.app} → ${APP_CONTAINER}:8080.`);
  return true;
}

async function checkPublic(cfg, { soft = true } = {}) {
  const host = cfg.hosts.app;
  let addresses = [];
  try {
    addresses = (await dns.promises.lookup(host, { all: true })).map((a) => a.address);
  } catch {
    addresses = [];
  }
  if (!addresses.length) {
    (soft ? warn : die)(`DNS: ${host} no resuelve todavía.`);
    line(`     Crea el registro A (${host} → ${cfg.publicIp}) y espera la propagación.`);
    line(`     Detalle: node prod.js --dns`);
    return false;
  }
  if (cfg.publicIp && !addresses.includes(cfg.publicIp)) {
    warn(`DNS: ${host} apunta a ${addresses.join(", ")}, no a ${cfg.publicIp}.`);
  } else {
    ok(`DNS: ${host} → ${addresses.join(", ")}`);
  }

  const res = await httpGet(`https://${host}/`, 15000);
  if (res.ok) {
    ok(`HTTPS público OK: https://${host}/`);
    return true;
  }

  // En el propio VPS no suele haber hairpin NAT: la IP pública no es
  // alcanzable desde dentro. Se valida entonces contra el edge local,
  // conservando Host y SNI (y por tanto la validación del certificado).
  const viaEdge = await httpGet(`https://${host}/`, 15000, "127.0.0.1");
  if (viaEdge.ok) {
    ok(`HTTPS OK vía edge local: https://${host}/ (sin hairpin NAT)`);
    return true;
  }

  warn(`HTTPS público no respondió (${res.error || `HTTP ${res.status}`}).`);
  line(`     El certificado se emite cuando el DNS ya resuelve; tras crearlo:`);
  line(`     docker restart ${EDGE_CONTAINER}`);
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Salidas
// ─────────────────────────────────────────────────────────────────────────────

function printHeader(cfg) {
  line("");
  line(`${C.bold}PRODDSI · Suite Producción y Abastecimiento${C.reset} ${C.dim}(prod.js)${C.reset}`);
  line(`${C.dim}Dominio   :${C.reset} ${cfg.hosts.app}`);
  line(`${C.dim}IP pública:${C.reset} ${cfg.publicIp || "(sin definir)"}`);
  line(`${C.dim}Modo      :${C.reset} edge (80/443 los publica ${EDGE_CONTAINER})`);
  line("");
}

function printDns(cfg) {
  const zone = cfg.dnsZone || "";
  const label = zone && cfg.hosts.app.endsWith(`.${zone}`)
    ? cfg.hosts.app.slice(0, -(zone.length + 1))
    : cfg.hosts.app;
  const ttl = 600;

  line(`${C.bold}Registros DNS a crear${C.reset} (en tu proveedor, p. ej. GoDaddy)`);
  line("");
  line(`  Tipo   Nombre      Datos              TTL`);
  line(`  ${C.cyan}A${C.reset}      ${label.padEnd(11)} ${(cfg.publicIp || "").padEnd(18)} ${ttl}`);
  line("");
  line(`${C.dim}  • Si el panel pide el nombre completo, usa:${C.reset} ${cfg.hosts.app}`);
  line(`${C.dim}  • Si la zona es "${zone}", el campo Nombre es solo:${C.reset} ${label}`);
  line(`${C.dim}  • No crees registro AAAA: el servidor no publica IPv6.${C.reset}`);
  line("");
  line(`${C.bold}Firewall del servidor${C.reset}`);
  line("  Abre solo TCP 80 y 443 (los publica el edge).");
  line(`  NO abras ${cfg.edgePorts.http || DEFAULT_PORT}: es loopback.`);
  line("");
  line(`${C.bold}Verificar propagación${C.reset}`);
  line(`  getent hosts ${cfg.hosts.app}`);
  line("  (o)  dig +short " + cfg.hosts.app);
  line("");
  line(`${C.bold}Después del DNS${C.reset}`);
  line("  node prod.js            # construye y levanta");
  line("  docker restart " + EDGE_CONTAINER + "   # fuerza emisión del certificado");
  line("");
}

function printHelp() {
  line("");
  line(`${C.bold}prod.js${C.reset} — despliegue de PRODDSI (SPA en contenedor único)`);
  line("");
  line("  node prod.js               comprueba puertos, construye y levanta");
  line("  node prod.js --update      levanta sin reconstruir si el puerto está libre");
  line("  node prod.js --dns         registros DNS que debes crear");
  line("  node prod.js --check-ports solo verifica el puerto");
  line("  node prod.js --status      estado del contenedor + HTTPS público");
  line("  node prod.js --logs        logs de Caddy (últimas 120 líneas)");
  line("  node prod.js --restart     reinicia el contenedor");
  line("  node prod.js --down        detiene y elimina el contenedor");
  line("  node prod.js --help        esta ayuda");
  line("");
  line(`${C.dim}Exposición: solo ${EDGE_CONTAINER} publica 80/443; este contenedor solo`);
  line(`escucha en 127.0.0.1. El sitio es estático: no hay BD ni API.${C.reset}`);
  line("");
}

function printSummary(cfg) {
  line("");
  line(`${C.bold}Listo${C.reset}`);
  line(`  Público : https://${cfg.hosts.app}/`);
  line(`  Local   : http://127.0.0.1:${parseHostPort(cfg.edgePorts.http, DEFAULT_PORT).port}/`);
  line(`  Logs    : node prod.js --logs`);
  line(`  Estado  : node prod.js --status`);
  line("");
}

// ─────────────────────────────────────────────────────────────────────────────
// Comandos
// ─────────────────────────────────────────────────────────────────────────────

async function deploy(cfg, opts) {
  checkDocker();
  ensureSharedNetwork();
  await checkHostPort(cfg);

  if (opts.checkPorts) {
    line(`\n${C.green}Puerto OK.${C.reset} No se construyó nada (--check-ports).\n`);
    return;
  }

  if (opts.update) {
    line(`\n▶ --update: se reutiliza la imagen actual (sin reconstruir).`);
  } else {
    line(`\n▶ Construyendo la imagen proddsi/web:latest…`);
    compose(["build", "web"], { inherit: true });
  }

  line(`\n▶ Levantando ${APP_CONTAINER}…`);
  compose(["up", "-d", "--remove-orphans"], { inherit: true });

  line("");
  await waitHealthy();
  await checkLocal(cfg);

  line("");
  edgeStatus(cfg);
  await checkPublic(cfg);

  printSummary(cfg);
}

async function status(cfg) {
  checkDocker();
  compose(["ps"], { inherit: true });
  line("");
  await checkLocal(cfg);
  edgeStatus(cfg);
  await checkPublic(cfg);
  line("");
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) return printHelp();

  const cfg = loadConfig();
  printHeader(cfg);

  if (opts.dns) {
    printDns(cfg);
    return;
  }
  if (opts.logs) {
    checkDocker();
    compose(["logs", "--tail", "120", "--no-color"], { inherit: true });
    return;
  }
  if (opts.restart) {
    checkDocker();
    compose(["restart"], { inherit: true });
    line("");
    ok("Contenedor reiniciado.");
    return;
  }
  if (opts.down) {
    checkDocker();
    compose(["down"], { inherit: true });
    line("");
    ok("Contenedor detenido y eliminado (la imagen se conserva).");
    return;
  }
  if (opts.status) {
    status(cfg).catch((err) => die(err.message));
    return;
  }

  deploy(cfg, opts).catch((err) => die(err.message));
}

main();

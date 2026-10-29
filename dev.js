#!/usr/bin/env node
"use strict";

/**
 * dev.js — entorno de desarrollo y despliegue local de PRODDSI.
 *
 * La suite de producción vive en la carpeta `Interface_web/` (app React/Vite
 * independiente, aún sin backend); junto a ella están los documentos
 * funcionales (FUNCIONALIDADES.md y los módulos 00–08). Este script levanta
 * UNA sola pieza: la interfaz web.
 *
 *   1. Instala dependencias si falta node_modules (pnpm si existe; si no, npm).
 *   2. Arranca el servidor desacoplado (dev con recarga en caliente, o preview
 *      de producción con --prod) y devuelve la terminal.
 *   3. La salida del servidor se escribe SOLO en `logs/web.log`; nunca se
 *      canaliza a la terminal ni hereda la consola (heredar o canalizar hace
 *      que Windows abra consolas nuevas para procesos desacoplados).
 *
 * Uso:
 *   node dev.js                  instala lo que falte, levanta el servidor dev y libera la terminal
 *   node dev.js --prod           compila y sirve el build de producción (vite preview)
 *   node dev.js --init           reconstruye desde cero: detiene, borra node_modules y dist,
 *                                reinstala y vuelve a levantar
 *   node dev.js --stop           detiene el servidor levantado
 *   node dev.js --check          solo verifica herramientas y dependencias
 *   node dev.js --verify         verifica la cobertura funcional (293 funciones)
 *   node dev.js --smoke          compila si falta y ejecuta el smoke test con chromium
 *   node dev.js --no-install     no instala dependencias, solo verifica
 *   node dev.js --yes            no pregunta nada (puertos ocupados y --init)
 *   node dev.js --port 8460      puerto alternativo (por defecto 8450)
 *
 * Si el puerto está ocupado por OTRO proceso, se muestra quién lo usa y se
 * pide confirmación antes de terminarlo (sin terminal interactiva no se
 * termina nada: usa --yes o DEV_KILL_OCCUPANTS=1).
 *
 * Variables de entorno: PORT (o WEB_PORT), DEV_TIMEOUT_MS, NO_COLOR,
 * DEV_KILL_OCCUPANTS.
 */

const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const net = require("node:net");
const path = require("node:path");
const readline = require("node:readline");

// ─────────────────────────────────────────────────────────────────────────────
// Rutas y configuración
// ─────────────────────────────────────────────────────────────────────────────

const ROOT = __dirname;
const WEB_DIR = path.join(ROOT, "Interface_web");
const LOGS_DIR = path.join(ROOT, "logs");
const PIDS_FILE = path.join(LOGS_DIR, ".pids.json");
const DIST_DIR = path.join(WEB_DIR, "dist");
const NODE_MODULES = path.join(WEB_DIR, "node_modules");
const VITE_BIN = path.join(NODE_MODULES, "vite", "bin", "vite.js");

const IS_WIN = process.platform === "win32";
const TASKKILL = path.join(process.env.SystemRoot || "C:\\Windows", "System32", "taskkill.exe");

const CONFIG = {
  port: Number(process.env.PORT || process.env.WEB_PORT || 8450),
  installTimeoutMs: Number(process.env.DEV_TIMEOUT_MS || 120000),
  startupTimeoutMs: Number(process.env.DEV_TIMEOUT_MS || 30000),
};

/** Modo de arranque del servicio web. */
const MODE_DEV = "dev";
const MODE_PROD = "prod";

let options = {};
let packageManager = null;

// ─────────────────────────────────────────────────────────────────────────────
// Argumentos
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const parsed = {
    help: false,
    init: false,
    stop: false,
    check: false,
    verify: false,
    smoke: false,
    prod: false,
    install: true,
    yes: false,
    port: null,
  };
  for (const arg of argv) {
    switch (arg) {
      case "--help":
      case "-h":
        parsed.help = true;
        break;
      case "--init":
        parsed.init = true;
        break;
      case "--stop":
        parsed.stop = true;
        break;
      case "--check":
        parsed.check = true;
        break;
      case "--verify":
        parsed.verify = true;
        break;
      case "--smoke":
        parsed.smoke = true;
        break;
      case "--prod":
        parsed.prod = true;
        break;
      case "--no-install":
        parsed.install = false;
        break;
      case "--yes":
        parsed.yes = true;
        break;
      default: {
        const m = arg.match(/^--port=(\d+)$/);
        if (m) {
          parsed.port = Number(m[1]);
        } else {
          warn(`Argumento desconocido: ${arg}`);
        }
      }
    }
  }
  if (parsed.port) CONFIG.port = parsed.port;
  return parsed;
}

function printHelp() {
  const header = fs.readFileSync(__filename, "utf8").match(/\/\*\*[\s\S]*?\*\//);
  if (header) log(header[0].replace(/^\/\*\*/, "").replace(/\*\/$/, ""));
}

// ─────────────────────────────────────────────────────────────────────────────
// Salida por consola
// ─────────────────────────────────────────────────────────────────────────────

const useColor = !("NO_COLOR" in process.env) && process.stdout.isTTY;
const paint = code => text => (useColor ? `\u001b[${code}m${text}\u001b[0m` : text);
const c = {
  cyan: paint("36"),
  green: paint("32"),
  yellow: paint("33"),
  red: paint("31"),
  blue: paint("34"),
  dim: paint("2"),
};
const log = (message = "") => process.stdout.write(`${message}\n`);
const info = message => log(`${c.cyan("▸")} ${message}`);
const ok = message => log(`${c.green("✓")} ${message}`);
const warn = message => log(`${c.yellow("!")} ${message}`);
const fail = message => log(`${c.red("✗")} ${message}`);
const step = title => {
  log("");
  log(c.blue(`── ${title}`));
};
const rel = target => path.relative(ROOT, target).replace(/\\/g, "/") || ".";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function commandExists(command) {
  const finder = IS_WIN ? "where" : "which";
  try {
    return spawnSync(finder, [command], { stdio: "ignore", windowsHide: true }).status === 0;
  } catch {
    return false;
  }
}

function run(command, args, optionsRun = {}) {
  const result = spawnSync(command, args, {
    cwd: optionsRun.cwd || ROOT,
    stdio: optionsRun.capture ? "pipe" : "inherit",
    env: { ...process.env, ...(optionsRun.env || {}) },
    windowsHide: true,
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (optionsRun.capture) return result.stdout || "";
  return result;
}

function confirmed(answer) {
  return /^(s|si|sí|y|yes)$/i.test(`${answer || ""}`.trim());
}

async function ask(question) {
  if (options.yes) return true;
  if (!process.stdin.isTTY) return false;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(confirmed(answer));
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Puertos y procesos
// ─────────────────────────────────────────────────────────────────────────────

function portOpen(port, host = "127.0.0.1") {
  return new Promise(resolve => {
    const socket = net.connect({ port, host });
    const settle = value => {
      socket.destroy();
      resolve(value);
    };
    socket.setTimeout(1000);
    socket.once("connect", () => settle(true));
    socket.once("timeout", () => settle(false));
    socket.once("error", () => settle(false));
  });
}

async function waitForPort({ port, timeoutMs }) {
  const deadline = Date.now() + timeoutMs;
  info(`Esperando a la interfaz en el puerto ${port}…`);
  while (Date.now() < deadline) {
    if (await portOpen(port)) return true;
    await sleep(400);
  }
  return false;
}

function httpStatus(url) {
  return new Promise(resolve => {
    const request = http.get(url, response => {
      response.resume();
      resolve(response.statusCode || 0);
    });
    request.setTimeout(2000, () => {
      request.destroy();
      resolve(null);
    });
    request.on("error", () => resolve(null));
  });
}

/** PIDs que escuchan en un puerto (o vite propio si no hay lsof). */
function pidsOnPort(port) {
  if (IS_WIN) {
    const result = spawnSync("netstat", ["-ano"], { encoding: "utf8", windowsHide: true });
    if (result.status !== 0 || !result.stdout) return [];
    const suffix = `:${port}`;
    const pids = new Set();
    for (const line of result.stdout.split("\n")) {
      const columns = line.trim().split(/\s+/);
      if (columns.length < 5) continue;
      const [, local, , state, pid] = columns;
      if (local.endsWith(suffix) && state === "LISTENING" && /^\d+$/.test(pid)) pids.add(Number(pid));
    }
    return [...pids];
  }
  // Unix: lsof si existe; si no, barrido de /proc por procesos vite/pnpm.
  if (commandExists("lsof")) {
    const result = spawnSync("lsof", ["-ti", `tcp:${port}`, "-sTCP:LISTEN"], { encoding: "utf8" });
    if (result.status === 0 && result.stdout) {
      return result.stdout.split("\n").filter(x => /^\d+$/.test(x)).map(Number);
    }
  }
  const pids = [];
  let dir;
  try {
    dir = fs.readdirSync("/proc");
  } catch {
    return pids;
  }
  for (const entry of dir) {
    if (!/^\d+$/.test(entry)) continue;
    try {
      const cmdline = fs.readFileSync(`/proc/${entry}/cmdline`, "utf8").replace(/\0/g, " ");
      if (/vite/.test(cmdline)) pids.push(Number(entry));
    } catch {
      /* proceso desapareció */
    }
  }
  return pids;
}

function killPid(pid) {
  if (!pid) return;
  if (IS_WIN) {
    spawnSync(TASKKILL, ["/pid", String(pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
    return;
  }
  try {
    process.kill(-pid, "SIGTERM");
  } catch {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      /* ya no existe */
    }
  }
}

function readPids() {
  try {
    return JSON.parse(fs.readFileSync(PIDS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function writePids(pids) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
  fs.writeFileSync(PIDS_FILE, JSON.stringify(pids, null, 2));
}

function stopAll() {
  step("Deteniendo servicios");
  const pids = readPids();
  const entries = Object.entries(pids);
  if (!entries.length) info("No hay servicios registrados.");
  for (const [name, value] of entries) {
    const registros = Array.isArray(value) ? value : [value];
    for (const entry of registros) {
      const pid = typeof entry === "object" ? entry.pid : entry;
      // Además del pid de spawn, mata los procesos que realmente quedaron
      // escuchando el puerto (registrados al final del arranque).
      const extras = typeof entry === "object" && Array.isArray(entry.pids) ? entry.pids : [];
      const todos = [...new Set([pid, ...extras].filter(Boolean))];
      for (const objetivo of todos) {
        info(`Deteniendo ${name} (pid ${objetivo})…`);
        killPid(objetivo);
      }
    }
  }
  writePids({});
  ok("Servicios detenidos.");
}

/** Resuelve el conflicto del puerto web: si lo ocupa un servicio propio, lo
 *  detiene; si lo ocupa un proceso ajeno, pregunta antes de terminarlo. */
async function resolvePortConflict() {
  if (!(await portOpen(CONFIG.port))) return;

  const propios = readPids();
  const propio = propios.web && propios.web.pid;

  const pids = pidsOnPort(CONFIG.port);
  warn(`El puerto ${CONFIG.port} está ocupado.`);

  if (propio && pids.includes(propio)) {
    info(`Lo ocupa el servidor propio (pid ${propio}): se detiene y se vuelve a levantar.`);
    killPid(propio);
    writePids({});
    await sleep(800);
    return;
  }

  const descripcion = pids.length ? ` (pids: ${pids.join(", ")})` : "";
  const aceptado =
    process.env.DEV_KILL_OCCUPANTS === "1" ||
    (await ask(`¿Terminar el proceso que usa el puerto ${CONFIG.port}${descripcion}? [s/N] `));
  if (!aceptado) {
    throw new Error(`Puerto ${CONFIG.port} ocupado y no se autorizó terminarlo. Usa --port o --yes.`);
  }
  for (const pid of pids) killPid(pid);
  await sleep(800);
}

// ─────────────────────────────────────────────────────────────────────────────
// Instalación y borrado robusto (Windows incluido)
// ─────────────────────────────────────────────────────────────────────────────

function detectPackageManager() {
  if (packageManager) return packageManager;
  if (commandExists("pnpm")) {
    packageManager = { cmd: "pnpm", install: ["install"] };
  } else if (commandExists("corepack")) {
    packageManager = { cmd: "corepack", install: ["pnpm", "install"] };
  } else if (commandExists("npm")) {
    packageManager = { cmd: "npm", install: ["install", "--no-audit", "--no-fund"] };
  } else {
    throw new Error("No se encontró pnpm ni npm. Instala Node.js (con npm) o pnpm y vuelve a ejecutar.");
  }
  return packageManager;
}

/** Borra una carpeta con reintentos para Windows (archivos bloqueados, rutas
 *  largas y atributos de solo lectura), igual que en el resto de proyectos. */
function removePathRobust(target) {
  if (!fs.existsSync(target)) return;
  const retries = 12;
  for (let intento = 1; intento <= retries; intento++) {
    try {
      fs.rmSync(target, { recursive: true, force: true, maxRetries: 2, retryDelay: 200 });
      return;
    } catch (error) {
      if (intento === retries) {
        warn(`No se pudo borrar ${rel(target)} con fs.rmSync (${error.code || error.message}); se intenta con shell.`);
        break;
      }
      sleepSync(500);
    }
  }
  if (IS_WIN) {
    const comspec = process.env.ComSpec || "cmd.exe";
    run(comspec, ["/d", "/s", "/c", `attrib -R -H -S "${target}\\*.*" /S /D 2>nul & rd /S /Q "\\\\?\\${target}"`]);
  } else {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function ensureNode() {
  const version = process.versions.node.split(".").map(Number);
  // Vite 8 exige Node ^20.19 || >= 22.12.
  const suficiente = version[0] > 22 || (version[0] === 22 && version[1] >= 12) || (version[0] === 20 && version[1] >= 19);
  if (!suficiente) {
    warn(`Node ${process.versions.node} es antiguo para Vite 8 (se recomienda 20.19+ o 22.12+); puede fallar.`);
  }
  ok(`Node ${process.versions.node} · ${IS_WIN ? "Windows" : process.platform}`);
}

function ensureDependencies() {
  step("Interfaz web · dependencias Node");
  const pm = detectPackageManager();
  ok(`Gestor de paquetes: ${pm.cmd}`);

  if (fs.existsSync(NODE_MODULES) && !options.init) {
    ok("node_modules ya existe.");
    return;
  }

  info(`Instalando dependencias con ${pm.cmd}… (puede tardar)`);
  const inicio = Date.now();
  const resultado = run(pm.cmd, pm.install, { cwd: WEB_DIR });
  if (resultado.status !== 0 || !fs.existsSync(VITE_BIN)) {
    throw new Error(`La instalación con ${pm.cmd} falló. Revisa la salida de arriba.`);
  }
  ok(`Dependencias instaladas en ${((Date.now() - inicio) / 1000).toFixed(1)} s.`);
}

function verifyDependencies() {
  step("Verificación de dependencias");
  if (!fs.existsSync(NODE_MODULES)) {
    throw new Error(`Falta ${rel(NODE_MODULES)}. Ejecuta sin --no-install.`);
  }
  if (!fs.existsSync(VITE_BIN)) {
    throw new Error(`Falta Vite en ${rel(VITE_BIN)}. Ejecuta sin --no-install.`);
  }
  ok("Dependencias de la interfaz presentes.");
}

// ─────────────────────────────────────────────────────────────────────────────
// Arranque del servicio
// ─────────────────────────────────────────────────────────────────────────────

function openLog(name) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
  const logPath = path.join(LOGS_DIR, `${name}.log`);
  const fd = fs.openSync(logPath, "a");
  fs.writeSync(fd, `\n===== [${name}] ${new Date().toISOString()} =====\n`);
  return { fd, logPath };
}

/**
 * Lanza un servicio desacoplado con la salida directa al archivo de log.
 *
 * Importante: nada de `stdio: "inherit"` ni pipes. Un proceso desacoplado con
 * la consola heredada abre una consola propia en Windows; por eso aquí todo va
 * al descriptor del archivo y el padre se desentiende con `unref()`.
 */
function startService({ name, command, args, cwd, env }) {
  const { fd, logPath } = openLog(name);
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...(env || {}) },
    stdio: ["ignore", fd, fd],
    detached: true, // grupo propio: sobrevive al cierre de la terminal
    windowsHide: true,
  });

  child.on("error", error => fail(`${name}: no se pudo arrancar (${error.message})`));
  child.unref();
  fs.closeSync(fd);

  const pids = readPids();
  pids[name] = { pid: child.pid, port: CONFIG.port, mode: options.prod ? MODE_PROD : MODE_DEV, startedAt: new Date().toISOString() };
  writePids(pids);
  info(`[${name}] ▶ arrancado (pid ${child.pid}) · log: ${rel(logPath)}`);
  return child;
}

/** Ejecuta el binario de Vite con el propio Node en lugar de `pnpm dev`:
 *  envolverlo en un shell complica el cierre de procesos en Windows. */
function startWeb(mode) {
  if (!fs.existsSync(VITE_BIN)) {
    throw new Error(`No se encontró Vite en ${rel(VITE_BIN)}. Ejecuta sin --no-install.`);
  }
  const esPreview = mode === MODE_PROD;
  return startService({
    name: "web",
    command: process.execPath,
    args: [VITE_BIN, esPreview ? "preview" : "", "--host", "0.0.0.0", "--port", String(CONFIG.port), "--strictPort"].filter(Boolean),
    cwd: WEB_DIR,
    env: { PORT: String(CONFIG.port) },
  });
}

function buildProduction() {
  step("Compilación de producción");
  const pm = detectPackageManager();
  const buildCmd = pm.cmd === "npm" ? ["run", "build"] : ["build"];
  const inicio = Date.now();
  run(pm.cmd, buildCmd, { cwd: WEB_DIR });
  if (!fs.existsSync(path.join(DIST_DIR, "index.html"))) {
    throw new Error("El build no generó dist/index.html.");
  }
  ok(`Build listo en ${((Date.now() - inicio) / 1000).toFixed(1)} s.`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Comandos auxiliares
// ─────────────────────────────────────────────────────────────────────────────

function runVerify() {
  step("Verificación de cobertura funcional");
  const resultado = spawnSync(process.execPath, ["scripts/verify-coverage.mjs"], {
    cwd: WEB_DIR,
    stdio: "inherit",
    windowsHide: true,
  });
  if (resultado.status !== 0) {
    throw new Error("La verificación de cobertura falló (falta alguna funcionalidad).");
  }
  ok("Cobertura completa: 293/293 funcionalidades.");
}

function runSmoke() {
  step("Smoke test con chromium");
  if (!fs.existsSync(path.join(DIST_DIR, "index.html"))) {
    info("No existe dist/: se compila antes del smoke test.");
    buildProduction();
  }
  const resultado = spawnSync(process.execPath, ["scripts/smoke-browser.mjs"], {
    cwd: WEB_DIR,
    stdio: "inherit",
    windowsHide: true,
  });
  if (resultado.status !== 0) {
    throw new Error("El smoke test falló (revisa la salida de arriba).");
  }
  ok("Smoke test completo: 17 páginas sin errores.");
}

// ─────────────────────────────────────────────────────────────────────────────
// Principal
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  ensureNode();

  if (options.stop) {
    stopAll();
    return;
  }

  if (options.check) {
    verifyDependencies();
    ok("Verificación completa: todo listo para `node dev.js`.");
    return;
  }

  if (options.verify) {
    runVerify();
    return;
  }

  if (options.smoke) {
    runSmoke();
    return;
  }

  if (options.init) {
    step("Reconstrucción desde cero (--init)");
    if (!options.yes) {
      const respuesta = await ask("Se detendrá el servidor y se borrarán node_modules y dist. ¿Continuar? [s/N] ");
      if (!respuesta) {
        info("Cancelado.");
        return;
      }
    }
    stopAll();
    info(`Borrando ${rel(NODE_MODULES)} y ${rel(DIST_DIR)}…`);
    removePathRobust(NODE_MODULES);
    removePathRobust(DIST_DIR);
    ok("Limpieza completa.");
  }

  if (options.install) {
    ensureDependencies();
  } else {
    verifyDependencies();
  }

  await resolvePortConflict();

  if (options.prod) {
    buildProduction();
  }

  step(`Levantando la interfaz (modo ${options.prod ? "producción (preview)" : "desarrollo"})`);
  startWeb(options.prod ? MODE_PROD : MODE_DEV);

  const listo = await waitForPort({ port: CONFIG.port, timeoutMs: CONFIG.startupTimeoutMs });
  if (!listo) {
    throw new Error(`La interfaz no respondió en el puerto ${CONFIG.port}. Revisa logs/web.log.`);
  }

  // Registra los pids que realmente quedaron escuchando el puerto (el pid de
  // `spawn` puede ser un lanzador intermedio en Windows).
  const escuchando = pidsOnPort(CONFIG.port);
  if (escuchando.length > 0) {
    const pids = readPids();
    if (pids.web) pids.web.pids = escuchando;
    writePids(pids);
  }

  const estado = await httpStatus(`http://127.0.0.1:${CONFIG.port}/`);
  if (estado !== 200) {
    warn(`El servidor respondió con estado ${estado ?? "desconocido"}; revisa logs/web.log.`);
  }

  log("");
  ok("PRODDSI — Suite Producción y Abastecimiento");
  info(`Local:   http://localhost:${CONFIG.port}/`);
  info(`Detener: node dev.js --stop`);
  info(`Logs:    ${rel(LOGS_DIR)}/web.log`);
  log("");
  info("La terminal queda libre; el servidor sigue corriendo en segundo plano.");
}

main().catch(error => {
  fail(error.message || String(error));
  process.exitCode = 1;
});

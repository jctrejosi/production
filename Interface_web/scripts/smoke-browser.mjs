// Smoke test de navegador (chromium + puppeteer-core):
// carga la app, recorre las 17 páginas (suite, dashboard, especificación y
// los 15 módulos), verifica que cada módulo renderice sus bloques de
// funcionalidad y que no aparezcan errores de consola ni excepciones.
//
// Uso:  node scripts/smoke-browser.mjs
// Requiere: pnpm build previo y chromium instalado (/usr/bin/chromium).

import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const PORT = 8451;
const BASE = `http://127.0.0.1:${PORT}`;
const CHROME = '/usr/bin/chromium';

const MODULOS = [
  ['Compras y abastecimiento', 22],
  ['Inventario y almacenes', 44],
  ['Producción', 41],
  ['Costos industriales', 14],
  ['Calidad', 18],
  ['Mantenimiento', 23],
  ['Captura y códigos de barras', 20],
  ['Planificación avanzada', 14],
  ['Ejecución y supervisión de planta', 16],
  ['Rendimiento y eficiencia', 12],
  ['Trazabilidad integral', 15],
  ['Control de procesos y excepciones', 12],
  ['Ciclo de vida del producto', 16],
  ['Integración industrial e IoT', 12],
  ['Funcionalidades transversales', 14],
];

const dormir = ms => new Promise(r => setTimeout(r, ms));

async function esperarServidor() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(BASE + '/');
      if (res.ok) return;
    } catch {
      /* aún no listo */
    }
    await dormir(250);
  }
  throw new Error('El servidor de preview no arrancó.');
}

const server = spawn('pnpm', ['exec', 'vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1', '--strictPort'], {
  cwd: process.cwd(),
  stdio: 'ignore',
});

let browser;
const errores = [];
try {
  await esperarServidor();
  browser = await puppeteer.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') errores.push(`console.error: ${msg.text()}`);
  });
  page.on('pageerror', err => errores.push(`pageerror: ${err}`));

  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await dormir(300);

  const irASuite = () =>
    page.evaluate(() => {
      const b = [...document.querySelectorAll('aside button')].find(x => x.textContent?.includes('Todos los módulos'));
      b?.click();
    });

  // Dashboard (página inicial)
  let bloques = await page.evaluate(() => document.querySelectorAll('main button, main table').length);
  console.log(`Dashboard: elementos interactivos=${bloques} OK`);

  // Especificación funcional
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('aside button')].find(x => x.textContent?.includes('Especificación funcional'));
    b?.click();
  });
  await dormir(300);
  const flujos = await page.evaluate(() => document.querySelectorAll('ol li').length);
  const pasos = await page.evaluate(() => document.querySelectorAll('main dl').length);
  console.log(`Especificación: pasos de flujo=${flujos} glosario(dl)=${pasos} ${flujos >= 6 && pasos >= 1 ? 'OK' : 'REVISAR'}`);

  // Suite y módulos
  await irASuite();
  await dormir(300);

  let total = 0;
  for (const [nombre, esperado] of MODULOS) {
    const encontrado = await page.evaluate(nombre => {
      const b = [...document.querySelectorAll('main button')].find(x => x.textContent?.includes(nombre) && x.textContent?.includes('funcionalidades'));
      if (!b) return false;
      b.click();
      return true;
    }, nombre);
    if (!encontrado) {
      console.error(`✗ No se encontró la tarjeta del módulo: ${nombre}`);
      process.exitCode = 1;
      continue;
    }
    await dormir(350);
    // Recorre todas las pestañas del módulo y suma los bloques <section>
    // (FunctionBlock) que renderiza cada una.
    const info = await page.evaluate(async () => {
      const pestanas = [...document.querySelectorAll('main button')].filter(b => (b.className || '').includes('border-b-2'));
      let suma = 0;
      for (const p of pestanas) {
        p.click();
        await new Promise(r => setTimeout(r, 120));
        suma += document.querySelectorAll('main section').length;
      }
      return { pestanas: pestanas.length, suma };
    });
    total += info.suma;
    const estado = info.suma >= esperado ? 'OK' : `INSUFICIENTE (${info.suma} < ${esperado})`;
    console.log(`${nombre}: pestañas=${info.pestanas} bloques=${info.suma} esperado≥${esperado} ${estado}`);
    if (info.suma < esperado) process.exitCode = 1;
    await irASuite();
    await dormir(250);
  }
  console.log(`Total de bloques verificados: ${total} (esperado 293)`);
  if (total !== 293) process.exitCode = 1;

  if (errores.length > 0) {
    console.error('\nErrores detectados en el navegador:');
    for (const e of errores) console.error('  ' + e);
    process.exitCode = 1;
  } else {
    console.log('\n✓ Sin errores de consola ni excepciones en ninguna página.');
  }
} catch (err) {
  console.error('Fallo del smoke test:', err);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}

console.log(process.exitCode === 1 ? '\n✗ SMOKE FALLÓ' : '\n✓ SMOKE COMPLETO');

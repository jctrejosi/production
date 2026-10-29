// Verifica que TODAS las funcionalidades de FUNCIONALIDADES.md estén
// implementadas en la interfaz web de producción.
//
// Uso:  node scripts/verify-coverage.mjs
//
// 1. Lee ../../FUNCIONALIDADES.md (documento normativo).
// 2. Extrae todas las funciones «XXX-NN. Título» + su descripción.
// 3. Regenera src/data/coverage.ts (catálogo tipado usado por la UI).
// 4. Verifica que cada código aparezca dentro de src/pages/XXX.tsx.
// 5. Imprime el resumen; sale con código 1 si falta alguna función.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MD = path.resolve(ROOT, '..', 'FUNCIONALIDADES.md');
const COVERAGE_TS = path.join(ROOT, 'src', 'data', 'coverage.ts');

if (!fs.existsSync(MD)) {
  console.error(`No se encontró el documento normativo: ${MD}`);
  process.exit(2);
}

const lines = fs.readFileSync(MD, 'utf8').split('\n');

/** @type {Array<{module: string, code: string, num: number, title: string, description: string}>} */
const funciones = [];
let modulo = null;

for (let i = 0; i < lines.length; i++) {
  const linea = lines[i];
  const mMod = linea.match(/^## 3\.\d+ .*\(`([A-Z]{3})`\)/);
  if (mMod) {
    modulo = mMod[1];
    continue;
  }
  const mFun = linea.match(/^\*\*([A-Z]{3})-(\d+)\. (.+?)\*\*$/);
  if (mFun) {
    const descripcion = [];
    for (let j = i + 1; j < lines.length && lines[j].trim() !== ''; j++) {
      descripcion.push(lines[j].trim());
    }
    funciones.push({
      module: mFun[1],
      code: `${mFun[1]}-${mFun[2].padStart(2, '0')}`,
      num: parseInt(mFun[2], 10),
      title: mFun[3],
      description: descripcion.join(' '),
    });
  }
}

if (funciones.length === 0) {
  console.error('No se extrajo ninguna función; revisa el formato de FUNCIONALIDADES.md.');
  process.exit(2);
}

const sinNum = ({ module, code, title, description }) => ({ module, code, title, description });
const porModulo = {};
for (const f of funciones) {
  (porModulo[f.module] ??= []).push(sinNum(f));
}

// --- Genera src/data/coverage.ts --------------------------------------
const cabecera = `// GENERADO por scripts/verify-coverage.mjs — NO editar a mano.
// Catálogo extraído del documento normativo ../FUNCIONALIDADES.md.

export interface FuncionCatalog {
  module: string;
  code: string;
  title: string;
  description: string;
}

export const FUNCIONES: FuncionCatalog[] = ${JSON.stringify(funciones.map(sinNum), null, 2)};

export const FUNCIONES_POR_MODULO: Record<string, FuncionCatalog[]> = ${JSON.stringify(porModulo, null, 2)};

export const TOTAL_FUNCIONES = FUNCIONES.length;
`;

fs.writeFileSync(COVERAGE_TS, cabecera);
console.log(`coverage.ts regenerado: ${funciones.length} funciones en ${Object.keys(porModulo).length} módulos.`);

// --- Verificación de cobertura en las páginas --------------------------
// Cada funcionalidad debe estar implementada con un bloque real:
// <FunctionBlock code="XXX-NN">…</FunctionBlock> (no basta con que el código
// aparezca como texto suelto o en un comentario).
let faltantes = 0;
for (const [mod, list] of Object.entries(porModulo)) {
  const pagina = path.join(ROOT, 'src', 'pages', `${mod}.tsx`);
  if (!fs.existsSync(pagina)) {
    console.error(`FALTA PÁGINA: ${mod}.tsx (${list.length} funciones: ${list.map((f) => f.code).join(', ')})`);
    faltantes += list.length;
    continue;
  }
  const contenido = fs.readFileSync(pagina, 'utf8');
  for (const f of list) {
    const esperado = `<FunctionBlock code="${f.code}"`;
    if (!contenido.includes(esperado)) {
      console.error(`FALTA ${f.code} (${f.title}) en src/pages/${mod}.tsx — debe existir ${esperado}`);
      faltantes++;
    }
    if (new RegExp(`<FunctionBlock code="${f.code}"\\s*>[\\s]*</FunctionBlock>`).test(contenido)) {
      console.error(`VACÍO ${f.code} (${f.title}) en src/pages/${mod}.tsx — el bloque no tiene UI.`);
      faltantes++;
    }
  }
}

console.log('\nResumen por módulo:');
for (const [mod, list] of Object.entries(porModulo)) {
  console.log(`  ${mod}: ${list.length}`);
}
console.log(`TOTAL: ${funciones.length}`);

if (faltantes > 0) {
  console.error(`\n✗ ${faltantes} funcionalidad(es) sin implementar.`);
  process.exit(1);
}
console.log('\n✓ Cobertura completa: ninguna funcionalidad sin implementar.');

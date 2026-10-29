# Convenciones de implementación — Interface_web de producción

Guía obligatoria para implementar las páginas de los módulos. El objetivo:
**ninguna funcionalidad del documento normativo puede quedar sin implementar**.

## Contrato de cobertura

- El documento normativo es `../FUNCIONALIDADES.md` (1921 líneas). NO lo leas
  completo: lee SOLO la sección de tu(s) módulo(s) con `start_line`/`end_line`.
- Cada funcionalidad `XXX-NN` debe aparecer en `src/pages/XXX.tsx` como un
  bloque `<FunctionBlock code="XXX-NN">…</FunctionBlock>` con UI real (tabla,
  formulario, botón con acción simulada, indicador…). El título y la
  descripción normativa se renderizan solos desde `src/data/coverage.ts`.
- Verificación: `node scripts/verify-coverage.mjs` desde `production/Interface_web/`.
  Si un código falta en su página, el script falla (exit 1).
- No edites archivos fuera de tu lote (ver «Archivos de tu lote» en tu tarea).

## Estructura de una página de módulo

Cada página (`src/pages/XXX.tsx`) mantiene el `PageHeader` del stub y agrega:

1. **KPIs del módulo** (2–4 `StatCard`) arriba.
2. **`Tabs`**: una pestaña «Resumen» (objetivo/alcance/actores/reglas/
   integraciones/criterios del módulo, tomados de FUNCIONALIDADES.md §3.x) y
   pestañas por grupo funcional (usa los grupos de subsecciones del documento,
   p. ej. INV tiene: configuración, operación, existencias y ajustes,
   trazabilidad, reabastecimiento, reportes).
3. Dentro de cada pestaña: un `FunctionBlock` por función del grupo, en orden
   de código (XXX-01, XXX-02…). Cada bloque incluye UI concreta y funcional
   (filtros, estado local con `useState`, acciones con `window.setTimeout` que
   muestren un mensaje de confirmación, modales para crear/editar).

## Componentes compartidos (`src/components/ui.tsx`)

Importaciones desde `../components/ui` (o `../../components/ui` si estás en
`src/pages/`):

- `PageHeader({ breadcrumb, title, description, pill, actions })` — cabecera.
- `StatCard({ label, value, sub, tone })` — KPI. tones: default/ok/warn/danger/info.
- `StatusBadge({ label, tone })` — tones: green/amber/red/blue/gray/petroleum.
- `Tabs({ tabs: [{id,label,badge?}], active, onChange })`.
- `Toolbar({ children })` — barra de filtros (tarjeta bordeada blanca).
- `Card({ title, action, children, pad })` — tarjeta con borde.
- `FunctionBlock({ code, children, descripcion? })` — bloque de funcionalidad.
- `Modal({ title, onClose, children, wide })` — diálogo nativo `<dialog>`.
- `DataTable({ children, footer })` + `Th({ align })` + `Td({ align })` + `EmptyRow({ colSpan, text })` — tablas.
- Clases: `INPUT`, `BTN_PRIMARY`, `BTN_SECONDARY`, `BTN_DANGER`, `BTN_GHOST`.

Formateadores (`../lib/format`): `fmtNum`, `fmtMoney`, `fmtPct`, `fmtHoras`, `fmtFecha`.

Datos de módulos (`../data/modules`): `MODULOS`, `conteoModulo(id)`, `FASES`.

## Estilo (mismo que la suite financiera)

- Página: `<div className="max-w-screen-2xl space-y-4 p-4">`.
- Tablas: `text-xs`, thead `bg-gray-50 border-b border-gray-200`, th
  `px-3 py-2.5 font-semibold text-gray-600`, filas `hoverable`, celdas
  `px-3 py-2.5 text-gray-700`. Números con clase `num-col` o `tabular` y
  alineación derecha. Badges de estado `rounded-full px-2 py-0.5 text-xs`.
- Tarjetas: `rounded border border-gray-200 bg-white`.
- Paleta: petroleum-50/100/200/300/400/500/600/700/800/900/950 (definida en
  `index.css`). Botón primario `bg-petroleum-500 text-white hover:bg-petroleum-600`.
- Acciones simuladas: mensaje con `window.setTimeout(() => setMensaje('…'), 400)`
  y un `role="status"` verde (`bg-green-50 text-green-800 border-green-200`).
- No uses librerías externas. Sin fetch: todo con datos de demostración en
  estado local.

## Datos de demostración

Cada módulo define sus datos en `src/data/<id>.ts` (p. ej. `src/data/abt.ts`):
arrays tipados con 4–8 filas realistas (proveedores, órdenes, productos,
equipos…). Exporta interfaces y constantes con `as const` donde aplique.
Tipos locales a ese archivo: **no edites `src/types.ts` ni archivos compartidos**.

## Ejemplo mínimo de bloque

```tsx
<FunctionBlock code="MNT-01">
  <Toolbar>
    <input className={INPUT} placeholder="Buscar equipo..." value={q} onChange={e => setQ(e.target.value)} />
    <button className={BTN_PRIMARY} onClick={crearEquipo}>+ Nuevo equipo</button>
  </Toolbar>
  <DataTable footer={`${visibles.length} equipos`}>
    <thead className="border-b border-gray-200 bg-gray-50">
      <tr><Th>Código</Th><Th>Nombre</Th><Th align="center">Estado</Th></tr>
    </thead>
    <tbody className="divide-y divide-gray-50">
      {visibles.map(e => (
        <tr key={e.id} className="hoverable">
          <Td><span className="font-mono text-gray-600">{e.id}</span></Td>
          <Td>{e.nombre}</Td>
          <Td align="center"><StatusBadge label={e.estado} tone="green" /></Td>
        </tr>
      ))}
    </tbody>
  </DataTable>
</FunctionBlock>
```

## Reglas de contexto

- Lee FUNCIONALIDADES.md solo en el rango de líneas indicado en tu tarea.
- No leas archivos de más de 1.500 líneas completos.
- Escribe los archivos de tu lote completos con `write_file` (reemplaza el stub).
- Al terminar, ejecuta `node scripts/verify-coverage.mjs` y asegúrate de que tus
  módulos no aparezcan como faltantes. No ejecutes `npm install` ni `npm run build`.

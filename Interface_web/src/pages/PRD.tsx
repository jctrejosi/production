import { useEffect, useState, type ReactNode } from 'react';
import {
  PageHeader,
  StatCard,
  StatusBadge,
  Tabs,
  Toolbar,
  Card,
  FunctionBlock,
  Modal,
  DataTable,
  Th,
  Td,
  EmptyRow,
  INPUT,
  BTN_PRIMARY,
  BTN_SECONDARY,
  BTN_DANGER,
  BTN_GHOST,
  type BadgeTone,
  type TabDef,
} from '../components/ui';
import { MODULOS, conteoModulo } from '../data/modules';
import { fmtFecha, fmtMoney, fmtNum, fmtPct } from '../lib/format';
import {
  PRODUCTOS,
  PRODUCTOS_POR_ID,
  nombreProducto,
  umProducto,
  BOMS,
  RUTAS,
  CENTROS,
  CENTROS_POR_ID,
  nombreCentro,
  CENTROS_ALTERNATIVOS,
  ORDENES,
  ORDENES_TRABAJO,
  CONSUMOS,
  DESECHOS,
  PARADAS,
  COSTOS_OF,
  FALTANTES,
  SUBCONTRATOS,
  REPARACIONES,
  COMPRAS_PRODUCCION,
  CAPACIDAD_PRODUCTO,
  REGISTROS_PRODUCCION,
  REPORTES_PRD,
  COMPONENTES_VARIANTES,
  CONFIGURACION_INICIAL,
  NOMBRES_OPERACION,
  type ComponenteBOM,
  type OrdenFabricacion,
  type EstadoOF,
  type OrdenTrabajo,
  type EstadoOT,
  type Consumo,
  type Desecho,
  type Parada,
  type Subcontrato,
  type Reparacion,
  type CompraProduccion,
  type RegistroProduccion,
  type ConfiguracionPRD,
  type CapacidadProducto,
  type OperacionRuta,
  type CondicionInicio,
} from '../data/prd';

/* ------------------------------- utilidades ------------------------------- */

const MOD = MODULOS.find(m => m.id === 'prd')!;

const ETIQUETA_ESTADO_OF: Record<EstadoOF, string> = {
  borrador: 'Borrador',
  confirmada: 'Confirmada',
  en_progreso: 'En progreso',
  hecha: 'Hecha',
  cerrada: 'Cerrada',
  cancelada: 'Cancelada',
};

const TONO_ESTADO_OF: Record<EstadoOF, BadgeTone> = {
  borrador: 'gray',
  confirmada: 'blue',
  en_progreso: 'petroleum',
  hecha: 'green',
  cerrada: 'green',
  cancelada: 'red',
};

const TONO_LISTA: Record<string, BadgeTone> = {
  Lista: 'green',
  'Esperando material': 'amber',
  'Esperando operación': 'blue',
  Bloqueada: 'red',
};

const TONO_OT: Record<EstadoOT, BadgeTone> = {
  bloqueada: 'red',
  'por hacer': 'gray',
  'en progreso': 'petroleum',
  hecha: 'green',
  cancelada: 'red',
};

function Msg({ texto }: { texto: string }) {
  return (
    <div role="status" className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      {texto}
    </div>
  );
}

/** Mensaje de confirmación simulado con window.setTimeout (regla de estilo). */
function useMensaje() {
  const [mensaje, setMensaje] = useState('');
  const notificar = (texto: string) => {
    setMensaje(texto);
    window.setTimeout(() => setMensaje(''), 4500);
  };
  return { mensaje, notificar };
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs text-gray-600">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

/** Filtra por término de búsqueda (insensible a mayúsculas) sobre campos. */
function filtrar<T>(items: T[], q: string, campos: (item: T) => string): T[] {
  const termino = q.trim().toLocaleLowerCase('es');
  if (!termino) return items;
  return items.filter(item => campos(item).toLocaleLowerCase('es').includes(termino));
}

/* ------------------------------ Resumen (tab 1) ---------------------------- */

const REGLAS_NEGOCIO = [
  'No se puede producir sin lista de materiales vigente.',
  'Los componentes deben estar reservados o disponibles antes de iniciar, según la política.',
  'El consumo real debe justificarse si difiere del teórico.',
  'El producto terminado debe registrar lote o serie si está trazado.',
  'Las operaciones deben respetar dependencias y secuencia.',
  'El cierre debe consolidar costos y movimientos.',
  'Las órdenes bloqueadas no pueden modificarse sin autorización.',
];

const INTEGRACIONES = [
  'Inventario: componentes, terminados, subproductos y desechos.',
  'Compras: componentes y subcontratación.',
  'Calidad: controles en operaciones y producto terminado.',
  'Mantenimiento: disponibilidad de centros y equipos.',
  'PLM: versiones de listas de materiales y rutas.',
  'Costos y finanzas: valoración y asientos.',
];

const CRITERIOS = [
  'Una orden de fabricación consume y produce exactamente lo registrado.',
  'La trazabilidad de componentes y terminado es completa.',
  'Los tiempos y paradas se registran por operación.',
  'El costo de la orden cuadra con materiales, operaciones y costos adicionales.',
  'La planificación muestra carga y disponibilidad.',
  'Los pendientes conservan la demanda original.',
];

function ResumenTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Objetivo">
          <p className="text-xs leading-relaxed text-gray-600">
            Planificar y ejecutar la transformación de materias primas en productos terminados, controlando materiales,
            operaciones, tiempos, cantidades, calidad y costos.
          </p>
        </Card>
        <Card title="Alcance">
          <p className="text-xs leading-relaxed text-gray-600">
            Incluye listas de materiales, rutas, centros de trabajo, órdenes de fabricación, órdenes de trabajo, consumo,
            producción, subproductos, desensamblado, subcontratación, reparación, costeo y reportes.
          </p>
        </Card>
        <Card title="Actores">
          <div className="flex flex-wrap gap-1.5">
            {['Ingeniería', 'Planificador', 'Supervisor de producción', 'Operario', 'Calidad', 'Mantenimiento', 'Finanzas'].map(a => (
              <StatusBadge key={a} label={a} tone="petroleum" />
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Reglas de negocio">
          <ul className="space-y-1.5 text-xs text-gray-600">
            {REGLAS_NEGOCIO.map(r => (
              <li key={r} className="flex gap-2">
                <span className="text-petroleum-500">•</span>
                {r}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Integraciones">
          <ul className="space-y-1.5 text-xs text-gray-600">
            {INTEGRACIONES.map(i => (
              <li key={i} className="flex gap-2">
                <span className="text-petroleum-500">•</span>
                {i}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Criterios de aceptación">
          <ul className="space-y-1.5 text-xs text-gray-600">
            {CRITERIOS.map(c => (
              <li key={c} className="flex gap-2">
                <span className="text-petroleum-500">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------- Ingeniería de producto (PRD-01..09) ---------------- */

/** PRD-01. Lista de materiales normal */
function BloquePRD01() {
  const { mensaje, notificar } = useMensaje();
  const [q, setQ] = useState('');
  const [bomId, setBomId] = useState(BOMS[0].id);
  const [modalNueva, setModalNueva] = useState(false);
  const [extras, setExtras] = useState<ComponenteBOM[]>([]);
  const [form, setForm] = useState({
    productoId: PRODUCTOS[0].id,
    cantidad: 1,
    mermaPct: 0,
    operacion: 'OP-10',
    tipo: 'normal' as ComponenteBOM['tipo'],
    observacion: '',
  });

  useEffect(() => setExtras([]), [bomId]);

  const bom = BOMS.find(b => b.id === bomId) ?? BOMS[0];
  const lineas = [...bom.componentes, ...extras];
  const filtradas = filtrar(lineas, q, l => `${l.productoId} ${nombreProducto(l.productoId)}`);

  function agregarLinea() {
    const producto = PRODUCTOS_POR_ID.get(form.productoId)!;
    setExtras(prev => [
      ...prev,
      {
        productoId: form.productoId,
        cantidad: form.cantidad,
        um: producto.um,
        mermaPct: form.mermaPct,
        operacion: form.operacion,
        tipo: form.tipo,
        observacion: form.observacion || undefined,
      },
    ]);
    setModalNueva(false);
    notificar(`Componente ${producto.nombre} agregado a ${bom.id} (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-01">
      <Toolbar>
        <select className={INPUT} value={bomId} onChange={e => setBomId(e.target.value)} aria-label="Seleccionar lista de materiales">
          {BOMS.filter(b => b.tipo === 'normal').map(b => (
            <option key={b.id} value={b.id}>
              {b.id} · {nombreProducto(b.productoId)} ({b.version})
            </option>
          ))}
        </select>
        <input className={INPUT} placeholder="Buscar componente..." value={q} onChange={e => setQ(e.target.value)} />
        <span className="ml-auto text-xs text-gray-500">
          {filtradas.length} de {lineas.length} componentes
        </span>
        <button className={BTN_PRIMARY} onClick={() => setModalNueva(true)}>+ Agregar componente</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer={`${bom.id} · ${nombreProducto(bom.productoId)} · versión ${bom.version} · lote de ${fmtNum(bom.tamanoLote)} ${umProducto(bom.productoId)}`}>
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Componente</Th>
              <Th align="center">U.M.</Th>
              <Th align="right">Cantidad</Th>
              <Th align="right">Merma</Th>
              <Th align="center">Operación</Th>
              <Th>Tipo</Th>
              <Th>Observaciones</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtradas.map((l, i) => (
              <tr key={`${l.productoId}-${i}`} className="hoverable">
                <Td>
                  <span className="font-mono text-gray-500">{l.productoId}</span>
                  <span className="ml-1.5">{nombreProducto(l.productoId)}</span>
                </Td>
                <Td align="center">{l.um}</Td>
                <Td align="right" className="font-mono">{fmtNum(l.cantidad)}</Td>
                <Td align="right" className="font-mono">{fmtPct(l.mermaPct / 100)}</Td>
                <Td align="center"><span className="font-mono text-petroleum-600">{l.operacion}</span></Td>
                <Td><StatusBadge label={l.tipo} tone={l.tipo === 'normal' ? 'gray' : 'blue'} /></Td>
                <Td className="text-gray-500">{l.observacion ?? '—'}</Td>
              </tr>
            ))}
            {filtradas.length === 0 && <EmptyRow colSpan={7} text="No hay componentes que coincidan con la búsqueda." />}
          </tbody>
        </DataTable>
      </div>
      {modalNueva && (
        <Modal title={`Agregar componente a ${bom.id}`} onClose={() => setModalNueva(false)}>
          <div className="space-y-3 p-5">
            <Campo label="Producto">
              <select className={INPUT} value={form.productoId} onChange={e => setForm({ ...form, productoId: e.target.value })}>
                {PRODUCTOS.map(p => (
                  <option key={p.id} value={p.id}>{p.id} · {p.nombre}</option>
                ))}
              </select>
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Cantidad por lote">
                <input className={INPUT} type="number" min={0} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })} />
              </Campo>
              <Campo label="Merma (%)">
                <input className={INPUT} type="number" min={0} max={100} step={0.5} value={form.mermaPct} onChange={e => setForm({ ...form, mermaPct: Number(e.target.value) })} />
              </Campo>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Operación de consumo">
                <select className={INPUT} value={form.operacion} onChange={e => setForm({ ...form, operacion: e.target.value })}>
                  {['OP-10', 'OP-20', 'OP-30', 'OP-40', 'OP-50'].map(op => <option key={op} value={op}>{op}</option>)}
                </select>
              </Campo>
              <Campo label="Tipo">
                <select className={INPUT} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as ComponenteBOM['tipo'] })}>
                  <option value="normal">Normal</option>
                  <option value="opcional">Opcional</option>
                  <option value="variante">Variante</option>
                </select>
              </Campo>
            </div>
            <Campo label="Observaciones">
              <input className={INPUT} value={form.observacion} onChange={e => setForm({ ...form, observacion: e.target.value })} placeholder="Notas de consumo..." />
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModalNueva(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={agregarLinea}>Agregar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-02. Lista de materiales tipo kit */
function BloquePRD02() {
  const { mensaje, notificar } = useMensaje();
  const kits = BOMS.filter(b => b.tipo === 'kit');

  return (
    <FunctionBlock code="PRD-02">
      <Toolbar>
        <span className="text-xs text-gray-500">
          {kits.length} kits vigentes · se explotan en componentes sin generar orden de fabricación propia
        </span>
        <span className="ml-auto text-xs text-gray-400">Explosión al confirmar la orden padre</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Los kits no crean demanda propia de fabricación: consumen los componentes en la operación de empacado.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Kit</Th>
              <Th>Producto</Th>
              <Th align="center">Versión</Th>
              <Th align="right">Componentes</Th>
              <Th align="center">Vigente</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {kits.map(k => (
              <tr key={k.id} className="hoverable">
                <Td><span className="font-mono text-gray-600">{k.id}</span></Td>
                <Td>{nombreProducto(k.productoId)}</Td>
                <Td align="center"><span className="font-mono text-gray-500">{k.version}</span></Td>
                <Td align="right" className="font-mono">{fmtNum(k.componentes.length)}</Td>
                <Td align="center"><StatusBadge label={k.vigente ? 'Vigente' : 'Obsoleta'} tone={k.vigente ? 'green' : 'gray'} /></Td>
                <Td align="center">
                  <button
                    className={BTN_GHOST}
                    onClick={() =>
                      notificar(
                        `Kit ${k.id} explotado: ${k.componentes.map(c => `${fmtNum(c.cantidad)} ${c.um} de ${nombreProducto(c.productoId)}`).join(' + ')}. No genera OF propia.`,
                      )
                    }
                  >
                    Explotar kit
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-03. Lista de materiales multinivel */
function BloquePRD03() {
  const { mensaje, notificar } = useMensaje();
  const [productoId, setProductoId] = useState('PT-002');

  const arbol: { productoId: string; cantidad: number; um: string; nivel: number; bomId: string }[] = [];
  const visitar = (id: string, nivel: number, bomId: string) => {
    const bom = BOMS.find(b => b.productoId === id && b.vigente);
    if (!bom) return;
    for (const c of bom.componentes) {
      arbol.push({ productoId: c.productoId, cantidad: c.cantidad, um: c.um, nivel, bomId });
      visitar(c.productoId, nivel + 1, bom.id);
    }
  };
  visitar(productoId, 1, '');

  function explotarTodo() {
    notificar(`Estructura de ${nombreProducto(productoId)} explotada: ${arbol.length} nodos en ${Math.max(1, ...arbol.map(n => n.nivel)) + 1} niveles. La demanda de ${arbol.filter(n => n.bomId === 'BOM-002').length} semielaborados generaría su propia OF hija (p. ej. OF-1045).`);
  }

  return (
    <FunctionBlock code="PRD-03">
      <Toolbar>
        <select className={INPUT} value={productoId} onChange={e => setProductoId(e.target.value)} aria-label="Producto a explotar">
          {BOMS.filter(b => b.vigente && b.tipo !== 'kit').map(b => (
            <option key={b.id} value={b.productoId}>{nombreProducto(b.productoId)}</option>
          ))}
        </select>
        <button className={BTN_PRIMARY} onClick={explotarTodo}>Explotar estructura</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Cada semielaborado con BOM propia se explota recursivamente; los niveles inferiores heredan la demanda del padre.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Nivel</Th>
              <Th>Componente</Th>
              <Th align="right">Cantidad por lote</Th>
              <Th align="center">U.M.</Th>
              <Th>Vía (BOM padre)</Th>
              <Th align="center">Tiene BOM propia</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hoverable">
              <Td><StatusBadge label="N0" tone="petroleum" /></Td>
              <Td className="font-medium">{nombreProducto(productoId)} <span className="ml-1 font-mono text-gray-400">{productoId}</span></Td>
              <Td align="right" className="font-mono">1</Td>
              <Td align="center">{umProducto(productoId)}</Td>
              <Td className="text-gray-400">—</Td>
              <Td align="center">—</Td>
            </tr>
            {arbol.map((n, i) => (
              <tr key={`${n.productoId}-${i}`} className="hoverable">
                <Td><StatusBadge label={`N${n.nivel}`} tone={n.nivel >= 2 ? 'blue' : 'petroleum'} /></Td>
                <Td>
                  <span className="ml-{n.nivel * 3}" />
                  <span className="font-mono text-gray-500">{n.productoId}</span>
                  <span className="ml-1.5">{nombreProducto(n.productoId)}</span>
                </Td>
                <Td align="right" className="font-mono">{fmtNum(n.cantidad)}</Td>
                <Td align="center">{n.um}</Td>
                <Td className="font-mono text-gray-500">{n.bomId || 'directo'}</Td>
                <Td align="center">
                  {BOMS.some(b => b.productoId === n.productoId && b.vigente) ? <StatusBadge label="Sí" tone="blue" /> : <StatusBadge label="No" tone="gray" />}
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-04. Componentes y variantes */
function BloquePRD04() {
  const { mensaje, notificar } = useMensaje();
  const [filtro, setFiltro] = useState('');
  const [variables, setVariables] = useState<Record<number, boolean>>(
    Object.fromEntries(COMPONENTES_VARIANTES.map((c, i) => [i, c.cantidadVariable])),
  );

  const filas = COMPONENTES_VARIANTES.filter(c => !filtro || c.tipo === filtro);

  function alternar(i: number, valor: boolean) {
    setVariables(prev => ({ ...prev, [i]: valor }));
    notificar(valor ? 'Cantidad variable activada: el operario podrá ajustarla al confirmar consumo.' : 'Cantidad fijada al valor base de la BOM.');
  }

  return (
    <FunctionBlock code="PRD-04">
      <Toolbar>
        <select className={INPUT} value={filtro} onChange={e => setFiltro(e.target.value)} aria-label="Filtrar por tipo de componente">
          <option value="">Todos los tipos</option>
          <option value="normal">Normal</option>
          <option value="opcional">Opcional</option>
          <option value="variante">Variante</option>
        </select>
        <span className="ml-auto text-xs text-gray-500">{filas.length} componentes con variante</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Los componentes opcionales y variables se confirman al liberar la orden según la variante seleccionada.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>BOM</Th>
              <Th>Componente</Th>
              <Th>Variante</Th>
              <Th align="center">Tipo</Th>
              <Th align="right">Cantidad base</Th>
              <Th align="center">Operación</Th>
              <Th align="center">Cantidad variable</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filas.map((c, i) => (
              <tr key={`${c.bomId}-${c.productoId}-${i}`} className="hoverable">
                <Td><span className="font-mono text-gray-600">{c.bomId}</span></Td>
                <Td>{nombreProducto(c.productoId)}</Td>
                <Td className="text-gray-600">{c.variante}</Td>
                <Td align="center"><StatusBadge label={c.tipo} tone={c.tipo === 'opcional' ? 'amber' : c.tipo === 'variante' ? 'blue' : 'gray'} /></Td>
                <Td align="right" className="font-mono">{fmtNum(c.cantidadBase)}</Td>
                <Td align="center"><span className="font-mono text-petroleum-600">{c.operacion}</span></Td>
                <Td align="center">
                  <button className={variables[i] ? BTN_SECONDARY : BTN_GHOST} onClick={() => alternar(i, !variables[i])}>
                    {variables[i] ? 'Variable ✓' : 'Fija'}
                  </button>
                </Td>
              </tr>
            ))}
            {filas.length === 0 && <EmptyRow colSpan={7} text="No hay componentes con el tipo seleccionado." />}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-05. Subproductos */
function BloquePRD05() {
  const { mensaje, notificar } = useMensaje();
  const [extras, setExtras] = useState<{ bomId: string; productoId: string; cantidad: number; operacion: string; participacionCostoPct: number }[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ bomId: BOMS[0].id, productoId: 'SP-001', cantidad: 1, operacion: 'OP-40', participacionCostoPct: 0 });

  const base = BOMS.flatMap(b => b.subproductos.map(s => ({ bomId: b.id, ...s })));
  const filas = [...base, ...extras];

  function registrar() {
    setExtras(prev => [...prev, { ...form }]);
    setModal(false);
    notificar(`Subproducto ${nombreProducto(form.productoId)} registrado en ${form.bomId} con participación del ${fmtNum(form.participacionCostoPct)} % en el costo (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-05">
      <Toolbar>
        <span className="text-xs text-gray-500">{filas.length} subproductos · la participación se acredita al costo del lote</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => setModal(true)}>+ Registrar subproducto</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Los subproductos recuperan stock con su propia valoración y acreditan su participación al costo de la orden.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>BOM</Th>
              <Th>Subproducto</Th>
              <Th align="right">Cantidad</Th>
              <Th align="center">U.M.</Th>
              <Th align="center">Operación</Th>
              <Th align="right">Participación en costo</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filas.map((s, i) => (
              <tr key={`${s.bomId}-${s.productoId}-${i}`} className="hoverable">
                <Td><span className="font-mono text-gray-600">{s.bomId}</span></Td>
                <Td>{nombreProducto(s.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(s.cantidad)}</Td>
                <Td align="center">{umProducto(s.productoId)}</Td>
                <Td align="center"><span className="font-mono text-petroleum-600">{s.operacion}</span></Td>
                <Td align="right" className="font-mono">{fmtPct((s.participacionCostoPct ?? 0) / 100)}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Registrar subproducto" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <Campo label="Lista de materiales">
              <select className={INPUT} value={form.bomId} onChange={e => setForm({ ...form, bomId: e.target.value })}>
                {BOMS.map(b => <option key={b.id} value={b.id}>{b.id} · {nombreProducto(b.productoId)}</option>)}
              </select>
            </Campo>
            <Campo label="Subproducto">
              <select className={INPUT} value={form.productoId} onChange={e => setForm({ ...form, productoId: e.target.value })}>
                {PRODUCTOS.filter(p => p.tipo === 'Subproducto' || p.tipo === 'Semielaborado').map(p => <option key={p.id} value={p.id}>{p.id} · {p.nombre}</option>)}
              </select>
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Cantidad por lote">
                <input className={INPUT} type="number" min={0} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })} />
              </Campo>
              <Campo label="Participación en costo (%)">
                <input className={INPUT} type="number" min={0} max={100} step={0.5} value={form.participacionCostoPct} onChange={e => setForm({ ...form, participacionCostoPct: Number(e.target.value) })} />
              </Campo>
            </div>
            <Campo label="Operación de origen">
              <select className={INPUT} value={form.operacion} onChange={e => setForm({ ...form, operacion: e.target.value })}>
                {['OP-10', 'OP-20', 'OP-30', 'OP-40', 'OP-50'].map(op => <option key={op} value={op}>{op}</option>)}
              </select>
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={registrar}>Registrar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-06. Operaciones y rutas */
function BloquePRD06() {
  const { mensaje, notificar } = useMensaje();
  const [rutaId, setRutaId] = useState(RUTAS[0].id);
  const [ops, setOps] = useState<OperacionRuta[]>(RUTAS[0].operaciones);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', centroId: CENTROS[0].id, duracionTipo: 'calculada' as OperacionRuta['duracionTipo'], duracionMin: 0, prepMin: 0, cicloMin: 0, limpiezaMin: 0, costoFijo: 0 });

  useEffect(() => {
    setOps(RUTAS.find(r => r.id === rutaId)?.operaciones ?? []);
  }, [rutaId]);

  function agregar() {
    const codigo = `OP-${60 + ops.length * 10}`;
    setOps(prev => [...prev, { codigo, nombre: form.nombre || `Operación ${codigo}`, centroId: form.centroId, duracionTipo: form.duracionTipo, duracionMin: form.duracionMin || undefined, prepMin: form.prepMin, cicloMin: form.cicloMin, limpiezaMin: form.limpiezaMin, costoFijo: form.costoFijo }]);
    setModal(false);
    notificar(`Operación ${codigo} «${form.nombre}» agregada a la ruta (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-06">
      <Toolbar>
        <select className={INPUT} value={rutaId} onChange={e => setRutaId(e.target.value)} aria-label="Seleccionar ruta">
          {RUTAS.map(r => <option key={r.id} value={r.id}>{r.id} · {nombreProducto(r.productoId)} ({r.version})</option>)}
        </select>
        <span className="ml-auto text-xs text-gray-500">{ops.length} operaciones en secuencia</span>
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nueva operación</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer={`Ruta ${rutaId} · duración ${ops.some(o => o.duracionTipo === 'calculada') ? 'calculada por ciclo' : 'fija'} · tiempos de preparación y limpieza incluidos.`}>
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th align="center">Sec.</Th>
              <Th>Operación</Th>
              <Th>Centro de trabajo</Th>
              <Th align="center">Duración</Th>
              <Th align="right">Preparación</Th>
              <Th align="right">Ciclo</Th>
              <Th align="right">Limpieza</Th>
              <Th align="right">Costo fijo</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ops.map((o, i) => (
              <tr key={`${o.codigo}-${i}`} className="hoverable">
                <Td align="center"><span className="font-mono text-gray-500">{String(i + 1).padStart(2, '0')}</span></Td>
                <Td>
                  <span className="font-mono text-petroleum-600">{o.codigo}</span>
                  <span className="ml-1.5">{o.nombre}</span>
                </Td>
                <Td>{nombreCentro(o.centroId)}</Td>
                <Td align="center">{o.duracionTipo === 'fija' ? `Fija ${fmtNum(o.duracionMin ?? 0)} min` : `Calculada (${fmtNum(o.piezasPorCiclo ?? 0)} und/ciclo)`}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.prepMin)} min</Td>
                <Td align="right" className="font-mono">{fmtNum(o.cicloMin)} min</Td>
                <Td align="right" className="font-mono">{fmtNum(o.limpiezaMin)} min</Td>
                <Td align="right" className="font-mono">{o.costoFijo ? fmtMoney(o.costoFijo) : '—'}</Td>
              </tr>
            ))}
            {ops.length === 0 && <EmptyRow colSpan={8} text="La ruta no tiene operaciones definidas." />}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title={`Nueva operación en ${rutaId}`} onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <Campo label="Nombre de la operación">
              <input className={INPUT} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Horneado" />
            </Campo>
            <Campo label="Centro de trabajo">
              <select className={INPUT} value={form.centroId} onChange={e => setForm({ ...form, centroId: e.target.value })}>
                {CENTROS.map(c => <option key={c.id} value={c.id}>{c.id} · {c.nombre}</option>)}
              </select>
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Tipo de duración">
                <select className={INPUT} value={form.duracionTipo} onChange={e => setForm({ ...form, duracionTipo: e.target.value as OperacionRuta['duracionTipo'] })}>
                  <option value="calculada">Calculada (ciclo)</option>
                  <option value="fija">Fija</option>
                </select>
              </Campo>
              <Campo label="Duración fija (min)">
                <input className={INPUT} type="number" min={0} value={form.duracionMin} onChange={e => setForm({ ...form, duracionMin: Number(e.target.value) })} />
              </Campo>
              <Campo label="Preparación (min)">
                <input className={INPUT} type="number" min={0} value={form.prepMin} onChange={e => setForm({ ...form, prepMin: Number(e.target.value) })} />
              </Campo>
              <Campo label="Ciclo (min)">
                <input className={INPUT} type="number" min={0} value={form.cicloMin} onChange={e => setForm({ ...form, cicloMin: Number(e.target.value) })} />
              </Campo>
              <Campo label="Limpieza (min)">
                <input className={INPUT} type="number" min={0} value={form.limpiezaMin} onChange={e => setForm({ ...form, limpiezaMin: Number(e.target.value) })} />
              </Campo>
              <Campo label="Costo fijo ($)">
                <input className={INPUT} type="number" min={0} value={form.costoFijo} onChange={e => setForm({ ...form, costoFijo: Number(e.target.value) })} />
              </Campo>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={agregar}>Agregar operación</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-07. Dependencias entre operaciones */
function BloquePRD07() {
  const { mensaje, notificar } = useMensaje();
  const [rutaId, setRutaId] = useState(RUTAS[0].id);
  const ruta = RUTAS.find(r => r.id === rutaId) ?? RUTAS[0];
  const dependencias = ruta.operaciones.filter(o => o.dependeDe);

  return (
    <FunctionBlock code="PRD-07">
      <Toolbar>
        <select className={INPUT} value={rutaId} onChange={e => setRutaId(e.target.value)} aria-label="Seleccionar ruta">
          {RUTAS.map(r => <option key={r.id} value={r.id}>{r.id} · {nombreProducto(r.productoId)}</option>)}
        </select>
        <button className={BTN_PRIMARY} onClick={() => notificar(`Validación de ${ruta.id}: sin ciclos. Secuencia ${ruta.operaciones.map(o => o.codigo).join(' → ')} respetada.`)}>
          Validar ciclos
        </button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Una operación no puede iniciar hasta que su predecesora termine; el sistema valida ciclos y respeta la secuencia.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Operación</Th>
              <Th align="center">Requiere que termine</Th>
              <Th>Predecesora</Th>
              <Th align="center">Validación</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {dependencias.map(d => {
              const pre = ruta.operaciones.find(o => o.codigo === d.dependeDe);
              return (
                <tr key={d.codigo} className="hoverable">
                  <Td><span className="font-mono text-petroleum-600">{d.codigo}</span> <span className="ml-1.5">{d.nombre}</span></Td>
                  <Td align="center"><span className="font-mono text-gray-500">{d.dependeDe}</span></Td>
                  <Td>{pre ? `${pre.codigo} · ${pre.nombre}` : '—'}</Td>
                  <Td align="center"><StatusBadge label="Sin ciclos" tone="green" /></Td>
                </tr>
              );
            })}
            {dependencias.length === 0 && <EmptyRow colSpan={4} text="La ruta no tiene dependencias definidas." />}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-08. Tamaño de lote y producción continua */
function BloquePRD08() {
  const { mensaje, notificar } = useMensaje();
  const [auto, setAuto] = useState<Record<string, boolean>>({});
  const lotes = BOMS.filter(b => b.vigente && b.tipo === 'normal');

  function alternar(bomId: string, valor: boolean) {
    setAuto(prev => ({ ...prev, [bomId]: valor }));
    notificar(valor ? `${bomId}: la siguiente operación se desbloqueará automáticamente al registrar producción.` : `${bomId}: desbloqueo automático desactivado.`);
  }

  return (
    <FunctionBlock code="PRD-08">
      <Toolbar>
        <span className="text-xs text-gray-500">{lotes.length} productos con tamaño de lote definido</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="En producción continua, registrar producción de un lote desbloquea la siguiente operación sin esperar el lote completo.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Producto</Th>
              <Th>BOM</Th>
              <Th align="right">Tamaño de lote</Th>
              <Th align="center">U.M.</Th>
              <Th align="center">Desbloqueo automático</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lotes.map(b => (
              <tr key={b.id} className="hoverable">
                <Td>{nombreProducto(b.productoId)}</Td>
                <Td><span className="font-mono text-gray-600">{b.id}</span></Td>
                <Td align="right" className="font-mono">{fmtNum(b.tamanoLote)}</Td>
                <Td align="center">{umProducto(b.productoId)}</Td>
                <Td align="center">
                  <button className={auto[b.id] ? BTN_SECONDARY : BTN_GHOST} onClick={() => alternar(b.id, !auto[b.id])}>
                    {auto[b.id] ? 'Automático ✓' : 'Manual'}
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-09. Plazos y preparación */
function BloquePRD09() {
  const { mensaje, notificar } = useMensaje();
  const [condiciones, setCondiciones] = useState<Record<string, CondicionInicio>>(
    Object.fromEntries(RUTAS.map(r => [r.id, r.inicioCon])),
  );

  function cambiar(rutaId: string, valor: CondicionInicio) {
    setCondiciones(prev => ({ ...prev, [rutaId]: valor }));
    notificar(`Condición de inicio de ${rutaId} actualizada: «${valor}» (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-09">
      <Toolbar>
        <span className="text-xs text-gray-500">{RUTAS.length} rutas con plazos · el plazo de fabricación alimenta la promesa de entrega</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="La condición de inicio define si la orden arranca con todos los componentes o solo con los de la primera operación.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Ruta</Th>
              <Th>Producto</Th>
              <Th align="right">Plazo de fabricación</Th>
              <Th align="right">Días de preparación</Th>
              <Th align="center">Condición para iniciar</Th>
              <Th align="center">Vigente</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {RUTAS.map(r => (
              <tr key={r.id} className="hoverable">
                <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
                <Td>{nombreProducto(r.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(r.plazoFabricacionDias)} días</Td>
                <Td align="right" className="font-mono">{fmtNum(r.diasPreparacion)} días</Td>
                <Td align="center">
                  <select className="min-w-0 rounded border border-gray-200 px-2 py-1 text-xs text-gray-700" value={condiciones[r.id]} onChange={e => cambiar(r.id, e.target.value as CondicionInicio)}>
                    <option value="todos los componentes">Todos los componentes</option>
                    <option value="primera operación">Primera operación</option>
                  </select>
                </Td>
                <Td align="center"><StatusBadge label={r.vigente ? 'Vigente' : 'Obsoleta'} tone={r.vigente ? 'green' : 'gray'} /></Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

function IngenieriaTab() {
  return (
    <div className="space-y-4">
      <BloquePRD01 />
      <BloquePRD02 />
      <BloquePRD03 />
      <BloquePRD04 />
      <BloquePRD05 />
      <BloquePRD06 />
      <BloquePRD07 />
      <BloquePRD08 />
      <BloquePRD09 />
    </div>
  );
}

/* --------------------- Órdenes de fabricación (PRD-10..21) ----------------- */

const ORIGENES_OF = ['Manual', 'Stock', 'Venta', 'MPS', 'Subensamble', 'Subcontratación'];

/** PRD-10. Creación de órdenes */
function BloquePRD10() {
  const { mensaje, notificar } = useMensaje();
  const [ordenes, setOrdenes] = useState<OrdenFabricacion[]>(ORDENES);
  const [q, setQ] = useState('');
  const [origen, setOrigen] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ productoId: 'PT-001', cantidad: 100, origen: 'Manual', fechaLimite: '2026-11-05' });

  const filtradas = filtrar(ordenes, q, o => `${o.id} ${nombreProducto(o.productoId)} ${o.lote}`).filter(o => !origen || o.origen === origen);

  function crear() {
    const producto = PRODUCTOS_POR_ID.get(form.productoId)!;
    const bom = BOMS.find(b => b.productoId === form.productoId && b.vigente);
    const ruta = RUTAS.find(r => r.productoId === form.productoId && r.vigente);
    const nueva: OrdenFabricacion = {
      id: `OF-${1049 + ordenes.length - ORDENES.length}`,
      productoId: form.productoId,
      cantidad: form.cantidad,
      producida: 0,
      um: producto.um,
      estado: 'borrador',
      lista: 'Bloqueada',
      origen: form.origen,
      fechaCreacion: '2026-10-28',
      fechaInicio: '',
      fechaLimite: form.fechaLimite,
      lote: '',
      bomId: bom?.id ?? 'BOM-001',
      rutaId: ruta?.id ?? 'RUT-001',
      bloqueada: false,
      pendiente: 0,
      reservado: 0,
    };
    setOrdenes(prev => [nueva, ...prev]);
    setModal(false);
    notificar(`Orden ${nueva.id} creada para ${fmtNum(nueva.cantidad)} ${nueva.um} de ${producto.nombre} (origen: ${form.origen}).`);
  }

  return (
    <FunctionBlock code="PRD-10">
      <Toolbar>
        <input className={INPUT} placeholder="Buscar orden, producto o lote..." value={q} onChange={e => setQ(e.target.value)} />
        <select className={INPUT} value={origen} onChange={e => setOrigen(e.target.value)} aria-label="Filtrar por origen">
          <option value="">Todos los orígenes</option>
          {ORIGENES_OF.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="ml-auto text-xs text-gray-500">{filtradas.length} órdenes</span>
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nueva orden</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Las órdenes pueden nacer de una necesidad de stock, venta, plan maestro, subensamble o subcontratación.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Producto</Th>
              <Th align="right">Cantidad</Th>
              <Th align="right">Producida</Th>
              <Th align="center">Estado</Th>
              <Th align="center">Origen</Th>
              <Th align="center">Fecha límite</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtradas.map(o => (
              <tr key={o.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                <Td>{nombreProducto(o.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.cantidad)} {o.um}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.producida)}</Td>
                <Td align="center"><StatusBadge label={ETIQUETA_ESTADO_OF[o.estado]} tone={TONO_ESTADO_OF[o.estado]} /></Td>
                <Td align="center"><StatusBadge label={o.origen} tone="gray" /></Td>
                <Td align="center" className="font-mono text-gray-600">{fmtFecha(o.fechaLimite)}</Td>
              </tr>
            ))}
            {filtradas.length === 0 && <EmptyRow colSpan={7} text="No hay órdenes que coincidan con los filtros." />}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Nueva orden de fabricación" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <Campo label="Producto a fabricar">
              <select className={INPUT} value={form.productoId} onChange={e => setForm({ ...form, productoId: e.target.value })}>
                {PRODUCTOS.filter(p => p.tipo === 'Terminado' || p.tipo === 'Semielaborado').map(p => <option key={p.id} value={p.id}>{p.id} · {p.nombre}</option>)}
              </select>
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Cantidad">
                <input className={INPUT} type="number" min={1} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })} />
              </Campo>
              <Campo label="Fecha límite">
                <input className={INPUT} type="date" value={form.fechaLimite} onChange={e => setForm({ ...form, fechaLimite: e.target.value })} />
              </Campo>
            </div>
            <Campo label="Origen de la necesidad">
              <select className={INPUT} value={form.origen} onChange={e => setForm({ ...form, origen: e.target.value })}>
                {ORIGENES_OF.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={crear}>Crear orden</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-11. Confirmación */
function BloquePRD11() {
  const { mensaje, notificar } = useMensaje();
  const [ordenes, setOrdenes] = useState<OrdenFabricacion[]>(ORDENES);
  const pendientes = ordenes.filter(o => o.estado === 'borrador');

  function confirmar(id: string) {
    setOrdenes(prev => prev.map(o => (o.id === id ? { ...o, estado: 'confirmada', lista: 'Lista' } : o)));
    notificar(`${id} confirmada: BOM explotada, demanda de componentes generada, movimientos de producto terminado creados y abastecimiento disparado (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-11">
      <Toolbar>
        <span className="text-xs text-gray-500">{pendientes.length} órdenes en borrador esperando confirmación</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Al confirmar se explota la lista de materiales, se genera la demanda de componentes y se dispara el abastecimiento.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Producto</Th>
              <Th align="right">Cantidad</Th>
              <Th align="center">BOM</Th>
              <Th align="center">Estado</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pendientes.map(o => (
              <tr key={o.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                <Td>{nombreProducto(o.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.cantidad)} {o.um}</Td>
                <Td align="center"><span className="font-mono text-gray-500">{o.bomId}</span></Td>
                <Td align="center"><StatusBadge label={ETIQUETA_ESTADO_OF[o.estado]} tone={TONO_ESTADO_OF[o.estado]} /></Td>
                <Td align="center">
                  <button className={BTN_PRIMARY} onClick={() => confirmar(o.id)}>Confirmar</button>
                </Td>
              </tr>
            ))}
            {pendientes.length === 0 && <EmptyRow colSpan={6} text="No hay órdenes en borrador: todas fueron confirmadas." />}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-12. Reserva y disponibilidad */
function BloquePRD12() {
  const { mensaje, notificar } = useMensaje();
  const [ordenes, setOrdenes] = useState<OrdenFabricacion[]>(ORDENES);

  function reservar(o: OrdenFabricacion) {
    setOrdenes(prev => prev.map(x => (x.id === o.id ? { ...x, reservado: x.cantidad, lista: 'Lista' } : x)));
    notificar(`${o.id}: ${fmtNum(o.cantidad)} ${o.um} de ${nombreProducto(o.productoId)} reservados para la orden.`);
  }

  function liberar(o: OrdenFabricacion) {
    const disponible = PRODUCTOS_POR_ID.get(o.productoId)?.stock ?? 0;
    setOrdenes(prev => prev.map(x => (x.id === o.id ? { ...x, reservado: 0, lista: disponible >= x.cantidad ? 'Lista' : 'Esperando material' } : x)));
    notificar(`${o.id}: reservas liberadas; la orden queda «${(PRODUCTOS_POR_ID.get(o.productoId)?.stock ?? 0) >= o.cantidad ? 'Lista' : 'Esperando material'}».`);
  }

  return (
    <FunctionBlock code="PRD-12">
      <Toolbar>
        <span className="text-xs text-gray-500">La reserva bloquea stock de componentes; la disponibilidad decide si la orden puede iniciar.</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Estados de lista: Lista, Esperando material u Esperando operación.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Producto</Th>
              <Th align="right">Requerido</Th>
              <Th align="right">Reservado</Th>
              <Th align="right">Stock disponible</Th>
              <Th align="center">Disponibilidad</Th>
              <Th align="center">Acciones</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ordenes.map(o => {
              const stock = PRODUCTOS_POR_ID.get(o.productoId)?.stock ?? 0;
              return (
                <tr key={o.id} className="hoverable">
                  <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                  <Td>{nombreProducto(o.productoId)}</Td>
                  <Td align="right" className="font-mono">{fmtNum(o.cantidad)} {o.um}</Td>
                  <Td align="right" className="font-mono">{fmtNum(o.reservado)}</Td>
                  <Td align="right" className="font-mono">{fmtNum(stock)}</Td>
                  <Td align="center"><StatusBadge label={o.lista} tone={TONO_LISTA[o.lista] ?? 'gray'} /></Td>
                  <Td align="center">
                    <button className={BTN_SECONDARY} disabled={o.reservado > 0} onClick={() => reservar(o)}>Reservar</button>{' '}
                    <button className={BTN_GHOST} disabled={o.reservado === 0} onClick={() => liberar(o)}>Liberar</button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-13. Capacidad de producción */
function BloquePRD13() {
  const { mensaje, notificar } = useMensaje();

  const filas = BOMS.filter(b => b.vigente && b.tipo === 'normal').map(b => {
    let maxLotes = Infinity;
    let critico: ComponenteBOM | null = null;
    for (const c of b.componentes) {
      const stock = PRODUCTOS_POR_ID.get(c.productoId)?.stock ?? 0;
      const lotes = Math.floor(stock / c.cantidad);
      if (lotes < maxLotes) {
        maxLotes = lotes;
        critico = c;
      }
    }
    return { bom: b, maxLotes: maxLotes === Infinity ? 0 : maxLotes, producible: (maxLotes === Infinity ? 0 : maxLotes) * b.tamanoLote, critico };
  });

  return (
    <FunctionBlock code="PRD-13">
      <Toolbar>
        <span className="text-xs text-gray-500">Cuánto se puede producir hoy con el stock actual de componentes</span>
        <button className={`${BTN_GHOST} ml-auto`} onClick={() => notificar(`Restricciones: ${filas.map(f => `${nombreProducto(f.bom.productoId)} → ${f.critico ? nombreProducto(f.critico.productoId) : 'sin componentes'}`).join('; ')}.`)}>
          Ver restricciones
        </button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="El componente con menor cobertura define la producción máxima del producto.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Producto</Th>
              <Th>Componente crítico</Th>
              <Th align="right">Stock crítico</Th>
              <Th align="right">Lotes posibles</Th>
              <Th align="right">Producible (máx.)</Th>
              <Th align="center">U.M.</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filas.map(f => (
              <tr key={f.bom.id} className="hoverable">
                <Td>{nombreProducto(f.bom.productoId)}</Td>
                <Td>
                  {f.critico ? (
                    <>
                      <span className="font-mono text-gray-500">{f.critico.productoId}</span>
                      <span className="ml-1.5">{nombreProducto(f.critico.productoId)}</span>
                    </>
                  ) : (
                    '—'
                  )}
                </Td>
                <Td align="right" className="font-mono">{f.critico ? fmtNum(PRODUCTOS_POR_ID.get(f.critico.productoId)?.stock ?? 0) : '—'}</Td>
                <Td align="right" className="font-mono">{fmtNum(f.maxLotes)}</Td>
                <Td align="right" className="font-mono font-semibold text-petroleum-700">{fmtNum(f.producible)}</Td>
                <Td align="center">{umProducto(f.bom.productoId)}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-14. Registro de producción */
function BloquePRD14() {
  const { mensaje, notificar } = useMensaje();
  const [registros, setRegistros] = useState<RegistroProduccion[]>(REGISTROS_PRODUCCION);
  const [ordenes, setOrdenes] = useState<OrdenFabricacion[]>(ORDENES);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ofId: 'OF-1043', cantidad: 100, lote: '', merma: 0, usuario: 'Diego Ramírez' });

  function registrar() {
    const of = ordenes.find(o => o.id === form.ofId);
    if (!of) return;
    const nuevo: RegistroProduccion = {
      id: `RG-${String(registros.length + 1).padStart(2, '0')}`,
      ofId: form.ofId,
      fecha: '2026-10-28',
      cantidad: form.cantidad,
      lote: form.lote || `L-2026-${118 + registros.length}`,
      merma: form.merma,
      usuario: form.usuario,
    };
    setRegistros(prev => [nuevo, ...prev]);
    setOrdenes(prev =>
      prev.map(o => {
        if (o.id !== form.ofId) return o;
        const producida = o.producida + form.cantidad;
        return {
          ...o,
          producida,
          lote: o.lote || nuevo.lote,
          estado: producida >= o.cantidad ? 'hecha' : 'en_progreso',
        };
      }),
    );
    setModal(false);
    notificar(`Producción registrada en ${form.ofId}: ${fmtNum(form.cantidad)} ${of.um} de ${nombreProducto(of.productoId)} con lote ${nuevo.lote}. Movimientos de terminado creados (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-14">
      <Toolbar>
        <span className="text-xs text-gray-500">{registros.length} registros · lote, merma y subproductos incluidos</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => setModal(true)}>+ Registrar producción</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Cada registro genera el movimiento de producto terminado y la demanda de subproductos si aplica.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Registro</Th>
              <Th>Orden</Th>
              <Th>Producto</Th>
              <Th align="right">Cantidad</Th>
              <Th align="center">Lote</Th>
              <Th align="right">Merma</Th>
              <Th>Usuario</Th>
              <Th align="center">Fecha</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {registros.map(r => {
              const of = ordenes.find(o => o.id === r.ofId);
              return (
                <tr key={r.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
                  <Td><span className="font-mono text-petroleum-600">{r.ofId}</span></Td>
                  <Td>{of ? nombreProducto(of.productoId) : '—'}</Td>
                  <Td align="right" className="font-mono">{fmtNum(r.cantidad)}</Td>
                  <Td align="center"><span className="font-mono text-gray-600">{r.lote}</span></Td>
                  <Td align="right" className="font-mono">{fmtNum(r.merma)}</Td>
                  <Td>{r.usuario}</Td>
                  <Td align="center" className="font-mono text-gray-600">{fmtFecha(r.fecha)}</Td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Registrar producción" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <Campo label="Orden de fabricación">
              <select className={INPUT} value={form.ofId} onChange={e => setForm({ ...form, ofId: e.target.value })}>
                {ordenes.filter(o => o.estado === 'confirmada' || o.estado === 'en_progreso').map(o => <option key={o.id} value={o.id}>{o.id} · {nombreProducto(o.productoId)}</option>)}
              </select>
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Cantidad producida">
                <input className={INPUT} type="number" min={1} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })} />
              </Campo>
              <Campo label="Merma (und)">
                <input className={INPUT} type="number" min={0} value={form.merma} onChange={e => setForm({ ...form, merma: Number(e.target.value) })} />
              </Campo>
              <Campo label="Lote o serie">
                <input className={INPUT} value={form.lote} onChange={e => setForm({ ...form, lote: e.target.value })} placeholder="Auto si vacío" />
              </Campo>
              <Campo label="Usuario">
                <input className={INPUT} value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} />
              </Campo>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={registrar}>Registrar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-15. Consumo y advertencias */
function BloquePRD15() {
  const { mensaje, notificar } = useMensaje();
  const [consumos, setConsumos] = useState<Consumo[]>(CONSUMOS);
  const [justificando, setJustificando] = useState<Consumo | null>(null);
  const [motivo, setMotivo] = useState('');

  function desviacion(c: Consumo): number {
    return c.teorico === 0 ? 0 : (c.real - c.teorico) / c.teorico;
  }

  function justificar() {
    if (!justificando) return;
    setConsumos(prev => prev.map(c => (c.id === justificando.id ? { ...c, justificado: true, motivo } : c)));
    setJustificando(null);
    setMotivo('');
    notificar(`Desviación de ${justificando.id} justificada: «${motivo}».`);
  }

  return (
    <FunctionBlock code="PRD-15">
      <Toolbar>
        <span className="text-xs text-gray-500">Diferencias mayores a ±5 % requieren justificación o ajuste según permisos</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="El consumo real se compara contra el teórico de la BOM; las desviaciones quedan trazadas con su justificación.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Componente</Th>
              <Th align="right">Teórico</Th>
              <Th align="right">Real</Th>
              <Th align="right">Desviación</Th>
              <Th align="center">Justificado</Th>
              <Th>Motivo</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {consumos.map(c => {
              const dev = desviacion(c);
              return (
                <tr key={c.id} className="hoverable">
                  <Td><span className="font-mono text-petroleum-600">{c.ofId}</span></Td>
                  <Td>{nombreProducto(c.productoId)}</Td>
                  <Td align="right" className="font-mono">{fmtNum(c.teorico)} {c.um}</Td>
                  <Td align="right" className="font-mono">{fmtNum(c.real)} {c.um}</Td>
                  <Td align="right">
                    <StatusBadge label={`${dev >= 0 ? '+' : ''}${fmtPct(Math.abs(dev), 1)}`} tone={Math.abs(dev) > 0.05 ? 'red' : Math.abs(dev) > 0.02 ? 'amber' : 'green'} />
                  </Td>
                  <Td align="center"><StatusBadge label={c.justificado ? 'Sí' : 'No'} tone={c.justificado ? 'green' : 'red'} /></Td>
                  <Td className="text-gray-500">{c.motivo ?? '—'}</Td>
                  <Td align="center">
                    {!c.justificado && (
                      <button className={BTN_SECONDARY} onClick={() => { setJustificando(c); setMotivo(''); }}>Justificar</button>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </div>
      {justificando && (
        <Modal title={`Justificar desviación · ${justificando.id}`} onClose={() => setJustificando(null)}>
          <div className="space-y-3 p-5">
            <p className="text-xs text-gray-500">
              {nombreProducto(justificando.productoId)}: teórico {fmtNum(justificando.teorico)} {justificando.um} vs real {fmtNum(justificando.real)} {justificando.um}.
            </p>
            <Campo label="Motivo de la desviación">
              <input className={INPUT} value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Ej. Merma por humedad del lote..." />
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setJustificando(null)}>Cancelar</button>
              <button className={BTN_PRIMARY} disabled={!motivo.trim()} onClick={justificar}>Justificar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-16. Pendientes y producción parcial */
function BloquePRD16() {
  const { mensaje, notificar } = useMensaje();
  const [ordenes, setOrdenes] = useState<OrdenFabricacion[]>(ORDENES);
  const parciales = ordenes.filter(o => o.estado === 'en_progreso' || o.estado === 'hecha');
  const pendientes = ordenes.filter(o => o.pendiente > 0);

  function cerrarConPendiente(o: OrdenFabricacion) {
    const pendiente = o.cantidad - o.producida;
    setOrdenes(prev => prev.map(x => (x.id === o.id ? { ...x, estado: 'cerrada', pendiente } : x)));
    notificar(`${o.id} cerrada con ${fmtNum(pendiente)} ${o.um} pendientes de ${nombreProducto(o.productoId)}; la demanda original (${o.origen}) se conserva en el pendiente.`);
  }

  return (
    <FunctionBlock code="PRD-16">
      <Toolbar>
        <span className="text-xs text-gray-500">{parciales.length} órdenes con producción parcial · {pendientes.length} pendientes activos</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Al cerrar con cantidad menor, el pendiente conserva la demanda restante y su origen.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Producto</Th>
              <Th align="right">Solicitado</Th>
              <Th align="right">Producido</Th>
              <Th align="right">Pendiente</Th>
              <Th align="center">Estado</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {parciales.map(o => (
              <tr key={o.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                <Td>{nombreProducto(o.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.cantidad)}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.producida)}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.pendiente || o.cantidad - o.producida)}</Td>
                <Td align="center"><StatusBadge label={ETIQUETA_ESTADO_OF[o.estado]} tone={TONO_ESTADO_OF[o.estado]} /></Td>
                <Td align="center">
                  {o.cantidad > o.producida && (
                    <button className={BTN_SECONDARY} onClick={() => cerrarConPendiente(o)}>Cerrar con pendiente</button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-17. División y fusión de órdenes */
function BloquePRD17() {
  const { mensaje, notificar } = useMensaje();
  const [ordenes, setOrdenes] = useState<OrdenFabricacion[]>(ORDENES);
  const [a, setA] = useState('OF-1047');
  const [b, setB] = useState('OF-1043');
  const [modalDividir, setModalDividir] = useState(false);
  const [cantidad, setCantidad] = useState(100);

  const ordenA = ordenes.find(o => o.id === a);
  const ordenB = ordenes.find(o => o.id === b);
  const compatibles = ordenA && ordenB && ordenA.productoId === ordenB.productoId && ordenA.id !== ordenB.id;

  function dividir() {
    if (!ordenA) return;
    setOrdenes(prev => [
      { ...ordenA, id: `${ordenA.id}-A`, cantidad: cantidad, producida: 0, estado: 'borrador' },
      { ...ordenA, id: `${ordenA.id}-B`, cantidad: ordenA.cantidad - cantidad, producida: 0, estado: 'borrador' },
      ...prev.filter(x => x.id !== ordenA.id),
    ]);
    setModalDividir(false);
    notificar(`${ordenA.id} dividida en ${ordenA.id}-A (${fmtNum(cantidad)} und) y ${ordenA.id}-B (${fmtNum(ordenA.cantidad - cantidad)} und).`);
  }

  function fusionar() {
    if (!compatibles || !ordenA || !ordenB) return;
    setOrdenes(prev => [
      { ...ordenA, cantidad: ordenA.cantidad + ordenB.cantidad },
      ...prev.filter(x => x.id !== ordenB.id && x.id !== ordenA.id),
    ]);
    notificar(`${ordenA.id} y ${ordenB.id} fusionadas en ${ordenA.id}: ${fmtNum(ordenA.cantidad + ordenB.cantidad)} ${ordenA.um} de ${nombreProducto(ordenA.productoId)}.`);
  }

  return (
    <FunctionBlock code="PRD-17">
      <Toolbar>
        <select className={INPUT} value={a} onChange={e => setA(e.target.value)} aria-label="Orden A">
          {ordenes.map(o => <option key={o.id} value={o.id}>{o.id} · {nombreProducto(o.productoId)}</option>)}
        </select>
        <select className={INPUT} value={b} onChange={e => setB(e.target.value)} aria-label="Orden B">
          {ordenes.map(o => <option key={o.id} value={o.id}>{o.id} · {nombreProducto(o.productoId)}</option>)}
        </select>
        <StatusBadge label={compatibles ? 'Compatibles' : 'No compatibles'} tone={compatibles ? 'green' : 'red'} />
        <button className={BTN_SECONDARY} onClick={() => setModalDividir(true)} disabled={!ordenA}>Dividir</button>
        <button className={BTN_PRIMARY} onClick={fusionar} disabled={!compatibles}>Fusionar</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Solo pueden dividirse o fusionarse órdenes compatibles (mismo producto, BOM y ruta vigentes).">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Producto</Th>
              <Th align="right">Cantidad</Th>
              <Th align="center">BOM</Th>
              <Th align="center">Ruta</Th>
              <Th align="center">Estado</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ordenes.filter(o => o.estado !== 'cerrada' && o.estado !== 'cancelada').map(o => (
              <tr key={o.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                <Td>{nombreProducto(o.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.cantidad)} {o.um}</Td>
                <Td align="center"><span className="font-mono text-gray-500">{o.bomId}</span></Td>
                <Td align="center"><span className="font-mono text-gray-500">{o.rutaId}</span></Td>
                <Td align="center"><StatusBadge label={ETIQUETA_ESTADO_OF[o.estado]} tone={TONO_ESTADO_OF[o.estado]} /></Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {modalDividir && ordenA && (
        <Modal title={`Dividir ${ordenA.id}`} onClose={() => setModalDividir(false)}>
          <div className="space-y-3 p-5">
            <p className="text-xs text-gray-500">Cantidad para la nueva orden hija. El resto queda en la orden original.</p>
            <Campo label="Cantidad de la orden hija">
              <input className={INPUT} type="number" min={1} max={ordenA.cantidad} value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModalDividir(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={dividir}>Dividir</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-18. Bloqueo de cantidades */
function BloquePRD18() {
  const { mensaje, notificar } = useMensaje();
  const [ordenes, setOrdenes] = useState<OrdenFabricacion[]>(ORDENES);
  const [autorizadas, setAutorizadas] = useState<Record<string, boolean>>({});
  const [solicitando, setSolicitando] = useState<OrdenFabricacion | null>(null);
  const [clave, setClave] = useState('');

  function bloquear(o: OrdenFabricacion) {
    setOrdenes(prev => prev.map(x => (x.id === o.id ? { ...x, bloqueada: true, lista: 'Bloqueada' } : x)));
    notificar(`${o.id} bloqueada: las cantidades no podrán modificarse durante la ejecución.`);
  }

  function autorizar() {
    if (!solicitando) return;
    setAutorizadas(prev => ({ ...prev, [solicitando.id]: true }));
    setSolicitando(null);
    setClave('');
    notificar(`${solicitando.id}: cambio de cantidades autorizado por supervisión (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-18">
      <Toolbar>
        <span className="text-xs text-gray-500">Las órdenes bloqueadas requieren autorización para modificar cantidades</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="El bloqueo protege la orden durante la ejecución; la autorización queda registrada en auditoría.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Producto</Th>
              <Th align="right">Cantidad</Th>
              <Th align="center">Bloqueada</Th>
              <Th align="center">Autorización</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ordenes.map(o => (
              <tr key={o.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                <Td>{nombreProducto(o.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.cantidad)} {o.um}</Td>
                <Td align="center"><StatusBadge label={o.bloqueada ? 'Sí' : 'No'} tone={o.bloqueada ? 'red' : 'gray'} /></Td>
                <Td align="center">
                  {o.bloqueada ? (
                    <StatusBadge label={autorizadas[o.id] ? 'Autorizada' : 'Sin autorizar'} tone={autorizadas[o.id] ? 'green' : 'amber'} />
                  ) : (
                    '—'
                  )}
                </Td>
                <Td align="center">
                  {!o.bloqueada ? (
                    <button className={BTN_SECONDARY} onClick={() => bloquear(o)}>Bloquear</button>
                  ) : (
                    <button className={BTN_GHOST} onClick={() => { setSolicitando(o); setClave(''); }}>Autorizar cambio</button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {solicitando && (
        <Modal title={`Autorizar cambios en ${solicitando.id}`} onClose={() => setSolicitando(null)}>
          <div className="space-y-3 p-5">
            <p className="text-xs text-gray-500">La modificación de cantidades en una orden bloqueada requiere clave de supervisión.</p>
            <Campo label="Clave de autorización">
              <input className={INPUT} type="password" value={clave} onChange={e => setClave(e.target.value)} placeholder="••••••" data-initial-focus />
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setSolicitando(null)}>Cancelar</button>
              <button className={BTN_PRIMARY} disabled={!clave.trim()} onClick={autorizar}>Autorizar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-19. Desecho */
function BloquePRD19() {
  const { mensaje, notificar } = useMensaje();
  const [desechos, setDesechos] = useState<Desecho[]>(DESECHOS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ofId: 'OF-1043', productoId: 'MP-001', cantidad: 1, motivo: '', responsable: 'Diego Ramírez' });

  function registrar() {
    const nuevo: Desecho = {
      id: `DE-${String(desechos.length + 1).padStart(2, '0')}`,
      ofId: form.ofId,
      productoId: form.productoId,
      cantidad: form.cantidad,
      um: umProducto(form.productoId),
      motivo: form.motivo,
      responsable: form.responsable,
      fecha: '2026-10-28',
    };
    setDesechos(prev => [nuevo, ...prev]);
    setModal(false);
    notificar(`Desecho registrado: ${fmtNum(nuevo.cantidad)} ${nuevo.um} de ${nombreProducto(form.productoId)} por «${form.motivo}» (movimiento de inventario generado).`);
  }

  return (
    <FunctionBlock code="PRD-19">
      <Toolbar>
        <span className="text-xs text-gray-500">{desechos.length} desechos registrados con motivo y responsable</span>
        <button className={`${BTN_DANGER} ml-auto`} onClick={() => setModal(true)}>+ Registrar desecho</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="El desecho genera salida de inventario con el motivo de baja; los desechos trazados conservan su lote.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Producto</Th>
              <Th align="right">Cantidad</Th>
              <Th align="center">U.M.</Th>
              <Th>Motivo</Th>
              <Th>Responsable</Th>
              <Th align="center">Fecha</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {desechos.map(d => (
              <tr key={d.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{d.ofId}</span></Td>
                <Td>{nombreProducto(d.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(d.cantidad)}</Td>
                <Td align="center">{d.um}</Td>
                <Td className="text-gray-600">{d.motivo}</Td>
                <Td>{d.responsable}</Td>
                <Td align="center" className="font-mono text-gray-600">{fmtFecha(d.fecha)}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Registrar desecho" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Orden de fabricación">
                <select className={INPUT} value={form.ofId} onChange={e => setForm({ ...form, ofId: e.target.value })}>
                  {ORDENES.map(o => <option key={o.id} value={o.id}>{o.id}</option>)}
                </select>
              </Campo>
              <Campo label="Producto">
                <select className={INPUT} value={form.productoId} onChange={e => setForm({ ...form, productoId: e.target.value })}>
                  {PRODUCTOS.map(p => <option key={p.id} value={p.id}>{p.id} · {p.nombre}</option>)}
                </select>
              </Campo>
              <Campo label="Cantidad">
                <input className={INPUT} type="number" min={0} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })} />
              </Campo>
              <Campo label="Responsable">
                <input className={INPUT} value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} />
              </Campo>
            </div>
            <Campo label="Motivo">
              <input className={INPUT} value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} placeholder="Ej. Deformación en horneado..." />
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_DANGER} disabled={!form.motivo.trim()} onClick={registrar}>Registrar desecho</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-20. Cierre y cancelación */
function BloquePRD20() {
  const { mensaje, notificar } = useMensaje();
  const [ordenes, setOrdenes] = useState<OrdenFabricacion[]>(ORDENES);
  const listas = ordenes.filter(
    o => o.estado === 'hecha' || o.estado === 'borrador' || o.estado === 'confirmada' || (o.estado === 'cerrada' && o.pendiente === 0),
  );

  function cerrar(o: OrdenFabricacion) {
    const costo = COSTOS_OF.find(c => c.ofId === o.id);
    setOrdenes(prev => prev.map(x => (x.id === o.id ? { ...x, estado: 'cerrada' } : x)));
    notificar(
      `${o.id} cerrada: consumo y producción consolidados, costos calculados (${costo ? fmtMoney(costo.total) : '—'}) y movimientos finalizados${o.cantidad > o.producida ? `; pendiente de ${fmtNum(o.cantidad - o.producida)} ${o.um}` : ''}.`,
    );
  }

  function cancelar(o: OrdenFabricacion) {
    setOrdenes(prev => prev.map(x => (x.id === o.id ? { ...x, estado: 'cancelada', reservado: 0, bloqueada: true } : x)));
    notificar(`${o.id} cancelada: reservas liberadas, movimientos anulados, motivo y responsable registrados en auditoría (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-20">
      <Toolbar>
        <span className="text-xs text-gray-500">{listas.length} órdenes listas para cierre o cancelación</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="El cierre finaliza la orden, consolida consumo y producción, calcula costos y genera el pendiente si corresponde. La cancelación solo se permite en órdenes sin ejecución y libera reservas.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Producto</Th>
              <Th align="right">Solicitado</Th>
              <Th align="right">Producido</Th>
              <Th align="center">Lote</Th>
              <Th align="center">Estado</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {listas.map(o => (
              <tr key={o.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                <Td>{nombreProducto(o.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.cantidad)} {o.um}</Td>
                <Td align="right" className="font-mono">{fmtNum(o.producida)}</Td>
                <Td align="center"><span className="font-mono text-gray-600">{o.lote || '—'}</span></Td>
                <Td align="center"><StatusBadge label={ETIQUETA_ESTADO_OF[o.estado]} tone={TONO_ESTADO_OF[o.estado]} /></Td>
                <Td align="center">
                  {o.estado === 'hecha' && <button className={BTN_PRIMARY} onClick={() => cerrar(o)}>Cerrar orden</button>}
                  {(o.estado === 'borrador' || o.estado === 'confirmada') && !o.bloqueada && (
                    <button className={BTN_DANGER} onClick={() => cancelar(o)}>Cancelar orden</button>
                  )}
                  {(o.estado === 'borrador' || o.estado === 'confirmada') && o.bloqueada && (
                    <span className="text-xs text-gray-400">Bloqueada</span>
                  )}
                  {o.estado === 'cerrada' && <span className="text-xs text-gray-400">Finalizada</span>}
                </Td>
              </tr>
            ))}
            {listas.length === 0 && <EmptyRow colSpan={7} text="No hay órdenes listas para cerrar o cancelar." />}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-21. Desensamblado */
function BloquePRD21() {
  const { mensaje, notificar } = useMensaje();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ productoId: 'PT-002', cantidad: 1 });
  const [recuperados, setRecuperados] = useState<{ productoId: string; cantidad: number; um: string }[] | null>(null);

  function desensamblar() {
    const bom = BOMS.find(b => b.productoId === form.productoId && b.vigente);
    if (!bom) return;
    const lista = bom.componentes.map(c => ({
      productoId: c.productoId,
      cantidad: (c.cantidad / bom.tamanoLote) * form.cantidad,
      um: c.um,
    }));
    setRecuperados(lista);
    setModal(false);
    notificar(`${fmtNum(form.cantidad)} ${umProducto(form.productoId)} de ${nombreProducto(form.productoId)} desensamblados: stock de componentes recuperado y trazabilidad heredada del lote (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-21">
      <Toolbar>
        <span className="text-xs text-gray-500">Descompone un producto terminado en sus componentes recuperando stock y trazabilidad</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => setModal(true)}>+ Desensamblar</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer={recuperados ? 'Resultado del último desensamblado.' : 'Selecciona un producto terminado para desensamblar.'}>
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Componente recuperado</Th>
              <Th align="right">Cantidad</Th>
              <Th align="center">U.M.</Th>
              <Th align="center">Destino</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recuperados?.map((r, i) => (
              <tr key={`${r.productoId}-${i}`} className="hoverable">
                <Td>
                  <span className="font-mono text-gray-500">{r.productoId}</span>
                  <span className="ml-1.5">{nombreProducto(r.productoId)}</span>
                </Td>
                <Td align="right" className="font-mono">{fmtNum(r.cantidad)}</Td>
                <Td align="center">{r.um}</Td>
                <Td align="center"><StatusBadge label="Stock" tone="petroleum" /></Td>
              </tr>
            ))}
            {!recuperados && <EmptyRow colSpan={4} text="Aún no hay desensamblados en esta sesión." />}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Desensamblar producto terminado" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <Campo label="Producto terminado">
              <select className={INPUT} value={form.productoId} onChange={e => setForm({ ...form, productoId: e.target.value })}>
                {PRODUCTOS.filter(p => p.tipo === 'Terminado').map(p => <option key={p.id} value={p.id}>{p.id} · {p.nombre}</option>)}
              </select>
            </Campo>
            <Campo label="Cantidad a desensamblar">
              <input className={INPUT} type="number" min={1} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })} />
            </Campo>
            <p className="text-xs text-gray-400">Los componentes se recuperan según la BOM vigente y conservan el lote/serie del producto de origen.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={desensamblar}>Desensamblar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function OrdenesTab() {
  return (
    <div className="space-y-4">
      <BloquePRD10 />
      <BloquePRD11 />
      <BloquePRD12 />
      <BloquePRD13 />
      <BloquePRD14 />
      <BloquePRD15 />
      <BloquePRD16 />
      <BloquePRD17 />
      <BloquePRD18 />
      <BloquePRD19 />
      <BloquePRD20 />
      <BloquePRD21 />
    </div>
  );
}

/* --------------------- Operaciones y centros (PRD-22..28) ------------------ */

/** PRD-22. Órdenes de trabajo */
function BloquePRD22() {
  const { mensaje, notificar } = useMensaje();
  const [ots, setOts] = useState<OrdenTrabajo[]>(ORDENES_TRABAJO);
  const [filtro, setFiltro] = useState('');

  const filas = ots.filter(o => !filtro || o.estado === filtro);

  function transicionar(ot: OrdenTrabajo) {
    setOts(prev =>
      prev.map(x => {
        if (x.id !== ot.id) return x;
        if (x.estado === 'por hacer') return { ...x, estado: 'en progreso', inicio: '2026-10-28 07:30' };
        if (x.estado === 'en progreso') {
          const real = Math.round(x.duracionEsperadaMin * 1.06);
          return { ...x, estado: 'hecha', fin: '2026-10-28 10:00', duracionRealMin: real };
        }
        return x;
      }),
    );
    notificar(ot.estado === 'por hacer' ? `${ot.id} iniciada en ${nombreCentro(ot.centroId)}.` : `${ot.id} completada; duración real registrada.`);
  }

  return (
    <FunctionBlock code="PRD-22">
      <Toolbar>
        <select className={INPUT} value={filtro} onChange={e => setFiltro(e.target.value)} aria-label="Filtrar por estado">
          <option value="">Todos los estados</option>
          <option value="bloqueada">Bloqueada</option>
          <option value="por hacer">Por hacer</option>
          <option value="en progreso">En progreso</option>
          <option value="hecha">Hecha</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <span className="ml-auto text-xs text-gray-500">{filas.length} órdenes de trabajo</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Una orden de trabajo por operación, asignada a centro y responsable, con su ciclo de estados.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>OT</Th>
              <Th>Orden</Th>
              <Th>Operación</Th>
              <Th>Centro</Th>
              <Th>Responsable</Th>
              <Th align="center">Estado</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filas.map(o => (
              <tr key={o.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                <Td><span className="font-mono text-gray-600">{o.ofId}</span></Td>
                <Td>
                  <span className="font-mono text-gray-500">{o.operacion}</span>
                  <span className="ml-1.5">{NOMBRES_OPERACION[o.operacion] ?? o.operacion}</span>
                </Td>
                <Td>{nombreCentro(o.centroId)}</Td>
                <Td>{o.responsable}</Td>
                <Td align="center"><StatusBadge label={o.estado} tone={TONO_OT[o.estado]} /></Td>
                <Td align="center">
                  {o.estado === 'por hacer' && <button className={BTN_PRIMARY} onClick={() => transicionar(o)}>Iniciar</button>}
                  {o.estado === 'en progreso' && <button className={BTN_SECONDARY} onClick={() => transicionar(o)}>Completar</button>}
                </Td>
              </tr>
            ))}
            {filas.length === 0 && <EmptyRow colSpan={7} text="No hay órdenes de trabajo con el estado seleccionado." />}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-23. Centros de trabajo */
function BloquePRD23() {
  const { mensaje, notificar } = useMensaje();
  const [centros, setCentros] = useState(CENTROS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', tipo: 'Máquina', costoHora: 30000, capacidadDia: 8, calendario: 'L-V 08:00–17:00', etiquetas: '' });

  function crear() {
    const nuevo = {
      id: `CT-${String(centros.length + 1).padStart(3, '0')}`,
      nombre: form.nombre,
      tipo: form.tipo,
      eficiencia: 0.9,
      costoHora: form.costoHora,
      prepMin: 10,
      limpiezaMin: 5,
      capacidadDia: form.capacidadDia,
      calendario: form.calendario,
      etiquetas: form.etiquetas ? form.etiquetas.split(',').map(t => t.trim()) : [],
      activo: true,
    };
    setCentros(prev => [...prev, nuevo]);
    setModal(false);
    notificar(`Centro ${nuevo.id} «${nuevo.nombre}» creado (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-23">
      <Toolbar>
        <span className="text-xs text-gray-500">{centros.length} centros: máquinas, celdas y recursos con calendario y tarifas</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => setModal(true)}>+ Nuevo centro</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Cada centro define calendario, eficiencia, tarifa por hora, preparación, limpieza, capacidad y etiquetas.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Centro</Th>
              <Th>Tipo</Th>
              <Th>Calendario</Th>
              <Th align="right">Eficiencia</Th>
              <Th align="right">Costo/h</Th>
              <Th align="right">Prep.</Th>
              <Th align="right">Limp.</Th>
              <Th align="right">Cap. día</Th>
              <Th>Etiquetas</Th>
              <Th align="center">Estado</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {centros.map(c => (
              <tr key={c.id} className="hoverable">
                <Td>
                  <span className="font-mono text-petroleum-600">{c.id}</span>
                  <span className="ml-1.5">{c.nombre}</span>
                </Td>
                <Td>{c.tipo}</Td>
                <Td className="text-gray-600">{c.calendario}</Td>
                <Td align="right" className="font-mono">{fmtPct(c.eficiencia, 0)}</Td>
                <Td align="right" className="font-mono">{fmtMoney(c.costoHora)}</Td>
                <Td align="right" className="font-mono">{fmtNum(c.prepMin)}'</Td>
                <Td align="right" className="font-mono">{fmtNum(c.limpiezaMin)}'</Td>
                <Td align="right" className="font-mono">{fmtNum(c.capacidadDia)} h</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {c.etiquetas.map(t => <StatusBadge key={t} label={t} tone="gray" />)}
                  </div>
                </Td>
                <Td align="center"><StatusBadge label={c.activo ? 'Activo' : 'Inactivo'} tone={c.activo ? 'green' : 'red'} /></Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Nuevo centro de trabajo" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <Campo label="Nombre">
              <input className={INPUT} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej. Batidora planetaria 60 L" />
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Tipo">
                <select className={INPUT} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  {['Máquina', 'Línea', 'Celda', 'Manual'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Campo>
              <Campo label="Costo por hora ($)">
                <input className={INPUT} type="number" min={0} value={form.costoHora} onChange={e => setForm({ ...form, costoHora: Number(e.target.value) })} />
              </Campo>
              <Campo label="Capacidad (h/día)">
                <input className={INPUT} type="number" min={1} value={form.capacidadDia} onChange={e => setForm({ ...form, capacidadDia: Number(e.target.value) })} />
              </Campo>
              <Campo label="Calendario">
                <input className={INPUT} value={form.calendario} onChange={e => setForm({ ...form, calendario: e.target.value })} />
              </Campo>
            </div>
            <Campo label="Etiquetas (separadas por coma)">
              <input className={INPUT} value={form.etiquetas} onChange={e => setForm({ ...form, etiquetas: e.target.value })} placeholder="mezclas, frío" />
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} disabled={!form.nombre.trim()} onClick={crear}>Crear centro</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-24. Capacidad por producto */
function BloquePRD24() {
  const { mensaje, notificar } = useMensaje();
  const [filas, setFilas] = useState<CapacidadProducto[]>(CAPACIDAD_PRODUCTO);
  const [editando, setEditando] = useState<CapacidadProducto | null>(null);
  const [form, setForm] = useState({ piezasPorCiclo: 0, tiempoInicioMin: 0, tiempoFinMin: 0 });

  function abrir(f: CapacidadProducto) {
    setEditando(f);
    setForm({ piezasPorCiclo: f.piezasPorCiclo, tiempoInicioMin: f.tiempoInicioMin, tiempoFinMin: f.tiempoFinMin });
  }

  function guardar() {
    if (!editando) return;
    setFilas(prev =>
      prev.map(f =>
        f.centroId === editando.centroId && f.productoId === editando.productoId
          ? { ...f, piezasPorCiclo: form.piezasPorCiclo, tiempoInicioMin: form.tiempoInicioMin, tiempoFinMin: form.tiempoFinMin }
          : f,
      ),
    );
    setEditando(null);
    notificar(`Capacidad de ${nombreCentro(editando.centroId)} para ${nombreProducto(editando.productoId)} actualizada (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-24">
      <Toolbar>
        <span className="text-xs text-gray-500">Piezas procesadas por ciclo según producto o unidad, con tiempos de inicio y fin</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="La capacidad por producto alimenta el cálculo de duración de las operaciones y la carga del centro.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Centro</Th>
              <Th>Producto</Th>
              <Th align="right">Piezas/ciclo</Th>
              <Th align="center">U.M.</Th>
              <Th align="right">Tiempo de inicio</Th>
              <Th align="right">Tiempo de fin</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filas.map((f, i) => (
              <tr key={`${f.centroId}-${f.productoId}-${i}`} className="hoverable">
                <Td>{nombreCentro(f.centroId)}</Td>
                <Td>{nombreProducto(f.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(f.piezasPorCiclo)}</Td>
                <Td align="center">{f.um}</Td>
                <Td align="right" className="font-mono">{fmtNum(f.tiempoInicioMin)} min</Td>
                <Td align="right" className="font-mono">{fmtNum(f.tiempoFinMin)} min</Td>
                <Td align="center">
                  <button className={BTN_GHOST} onClick={() => abrir(f)}>Editar</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {editando && (
        <Modal title={`Capacidad de ${nombreCentro(editando.centroId)} · ${nombreProducto(editando.productoId)}`} onClose={() => setEditando(null)}>
          <div className="space-y-3 p-5">
            <div className="grid grid-cols-3 gap-3">
              <Campo label="Piezas/ciclo">
                <input className={INPUT} type="number" min={1} value={form.piezasPorCiclo} onChange={e => setForm({ ...form, piezasPorCiclo: Number(e.target.value) })} />
              </Campo>
              <Campo label="Inicio (min)">
                <input className={INPUT} type="number" min={0} value={form.tiempoInicioMin} onChange={e => setForm({ ...form, tiempoInicioMin: Number(e.target.value) })} />
              </Campo>
              <Campo label="Fin (min)">
                <input className={INPUT} type="number" min={0} value={form.tiempoFinMin} onChange={e => setForm({ ...form, tiempoFinMin: Number(e.target.value) })} />
              </Campo>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setEditando(null)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={guardar}>Guardar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-25. Tiempos y productividad */
function BloquePRD25() {
  const { mensaje, notificar } = useMensaje();
  const [ots, setOts] = useState<OrdenTrabajo[]>(ORDENES_TRABAJO);
  const [pausas, setPausas] = useState<Record<string, number>>({});

  function iniciar(ot: OrdenTrabajo) {
    setOts(prev => prev.map(x => (x.id === ot.id ? { ...x, estado: 'en progreso', inicio: '2026-10-28 08:00' } : x)));
    notificar(`${ot.id}: inicio registrado con usuario ${ot.responsable}.`);
  }

  function pausar(ot: OrdenTrabajo) {
    setPausas(prev => ({ ...prev, [ot.id]: (prev[ot.id] ?? 0) + 1 }));
    notificar(`${ot.id}: pausa registrada (${(pausas[ot.id] ?? 0) + 1} en total). El cronómetro sigue activo.`);
  }

  function terminar(ot: OrdenTrabajo) {
    const real = Math.round(ot.duracionEsperadaMin * (1 + (pausas[ot.id] ?? 0) * 0.05));
    setOts(prev => prev.map(x => (x.id === ot.id ? { ...x, estado: 'hecha', fin: '2026-10-28 12:00', duracionRealMin: real } : x)));
    notificar(`${ot.id}: fin registrado. Duración real ${real} min vs esperada ${ot.duracionEsperadaMin} min.`);
  }

  return (
    <FunctionBlock code="PRD-25">
      <Toolbar>
        <span className="text-xs text-gray-500">Inicio, pausa, reanudación y fin por operación con usuario y duraciones</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="La duración real se compara contra la esperada para calcular la productividad de la operación.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>OT</Th>
              <Th>Operación</Th>
              <Th>Usuario</Th>
              <Th>Inicio</Th>
              <Th align="center">Pausas</Th>
              <Th align="right">Real</Th>
              <Th align="right">Esperada</Th>
              <Th align="right">Productividad</Th>
              <Th align="center">Acciones</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ots.map(o => {
              const real = o.duracionRealMin ?? o.duracionEsperadaMin;
              const prod = o.duracionEsperadaMin / Math.max(1, real);
              return (
                <tr key={o.id} className="hoverable">
                  <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                  <Td>{NOMBRES_OPERACION[o.operacion] ?? o.operacion}</Td>
                  <Td>{o.responsable}</Td>
                  <Td className="font-mono text-gray-500">{o.inicio ?? '—'}</Td>
                  <Td align="center" className="font-mono">{pausas[o.id] ?? 0}</Td>
                  <Td align="right" className="font-mono">{o.duracionRealMin ? `${fmtNum(o.duracionRealMin)} min` : '—'}</Td>
                  <Td align="right" className="font-mono">{fmtNum(o.duracionEsperadaMin)} min</Td>
                  <Td align="right">
                    <StatusBadge label={fmtPct(prod, 0)} tone={prod >= 1 ? 'green' : prod >= 0.9 ? 'amber' : 'red'} />
                  </Td>
                  <Td align="center">
                    {o.estado === 'por hacer' && <button className={BTN_PRIMARY} onClick={() => iniciar(o)}>Iniciar</button>}
                    {o.estado === 'en progreso' && (
                      <>
                        <button className={BTN_GHOST} onClick={() => pausar(o)}>Pausar</button>
                        <button className={BTN_SECONDARY} onClick={() => terminar(o)}>Terminar</button>
                      </>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-26. Pérdidas y eficiencia */
function BloquePRD26() {
  const { mensaje, notificar } = useMensaje();
  const [paradas, setParadas] = useState<Parada[]>(PARADAS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ centroId: CENTROS[0].id, tipo: 'Disponibilidad' as Parada['tipo'], motivo: '', duracionMin: 15 });

  const TIEMPO_PLAN = 5 * 16 * 60; // 5 días × 16 h
  const minTipo = (t: Parada['tipo']) => paradas.filter(p => p.tipo === t).reduce((a, p) => a + p.duracionMin, 0);
  const disponibilidad = 1 - minTipo('Disponibilidad') / TIEMPO_PLAN;
  const rendimiento = 1 - minTipo('Rendimiento') / TIEMPO_PLAN;
  const calidad = 1 - minTipo('Calidad') / TIEMPO_PLAN;
  const oee = disponibilidad * rendimiento * calidad;

  function registrar() {
    const nueva: Parada = {
      id: `PA-${String(paradas.length + 1).padStart(2, '0')}`,
      centroId: form.centroId,
      ofId: '—',
      tipo: form.tipo,
      motivo: form.motivo,
      inicio: '2026-10-28 09:00',
      duracionMin: form.duracionMin,
    };
    setParadas(prev => [...prev, nueva]);
    setModal(false);
    notificar(`Parada ${nueva.id} registrada en ${nombreCentro(form.centroId)}: ${form.tipo} · ${form.duracionMin} min.`);
  }

  return (
    <FunctionBlock code="PRD-26">
      <Toolbar>
        <span className="text-xs text-gray-500">Paradas por disponibilidad, rendimiento, calidad o tiempo productivo</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => setModal(true)}>+ Registrar parada</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3 grid gap-4 md:grid-cols-4">
        {[
          { label: 'Disponibilidad', valor: fmtPct(disponibilidad) },
          { label: 'Rendimiento', valor: fmtPct(rendimiento) },
          { label: 'Calidad', valor: fmtPct(calidad) },
          { label: 'OEE (A×P×Q)', valor: fmtPct(oee) },
        ].map(k => (
          <div key={k.label} className="rounded border border-gray-200 bg-white px-4 py-3">
            <div className="text-xs text-gray-500">{k.label}</div>
            <div className={`mt-1 text-xl font-semibold tabular ${k.label.startsWith('OEE') ? 'text-petroleum-700' : 'text-gray-800'}`}>{k.valor}</div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <DataTable footer="Indicadores de eficiencia calculados a partir de las paradas registradas en el período.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Centro</Th>
              <Th align="center">Tipo</Th>
              <Th>Motivo</Th>
              <Th>Inicio</Th>
              <Th align="right">Duración</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paradas.map(p => (
              <tr key={p.id} className="hoverable">
                <Td>{nombreCentro(p.centroId)}</Td>
                <Td align="center">
                  <StatusBadge label={p.tipo} tone={p.tipo === 'Disponibilidad' ? 'red' : p.tipo === 'Calidad' ? 'amber' : 'blue'} />
                </Td>
                <Td className="text-gray-600">{p.motivo}</Td>
                <Td className="font-mono text-gray-500">{p.inicio}</Td>
                <Td align="right" className="font-mono">{fmtNum(p.duracionMin)} min</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Registrar parada" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Centro">
                <select className={INPUT} value={form.centroId} onChange={e => setForm({ ...form, centroId: e.target.value })}>
                  {CENTROS.map(c => <option key={c.id} value={c.id}>{c.id} · {c.nombre}</option>)}
                </select>
              </Campo>
              <Campo label="Tipo de pérdida">
                <select className={INPUT} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value as Parada['tipo'] })}>
                  {['Disponibilidad', 'Rendimiento', 'Calidad', 'Operativa'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Campo>
              <Campo label="Duración (min)">
                <input className={INPUT} type="number" min={1} value={form.duracionMin} onChange={e => setForm({ ...form, duracionMin: Number(e.target.value) })} />
              </Campo>
            </div>
            <Campo label="Motivo">
              <input className={INPUT} value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} placeholder="Ej. Falla en quemador..." />
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} disabled={!form.motivo.trim()} onClick={registrar}>Registrar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-27. Dependencias y bloqueos */
function BloquePRD27() {
  const { mensaje, notificar } = useMensaje();
  const [ots, setOts] = useState<OrdenTrabajo[]>(ORDENES_TRABAJO);

  const efectivo = (ot: OrdenTrabajo): 'bloqueada' | 'desbloqueada' => {
    if (!ot.bloqueadaPor) return 'desbloqueada';
    const pre = ots.find(x => x.id === ot.bloqueadaPor);
    return pre?.estado === 'hecha' ? 'desbloqueada' : 'bloqueada';
  };

  function verificar() {
    const nuevas = ots.filter(ot => ot.bloqueadaPor && efectivo(ot) === 'desbloqueada' && ot.estado === 'bloqueada').length;
    setOts(prev =>
      prev.map(ot =>
        ot.bloqueadaPor && efectivo(ot) === 'desbloqueada' && ot.estado === 'bloqueada' ? { ...ot, estado: 'por hacer' } : ot,
      ),
    );
    notificar(`Verificación de dependencias: ${nuevas} orden(es) de trabajo desbloqueada(s) automáticamente al terminar su predecesora.`);
  }

  return (
    <FunctionBlock code="PRD-27">
      <Toolbar>
        <span className="text-xs text-gray-500">Una OT permanece bloqueada hasta que su predecesora termine</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={verificar}>Verificar desbloqueos</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Al completar una operación, sus sucesoras se desbloquean automáticamente respetando la secuencia.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>OT</Th>
              <Th>Operación</Th>
              <Th>Predecesora</Th>
              <Th align="center">Estado predecesora</Th>
              <Th align="center">Estado OT</Th>
              <Th align="center">Bloqueo</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ots.map(o => {
              const pre = ots.find(x => x.id === o.bloqueadaPor);
              return (
                <tr key={o.id} className="hoverable">
                  <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                  <Td>{NOMBRES_OPERACION[o.operacion] ?? o.operacion}</Td>
                  <Td>{o.bloqueadaPor ? <span className="font-mono text-gray-500">{o.bloqueadaPor}</span> : '—'}</Td>
                  <Td align="center">
                    {pre ? <StatusBadge label={pre.estado} tone={TONO_OT[pre.estado]} /> : '—'}
                  </Td>
                  <Td align="center"><StatusBadge label={o.estado} tone={TONO_OT[o.estado]} /></Td>
                  <Td align="center">
                    {o.bloqueadaPor ? (
                      <StatusBadge label={efectivo(o) === 'desbloqueada' ? 'Desbloqueada (automática)' : 'Bloqueada'} tone={efectivo(o) === 'desbloqueada' ? 'green' : 'red'} />
                    ) : (
                      <StatusBadge label="Sin dependencia" tone="gray" />
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-28. Centros alternativos */
function BloquePRD28() {
  const { mensaje, notificar } = useMensaje();
  const [ots, setOts] = useState<OrdenTrabajo[]>(ORDENES_TRABAJO);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ otId: 'OT-3006', nuevoCentroId: 'CT-004' });

  function sustituir() {
    const ot = ots.find(x => x.id === form.otId);
    if (!ot) return;
    setOts(prev => prev.map(x => (x.id === form.otId ? { ...x, centroId: form.nuevoCentroId } : x)));
    setModal(false);
    notificar(`${form.otId} trasladada de ${nombreCentro(ot.centroId)} a ${nombreCentro(form.nuevoCentroId)} por saturación/mantenimiento (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-28">
      <Toolbar>
        <span className="text-xs text-gray-500">Sustitución de centro por saturación, mantenimiento o avería</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => setModal(true)}>Sustituir centro</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="La sustitución conserva los tiempos y tarifas del centro destino; el cambio queda trazado en la OT.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Centro</Th>
              <Th>Alternativas habilitadas</Th>
              <Th align="center">Estado</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {CENTROS_ALTERNATIVOS.map(ca => (
              <tr key={ca.centroId} className="hoverable">
                <Td>{nombreCentro(ca.centroId)}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    {ca.alternativas.map(a => (
                      <StatusBadge key={a} label={`${a} · ${nombreCentro(a)}`} tone="petroleum" />
                    ))}
                  </div>
                </Td>
                <Td align="center"><StatusBadge label="Disponible" tone="green" /></Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Sustituir centro de una OT" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <Campo label="Orden de trabajo">
              <select className={INPUT} value={form.otId} onChange={e => setForm({ ...form, otId: e.target.value })}>
                {ots.map(o => <option key={o.id} value={o.id}>{o.id} · {nombreCentro(o.centroId)}</option>)}
              </select>
            </Campo>
            <Campo label="Centro alternativo">
              <select className={INPUT} value={form.nuevoCentroId} onChange={e => setForm({ ...form, nuevoCentroId: e.target.value })}>
                {CENTROS.filter(c => c.activo).map(c => <option key={c.id} value={c.id}>{c.id} · {c.nombre}</option>)}
              </select>
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={sustituir}>Sustituir</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function OperacionesTab() {
  return (
    <div className="space-y-4">
      <BloquePRD22 />
      <BloquePRD23 />
      <BloquePRD24 />
      <BloquePRD25 />
      <BloquePRD26 />
      <BloquePRD27 />
      <BloquePRD28 />
    </div>
  );
}

/* --------------------------- Planificación (PRD-29..32) -------------------- */

const DIAS_SEMANA = [
  { etiqueta: 'Lun 26', fecha: '2026-10-26' },
  { etiqueta: 'Mar 27', fecha: '2026-10-27' },
  { etiqueta: 'Mié 28', fecha: '2026-10-28' },
  { etiqueta: 'Jue 29', fecha: '2026-10-29' },
  { etiqueta: 'Vie 30', fecha: '2026-10-30' },
  { etiqueta: 'Sáb 31', fecha: '2026-10-31' },
  { etiqueta: 'Dom 01', fecha: '2026-11-01' },
];

/** PRD-29. Fechas y calendario */
function BloquePRD29() {
  const { mensaje, notificar } = useMensaje();
  const [ordenes, setOrdenes] = useState<OrdenFabricacion[]>(ORDENES);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ofId: 'OF-1044', fechaInicio: '2026-10-29' });

  const retrasada = (o: OrdenFabricacion) => o.fechaLimite < '2026-10-28' && o.estado !== 'cerrada' && o.estado !== 'cancelada';

  function reprogramar() {
    setOrdenes(prev => prev.map(o => (o.id === form.ofId ? { ...o, fechaInicio: form.fechaInicio } : o)));
    setModal(false);
    notificar(`${form.ofId} reprogramada para iniciar el ${fmtFecha(form.fechaInicio)} (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-29">
      <Toolbar>
        <span className="text-xs text-gray-500">Semana 44 · Oct 26 – Nov 01 · {ordenes.filter(retrasada).length} órdenes retrasadas</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => setModal(true)}>Reprogramar orden</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3 grid grid-cols-7 gap-2">
        {DIAS_SEMANA.map(d => (
          <div key={d.fecha} className="min-h-24 rounded border border-gray-200 bg-white p-2">
            <div className="text-[10px] font-semibold uppercase text-gray-400">{d.etiqueta}</div>
            <div className="mt-1 space-y-1">
              {ordenes.filter(o => o.fechaInicio === d.fecha).map(o => (
                <div key={o.id} className="rounded bg-petroleum-50 px-1.5 py-1 text-[10px] font-medium text-petroleum-700">
                  {o.id} · {fmtNum(o.cantidad)}
                </div>
              ))}
              {ordenes.filter(o => o.fechaInicio === d.fecha).length === 0 && <div className="text-[10px] text-gray-300">—</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <DataTable footer="Las órdenes se programan con inicio, fin y fecha límite; los retrasos generan alerta al planificador.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Producto</Th>
              <Th align="center">Inicio</Th>
              <Th align="center">Límite</Th>
              <Th align="center">Estado</Th>
              <Th align="center">Alerta</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ordenes.map(o => (
              <tr key={o.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                <Td>{nombreProducto(o.productoId)}</Td>
                <Td align="center" className="font-mono text-gray-600">{o.fechaInicio ? fmtFecha(o.fechaInicio) : '—'}</Td>
                <Td align="center" className="font-mono text-gray-600">{fmtFecha(o.fechaLimite)}</Td>
                <Td align="center"><StatusBadge label={ETIQUETA_ESTADO_OF[o.estado]} tone={TONO_ESTADO_OF[o.estado]} /></Td>
                <Td align="center">
                  {retrasada(o) ? <StatusBadge label="Retrasada" tone="red" /> : <StatusBadge label="A tiempo" tone="green" />}
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Reprogramar orden" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <Campo label="Orden">
              <select className={INPUT} value={form.ofId} onChange={e => setForm({ ...form, ofId: e.target.value })}>
                {ordenes.map(o => <option key={o.id} value={o.id}>{o.id} · {nombreProducto(o.productoId)}</option>)}
              </select>
            </Campo>
            <Campo label="Nueva fecha de inicio">
              <input className={INPUT} type="date" value={form.fechaInicio} onChange={e => setForm({ ...form, fechaInicio: e.target.value })} />
            </Campo>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={reprogramar}>Reprogramar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-30. Planificación de capacidad */
function BloquePRD30() {
  const { mensaje, notificar } = useMensaje();
  const listas = ORDENES.filter(o => o.lista === 'Lista' && (o.estado === 'confirmada' || o.estado === 'en_progreso')).length;
  const enProgreso = ORDENES.filter(o => o.estado === 'en_progreso').length;
  const bloqueadas = ORDENES.filter(o => o.lista === 'Bloqueada' || o.bloqueada).length;
  const retrasadas = ORDENES.filter(o => o.fechaLimite < '2026-10-28' && o.estado !== 'cerrada' && o.estado !== 'cancelada').length;

  return (
    <FunctionBlock code="PRD-30">
      <Toolbar>
        <span className="text-xs text-gray-500">Carga por centro de trabajo · semana 44</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => notificar('Programación ajustada: las órdenes retrasadas se priorizaron en el turno de la tarde (simulado).')}>
          Ajustar programación
        </button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Órdenes listas" value={fmtNum(listas)} sub="Con material y operación" tone="ok" />
        <StatCard label="En progreso" value={fmtNum(enProgreso)} sub="Ejecución en planta" tone="info" />
        <StatCard label="Bloqueadas" value={fmtNum(bloqueadas)} sub="Por material o autorización" tone="warn" />
        <StatCard label="Retrasadas" value={fmtNum(retrasadas)} sub="Pasaron su fecha límite" tone="danger" />
      </div>
      <div className="mt-3">
        <DataTable footer="Carga = horas de OT programadas sobre la capacidad del calendario del centro.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Centro</Th>
              <Th align="right">Horas OT</Th>
              <Th align="right">Capacidad</Th>
              <Th>Carga</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {CENTROS.filter(c => c.activo).map(c => {
              const horas = ORDENES_TRABAJO.filter(o => o.centroId === c.id).reduce((a, o) => a + o.duracionEsperadaMin / 60, 0);
              const pct = Math.min(100, (horas / c.capacidadDia) * 100);
              return (
                <tr key={c.id} className="hoverable">
                  <Td>
                    <span className="font-mono text-petroleum-600">{c.id}</span>
                    <span className="ml-1.5">{c.nombre}</span>
                  </Td>
                  <Td align="right" className="font-mono">{fmtNum(horas)} h</Td>
                  <Td align="right" className="font-mono">{fmtNum(c.capacidadDia)} h/día</Td>
                  <Td>
                    <div className="h-2 w-full overflow-hidden rounded bg-gray-100">
                      <div
                        className={`h-full rounded ${pct > 90 ? 'bg-red-400' : pct > 70 ? 'bg-amber-400' : 'bg-petroleum-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-0.5 text-[10px] text-gray-400">{fmtPct(pct / 100, 0)} de capacidad</div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-31. Necesidades de componentes */
function BloquePRD31() {
  const { mensaje, notificar } = useMensaje();

  return (
    <FunctionBlock code="PRD-31">
      <Toolbar>
        <span className="text-xs text-gray-500">Faltantes de componentes con fecha esperada de llegada y acción sugerida</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="El MRP calcula faltantes contra las necesidades de las órdenes confirmadas y propone comprar o fabricar.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Componente</Th>
              <Th align="right">Requerido</Th>
              <Th align="right">Disponible</Th>
              <Th align="right">Faltante</Th>
              <Th align="center">Fecha esperada</Th>
              <Th align="center">Acción</Th>
              <Th align="center">Acción UI</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {FALTANTES.map(f => (
              <tr key={f.productoId} className="hoverable">
                <Td>
                  <span className="font-mono text-gray-500">{f.productoId}</span>
                  <span className="ml-1.5">{nombreProducto(f.productoId)}</span>
                </Td>
                <Td align="right" className="font-mono">{fmtNum(f.requerido)}</Td>
                <Td align="right" className="font-mono">{fmtNum(f.disponible)}</Td>
                <Td align="right">
                  {f.faltante > 0 ? (
                    <StatusBadge label={fmtNum(f.faltante)} tone="red" />
                  ) : (
                    <StatusBadge label="Cubierto" tone="green" />
                  )}
                </Td>
                <Td align="center" className="font-mono text-gray-600">{f.faltante > 0 ? fmtFecha(f.fechaEsperada) : '—'}</Td>
                <Td align="center"><StatusBadge label={f.accion} tone={f.accion === 'Fabricar' ? 'blue' : 'gray'} /></Td>
                <Td align="center">
                  {f.faltante > 0 && (
                    <button className={BTN_SECONDARY} onClick={() => notificar(`Acción generada para ${nombreProducto(f.productoId)}: ${f.accion === 'Comprar' ? 'orden de compra' : 'orden de fabricación'} por ${fmtNum(f.faltante)} ${umProducto(f.productoId)} con fecha esperada ${fmtFecha(f.fechaEsperada)}.`)}>
                      Generar acción
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-32. Reabastecimiento */
function BloquePRD32() {
  const { mensaje, notificar } = useMensaje();

  return (
    <FunctionBlock code="PRD-32">
      <Toolbar>
        <span className="text-xs text-gray-500">Sugerencias de reabastecimiento según puntos de pedido, rutas y prioridades</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Las sugerencias se convierten en órdenes de compra o de fabricación conservando el vínculo con la necesidad.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Producto</Th>
              <Th align="right">Punto de pedido</Th>
              <Th align="right">Stock actual</Th>
              <Th align="right">Sugerido</Th>
              <Th align="center">Ruta</Th>
              <Th align="center">Prioridad</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {FALTANTES.map(f => (
              <tr key={f.productoId} className="hoverable">
                <Td>{nombreProducto(f.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(f.puntoPedido)}</Td>
                <Td align="right" className="font-mono">{fmtNum(f.disponible)}</Td>
                <Td align="right" className="font-mono">{fmtNum(Math.max(0, f.faltante))}</Td>
                <Td align="center"><StatusBadge label={f.accion === 'Comprar' ? 'Compra' : 'Fabricación'} tone={f.accion === 'Fabricar' ? 'blue' : 'gray'} /></Td>
                <Td align="center">
                  <StatusBadge label={f.prioridad} tone={f.prioridad === 'Alta' ? 'red' : f.prioridad === 'Media' ? 'amber' : 'green'} />
                </Td>
                <Td align="center">
                  <button
                    className={BTN_PRIMARY}
                    onClick={() => notificar(`${f.accion === 'Comprar' ? 'OC' : 'OF'} creada para ${nombreProducto(f.productoId)} por ${fmtNum(Math.max(0, f.faltante))} ${umProducto(f.productoId)} (prioridad ${f.prioridad.toLowerCase()}).`)}
                  >
                    Crear {f.accion === 'Comprar' ? 'OC' : 'OF'}
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

function PlanificacionTab() {
  return (
    <div className="space-y-4">
      <BloquePRD29 />
      <BloquePRD30 />
      <BloquePRD31 />
      <BloquePRD32 />
    </div>
  );
}

/* ------------------------------ Costeo (PRD-33..36) ------------------------ */

/** PRD-33. Costo de la orden */
function BloquePRD33() {
  const { mensaje, notificar } = useMensaje();
  const total = COSTOS_OF.reduce((a, c) => a + c.total, 0);

  return (
    <FunctionBlock code="PRD-33">
      <Toolbar>
        <span className="text-xs text-gray-500">Materiales + operaciones + adicionales − subproductos = costo de la orden</span>
        <button className={`${BTN_GHOST} ml-auto`} onClick={() => notificar(`Costos recalculados: total ${fmtMoney(total)} en ${COSTOS_OF.length} órdenes (simulado).`)}>
          Recalcular
        </button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="El valor del producto terminado se registra al cierre con el costo consolidado de la orden.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th align="right">Materiales</Th>
              <Th align="right">Operaciones</Th>
              <Th align="right">Adicionales</Th>
              <Th align="right">− Subproductos</Th>
              <Th align="right">Total</Th>
              <Th align="right">Costo unitario</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {COSTOS_OF.map(c => (
              <tr key={c.ofId} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{c.ofId}</span></Td>
                <Td align="right" className="font-mono">{fmtMoney(c.materiales)}</Td>
                <Td align="right" className="font-mono">{fmtMoney(c.operaciones)}</Td>
                <Td align="right" className="font-mono">{c.adicionales ? fmtMoney(c.adicionales) : '—'}</Td>
                <Td align="right" className="font-mono">{c.creditoSubproductos ? `− ${fmtMoney(c.creditoSubproductos)}` : '—'}</Td>
                <Td align="right" className="font-mono font-semibold text-petroleum-700">{fmtMoney(c.total)}</Td>
                <Td align="right" className="font-mono">{c.costoUnitario ? fmtMoney(c.costoUnitario) : '—'}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-34. Costo de operaciones */
function BloquePRD34() {
  const { mensaje, notificar } = useMensaje();
  const filas = ORDENES_TRABAJO.map(o => {
    const centro = CENTROS_POR_ID.get(o.centroId);
    const tarifa = centro?.costoHora ?? 0;
    const realMin = o.duracionRealMin ?? o.duracionEsperadaMin;
    return {
      ...o,
      tarifa,
      valorReal: (realMin / 60) * tarifa,
      valorEstimado: (o.duracionEsperadaMin / 60) * tarifa,
    };
  });
  const totalReal = filas.reduce((a, f) => a + f.valorReal, 0);

  return (
    <FunctionBlock code="PRD-34">
      <Toolbar>
        <span className="text-xs text-gray-500">El tiempo real o estimado de cada operación se valoriza con la tarifa del centro</span>
        <button className={`${BTN_GHOST} ml-auto`} onClick={() => notificar(`Operaciones valorizadas: ${fmtMoney(totalReal)} en total (simulado).`)}>
          Valorizar
        </button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="El costo de operaciones se imputa a la orden según la tarifa por hora del centro donde se ejecuta.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>OT</Th>
              <Th>Operación</Th>
              <Th>Centro</Th>
              <Th align="right">Tarifa/h</Th>
              <Th align="right">Tiempo real</Th>
              <Th align="right">Tiempo estimado</Th>
              <Th align="right">Valor real</Th>
              <Th align="right">Valor estimado</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filas.map(f => (
              <tr key={f.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{f.id}</span></Td>
                <Td>{NOMBRES_OPERACION[f.operacion] ?? f.operacion}</Td>
                <Td>{nombreCentro(f.centroId)}</Td>
                <Td align="right" className="font-mono">{fmtMoney(f.tarifa)}</Td>
                <Td align="right" className="font-mono">{fmtNum(f.duracionRealMin ?? f.duracionEsperadaMin)} min</Td>
                <Td align="right" className="font-mono">{fmtNum(f.duracionEsperadaMin)} min</Td>
                <Td align="right" className="font-mono">{fmtMoney(f.valorReal)}</Td>
                <Td align="right" className="font-mono">{fmtMoney(f.valorEstimado)}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-35. Distribución analítica */
function BloquePRD35() {
  const { mensaje, notificar } = useMensaje();
  const [imputaciones, setImputaciones] = useState<Record<string, { centro: string; proyecto: string; cuenta: string }>>(
    Object.fromEntries(ORDENES.map(o => [o.id, { centro: 'OPE-01 · Producción panadería', proyecto: 'P-101 · Panadería', cuenta: '7105-01' }])),
  );

  function guardar(ofId: string) {
    const i = imputaciones[ofId];
    notificar(`${ofId}: imputación guardada → centro ${i.centro.split(' · ')[0]}, proyecto ${i.proyecto.split(' · ')[0]}, cuenta ${i.cuenta} (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-35">
      <Toolbar>
        <span className="text-xs text-gray-500">Imputación de costos a centros de costo, proyectos y cuentas analíticas</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="La distribución analítica alimenta la contabilidad de costos y la valoración por proyecto.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th>Centro de costo</Th>
              <Th>Proyecto</Th>
              <Th>Cuenta analítica</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ORDENES.filter(o => o.estado !== 'cancelada').map(o => (
              <tr key={o.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{o.id}</span></Td>
                <Td>
                  <select
                    className="min-w-0 w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                    value={imputaciones[o.id].centro}
                    onChange={e => setImputaciones(prev => ({ ...prev, [o.id]: { ...prev[o.id], centro: e.target.value } }))}
                  >
                    {['OPE-01 · Producción panadería', 'OPE-02 · Repostería', 'ADM · Administración', 'COM · Comercial'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Td>
                <Td>
                  <select
                    className="min-w-0 w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                    value={imputaciones[o.id].proyecto}
                    onChange={e => setImputaciones(prev => ({ ...prev, [o.id]: { ...prev[o.id], proyecto: e.target.value } }))}
                  >
                    {['P-101 · Panadería', 'P-102 · Repostería', 'P-103 · Galletas'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Td>
                <Td>
                  <input
                    className={INPUT}
                    value={imputaciones[o.id].cuenta}
                    onChange={e => setImputaciones(prev => ({ ...prev, [o.id]: { ...prev[o.id], cuenta: e.target.value } }))}
                  />
                </Td>
                <Td align="center">
                  <button className={BTN_SECONDARY} onClick={() => guardar(o.id)}>Guardar</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/** PRD-36. Producción en proceso (WIP) */
function BloquePRD36() {
  const { mensaje, notificar } = useMensaje();
  const wips = COSTOS_OF.filter(c => c.wip > 0);
  const total = wips.reduce((a, c) => a + c.wip, 0);

  return (
    <FunctionBlock code="PRD-36">
      <Toolbar>
        <span className="text-xs text-gray-500">Valor del trabajo en curso por orden · período semana 44</span>
        <button className={`${BTN_GHOST} ml-auto`} onClick={() => notificar(`WIP consolidado del período: ${fmtMoney(total)} en ${wips.length} órdenes (simulado).`)}>
          Consultar por período
        </button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="WIP total" value={fmtMoney(total)} sub={`${wips.length} órdenes en curso`} tone="warn" />
        <StatCard label="Materiales en WIP" value={fmtMoney(wips.reduce((a, c) => a + c.materiales, 0))} sub="Consumidos sin terminar" />
        <StatCard label="Operaciones en WIP" value={fmtMoney(wips.reduce((a, c) => a + c.operaciones, 0))} sub="Tiempo valorizado" />
        <StatCard label="Terminadas sin costear" value={fmtNum(ORDENES.filter(o => o.estado === 'hecha').length)} sub="Pendientes de cierre" />
      </div>
      <div className="mt-3">
        <DataTable footer="El WIP se contabiliza y puede consultarse por orden o período para la valoración contable.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th align="right">Materiales</Th>
              <Th align="right">Operaciones</Th>
              <Th align="right">WIP acumulado</Th>
              <Th align="right">% del total</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {wips.map(c => (
              <tr key={c.ofId} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{c.ofId}</span></Td>
                <Td align="right" className="font-mono">{fmtMoney(c.materiales)}</Td>
                <Td align="right" className="font-mono">{fmtMoney(c.operaciones)}</Td>
                <Td align="right" className="font-mono font-semibold">{fmtMoney(c.wip)}</Td>
                <Td align="right" className="font-mono">{fmtPct(total ? c.wip / total : 0)}</Td>
              </tr>
            ))}
            {wips.length === 0 && <EmptyRow colSpan={5} text="No hay WIP valorizado en el período." />}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

function CosteoTab() {
  return (
    <div className="space-y-4">
      <BloquePRD33 />
      <BloquePRD34 />
      <BloquePRD35 />
      <BloquePRD36 />
    </div>
  );
}

/* ------------------------- Complementarias (PRD-37..41) -------------------- */

/** PRD-37. Subcontratación */
function BloquePRD37() {
  const { mensaje, notificar } = useMensaje();
  const [subcontratos, setSubcontratos] = useState<Subcontrato[]>(SUBCONTRATOS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ proveedor: '', productoId: 'PT-001', cantidad: 100 });

  function crear() {
    const nuevo: Subcontrato = {
      id: `SC-${String(subcontratos.length + 1).padStart(3, '0')}`,
      proveedor: form.proveedor,
      productoId: form.productoId,
      cantidad: form.cantidad,
      componentesEnviados: 0,
      estado: 'Enviado',
      costo: 0,
      fechaEnvio: '2026-10-28',
      trazabilidad: true,
    };
    setSubcontratos(prev => [nuevo, ...prev]);
    setModal(false);
    notificar(`Subcontrato ${nuevo.id} creado con ${form.proveedor}: envío de componentes y recepción de terminado controlados con trazabilidad.`);
  }

  function recibir(s: Subcontrato) {
    setSubcontratos(prev => prev.map(x => (x.id === s.id ? { ...x, estado: 'Recibido', fechaRecepcion: '2026-10-28' } : x)));
    notificar(`${s.id}: ${fmtNum(s.cantidad)} ${umProducto(s.productoId)} de ${nombreProducto(s.productoId)} recibidos del subcontratista; stock y costos actualizados (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-37">
      <Toolbar>
        <span className="text-xs text-gray-500">{subcontratos.length} subcontratos · fabricación delegada total o parcial</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => setModal(true)}>+ Nuevo subcontrato</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="Se envían componentes al subcontratista, se recibe el producto terminado y se controlan costos y trazabilidad.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Subcontrato</Th>
              <Th>Proveedor</Th>
              <Th>Producto</Th>
              <Th align="right">Cantidad</Th>
              <Th align="right">Componentes enviados</Th>
              <Th align="center">Estado</Th>
              <Th align="center">Trazabilidad</Th>
              <Th align="center">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subcontratos.map(s => (
              <tr key={s.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{s.id}</span></Td>
                <Td>{s.proveedor}</Td>
                <Td>{nombreProducto(s.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(s.cantidad)} {umProducto(s.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(s.componentesEnviados)}</Td>
                <Td align="center">
                  <StatusBadge label={s.estado} tone={s.estado === 'Recibido' ? 'green' : s.estado === 'Facturado' ? 'blue' : s.estado === 'En proceso' ? 'petroleum' : 'amber'} />
                </Td>
                <Td align="center"><StatusBadge label={s.trazabilidad ? 'Lote a lote' : 'Solo costo'} tone={s.trazabilidad ? 'green' : 'gray'} /></Td>
                <Td align="center">
                  {(s.estado === 'Enviado' || s.estado === 'En proceso') && (
                    <button className={BTN_SECONDARY} onClick={() => recibir(s)}>Registrar recepción</button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Nuevo subcontrato" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <Campo label="Proveedor subcontratista">
              <input className={INPUT} value={form.proveedor} onChange={e => setForm({ ...form, proveedor: e.target.value })} placeholder="Ej. Panificadora El Trigo SAS" />
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Producto terminado">
                <select className={INPUT} value={form.productoId} onChange={e => setForm({ ...form, productoId: e.target.value })}>
                  {PRODUCTOS.filter(p => p.tipo === 'Terminado').map(p => <option key={p.id} value={p.id}>{p.id} · {p.nombre}</option>)}
                </select>
              </Campo>
              <Campo label="Cantidad">
                <input className={INPUT} type="number" min={1} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })} />
              </Campo>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} disabled={!form.proveedor.trim()} onClick={crear}>Crear subcontrato</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-38. Reparación */
function BloquePRD38() {
  const { mensaje, notificar } = useMensaje();
  const [reparaciones, setReparaciones] = useState<Reparacion[]>(REPARACIONES);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ productoId: 'PT-002', lote: '', piezas: '', servicios: 1, costo: 0, ofId: '' });

  function crear() {
    const nueva: Reparacion = {
      id: `RE-${String(reparaciones.length + 1).padStart(3, '0')}`,
      productoId: form.productoId,
      lote: form.lote,
      piezas: form.piezas,
      servicios: form.servicios,
      costo: form.costo,
      estado: 'Diagnóstico',
      ofId: form.ofId || undefined,
    };
    setReparaciones(prev => [nueva, ...prev]);
    setModal(false);
    notificar(`Orden de reparación ${nueva.id} creada para ${nombreProducto(form.productoId)} (lote ${form.lote}); movimientos de stock y facturación vinculados.`);
  }

  return (
    <FunctionBlock code="PRD-38">
      <Toolbar>
        <span className="text-xs text-gray-500">{reparaciones.length} reparaciones con producto, lote, piezas y servicios</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => setModal(true)}>+ Nueva reparación</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="La reparación genera movimientos de stock de piezas, facturación del servicio y vínculo con la orden de producción.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Reparación</Th>
              <Th>Producto</Th>
              <Th align="center">Lote</Th>
              <Th>Piezas</Th>
              <Th align="right">Servicios</Th>
              <Th align="right">Costo</Th>
              <Th align="center">Estado</Th>
              <Th align="center">Vínculo OF</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reparaciones.map(r => (
              <tr key={r.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{r.id}</span></Td>
                <Td>{nombreProducto(r.productoId)}</Td>
                <Td align="center"><span className="font-mono text-gray-600">{r.lote}</span></Td>
                <Td className="text-gray-600">{r.piezas}</Td>
                <Td align="right" className="font-mono">{fmtNum(r.servicios)}</Td>
                <Td align="right" className="font-mono">{fmtMoney(r.costo)}</Td>
                <Td align="center">
                  <StatusBadge label={r.estado} tone={r.estado === 'Facturada' ? 'blue' : r.estado === 'Terminada' ? 'green' : r.estado === 'En reparación' ? 'petroleum' : 'amber'} />
                </Td>
                <Td align="center">{r.ofId ? <span className="font-mono text-gray-600">{r.ofId}</span> : '—'}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Nueva orden de reparación" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Producto">
                <select className={INPUT} value={form.productoId} onChange={e => setForm({ ...form, productoId: e.target.value })}>
                  {PRODUCTOS.filter(p => p.tipo === 'Terminado').map(p => <option key={p.id} value={p.id}>{p.id} · {p.nombre}</option>)}
                </select>
              </Campo>
              <Campo label="Lote o serie">
                <input className={INPUT} value={form.lote} onChange={e => setForm({ ...form, lote: e.target.value })} placeholder="L-2026-xxx" />
              </Campo>
              <Campo label="Piezas a reemplazar">
                <input className={INPUT} value={form.piezas} onChange={e => setForm({ ...form, piezas: e.target.value })} placeholder="Ej. Cobertura chocolate" />
              </Campo>
              <Campo label="Costo ($)">
                <input className={INPUT} type="number" min={0} value={form.costo} onChange={e => setForm({ ...form, costo: Number(e.target.value) })} />
              </Campo>
              <Campo label="Servicios">
                <input className={INPUT} type="number" min={0} value={form.servicios} onChange={e => setForm({ ...form, servicios: Number(e.target.value) })} />
              </Campo>
              <Campo label="OF relacionada (opcional)">
                <select className={INPUT} value={form.ofId} onChange={e => setForm({ ...form, ofId: e.target.value })}>
                  <option value="">Sin vínculo</option>
                  {ORDENES.map(o => <option key={o.id} value={o.id}>{o.id}</option>)}
                </select>
              </Campo>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} disabled={!form.lote.trim()} onClick={crear}>Crear reparación</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-39. Compras para producción */
function BloquePRD39() {
  const { mensaje, notificar } = useMensaje();
  const [compras, setCompras] = useState<CompraProduccion[]>(COMPRAS_PRODUCCION);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ofId: 'OF-1044', productoId: 'MP-002', proveedor: 'Ingredientes del Valle', cantidad: 50 });

  function vincular() {
    const nueva: CompraProduccion = {
      id: `CP-${String(compras.length + 1).padStart(3, '0')}`,
      ofId: form.ofId,
      proveedor: form.proveedor,
      productoId: form.productoId,
      cantidad: form.cantidad,
      estado: 'Pedida',
      fechaPedido: '2026-10-28',
      costo: form.cantidad * (PRODUCTOS_POR_ID.get(form.productoId)?.costoEstandar ?? 0),
    };
    setCompras(prev => [nueva, ...prev]);
    setModal(false);
    notificar(`Compra ${nueva.id} vinculada a ${form.ofId}: necesidad → compra → consumo trazados (simulado).`);
  }

  return (
    <FunctionBlock code="PRD-39">
      <Toolbar>
        <span className="text-xs text-gray-500">Componentes y kits comprados para una orden, con vínculo necesidad → compra → consumo</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={() => setModal(true)}>+ Vincular compra</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3">
        <DataTable footer="El consumo de la orden reconoce la compra vinculada y cierra el ciclo del componente.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Compra</Th>
              <Th>Orden</Th>
              <Th>Proveedor</Th>
              <Th>Producto</Th>
              <Th align="right">Cantidad</Th>
              <Th align="right">Costo</Th>
              <Th align="center">Estado</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {compras.map(c => (
              <tr key={c.id} className="hoverable">
                <Td><span className="font-mono text-petroleum-600">{c.id}</span></Td>
                <Td><span className="font-mono text-gray-600">{c.ofId}</span></Td>
                <Td>{c.proveedor}</Td>
                <Td>{nombreProducto(c.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtNum(c.cantidad)} {umProducto(c.productoId)}</Td>
                <Td align="right" className="font-mono">{fmtMoney(c.costo)}</Td>
                <Td align="center">
                  <StatusBadge label={c.estado} tone={c.estado === 'Consumida' ? 'green' : c.estado === 'Recibida' ? 'blue' : 'amber'} />
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
      {modal && (
        <Modal title="Vincular compra a producción" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Orden de fabricación">
                <select className={INPUT} value={form.ofId} onChange={e => setForm({ ...form, ofId: e.target.value })}>
                  {ORDENES.filter(o => o.estado !== 'cerrada' && o.estado !== 'cancelada').map(o => <option key={o.id} value={o.id}>{o.id}</option>)}
                </select>
              </Campo>
              <Campo label="Componente">
                <select className={INPUT} value={form.productoId} onChange={e => setForm({ ...form, productoId: e.target.value })}>
                  {PRODUCTOS.filter(p => p.tipo === 'Materia prima' || p.tipo === 'Kit').map(p => <option key={p.id} value={p.id}>{p.id} · {p.nombre}</option>)}
                </select>
              </Campo>
              <Campo label="Proveedor">
                <input className={INPUT} value={form.proveedor} onChange={e => setForm({ ...form, proveedor: e.target.value })} />
              </Campo>
              <Campo label="Cantidad">
                <input className={INPUT} type="number" min={1} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })} />
              </Campo>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button className={BTN_PRIMARY} onClick={vincular}>Vincular compra</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/** PRD-40. Reportes de producción */
function BloquePRD40() {
  const { mensaje, notificar } = useMensaje();

  return (
    <FunctionBlock code="PRD-40">
      <Toolbar>
        <span className="text-xs text-gray-500">{REPORTES_PRD.length} reportes disponibles · generación simulada</span>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {REPORTES_PRD.map(r => (
          <div key={r.id} className="flex flex-col justify-between rounded border border-gray-200 bg-white p-3">
            <div>
              <div className="text-xs font-semibold text-gray-800">{r.nombre}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{r.descripcion}</p>
            </div>
            <button className={`${BTN_SECONDARY} mt-3 w-full`} onClick={() => notificar(`Reporte «${r.nombre}» generado (simulado).`)}>
              Generar
            </button>
          </div>
        ))}
      </div>
    </FunctionBlock>
  );
}

/** PRD-41. Configuración */
function BloquePRD41() {
  const { mensaje, notificar } = useMensaje();
  const [config, setConfig] = useState<ConfiguracionPRD>({ ...CONFIGURACION_INICIAL });

  const opciones: { clave: keyof ConfiguracionPRD; label: string; detalle: string }[] = [
    { clave: 'ordenesTrabajo', label: 'Órdenes de trabajo por operación', detalle: 'Genera una OT por operación asignada a centro y responsable.' },
    { clave: 'subproductos', label: 'Subproductos', detalle: 'Registra productos adicionales con participación en el costo.' },
    { clave: 'desbloqueoCantidades', label: 'Desbloqueo de cantidades', detalle: 'Permite modificar cantidades de órdenes en ejecución con autorización.' },
    { clave: 'subcontratacion', label: 'Subcontratación', detalle: 'Habilita delegar fabricación total o parcial a terceros.' },
    { clave: 'mpsMrp', label: 'Planificación (MPS/MRP)', detalle: 'Activa el cálculo de necesidades y la programación maestra.' },
    { clave: 'costeoEstandar', label: 'Costeo estándar', detalle: 'Valoriza con costo estándar en lugar de costo real.' },
  ];

  function guardar() {
    notificar('Configuración del módulo de producción actualizada (simulado).');
  }

  return (
    <FunctionBlock code="PRD-41">
      <Toolbar>
        <span className="text-xs text-gray-500">Parámetros del módulo: órdenes de trabajo, subproductos, cantidades, subcontratación, planificación y costeo</span>
        <button className={`${BTN_PRIMARY} ml-auto`} onClick={guardar}>Guardar configuración</button>
      </Toolbar>
      {mensaje && <div className="mt-3"><Msg texto={mensaje} /></div>}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {opciones.map(o => (
          <button
            key={o.clave}
            type="button"
            onClick={() => setConfig(prev => ({ ...prev, [o.clave]: !prev[o.clave] }))}
            className="flex items-start justify-between gap-3 rounded border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50"
          >
            <span>
              <span className="block text-xs font-medium text-gray-800">{o.label}</span>
              <span className="mt-0.5 block text-[11px] text-gray-500">{o.detalle}</span>
            </span>
            <span className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition ${config[o.clave] ? 'bg-petroleum-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${config[o.clave] ? 'left-4.5' : 'left-0.5'}`} />
            </span>
          </button>
        ))}
      </div>
    </FunctionBlock>
  );
}

function ComplementariasTab() {
  return (
    <div className="space-y-4">
      <BloquePRD37 />
      <BloquePRD38 />
      <BloquePRD39 />
      <BloquePRD40 />
      <BloquePRD41 />
    </div>
  );
}

/* --------------------------------- Página --------------------------------- */

export default function PRD() {
  const [tab, setTab] = useState('resumen');

  const tabs: TabDef[] = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'ingenieria', label: 'Ingeniería de producto', badge: 9 },
    { id: 'ordenes', label: 'Órdenes de fabricación', badge: 12 },
    { id: 'operaciones', label: 'Operaciones y centros', badge: 7 },
    { id: 'planificacion', label: 'Planificación', badge: 4 },
    { id: 'costeo', label: 'Costeo', badge: 4 },
    { id: 'complementarias', label: 'Complementarias', badge: 5 },
  ];

  const enCurso = ORDENES.filter(o => o.estado === 'confirmada' || o.estado === 'en_progreso').length;
  const producidas = ORDENES.reduce((a, o) => a + o.producida, 0);
  const planTotal = ORDENES.reduce((a, o) => a + o.cantidad, 0);
  const centrosActivos = CENTROS.filter(c => c.activo).length;
  const horasDia = CENTROS.reduce((a, c) => a + (c.activo ? c.capacidadDia : 0), 0);
  const wip = COSTOS_OF.reduce((a, c) => a + c.wip, 0);

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('prd')} funcionalidades · Fase ${MOD.fase}`}
        actions={<button className={BTN_PRIMARY} onClick={() => setTab('ordenes')}>+ Nueva orden</button>}
      />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Órdenes en curso"
          value={fmtNum(enCurso)}
          sub={`${ORDENES.filter(o => o.estado === 'borrador').length} en borrador · ${ORDENES.filter(o => o.estado === 'en_progreso').length} en progreso`}
          tone="info"
        />
        <StatCard
          label="Producción del período"
          value={fmtNum(producidas)}
          sub={`${fmtPct(planTotal ? producidas / planTotal : 0, 0)} del plan total (${fmtNum(planTotal)})`}
          tone="ok"
        />
        <StatCard label="Centros activos" value={fmtNum(centrosActivos)} sub={`${CENTROS.length} definidos · ${fmtNum(horasDia)} h/día de capacidad`} />
        <StatCard label="Valor WIP" value={fmtMoney(wip)} sub={`${COSTOS_OF.filter(c => c.wip > 0).length} órdenes valorizadas`} tone="warn" />
      </div>
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === 'resumen' && <ResumenTab />}
      {tab === 'ingenieria' && <IngenieriaTab />}
      {tab === 'ordenes' && <OrdenesTab />}
      {tab === 'operaciones' && <OperacionesTab />}
      {tab === 'planificacion' && <PlanificacionTab />}
      {tab === 'costeo' && <CosteoTab />}
      {tab === 'complementarias' && <ComplementariasTab />}
    </div>
  );
}

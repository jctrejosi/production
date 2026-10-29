import { useMemo, useState } from 'react';
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
  BTN_GHOST,
} from '../components/ui';
import { MODULOS, conteoModulo } from '../data/modules';
import { fmtNum, fmtPct, fmtFecha } from '../lib/format';
import {
  PERIODOS_MPS,
  ITEMS_MPS,
  NECESIDADES_MRP,
  CENTROS_PLA,
  CARGAS_CAPACIDAD,
  SECUENCIAS,
  ESCENARIOS,
  EXCEPCIONES_PLA,
  APROBACIONES_PLA,
  PARAMETROS_PLA,
  AUDITORIA_PLA,
  INDICADORES_PLA,
} from '../data/pla';
import type { ItemMPS, SecuenciaPLA, EscenarioPLA, ExcepcionPLA, ParametroPLA } from '../data/pla';

const MOD = MODULOS.find(m => m.id === 'pla')!;

const SELECT = 'rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-petroleum-500';
const LABEL = 'block text-[11px] font-medium text-gray-500 mb-1';

const INTEGRACIONES_PLA = [
  { id: 'comp', nombre: 'Compras', detalle: 'Necesidades y fechas de material' },
  { id: 'prod', nombre: 'Producción', detalle: 'Órdenes de producción y capacidad' },
  { id: 'mant', nombre: 'Mantenimiento', detalle: 'Disponibilidad de máquinas' },
  { id: 'vent', nombre: 'Ventas', detalle: 'Pedidos, fechas y ATP/CTP' },
  { id: 'inv', nombre: 'Inventario', detalle: 'Stock, recepciones y reservas' },
  { id: 'cost', nombre: 'Costos', detalle: 'Impacto de escenarios y utilización' },
];

export default function PLA() {
  const [tab, setTab] = useState('resumen');
  const [mensaje, setMensaje] = useState('');
  const avisar = (texto: string) => window.setTimeout(() => setMensaje(texto), 400);

  /* PLA-01 */
  const [itemsMps, setItemsMps] = useState<ItemMPS[]>(ITEMS_MPS);
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroFamilia, setFiltroFamilia] = useState('');
  const [modalItemMps, setModalItemMps] = useState(false);

  /* PLA-02 */
  const [filtroMrp, setFiltroMrp] = useState('Todos');

  /* PLA-04 */
  const [capacidadProgramada, setCapacidadProgramada] = useState(false);

  /* PLA-05 */
  const [secuencias, setSecuencias] = useState<SecuenciaPLA[]>(SECUENCIAS);

  /* PLA-06 */
  const [escenarios, setEscenarios] = useState<EscenarioPLA[]>(ESCENARIOS);
  const [modalEscenario, setModalEscenario] = useState(false);

  /* PLA-07 */
  const [eventoReplan, setEventoReplan] = useState('Retraso de material');
  const [impactos, setImpactos] = useState([
    { orden: 'OF-3210', efecto: 'Inicio reprogramado +1 día', nuevaFecha: '2026-10-29', responsable: 'Juliana Ospina' },
  ]);

  /* PLA-09 */
  const [productoAtp, setProductoAtp] = useState('Arepa de maíz x12');
  const [cantidadAtp, setCantidadAtp] = useState('500');
  const [fechaAtp, setFechaAtp] = useState('2026-11-03');
  const [modoAtp, setModoAtp] = useState<'ATP' | 'CTP'>('ATP');

  /* PLA-10 */
  const [excepciones, setExcepciones] = useState<ExcepcionPLA[]>(EXCEPCIONES_PLA);
  const [filtroExc, setFiltroExc] = useState('Todas');

  /* PLA-11 */
  const [comentario, setComentario] = useState('');

  /* PLA-14 */
  const [parametros, setParametros] = useState<ParametroPLA[]>(PARAMETROS_PLA);

  const itemsFiltrados = useMemo(
    () =>
      itemsMps.filter(
        i =>
          (!filtroPeriodo || i.periodo === filtroPeriodo) &&
          (!filtroFamilia || i.familia === filtroFamilia),
      ),
    [itemsMps, filtroPeriodo, filtroFamilia],
  );
  const necesidadesFiltradas = useMemo(
    () => NECESIDADES_MRP.filter(n => filtroMrp === 'Todos' || n.estado === filtroMrp),
    [filtroMrp],
  );
  const excepcionesFiltradas = useMemo(
    () => excepciones.filter(e => filtroExc === 'Todas' || e.estado === filtroExc),
    [excepciones, filtroExc],
  );

  function moverSecuencia(id: string, dir: -1 | 1) {
    setSecuencias(prev => {
      const ordenadas = [...prev].sort((a, b) => a.prioridad - b.prioridad);
      const i = ordenadas.findIndex(s => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= ordenadas.length) return prev;
      [ordenadas[i], ordenadas[j]] = [ordenadas[j], ordenadas[i]];
      return ordenadas.map((s, idx) => ({ ...s, prioridad: idx + 1 }));
    });
    avisar('Secuencia reordenada. La prioridad se recalcula para la máquina asignada.');
  }

  function recalcularPlan() {
    setImpactos([
      { orden: 'OF-3210', efecto: 'Inicio reprogramado +1 día', nuevaFecha: '2026-10-29', responsable: 'Juliana Ospina' },
      { orden: 'OF-3214', efecto: 'Molido desplazado al 2026-11-04', nuevaFecha: '2026-11-04', responsable: 'Juliana Ospina' },
      { orden: 'OF-3215', efecto: 'Envasado conserva fecha (material disponible)', nuevaFecha: '2026-10-29', responsable: 'Ricardo Mejía' },
    ]);
    avisar(`Replanificación por «${eventoReplan}» ejecutada: 3 órdenes afectadas y responsables notificados.`);
  }

  function prometer() {
    const dias = modoAtp === 'ATP' ? 3 : 5;
    const fecha = new Date(`${fechaAtp}T12:00:00`);
    fecha.setDate(fecha.getDate() + dias);
    const iso = fecha.toISOString().slice(0, 10);
    avisar(`Fecha prometida (${modoAtp}): ${fmtFecha(iso)} para ${fmtNum(Number(cantidadAtp))} un de ${productoAtp}. Materiales y capacidad validados.`);
  }

  const faltantes = NECESIDADES_MRP.filter(n => n.estado === 'Faltante').length;
  const cubiertos = NECESIDADES_MRP.length - faltantes;

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('pla')} funcionalidades · Fase ${MOD.fase}`}
        actions={<StatusBadge label="Datos de demostración" tone="petroleum" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Períodos abiertos" value={String(PERIODOS_MPS.filter(p => p.estado === 'Abierto').length)} sub="S-46 congelada hasta el 15/11" tone="info" />
        <StatCard label="Faltantes de material" value={String(faltantes)} sub={`${cubiertos} necesidades cubiertas`} tone="danger" />
        <StatCard label="Carga media de capacidad" value="86,2 %" sub="CT-REF al 104,6 %" tone="warn" />
        <StatCard label="Plan vigente" value="v4" sub="Aprobado 27/10 · Juliana Ospina" tone="ok" />
      </div>

      <Tabs
        tabs={[
          { id: 'resumen', label: 'Resumen' },
          { id: 'plan', label: 'Plan maestro y materiales', badge: 3 },
          { id: 'capacidad', label: 'Capacidad y secuenciación', badge: 5 },
          { id: 'gobierno', label: 'Entregas y gobierno', badge: 6 },
        ]}
        active={tab}
        onChange={setTab}
      />

      {mensaje && (
        <div role="status" className="rounded border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-800">
          {mensaje}
        </div>
      )}

      {tab === 'resumen' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Objetivo">
            <p className="text-xs leading-relaxed text-gray-600">
              Decidir qué producir, cuánto, cuándo, con qué materiales y en qué máquina o centro de trabajo, distinguiendo el
              cálculo de materiales de la programación de capacidad y recursos.
            </p>
          </Card>
          <Card title="Alcance">
            <p className="text-xs leading-relaxed text-gray-600">
              Plan maestro, cálculo de necesidades de materiales, capacidad finita, secuenciación, simulación de escenarios,
              replanificación, cuellos de botella, fechas de entrega y gobierno del plan.
            </p>
          </Card>
          <Card title="Actores">
            <div className="flex flex-wrap gap-1.5">
              {['Planificador', 'Jefe de producción', 'Compras', 'Ventas', 'Dirección', 'Supervisores de planta'].map(a => (
                <StatusBadge key={a} label={a} tone="petroleum" />
              ))}
            </div>
          </Card>
          <Card title="Reglas de negocio">
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>No se puede prometer una fecha sin validar materiales y capacidad.</li>
              <li>Un cambio de prioridad debe recalcular el impacto y notificar a los afectados.</li>
              <li>Las órdenes dentro del período congelado no se reprograman sin autorización.</li>
              <li>Toda simulación debe conservar su versión y supuestos.</li>
              <li>El plan aprobado es la referencia para compras y producción.</li>
              <li>Las excepciones deben tener responsable y fecha de resolución.</li>
            </ul>
          </Card>
          <Card title="Integraciones">
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>Compras: necesidades y fechas de material.</li>
              <li>Producción: órdenes y capacidad.</li>
              <li>Mantenimiento: disponibilidad de máquinas.</li>
              <li>Ventas: pedidos, fechas y ATP/CTP.</li>
              <li>Inventario: stock, recepciones y reservas.</li>
              <li>Costos: impacto de escenarios y utilización.</li>
            </ul>
          </Card>
          <Card title="Reportes y criterios de aceptación">
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>Reportes: plan maestro por período, necesidades y faltantes, carga vs. capacidad, retrasos, cumplimiento y escenarios comparados.</li>
              <li>El plan distingue claramente materiales de capacidad.</li>
              <li>La capacidad finita se respeta o se informa el conflicto.</li>
              <li>Las fechas prometidas son viables; los escenarios se comparan con indicadores consistentes.</li>
              <li>La replanificación propaga el impacto; el plan aprobado es auditable y estable.</li>
            </ul>
          </Card>
        </div>
      )}

      {tab === 'plan' && (
        <div className="space-y-4">
          <FunctionBlock code="PLA-01">
            <Toolbar>
              <select className={SELECT} value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)}>
                <option value="">Todos los períodos</option>
                {PERIODOS_MPS.map(p => <option key={p.id}>{p.id} · {p.semana}</option>)}
              </select>
              <select className={SELECT} value={filtroFamilia} onChange={e => setFiltroFamilia(e.target.value)}>
                <option value="">Todas las familias</option>
                {[...new Set(itemsMps.map(i => i.familia))].map(f => <option key={f}>{f}</option>)}
              </select>
              <span className="text-xs text-gray-500">Horizonte 8 semanas · período configurable</span>
              <span className="flex-1" />
              <button className={BTN_SECONDARY} onClick={() => setModalItemMps(true)}>+ Ítem de plan</button>
              <button
                className={BTN_PRIMARY}
                onClick={() => {
                  setItemsMps(prev => prev.map(i => ({ ...i, aprobado: true })));
                  avisar('Plan aprobado y versionado como v5: se generan sugerencias de fabricación y compra para S-44 a S-46.');
                }}
              >
                Aprobar y versionar
              </button>
            </Toolbar>
            <DataTable footer={`${itemsFiltrados.length} ítems del plan maestro`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Producto</Th>
                  <Th>Familia</Th>
                  <Th align="center">Período</Th>
                  <Th align="right">Previsión</Th>
                  <Th align="right">Pedidos</Th>
                  <Th align="right">Stock objetivo</Th>
                  <Th align="right">Plan</Th>
                  <Th align="center">Aprobado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {itemsFiltrados.map((i, idx) => (
                  <tr key={`${i.producto}-${i.periodo}-${idx}`} className="hoverable">
                    <Td>{i.producto}</Td>
                    <Td className="text-gray-500">{i.familia}</Td>
                    <Td align="center"><span className="font-mono text-gray-600">{i.periodo}</span></Td>
                    <Td align="right" className="num-col">{fmtNum(i.prevision)}</Td>
                    <Td align="right" className="num-col">{fmtNum(i.pedidos)}</Td>
                    <Td align="right" className="num-col">{fmtNum(i.stockObjetivo)}</Td>
                    <Td align="right" className="num-col font-semibold text-petroleum-700">{fmtNum(i.plan)}</Td>
                    <Td align="center">
                      {i.aprobado ? (
                        <StatusBadge label="Aprobado" tone="green" />
                      ) : (
                        <button
                          className={BTN_GHOST}
                          onClick={() => {
                            setItemsMps(prev => prev.map((x, xi) => (xi === idx ? { ...x, aprobado: true } : x)));
                            avisar(`Ítem de ${i.producto} (${i.periodo}) aprobado.`);
                          }}
                        >
                          Aprobar
                        </button>
                      )}
                    </Td>
                  </tr>
                ))}
                {itemsFiltrados.length === 0 && <EmptyRow colSpan={8} text="No hay ítems para los filtros seleccionados." />}
              </tbody>
            </DataTable>
            {modalItemMps && (
              <Modal title="Nuevo ítem de plan maestro" onClose={() => setModalItemMps(false)}>
                <div className="space-y-3 p-5">
                  <div>
                    <label className={LABEL}>Producto</label>
                    <select className={`${SELECT} w-full`} data-initial-focus>
                      <option>Arepa de maíz x12</option>
                      <option>Queso campesino 500 g</option>
                      <option>Yogurt griego 170 g</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>Período</label>
                      <select className={`${SELECT} w-full`}>
                        {PERIODOS_MPS.filter(p => p.estado !== 'Cerrado').map(p => <option key={p.id}>{p.id} · {p.semana}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={LABEL}>Cantidad plan</label>
                      <input className={INPUT} type="number" defaultValue={1000} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalItemMps(false)}>Cancelar</button>
                    <button
                      className={BTN_PRIMARY}
                      onClick={() => {
                        setModalItemMps(false);
                        setItemsMps(prev => [
                          ...prev,
                          { producto: 'Avena en hojuelas 500 g', familia: 'Cereales', periodo: 'S-44', prevision: 600, pedidos: 320, stockObjetivo: 200, plan: 550, aprobado: false },
                        ]);
                        avisar('Ítem de plan creado: Avena en hojuelas 500 g para S-44 (pendiente de aprobación).');
                      }}
                    >
                      Crear ítem
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="PLA-02">
            <Toolbar>
              <select className={SELECT} value={filtroMrp} onChange={e => setFiltroMrp(e.target.value)}>
                <option>Todos</option>
                <option>Cubierto</option>
                <option>Faltante</option>
              </select>
              <span className="text-xs text-gray-500">Explosión de BOM con stock, recepciones y plazos</span>
              <span className="flex-1" />
              <button
                className={BTN_PRIMARY}
                onClick={() => avisar(`MRP recalculado: ${NECESIDADES_MRP.length} necesidades, ${faltantes} faltantes con sugerencia de compra generada.`)}
              >
                Calcular MRP
              </button>
            </Toolbar>
            <DataTable footer={`${necesidadesFiltradas.length} necesidades netas · ${necesidadesFiltradas.filter(n => n.estado === 'Faltante').length} faltantes`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Material</Th>
                  <Th align="right">Necesidad</Th>
                  <Th>Fecha</Th>
                  <Th>Origen</Th>
                  <Th align="right">Disponible</Th>
                  <Th align="right">Recepciones</Th>
                  <Th align="right">Sugerido</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {necesidadesFiltradas.map(n => (
                  <tr key={n.id} className="hoverable">
                    <Td>{n.material}</Td>
                    <Td align="right" className="num-col">{fmtNum(n.cantidad)} {n.unidad}</Td>
                    <Td className="font-mono text-gray-500">{n.fecha}</Td>
                    <Td className="text-gray-500">{n.origen}</Td>
                    <Td align="right" className="num-col">{fmtNum(n.disponible)}</Td>
                    <Td align="right" className="num-col">{fmtNum(n.recepciones)}</Td>
                    <Td align="right" className={`num-col ${n.sugerido > 0 ? 'font-semibold text-petroleum-700' : ''}`}>{fmtNum(n.sugerido)}</Td>
                    <Td align="center"><StatusBadge label={n.estado} tone={n.estado === 'Cubierto' ? 'green' : 'red'} /></Td>
                  </tr>
                ))}
                {necesidadesFiltradas.length === 0 && <EmptyRow colSpan={8} text="No hay necesidades para el filtro seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="PLA-03">
            <div className="grid gap-4 md:grid-cols-3">
              <Card title="Viabilidad de materiales">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Necesidades cubiertas</span>
                  <span className="text-lg font-semibold tabular text-gray-800">{cubiertos}/{NECESIDADES_MRP.length}</span>
                </div>
                <div className="mt-2"><StatusBadge label={faltantes === 0 ? 'Viable' : 'Con faltantes'} tone={faltantes === 0 ? 'green' : 'red'} /></div>
                <p className="mt-2 text-xs text-gray-500">Stock disponible, recepciones previstas, stock de seguridad y plazos.</p>
              </Card>
              <Card title="Viabilidad de capacidad">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Centros saturados</span>
                  <span className="text-lg font-semibold tabular text-gray-800">1/5</span>
                </div>
                <div className="mt-2"><StatusBadge label="CT-REF sobrecargado" tone="red" /></div>
                <p className="mt-2 text-xs text-gray-500">Capacidad finita por calendario, turnos y eficiencia.</p>
              </Card>
              <Card title="Conciliación del plan">
                <div className="mt-1"><StatusBadge label="Viable en materiales · Revisar capacidad" tone="amber" /></div>
                <p className="mt-2 text-xs text-gray-500">Ambos resultados pueden compararse antes de aprobar el plan.</p>
                <button
                  className={`${BTN_PRIMARY} mt-3`}
                  onClick={() => avisar('Materiales y capacidad reconciliados: el plan es viable en materiales; CT-REF requiere turno extra o secuencia alternativa.')}
                >
                  Reconciliar
                </button>
              </Card>
            </div>
          </FunctionBlock>
        </div>
      )}

      {tab === 'capacidad' && (
        <div className="space-y-4">
          <FunctionBlock code="PLA-04">
            <Toolbar>
              <span className="text-xs text-gray-500">Calendarios, turnos, eficiencia y centros alternativos</span>
              <span className="flex-1" />
              <button
                className={BTN_PRIMARY}
                onClick={() => {
                  setCapacidadProgramada(true);
                  avisar('Programación con capacidad finita ejecutada: 4 centros conformes y conflicto informado en CT-REF (falta 11 h).');
                }}
              >
                Programar con capacidad finita
              </button>
            </Toolbar>
            <DataTable footer={`${CENTROS_PLA.length} centros de trabajo · capacidad en horas/semana`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Centro</Th>
                  <Th align="center">Máquinas</Th>
                  <Th align="right">Capacidad</Th>
                  <Th align="right">Carga</Th>
                  <Th align="right">Ocupación</Th>
                  <Th align="right">Eficiencia</Th>
                  <Th align="center">Turnos</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CENTROS_PLA.map(c => {
                  const pct = c.cargaH / c.capacidadH;
                  return (
                    <tr key={c.id} className="hoverable">
                      <Td>
                        <span className="font-mono text-gray-600">{c.id}</span>
                        <div className="text-gray-800">{c.nombre}</div>
                      </Td>
                      <Td align="center" className="font-mono text-gray-600">{c.maquinas}</Td>
                      <Td align="right" className="num-col">{fmtNum(c.capacidadH)} h</Td>
                      <Td align="right" className="num-col">{fmtNum(c.cargaH)} h</Td>
                      <Td align="right" className="num-col">{fmtPct(pct)}</Td>
                      <Td align="right" className="num-col">{fmtPct(c.eficiencia)}</Td>
                      <Td align="center" className="font-mono text-gray-600">{c.turnos}</Td>
                      <Td align="center">
                        {pct > 1 ? (
                          <StatusBadge label="Sobrecargado" tone="red" />
                        ) : capacidadProgramada ? (
                          <StatusBadge label="Programado" tone="green" />
                        ) : (
                          <StatusBadge label="Disponible" tone="blue" />
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="PLA-05">
            <Toolbar>
              <span className="text-xs text-gray-500">Orden por prioridad, entrega, dependencia y minimización de preparación</span>
              <span className="flex-1" />
              <button
                className={BTN_PRIMARY}
                onClick={() => avisar('Secuencia reordenada automáticamente respetando los bloques bloqueados.')}
              >
                Reordenar automático
              </button>
            </Toolbar>
            <DataTable footer={`${secuencias.length} operaciones secuenciadas`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th align="center">Prioridad</Th>
                  <Th>Orden</Th>
                  <Th>Producto</Th>
                  <Th>Operación</Th>
                  <Th>Máquina</Th>
                  <Th>Inicio</Th>
                  <Th>Fin</Th>
                  <Th align="center">Bloqueada</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {secuencias.map(s => (
                  <tr key={s.id} className="hoverable">
                    <Td align="center">
                      <span className="mr-1.5 font-mono text-gray-600">{s.prioridad}</span>
                      <button className={BTN_GHOST} onClick={() => moverSecuencia(s.id, -1)} aria-label="Subir prioridad">↑</button>
                      <button className={BTN_GHOST} onClick={() => moverSecuencia(s.id, 1)} aria-label="Bajar prioridad">↓</button>
                    </Td>
                    <Td className="font-mono text-gray-600">{s.orden}</Td>
                    <Td>{s.producto}</Td>
                    <Td>{s.operacion}</Td>
                    <Td className="font-mono text-gray-500">{s.maquina}</Td>
                    <Td className="font-mono text-gray-500">{s.inicio}</Td>
                    <Td className="font-mono text-gray-500">{s.fin}</Td>
                    <Td align="center">
                      <input
                        type="checkbox"
                        checked={s.bloqueada}
                        onChange={() => {
                          setSecuencias(prev => prev.map(x => (x.id === s.id ? { ...x, bloqueada: !x.bloqueada } : x)));
                          avisar(`Secuencia de ${s.orden} ${s.bloqueada ? 'desbloqueada' : 'bloqueada'}: no se reprogramará automáticamente.`);
                        }}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="PLA-06">
            <Toolbar>
              <span className="text-xs text-gray-500">Cada escenario conserva supuestos e indicadores comparables</span>
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => setModalEscenario(true)}>+ Nuevo escenario</button>
            </Toolbar>
            <DataTable footer={`${escenarios.length} escenarios · 1 vigente`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Nombre</Th>
                  <Th>Supuestos</Th>
                  <Th align="right">Entregas a tiempo</Th>
                  <Th align="right">Utilización</Th>
                  <Th align="right">Costo</Th>
                  <Th align="center">Estado</Th>
                  <Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {escenarios.map(e => (
                  <tr key={e.id} className="hoverable">
                    <Td>{e.nombre}</Td>
                    <Td className="text-gray-500">{e.supuestos}</Td>
                    <Td align="right" className="num-col">{fmtPct(e.entrega, 0)}</Td>
                    <Td align="right" className="num-col">{fmtPct(e.utilizacion, 0)}</Td>
                    <Td align="right" className="num-col">{fmtNum(e.costo)}</Td>
                    <Td align="center">
                      <StatusBadge label={e.estado} tone={e.estado === 'Vigente' ? 'green' : e.estado === 'Simulado' ? 'blue' : 'gray'} />
                    </Td>
                    <Td align="center">
                      {e.estado === 'Simulado' ? (
                        <button
                          className={BTN_GHOST}
                          onClick={() => {
                            setEscenarios(prev => prev.map(x => ({ ...x, estado: x.id === e.id ? 'Vigente' : x.estado === 'Vigente' ? 'Simulado' : x.estado })));
                            avisar(`Escenario «${e.nombre}» activado como plan vigente sin afectar el plan anterior (queda versionado).`);
                          }}
                        >
                          Activar
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            {modalEscenario && (
              <Modal title="Nuevo escenario de simulación" onClose={() => setModalEscenario(false)}>
                <div className="space-y-3 p-5">
                  <div>
                    <label className={LABEL}>Nombre</label>
                    <input className={INPUT} placeholder="Ej. Demanda diciembre +15 %" data-initial-focus />
                  </div>
                  <div>
                    <label className={LABEL}>Supuestos</label>
                    <select className={`${SELECT} w-full`}>
                      <option>Demanda +15 %</option>
                      <option>Turno extra en CT-EMP</option>
                      <option>Retraso de proveedor 3 días</option>
                      <option>Mantenimiento mayor en CT-HOR</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalEscenario(false)}>Cancelar</button>
                    <button
                      className={BTN_PRIMARY}
                      onClick={() => {
                        setModalEscenario(false);
                        setEscenarios(prev => [
                          ...prev,
                          { id: `ESC-0${prev.length + 1}`, nombre: 'Demanda diciembre +15 %', supuestos: 'Demanda +15 %', entrega: 0.9, utilizacion: 0.93, costo: 54700000, estado: 'Simulado' },
                        ]);
                        avisar('Escenario creado y simulado: sus indicadores no afectan el plan vigente.');
                      }}
                    >
                      Crear y simular
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="PLA-07">
            <Toolbar>
              <select className={SELECT} value={eventoReplan} onChange={e => setEventoReplan(e.target.value)}>
                <option>Retraso de material</option>
                <option>Avería de máquina</option>
                <option>Orden prioritaria</option>
              </select>
              <button className={BTN_PRIMARY} onClick={recalcularPlan}>Recalcular plan</button>
            </Toolbar>
            <DataTable footer={`${impactos.length} órdenes impactadas por la replanificación`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Orden</Th>
                  <Th>Efecto</Th>
                  <Th>Nueva fecha</Th>
                  <Th>Responsable notificado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {impactos.map((i, idx) => (
                  <tr key={`${i.orden}-${idx}`} className="hoverable">
                    <Td className="font-mono text-gray-600">{i.orden}</Td>
                    <Td>{i.efecto}</Td>
                    <Td className="font-mono text-gray-600">{i.nuevaFecha}</Td>
                    <Td>{i.responsable}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="PLA-08">
            <Toolbar>
              <span className="text-xs text-gray-500">Carga contra capacidad por centro y período</span>
            </Toolbar>
            <DataTable footer="Recurso límite del plan: CT-REF (refrigeración) — limita la fecha de entrega de lácteos">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Centro</Th>
                  <Th align="center">Período</Th>
                  <Th align="right">Capacidad</Th>
                  <Th align="right">Carga</Th>
                  <Th>Ocupación</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CARGAS_CAPACIDAD.map(c => {
                  const pct = c.carga / c.capacidad;
                  return (
                    <tr key={c.id} className="hoverable">
                      <Td className="font-mono text-gray-600">{c.centro}</Td>
                      <Td align="center"><span className="font-mono text-gray-600">{c.periodo}</span></Td>
                      <Td align="right" className="num-col">{fmtNum(c.capacidad)} h</Td>
                      <Td align="right" className="num-col">{fmtNum(c.carga)} h</Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-40 overflow-hidden rounded bg-gray-100">
                            <div className={`h-full ${pct > 1 ? 'bg-red-500' : pct > 0.9 ? 'bg-amber-400' : 'bg-petroleum-500'}`} style={{ width: `${Math.min(pct * 100, 100)}%` }} />
                          </div>
                          <span className="num-col text-xs">{fmtPct(pct, 0)}</span>
                        </div>
                      </Td>
                      <Td align="center">
                        {pct > 1 ? <StatusBadge label="Saturado" tone="red" /> : pct > 0.9 ? <StatusBadge label="Al límite" tone="amber" /> : <StatusBadge label="Con holgura" tone="green" />}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {tab === 'gobierno' && (
        <div className="space-y-4">
          <FunctionBlock code="PLA-09">
            <Toolbar>
              <select className={SELECT} value={productoAtp} onChange={e => setProductoAtp(e.target.value)}>
                {[...new Set(itemsMps.map(i => i.producto))].map(p => <option key={p}>{p}</option>)}
              </select>
              <input className={INPUT} type="number" placeholder="Cantidad" value={cantidadAtp} onChange={e => setCantidadAtp(e.target.value)} />
              <input className={INPUT} type="date" value={fechaAtp} onChange={e => setFechaAtp(e.target.value)} />
              <select className={SELECT} value={modoAtp} onChange={e => setModoAtp(e.target.value as 'ATP' | 'CTP')}>
                <option value="ATP">ATP · disponible para prometer</option>
                <option value="CTP">CTP · capaz para prometer</option>
              </select>
              <button className={BTN_PRIMARY} onClick={prometer}>Prometer fecha</button>
            </Toolbar>
            <div className="mt-3 rounded border border-gray-200 bg-white p-3 text-xs text-gray-600">
              <span className="font-medium text-gray-700">Regla:</span> ninguna fecha se promete sin validar materiales (ATP) y capacidad (CTP).
              El cálculo combina el plan aprobado v4 con el stock disponible y la carga vigente de los centros.
            </div>
          </FunctionBlock>

          <FunctionBlock code="PLA-10">
            <Toolbar>
              <select className={SELECT} value={filtroExc} onChange={e => setFiltroExc(e.target.value)}>
                <option>Todas</option>
                <option>Abierta</option>
                <option>En gestión</option>
                <option>Resuelta</option>
              </select>
              <span className="text-xs text-gray-500">Sobrecargas, faltantes, retrasos, recursos y conflictos de prioridad</span>
            </Toolbar>
            <DataTable footer={`${excepcionesFiltradas.length} excepciones · ${excepcionesFiltradas.filter(e => e.estado === 'Abierta').length} abiertas`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th align="center">Tipo</Th>
                  <Th>Descripción</Th>
                  <Th>Responsable</Th>
                  <Th>Fecha</Th>
                  <Th align="center">Estado</Th>
                  <Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {excepcionesFiltradas.map(e => (
                  <tr key={e.id} className="hoverable">
                    <Td align="center">
                      <StatusBadge
                        label={e.tipo}
                        tone={e.tipo === 'Faltante' || e.tipo === 'Sobrecarga' ? 'red' : e.tipo === 'Retraso' ? 'amber' : 'blue'}
                      />
                    </Td>
                    <Td>{e.descripcion}</Td>
                    <Td>{e.responsable}</Td>
                    <Td className="font-mono text-gray-500">{e.fecha}</Td>
                    <Td align="center">
                      <StatusBadge label={e.estado} tone={e.estado === 'Abierta' ? 'amber' : e.estado === 'En gestión' ? 'blue' : 'green'} />
                    </Td>
                    <Td align="center">
                      {e.estado !== 'Resuelta' ? (
                        <button
                          className={BTN_GHOST}
                          onClick={() => {
                            setExcepciones(prev => prev.map(x => (x.id === e.id ? { ...x, estado: x.estado === 'Abierta' ? 'En gestión' : 'Resuelta' } : x)));
                            avisar(e.estado === 'Abierta' ? `Excepción ${e.id} en gestión por ${e.responsable}.` : `Excepción ${e.id} resuelta y cerrada con fecha de resolución.`);
                          }}
                        >
                          {e.estado === 'Abierta' ? 'Iniciar gestión' : 'Resolver'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </Td>
                  </tr>
                ))}
                {excepcionesFiltradas.length === 0 && <EmptyRow colSpan={6} text="No hay excepciones para el filtro seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="PLA-11">
            <Toolbar>
              <input className={INPUT} placeholder="Escribir comentario al plan v4..." value={comentario} onChange={e => setComentario(e.target.value)} />
              <button
                className={BTN_SECONDARY}
                onClick={() => {
                  if (comentario.trim()) {
                    avisar('Comentario enviado a los revisores del plan v4.');
                    setComentario('');
                  } else {
                    avisar('Escriba un comentario antes de enviar.');
                  }
                }}
              >
                Enviar comentario
              </button>
              <button className={BTN_PRIMARY} onClick={() => avisar('Plan v4 aprobado por Carlos Herrera (Gerencia). Períodos congelados: S-46.')}>
                Aprobar plan
              </button>
            </Toolbar>
            <DataTable footer={`${APROBACIONES_PLA.length} versiones del plan`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Versión</Th>
                  <Th>Plan</Th>
                  <Th>Período</Th>
                  <Th>Aprobador</Th>
                  <Th>Fecha</Th>
                  <Th align="center">Comentarios</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {APROBACIONES_PLA.map(a => (
                  <tr key={a.version} className="hoverable">
                    <Td className="font-mono font-semibold text-petroleum-700">{a.version}</Td>
                    <Td>{a.plan}</Td>
                    <Td className="text-gray-500">{a.periodo}</Td>
                    <Td>{a.aprobador}</Td>
                    <Td className="font-mono text-gray-500">{a.fecha}</Td>
                    <Td align="center" className="font-mono text-gray-600">{a.comentarios}</Td>
                    <Td align="center">
                      <StatusBadge label={a.estado} tone={a.estado === 'Aprobado' ? 'green' : a.estado === 'Rechazado' ? 'red' : 'gray'} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="PLA-12">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {INDICADORES_PLA.map(ind => (
                <div key={ind.label} className="rounded border border-gray-200 bg-white p-3">
                  <div className="text-xs text-gray-500">{ind.label}</div>
                  <div className="mt-1 text-xl font-semibold tabular text-gray-800">{ind.valor}</div>
                  <div className="mt-1">
                    <StatusBadge label={ind.estado} tone={ind.estado.includes('Meta') || ind.estado === 'En meta' ? 'green' : 'amber'} />
                  </div>
                </div>
              ))}
            </div>
          </FunctionBlock>

          <FunctionBlock code="PLA-13">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {INTEGRACIONES_PLA.map(int => (
                <div key={int.id} className="flex items-center justify-between gap-3 rounded border border-gray-200 bg-white p-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-800">{int.nombre}</div>
                    <div className="text-[11px] text-gray-500">{int.detalle}</div>
                  </div>
                  <button
                    className={BTN_SECONDARY}
                    onClick={() => avisar(`Datos del plan enviados a ${int.nombre} (necesidades, órdenes, reservas y avisos).`)}
                  >
                    Enviar
                  </button>
                </div>
              ))}
            </div>
          </FunctionBlock>

          <FunctionBlock code="PLA-14">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Calendarios, turnos, horizontes, reglas, períodos congelados, permisos y auditoría</span>
              <button className={BTN_PRIMARY} onClick={() => avisar('Configuración de planificación guardada. Los cambios quedan auditados.')}>
                Guardar configuración
              </button>
            </div>
            <DataTable footer={`${parametros.length} parámetros de gobierno del plan`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Grupo</Th>
                  <Th>Parámetro</Th>
                  <Th>Valor</Th>
                  <Th align="center">Editable</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {parametros.map(p => (
                  <tr key={p.id} className="hoverable">
                    <Td><StatusBadge label={p.grupo} tone="petroleum" /></Td>
                    <Td>{p.parametro}</Td>
                    <Td>
                      {p.editable ? (
                        <input
                          className={INPUT}
                          value={p.valor}
                          onChange={e => setParametros(prev => prev.map(x => (x.id === p.id ? { ...x, valor: e.target.value } : x)))}
                        />
                      ) : (
                        <span className="text-gray-600">{p.valor}</span>
                      )}
                    </Td>
                    <Td align="center">
                      <StatusBadge label={p.editable ? 'Sí' : 'Solo lectura'} tone={p.editable ? 'green' : 'gray'} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <h4 className="mb-2 mt-4 text-xs font-semibold text-gray-700">Auditoría de cambios</h4>
            <DataTable footer={`${AUDITORIA_PLA.length} eventos de auditoría`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Fecha</Th>
                  <Th>Usuario</Th>
                  <Th>Acción</Th>
                  <Th>Detalle</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {AUDITORIA_PLA.map(a => (
                  <tr key={a.id} className="hoverable">
                    <Td className="font-mono text-gray-500">{a.fecha}</Td>
                    <Td>{a.usuario}</Td>
                    <Td><StatusBadge label={a.accion} tone={a.accion === 'Aprobación' ? 'green' : a.accion === 'Rechazo' ? 'red' : 'blue'} /></Td>
                    <Td>{a.detalle}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}
    </div>
  );
}

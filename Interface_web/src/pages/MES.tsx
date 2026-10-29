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
import { fmtNum, fmtMoney, fmtPct, fmtHoras } from '../lib/format';
import {
  ESTACIONES_MES,
  ORDENES_MES,
  REGISTROS_OPERACION,
  CAPTURAS_CANTIDAD,
  TIEMPOS_MES,
  PARADAS_MES,
  WIP_MES,
  TURNOS_MES,
  ALERTAS_MES,
  CONTROLES_CALIDAD,
  INSTRUCCIONES_MES,
  PASOS_INSTRUCCION,
  CONSUMOS_MES,
  DISPOSITIVOS_MES,
} from '../data/mes';
import type {
  OrdenMES,
  RegistroOperacionMES,
  CapturaCantidadMES,
  ParadaMES,
  AlertaMES,
  ConsumoMES,
} from '../data/mes';

const MOD = MODULOS.find(m => m.id === 'mes')!;

const SELECT = 'rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-petroleum-500';
const LABEL = 'block text-[11px] font-medium text-gray-500 mb-1';

const OPERARIOS = ['Jorge Blandón', 'Marta Ruiz', 'Luis Castaño', 'Sofía Marín', 'Natalia Rojas', 'Óscar Pulgarín', 'Yessica López'];

export default function MES() {
  const [tab, setTab] = useState('resumen');
  const [mensaje, setMensaje] = useState('');
  const avisar = (texto: string) => window.setTimeout(() => setMensaje(texto), 400);

  /* MES-01/16 */
  const [ordenes, setOrdenes] = useState<OrdenMES[]>(ORDENES_MES);
  const [filtroOrdenes, setFiltroOrdenes] = useState('Todas');

  /* MES-02 */
  const [asignaciones, setAsignaciones] = useState<Record<string, string>>({ 'EST-01': 'Jorge Blandón', 'EST-02': 'Marta Ruiz', 'EST-03': 'Luis Castaño', 'EST-04': 'Sofía Marín', 'EST-05': 'Natalia Rojas', 'EST-06': 'Óscar Pulgarín', 'EST-08': 'Yessica López' });

  /* MES-03 */
  const [registros, setRegistros] = useState<RegistroOperacionMES[]>(REGISTROS_OPERACION);
  const [ordenCiclo, setOrdenCiclo] = useState('OF-3210');
  const [motivoPausa, setMotivoPausa] = useState('');

  /* MES-04 */
  const [capturas, setCapturas] = useState<CapturaCantidadMES[]>(CAPTURAS_CANTIDAD);
  const [modalCaptura, setModalCaptura] = useState(false);
  const [frmCaptura, setFrmCaptura] = useState({ orden: 'OF-3210', producidas: '100', rechazadas: '2', motivo: 'Defecto de forma' });
  const [errorCaptura, setErrorCaptura] = useState('');

  /* MES-06 */
  const [paradas, setParadas] = useState<ParadaMES[]>(PARADAS_MES);
  const [modalParada, setModalParada] = useState(false);
  const [frmParada, setFrmParada] = useState({ estacion: 'PAS-01', tipo: 'Disponibilidad', causa: 'Falla mecánica', inicio: '2026-10-28 09:10', fin: '2026-10-28 10:15' });

  /* MES-07 */
  const [instruccionSel, setInstruccionSel] = useState('INS-01');
  const [checklist, setChecklist] = useState<boolean[]>([true, true, true, false, false]);

  /* MES-08 */
  const [consumos, setConsumos] = useState<ConsumoMES[]>(CONSUMOS_MES);

  /* MES-09/10 */
  const [filtroWip, setFiltroWip] = useState('Todos');
  const [filtroTraz, setFiltroTraz] = useState('Todas');

  /* MES-11 */
  const [modalRelevo, setModalRelevo] = useState(false);
  const [frmRelevo, setFrmRelevo] = useState({ saliente: 'T1', entrante: 'T2', notas: '' });

  /* MES-12 */
  const [alertas, setAlertas] = useState<AlertaMES[]>(ALERTAS_MES);

  const ordenesFiltradas = useMemo(
    () => ordenes.filter(o => filtroOrdenes === 'Todas' || o.estado === filtroOrdenes),
    [ordenes, filtroOrdenes],
  );
  const registrosOrden = useMemo(() => registros.filter(r => r.orden === ordenCiclo), [registros, ordenCiclo]);
  const wipFiltrado = useMemo(() => WIP_MES.filter(w => filtroWip === 'Todos' || w.estacion === filtroWip), [filtroWip]);
  const trazFiltrada = useMemo(() => registros.filter(r => filtroTraz === 'Todas' || r.orden === filtroTraz), [registros, filtroTraz]);

  const enProceso = ordenes.filter(o => o.estado === 'En proceso').length;
  const produccionHoy = CAPTURAS_CANTIDAD.reduce((acc, c) => acc + c.producidas, 0);
  const paradasAbiertas = paradas.filter(p => p.estado === 'Abierta').length;
  const wipTotal = WIP_MES.reduce((acc, w) => acc + w.valor, 0);

  function eventoCiclo(evento: RegistroOperacionMES['evento'], motivo = '—') {
    setRegistros(prev => [
      {
        id: `ROP-0${prev.length + 1}`,
        orden: ordenCiclo,
        operacion: 'Mezclado',
        estacion: 'MEZ-01',
        operario: 'Jorge Blandón',
        turno: 'Turno A',
        lote: 'L-2026-118',
        evento,
        fechaHora: '2026-10-28 11:05',
        motivo,
      },
      ...prev,
    ]);
    if (evento === 'Pausa') {
      setOrdenes(prev => prev.map(o => (o.id === ordenCiclo ? { ...o, estado: 'Pausada' } : o)));
    } else if (evento === 'Reanudación') {
      setOrdenes(prev => prev.map(o => (o.id === ordenCiclo ? { ...o, estado: 'En proceso' } : o)));
    } else if (evento === 'Fin') {
      setOrdenes(prev => prev.map(o => (o.id === ordenCiclo ? { ...o, estado: 'Cerrada' } : o)));
    }
    avisar(`${evento} de ${ordenCiclo} registrado con fecha, hora, usuario y motivo.`);
  }

  function guardarCaptura() {
    const producidas = Number(frmCaptura.producidas);
    const rechazadas = Number(frmCaptura.rechazadas);
    if (!producidas || producidas <= 0) {
      setErrorCaptura('La cantidad producida debe ser mayor a cero.');
      return;
    }
    if (rechazadas < 0 || rechazadas > producidas) {
      setErrorCaptura('La cantidad rechazada debe ser menor o igual a la producida.');
      return;
    }
    const pendientes = Math.max(ordenes.find(o => o.id === frmCaptura.orden)?.cantidad ?? 0 - producidas, 0);
    setCapturas(prev => [
      {
        id: `CPT-0${prev.length + 1}`,
        orden: frmCaptura.orden,
        producidas,
        rechazadas,
        pendientes,
        motivoRechazo: frmCaptura.motivo,
        fechaHora: '2026-10-28 11:12',
        operario: 'Jorge Blandón',
      },
      ...prev,
    ]);
    setModalCaptura(false);
    setErrorCaptura('');
    avisar(`Captura registrada en ${frmCaptura.orden}: ${fmtNum(producidas)} producidas · ${fmtNum(rechazadas)} rechazadas (${frmCaptura.motivo}).`);
  }

  function registrarParada() {
    setParadas(prev => [
      {
        id: `PAR-0${prev.length + 1}`,
        estacion: frmParada.estacion,
        tipo: frmParada.tipo as ParadaMES['tipo'],
        causa: frmParada.causa,
        inicio: frmParada.inicio,
        fin: frmParada.fin,
        duracionMin: 65,
        responsable: 'Supervisor de turno',
        estado: 'Cerrada',
      },
      ...prev,
    ]);
    setModalParada(false);
    avisar(`Parada registrada en ${frmParada.estacion}: ${frmParada.tipo} · ${frmParada.causa} · 65 min.`);
  }

  function cerrarOrden(id: string) {
    setOrdenes(prev => prev.map(o => (o.id === id ? { ...o, estado: 'Cerrada' } : o)));
    avisar(`Orden ${id} cerrada: tiempos, cantidades y consumo consolidados para costos y trazabilidad. Pendientes generados.`);
  }

  const toneOrden = (estado: OrdenMES['estado']) =>
    estado === 'En proceso' ? 'green' : estado === 'Liberada' ? 'blue' : estado === 'Pausada' ? 'amber' : estado === 'Cerrada' ? 'gray' : 'petroleum';

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('mes')} funcionalidades · Fase ${MOD.fase}`}
        actions={<StatusBadge label="Datos de demostración" tone="petroleum" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Órdenes en proceso" value={String(enProceso)} sub={`${ordenes.filter(o => o.estado === 'Liberada').length} liberadas esperando inicio`} tone="info" />
        <StatCard label="Producción hoy" value={`${fmtNum(produccionHoy)} un`} sub="3 turnos activos" tone="ok" />
        <StatCard label="Paradas abiertas" value={String(paradasAbiertas)} sub="PAS-01 · ENV-02" tone="danger" />
        <StatCard label="WIP valorizado" value={fmtMoney(wipTotal)} sub={`${WIP_MES.length} órdenes en curso`} />
      </div>

      <Tabs
        tabs={[
          { id: 'resumen', label: 'Resumen' },
          { id: 'ejecucion', label: 'Ejecución de operaciones', badge: 5 },
          { id: 'seguimiento', label: 'Registro y seguimiento', badge: 5 },
          { id: 'cierre', label: 'Turnos, calidad y cierre', badge: 6 },
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
              Conocer y controlar qué está ocurriendo realmente en la planta: órdenes liberadas, operaciones en curso,
              cantidades, tiempos, paradas, calidad y trabajo en curso.
            </p>
          </Card>
          <Card title="Alcance">
            <p className="text-xs leading-relaxed text-gray-600">
              Liberación y asignación de órdenes, ejecución de operaciones, captura de cantidades y tiempos, paradas,
              instrucciones digitales, WIP, turnos, alertas y tableros de planta.
            </p>
          </Card>
          <Card title="Actores">
            <div className="flex flex-wrap gap-1.5">
              {['Supervisor de producción', 'Operario', 'Planificador', 'Calidad', 'Mantenimiento', 'Gerencia'].map(a => (
                <StatusBadge key={a} label={a} tone="petroleum" />
              ))}
            </div>
          </Card>
          <Card title="Reglas de negocio">
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>No se puede iniciar una operación sin orden liberada y materiales disponibles.</li>
              <li>Toda pausa o parada debe tener causa.</li>
              <li>La cantidad rechazada debe ser menor o igual a la producida.</li>
              <li>El cierre debe consolidar tiempos, cantidades y consumo.</li>
              <li>Los registros no pueden modificarse sin auditoría.</li>
              <li>El operario solo puede ejecutar operaciones asignadas o autorizadas.</li>
            </ul>
          </Card>
          <Card title="Integraciones">
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>Planificación: órdenes y secuencia.</li>
              <li>Producción: listas de materiales, rutas y costos.</li>
              <li>Inventario: consumo y producción.</li>
              <li>Calidad: controles y bloqueos.</li>
              <li>Mantenimiento: paradas y averías.</li>
              <li>Costos: tiempos, consumo y WIP.</li>
            </ul>
          </Card>
          <Card title="Reportes y criterios de aceptación">
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>Reportes: avance, producción por turno/operario/máquina, tiempos reales vs. estándar, paradas, WIP y cumplimiento.</li>
              <li>La planta registra inicio, pausa y fin de cada operación.</li>
              <li>Las cantidades producidas y rechazadas son consistentes.</li>
              <li>Las paradas tienen causa y duración; el WIP se consulta por orden.</li>
              <li>Los tableros reflejan datos reales; el cierre actualiza inventario y costos.</li>
            </ul>
          </Card>
        </div>
      )}

      {tab === 'ejecucion' && (
        <div className="space-y-4">
          <FunctionBlock code="MES-01">
            <Toolbar>
              <select className={SELECT} value={filtroOrdenes} onChange={e => setFiltroOrdenes(e.target.value)}>
                <option>Todas</option>
                <option>Planificada</option>
                <option>Liberada</option>
                <option>En proceso</option>
                <option>Pausada</option>
                <option>Cerrada</option>
              </select>
              <span className="text-xs text-gray-500">Material ✓ · Capacidad ✓ · Documentación ✓</span>
            </Toolbar>
            <DataTable footer={`${ordenesFiltradas.length} órdenes de trabajo`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Orden</Th>
                  <Th>Producto</Th>
                  <Th align="right">Cantidad</Th>
                  <Th>Centro</Th>
                  <Th align="center">Prioridad</Th>
                  <Th>Liberación</Th>
                  <Th align="center">Estado</Th>
                  <Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ordenesFiltradas.map(o => (
                  <tr key={o.id} className="hoverable">
                    <Td className="font-mono text-gray-600">{o.id}</Td>
                    <Td>{o.producto}</Td>
                    <Td align="right" className="num-col">{fmtNum(o.cantidad)}</Td>
                    <Td className="font-mono text-gray-500">{o.centro}</Td>
                    <Td align="center">
                      <StatusBadge label={o.prioridad} tone={o.prioridad === 'Alta' ? 'red' : o.prioridad === 'Media' ? 'amber' : 'blue'} />
                    </Td>
                    <Td className="font-mono text-gray-500">{o.fechaLiberacion ?? '—'}</Td>
                    <Td align="center"><StatusBadge label={o.estado} tone={toneOrden(o.estado)} /></Td>
                    <Td align="center">
                      {o.estado === 'Planificada' ? (
                        <button
                          className={BTN_GHOST}
                          onClick={() => {
                            setOrdenes(prev => prev.map(x => (x.id === o.id ? { ...x, estado: 'Liberada', fechaLiberacion: '2026-10-28' } : x)));
                            avisar(`Orden ${o.id} liberada a planta: material, capacidad y documentación validados.`);
                          }}
                        >
                          Liberar
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </Td>
                  </tr>
                ))}
                {ordenesFiltradas.length === 0 && <EmptyRow colSpan={8} text="No hay órdenes para el filtro seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="MES-02">
            <Toolbar>
              <span className="text-xs text-gray-500">Asigne máquinas, centros y operarios considerando disponibilidad, habilidades y carga</span>
            </Toolbar>
            <DataTable footer={`${ESTACIONES_MES.length} estaciones de trabajo`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Estación</Th>
                  <Th>Centro</Th>
                  <Th>Orden actual</Th>
                  <Th>Operario asignado</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ESTACIONES_MES.map(e => (
                  <tr key={e.id} className="hoverable">
                    <Td>
                      <span className="font-mono text-gray-600">{e.maquina}</span>
                      <div className="text-gray-800">{e.nombre}</div>
                    </Td>
                    <Td className="font-mono text-gray-500">{e.centro}</Td>
                    <Td className="font-mono text-gray-600">{e.ordenActual}</Td>
                    <Td>
                      <select
                        className={SELECT}
                        value={asignaciones[e.id] ?? ''}
                        onChange={ev => {
                          setAsignaciones(prev => ({ ...prev, [e.id]: ev.target.value }));
                          avisar(`Operario ${ev.target.value} asignado a ${e.maquina} (habilidades y carga verificadas).`);
                        }}
                      >
                        <option value="">— Sin asignar —</option>
                        {OPERARIOS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </Td>
                    <Td align="center">
                      <StatusBadge
                        label={e.estado}
                        tone={e.estado === 'Operando' ? 'green' : e.estado === 'Parada' ? 'red' : 'gray'}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="MES-03">
            <Toolbar>
              <select className={SELECT} value={ordenCiclo} onChange={e => setOrdenCiclo(e.target.value)}>
                {ordenes.filter(o => o.estado === 'En proceso' || o.estado === 'Pausada' || o.estado === 'Liberada').map(o => (
                  <option key={o.id}>{o.id} · {o.producto}</option>
                ))}
              </select>
              <input className={INPUT} placeholder="Motivo de pausa (obligatorio)" value={motivoPausa} onChange={e => setMotivoPausa(e.target.value)} />
              <button className={BTN_SECONDARY} onClick={() => eventoCiclo('Inicio')}>Iniciar</button>
              <button
                className={BTN_SECONDARY}
                onClick={() => {
                  if (!motivoPausa.trim()) {
                    avisar('Toda pausa debe tener causa: escriba el motivo.');
                    return;
                  }
                  eventoCiclo('Pausa', motivoPausa.trim());
                  setMotivoPausa('');
                }}
              >
                Pausar
              </button>
              <button className={BTN_SECONDARY} onClick={() => eventoCiclo('Reanudación')}>Reanudar</button>
              <button className={BTN_PRIMARY} onClick={() => eventoCiclo('Fin')}>Finalizar</button>
            </Toolbar>
            <DataTable footer={`${registrosOrden.length} eventos del ciclo de vida de ${ordenCiclo}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Fecha y hora</Th>
                  <Th>Operario</Th>
                  <Th>Turno</Th>
                  <Th align="center">Evento</Th>
                  <Th>Motivo</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {registrosOrden.map(r => (
                  <tr key={r.id} className="hoverable">
                    <Td className="font-mono text-gray-600">{r.fechaHora}</Td>
                    <Td>{r.operario}</Td>
                    <Td>{r.turno}</Td>
                    <Td align="center">
                      <StatusBadge
                        label={r.evento}
                        tone={r.evento === 'Inicio' ? 'blue' : r.evento === 'Pausa' ? 'amber' : r.evento === 'Reanudación' ? 'petroleum' : 'green'}
                      />
                    </Td>
                    <Td className="text-gray-500">{r.motivo}</Td>
                  </tr>
                ))}
                {registrosOrden.length === 0 && <EmptyRow colSpan={5} text="La orden no tiene eventos registrados." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="MES-04">
            <Toolbar>
              <span className="text-xs text-gray-500">La cantidad rechazada debe ser menor o igual a la producida</span>
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => setModalCaptura(true)}>+ Capturar cantidades</button>
            </Toolbar>
            <DataTable footer={`${capturas.length} capturas de cantidad`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Orden</Th>
                  <Th align="right">Producidas</Th>
                  <Th align="right">Rechazadas</Th>
                  <Th align="right">Pendientes</Th>
                  <Th>Motivo rechazo</Th>
                  <Th>Fecha</Th>
                  <Th>Operario</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {capturas.map(c => (
                  <tr key={c.id} className="hoverable">
                    <Td className="font-mono text-gray-600">{c.orden}</Td>
                    <Td align="right" className="num-col text-green-700">{fmtNum(c.producidas)}</Td>
                    <Td align="right" className={`num-col ${c.rechazadas > 0 ? 'text-red-600' : ''}`}>{fmtNum(c.rechazadas)}</Td>
                    <Td align="right" className="num-col">{fmtNum(c.pendientes)}</Td>
                    <Td className="text-gray-500">{c.motivoRechazo}</Td>
                    <Td className="font-mono text-gray-500">{c.fechaHora}</Td>
                    <Td>{c.operario}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            {modalCaptura && (
              <Modal title="Capturar cantidades" onClose={() => { setModalCaptura(false); setErrorCaptura(''); }}>
                <div className="space-y-3 p-5">
                  <div>
                    <label className={LABEL}>Orden</label>
                    <select className={`${SELECT} w-full`} value={frmCaptura.orden} onChange={e => setFrmCaptura({ ...frmCaptura, orden: e.target.value })} data-initial-focus>
                      {ordenes.filter(o => o.estado === 'En proceso' || o.estado === 'Pausada' || o.estado === 'Liberada').map(o => <option key={o.id}>{o.id} · {o.producto}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>Producidas</label>
                      <input className={INPUT} type="number" value={frmCaptura.producidas} onChange={e => setFrmCaptura({ ...frmCaptura, producidas: e.target.value })} />
                    </div>
                    <div>
                      <label className={LABEL}>Rechazadas</label>
                      <input className={INPUT} type="number" value={frmCaptura.rechazadas} onChange={e => setFrmCaptura({ ...frmCaptura, rechazadas: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>Motivo de rechazo</label>
                    <input className={INPUT} value={frmCaptura.motivo} onChange={e => setFrmCaptura({ ...frmCaptura, motivo: e.target.value })} />
                  </div>
                  {errorCaptura && <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{errorCaptura}</p>}
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => { setModalCaptura(false); setErrorCaptura(''); }}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={guardarCaptura}>Guardar captura</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="MES-05">
            <Toolbar>
              <span className="text-xs text-gray-500">Tiempos reales versus estándar por operación</span>
            </Toolbar>
            <DataTable footer={`${TIEMPOS_MES.length} registros de tiempo`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Orden</Th>
                  <Th>Operación</Th>
                  <Th align="center">Tipo</Th>
                  <Th align="right">Real</Th>
                  <Th align="right">Estándar</Th>
                  <Th align="right">Desviación</Th>
                  <Th align="center">Comparativo</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TIEMPOS_MES.map(t => {
                  const desv = t.real - t.estandar;
                  return (
                    <tr key={t.id} className="hoverable">
                      <Td className="font-mono text-gray-600">{t.orden}</Td>
                      <Td>{t.operacion}</Td>
                      <Td align="center"><StatusBadge label={t.tipo} tone="petroleum" /></Td>
                      <Td align="right" className="num-col">{fmtHoras(t.real)}</Td>
                      <Td align="right" className="num-col">{fmtHoras(t.estandar)}</Td>
                      <Td align="right" className={`num-col ${desv > 0 ? 'text-red-600' : 'text-green-700'}`}>{desv > 0 ? '+' : ''}{fmtHoras(desv)}</Td>
                      <Td align="center">
                        <StatusBadge label={desv > 0 ? 'Sobre estándar' : 'Bajo estándar'} tone={desv > 0 ? 'amber' : 'green'} />
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {tab === 'seguimiento' && (
        <div className="space-y-4">
          <FunctionBlock code="MES-06">
            <Toolbar>
              <span className="text-xs text-gray-500">Disponibilidad, rendimiento, calidad u otra causa · inicio, fin, duración y responsable</span>
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => setModalParada(true)}>+ Registrar parada</button>
            </Toolbar>
            <DataTable footer={`${paradas.length} paradas · ${paradasAbiertas} abiertas`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Estación</Th>
                  <Th align="center">Tipo</Th>
                  <Th>Causa</Th>
                  <Th>Inicio</Th>
                  <Th>Fin</Th>
                  <Th align="right">Duración</Th>
                  <Th>Responsable</Th>
                  <Th align="center">Estado</Th>
                  <Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paradas.map(p => (
                  <tr key={p.id} className="hoverable">
                    <Td className="font-mono text-gray-600">{p.estacion}</Td>
                    <Td align="center">
                      <StatusBadge label={p.tipo} tone={p.tipo === 'Disponibilidad' ? 'red' : p.tipo === 'Calidad' ? 'amber' : p.tipo === 'Rendimiento' ? 'blue' : 'gray'} />
                    </Td>
                    <Td>{p.causa}</Td>
                    <Td className="font-mono text-gray-500">{p.inicio}</Td>
                    <Td className="font-mono text-gray-500">{p.fin ?? '—'}</Td>
                    <Td align="right" className="num-col">{fmtNum(p.duracionMin)} min</Td>
                    <Td>{p.responsable}</Td>
                    <Td align="center"><StatusBadge label={p.estado} tone={p.estado === 'Abierta' ? 'red' : 'green'} /></Td>
                    <Td align="center">
                      {p.estado === 'Abierta' ? (
                        <button
                          className={BTN_GHOST}
                          onClick={() => {
                            setParadas(prev => prev.map(x => (x.id === p.id ? { ...x, estado: 'Cerrada', fin: '2026-10-28 11:00' } : x)));
                            avisar(`Parada ${p.id} cerrada con fin y duración consolidados.`);
                          }}
                        >
                          Cerrar
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            {modalParada && (
              <Modal title="Registrar parada" onClose={() => setModalParada(false)}>
                <div className="space-y-3 p-5">
                  <div>
                    <label className={LABEL}>Estación</label>
                    <select className={`${SELECT} w-full`} value={frmParada.estacion} onChange={e => setFrmParada({ ...frmParada, estacion: e.target.value })} data-initial-focus>
                      {ESTACIONES_MES.map(e => <option key={e.id} value={e.maquina}>{e.maquina} · {e.nombre}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>Tipo</label>
                      <select className={`${SELECT} w-full`} value={frmParada.tipo} onChange={e => setFrmParada({ ...frmParada, tipo: e.target.value })}>
                        <option>Disponibilidad</option>
                        <option>Rendimiento</option>
                        <option>Calidad</option>
                        <option>Otra</option>
                      </select>
                    </div>
                    <div>
                      <label className={LABEL}>Causa</label>
                      <input className={INPUT} value={frmParada.causa} onChange={e => setFrmParada({ ...frmParada, causa: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>Inicio</label>
                      <input className={INPUT} value={frmParada.inicio} onChange={e => setFrmParada({ ...frmParada, inicio: e.target.value })} />
                    </div>
                    <div>
                      <label className={LABEL}>Fin</label>
                      <input className={INPUT} value={frmParada.fin} onChange={e => setFrmParada({ ...frmParada, fin: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalParada(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={registrarParada}>Guardar parada</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="MES-07">
            <Toolbar>
              <select className={SELECT} value={instruccionSel} onChange={e => setInstruccionSel(e.target.value)}>
                {INSTRUCCIONES_MES.filter(i => i.estado === 'Vigente').map(i => (
                  <option key={i.id} value={i.id}>{i.documento} · {i.revision}</option>
                ))}
              </select>
              <span className="text-xs text-gray-500">El operario ve la instrucción asociada a la operación</span>
            </Toolbar>
            <div className="grid gap-4 md:grid-cols-2">
              <Card title={`Instrucción ${instruccionSel} — lista de verificación`}>
                <ul className="space-y-2">
                  {PASOS_INSTRUCCION.map((paso, i) => (
                    <li key={paso} className="flex items-start gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={checklist[i] ?? false}
                        onChange={() => {
                          setChecklist(prev => prev.map((v, idx) => (idx === i ? !v : v)));
                          avisar(`Paso ${i + 1} ${checklist[i] ? 'marcado como pendiente' : 'verificado'}: ${paso}`);
                        }}
                      />
                      <span className={checklist[i] ? 'text-gray-400 line-through' : ''}>{paso}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-gray-500">Especificación: humedad 42–46 % · adjuntos: plano MEZ-01-002.pdf · receta R-118.</p>
              </Card>
              <DataTable footer={`${INSTRUCCIONES_MES.length} documentos de instrucción`}>
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <Th>Orden</Th>
                    <Th>Documento</Th>
                    <Th align="center">Revisión</Th>
                    <Th align="center">Pasos</Th>
                    <Th align="center">Estado</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {INSTRUCCIONES_MES.map(i => (
                    <tr key={i.id} className="hoverable">
                      <Td className="font-mono text-gray-600">{i.orden}</Td>
                      <Td>{i.documento}</Td>
                      <Td align="center" className="font-mono text-gray-600">{i.revision}</Td>
                      <Td align="center" className="font-mono text-gray-600">{i.pasos}</Td>
                      <Td align="center"><StatusBadge label={i.estado} tone={i.estado === 'Vigente' ? 'green' : 'gray'} /></Td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </div>
          </FunctionBlock>

          <FunctionBlock code="MES-08">
            <Toolbar>
              <span className="text-xs text-gray-500">Confirmar consumo actualiza inventario y trazabilidad de la operación</span>
            </Toolbar>
            <DataTable footer={`${consumos.length} materiales de consumo · ${consumos.filter(c => c.estado === 'Confirmado').length} confirmados`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Orden</Th>
                  <Th>Material</Th>
                  <Th align="right">Planificado</Th>
                  <Th align="right">Consumido</Th>
                  <Th align="center">Unidad</Th>
                  <Th align="center">Estado</Th>
                  <Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {consumos.map(c => (
                  <tr key={c.id} className="hoverable">
                    <Td className="font-mono text-gray-600">{c.orden}</Td>
                    <Td>{c.material}</Td>
                    <Td align="right" className="num-col">{fmtNum(c.planificado)}</Td>
                    <Td align="right">
                      <input
                        className="num-col w-24 rounded border border-gray-200 px-2 py-1 text-xs focus:border-petroleum-500 focus:outline-none"
                        type="number"
                        value={c.consumido}
                        onChange={e => setConsumos(prev => prev.map(x => (x.id === c.id ? { ...x, consumido: Number(e.target.value) } : x)))}
                      />
                    </Td>
                    <Td align="center" className="text-gray-500">{c.unidad}</Td>
                    <Td align="center"><StatusBadge label={c.estado} tone={c.estado === 'Confirmado' ? 'green' : 'amber'} /></Td>
                    <Td align="center">
                      {c.estado === 'Pendiente' ? (
                        <button
                          className={BTN_GHOST}
                          onClick={() => {
                            setConsumos(prev => prev.map(x => (x.id === c.id ? { ...x, estado: 'Confirmado' } : x)));
                            avisar(`Consumo de ${c.material} confirmado en ${c.orden}: inventario y trazabilidad actualizados.`);
                          }}
                        >
                          Confirmar
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="MES-09">
            <Toolbar>
              <select className={SELECT} value={filtroWip} onChange={e => setFiltroWip(e.target.value)}>
                <option>Todos</option>
                {[...new Set(WIP_MES.map(w => w.estacion))].map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="text-xs text-gray-500">Órdenes en curso, producido, pendiente, ubicación y valor</span>
            </Toolbar>
            <DataTable footer={`${wipFiltrado.length} órdenes en WIP · valor total ${fmtMoney(wipTotal)}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Orden</Th>
                  <Th>Producto</Th>
                  <Th align="right">Producidas</Th>
                  <Th align="right">Pendientes</Th>
                  <Th>Estación</Th>
                  <Th align="right">Valor WIP</Th>
                  <Th align="center">Avance</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {wipFiltrado.map(w => {
                  const total = w.producidas + w.pendientes;
                  const pct = total > 0 ? w.producidas / total : 0;
                  return (
                    <tr key={w.orden} className="hoverable">
                      <Td className="font-mono text-gray-600">{w.orden}</Td>
                      <Td>{w.producto}</Td>
                      <Td align="right" className="num-col">{fmtNum(w.producidas)}</Td>
                      <Td align="right" className="num-col">{fmtNum(w.pendientes)}</Td>
                      <Td className="font-mono text-gray-500">{w.estacion}</Td>
                      <Td align="right" className="num-col">{fmtMoney(w.valor)}</Td>
                      <Td align="center">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-2 w-20 overflow-hidden rounded bg-gray-100">
                            <div className="h-full bg-petroleum-500" style={{ width: `${Math.round(pct * 100)}%` }} />
                          </div>
                          <span className="num-col text-xs">{fmtPct(pct, 0)}</span>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
                {wipFiltrado.length === 0 && <EmptyRow colSpan={7} text="No hay WIP para el centro seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="MES-10">
            <Toolbar>
              <select className={SELECT} value={filtroTraz} onChange={e => setFiltroTraz(e.target.value)}>
                <option>Todas</option>
                {[...new Set(registros.map(r => r.orden))].map(o => <option key={o}>{o}</option>)}
              </select>
              <span className="text-xs text-gray-500">Cada registro vincula orden · operación · operario · máquina · turno · lote</span>
            </Toolbar>
            <DataTable footer={`${trazFiltrada.length} registros trazables`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Fecha</Th>
                  <Th>Orden</Th>
                  <Th>Operación</Th>
                  <Th>Máquina</Th>
                  <Th>Operario</Th>
                  <Th>Turno</Th>
                  <Th>Lote</Th>
                  <Th align="center">Evento</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {trazFiltrada.map(r => (
                  <tr key={r.id} className="hoverable">
                    <Td className="font-mono text-gray-500">{r.fechaHora}</Td>
                    <Td className="font-mono text-gray-600">{r.orden}</Td>
                    <Td>{r.operacion}</Td>
                    <Td className="font-mono text-gray-500">{r.estacion}</Td>
                    <Td>{r.operario}</Td>
                    <Td>{r.turno}</Td>
                    <Td className="font-mono text-gray-600">{r.lote}</Td>
                    <Td align="center">
                      <StatusBadge
                        label={r.evento}
                        tone={r.evento === 'Inicio' ? 'blue' : r.evento === 'Pausa' ? 'amber' : r.evento === 'Reanudación' ? 'petroleum' : 'green'}
                      />
                    </Td>
                  </tr>
                ))}
                {trazFiltrada.length === 0 && <EmptyRow colSpan={8} text="No hay registros para la orden seleccionada." />}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {tab === 'cierre' && (
        <div className="space-y-4">
          <FunctionBlock code="MES-11">
            <Toolbar>
              <span className="text-xs text-gray-500">Turnos, relevos y traspaso de trabajo en curso</span>
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => setModalRelevo(true)}>+ Registrar relevo</button>
            </Toolbar>
            <DataTable footer={`${TURNOS_MES.length} turnos activos`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Turno</Th>
                  <Th>Horario</Th>
                  <Th>Supervisor</Th>
                  <Th align="center">Operarios</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TURNOS_MES.map(t => (
                  <tr key={t.id} className="hoverable">
                    <Td>{t.nombre}</Td>
                    <Td className="font-mono text-gray-600">{t.inicio} – {t.fin}</Td>
                    <Td>{t.supervisor}</Td>
                    <Td align="center" className="font-mono text-gray-600">{t.operarios}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            {modalRelevo && (
              <Modal title="Registrar relevo de turno" onClose={() => setModalRelevo(false)}>
                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>Turno saliente</label>
                      <select className={`${SELECT} w-full`} value={frmRelevo.saliente} onChange={e => setFrmRelevo({ ...frmRelevo, saliente: e.target.value })} data-initial-focus>
                        {TURNOS_MES.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={LABEL}>Turno entrante</label>
                      <select className={`${SELECT} w-full`} value={frmRelevo.entrante} onChange={e => setFrmRelevo({ ...frmRelevo, entrante: e.target.value })}>
                        {TURNOS_MES.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>Notas de traspaso</label>
                    <textarea
                      className={`${INPUT} h-20`}
                      placeholder="Ej. OF-3210 al 37 %; continuar mezclado con lote L-2026-118."
                      value={frmRelevo.notas}
                      onChange={e => setFrmRelevo({ ...frmRelevo, notas: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalRelevo(false)}>Cancelar</button>
                    <button
                      className={BTN_PRIMARY}
                      onClick={() => {
                        setModalRelevo(false);
                        avisar('Relevo registrado: trabajo en curso traspasado con continuidad de operación.');
                      }}
                    >
                      Guardar relevo
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="MES-12">
            <Toolbar>
              <span className="text-xs text-gray-500">Retraso, parada, falta de material, calidad o saturación · con escalamiento</span>
            </Toolbar>
            <DataTable footer={`${alertas.length} alertas · ${alertas.filter(a => a.estado === 'Activa').length} activas`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th align="center">Tipo</Th>
                  <Th>Alerta</Th>
                  <Th>Fecha</Th>
                  <Th align="center">Estado</Th>
                  <Th align="center">Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alertas.map(a => (
                  <tr key={a.id} className="hoverable">
                    <Td align="center">
                      <StatusBadge
                        label={a.tipo}
                        tone={a.tipo === 'Parada' ? 'red' : a.tipo === 'Calidad' ? 'amber' : a.tipo === 'Retraso' ? 'amber' : a.tipo === 'Material' ? 'red' : 'blue'}
                      />
                    </Td>
                    <Td>{a.texto}</Td>
                    <Td className="font-mono text-gray-500">{a.fechaHora}</Td>
                    <Td align="center">
                      <StatusBadge label={a.estado} tone={a.estado === 'Activa' ? 'amber' : a.estado === 'Confirmada' ? 'blue' : 'red'} />
                    </Td>
                    <Td align="center">
                      {a.estado === 'Activa' && (
                        <>
                          <button
                            className={BTN_GHOST}
                            onClick={() => {
                              setAlertas(prev => prev.map(x => (x.id === a.id ? { ...x, estado: 'Confirmada' } : x)));
                              avisar(`Alerta ${a.id} confirmada por el supervisor.`);
                            }}
                          >
                            Confirmar
                          </button>
                          <button
                            className={BTN_GHOST}
                            onClick={() => {
                              setAlertas(prev => prev.map(x => (x.id === a.id ? { ...x, estado: 'Escalada' } : x)));
                              avisar(`Alerta ${a.id} escalada a mantenimiento y gerencia con confirmación de recibo.`);
                            }}
                          >
                            Escalar
                          </button>
                        </>
                      )}
                      {a.estado !== 'Activa' && <span className="text-xs text-gray-400">—</span>}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="MES-13">
            <Toolbar>
              <span className="text-xs text-gray-500">Un resultado no conforme bloquea el avance de la operación</span>
            </Toolbar>
            <DataTable footer={`${CONTROLES_CALIDAD.length} controles en línea · ${CONTROLES_CALIDAD.filter(c => c.estado === 'No conforme').length} no conformes`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Orden</Th>
                  <Th>Operación</Th>
                  <Th>Parámetro</Th>
                  <Th>Especificación</Th>
                  <Th align="right">Resultado</Th>
                  <Th align="center">Estado</Th>
                  <Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CONTROLES_CALIDAD.map(c => (
                  <tr key={c.id} className="hoverable">
                    <Td className="font-mono text-gray-600">{c.orden}</Td>
                    <Td>{c.operacion}</Td>
                    <Td>{c.parametro}</Td>
                    <Td className="text-gray-500">{c.especificacion}</Td>
                    <Td align="right" className={`num-col ${c.estado === 'No conforme' ? 'text-red-600' : ''}`}>{c.resultado}</Td>
                    <Td align="center"><StatusBadge label={c.estado} tone={c.estado === 'Conforme' ? 'green' : 'red'} /></Td>
                    <Td align="center">
                      {c.estado === 'No conforme' ? (
                        <button
                          className={BTN_GHOST}
                          onClick={() => avisar(`Avance de ${c.orden} bloqueado por ${c.parametro} no conforme. Se notifica a calidad y supervisión.`)}
                        >
                          Bloquear avance
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Liberado</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="MES-14">
            <Toolbar>
              <span className="text-xs text-gray-500">Básculas, lectores, sensores y terminales de planta</span>
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => avisar('Sincronización de dispositivos ejecutada: datos recientes incorporados al MES.')}>
                Sincronizar
              </button>
            </Toolbar>
            <DataTable footer={`${DISPOSITIVOS_MES.length} dispositivos integrados`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>ID</Th>
                  <Th>Nombre</Th>
                  <Th align="center">Tipo</Th>
                  <Th>Estación</Th>
                  <Th align="center">Estado</Th>
                  <Th>Último dato</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DISPOSITIVOS_MES.map(d => (
                  <tr key={d.id} className="hoverable">
                    <Td className="font-mono text-gray-500">{d.id}</Td>
                    <Td>{d.nombre}</Td>
                    <Td align="center"><StatusBadge label={d.tipo} tone="blue" /></Td>
                    <Td className="font-mono text-gray-500">{d.estacion}</Td>
                    <Td align="center">
                      <StatusBadge
                        label={d.estado}
                        tone={d.estado === 'Conectado' ? 'green' : d.estado === 'Intermitente' ? 'amber' : 'red'}
                      />
                    </Td>
                    <Td className="text-gray-500">{d.ultimoDato}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="MES-15">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {ESTACIONES_MES.map(e => {
                const wip = WIP_MES.find(w => w.orden === e.ordenActual);
                const pct = wip ? wip.producidas / (wip.producidas + wip.pendientes) : 0;
                return (
                  <div key={e.id} className="rounded border border-gray-200 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-gray-800">{e.maquina}</span>
                      <StatusBadge
                        label={e.estado}
                        tone={e.estado === 'Operando' ? 'green' : e.estado === 'Parada' ? 'red' : 'gray'}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500">{e.nombre} · {e.centro}</div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-gray-600">
                      <span className="font-mono">{e.ordenActual}</span>
                      <span>{e.operario}</span>
                    </div>
                    {wip && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded bg-gray-100">
                          <div className="h-full bg-petroleum-500" style={{ width: `${Math.round(pct * 100)}%` }} />
                        </div>
                        <span className="num-col text-[11px]">{fmtPct(pct, 0)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-gray-200 bg-white p-3 text-xs text-gray-600">
                <span className="font-semibold text-gray-800">Producción hoy:</span> {fmtNum(produccionHoy)} un · {ordenes.filter(o => o.estado === 'En proceso').length} órdenes activas
              </div>
              <div className="rounded border border-gray-200 bg-white p-3 text-xs text-gray-600">
                <span className="font-semibold text-gray-800">Paradas hoy:</span> {fmtNum(paradas.reduce((acc, p) => acc + p.duracionMin, 0))} min · {paradasAbiertas} abiertas
              </div>
              <div className="rounded border border-gray-200 bg-white p-3 text-xs text-gray-600">
                <span className="font-semibold text-gray-800">Calidad en línea:</span> {CONTROLES_CALIDAD.filter(c => c.estado === 'No conforme').length} bloqueos por no conformidad
              </div>
            </div>
          </FunctionBlock>

          <FunctionBlock code="MES-16">
            <Toolbar>
              <span className="text-xs text-gray-500">El cierre consolida tiempos, cantidades y consumo; genera pendientes</span>
            </Toolbar>
            <DataTable footer={`${ordenes.filter(o => o.estado === 'En proceso' || o.estado === 'Pausada').length} órdenes pendientes de cierre`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Orden</Th>
                  <Th>Producto</Th>
                  <Th align="right">Cantidad</Th>
                  <Th align="right">Producidas</Th>
                  <Th align="right">Pendientes</Th>
                  <Th align="center">Estado</Th>
                  <Th align="center">Cierre</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ordenes
                  .filter(o => o.estado === 'En proceso' || o.estado === 'Pausada')
                  .map(o => {
                    const cap = CAPTURAS_CANTIDAD.filter(c => c.orden === o.id);
                    const producidas = cap.reduce((acc, c) => acc + c.producidas, 0);
                    return (
                      <tr key={o.id} className="hoverable">
                        <Td className="font-mono text-gray-600">{o.id}</Td>
                        <Td>{o.producto}</Td>
                        <Td align="right" className="num-col">{fmtNum(o.cantidad)}</Td>
                        <Td align="right" className="num-col">{fmtNum(producidas)}</Td>
                        <Td align="right" className="num-col">{fmtNum(o.cantidad - producidas)}</Td>
                        <Td align="center"><StatusBadge label={o.estado} tone={toneOrden(o.estado)} /></Td>
                        <Td align="center">
                          <button
                            className={BTN_GHOST}
                            onClick={() => cerrarOrden(o.id)}
                          >
                            Cerrar operación
                          </button>
                        </Td>
                      </tr>
                    );
                  })}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}
    </div>
  );
}

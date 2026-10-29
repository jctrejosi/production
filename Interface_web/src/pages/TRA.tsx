import { useMemo, useRef, useState } from 'react';
import {
  BTN_DANGER, BTN_PRIMARY, BTN_SECONDARY, Card, DataTable, EmptyRow, FunctionBlock,
  INPUT, Modal, PageHeader, StatCard, StatusBadge, Tabs, Td, Th, Toolbar,
} from '../components/ui';
import { MODULOS, conteoModulo } from '../data/modules';
import { fmtFecha, fmtMoney, fmtNum, fmtPct } from '../lib/format';
import {
  COMPONENTES, CONSUMOS, CUARENTENAS, DEFECTOS, LOTES, NOTIFICACIONES, OPERACIONES,
  RECEPCIONES, REPORTES_TRA, REPROCESOS, RETENCION, RETIROS,
  type Cuarentena, type EstadoLote, type NotificacionTra, type ReprocesoLote, type Retiro,
  type TipoLote,
} from '../data/tra';

const MOD = MODULOS.find(m => m.id === 'tra')!;

/* ------------------------------ helpers ------------------------------ */

function toneEstado(estado: EstadoLote) {
  switch (estado) {
    case 'Liberado': return 'green' as const;
    case 'En proceso': return 'blue' as const;
    case 'Cuarentena': return 'amber' as const;
    case 'Rechazado':
    case 'Retirado': return 'red' as const;
    default: return 'gray' as const;
  }
}

function toneTipo(tipo: TipoLote) {
  if (tipo === 'MP') return 'petroleum' as const;
  if (tipo === 'SEMI') return 'blue' as const;
  return 'green' as const;
}

function toneResultado(resultado: string) {
  if (resultado === 'Aprobado') return 'green' as const;
  if (resultado === 'Rechazado') return 'red' as const;
  return 'amber' as const;
}

function toneCriticidad(c: string) {
  if (c === 'Crítico') return 'red' as const;
  if (c === 'Alto') return 'amber' as const;
  return 'blue' as const;
}

const PESTANAS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'identificacion', label: 'Identificación y genealogía' },
  { id: 'trazabilidad', label: 'Trazabilidad y consumos' },
  { id: 'cuarentena', label: 'Cuarentena y retiro' },
  { id: 'reportes', label: 'Reportes y auditoría' },
];

export default function TRA() {
  const [tab, setTab] = useState('resumen');
  const [mensaje, setMensaje] = useState('');

  /* ------------------------------ estado de datos ------------------------------ */
  const [lotes, setLotes] = useState(LOTES);
  const [recepciones, setRecepciones] = useState(RECEPCIONES);
  const [defectos, setDefectos] = useState(DEFECTOS);
  const [reprocesos, setReprocesos] = useState<ReprocesoLote[]>(REPROCESOS);
  const [cuarentenas, setCuarentenas] = useState<Cuarentena[]>(CUARENTENAS);
  const [retiros, setRetiros] = useState<Retiro[]>(RETIROS);
  const [notificaciones, setNotificaciones] = useState<NotificacionTra[]>(NOTIFICACIONES);

  const avisar = (texto: string) => {
    window.setTimeout(() => setMensaje(texto), 400);
    window.setTimeout(() => setMensaje(''), 4200);
  };

  /* ------------------------------ filtros ------------------------------ */
  const [qLote, setQLote] = useState('');
  const [fResultado, setFResultado] = useState('');
  const [ptSel, setPtSel] = useState('L-2026-101');
  const [mpSel, setMpSel] = useState('L-2026-098');
  const [qOper, setQOper] = useState('');
  const [fOrden, setFOrden] = useState('');
  const [qConsumo, setQConsumo] = useState('');
  const [fConsumoOrden, setFConsumoOrden] = useState('');
  const [fDefecto, setFDefecto] = useState('');
  const [fCanal, setFCanal] = useState('');
  const [expSel, setExpSel] = useState('L-2026-101');
  const [repSel, setRepSel] = useState('REP-TRA-01');

  const lotesVisibles = useMemo(() => {
    const t = qLote.trim().toLocaleLowerCase('es');
    if (!t) return lotes;
    return lotes.filter(l =>
      l.id.toLocaleLowerCase('es').includes(t) ||
      l.producto.toLocaleLowerCase('es').includes(t) ||
      (l.proveedor ?? '').toLocaleLowerCase('es').includes(t) ||
      (l.orden ?? '').toLocaleLowerCase('es').includes(t));
  }, [lotes, qLote]);

  const recepcionesVisibles = useMemo(() => {
    const t = qLote.trim().toLocaleLowerCase('es');
    return RECEPCIONES.map(r => r).filter(r =>
      (!fResultado || r.resultado === fResultado) &&
      (!t || r.id.toLocaleLowerCase('es').includes(t) || r.lote.toLocaleLowerCase('es').includes(t) || r.proveedor.toLocaleLowerCase('es').includes(t)));
  }, [qLote, fResultado]);

  const componentesPt = useMemo(() => COMPONENTES.filter(c => c.pt === ptSel), [ptSel]);
  const ptLote = lotes.find(l => l.id === ptSel);

  const destinosMp = useMemo(() => COMPONENTES.filter(c => c.mp === mpSel), [mpSel]);
  const mpLote = lotes.find(l => l.id === mpSel);

  const operacionesVisibles = useMemo(() => {
    const t = qOper.trim().toLocaleLowerCase('es');
    return OPERACIONES.filter(o =>
      (!fOrden || o.orden === fOrden) &&
      (!t || o.id.toLocaleLowerCase('es').includes(t) || o.orden.toLocaleLowerCase('es').includes(t) ||
        o.operario.toLocaleLowerCase('es').includes(t) || o.maquina.toLocaleLowerCase('es').includes(t)));
  }, [qOper, fOrden]);

  const consumosVisibles = useMemo(() => {
    const t = qConsumo.trim().toLocaleLowerCase('es');
    return CONSUMOS.filter(c =>
      (!fConsumoOrden || c.orden === fConsumoOrden) &&
      (!t || c.id.toLocaleLowerCase('es').includes(t) || c.material.toLocaleLowerCase('es').includes(t) || c.lote.toLocaleLowerCase('es').includes(t)));
  }, [qConsumo, fConsumoOrden]);

  const defectosVisibles = useMemo(() =>
    defectos.filter(d => !fDefecto || d.estado === fDefecto), [defectos, fDefecto]);

  const notificacionesVisibles = useMemo(() =>
    notificaciones.filter(n => !fCanal || n.canal === fCanal), [notificaciones, fCanal]);

  /* ------------------------------ modales ------------------------------ */
  const [modalIdent, setModalIdent] = useState(false);
  const [ident, setIdent] = useState({ producto: '', tipo: 'MP' as TipoLote, cantidad: '', bodega: 'BOD-01' });
  const seqIdent = useRef(111);

  const [modalRecepcion, setModalRecepcion] = useState(false);
  const [recepcion, setRecepcion] = useState({ lote: '', proveedor: '', cantidad: '', unidad: 'kg', resultado: 'Aprobado' });
  const seqRec = useRef(920);

  const [modalDefecto, setModalDefecto] = useState(false);
  const [defecto, setDefecto] = useState({ lote: '', tipo: '', proceso: '' });
  const seqDef = useRef(518);

  const [modalReproceso, setModalReproceso] = useState(false);
  const [reproceso, setReproceso] = useState({ lote: '', motivo: '', responsable: '' });
  const seqRpr = useRef(119);

  const [modalCuarentena, setModalCuarentena] = useState(false);
  const [cuarentena, setCuarentena] = useState({ lote: '', motivo: '', ubicacion: 'BOD-CUA-A1' });
  const seqCua = useRef(32);

  const [modalRetiro, setModalRetiro] = useState(false);
  const [retiro, setRetiro] = useState({ producto: '', lote: '', cantidad: '', motivo: '', criticidad: 'Medio' });

  const [modalNotif, setModalNotif] = useState(false);
  const [notif, setNotif] = useState({ evento: '', destino: '', canal: 'Sistema', criticidad: 'Medio' });
  const seqNot = useRef(222);

  /* ------------------------------ acciones ------------------------------ */
  const crearIdentificador = () => {
    const cantidad = Number(ident.cantidad) || 0;
    if (!ident.producto.trim() || cantidad <= 0) {
      avisar('Completa producto y cantidad para asignar el identificador.');
      return;
    }
    seqIdent.current += 1;
    const id = `L-2026-${seqIdent.current}`;
    setLotes(prev => [...prev, {
      id, producto: ident.producto.trim(), tipo: ident.tipo, fecha: '2026-10-18',
      cantidad, unidad: ident.tipo === 'MP' ? 'kg' : 'und', estado: 'Cuarentena',
      bodega: ident.bodega,
    }]);
    setModalIdent(false);
    setIdent({ producto: '', tipo: 'MP', cantidad: '', bodega: 'BOD-01' });
    avisar(`Identificador único ${id} asignado a «${ident.producto}». El lote queda en cuarentena inicial.`);
  };

  const registrarRecepcion = () => {
    const cantidad = Number(recepcion.cantidad) || 0;
    if (!recepcion.lote.trim() || !recepcion.proveedor.trim() || cantidad <= 0) {
      avisar('Completa lote, proveedor y cantidad de la recepción.');
      return;
    }
    seqRec.current += 1;
    setRecepciones(prev => [...prev, {
      id: `REC-${seqRec.current}`, lote: recepcion.lote.trim(), proveedor: recepcion.proveedor.trim(),
      fecha: '2026-10-18', oc: 'OC-0901', cantidad, unidad: recepcion.unidad,
      control: 'CAL-1220', resultado: recepcion.resultado as 'Aprobado' | 'Aprobado con observación' | 'Rechazado',
    }]);
    setModalRecepcion(false);
    setRecepcion({ lote: '', proveedor: '', cantidad: '', unidad: 'kg', resultado: 'Aprobado' });
    avisar(`Recepción registrada para ${recepcion.lote} y vinculada al control CAL-1220.`);
  };

  const registrarDefecto = () => {
    if (!defecto.lote.trim() || !defecto.tipo.trim()) {
      avisar('Selecciona el lote y describe el defecto.');
      return;
    }
    seqDef.current += 1;
    setDefectos(prev => [...prev, {
      id: `DEF-${seqDef.current}`, lote: defecto.lote, orden: 'OF-1042', tipo: defecto.tipo.trim(),
      nc: `NC-0${seqDef.current - 70}`, proceso: defecto.proceso || 'Sin clasificar',
      fecha: '2026-10-18', estado: 'Abierta',
    }]);
    setModalDefecto(false);
    setDefecto({ lote: '', tipo: '', proceso: '' });
    avisar(`Defecto DEF-${seqDef.current} vinculado al lote ${defecto.lote}.`);
  };

  const crearReproceso = () => {
    if (!reproceso.lote.trim() || !reproceso.motivo.trim() || !reproceso.responsable.trim()) {
      avisar('Completa lote, motivo y responsable del reproceso.');
      return;
    }
    seqRpr.current += 1;
    setReprocesos(prev => [...prev, {
      id: `RPR-${seqRpr.current}`, lote: reproceso.lote, orden: 'OF-1042', motivo: reproceso.motivo.trim(),
      responsable: reproceso.responsable.trim(), resultado: 'En proceso', fecha: '2026-10-18', costo: 0,
    }]);
    setModalReproceso(false);
    setReproceso({ lote: '', motivo: '', responsable: '' });
    avisar(`Reproceso RPR-${seqRpr.current} registrado y pendiente de autorización (EXC).`);
  };

  const bloquearLote = () => {
    if (!cuarentena.lote.trim() || !cuarentena.motivo.trim()) {
      avisar('Selecciona el lote y el motivo de la cuarentena.');
      return;
    }
    seqCua.current += 1;
    setCuarentenas(prev => [{
      id: `CUA-${seqCua.current}`, lote: cuarentena.lote, motivo: cuarentena.motivo.trim(),
      fechaInicio: '2026-10-18', ubicacion: cuarentena.ubicacion, decision: 'Pendiente', estado: 'En cuarentena',
    }, ...prev]);
    setLotes(prev => prev.map(l => l.id === cuarentena.lote ? { ...l, estado: 'Cuarentena' } : l));
    setModalCuarentena(false);
    setCuarentena({ lote: '', motivo: '', ubicacion: 'BOD-CUA-A1' });
    avisar(`Lote ${cuarentena.lote} bloqueado en cuarentena. Su consumo y entrega quedan impedidos.`);
  };

  const decidirCuarentena = (id: string, decision: 'Liberado' | 'Rechazado') => {
    setCuarentenas(prev => prev.map(c =>
      c.id === id ? { ...c, decision, fechaDecision: '2026-10-18', estado: 'Cerrada' } : c));
    const cua = cuarentenas.find(c => c.id === id);
    if (cua) {
      setLotes(prev => prev.map(l =>
        l.id === cua.lote ? { ...l, estado: decision === 'Liberado' ? 'Liberado' : 'Rechazado' } : l));
    }
    avisar(`Cuarentena ${id}: decisión de ${decision === 'Liberado' ? 'liberación' : 'rechazo'} registrada con evidencia.`);
  };

  const iniciarRetiro = () => {
    const cantidad = Number(retiro.cantidad) || 0;
    if (!retiro.producto.trim() || !retiro.lote.trim() || cantidad <= 0) {
      avisar('Completa producto, lote y cantidad del retiro.');
      return;
    }
    const id = `RET-${String(5 + retiros.filter(r => r.id.startsWith('RET-')).length).padStart(3, '0')}`;
    setRetiros(prev => [{
      id, producto: retiro.producto.trim(), lotes: retiro.lote.trim(),
      alcance: `${fmtNum(cantidad)} und · alcance por confirmar`, fecha: '2026-10-18',
      motivo: retiro.motivo.trim() || 'Motivo en documentación', criticidad: retiro.criticidad as Retiro['criticidad'],
      notificados: 0, devueltos: 0, total: cantidad, estado: 'En curso',
    }, ...prev]);
    setModalRetiro(false);
    setRetiro({ producto: '', lote: '', cantidad: '', motivo: '', criticidad: 'Medio' });
    avisar(`Retiro ${id} iniciado. Se calcula el alcance afectado y se preparan las notificaciones.`);
  };

  const registrarDevolucion = (id: string) => {
    setRetiros(prev => prev.map(r => {
      if (r.id !== id) return r;
      const devueltos = Math.min(r.devueltos + 250, r.total);
      return { ...r, devueltos };
    }));
    avisar(`Devolución registrada en ${id} (250 und). La efectividad se recalcula en tiempo real.`);
  };

  const enviarNotificacion = () => {
    if (!notif.evento.trim() || !notif.destino.trim()) {
      avisar('Completa evento y destino de la notificación.');
      return;
    }
    seqNot.current += 1;
    setNotificaciones(prev => [{
      id: `NOT-${seqNot.current}`, evento: notif.evento.trim(), destino: notif.destino.trim(),
      canal: notif.canal as NotificacionTra['canal'], fecha: '2026-10-18',
      criticidad: notif.criticidad as NotificacionTra['criticidad'], estado: 'Enviada',
    }, ...prev]);
    setModalNotif(false);
    setNotif({ evento: '', destino: '', canal: 'Sistema', criticidad: 'Medio' });
    avisar(`Notificación enviada a ${notif.destino} por canal ${notif.canal}.`);
  };

  /* ------------------------------ indicadores ------------------------------ */
  const enCuarentena = cuarentenas.filter(c => c.estado === 'En cuarentena').length;
  const retirosActivos = retiros.filter(r => r.estado === 'En curso').length;
  const totalDevuelto = retiros.reduce((a, r) => a + r.devueltos, 0);
  const totalRetiro = retiros.reduce((a, r) => a + r.total, 0);
  const efectividad = totalRetiro > 0 ? totalDevuelto / totalRetiro : 0;

  /* ------------------------------ expediente ------------------------------ */
  const expLote = lotes.find(l => l.id === expSel);
  const expRecepciones = recepciones.filter(r => r.lote === expSel);
  const expComponentes = COMPONENTES.filter(c => c.pt === expSel);
  const expDestinos = COMPONENTES.filter(c => c.mp === expSel);
  const expOperaciones = OPERACIONES.filter(o => o.lote === expSel);
  const expDefectos = defectos.filter(d => d.lote === expSel);
  const expReprocesos = reprocesos.filter(r => r.lote === expSel);
  const expConsumos = CONSUMOS.filter(c => c.lote === expSel);

  const ordenes = Array.from(new Set(OPERACIONES.map(o => o.orden))).sort();

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('tra')} funcionalidades · Fase ${MOD.fase}`}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Lotes trazados" value={fmtNum(lotes.length)} sub="MP, semielaborados y terminados" tone="info" />
        <StatCard label="En cuarentena" value={fmtNum(enCuarentena)} sub="Bloqueados para consumo y entrega" tone="warn" />
        <StatCard label="Retiros en curso" value={fmtNum(retirosActivos)} sub={`${retiros.length} retiros registrados`} tone="danger" />
        <StatCard label="Efectividad de retiros" value={fmtPct(efectividad, 0)} sub="Unidades devueltas / alcance" tone="ok" />
      </div>

      {mensaje && (
        <div role="status" className="rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
          {mensaje}
        </div>
      )}

      <Tabs tabs={PESTANAS} active={tab} onChange={setTab} />

      {/* ------------------------------ Resumen ------------------------------ */}
      {tab === 'resumen' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Objetivo y alcance">
            <p className="text-xs leading-relaxed text-gray-700">
              Conocer el origen, transformación y destino de materias primas, lotes y productos terminados, y
              permitir investigaciones y retiros rápidos.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Incluye identificación, genealogía, relación con órdenes y recursos, trazabilidad hacia atrás y
              adelante, consumos, defectos, reprocesos, cuarentena, retiro y expediente de lote.
            </p>
          </Card>
          <Card title="Actores">
            <p className="text-xs leading-relaxed text-gray-700">
              Calidad, producción, almacén, logística, auditoría y dirección.
            </p>
          </Card>
          <Card title="Reglas de negocio">
            <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
              <li>Todo producto trazado debe tener lote o serie en cada movimiento.</li>
              <li>Un lote en cuarentena no puede consumirse ni entregarse.</li>
              <li>Un retiro debe identificar todo el alcance afectado.</li>
              <li>Los registros de trazabilidad no se eliminan.</li>
              <li>Toda excepción debe quedar vinculada al lote.</li>
              <li>La información debe ser accesible para auditoría.</li>
            </ul>
          </Card>
          <Card title="Integraciones">
            <ul className="grid gap-1 text-xs text-gray-700 sm:grid-cols-2">
              <li>🛒 Compras: origen y proveedor</li>
              <li>📦 Inventario: movimientos y existencias</li>
              <li>🏭 Producción: consumo, operaciones y producción</li>
              <li>✅ Calidad: controles, defectos y cuarentena</li>
              <li>🚚 Logística: entregas y clientes</li>
              <li>💰 Costos: valor del lote</li>
            </ul>
          </Card>
          <Card title="Reportes">
            <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
              <li>Genealogía de lote o serie.</li>
              <li>Trazabilidad hacia atrás y adelante.</li>
              <li>Consumos por orden y lote.</li>
              <li>Defectos y reprocesos por lote.</li>
              <li>Lotes en cuarentena.</li>
              <li>Alcance y efectividad de retiros.</li>
            </ul>
          </Card>
          <Card title="Criterios de aceptación">
            <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
              <li>Cualquier lote puede rastrearse hasta su origen y destino.</li>
              <li>La cuarentena bloquea el uso.</li>
              <li>Un retiro identifica todos los productos afectados.</li>
              <li>El expediente de lote está completo y es auditable.</li>
              <li>Los reportes coinciden con los movimientos reales.</li>
            </ul>
          </Card>
        </div>
      )}

      {/* ------------------------------ Identificación y genealogía ------------------------------ */}
      {tab === 'identificacion' && (
        <div className="space-y-4">
          <FunctionBlock code="TRA-01">
            <Toolbar>
              <input className={INPUT} placeholder="Buscar lote, producto, proveedor u orden..." value={qLote} onChange={e => setQLote(e.target.value)} />
              <button className={BTN_PRIMARY} onClick={() => setModalIdent(true)}>+ Asignar identificador</button>
              <span className="ml-auto text-xs text-gray-500">{lotesVisibles.length} de {lotes.length} lotes</span>
            </Toolbar>
            <DataTable footer={`${lotesVisibles.length} lotes con identificación única conservada en todos los movimientos`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Identificador</Th><Th>Producto</Th><Th align="center">Tipo</Th><Th>Fecha</Th>
                  <Th align="right">Cantidad</Th><Th align="center">Estado</Th><Th>Origen / Destino</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lotesVisibles.map(l => (
                  <tr key={l.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{l.id}</span></Td>
                    <Td>{l.producto}</Td>
                    <Td align="center"><StatusBadge label={l.tipo} tone={toneTipo(l.tipo)} /></Td>
                    <Td>{fmtFecha(l.fecha)}</Td>
                    <Td align="right"><span className="num-col">{fmtNum(l.cantidad)} {l.unidad}</span></Td>
                    <Td align="center"><StatusBadge label={l.estado} tone={toneEstado(l.estado)} /></Td>
                    <Td className="text-gray-500">{l.proveedor ?? l.orden ?? l.cliente ?? '—'}</Td>
                  </tr>
                ))}
                {lotesVisibles.length === 0 && <EmptyRow colSpan={7} text="No hay lotes que coincidan con la búsqueda." />}
              </tbody>
            </DataTable>
            {modalIdent && (
              <Modal title="Asignar identificador único" onClose={() => setModalIdent(false)}>
                <div className="space-y-3 p-5">
                  <label className="block text-xs text-gray-600">
                    Producto
                    <input className={INPUT} data-initial-focus value={ident.producto} onChange={e => setIdent({ ...ident, producto: e.target.value })} />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      Tipo
                      <select className={INPUT} value={ident.tipo} onChange={e => setIdent({ ...ident, tipo: e.target.value as TipoLote })}>
                        <option value="MP">MP — Materia prima</option>
                        <option value="SEMI">SEMI — Semielaborado</option>
                        <option value="PT">PT — Producto terminado</option>
                      </select>
                    </label>
                    <label className="block text-xs text-gray-600">
                      Cantidad
                      <input className={INPUT} type="number" value={ident.cantidad} onChange={e => setIdent({ ...ident, cantidad: e.target.value })} />
                    </label>
                  </div>
                  <label className="block text-xs text-gray-600">
                    Bodega
                    <select className={INPUT} value={ident.bodega} onChange={e => setIdent({ ...ident, bodega: e.target.value })}>
                      <option value="BOD-01">BOD-01 — Materias primas</option>
                      <option value="BOD-02">BOD-02 — Producto terminado</option>
                      <option value="BOD-CUA">BOD-CUA — Cuarentena</option>
                      <option value="BOD-DEV">BOD-DEV — Devoluciones</option>
                    </select>
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalIdent(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={crearIdentificador}>Asignar identificador</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="TRA-02">
            <Toolbar>
              <input className={INPUT} placeholder="Buscar recepción, lote o proveedor..." value={qLote} onChange={e => setQLote(e.target.value)} />
              <select className={INPUT} value={fResultado} onChange={e => setFResultado(e.target.value)}>
                <option value="">Todos los resultados</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Aprobado con observación">Aprobado con observación</option>
                <option value="Rechazado">Rechazado</option>
              </select>
              <button className={BTN_PRIMARY} onClick={() => setModalRecepcion(true)}>+ Registrar recepción</button>
            </Toolbar>
            <DataTable footer={`${recepcionesVisibles.length} recepciones con proveedor, lote y control de calidad vinculados`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Recepción</Th><Th>Lote</Th><Th>Proveedor</Th><Th>Fecha</Th><Th>OC</Th>
                  <Th align="right">Cantidad</Th><Th>Control</Th><Th align="center">Resultado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recepcionesVisibles.map(r => (
                  <tr key={r.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
                    <Td><span className="font-mono text-gray-600">{r.lote}</span></Td>
                    <Td>{r.proveedor}</Td>
                    <Td>{fmtFecha(r.fecha)}</Td>
                    <Td><span className="font-mono text-gray-500">{r.oc}</span></Td>
                    <Td align="right"><span className="num-col">{fmtNum(r.cantidad)} {r.unidad}</span></Td>
                    <Td><span className="font-mono text-gray-500">{r.control}</span></Td>
                    <Td align="center"><StatusBadge label={r.resultado} tone={toneResultado(r.resultado)} /></Td>
                  </tr>
                ))}
                {recepcionesVisibles.length === 0 && <EmptyRow colSpan={8} text="No hay recepciones que coincidan con los filtros." />}
              </tbody>
            </DataTable>
            {modalRecepcion && (
              <Modal title="Registrar recepción de materia prima" onClose={() => setModalRecepcion(false)}>
                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      Lote
                      <input className={INPUT} data-initial-focus value={recepcion.lote} onChange={e => setRecepcion({ ...recepcion, lote: e.target.value })} placeholder="L-2026-XXX" />
                    </label>
                    <label className="block text-xs text-gray-600">
                      Proveedor
                      <input className={INPUT} value={recepcion.proveedor} onChange={e => setRecepcion({ ...recepcion, proveedor: e.target.value })} />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      Cantidad
                      <input className={INPUT} type="number" value={recepcion.cantidad} onChange={e => setRecepcion({ ...recepcion, cantidad: e.target.value })} />
                    </label>
                    <label className="block text-xs text-gray-600">
                      Resultado del control
                      <select className={INPUT} value={recepcion.resultado} onChange={e => setRecepcion({ ...recepcion, resultado: e.target.value })}>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Aprobado con observación">Aprobado con observación</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalRecepcion(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={registrarRecepcion}>Registrar</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="TRA-03">
            <Toolbar>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                Lote terminado
                <select className={INPUT} value={ptSel} onChange={e => setPtSel(e.target.value)}>
                  {Array.from(new Set(COMPONENTES.map(c => c.pt))).map(pt => <option key={pt} value={pt}>{pt}</option>)}
                </select>
              </label>
              <span className="text-xs text-gray-500">{ptLote?.producto ?? '—'}</span>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Genealogía de ${ptSel} reconstruida con ${componentesPt.length} materiales, operaciones y controles.`)}>
                Reconstruir genealogía completa
              </button>
            </Toolbar>
            <DataTable footer={`${componentesPt.length} materiales que intervinieron en ${ptSel}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Material</Th><Th>Lote</Th><Th align="right">Cantidad</Th><Th>Recepción</Th><Th>Proveedor</Th><Th>Control</Th><Th align="center">Resultado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {componentesPt.map(c => {
                  const rec = recepciones.find(r => r.id === c.recepcion);
                  return (
                    <tr key={`${c.pt}-${c.mp}`} className="hoverable">
                      <Td>{c.material}</Td>
                      <Td><span className="font-mono text-gray-600">{c.mp}</span></Td>
                      <Td align="right"><span className="num-col">{fmtNum(c.cantidad)} {c.unidad}</span></Td>
                      <Td><span className="font-mono text-gray-500">{c.recepcion}</span></Td>
                      <Td className="text-gray-500">{rec?.proveedor ?? '—'}</Td>
                      <Td><span className="font-mono text-gray-500">{rec?.control ?? '—'}</span></Td>
                      <Td align="center">{rec && <StatusBadge label={rec.resultado} tone={toneResultado(rec.resultado)} />}</Td>
                    </tr>
                  );
                })}
                {componentesPt.length === 0 && <EmptyRow colSpan={7} text="Este lote no tiene componentes registrados." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="TRA-04">
            <Toolbar>
              <input className={INPUT} placeholder="Buscar operación, operario o máquina..." value={qOper} onChange={e => setQOper(e.target.value)} />
              <select className={INPUT} value={fOrden} onChange={e => setFOrden(e.target.value)}>
                <option value="">Todas las órdenes</option>
                {ordenes.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Registro de operaciones exportado (${operacionesVisibles.length} filas) para auditoría de tiempos reales.`)}>
                Exportar registro
              </button>
            </Toolbar>
            <DataTable footer={`${operacionesVisibles.length} operaciones vinculadas a orden, operario, máquina y turno`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Operación</Th><Th>Orden</Th><Th>Actividad</Th><Th>Operario</Th><Th>Máquina</Th>
                  <Th align="center">Turno</Th><Th>Fecha</Th><Th align="center">Inicio</Th><Th align="center">Fin</Th><Th>Lote</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {operacionesVisibles.map(o => (
                  <tr key={o.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{o.id}</span></Td>
                    <Td><span className="font-mono text-gray-600">{o.orden}</span></Td>
                    <Td>{o.operacion}</Td>
                    <Td>{o.operario}</Td>
                    <Td><span className="font-mono text-gray-500">{o.maquina}</span></Td>
                    <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{o.turno}</span></Td>
                    <Td>{fmtFecha(o.fecha)}</Td>
                    <Td align="center" className="font-mono text-gray-600">{o.inicio}</Td>
                    <Td align="center" className="font-mono text-gray-600">{o.fin}</Td>
                    <Td><span className="font-mono text-gray-500">{o.lote}</span></Td>
                  </tr>
                ))}
                {operacionesVisibles.length === 0 && <EmptyRow colSpan={10} text="No hay operaciones que coincidan con los filtros." />}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {/* ------------------------------ Trazabilidad y consumos ------------------------------ */}
      {tab === 'trazabilidad' && (
        <div className="space-y-4">
          <FunctionBlock code="TRA-05">
            <Toolbar>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                Lote terminado
                <select className={INPUT} value={ptSel} onChange={e => setPtSel(e.target.value)}>
                  {Array.from(new Set(COMPONENTES.map(c => c.pt))).map(pt => <option key={pt} value={pt}>{pt}</option>)}
                </select>
              </label>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Árbol hacia atrás de ${ptSel} reconstruido: ${componentesPt.length} nodos de materiales, recepciones y controles.`)}>
                Reconstruir hacia atrás
              </button>
            </Toolbar>
            <Card title={`Árbol hacia atrás · ${ptSel} ${ptLote ? `(${ptLote.producto})` : ''}`} pad={false}>
              <ul className="divide-y divide-gray-50">
                <li className="flex items-center gap-2 px-4 py-2.5 text-xs">
                  <span className="font-mono font-semibold text-petroleum-700">{ptSel}</span>
                  <span className="text-gray-700">{ptLote?.producto}</span>
                  {ptLote && <StatusBadge label={ptLote.estado} tone={toneEstado(ptLote.estado)} />}
                </li>
                {componentesPt.map(c => {
                  const rec = recepciones.find(r => r.id === c.recepcion);
                  return (
                    <li key={`${c.pt}-${c.mp}`} className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs">
                      <span aria-hidden="true" className="pl-4 text-gray-300">└</span>
                      <span className="font-mono text-gray-600">{c.mp}</span>
                      <span className="text-gray-700">{c.material}</span>
                      <span className="font-mono text-gray-500">{fmtNum(c.cantidad)} {c.unidad}</span>
                      <span className="text-gray-400">← {rec?.proveedor ?? '—'} · {rec?.control ?? '—'}</span>
                      {rec && <StatusBadge label={rec.resultado} tone={toneResultado(rec.resultado)} />}
                    </li>
                  );
                })}
                {componentesPt.length === 0 && <li className="px-4 py-6 text-center text-xs text-gray-500">Sin componentes registrados para este lote.</li>}
              </ul>
            </Card>
          </FunctionBlock>

          <FunctionBlock code="TRA-06">
            <Toolbar>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                Lote o material
                <select className={INPUT} value={mpSel} onChange={e => setMpSel(e.target.value)}>
                  {Array.from(new Set(COMPONENTES.map(c => c.mp))).map(mp => <option key={mp} value={mp}>{mp}</option>)}
                </select>
              </label>
              <span className="text-xs text-gray-500">{mpLote?.producto ?? '—'}</span>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Destinos de ${mpSel} identificados: ${destinosMp.length} lotes terminados y sus entregas.`)}>
                Identificar destinos
              </button>
            </Toolbar>
            <Card title={`Trazabilidad hacia adelante · ${mpSel} ${mpLote ? `(${mpLote.producto})` : ''}`} pad={false}>
              <ul className="divide-y divide-gray-50">
                <li className="flex items-center gap-2 px-4 py-2.5 text-xs">
                  <span className="font-mono font-semibold text-petroleum-700">{mpSel}</span>
                  <span className="text-gray-700">{mpLote?.producto}</span>
                  {mpLote?.proveedor && <span className="text-gray-400">· {mpLote.proveedor}</span>}
                </li>
                {destinosMp.map(c => {
                  const destino = lotes.find(l => l.id === c.pt);
                  return (
                    <li key={`${c.mp}-${c.pt}`} className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs">
                      <span aria-hidden="true" className="pl-4 text-gray-300">└</span>
                      <span className="font-mono text-gray-600">{c.pt}</span>
                      <span className="text-gray-700">{destino?.producto ?? '—'}</span>
                      <span className="font-mono text-gray-500">{fmtNum(c.cantidad)} {c.unidad}</span>
                      <span className="text-gray-400">→ {destino?.cliente ?? 'Inventario interno'}</span>
                      {destino && <StatusBadge label={destino.estado} tone={toneEstado(destino.estado)} />}
                    </li>
                  );
                })}
                {destinosMp.length === 0 && <li className="px-4 py-6 text-center text-xs text-gray-500">Este material aún no fue consumido por ningún lote terminado.</li>}
              </ul>
            </Card>
          </FunctionBlock>

          <FunctionBlock code="TRA-07">
            <Toolbar>
              <input className={INPUT} placeholder="Buscar consumo, material o lote..." value={qConsumo} onChange={e => setQConsumo(e.target.value)} />
              <select className={INPUT} value={fConsumoOrden} onChange={e => setFConsumoOrden(e.target.value)}>
                <option value="">Todas las órdenes</option>
                {ordenes.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Historial de consumos exportado (${consumosVisibles.length} registros con mermas y ajustes).`)}>
                Exportar consumos
              </button>
            </Toolbar>
            <DataTable footer={`${consumosVisibles.length} registros de consumo real vs. teórico con mermas y ajustes`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Registro</Th><Th>Orden</Th><Th>Lote</Th><Th>Material</Th>
                  <Th align="right">Teórico</Th><Th align="right">Real</Th><Th align="right">Merma</Th><Th align="right">Ajuste</Th><Th>Fecha</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {consumosVisibles.map(c => (
                  <tr key={c.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
                    <Td><span className="font-mono text-gray-600">{c.orden}</span></Td>
                    <Td><span className="font-mono text-gray-500">{c.lote}</span></Td>
                    <Td>{c.material}</Td>
                    <Td align="right"><span className="num-col">{fmtNum(c.teorico)} {c.unidad}</span></Td>
                    <Td align="right"><span className="num-col">{fmtNum(c.real)} {c.unidad}</span></Td>
                    <Td align="right"><span className={`num-col ${c.merma > 0 ? 'text-red-600' : ''}`}>{fmtNum(c.merma)} {c.unidad}</span></Td>
                    <Td align="right"><span className={`num-col ${c.ajuste < 0 ? 'text-amber-600' : c.ajuste > 0 ? 'text-petroleum-700' : ''}`}>{fmtNum(c.ajuste)} {c.unidad}</span></Td>
                    <Td>{fmtFecha(c.fecha)}</Td>
                  </tr>
                ))}
                {consumosVisibles.length === 0 && <EmptyRow colSpan={9} text="No hay consumos que coincidan con los filtros." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="TRA-08">
            <Toolbar>
              <select className={INPUT} value={fDefecto} onChange={e => setFDefecto(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="Abierta">Abierta</option>
                <option value="En análisis">En análisis</option>
                <option value="Cerrada">Cerrada</option>
              </select>
              <button className={BTN_PRIMARY} onClick={() => setModalDefecto(true)}>+ Vincular defecto a lote</button>
            </Toolbar>
            <DataTable footer={`${defectosVisibles.length} defectos vinculados a lote, orden y proceso`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Defecto</Th><Th>Lote</Th><Th>Orden</Th><Th>Tipo</Th><Th>No conformidad</Th><Th>Proceso</Th><Th>Fecha</Th><Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {defectosVisibles.map(d => (
                  <tr key={d.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{d.id}</span></Td>
                    <Td><span className="font-mono text-gray-500">{d.lote}</span></Td>
                    <Td><span className="font-mono text-gray-500">{d.orden}</span></Td>
                    <Td>{d.tipo}</Td>
                    <Td><span className="font-mono text-gray-500">{d.nc}</span></Td>
                    <Td>{d.proceso}</Td>
                    <Td>{fmtFecha(d.fecha)}</Td>
                    <Td align="center">
                      <StatusBadge label={d.estado} tone={d.estado === 'Cerrada' ? 'green' : d.estado === 'En análisis' ? 'amber' : 'red'} />
                    </Td>
                  </tr>
                ))}
                {defectosVisibles.length === 0 && <EmptyRow colSpan={8} text="No hay defectos en el estado seleccionado." />}
              </tbody>
            </DataTable>
            {modalDefecto && (
              <Modal title="Vincular defecto a un lote" onClose={() => setModalDefecto(false)}>
                <div className="space-y-3 p-5">
                  <label className="block text-xs text-gray-600">
                    Lote
                    <select className={INPUT} data-initial-focus value={defecto.lote} onChange={e => setDefecto({ ...defecto, lote: e.target.value })}>
                      <option value="">Seleccionar lote...</option>
                      {lotes.map(l => <option key={l.id} value={l.id}>{l.id} — {l.producto}</option>)}
                    </select>
                  </label>
                  <label className="block text-xs text-gray-600">
                    Tipo de defecto
                    <input className={INPUT} value={defecto.tipo} onChange={e => setDefecto({ ...defecto, tipo: e.target.value })} placeholder="Ej.: humedad fuera de rango" />
                  </label>
                  <label className="block text-xs text-gray-600">
                    Proceso
                    <input className={INPUT} value={defecto.proceso} onChange={e => setDefecto({ ...defecto, proceso: e.target.value })} placeholder="Ej.: secado" />
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalDefecto(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={registrarDefecto}>Vincular defecto</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="TRA-09">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => setModalReproceso(true)}>+ Registrar reproceso</button>
              <span className="ml-auto text-xs text-gray-500">{reprocesos.length} reprocesos con motivo, responsable y resultado</span>
            </Toolbar>
            <DataTable footer={`Costo total de reprocesos: ${fmtMoney(reprocesos.reduce((a, r) => a + r.costo, 0))}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Reproceso</Th><Th>Lote</Th><Th>Orden</Th><Th>Motivo</Th><Th>Responsable</Th><Th align="center">Resultado</Th><Th align="right">Costo</Th><Th>Fecha</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reprocesos.map(r => (
                  <tr key={r.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
                    <Td><span className="font-mono text-gray-500">{r.lote}</span></Td>
                    <Td><span className="font-mono text-gray-500">{r.orden}</span></Td>
                    <Td>{r.motivo}</Td>
                    <Td>{r.responsable}</Td>
                    <Td align="center">
                      <StatusBadge label={r.resultado} tone={r.resultado === 'Liberado' ? 'green' : r.resultado === 'Rechazado' ? 'red' : 'blue'} />
                    </Td>
                    <Td align="right"><span className="num-col">{fmtMoney(r.costo)}</span></Td>
                    <Td>{fmtFecha(r.fecha)}</Td>
                  </tr>
                ))}
                {reprocesos.length === 0 && <EmptyRow colSpan={8} text="Sin reprocesos registrados." />}
              </tbody>
            </DataTable>
            {modalReproceso && (
              <Modal title="Registrar reproceso" onClose={() => setModalReproceso(false)}>
                <div className="space-y-3 p-5">
                  <label className="block text-xs text-gray-600">
                    Lote
                    <select className={INPUT} data-initial-focus value={reproceso.lote} onChange={e => setReproceso({ ...reproceso, lote: e.target.value })}>
                      <option value="">Seleccionar lote...</option>
                      {lotes.map(l => <option key={l.id} value={l.id}>{l.id} — {l.producto}</option>)}
                    </select>
                  </label>
                  <label className="block text-xs text-gray-600">
                    Motivo
                    <input className={INPUT} value={reproceso.motivo} onChange={e => setReproceso({ ...reproceso, motivo: e.target.value })} placeholder="Ej.: re-secado por humedad" />
                  </label>
                  <label className="block text-xs text-gray-600">
                    Responsable
                    <input className={INPUT} value={reproceso.responsable} onChange={e => setReproceso({ ...reproceso, responsable: e.target.value })} />
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalReproceso(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={crearReproceso}>Registrar reproceso</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>
        </div>
      )}

      {/* ------------------------------ Cuarentena y retiro ------------------------------ */}
      {tab === 'cuarentena' && (
        <div className="space-y-4">
          <FunctionBlock code="TRA-10">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => setModalCuarentena(true)}>+ Bloquear lote en cuarentena</button>
              <span className="ml-auto text-xs text-gray-500">{enCuarentena} cuarentenas activas</span>
            </Toolbar>
            <DataTable footer={`${cuarentenas.length} cuarentenas con ubicación y decisión registrada`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Cuarentena</Th><Th>Lote</Th><Th>Motivo</Th><Th>Inicio</Th><Th>Ubicación</Th><Th align="center">Decisión</Th><Th align="center">Estado</Th><Th align="center">Acciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cuarentenas.map(c => (
                  <tr key={c.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
                    <Td><span className="font-mono text-gray-500">{c.lote}</span></Td>
                    <Td>{c.motivo}</Td>
                    <Td>{fmtFecha(c.fechaInicio)}</Td>
                    <Td><span className="font-mono text-gray-500">{c.ubicacion}</span></Td>
                    <Td align="center">
                      {c.decision === 'Pendiente'
                        ? <span className="text-gray-400">Pendiente</span>
                        : <StatusBadge label={c.decision ?? '—'} tone={c.decision === 'Liberado' ? 'green' : 'red'} />}
                    </Td>
                    <Td align="center">
                      <StatusBadge label={c.estado} tone={c.estado === 'En cuarentena' ? 'amber' : 'gray'} />
                    </Td>
                    <Td align="center">
                      {c.estado === 'En cuarentena' ? (
                        <span className="flex justify-center gap-1.5">
                          <button className={BTN_PRIMARY} onClick={() => decidirCuarentena(c.id, 'Liberado')}>Liberar</button>
                          <button className={BTN_DANGER} onClick={() => decidirCuarentena(c.id, 'Rechazado')}>Rechazar</button>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Decisión: {c.fechaDecision ? fmtFecha(c.fechaDecision) : '—'}</span>
                      )}
                    </Td>
                  </tr>
                ))}
                {cuarentenas.length === 0 && <EmptyRow colSpan={8} text="Sin cuarentenas registradas." />}
              </tbody>
            </DataTable>
            {modalCuarentena && (
              <Modal title="Bloquear lote en cuarentena" onClose={() => setModalCuarentena(false)}>
                <div className="space-y-3 p-5">
                  <label className="block text-xs text-gray-600">
                    Lote
                    <select className={INPUT} data-initial-focus value={cuarentena.lote} onChange={e => setCuarentena({ ...cuarentena, lote: e.target.value })}>
                      <option value="">Seleccionar lote...</option>
                      {lotes.map(l => <option key={l.id} value={l.id}>{l.id} — {l.producto}</option>)}
                    </select>
                  </label>
                  <label className="block text-xs text-gray-600">
                    Motivo
                    <input className={INPUT} value={cuarentena.motivo} onChange={e => setCuarentena({ ...cuarentena, motivo: e.target.value })} placeholder="Ej.: humedad fuera de rango" />
                  </label>
                  <label className="block text-xs text-gray-600">
                    Ubicación
                    <select className={INPUT} value={cuarentena.ubicacion} onChange={e => setCuarentena({ ...cuarentena, ubicacion: e.target.value })}>
                      <option value="BOD-CUA-A1">BOD-CUA-A1</option>
                      <option value="BOD-CUA-A2">BOD-CUA-A2</option>
                      <option value="BOD-CUA-B1">BOD-CUA-B1</option>
                      <option value="BOD-CUA-C1">BOD-CUA-C1</option>
                    </select>
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalCuarentena(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={bloquearLote}>Bloquear lote</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="TRA-11">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => setModalRetiro(true)}>+ Iniciar retiro (recall)</button>
              <span className="ml-auto text-xs text-gray-500">{retirosActivos} retiros en curso</span>
            </Toolbar>
            <DataTable footer={`Efectividad global: ${fmtPct(efectividad, 0)} (${fmtNum(totalDevuelto)} de ${fmtNum(totalRetiro)} unidades)`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Retiro</Th><Th>Producto</Th><Th>Lotes</Th><Th>Alcance</Th><Th>Motivo</Th><Th align="center">Criticidad</Th>
                  <Th align="right">Notificados</Th><Th align="right">Devueltos / Total</Th><Th align="right">Efectividad</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {retiros.map(r => (
                  <tr key={r.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
                    <Td>{r.producto}</Td>
                    <Td><span className="font-mono text-gray-500">{r.lotes}</span></Td>
                    <Td className="text-gray-500">{r.alcance}</Td>
                    <Td>{r.motivo}</Td>
                    <Td align="center"><StatusBadge label={r.criticidad} tone={toneCriticidad(r.criticidad)} /></Td>
                    <Td align="right"><span className="num-col">{fmtNum(r.notificados)}</span></Td>
                    <Td align="right"><span className="num-col">{fmtNum(r.devueltos)} / {fmtNum(r.total)}</span></Td>
                    <Td align="right"><span className="num-col">{fmtPct(r.total > 0 ? r.devueltos / r.total : 0, 0)}</span></Td>
                    <Td align="center">
                      <StatusBadge label={r.estado} tone={r.estado === 'Cerrado' ? 'green' : 'red'} />
                    </Td>
                    <Td align="center">
                      {r.estado === 'En curso'
                        ? <button className={BTN_SECONDARY} onClick={() => registrarDevolucion(r.id)}>Registrar devolución</button>
                        : <span className="text-xs text-gray-400">Completado</span>}
                    </Td>
                  </tr>
                ))}
                {retiros.length === 0 && <EmptyRow colSpan={11} text="Sin retiros registrados." />}
              </tbody>
            </DataTable>
            {modalRetiro && (
              <Modal title="Iniciar retiro de producto (recall)" onClose={() => setModalRetiro(false)} wide>
                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      Producto
                      <input className={INPUT} data-initial-focus value={retiro.producto} onChange={e => setRetiro({ ...retiro, producto: e.target.value })} />
                    </label>
                    <label className="block text-xs text-gray-600">
                      Lote
                      <input className={INPUT} value={retiro.lote} onChange={e => setRetiro({ ...retiro, lote: e.target.value })} placeholder="L-2026-XXX" />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      Cantidad afectada (und)
                      <input className={INPUT} type="number" value={retiro.cantidad} onChange={e => setRetiro({ ...retiro, cantidad: e.target.value })} />
                    </label>
                    <label className="block text-xs text-gray-600">
                      Criticidad
                      <select className={INPUT} value={retiro.criticidad} onChange={e => setRetiro({ ...retiro, criticidad: e.target.value })}>
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                        <option value="Crítico">Crítico</option>
                      </select>
                    </label>
                  </div>
                  <label className="block text-xs text-gray-600">
                    Motivo
                    <input className={INPUT} value={retiro.motivo} onChange={e => setRetiro({ ...retiro, motivo: e.target.value })} placeholder="Ej.: partículas extrañas en control de calidad" />
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalRetiro(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={iniciarRetiro}>Iniciar retiro</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="TRA-12">
            <Toolbar>
              <select className={INPUT} value={fCanal} onChange={e => setFCanal(e.target.value)}>
                <option value="">Todos los canales</option>
                <option value="Correo">Correo</option>
                <option value="Sistema">Sistema</option>
                <option value="SMS">SMS</option>
                <option value="Reporte diario">Reporte diario</option>
              </select>
              <button className={BTN_PRIMARY} onClick={() => setModalNotif(true)}>+ Enviar notificación</button>
            </Toolbar>
            <DataTable footer={`${notificacionesVisibles.length} avisos a calidad, producción, logística y clientes según evento y criticidad`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Notificación</Th><Th>Evento</Th><Th>Destino</Th><Th align="center">Canal</Th><Th align="center">Criticidad</Th><Th>Fecha</Th><Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notificacionesVisibles.map(n => (
                  <tr key={n.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{n.id}</span></Td>
                    <Td>{n.evento}</Td>
                    <Td>{n.destino}</Td>
                    <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{n.canal}</span></Td>
                    <Td align="center"><StatusBadge label={n.criticidad} tone={toneCriticidad(n.criticidad)} /></Td>
                    <Td>{fmtFecha(n.fecha)}</Td>
                    <Td align="center"><StatusBadge label={n.estado} tone={n.estado === 'Leída' ? 'green' : 'blue'} /></Td>
                  </tr>
                ))}
                {notificacionesVisibles.length === 0 && <EmptyRow colSpan={7} text="No hay notificaciones en el canal seleccionado." />}
              </tbody>
            </DataTable>
            {modalNotif && (
              <Modal title="Enviar notificación de trazabilidad" onClose={() => setModalNotif(false)}>
                <div className="space-y-3 p-5">
                  <label className="block text-xs text-gray-600">
                    Evento
                    <input className={INPUT} data-initial-focus value={notif.evento} onChange={e => setNotif({ ...notif, evento: e.target.value })} placeholder="Ej.: cuarentena CUA-031" />
                  </label>
                  <label className="block text-xs text-gray-600">
                    Destino
                    <input className={INPUT} value={notif.destino} onChange={e => setNotif({ ...notif, destino: e.target.value })} placeholder="Ej.: Calidad" />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      Canal
                      <select className={INPUT} value={notif.canal} onChange={e => setNotif({ ...notif, canal: e.target.value })}>
                        <option value="Correo">Correo</option>
                        <option value="Sistema">Sistema</option>
                        <option value="SMS">SMS</option>
                        <option value="Reporte diario">Reporte diario</option>
                      </select>
                    </label>
                    <label className="block text-xs text-gray-600">
                      Criticidad
                      <select className={INPUT} value={notif.criticidad} onChange={e => setNotif({ ...notif, criticidad: e.target.value })}>
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                        <option value="Crítico">Crítico</option>
                      </select>
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalNotif(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={enviarNotificacion}>Enviar</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="TRA-13">
            <Toolbar>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                Lote
                <select className={INPUT} value={expSel} onChange={e => setExpSel(e.target.value)}>
                  {lotes.map(l => <option key={l.id} value={l.id}>{l.id} — {l.producto}</option>)}
                </select>
              </label>
              {expLote && <StatusBadge label={expLote.estado} tone={toneEstado(expLote.estado)} />}
              <button className={BTN_PRIMARY} onClick={() => avisar(`Expediente de ${expSel} consolidado y listo para auditoría (${expRecepciones.length + expComponentes.length + expOperaciones.length + expDefectos.length + expConsumos.length} registros).`)}>
                Generar expediente PDF
              </button>
            </Toolbar>
            <div className="grid gap-3 lg:grid-cols-3">
              <Card title="Origen y materiales">
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {expLote?.proveedor && <li>Proveedor: <span className="text-gray-500">{expLote.proveedor}</span></li>}
                  {expLote?.orden && <li>Orden: <span className="font-mono text-gray-500">{expLote.orden}</span></li>}
                  {expRecepciones.map(r => <li key={r.id}>Recepción <span className="font-mono text-gray-500">{r.id}</span> · {r.proveedor}</li>)}
                  {expComponentes.map(c => <li key={`${c.pt}-${c.mp}`}>Material <span className="font-mono text-gray-500">{c.mp}</span> · {c.material} · {fmtNum(c.cantidad)} {c.unidad}</li>)}
                  {expRecepciones.length + expComponentes.length === 0 && <li className="text-gray-400">Sin registros de origen.</li>}
                </ul>
              </Card>
              <Card title="Proceso y controles">
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {expOperaciones.map(o => <li key={o.id}>{o.operacion} · {o.operario} · <span className="font-mono text-gray-500">{o.maquina}</span> · {o.turno}</li>)}
                  {expDefectos.map(d => <li key={d.id}>Defecto <span className="font-mono text-gray-500">{d.id}</span> · {d.tipo} · {d.nc}</li>)}
                  {expReprocesos.map(r => <li key={r.id}>Reproceso <span className="font-mono text-gray-500">{r.id}</span> · {r.motivo} · {r.resultado}</li>)}
                  {expOperaciones.length + expDefectos.length + expReprocesos.length === 0 && <li className="text-gray-400">Sin registros de proceso.</li>}
                </ul>
              </Card>
              <Card title="Movimientos y destino">
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {expConsumos.map(c => <li key={c.id}>Consumo <span className="font-mono text-gray-500">{c.id}</span> · real {fmtNum(c.real)} vs. teórico {fmtNum(c.teorico)} {c.unidad}</li>)}
                  {expDestinos.map(c => {
                    const destino = lotes.find(l => l.id === c.pt);
                    return <li key={`${c.mp}-${c.pt}`}>Destino <span className="font-mono text-gray-500">{c.pt}</span> · {destino?.cliente ?? 'Inventario'}</li>;
                  })}
                  {expLote?.cliente && <li>Cliente: <span className="text-gray-500">{expLote.cliente}</span></li>}
                  {expConsumos.length + expDestinos.length === 0 && !expLote?.cliente && <li className="text-gray-400">Sin registros de destino.</li>}
                </ul>
              </Card>
            </div>
          </FunctionBlock>
        </div>
      )}

      {/* ------------------------------ Reportes y auditoría ------------------------------ */}
      {tab === 'reportes' && (
        <div className="space-y-4">
          <FunctionBlock code="TRA-14">
            <Toolbar>
              <select className={INPUT} value={repSel} onChange={e => setRepSel(e.target.value)}>
                {REPORTES_TRA.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar('Reporte generado con evidencia para auditoría. Los registros incluyen usuario, fecha y hash de integridad.')}>
                Generar reporte
              </button>
            </Toolbar>
            <DataTable footer={`${REPORTES_TRA.length} reportes de trazabilidad, genealogía, consumos y retiros`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Código</Th><Th>Reporte</Th><Th align="center">Periodicidad</Th><Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {REPORTES_TRA.map(r => (
                  <tr key={r.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
                    <Td>{r.nombre}</Td>
                    <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{r.periodicidad}</span></Td>
                    <Td align="center">
                      <button className={BTN_SECONDARY} onClick={() => avisar(`Reporte «${r.nombre}» en preparación. Se enviará por el canal de auditoría configurado.`)}>
                        Ejecutar
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="TRA-15">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => avisar('Consulta histórica solicitada: el archivo inmutable de trazabilidad está disponible para auditoría.')}>
                Solicitar consulta histórica
              </button>
              <span className="ml-auto text-xs text-gray-500">Los registros de trazabilidad no se eliminan</span>
            </Toolbar>
            <DataTable footer={`Retención según ${RETENCION[0].politica} y políticas complementarias`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Tipo de registro</Th><Th align="center">Período de retención</Th><Th>Destino de archivo</Th><Th>Política</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RETENCION.map(r => (
                  <tr key={r.tipo} className="hoverable">
                    <Td>{r.tipo}</Td>
                    <Td align="center"><span className="rounded-full bg-petroleum-50 px-2 py-0.5 text-xs text-petroleum-700">{r.periodo}</span></Td>
                    <Td>{r.destino}</Td>
                    <Td><span className="font-mono text-gray-500">{r.politica}</span></Td>
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

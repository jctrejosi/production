import { useMemo, useRef, useState } from 'react';
import {
  BTN_DANGER, BTN_PRIMARY, BTN_SECONDARY, Card, DataTable, EmptyRow, FunctionBlock,
  INPUT, Modal, PageHeader, StatCard, StatusBadge, Tabs, Td, Th, Toolbar,
} from '../components/ui';
import { MODULOS, conteoModulo } from '../data/modules';
import { fmtFecha, fmtMoney, fmtNum, fmtPct } from '../lib/format';
import {
  APROBACIONES, BLOQUEOS, CAPAS, CAUSAS_RAIZ, DESPERDICIOS_EXC, DESVIACIONES,
  ESCALAMIENTOS, EXCEPCIONES_TEMPORALES, NO_CONFORMIDADES, REPORTES_EXC, REPROCESOS_EXC,
  TOLERANCIAS,
  type Aprobacion, type Bloqueo, type Capa, type CausaRaiz, type Criticidad,
  type Escalamiento, type ExcepcionTemporal, type NoConformidad, type ReprocesoExc,
} from '../data/exc';

const MOD = MODULOS.find(m => m.id === 'exc')!;

const PESTANAS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'registro', label: 'Registro y evaluación' },
  { id: 'bloqueos', label: 'Bloqueos, reprocesos y desperdicio' },
  { id: 'causa', label: 'Causa raíz y CAPA' },
  { id: 'aprobacion', label: 'Aprobaciones y escalamiento' },
  { id: 'reportes', label: 'Reportes' },
];

function toneCriticidad(c: Criticidad) {
  if (c === 'Crítica') return 'red' as const;
  if (c === 'Alta') return 'amber' as const;
  if (c === 'Media') return 'petroleum' as const;
  return 'blue' as const;
}

function toneEstadoNc(estado: NoConformidad['estado']) {
  if (estado === 'Cerrada') return 'green' as const;
  if (estado === 'En CAPA') return 'blue' as const;
  if (estado === 'En análisis') return 'amber' as const;
  return 'red' as const;
}

export default function EXC() {
  const [tab, setTab] = useState('resumen');
  const [mensaje, setMensaje] = useState('');

  const avisar = (texto: string) => {
    window.setTimeout(() => setMensaje(texto), 400);
    window.setTimeout(() => setMensaje(''), 4200);
  };

  /* ------------------------------ estado de datos ------------------------------ */
  const [ncs, setNcs] = useState<NoConformidad[]>(NO_CONFORMIDADES);
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>(BLOQUEOS);
  const [reprocesos, setReprocesos] = useState<ReprocesoExc[]>(REPROCESOS_EXC);
  const [causas, setCausas] = useState<CausaRaiz[]>(CAUSAS_RAIZ);
  const [capas, setCapas] = useState<Capa[]>(CAPAS);
  const [aprobaciones, setAprobaciones] = useState<Aprobacion[]>(APROBACIONES);
  const [excepciones, setExcepciones] = useState<ExcepcionTemporal[]>(EXCEPCIONES_TEMPORALES);
  const [escalamientos, setEscalamientos] = useState<Escalamiento[]>(ESCALAMIENTOS);

  /* ------------------------------ filtros ------------------------------ */
  const [fEstadoNc, setFEstadoNc] = useState('');
  const [fResultadoDesv, setFResultadoDesv] = useState('');
  const [fEstadoCapa, setFEstadoCapa] = useState('');
  const [fEstadoEsc, setFEstadoEsc] = useState('');
  const [repSel, setRepSel] = useState('REP-EXC-01');

  const ncsVisibles = useMemo(() => ncs.filter(n => !fEstadoNc || n.estado === fEstadoNc), [ncs, fEstadoNc]);
  const desviacionesVisibles = useMemo(() => DESVIACIONES.filter(d => !fResultadoDesv || d.resultado === fResultadoDesv), [fResultadoDesv]);
  const capasVisibles = useMemo(() => capas.filter(c => !fEstadoCapa || c.estado === fEstadoCapa), [capas, fEstadoCapa]);
  const escalamientosVisibles = useMemo(() => escalamientos.filter(e => !fEstadoEsc || e.estado === fEstadoEsc), [escalamientos, fEstadoEsc]);

  /* ------------------------------ evaluador de tolerancias (EXC-03) ------------------------------ */
  const [tolSel, setTolSel] = useState('TOL-331');
  const [valorEval, setValorEval] = useState('');
  const [resultadoEval, setResultadoEval] = useState<{ texto: string; dentro: boolean } | null>(null);

  const evaluarTolerancia = () => {
    const tol = TOLERANCIAS.find(t => t.id === tolSel);
    const valor = parseFloat(valorEval.replace(',', '.'));
    if (!tol || Number.isNaN(valor)) {
      avisar('Selecciona un parámetro e ingresa un valor numérico para evaluar.');
      return;
    }
    const min = parseFloat(tol.min.replace(',', '.'));
    const max = parseFloat(tol.max.replace(',', '.'));
    const dentro = valor >= min && valor <= max;
    setResultadoEval({ texto: `${valorEval} ${tol.unidad === '—' ? '' : tol.unidad} para «${tol.parametro}» (rango ${tol.min}–${tol.max})`, dentro });
    avisar(`Evaluación automática completada: el valor quedó ${dentro ? 'DENTRO' : 'FUERA'} del rango de tolerancia.`);
  };

  /* ------------------------------ modales ------------------------------ */
  const [modalNc, setModalNc] = useState(false);
  const [nc, setNc] = useState({ producto: '', lote: '', cantidad: '', proceso: '', origen: '', responsable: '' });
  const seqNc = useRef(447);

  const [modalBloqueo, setModalBloqueo] = useState(false);
  const [bloqueo, setBloqueo] = useState({ tipo: 'Lote' as Bloqueo['tipo'], referencia: '', motivo: '', responsable: '' });
  const seqBlq = useRef(507);

  const [modalReproceso, setModalReproceso] = useState(false);
  const [reproceso, setReproceso] = useState({ lote: '', producto: '', motivo: '', costo: '' });
  const seqRpr = useRef(119);

  const [modalCausa, setModalCausa] = useState(false);
  const [causa, setCausa] = useState({ nc: '', metodo: '5 porqués', causa: '' });
  const seqRca = useRef(119);

  const [modalCapa, setModalCapa] = useState(false);
  const [capa, setCapa] = useState({ nc: '', tipo: 'Correctiva' as Capa['tipo'], accion: '', responsable: '', fechaLimite: '' });
  const seqCapa = useRef(332);

  const [modalApr, setModalApr] = useState(false);
  const [apr, setApr] = useState({ tipo: 'Reproceso', referencia: '', nivel: 'Nivel 1 · Calidad' });
  const seqApr = useRef(107);

  const [modalExt, setModalExt] = useState(false);
  const [ext, setExt] = useState({ parametro: '', alcance: '', inicio: '', fin: '', condiciones: '' });
  const seqExt = useRef(2212);

  const [modalEsc, setModalEsc] = useState(false);
  const [esc, setEsc] = useState({ origen: '', motivo: '', destino: 'Gerencia de planta' });
  const seqEsc = useRef(412);

  /* ------------------------------ acciones ------------------------------ */
  const registrarNc = () => {
    const cantidad = Number(nc.cantidad) || 0;
    if (!nc.producto.trim() || !nc.lote.trim() || cantidad <= 0 || !nc.responsable.trim()) {
      avisar('Completa producto, lote, cantidad y responsable de la no conformidad.');
      return;
    }
    seqNc.current += 1;
    setNcs(prev => [{
      id: `NC-${seqNc.current}`, producto: nc.producto.trim(), lote: nc.lote.trim(), cantidad,
      unidad: 'und', proceso: nc.proceso.trim() || 'Sin clasificar', origen: nc.origen.trim() || 'Control de proceso',
      evidencia: 'Pendiente de adjuntar', responsable: nc.responsable.trim(), fecha: '2026-10-18',
      criticidad: 'Media', estado: 'Abierta',
    }, ...prev]);
    setModalNc(false);
    setNc({ producto: '', lote: '', cantidad: '', proceso: '', origen: '', responsable: '' });
    avisar(`No conformidad NC-${seqNc.current} registrada con producto, lote, proceso y responsable.`);
  };

  const bloquearOrden = () => {
    if (!bloqueo.referencia.trim() || !bloqueo.motivo.trim()) {
      avisar('Completa referencia y motivo del bloqueo.');
      return;
    }
    seqBlq.current += 1;
    setBloqueos(prev => [{
      id: `BLQ-${seqBlq.current}`, tipo: bloqueo.tipo, referencia: bloqueo.referencia.trim(),
      motivo: bloqueo.motivo.trim(), fecha: '2026-10-18', responsable: bloqueo.responsable.trim() || 'Calidad',
      estado: 'Bloqueado',
    }, ...prev]);
    setModalBloqueo(false);
    setBloqueo({ tipo: 'Lote', referencia: '', motivo: '', responsable: '' });
    avisar(`${bloqueo.tipo} ${bloqueo.referencia} bloqueado: no puede avanzar hasta la liberación.`);
  };

  const liberarBloqueo = (id: string) => {
    setBloqueos(prev => prev.map(b => b.id === id ? { ...b, estado: 'Liberado' } : b));
    avisar(`Bloqueo ${id} liberado con aprobación registrada en el flujo de aprobación (EXC-09).`);
  };

  const registrarReproceso = () => {
    const costo = Number(reproceso.costo) || 0;
    if (!reproceso.lote.trim() || !reproceso.producto.trim() || !reproceso.motivo.trim() || costo <= 0) {
      avisar('Completa lote, producto, motivo y costo del reproceso.');
      return;
    }
    seqRpr.current += 1;
    setReprocesos(prev => [{
      id: `RPR-${seqRpr.current}`, lote: reproceso.lote.trim(), producto: reproceso.producto.trim(),
      motivo: reproceso.motivo.trim(), autorizadoPor: 'Pendiente de autorización', costo,
      resultado: 'En proceso', fecha: '2026-10-18',
    }, ...prev]);
    setModalReproceso(false);
    setReproceso({ lote: '', producto: '', motivo: '', costo: '' });
    avisar(`Reproceso RPR-${seqRpr.current} registrado y costeado en ${fmtMoney(costo)}. Requiere autorización (EXC-09).`);
  };

  const autorizarReproceso = (id: string) => {
    setReprocesos(prev => prev.map(r => r.id === id ? { ...r, autorizadoPor: 'Calidad · aprobado' } : r));
    avisar(`Reproceso ${id} autorizado y enviado a producción con costo registrado.`);
  };

  const registrarCausa = () => {
    if (!causa.nc.trim() || !causa.causa.trim()) {
      avisar('Selecciona la NC y documenta la causa identificada.');
      return;
    }
    seqRca.current += 1;
    setCausas(prev => [{
      id: `RCA-${seqRca.current}`, nc: causa.nc, metodo: causa.metodo, causa: causa.causa.trim(),
      evidencia: 'Pendiente de adjuntar', responsable: 'Calidad', fecha: '2026-10-18',
    }, ...prev]);
    setModalCausa(false);
    setCausa({ nc: '', metodo: '5 porqués', causa: '' });
    avisar(`Análisis de causa raíz RCA-${seqRca.current} documentado con método ${causa.metodo}.`);
  };

  const crearCapa = () => {
    if (!capa.nc.trim() || !capa.accion.trim() || !capa.responsable.trim() || !capa.fechaLimite) {
      avisar('Completa NC, acción, responsable y fecha límite de la CAPA.');
      return;
    }
    seqCapa.current += 1;
    setCapas(prev => [{
      id: `CAPA-${seqCapa.current}`, nc: capa.nc, tipo: capa.tipo, accion: capa.accion.trim(),
      responsable: capa.responsable.trim(), fechaLimite: capa.fechaLimite,
      verificacion: 'Pendiente', eficacia: '—', estado: 'Abierta',
    }, ...prev]);
    setModalCapa(false);
    setCapa({ nc: '', tipo: 'Correctiva', accion: '', responsable: '', fechaLimite: '' });
    avisar(`CAPA CAPA-${seqCapa.current} creada con responsable y fecha límite.`);
  };

  const verificarEficacia = (id: string) => {
    setCapas(prev => prev.map(c => c.id === id ? { ...c, verificacion: 'Verificada', eficacia: 'Eficaz', estado: 'Cerrada' } : c));
    avisar(`Eficacia de ${id} verificada antes del cierre. La acción queda auditada.`);
  };

  const solicitarAprobacion = () => {
    if (!apr.referencia.trim()) {
      avisar('Completa la referencia a aprobar.');
      return;
    }
    seqApr.current += 1;
    setAprobaciones(prev => [{
      id: `APR-${seqApr.current}`, tipo: apr.tipo, referencia: apr.referencia.trim(),
      nivel: apr.nivel, responsable: 'En ruta de aprobación', fecha: '2026-10-18', decision: 'Pendiente',
    }, ...prev]);
    setModalApr(false);
    setApr({ tipo: 'Reproceso', referencia: '', nivel: 'Nivel 1 · Calidad' });
    avisar(`Solicitud de aprobación enviada al ${apr.nivel} para ${apr.referencia}.`);
  };

  const decidirAprobacion = (id: string, decision: 'Aprobada' | 'Rechazada') => {
    setAprobaciones(prev => prev.map(a => a.id === id ? { ...a, decision, fecha: '2026-10-18' } : a));
    avisar(`Aprobación ${id}: decisión «${decision}» registrada en el flujo con niveles y responsables.`);
  };

  const crearExcepcion = () => {
    if (!ext.parametro.trim() || !ext.inicio || !ext.fin) {
      avisar('Completa parámetro, vigencia y condiciones de la excepción temporal.');
      return;
    }
    seqExt.current += 1;
    setExcepciones(prev => [{
      id: `EXT-${seqExt.current}`, parametro: ext.parametro.trim(), alcance: ext.alcance.trim() || 'Por definir',
      vigenciaInicio: ext.inicio, vigenciaFin: ext.fin,
      condiciones: ext.condiciones.trim() || 'Sin condiciones adicionales', estado: 'Vigente',
    }, ...prev]);
    setModalExt(false);
    setExt({ parametro: '', alcance: '', inicio: '', fin: '', condiciones: '' });
    avisar(`Excepción temporal EXT-${seqExt.current} autorizada con vigencia ${fmtFecha(ext.inicio)} – ${fmtFecha(ext.fin)}.`);
  };

  const escalar = () => {
    if (!esc.origen.trim() || !esc.motivo.trim()) {
      avisar('Completa origen y motivo del escalamiento.');
      return;
    }
    seqEsc.current += 1;
    setEscalamientos(prev => [{
      id: `ESC-${seqEsc.current}`, origen: esc.origen.trim(), criticidad: 'Alta', motivo: esc.motivo.trim(),
      fecha: '2026-10-18', destino: esc.destino, estado: 'Activo',
    }, ...prev]);
    setModalEsc(false);
    setEsc({ origen: '', motivo: '', destino: 'Gerencia de planta' });
    avisar(`Escalamiento ESC-${seqEsc.current} notificado a ${esc.destino} por superar tiempo o criticidad.`);
  };

  /* ------------------------------ indicadores ------------------------------ */
  const ncAbiertas = ncs.filter(n => n.estado !== 'Cerrada').length;
  const capasAbiertas = capas.filter(c => c.estado !== 'Cerrada').length;
  const bloqueosActivos = bloqueos.filter(b => b.estado === 'Bloqueado').length;
  const escalamientosActivos = escalamientos.filter(e => e.estado === 'Activo').length;
  const costoReprocesos = reprocesos.reduce((a, r) => a + r.costo, 0);
  const costoDesperdicio = DESPERDICIOS_EXC.reduce((a, d) => a + d.costo, 0);

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('exc')} funcionalidades · Fase ${MOD.fase}`}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="No conformidades abiertas" value={fmtNum(ncAbiertas)} sub={`${ncs.length} registradas en total`} tone="danger" />
        <StatCard label="CAPA abiertas" value={fmtNum(capasAbiertas)} sub="Acciones correctivas y preventivas" tone="warn" />
        <StatCard label="Bloqueos activos" value={fmtNum(bloqueosActivos)} sub="Órdenes, lotes y operaciones" tone="danger" />
        <StatCard label="Escalamientos activos" value={fmtNum(escalamientosActivos)} sub={`${escalamientos.length} en el histórico`} tone="info" />
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
              Detectar, documentar y resolver desviaciones, no conformidades y excepciones del proceso,
              evitando que se repitan.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Incluye no conformidades, desviaciones de receta o parámetros, tolerancias, bloqueos,
              reprocesos, desperdicio, causa raíz, acciones correctivas y flujos de aprobación.
            </p>
          </Card>
          <Card title="Actores">
            <p className="text-xs leading-relaxed text-gray-700">
              Calidad, producción, ingeniería, mantenimiento, dirección y auditoría.
            </p>
          </Card>
          <Card title="Reglas de negocio">
            <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
              <li>Toda no conformidad debe tener responsable y estado.</li>
              <li>Una orden bloqueada no puede avanzar sin liberación.</li>
              <li>Un reproceso debe estar autorizado y costeado.</li>
              <li>Las acciones correctivas deben verificarse antes de cerrar.</li>
              <li>Las excepciones temporales deben tener fecha de caducidad.</li>
              <li>Todo cambio debe quedar auditado.</li>
            </ul>
          </Card>
          <Card title="Integraciones">
            <ul className="grid gap-1 text-xs text-gray-700 sm:grid-cols-2">
              <li>✅ Calidad: controles y alertas</li>
              <li>🏭 Producción: bloqueos y reprocesos</li>
              <li>📦 Inventario: cuarentena y desperdicio</li>
              <li>💰 Costos: impacto de reprocesos y pérdidas</li>
              <li>🔧 Mantenimiento: fallas recurrentes</li>
              <li>📄 Documentos: evidencia y procedimientos</li>
            </ul>
          </Card>
          <Card title="Reportes">
            <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
              <li>No conformidades por producto, proceso y causa.</li>
              <li>Desviaciones y tolerancias fuera de rango.</li>
              <li>Reprocesos y desperdicio.</li>
              <li>Acciones correctivas y eficacia.</li>
              <li>Excepciones abiertas y vencidas.</li>
              <li>Pareto de causas.</li>
            </ul>
          </Card>
          <Card title="Criterios de aceptación">
            <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
              <li>Toda no conformidad tiene flujo y evidencia.</li>
              <li>Las órdenes bloqueadas no avanzan.</li>
              <li>Las acciones correctivas se verifican.</li>
              <li>Los reprocesos se costean.</li>
              <li>Los reportes permiten identificar recurrencias.</li>
            </ul>
          </Card>
        </div>
      )}

      {/* ------------------------------ Registro y evaluación ------------------------------ */}
      {tab === 'registro' && (
        <div className="space-y-4">
          <FunctionBlock code="EXC-01">
            <Toolbar>
              <select className={INPUT} value={fEstadoNc} onChange={e => setFEstadoNc(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="Abierta">Abierta</option>
                <option value="En análisis">En análisis</option>
                <option value="En CAPA">En CAPA</option>
                <option value="Escalada">Escalada</option>
                <option value="Cerrada">Cerrada</option>
              </select>
              <button className={BTN_PRIMARY} onClick={() => setModalNc(true)}>+ Registrar no conformidad</button>
            </Toolbar>
            <DataTable footer={`${ncsVisibles.length} no conformidades con producto, lote, proceso, evidencia y responsable`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>NC</Th><Th>Producto</Th><Th>Lote</Th><Th align="right">Cantidad</Th><Th>Proceso</Th><Th>Origen</Th><Th>Evidencia</Th>
                  <Th>Responsable</Th><Th align="center">Criticidad</Th><Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ncsVisibles.map(n => (
                  <tr key={n.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{n.id}</span></Td>
                    <Td>{n.producto}</Td>
                    <Td><span className="font-mono text-gray-500">{n.lote}</span></Td>
                    <Td align="right"><span className="num-col text-red-600">{fmtNum(n.cantidad)} {n.unidad}</span></Td>
                    <Td>{n.proceso}</Td>
                    <Td className="text-gray-500">{n.origen}</Td>
                    <Td><span className="font-mono text-gray-500">{n.evidencia}</span></Td>
                    <Td>{n.responsable}</Td>
                    <Td align="center"><StatusBadge label={n.criticidad} tone={toneCriticidad(n.criticidad)} /></Td>
                    <Td align="center"><StatusBadge label={n.estado} tone={toneEstadoNc(n.estado)} /></Td>
                  </tr>
                ))}
                {ncsVisibles.length === 0 && <EmptyRow colSpan={10} text="No hay NC en el estado seleccionado." />}
              </tbody>
            </DataTable>
            {modalNc && (
              <Modal title="Registrar no conformidad" onClose={() => setModalNc(false)} wide>
                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-3 gap-3">
                    <label className="block text-xs text-gray-600">
                      Producto
                      <input className={INPUT} data-initial-focus value={nc.producto} onChange={e => setNc({ ...nc, producto: e.target.value })} />
                    </label>
                    <label className="block text-xs text-gray-600">
                      Lote
                      <input className={INPUT} value={nc.lote} onChange={e => setNc({ ...nc, lote: e.target.value })} placeholder="L-2026-XXX" />
                    </label>
                    <label className="block text-xs text-gray-600">
                      Cantidad
                      <input className={INPUT} type="number" value={nc.cantidad} onChange={e => setNc({ ...nc, cantidad: e.target.value })} />
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="block text-xs text-gray-600">
                      Proceso
                      <input className={INPUT} value={nc.proceso} onChange={e => setNc({ ...nc, proceso: e.target.value })} />
                    </label>
                    <label className="block text-xs text-gray-600">
                      Origen
                      <select className={INPUT} value={nc.origen} onChange={e => setNc({ ...nc, origen: e.target.value })}>
                        <option value="">Seleccionar origen...</option>
                        <option value="Control de proceso">Control de proceso</option>
                        <option value="Control de calidad">Control de calidad</option>
                        <option value="Queja de cliente">Queja de cliente</option>
                        <option value="Auditoría interna">Auditoría interna</option>
                      </select>
                    </label>
                    <label className="block text-xs text-gray-600">
                      Responsable
                      <input className={INPUT} value={nc.responsable} onChange={e => setNc({ ...nc, responsable: e.target.value })} />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalNc(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={registrarNc}>Registrar NC</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="EXC-02">
            <Toolbar>
              <select className={INPUT} value={fResultadoDesv} onChange={e => setFResultadoDesv(e.target.value)}>
                <option value="">Dentro y fuera de rango</option>
                <option value="Dentro">Dentro</option>
                <option value="Fuera">Fuera</option>
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Detección ejecutada: ${DESVIACIONES.filter(d => d.resultado === 'Fuera').length} desviaciones fuera de especificación en la semana.`)}>
                Detectar desviaciones
              </button>
              <span className="ml-auto text-xs text-gray-500">Compara valor esperado vs. real de receta o parámetro</span>
            </Toolbar>
            <DataTable footer={`${desviacionesVisibles.length} desviaciones de receta o parámetro con valor esperado y real`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Desviación</Th><Th>Parámetro</Th><Th>Receta</Th><Th align="right">Esperado</Th><Th align="right">Real</Th><Th>Orden</Th><Th align="center">Resultado</Th><Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {desviacionesVisibles.map(d => (
                  <tr key={d.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{d.id}</span></Td>
                    <Td>{d.parametro}</Td>
                    <Td><span className="font-mono text-gray-500">{d.receta}</span></Td>
                    <Td align="right"><span className="num-col text-gray-500">{d.esperado}</span></Td>
                    <Td align="right"><span className={`num-col ${d.resultado === 'Fuera' ? 'font-semibold text-red-600' : ''}`}>{d.real}</span></Td>
                    <Td><span className="font-mono text-gray-500">{d.orden}</span></Td>
                    <Td align="center"><StatusBadge label={d.resultado} tone={d.resultado === 'Dentro' ? 'green' : 'red'} /></Td>
                    <Td align="center"><StatusBadge label={d.estado} tone={d.estado === 'Registrada' ? 'gray' : d.estado === 'Corregida' ? 'green' : d.estado === 'En CAPA' ? 'blue' : 'amber'} /></Td>
                  </tr>
                ))}
                {desviacionesVisibles.length === 0 && <EmptyRow colSpan={8} text="No hay desviaciones con el resultado seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="EXC-03">
            <Toolbar>
              <select className={INPUT} value={tolSel} onChange={e => { setTolSel(e.target.value); setResultadoEval(null); }}>
                {TOLERANCIAS.map(t => <option key={t.id} value={t.id}>{t.parametro} ({t.min}–{t.max} {t.unidad})</option>)}
              </select>
              <input className={INPUT} placeholder="Valor medido (ej.: 7,8)" value={valorEval} onChange={e => { setValorEval(e.target.value); setResultadoEval(null); }} />
              <button className={BTN_PRIMARY} onClick={evaluarTolerancia}>Evaluar valor</button>
            </Toolbar>
            {resultadoEval && (
              <div
                role="status"
                className={`mb-3 rounded border px-3 py-2 text-xs ${resultadoEval.dentro ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-700'}`}
              >
                {resultadoEval.texto} → <strong>{resultadoEval.dentro ? 'DENTRO de rango' : 'FUERA de rango'}</strong>
                {!resultadoEval.dentro && ' · se sugiere registrar una desviación (EXC-02).'}
              </div>
            )}
            <DataTable footer={`${TOLERANCIAS.length} tolerancias definidas con evaluación automática dentro/fuera de rango`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Parámetro</Th><Th>Producto</Th><Th align="right">Mínimo</Th><Th align="right">Máximo</Th><Th align="center">Unidad</Th><Th align="center">Criticidad</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TOLERANCIAS.map(t => (
                  <tr key={t.id} className="hoverable">
                    <Td>{t.parametro}</Td>
                    <Td>{t.producto}</Td>
                    <Td align="right"><span className="num-col">{t.min}</span></Td>
                    <Td align="right"><span className="num-col">{t.max}</span></Td>
                    <Td align="center"><span className="font-mono text-gray-500">{t.unidad}</span></Td>
                    <Td align="center"><StatusBadge label={t.criticidad} tone={toneCriticidad(t.criticidad)} /></Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {/* ------------------------------ Bloqueos, reprocesos y desperdicio ------------------------------ */}
      {tab === 'bloqueos' && (
        <div className="space-y-4">
          <FunctionBlock code="EXC-04">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => setModalBloqueo(true)}>+ Bloquear orden / lote / operación</button>
              <span className="ml-auto text-xs text-gray-500">{bloqueosActivos} bloqueos activos</span>
            </Toolbar>
            <DataTable footer={`${bloqueos.length} bloqueos: las referencias bloqueadas no avanzan hasta su liberación`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Bloqueo</Th><Th align="center">Tipo</Th><Th>Referencia</Th><Th>Motivo</Th><Th>Responsable</Th><Th>Fecha</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bloqueos.map(b => (
                  <tr key={b.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{b.id}</span></Td>
                    <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{b.tipo}</span></Td>
                    <Td><span className="font-mono text-gray-500">{b.referencia}</span></Td>
                    <Td>{b.motivo}</Td>
                    <Td className="text-gray-500">{b.responsable}</Td>
                    <Td>{fmtFecha(b.fecha)}</Td>
                    <Td align="center"><StatusBadge label={b.estado} tone={b.estado === 'Bloqueado' ? 'red' : 'green'} /></Td>
                    <Td align="center">
                      {b.estado === 'Bloqueado'
                        ? <button className={BTN_SECONDARY} onClick={() => liberarBloqueo(b.id)}>Liberar</button>
                        : <span className="text-xs text-gray-400">Liberado</span>}
                    </Td>
                  </tr>
                ))}
                {bloqueos.length === 0 && <EmptyRow colSpan={8} text="Sin bloqueos registrados." />}
              </tbody>
            </DataTable>
            {modalBloqueo && (
              <Modal title="Bloquear orden, lote u operación" onClose={() => setModalBloqueo(false)}>
                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      Tipo
                      <select className={INPUT} data-initial-focus value={bloqueo.tipo} onChange={e => setBloqueo({ ...bloqueo, tipo: e.target.value as Bloqueo['tipo'] })}>
                        <option value="Orden">Orden</option>
                        <option value="Lote">Lote</option>
                        <option value="Operación">Operación</option>
                      </select>
                    </label>
                    <label className="block text-xs text-gray-600">
                      Referencia
                      <input className={INPUT} value={bloqueo.referencia} onChange={e => setBloqueo({ ...bloqueo, referencia: e.target.value })} placeholder="OF-XXXX / L-2026-XXX" />
                    </label>
                  </div>
                  <label className="block text-xs text-gray-600">
                    Motivo
                    <input className={INPUT} value={bloqueo.motivo} onChange={e => setBloqueo({ ...bloqueo, motivo: e.target.value })} />
                  </label>
                  <label className="block text-xs text-gray-600">
                    Responsable
                    <input className={INPUT} value={bloqueo.responsable} onChange={e => setBloqueo({ ...bloqueo, responsable: e.target.value })} />
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalBloqueo(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={bloquearOrden}>Bloquear</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="EXC-05">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => setModalReproceso(true)}>+ Registrar reproceso</button>
              <span className="ml-auto text-xs text-gray-500">Costo total: {fmtMoney(costoReprocesos)}</span>
            </Toolbar>
            <DataTable footer={`${reprocesos.length} reprocesos autorizados, registrados y costeados · ${fmtMoney(costoReprocesos)}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Reproceso</Th><Th>Lote</Th><Th>Producto</Th><Th>Motivo</Th><Th>Autorizado por</Th><Th align="right">Costo</Th><Th align="center">Resultado</Th><Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reprocesos.map(r => (
                  <tr key={r.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
                    <Td><span className="font-mono text-gray-500">{r.lote}</span></Td>
                    <Td>{r.producto}</Td>
                    <Td className="text-gray-500">{r.motivo}</Td>
                    <Td>{r.autorizadoPor}</Td>
                    <Td align="right"><span className="num-col">{fmtMoney(r.costo)}</span></Td>
                    <Td align="center">
                      <StatusBadge label={r.resultado} tone={r.resultado === 'Liberado' ? 'green' : r.resultado === 'Rechazado' ? 'red' : 'blue'} />
                    </Td>
                    <Td align="center">
                      {r.autorizadoPor === 'Pendiente de autorización'
                        ? <button className={BTN_SECONDARY} onClick={() => autorizarReproceso(r.id)}>Autorizar</button>
                        : <span className="text-xs text-gray-400">{fmtFecha(r.fecha)}</span>}
                    </Td>
                  </tr>
                ))}
                {reprocesos.length === 0 && <EmptyRow colSpan={8} text="Sin reprocesos registrados." />}
              </tbody>
            </DataTable>
            {modalReproceso && (
              <Modal title="Registrar y costear reproceso" onClose={() => setModalReproceso(false)}>
                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      Lote
                      <input className={INPUT} data-initial-focus value={reproceso.lote} onChange={e => setReproceso({ ...reproceso, lote: e.target.value })} />
                    </label>
                    <label className="block text-xs text-gray-600">
                      Producto
                      <input className={INPUT} value={reproceso.producto} onChange={e => setReproceso({ ...reproceso, producto: e.target.value })} />
                    </label>
                  </div>
                  <label className="block text-xs text-gray-600">
                    Motivo
                    <input className={INPUT} value={reproceso.motivo} onChange={e => setReproceso({ ...reproceso, motivo: e.target.value })} />
                  </label>
                  <label className="block text-xs text-gray-600">
                    Costo estimado (COP)
                    <input className={INPUT} type="number" value={reproceso.costo} onChange={e => setReproceso({ ...reproceso, costo: e.target.value })} />
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalReproceso(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={registrarReproceso}>Registrar reproceso</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="EXC-06">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Desperdicio registrado por causa, producto, lote y proceso. Costo acumulado: ${fmtMoney(costoDesperdicio)}.`)}>
                Consolidar desperdicio
              </button>
              <span className="ml-auto text-xs text-gray-500">Costo total: {fmtMoney(costoDesperdicio)}</span>
            </Toolbar>
            <DataTable footer={`${DESPERDICIOS_EXC.length} registros de desperdicio con impacto en costo`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Producto</Th><Th>Lote</Th><Th>Proceso</Th><Th>Causa</Th><Th align="right">Cantidad</Th><Th align="right">Costo</Th><Th>Fecha</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DESPERDICIOS_EXC.map(d => (
                  <tr key={d.id} className="hoverable">
                    <Td>{d.producto}</Td>
                    <Td><span className="font-mono text-gray-500">{d.lote}</span></Td>
                    <Td>{d.proceso}</Td>
                    <Td className="text-gray-500">{d.causa}</Td>
                    <Td align="right"><span className="num-col text-red-600">{fmtNum(d.cantidad)} {d.unidad}</span></Td>
                    <Td align="right"><span className="num-col">{fmtMoney(d.costo)}</span></Td>
                    <Td>{fmtFecha(d.fecha)}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {/* ------------------------------ Causa raíz y CAPA ------------------------------ */}
      {tab === 'causa' && (
        <div className="space-y-4">
          <FunctionBlock code="EXC-07">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => setModalCausa(true)}>+ Documentar causa raíz</button>
              <span className="ml-auto text-xs text-gray-500">Métodos: 5 porqués e Ishikawa</span>
            </Toolbar>
            <DataTable footer={`${causas.length} análisis documentados con causa identificada y evidencia`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Análisis</Th><Th>NC</Th><Th align="center">Método</Th><Th>Causa identificada</Th><Th>Evidencia</Th><Th>Responsable</Th><Th>Fecha</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {causas.map(c => (
                  <tr key={c.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
                    <Td><span className="font-mono text-gray-500">{c.nc}</span></Td>
                    <Td align="center"><span className="rounded-full bg-petroleum-50 px-2 py-0.5 text-xs text-petroleum-700">{c.metodo}</span></Td>
                    <Td>{c.causa}</Td>
                    <Td className="text-gray-500">{c.evidencia}</Td>
                    <Td>{c.responsable}</Td>
                    <Td>{fmtFecha(c.fecha)}</Td>
                  </tr>
                ))}
                {causas.length === 0 && <EmptyRow colSpan={7} text="Sin análisis de causa raíz documentados." />}
              </tbody>
            </DataTable>
            {modalCausa && (
              <Modal title="Documentar análisis de causa raíz" onClose={() => setModalCausa(false)}>
                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      No conformidad
                      <select className={INPUT} data-initial-focus value={causa.nc} onChange={e => setCausa({ ...causa, nc: e.target.value })}>
                        <option value="">Seleccionar NC...</option>
                        {ncs.map(n => <option key={n.id} value={n.id}>{n.id} — {n.producto}</option>)}
                      </select>
                    </label>
                    <label className="block text-xs text-gray-600">
                      Método
                      <select className={INPUT} value={causa.metodo} onChange={e => setCausa({ ...causa, metodo: e.target.value })}>
                        <option value="5 porqués">5 porqués</option>
                        <option value="Ishikawa">Ishikawa</option>
                      </select>
                    </label>
                  </div>
                  <label className="block text-xs text-gray-600">
                    Causa identificada
                    <input className={INPUT} value={causa.causa} onChange={e => setCausa({ ...causa, causa: e.target.value })} />
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalCausa(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={registrarCausa}>Documentar causa</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="EXC-08">
            <Toolbar>
              <select className={INPUT} value={fEstadoCapa} onChange={e => setFEstadoCapa(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="Abierta">Abierta</option>
                <option value="En curso">En curso</option>
                <option value="Cerrada">Cerrada</option>
              </select>
              <button className={BTN_PRIMARY} onClick={() => setModalCapa(true)}>+ Nueva CAPA</button>
            </Toolbar>
            <DataTable footer={`${capasVisibles.length} acciones con responsable, fecha, verificación de eficacia y cierre`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>CAPA</Th><Th>NC</Th><Th align="center">Tipo</Th><Th>Acción</Th><Th>Responsable</Th><Th>Fecha límite</Th><Th align="center">Verificación</Th><Th align="center">Eficacia</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {capasVisibles.map(c => (
                  <tr key={c.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
                    <Td><span className="font-mono text-gray-500">{c.nc}</span></Td>
                    <Td align="center">
                      <StatusBadge label={c.tipo} tone={c.tipo === 'Correctiva' ? 'red' : 'blue'} />
                    </Td>
                    <Td>{c.accion}</Td>
                    <Td>{c.responsable}</Td>
                    <Td>{fmtFecha(c.fechaLimite)}</Td>
                    <Td align="center"><span className="text-xs text-gray-500">{c.verificacion}</span></Td>
                    <Td align="center"><span className="text-xs text-gray-500">{c.eficacia}</span></Td>
                    <Td align="center">
                      <StatusBadge label={c.estado} tone={c.estado === 'Cerrada' ? 'green' : c.estado === 'En curso' ? 'blue' : 'amber'} />
                    </Td>
                    <Td align="center">
                      {c.estado !== 'Cerrada'
                        ? <button className={BTN_SECONDARY} onClick={() => verificarEficacia(c.id)}>Verificar eficacia</button>
                        : <span className="text-xs text-gray-400">Cerrada</span>}
                    </Td>
                  </tr>
                ))}
                {capasVisibles.length === 0 && <EmptyRow colSpan={10} text="No hay CAPA en el estado seleccionado." />}
              </tbody>
            </DataTable>
            {modalCapa && (
              <Modal title="Definir acción correctiva / preventiva" onClose={() => setModalCapa(false)}>
                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      No conformidad
                      <select className={INPUT} data-initial-focus value={capa.nc} onChange={e => setCapa({ ...capa, nc: e.target.value })}>
                        <option value="">Seleccionar NC...</option>
                        {ncs.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                      </select>
                    </label>
                    <label className="block text-xs text-gray-600">
                      Tipo
                      <select className={INPUT} value={capa.tipo} onChange={e => setCapa({ ...capa, tipo: e.target.value as Capa['tipo'] })}>
                        <option value="Correctiva">Correctiva</option>
                        <option value="Preventiva">Preventiva</option>
                      </select>
                    </label>
                  </div>
                  <label className="block text-xs text-gray-600">
                    Acción
                    <input className={INPUT} value={capa.accion} onChange={e => setCapa({ ...capa, accion: e.target.value })} />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      Responsable
                      <input className={INPUT} value={capa.responsable} onChange={e => setCapa({ ...capa, responsable: e.target.value })} />
                    </label>
                    <label className="block text-xs text-gray-600">
                      Fecha límite
                      <input className={INPUT} type="date" value={capa.fechaLimite} onChange={e => setCapa({ ...capa, fechaLimite: e.target.value })} />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalCapa(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={crearCapa}>Crear CAPA</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>
        </div>
      )}

      {/* ------------------------------ Aprobaciones y escalamiento ------------------------------ */}
      {tab === 'aprobacion' && (
        <div className="space-y-4">
          <FunctionBlock code="EXC-09">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => setModalApr(true)}>+ Solicitar aprobación</button>
              <span className="ml-auto text-xs text-gray-500">Niveles: 1 Calidad · 2 Calidad + Producción · 3 Dirección</span>
            </Toolbar>
            <DataTable footer={`${aprobaciones.length} aprobaciones de excepciones, reprocesos, liberaciones y cambios`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Aprobación</Th><Th>Tipo</Th><Th>Referencia</Th><Th>Nivel</Th><Th>Responsable</Th><Th>Fecha</Th><Th align="center">Decisión</Th><Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {aprobaciones.map(a => (
                  <tr key={a.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{a.id}</span></Td>
                    <Td>{a.tipo}</Td>
                    <Td><span className="font-mono text-gray-500">{a.referencia}</span></Td>
                    <Td className="text-gray-500">{a.nivel}</Td>
                    <Td>{a.responsable}</Td>
                    <Td>{fmtFecha(a.fecha)}</Td>
                    <Td align="center">
                      <StatusBadge label={a.decision} tone={a.decision === 'Aprobada' ? 'green' : a.decision === 'Rechazada' ? 'red' : a.decision === 'En revisión' ? 'blue' : 'amber'} />
                    </Td>
                    <Td align="center">
                      {a.decision === 'Pendiente' || a.decision === 'En revisión' ? (
                        <span className="flex justify-center gap-1.5">
                          <button className={BTN_PRIMARY} onClick={() => decidirAprobacion(a.id, 'Aprobada')}>Aprobar</button>
                          <button className={BTN_DANGER} onClick={() => decidirAprobacion(a.id, 'Rechazada')}>Rechazar</button>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Resuelta</span>
                      )}
                    </Td>
                  </tr>
                ))}
                {aprobaciones.length === 0 && <EmptyRow colSpan={8} text="Sin solicitudes de aprobación." />}
              </tbody>
            </DataTable>
            {modalApr && (
              <Modal title="Solicitar aprobación" onClose={() => setModalApr(false)}>
                <div className="space-y-3 p-5">
                  <label className="block text-xs text-gray-600">
                    Tipo de aprobación
                    <select className={INPUT} data-initial-focus value={apr.tipo} onChange={e => setApr({ ...apr, tipo: e.target.value })}>
                      <option value="Reproceso">Reproceso</option>
                      <option value="Liberación de cuarentena">Liberación de cuarentena</option>
                      <option value="Liberación de bloqueo">Liberación de bloqueo</option>
                      <option value="Excepción temporal">Excepción temporal</option>
                      <option value="Cambio de receta">Cambio de receta</option>
                    </select>
                  </label>
                  <label className="block text-xs text-gray-600">
                    Referencia
                    <input className={INPUT} value={apr.referencia} onChange={e => setApr({ ...apr, referencia: e.target.value })} placeholder="RPR-XXX / EXT-XXXX / BLQ-XXX" />
                  </label>
                  <label className="block text-xs text-gray-600">
                    Nivel requerido
                    <select className={INPUT} value={apr.nivel} onChange={e => setApr({ ...apr, nivel: e.target.value })}>
                      <option value="Nivel 1 · Calidad">Nivel 1 · Calidad</option>
                      <option value="Nivel 2 · Calidad + Producción">Nivel 2 · Calidad + Producción</option>
                      <option value="Nivel 3 · Dirección">Nivel 3 · Dirección</option>
                    </select>
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalApr(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={solicitarAprobacion}>Enviar solicitud</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="EXC-10">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => setModalExt(true)}>+ Autorizar excepción temporal</button>
              <span className="ml-auto text-xs text-gray-500">Toda excepción temporal debe tener fecha de caducidad</span>
            </Toolbar>
            <DataTable footer={`${excepciones.length} desviaciones temporales con vigencia, alcance y condiciones de cierre`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Excepción</Th><Th>Parámetro</Th><Th>Alcance</Th><Th align="center">Vigencia</Th><Th>Condiciones</Th><Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {excepciones.map(x => (
                  <tr key={x.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{x.id}</span></Td>
                    <Td>{x.parametro}</Td>
                    <Td className="text-gray-500">{x.alcance}</Td>
                    <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(x.vigenciaInicio)} – {fmtFecha(x.vigenciaFin)}</span></Td>
                    <Td className="text-gray-500">{x.condiciones}</Td>
                    <Td align="center">
                      <StatusBadge label={x.estado} tone={x.estado === 'Vigente' ? 'blue' : x.estado === 'Caducada' ? 'red' : 'gray'} />
                    </Td>
                  </tr>
                ))}
                {excepciones.length === 0 && <EmptyRow colSpan={6} text="Sin excepciones temporales." />}
              </tbody>
            </DataTable>
            {modalExt && (
              <Modal title="Autorizar excepción temporal" onClose={() => setModalExt(false)} wide>
                <div className="space-y-3 p-5">
                  <label className="block text-xs text-gray-600">
                    Parámetro o desviación
                    <input className={INPUT} data-initial-focus value={ext.parametro} onChange={e => setExt({ ...ext, parametro: e.target.value })} />
                  </label>
                  <label className="block text-xs text-gray-600">
                    Alcance
                    <input className={INPUT} value={ext.alcance} onChange={e => setExt({ ...ext, alcance: e.target.value })} placeholder="Ej.: L3 Café · semana 43" />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs text-gray-600">
                      Vigencia desde
                      <input className={INPUT} type="date" value={ext.inicio} onChange={e => setExt({ ...ext, inicio: e.target.value })} />
                    </label>
                    <label className="block text-xs text-gray-600">
                      Vigencia hasta
                      <input className={INPUT} type="date" value={ext.fin} onChange={e => setExt({ ...ext, fin: e.target.value })} />
                    </label>
                  </div>
                  <label className="block text-xs text-gray-600">
                    Condiciones de cierre
                    <input className={INPUT} value={ext.condiciones} onChange={e => setExt({ ...ext, condiciones: e.target.value })} />
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalExt(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={crearExcepcion}>Autorizar excepción</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="EXC-11">
            <Toolbar>
              <select className={INPUT} value={fEstadoEsc} onChange={e => setFEstadoEsc(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Resuelto">Resuelto</option>
              </select>
              <button className={BTN_PRIMARY} onClick={() => setModalEsc(true)}>+ Registrar escalamiento</button>
            </Toolbar>
            <DataTable footer={`${escalamientosVisibles.length} escalamientos por tiempo o criticidad superada, con destino notificado`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Escalamiento</Th><Th>Origen</Th><Th align="center">Criticidad</Th><Th>Motivo</Th><Th>Fecha</Th><Th>Destino</Th><Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {escalamientosVisibles.map(e => (
                  <tr key={e.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{e.id}</span></Td>
                    <Td><span className="font-mono text-gray-500">{e.origen}</span></Td>
                    <Td align="center"><StatusBadge label={e.criticidad} tone={toneCriticidad(e.criticidad)} /></Td>
                    <Td>{e.motivo}</Td>
                    <Td>{fmtFecha(e.fecha)}</Td>
                    <Td>{e.destino}</Td>
                    <Td align="center"><StatusBadge label={e.estado} tone={e.estado === 'Activo' ? 'red' : 'green'} /></Td>
                  </tr>
                ))}
                {escalamientosVisibles.length === 0 && <EmptyRow colSpan={7} text="No hay escalamientos en el estado seleccionado." />}
              </tbody>
            </DataTable>
            {modalEsc && (
              <Modal title="Registrar escalamiento" onClose={() => setModalEsc(false)}>
                <div className="space-y-3 p-5">
                  <label className="block text-xs text-gray-600">
                    Origen
                    <input className={INPUT} data-initial-focus value={esc.origen} onChange={e => setEsc({ ...esc, origen: e.target.value })} placeholder="NC-XXXX / DES-XXXX" />
                  </label>
                  <label className="block text-xs text-gray-600">
                    Motivo
                    <input className={INPUT} value={esc.motivo} onChange={e => setEsc({ ...esc, motivo: e.target.value })} placeholder="Ej.: superó 24 h sin plan de acción" />
                  </label>
                  <label className="block text-xs text-gray-600">
                    Destino
                    <select className={INPUT} value={esc.destino} onChange={e => setEsc({ ...esc, destino: e.target.value })}>
                      <option value="Calidad">Calidad</option>
                      <option value="Ingeniería de procesos">Ingeniería de procesos</option>
                      <option value="Gerencia de planta">Gerencia de planta</option>
                      <option value="Dirección">Dirección</option>
                    </select>
                  </label>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalEsc(false)}>Cancelar</button>
                    <button className={BTN_PRIMARY} onClick={escalar}>Escalar</button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>
        </div>
      )}

      {/* ------------------------------ Reportes ------------------------------ */}
      {tab === 'reportes' && (
        <div className="space-y-4">
          <FunctionBlock code="EXC-12">
            <Toolbar>
              <select className={INPUT} value={repSel} onChange={e => setRepSel(e.target.value)}>
                {REPORTES_EXC.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar('Reporte generado con trazabilidad completa: no conformidades, causas, acciones y efectividad auditables.')}>
                Generar reporte
              </button>
            </Toolbar>
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DataTable footer={`${REPORTES_EXC.length} reportes de no conformidades, causas, acciones, reprocesos y efectividad`}>
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <Th>Código</Th><Th>Reporte</Th><Th align="center">Periodicidad</Th><Th align="center">Acción</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {REPORTES_EXC.map(r => (
                      <tr key={r.id} className="hoverable">
                        <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
                        <Td>{r.nombre}</Td>
                        <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{r.periodicidad}</span></Td>
                        <Td align="center">
                          <button className={BTN_SECONDARY} onClick={() => avisar(`Reporte «${r.nombre}» en preparación con evidencia y filtros de auditoría.`)}>Ejecutar</button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              </div>
              <Card title="Pareto de causas (NC abiertas)">
                <ul className="space-y-2">
                  {[
                    { causa: 'Falta de mantenimiento preventivo', n: 2 },
                    { causa: 'Desgaste de componentes', n: 2 },
                    { causa: 'Parámetro fuera de calibración', n: 1 },
                    { causa: 'Presión de vapor inestable', n: 1 },
                  ].map(p => (
                    <li key={p.causa}>
                      <div className="flex items-center justify-between text-xs text-gray-700">
                        <span>{p.causa}</span>
                        <span className="font-mono text-gray-500">{p.n} NC</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded bg-gray-100">
                        <div className="h-full rounded bg-petroleum-500" style={{ width: `${(p.n / 2) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] text-gray-400">
                  Recurrencias identificadas: mantenimiento y desgaste concentran el 66 % de las NC abiertas.
                </p>
              </Card>
            </div>
          </FunctionBlock>
        </div>
      )}
    </div>
  );
}

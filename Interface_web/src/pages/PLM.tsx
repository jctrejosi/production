import { useState } from 'react';
import {
  BTN_GHOST,
  BTN_PRIMARY,
  BTN_SECONDARY,
  Card,
  DataTable,
  EmptyRow,
  FunctionBlock,
  INPUT,
  Modal,
  PageHeader,
  StatCard,
  StatusBadge,
  Tabs,
  Td,
  Th,
  Toolbar,
  type BadgeTone,
} from '../components/ui';
import { MODULOS, conteoModulo } from '../data/modules';
import { fmtFecha, fmtHoras, fmtNum } from '../lib/format';
import {
  APROBACIONES,
  DOCUMENTOS_PLM,
  ECOS,
  ETAPAS_CAMBIO,
  EVENTOS_PLM,
  IMPACTOS,
  PRODUCTOS_PLM,
  REVISIONES,
  TIPOS_CAMBIO,
  VERSIONES_BOM,
  type Aprobacion,
  type ECO,
} from '../data/plm';

const MOD = MODULOS.find(m => m.id === 'plm')!;

const TONO_PRIORIDAD: Record<string, BadgeTone> = {
  'Alta': 'red',
  'Media': 'amber',
  'Baja': 'gray',
};

const TONO_ACCION: Record<string, BadgeTone> = {
  'Agregar': 'green',
  'Quitar': 'red',
  'Modificar': 'amber',
  'Sin cambio': 'gray',
};

const TONO_NIVEL: Record<string, BadgeTone> = {
  'Alto': 'red',
  'Medio': 'amber',
  'Bajo': 'gray',
};

function Aviso({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return (
    <div role="status" className="rounded border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-800">
      {texto}
    </div>
  );
}

function Barra({ label, valor, max, sub }: { label: string; valor: number; max: number; sub?: string }) {
  const pct = max > 0 ? Math.round((valor / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-mono text-gray-800">{sub ?? fmtNum(valor)}</span>
      </div>
      <div className="mt-1 h-2 rounded bg-gray-100">
        <div className="h-2 rounded bg-petroleum-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const nombreProducto = (id: string) => PRODUCTOS_PLM.find(p => p.id === id)?.nombre ?? id;
const nombreTipo = (id: string) => TIPOS_CAMBIO.find(t => t.id === id)?.nombre ?? id;
const nombreEtapa = (id: string) => ETAPAS_CAMBIO.find(e => e.id === id)?.nombre ?? id;

/* ------------------------------- Resumen ------------------------------- */

function TabResumen() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Objetivo">
        <p className="text-xs leading-relaxed text-gray-700">
          Controlar cambios de ingeniería, versiones de listas de materiales y aprobaciones técnicas antes de llevar un cambio a producción.
        </p>
      </Card>
      <Card title="Alcance">
        <p className="text-xs leading-relaxed text-gray-700">
          Órdenes de cambio, tipos, etapas, aprobaciones, versiones de listas de materiales, cambios de componentes y operaciones, fechas de efectividad, archivo histórico, análisis de impacto y gestión documental.
        </p>
      </Card>
      <Card title="Actores">
        <div className="flex flex-wrap gap-1.5">
          {['Ingeniería', 'Calidad', 'Producción', 'Compras', 'Dirección técnica', 'Documentación'].map(a => (
            <span key={a} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">{a}</span>
          ))}
        </div>
      </Card>
      <Card title="Reglas de negocio">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-700">
          <li>Ningún cambio se aplica sin aprobación.</li>
          <li>Toda versión debe tener fecha de efectividad.</li>
          <li>Una orden de producción no puede usar una versión no vigente sin autorización.</li>
          <li>Las versiones anteriores no se eliminan.</li>
          <li>Todo cambio debe tener motivo y responsable.</li>
          <li>El impacto se evalúa antes de aplicar.</li>
        </ul>
      </Card>
      <Card title="Integraciones">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-700">
          <li>Producción: listas de materiales y rutas.</li>
          <li>Compras: componentes y versiones.</li>
          <li>Calidad: cambios que afectan especificaciones.</li>
          <li>Documentos: planos y certificados.</li>
          <li>Costos: impacto del cambio en el costo.</li>
        </ul>
      </Card>
      <Card title="Criterios de aceptación">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-700">
          <li>Cada cambio tiene flujo, aprobación y auditoría.</li>
          <li>La versión vigente se selecciona correctamente por fecha.</li>
          <li>Las órdenes abiertas se identifican ante un cambio.</li>
          <li>El historial permite reconstruir cualquier versión.</li>
          <li>Producción y compras usan la misma versión.</li>
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------ Configuración ------------------------------ */

function TabConfig() {
  return (
    <div className="space-y-4">
      <BloqueTipos />
      <BloqueEtapas />
      <BloqueConfiguracion />
    </div>
  );
}

function BloqueTipos() {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="PLM-02">
      <Toolbar>
        <span className="text-xs text-gray-500">Clasificación de cambios con reglas distintas según el tipo.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Tipo de cambio creado con sus reglas (simulado).'), 400)}>+ Nuevo tipo</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${TIPOS_CAMBIO.length} tipos de cambio configurados.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Código</Th><Th>Tipo de cambio</Th><Th>Reglas aplicables</Th><Th align="center">Aprobación requerida</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {TIPOS_CAMBIO.map(t => (
            <tr key={t.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{t.id}</span></Td>
              <Td className="font-medium">{t.nombre}</Td>
              <Td className="max-w-xl">{t.reglas}</Td>
              <Td align="center"><StatusBadge label={t.requiereAprobacion} tone={t.requiereAprobacion === 'Todas las áreas' ? 'red' : 'blue'} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueEtapas() {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="PLM-03">
      <Toolbar>
        <span className="text-xs text-gray-500">Flujo de etapas con responsables y criterios de avance.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Etapa agregada al flujo de cambios (simulado).'), 400)}>+ Agregar etapa</button>
      </Toolbar>
      <Aviso texto={msg} />
      <div className="overflow-x-auto">
        <div className="flex items-stretch gap-2">
          {ETAPAS_CAMBIO.map((e, i) => (
            <div key={e.id} className="flex items-center gap-2">
              <div className="w-52 rounded border border-petroleum-100 bg-petroleum-50/40 p-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-petroleum-500 font-mono text-[10px] text-white">{e.orden}</span>
                  <span className="text-xs font-semibold text-gray-800">{e.nombre}</span>
                </div>
                <div className="mt-1 text-[11px] text-gray-500">Responsable: {e.responsable}</div>
                <div className="mt-0.5 text-[11px] leading-relaxed text-gray-400">{e.criterioAvance}</div>
              </div>
              {i < ETAPAS_CAMBIO.length - 1 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
      </div>
    </FunctionBlock>
  );
}

function BloqueConfiguracion() {
  const [opciones, setOpciones] = useState({ tipos: true, etapas: true, efectividad: true, auditoria: true, bloqueo: true });
  const [msg, setMsg] = useState<string | null>(null);
  const items = [
    { id: 'tipos', label: 'Gestión de tipos de cambio habilitada' },
    { id: 'etapas', label: 'Flujo de etapas editable por ingeniería' },
    { id: 'efectividad', label: 'Reglas de efectividad por fecha obligatorias' },
    { id: 'auditoria', label: 'Auditoría completa de cada cambio' },
    { id: 'bloqueo', label: 'Bloquear aplicación sin aprobación total' },
  ] as const;
  return (
    <FunctionBlock code="PLM-15">
      <Toolbar>
        <div className="w-64"><input className={INPUT} defaultValue="ECO-2026-" aria-label="Prefijo de secuencia" /></div>
        <div className="w-56"><select className={INPUT}><option>Permisos: ingeniería y dirección</option><option>Permisos: todos los usuarios</option></select></div>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Configuración de PLM guardada (simulado).'), 400)}>Guardar configuración</button>
      </Toolbar>
      <Aviso texto={msg} />
      <div className="space-y-1 rounded border border-gray-100 bg-gray-50/50 p-4">
        <h4 className="mb-2 text-xs font-semibold text-gray-700">Tipos, etapas, secuencias, permisos y reglas de efectividad</h4>
        {items.map(o => (
          <label key={o.id} className="flex cursor-pointer items-center justify-between gap-3 rounded px-2 py-1.5 text-xs text-gray-700 hover:bg-white">
            {o.label}
            <button type="button" role="switch" aria-checked={opciones[o.id]} onClick={() => setOpciones(c => ({ ...c, [o.id]: !c[o.id] }))}
              className={`h-5 w-9 rounded-full p-0.5 transition ${opciones[o.id] ? 'bg-petroleum-500' : 'bg-gray-300'}`}>
              <span className={`block h-4 w-4 rounded-full bg-white transition ${opciones[o.id] ? 'translate-x-4' : ''}`} />
            </button>
          </label>
        ))}
      </div>
    </FunctionBlock>
  );
}

/* --------------------------- Órdenes de cambio (ECO) --------------------------- */

function TabEcos() {
  return (
    <div className="space-y-4">
      <BloqueEco />
      <BloqueAprobaciones />
      <BloqueImpacto />
      <BloqueAuditoria />
    </div>
  );
}

function BloqueEco() {
  const [ecos, setEcos] = useState<ECO[]>(ECOS);
  const [q, setQ] = useState('');
  const [etapa, setEtapa] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const visibles = ecos.filter(e =>
    (!q || e.id.toLowerCase().includes(q.toLowerCase()) || nombreProducto(e.productoId).toLowerCase().includes(q.toLowerCase()) || e.motivo.toLowerCase().includes(q.toLowerCase())) &&
    (!etapa || e.etapaId === etapa) &&
    (!prioridad || e.prioridad === prioridad)
  );
  return (
    <FunctionBlock code="PLM-01">
      <Toolbar>
        <input className={INPUT} placeholder="Buscar ECO, producto o motivo..." value={q} onChange={e => setQ(e.target.value)} />
        <div className="w-40"><select className={INPUT} value={etapa} onChange={e => setEtapa(e.target.value)}><option value="">Etapa</option>{ETAPAS_CAMBIO.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}</select></div>
        <div className="w-36"><select className={INPUT} value={prioridad} onChange={e => setPrioridad(e.target.value)}><option value="">Prioridad</option><option>Alta</option><option>Media</option><option>Baja</option></select></div>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nueva ECO</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${visibles.length} órdenes de cambio de ingeniería.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>ECO</Th><Th align="center">Tipo</Th><Th>Producto</Th><Th>BOM</Th><Th align="center">Etapa</Th><Th>Responsable</Th><Th align="center">Prioridad</Th><Th>Motivo</Th><Th align="center">Aprobación</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(e => (
            <tr key={e.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{e.id}</span></Td>
              <Td align="center"><StatusBadge label={nombreTipo(e.tipoId)} tone="petroleum" /></Td>
              <Td className="font-medium">{nombreProducto(e.productoId)}</Td>
              <Td><span className="font-mono text-gray-500">{e.bom}</span></Td>
              <Td align="center"><StatusBadge label={nombreEtapa(e.etapaId)} tone={e.etapaId === 'EC-05' ? 'green' : 'blue'} /></Td>
              <Td>{e.responsable}</Td>
              <Td align="center"><StatusBadge label={e.prioridad} tone={TONO_PRIORIDAD[e.prioridad]} /></Td>
              <Td className="max-w-xs">{e.motivo}</Td>
              <Td align="center">{e.aprobada ? <StatusBadge label="Aprobada" tone="green" /> : <StatusBadge label="En flujo" tone="amber" />}</Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={9} text="Ninguna ECO coincide con los filtros." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nueva orden de cambio de ingeniería" onClose={() => setModal(false)} wide>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              setEcos(lista => [
                ...lista,
                {
                  id: `ECO-2026-0${15 + lista.length}`,
                  tipoId: String(fd.get('tipo') ?? 'TC-01'),
                  productoId: String(fd.get('producto') ?? 'PR-01'),
                  bom: String(fd.get('bom') ?? ''),
                  etapaId: 'EC-01',
                  responsable: String(fd.get('responsable') ?? 'Valentina Ortiz'),
                  prioridad: (fd.get('prioridad') ?? 'Media') as ECO['prioridad'],
                  motivo: String(fd.get('motivo') ?? ''),
                  alcance: String(fd.get('alcance') ?? ''),
                  fechaCreacion: '2026-10-28',
                  fechaEfectividad: String(fd.get('efectividad') ?? ''),
                  aprobada: false,
                  versionResultante: null,
                },
              ]);
              setModal(false);
              window.setTimeout(() => setMsg('ECO creada en etapa «Borrador» con responsable, motivo y alcance (simulado).'), 400);
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-600">Tipo de cambio
                <select name="tipo" className={INPUT} data-initial-focus>{TIPOS_CAMBIO.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select>
              </label>
              <label className="text-xs text-gray-600">Producto
                <select name="producto" className={INPUT}>{PRODUCTOS_PLM.map(p => <option key={p.id} value={p.id}>{p.codigo} · {p.nombre}</option>)}</select>
              </label>
              <label className="text-xs text-gray-600">Lista de materiales<input name="bom" className={INPUT} placeholder="Ej. BOM-ARE-250" required /></label>
              <label className="text-xs text-gray-600">Responsable<input name="responsable" className={INPUT} defaultValue="Valentina Ortiz" required /></label>
              <label className="text-xs text-gray-600">Prioridad
                <select name="prioridad" className={INPUT}><option>Alta</option><option>Media</option><option>Baja</option></select>
              </label>
              <label className="text-xs text-gray-600">Fecha de efectividad propuesta<input name="efectividad" type="date" className={INPUT} /></label>
            </div>
            <label className="text-xs text-gray-600">Motivo<textarea name="motivo" className={INPUT} rows={2} required /></label>
            <label className="text-xs text-gray-600">Alcance<textarea name="alcance" className={INPUT} rows={2} required /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Crear ECO</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueAprobaciones() {
  const [ecoId, setEcoId] = useState('ECO-2026-014');
  const [aprobaciones, setAprobaciones] = useState<Aprobacion[]>(APROBACIONES);
  const [msg, setMsg] = useState<string | null>(null);
  const delEco = aprobaciones.filter(a => a.ecoId === ecoId);
  const pendientes = delEco.filter(a => a.decision === 'Pendiente').length;
  const decidir = (id: string, decision: Aprobacion['decision'], texto: string) => {
    setAprobaciones(lista => lista.map(a => (a.id === id ? { ...a, decision, fecha: decision === 'Pendiente' ? '' : '2026-10-28', comentario: decision === 'Pendiente' ? '' : a.comentario || 'Aprobado en revisión (simulado).' } : a)));
    window.setTimeout(() => setMsg(texto), 400);
  };
  return (
    <FunctionBlock code="PLM-04">
      <Toolbar>
        <div className="w-72"><select className={INPUT} value={ecoId} onChange={e => setEcoId(e.target.value)}>{ECOS.map(e => <option key={e.id} value={e.id}>{e.id} · {nombreProducto(e.productoId)}</option>)}</select></div>
        <span className="text-xs text-gray-500">{pendientes} aprobaciones pendientes.</span>
      </Toolbar>
      <Aviso texto={msg} />
      {pendientes > 0 && (
        <div className="mb-3 rounded border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
          ⚠️ El cambio <span className="font-mono">{ecoId}</span> no se aplica hasta completar todas las aprobaciones requeridas.
        </div>
      )}
      <DataTable footer={`${delEco.length} aprobaciones registradas para ${ecoId}.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Área</Th><Th>Usuario</Th><Th align="center">Decisión</Th><Th>Fecha</Th><Th>Comentarios</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {delEco.map(a => (
            <tr key={a.id} className="hoverable">
              <Td className="font-medium">{a.area}</Td>
              <Td>{a.usuario}</Td>
              <Td align="center">
                {a.decision === 'Aprobada' ? <StatusBadge label="Aprobada" tone="green" /> : a.decision === 'Rechazada' ? <StatusBadge label="Rechazada" tone="red" /> : <StatusBadge label="Pendiente" tone="amber" />}
              </Td>
              <Td>{a.fecha ? fmtFecha(a.fecha) : '—'}</Td>
              <Td className="max-w-sm">{a.comentario || '—'}</Td>
              <Td align="right">
                {a.decision === 'Pendiente' && (
                  <div className="flex justify-end gap-1.5">
                    <button className={BTN_GHOST} onClick={() => decidir(a.id, 'Aprobada', `${a.area} aprobó ${ecoId} (simulado).`)}>Aprobar</button>
                    <button className={BTN_GHOST} onClick={() => decidir(a.id, 'Rechazada', `${a.area} rechazó ${ecoId}: el cambio vuelve a análisis (simulado).`)}>Rechazar</button>
                  </div>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueImpacto() {
  const [ecoId, setEcoId] = useState('ECO-2026-014');
  const delEco = IMPACTOS.filter(i => i.ecoId === ecoId);
  const altos = delEco.filter(i => i.nivel === 'Alto').length;
  const totalTipos = new Set(delEco.map(i => i.tipo)).size;
  return (
    <FunctionBlock code="PLM-11">
      <Toolbar>
        <div className="w-72"><select className={INPUT} value={ecoId} onChange={e => setEcoId(e.target.value)}>{ECOS.map(e => <option key={e.id} value={e.id}>{e.id} · {nombreProducto(e.productoId)}</option>)}</select></div>
        <span className="text-xs text-gray-500">{delEco.length} impactos identificados · {totalTipos} tipos de objeto afectados.</span>
      </Toolbar>
      {altos > 0 && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-800">
          {altos} impacto(s) de nivel alto: la evaluación debe completarse antes de aplicar el cambio.
        </div>
      )}
      <DataTable footer="El impacto debe evaluarse antes de pasar a la etapa de aplicación.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Tipo</Th><Th>Referencia</Th><Th>Descripción</Th><Th align="center">Nivel</Th><Th>Acción propuesta</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {delEco.map(i => (
            <tr key={i.id} className="hoverable">
              <Td><StatusBadge label={i.tipo} tone={i.tipo === 'BOM' ? 'petroleum' : i.tipo === 'Orden de producción' ? 'blue' : i.tipo === 'Orden de compra' ? 'amber' : 'gray'} /></Td>
              <Td><span className="font-mono text-gray-600">{i.referencia}</span></Td>
              <Td className="max-w-md">{i.descripcion}</Td>
              <Td align="center"><StatusBadge label={i.nivel} tone={TONO_NIVEL[i.nivel]} /></Td>
              <Td>{i.accion}</Td>
            </tr>
          ))}
          {delEco.length === 0 && <EmptyRow colSpan={5} text="Sin impactos registrados para esta ECO." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueAuditoria() {
  const [ecoId, setEcoId] = useState('ECO-2026-013');
  const delEco = EVENTOS_PLM.filter(e => e.ecoId === ecoId).sort((a, b) => a.fecha.localeCompare(b.fecha));
  return (
    <FunctionBlock code="PLM-13">
      <Toolbar>
        <div className="w-72"><select className={INPUT} value={ecoId} onChange={e => setEcoId(e.target.value)}>{ECOS.map(e => <option key={e.id} value={e.id}>{e.id} · {nombreProducto(e.productoId)}</option>)}</select></div>
      </Toolbar>
      <DataTable footer="Registro inmutable: quién creó, revisó, aprobó y aplicó cada cambio, con fecha y versión resultante.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Fecha</Th><Th align="center">Acción</Th><Th>Usuario</Th><Th align="center">Versión resultante</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {delEco.map(e => (
            <tr key={e.id} className="hoverable">
              <Td><span className="font-mono text-gray-500">{e.fecha}</span></Td>
              <Td align="center"><StatusBadge label={e.accion} tone={e.accion === 'Aplicó' ? 'green' : e.accion === 'Rechazó' ? 'red' : 'blue'} /></Td>
              <Td className="font-medium">{e.usuario}</Td>
              <Td align="center">{e.versionResultante ? <span className="font-mono text-petroleum-700">{e.versionResultante}</span> : '—'}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------ Versiones de BOM ------------------------------ */

function TabVersiones() {
  return (
    <div className="space-y-4">
      <BloqueVersiones />
      <BloqueRevisiones />
      <BloqueComponentes />
      <BloqueOperaciones />
      <BloqueEfectividad />
      <BloqueArchivo />
    </div>
  );
}

function BloqueVersiones() {
  const [productoId, setProductoId] = useState('PR-01');
  const [msg, setMsg] = useState<string | null>(null);
  const delProducto = VERSIONES_BOM.filter(v => v.productoId === productoId).sort((a, b) => b.version.localeCompare(a.version));
  return (
    <FunctionBlock code="PLM-05">
      <Toolbar>
        <div className="w-72"><select className={INPUT} value={productoId} onChange={e => setProductoId(e.target.value)}>{PRODUCTOS_PLM.map(p => <option key={p.id} value={p.id}>{p.codigo} · {p.nombre}</option>)}</select></div>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Nueva versión de BOM creada desde la ECO seleccionada; la versión anterior queda archivada (simulado).'), 400)}>+ Nueva versión desde ECO</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${delProducto.length} versiones de BOM para ${nombreProducto(productoId)}.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Versión</Th><Th>ECO asociada</Th><Th>Efectividad desde</Th><Th>Efectividad hasta</Th><Th align="center">Vigente</Th><Th align="right">Componentes</Th><Th align="right">Operaciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {delProducto.map(v => (
            <tr key={v.id} className="hoverable">
              <Td><span className="font-mono font-semibold text-petroleum-700">{v.version}</span></Td>
              <Td>{v.ecoId ? <span className="font-mono text-gray-500">{v.ecoId}</span> : '—'}</Td>
              <Td>{fmtFecha(v.efectividadDesde)}</Td>
              <Td>{v.efectividadHasta ? fmtFecha(v.efectividadHasta) : '—'}</Td>
              <Td align="center">{v.vigente ? <StatusBadge label="Vigente" tone="green" /> : <StatusBadge label="Archivada" tone="gray" />}</Td>
              <Td align="right"><span className="font-mono">{v.componentes.length}</span></Td>
              <Td align="right"><span className="font-mono">{v.operaciones.length}</span></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueRevisiones() {
  const [versionId, setVersionId] = useState('VB-01');
  const delVersion = REVISIONES.filter(r => r.versionId === versionId).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const ver = VERSIONES_BOM.find(v => v.id === versionId)!;
  return (
    <FunctionBlock code="PLM-06">
      <Toolbar>
        <div className="w-72">
          <select className={INPUT} value={versionId} onChange={e => setVersionId(e.target.value)}>
            {VERSIONES_BOM.map(v => <option key={v.id} value={v.id}>{nombreProducto(v.productoId)} · versión {v.version}</option>)}
          </select>
        </div>
      </Toolbar>
      <DataTable footer={`${delVersion.length} revisiones del historial de la versión ${ver.version}.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Fecha</Th><Th>Responsable</Th><Th>Cambios realizados</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {delVersion.map(r => (
            <tr key={r.id} className="hoverable">
              <Td>{fmtFecha(r.fecha)}</Td>
              <Td className="font-medium">{r.responsable}</Td>
              <Td className="max-w-xl">{r.cambios}</Td>
            </tr>
          ))}
          {delVersion.length === 0 && <EmptyRow colSpan={3} text="Sin revisiones registradas para esta versión." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueComponentes() {
  const [versionId, setVersionId] = useState('VB-01');
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const ver = VERSIONES_BOM.find(v => v.id === versionId)!;
  return (
    <FunctionBlock code="PLM-07">
      <Toolbar>
        <div className="w-72">
          <select className={INPUT} value={versionId} onChange={e => setVersionId(e.target.value)}>
            {VERSIONES_BOM.map(v => <option key={v.id} value={v.id}>{nombreProducto(v.productoId)} · versión {v.version}</option>)}
          </select>
        </div>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Agregar componente</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${ver.componentes.length} componentes de la versión ${ver.version} · cambios marcados según la ECO.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Componente</Th><Th align="right">Cantidad</Th><Th align="center">Unidad</Th><Th>Variante</Th><Th align="center">Subproducto</Th><Th align="center">Acción</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ver.componentes.map(c => (
            <tr key={c.id} className="hoverable">
              <Td className="font-medium">{c.nombre}</Td>
              <Td align="right"><span className="font-mono">{fmtNum(c.cantidad)}</span></Td>
              <Td align="center">{c.unidad}</Td>
              <Td>{c.variante}</Td>
              <Td align="center">{c.esSubproducto ? <StatusBadge label="Subproducto" tone="blue" /> : '—'}</Td>
              <Td align="center"><StatusBadge label={c.accion} tone={TONO_ACCION[c.accion]} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Agregar componente a la versión" onClose={() => setModal(false)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setModal(false);
              window.setTimeout(() => setMsg('Componente agregado a la versión con acción «Agregar» (simulado).'), 400);
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-600">Componente<input className={INPUT} data-initial-focus required /></label>
              <label className="text-xs text-gray-600">Variante<input className={INPUT} placeholder="Ej. Estándar" /></label>
              <label className="text-xs text-gray-600">Cantidad<input className={INPUT} type="number" step="0.01" required /></label>
              <label className="text-xs text-gray-600">Unidad
                <select className={INPUT}><option>kg</option><option>g</option><option>L</option><option>u</option></select>
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-700"><input type="checkbox" /> Es subproducto (reproceso o derivado)</label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Agregar</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueOperaciones() {
  const [versionId, setVersionId] = useState('VB-03');
  const [msg, setMsg] = useState<string | null>(null);
  const ver = VERSIONES_BOM.find(v => v.id === versionId)!;
  return (
    <FunctionBlock code="PLM-08">
      <Toolbar>
        <div className="w-72">
          <select className={INPUT} value={versionId} onChange={e => setVersionId(e.target.value)}>
            {VERSIONES_BOM.map(v => <option key={v.id} value={v.id}>{nombreProducto(v.productoId)} · versión {v.version}</option>)}
          </select>
        </div>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Operación agregada a la ruta con acción «Agregar» (simulado).'), 400)}>+ Agregar operación</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${ver.operaciones.length} operaciones de la ruta · versión ${ver.version}`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Operación</Th><Th>Centro</Th><Th align="right">Tiempo</Th><Th>Dependencias</Th><Th>Instrucciones</Th><Th align="center">Acción</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ver.operaciones.map(o => (
            <tr key={o.id} className="hoverable">
              <Td className="font-medium">{o.nombre}</Td>
              <Td><span className="font-mono text-gray-500">{o.centro}</span></Td>
              <Td align="right"><span className="font-mono">{fmtHoras(o.tiempoHoras)}</span></Td>
              <Td>{o.dependencias}</Td>
              <Td className="max-w-md">{o.instrucciones}</Td>
              <Td align="center"><StatusBadge label={o.accion} tone={TONO_ACCION[o.accion]} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueEfectividad() {
  const [fecha, setFecha] = useState('2026-11-05');
  const [msg, setMsg] = useState<string | null>(null);
  const vigente = (v: (typeof VERSIONES_BOM)[number]) => {
    if (v.efectividadDesde > fecha) return 'futura';
    if (v.efectividadHasta && v.efectividadHasta < fecha) return 'archivada';
    return 'vigente';
  };
  return (
    <FunctionBlock code="PLM-09">
      <Toolbar>
        <label className="text-xs text-gray-600">Fecha de producción
          <input type="date" className={INPUT} value={fecha} onChange={e => setFecha(e.target.value)} />
        </label>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg(`Versión vigente para el ${fmtFecha(fecha)} confirmada para producción (simulado).`), 400)}>Usar versión vigente</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`Versión vigente seleccionada automáticamente para el ${fmtFecha(fecha)}.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Producto</Th><Th align="center">Versión</Th><Th>Desde</Th><Th>Hasta</Th><Th align="center">Estado según fecha</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {VERSIONES_BOM.map(v => {
            const estado = vigente(v);
            return (
              <tr key={v.id} className={`hoverable ${estado === 'vigente' ? 'bg-green-50/40' : ''}`}>
                <Td className="font-medium">{nombreProducto(v.productoId)}</Td>
                <Td align="center"><span className="font-mono font-semibold text-petroleum-700">{v.version}</span></Td>
                <Td>{fmtFecha(v.efectividadDesde)}</Td>
                <Td>{v.efectividadHasta ? fmtFecha(v.efectividadHasta) : '—'}</Td>
                <Td align="center">
                  {estado === 'vigente' ? <StatusBadge label="Vigente" tone="green" /> : estado === 'futura' ? <StatusBadge label="Aún no vigente" tone="blue" /> : <StatusBadge label="Archivada" tone="gray" />}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueArchivo() {
  const [msg, setMsg] = useState<string | null>(null);
  const archivadas = VERSIONES_BOM.filter(v => !v.vigente);
  return (
    <FunctionBlock code="PLM-10">
      <Toolbar>
        <span className="text-xs text-gray-500">Las versiones anteriores no se eliminan: se conservan para consulta y reactivación controlada.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${archivadas.length} versiones archivadas conservadas.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Producto</Th><Th align="center">Versión</Th><Th>Vigente desde</Th><Th>Vigente hasta</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {archivadas.map(v => (
            <tr key={v.id} className="hoverable">
              <Td className="font-medium">{nombreProducto(v.productoId)}</Td>
              <Td align="center"><span className="font-mono text-gray-600">{v.version}</span></Td>
              <Td>{fmtFecha(v.efectividadDesde)}</Td>
              <Td>{v.efectividadHasta ? fmtFecha(v.efectividadHasta) : '—'}</Td>
              <Td align="right">
                <div className="flex justify-end gap-1.5">
                  <button className={BTN_GHOST} onClick={() => window.setTimeout(() => setMsg(`Versión ${v.version} abierta en modo consulta (simulado).`), 400)}>Consultar</button>
                  <button className={BTN_GHOST} onClick={() => window.setTimeout(() => setMsg(`Reactivación de la versión ${v.version} solicitada: requiere aprobación de Dirección técnica (simulado).`), 400)}>Reactivar (controlado)</button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------- Documentación y reportes ------------------------- */

function TabDocs() {
  return (
    <div className="space-y-4">
      <BloqueDocumental />
      <BloqueReportes />
      <BloqueIntegracion />
    </div>
  );
}

function BloqueDocumental() {
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const tono: Record<string, BadgeTone> = { 'Plano': 'blue', 'Especificación': 'petroleum', 'Certificado': 'green', 'Evidencia': 'gray' };
  return (
    <FunctionBlock code="PLM-12">
      <Toolbar>
        <span className="text-xs text-gray-500">Planos, especificaciones, certificados y evidencias con control de versiones y acceso.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Adjuntar documento</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${DOCUMENTOS_PLM.length} documentos con control de versiones.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Documento</Th><Th align="center">Tipo</Th><Th>Vinculado a</Th><Th align="center">Versión</Th><Th align="center">Acceso</Th><Th>Fecha</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {DOCUMENTOS_PLM.map(d => (
            <tr key={d.id} className="hoverable">
              <Td className="font-medium">{d.nombre}</Td>
              <Td align="center"><StatusBadge label={d.tipo} tone={tono[d.tipo]} /></Td>
              <Td><span className="font-mono text-gray-500">{d.vinculado}</span></Td>
              <Td align="center"><span className="font-mono text-gray-500">{d.version}</span></Td>
              <Td align="center"><StatusBadge label={d.acceso} tone={d.acceso === 'Público' ? 'green' : d.acceso === 'Ingeniería' ? 'blue' : 'amber'} /></Td>
              <Td>{fmtFecha(d.fecha)}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Adjuntar documento a un cambio" onClose={() => setModal(false)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setModal(false);
              window.setTimeout(() => setMsg('Documento adjuntado con versión v1 y acceso controlado (simulado).'), 400);
            }}
          >
            <label className="text-xs text-gray-600">Nombre del documento<input className={INPUT} data-initial-focus required /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-600">Tipo
                <select className={INPUT}><option>Plano</option><option>Especificación</option><option>Certificado</option><option>Evidencia</option></select>
              </label>
              <label className="text-xs text-gray-600">Vincular a
                <select className={INPUT}>{ECOS.map(e => <option key={e.id}>{e.id}</option>)}</select>
              </label>
            </div>
            <label className="text-xs text-gray-600">Acceso
              <select className={INPUT}><option>Ingeniería</option><option>Producción</option><option>Público</option></select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Adjuntar</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueReportes() {
  const porEtapa = ETAPAS_CAMBIO.map(e => ({ label: e.nombre, n: ECOS.filter(x => x.etapaId === e.id).length }));
  const porTipo = TIPOS_CAMBIO.map(t => ({ label: t.nombre, n: ECOS.filter(x => x.tipoId === t.id).length }));
  const porResponsable = [...new Set(ECOS.map(e => e.responsable))].map(r => ({ label: r, n: ECOS.filter(x => x.responsable === r).length }));
  const porProducto = [...new Set(ECOS.map(e => e.productoId))].map(p => ({ label: nombreProducto(p), n: ECOS.filter(x => x.productoId === p).length })).sort((a, b) => b.n - a.n);
  const maxEt = Math.max(...porEtapa.map(x => x.n), 1);
  const maxTi = Math.max(...porTipo.map(x => x.n), 1);
  const maxR = Math.max(...porResponsable.map(x => x.n), 1);
  const maxP = Math.max(...porProducto.map(x => x.n), 1);
  const dias = (e: ECO) => {
    const fin = e.fechaEfectividad ?? '2026-10-28';
    return Math.round((new Date(fin).getTime() - new Date(e.fechaCreacion).getTime()) / 86400000);
  };
  const cicloProm = ECOS.filter(e => e.fechaEfectividad).map(dias);
  const prom = cicloProm.length > 0 ? (cicloProm.reduce((a, b) => a + b, 0) / cicloProm.length).toFixed(1) : '—';
  return (
    <FunctionBlock code="PLM-14">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Cambios por etapa"><div className="space-y-3">{porEtapa.map(x => <Barra key={x.label} label={x.label} valor={x.n} max={maxEt} />)}</div></Card>
        <Card title="Cambios por tipo"><div className="space-y-3">{porTipo.map(x => <Barra key={x.label} label={x.label} valor={x.n} max={maxTi} />)}</div></Card>
        <Card title="Cambios por responsable"><div className="space-y-3">{porResponsable.map(x => <Barra key={x.label} label={x.label} valor={x.n} max={maxR} />)}</div></Card>
        <Card title="Cambios por producto"><div className="space-y-3">{porProducto.map(x => <Barra key={x.label} label={x.label} valor={x.n} max={maxP} />)}</div></Card>
        <Card title="Tiempo de ciclo (creación → efectividad)" className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="text-2xl font-semibold tabular text-petroleum-700">{prom} d</div>
              <div className="text-xs text-gray-400">promedio de {cicloProm.length} ECOs aplicadas</div>
            </div>
            <div className="flex-1" />
            <ul className="space-y-1 text-xs text-gray-600">
              {ECOS.filter(e => e.fechaEfectividad).map(e => (
                <li key={e.id} className="flex items-center justify-between gap-6">
                  <span className="font-mono text-gray-500">{e.id}</span>
                  <span className="text-gray-500">{nombreProducto(e.productoId)}</span>
                  <span className="font-mono">{dias(e)} d</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </FunctionBlock>
  );
}

function BloqueIntegracion() {
  const [msg, setMsg] = useState<string | null>(null);
  const afectadas = IMPACTOS.filter(i => i.tipo === 'Orden de producción' || i.tipo === 'Orden de compra');
  return (
    <FunctionBlock code="PLM-16">
      <Toolbar>
        <span className="text-xs text-gray-500">Producción y compras usan la misma versión vigente; las órdenes abiertas afectadas por un cambio se alertan.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Producción y compras notificadas sobre la versión vigente y las órdenes afectadas (simulado).'), 400)}>Notificar áreas</button>
      </Toolbar>
      <Aviso texto={msg} />
      {afectadas.length > 0 && (
        <div className="mb-3 rounded border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
          ⚠️ {afectadas.length} órdenes abiertas quedan afectadas por cambios en curso y deben replanificarse antes de la fecha de efectividad.
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <DataTable footer={`${PRODUCTOS_PLM.length} productos sincronizados.`}>
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr><Th>Producto</Th><Th align="center">Versión vigente</Th><Th align="center">Producción</Th><Th align="center">Compras</Th><Th align="center">Estado</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PRODUCTOS_PLM.map(p => (
              <tr key={p.id} className="hoverable">
                <Td className="font-medium">{p.nombre}</Td>
                <Td align="center"><span className="font-mono font-semibold text-petroleum-700">{p.versionVigente}</span></Td>
                <Td align="center"><span className="font-mono text-gray-500">{p.versionVigente}</span></Td>
                <Td align="center"><span className="font-mono text-gray-500">{p.versionVigente}</span></Td>
                <Td align="center"><StatusBadge label="Sincronizado" tone="green" /></Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
        <DataTable footer={`${afectadas.length} órdenes abiertas afectadas.`}>
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr><Th>Tipo</Th><Th>Referencia</Th><Th>ECO</Th><Th align="center">Nivel</Th><Th>Acción</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {afectadas.map(i => (
              <tr key={i.id} className="hoverable">
                <Td><StatusBadge label={i.tipo} tone="blue" /></Td>
                <Td><span className="font-mono text-gray-600">{i.referencia}</span></Td>
                <Td><span className="font-mono text-gray-500">{i.ecoId}</span></Td>
                <Td align="center"><StatusBadge label={i.nivel} tone={TONO_NIVEL[i.nivel]} /></Td>
                <Td>{i.accion}</Td>
              </tr>
            ))}
            {afectadas.length === 0 && <EmptyRow colSpan={5} text="Ninguna orden abierta afectada." />}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/* --------------------------------- Página --------------------------------- */

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'config', label: 'Configuración' },
  { id: 'ecos', label: 'Órdenes de cambio' },
  { id: 'versiones', label: 'Versiones de BOM' },
  { id: 'docs', label: 'Documentación y reportes' },
];

export default function PLM() {
  const [tab, setTab] = useState('resumen');
  const enCurso = ECOS.filter(e => e.etapaId !== 'EC-05').length;
  const pendientes = APROBACIONES.filter(a => a.decision === 'Pendiente').length;
  const vigentes = VERSIONES_BOM.filter(v => v.vigente).length;
  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('plm')} funcionalidades · Fase ${MOD.fase}`}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="ECOs en curso" value={fmtNum(enCurso)} sub={`${ECOS.length} cambios totales`} tone="info" />
        <StatCard label="Aprobaciones pendientes" value={fmtNum(pendientes)} sub={`${APROBACIONES.length} aprobaciones`} tone="warn" />
        <StatCard label="Versiones de BOM vigentes" value={fmtNum(vigentes)} sub={`${VERSIONES_BOM.length} versiones totales`} tone="ok" />
        <StatCard label="Tiempo de ciclo promedio" value="12,4 d" sub="creación → efectividad" tone="default" />
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'resumen' && <TabResumen />}
      {tab === 'config' && <TabConfig />}
      {tab === 'ecos' && <TabEcos />}
      {tab === 'versiones' && <TabVersiones />}
      {tab === 'docs' && <TabDocs />}
    </div>
  );
}

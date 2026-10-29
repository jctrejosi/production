import { useState } from 'react';
import {
  BTN_DANGER,
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
import { fmtFecha, fmtHoras, fmtMoney, fmtNum, fmtPct } from '../lib/format';
import {
  CATEGORIAS_EQUIPO,
  EQUIPOS,
  EQUIPOS_MANTENIMIENTO,
  ETAPAS_MANTENIMIENTO,
  FIABILIDAD,
  ORDENES_REPARACION,
  RECURRENCIAS,
  REPUESTOS,
  SOLICITUDES,
  type Repuesto,
  type Solicitud,
} from '../data/mnt';

const MOD = MODULOS.find(m => m.id === 'mnt')!;

const TONO_PRIORIDAD: Record<string, BadgeTone> = {
  'Alta': 'red',
  'Media': 'amber',
  'Baja': 'gray',
};

const TONO_ESTADO: Record<string, BadgeTone> = {
  'Abierta': 'green',
  'Cerrada': 'gray',
  'Cancelada': 'red',
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

const nombreEquipo = (id: string) => EQUIPOS.find(e => e.id === id)?.nombre ?? id;

/* ------------------------------- Resumen ------------------------------- */

function TabResumen() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Objetivo">
        <p className="text-xs leading-relaxed text-gray-700">
          Gestionar equipos y maquinaria, prevenir fallas y asegurar la disponibilidad de los recursos productivos.
        </p>
      </Card>
      <Card title="Alcance">
        <p className="text-xs leading-relaxed text-gray-700">
          Equipos, categorías, equipos de mantenimiento, solicitudes correctivas y preventivas, recurrencia, programación, repuestos, indicadores de fiabilidad y reparaciones.
        </p>
      </Card>
      <Card title="Actores">
        <div className="flex flex-wrap gap-1.5">
          {['Responsable de mantenimiento', 'Técnico', 'Supervisor de producción', 'Operario', 'Compras'].map(a => (
            <span key={a} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">{a}</span>
          ))}
        </div>
      </Card>
      <Card title="Reglas de negocio">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-700">
          <li>Toda solicitud debe tener equipo y responsable.</li>
          <li>Una solicitud cerrada no puede modificarse sin reapertura.</li>
          <li>La recurrencia genera la siguiente solicitud al cerrar.</li>
          <li>El cierre registra fecha real y observaciones.</li>
          <li>Los repuestos consumidos afectan inventario.</li>
          <li>Las fallas alimentan los indicadores de fiabilidad.</li>
        </ul>
      </Card>
      <Card title="Integraciones">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-700">
          <li>Inventario: repuestos, lotes y ubicaciones.</li>
          <li>Producción: disponibilidad de centros y equipos.</li>
          <li>Compras: repuestos y servicios.</li>
          <li>Finanzas: costos de mantenimiento.</li>
          <li>Calidad: fallas y acciones correctivas.</li>
        </ul>
      </Card>
      <Card title="Criterios de aceptación">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-700">
          <li>Todo equipo tiene historial de mantenimiento.</li>
          <li>Las solicitudes preventivas se generan según el plan.</li>
          <li>MTBF y MTTR se calculan con fechas reales.</li>
          <li>Los repuestos consumidos quedan trazados.</li>
          <li>El tablero muestra la carga real del equipo de mantenimiento.</li>
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------ Maestros y configuración ------------------------------ */

function TabMaestros() {
  return (
    <div className="space-y-4">
      <BloqueFichaEquipo />
      <BloqueCategorias />
      <BloqueEquiposMantenimiento />
      <BloqueEtapas />
      <BloquePropiedades />
      <BloqueConfiguracion />
    </div>
  );
}

function BloqueFichaEquipo() {
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const visibles = EQUIPOS.filter(e =>
    !q ||
    e.nombre.toLowerCase().includes(q.toLowerCase()) ||
    e.id.toLowerCase().includes(q.toLowerCase()) ||
    e.ubicacion.toLowerCase().includes(q.toLowerCase())
  );
  const hoy = '2026-10-28';
  return (
    <FunctionBlock code="MNT-01">
      <Toolbar>
        <input className={INPUT} placeholder="Buscar equipo, código o ubicación..." value={q} onChange={e => setQ(e.target.value)} />
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nuevo equipo</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${visibles.length} equipos registrados · ${EQUIPOS.filter(e => !e.fechaBaja).length} activos`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th><Th>Nombre</Th><Th>Categoría</Th><Th>Responsable</Th><Th>Proveedor</Th><Th>Modelo / Serie</Th><Th align="right">Costo</Th><Th align="center">Garantía</Th><Th>Ubicación</Th><Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(e => {
            const vigente = !e.fechaBaja && e.garantiaHasta >= hoy;
            return (
              <tr key={e.id} className="hoverable">
                <Td><span className="font-mono text-gray-600">{e.id}</span></Td>
                <Td className="font-medium">{e.nombre}</Td>
                <Td>{e.categoria}</Td>
                <Td>{e.responsable}</Td>
                <Td>{e.proveedor}</Td>
                <Td>{e.modelo} · <span className="font-mono text-gray-500">{e.serie}</span></Td>
                <Td align="right"><span className="font-mono">{fmtMoney(e.costo)}</span></Td>
                <Td align="center">{vigente ? <StatusBadge label={`Hasta ${fmtFecha(e.garantiaHasta)}`} tone="green" /> : <StatusBadge label="Vencida" tone="red" />}</Td>
                <Td>{e.ubicacion}</Td>
                <Td align="center">{e.fechaBaja ? <StatusBadge label="Dado de baja" tone="red" /> : <StatusBadge label="Activo" tone="green" />}</Td>
              </tr>
            );
          })}
          {visibles.length === 0 && <EmptyRow colSpan={10} text="Ningún equipo coincide con la búsqueda." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nuevo equipo" onClose={() => setModal(false)} wide>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setModal(false);
              window.setTimeout(() => setMsg('Equipo registrado con costo, garantía, ubicación y responsable (simulado).'), 400);
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-600">Nombre<input className={INPUT} data-initial-focus placeholder="Ej. Empaquetadora vertical EV-300" required /></label>
              <label className="text-xs text-gray-600">Categoría
                <select className={INPUT}>{CATEGORIAS_EQUIPO.map(c => <option key={c.id}>{c.nombre}</option>)}</select>
              </label>
              <label className="text-xs text-gray-600">Propietario
                <select className={INPUT}><option>Producción</option><option>Almacén</option><option>Calidad</option></select>
              </label>
              <label className="text-xs text-gray-600">Responsable<input className={INPUT} placeholder="Nombre del responsable" required /></label>
              <label className="text-xs text-gray-600">Proveedor<input className={INPUT} placeholder="Proveedor del equipo" /></label>
              <label className="text-xs text-gray-600">Modelo<input className={INPUT} placeholder="Modelo" /></label>
              <label className="text-xs text-gray-600">Número de serie<input className={INPUT} placeholder="Serie" /></label>
              <label className="text-xs text-gray-600">Costo (COP)<input className={INPUT} type="number" placeholder="0" /></label>
              <label className="text-xs text-gray-600">Vencimiento de garantía<input className={INPUT} type="date" defaultValue="2027-10-28" /></label>
              <label className="text-xs text-gray-600">Ubicación<input className={INPUT} placeholder="Planta · Línea" /></label>
            </div>
            <label className="text-xs text-gray-600">Observaciones<textarea className={INPUT} rows={2} /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Registrar equipo</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueCategorias() {
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="MNT-02">
      <Toolbar>
        <span className="text-xs text-gray-500">Agrupación de equipos con responsable por defecto y propiedades personalizadas.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nueva categoría</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${CATEGORIAS_EQUIPO.length} categorías de equipo.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Código</Th><Th>Categoría</Th><Th>Responsable por defecto</Th><Th>Propiedades personalizadas</Th><Th align="center">Equipos</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {CATEGORIAS_EQUIPO.map(c => (
            <tr key={c.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
              <Td className="font-medium">{c.nombre}</Td>
              <Td>{c.responsableDefault}</Td>
              <Td><div className="flex flex-wrap gap-1">{c.propiedades.map(p => <span key={p} className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{p}</span>)}</div></Td>
              <Td align="center"><span className="font-mono text-gray-600">{EQUIPOS.filter(e => e.categoria === c.nombre).length}</span></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nueva categoría de equipo" onClose={() => setModal(false)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setModal(false);
              window.setTimeout(() => setMsg('Categoría creada con responsable por defecto (simulado).'), 400);
            }}
          >
            <label className="text-xs text-gray-600">Nombre<input className={INPUT} data-initial-focus placeholder="Ej. Transporte interno" required /></label>
            <label className="text-xs text-gray-600">Responsable por defecto<input className={INPUT} placeholder="Nombre" required /></label>
            <label className="text-xs text-gray-600">Propiedad personalizada (opcional)<input className={INPUT} placeholder="Ej. Capacidad (kg)" /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Crear categoría</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueEquiposMantenimiento() {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="MNT-03">
      <Toolbar>
        <span className="text-xs text-gray-500">Equipos de trabajo con miembros, correo de recepción de solicitudes y carga de trabajo.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Equipo de mantenimiento creado (simulado).'), 400)}>+ Nuevo equipo de mantenimiento</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${EQUIPOS_MANTENIMIENTO.length} equipos de mantenimiento.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Equipo</Th><Th>Miembros</Th><Th>Correo de solicitudes</Th><Th>Carga de trabajo</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {EQUIPOS_MANTENIMIENTO.map(e => (
            <tr key={e.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{e.id}</span> <span className="font-medium">{e.nombre}</span></Td>
              <Td><div className="flex flex-wrap gap-1">{e.miembros.map(m => <span key={m} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">{m}</span>)}</div></Td>
              <Td><span className="font-mono text-xs text-petroleum-700">{e.correo}</span></Td>
              <Td>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded bg-gray-100">
                    <div className={`h-2 rounded ${e.carga > 70 ? 'bg-red-400' : e.carga > 50 ? 'bg-amber-400' : 'bg-petroleum-500'}`} style={{ width: `${e.carga}%` }} />
                  </div>
                  <span className="font-mono text-xs text-gray-600">{e.carga} %</span>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueEtapas() {
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="MNT-04">
      <Toolbar>
        <span className="text-xs text-gray-500">Flujo visual de etapas para las solicitudes de mantenimiento.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Agregar etapa</button>
      </Toolbar>
      <Aviso texto={msg} />
      <div className="overflow-x-auto">
        <div className="flex items-center gap-2">
          {ETAPAS_MANTENIMIENTO.sort((a, b) => a.orden - b.orden).map((e, i) => (
            <div key={e.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-petroleum-100 bg-petroleum-50 px-3 py-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-petroleum-500 font-mono text-[10px] text-white">{e.orden}</span>
                <span className="text-xs font-medium text-petroleum-800">{e.nombre}</span>
                <span className="font-mono text-[10px] text-gray-400">{SOLICITUDES.filter(s => s.etapa === e.nombre).length}</span>
              </div>
              {i < ETAPAS_MANTENIMIENTO.length - 1 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
      </div>
      {modal && (
        <Modal title="Agregar etapa al flujo" onClose={() => setModal(false)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setModal(false);
              window.setTimeout(() => setMsg('Etapa agregada al flujo de solicitudes (simulado).'), 400);
            }}
          >
            <label className="text-xs text-gray-600">Nombre de la etapa<input className={INPUT} data-initial-focus placeholder="Ej. En diagnóstico" required /></label>
            <label className="text-xs text-gray-600">Posición
              <select className={INPUT}>{ETAPAS_MANTENIMIENTO.map((e, i) => <option key={e.id}>Después de «{e.nombre}»</option>)}</select>
            </label>
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

function BloquePropiedades() {
  const [categoria, setCategoria] = useState(CATEGORIAS_EQUIPO[0].id);
  const [props, setProps] = useState<string[]>(CATEGORIAS_EQUIPO[0].propiedades);
  const [nueva, setNueva] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const cat = CATEGORIAS_EQUIPO.find(c => c.id === categoria)!;
  return (
    <FunctionBlock code="MNT-17">
      <Toolbar>
        <div className="w-64"><select className={INPUT} value={categoria} onChange={e => { setCategoria(e.target.value); const c = CATEGORIAS_EQUIPO.find(x => x.id === e.target.value)!; setProps(c.propiedades); }}>{CATEGORIAS_EQUIPO.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
      </Toolbar>
      <Aviso texto={msg} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded border border-gray-100 bg-gray-50/50 p-4">
          <h4 className="mb-2 text-xs font-semibold text-gray-700">Propiedades de la categoría «{cat.nombre}»</h4>
          <div className="space-y-1.5">
            {props.map(p => <div key={p} className="rounded border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700">{p}</div>)}
          </div>
          <div className="mt-3 flex gap-2">
            <input className={INPUT} placeholder="Nueva propiedad..." value={nueva} onChange={e => setNueva(e.target.value)} />
            <button
              className={BTN_PRIMARY}
              disabled={!nueva.trim()}
              onClick={() => {
                setProps(lista => [...lista, nueva.trim()]);
                setNueva('');
                window.setTimeout(() => setMsg(`Propiedad «${nueva.trim()}» agregada a la categoría (simulado).`), 400);
              }}
            >
              Agregar
            </button>
          </div>
        </div>
        <div className="rounded border border-gray-100 bg-gray-50/50 p-4">
          <h4 className="mb-2 text-xs font-semibold text-gray-700">Campos adicionales por solicitud</h4>
          <p className="text-xs leading-relaxed text-gray-600">
            Cada solicitud hereda las propiedades de la categoría de su equipo. También es posible definir campos adicionales por tipo de solicitud (correctivo o preventivo).
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['Lectura de horas', 'Nº de parada', 'Consumo de energía (kWh)'].map(f => (
              <span key={f} className="rounded-full bg-petroleum-50 px-2 py-0.5 text-[11px] text-petroleum-700">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </FunctionBlock>
  );
}

function BloqueConfiguracion() {
  const [opciones, setOpciones] = useState({ activo: true, equipos: true, categorias: true, etapas: true, correo: true });
  const [msg, setMsg] = useState<string | null>(null);
  const items = [
    { id: 'activo', label: 'Módulo de mantenimiento activo' },
    { id: 'equipos', label: 'Gestión de equipos habilitada' },
    { id: 'categorias', label: 'Categorías y propiedades personalizadas' },
    { id: 'etapas', label: 'Flujo de etapas editable por supervisor' },
    { id: 'correo', label: 'Notificaciones por correo a equipos de mantenimiento' },
  ] as const;
  return (
    <FunctionBlock code="MNT-22">
      <Toolbar>
        <div className="w-72"><input className={INPUT} defaultValue="mantenimiento@mercaldas.co" aria-label="Alias de correo de solicitudes" /></div>
        <div className="w-48"><select className={INPUT}><option>Permisos: supervisores</option><option>Permisos: todos los usuarios</option></select></div>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Configuración de mantenimiento guardada (simulado).'), 400)}>Guardar configuración</button>
      </Toolbar>
      <Aviso texto={msg} />
      <div className="space-y-1 rounded border border-gray-100 bg-gray-50/50 p-4">
        <h4 className="mb-2 text-xs font-semibold text-gray-700">Parámetros del módulo</h4>
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

/* -------------------------------- Solicitudes -------------------------------- */

function TabSolicitudes() {
  return (
    <div className="space-y-4">
      <BloqueSolicitudes />
      <BloqueCorrectivo />
      <BloquePreventivo />
      <BloqueRecurrencia />
      <BloqueProgramacion />
      <BloqueTablero />
      <BloquePrioridad />
      <BloqueInstrucciones />
      <BloqueCierre />
    </div>
  );
}

function BloqueSolicitudes() {
  const [sols, setSols] = useState<Solicitud[]>(SOLICITUDES);
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const visibles = sols.filter(s =>
    (!q || s.id.toLowerCase().includes(q.toLowerCase()) || nombreEquipo(s.equipoId).toLowerCase().includes(q.toLowerCase()) || s.descripcion.toLowerCase().includes(q.toLowerCase())) &&
    (!tipo || s.tipo === tipo) &&
    (!prioridad || s.prioridad === prioridad)
  );
  return (
    <FunctionBlock code="MNT-05">
      <Toolbar>
        <input className={INPUT} placeholder="Buscar solicitud, equipo o descripción..." value={q} onChange={e => setQ(e.target.value)} />
        <div className="w-36"><select className={INPUT} value={tipo} onChange={e => setTipo(e.target.value)}><option value="">Tipo</option><option>Correctivo</option><option>Preventivo</option></select></div>
        <div className="w-36"><select className={INPUT} value={prioridad} onChange={e => setPrioridad(e.target.value)}><option value="">Prioridad</option><option>Alta</option><option>Media</option><option>Baja</option></select></div>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nueva solicitud</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${visibles.length} solicitudes · equipo y responsable obligatorios en todas`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Nº</Th><Th>Equipo</Th><Th align="center">Tipo</Th><Th align="center">Prioridad</Th><Th>Responsable</Th><Th>Fecha</Th><Th>Descripción</Th><Th align="center">Etapa</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(s => (
            <tr key={s.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{s.id}</span></Td>
              <Td className="font-medium">{nombreEquipo(s.equipoId)}</Td>
              <Td align="center"><StatusBadge label={s.tipo} tone={s.tipo === 'Preventivo' ? 'blue' : 'amber'} /></Td>
              <Td align="center"><StatusBadge label={s.prioridad} tone={TONO_PRIORIDAD[s.prioridad]} /></Td>
              <Td>{s.responsable}</Td>
              <Td>{fmtFecha(s.fecha)}</Td>
              <Td className="max-w-md">{s.descripcion}</Td>
              <Td align="center"><StatusBadge label={s.etapa} tone={s.etapa === 'Cerrada' ? 'gray' : s.etapa === 'En curso' ? 'petroleum' : 'blue'} /></Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={8} text="Ninguna solicitud coincide con los filtros." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nueva solicitud de mantenimiento" onClose={() => setModal(false)} wide>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              setSols(lista => [
                ...lista,
                {
                  id: `SM-${110 + lista.length}`,
                  equipoId: String(fd.get('equipo') ?? EQUIPOS[0].id),
                  tipo: (fd.get('tipo') ?? 'Correctivo') as Solicitud['tipo'],
                  prioridad: (fd.get('prioridad') ?? 'Media') as Solicitud['prioridad'],
                  responsable: String(fd.get('responsable') ?? 'Juan Pablo Restrepo'),
                  tecnico: 'Por asignar',
                  equipoMantId: 'EM-01',
                  fecha: '2026-10-28',
                  descripcion: String(fd.get('descripcion') ?? ''),
                  instrucciones: String(fd.get('instrucciones') ?? ''),
                  etapa: 'Nueva',
                  programada: null,
                  finPrevisto: null,
                  duracionHoras: null,
                  cierreReal: null,
                  estado: 'Abierta',
                  cambios: false,
                },
              ]);
              setModal(false);
              window.setTimeout(() => setMsg('Solicitud creada con equipo y responsable obligatorios (simulado).'), 400);
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-600">Equipo (obligatorio)
                <select name="equipo" className={INPUT} data-initial-focus required>{EQUIPOS.map(e => <option key={e.id} value={e.id}>{e.id} · {e.nombre}</option>)}</select>
              </label>
              <label className="text-xs text-gray-600">Tipo
                <select name="tipo" className={INPUT}><option>Correctivo</option><option>Preventivo</option></select>
              </label>
              <label className="text-xs text-gray-600">Prioridad
                <select name="prioridad" className={INPUT}><option>Alta</option><option>Media</option><option>Baja</option></select>
              </label>
              <label className="text-xs text-gray-600">Responsable (obligatorio)<input name="responsable" className={INPUT} defaultValue="Juan Pablo Restrepo" required /></label>
            </div>
            <label className="text-xs text-gray-600">Descripción<textarea name="descripcion" className={INPUT} rows={2} required /></label>
            <label className="text-xs text-gray-600">Instrucciones<textarea name="instrucciones" className={INPUT} rows={2} /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Crear solicitud</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueCorrectivo() {
  const [sols, setSols] = useState<Solicitud[]>(SOLICITUDES);
  const [diagnostico, setDiagnostico] = useState<Solicitud | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const correctivos = sols.filter(s => s.tipo === 'Correctivo');
  return (
    <FunctionBlock code="MNT-06">
      <Toolbar>
        <span className="text-xs text-gray-500">Fallas no planificadas: diagnóstico, reparación, documentación y cierre.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${correctivos.length} mantenimientos correctivos registrados.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Nº</Th><Th>Equipo</Th><Th>Falla</Th><Th align="center">Diagnóstico</Th><Th>Reparación</Th><Th align="center">Estado</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {correctivos.map(s => (
            <tr key={s.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{s.id}</span></Td>
              <Td className="font-medium">{nombreEquipo(s.equipoId)}</Td>
              <Td className="max-w-xs">{s.descripcion}</Td>
              <Td align="center">{s.etapa === 'En curso' ? <StatusBadge label="Diagnosticando" tone="amber" /> : <StatusBadge label="Registrado" tone="green" />}</Td>
              <Td className="max-w-xs">{s.instrucciones}</Td>
              <Td align="center"><StatusBadge label={s.estado} tone={TONO_ESTADO[s.estado]} /></Td>
              <Td align="right">
                <div className="flex justify-end gap-1.5">
                  {s.estado === 'Abierta' && <button className={BTN_GHOST} onClick={() => setDiagnostico(s)}>Diagnosticar</button>}
                  {s.estado === 'Abierta' && (
                    <button
                      className={BTN_GHOST}
                      onClick={() => {
                        setSols(lista => lista.map(x => (x.id === s.id ? { ...x, estado: 'Cerrada', etapa: 'Cerrada', cierreReal: '2026-10-28 17:00' } : x)));
                        window.setTimeout(() => setMsg(`${s.id} cerrado con reparación documentada (simulado).`), 400);
                      }}
                    >
                      Cerrar
                    </button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {diagnostico && (
        <Modal title={`Diagnóstico de ${diagnostico.id}`} onClose={() => setDiagnostico(null)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setSols(lista => lista.map(x => (x.id === diagnostico.id ? { ...x, etapa: 'En curso' } : x)));
              setDiagnostico(null);
              window.setTimeout(() => setMsg(`${diagnostico.id} diagnosticado; etapa actualizada a «En curso» (simulado).`), 400);
            }}
          >
            <label className="text-xs text-gray-600">Diagnóstico<textarea className={INPUT} rows={2} data-initial-focus required placeholder="Causa probable y plan de reparación..." /></label>
            <label className="text-xs text-gray-600">Repuestos requeridos<input className={INPUT} placeholder="Ej. REP-ELE-014" /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setDiagnostico(null)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Guardar diagnóstico</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloquePreventivo() {
  const [msg, setMsg] = useState<string | null>(null);
  const preventivos = SOLICITUDES.filter(s => s.tipo === 'Preventivo');
  return (
    <FunctionBlock code="MNT-07">
      <Toolbar>
        <span className="text-xs text-gray-500">Trabajos periódicos planificados con recursos asignados y registro de ejecución.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Plan preventivo creado con recurrencia asociada (simulado).'), 400)}>+ Programar preventivo</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${preventivos.length} mantenimientos preventivos · ${preventivos.filter(p => p.estado === 'Abierta').length} pendientes`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Nº</Th><Th>Equipo</Th><Th>Trabajo</Th><Th>Recurso</Th><Th>Programado</Th><Th align="right">Duración</Th><Th align="center">Ejecución</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {preventivos.map(s => (
            <tr key={s.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{s.id}</span></Td>
              <Td className="font-medium">{nombreEquipo(s.equipoId)}</Td>
              <Td className="max-w-xs">{s.descripcion}</Td>
              <Td>{s.tecnico}</Td>
              <Td>{s.programada ? <span className="font-mono text-gray-500">{s.programada}</span> : <StatusBadge label="Sin programar" tone="amber" />}</Td>
              <Td align="right">{s.duracionHoras !== null ? <span className="font-mono">{fmtHoras(s.duracionHoras)}</span> : '—'}</Td>
              <Td align="center">
                {s.estado === 'Cerrada'
                  ? <StatusBadge label="Ejecutado" tone="green" />
                  : s.programada
                    ? <StatusBadge label="Planificado" tone="blue" />
                    : <StatusBadge label="Pendiente" tone="amber" />}
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueRecurrencia() {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="MNT-08">
      <Toolbar>
        <span className="text-xs text-gray-500">Intervalos en días, semanas, meses o años, con duración indefinida o hasta una fecha; genera la siguiente solicitud al cerrar.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${RECURRENCIAS.length} recurrencias activas.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Nº</Th><Th>Equipo</Th><Th>Trabajo</Th><Th align="center">Intervalo</Th><Th align="center">Fin</Th><Th>Última</Th><Th>Próxima</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {RECURRENCIAS.map(r => (
            <tr key={r.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
              <Td className="font-medium">{nombreEquipo(r.equipoId)}</Td>
              <Td>{r.trabajo}</Td>
              <Td align="center"><span className="font-mono text-gray-600">{r.intervalo} {r.unidad}</span></Td>
              <Td align="center">{r.fin ? <span className="font-mono text-gray-500">{fmtFecha(r.fin)}</span> : <StatusBadge label="Indefinida" tone="blue" />}</Td>
              <Td>{r.ultima ? fmtFecha(r.ultima) : '—'}</Td>
              <Td><span className="font-mono text-gray-600">{fmtFecha(r.proxima)}</span></Td>
              <Td align="right">
                <button
                  className={BTN_GHOST}
                  onClick={() => window.setTimeout(() => setMsg(`Siguiente solicitud generada a partir de ${r.id} para el ${fmtFecha(r.proxima)} (simulado).`), 400)}
                >
                  Generar siguiente
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueProgramacion() {
  const [msg, setMsg] = useState<string | null>(null);
  const programadas = SOLICITUDES.filter(s => s.programada).sort((a, b) => (a.programada ?? '').localeCompare(b.programada ?? ''));
  return (
    <FunctionBlock code="MNT-09">
      <Toolbar>
        <span className="text-xs text-gray-500">Fecha y hora planificada, fin previsto, duración y fecha real de cierre.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Vista de calendario semanal abierta (simulado).'), 400)}>Vista de calendario</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${programadas.length} solicitudes programadas.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Nº</Th><Th>Equipo</Th><Th>Inicio planificado</Th><Th>Fin previsto</Th><Th align="right">Duración</Th><Th>Cierre real</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {programadas.map(s => (
            <tr key={s.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{s.id}</span></Td>
              <Td className="font-medium">{nombreEquipo(s.equipoId)}</Td>
              <Td><span className="font-mono text-gray-500">{s.programada}</span></Td>
              <Td><span className="font-mono text-gray-500">{s.finPrevisto ?? '—'}</span></Td>
              <Td align="right">{s.duracionHoras !== null ? <span className="font-mono">{fmtHoras(s.duracionHoras)}</span> : '—'}</Td>
              <Td>{s.cierreReal ? <span className="font-mono text-gray-500">{s.cierreReal}</span> : <StatusBadge label="Abierto" tone="amber" />}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueTablero() {
  return (
    <FunctionBlock code="MNT-10">
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-3" style={{ minWidth: '56rem' }}>
          {ETAPAS_MANTENIMIENTO.sort((a, b) => a.orden - b.orden).map(et => {
            const cards = SOLICITUDES.filter(s => s.etapa === et.nombre);
            return (
              <div key={et.id} className="w-52 shrink-0 rounded border border-gray-200 bg-gray-50/60">
                <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2">
                  <span className="text-xs font-semibold text-gray-700">{et.nombre}</span>
                  <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600">{cards.length}</span>
                </div>
                <div className="space-y-2 p-2">
                  {cards.map(s => (
                    <div key={s.id} className="rounded border border-gray-200 bg-white p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-gray-500">{s.id}</span>
                        <StatusBadge label={s.prioridad} tone={TONO_PRIORIDAD[s.prioridad]} />
                      </div>
                      <div className="mt-1 text-xs font-medium text-gray-800">{nombreEquipo(s.equipoId)}</div>
                      <div className="mt-0.5 line-clamp-2 text-[11px] text-gray-500">{s.descripcion}</div>
                      <div className="mt-1.5 text-[11px] text-gray-400">{s.responsable} · {s.tipo}</div>
                    </div>
                  ))}
                  {cards.length === 0 && <div className="rounded border border-dashed border-gray-200 p-3 text-center text-[11px] text-gray-400">Sin solicitudes</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-[11px] text-gray-400">El tablero agrupa por etapa, prioridad, responsable y equipo; arrastre no disponible en la demo.</p>
    </FunctionBlock>
  );
}

function BloquePrioridad() {
  const [asig, setAsig] = useState<Record<string, { prioridad: Solicitud['prioridad']; tecnico: string }>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const abiertas = SOLICITUDES.filter(s => s.estado === 'Abierta');
  return (
    <FunctionBlock code="MNT-11">
      <Toolbar>
        <span className="text-xs text-gray-500">Priorización y asignación de técnicos y equipos de mantenimiento.</span>
        <div className="flex-1" />
        <button
          className={BTN_PRIMARY}
          onClick={() => window.setTimeout(() => setMsg(`${Object.keys(asig).length} asignaciones guardadas y notificadas a los técnicos (simulado).`), 400)}
        >
          Guardar asignaciones
        </button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${abiertas.length} solicitudes abiertas para priorizar y asignar.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Nº</Th><Th>Equipo</Th><Th align="center">Prioridad</Th><Th>Técnico</Th><Th>Equipo de mantenimiento</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {abiertas.map(s => (
            <tr key={s.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{s.id}</span></Td>
              <Td className="font-medium">{nombreEquipo(s.equipoId)}</Td>
              <Td align="center">
                <div className="inline-block w-28">
                  <select
                    className={INPUT}
                    value={asig[s.id]?.prioridad ?? s.prioridad}
                    onChange={e => setAsig(a => ({ ...a, [s.id]: { ...(a[s.id] ?? { prioridad: s.prioridad, tecnico: s.tecnico }), prioridad: e.target.value as Solicitud['prioridad'] } }))}
                  >
                    <option>Alta</option><option>Media</option><option>Baja</option>
                  </select>
                </div>
              </Td>
              <Td>
                <div className="inline-block w-48">
                  <select
                    className={INPUT}
                    value={asig[s.id]?.tecnico ?? s.tecnico}
                    onChange={e => setAsig(a => ({ ...a, [s.id]: { ...(a[s.id] ?? { prioridad: s.prioridad, tecnico: s.tecnico }), tecnico: e.target.value } }))}
                  >
                    {['Juan Pablo Restrepo', 'Pedro Arias', 'Óscar Duarte', 'Carlos Uribe'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </Td>
              <Td>{EQUIPOS_MANTENIMIENTO.find(e => e.id === s.equipoMantId)?.nombre ?? '—'}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueInstrucciones() {
  const [sel, setSel] = useState(SOLICITUDES[0].id);
  const [inst, setInst] = useState(SOLICITUDES[0].instrucciones);
  const [obs, setObs] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const actual = SOLICITUDES.find(s => s.id === sel)!;
  return (
    <FunctionBlock code="MNT-12">
      <Toolbar>
        <div className="w-72">
          <select className={INPUT} value={sel} onChange={e => { const s = SOLICITUDES.find(x => x.id === e.target.value)!; setSel(s.id); setInst(s.instrucciones); }}>
            {SOLICITUDES.map(s => <option key={s.id} value={s.id}>{s.id} · {nombreEquipo(s.equipoId)}</option>)}
          </select>
        </div>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg(`Instrucciones y observaciones de ${actual.id} guardadas (simulado).`), 400)}>Guardar notas</button>
      </Toolbar>
      <Aviso texto={msg} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs text-gray-600">Instrucciones de trabajo
          <textarea className={INPUT} rows={4} value={inst} onChange={e => setInst(e.target.value)} />
        </label>
        <label className="text-xs text-gray-600">Observaciones
          <textarea className={INPUT} rows={4} value={obs} onChange={e => setObs(e.target.value)} placeholder="Observaciones del técnico..." />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-gray-500">Adjuntos:</span>
        {['foto-falla-01.jpg', 'checklist-lubricacion.pdf'].map(a => <span key={a} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">📎 {a}</span>)}
        <button className={BTN_GHOST} onClick={() => window.setTimeout(() => setMsg('Adjunto agregado a la solicitud (simulado).'), 400)}>+ Adjuntar</button>
      </div>
    </FunctionBlock>
  );
}

function BloqueCierre() {
  const [sols, setSols] = useState<Solicitud[]>(SOLICITUDES);
  const [cerrar, setCerrar] = useState<Solicitud | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const historial = [
    '2026-10-28 11:30 · SM-102 cerrada por Juan Pablo Restrepo — dosificadora recalibrada.',
    '2026-10-23 15:40 · SM-105 cerrada por Juan Pablo Restrepo — mordaza reemplazada.',
    '2026-10-21 10:50 · SM-107 cerrada por Pedro Arias — conexión del indicador corregida.',
  ];
  const accion = (id: string, estado: Solicitud['estado'], etapa: string, texto: string) => {
    setSols(lista => lista.map(x => (x.id === id ? { ...x, estado, etapa } : x)));
    window.setTimeout(() => setMsg(texto), 400);
  };
  return (
    <FunctionBlock code="MNT-13">
      <Toolbar>
        <span className="text-xs text-gray-500">Cierre con fecha real y observaciones, cancelación y reapertura conservando el historial.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${sols.filter(s => s.estado !== 'Abierta').length} solicitudes cerradas o canceladas · historial conservado`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Nº</Th><Th>Equipo</Th><Th align="center">Estado</Th><Th>Cierre real</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sols.map(s => (
            <tr key={s.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{s.id}</span></Td>
              <Td className="font-medium">{nombreEquipo(s.equipoId)}</Td>
              <Td align="center"><StatusBadge label={s.estado} tone={TONO_ESTADO[s.estado]} /></Td>
              <Td>{s.cierreReal ? <span className="font-mono text-gray-500">{s.cierreReal}</span> : '—'}</Td>
              <Td align="right">
                <div className="flex justify-end gap-1.5">
                  {s.estado === 'Abierta' && <button className={BTN_GHOST} onClick={() => setCerrar(s)}>Cerrar</button>}
                  {s.estado === 'Abierta' && <button className={BTN_GHOST} onClick={() => accion(s.id, 'Cancelada', s.etapa, `${s.id} cancelada; recurrencia detenida (simulado).`)}>Cancelar</button>}
                  {s.estado !== 'Abierta' && <button className={BTN_GHOST} onClick={() => accion(s.id, 'Abierta', 'Nueva', `${s.id} reabierta; recurrencia reactivada (simulado).`)}>Reabrir</button>}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      <div className="mt-3 rounded border border-gray-100 bg-gray-50/50 p-4">
        <h4 className="mb-2 text-xs font-semibold text-gray-700">Historial reciente</h4>
        <ul className="space-y-1 text-xs text-gray-600">
          {historial.map(h => <li key={h} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-petroleum-400" />{h}</li>)}
        </ul>
      </div>
      {cerrar && (
        <Modal title={`Cerrar ${cerrar.id}`} onClose={() => setCerrar(null)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              setSols(lista => lista.map(x => (x.id === cerrar.id ? { ...x, estado: 'Cerrada', etapa: 'Cerrada', cierreReal: String(fd.get('cierre') ?? '2026-10-28 17:00') } : x)));
              setCerrar(null);
              window.setTimeout(() => setMsg(`${cerrar.id} cerrado con fecha real y observaciones; recurrencia generó la siguiente solicitud (simulado).`), 400);
            }}
          >
            <label className="text-xs text-gray-600">Fecha real de cierre<input name="cierre" type="datetime-local" className={INPUT} defaultValue="2026-10-28T17:00" required /></label>
            <label className="text-xs text-gray-600">Observaciones de cierre<textarea className={INPUT} rows={2} data-initial-focus required /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setCerrar(null)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Cerrar solicitud</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/* ---------------------------- Fiabilidad y reportes ---------------------------- */

function TabFiabilidad() {
  return (
    <div className="space-y-4">
      <BloqueFiabilidad />
      <BloqueUbicacion />
      <BloqueGarantia />
      <BloqueDashboard />
      <BloqueReportes />
    </div>
  );
}

function BloqueFiabilidad() {
  const filas = FIABILIDAD.map(f => {
    const disp = f.mtbfHoras / (f.mtbfHoras + f.mttrHoras);
    return { ...f, disp };
  });
  return (
    <FunctionBlock code="MNT-14">
      <Toolbar>
        <span className="text-xs text-gray-500">Tiempo medio entre fallas (MTBF), tiempo medio de reparación (MTTR), última falla y próximo fallo estimado.</span>
      </Toolbar>
      <DataTable footer="Cálculo sobre fechas reales de falla y cierre de los últimos 12 meses.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Equipo</Th><Th align="right">MTBF</Th><Th align="right">MTTR</Th><Th align="right">Disponibilidad</Th><Th>Última falla</Th><Th>Próximo fallo estimado</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {filas.map(f => (
            <tr key={f.equipoId} className="hoverable">
              <Td className="font-medium">{nombreEquipo(f.equipoId)}</Td>
              <Td align="right"><span className="font-mono">{fmtHoras(f.mtbfHoras)}</span></Td>
              <Td align="right"><span className="font-mono">{fmtHoras(f.mttrHoras)}</span></Td>
              <Td align="right">
                <span className={`font-mono ${f.disp >= 0.99 ? 'text-green-700' : f.disp >= 0.97 ? 'text-amber-600' : 'text-red-600'}`}>{fmtPct(f.disp, 2)}</span>
              </Td>
              <Td>{fmtFecha(f.ultimaFalla)}</Td>
              <Td><span className="font-mono text-gray-600">{fmtFecha(f.proximoFalloEstimado)}</span></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueUbicacion() {
  const [ubicacion, setUbicacion] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const ubicaciones = [...new Set(EQUIPOS.map(e => e.ubicacion))];
  const visibles = EQUIPOS.filter(e => !ubicacion || e.ubicacion === ubicacion);
  return (
    <FunctionBlock code="MNT-15">
      <Toolbar>
        <div className="w-64"><select className={INPUT} value={ubicacion} onChange={e => setUbicacion(e.target.value)}><option value="">Todas las ubicaciones</option>{ubicaciones.map(u => <option key={u}>{u}</option>)}</select></div>
        <span className="text-xs text-gray-500">{visibles.length} equipos en la ubicación seleccionada.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer="Cada equipo indica quién lo usa y dónde está ubicado.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Equipo</Th><Th>Usuario / área</Th><Th>Ubicación</Th><Th>Asignado desde</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(e => (
            <tr key={e.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{e.id}</span> <span className="font-medium">{e.nombre}</span></Td>
              <Td>{e.usuario}</Td>
              <Td>{e.ubicacion}</Td>
              <Td>{fmtFecha(e.fechaAsignacion)}</Td>
              <Td align="right"><button className={BTN_GHOST} onClick={() => window.setTimeout(() => setMsg(`${e.id} reasignado a nueva ubicación/usuario (simulado).`), 400)}>Reasignar</button></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueGarantia() {
  const hoy = '2026-10-28';
  const total = EQUIPOS.reduce((acc, e) => acc + e.costo, 0);
  return (
    <FunctionBlock code="MNT-16">
      <DataTable footer={`Valor total de la flota: ${fmtMoney(total)}`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Equipo</Th><Th>Proveedor</Th><Th align="right">Costo</Th><Th align="center">Garantía</Th><Th>Fecha de baja</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {EQUIPOS.map(e => {
            const vigente = e.garantiaHasta >= hoy;
            return (
              <tr key={e.id} className="hoverable">
                <Td className="font-medium">{e.nombre}</Td>
                <Td>{e.proveedor}</Td>
                <Td align="right"><span className="font-mono">{fmtMoney(e.costo)}</span></Td>
                <Td align="center">{vigente ? <StatusBadge label={`Vigente hasta ${fmtFecha(e.garantiaHasta)}`} tone="green" /> : <StatusBadge label={`Vencida ${fmtFecha(e.garantiaHasta)}`} tone="red" />}</Td>
                <Td>{e.fechaBaja ? fmtFecha(e.fechaBaja) : '—'}</Td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueDashboard() {
  const pendientes = SOLICITUDES.filter(s => s.estado === 'Abierta').length;
  const programadas = SOLICITUDES.filter(s => s.estado === 'Abierta' && s.programada).length;
  const prioritarias = SOLICITUDES.filter(s => s.estado === 'Abierta' && s.prioridad === 'Alta').length;
  const cambios = SOLICITUDES.filter(s => s.estado === 'Abierta' && s.cambios).length;
  const sinProgramar = SOLICITUDES.filter(s => s.estado === 'Abierta' && !s.programada).length;
  return (
    <FunctionBlock code="MNT-18">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard label="Solicitudes pendientes" value={fmtNum(pendientes)} sub="abiertas hoy" tone="info" />
        <StatCard label="Programadas" value={fmtNum(programadas)} sub="con fecha y hora" tone="default" />
        <StatCard label="Prioritarias" value={fmtNum(prioritarias)} sub="prioridad alta" tone="danger" />
        <StatCard label="Con cambios solicitados" value={fmtNum(cambios)} sub="revisar alcance" tone="warn" />
        <StatCard label="Sin programar" value={fmtNum(sinProgramar)} sub="requieren agenda" tone="warn" />
      </div>
      <p className="mt-3 text-[11px] text-gray-400">Indicadores calculados sobre las {SOLICITUDES.length} solicitudes de demostración.</p>
    </FunctionBlock>
  );
}

function BloqueReportes() {
  const porEquipo = [...new Set(SOLICITUDES.map(s => s.equipoId))].map(id => ({ label: nombreEquipo(id), n: SOLICITUDES.filter(s => s.equipoId === id).length })).sort((a, b) => b.n - a.n).slice(0, 5);
  const porTecnico = [...new Set(SOLICITUDES.map(s => s.tecnico))].map(t => ({ label: t, n: SOLICITUDES.filter(s => s.tecnico === t).length }));
  const porEtapa = ETAPAS_MANTENIMIENTO.map(e => ({ label: e.nombre, n: SOLICITUDES.filter(s => s.etapa === e.nombre).length }));
  const porTipo = [('Correctivo'), ('Preventivo')].map(t => ({ label: t, n: SOLICITUDES.filter(s => s.tipo === t).length }));
  const maxE = Math.max(...porEquipo.map(x => x.n), 1);
  const maxT = Math.max(...porTecnico.map(x => x.n), 1);
  const maxEt = Math.max(...porEtapa.map(x => x.n), 1);
  const maxTi = Math.max(...porTipo.map(x => x.n), 1);
  return (
    <FunctionBlock code="MNT-19">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Solicitudes por equipo"><div className="space-y-3">{porEquipo.map(x => <Barra key={x.label} label={x.label} valor={x.n} max={maxE} />)}</div></Card>
        <Card title="Solicitudes por técnico"><div className="space-y-3">{porTecnico.map(x => <Barra key={x.label} label={x.label} valor={x.n} max={maxT} />)}</div></Card>
        <Card title="Solicitudes por etapa"><div className="space-y-3">{porEtapa.map(x => <Barra key={x.label} label={x.label} valor={x.n} max={maxEt} />)}</div></Card>
        <Card title="Solicitudes por tipo (octubre 2026)"><div className="space-y-3">{porTipo.map(x => <Barra key={x.label} label={x.label} valor={x.n} max={maxTi} />)}</div></Card>
      </div>
    </FunctionBlock>
  );
}

/* -------------------------------- Integraciones -------------------------------- */

function TabIntegraciones() {
  return (
    <div className="space-y-4">
      <BloqueInventario />
      <BloqueReparaciones />
      <BloqueRepuestos />
    </div>
  );
}

function BloqueInventario() {
  const [msg, setMsg] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState('');
  const ubicaciones = [...new Set(EQUIPOS.map(e => e.ubicacion))];
  const visibles = EQUIPOS.filter(e => !ubicacion || e.ubicacion === ubicacion);
  return (
    <FunctionBlock code="MNT-20">
      <Toolbar>
        <div className="w-64"><select className={INPUT} value={ubicacion} onChange={e => setUbicacion(e.target.value)}><option value="">Consultar equipos por ubicación...</option>{ubicaciones.map(u => <option key={u}>{u}</option>)}</select></div>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer="Equipos vinculados con ubicaciones, lotes y números de serie del inventario.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Equipo</Th><Th>Ubicación</Th><Th>Nº de serie</Th><Th align="center">Lote vinculado</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(e => (
            <tr key={e.id} className="hoverable">
              <Td className="font-medium">{e.nombre}</Td>
              <Td>{e.ubicacion}</Td>
              <Td><span className="font-mono text-gray-500">{e.serie}</span></Td>
              <Td align="center"><StatusBadge label="L-2026-001" tone="blue" /></Td>
              <Td align="right"><button className={BTN_GHOST} onClick={() => window.setTimeout(() => setMsg(`Existencias y lotes de ${e.id} consultados en inventario (simulado).`), 400)}>Consultar existencias</button></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueReparaciones() {
  const [msg, setMsg] = useState<string | null>(null);
  const tono: Record<string, BadgeTone> = { 'Cotización': 'amber', 'En taller': 'blue', 'Facturada': 'petroleum', 'Entregada': 'green' };
  return (
    <FunctionBlock code="MNT-21">
      <Toolbar>
        <span className="text-xs text-gray-500">Órdenes de reparación con piezas, servicios, movimientos de stock y facturación.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Orden de reparación creada con piezas y servicios (simulado).'), 400)}>+ Nueva orden de reparación</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${ORDENES_REPARACION.length} órdenes de reparación · total ${fmtMoney(ORDENES_REPARACION.reduce((a, o) => a + o.total, 0))}`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Orden</Th><Th>Equipo</Th><Th>Proveedor</Th><Th>Piezas</Th><Th>Servicios</Th><Th>Movimientos de stock</Th><Th align="center">Estado</Th><Th align="right">Total</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ORDENES_REPARACION.map(o => (
            <tr key={o.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{o.id}</span></Td>
              <Td className="font-medium">{nombreEquipo(o.equipoId)}</Td>
              <Td>{o.proveedor}</Td>
              <Td><div className="flex flex-wrap gap-1">{o.piezas.map(p => <span key={p} className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{p}</span>)}</div></Td>
              <Td><div className="flex flex-wrap gap-1">{o.servicios.map(s => <span key={s} className="rounded-full bg-petroleum-50 px-1.5 py-0.5 text-[10px] text-petroleum-700">{s}</span>)}</div></Td>
              <Td>{o.movimientosStock.map(m => <div key={m} className="text-gray-500">{m}</div>)}</Td>
              <Td align="center"><StatusBadge label={o.estado} tone={tono[o.estado]} /></Td>
              <Td align="right"><span className="font-mono">{fmtMoney(o.total)}</span></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueRepuestos() {
  const [reps, setReps] = useState<Repuesto[]>(REPUESTOS);
  const [msg, setMsg] = useState<string | null>(null);
  const reservar = (id: string) => {
    setReps(lista => lista.map(r => (r.id === id ? { ...r, reservado: r.reservado + 1 } : r)));
    window.setTimeout(() => setMsg(`Repuesto reservado para la solicitud seleccionada; trazabilidad del consumo registrada (simulado).`), 400);
  };
  const consumir = (id: string) => {
    setReps(lista => lista.map(r => (r.id === id ? { ...r, stock: Math.max(0, r.stock - 1), reservado: Math.max(0, r.reservado - 1) } : r)));
    window.setTimeout(() => setMsg('Repuesto consumido: inventario afectado y movimiento de stock generado (simulado).'), 400);
  };
  return (
    <FunctionBlock code="MNT-23">
      <Toolbar>
        <span className="text-xs text-gray-500">Consulta y reserva de repuestos del inventario para una solicitud o reparación.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${reps.length} repuestos · ${reps.reduce((a, r) => a + r.stock, 0)} unidades en stock · ${reps.reduce((a, r) => a + r.reservado, 0)} reservadas`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Código</Th><Th>Repuesto</Th><Th align="right">Stock</Th><Th align="right">Reservado</Th><Th>Ubicación</Th><Th align="right">Costo unitario</Th><Th>Solicitud vinculada</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {reps.map(r => (
            <tr key={r.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{r.codigo}</span></Td>
              <Td className="font-medium">{r.nombre}</Td>
              <Td align="right"><span className={`font-mono ${r.stock <= 3 ? 'text-red-600' : 'text-gray-700'}`}>{fmtNum(r.stock)}</span></Td>
              <Td align="right"><span className="font-mono">{fmtNum(r.reservado)}</span></Td>
              <Td><span className="font-mono text-gray-500">{r.ubicacion}</span></Td>
              <Td align="right"><span className="font-mono">{fmtMoney(r.costoUnitario)}</span></Td>
              <Td>{r.solicitudId ? <span className="font-mono text-gray-500">{r.solicitudId}</span> : '—'}</Td>
              <Td align="right">
                <div className="flex justify-end gap-1.5">
                  <button className={BTN_GHOST} disabled={r.stock - r.reservado <= 0} onClick={() => reservar(r.id)}>Reservar</button>
                  <button className={BTN_DANGER} disabled={r.reservado <= 0} onClick={() => consumir(r.id)}>Consumir</button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* --------------------------------- Página --------------------------------- */

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'maestros', label: 'Maestros y configuración' },
  { id: 'solicitudes', label: 'Solicitudes' },
  { id: 'fiabilidad', label: 'Fiabilidad y reportes' },
  { id: 'integraciones', label: 'Integraciones' },
];

export default function MNT() {
  const [tab, setTab] = useState('resumen');
  const abiertas = SOLICITUDES.filter(s => s.estado === 'Abierta').length;
  const preventivosPendientes = SOLICITUDES.filter(s => s.tipo === 'Preventivo' && s.estado === 'Abierta').length;
  const mtbfProm = Math.round(FIABILIDAD.reduce((a, f) => a + f.mtbfHoras, 0) / FIABILIDAD.length);
  const dispProm = FIABILIDAD.reduce((a, f) => a + f.mtbfHoras / (f.mtbfHoras + f.mttrHoras), 0) / FIABILIDAD.length;
  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('mnt')} funcionalidades · Fase ${MOD.fase}`}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Solicitudes abiertas" value={fmtNum(abiertas)} sub={`${SOLICITUDES.length} solicitudes totales`} tone="warn" />
        <StatCard label="Preventivos pendientes" value={fmtNum(preventivosPendientes)} sub="según plan de recurrencia" tone="danger" />
        <StatCard label="MTBF promedio" value={fmtHoras(mtbfProm)} sub={`${EQUIPOS.length} equipos en flota`} tone="info" />
        <StatCard label="Disponibilidad global" value={fmtPct(dispProm, 2)} sub="sobre 6 equipos críticos" tone="ok" />
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'resumen' && <TabResumen />}
      {tab === 'maestros' && <TabMaestros />}
      {tab === 'solicitudes' && <TabSolicitudes />}
      {tab === 'fiabilidad' && <TabFiabilidad />}
      {tab === 'integraciones' && <TabIntegraciones />}
    </div>
  );
}

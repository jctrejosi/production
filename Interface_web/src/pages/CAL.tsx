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
import { fmtFecha, fmtNum, fmtPct } from '../lib/format';
import {
  ACCIONES,
  CONTROLES,
  CRITERIOS,
  DOCUMENTOS_CALIDAD,
  EQUIPOS_CALIDAD,
  ETAPAS_ALERTA,
  HOJAS_TRABAJO,
  INTEGRACIONES_CALIDAD,
  NO_CONFORMIDADES,
  PUNTOS_CONTROL,
  TIPOS_CONTROL,
  type AccionCorrectiva,
  type Control,
  type NoConformidad,
} from '../data/cal';

const MOD = MODULOS.find(m => m.id === 'cal')!;

const TONO_RESULTADO: Record<string, BadgeTone> = {
  'Aprobado': 'green',
  'Rechazado': 'red',
  'Fuera de tolerancia': 'amber',
  'Pendiente': 'gray',
};

const TONO_PRIORIDAD: Record<string, BadgeTone> = {
  'Alta': 'red',
  'Media': 'amber',
  'Baja': 'gray',
};

const TONO_ESTADO_ALERTA: Record<string, BadgeTone> = {
  'En análisis': 'amber',
  'En verificación': 'blue',
  'Cerrada': 'green',
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

const nombrePunto = (id: string) => PUNTOS_CONTROL.find(p => p.id === id)?.nombre ?? id;
const nombreTipo = (id: string) => TIPOS_CONTROL.find(t => t.id === id)?.nombre ?? id;

/* ------------------------------- Resumen ------------------------------- */

function TabResumen() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Objetivo">
        <p className="text-xs leading-relaxed text-gray-700">
          Asegurar que materiales, procesos y productos cumplan criterios definidos, detectando desviaciones y gestionando acciones correctivas.
        </p>
      </Card>
      <Card title="Alcance">
        <p className="text-xs leading-relaxed text-gray-700">
          Puntos de control, inspecciones, criterios de aceptación, controles en recepción, producción y entrega, alertas, no conformidades, causas y acciones correctivas.
        </p>
      </Card>
      <Card title="Actores">
        <div className="flex flex-wrap gap-1.5">
          {['Responsable de calidad', 'Inspector', 'Supervisor de producción', 'Almacén', 'Compras', 'Dirección técnica'].map(a => (
            <span key={a} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">{a}</span>
          ))}
        </div>
      </Card>
      <Card title="Reglas de negocio">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-700">
          <li>Un control obligatorio no puede omitirse.</li>
          <li>Un resultado rechazado debe bloquear o generar alerta.</li>
          <li>Toda alerta debe tener responsable y estado.</li>
          <li>Las acciones correctivas se verifican antes de cerrar.</li>
          <li>La evidencia debe conservarse y ser auditable.</li>
          <li>Los criterios de aceptación deben estar aprobados y versionados.</li>
        </ul>
      </Card>
      <Card title="Integraciones">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-700">
          <li>Compras e inventario: recepción y cuarentena.</li>
          <li>Producción: operaciones y producto terminado.</li>
          <li>Mantenimiento: equipos y fallas.</li>
          <li>Trazabilidad: lote, serie y documento.</li>
          <li>Documentos: especificaciones y certificados.</li>
        </ul>
      </Card>
      <Card title="Criterios de aceptación">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-700">
          <li>Todo punto de control genera el control correspondiente.</li>
          <li>El sistema impide avanzar con material no conforme.</li>
          <li>Las alertas conservan historial y evidencia.</li>
          <li>Los reportes identifican proveedores o procesos problemáticos.</li>
          <li>Las acciones correctivas se pueden verificar y cerrar.</li>
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------ Configuración ------------------------------ */

function TabConfig() {
  return (
    <div className="space-y-4">
      <BloquePuntosControl />
      <BloqueTiposControl />
      <BloqueCriterios />
      <BloqueConfiguracion />
    </div>
  );
}

function BloquePuntosControl() {
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const visibles = PUNTOS_CONTROL.filter(p =>
    !q ||
    p.nombre.toLowerCase().includes(q.toLowerCase()) ||
    p.producto.toLowerCase().includes(q.toLowerCase()) ||
    p.operacion.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <FunctionBlock code="CAL-01">
      <Toolbar>
        <input className={INPUT} placeholder="Buscar punto de control, producto u operación..." value={q} onChange={e => setQ(e.target.value)} />
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nuevo punto de control</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${visibles.length} puntos de control · 6 de ${PUNTOS_CONTROL.length} obligatorios`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th><Th>Nombre</Th><Th>Producto / Operación</Th><Th align="center">Tipo</Th><Th>Frecuencia</Th><Th>Equipo</Th><Th align="center">Obligatorio</Th><Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(p => (
            <tr key={p.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{p.id}</span></Td>
              <Td className="font-medium">{p.nombre}</Td>
              <Td>{p.producto}<div className="text-gray-400">{p.operacion}</div></Td>
              <Td align="center"><StatusBadge label={nombreTipo(p.tipoId)} tone="petroleum" /></Td>
              <Td>{p.frecuencia}</Td>
              <Td><span className="font-mono text-gray-500">{p.equipoId}</span></Td>
              <Td align="center">{p.obligatorio ? <StatusBadge label="Sí" tone="red" /> : <StatusBadge label="No" tone="gray" />}</Td>
              <Td align="center">{p.activo ? <StatusBadge label="Activo" tone="green" /> : <StatusBadge label="Inactivo" tone="gray" />}</Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={8} text="Ningún punto de control coincide con la búsqueda." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nuevo punto de control" onClose={() => setModal(false)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setModal(false);
              window.setTimeout(() => setMsg('Punto de control PC-07 creado y asignado al equipo EQ-01 (simulado).'), 400);
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-600">Nombre
                <input className={INPUT} placeholder="Ej. pH del producto" data-initial-focus required />
              </label>
              <label className="text-xs text-gray-600">Producto
                <input className={INPUT} placeholder="Ej. Yogur griego fresa 150 g" required />
              </label>
              <label className="text-xs text-gray-600">Operación
                <input className={INPUT} placeholder="Ej. Fermentación" required />
              </label>
              <label className="text-xs text-gray-600">Tipo de control
                <select className={INPUT}><option>TC-01 · Instrucciones</option><option>TC-02 · Aprobado/Rechazado</option><option>TC-03 · Medición numérica</option><option>TC-04 · Formulario</option></select>
              </label>
              <label className="text-xs text-gray-600">Frecuencia
                <input className={INPUT} placeholder="Ej. 1 por lote" />
              </label>
              <label className="text-xs text-gray-600">Equipo de calidad
                <select className={INPUT}>{EQUIPOS_CALIDAD.map(e => <option key={e.id}>{e.id} · {e.nombre}</option>)}</select>
              </label>
            </div>
            <label className="text-xs text-gray-600">Instrucciones
              <textarea className={INPUT} rows={2} placeholder="Instrucciones para el inspector..." />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Guardar punto</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueTiposControl() {
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="CAL-02">
      <Toolbar>
        <span className="text-xs text-gray-500">{TIPOS_CONTROL.length} tipos de control configurados.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nuevo tipo</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer="El tipo determina cómo se registra el resultado del control.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Código</Th><Th>Nombre</Th><Th align="center">Modo</Th><Th>Descripción</Th><Th align="center">Estado</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {TIPOS_CONTROL.map(t => (
            <tr key={t.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{t.id}</span></Td>
              <Td className="font-medium">{t.nombre}</Td>
              <Td align="center"><StatusBadge label={t.modo} tone={t.modo === 'Formulario' ? 'blue' : t.modo === 'Medición numérica' ? 'amber' : t.modo === 'Aprobado/Rechazado' ? 'green' : 'gray'} /></Td>
              <Td>{t.descripcion}</Td>
              <Td align="center">{t.activo ? <StatusBadge label="Activo" tone="green" /> : <StatusBadge label="Inactivo" tone="gray" />}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nuevo tipo de control" onClose={() => setModal(false)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setModal(false);
              window.setTimeout(() => setMsg('Tipo de control TC-05 creado (simulado).'), 400);
            }}
          >
            <label className="text-xs text-gray-600">Nombre
              <input className={INPUT} placeholder="Ej. Control por atributos" data-initial-focus required />
            </label>
            <div className="text-xs text-gray-600">Modo de captura</div>
            <div className="space-y-1.5">
              {['Instrucciones', 'Aprobado/Rechazado', 'Medición numérica', 'Formulario'].map(m => (
                <label key={m} className="flex items-center gap-2 text-xs text-gray-700">
                  <input type="radio" name="modo" defaultChecked={m === 'Instrucciones'} /> {m}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Guardar tipo</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueCriterios() {
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="CAL-03">
      <Toolbar>
        <span className="text-xs text-gray-500">Valores mínimos, máximos, tolerancias, unidades y valores predefinidos para aprobar o rechazar.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nueva versión</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${CRITERIOS.filter(c => c.aprobado).length} de ${CRITERIOS.length} criterios aprobados.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Código</Th><Th>Criterio</Th><Th>Punto de control</Th><Th align="right">Mínimo</Th><Th align="right">Máximo</Th><Th align="right">Tolerancia</Th><Th align="center">Unidad</Th><Th align="center">Valor predefinido</Th><Th align="center">Versión</Th><Th align="center">Estado</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {CRITERIOS.map(c => (
            <tr key={c.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
              <Td className="font-medium">{c.nombre}</Td>
              <Td>{nombrePunto(c.puntoControlId)}</Td>
              <Td align="right"><span className="font-mono">{c.minimo ?? '—'}</span></Td>
              <Td align="right"><span className="font-mono">{c.maximo ?? '—'}</span></Td>
              <Td align="right"><span className="font-mono">{c.tolerancia ?? '—'}</span></Td>
              <Td align="center">{c.unidad || '—'}</Td>
              <Td align="center">{c.valorPredefinido ?? '—'}</Td>
              <Td align="center"><span className="font-mono text-gray-500">{c.version}</span></Td>
              <Td align="center">{c.aprobado ? <StatusBadge label="Aprobado" tone="green" /> : <StatusBadge label="Pendiente" tone="amber" />}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nueva versión de criterio" onClose={() => setModal(false)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setModal(false);
              window.setTimeout(() => setMsg('Versión creada en estado «Pendiente de aprobación» (simulado).'), 400);
            }}
          >
            <label className="text-xs text-gray-600">Criterio a versionar
              <select className={INPUT} data-initial-focus>{CRITERIOS.map(c => <option key={c.id}>{c.id} · {c.nombre}</option>)}</select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-600">Mínimo<input className={INPUT} placeholder="0" /></label>
              <label className="text-xs text-gray-600">Máximo<input className={INPUT} placeholder="100" /></label>
              <label className="text-xs text-gray-600">Tolerancia<input className={INPUT} placeholder="± 0,5" /></label>
              <label className="text-xs text-gray-600">Unidad<input className={INPUT} placeholder="°C / g / %" /></label>
            </div>
            <label className="text-xs text-gray-600">Valor predefinido<input className={INPUT} placeholder="Opcional" /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Crear versión</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueConfiguracion() {
  const [activo, setActivo] = useState(true);
  const [cuarentena, setCuarentena] = useState(true);
  const [bloqueo, setBloqueo] = useState(true);
  const [escaneo, setEscaneo] = useState(true);
  const [firma, setFirma] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const opciones = [
    { label: 'Módulo de calidad activo', value: activo, set: setActivo },
    { label: 'Cuarentena automática al rechazar en recepción', value: cuarentena, set: setCuarentena },
    { label: 'Bloquear operación/lote hasta registrar resultado', value: bloqueo, set: setBloqueo },
    { label: 'Captura por escáner en controles', value: escaneo, set: setEscaneo },
    { label: 'Firma electrónica obligatoria en hojas de trabajo', value: firma, set: setFirma },
  ] as const;
  return (
    <FunctionBlock code="CAL-16">
      <Toolbar>
        <button className={BTN_PRIMARY} onClick={() => window.setTimeout(() => setMsg('Configuración del módulo de calidad guardada (simulado).'), 400)}>Guardar configuración</button>
      </Toolbar>
      <Aviso texto={msg} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1 rounded border border-gray-100 bg-gray-50/50 p-4">
          <h4 className="mb-2 text-xs font-semibold text-gray-700">Parámetros generales</h4>
          {opciones.map(o => (
            <label key={o.label} className="flex cursor-pointer items-center justify-between gap-3 rounded px-2 py-1.5 text-xs text-gray-700 hover:bg-white">
              {o.label}
              <button type="button" role="switch" aria-checked={o.value} onClick={() => o.set(!o.value)}
                className={`h-5 w-9 rounded-full p-0.5 transition ${o.value ? 'bg-petroleum-500' : 'bg-gray-300'}`}>
                <span className={`block h-4 w-4 rounded-full bg-white transition ${o.value ? 'translate-x-4' : ''}`} />
              </button>
            </label>
          ))}
        </div>
        <div className="space-y-3 rounded border border-gray-100 bg-gray-50/50 p-4">
          <h4 className="text-xs font-semibold text-gray-700">Valores por defecto</h4>
          <label className="text-xs text-gray-600">Equipo de calidad por defecto
            <select className={INPUT}>{EQUIPOS_CALIDAD.map(e => <option key={e.id}>{e.id} · {e.nombre}</option>)}</select>
          </label>
          <label className="text-xs text-gray-600">Flujo de etapas de alerta
            <select className={INPUT}><option>Detección → Análisis → Corrección → Verificación → Cierre</option><option>Detección → Análisis → Corrección → Cierre</option></select>
          </label>
          <label className="text-xs text-gray-600">Tipo de control por defecto
            <select className={INPUT}>{TIPOS_CONTROL.map(t => <option key={t.id}>{t.id} · {t.nombre}</option>)}</select>
          </label>
        </div>
      </div>
    </FunctionBlock>
  );
}

/* -------------------------------- Controles -------------------------------- */

function TabControles() {
  return (
    <div className="space-y-4">
      <BloqueRecepcion />
      <BloqueEntrega />
      <BloqueProduccion />
      <BloqueHojas />
      <BloqueEjecucion />
      <BloqueResultado />
    </div>
  );
}

function BloqueRecepcion() {
  const [recep, setRecep] = useState<Control[]>(CONTROLES.filter(c => c.tipo === 'Recepción'));
  const [msg, setMsg] = useState<string | null>(null);
  const actualizar = (id: string, resultado: Control['resultado'], bloqueado: boolean, texto: string) => {
    setRecep(lista => lista.map(c => (c.id === id ? { ...c, resultado, bloqueado } : c)));
    window.setTimeout(() => setMsg(texto), 400);
  };
  return (
    <FunctionBlock code="CAL-04">
      <Toolbar>
        <span className="text-xs text-gray-500">Los controles se generan automáticamente al recibir mercancía. Un resultado no conforme bloquea el ingreso.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${recep.length} controles de recepción · ${recep.filter(c => c.bloqueado).length} con ingreso bloqueado`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Control</Th><Th>Producto</Th><Th>Lote</Th><Th>Orden</Th><Th align="right">Cantidad</Th><Th align="center">Resultado</Th><Th>Responsable</Th><Th>Fecha</Th><Th align="center">Ingreso</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {recep.map(c => (
            <tr key={c.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
              <Td className="font-medium">{c.producto}</Td>
              <Td><span className="font-mono text-gray-500">{c.lote}</span></Td>
              <Td><span className="font-mono text-gray-500">{c.orden}</span></Td>
              <Td align="right"><span className="font-mono">{fmtNum(c.cantidad)}</span></Td>
              <Td align="center"><StatusBadge label={c.resultado} tone={TONO_RESULTADO[c.resultado]} /></Td>
              <Td>{c.responsable}</Td>
              <Td>{fmtFecha(c.fecha)}</Td>
              <Td align="center">{c.bloqueado ? <StatusBadge label="Bloqueado" tone="red" /> : <StatusBadge label="Abierto" tone="green" />}</Td>
              <Td align="right">
                <div className="flex justify-end gap-1.5">
                  <button className={BTN_GHOST} disabled={c.resultado === 'Aprobado'} onClick={() => actualizar(c.id, 'Aprobado', false, `${c.id} aprobado: mercancía ingresa a inventario (simulado).`)}>Aprobar</button>
                  <button className={BTN_GHOST} disabled={c.resultado === 'Rechazado'} onClick={() => actualizar(c.id, 'Rechazado', true, `${c.id} rechazado: ingreso bloqueado y alerta NC generada (simulado).`)}>Rechazar</button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueEntrega() {
  const [checks, setChecks] = useState({ producto: false, cantidad: false, empaque: false, etiquetado: false, documentacion: false });
  const [msg, setMsg] = useState<string | null>(null);
  const items = [
    { id: 'producto', label: 'Producto correcto (Aceite girasol 1 L · L-2026-114)' },
    { id: 'cantidad', label: 'Cantidad verificada (360 unidades vs. pedido PE-2201)' },
    { id: 'empaque', label: 'Empaque íntegro sin abolladuras' },
    { id: 'etiquetado', label: 'Etiquetado legible y lote visible' },
    { id: 'documentacion', label: 'Documentación del despacho completa' },
  ] as const;
  const completos = Object.values(checks).filter(Boolean).length;
  return (
    <FunctionBlock code="CAL-05">
      <Toolbar>
        <span className="text-xs text-gray-500">Verificación previa a la salida: producto, cantidad, empaque, etiquetado y documentación.</span>
        <div className="flex-1" />
        <button
          className={BTN_PRIMARY}
          disabled={completos < items.length}
          onClick={() => window.setTimeout(() => setMsg('Despacho PE-2201 verificado y liberado para salida (simulado).'), 400)}
        >
          Registrar verificación ({completos}/{items.length})
        </button>
      </Toolbar>
      <Aviso texto={msg} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1 rounded border border-gray-100 bg-gray-50/50 p-4">
          <h4 className="mb-2 text-xs font-semibold text-gray-700">Checklist despacho PE-2201</h4>
          {items.map(it => (
            <label key={it.id} className="flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5 text-xs text-gray-700 hover:bg-white">
              <input type="checkbox" checked={checks[it.id]} onChange={e => setChecks(c => ({ ...c, [it.id]: e.target.checked }))} />
              {it.label}
            </label>
          ))}
        </div>
        <DataTable footer="Controles de entrega y transferencia registrados.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr><Th>Control</Th><Th>Producto</Th><Th align="right">Cantidad</Th><Th align="center">Resultado</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {CONTROLES.filter(c => c.tipo === 'Entrega' || c.tipo === 'Transferencia').map(c => (
              <tr key={c.id} className="hoverable">
                <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
                <Td>{c.producto}</Td>
                <Td align="right"><span className="font-mono">{fmtNum(c.cantidad)}</span></Td>
                <Td align="center"><StatusBadge label={c.resultado} tone={TONO_RESULTADO[c.resultado]} /></Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

function BloqueProduccion() {
  const [controles, setControles] = useState<Control[]>(CONTROLES.filter(c => c.tipo === 'Producción'));
  const [objetivo, setObjetivo] = useState<Control | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="CAL-06">
      <Toolbar>
        <span className="text-xs text-gray-500">Controles por operación, primera pieza, proceso o producto final. La operación queda bloqueada hasta registrar el resultado.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${controles.length} controles de producción · ${controles.filter(c => c.bloqueado).length} operaciones bloqueadas`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Control</Th><Th>Operación</Th><Th>Producto</Th><Th>Lote / Orden</Th><Th align="right">Cantidad</Th><Th align="center">Resultado</Th><Th align="center">Operación</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {controles.map(c => (
            <tr key={c.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
              <Td className="font-medium">{c.operacion}</Td>
              <Td>{c.producto}</Td>
              <Td><span className="font-mono text-gray-500">{c.lote} · {c.orden}</span></Td>
              <Td align="right"><span className="font-mono">{fmtNum(c.cantidad)}</span></Td>
              <Td align="center"><StatusBadge label={c.resultado} tone={TONO_RESULTADO[c.resultado]} /></Td>
              <Td align="center">{c.bloqueado ? <StatusBadge label="Bloqueada" tone="red" /> : <StatusBadge label="Liberada" tone="green" />}</Td>
              <Td align="right">
                <button className={BTN_GHOST} disabled={c.resultado !== 'Pendiente'} onClick={() => setObjetivo(c)}>Registrar resultado</button>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {objetivo && (
        <Modal title={`Resultado de ${objetivo.id} · ${objetivo.operacion}`} onClose={() => setObjetivo(null)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              const res = (new FormData(e.currentTarget).get('resultado') as Control['resultado']) || 'Aprobado';
              const bloqueado = res !== 'Aprobado';
              setControles(lista => lista.map(c => (c.id === objetivo.id ? { ...c, resultado: res, bloqueado } : c)));
              setObjetivo(null);
              window.setTimeout(() => setMsg(`${objetivo.id} registrado como «${res}». Operación ${bloqueado ? 'bloqueada' : 'liberada'} (simulado).`), 400);
            }}
          >
            <label className="text-xs text-gray-600">Resultado
              <select name="resultado" className={INPUT} data-initial-focus>
                <option value="Aprobado">Aprobado</option><option value="Rechazado">Rechazado</option><option value="Fuera de tolerancia">Fuera de tolerancia</option>
              </select>
            </label>
            <label className="text-xs text-gray-600">Valor medido (si aplica)<input className={INPUT} placeholder="Ej. 5,8 %" /></label>
            <label className="text-xs text-gray-600">Evidencia<input className={INPUT} placeholder="Nombre del archivo adjunto" /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setObjetivo(null)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Registrar</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueHojas() {
  const [vista, setVista] = useState<(typeof HOJAS_TRABAJO)[number] | null>(null);
  return (
    <FunctionBlock code="CAL-07">
      <Toolbar>
        <span className="text-xs text-gray-500">Formularios configurables con secciones, campos, firmas, fotos y documentos adjuntos.</span>
      </Toolbar>
      <DataTable footer={`${HOJAS_TRABAJO.length} hojas de trabajo configuradas.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Código</Th><Th>Hoja de trabajo</Th><Th>Punto de control</Th><Th>Secciones</Th><Th>Campos</Th><Th align="center">Firma</Th><Th align="center">Foto</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {HOJAS_TRABAJO.map(h => (
            <tr key={h.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{h.id}</span></Td>
              <Td className="font-medium">{h.nombre}</Td>
              <Td>{nombrePunto(h.puntoControlId)}</Td>
              <Td><div className="flex flex-wrap gap-1">{h.secciones.map(s => <span key={s} className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{s}</span>)}</div></Td>
              <Td>{h.campos.length} campos</Td>
              <Td align="center">{h.requiereFirma ? <StatusBadge label="Sí" tone="blue" /> : <StatusBadge label="No" tone="gray" />}</Td>
              <Td align="center">{h.requiereFoto ? <StatusBadge label="Sí" tone="blue" /> : <StatusBadge label="No" tone="gray" />}</Td>
              <Td align="right"><button className={BTN_GHOST} onClick={() => setVista(h)}>Vista previa</button></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {vista && (
        <Modal title={`Vista previa · ${vista.nombre}`} onClose={() => setVista(null)} wide>
          <div className="space-y-4 p-5">
            {vista.secciones.map(s => (
              <div key={s}>
                <h4 className="mb-1.5 text-xs font-semibold text-gray-700">{s}</h4>
                <div className="space-y-1.5">
                  {vista.campos.slice(0, 2).map(c => <div key={c} className="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">{c}</div>)}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
              {vista.requiereFirma && <span>✍️ Requiere firma del inspector</span>}
              {vista.requiereFoto && <span>📷 Requiere evidencia fotográfica</span>}
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueEjecucion() {
  const [cola, setCola] = useState<Control[]>(CONTROLES.filter(c => c.resultado === 'Pendiente'));
  const [objetivo, setObjetivo] = useState<Control | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="CAL-08">
      <Toolbar>
        <span className="text-xs text-gray-500">Cola de controles pendientes con instrucciones, formulario, responsable y evidencia.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${cola.length} controles pendientes de ejecución.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Control</Th><Th>Tipo</Th><Th>Instrucciones</Th><Th>Formulario</Th><Th>Responsable</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {cola.map(c => {
            const punto = PUNTOS_CONTROL.find(p => p.id === c.puntoControlId);
            const hoja = HOJAS_TRABAJO.find(h => h.puntoControlId === c.puntoControlId);
            return (
              <tr key={c.id} className="hoverable">
                <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
                <Td>{c.tipo}</Td>
                <Td className="max-w-md">{punto?.instruccion ?? '—'}</Td>
                <Td>{hoja ? <span className="font-mono text-xs text-petroleum-700">{hoja.id} · {hoja.nombre}</span> : '—'}</Td>
                <Td>{c.responsable}</Td>
                <Td align="right"><button className={BTN_PRIMARY} onClick={() => setObjetivo(c)}>Ejecutar</button></Td>
              </tr>
            );
          })}
          {cola.length === 0 && <EmptyRow colSpan={6} text="No hay controles pendientes." />}
        </tbody>
      </DataTable>
      {objetivo && (
        <Modal title={`Ejecutar ${objetivo.id}`} onClose={() => setObjetivo(null)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              const res = (new FormData(e.currentTarget).get('resultado') as Control['resultado']) || 'Aprobado';
              setCola(lista => lista.filter(c => c.id !== objetivo.id));
              setObjetivo(null);
              window.setTimeout(() => setMsg(`${objetivo.id} ejecutado con resultado «${res}» y evidencia guardada (simulado).`), 400);
            }}
          >
            <label className="text-xs text-gray-600">Resultado
              <select name="resultado" className={INPUT} data-initial-focus>
                <option value="Aprobado">Aprobado</option><option value="Rechazado">Rechazado</option><option value="Fuera de tolerancia">Fuera de tolerancia</option>
              </select>
            </label>
            <label className="text-xs text-gray-600">Evidencia<input className={INPUT} placeholder="Adjunto o número de foto" /></label>
            <label className="text-xs text-gray-600">Observaciones<textarea className={INPUT} rows={2} /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setObjetivo(null)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Ejecutar control</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueResultado() {
  const [controles, setControles] = useState<Control[]>(CONTROLES.filter(c => c.resultado !== 'Pendiente'));
  const [msg, setMsg] = useState<string | null>(null);
  const decididos = controles.filter(c => c.resultado !== 'Pendiente');
  const aprobados = decididos.filter(c => c.resultado === 'Aprobado').length;
  return (
    <FunctionBlock code="CAL-09">
      <Toolbar>
        <span className="text-xs text-gray-500">Registro de aprobado, rechazado o fuera de tolerancia, con bloqueo de operación, lote o documento cuando corresponda.</span>
        <div className="flex-1" />
        <span className="text-xs text-gray-500">Aprobación: <span className="font-mono font-semibold text-green-700">{fmtPct(decididos.length > 0 ? aprobados / decididos.length : 0)}</span></span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${controles.length} resultados registrados · ${controles.filter(c => c.bloqueado).length} con bloqueo activo`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Control</Th><Th>Producto</Th><Th>Lote / Orden</Th><Th align="center">Resultado</Th><Th align="center">Bloqueo</Th><Th>Evidencia</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {controles.map(c => (
            <tr key={c.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
              <Td className="font-medium">{c.producto}</Td>
              <Td><span className="font-mono text-gray-500">{c.lote} · {c.orden}</span></Td>
              <Td align="center"><StatusBadge label={c.resultado} tone={TONO_RESULTADO[c.resultado]} /></Td>
              <Td align="center">{c.bloqueado ? <StatusBadge label={`${c.operacion} bloqueada`} tone="red" /> : <StatusBadge label="Sin bloqueo" tone="green" />}</Td>
              <Td>{c.evidencia || '—'}</Td>
              <Td align="right">
                {c.bloqueado && (
                  <button
                    className={BTN_DANGER}
                    onClick={() => {
                      setControles(lista => lista.map(x => (x.id === c.id ? { ...x, bloqueado: false } : x)));
                      window.setTimeout(() => setMsg(`${c.id} desbloqueado con autorización de la Dirección técnica (simulado).`), 400);
                    }}
                  >
                    Desbloquear con autorización
                  </button>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ---------------------------- Alertas y acciones ---------------------------- */

function TabAlertas() {
  return (
    <div className="space-y-4">
      <BloqueAlertas />
      <BloqueEtapas />
      <BloqueEquipos />
      <BloqueCausaRaiz />
    </div>
  );
}

function BloqueAlertas() {
  const [ncs, setNcs] = useState<NoConformidad[]>(NO_CONFORMIDADES);
  const [q, setQ] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [estado, setEstado] = useState('');
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const visibles = ncs.filter(nc =>
    (!q || nc.producto.toLowerCase().includes(q.toLowerCase()) || nc.lote.toLowerCase().includes(q.toLowerCase()) || nc.causa.toLowerCase().includes(q.toLowerCase())) &&
    (!prioridad || nc.prioridad === prioridad) &&
    (!estado || nc.estado === estado)
  );
  return (
    <FunctionBlock code="CAL-10">
      <Toolbar>
        <input className={INPUT} placeholder="Buscar por producto, lote o causa..." value={q} onChange={e => setQ(e.target.value)} />
        <div className="w-36"><select className={INPUT} value={prioridad} onChange={e => setPrioridad(e.target.value)}><option value="">Prioridad</option><option>Alta</option><option>Media</option><option>Baja</option></select></div>
        <div className="w-36"><select className={INPUT} value={estado} onChange={e => setEstado(e.target.value)}><option value="">Estado</option><option>En análisis</option><option>En verificación</option><option>Cerrada</option></select></div>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nueva alerta</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${visibles.length} alertas · ${visibles.filter(a => a.estado !== 'Cerrada').length} abiertas`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Alerta</Th><Th>Producto</Th><Th>Lote</Th><Th align="right">Cantidad</Th><Th>Origen</Th><Th align="center">Prioridad</Th><Th>Etapa</Th><Th>Responsable</Th><Th align="center">Estado</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(nc => (
            <tr key={nc.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{nc.id}</span></Td>
              <Td className="font-medium">{nc.producto}</Td>
              <Td><span className="font-mono text-gray-500">{nc.lote}</span></Td>
              <Td align="right"><span className="font-mono">{fmtNum(nc.cantidad)}</span></Td>
              <Td>{nc.origen}</Td>
              <Td align="center"><StatusBadge label={nc.prioridad} tone={TONO_PRIORIDAD[nc.prioridad]} /></Td>
              <Td>{nc.etapa}</Td>
              <Td>{nc.responsable}</Td>
              <Td align="center"><StatusBadge label={nc.estado} tone={TONO_ESTADO_ALERTA[nc.estado]} /></Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={9} text="Ninguna alerta coincide con los filtros." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nueva alerta de calidad" onClose={() => setModal(false)} wide>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              setNcs(lista => [
                ...lista,
                {
                  id: `NC-0${lista.length + 1}`,
                  producto: String(fd.get('producto') ?? ''),
                  lote: String(fd.get('lote') ?? ''),
                  cantidad: Number(fd.get('cantidad') ?? 0),
                  origen: String(fd.get('origen') ?? 'Producción'),
                  prioridad: (fd.get('prioridad') ?? 'Media') as NoConformidad['prioridad'],
                  causa: String(fd.get('causa') ?? ''),
                  accion: String(fd.get('accion') ?? ''),
                  etapa: 'Detección',
                  responsable: 'Carlos Uribe',
                  fecha: '2026-10-28',
                  estado: 'En análisis',
                },
              ]);
              setModal(false);
              window.setTimeout(() => setMsg('Alerta de no conformidad creada con responsable y estado (simulado).'), 400);
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-600">Producto<input name="producto" className={INPUT} data-initial-focus required /></label>
              <label className="text-xs text-gray-600">Lote<input name="lote" className={INPUT} required /></label>
              <label className="text-xs text-gray-600">Cantidad afectada<input name="cantidad" type="number" className={INPUT} required /></label>
              <label className="text-xs text-gray-600">Origen
                <select name="origen" className={INPUT}><option>Recepción</option><option>Producción</option><option>Almacén</option><option>Cliente</option><option>Entrega</option></select>
              </label>
              <label className="text-xs text-gray-600">Prioridad
                <select name="prioridad" className={INPUT}><option>Alta</option><option>Media</option><option>Baja</option></select>
              </label>
              <label className="text-xs text-gray-600">Responsable<input className={INPUT} defaultValue="Carlos Uribe" /></label>
            </div>
            <label className="text-xs text-gray-600">Causa<textarea name="causa" className={INPUT} rows={2} required /></label>
            <label className="text-xs text-gray-600">Acción inmediata<textarea name="accion" className={INPUT} rows={2} required /></label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="submit" className={BTN_PRIMARY}>Crear alerta</button>
            </div>
          </form>
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueEtapas() {
  const [alertaId, setAlertaId] = useState('NC-01');
  const [etapas, setEtapas] = useState(ETAPAS_ALERTA);
  const [msg, setMsg] = useState<string | null>(null);
  const flujo = etapas.filter(e => e.alertaId === alertaId).sort((a, b) => a.id.localeCompare(b.id));
  const avanzar = () => {
    const enCurso = flujo.find(e => e.estado === 'En curso');
    if (!enCurso) return;
    setEtapas(lista => lista.map(e => (e.id === enCurso.id ? { ...e, estado: 'Completada', fecha: '2026-10-28' } : e)));
    window.setTimeout(() => setMsg(`Etapa «${enCurso.nombre}» completada; la siguiente etapa quedó en curso (simulado).`), 400);
  };
  return (
    <FunctionBlock code="CAL-11">
      <Toolbar>
        <div className="w-64"><select className={INPUT} value={alertaId} onChange={e => setAlertaId(e.target.value)}>{NO_CONFORMIDADES.map(nc => <option key={nc.id} value={nc.id}>{nc.id} · {nc.producto}</option>)}</select></div>
        <button className={BTN_PRIMARY} onClick={avanzar}>Avanzar etapa</button>
      </Toolbar>
      <Aviso texto={msg} />
      <div className="overflow-x-auto">
        <div className="flex items-stretch gap-2">
          {flujo.map((e, i) => (
            <div key={e.id} className="flex items-center gap-2">
              <div className={`w-44 rounded border p-3 ${e.estado === 'Completada' ? 'border-green-200 bg-green-50/50' : e.estado === 'En curso' ? 'border-petroleum-200 bg-petroleum-50/50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-800">{e.nombre}</span>
                  <StatusBadge label={e.estado} tone={e.estado === 'Completada' ? 'green' : e.estado === 'En curso' ? 'petroleum' : 'gray'} />
                </div>
                <div className="mt-1 text-[11px] text-gray-500">Responsable: {e.responsable}</div>
                <div className="text-[11px] text-gray-400">{e.transicion}</div>
                <div className="mt-1 font-mono text-[10px] text-gray-400">{e.fecha ? fmtFecha(e.fecha) : 'Pendiente'}</div>
              </div>
              {i < flujo.length - 1 && <span className="text-gray-300">→</span>}
            </div>
          ))}
        </div>
      </div>
    </FunctionBlock>
  );
}

function BloqueEquipos() {
  const [msg, setMsg] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  return (
    <FunctionBlock code="CAL-12">
      <Toolbar>
        <span className="text-xs text-gray-500">Equipos de calidad con miembros, responsables y asignación de puntos de control y alertas.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Agregar miembro</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${EQUIPOS_CALIDAD.length} equipos de calidad.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Equipo</Th><Th>Responsable</Th><Th>Miembros</Th><Th align="center">Puntos asignados</Th><Th align="center">Alertas asignadas</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {EQUIPOS_CALIDAD.map(eq => (
            <tr key={eq.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{eq.id}</span> <span className="font-medium">{eq.nombre}</span></Td>
              <Td>{eq.responsable}</Td>
              <Td><div className="flex flex-wrap gap-1">{eq.miembros.map(m => <span key={m} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">{m}</span>)}</div></Td>
              <Td align="center"><span className="font-mono text-gray-600">{eq.puntos.length}</span></Td>
              <Td align="center"><span className="font-mono text-gray-600">{eq.alertas.length}</span></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Agregar miembro a equipo de calidad" onClose={() => setModal(false)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setModal(false);
              window.setTimeout(() => setMsg('Miembro agregado al equipo de calidad (simulado).'), 400);
            }}
          >
            <label className="text-xs text-gray-600">Equipo
              <select className={INPUT} data-initial-focus>{EQUIPOS_CALIDAD.map(e => <option key={e.id}>{e.id} · {e.nombre}</option>)}</select>
            </label>
            <label className="text-xs text-gray-600">Miembro<input className={INPUT} placeholder="Nombre del inspector" required /></label>
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

function BloqueCausaRaiz() {
  const [acciones, setAcciones] = useState<AccionCorrectiva[]>(ACCIONES);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <FunctionBlock code="CAL-13">
      <Toolbar>
        <span className="text-xs text-gray-500">Análisis de causa, acción inmediata, correctiva y preventiva, con verificación de eficacia antes del cierre.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${acciones.filter(a => a.estado === 'Verificada').length} de ${acciones.length} acciones con eficacia verificada.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Código</Th><Th>Alerta</Th><Th>Causa raíz</Th><Th>Inmediata</Th><Th>Correctiva</Th><Th>Preventiva</Th><Th>Verificación</Th><Th align="center">Estado</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {acciones.map(a => (
            <tr key={a.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{a.id}</span></Td>
              <Td><span className="font-mono text-gray-500">{a.alertaId}</span></Td>
              <Td className="max-w-xs">{a.causaRaiz}</Td>
              <Td className="max-w-xs">{a.accionInmediata}</Td>
              <Td className="max-w-xs">{a.accionCorrectiva}</Td>
              <Td className="max-w-xs">{a.accionPreventiva}</Td>
              <Td>{a.verificacion ?? '—'}</Td>
              <Td align="center">
                {a.estado === 'Verificada' ? <StatusBadge label="Verificada" tone="green" /> : a.estado === 'Ineficaz' ? <StatusBadge label="Ineficaz" tone="red" /> : <StatusBadge label="Sin verificar" tone="amber" />}
              </Td>
              <Td align="right">
                <button
                  className={BTN_GHOST}
                  disabled={a.estado === 'Verificada'}
                  onClick={() => {
                    setAcciones(lista => lista.map(x => (x.id === a.id ? { ...x, estado: 'Verificada', verificacion: 'Eficacia confirmada el 2026-10-28' } : x)));
                    window.setTimeout(() => setMsg(`${a.id} verificada: la acción correctiva fue eficaz (simulado).`), 400);
                  }}
                >
                  Verificar eficacia
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------- Trazabilidad y reportes ------------------------- */

function TabTraz() {
  return (
    <div className="space-y-4">
      <BloqueTrazabilidad />
      <BloqueReportes />
      <BloqueIntegraciones />
      <BloqueDocumental />
    </div>
  );
}

function BloqueTrazabilidad() {
  const [lote, setLote] = useState('');
  const visibles = CONTROLES.filter(c => !lote || c.lote.toLowerCase().includes(lote.toLowerCase()));
  return (
    <FunctionBlock code="CAL-14">
      <Toolbar>
        <input className={INPUT} placeholder="Filtrar por lote o número de serie..." value={lote} onChange={e => setLote(e.target.value)} />
      </Toolbar>
      <DataTable footer={`${visibles.length} controles con vínculo completo (producto, lote, orden, operación, responsable, fecha y evidencia).`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Control</Th><Th>Producto</Th><Th>Lote</Th><Th>Orden</Th><Th>Operación</Th><Th>Responsable</Th><Th>Fecha</Th><Th>Evidencia</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(c => (
            <tr key={c.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
              <Td className="font-medium">{c.producto}</Td>
              <Td><span className="font-mono text-gray-500">{c.lote}</span></Td>
              <Td><span className="font-mono text-gray-500">{c.orden}</span></Td>
              <Td>{c.operacion}</Td>
              <Td>{c.responsable}</Td>
              <Td>{fmtFecha(c.fecha)}</Td>
              <Td>{c.evidencia || <span className="text-gray-400">Sin adjunto</span>}</Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={8} text="Ningún control coincide con el lote buscado." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueReportes() {
  const decididos = CONTROLES.filter(c => c.resultado !== 'Pendiente');
  const aprobados = decididos.filter(c => c.resultado === 'Aprobado').length;
  const rechazados = decididos.filter(c => c.resultado !== 'Aprobado').length;
  const porProducto = [...new Set(CONTROLES.map(c => c.producto))].map(p => ({
    producto: p,
    n: CONTROLES.filter(c => c.producto === p).length,
  })).sort((a, b) => b.n - a.n).slice(0, 4);
  const porEtapa = [...new Set(NO_CONFORMIDADES.map(n => n.etapa))].map(e => ({
    etapa: e,
    n: NO_CONFORMIDADES.filter(n => n.etapa === e).length,
  }));
  const porOrigen = [...new Set(NO_CONFORMIDADES.map(n => n.origen))].map(o => ({
    origen: o,
    n: NO_CONFORMIDADES.filter(n => n.origen === o).length,
  }));
  const porFecha = [...new Set(CONTROLES.map(c => c.fecha))].sort().map(f => ({
    fecha: f,
    n: CONTROLES.filter(c => c.fecha === f).length,
  }));
  const maxP = Math.max(...porProducto.map(p => p.n), 1);
  const maxE = Math.max(...porEtapa.map(e => e.n), 1);
  const maxO = Math.max(...porOrigen.map(o => o.n), 1);
  const maxF = Math.max(...porFecha.map(f => f.n), 1);
  return (
    <FunctionBlock code="CAL-15">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Controles por producto">
          <div className="space-y-3">{porProducto.map(p => <Barra key={p.producto} label={p.producto} valor={p.n} max={maxP} />)}</div>
        </Card>
        <Card title="Tasa de aprobación y rechazo">
          <div className="space-y-3">
            <Barra label={`Aprobados (${aprobados})`} valor={aprobados} max={decididos.length} sub={fmtPct(decididos.length > 0 ? aprobados / decididos.length : 0)} />
            <Barra label={`Rechazados / fuera de tolerancia (${rechazados})`} valor={rechazados} max={decididos.length} sub={fmtPct(decididos.length > 0 ? rechazados / decididos.length : 0)} />
            <p className="text-[11px] text-gray-400">Sobre {decididos.length} controles con resultado definido.</p>
          </div>
        </Card>
        <Card title="Alertas por etapa">
          <div className="space-y-3">{porEtapa.map(e => <Barra key={e.etapa} label={e.etapa} valor={e.n} max={maxE} />)}</div>
        </Card>
        <Card title="Defectos por origen">
          <div className="space-y-3">{porOrigen.map(o => <Barra key={o.origen} label={o.origen} valor={o.n} max={maxO} />)}</div>
        </Card>
        <Card title="Evolución temporal (controles por fecha)" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {porFecha.map(f => <Barra key={f.fecha} label={fmtFecha(f.fecha)} valor={f.n} max={maxF} />)}
          </div>
        </Card>
      </div>
    </FunctionBlock>
  );
}

function BloqueIntegraciones() {
  const [msg, setMsg] = useState<string | null>(null);
  const tono: Record<string, BadgeTone> = { 'Conectado': 'green', 'Degradado': 'amber', 'No configurado': 'gray' };
  return (
    <FunctionBlock code="CAL-17">
      <Toolbar>
        <span className="text-xs text-gray-500">Integraciones con inventario, producción, mantenimiento, documentos y captura por escáner.</span>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${INTEGRACIONES_CALIDAD.length} integraciones monitoreadas.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Sistema</Th><Th>Alcance</Th><Th align="center">Estado</Th><Th>Última sincronización</Th><Th align="right">Acciones</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {INTEGRACIONES_CALIDAD.map(i => (
            <tr key={i.sistema} className="hoverable">
              <Td className="font-medium">{i.sistema}</Td>
              <Td>{i.alcance}</Td>
              <Td align="center"><StatusBadge label={i.estado} tone={tono[i.estado]} /></Td>
              <Td><span className="font-mono text-gray-500">{i.ultimaSincro}</span></Td>
              <Td align="right"><button className={BTN_GHOST} onClick={() => window.setTimeout(() => setMsg(`Conexión con ${i.sistema} probada correctamente (simulado).`), 400)}>Probar conexión</button></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueDocumental() {
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const tono: Record<string, BadgeTone> = { 'Especificación': 'petroleum', 'Plano': 'blue', 'Certificado': 'green', 'Evidencia': 'gray' };
  return (
    <FunctionBlock code="CAL-18">
      <Toolbar>
        <span className="text-xs text-gray-500">Especificaciones, planos, certificados y evidencias adjuntos a controles, alertas y lotes.</span>
        <div className="flex-1" />
        <button className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Adjuntar documento</button>
      </Toolbar>
      <Aviso texto={msg} />
      <DataTable footer={`${DOCUMENTOS_CALIDAD.length} documentos con control de versión y acceso.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr><Th>Documento</Th><Th align="center">Tipo</Th><Th>Vinculado a</Th><Th>Referencia</Th><Th align="center">Versión</Th><Th align="center">Acceso</Th><Th>Fecha</Th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {DOCUMENTOS_CALIDAD.map(d => (
            <tr key={d.id} className="hoverable">
              <Td className="font-medium">{d.nombre}</Td>
              <Td align="center"><StatusBadge label={d.tipo} tone={tono[d.tipo]} /></Td>
              <Td>{d.vinculadoA}</Td>
              <Td><span className="font-mono text-gray-500">{d.vinculoId}</span></Td>
              <Td align="center"><span className="font-mono text-gray-500">{d.version}</span></Td>
              <Td align="center"><StatusBadge label={d.acceso} tone={d.acceso === 'Restringido' ? 'red' : d.acceso === 'Público' ? 'green' : 'blue'} /></Td>
              <Td>{fmtFecha(d.fecha)}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Adjuntar documento" onClose={() => setModal(false)}>
          <form
            className="space-y-3 p-5"
            onSubmit={e => {
              e.preventDefault();
              setModal(false);
              window.setTimeout(() => setMsg('Documento adjuntado con versión v1 y acceso «Equipo calidad» (simulado).'), 400);
            }}
          >
            <label className="text-xs text-gray-600">Nombre del documento<input className={INPUT} data-initial-focus placeholder="Ej. Certificado de análisis lote 118" required /></label>
            <label className="text-xs text-gray-600">Tipo
              <select className={INPUT}><option>Especificación</option><option>Plano</option><option>Certificado</option><option>Evidencia</option></select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-600">Vincular a
                <select className={INPUT}><option>Control</option><option>Alerta</option><option>Lote</option><option>Producto</option></select>
              </label>
              <label className="text-xs text-gray-600">Referencia<input className={INPUT} placeholder="Ej. CT-104" /></label>
            </div>
            <label className="text-xs text-gray-600">Acceso
              <select className={INPUT}><option>Equipo calidad</option><option>Público</option><option>Restringido</option></select>
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

/* --------------------------------- Página --------------------------------- */

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'config', label: 'Configuración' },
  { id: 'controles', label: 'Controles' },
  { id: 'alertas', label: 'Alertas y acciones' },
  { id: 'traz', label: 'Trazabilidad y reportes' },
];

export default function CAL() {
  const [tab, setTab] = useState('resumen');
  const pendientes = CONTROLES.filter(c => c.resultado === 'Pendiente').length;
  const abiertas = NO_CONFORMIDADES.filter(a => a.estado !== 'Cerrada').length;
  const decididos = CONTROLES.filter(c => c.resultado !== 'Pendiente');
  const tasa = decididos.length > 0 ? decididos.filter(c => c.resultado === 'Aprobado').length / decididos.length : 0;
  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('cal')} funcionalidades · Fase ${MOD.fase}`}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Puntos de control activos" value={fmtNum(PUNTOS_CONTROL.filter(p => p.activo).length)} sub={`${TIPOS_CONTROL.length} tipos de control`} tone="info" />
        <StatCard label="Controles pendientes" value={fmtNum(pendientes)} sub={`${CONTROLES.length} controles totales`} tone="warn" />
        <StatCard label="Tasa de aprobación" value={fmtPct(tasa)} sub={`${decididos.length} resultados definidos`} tone="ok" />
        <StatCard label="Alertas abiertas" value={fmtNum(abiertas)} sub={`${NO_CONFORMIDADES.length} alertas totales`} tone="danger" />
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'resumen' && <TabResumen />}
      {tab === 'config' && <TabConfig />}
      {tab === 'controles' && <TabControles />}
      {tab === 'alertas' && <TabAlertas />}
      {tab === 'traz' && <TabTraz />}
    </div>
  );
}

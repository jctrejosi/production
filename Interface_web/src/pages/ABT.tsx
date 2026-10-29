// Módulo ABT — Compras y abastecimiento.
// Suite de producción: demo sin fetch ni librerías externas. Convenciones en
// ../CONVENCIONES.md (mismas reglas que la suite financiera).

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
  BTN_DANGER,
  BTN_GHOST,
  type BadgeTone,
} from '../components/ui';
import { MODULOS, conteoModulo } from '../data/modules';
import { fmtMoney, fmtNum, fmtPct, fmtFecha } from '../lib/format';
import {
  ACUERDOS_MARCO,
  APROBACIONES,
  COMUNICACIONES,
  COMPRAS_PRODUCCION,
  CONFIG_ABT,
  CONDICIONES_TARIFAS,
  CONSOLIDACIONES,
  DEVOLUCIONES,
  DOCUMENTOS_ELECTRONICOS,
  FACTURAS,
  HOY,
  NECESIDADES_COMPRA,
  OFERTAS,
  ORDENES_COMPRA,
  PLANTILLAS_PEDIDO,
  PRODUCTOS_COMPRABLES,
  PROVEEDORES,
  RECEPCIONES,
  RECORDATORIOS,
  REPORTES_ABT,
  SOLICITUDES_COTIZACION,
  UMBRALES_APROBACION,
  importeOrden,
  nombreProveedor,
  type Factura,
  type OrdenCompra,
  type EstadoOrden,
} from '../data/abt';

const MOD = MODULOS.find(m => m.id === 'abt')!;

/* ------------------------------- helpers de UI ------------------------------- */

const TONO_ESTADO: Record<string, BadgeTone> = {
  'Borrador': 'gray',
  'Solicitada': 'blue',
  'Enviada': 'blue',
  'Con ofertas': 'blue',
  'Seleccionada': 'green',
  'Enviado': 'green',
  'Acuse recibido': 'green',
  'Contraoferta': 'amber',
  'Sin respuesta': 'red',
  'Pendiente': 'amber',
  'Convertida': 'green',
  'Propuesta': 'blue',
  'Confirmada': 'green',
  'Vigente': 'green',
  'Próximo a agotar': 'amber',
  'Agotado': 'red',
  'Vencido': 'red',
  'Activo': 'green',
  'Inactivo': 'gray',
  'Aprobada': 'green',
  'Rechazada': 'red',
  'En aprobación': 'amber',
  'Parcialmente recibida': 'amber',
  'Recibida': 'green',
  'Facturada': 'petroleum',
  'Cerrada': 'gray',
  'Cancelada': 'red',
  'Abierta': 'amber',
  'Con devolución': 'amber',
  'Conciliada': 'green',
  'Con diferencias': 'amber',
  'Bloqueada': 'red',
  'En tránsito': 'blue',
  'Completada': 'green',
  'Atendido': 'green',
  'En proceso': 'blue',
  'Crítico': 'red',
  'Validado': 'green',
  'Con errores': 'red',
  'Recibido': 'blue',
  'Total': 'blue',
  'Parcial': 'amber',
  'Sí': 'green',
  'No': 'gray',
};

function toneEstado(estado: string): BadgeTone {
  return TONO_ESTADO[estado] ?? 'gray';
}

function tonePrioridad(p: string): BadgeTone {
  return p === 'Alta' ? 'red' : p === 'Media' ? 'amber' : 'gray';
}

interface MensajeState {
  texto: string;
  tone: 'ok' | 'warn' | 'error';
}

function useSimulacion(): [MensajeState | null, (texto: string, tone?: MensajeState['tone']) => void] {
  const [mensaje, setMensaje] = useState<MensajeState | null>(null);
  const simular = (texto: string, tone: MensajeState['tone'] = 'ok') => {
    setMensaje(null);
    window.setTimeout(() => setMensaje({ texto, tone }), 400);
  };
  return [mensaje, simular];
}

function Mensaje({ mensaje }: { mensaje: MensajeState | null }) {
  if (!mensaje) return null;
  const cls =
    mensaje.tone === 'ok'
      ? 'border-green-200 bg-green-50 text-green-800'
      : mensaje.tone === 'warn'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-red-200 bg-red-50 text-red-800';
  return (
    <div role="status" className={`rounded border px-4 py-3 text-sm ${cls}`}>
      {mensaje.texto}
    </div>
  );
}

function MiniBar({ label, value, max = 1 }: { label: string; value: number; max?: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
      <span className="w-9 shrink-0">{label}</span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : 'bg-petroleum-500'}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right font-mono">{fmtPct(value, 0)}</span>
    </div>
  );
}

function PieForm({
  onCancel,
  onSave,
  saveLabel = 'Guardar',
}: {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
      <button type="button" className={BTN_SECONDARY} onClick={onCancel}>
        Cancelar
      </button>
      <button type="button" className={BTN_PRIMARY} onClick={onSave}>
        {saveLabel}
      </button>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}

/* ================================== Resumen ================================== */

const REGLAS_NEGOCIO = [
  'No se debe recepcionar una orden no aprobada, salvo excepción autorizada.',
  'No se debe facturar una cantidad mayor a la recibida cuando la política sea «facturar por recepción».',
  'Todo cambio posterior a la confirmación debe quedar auditado.',
  'Las órdenes bloqueadas no pueden editarse ni cancelarse.',
  'Los acuerdos marco no pueden exceder la cantidad o el importe comprometido sin autorización.',
  'Las diferencias de conciliación deben tener responsable y resolución.',
  'Toda devolución debe afectar inventario y finanzas.',
];

const CICLO_VIDA = [
  'Borrador',
  'Solicitada',
  'En aprobación',
  'Aprobada / Confirmada',
  'Parcialmente recibida',
  'Recibida',
  'Facturada',
  'Cerrada',
];

const INTEGRACIONES = [
  ['Inventario', 'recepciones, devoluciones y existencias'],
  ['Producción', 'necesidades de componentes y subcontratación'],
  ['Calidad', 'inspección de recepción'],
  ['Finanzas', 'facturas, impuestos, pagos y centros de costo'],
  ['Proveedores', 'portal, correo y documentos electrónicos'],
];

const CRITERIOS = [
  'Una necesidad puede convertirse en orden y recepción sin reingreso manual.',
  'El sistema impide facturar por encima de la política configurada.',
  'Toda orden muestra cantidades pedidas, recibidas y facturadas.',
  'Las aprobaciones y bloqueos son auditables.',
  'Los reportes cuadran con los documentos de origen.',
];

function ResumenTab() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Card title="Objetivo">
        <p className="text-xs leading-relaxed text-gray-600">
          Gestionar el ciclo completo de abastecimiento, desde la detección de la necesidad hasta la recepción, la
          facturación y el pago, asegurando precio, plazo, calidad y trazabilidad.
        </p>
      </Card>
      <Card title="Alcance">
        <p className="text-xs leading-relaxed text-gray-600">
          Incluye materias primas, insumos, repuestos, servicios y compras vinculadas a producción o subcontratación.
          Cubre proveedores, solicitudes de cotización, órdenes, recepciones, facturas y acuerdos marco.
        </p>
      </Card>
      <Card title="Actores">
        <div className="flex flex-wrap gap-1.5">
          {['Comprador', 'Jefe de compras', 'Almacenista', 'Responsable de calidad', 'Finanzas', 'Proveedor'].map(a => (
            <span key={a} className="rounded-full bg-petroleum-50 px-2.5 py-0.5 text-xs font-medium text-petroleum-700">
              {a}
            </span>
          ))}
        </div>
      </Card>
      <Card title="Ciclo de vida del documento">
        <div className="flex flex-wrap items-center gap-1.5">
          {CICLO_VIDA.map((e, i) => (
            <span key={e} className="flex items-center gap-1.5">
              <StatusBadge label={e} tone={toneEstado(e.split(' / ')[0])} />
              {i < CICLO_VIDA.length - 1 && <span className="text-gray-300">→</span>}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
          <span className="text-gray-300">↘</span>
          <StatusBadge label="Cancelada" tone="red" />
          <span className="text-gray-400">desde cualquier estado anterior a la recepción, con validaciones.</span>
        </div>
      </Card>
      <Card title="Reglas de negocio">
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-gray-600">
          {REGLAS_NEGOCIO.map(r => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Card>
      <Card title="Integraciones">
        <ul className="space-y-1.5">
          {INTEGRACIONES.map(([mod, det]) => (
            <li key={mod} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="mt-0.5 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-600">{mod}</span>
              <span>{det}.</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Reportes del módulo">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          {REPORTES_ABT.slice(0, 6).map(r => (
            <li key={r.id}>{r.nombre.toLowerCase()}: {r.descripcion.toLowerCase()}.</li>
          ))}
        </ul>
      </Card>
      <Card title="Criterios de aceptación">
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-gray-600">
          {CRITERIOS.map(c => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ======================= Catálogo y proveedores (01–03) ======================= */

function BloqueCatalogoProductos() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [modal, setModal] = useState(false);
  const [mensaje, simular] = useSimulacion();
  const categorias = [...new Set(PRODUCTOS_COMPRABLES.map(p => p.categoria))];
  const visibles = PRODUCTOS_COMPRABLES.filter(
    p =>
      (!cat || p.categoria === cat) &&
      (!q || `${p.codigo} ${p.nombre} ${p.empaque}`.toLocaleLowerCase('es').includes(q.toLocaleLowerCase('es')))
  );
  return (
    <FunctionBlock code="ABT-01">
      <Toolbar>
        <div className="w-72">
          <input className={INPUT} type="search" aria-label="Buscar productos" placeholder="Buscar por código, nombre o empaque..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="w-48">
          <select className={INPUT} value={cat} onChange={e => setCat(e.target.value)} aria-label="Filtrar por categoría">
            <option value="">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-gray-500">{visibles.length} artículos</span>
        <div className="flex-1" />
        <button type="button" className={BTN_PRIMARY} onClick={() => setModal(true)}>
          + Nuevo producto
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer={`${visibles.length} de ${PRODUCTOS_COMPRABLES.length} productos comprables`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Producto</Th>
            <Th>Categoría</Th>
            <Th align="center">U. medida</Th>
            <Th>Empaque</Th>
            <Th align="center">Control</Th>
            <Th align="center">Recepción obligatoria</Th>
            <Th align="center">Política facturación</Th>
            <Th align="center">Proveedores</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(p => (
            <tr key={p.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{p.codigo}</span></Td>
              <Td className="font-medium text-gray-800">{p.nombre}</Td>
              <Td>{p.categoria}</Td>
              <Td align="center">{p.um}</Td>
              <Td>{p.empaque}</Td>
              <Td align="center">
                <StatusBadge label={p.control} tone={p.control === 'Lote' ? 'petroleum' : p.control === 'Serie' ? 'blue' : 'gray'} />
              </Td>
              <Td align="center"><StatusBadge label={p.recepcionObligatoria ? 'Sí' : 'No'} tone={p.recepcionObligatoria ? 'green' : 'gray'} /></Td>
              <Td align="center">{p.politicaFacturacion}</Td>
              <Td align="center"><span className="font-mono text-gray-600">{p.proveedoresAdmitidos.length}</span></Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={9} text="No hay productos que coincidan con la búsqueda." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nuevo producto comprable" onClose={() => setModal(false)}>
          <div className="grid grid-cols-2 gap-3 px-5 pb-3 pt-4">
            <Campo label="Código"><input className={INPUT} data-initial-focus placeholder="MP-0004" /></Campo>
            <Campo label="Nombre"><input className={INPUT} placeholder="Nombre del artículo o servicio" /></Campo>
            <Campo label="Unidad de medida"><input className={INPUT} placeholder="Bulto, Caja, Rollo..." /></Campo>
            <Campo label="Empaque"><input className={INPUT} placeholder="Presentación comercial" /></Campo>
            <Campo label="Categoría">
              <select className={INPUT}><option>Materia prima</option><option>Insumo de empaque</option><option>Repuestos</option><option>Servicios</option></select>
            </Campo>
            <Campo label="Control de artículo">
              <select className={INPUT}><option>Cantidad</option><option>Lote</option><option>Serie</option></select>
            </Campo>
            <label className="col-span-2 flex items-center gap-2 text-xs text-gray-700">
              <input type="checkbox" defaultChecked /> La recepción es obligatoria antes de facturar
            </label>
          </div>
          <PieForm
            onCancel={() => setModal(false)}
            onSave={() => {
              setModal(false);
              simular('Producto registrado en el catálogo de comprables (simulado).');
            }}
          />
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueCondiciones() {
  const [prov, setProv] = useState('');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);
  const [mensaje, simular] = useSimulacion();

  // El sistema selecciona automáticamente la condición vigente y prioritaria.
  const vigentes = CONDICIONES_TARIFAS.filter(c => c.vigenciaDesde <= HOY && HOY <= c.vigenciaHasta);
  const porProducto = new Map<string, typeof vigentes>();
  for (const c of vigentes) {
    const lista = porProducto.get(c.productoId) ?? [];
    lista.push(c);
    porProducto.set(c.productoId, lista);
  }
  const activas = [...porProducto.values()].map(l => [...l].sort((a, b) => a.prioridad - b.prioridad)[0]);
  const visibles = CONDICIONES_TARIFAS.filter(
    c =>
      (!prov || c.proveedorId === prov) &&
      (!q || `${PRODUCTOS_COMPRABLES.find(p => p.id === c.productoId)?.nombre ?? ''} ${c.codigoProveedor}`.toLocaleLowerCase('es').includes(q.toLocaleLowerCase('es')))
  );
  return (
    <FunctionBlock code="ABT-02">
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded border border-petroleum-100 bg-petroleum-50/60 px-3 py-2 text-xs text-petroleum-800">
        <span className="font-medium">Selección automática:</span> al crear una solicitud u orden se toma la condición
        vigente con mayor prioridad por proveedor y producto ({activas.length} condiciones activas hoy).
        {activas[0] && (
          <span className="font-mono text-petroleum-600">
            Ej.: {PRODUCTOS_COMPRABLES.find(p => p.id === activas[0].productoId)?.nombre} → {fmtMoney(activas[0].precio)} ({nombreProveedor(activas[0].proveedorId)})
          </span>
        )}
      </div>
      <Toolbar>
        <div className="w-72">
          <input className={INPUT} type="search" aria-label="Buscar condiciones" placeholder="Buscar por producto o código del proveedor..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="w-56">
          <select className={INPUT} value={prov} onChange={e => setProv(e.target.value)} aria-label="Filtrar por proveedor">
            <option value="">Todos los proveedores</option>
            {PROVEEDORES.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-gray-500">{visibles.length} condiciones</span>
        <div className="flex-1" />
        <button type="button" className={BTN_PRIMARY} onClick={() => setModal(true)}>
          + Nueva condición
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer={`${visibles.length} condiciones de tarifas; la columna «Vigente» se evalúa contra hoy (${fmtFecha(HOY)}).`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Producto</Th>
            <Th>Proveedor</Th>
            <Th>Cód. proveedor</Th>
            <Th align="right">Precio</Th>
            <Th align="right">Cant. mínima</Th>
            <Th align="right">Plazo</Th>
            <Th align="center">Moneda</Th>
            <Th align="right">Descuento</Th>
            <Th>Vigencia</Th>
            <Th align="center">Prioridad</Th>
            <Th align="center">Vigente</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(c => {
            const vigente = c.vigenciaDesde <= HOY && HOY <= c.vigenciaHasta;
            return (
              <tr key={c.id} className="hoverable">
                <Td className="font-medium text-gray-800">{PRODUCTOS_COMPRABLES.find(p => p.id === c.productoId)?.nombre ?? c.productoId}</Td>
                <Td>{nombreProveedor(c.proveedorId)}</Td>
                <Td><span className="font-mono text-gray-500">{c.codigoProveedor}</span></Td>
                <Td align="right"><span className="font-mono">{fmtMoney(c.precio)}</span></Td>
                <Td align="right"><span className="font-mono">{fmtNum(c.cantidadMinima)}</span></Td>
                <Td align="right"><span className="font-mono">{c.plazoEntregaDias} días</span></Td>
                <Td align="center"><span className="font-mono text-gray-600">{c.moneda}</span></Td>
                <Td align="right"><span className="font-mono">{fmtPct(c.descuentoPct / 100)}</span></Td>
                <Td><span className="font-mono text-gray-500">{fmtFecha(c.vigenciaDesde)} → {fmtFecha(c.vigenciaHasta)}</span></Td>
                <Td align="center"><span className="font-mono text-gray-600">{c.prioridad}</span></Td>
                <Td align="center"><StatusBadge label={vigente ? 'Sí' : 'No'} tone={vigente ? 'green' : 'gray'} /></Td>
              </tr>
            );
          })}
          {visibles.length === 0 && <EmptyRow colSpan={11} text="No hay condiciones que coincidan con los filtros." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nueva condición y tarifa" onClose={() => setModal(false)}>
          <div className="grid grid-cols-2 gap-3 px-5 pb-3 pt-4">
            <Campo label="Proveedor">
              <select className={INPUT} data-initial-focus>
                {PROVEEDORES.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Producto">
              <select className={INPUT}>
                {PRODUCTOS_COMPRABLES.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Precio (COP)"><input className={INPUT} type="number" placeholder="87000" /></Campo>
            <Campo label="Cantidad mínima"><input className={INPUT} type="number" placeholder="50" /></Campo>
            <Campo label="Plazo de entrega (días)"><input className={INPUT} type="number" placeholder="12" /></Campo>
            <Campo label="Descuento (%)"><input className={INPUT} type="number" step="0.5" placeholder="2" /></Campo>
            <Campo label="Vigencia desde"><input className={INPUT} type="date" defaultValue={HOY} /></Campo>
            <Campo label="Vigencia hasta"><input className={INPUT} type="date" defaultValue="2026-12-31" /></Campo>
            <Campo label="Código del proveedor"><input className={INPUT} placeholder="HAR-50" /></Campo>
            <Campo label="Prioridad">
              <select className={INPUT}><option value="1">1 — más prioritaria</option><option value="2">2</option><option value="3">3</option></select>
            </Campo>
          </div>
          <PieForm onCancel={() => setModal(false)} onSave={() => { setModal(false); simular('Condición registrada; quedará activa según su vigencia (simulado).'); }} />
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueProveedores() {
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');
  const [editando, setEditando] = useState<string | null>(null);
  const [mensaje, simular] = useSimulacion();
  const visibles = PROVEEDORES.filter(
    p =>
      (!estado || p.estado === estado) &&
      (!q || `${p.nit} ${p.nombre} ${p.ciudad} ${p.contacto}`.toLocaleLowerCase('es').includes(q.toLocaleLowerCase('es')))
  );
  const proveedor = editando ? PROVEEDORES.find(p => p.id === editando) ?? null : null;
  return (
    <FunctionBlock code="ABT-03">
      <Toolbar>
        <div className="w-72">
          <input className={INPUT} type="search" aria-label="Buscar proveedores" placeholder="Buscar por NIT, razón social, ciudad o contacto..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="w-44">
          <select className={INPUT} value={estado} onChange={e => setEstado(e.target.value)} aria-label="Filtrar por estado">
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <span className="text-xs text-gray-500">{visibles.length} proveedores</span>
        <div className="flex-1" />
        <button type="button" className={BTN_PRIMARY} onClick={() => setEditando('__nuevo')}>
          + Nuevo proveedor
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer={`${visibles.length} proveedores · evaluación: E entrega, C calidad, P precio, R respuesta`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>NIT</Th>
            <Th>Proveedor</Th>
            <Th>Ciudad</Th>
            <Th>Contacto</Th>
            <Th>Correo</Th>
            <Th>Teléfono</Th>
            <Th align="center">Estado</Th>
            <Th>Evaluación</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(p => (
            <tr key={p.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{p.nit}</span></Td>
              <Td className="font-medium text-gray-800">{p.nombre}</Td>
              <Td>{p.ciudad}</Td>
              <Td>{p.contacto}</Td>
              <Td className="text-gray-500">{p.email}</Td>
              <Td className="font-mono text-gray-500">{p.telefono}</Td>
              <Td align="center"><StatusBadge label={p.estado} tone={toneEstado(p.estado)} /></Td>
              <Td>
                <div className="flex flex-col gap-0.5">
                  <MiniBar label="E" value={p.evaluacion.entrega} />
                  <MiniBar label="C" value={p.evaluacion.calidad} />
                  <MiniBar label="P" value={p.evaluacion.precio} />
                  <MiniBar label="R" value={p.evaluacion.respuesta} />
                </div>
              </Td>
              <Td align="center">
                <button type="button" className={BTN_GHOST} onClick={() => setEditando(p.id)}>Editar</button>
                <button
                  type="button"
                  className={BTN_GHOST}
                  onClick={() =>
                    p.estado === 'Activo'
                      ? simular(`Proveedor ${p.nombre} inactivado; no se admitirá en nuevas solicitudes (simulado).`, 'warn')
                      : simular(`Proveedor ${p.nombre} reactivado (simulado).`)
                  }
                >
                  {p.estado === 'Activo' ? 'Inactivar' : 'Reactivar'}
                </button>
              </Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={9} text="No hay proveedores que coincidan con la búsqueda." />}
        </tbody>
      </DataTable>
      {editando && (
        <Modal title={editando === '__nuevo' ? 'Nuevo proveedor' : `Editar ${proveedor?.nombre ?? ''}`} onClose={() => setEditando(null)}>
          <div className="grid grid-cols-2 gap-3 px-5 pb-3 pt-4">
            <Campo label="NIT"><input className={INPUT} data-initial-focus defaultValue={proveedor?.nit ?? ''} placeholder="900.000.000-0" /></Campo>
            <Campo label="Razón social"><input className={INPUT} defaultValue={proveedor?.nombre ?? ''} /></Campo>
            <Campo label="Ciudad"><input className={INPUT} defaultValue={proveedor?.ciudad ?? ''} /></Campo>
            <Campo label="Contacto"><input className={INPUT} defaultValue={proveedor?.contacto ?? ''} /></Campo>
            <Campo label="Correo"><input className={INPUT} type="email" defaultValue={proveedor?.email ?? ''} /></Campo>
            <Campo label="Teléfono"><input className={INPUT} defaultValue={proveedor?.telefono ?? ''} /></Campo>
            <Campo label="Condiciones comerciales">
              <select className={INPUT}><option>30 días</option><option>45 días</option><option>Contado</option></select>
            </Campo>
            <Campo label="Avisos">
              <select className={INPUT}><option>Sin avisos</option><option>Alertar retrasos</option><option>Alertar cambios de tarifa</option></select>
            </Campo>
          </div>
          <PieForm onCancel={() => setEditando(null)} onSave={() => { setEditando(null); simular('Proveedor guardado con datos fiscales y condiciones comerciales (simulado).'); }} />
        </Modal>
      )}
    </FunctionBlock>
  );
}

/* ============================ Cotizaciones (04–08) ============================ */

function BloqueSolicitudCotizacion() {
  const [solicitudes, setSolicitudes] = useState(SOLICITUDES_COTIZACION);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);
  const [mensaje, simular] = useSimulacion();
  const visibles = solicitudes.filter(
    s => !q || `${s.id} ${nombreProveedor(s.proveedorIds[0])} ${s.lugarEntrega}`.toLocaleLowerCase('es').includes(q.toLocaleLowerCase('es'))
  );
  const nuevosProveedores = PROVEEDORES.filter(p => p.estado === 'Activo').slice(0, 6);
  return (
    <FunctionBlock code="ABT-04">
      <Toolbar>
        <div className="w-72">
          <input className={INPUT} type="search" aria-label="Buscar solicitudes" placeholder="Buscar por número, proveedor o lugar..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <span className="text-xs text-gray-500">{visibles.length} solicitudes</span>
        <div className="flex-1" />
        <button type="button" className={BTN_PRIMARY} onClick={() => setModal(true)}>
          + Nueva solicitud de cotización
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer={`${visibles.length} solicitudes de cotización · cada una puede enviarse a uno o varios proveedores`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Nº</Th>
            <Th align="center">Fecha</Th>
            <Th>Comprador</Th>
            <Th align="center">Requerida</Th>
            <Th>Lugar de entrega</Th>
            <Th>Condiciones</Th>
            <Th align="center">Moneda</Th>
            <Th>Centro costo</Th>
            <Th>Proveedores</Th>
            <Th align="center">Líneas</Th>
            <Th align="center">Estado</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(s => (
            <tr key={s.id} className="hoverable">
              <Td><span className="font-mono font-medium text-gray-800">{s.id}</span></Td>
              <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(s.fecha)}</span></Td>
              <Td>{s.comprador}</Td>
              <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(s.fechaRequerida)}</span></Td>
              <Td>{s.lugarEntrega}</Td>
              <Td>{s.condicionesPago} · {s.impuestos}</Td>
              <Td align="center"><span className="font-mono text-gray-600">{s.moneda}</span></Td>
              <Td><span className="font-mono text-gray-500">{s.centroCosto}</span></Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {s.proveedorIds.map(id => (
                    <StatusBadge key={id} label={id} tone="petroleum" />
                  ))}
                </div>
              </Td>
              <Td align="center"><span className="font-mono text-gray-600">{s.lineas.length}</span></Td>
              <Td align="center"><StatusBadge label={s.estado} tone={toneEstado(s.estado)} /></Td>
              <Td align="center">
                <button
                  type="button"
                  className={BTN_GHOST}
                  onClick={() => simular(`Solicitud ${s.id} enviada a ${s.proveedorIds.length} proveedor(es); historial de comunicaciones actualizado (simulado).`)}
                >
                  Enviar
                </button>
              </Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={12} text="No hay solicitudes que coincidan con la búsqueda." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nueva solicitud de cotización" onClose={() => setModal(false)}>
          <div className="grid grid-cols-2 gap-3 px-5 pb-3 pt-4">
            <Campo label="Producto">
              <select className={INPUT} data-initial-focus>
                {PRODUCTOS_COMPRABLES.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Cantidad"><input className={INPUT} type="number" placeholder="100" /></Campo>
            <Campo label="Fecha requerida"><input className={INPUT} type="date" defaultValue="2026-11-10" /></Campo>
            <Campo label="Lugar de entrega"><input className={INPUT} placeholder="Planta Manizales" /></Campo>
            <Campo label="Condiciones de pago">
              <select className={INPUT}><option>30 días</option><option>45 días</option><option>15 días</option><option>Contado</option></select>
            </Campo>
            <Campo label="Moneda">
              <select className={INPUT}><option>COP</option><option>USD</option></select>
            </Campo>
            <Campo label="Impuestos">
              <select className={INPUT}><option>IVA 0 % (excluido)</option><option>IVA 19 %</option><option>IVA 5 %</option></select>
            </Campo>
            <Campo label="Centro de costo">
              <select className={INPUT}><option>PRD-01</option><option>PRD-02</option><option>MNT-02</option><option>LOG-01</option></select>
            </Campo>
            <div className="col-span-2">
              <span className="mb-1 block text-xs font-medium text-gray-600">Proveedores destinatarios</span>
              <div className="grid grid-cols-2 gap-1 rounded border border-gray-200 p-2">
                {nuevosProveedores.map((p, i) => (
                  <label key={p.id} className="flex items-center gap-1.5 text-xs text-gray-700">
                    <input type="checkbox" defaultChecked={i < 3} /> {p.nombre}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <PieForm
            onCancel={() => setModal(false)}
            onSave={() => {
              setModal(false);
              setSolicitudes(prev => [
                { id: `SQC-2026-01${String(prev.length + 1).padStart(2, '0')}`, fecha: HOY, comprador: 'Carolina Ríos', fechaRequerida: '2026-11-10', lugarEntrega: 'Planta Manizales', condicionesPago: '30 días', moneda: 'COP', impuestos: 'IVA 19 %', centroCosto: 'PRD-01', estado: 'Borrador', proveedorIds: ['PRO-001', 'PRO-004'], lineas: [{ productoId: 'MP-0001', producto: 'Harina de trigo panadera', cantidad: 100, um: 'Bulto' }] },
                ...prev,
              ]);
              simular('Solicitud creada en borrador; puede enviarse a los proveedores seleccionados (simulado).');
            }}
          />
        </Modal>
      )}
    </FunctionBlock>
  );
}

function BloqueNecesidades() {
  const [origen, setOrigen] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [convertidas, setConvertidas] = useState<Record<string, boolean>>({});
  const [mensaje, simular] = useSimulacion();
  const origenes = [...new Set(NECESIDADES_COMPRA.map(n => n.origen))];
  const visibles = NECESIDADES_COMPRA.filter(
    n =>
      (!origen || n.origen === origen) &&
      (!prioridad || n.prioridad === prioridad) &&
      !convertidas[n.id]
  );
  return (
    <FunctionBlock code="ABT-05">
      <Toolbar>
        <div className="w-56">
          <select className={INPUT} value={origen} onChange={e => setOrigen(e.target.value)} aria-label="Filtrar por origen">
            <option value="">Todos los orígenes</option>
            {origenes.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="w-40">
          <select className={INPUT} value={prioridad} onChange={e => setPrioridad(e.target.value)} aria-label="Filtrar por prioridad">
            <option value="">Todas las prioridades</option>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
        </div>
        <span className="text-xs text-gray-500">
          {visibles.length} sugerencias pendientes · {NECESIDADES_COMPRA.length - visibles.length} convertidas
        </span>
        <div className="flex-1" />
        <button
          type="button"
          className={BTN_SECONDARY}
          onClick={() => simular('Motor de necesidades ejecutado: inventario, consumo histórico, OP, ventas y demanda evaluados (simulado).')}
        >
          ↻ Ejecutar generación
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer="Cada sugerencia indica origen, cantidad sugerida, fecha requerida y prioridad.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Sugerencia</Th>
            <Th>Origen</Th>
            <Th>Producto</Th>
            <Th align="right">Cantidad sugerida</Th>
            <Th align="center">Fecha requerida</Th>
            <Th align="center">Prioridad</Th>
            <Th align="center">Estado</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(n => {
            const yaConvertida = n.estado === 'Convertida';
            return (
              <tr key={n.id} className="hoverable">
                <Td><span className="font-mono font-medium text-gray-800">{n.id}</span></Td>
                <Td><StatusBadge label={n.origen} tone="petroleum" /></Td>
                <Td>{n.producto}</Td>
                <Td align="right"><span className="font-mono">{fmtNum(n.cantidadSugerida)} {n.um}</span></Td>
                <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(n.fechaRequerida)}</span></Td>
                <Td align="center"><StatusBadge label={n.prioridad} tone={tonePrioridad(n.prioridad)} /></Td>
                <Td align="center"><StatusBadge label={yaConvertida ? 'Convertida' : 'Pendiente'} tone={yaConvertida ? 'green' : 'amber'} /></Td>
                <Td align="center">
                  <button
                    type="button"
                    className={BTN_GHOST}
                    onClick={() => {
                      setConvertidas(prev => ({ ...prev, [n.id]: true }));
                      simular(`Sugerencia ${n.id} convertida en solicitud de cotización sin reingreso manual (simulado).`);
                    }}
                  >
                    Convertir a solicitud
                  </button>
                </Td>
              </tr>
            );
          })}
          {visibles.length === 0 && <EmptyRow colSpan={8} text="No hay sugerencias de compra pendientes con estos filtros." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueComunicaciones() {
  const [canal, setCanal] = useState('');
  const [mensaje, simular] = useSimulacion();
  const visibles = COMUNICACIONES.filter(c => !canal || c.canal === canal);
  return (
    <FunctionBlock code="ABT-06">
      <Toolbar>
        <div className="w-44">
          <select className={INPUT} value={canal} onChange={e => setCanal(e.target.value)} aria-label="Filtrar por canal">
            <option value="">Todos los canales</option>
            <option>Correo</option>
            <option>Portal</option>
            <option>PDF</option>
          </select>
        </div>
        <span className="text-xs text-gray-500">{visibles.length} comunicaciones</span>
        <div className="flex-1" />
        <button type="button" className={BTN_SECONDARY} onClick={() => simular('Documento PDF generado con membrete y condiciones comerciales (simulado).')}>
          ⬇ Generar PDF
        </button>
        <button type="button" className={BTN_PRIMARY} onClick={() => simular('Documentos enviados por correo; el portal del proveedor quedó habilitado para consulta (simulado).')}>
          ✉ Enviar por correo
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer={`${visibles.length} registros · se conserva envío, acuse de recibo y cualquier contraoferta`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th align="center">Fecha</Th>
            <Th align="center">Documento</Th>
            <Th>Referencia</Th>
            <Th>Proveedor</Th>
            <Th align="center">Canal</Th>
            <Th align="center">Estado</Th>
            <Th>Detalle</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(c => (
            <tr key={c.id} className="hoverable">
              <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(c.fecha)}</span></Td>
              <Td align="center">{c.tipoDocumento}</Td>
              <Td><span className="font-mono text-gray-600">{c.referencia}</span></Td>
              <Td>{nombreProveedor(c.proveedorId)}</Td>
              <Td align="center"><StatusBadge label={c.canal} tone={c.canal === 'Correo' ? 'petroleum' : c.canal === 'Portal' ? 'blue' : 'gray'} /></Td>
              <Td align="center"><StatusBadge label={c.estado} tone={toneEstado(c.estado)} /></Td>
              <Td className="max-w-md text-gray-500">{c.detalle}</Td>
              <Td align="center">
                <button type="button" className={BTN_GHOST} onClick={() => simular(`Comunicación reenviada al proveedor por ${c.canal} (simulado).`)}>
                  Reenviar
                </button>
              </Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={8} text="No hay comunicaciones con este canal." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueComparacionOfertas() {
  const [solicitudId, setSolicitudId] = useState(SOLICITUDES_COTIZACION[0].id);
  const [seleccion, setSeleccion] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(OFERTAS.map(o => [o.id, o.seleccionada]))
  );
  const [justificacion, setJustificacion] = useState('');
  const [mensaje, simular] = useSimulacion();
  const ofertas = OFERTAS.filter(o => o.solicitudId === solicitudId);
  const mejor = [...ofertas].sort((a, b) => a.precioTotal - b.precioTotal)[0];
  return (
    <FunctionBlock code="ABT-07">
      <Toolbar>
        <div className="w-64">
          <select className={INPUT} value={solicitudId} onChange={e => setSolicitudId(e.target.value)} aria-label="Elegir solicitud a comparar">
            {SOLICITUDES_COTIZACION.map(s => (
              <option key={s.id} value={s.id}>{s.id} · {PRODUCTOS_COMPRABLES.find(p => p.id === s.lineas[0].productoId)?.nombre ?? ''}</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-gray-500">{ofertas.length} ofertas comparadas</span>
        <div className="flex-1" />
        <div className="w-72">
          <input className={INPUT} placeholder="Justificación de la decisión..." value={justificacion} onChange={e => setJustificacion(e.target.value)} />
        </div>
        <button
          type="button"
          className={BTN_PRIMARY}
          onClick={() => {
            if (!justificacion.trim()) {
              simular('Escriba una justificación antes de documentar la decisión.', 'warn');
              return;
            }
            simular('Decisión documentada con su justificación en el historial de la solicitud (simulado).');
          }}
        >
          Documentar decisión
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer={mejor ? `Mejor precio: ${nombreProveedor(mejor.proveedorId)} (${fmtMoney(mejor.precioTotal)}). La decisión queda documentada con justificación.` : 'Sin ofertas para esta solicitud.'}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Oferta</Th>
            <Th>Proveedor</Th>
            <Th align="center">Fecha</Th>
            <Th align="right">Precio total</Th>
            <Th align="right">Plazo</Th>
            <Th>Condiciones</Th>
            <Th align="center">Calidad</Th>
            <Th align="center">Desempeño</Th>
            <Th align="center">Seleccionada</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ofertas.map(o => {
            const sel = seleccion[o.id];
            return (
              <tr key={o.id} className={`hoverable ${sel ? 'bg-petroleum-50/70' : ''}`}>
                <Td><span className="font-mono text-gray-600">{o.id}</span></Td>
                <Td className="font-medium text-gray-800">{nombreProveedor(o.proveedorId)}</Td>
                <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(o.fecha)}</span></Td>
                <Td align="right"><span className="font-mono">{fmtMoney(o.precioTotal)}</span></Td>
                <Td align="right"><span className="font-mono">{o.plazoDias} días</span></Td>
                <Td>{o.condicionesPago}</Td>
                <Td align="center"><span className="font-mono">{fmtPct(o.calidad, 0)}</span></Td>
                <Td align="center"><span className="font-mono">{fmtPct(o.desempeno, 0)}</span></Td>
                <Td align="center"><StatusBadge label={sel ? 'Sí' : 'No'} tone={sel ? 'green' : 'gray'} /></Td>
                <Td align="center">
                  <button
                    type="button"
                    className={BTN_GHOST}
                    onClick={() => {
                      const siguiente: Record<string, boolean> = {};
                      for (const of of ofertas) siguiente[of.id] = of.id === o.id;
                      setSeleccion(siguiente);
                      simular(`Oferta ${o.id} (${nombreProveedor(o.proveedorId)}) seleccionada como mejor combinación (simulado).`);
                    }}
                  >
                    Seleccionar
                  </button>
                </Td>
              </tr>
            );
          })}
          {ofertas.length === 0 && <EmptyRow colSpan={10} text="Esta solicitud no tiene ofertas registradas." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

function BloqueConsolidacion() {
  const [mensaje, simular] = useSimulacion();
  const candidatas = SOLICITUDES_COTIZACION.filter(s => s.estado === 'Enviada' || s.estado === 'Con ofertas');
  return (
    <FunctionBlock code="ABT-08">
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
        <span className="font-medium text-gray-700">Compatibles para agrupar:</span>
        {candidatas.map(s => (
          <StatusBadge key={s.id} label={s.id} tone="blue" />
        ))}
        <span className="text-gray-400">(mismo proveedor o misma necesidad)</span>
      </div>
      <Toolbar>
        <span className="text-xs text-gray-500">{CONSOLIDACIONES.length} consolidaciones</span>
        <div className="flex-1" />
        <button
          type="button"
          className={BTN_PRIMARY}
          onClick={() => simular('Solicitudes compatibles agrupadas; se redujo el número de órdenes previstas (simulado).')}
        >
          ⇶ Agrupar solicitudes compatibles
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer="Agrupar solicitudes del mismo proveedor o necesidad reduce órdenes y mejora la negociación.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Consolidación</Th>
            <Th>Proveedor</Th>
            <Th>Solicitudes agrupadas</Th>
            <Th align="center">Fecha</Th>
            <Th align="right">Ahorro estimado</Th>
            <Th align="center">Estado</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {CONSOLIDACIONES.map(c => (
            <tr key={c.id} className="hoverable">
              <Td><span className="font-mono font-medium text-gray-800">{c.id}</span></Td>
              <Td>{nombreProveedor(c.proveedorId)}</Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {c.solicitudIds.map(sid => (
                    <StatusBadge key={sid} label={sid} tone="blue" />
                  ))}
                </div>
              </Td>
              <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(c.fecha)}</span></Td>
              <Td align="right"><span className="font-mono">{c.ahorroEstimado > 0 ? fmtMoney(c.ahorroEstimado) : '—'}</span></Td>
              <Td align="center"><StatusBadge label={c.estado} tone={toneEstado(c.estado)} /></Td>
              <Td align="center">
                <button type="button" className={BTN_GHOST} onClick={() => simular(`Orden de compra generada desde la consolidación ${c.id} (simulado).`)}>
                  Generar orden
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ============================= Órdenes (09–13, 19) ============================= */

interface CambioOrden {
  id: string;
  ordenId: string;
  fecha: string;
  usuario: string;
  accion: string;
  motivo: string;
}

function nivelParaImporte(monto: number): string {
  const u = UMBRALES_APROBACION.find(x => x.activo && monto >= x.desde && (x.hasta === null || monto <= x.hasta));
  return u ? u.nivel : 'Sin umbral definido';
}

function OrdenesTab() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>(ORDENES_COMPRA);
  const [aprobaciones, setAprobaciones] = useState(APROBACIONES);
  const [cambios, setCambios] = useState<CambioOrden[]>([
    { id: 'CAM-0001', ordenId: 'OC-2026-0078', fecha: '2026-10-20 14:05', usuario: 'Marta Gil', accion: 'Bloqueo', motivo: 'Orden confirmada.' },
    { id: 'CAM-0002', ordenId: 'OC-2026-0080', fecha: '2026-10-08 09:12', usuario: 'Marta Gil', accion: 'Bloqueo', motivo: 'Orden confirmada.' },
  ]);
  const [modalBloqueo, setModalBloqueo] = useState<OrdenCompra | null>(null);
  const [motivoBloqueo, setMotivoBloqueo] = useState('');
  const [modalAprobacion, setModalAprobacion] = useState<OrdenCompra | null>(null);
  const [observacionesAprobacion, setObservacionesAprobacion] = useState('');
  const [ordenDetalle, setOrdenDetalle] = useState<string>(ORDENES_COMPRA[0].id);
  const [mensaje, simular] = useSimulacion();

  const pendientesAprobacion = ordenes.filter(o => o.estado === 'En aprobación');
  const borradores = ordenes.filter(o => o.estado === 'Borrador');
  const detalle = ordenes.find(o => o.id === ordenDetalle) ?? ordenes[0];

  function confirmar(o: OrdenCompra) {
    setOrdenes(prev => prev.map(x => (x.id === o.id ? { ...x, estado: 'Confirmada', bloqueada: CONFIG_ABT.bloquearOrdenesConfirmadas, aprobador: 'Marta Gil', fechaAprobacion: HOY } : x)));
    simular(`Orden ${o.id} confirmada: compromiso con ${nombreProveedor(o.proveedorId)}, ${o.lineas.length} recepción(es) prevista(s) y movimientos de inventario generados (simulado).`);
  }

  function aplicarBloqueo() {
    if (!modalBloqueo) return;
    const accion = modalBloqueo.bloqueada ? 'Desbloqueo' : 'Bloqueo';
    setOrdenes(prev => prev.map(x => (x.id === modalBloqueo.id ? { ...x, bloqueada: !x.bloqueada } : x)));
    setCambios(prev => [
      { id: `CAM-${String(prev.length + 1).padStart(4, '0')}`, ordenId: modalBloqueo.id, fecha: `${HOY} ${new Date().toTimeString().slice(0, 5)}`, usuario: 'Marta Gil', accion, motivo: motivoBloqueo || 'Sin motivo registrado.' },
      ...prev,
    ]);
    setModalBloqueo(null);
    setMotivoBloqueo('');
    simular(`${accion} de ${modalBloqueo.id} registrado con motivo y trazabilidad (simulado).`);
  }

  function resolverAprobacion(aprobar: boolean) {
    if (!modalAprobacion) return;
    const nuevoEstado: EstadoOrden = aprobar ? 'Confirmada' : 'Cancelada';
    setOrdenes(prev => prev.map(x => (x.id === modalAprobacion.id ? { ...x, estado: nuevoEstado, bloqueada: aprobar && CONFIG_ABT.bloquearOrdenesConfirmadas, aprobador: aprobar ? 'Marta Gil' : undefined, fechaAprobacion: aprobar ? HOY : undefined } : x)));
    setAprobaciones(prev => [
      { id: `APR-${String(prev.length + 1).padStart(4, '0')}`, ordenId: modalAprobacion.id, nivel: nivelParaImporte(importeOrden(modalAprobacion)), aprobador: 'Marta Gil', fecha: `${HOY} ${new Date().toTimeString().slice(0, 5)}`, estado: aprobar ? 'Aprobada' : 'Rechazada', observaciones: observacionesAprobacion || '—' },
      ...prev,
    ]);
    setModalAprobacion(null);
    setObservacionesAprobacion('');
    simular(aprobar ? `Orden ${modalAprobacion.id} aprobada; quedó confirmada y bloqueada (simulado).` : `Orden ${modalAprobacion.id} rechazada y cancelada (simulado).`, aprobar ? 'ok' : 'warn');
  }

  /* ------------------------------ ABT-10 ------------------------------ */
  const bloqueAprobaciones = (
    <FunctionBlock code="ABT-10">
      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Umbrales de aprobación configurados">
          <DataTable footer="Se evalúa por importe, categoría, centro de costo o proyecto.">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th align="right">Desde</Th>
                <Th align="right">Hasta</Th>
                <Th>Nivel aprobador</Th>
                <Th>Ámbito</Th>
                <Th align="center">Activo</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {UMBRALES_APROBACION.map(u => (
                <tr key={u.id} className="hoverable">
                  <Td align="right"><span className="font-mono">{fmtMoney(u.desde)}</span></Td>
                  <Td align="right"><span className="font-mono">{u.hasta === null ? '∞' : fmtMoney(u.hasta)}</span></Td>
                  <Td className="font-medium text-gray-800">{u.nivel}</Td>
                  <Td>{u.ambito}</Td>
                  <Td align="center"><StatusBadge label={u.activo ? 'Activo' : 'Inactivo'} tone={u.activo ? 'green' : 'gray'} /></Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Card>
        <div className="space-y-3">
          <Card title={`Órdenes pendientes de aprobación (${pendientesAprobacion.length})`}>
            {pendientesAprobacion.length === 0 ? (
              <p className="text-xs text-gray-500">No hay órdenes en aprobación.</p>
            ) : (
              <ul className="space-y-2">
                {pendientesAprobacion.map(o => (
                  <li key={o.id} className="flex items-center justify-between gap-2 rounded border border-gray-100 px-3 py-2">
                    <div>
                      <span className="font-mono text-xs font-medium text-gray-800">{o.id}</span>
                      <div className="text-[11px] text-gray-500">
                        {nombreProveedor(o.proveedorId)} · {fmtMoney(importeOrden(o))} · requiere <strong>{nivelParaImporte(importeOrden(o))}</strong>
                      </div>
                    </div>
                    <button type="button" className={BTN_PRIMARY} onClick={() => setModalAprobacion(o)}>
                      Revisar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Registro de aprobaciones (quién, cuándo, observaciones)">
            <DataTable footer={`${aprobaciones.length} registros de aprobación`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Orden</Th>
                  <Th>Nivel</Th>
                  <Th>Aprobador</Th>
                  <Th align="center">Fecha</Th>
                  <Th align="center">Estado</Th>
                  <Th>Observaciones</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {aprobaciones.map(a => (
                  <tr key={a.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{a.ordenId}</span></Td>
                    <Td>{a.nivel}</Td>
                    <Td>{a.aprobador}</Td>
                    <Td align="center"><span className="font-mono text-gray-500">{a.fecha}</span></Td>
                    <Td align="center"><StatusBadge label={a.estado} tone={toneEstado(a.estado)} /></Td>
                    <Td className="text-gray-500">{a.observaciones}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </Card>
        </div>
      </div>
      {modalAprobacion && (
        <Modal title={`Aprobación de ${modalAprobacion.id}`} onClose={() => setModalAprobacion(null)}>
          <div className="space-y-3 px-5 pb-3 pt-4">
            <p className="text-xs text-gray-600">
              {nombreProveedor(modalAprobacion.proveedorId)} · {fmtMoney(importeOrden(modalAprobacion))} · nivel requerido:{' '}
              <strong>{nivelParaImporte(importeOrden(modalAprobacion))}</strong>
            </p>
            <Campo label="Observaciones de la aprobación">
              <textarea className={`${INPUT} h-20`} data-initial-focus value={observacionesAprobacion} onChange={e => setObservacionesAprobacion(e.target.value)} placeholder="Observaciones del aprobador..." />
            </Campo>
          </div>
          <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
            <button type="button" className={BTN_DANGER} onClick={() => resolverAprobacion(false)}>Rechazar</button>
            <button type="button" className={BTN_PRIMARY} onClick={() => resolverAprobacion(true)}>Aprobar</button>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );

  /* ------------------------------ ABT-11 ------------------------------ */
  const bloqueConfirmacion = (
    <FunctionBlock code="ABT-11">
      <div className="mb-3 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
        Al confirmar se genera el <strong>compromiso con el proveedor</strong>, las <strong>recepciones previstas</strong> por
        línea y los <strong>movimientos de inventario</strong> correspondientes. Cada orden tiene identificador único y estado verificable.
      </div>
      <DataTable footer={`${borradores.length} órdenes en borrador listas para confirmar`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Orden</Th>
            <Th>Proveedor</Th>
            <Th align="center">Fecha</Th>
            <Th align="center">Entrega prevista</Th>
            <Th align="right">Importe</Th>
            <Th align="center">Estado</Th>
            <Th align="center">Bloqueada</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ordenes.map(o => (
            <tr key={o.id} className="hoverable">
              <Td><span className="font-mono font-medium text-gray-800">{o.id}</span></Td>
              <Td>{nombreProveedor(o.proveedorId)}</Td>
              <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(o.fecha)}</span></Td>
              <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(o.fechaEntrega)}</span></Td>
              <Td align="right"><span className="font-mono">{fmtMoney(importeOrden(o))}</span></Td>
              <Td align="center"><StatusBadge label={o.estado} tone={toneEstado(o.estado)} /></Td>
              <Td align="center"><StatusBadge label={o.bloqueada ? 'Sí' : 'No'} tone={o.bloqueada ? 'red' : 'gray'} /></Td>
              <Td align="center">
                {o.estado === 'Borrador' ? (
                  <button type="button" className={BTN_PRIMARY} onClick={() => confirmar(o)}>Confirmar</button>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );

  /* ------------------------------ ABT-12 ------------------------------ */
  const bloqueBloqueo = (
    <FunctionBlock code="ABT-12">
      <Toolbar>
        <span className="text-xs text-gray-500">
          Las órdenes bloqueadas no pueden editarse ni cancelarse. Cualquier cambio posterior a la confirmación requiere desbloqueo con motivo y trazabilidad.
        </span>
      </Toolbar>
      <DataTable footer={`${cambios.length} cambios auditados en el historial`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Orden</Th>
            <Th align="center">Estado</Th>
            <Th align="center">Bloqueada</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ordenes
            .filter(o => o.estado !== 'Borrador' && o.estado !== 'En aprobación' && o.estado !== 'Cancelada')
            .map(o => (
              <tr key={o.id} className="hoverable">
                <Td><span className="font-mono font-medium text-gray-800">{o.id}</span></Td>
                <Td align="center"><StatusBadge label={o.estado} tone={toneEstado(o.estado)} /></Td>
                <Td align="center"><StatusBadge label={o.bloqueada ? 'Sí' : 'No'} tone={o.bloqueada ? 'red' : 'gray'} /></Td>
                <Td align="center">
                  <button type="button" className={BTN_GHOST} onClick={() => setModalBloqueo(o)}>
                    {o.bloqueada ? 'Desbloquear' : 'Bloquear'}
                  </button>
                </Td>
              </tr>
            ))}
        </tbody>
      </DataTable>
      <Card title="Trazabilidad de cambios" className="mt-3" pad={false}>
        <DataTable>
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Orden</Th>
              <Th align="center">Fecha</Th>
              <Th>Usuario</Th>
              <Th>Acción</Th>
              <Th>Motivo</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cambios.map(c => (
              <tr key={c.id} className="hoverable">
                <Td><span className="font-mono text-gray-600">{c.ordenId}</span></Td>
                <Td align="center"><span className="font-mono text-gray-500">{c.fecha}</span></Td>
                <Td>{c.usuario}</Td>
                <Td><StatusBadge label={c.accion} tone={c.accion === 'Bloqueo' ? 'red' : 'blue'} /></Td>
                <Td className="text-gray-500">{c.motivo}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </Card>
      {modalBloqueo && (
        <Modal title={`${modalBloqueo.bloqueada ? 'Desbloqueo' : 'Bloqueo'} de ${modalBloqueo.id}`} onClose={() => setModalBloqueo(null)}>
          <div className="space-y-3 px-5 pb-3 pt-4">
            <p className="text-xs text-gray-600">
              {nombreProveedor(modalBloqueo.proveedorId)} · {fmtMoney(importeOrden(modalBloqueo))} · estado {modalBloqueo.estado}
            </p>
            <Campo label="Motivo del cambio (obligatorio para trazabilidad)">
              <textarea className={`${INPUT} h-20`} data-initial-focus value={motivoBloqueo} onChange={e => setMotivoBloqueo(e.target.value)} placeholder="Motivo del bloqueo o desbloqueo..." />
            </Campo>
          </div>
          <PieForm
            onCancel={() => setModalBloqueo(null)}
            onSave={() => {
              if (!motivoBloqueo.trim()) {
                simular('Registre el motivo del cambio antes de continuar.', 'warn');
                return;
              }
              aplicarBloqueo();
            }}
            saveLabel={modalBloqueo.bloqueada ? 'Desbloquear' : 'Bloquear'}
          />
        </Modal>
      )}
    </FunctionBlock>
  );

  /* ------------------------------ ABT-13 ------------------------------ */
  const bloqueLineas = (() => {
    const lineas = detalle.lineas;
    let subtotal = 0;
    let totalDto = 0;
    let totalImp = 0;
    let total = 0;
    const filas = lineas.map(l => {
      const base = l.cantidad * l.precio;
      const dto = (base * l.descuentoPct) / 100;
      const neto = base - dto;
      const imp = (neto * l.impuestoPct) / 100;
      subtotal += base;
      totalDto += dto;
      totalImp += imp;
      total += neto + imp;
      return { l, base, dto, neto, imp, total: neto + imp };
    });
    return (
      <FunctionBlock code="ABT-13">
        <Toolbar>
          <div className="w-64">
            <select className={INPUT} value={ordenDetalle} onChange={e => setOrdenDetalle(e.target.value)} aria-label="Elegir orden para ver líneas">
              {ordenes.map(o => (
                <option key={o.id} value={o.id}>{o.id} · {nombreProveedor(o.proveedorId)}</option>
              ))}
            </select>
          </div>
          <span className="text-xs text-gray-500">{lineas.length} líneas · análisis por centro de costo, proyecto y cuenta analítica</span>
        </Toolbar>
        <DataTable
          footer={`Cálculo preciso: subtotal ${fmtMoney(subtotal)} − descuentos ${fmtMoney(totalDto)} + impuestos ${fmtMoney(totalImp)} = total ${fmtMoney(total)}`}
        >
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Producto</Th>
              <Th>Descripción</Th>
              <Th align="right">Cantidad</Th>
              <Th align="center">UM</Th>
              <Th align="right">Precio</Th>
              <Th align="right">Dto</Th>
              <Th align="right">Impuesto</Th>
              <Th align="center">Prevista</Th>
              <Th align="center">C. costo</Th>
              <Th align="center">Proyecto</Th>
              <Th align="center">Cta. analítica</Th>
              <Th align="right">Total línea</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filas.map(f => (
              <tr key={f.l.id} className="hoverable">
                <Td className="font-medium text-gray-800">{f.l.producto}</Td>
                <Td className="text-gray-500">{f.l.descripcion}</Td>
                <Td align="right"><span className="font-mono">{fmtNum(f.l.cantidad)}</span></Td>
                <Td align="center">{f.l.um}</Td>
                <Td align="right"><span className="font-mono">{fmtMoney(f.l.precio)}</span></Td>
                <Td align="right"><span className="font-mono">{fmtPct(f.l.descuentoPct / 100)}</span></Td>
                <Td align="right"><span className="font-mono">{fmtPct(f.l.impuestoPct / 100)}</span></Td>
                <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(f.l.fechaPrevista)}</span></Td>
                <Td align="center"><span className="font-mono text-gray-500">{f.l.centroCosto}</span></Td>
                <Td align="center"><span className="font-mono text-gray-500">{f.l.proyecto}</span></Td>
                <Td align="center"><span className="font-mono text-gray-500">{f.l.cuentaAnalitica}</span></Td>
                <Td align="right"><span className="font-mono">{fmtMoney(f.total)}</span></Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600">Subtotal <span className="font-mono">{fmtMoney(subtotal)}</span></span>
          <span className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600">Descuentos <span className="font-mono">{fmtMoney(totalDto)}</span></span>
          <span className="rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600">Impuestos <span className="font-mono">{fmtMoney(totalImp)}</span></span>
          <span className="rounded border border-petroleum-200 bg-petroleum-50 px-3 py-1.5 text-xs font-medium text-petroleum-800">Total <span className="font-mono">{fmtMoney(total)}</span></span>
        </div>
      </FunctionBlock>
    );
  })();

  /* ------------------------------ ABT-19 ------------------------------ */
  const bloqueProduccion = (
    <FunctionBlock code="ABT-19">
      <Toolbar>
        <span className="text-xs text-gray-500">
          {COMPRAS_PRODUCCION.filter(c => c.estado === 'Crítico').length} vínculos críticos: material faltante con fecha límite superada.
        </span>
        <div className="flex-1" />
        <button
          type="button"
          className={BTN_PRIMARY}
          onClick={() => simular('Producción notificada sobre materiales faltantes y fechas límite (simulado).')}
        >
          ⚠ Notificar producción
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer="Vínculo de componentes, kits y subcontratación con sus órdenes de producción.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Orden producción</Th>
            <Th>Material / servicio faltante</Th>
            <Th align="right">Cantidad</Th>
            <Th>Orden de compra</Th>
            <Th>Proveedor</Th>
            <Th align="center">Fecha límite</Th>
            <Th align="center">Tipo</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {COMPRAS_PRODUCCION.map(c => (
            <tr key={c.id} className={`hoverable ${c.estado === 'Crítico' ? 'bg-red-50/60' : ''}`}>
              <Td><span className="font-mono font-medium text-gray-800">{c.ordenProduccion}</span></Td>
              <Td>{c.productoFaltante}</Td>
              <Td align="right"><span className="font-mono">{fmtNum(c.cantidadFaltante)} {c.um}</span></Td>
              <Td><span className="font-mono text-gray-600">{c.ordenCompraId}</span></Td>
              <Td>{nombreProveedor(c.proveedorId)}</Td>
              <Td align="center">
                <span className={`font-mono ${c.estado === 'Crítico' ? 'font-semibold text-red-600' : 'text-gray-500'}`}>
                  {fmtFecha(c.fechaLimite)}
                </span>
              </Td>
              <Td align="center"><StatusBadge label={c.tipo} tone="petroleum" /></Td>
              <Td align="center"><StatusBadge label={c.estado} tone={toneEstado(c.estado)} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );

  return (
    <div className="space-y-4">
      {bloqueAprobaciones}
      {bloqueConfirmacion}
      {bloqueBloqueo}
      {bloqueLineas}
      {bloqueProduccion}
    </div>
  );
}

/* ====================== Recepción y facturación (14–18, 20) ====================== */

function RecepcionTab() {
  const [recepciones, setRecepciones] = useState(RECEPCIONES);
  const [modalRecepcion, setModalRecepcion] = useState(false);
  const [ordenSel, setOrdenSel] = useState(ORDENES_COMPRA[0].id);
  const [mensaje, simular] = useSimulacion();
  const [detalleOrden, setDetalleOrden] = useState(ORDENES_COMPRA[0].id);

  const ordenDet = ORDENES_COMPRA.find(o => o.id === detalleOrden) ?? ORDENES_COMPRA[0];
  const pendientes = ORDENES_COMPRA.filter(
    o => o.estado !== 'Cancelada' && o.estado !== 'Cerrada' && o.estado !== 'Facturada' && o.lineas.some(l => l.recibida < l.cantidad)
  );

  function registrarRecepcion() {
    const orden = ORDENES_COMPRA.find(o => o.id === ordenSel);
    if (!orden) return;
    if (orden.estado === 'En aprobación' && !CONFIG_ABT.permitirRecepcionSinAprobacion) {
      setModalRecepcion(false);
      simular('No se puede recepcionar una orden no aprobada (regla de negocio), salvo excepción autorizada.', 'error');
      return;
    }
    const nueva = {
      id: `REC-2026-${String(recepciones.length + 1).padStart(4, '0')}`,
      ordenId: orden.id,
      fecha: HOY,
      tipo: 'Parcial' as const,
      ubicacion: 'ALM-01 · Estante A2',
      loteSerie: `LT-2610-${String.fromCharCode(69 + recepciones.length)}`,
      controlCalidad: 'Pendiente' as const,
      estado: 'Abierta' as const,
      lineas: orden.lineas.slice(0, 1).map(l => ({ productoId: l.productoId, producto: l.producto, cantidad: l.cantidad, um: l.um })),
    };
    setRecepciones(prev => [nueva, ...prev]);
    setModalRecepcion(false);
    simular(`Recepción ${nueva.id} registrada para ${orden.id}: inventario actualizado y pendientes generados (simulado).`);
  }

  /* ------------------------------ ABT-14 ------------------------------ */
  const bloqueRecepcion = (
    <FunctionBlock code="ABT-14">
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
        <span className="font-medium text-gray-700">Pendientes de recepción:</span>
        {pendientes.map(o => (
          <StatusBadge key={o.id} label={o.id} tone="amber" />
        ))}
      </div>
      <Toolbar>
        <span className="text-xs text-gray-500">{recepciones.length} recepciones registradas · ubicación, lote/serie y control de calidad por recepción</span>
        <div className="flex-1" />
        <button type="button" className={BTN_PRIMARY} onClick={() => setModalRecepcion(true)}>
          + Registrar recepción
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer="Las recepciones totales o parciales actualizan inventario y el estado de la orden.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Recepción</Th>
            <Th>Orden</Th>
            <Th align="center">Fecha</Th>
            <Th align="center">Tipo</Th>
            <Th>Ubicación</Th>
            <Th>Lote / serie</Th>
            <Th align="center">Control calidad</Th>
            <Th align="center">Estado</Th>
            <Th>Líneas</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {recepciones.map(r => (
            <tr key={r.id} className="hoverable">
              <Td><span className="font-mono font-medium text-gray-800">{r.id}</span></Td>
              <Td><span className="font-mono text-gray-600">{r.ordenId}</span></Td>
              <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(r.fecha)}</span></Td>
              <Td align="center"><StatusBadge label={r.tipo} tone={toneEstado(r.tipo)} /></Td>
              <Td>{r.ubicacion}</Td>
              <Td><span className="font-mono text-gray-500">{r.loteSerie}</span></Td>
              <Td align="center"><StatusBadge label={r.controlCalidad} tone={toneEstado(r.controlCalidad)} /></Td>
              <Td align="center"><StatusBadge label={r.estado} tone={toneEstado(r.estado)} /></Td>
              <Td>
                {r.lineas.map(l => (
                  <div key={l.productoId} className="text-[11px] text-gray-500">
                    {l.producto} · <span className="font-mono">{fmtNum(l.cantidad)} {l.um}</span>
                  </div>
                ))}
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {modalRecepcion && (
        <Modal title="Registrar recepción" onClose={() => setModalRecepcion(false)}>
          <div className="grid grid-cols-2 gap-3 px-5 pb-3 pt-4">
            <Campo label="Orden de compra">
              <select className={INPUT} data-initial-focus value={ordenSel} onChange={e => setOrdenSel(e.target.value)}>
                {ORDENES_COMPRA.filter(o => o.estado === 'Confirmada' || o.estado === 'Parcialmente recibida').map(o => (
                  <option key={o.id} value={o.id}>{o.id} · {nombreProveedor(o.proveedorId)}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Tipo">
              <select className={INPUT}><option>Parcial</option><option>Total</option></select>
            </Campo>
            <Campo label="Ubicación">
              <select className={INPUT}><option>ALM-01 · Estante A2</option><option>ALM-01 · Estante B3</option><option>ALM-02 · Zona fría</option></select>
            </Campo>
            <Campo label="Lote o serie"><input className={INPUT} placeholder="LT-2610-X" /></Campo>
            <Campo label="Resultado de calidad">
              <select className={INPUT}><option>Pendiente</option><option>Aprobada</option><option>Rechazada</option></select>
            </Campo>
            <Campo label="Cantidad recibida"><input className={INPUT} type="number" placeholder="Cantidad" /></Campo>
          </div>
          <PieForm onCancel={() => setModalRecepcion(false)} onSave={registrarRecepcion} saveLabel="Registrar recepción" />
        </Modal>
      )}
    </FunctionBlock>
  );

  /* ------------------------------ ABT-15 ------------------------------ */
  const bloqueCantidades = (
    <FunctionBlock code="ABT-15">
      <Toolbar>
        <div className="w-64">
          <select className={INPUT} value={detalleOrden} onChange={e => setDetalleOrden(e.target.value)} aria-label="Elegir orden para ver cantidades">
            {ORDENES_COMPRA.map(o => (
              <option key={o.id} value={o.id}>{o.id} · {nombreProveedor(o.proveedorId)}</option>
            ))}
          </select>
        </div>
        <StatusBadge label={ordenDet.estado} tone={toneEstado(ordenDet.estado)} />
        <span className="text-xs text-gray-500">El estado refleja las cantidades reales del documento, no una marca manual.</span>
      </Toolbar>
      <DataTable footer="Pedida / recibida / facturada por línea con pendientes calculados automáticamente.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Línea</Th>
            <Th align="right">Pedida</Th>
            <Th align="right">Recibida</Th>
            <Th align="right">Facturada</Th>
            <Th align="right">Pend. recepción</Th>
            <Th align="right">Pend. facturación</Th>
            <Th>Progreso de recepción</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ordenDet.lineas.map(l => {
            const pendRec = Math.max(0, l.cantidad - l.recibida);
            const pendFac = Math.max(0, l.recibida - l.facturada);
            return (
              <tr key={l.id} className="hoverable">
                <Td>
                  <span className="font-mono text-gray-500">{l.id}</span> <span className="font-medium text-gray-800">{l.producto}</span>
                </Td>
                <Td align="right"><span className="font-mono">{fmtNum(l.cantidad)} {l.um}</span></Td>
                <Td align="right"><span className="font-mono">{fmtNum(l.recibida)}</span></Td>
                <Td align="right"><span className="font-mono">{fmtNum(l.facturada)}</span></Td>
                <Td align="right"><span className={`font-mono ${pendRec > 0 ? 'text-amber-600' : 'text-gray-500'}`}>{fmtNum(pendRec)}</span></Td>
                <Td align="right"><span className={`font-mono ${pendFac > 0 ? 'text-amber-600' : 'text-gray-500'}`}>{fmtNum(pendFac)}</span></Td>
                <Td>
                  <div className="h-1.5 w-full max-w-48 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-petroleum-500" style={{ width: `${Math.min(100, Math.round((l.recibida / Math.max(1, l.cantidad)) * 100))}%` }} />
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );

  /* ------------------------------ ABT-16 ------------------------------ */
  function conciliar(f: Factura) {
    if (f.estado === 'Bloqueada') {
      simular(`Factura ${f.numero} bloqueada por política: no se puede facturar por encima de lo recibido (${fmtMoney(f.importeRecibido)} recibido). Asigne responsable y resolución.`, 'error');
      return;
    }
    if (f.estado === 'Con diferencias') {
      simular(`Factura ${f.numero} con diferencias de ${f.difPrecio ? 'precio ' : ''}${f.difImpuestos ? 'impuestos ' : ''}${f.difCantidad ? 'cantidad' : ''}; requiere responsable y resolución antes de conciliar.`, 'warn');
      return;
    }
    simular(`Factura ${f.numero} conciliada contra orden y recepción (conciliación triple, simulado).`);
  }
  const bloqueFacturacion = (
    <FunctionBlock code="ABT-16">
      <div className="mb-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Política activa: <strong>facturar por recepción</strong> — no se admite facturar cantidad mayor a la recibida.
        Toda diferencia de cantidad, precio o impuestos se detecta y bloquea o alerta según la política.
      </div>
      <Toolbar>
        <span className="text-xs text-gray-500">
          {FACTURAS.filter(f => f.estado !== 'Conciliada').length} facturas con diferencias o pendientes de resolución
        </span>
        <div className="flex-1" />
        <button type="button" className={BTN_PRIMARY} onClick={() => simular('Factura de proveedor registrada y lista para conciliación triple (simulado).')}>
          + Registrar factura
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer="Conciliación triple: factura del proveedor contra orden de compra y recepción.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Factura</Th>
            <Th>Proveedor</Th>
            <Th>Orden</Th>
            <Th align="center">Fecha</Th>
            <Th align="right">Importe factura</Th>
            <Th align="right">Importe orden</Th>
            <Th align="right">Importe recibido</Th>
            <Th align="center">Diferencias</Th>
            <Th align="center">Conciliación</Th>
            <Th>Resolución</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {FACTURAS.map(f => {
            const difs = [f.difCantidad ? 'cantidad' : '', f.difPrecio ? 'precio' : '', f.difImpuestos ? 'impuestos' : ''].filter(Boolean);
            return (
              <tr key={f.id} className={`hoverable ${f.estado === 'Bloqueada' ? 'bg-red-50/50' : ''}`}>
                <Td><span className="font-mono font-medium text-gray-800">{f.numero}</span></Td>
                <Td>{nombreProveedor(f.proveedorId)}</Td>
                <Td><span className="font-mono text-gray-600">{f.ordenId}</span></Td>
                <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(f.fecha)}</span></Td>
                <Td align="right"><span className="font-mono">{fmtMoney(f.importeFactura)}</span></Td>
                <Td align="right"><span className="font-mono">{fmtMoney(f.importeOrden)}</span></Td>
                <Td align="right"><span className="font-mono">{fmtMoney(f.importeRecibido)}</span></Td>
                <Td align="center">
                  {difs.length === 0 ? (
                    <StatusBadge label="Sin diferencias" tone="green" />
                  ) : (
                    <StatusBadge label={difs.join(', ')} tone="amber" />
                  )}
                </Td>
                <Td align="center"><StatusBadge label={f.estado} tone={toneEstado(f.estado)} /></Td>
                <Td className="max-w-56 text-gray-500">
                  {f.responsable !== '—' && f.responsable ? `${f.responsable}: ${f.resolucion ?? ''}` : '—'}
                </Td>
                <Td align="center">
                  <button type="button" className={BTN_GHOST} onClick={() => conciliar(f)}>Conciliar</button>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );

  /* ------------------------------ ABT-17 ------------------------------ */
  const bloqueDevoluciones = (
    <FunctionBlock code="ABT-17">
      <div className="grid gap-3 lg:grid-cols-3">
        <Card title="Devoluciones" className="lg:col-span-2" pad={false}>
          <DataTable footer="Toda devolución genera movimiento inverso de inventario y documento de ajuste.">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Devolución</Th>
                <Th>Orden</Th>
                <Th align="center">Fecha</Th>
                <Th align="center">Tipo</Th>
                <Th>Motivo</Th>
                <Th align="center">Estado</Th>
                <Th>Mov. inverso</Th>
                <Th>Ajuste</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DEVOLUCIONES.map(d => (
                <tr key={d.id} className="hoverable">
                  <Td><span className="font-mono font-medium text-gray-800">{d.id}</span></Td>
                  <Td><span className="font-mono text-gray-600">{d.ordenId}</span></Td>
                  <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(d.fecha)}</span></Td>
                  <Td align="center"><StatusBadge label={d.tipo} tone={toneEstado(d.tipo)} /></Td>
                  <Td className="text-gray-500">{d.motivo}</Td>
                  <Td align="center"><StatusBadge label={d.estado} tone={toneEstado(d.estado)} /></Td>
                  <Td><span className="font-mono text-gray-500">{d.movimientoInventario}</span></Td>
                  <Td><span className="font-mono text-gray-500">{d.documentoAjuste}</span></Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Card>
        <div className="space-y-3">
          <Card title="Saldos abiertos y cancelaciones">
            <ul className="space-y-2">
              {pendientes.map(o => (
                <li key={o.id} className="flex items-center justify-between gap-2 rounded border border-gray-100 px-3 py-2">
                  <div>
                    <span className="font-mono text-xs font-medium text-gray-800">{o.id}</span>
                    <div className="text-[11px] text-gray-500">
                      {nombreProveedor(o.proveedorId)} · pendiente de recepción
                    </div>
                  </div>
                  <button
                    type="button"
                    className={BTN_GHOST}
                    onClick={() =>
                      o.bloqueada
                        ? simular(`No se puede cancelar ${o.id}: la orden está bloqueada (regla de negocio). Desbloquee primero.`, 'error')
                        : simular(`Orden ${o.id} cancelada con validaciones; movimientos y compromisos revertidos (simulado).`)
                    }
                  >
                    Cancelar
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <button type="button" className={BTN_PRIMARY} onClick={() => simular('Devolución registrada: movimiento inverso de inventario y documento de ajuste generados (simulado).')}>
            + Registrar devolución
          </button>
        </div>
      </div>
    </FunctionBlock>
  );

  /* ------------------------------ ABT-18 ------------------------------ */
  const bloqueRecordatorios = (
    <FunctionBlock code="ABT-18">
      <Toolbar>
        <span className="text-xs text-gray-500">
          {RECORDATORIOS.filter(r => r.vencida).length} recordatorios vencidos · {RECORDATORIOS.filter(r => r.estado === 'Pendiente').length} pendientes de atender
        </span>
        <div className="flex-1" />
        <button
          type="button"
          className={BTN_PRIMARY}
          onClick={() => simular('Recordatorios de recepción generados y alertas de retraso enviadas a los compradores (simulado).')}
        >
          ⏰ Generar recordatorios
        </button>
      </Toolbar>
      <DataTable footer="El comprador consulta órdenes vencidas y acciones pendientes de un vistazo.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Orden</Th>
            <Th>Proveedor</Th>
            <Th>Tipo</Th>
            <Th align="center">Fecha programada</Th>
            <Th align="right">Días retraso</Th>
            <Th align="center">Vencida</Th>
            <Th align="center">Estado</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {RECORDATORIOS.map(r => (
            <tr key={r.id} className={`hoverable ${r.vencida ? 'bg-red-50/50' : ''}`}>
              <Td><span className="font-mono font-medium text-gray-800">{r.ordenId}</span></Td>
              <Td>{nombreProveedor(r.proveedorId)}</Td>
              <Td><StatusBadge label={r.tipo} tone={r.tipo === 'Escalamiento' ? 'red' : r.tipo === 'Alerta de retraso' ? 'amber' : 'petroleum'} /></Td>
              <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(r.fechaProgramada)}</span></Td>
              <Td align="right"><span className={`font-mono ${r.diasRetraso > 0 ? 'font-semibold text-red-600' : 'text-gray-500'}`}>{r.diasRetraso}</span></Td>
              <Td align="center"><StatusBadge label={r.vencida ? 'Sí' : 'No'} tone={r.vencida ? 'red' : 'gray'} /></Td>
              <Td align="center"><StatusBadge label={r.estado} tone={toneEstado(r.estado)} /></Td>
              <Td align="center">
                {r.estado === 'Pendiente' && (
                  <button
                    type="button"
                    className={BTN_GHOST}
                    onClick={() => simular(`Recordatorio de ${r.ordenId} atendido y registrado en el seguimiento del comprador (simulado).`)}
                  >
                    Atender
                  </button>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );

  /* ------------------------------ ABT-20 ------------------------------ */
  const bloqueEDI = (
    <FunctionBlock code="ABT-20">
      <Toolbar>
        <span className="text-xs text-gray-500">
          {DOCUMENTOS_ELECTRONICOS.length} documentos · {DOCUMENTOS_ELECTRONICOS.filter(d => d.estado === 'Con errores').length} con errores de estructura
        </span>
        <div className="flex-1" />
        <button type="button" className={BTN_SECONDARY} onClick={() => simular('Archivo validado contra el esquema UBL 2.1; estructura correcta (simulado).')}>
          ⬆ Importar archivo
        </button>
        <button type="button" className={BTN_PRIMARY} onClick={() => simular('Documentos exportados en UBL 2.1 y enviados al buzón electrónico (simulado).')}>
          ⬇ Exportar UBL
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer="Importación y exportación de órdenes, facturas y documentos comerciales en formatos electrónicos estándar.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th align="center">Fecha</Th>
            <Th align="center">Tipo</Th>
            <Th align="center">Formato</Th>
            <Th align="center">Dirección</Th>
            <Th>Archivo</Th>
            <Th align="center">Estado</Th>
            <Th align="right">Errores</Th>
            <Th>Detalle</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {DOCUMENTOS_ELECTRONICOS.map(d => (
            <tr key={d.id} className={`hoverable ${d.estado === 'Con errores' ? 'bg-red-50/50' : ''}`}>
              <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(d.fecha)}</span></Td>
              <Td align="center">{d.tipo}</Td>
              <Td align="center"><StatusBadge label={d.formato} tone="petroleum" /></Td>
              <Td align="center"><StatusBadge label={d.direccion} tone={d.direccion === 'Importación' ? 'blue' : 'gray'} /></Td>
              <Td><span className="font-mono text-gray-600">{d.archivo}</span></Td>
              <Td align="center"><StatusBadge label={d.estado} tone={toneEstado(d.estado)} /></Td>
              <Td align="right"><span className={`font-mono ${d.errores > 0 ? 'font-semibold text-red-600' : 'text-gray-500'}`}>{d.errores}</span></Td>
              <Td className="max-w-md text-gray-500">{d.detalle}</Td>
              <Td align="center">
                {d.estado === 'Con errores' && (
                  <button type="button" className={BTN_GHOST} onClick={() => simular(`Documento ${d.archivo} revalidado; errores registrados en bitácora (simulado).`)}>
                    Revalidar
                  </button>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );

  return (
    <div className="space-y-4">
      {bloqueRecepcion}
      {bloqueCantidades}
      {bloqueFacturacion}
      {bloqueDevoluciones}
      {bloqueRecordatorios}
      {bloqueEDI}
    </div>
  );
}

/* ======================= Acuerdos y configuración (09, 22) ======================= */

function AcuerdosTab() {
  const [modalAcuerdo, setModalAcuerdo] = useState(false);
  const [mensaje, simular] = useSimulacion();

  /* ------------------------------ ABT-09 ------------------------------ */
  const bloqueAcuerdos = (
    <FunctionBlock code="ABT-09">
      <div className="mb-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Los acuerdos no pueden exceder la cantidad o el importe comprometido sin autorización. El sistema controla el
        consumo y alerta al acercarse al límite ({ACUERDOS_MARCO.filter(a => a.estado === 'Próximo a agotar' || a.estado === 'Agotado').length} en alerta).
      </div>
      <Toolbar>
        <span className="text-xs text-gray-500">{ACUERDOS_MARCO.length} acuerdos marco · {PLANTILLAS_PEDIDO.length} plantillas reutilizables</span>
        <div className="flex-1" />
        <button type="button" className={BTN_PRIMARY} onClick={() => setModalAcuerdo(true)}>
          + Nuevo acuerdo marco
        </button>
      </Toolbar>
      <Mensaje mensaje={mensaje} />
      <DataTable footer="Precios y cantidades comprometidas por período con control de consumo.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Acuerdo</Th>
            <Th>Proveedor</Th>
            <Th>Artículo</Th>
            <Th align="right">Precio unitario</Th>
            <Th align="right">Comprometida</Th>
            <Th align="right">Consumida</Th>
            <Th>Consumo</Th>
            <Th align="right">Importe máximo</Th>
            <Th>Vigencia</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ACUERDOS_MARCO.map(a => {
            const pct = a.cantidadComprometida > 0 ? a.cantidadConsumida / a.cantidadComprometida : 0;
            return (
              <tr key={a.id} className="hoverable">
                <Td><span className="font-mono font-medium text-gray-800">{a.id}</span></Td>
                <Td>{nombreProveedor(a.proveedorId)}</Td>
                <Td>{a.articulo}</Td>
                <Td align="right"><span className="font-mono">{fmtMoney(a.precioUnitario)} / {a.um}</span></Td>
                <Td align="right"><span className="font-mono">{fmtNum(a.cantidadComprometida)}</span></Td>
                <Td align="right"><span className="font-mono">{fmtNum(a.cantidadConsumida)}</span></Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full ${pct >= 0.9 ? 'bg-red-500' : 'bg-petroleum-500'}`} style={{ width: `${Math.min(100, Math.round(pct * 100))}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-gray-500">{fmtPct(pct, 0)}</span>
                  </div>
                </Td>
                <Td align="right"><span className="font-mono">{fmtMoney(a.importeMaximo)}</span></Td>
                <Td><span className="font-mono text-gray-500">{fmtFecha(a.vigenciaDesde)} → {fmtFecha(a.vigenciaHasta)}</span></Td>
                <Td align="center"><StatusBadge label={a.estado} tone={toneEstado(a.estado)} /></Td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>
      <Card title="Plantillas reutilizables de pedidos recurrentes" className="mt-3" pad={false}>
        <DataTable>
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Plantilla</Th>
              <Th>Proveedor</Th>
              <Th align="center">Líneas</Th>
              <Th>Productos</Th>
              <Th align="center">Último uso</Th>
              <Th align="center">Acciones</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PLANTILLAS_PEDIDO.map(t => (
              <tr key={t.id} className="hoverable">
                <Td><span className="font-mono text-gray-600">{t.id}</span> <span className="font-medium text-gray-800">{t.nombre}</span></Td>
                <Td>{nombreProveedor(t.proveedorId)}</Td>
                <Td align="center"><span className="font-mono text-gray-600">{t.lineas}</span></Td>
                <Td className="text-gray-500">{t.productos}</Td>
                <Td align="center"><span className="font-mono text-gray-500">{fmtFecha(t.ultimoUso)}</span></Td>
                <Td align="center">
                  <button type="button" className={BTN_GHOST} onClick={() => simular(`Plantilla «${t.nombre}» cargada en una nueva orden de compra (simulado).`)}>
                    Usar plantilla
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </Card>
      {modalAcuerdo && (
        <Modal title="Nuevo acuerdo marco" onClose={() => setModalAcuerdo(false)}>
          <div className="grid grid-cols-2 gap-3 px-5 pb-3 pt-4">
            <Campo label="Proveedor">
              <select className={INPUT} data-initial-focus>
                {PROVEEDORES.filter(p => p.estado === 'Activo').map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Artículo"><input className={INPUT} placeholder="Artículo o familia" /></Campo>
            <Campo label="Precio unitario (COP)"><input className={INPUT} type="number" placeholder="84000" /></Campo>
            <Campo label="Cantidad comprometida"><input className={INPUT} type="number" placeholder="500" /></Campo>
            <Campo label="Importe máximo (COP)"><input className={INPUT} type="number" placeholder="50000000" /></Campo>
            <Campo label="Vigencia hasta"><input className={INPUT} type="date" defaultValue="2027-12-31" /></Campo>
          </div>
          <PieForm onCancel={() => setModalAcuerdo(false)} onSave={() => { setModalAcuerdo(false); simular('Acuerdo marco creado; el consumo se controlará contra lo comprometido (simulado).'); }} />
        </Modal>
      )}
    </FunctionBlock>
  );

  /* ------------------------------ ABT-22 ------------------------------ */
  function BloqueConfiguracion() {
    const [cfg, setCfg] = useState(CONFIG_ABT);
    const [mensaje, simular] = useSimulacion();
    return (
      <FunctionBlock code="ABT-22">
        <div className="grid gap-3 lg:grid-cols-2">
          <Card title="Políticas de compra">
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Política de facturación">
                <select className={INPUT} value={cfg.politicaFacturacion} onChange={e => setCfg({ ...cfg, politicaFacturacion: e.target.value as typeof cfg.politicaFacturacion })}>
                  <option>Por recepción</option>
                  <option>Por pedido</option>
                  <option>Sin recepción</option>
                </select>
              </Campo>
              <Campo label="Formato electrónico por defecto">
                <select className={INPUT} value={cfg.formatoElectronico} onChange={e => setCfg({ ...cfg, formatoElectronico: e.target.value as typeof cfg.formatoElectronico })}>
                  <option>UBL 2.1</option>
                  <option>EDIFACT</option>
                  <option>XML FE</option>
                </select>
              </Campo>
              <Campo label="Días de recordatorio de recepción">
                <input className={INPUT} type="number" value={cfg.diasRecordatorioRecepcion} onChange={e => setCfg({ ...cfg, diasRecordatorioRecepcion: Number(e.target.value) })} />
              </Campo>
              <Campo label="Días para alerta de retraso">
                <input className={INPUT} type="number" value={cfg.diasAlertaRetraso} onChange={e => setCfg({ ...cfg, diasAlertaRetraso: Number(e.target.value) })} />
              </Campo>
              <Campo label="Tolerancia de conciliación (%)">
                <input className={INPUT} type="number" step="0.5" value={cfg.toleranciaConciliacionPct * 100} onChange={e => setCfg({ ...cfg, toleranciaConciliacionPct: Number(e.target.value) / 100 })} />
              </Campo>
              <Campo label="Moneda por defecto">
                <select className={INPUT} value={cfg.monedaDefecto} onChange={e => setCfg({ ...cfg, monedaDefecto: e.target.value as typeof cfg.monedaDefecto })}>
                  <option>COP</option>
                  <option>USD</option>
                </select>
              </Campo>
            </div>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2 text-xs text-gray-700">
                <input type="checkbox" checked={cfg.bloquearOrdenesConfirmadas} onChange={e => setCfg({ ...cfg, bloquearOrdenesConfirmadas: e.target.checked })} />
                Bloquear automáticamente las órdenes confirmadas
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700">
                <input type="checkbox" checked={cfg.permitirRecepcionSinAprobacion} onChange={e => setCfg({ ...cfg, permitirRecepcionSinAprobacion: e.target.checked })} />
                Permitir recepción de órdenes no aprobadas (excepción autorizada)
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700">
                <input type="checkbox" checked={cfg.escalamientoAutomatico} onChange={e => setCfg({ ...cfg, escalamientoAutomatico: e.target.checked })} />
                Escalamiento automático de retrasos al jefe de compras
              </label>
            </div>
          </Card>
          <div className="space-y-3">
            <Card title="Unidades de medida y empaques">
              <div className="flex flex-wrap gap-1.5">
                {cfg.unidadesMedida.map(u => (
                  <span key={u} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{u}</span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cfg.empaques.map(e => (
                  <span key={e} className="rounded-full bg-petroleum-50 px-2 py-0.5 text-xs text-petroleum-700">{e}</span>
                ))}
              </div>
            </Card>
            <Card title="Permisos por rol" pad={false}>
              <DataTable>
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <Th>Rol</Th>
                    <Th align="center">Solicitudes</Th>
                    <Th align="center">Órdenes</Th>
                    <Th align="center">Aprobar</Th>
                    <Th align="center">Recibir</Th>
                    <Th align="center">Conciliar</Th>
                    <Th align="center">Configurar</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cfg.permisos.map(p => (
                    <tr key={p.rol} className="hoverable">
                      <Td className="font-medium text-gray-800">{p.rol}</Td>
                      <Td align="center"><StatusBadge label={p.crearSolicitudes ? 'Sí' : 'No'} tone={p.crearSolicitudes ? 'green' : 'gray'} /></Td>
                      <Td align="center"><StatusBadge label={p.crearOrdenes ? 'Sí' : 'No'} tone={p.crearOrdenes ? 'green' : 'gray'} /></Td>
                      <Td align="center"><StatusBadge label={p.aprobar ? 'Sí' : 'No'} tone={p.aprobar ? 'green' : 'gray'} /></Td>
                      <Td align="center"><StatusBadge label={p.recibir ? 'Sí' : 'No'} tone={p.recibir ? 'green' : 'gray'} /></Td>
                      <Td align="center"><StatusBadge label={p.conciliar ? 'Sí' : 'No'} tone={p.conciliar ? 'green' : 'gray'} /></Td>
                      <Td align="center"><StatusBadge label={p.configurar ? 'Sí' : 'No'} tone={p.configurar ? 'green' : 'gray'} /></Td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </Card>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button type="button" className={BTN_PRIMARY} onClick={() => simular('Configuración del módulo guardada: políticas, umbrales, avisos, recordatorios y permisos (simulado).')}>
            Guardar configuración
          </button>
          <Mensaje mensaje={mensaje} />
        </div>
      </FunctionBlock>
    );
  }

  return (
    <div className="space-y-4">
      {bloqueAcuerdos}
      <BloqueConfiguracion />
    </div>
  );
}

/* ================================ Reportes (21) ================================ */

function ReportesTab() {
  const [mensaje, simular] = useSimulacion();
  const gasto = useMemo(() => {
    return PROVEEDORES.map(p => ({
      ...p,
      total: ORDENES_COMPRA.filter(o => o.proveedorId === p.id && o.estado !== 'Cancelada' && o.estado !== 'Borrador').reduce((s, o) => s + importeOrden(o), 0),
    }))
      .filter(x => x.total > 0)
      .sort((a, b) => b.total - a.total);
  }, []);
  const maxGasto = gasto[0]?.total ?? 1;
  const diferencias = FACTURAS.filter(f => f.estado !== 'Conciliada');

  return (
    <FunctionBlock code="ABT-21">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {REPORTES_ABT.map(r => (
          <div key={r.id} className="flex flex-col justify-between rounded border border-gray-200 bg-white p-3">
            <div>
              <div className="text-xs font-semibold text-gray-800">{r.nombre}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{r.descripcion}.</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{r.grupo}</span>
              <button
                type="button"
                className={BTN_GHOST}
                onClick={() => simular(`Reporte «${r.nombre}» generado en PDF; los totales cuadran con los documentos de origen (simulado).`)}
              >
                Generar
              </button>
            </div>
          </div>
        ))}
      </div>
      <Mensaje mensaje={mensaje} />
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card title="Gasto por proveedor (2026)" pad={false}>
          <DataTable>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Proveedor</Th>
                <Th align="right">Gasto</Th>
                <Th>Peso</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {gasto.map(g => (
                <tr key={g.id} className="hoverable">
                  <Td>{g.nombre}</Td>
                  <Td align="right"><span className="font-mono">{fmtMoney(g.total)}</span></Td>
                  <Td>
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-petroleum-500" style={{ width: `${Math.round((g.total / maxGasto) * 100)}%` }} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Card>
        <Card title="Cumplimiento de entrega por proveedor" pad={false}>
          <DataTable>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Proveedor</Th>
                <Th align="right">Cumplimiento</Th>
                <Th>Tendencia</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PROVEEDORES.filter(p => p.estado === 'Activo')
                .sort((a, b) => b.evaluacion.entrega - a.evaluacion.entrega)
                .map(p => (
                  <tr key={p.id} className="hoverable">
                    <Td>{p.nombre}</Td>
                    <Td align="right"><span className="font-mono">{fmtPct(p.evaluacion.entrega, 0)}</span></Td>
                    <Td>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                        <div className={`h-full rounded-full ${p.evaluacion.entrega >= 0.9 ? 'bg-green-500' : p.evaluacion.entrega >= 0.8 ? 'bg-petroleum-500' : 'bg-amber-500'}`} style={{ width: `${Math.round(p.evaluacion.entrega * 100)}%` }} />
                      </div>
                    </Td>
                  </tr>
                ))}
            </tbody>
          </DataTable>
        </Card>
        <Card title="Diferencias de conciliación" pad={false}>
          <DataTable>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Factura</Th>
                <Th align="right">Diferencia</Th>
                <Th align="center">Estado</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {diferencias.map(f => {
                const dif = Math.abs(f.importeFactura - Math.min(f.importeOrden, f.importeRecibido || f.importeOrden));
                return (
                  <tr key={f.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{f.numero}</span></Td>
                    <Td align="right"><span className="font-mono">{fmtMoney(dif)}</span></Td>
                    <Td align="center"><StatusBadge label={f.estado} tone={toneEstado(f.estado)} /></Td>
                  </tr>
                );
              })}
              {diferencias.length === 0 && <EmptyRow colSpan={3} text="Sin diferencias de conciliación." />}
            </tbody>
          </DataTable>
        </Card>
      </div>
    </FunctionBlock>
  );
}

/* ================================== Página ================================== */

export default function ABT() {
  const [tab, setTab] = useState('resumen');
  const [mensaje, simular] = useSimulacion();

  const abiertas = ORDENES_COMPRA.filter(o => !['Cerrada', 'Cancelada', 'Facturada'].includes(o.estado));
  const comprometido = abiertas.reduce((s, o) => s + importeOrden(o), 0);
  const retrasadas = ORDENES_COMPRA.filter(
    o => o.fechaEntrega < HOY && !['Cerrada', 'Cancelada', 'Recibida', 'Facturada'].includes(o.estado)
  );
  const activos = PROVEEDORES.filter(p => p.estado === 'Activo');
  const cumplimiento = activos.length > 0 ? activos.reduce((s, p) => s + p.evaluacion.entrega, 0) / activos.length : 0;
  const enAprobacion = ORDENES_COMPRA.filter(o => o.estado === 'En aprobación').length;
  const cotizacionesAbiertas = SOLICITUDES_COTIZACION.filter(s => s.estado === 'Enviada' || s.estado === 'Con ofertas').length;

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'catalogo', label: 'Catálogo y proveedores' },
    { id: 'cotizaciones', label: 'Cotizaciones', badge: cotizacionesAbiertas },
    { id: 'ordenes', label: 'Órdenes', badge: enAprobacion },
    { id: 'recepcion', label: 'Recepción y facturación', badge: retrasadas.length },
    { id: 'acuerdos', label: 'Acuerdos y configuración' },
    { id: 'reportes', label: 'Reportes' },
  ];

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('abt')} funcionalidades · Fase ${MOD.fase}`}
        actions={
          <button
            type="button"
            className={BTN_SECONDARY}
            onClick={() => simular('Resumen del módulo ABT exportado a CSV (simulado).')}
          >
            ↓ Exportar resumen
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Órdenes abiertas" value={fmtNum(abiertas.length)} sub={`${ORDENES_COMPRA.length} órdenes en total`} tone="info" />
        <StatCard label="Comprometido (COP)" value={fmtMoney(comprometido)} sub="en órdenes abiertas" />
        <StatCard label="Órdenes retrasadas" value={fmtNum(retrasadas.length)} sub={`${RECORDATORIOS.filter(r => r.vencida).length} alertas activas`} tone={retrasadas.length > 0 ? 'warn' : 'default'} />
        <StatCard label="Cumplimiento de entrega" value={fmtPct(cumplimiento, 0)} sub="promedio de proveedores activos" tone={cumplimiento >= 0.9 ? 'ok' : 'warn'} />
      </div>

      <Mensaje mensaje={mensaje} />

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'resumen' && <ResumenTab />}
      {tab === 'catalogo' && (
        <div className="space-y-4">
          <BloqueCatalogoProductos />
          <BloqueCondiciones />
          <BloqueProveedores />
        </div>
      )}
      {tab === 'cotizaciones' && (
        <div className="space-y-4">
          <BloqueSolicitudCotizacion />
          <BloqueNecesidades />
          <BloqueComunicaciones />
          <BloqueComparacionOfertas />
          <BloqueConsolidacion />
        </div>
      )}
      {tab === 'ordenes' && <OrdenesTab />}
      {tab === 'recepcion' && <RecepcionTab />}
      {tab === 'acuerdos' && <AcuerdosTab />}
      {tab === 'reportes' && <ReportesTab />}
    </div>
  );
}

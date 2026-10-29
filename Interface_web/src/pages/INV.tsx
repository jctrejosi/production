import { useState } from 'react';
import {
  PageHeader, StatCard, StatusBadge, Tabs, Toolbar, Card, FunctionBlock, Modal, DataTable, Th, Td, EmptyRow,
  INPUT, BTN_PRIMARY, BTN_SECONDARY, BTN_DANGER, BTN_GHOST,
  type BadgeTone,
} from '../components/ui';
import { MODULOS, conteoModulo } from '../data/modules';
import { fmtNum, fmtMoney, fmtPct, fmtFecha } from '../lib/format';
import {
  ALMACENES, UBICACIONES, TIPOS_UBICACION, TIPOS_OPERACION, RUTAS, REGLAS_ABASTECIMIENTO,
  REGLAS_UBICACION, CATEGORIAS_ALMACENAMIENTO, TIPOS_PAQUETE, ESTRATEGIAS_RETIRO, NOMENCLATURAS,
  PRODUCTOS, PROVEEDORES, RECEPCIONES, ENTREGAS, TRANSFERENCIAS, TRANSFERENCIAS_AGRUPADAS,
  RESERVAS, PENDIENTES, DEVOLUCIONES, DIVISIONES, PAQUETES, MOVIMIENTOS, ETIQUETAS,
  EXISTENCIAS, INVENTARIOS_FISICOS, INVENTARIOS_CICLICOS, REUBICACIONES, DESECHOS, VALORACION,
  COSTOS_IMPORTACION, ENTREGAS_DIRECTAS, CONSIGNACIONES, LOTES_SERIES, REFERENCIAS_DOCUMENTALES,
  PUNTOS_PEDIDO, SUGERENCIAS, PREVISION, REABASTECIMIENTO_INTERNO, BAJO_PEDIDO, ROTACION,
} from '../data/inv';
import type {
  Almacen, Ubicacion, TipoOperacion, ReglaAbastecimiento, ReglaUbicacion, CategoriaAlmacenamiento,
  TipoPaquete, EstrategiaRetiro, Recepcion, Entrega, Transferencia, TransferenciaAgrupada, Reserva,
  Pendiente, Devolucion, Division, Paquete, Movimiento, InventarioFisico, InventarioCiclico, Reubicacion,
  Desecho, Valoracion, CostoImportacion, EntregaDirecta, Consignacion, LoteSerie, ReferenciaDocumental,
  PuntoPedido, Sugerencia, Prevision, ReabastecimientoInterno, BajoPedido,
} from '../data/inv';

/* ------------------------------- utilidades ------------------------------- */

interface Aviso { texto: string; tone?: 'ok' | 'warn' | 'error'; }

function Msg({ aviso }: { aviso: Aviso }) {
  const cls =
    aviso.tone === 'warn' ? 'border-amber-200 bg-amber-50 text-amber-800'
    : aviso.tone === 'error' ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-green-200 bg-green-50 text-green-800';
  return <div role={aviso.tone ? 'alert' : 'status'} className={`rounded border px-3 py-2 text-xs ${cls}`}>{aviso.texto}</div>;
}

interface TabProps {
  avisar: (clave: string, texto: string, tone?: Aviso['tone']) => void;
  feedback: Record<string, Aviso>;
}

function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function isoDentroDe(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Días entre hoy y una fecha ISO; null si no aplica. */
function diasHasta(iso: string): number | null {
  if (!iso || iso === '—') return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.round(ms / 86400000);
}

/* ------------------------------ modal genérico ----------------------------- */

interface CampoForm {
  id: string;
  label: string;
  tipo?: 'text' | 'number' | 'select';
  opciones?: string[];
  placeholder?: string;
  anchoCompleto?: boolean;
  obligatorio?: boolean;
}

function ModalFormulario({
  titulo, campos, inicial, onGuardar, onClose, wide,
}: {
  titulo: string;
  campos: CampoForm[];
  inicial?: Record<string, string>;
  onGuardar: (valores: Record<string, string>) => void;
  onClose: () => void;
  wide?: boolean;
}) {
  const [valores, setValores] = useState<Record<string, string>>(inicial ?? {});
  const [error, setError] = useState('');
  const guardar = () => {
    const falta = campos.find(c => c.obligatorio && !(valores[c.id] ?? '').trim());
    if (falta) {
      setError(`Completa «${falta.label}» antes de guardar.`);
      return;
    }
    onGuardar(valores);
  };
  return (
    <Modal title={titulo} onClose={onClose} wide={wide}>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          {campos.map(c => (
            <label key={c.id} className={`block ${c.anchoCompleto ? 'col-span-2' : 'col-span-1'}`}>
              <span className="mb-1 block text-xs font-medium text-gray-600">{c.label}</span>
              {c.tipo === 'select' ? (
                <select
                  className={INPUT}
                  value={valores[c.id] ?? ''}
                  onChange={e => setValores({ ...valores, [c.id]: e.target.value })}
                >
                  <option value="">Seleccionar…</option>
                  {c.opciones?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={c.tipo ?? 'text'}
                  className={INPUT}
                  placeholder={c.placeholder}
                  value={valores[c.id] ?? ''}
                  onChange={e => setValores({ ...valores, [c.id]: e.target.value })}
                />
              )}
            </label>
          ))}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <button type="button" className={BTN_SECONDARY} onClick={onClose}>Cancelar</button>
          <button type="button" className={BTN_PRIMARY} onClick={guardar}>Guardar</button>
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------- tones estado ------------------------------ */

const TONO_RECEPCION: Record<Recepcion['estado'], BadgeTone> = { Pendiente: 'gray', Parcial: 'amber', Recibida: 'green', 'Control de calidad': 'blue' };
const TONO_ENTREGA: Record<Entrega['estado'], BadgeTone> = { Reservada: 'blue', Preparada: 'petroleum', Empacada: 'amber', Entregada: 'green', Parcial: 'red' };
const TONO_TRANSFERENCIA: Record<Transferencia['estado'], BadgeTone> = { Borrador: 'gray', Preparada: 'blue', 'En tránsito': 'amber', Hecha: 'green' };
const TONO_GRUPO: Record<TransferenciaAgrupada['estado'], BadgeTone> = { 'En preparación': 'amber', Lista: 'blue', Ejecutada: 'green' };
const TONO_PENDIENTE: Record<Pendiente['estado'], BadgeTone> = { Abierto: 'amber', Cerrado: 'gray' };
const TONO_DEVOLUCION: Record<Devolucion['estado'], BadgeTone> = { Recibida: 'blue', 'En tránsito': 'amber', Aplicada: 'green' };
const TONO_DIVISION: Record<Division['estado'], BadgeTone> = { Borrador: 'gray', Preparada: 'blue' };
const TONO_PAQUETE: Record<Paquete['estado'], BadgeTone> = { Abierto: 'blue', Cerrado: 'green', 'En tránsito': 'amber' };
const TONO_MOVIMIENTO: Record<Movimiento['tipo'], BadgeTone> = { Entrada: 'green', Salida: 'red', Interno: 'blue' };
const TONO_INVFISICO: Record<InventarioFisico['estado'], BadgeTone> = { Abierto: 'blue', Ajustado: 'green', Cerrado: 'gray' };
const TONO_CICLICO: Record<InventarioCiclico['estado'], BadgeTone> = { 'Al día': 'green', 'Por contar': 'blue', Atrasado: 'red' };
const TONO_DESECHO: Record<Desecho['estado'], BadgeTone> = { Registrado: 'gray', Aprobado: 'amber', Repuesto: 'green' };
const TONO_METODO: Record<Valoracion['metodo'], BadgeTone> = { Estándar: 'blue', Promedio: 'petroleum', FIFO: 'amber' };
const TONO_IMPORTACION: Record<CostoImportacion['estado'], BadgeTone> = { Pendiente: 'amber', Repartido: 'green' };
const TONO_EDI: Record<EntregaDirecta['estado'], BadgeTone> = { Programada: 'gray', Confirmada: 'blue', Facturada: 'green' };
const TONO_CONSIGNACION: Record<Consignacion['estado'], BadgeTone> = { 'En consignación': 'blue', Vendida: 'green', Devuelta: 'amber' };
const TONO_LOTE: Record<LoteSerie['estado'], BadgeTone> = { Disponible: 'green', Reservado: 'blue', Cuarentena: 'amber', Vencido: 'red' };
const TONO_SUGERENCIA: Record<Sugerencia['estado'], BadgeTone> = { Sugerida: 'amber', Aplicada: 'green' };
const TONO_PREVISION: Record<Prevision['estado'], BadgeTone> = { OK: 'green', Faltante: 'red', Exceso: 'amber' };
const TONO_REAB_INTERNO: Record<ReabastecimientoInterno['estado'], BadgeTone> = { Programado: 'blue', 'En tránsito': 'amber', Completado: 'green' };
const TONO_BAJO_PEDIDO: Record<BajoPedido['estado'], BadgeTone> = { 'Por disparar': 'gray', Disparada: 'blue', Recibida: 'green' };
const TONO_ACCION: Record<Sugerencia['accion'], BadgeTone> = { Comprar: 'blue', Fabricar: 'petroleum', Transferir: 'amber' };
const TONO_UBICACION: Record<Ubicacion['tipo'], BadgeTone> = {
  Interna: 'green', Virtual: 'gray', Proveedor: 'petroleum', Cliente: 'blue',
  Pérdidas: 'red', Producción: 'amber', Tránsito: 'blue',
};

/* ------------------------------ pestaña resumen ---------------------------- */

function TabResumen() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Objetivo">
        <p className="text-xs leading-relaxed text-gray-600">
          Controlar la ubicación, disponibilidad, movimiento, trazabilidad y valor de materiales y
          productos en todo el proceso, desde la recepción hasta la entrega.
        </p>
      </Card>
      <Card title="Alcance">
        <div className="flex flex-wrap gap-1.5">
          {[
            'Almacenes', 'Ubicaciones', 'Tipos de operación', 'Rutas', 'Reglas de abastecimiento',
            'Recepciones', 'Entregas', 'Transferencias', 'Inventario físico y cíclico', 'Lotes y series',
            'Valoración', 'Costos de importación', 'Entrega directa', 'Consignación',
          ].map(t => (
            <span key={t} className="rounded-full bg-petroleum-50 px-2 py-0.5 text-xs text-petroleum-700">{t}</span>
          ))}
        </div>
      </Card>
      <Card title="Actores">
        <ul className="space-y-1.5 text-xs text-gray-600">
          {[
            ['Almacenista', 'ejecuta recepciones, entregas y transferencias.'],
            ['Supervisor de almacén', 'aprueba ajustes, conteos y desechos.'],
            ['Planificador', 'configura reglas y revisa el reabastecimiento.'],
            ['Comprador', 'convierte sugerencias en órdenes de compra.'],
            ['Calidad', 'inspecciona y libera o rechaza lotes.'],
            ['Producción', 'consume componentes y entrega terminados.'],
            ['Finanzas', 'valida valoración y asientos contables.'],
          ].map(([rol, detalle]) => (
            <li key={rol} className="flex items-baseline gap-2">
              <span className="w-36 shrink-0 font-medium text-gray-700">{rol}</span>
              <span className="text-gray-500">{detalle}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Reglas de negocio">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          <li>Ninguna salida puede dejar stock negativo sin autorización.</li>
          <li>Toda recepción debe tener ubicación de destino válida.</li>
          <li>Los productos trazados deben registrar lote o serie en cada movimiento.</li>
          <li>Las existencias reservadas no pueden asignarse a otra operación.</li>
          <li>Los ajustes de inventario deben tener motivo y responsable.</li>
          <li>La valoración no puede cambiarse sin impacto contable controlado.</li>
          <li>Los vencimientos deben bloquear o priorizar la salida según la política.</li>
        </ul>
      </Card>
      <Card title="Integraciones">
        <ul className="space-y-1.5 text-xs text-gray-600">
          {[
            ['Compras', 'recepciones y devoluciones'],
            ['Producción', 'consumo de componentes y entrada de terminados'],
            ['Calidad', 'inspección de recepción, cuarentena y liberación'],
            ['Ventas', 'reservas, entregas y devoluciones'],
            ['Finanzas', 'valoración, costos y asientos'],
            ['Captura', 'códigos de barras y dispositivos'],
          ].map(([modulo, detalle]) => (
            <li key={modulo} className="flex items-baseline gap-2">
              <span className="w-24 shrink-0 font-medium text-gray-700">{modulo}</span>
              <span className="text-gray-500">{detalle}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Criterios de aceptación">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          <li>Toda entrada y salida genera un movimiento trazable.</li>
          <li>El stock disponible coincide con la existencia física menos la reservada.</li>
          <li>Los lotes y series se pueden rastrear hacia atrás y hacia adelante.</li>
          <li>Los conteos cíclicos generan ajustes auditables.</li>
          <li>La valoración cuadra con contabilidad.</li>
          <li>Las reglas de ubicación y reabastecimiento se ejecutan sin intervención manual.</li>
        </ul>
      </Card>
    </div>
  );
}

/* --------------------------- pestaña configuración ------------------------- */

const RESPONSABLES = ['Diego Salazar', 'Laura Cano', 'Mateo Ríos', 'Camila Vargas'];

function TabConfiguracion({ avisar, feedback }: TabProps) {
  const [almacenes, setAlmacenes] = useState<Almacen[]>(ALMACENES);
  const [qAlm, setQAlm] = useState('');
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>(UBICACIONES);
  const [fTipoUbi, setFTipoUbi] = useState('');
  const [qUbi, setQUbi] = useState('');
  const [tiposOp, setTiposOp] = useState<TipoOperacion[]>(TIPOS_OPERACION);
  const [reglasAbast, setReglasAbast] = useState<ReglaAbastecimiento[]>(REGLAS_ABASTECIMIENTO);
  const [reglasUbi, setReglasUbi] = useState<ReglaUbicacion[]>(REGLAS_UBICACION);
  const [categorias, setCategorias] = useState<CategoriaAlmacenamiento[]>(CATEGORIAS_ALMACENAMIENTO);
  const [tiposPaq, setTiposPaq] = useState<TipoPaquete[]>(TIPOS_PAQUETE);
  const [estrategias, setEstrategias] = useState<EstrategiaRetiro[]>(ESTRATEGIAS_RETIRO);
  const [asignaciones, setAsignaciones] = useState<{ producto: string; ruta: string }[]>([
    { producto: 'MP-001', ruta: 'R-COM' },
    { producto: 'MP-002', ruta: 'R-COM' },
    { producto: 'PT-101', ruta: 'R-FAB' },
    { producto: 'PT-103', ruta: 'R-RES' },
  ]);
  const [modal, setModal] = useState<string | null>(null);
  const [prodRuta, setProdRuta] = useState('');
  const [rutaAsig, setRutaAsig] = useState('');
  const [ubiAsig, setUbiAsig] = useState('');
  const [estrAsig, setEstrAsig] = useState('');
  const [qCalc, setQCalc] = useState('1');
  const [tipoPaqSel, setTipoPaqSel] = useState('CJ');
  const [codigoCaptura, setCodigoCaptura] = useState('');

  const almVisibles = almacenes.filter(a => !qAlm || `${a.codigo} ${a.nombre}`.toLowerCase().includes(qAlm.toLowerCase()));
  const ubiVisibles = ubicaciones.filter(u =>
    (!fTipoUbi || u.tipo === fTipoUbi) &&
    (!qUbi || `${u.codigo} ${u.nombre} ${u.almacen}`.toLowerCase().includes(qUbi.toLowerCase()))
  );

  function interpretar(codigo: string): string {
    if (/^L\d{6}[A-Z]?$/.test(codigo)) return `Lote detectado (${codigo}) según nomenclatura de lote.`;
    if (/^SN-\d{4}$/.test(codigo)) return `Serie detectada (${codigo}).`;
    if (/^PK\d{6}$/.test(codigo)) return `Paquete detectado (${codigo}) según código interno.`;
    if (/^[A-Z]{3}-\d{2}$/.test(codigo)) return `Ubicación detectada (${codigo}).`;
    if (/^(24|25|26)\d{12}$/.test(codigo)) return `Código de peso EAN-13 detectado: ${codigo.slice(3, 7)} g.`;
    return `Sin coincidencia para «${codigo}»: revisa patrones y prioridades.`;
  }

  return (
    <div className="space-y-4">
      {/* INV-01 Almacén */}
      <FunctionBlock code="INV-01">
        <Toolbar>
          <input className={INPUT} placeholder="Buscar por código o nombre..." value={qAlm} onChange={e => setQAlm(e.target.value)} />
          <button className={BTN_PRIMARY} onClick={() => setModal('almacen')}>+ Nuevo almacén</button>
        </Toolbar>
        {feedback['INV-01'] && <div className="mt-3"><Msg aviso={feedback['INV-01']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${almVisibles.length} de ${almacenes.length} almacenes`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Código</Th><Th>Nombre</Th><Th>Dirección</Th><Th>Calendario</Th>
                <Th>Pasos de recepción</Th><Th>Pasos de entrega</Th><Th>Ruta por defecto</Th><Th align="center">Estado</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {almVisibles.map(a => (
                <tr key={a.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{a.codigo}</span></Td>
                  <Td className="font-medium text-gray-800">{a.nombre}</Td>
                  <Td>{a.direccion}</Td>
                  <Td>{a.calendario}</Td>
                  <Td>{a.pasosRecepcion}</Td>
                  <Td>{a.pasosEntrega}</Td>
                  <Td><span className="font-mono">{a.rutaDefecto}</span></Td>
                  <Td align="center"><StatusBadge label={a.estado} tone={a.estado === 'Activo' ? 'green' : 'gray'} /></Td>
                </tr>
              ))}
              {almVisibles.length === 0 && <EmptyRow colSpan={8} text="No hay almacenes que coincidan con la búsqueda." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-02 Ubicaciones */}
      <FunctionBlock code="INV-02">
        <Toolbar>
          <input className={INPUT} placeholder="Buscar ubicación..." value={qUbi} onChange={e => setQUbi(e.target.value)} />
          <select className={INPUT} value={fTipoUbi} onChange={e => setFTipoUbi(e.target.value)}>
            <option value="">Todos los tipos</option>
            {TIPOS_UBICACION.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button className={BTN_PRIMARY} onClick={() => setModal('ubicacion')}>+ Nueva ubicación</button>
        </Toolbar>
        {feedback['INV-02'] && <div className="mt-3"><Msg aviso={feedback['INV-02']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${ubiVisibles.length} de ${ubicaciones.length} ubicaciones`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Código</Th><Th>Nombre</Th><Th align="center">Tipo</Th><Th>Almacén</Th>
                <Th align="right">Capacidad</Th><Th>Estrategia de retiro</Th><Th>Frecuencia inventario</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ubiVisibles.map(u => (
                <tr key={u.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{u.codigo}</span></Td>
                  <Td className="font-medium text-gray-800">{u.nombre}</Td>
                  <Td align="center"><StatusBadge label={u.tipo} tone={TONO_UBICACION[u.tipo]} /></Td>
                  <Td><span className="font-mono">{u.almacen}</span></Td>
                  <Td align="right"><span className="font-mono">{u.capacidad ? fmtNum(u.capacidad) : '—'}</span></Td>
                  <Td>{u.estrategia}</Td>
                  <Td>{u.frecuenciaInventario}</Td>
                </tr>
              ))}
              {ubiVisibles.length === 0 && <EmptyRow colSpan={7} text="No hay ubicaciones que coincidan con los filtros." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-03 Tipos de operación */}
      <FunctionBlock code="INV-03">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('tipoOp')}>+ Nuevo tipo de operación</button>
        </Toolbar>
        {feedback['INV-03'] && <div className="mt-3"><Msg aviso={feedback['INV-03']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${tiposOp.length} tipos de operación configurados`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Código</Th><Th>Nombre</Th><Th>Prefijo</Th><Th>Ubicación por defecto</Th>
                <Th>Política de reserva</Th><Th>Etiqueta</Th><Th align="center">Impresión</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tiposOp.map(t => (
                <tr key={t.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{t.codigo}</span></Td>
                  <Td className="font-medium text-gray-800">{t.nombre}</Td>
                  <Td><span className="font-mono">{t.prefijo}</span></Td>
                  <Td><span className="font-mono">{t.ubicacionDefecto}</span></Td>
                  <Td>{t.politicaReserva}</Td>
                  <Td>{t.etiqueta}</Td>
                  <Td align="center"><StatusBadge label={t.impresion} tone={t.impresion === 'Automática' ? 'green' : 'gray'} /></Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-04 Rutas de abastecimiento */}
      <FunctionBlock code="INV-04">
        <Toolbar>
          <select className={INPUT} value={prodRuta} onChange={e => setProdRuta(e.target.value)}>
            <option value="">Producto o categoría…</option>
            {PRODUCTOS.map(p => <option key={p.codigo} value={p.codigo}>{p.codigo} — {p.nombre}</option>)}
          </select>
          <select className={INPUT} value={rutaAsig} onChange={e => setRutaAsig(e.target.value)}>
            <option value="">Ruta…</option>
            {RUTAS.map(r => <option key={r.codigo} value={r.codigo}>{r.codigo} — {r.nombre}</option>)}
          </select>
          <button
            className={BTN_PRIMARY}
            disabled={!prodRuta || !rutaAsig}
            onClick={() => {
              setAsignaciones(a => [...a.filter(x => x.producto !== prodRuta), { producto: prodRuta, ruta: rutaAsig }]);
              avisar('INV-04', `Ruta ${rutaAsig} asignada a ${prodRuta}.`);
            }}
          >
            Asignar ruta
          </button>
        </Toolbar>
        {feedback['INV-04'] && <div className="mt-3"><Msg aviso={feedback['INV-04']} /></div>}
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <DataTable footer={`${RUTAS.length} rutas disponibles`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr><Th>Código</Th><Th>Nombre</Th><Th align="center">Tipo</Th><Th>Aplica a</Th><Th>Pasos</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RUTAS.map(r => (
                <tr key={r.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{r.codigo}</span></Td>
                  <Td className="font-medium text-gray-800">{r.nombre}</Td>
                  <Td align="center"><StatusBadge label={r.tipo} tone="petroleum" /></Td>
                  <Td>{r.aplicaA}</Td>
                  <Td>{r.pasos}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          <DataTable footer={`${asignaciones.length} asignaciones activas`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr><Th>Producto</Th><Th>Nombre</Th><Th>Ruta asignada</Th><Th align="center">Acción</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {asignaciones.map(x => {
                const p = PRODUCTOS.find(pr => pr.codigo === x.producto);
                return (
                  <tr key={x.producto} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{x.producto}</span></Td>
                    <Td>{p?.nombre ?? '—'}</Td>
                    <Td><span className="font-mono">{x.ruta}</span></Td>
                    <Td align="center">
                      <button className={BTN_GHOST} onClick={() => { setAsignaciones(a => a.filter(y => y.producto !== x.producto)); avisar('INV-04', `Asignación de ${x.producto} eliminada.`); }}>
                        Quitar
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-05 Reglas de abastecimiento */}
      <FunctionBlock code="INV-05">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('reglaAbast')}>+ Nueva regla</button>
        </Toolbar>
        {feedback['INV-05'] && <div className="mt-3"><Msg aviso={feedback['INV-05']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${reglasAbast.length} reglas de abastecimiento`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th align="center">Tipo</Th><Th>Método de suministro</Th><Th align="right">Plazo</Th>
                <Th>Origen</Th><Th>Destino</Th><Th>Tipo de operación</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reglasAbast.map(r => (
                <tr key={r.id} className="hoverable">
                  <Td align="center"><StatusBadge label={r.tipo} tone={r.tipo === 'Extracción' ? 'green' : r.tipo === 'Empuje' ? 'blue' : 'amber'} /></Td>
                  <Td>{r.metodo}</Td>
                  <Td align="right"><span className="font-mono">{r.plazoDias} d</span></Td>
                  <Td><span className="font-mono">{r.origen}</span></Td>
                  <Td><span className="font-mono">{r.destino}</span></Td>
                  <Td><span className="font-mono">{r.tipoOperacion}</span></Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-06 Reglas de ubicación */}
      <FunctionBlock code="INV-06">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('reglaUbi')}>+ Nueva regla de ubicación</button>
        </Toolbar>
        {feedback['INV-06'] && <div className="mt-3"><Msg aviso={feedback['INV-06']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${reglasUbi.length} reglas de ubicación`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr><Th align="center">Criterio</Th><Th>Valor</Th><Th>Empaque</Th><Th>Destino</Th><Th>Sububicación</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reglasUbi.map(r => (
                <tr key={r.id} className="hoverable">
                  <Td align="center"><StatusBadge label={r.criterio} tone={r.criterio === 'Producto' ? 'blue' : 'petroleum'} /></Td>
                  <Td><span className="font-mono">{r.valor}</span></Td>
                  <Td>{r.empaque}</Td>
                  <Td><span className="font-mono">{r.destino}</span></Td>
                  <Td>{r.sububicacion}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-07 Categorías de almacenamiento */}
      <FunctionBlock code="INV-07">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('categoria')}>+ Nueva categoría</button>
        </Toolbar>
        {feedback['INV-07'] && <div className="mt-3"><Msg aviso={feedback['INV-07']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${categorias.length} categorías de almacenamiento`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Código</Th><Th>Nombre</Th><Th align="right">Peso máx. (kg)</Th>
                <Th align="right">Volumen máx. (m³)</Th><Th align="center">Permite mezclar</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categorias.map(c => (
                <tr key={c.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{c.codigo}</span></Td>
                  <Td className="font-medium text-gray-800">{c.nombre}</Td>
                  <Td align="right"><span className="font-mono">{fmtNum(c.pesoMaxKg)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(c.volumenMaxM3)}</span></Td>
                  <Td align="center"><StatusBadge label={c.mezclar ? 'Sí' : 'No'} tone={c.mezclar ? 'green' : 'red'} /></Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-08 Tipos de paquete */}
      <FunctionBlock code="INV-08">
        <Toolbar>
          <input type="number" min={1} className={`${INPUT} w-24`} placeholder="Cant." value={qCalc} onChange={e => setQCalc(e.target.value)} />
          <select className={INPUT} value={tipoPaqSel} onChange={e => setTipoPaqSel(e.target.value)}>
            {TIPOS_PAQUETE.map(p => <option key={p.codigo} value={p.codigo}>{p.codigo} — {p.nombre}</option>)}
          </select>
          <button
            className={BTN_PRIMARY}
            onClick={() => {
              const pkg = tiposPaq.find(p => p.codigo === tipoPaqSel);
              const cant = Number(qCalc) || 0;
              if (!pkg || cant <= 0) { avisar('INV-08', 'Ingresa una cantidad válida.', 'warn'); return; }
              const peso = cant * pkg.pesoKg;
              const excede = peso > pkg.pesoMaxKg;
              avisar('INV-08', `Peso calculado para ${fmtNum(cant)} × ${pkg.codigo}: ${fmtNum(peso)} kg (máx. ${fmtNum(pkg.pesoMaxKg)} kg). ${excede ? 'Excede la capacidad del paquete.' : 'Dentro de capacidad.'}`, excede ? 'warn' : undefined);
            }}
          >
            Calcular peso y validar capacidad
          </button>
          <button className={BTN_SECONDARY} onClick={() => setModal('tipoPaquete')}>+ Nuevo tipo de paquete</button>
        </Toolbar>
        {feedback['INV-08'] && <div className="mt-3"><Msg aviso={feedback['INV-08']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${tiposPaq.length} tipos de paquete`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Código</Th><Th>Nombre</Th><Th>Dimensiones</Th><Th align="right">Peso (kg)</Th>
                <Th align="right">Peso máx. (kg)</Th><Th>Uso previsto</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tiposPaq.map(p => (
                <tr key={p.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{p.codigo}</span></Td>
                  <Td className="font-medium text-gray-800">{p.nombre}</Td>
                  <Td className="font-mono">{p.dimensiones}</Td>
                  <Td align="right"><span className="font-mono">{fmtNum(p.pesoKg)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(p.pesoMaxKg)}</span></Td>
                  <Td>{p.uso}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-09 Estrategias de retiro */}
      <FunctionBlock code="INV-09">
        <Toolbar>
          <select className={INPUT} value={ubiAsig} onChange={e => setUbiAsig(e.target.value)}>
            <option value="">Ubicación…</option>
            {ubicaciones.map(u => <option key={u.codigo} value={u.codigo}>{u.codigo}</option>)}
          </select>
          <select className={INPUT} value={estrAsig} onChange={e => setEstrAsig(e.target.value)}>
            <option value="">Estrategia…</option>
            {estrategias.map(s => <option key={s.nombre} value={s.nombre}>{s.nombre}</option>)}
          </select>
          <button
            className={BTN_PRIMARY}
            disabled={!ubiAsig || !estrAsig}
            onClick={() => {
              setUbicaciones(us => us.map(u => (u.codigo === ubiAsig ? { ...u, estrategia: estrAsig } : u)));
              avisar('INV-09', `Estrategia ${estrAsig} aplicada a la ubicación ${ubiAsig}.`);
            }}
          >
            Asignar a ubicación
          </button>
        </Toolbar>
        {feedback['INV-09'] && <div className="mt-3"><Msg aviso={feedback['INV-09']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${estrategias.length} estrategias · ${estrategias.filter(s => s.activa).length} activas`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr><Th>Estrategia</Th><Th>Descripción</Th><Th>Ámbitos</Th><Th align="center">Activa</Th><Th align="center">Acción</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {estrategias.map(s => (
                <tr key={s.id} className="hoverable">
                  <Td className="font-medium text-gray-800">{s.nombre}</Td>
                  <Td>{s.descripcion}</Td>
                  <Td className="font-mono">{s.ambitos}</Td>
                  <Td align="center"><StatusBadge label={s.activa ? 'Sí' : 'No'} tone={s.activa ? 'green' : 'gray'} /></Td>
                  <Td align="center">
                    <button
                      className={BTN_GHOST}
                      onClick={() => {
                        setEstrategias(es => es.map(x => (x.id === s.id ? { ...x, activa: !x.activa } : x)));
                        avisar('INV-09', `${s.nombre} ${s.activa ? 'desactivada' : 'activada'}.`);
                      }}
                    >
                      {s.activa ? 'Desactivar' : 'Activar'}
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-10 Nomenclaturas de captura */}
      <FunctionBlock code="INV-10">
        <Toolbar>
          <input className={INPUT} placeholder="Escanea o escribe un código (ej. L2503A)..." value={codigoCaptura} onChange={e => setCodigoCaptura(e.target.value)} />
          <button
            className={BTN_PRIMARY}
            disabled={!codigoCaptura.trim()}
            onClick={() => {
              const res = interpretar(codigoCaptura.trim());
              avisar('INV-10', res, res.startsWith('Sin coincidencia') ? 'warn' : undefined);
            }}
          >
            Interpretar código
          </button>
        </Toolbar>
        {feedback['INV-10'] && <div className="mt-3"><Msg aviso={feedback['INV-10']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${NOMENCLATURAS.length} reglas de interpretación`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr><Th>Tipo</Th><Th>Patrón</Th><Th align="center">Prioridad</Th><Th>Validación</Th><Th>Ejemplo</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {NOMENCLATURAS.map(n => (
                <tr key={n.id} className="hoverable">
                  <Td className="font-medium text-gray-800">{n.tipo}</Td>
                  <Td className="font-mono">{n.patron}</Td>
                  <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-gray-600">{n.prioridad}</span></Td>
                  <Td>{n.validacion}</Td>
                  <Td className="font-mono">{n.ejemplo}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* modales de configuración */}
      {modal === 'almacen' && (
        <ModalFormulario
          titulo="Nuevo almacén"
          onClose={() => setModal(null)}
          campos={[
            { id: 'codigo', label: 'Código', obligatorio: true, placeholder: 'ALM-XXX' },
            { id: 'nombre', label: 'Nombre', obligatorio: true },
            { id: 'direccion', label: 'Dirección', anchoCompleto: true },
            { id: 'calendario', label: 'Calendario', placeholder: 'L-V 8:00-18:00' },
            { id: 'rutaDefecto', label: 'Ruta por defecto', tipo: 'select', opciones: RUTAS.map(r => r.codigo) },
            { id: 'pasosRecepcion', label: 'Pasos de recepción', anchoCompleto: true },
            { id: 'pasosEntrega', label: 'Pasos de entrega', anchoCompleto: true },
          ]}
          onGuardar={v => {
            setAlmacenes(a => [...a, {
              id: `A${a.length + 10}`, codigo: v.codigo.trim(), nombre: v.nombre.trim(),
              direccion: v.direccion.trim() || '—', calendario: v.calendario.trim() || 'L-V 8:00-18:00',
              pasosRecepcion: v.pasosRecepcion.trim() || 'Recibir → Almacenar',
              pasosEntrega: v.pasosEntrega.trim() || 'Preparar → Despachar',
              rutaDefecto: v.rutaDefecto || 'R-COM', estado: 'Activo',
            }]);
            setModal(null);
            avisar('INV-01', `Almacén ${v.codigo.trim()} creado correctamente.`);
          }}
        />
      )}
      {modal === 'ubicacion' && (
        <ModalFormulario
          titulo="Nueva ubicación"
          onClose={() => setModal(null)}
          campos={[
            { id: 'codigo', label: 'Código', obligatorio: true, placeholder: 'EST-04' },
            { id: 'nombre', label: 'Nombre', obligatorio: true },
            { id: 'tipo', label: 'Tipo', tipo: 'select', opciones: [...TIPOS_UBICACION] },
            { id: 'almacen', label: 'Almacén', tipo: 'select', opciones: ALMACENES.map(a => a.codigo) },
            { id: 'capacidad', label: 'Capacidad', tipo: 'number' },
            { id: 'estrategia', label: 'Estrategia de retiro', tipo: 'select', opciones: ESTRATEGIAS_RETIRO.map(s => s.nombre) },
            { id: 'frecuenciaInventario', label: 'Frecuencia de inventario', tipo: 'select', opciones: ['Semanal', 'Mensual', 'Anual (respaldo)', '—'] },
          ]}
          onGuardar={v => {
            setUbicaciones(u => [...u, {
              id: `U${u.length + 10}`, codigo: v.codigo.trim(), nombre: v.nombre.trim(),
              tipo: (v.tipo || 'Interna') as Ubicacion['tipo'], almacen: v.almacen || 'ALM-CEN',
              capacidad: Number(v.capacidad) || 0, estrategia: v.estrategia || 'FIFO',
              frecuenciaInventario: v.frecuenciaInventario || '—',
            }]);
            setModal(null);
            avisar('INV-02', `Ubicación ${v.codigo.trim()} creada correctamente.`);
          }}
        />
      )}
      {modal === 'tipoOp' && (
        <ModalFormulario
          titulo="Nuevo tipo de operación"
          onClose={() => setModal(null)}
          campos={[
            { id: 'codigo', label: 'Código', obligatorio: true, placeholder: 'DEV' },
            { id: 'nombre', label: 'Nombre', obligatorio: true },
            { id: 'prefijo', label: 'Prefijo de numeración', obligatorio: true, placeholder: 'DEV-' },
            { id: 'ubicacionDefecto', label: 'Ubicación por defecto', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
            { id: 'politicaReserva', label: 'Política de reserva', tipo: 'select', opciones: ['Ninguna', 'Reservar al confirmar', 'Manual', 'Sin reserva'] },
            { id: 'etiqueta', label: 'Etiqueta', tipo: 'select', opciones: ETIQUETAS.map(e => e.tipo) },
            { id: 'impresion', label: 'Impresión', tipo: 'select', opciones: ['Automática', 'Manual'] },
          ]}
          onGuardar={v => {
            setTiposOp(t => [...t, {
              id: `T${t.length + 10}`, codigo: v.codigo.trim(), nombre: v.nombre.trim(), prefijo: v.prefijo.trim(),
              ubicacionDefecto: v.ubicacionDefecto || 'EST-01', politicaReserva: v.politicaReserva || 'Ninguna',
              etiqueta: v.etiqueta || 'Albarán', impresion: (v.impresion || 'Manual') as TipoOperacion['impresion'],
            }]);
            setModal(null);
            avisar('INV-03', `Tipo de operación ${v.codigo.trim()} creado correctamente.`);
          }}
        />
      )}
      {modal === 'reglaAbast' && (
        <ModalFormulario
          titulo="Nueva regla de abastecimiento"
          onClose={() => setModal(null)}
          campos={[
            { id: 'tipo', label: 'Tipo de regla', tipo: 'select', opciones: ['Extracción', 'Empuje', 'Combinación'] },
            { id: 'metodo', label: 'Método de suministro', tipo: 'select', opciones: ['Tomar de stock', 'Generar otra operación', 'Tomar de stock y generar si no hay disponibilidad'] },
            { id: 'plazoDias', label: 'Plazo (días)', tipo: 'number' },
            { id: 'tipoOperacion', label: 'Tipo de operación', tipo: 'select', opciones: ['REC', 'ENT', 'TRA', 'PRD', 'EDI', 'AJU'] },
            { id: 'origen', label: 'Origen', tipo: 'select', opciones: [...ALMACENES.map(a => a.codigo), ...UBICACIONES.map(u => u.codigo)] },
            { id: 'destino', label: 'Destino', tipo: 'select', opciones: [...ALMACENES.map(a => a.codigo), ...UBICACIONES.map(u => u.codigo)] },
          ]}
          onGuardar={v => {
            setReglasAbast(r => [...r, {
              id: `RA${r.length + 10}`,
              tipo: (v.tipo || 'Extracción') as ReglaAbastecimiento['tipo'],
              metodo: v.metodo || 'Tomar de stock', plazoDias: Number(v.plazoDias) || 0,
              origen: v.origen || 'ALM-CEN', destino: v.destino || 'EST-01', tipoOperacion: v.tipoOperacion || 'TRA',
            }]);
            setModal(null);
            avisar('INV-05', 'Regla de abastecimiento creada correctamente.');
          }}
        />
      )}
      {modal === 'reglaUbi' && (
        <ModalFormulario
          titulo="Nueva regla de ubicación"
          onClose={() => setModal(null)}
          campos={[
            { id: 'criterio', label: 'Criterio', tipo: 'select', opciones: ['Producto', 'Categoría'] },
            { id: 'valor', label: 'Producto o categoría', tipo: 'select', opciones: [...PRODUCTOS.map(p => p.codigo), ...new Set(PRODUCTOS.map(p => p.categoria))] },
            { id: 'empaque', label: 'Tipo de empaque', tipo: 'select', opciones: TIPOS_PAQUETE.map(p => p.codigo) },
            { id: 'destino', label: 'Ubicación destino', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
            { id: 'sububicacion', label: 'Sububicación', tipo: 'select', opciones: ['Por lote', 'Por caducidad', 'Por fecha', 'Por SKU'] },
          ]}
          onGuardar={v => {
            setReglasUbi(r => [...r, {
              id: `RU${r.length + 10}`, criterio: v.criterio || 'Producto', valor: v.valor || 'MP-001',
              empaque: v.empaque || 'CJ', destino: v.destino || 'EST-01', sububicacion: v.sububicacion || 'Por lote',
            }]);
            setModal(null);
            avisar('INV-06', 'Regla de ubicación creada correctamente.');
          }}
        />
      )}
      {modal === 'categoria' && (
        <ModalFormulario
          titulo="Nueva categoría de almacenamiento"
          onClose={() => setModal(null)}
          campos={[
            { id: 'codigo', label: 'Código', obligatorio: true, placeholder: 'CAT-06' },
            { id: 'nombre', label: 'Nombre', obligatorio: true },
            { id: 'pesoMaxKg', label: 'Peso máximo (kg)', tipo: 'number' },
            { id: 'volumenMaxM3', label: 'Volumen máximo (m³)', tipo: 'number' },
            { id: 'mezclar', label: 'Permite mezclar productos', tipo: 'select', opciones: ['Sí', 'No'] },
          ]}
          onGuardar={v => {
            setCategorias(c => [...c, {
              id: `C${c.length + 10}`, codigo: v.codigo.trim(), nombre: v.nombre.trim(),
              pesoMaxKg: Number(v.pesoMaxKg) || 0, volumenMaxM3: Number(v.volumenMaxM3) || 0,
              mezclar: v.mezclar === 'Sí',
            }]);
            setModal(null);
            avisar('INV-07', `Categoría ${v.codigo.trim()} creada correctamente.`);
          }}
        />
      )}
      {modal === 'tipoPaquete' && (
        <ModalFormulario
          titulo="Nuevo tipo de paquete"
          onClose={() => setModal(null)}
          campos={[
            { id: 'codigo', label: 'Código', obligatorio: true, placeholder: 'TB' },
            { id: 'nombre', label: 'Nombre', obligatorio: true },
            { id: 'dimensiones', label: 'Dimensiones', placeholder: '50×40×30 cm' },
            { id: 'pesoKg', label: 'Peso (kg)', tipo: 'number' },
            { id: 'pesoMaxKg', label: 'Peso máximo (kg)', tipo: 'number' },
            { id: 'uso', label: 'Uso previsto', tipo: 'select', opciones: ['Unidad de picking', 'Granel', 'Almacenamiento', 'Tránsito y exportación', 'Empaque final'] },
          ]}
          onGuardar={v => {
            setTiposPaq(p => [...p, {
              id: `P${p.length + 10}`, codigo: v.codigo.trim(), nombre: v.nombre.trim(),
              dimensiones: v.dimensiones.trim() || '—', pesoKg: Number(v.pesoKg) || 0,
              pesoMaxKg: Number(v.pesoMaxKg) || 0, uso: v.uso || 'Unidad de picking',
            }]);
            setModal(null);
            avisar('INV-08', `Tipo de paquete ${v.codigo.trim()} creado correctamente.`);
          }}
        />
      )}
    </div>
  );
}

/* ----------------------------- pestaña operación --------------------------- */

function ModalAgrupar({
  transferencias, onClose, onAgrupar,
}: {
  transferencias: Transferencia[];
  onClose: () => void;
  onAgrupar: (numeros: string[], responsable: string) => void;
}) {
  const [sel, setSel] = useState<string[]>([]);
  const [resp, setResp] = useState('');
  return (
    <Modal title="Agrupar transferencias" onClose={onClose}>
      <div className="space-y-4 p-5">
        <p className="text-xs text-gray-500">Selecciona las transferencias en Borrador o Preparada para prepararlas y ejecutarlas en conjunto.</p>
        <div className="space-y-2">
          {transferencias.length === 0 && <p className="text-xs text-gray-400">No hay transferencias pendientes de agrupar.</p>}
          {transferencias.map(t => (
            <label key={t.numero} className="flex items-start gap-2 rounded border border-gray-200 p-2 text-xs">
              <input
                type="checkbox"
                className="mt-0.5 accent-petroleum-500"
                checked={sel.includes(t.numero)}
                onChange={() => setSel(s => (s.includes(t.numero) ? s.filter(x => x !== t.numero) : [...s, t.numero]))}
              />
              <span className="text-gray-700">
                <span className="font-mono">{t.numero}</span> · {t.origen} → {t.destino} · {t.producto} ·{' '}
                <span className="font-mono">{fmtNum(t.cantidad)} {t.udm}</span>
              </span>
            </label>
          ))}
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-600">Responsable del grupo</span>
          <select className={INPUT} value={resp} onChange={e => setResp(e.target.value)}>
            <option value="">Seleccionar…</option>
            {RESPONSABLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <button type="button" className={BTN_SECONDARY} onClick={onClose}>Cancelar</button>
          <button type="button" className={BTN_PRIMARY} disabled={sel.length === 0 || !resp} onClick={() => onAgrupar(sel, resp)}>
            Crear grupo ({sel.length})
          </button>
        </div>
      </div>
    </Modal>
  );
}

function TabOperacion({ avisar, feedback }: TabProps) {
  const [recepciones, setRecepciones] = useState<Recepcion[]>(RECEPCIONES);
  const [fRec, setFRec] = useState('');
  const [qRec, setQRec] = useState('');
  const [entregas, setEntregas] = useState<Entrega[]>(ENTREGAS);
  const [fEnt, setFEnt] = useState('');
  const [transferencias, setTransferencias] = useState<Transferencia[]>(TRANSFERENCIAS);
  const [grupos, setGrupos] = useState<TransferenciaAgrupada[]>(TRANSFERENCIAS_AGRUPADAS);
  const [reservas, setReservas] = useState<Reserva[]>(RESERVAS);
  const [pendientes, setPendientes] = useState<Pendiente[]>(PENDIENTES);
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>(DEVOLUCIONES);
  const [divisiones, setDivisiones] = useState<Division[]>(DIVISIONES);
  const [paquetes, setPaquetes] = useState<Paquete[]>(PAQUETES);
  const [fMovProd, setFMovProd] = useState('');
  const [fMovTipo, setFMovTipo] = useState('');
  const [qMov, setQMov] = useState('');
  const [modal, setModal] = useState<string | null>(null);
  const [parcialDe, setParcialDe] = useState<string | null>(null);
  const [divDe, setDivDe] = useState('');
  const [divCant, setDivCant] = useState('');
  const [divMotivo, setDivMotivo] = useState('');
  const [tipoOpEtq, setTipoOpEtq] = useState('');
  const [docEtq, setDocEtq] = useState('');

  const recVisibles = recepciones.filter(r =>
    (!fRec || r.estado === fRec) &&
    (!qRec || r.proveedor.toLowerCase().includes(qRec.toLowerCase()) || r.numero.toLowerCase().includes(qRec.toLowerCase()))
  );
  const entVisibles = entregas.filter(e => !fEnt || e.estado === fEnt);
  const movVisibles = MOVIMIENTOS.filter(m =>
    (!fMovProd || m.producto === fMovProd) &&
    (!fMovTipo || m.tipo === fMovTipo) &&
    (!qMov || `${m.documento} ${m.lote} ${m.paquete}`.toLowerCase().includes(qMov.toLowerCase()))
  );
  const pendientesDeAgrupar = transferencias.filter(t => t.estado === 'Borrador' || t.estado === 'Preparada');

  const siguienteEstado = (e: Entrega['estado']): Entrega['estado'] =>
    e === 'Reservada' ? 'Preparada' : e === 'Preparada' ? 'Empacada' : 'Entregada';

  return (
    <div className="space-y-4">
      {/* INV-11 Recepciones */}
      <FunctionBlock code="INV-11">
        <Toolbar>
          <input className={INPUT} placeholder="Buscar por proveedor o número..." value={qRec} onChange={e => setQRec(e.target.value)} />
          <select className={INPUT} value={fRec} onChange={e => setFRec(e.target.value)}>
            <option value="">Todos los estados</option>
            <option>Pendiente</option><option>Parcial</option><option>Recibida</option><option>Control de calidad</option>
          </select>
          <button className={BTN_PRIMARY} onClick={() => setModal('recepcion')}>+ Nueva recepción</button>
        </Toolbar>
        {feedback['INV-11'] && <div className="mt-3"><Msg aviso={feedback['INV-11']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${recVisibles.length} de ${recepciones.length} recepciones`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Proveedor</Th><Th>Fecha</Th><Th>Ubicación</Th>
                <Th align="right">Líneas</Th><Th align="right">Cantidad</Th><Th align="center">Estado</Th><Th align="center">Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recVisibles.map(r => (
                <tr key={r.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{r.numero}</span></Td>
                  <Td className="font-medium text-gray-800">{r.proveedor}</Td>
                  <Td>{fmtFecha(r.fecha)}</Td>
                  <Td><span className="font-mono">{r.ubicacion}</span></Td>
                  <Td align="right"><span className="font-mono">{r.lineas}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(r.cantidad)} {r.udm}</span></Td>
                  <Td align="center"><StatusBadge label={r.estado} tone={TONO_RECEPCION[r.estado]} /></Td>
                  <Td align="center">
                    <div className="flex justify-center gap-1">
                      {r.estado !== 'Recibida' && (
                        <button className={BTN_GHOST} onClick={() => {
                          setRecepciones(rs => rs.map(x => (x.id === r.id ? { ...x, estado: 'Recibida' } : x)));
                          avisar('INV-11', `Recepción ${r.numero} recibida: existencias y estados actualizados.`);
                        }}>
                          Recibir
                        </button>
                      )}
                      {(r.estado === 'Pendiente' || r.estado === 'Parcial') && (
                        <button className={BTN_GHOST} onClick={() => setParcialDe(r.id)}>Parcial</button>
                      )}
                      <button className={BTN_GHOST} onClick={() => {
                        setRecepciones(rs => rs.map(x => (x.id === r.id ? { ...x, estado: 'Control de calidad' } : x)));
                        avisar('INV-11', `${r.numero} enviada a control de calidad.`);
                      }}>
                        Calidad
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
              {recVisibles.length === 0 && <EmptyRow colSpan={8} text="No hay recepciones que coincidan con los filtros." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-12 Entregas */}
      <FunctionBlock code="INV-12">
        <Toolbar>
          <select className={INPUT} value={fEnt} onChange={e => setFEnt(e.target.value)}>
            <option value="">Todos los estados</option>
            <option>Reservada</option><option>Preparada</option><option>Empacada</option><option>Entregada</option><option>Parcial</option>
          </select>
          <button className={BTN_PRIMARY} onClick={() => setModal('entrega')}>+ Nueva entrega</button>
        </Toolbar>
        {feedback['INV-12'] && <div className="mt-3"><Msg aviso={feedback['INV-12']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${entVisibles.length} de ${entregas.length} entregas`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Cliente</Th><Th>Fecha</Th><Th align="right">Cantidad</Th>
                <Th align="center">Estado</Th><Th align="center">Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entVisibles.map(e => (
                <tr key={e.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{e.numero}</span></Td>
                  <Td className="font-medium text-gray-800">{e.cliente}</Td>
                  <Td>{fmtFecha(e.fecha)}</Td>
                  <Td align="right"><span className="font-mono">{fmtNum(e.cantidad)} {e.udm}</span></Td>
                  <Td align="center"><StatusBadge label={e.estado} tone={TONO_ENTREGA[e.estado]} /></Td>
                  <Td align="center">
                    <div className="flex justify-center gap-1">
                      {e.estado !== 'Entregada' && (
                        <button className={BTN_GHOST} onClick={() => {
                          const prox = siguienteEstado(e.estado);
                          setEntregas(es => es.map(x => (x.id === e.id ? { ...x, estado: prox } : x)));
                          avisar('INV-12', `${e.numero} avanzó a «${prox}».`);
                        }}>
                          {e.estado === 'Reservada' ? 'Preparar' : e.estado === 'Preparada' ? 'Empacar' : 'Entregar'}
                        </button>
                      )}
                      {e.estado !== 'Entregada' && e.estado !== 'Parcial' && (
                        <button className={BTN_GHOST} onClick={() => {
                          setEntregas(es => es.map(x => (x.id === e.id ? { ...x, estado: 'Parcial' } : x)));
                          setPendientes(p => [...p, {
                            id: `PN${p.length + 20}`, numero: `PEN-000${17 + p.length}`, documento: e.numero,
                            producto: 'PT-101', demanda: e.cantidad, atendido: Math.round(e.cantidad / 2),
                            fechaLimite: isoDentroDe(3), estado: 'Abierto',
                          }]);
                          avisar('INV-12', `${e.numero} entregada parcialmente: se generó un pendiente con la demanda restante.`);
                        }}>
                          Parcial
                        </button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
              {entVisibles.length === 0 && <EmptyRow colSpan={6} text="No hay entregas que coincidan con el filtro." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-13 Transferencias internas */}
      <FunctionBlock code="INV-13">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('transferencia')}>+ Nueva transferencia</button>
        </Toolbar>
        {feedback['INV-13'] && <div className="mt-3"><Msg aviso={feedback['INV-13']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${transferencias.length} transferencias internas`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Origen</Th><Th>Destino</Th><Th>Producto</Th><Th align="right">Cantidad</Th>
                <Th>Lote</Th><Th>Paquete</Th><Th>Responsable</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transferencias.map(t => (
                <tr key={t.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{t.numero}</span></Td>
                  <Td><span className="font-mono">{t.origen}</span></Td>
                  <Td><span className="font-mono">{t.destino}</span></Td>
                  <Td><span className="font-mono">{t.producto}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(t.cantidad)} {t.udm}</span></Td>
                  <Td><span className="font-mono">{t.lote}</span></Td>
                  <Td><span className="font-mono">{t.paquete}</span></Td>
                  <Td>{t.responsable}</Td>
                  <Td align="center"><StatusBadge label={t.estado} tone={TONO_TRANSFERENCIA[t.estado]} /></Td>
                  <Td align="center">
                    {t.estado !== 'Hecha' && (
                      <button className={BTN_GHOST} onClick={() => {
                        setTransferencias(ts => ts.map(x => (x.id === t.id ? { ...x, estado: 'Hecha' } : x)));
                        avisar('INV-13', `Transferencia ${t.numero} ejecutada: ${fmtNum(t.cantidad)} ${t.udm} de ${t.producto} movidos ${t.origen} → ${t.destino}.`);
                      }}>
                        Ejecutar
                      </button>
                    )}
                    {t.estado === 'Hecha' && <span className="text-xs text-gray-400">—</span>}
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-14 Transferencias agrupadas */}
      <FunctionBlock code="INV-14">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('agrupar')}>+ Agrupar transferencias</button>
        </Toolbar>
        {feedback['INV-14'] && <div className="mt-3"><Msg aviso={feedback['INV-14']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${grupos.length} grupos de transferencia`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Transferencias</Th><Th>Responsable</Th><Th>Creada</Th>
                <Th>Avance</Th><Th align="center">Estado</Th><Th align="center">Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {grupos.map(g => (
                <tr key={g.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{g.numero}</span></Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {g.transferencias.map(t => (
                        <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600">{t}</span>
                      ))}
                    </div>
                  </Td>
                  <Td>{g.responsable}</Td>
                  <Td>{fmtFecha(g.creada)}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded bg-gray-100">
                        <div className="h-full rounded bg-petroleum-500" style={{ width: `${g.avance}%` }} />
                      </div>
                      <span className="font-mono text-gray-600">{fmtPct(g.avance / 100, 0)}</span>
                    </div>
                  </Td>
                  <Td align="center"><StatusBadge label={g.estado} tone={TONO_GRUPO[g.estado]} /></Td>
                  <Td align="center">
                    <div className="flex justify-center gap-1">
                      {g.estado === 'En preparación' && (
                        <button className={BTN_GHOST} onClick={() => {
                          setGrupos(gs => gs.map(x => (x.id === g.id ? { ...x, estado: 'Lista', avance: 100 } : x)));
                          avisar('INV-14', `Grupo ${g.numero} preparado: ${g.transferencias.length} transferencias listas.`);
                        }}>
                          Preparar
                        </button>
                      )}
                      {g.estado === 'Lista' && (
                        <button className={BTN_GHOST} onClick={() => {
                          setGrupos(gs => gs.map(x => (x.id === g.id ? { ...x, estado: 'Ejecutada' } : x)));
                          setTransferencias(ts => ts.map(t => (g.transferencias.includes(t.numero) ? { ...t, estado: 'Hecha' } : t)));
                          avisar('INV-14', `Grupo ${g.numero} ejecutado en conjunto.`);
                        }}>
                          Ejecutar grupo
                        </button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-15 Reserva y disponibilidad */}
      <FunctionBlock code="INV-15">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('reserva')}>+ Reservar existencias</button>
        </Toolbar>
        {feedback['INV-15'] && <div className="mt-3"><Msg aviso={feedback['INV-15']} /></div>}
        <div className="mt-3">
          <DataTable footer="Disponible = física − reservada">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Producto</Th><Th align="right">Física</Th><Th align="right">Reservada</Th>
                <Th align="right">Disponible</Th><Th align="right">Comprometida</Th><Th>Fecha prometida</Th>
                <Th>Documento</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reservas.map(r => (
                <tr key={r.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{r.producto}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(r.fisica)}</span></Td>
                  <Td align="right"><span className="font-mono text-amber-700">{fmtNum(r.reservada)}</span></Td>
                  <Td align="right"><span className="font-mono font-semibold text-petroleum-700">{fmtNum(r.fisica - r.reservada)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(r.comprometida)}</span></Td>
                  <Td>{r.fechaPrometida === '—' ? '—' : fmtFecha(r.fechaPrometida)}</Td>
                  <Td><span className="font-mono">{r.documento}</span></Td>
                  <Td align="center">
                    {r.reservada > 0 && (
                      <button className={BTN_GHOST} onClick={() => {
                        setReservas(rs => rs.map(x => (x.id === r.id ? { ...x, reservada: 0 } : x)));
                        avisar('INV-15', `Reserva de ${r.producto} liberada: ${fmtNum(r.reservada)} unidades vuelven a estar disponibles.`);
                      }}>
                        Liberar
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-16 Pendientes y entregas parciales */}
      <FunctionBlock code="INV-16">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('pendiente')}>+ Generar pendiente</button>
        </Toolbar>
        {feedback['INV-16'] && <div className="mt-3"><Msg aviso={feedback['INV-16']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${pendientes.length} pendientes · ${pendientes.filter(p => p.estado === 'Abierto').length} abiertos`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Documento original</Th><Th>Producto</Th><Th align="right">Demanda</Th>
                <Th align="right">Atendido</Th><Th align="right">Restante</Th><Th>Fecha límite</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendientes.map(p => (
                <tr key={p.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{p.numero}</span></Td>
                  <Td><span className="font-mono">{p.documento}</span></Td>
                  <Td><span className="font-mono">{p.producto}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(p.demanda)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(p.atendido)}</span></Td>
                  <Td align="right"><span className="font-mono font-semibold text-petroleum-700">{fmtNum(p.demanda - p.atendido)}</span></Td>
                  <Td>{fmtFecha(p.fechaLimite)}</Td>
                  <Td align="center"><StatusBadge label={p.estado} tone={TONO_PENDIENTE[p.estado]} /></Td>
                  <Td align="center">
                    {p.estado === 'Abierto' && (
                      <button className={BTN_GHOST} onClick={() => {
                        setPendientes(ps => ps.map(x => (x.id === p.id ? { ...x, atendido: p.demanda, estado: 'Cerrado' } : x)));
                        avisar('INV-16', `${p.numero} atendido y cerrado, con trazabilidad al documento ${p.documento}.`);
                      }}>
                        Cerrar
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-17 Devoluciones e intercambios */}
      <FunctionBlock code="INV-17">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('devolucion')}>+ Nueva devolución</button>
          <button className={BTN_SECONDARY} onClick={() => setModal('intercambio')}>+ Crear intercambio</button>
        </Toolbar>
        {feedback['INV-17'] && <div className="mt-3"><Msg aviso={feedback['INV-17']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${devoluciones.length} devoluciones`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Documento</Th><Th align="center">Origen</Th><Th>Producto</Th><Th align="right">Cantidad</Th>
                <Th>Motivo</Th><Th align="center">Intercambio</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {devoluciones.map(d => (
                <tr key={d.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{d.numero}</span></Td>
                  <Td><span className="font-mono">{d.documento}</span></Td>
                  <Td align="center"><StatusBadge label={d.origen} tone={d.origen === 'Cliente' ? 'blue' : 'petroleum'} /></Td>
                  <Td><span className="font-mono">{d.producto}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(d.cantidad)} {d.udm}</span></Td>
                  <Td>{d.motivo}</Td>
                  <Td align="center">{d.intercambio ? <StatusBadge label="Sí" tone="green" /> : <span className="text-xs text-gray-400">—</span>}</Td>
                  <Td align="center"><StatusBadge label={d.estado} tone={TONO_DEVOLUCION[d.estado]} /></Td>
                  <Td align="center">
                    {d.estado !== 'Aplicada' && (
                      <button className={BTN_GHOST} onClick={() => {
                        setDevoluciones(ds => ds.map(x => (x.id === d.id ? { ...x, estado: 'Aplicada' } : x)));
                        avisar('INV-17', `Devolución ${d.numero} aplicada: se generó el movimiento inverso de ${fmtNum(d.cantidad)} ${d.udm}.`);
                      }}>
                        Aplicar
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-18 División de transferencias */}
      <FunctionBlock code="INV-18">
        <Toolbar>
          <select className={INPUT} value={divDe} onChange={e => setDivDe(e.target.value)}>
            <option value="">Transferencia a dividir…</option>
            {pendientesDeAgrupar.map(t => <option key={t.numero} value={t.numero}>{t.numero} — {t.producto} ({fmtNum(t.cantidad)} {t.udm})</option>)}
          </select>
          <input className={`${INPUT} w-28`} type="number" min={1} placeholder="Cantidad" value={divCant} onChange={e => setDivCant(e.target.value)} />
          <input className={INPUT} placeholder="Motivo (prioridad, cliente, fecha)..." value={divMotivo} onChange={e => setDivMotivo(e.target.value)} />
          <button
            className={BTN_PRIMARY}
            disabled={!divDe || !Number(divCant)}
            onClick={() => {
              const origen = transferencias.find(t => t.numero === divDe);
              if (!origen) return;
              const nuevo: Division = {
                id: `DI${divisiones.length + 10}`, numero: `TRA-003${30 + divisiones.length}`,
                origenTransferencia: origen.numero, producto: origen.producto,
                cantidad: Number(divCant), udm: origen.udm, motivo: divMotivo.trim() || 'División manual', estado: 'Borrador',
              };
              setDivisiones(d => [...d, nuevo]);
              avisar('INV-18', `Transferencia ${origen.numero} dividida: se creó ${nuevo.numero} con ${fmtNum(nuevo.cantidad)} ${nuevo.udm}.`);
            }}
          >
            Dividir transferencia
          </button>
        </Toolbar>
        {feedback['INV-18'] && <div className="mt-3"><Msg aviso={feedback['INV-18']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${divisiones.length} transferencias divididas`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr><Th>Número</Th><Th>Transferencia origen</Th><Th>Producto</Th><Th align="right">Cantidad</Th><Th>Motivo</Th><Th align="center">Estado</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {divisiones.map(d => (
                <tr key={d.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{d.numero}</span></Td>
                  <Td><span className="font-mono">{d.origenTransferencia}</span></Td>
                  <Td><span className="font-mono">{d.producto}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(d.cantidad)} {d.udm}</span></Td>
                  <Td>{d.motivo}</Td>
                  <Td align="center"><StatusBadge label={d.estado} tone={TONO_DIVISION[d.estado]} /></Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-19 Paquetes */}
      <FunctionBlock code="INV-19">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('paquete')}>+ Nuevo paquete</button>
        </Toolbar>
        {feedback['INV-19'] && <div className="mt-3"><Msg aviso={feedback['INV-19']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${paquetes.length} paquetes`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Código</Th><Th>Tipo</Th><Th>Contenido</Th><Th align="right">Cantidad</Th>
                <Th>Ubicación</Th><Th>Anidado en</Th><Th align="center">Estado</Th><Th align="center">Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paquetes.map(p => (
                <tr key={p.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{p.codigo}</span></Td>
                  <Td><span className="font-mono">{p.tipo}</span></Td>
                  <Td><span className="font-mono">{p.contenido}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(p.cantidad)} {p.udm}</span></Td>
                  <Td><span className="font-mono">{p.ubicacion}</span></Td>
                  <Td><span className="font-mono">{p.anidadoEn}</span></Td>
                  <Td align="center"><StatusBadge label={p.estado} tone={TONO_PAQUETE[p.estado]} /></Td>
                  <Td align="center">
                    <div className="flex justify-center gap-1">
                      <button className={BTN_GHOST} onClick={() => setModal(`mover:${p.codigo}`)}>Mover</button>
                      <button className={BTN_GHOST} onClick={() => avisar('INV-19', `Etiqueta SSCC de ${p.codigo} enviada a impresión (simulado).`)}>Etiqueta</button>
                      <button className={BTN_GHOST} onClick={() => avisar('INV-19', `Historial de ${p.codigo}: creado en recepción, ${p.estado === 'En tránsito' ? 'en tránsito' : 'ubicado en'} ${p.ubicacion}.`)}>Historial</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-20 Operaciones detalladas */}
      <FunctionBlock code="INV-20">
        <Toolbar>
          <select className={INPUT} value={fMovProd} onChange={e => setFMovProd(e.target.value)}>
            <option value="">Todos los productos</option>
            {PRODUCTOS.map(p => <option key={p.codigo} value={p.codigo}>{p.codigo} — {p.nombre}</option>)}
          </select>
          <select className={INPUT} value={fMovTipo} onChange={e => setFMovTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option>Entrada</option><option>Salida</option><option>Interno</option>
          </select>
          <input className={INPUT} placeholder="Buscar documento, lote o paquete..." value={qMov} onChange={e => setQMov(e.target.value)} />
        </Toolbar>
        {feedback['INV-20'] && <div className="mt-3"><Msg aviso={feedback['INV-20']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${movVisibles.length} de ${MOVIMIENTOS.length} movimientos detallados`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Fecha</Th><Th>Producto</Th><Th align="right">Cantidad</Th><Th>Origen</Th><Th>Destino</Th>
                <Th>Lote/Serie</Th><Th>Paquete</Th><Th align="center">Propietario</Th><Th>Documento</Th><Th>Responsable</Th><Th align="center">Tipo</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {movVisibles.map(m => (
                <tr key={m.id} className="hoverable">
                  <Td>{fmtFecha(m.fecha)}</Td>
                  <Td><span className="font-mono text-gray-600">{m.producto}</span></Td>
                  <Td align="right">
                    <span className={`font-mono ${m.tipo === 'Entrada' ? 'text-green-700' : m.tipo === 'Salida' ? 'text-red-600' : 'text-gray-700'}`}>
                      {m.tipo === 'Salida' ? '−' : '+'}{fmtNum(m.cantidad)} {m.udm}
                    </span>
                  </Td>
                  <Td><span className="font-mono">{m.origen}</span></Td>
                  <Td><span className="font-mono">{m.destino}</span></Td>
                  <Td><span className="font-mono">{m.lote}</span></Td>
                  <Td><span className="font-mono">{m.paquete}</span></Td>
                  <Td align="center"><StatusBadge label={m.propietario} tone={m.propietario === 'Propio' ? 'petroleum' : 'amber'} /></Td>
                  <Td><span className="font-mono">{m.documento}</span></Td>
                  <Td>{m.responsable}</Td>
                  <Td align="center"><StatusBadge label={m.tipo} tone={TONO_MOVIMIENTO[m.tipo]} /></Td>
                </tr>
              ))}
              {movVisibles.length === 0 && <EmptyRow colSpan={11} text="No hay movimientos que coincidan con los filtros." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-21 Etiquetas e impresión */}
      <FunctionBlock code="INV-21">
        <Toolbar>
          <select className={INPUT} value={tipoOpEtq} onChange={e => setTipoOpEtq(e.target.value)}>
            <option value="">Tipo de operación…</option>
            {TIPOS_OPERACION.map(t => <option key={t.codigo} value={t.codigo}>{t.codigo} — {t.nombre}</option>)}
          </select>
          <select className={INPUT} value={docEtq} onChange={e => setDocEtq(e.target.value)}>
            <option value="">Documento…</option>
            {ETIQUETAS.map(e => <option key={e.tipo} value={e.tipo}>{e.tipo}</option>)}
          </select>
          <button
            className={BTN_PRIMARY}
            disabled={!tipoOpEtq || !docEtq}
            onClick={() => avisar('INV-21', `Impresión automática de «${docEtq}» activada para la operación ${tipoOpEtq}.`)}
          >
            Activar impresión automática
          </button>
        </Toolbar>
        {feedback['INV-21'] && <div className="mt-3"><Msg aviso={feedback['INV-21']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${ETIQUETAS.length} documentos imprimibles`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr><Th>Tipo</Th><Th>Descripción</Th><Th align="center">Automática</Th><Th align="center">Acción</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ETIQUETAS.map(e => (
                <tr key={e.id} className="hoverable">
                  <Td className="font-medium text-gray-800">{e.tipo}</Td>
                  <Td>{e.descripcion}</Td>
                  <Td align="center"><StatusBadge label={e.impresionAutomatica ? 'Sí' : 'No'} tone={e.impresionAutomatica ? 'green' : 'gray'} /></Td>
                  <Td align="center">
                    <button className={BTN_GHOST} onClick={() => avisar('INV-21', `«${e.tipo}» enviado a la cola de impresión (simulado).`)}>Imprimir</button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* modales de operación */}
      {modal === 'recepcion' && (
        <ModalFormulario
          titulo="Nueva recepción"
          onClose={() => setModal(null)}
          campos={[
            { id: 'proveedor', label: 'Proveedor', tipo: 'select', opciones: PROVEEDORES.map(p => p.nombre) },
            { id: 'fecha', label: 'Fecha', placeholder: '2026-10-28' },
            { id: 'ubicacion', label: 'Ubicación destino', tipo: 'select', opciones: UBICACIONES.filter(u => u.tipo === 'Interna').map(u => u.codigo) },
            { id: 'lineas', label: 'Líneas', tipo: 'number' },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'udm', label: 'Unidad', tipo: 'select', opciones: ['kg', 'L', 'un'] },
          ]}
          onGuardar={v => {
            setRecepciones(r => [...r, {
              id: `RC${r.length + 10}`, numero: `REC-000${97 + r.length - RECEPCIONES.length}`,
              proveedor: v.proveedor || 'Proveedor nuevo', fecha: v.fecha || hoyISO(),
              ubicacion: v.ubicacion || 'EST-01', lineas: Number(v.lineas) || 1,
              cantidad: Number(v.cantidad) || 0, udm: v.udm || 'kg', estado: 'Pendiente',
            }]);
            setModal(null);
            avisar('INV-11', 'Recepción creada en estado Pendiente: quedó lista para recibir parcial o totalmente.');
          }}
        />
      )}
      {modal === 'entrega' && (
        <ModalFormulario
          titulo="Nueva entrega"
          onClose={() => setModal(null)}
          campos={[
            { id: 'cliente', label: 'Cliente', obligatorio: true },
            { id: 'fecha', label: 'Fecha', placeholder: '2026-10-28' },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'udm', label: 'Unidad', tipo: 'select', opciones: ['kg', 'L', 'un'] },
          ]}
          onGuardar={v => {
            setEntregas(e => [...e, {
              id: `EN${e.length + 10}`, numero: `ENT-005${16 + e.length - ENTREGAS.length}`,
              cliente: v.cliente.trim(), fecha: v.fecha || hoyISO(),
              cantidad: Number(v.cantidad) || 0, udm: v.udm || 'un', estado: 'Reservada',
            }]);
            setModal(null);
            avisar('INV-12', 'Entrega creada con reserva al confirmar y control de disponibilidad.');
          }}
        />
      )}
      {modal === 'transferencia' && (
        <ModalFormulario
          titulo="Nueva transferencia interna"
          onClose={() => setModal(null)}
          campos={[
            { id: 'origen', label: 'Ubicación origen', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
            { id: 'destino', label: 'Ubicación destino', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'udm', label: 'Unidad', tipo: 'select', opciones: ['kg', 'L', 'un'] },
            { id: 'lote', label: 'Lote o serie', placeholder: 'L2510E' },
            { id: 'paquete', label: 'Paquete', placeholder: 'PK000127' },
            { id: 'responsable', label: 'Responsable', tipo: 'select', opciones: RESPONSABLES },
          ]}
          onGuardar={v => {
            setTransferencias(t => [...t, {
              id: `TR${t.length + 10}`, numero: `TRA-003${30 + t.length - TRANSFERENCIAS.length}`,
              origen: v.origen || 'EST-01', destino: v.destino || 'EST-03',
              producto: v.producto || 'MP-001', cantidad: Number(v.cantidad) || 0,
              udm: v.udm || 'kg', lote: v.lote.trim() || '—', paquete: v.paquete.trim() || '—',
              responsable: v.responsable || 'Diego Salazar', estado: 'Borrador',
            }]);
            setModal(null);
            avisar('INV-13', 'Transferencia creada en Borrador con origen, destino, lote y responsable.');
          }}
        />
      )}
      {modal === 'agrupar' && (
        <ModalAgrupar
          transferencias={pendientesDeAgrupar}
          onClose={() => setModal(null)}
          onAgrupar={(numeros, responsable) => {
            setGrupos(g => [...g, {
              id: `GR${g.length + 10}`, numero: `GRP-00${11 + g.length}`, transferencias: numeros,
              responsable, creada: hoyISO(), avance: 0, estado: 'En preparación',
            }]);
            setModal(null);
            avisar('INV-14', `Grupo creado con ${numeros.length} transferencias y responsable ${responsable}.`);
          }}
        />
      )}
      {modal === 'reserva' && (
        <ModalFormulario
          titulo="Reservar existencias"
          onClose={() => setModal(null)}
          campos={[
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'cantidad', label: 'Cantidad a reservar', tipo: 'number' },
            { id: 'documento', label: 'Documento de origen', placeholder: 'ENT-00516' },
            { id: 'fecha', label: 'Fecha prometida', placeholder: '2026-11-01' },
          ]}
          onGuardar={v => {
            const prod = v.producto || 'PT-101';
            const cant = Number(v.cantidad) || 0;
            const existente = reservas.find(r => r.producto === prod);
            if (!existente) {
              const ex = EXISTENCIAS.find(x => x.producto === prod);
              setReservas(r => [...r, {
                id: `RS${r.length + 10}`, producto: prod, fisica: ex?.fisica ?? cant,
                reservada: cant, comprometida: cant, fechaPrometida: v.fecha || isoDentroDe(3),
                documento: v.documento.trim() || 'Manual',
              }]);
            } else {
              setReservas(rs => rs.map(x => (x.producto === prod ? { ...x, reservada: x.reservada + cant, comprometida: x.comprometida + cant, documento: v.documento.trim() || x.documento } : x)));
            }
            setModal(null);
            avisar('INV-15', `Reserva manual de ${fmtNum(cant)} unidades de ${prod} registrada.`);
          }}
        />
      )}
      {modal === 'pendiente' && (
        <ModalFormulario
          titulo="Generar pendiente"
          onClose={() => setModal(null)}
          campos={[
            { id: 'documento', label: 'Documento original', tipo: 'select', opciones: ENTREGAS.map(e => e.numero) },
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'demanda', label: 'Demanda total', tipo: 'number' },
            { id: 'atendido', label: 'Cantidad atendida', tipo: 'number' },
          ]}
          onGuardar={v => {
            setPendientes(p => [...p, {
              id: `PN${p.length + 20}`, numero: `PEN-000${17 + p.length}`, documento: v.documento || 'ENT-00516',
              producto: v.producto || 'PT-101', demanda: Number(v.demanda) || 0,
              atendido: Number(v.atendido) || 0, fechaLimite: isoDentroDe(3), estado: 'Abierto',
            }]);
            setModal(null);
            avisar('INV-16', 'Pendiente generado con la demanda restante y trazabilidad al documento original.');
          }}
        />
      )}
      {modal === 'devolucion' && (
        <ModalFormulario
          titulo="Nueva devolución"
          onClose={() => setModal(null)}
          campos={[
            { id: 'documento', label: 'Documento origen', tipo: 'select', opciones: [...ENTREGAS.map(e => e.numero), ...RECEPCIONES.map(r => r.numero)] },
            { id: 'origen', label: 'Origen', tipo: 'select', opciones: ['Cliente', 'Proveedor'] },
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'motivo', label: 'Motivo', anchoCompleto: true },
          ]}
          onGuardar={v => {
            setDevoluciones(d => [...d, {
              id: `DV${d.length + 10}`, numero: `DEV-000${26 + d.length - DEVOLUCIONES.length}`,
              documento: v.documento || 'ENT-00516', origen: (v.origen || 'Cliente') as Devolucion['origen'],
              producto: v.producto || 'PT-101', cantidad: Number(v.cantidad) || 0, udm: 'un',
              motivo: v.motivo.trim() || 'Devolución', intercambio: false, estado: 'Recibida',
            }]);
            setModal(null);
            avisar('INV-17', 'Devolución registrada: el movimiento inverso se aplica al confirmarla.');
          }}
        />
      )}
      {modal === 'intercambio' && (
        <ModalFormulario
          titulo="Crear entrega de intercambio"
          onClose={() => setModal(null)}
          campos={[
            { id: 'cliente', label: 'Cliente', obligatorio: true },
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'fecha', label: 'Fecha', placeholder: '2026-10-28' },
          ]}
          onGuardar={v => {
            setEntregas(e => [...e, {
              id: `EN${e.length + 10}`, numero: `ENT-005${16 + e.length - ENTREGAS.length}`,
              cliente: v.cliente.trim(), fecha: v.fecha || hoyISO(),
              cantidad: Number(v.cantidad) || 0, udm: 'un', estado: 'Reservada',
            }]);
            setModal(null);
            avisar('INV-17', 'Entrega de intercambio creada y reservada a nombre del cliente.');
          }}
        />
      )}
      {modal === 'paquete' && (
        <ModalFormulario
          titulo="Nuevo paquete"
          onClose={() => setModal(null)}
          campos={[
            { id: 'tipo', label: 'Tipo de paquete', tipo: 'select', opciones: TIPOS_PAQUETE.map(p => p.codigo) },
            { id: 'contenido', label: 'Producto contenido', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'udm', label: 'Unidad', tipo: 'select', opciones: ['kg', 'L', 'un'] },
            { id: 'ubicacion', label: 'Ubicación', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
            { id: 'anidadoEn', label: 'Anidado en', placeholder: 'PK000130' },
          ]}
          onGuardar={v => {
            setPaquetes(p => [...p, {
              id: `PK${p.length + 10}`, codigo: `PK000${131 + p.length - PAQUETES.length}`,
              tipo: v.tipo || 'CJ', contenido: v.contenido || 'MP-001',
              cantidad: Number(v.cantidad) || 0, udm: v.udm || 'kg',
              ubicacion: v.ubicacion || 'EST-01', anidadoEn: v.anidadoEn.trim() || '—', estado: 'Abierto',
            }]);
            setModal(null);
            avisar('INV-19', 'Paquete creado con contenido asignado y listo para imprimir su etiqueta.');
          }}
        />
      )}
      {modal?.startsWith('mover:') && (
        <ModalFormulario
          titulo={`Mover paquete ${modal.split(':')[1]}`}
          onClose={() => setModal(null)}
          campos={[
            { id: 'ubicacion', label: 'Nueva ubicación', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
            { id: 'responsable', label: 'Responsable', tipo: 'select', opciones: RESPONSABLES },
          ]}
          onGuardar={v => {
            const cod = modal.split(':')[1];
            setPaquetes(ps => ps.map(p => (p.codigo === cod ? { ...p, ubicacion: v.ubicacion || p.ubicacion } : p)));
            setModal(null);
            avisar('INV-19', `Paquete ${cod} movido a ${v.ubicacion || 'EST-01'}. Historial actualizado.`);
          }}
        />
      )}
      {parcialDe && (
        <ModalFormulario
          titulo={`Recepción parcial de ${recepciones.find(r => r.id === parcialDe)?.numero ?? ''}`}
          onClose={() => setParcialDe(null)}
          campos={[
            { id: 'cantidad', label: 'Cantidad recibida', tipo: 'number' },
            { id: 'ubicacion', label: 'Ubicación', tipo: 'select', opciones: UBICACIONES.filter(u => u.tipo === 'Interna').map(u => u.codigo) },
            { id: 'lote', label: 'Lote o serie', placeholder: 'L2601A' },
          ]}
          onGuardar={v => {
            const r = recepciones.find(x => x.id === parcialDe);
            setRecepciones(rs => rs.map(x => (x.id === parcialDe ? { ...x, estado: 'Parcial' } : x)));
            setPendientes(p => [...p, {
              id: `PN${p.length + 20}`, numero: `PEN-000${17 + p.length}`, documento: r?.numero ?? 'REC-00093',
              producto: 'MP-003', demanda: r?.cantidad ?? 0, atendido: Number(v.cantidad) || 0,
              fechaLimite: isoDentroDe(2), estado: 'Abierto',
            }]);
            setParcialDe(null);
            avisar('INV-11', `${r?.numero} recibida parcialmente con lote ${v.lote.trim() || '—'}: se generó un pendiente por el restante.`);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------ pestaña existencias y ajustes -------------------- */

function ModalConteo({ onClose, onCrear }: { onClose: () => void; onCrear: (c: InventarioFisico) => void }) {
  const [ubicacion, setUbicacion] = useState(UBICACIONES.filter(u => u.tipo === 'Interna')[0]?.codigo ?? 'EST-01');
  const [sistema, setSistema] = useState('0');
  const [contado, setContado] = useState('0');
  const s = Number(sistema) || 0;
  const c = Number(contado) || 0;
  const dif = c - s;
  return (
    <Modal title="Nuevo conteo de inventario físico" onClose={onClose}>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Ubicación a contar</span>
            <select className={INPUT} value={ubicacion} onChange={e => setUbicacion(e.target.value)}>
              {UBICACIONES.filter(u => u.tipo === 'Interna').map(u => <option key={u.codigo} value={u.codigo}>{u.codigo} — {u.nombre}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Cantidad en sistema</span>
            <input type="number" className={INPUT} value={sistema} onChange={e => setSistema(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Cantidad contada</span>
            <input type="number" className={INPUT} value={contado} onChange={e => setContado(e.target.value)} />
          </label>
        </div>
        <p className="text-xs text-gray-600">
          Diferencia calculada:{' '}
          <span className={`font-mono font-semibold ${dif === 0 ? 'text-gray-700' : dif < 0 ? 'text-red-600' : 'text-amber-600'}`}>
            {dif > 0 ? '+' : ''}{fmtNum(dif)}
          </span>
        </p>
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <button type="button" className={BTN_SECONDARY} onClick={onClose}>Cancelar</button>
          <button
            type="button"
            className={BTN_PRIMARY}
            onClick={() => onCrear({ id: `IF${Date.now()}`, numero: `INV-000${35 + Math.floor(Math.random() * 90)}`, ubicacion, fecha: hoyISO(), responsable: 'Laura Cano', sistema: s, contado: c, estado: 'Abierto' })}
          >
            Guardar conteo
          </button>
        </div>
      </div>
    </Modal>
  );
}

function TabExistencias({ avisar, feedback }: TabProps) {
  const [fProd, setFProd] = useState('');
  const [fUbi, setFUbi] = useState('');
  const [fProp, setFProp] = useState('');
  const [inventarios, setInventarios] = useState<InventarioFisico[]>(INVENTARIOS_FISICOS);
  const [ciclicos, setCiclicos] = useState<InventarioCiclico[]>(INVENTARIOS_CICLICOS);
  const [reubicaciones, setReubicaciones] = useState<Reubicacion[]>(REUBICACIONES);
  const [desechos, setDesechos] = useState<Desecho[]>(DESECHOS);
  const [fMetodo, setFMetodo] = useState('');
  const [costosImp, setCostosImp] = useState<CostoImportacion[]>(COSTOS_IMPORTACION);
  const [entregasDir, setEntregasDir] = useState<EntregaDirecta[]>(ENTREGAS_DIRECTAS);
  const [consignaciones, setConsignaciones] = useState<Consignacion[]>(CONSIGNACIONES);
  const [fPropCons, setFPropCons] = useState('');
  const [modal, setModal] = useState<string | null>(null);

  const exisVisibles = EXISTENCIAS.filter(e =>
    (!fProd || e.producto === fProd) &&
    (!fUbi || e.ubicacion === fUbi) &&
    (!fProp || e.propietario === fProp)
  );
  const valVisibles = VALORACION.filter(v => !fMetodo || v.metodo === fMetodo);
  const consVisibles = consignaciones.filter(c => !fPropCons || c.propietario === fPropCons);
  const totalFisicaExis = exisVisibles.reduce((a, e) => a + e.fisica, 0);

  return (
    <div className="space-y-4">
      {/* INV-22 Existencias por ubicación */}
      <FunctionBlock code="INV-22">
        <Toolbar>
          <select className={INPUT} value={fProd} onChange={e => setFProd(e.target.value)}>
            <option value="">Todos los productos</option>
            {PRODUCTOS.map(p => <option key={p.codigo} value={p.codigo}>{p.codigo} — {p.nombre}</option>)}
          </select>
          <select className={INPUT} value={fUbi} onChange={e => setFUbi(e.target.value)}>
            <option value="">Todas las ubicaciones</option>
            {UBICACIONES.map(u => <option key={u.codigo} value={u.codigo}>{u.codigo}</option>)}
          </select>
          <select className={INPUT} value={fProp} onChange={e => setFProp(e.target.value)}>
            <option value="">Todos los propietarios</option>
            <option>Propio</option><option>Tercero</option>
          </select>
        </Toolbar>
        {feedback['INV-22'] && <div className="mt-3"><Msg aviso={feedback['INV-22']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${exisVisibles.length} posiciones · ${fmtNum(totalFisicaExis)} unidades físicas`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Producto</Th><Th>Ubicación</Th><Th>Lote</Th><Th>Paquete</Th><Th align="center">Propietario</Th>
                <Th align="right">Física</Th><Th align="right">Reservada</Th><Th align="right">Disponible</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {exisVisibles.map(e => (
                <tr key={e.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{e.producto}</span></Td>
                  <Td><span className="font-mono">{e.ubicacion}</span></Td>
                  <Td><span className="font-mono">{e.lote}</span></Td>
                  <Td><span className="font-mono">{e.paquete}</span></Td>
                  <Td align="center"><StatusBadge label={e.propietario} tone={e.propietario === 'Propio' ? 'petroleum' : 'amber'} /></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(e.fisica)}</span></Td>
                  <Td align="right"><span className="font-mono text-amber-700">{fmtNum(e.reservada)}</span></Td>
                  <Td align="right"><span className="font-mono font-semibold text-petroleum-700">{fmtNum(e.fisica - e.reservada)}</span></Td>
                </tr>
              ))}
              {exisVisibles.length === 0 && <EmptyRow colSpan={8} text="No hay existencias que coincidan con los filtros." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-23 Inventario físico */}
      <FunctionBlock code="INV-23">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('conteo')}>+ Nuevo conteo</button>
        </Toolbar>
        {feedback['INV-23'] && <div className="mt-3"><Msg aviso={feedback['INV-23']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${inventarios.length} conteos físicos`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Ubicación</Th><Th>Fecha</Th><Th>Responsable</Th>
                <Th align="right">Sistema</Th><Th align="right">Contado</Th><Th align="right">Diferencia</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventarios.map(i => {
                const dif = i.contado - i.sistema;
                return (
                  <tr key={i.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{i.numero}</span></Td>
                    <Td><span className="font-mono">{i.ubicacion}</span></Td>
                    <Td>{fmtFecha(i.fecha)}</Td>
                    <Td>{i.responsable}</Td>
                    <Td align="right"><span className="font-mono">{fmtNum(i.sistema)}</span></Td>
                    <Td align="right"><span className="font-mono">{fmtNum(i.contado)}</span></Td>
                    <Td align="right">
                      <span className={`font-mono font-semibold ${dif === 0 ? 'text-gray-500' : dif < 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {dif > 0 ? '+' : ''}{fmtNum(dif)}
                      </span>
                    </Td>
                    <Td align="center"><StatusBadge label={i.estado} tone={TONO_INVFISICO[i.estado]} /></Td>
                    <Td align="center">
                      {i.estado === 'Abierto' && (
                        <button className={BTN_GHOST} onClick={() => {
                          setInventarios(is => is.map(x => (x.id === i.id ? { ...x, estado: 'Ajustado' } : x)));
                          avisar('INV-23', `Conteo ${i.numero} aplicado: ajuste de ${dif > 0 ? '+' : ''}${fmtNum(dif)} unidades con historial conservado.`);
                        }}>
                          Aplicar ajuste
                        </button>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-24 Inventario cíclico */}
      <FunctionBlock code="INV-24">
        {feedback['INV-24'] && <Msg aviso={feedback['INV-24']} />}
        <div className="mt-3">
          <DataTable footer="Las ubicaciones sin frecuencia quedan cubiertas por el inventario anual de respaldo.">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Ubicación</Th><Th>Frecuencia</Th><Th align="right">Días</Th><Th>Última</Th>
                <Th>Próxima</Th><Th>Responsable</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ciclicos.map(c => (
                <tr key={c.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{c.ubicacion}</span></Td>
                  <Td>{c.frecuencia}</Td>
                  <Td align="right"><span className="font-mono">{c.dias}</span></Td>
                  <Td>{fmtFecha(c.ultima)}</Td>
                  <Td>{fmtFecha(c.proxima)}</Td>
                  <Td>{c.responsable}</Td>
                  <Td align="center"><StatusBadge label={c.estado} tone={TONO_CICLICO[c.estado]} /></Td>
                  <Td align="center">
                    <button className={BTN_GHOST} onClick={() => {
                      setCiclicos(cs => cs.map(x => (x.id === c.id ? { ...x, ultima: hoyISO(), proxima: isoDentroDe(x.dias), estado: 'Al día' } : x)));
                      avisar('INV-24', `${c.ubicacion} contada: próxima fecha recalculada a ${fmtFecha(isoDentroDe(c.dias))}.`);
                    }}>
                      Marcar contado
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-25 Reubicación */}
      <FunctionBlock code="INV-25">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('reubicacion')}>+ Nueva reubicación</button>
        </Toolbar>
        {feedback['INV-25'] && <div className="mt-3"><Msg aviso={feedback['INV-25']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${reubicaciones.length} reubicaciones sin transferencia formal`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Producto</Th><Th align="right">Cantidad</Th><Th>Desde</Th>
                <Th>Hacia</Th><Th>Motivo</Th><Th>Responsable</Th><Th>Fecha</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reubicaciones.map(r => (
                <tr key={r.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{r.numero}</span></Td>
                  <Td><span className="font-mono">{r.producto}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(r.cantidad)} {r.udm}</span></Td>
                  <Td><span className="font-mono">{r.desde}</span></Td>
                  <Td><span className="font-mono">{r.hacia}</span></Td>
                  <Td>{r.motivo}</Td>
                  <Td>{r.responsable}</Td>
                  <Td>{fmtFecha(r.fecha)}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-26 Desecho */}
      <FunctionBlock code="INV-26">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('desecho')}>+ Registrar desecho</button>
        </Toolbar>
        {feedback['INV-26'] && <div className="mt-3"><Msg aviso={feedback['INV-26']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${desechos.length} desechos registrados`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Producto</Th><Th align="right">Cantidad</Th><Th>Lote</Th><Th>Motivo</Th>
                <Th align="center">Reponer</Th><Th>Responsable</Th><Th>Fecha</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {desechos.map(d => (
                <tr key={d.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{d.numero}</span></Td>
                  <Td><span className="font-mono">{d.producto}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(d.cantidad)} {d.udm}</span></Td>
                  <Td><span className="font-mono">{d.lote}</span></Td>
                  <Td>{d.motivo}</Td>
                  <Td align="center"><StatusBadge label={d.reponer ? 'Sí' : 'No'} tone={d.reponer ? 'amber' : 'gray'} /></Td>
                  <Td>{d.responsable}</Td>
                  <Td>{fmtFecha(d.fecha)}</Td>
                  <Td align="center"><StatusBadge label={d.estado} tone={TONO_DESECHO[d.estado]} /></Td>
                  <Td align="center">
                    <div className="flex justify-center gap-1">
                      {d.estado === 'Registrado' && (
                        <button className={BTN_GHOST} onClick={() => {
                          setDesechos(ds => ds.map(x => (x.id === d.id ? { ...x, estado: 'Aprobado' } : x)));
                          avisar('INV-26', `Desecho ${d.numero} aprobado: material retirado de existencias.`);
                        }}>
                          Aprobar
                        </button>
                      )}
                      {d.reponer && d.estado === 'Aprobado' && (
                        <button className={BTN_GHOST} onClick={() => {
                          setDesechos(ds => ds.map(x => (x.id === d.id ? { ...x, estado: 'Repuesto' } : x)));
                          avisar('INV-26', `Reposición de ${d.producto} generada para reemplazar el desecho ${d.numero}.`);
                        }}>
                          Reponer
                        </button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-27 Valoración */}
      <FunctionBlock code="INV-27">
        <Toolbar>
          <select className={INPUT} value={fMetodo} onChange={e => setFMetodo(e.target.value)}>
            <option value="">Todos los métodos</option>
            <option>Estándar</option><option>Promedio</option><option>FIFO</option>
          </select>
          <button className={BTN_PRIMARY} onClick={() => avisar('INV-27', 'Asientos contables de valoración generados (simulado): 1435 Inventarios vs. 6135 Costo de ventas.')}>
            Generar asientos contables
          </button>
          <button className={BTN_SECONDARY} onClick={() => setModal('ajusteValoracion')}>Ajuste de valoración</button>
        </Toolbar>
        {feedback['INV-27'] && <div className="mt-3"><Msg aviso={feedback['INV-27']} /></div>}
        <div className="mt-3">
          <DataTable footer={`Valor total (${fMetodo || 'todos los métodos'}): ${fmtMoney(valVisibles.reduce((a, v) => a + v.valor, 0))}`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Producto</Th><Th align="center">Método</Th><Th align="right">Costo unitario</Th>
                <Th align="right">Cantidad</Th><Th align="right">Valor total</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {valVisibles.map(v => (
                <tr key={v.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{v.producto}</span></Td>
                  <Td align="center"><StatusBadge label={v.metodo} tone={TONO_METODO[v.metodo]} /></Td>
                  <Td align="right"><span className="font-mono">{fmtMoney(v.costo)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(v.cantidad)}</span></Td>
                  <Td align="right"><span className="font-mono font-semibold">{fmtMoney(v.valor)}</span></Td>
                </tr>
              ))}
              {valVisibles.length === 0 && <EmptyRow colSpan={5} text="No hay valoraciones con ese método." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-28 Costos de importación */}
      <FunctionBlock code="INV-28">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('importacion')}>+ Nueva importación</button>
        </Toolbar>
        {feedback['INV-28'] && <div className="mt-3"><Msg aviso={feedback['INV-28']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${costosImp.length} liquidaciones de importación`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Recepción</Th><Th>Proveedor</Th><Th align="right">Valor base</Th><Th align="right">Flete</Th>
                <Th align="right">Seguro</Th><Th align="right">Arancel</Th><Th align="right">Otros</Th>
                <Th>Reparto</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {costosImp.map(c => (
                <tr key={c.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{c.recepcion}</span></Td>
                  <Td>{c.proveedor}</Td>
                  <Td align="right"><span className="font-mono">{fmtMoney(c.valorBase)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtMoney(c.flete)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtMoney(c.seguro)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtMoney(c.arancel)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtMoney(c.otros)}</span></Td>
                  <Td>{c.metodoReparto}</Td>
                  <Td align="center"><StatusBadge label={c.estado} tone={TONO_IMPORTACION[c.estado]} /></Td>
                  <Td align="center">
                    {c.estado === 'Pendiente' && c.metodoReparto !== '—' && (
                      <button className={BTN_GHOST} onClick={() => {
                        setCostosImp(cs => cs.map(x => (x.id === c.id ? { ...x, estado: 'Repartido' } : x)));
                        avisar('INV-28', `Costos de ${c.recepcion} repartidos por ${c.metodoReparto} e incorporados al valor de los productos.`);
                      }}>
                        Repartir costos
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-29 Entrega directa */}
      <FunctionBlock code="INV-29">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('edi')}>+ Nueva entrega directa</button>
        </Toolbar>
        {feedback['INV-29'] && <div className="mt-3"><Msg aviso={feedback['INV-29']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${entregasDir.length} entregas directas`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Proveedor</Th><Th>Cliente</Th><Th>Producto</Th><Th align="right">Cantidad</Th>
                <Th>Fecha</Th><Th align="center">Estado</Th><Th align="center">Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entregasDir.map(e => (
                <tr key={e.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{e.numero}</span></Td>
                  <Td>{e.proveedor}</Td>
                  <Td>{e.cliente}</Td>
                  <Td>{e.producto}</Td>
                  <Td align="right"><span className="font-mono">{fmtNum(e.cantidad)} {e.udm}</span></Td>
                  <Td>{fmtFecha(e.fecha)}</Td>
                  <Td align="center"><StatusBadge label={e.estado} tone={TONO_EDI[e.estado]} /></Td>
                  <Td align="center">
                    <div className="flex justify-center gap-1">
                      {e.estado === 'Programada' && (
                        <button className={BTN_GHOST} onClick={() => {
                          setEntregasDir(es => es.map(x => (x.id === e.id ? { ...x, estado: 'Confirmada' } : x)));
                          avisar('INV-29', `${e.numero} confirmada: el proveedor entrega directo al cliente sin pasar por almacén.`);
                        }}>
                          Confirmar
                        </button>
                      )}
                      {e.estado === 'Confirmada' && (
                        <button className={BTN_GHOST} onClick={() => {
                          setEntregasDir(es => es.map(x => (x.id === e.id ? { ...x, estado: 'Facturada' } : x)));
                          avisar('INV-29', `${e.numero} facturada con documentación y trazabilidad generadas.`);
                        }}>
                          Facturar
                        </button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-30 Consignación */}
      <FunctionBlock code="INV-30">
        <Toolbar>
          <select className={INPUT} value={fPropCons} onChange={e => setFPropCons(e.target.value)}>
            <option value="">Todos los propietarios</option>
            {[...new Set(CONSIGNACIONES.map(c => c.propietario))].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button className={BTN_PRIMARY} onClick={() => setModal('consignacion')}>+ Nueva consignación</button>
          <button className={BTN_SECONDARY} onClick={() => avisar('INV-30', `Reporte de consignación por propietario generado (simulado): ${consVisibles.length} posiciones, ${fmtMoney(consVisibles.reduce((a, c) => a + c.valor, 0))}.`)}>
            Reporte por propietario
          </button>
        </Toolbar>
        {feedback['INV-30'] && <div className="mt-3"><Msg aviso={feedback['INV-30']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${consVisibles.length} de ${consignaciones.length} posiciones en consignación`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Propietario</Th><Th>Producto</Th><Th align="right">Cantidad</Th><Th>Ubicación</Th>
                <Th align="right">Valor</Th><Th align="center">Estado</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {consVisibles.map(c => (
                <tr key={c.id} className="hoverable">
                  <Td className="font-medium text-gray-800">{c.propietario}</Td>
                  <Td>{c.producto}</Td>
                  <Td align="right"><span className="font-mono">{fmtNum(c.cantidad)} {c.udm}</span></Td>
                  <Td><span className="font-mono">{c.ubicacion}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtMoney(c.valor)}</span></Td>
                  <Td align="center"><StatusBadge label={c.estado} tone={TONO_CONSIGNACION[c.estado]} /></Td>
                </tr>
              ))}
              {consVisibles.length === 0 && <EmptyRow colSpan={6} text="No hay consignaciones para ese propietario." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* modales de existencias */}
      {modal === 'conteo' && (
        <ModalConteo
          onClose={() => setModal(null)}
          onCrear={c => {
            setInventarios(i => [...i, c]);
            setModal(null);
            avisar('INV-23', `Conteo ${c.numero} guardado para ${c.ubicacion}: contado ${fmtNum(c.contado)} vs. sistema ${fmtNum(c.sistema)}.`);
          }}
        />
      )}
      {modal === 'reubicacion' && (
        <ModalFormulario
          titulo="Nueva reubicación"
          onClose={() => setModal(null)}
          campos={[
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'udm', label: 'Unidad', tipo: 'select', opciones: ['kg', 'L', 'un'] },
            { id: 'desde', label: 'Desde', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
            { id: 'hacia', label: 'Hacia', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
            { id: 'motivo', label: 'Motivo', tipo: 'select', opciones: ['Consolidación de lote', 'Optimización de frío', 'Sacos dañados', 'Picking rápido'] },
            { id: 'responsable', label: 'Responsable', tipo: 'select', opciones: RESPONSABLES },
          ]}
          onGuardar={v => {
            setReubicaciones(r => [...r, {
              id: `RE${r.length + 10}`, numero: `REU-001${45 + r.length - REUBICACIONES.length}`,
              producto: v.producto || 'MP-001', cantidad: Number(v.cantidad) || 0,
              udm: v.udm || 'kg', desde: v.desde || 'EST-01', hacia: v.hacia || 'EST-02',
              motivo: v.motivo || 'Consolidación', responsable: v.responsable || 'Diego Salazar', fecha: hoyISO(),
            }]);
            setModal(null);
            avisar('INV-25', 'Reubicación registrada con motivo y responsable, sin crear transferencia formal.');
          }}
        />
      )}
      {modal === 'desecho' && (
        <ModalFormulario
          titulo="Registrar desecho"
          onClose={() => setModal(null)}
          campos={[
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'udm', label: 'Unidad', tipo: 'select', opciones: ['kg', 'L', 'un'] },
            { id: 'lote', label: 'Lote', placeholder: 'L2503A' },
            { id: 'motivo', label: 'Motivo', tipo: 'select', opciones: ['Dañado', 'Obsoleto', 'No conforme', 'Caducado'] },
            { id: 'reponer', label: '¿Reponer?', tipo: 'select', opciones: ['Sí', 'No'] },
          ]}
          onGuardar={v => {
            setDesechos(d => [...d, {
              id: `DE${d.length + 10}`, numero: `DES-000${25 + d.length - DESECHOS.length}`,
              producto: v.producto || 'MP-001', cantidad: Number(v.cantidad) || 0,
              udm: v.udm || 'kg', lote: v.lote.trim() || '—', motivo: v.motivo || 'Dañado',
              reponer: v.reponer === 'Sí', responsable: 'Camila Vargas', fecha: hoyISO(), estado: 'Registrado',
            }]);
            setModal(null);
            avisar('INV-26', 'Desecho registrado: retiro de material con motivo y decisión de reposición.');
          }}
        />
      )}
      {modal === 'ajusteValoracion' && (
        <ModalFormulario
          titulo="Ajuste de valoración"
          onClose={() => setModal(null)}
          campos={[
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'nuevoCosto', label: 'Nuevo costo unitario', tipo: 'number' },
            { id: 'motivo', label: 'Motivo', tipo: 'select', opciones: ['Recuento', 'Deterioro', 'Cambio de estándar', 'Error de captura'] },
          ]}
          onGuardar={v => {
            setModal(null);
            avisar('INV-27', `Ajuste de valoración de ${v.producto || '—'} a ${fmtMoney(Number(v.nuevoCosto) || 0)} registrado con impacto contable controlado.`);
          }}
        />
      )}
      {modal === 'importacion' && (
        <ModalFormulario
          titulo="Nueva liquidación de importación"
          onClose={() => setModal(null)}
          campos={[
            { id: 'recepcion', label: 'Recepción', tipo: 'select', opciones: RECEPCIONES.map(r => r.numero) },
            { id: 'valorBase', label: 'Valor base', tipo: 'number' },
            { id: 'flete', label: 'Flete', tipo: 'number' },
            { id: 'seguro', label: 'Seguro', tipo: 'number' },
            { id: 'arancel', label: 'Arancel', tipo: 'number' },
            { id: 'otros', label: 'Otros costos', tipo: 'number' },
            { id: 'metodoReparto', label: 'Método de reparto', tipo: 'select', opciones: ['Igual', 'Cantidad', 'Costo actual', 'Peso', 'Volumen'] },
          ]}
          onGuardar={v => {
            setCostosImp(c => [...c, {
              id: `CI${c.length + 10}`, recepcion: v.recepcion || 'REC-00096',
              proveedor: RECEPCIONES.find(r => r.numero === v.recepcion)?.proveedor ?? '—',
              valorBase: Number(v.valorBase) || 0, flete: Number(v.flete) || 0,
              seguro: Number(v.seguro) || 0, arancel: Number(v.arancel) || 0, otros: Number(v.otros) || 0,
              metodoReparto: (v.metodoReparto || 'Igual') as CostoImportacion['metodoReparto'], estado: 'Pendiente',
            }]);
            setModal(null);
            avisar('INV-28', 'Liquidación creada: fletes, seguros y aranceles listos para repartir.');
          }}
        />
      )}
      {modal === 'edi' && (
        <ModalFormulario
          titulo="Nueva entrega directa"
          onClose={() => setModal(null)}
          campos={[
            { id: 'proveedor', label: 'Proveedor', tipo: 'select', opciones: PROVEEDORES.map(p => p.nombre) },
            { id: 'cliente', label: 'Cliente', obligatorio: true },
            { id: 'producto', label: 'Producto', obligatorio: true },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'udm', label: 'Unidad', tipo: 'select', opciones: ['kg', 'L', 'un'] },
            { id: 'fecha', label: 'Fecha', placeholder: '2026-10-28' },
          ]}
          onGuardar={v => {
            setEntregasDir(e => [...e, {
              id: `ED${e.length + 10}`, numero: `EDI-000${16 + e.length - ENTREGAS_DIRECTAS.length}`,
              proveedor: v.proveedor || 'Proveedor', cliente: v.cliente.trim(), producto: v.producto.trim(),
              cantidad: Number(v.cantidad) || 0, udm: v.udm || 'un',
              fecha: v.fecha || hoyISO(), estado: 'Programada',
            }]);
            setModal(null);
            avisar('INV-29', 'Entrega directa programada: el proveedor entregará al cliente sin pasar por almacén.');
          }}
        />
      )}
      {modal === 'consignacion' && (
        <ModalFormulario
          titulo="Nueva consignación"
          onClose={() => setModal(null)}
          campos={[
            { id: 'propietario', label: 'Propietario (tercero)', obligatorio: true },
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'udm', label: 'Unidad', tipo: 'select', opciones: ['kg', 'L', 'un'] },
            { id: 'ubicacion', label: 'Ubicación', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
            { id: 'valor', label: 'Valor', tipo: 'number' },
          ]}
          onGuardar={v => {
            setConsignaciones(c => [...c, {
              id: `CN${c.length + 10}`, propietario: v.propietario.trim(), producto: v.producto || 'PT-101',
              cantidad: Number(v.cantidad) || 0, udm: v.udm || 'un',
              ubicacion: v.ubicacion || 'EST-03', valor: Number(v.valor) || 0, estado: 'En consignación',
            }]);
            setModal(null);
            avisar('INV-30', 'Consignación registrada: existencias de terceros separadas de las propias.');
          }}
        />
      )}
    </div>
  );
}

/* ----------------------------- pestaña trazabilidad ------------------------ */

function TabTrazabilidad({ avisar, feedback }: TabProps) {
  const [lotes, setLotes] = useState<LoteSerie[]>(LOTES_SERIES);
  const [fTipoLote, setFTipoLote] = useState('');
  const [qLote, setQLote] = useState('');
  const [referencias, setReferencias] = useState<ReferenciaDocumental[]>(REFERENCIAS_DOCUMENTALES);
  const [loteInforme, setLoteInforme] = useState(LOTES_SERIES[0].codigo);
  const [loteAudit, setLoteAudit] = useState(LOTES_SERIES[0].codigo);
  const [modal, setModal] = useState<string | null>(null);

  const loteSel = lotes.find(l => l.codigo === loteInforme);
  const lotesVisibles = lotes.filter(l =>
    (!fTipoLote || l.tipo === fTipoLote) &&
    (!qLote || `${l.codigo} ${l.producto}`.toLowerCase().includes(qLote.toLowerCase()))
  );
  const fefo = lotes.filter(l => l.retirada !== '—').sort((a, b) => a.retirada.localeCompare(b.retirada));
  const atras = MOVIMIENTOS.filter(m => m.lote === loteInforme && m.tipo === 'Entrada');
  const adelante = MOVIMIENTOS.filter(m => m.lote === loteInforme && m.tipo !== 'Entrada');
  const historialAudit = MOVIMIENTOS.filter(m => m.lote === loteAudit);

  return (
    <div className="space-y-4">
      {/* INV-31 Lotes y números de serie */}
      <FunctionBlock code="INV-31">
        <Toolbar>
          <input className={INPUT} placeholder="Buscar lote, serie o producto..." value={qLote} onChange={e => setQLote(e.target.value)} />
          <select className={INPUT} value={fTipoLote} onChange={e => setFTipoLote(e.target.value)}>
            <option value="">Lotes y series</option>
            <option>Lote</option><option>Serie</option>
          </select>
          <button className={BTN_PRIMARY} onClick={() => setModal('asignarLote')}>+ Asignar lote o serie</button>
        </Toolbar>
        {feedback['INV-31'] && <div className="mt-3"><Msg aviso={feedback['INV-31']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${lotesVisibles.length} de ${lotes.length} lotes y series`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Código</Th><Th align="center">Tipo</Th><Th>Producto</Th><Th>Origen</Th><Th>Caducidad</Th>
                <Th>Ubicación</Th><Th align="right">Cantidad</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lotesVisibles.map(l => (
                <tr key={l.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{l.codigo}</span></Td>
                  <Td align="center"><StatusBadge label={l.tipo} tone={l.tipo === 'Lote' ? 'petroleum' : 'blue'} /></Td>
                  <Td><span className="font-mono">{l.producto}</span></Td>
                  <Td><span className="font-mono">{l.origen}</span></Td>
                  <Td>{l.caducidad === '—' ? '—' : fmtFecha(l.caducidad)}</Td>
                  <Td><span className="font-mono">{l.ubicacion}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(l.cantidad)} {l.udm}</span></Td>
                  <Td align="center"><StatusBadge label={l.estado} tone={TONO_LOTE[l.estado]} /></Td>
                  <Td align="center">
                    <button className={BTN_GHOST} onClick={() => {
                      const n = MOVIMIENTOS.filter(m => m.lote === l.codigo).length;
                      avisar('INV-31', `${l.codigo} tiene ${n} movimientos registrados entre recepción, transferencias y producción.`);
                    }}>
                      Movimientos
                    </button>
                  </Td>
                </tr>
              ))}
              {lotesVisibles.length === 0 && <EmptyRow colSpan={9} text="No hay lotes o series que coincidan con los filtros." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-32 Fechas de caducidad */}
      <FunctionBlock code="INV-32">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('alerta')}>+ Configurar alerta</button>
        </Toolbar>
        {feedback['INV-32'] && <div className="mt-3"><Msg aviso={feedback['INV-32']} /></div>}
        <div className="mt-3">
          <DataTable footer="Los avisos se emiten antes del vencimiento según los días de alerta configurados.">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Lote</Th><Th>Producto</Th><Th>Caducidad</Th><Th>Consumo preferente</Th><Th>Retirada</Th>
                <Th align="right">Alerta (días)</Th><Th align="center">Días restantes</Th><Th align="center">Estado</Th><Th align="center">Aviso</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lotes.map(l => {
                const dias = diasHasta(l.caducidad);
                const proximo = dias !== null && dias >= 0 && dias <= l.alertaDias;
                const vencido = dias !== null && dias < 0;
                return (
                  <tr key={l.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{l.codigo}</span></Td>
                    <Td><span className="font-mono">{l.producto}</span></Td>
                    <Td>{l.caducidad === '—' ? '—' : fmtFecha(l.caducidad)}</Td>
                    <Td>{l.consumoPreferente === '—' ? '—' : fmtFecha(l.consumoPreferente)}</Td>
                    <Td>{l.retirada === '—' ? '—' : fmtFecha(l.retirada)}</Td>
                    <Td align="right"><span className="font-mono">{l.alertaDias || '—'}</span></Td>
                    <Td align="center">
                      <span className={`font-mono ${vencido ? 'text-red-600' : proximo ? 'text-amber-600' : 'text-gray-600'}`}>
                        {dias === null ? '—' : `${dias} d`}
                      </span>
                    </Td>
                    <Td align="center"><StatusBadge label={vencido ? 'Vencido' : l.estado} tone={vencido ? 'red' : TONO_LOTE[l.estado]} /></Td>
                    <Td align="center">
                      {proximo && <StatusBadge label="Próximo a vencer" tone="amber" />}
                      {vencido && <StatusBadge label="Bloqueado" tone="red" />}
                      {!proximo && !vencido && <span className="text-xs text-gray-400">—</span>}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-33 FEFO */}
      <FunctionBlock code="INV-33">
        <Toolbar>
          <button
            className={BTN_PRIMARY}
            onClick={() => {
              const primero = fefo[0];
              if (!primero) return;
              avisar('INV-33', `FEFO: se retira primero ${primero.codigo} (${primero.producto}) con fecha de retirada ${fmtFecha(primero.retirada)}.`);
            }}
          >
            Retirar con FEFO
          </button>
        </Toolbar>
        {feedback['INV-33'] && <div className="mt-3"><Msg aviso={feedback['INV-33']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${fefo.length} lotes ordenados por fecha de retirada más próxima`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th align="right">#</Th><Th>Lote</Th><Th>Producto</Th><Th>Fecha de retirada</Th>
                <Th align="right">Cantidad</Th><Th>Ubicación</Th><Th align="center">Sugerencia</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fefo.map((l, i) => (
                <tr key={l.id} className="hoverable">
                  <Td align="right"><span className="font-mono text-gray-500">{i + 1}</span></Td>
                  <Td><span className="font-mono text-gray-600">{l.codigo}</span></Td>
                  <Td><span className="font-mono">{l.producto}</span></Td>
                  <Td>{fmtFecha(l.retirada)}</Td>
                  <Td align="right"><span className="font-mono">{fmtNum(l.cantidad)} {l.udm}</span></Td>
                  <Td><span className="font-mono">{l.ubicacion}</span></Td>
                  <Td align="center">{i === 0 ? <StatusBadge label="Retirar primero" tone="green" /> : <span className="text-xs text-gray-400">—</span>}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-34 Reporte de trazabilidad */}
      <FunctionBlock code="INV-34">
        <Toolbar>
          <select className={INPUT} value={loteInforme} onChange={e => setLoteInforme(e.target.value)}>
            {LOTES_SERIES.map(l => <option key={l.codigo} value={l.codigo}>{l.codigo} — {l.producto}</option>)}
          </select>
          <span className="text-xs text-gray-500">Reconstruye la historia de {loteInforme} hacia atrás y hacia adelante.</span>
        </Toolbar>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <Card title="Hacia atrás (proveedor / producción)">
            <DataTable footer={`${atras.length} entrada(s)`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr><Th>Fecha</Th><Th>Documento</Th><Th>Origen</Th><Th>Destino</Th><Th align="right">Cantidad</Th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {atras.map(m => (
                  <tr key={m.id} className="hoverable">
                    <Td>{fmtFecha(m.fecha)}</Td>
                    <Td><span className="font-mono">{m.documento}</span></Td>
                    <Td><span className="font-mono">{m.origen}</span></Td>
                    <Td><span className="font-mono">{m.destino}</span></Td>
                    <Td align="right"><span className="font-mono text-green-700">+{fmtNum(m.cantidad)} {m.udm}</span></Td>
                  </tr>
                ))}
                {atras.length === 0 && <EmptyRow colSpan={5} text="Sin entradas registradas para este lote." />}
              </tbody>
            </DataTable>
          </Card>
          <Card title="Hacia adelante (clientes / producción)">
            <DataTable footer={`${adelante.length} movimiento(s)`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr><Th>Fecha</Th><Th>Documento</Th><Th>Origen</Th><Th>Destino</Th><Th align="right">Cantidad</Th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {adelante.map(m => (
                  <tr key={m.id} className="hoverable">
                    <Td>{fmtFecha(m.fecha)}</Td>
                    <Td><span className="font-mono">{m.documento}</span></Td>
                    <Td><span className="font-mono">{m.origen}</span></Td>
                    <Td><span className="font-mono">{m.destino}</span></Td>
                    <Td align="right"><span className="font-mono text-red-600">−{fmtNum(m.cantidad)} {m.udm}</span></Td>
                  </tr>
                ))}
                {adelante.length === 0 && <EmptyRow colSpan={5} text="Sin salidas registradas para este lote." />}
              </tbody>
            </DataTable>
          </Card>
        </div>
        {loteSel && (
          <p className="mt-3 text-xs text-gray-500">
            Estado actual: <StatusBadge label={loteSel.estado} tone={TONO_LOTE[loteSel.estado]} /> ·{' '}
            {loteSel.caducidad !== '—' ? `caduca el ${fmtFecha(loteSel.caducidad)}` : 'sin fecha de caducidad'} ·{' '}
            {fmtNum(loteSel.cantidad)} {loteSel.udm} en {loteSel.ubicacion}.
          </p>
        )}
      </FunctionBlock>

      {/* INV-35 Referencias documentales */}
      <FunctionBlock code="INV-35">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('referencia')}>+ Nueva referencia</button>
        </Toolbar>
        {feedback['INV-35'] && <div className="mt-3"><Msg aviso={feedback['INV-35']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${referencias.length} referencias documentales`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr><Th>Código</Th><Th>Nombre</Th><Th>Documentos agrupados</Th><Th>Propósito</Th><Th>Creada</Th><Th align="center">Acción</Th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {referencias.map(r => (
                <tr key={r.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{r.codigo}</span></Td>
                  <Td className="font-medium text-gray-800">{r.nombre}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {r.documentos.map(d => <span key={d} className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600">{d}</span>)}
                    </div>
                  </Td>
                  <Td>{r.proposito}</Td>
                  <Td>{fmtFecha(r.creada)}</Td>
                  <Td align="center">
                    <button className={BTN_GHOST} onClick={() => avisar('INV-35', `Referencia ${r.codigo} abierta para auditoría: ${r.documentos.length} documentos agrupados.`)}>
                      Auditar
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* modales de trazabilidad */}
      {modal === 'asignarLote' && (
        <ModalFormulario
          titulo="Asignar lote o serie"
          onClose={() => setModal(null)}
          campos={[
            { id: 'tipo', label: 'Tipo', tipo: 'select', opciones: ['Lote', 'Serie'] },
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'origen', label: 'Origen', tipo: 'select', opciones: [...RECEPCIONES.map(r => r.numero), 'PRD-014', 'PRD-015'] },
            { id: 'cantidad', label: 'Cantidad', tipo: 'number' },
            { id: 'caducidad', label: 'Caducidad', placeholder: '2027-01-15' },
            { id: 'ubicacion', label: 'Ubicación', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
          ]}
          onGuardar={v => {
            const nuevo: LoteSerie = {
              id: `LS${lotes.length + 10}`,
              codigo: v.tipo === 'Serie' ? `SN-00${42 + lotes.length}` : `L26${String(lotes.length + 1).padStart(2, '0')}A`,
              tipo: (v.tipo || 'Lote') as LoteSerie['tipo'],
              producto: v.producto || 'MP-001', origen: v.origen || 'REC-00096',
              caducidad: v.caducidad || '—', consumoPreferente: v.caducidad ? isoDentroDe(-30) : '—',
              retirada: v.caducidad ? isoDentroDe(-7) : '—', alertaDias: 15,
              ubicacion: v.ubicacion || 'EST-01', cantidad: Number(v.cantidad) || 0, udm: 'kg', estado: 'Disponible',
            };
            setLotes(l => [...l, nuevo]);
            setModal(null);
            avisar('INV-31', `${nuevo.tipo} ${nuevo.codigo} asignado a ${nuevo.producto} en ${nuevo.ubicacion}.`);
          }}
        />
      )}
      {modal === 'alerta' && (
        <ModalFormulario
          titulo="Configurar alerta de vencimiento"
          onClose={() => setModal(null)}
          campos={[
            { id: 'lote', label: 'Lote', tipo: 'select', opciones: LOTES_SERIES.filter(l => l.caducidad !== '—').map(l => l.codigo) },
            { id: 'dias', label: 'Días de anticipación', tipo: 'number' },
          ]}
          onGuardar={v => {
            setLotes(ls => ls.map(l => (l.codigo === v.lote ? { ...l, alertaDias: Number(v.dias) || 7 } : l)));
            setModal(null);
            avisar('INV-32', `Alerta configurada: el sistema avisará ${Number(v.dias) || 7} días antes del vencimiento de ${v.lote || '—'}.`);
          }}
        />
      )}
      {modal === 'referencia' && (
        <ModalFormulario
          titulo="Nueva referencia documental"
          onClose={() => setModal(null)}
          campos={[
            { id: 'nombre', label: 'Nombre', obligatorio: true },
            { id: 'documentos', label: 'Documentos (separados por coma)', anchoCompleto: true, placeholder: 'ENT-00510, DEV-00023' },
            { id: 'proposito', label: 'Propósito', anchoCompleto: true },
          ]}
          onGuardar={v => {
            setReferencias(r => [...r, {
              id: `RF${r.length + 10}`, codigo: `REF-${v.nombre.trim().slice(0, 3).toUpperCase()}-${String(r.length + 19).padStart(3, '0')}`,
              nombre: v.nombre.trim(), documentos: v.documentos.split(',').map(d => d.trim()).filter(Boolean),
              proposito: v.proposito.trim() || 'Auditoría y seguimiento', creada: hoyISO(),
            }]);
            setModal(null);
            avisar('INV-35', 'Referencia documental creada: movimientos de distintos documentos agrupados para auditoría.');
          }}
        />
      )}
    </div>
  );
}

/* --------------------------- pestaña reabastecimiento ---------------------- */

function TabReabastecimiento({ avisar, feedback }: TabProps) {
  const [puntos, setPuntos] = useState<PuntoPedido[]>(PUNTOS_PEDIDO);
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>(SUGERENCIAS);
  const [reabInterno, setReabInterno] = useState<ReabastecimientoInterno[]>(REABASTECIMIENTO_INTERNO);
  const [bajoPedido, setBajoPedido] = useState<BajoPedido[]>(BAJO_PEDIDO);
  const [modal, setModal] = useState<string | null>(null);
  const [puntoEdit, setPuntoEdit] = useState<PuntoPedido | null>(null);

  const disponibleDe = (producto: string): number => {
    const ex = EXISTENCIAS.find(e => e.producto === producto);
    return ex ? ex.fisica - ex.reservada : 0;
  };

  return (
    <div className="space-y-4">
      {/* INV-36 Puntos de pedido */}
      <FunctionBlock code="INV-36">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => setModal('punto')}>+ Nuevo punto de pedido</button>
        </Toolbar>
        {feedback['INV-36'] && <div className="mt-3"><Msg aviso={feedback['INV-36']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${puntos.length} puntos de pedido · ${puntos.filter(p => disponibleDe(p.producto) < p.minimo).length} bajo mínimo`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Producto</Th><Th>Ubicación</Th><Th align="right">Disponible</Th><Th align="right">Mínimo</Th>
                <Th align="right">Máximo</Th><Th align="right">Consumo diario</Th><Th align="right">Plazo (d)</Th>
                <Th>Ruta</Th><Th align="right">Cantidad a pedir</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {puntos.map(p => {
                const disp = disponibleDe(p.producto);
                const bajo = disp < p.minimo;
                return (
                  <tr key={p.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{p.producto}</span></Td>
                    <Td><span className="font-mono">{p.ubicacion}</span></Td>
                    <Td align="right"><span className={`font-mono ${bajo ? 'text-red-600 font-semibold' : ''}`}>{fmtNum(disp)}</span></Td>
                    <Td align="right"><span className="font-mono">{fmtNum(p.minimo)}</span></Td>
                    <Td align="right"><span className="font-mono">{fmtNum(p.maximo)}</span></Td>
                    <Td align="right"><span className="font-mono">{fmtNum(p.consumoDiario)}</span></Td>
                    <Td align="right"><span className="font-mono">{p.plazoDias}</span></Td>
                    <Td><span className="font-mono">{p.ruta}</span></Td>
                    <Td align="right"><span className="font-mono font-semibold text-petroleum-700">{fmtNum(p.cantidadPedir)}</span></Td>
                    <Td align="center">
                      {bajo
                        ? <StatusBadge label="Bajo mínimo" tone="red" />
                        : <StatusBadge label="OK" tone="green" />}
                    </Td>
                    <Td align="center">
                      <button className={BTN_GHOST} onClick={() => { setPuntoEdit(p); setModal('editarPunto'); }}>Editar</button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-37 Informe de reabastecimiento */}
      <FunctionBlock code="INV-37">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => avisar('INV-37', `Informe regenerado: ${sugerencias.filter(s => s.estado === 'Sugerida').length} necesidades detectadas sobre ${sugerencias.length} posiciones.`)}>
            Regenerar informe
          </button>
        </Toolbar>
        {feedback['INV-37'] && <div className="mt-3"><Msg aviso={feedback['INV-37']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${sugerencias.filter(s => s.estado === 'Sugerida').length} sugerencias pendientes de aplicar`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Producto</Th><Th align="right">Disponible</Th><Th align="right">Mínimo</Th><Th align="right">Cantidad sugerida</Th>
                <Th>Origen de la necesidad</Th><Th align="center">Acción recomendada</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sugerencias.map(s => (
                <tr key={s.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{s.producto}</span></Td>
                  <Td align="right"><span className={`font-mono ${s.disponible < s.minimo ? 'text-red-600' : ''}`}>{fmtNum(s.disponible)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(s.minimo)}</span></Td>
                  <Td align="right"><span className="font-mono font-semibold text-petroleum-700">{fmtNum(s.sugerida)}</span></Td>
                  <Td>{s.origen}</Td>
                  <Td align="center"><StatusBadge label={s.accion} tone={TONO_ACCION[s.accion]} /></Td>
                  <Td align="center"><StatusBadge label={s.estado} tone={TONO_SUGERENCIA[s.estado]} /></Td>
                  <Td align="center">
                    {s.estado === 'Sugerida' && (
                      <button className={BTN_GHOST} onClick={() => {
                        setSugerencias(ss => ss.map(x => (x.id === s.id ? { ...x, estado: 'Aplicada' } : x)));
                        avisar('INV-37', `Sugerencia aplicada: ${fmtNum(s.sugerida)} unidades de ${s.producto} (${s.accion}).`);
                      }}>
                        Aplicar
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-38 Previsión de existencias */}
      <FunctionBlock code="INV-38">
        <Toolbar>
          <span className="text-xs text-gray-500">Proyección de entradas, salidas y stock futuro por fecha, con alertas de faltantes y excesos.</span>
        </Toolbar>
        {feedback['INV-38'] && <div className="mt-3"><Msg aviso={feedback['INV-38']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${PREVISION.length} proyecciones · ${PREVISION.filter(p => p.estado === 'Faltante').length} faltantes · ${PREVISION.filter(p => p.estado === 'Exceso').length} excesos`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Producto</Th><Th>Fecha</Th><Th align="right">Entradas</Th><Th align="right">Salidas</Th>
                <Th align="right">Stock proyectado</Th><Th align="center">Estado</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {PREVISION.map(p => (
                <tr key={p.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{p.producto}</span></Td>
                  <Td>{fmtFecha(p.fecha)}</Td>
                  <Td align="right"><span className="font-mono text-green-700">+{fmtNum(p.entradas)}</span></Td>
                  <Td align="right"><span className="font-mono text-red-600">−{fmtNum(p.salidas)}</span></Td>
                  <Td align="right">
                    <span className={`font-mono font-semibold ${p.stockProyectado < 0 ? 'text-red-600' : p.estado === 'Exceso' ? 'text-amber-600' : 'text-gray-700'}`}>
                      {fmtNum(p.stockProyectado)}
                    </span>
                  </Td>
                  <Td align="center"><StatusBadge label={p.estado} tone={TONO_PREVISION[p.estado]} /></Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-39 Reabastecimiento entre almacenes */}
      <FunctionBlock code="INV-39">
        <Toolbar>
          <button className={BTN_PRIMARY} onClick={() => avisar('INV-39', 'Rutas R-RES evaluadas: se generaron las transferencias automáticas para los almacenes con faltantes.')}>
            Generar transferencias automáticas
          </button>
        </Toolbar>
        {feedback['INV-39'] && <div className="mt-3"><Msg aviso={feedback['INV-39']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${reabInterno.length} reabastecimientos entre almacenes`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Número</Th><Th>Origen</Th><Th>Destino</Th><Th>Producto</Th><Th align="right">Cantidad</Th>
                <Th>Ruta</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reabInterno.map(r => (
                <tr key={r.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{r.numero}</span></Td>
                  <Td><span className="font-mono">{r.origen}</span></Td>
                  <Td><span className="font-mono">{r.destino}</span></Td>
                  <Td><span className="font-mono">{r.producto}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(r.cantidad)} {r.udm}</span></Td>
                  <Td><span className="font-mono">{r.ruta}</span></Td>
                  <Td align="center"><StatusBadge label={r.estado} tone={TONO_REAB_INTERNO[r.estado]} /></Td>
                  <Td align="center">
                    {r.estado === 'Programado' && (
                      <button className={BTN_GHOST} onClick={() => {
                        setReabInterno(rs => rs.map(x => (x.id === r.id ? { ...x, estado: 'En tránsito' } : x)));
                        avisar('INV-39', `${r.numero} en tránsito: transferencia automática ${r.origen} → ${r.destino} iniciada.`);
                      }}>
                        Despachar
                      </button>
                    )}
                    {r.estado === 'En tránsito' && (
                      <button className={BTN_GHOST} onClick={() => {
                        setReabInterno(rs => rs.map(x => (x.id === r.id ? { ...x, estado: 'Completado' } : x)));
                        avisar('INV-39', `${r.numero} completado: ${fmtNum(r.cantidad)} ${r.udm} de ${r.producto} recibidos en ${r.destino}.`);
                      }}>
                        Completar
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-40 Producción o compra bajo pedido */}
      <FunctionBlock code="INV-40">
        <Toolbar>
          <span className="text-xs text-gray-500">Necesidades concretas que disparan compra u orden de producción sin tomar stock disponible.</span>
        </Toolbar>
        {feedback['INV-40'] && <div className="mt-3"><Msg aviso={feedback['INV-40']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${bajoPedido.length} necesidades bajo pedido`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Documento</Th><Th>Producto</Th><Th align="right">Cantidad</Th><Th>Fecha necesidad</Th>
                <Th align="center">Acción</Th><Th>Referencia generada</Th><Th align="center">Estado</Th><Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bajoPedido.map(b => (
                <tr key={b.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{b.documento}</span></Td>
                  <Td><span className="font-mono">{b.producto}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(b.cantidad)} {b.udm}</span></Td>
                  <Td>{fmtFecha(b.fechaNecesidad)}</Td>
                  <Td align="center"><StatusBadge label={b.accion} tone={TONO_ACCION[b.accion as Sugerencia['accion']]} /></Td>
                  <Td><span className="font-mono">{b.referencia}</span></Td>
                  <Td align="center"><StatusBadge label={b.estado} tone={TONO_BAJO_PEDIDO[b.estado]} /></Td>
                  <Td align="center">
                    {b.estado === 'Por disparar' && (
                      <button className={BTN_GHOST} onClick={() => {
                        const ref = b.accion === 'Compra' ? 'OC-00332' : 'OP-0143';
                        setBajoPedido(bs => bs.map(x => (x.id === b.id ? { ...x, estado: 'Disparada', referencia: ref } : x)));
                        avisar('INV-40', `Necesidad ${b.documento} disparada: ${b.accion === 'Compra' ? 'orden de compra' : 'orden de producción'} ${ref} creada.`);
                      }}>
                        {b.accion === 'Compra' ? 'Disparar compra' : 'Crear OP'}
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* modales de reabastecimiento */}
      {modal === 'punto' && (
        <ModalFormulario
          titulo="Nuevo punto de pedido"
          onClose={() => setModal(null)}
          campos={[
            { id: 'producto', label: 'Producto', tipo: 'select', opciones: PRODUCTOS.map(p => p.codigo) },
            { id: 'ubicacion', label: 'Ubicación', tipo: 'select', opciones: UBICACIONES.map(u => u.codigo) },
            { id: 'minimo', label: 'Mínimo', tipo: 'number' },
            { id: 'maximo', label: 'Máximo', tipo: 'number' },
            { id: 'consumoDiario', label: 'Consumo diario', tipo: 'number' },
            { id: 'plazoDias', label: 'Plazo (días)', tipo: 'number' },
            { id: 'ruta', label: 'Ruta', tipo: 'select', opciones: RUTAS.map(r => r.codigo) },
          ]}
          onGuardar={v => {
            const consumo = Number(v.consumoDiario) || 0;
            const plazo = Number(v.plazoDias) || 0;
            setPuntos(p => [...p, {
              id: `PP${p.length + 10}`, producto: v.producto || 'MP-001', ubicacion: v.ubicacion || 'EST-01',
              minimo: Number(v.minimo) || 0, maximo: Number(v.maximo) || 0,
              consumoDiario: consumo, plazoDias: plazo, ruta: v.ruta || 'R-COM',
              cantidadPedir: Math.round(consumo * plazo),
            }]);
            setModal(null);
            avisar('INV-36', 'Punto de pedido creado: la cantidad a pedir se calcula como consumo diario × plazo.');
          }}
        />
      )}
      {modal === 'editarPunto' && puntoEdit && (
        <ModalFormulario
          titulo={`Editar punto de pedido de ${puntoEdit.producto}`}
          onClose={() => setModal(null)}
          inicial={{
            minimo: String(puntoEdit.minimo), maximo: String(puntoEdit.maximo),
            consumoDiario: String(puntoEdit.consumoDiario), plazoDias: String(puntoEdit.plazoDias),
          }}
          campos={[
            { id: 'minimo', label: 'Mínimo', tipo: 'number' },
            { id: 'maximo', label: 'Máximo', tipo: 'number' },
            { id: 'consumoDiario', label: 'Consumo diario', tipo: 'number' },
            { id: 'plazoDias', label: 'Plazo (días)', tipo: 'number' },
          ]}
          onGuardar={v => {
            const consumo = Number(v.consumoDiario) || 0;
            const plazo = Number(v.plazoDias) || 0;
            setPuntos(ps => ps.map(x => (x.id === puntoEdit.id
              ? { ...x, minimo: Number(v.minimo) || 0, maximo: Number(v.maximo) || 0, consumoDiario: consumo, plazoDias: plazo, cantidadPedir: Math.round(consumo * plazo) }
              : x)));
            setModal(null);
            avisar('INV-36', `Punto de pedido de ${puntoEdit.producto} actualizado.`);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------ pestaña reportes --------------------------- */

function TabReportes({ avisar, feedback }: TabProps) {
  const [f41Prod, setF41Prod] = useState('');
  const [f41Tipo, setF41Tipo] = useState('');
  const [f41Resp, setF41Resp] = useState('');
  const [f41Desde, setF41Desde] = useState('');
  const [f41Hasta, setF41Hasta] = useState('');
  const [f42Prod, setF42Prod] = useState('');
  const [f42Ubi, setF42Ubi] = useState('');
  const [f42Prop, setF42Prop] = useState('');
  const [f42Lote, setF42Lote] = useState('');
  const [f43Cat, setF43Cat] = useState('');
  const [periodo, setPeriodo] = useState('Octubre 2026');
  const [loteRpt, setLoteRpt] = useState(LOTES_SERIES[0].codigo);

  const movs41 = MOVIMIENTOS.filter(m =>
    (!f41Prod || m.producto === f41Prod) &&
    (!f41Tipo || m.tipo === f41Tipo) &&
    (!f41Resp || m.responsable === f41Resp) &&
    (!f41Desde || m.fecha >= f41Desde) &&
    (!f41Hasta || m.fecha <= f41Hasta)
  );
  const entradas = movs41.filter(m => m.tipo === 'Entrada').reduce((a, m) => a + m.cantidad, 0);
  const salidas = movs41.filter(m => m.tipo === 'Salida').reduce((a, m) => a + m.cantidad, 0);
  const stock42 = EXISTENCIAS.filter(e =>
    (!f42Prod || e.producto === f42Prod) &&
    (!f42Ubi || e.ubicacion === f42Ubi) &&
    (!f42Prop || e.propietario === f42Prop) &&
    (!f42Lote || e.lote === f42Lote)
  );
  const val43 = VALORACION.map(v => ({ ...v, categoria: PRODUCTOS.find(p => p.codigo === v.producto)?.categoria ?? '—' }))
    .filter(v => !f43Cat || v.categoria === f43Cat);
  const hist44 = MOVIMIENTOS.filter(m => m.lote === loteRpt);

  return (
    <div className="space-y-4">
      {/* INV-41 Análisis de movimientos */}
      <FunctionBlock code="INV-41">
        <Toolbar>
          <select className={INPUT} value={f41Prod} onChange={e => setF41Prod(e.target.value)}>
            <option value="">Producto…</option>
            {PRODUCTOS.map(p => <option key={p.codigo} value={p.codigo}>{p.codigo}</option>)}
          </select>
          <select className={INPUT} value={f41Tipo} onChange={e => setF41Tipo(e.target.value)}>
            <option value="">Tipo…</option>
            <option>Entrada</option><option>Salida</option><option>Interno</option>
          </select>
          <select className={INPUT} value={f41Resp} onChange={e => setF41Resp(e.target.value)}>
            <option value="">Responsable…</option>
            {RESPONSABLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input type="date" className={INPUT} value={f41Desde} onChange={e => setF41Desde(e.target.value)} />
          <input type="date" className={INPUT} value={f41Hasta} onChange={e => setF41Hasta(e.target.value)} />
          <button className={BTN_PRIMARY} onClick={() => avisar('INV-41', 'Archivo movimientos-inv-2026-10.csv generado (simulado).')}>Exportar CSV</button>
        </Toolbar>
        {feedback['INV-41'] && <div className="mt-3"><Msg aviso={feedback['INV-41']} /></div>}
        <div className="mt-3 mb-3 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Entradas (unidades)', valor: fmtNum(entradas), cls: 'text-green-700' },
            { label: 'Salidas (unidades)', valor: fmtNum(salidas), cls: 'text-red-600' },
            { label: 'Movimientos', valor: fmtNum(movs41.length), cls: 'text-gray-800' },
          ].map(k => (
            <div key={k.label} className="rounded border border-gray-200 bg-gray-50 px-3 py-2">
              <div className="text-xs text-gray-500">{k.label}</div>
              <div className={`text-lg font-semibold tabular ${k.cls}`}>{k.valor}</div>
            </div>
          ))}
        </div>
        <DataTable footer={`${movs41.length} de ${MOVIMIENTOS.length} movimientos`}>
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Fecha</Th><Th>Documento</Th><Th>Producto</Th><Th>Ubicación</Th><Th align="right">Cantidad</Th>
              <Th>Lote</Th><Th>Responsable</Th><Th align="center">Tipo</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {movs41.map(m => (
              <tr key={m.id} className="hoverable">
                <Td>{fmtFecha(m.fecha)}</Td>
                <Td><span className="font-mono">{m.documento}</span></Td>
                <Td><span className="font-mono text-gray-600">{m.producto}</span></Td>
                <Td><span className="font-mono">{m.origen} → {m.destino}</span></Td>
                <Td align="right">
                  <span className={`font-mono ${m.tipo === 'Entrada' ? 'text-green-700' : m.tipo === 'Salida' ? 'text-red-600' : 'text-gray-700'}`}>
                    {m.tipo === 'Salida' ? '−' : '+'}{fmtNum(m.cantidad)} {m.udm}
                  </span>
                </Td>
                <Td><span className="font-mono">{m.lote}</span></Td>
                <Td>{m.responsable}</Td>
                <Td align="center"><StatusBadge label={m.tipo} tone={TONO_MOVIMIENTO[m.tipo]} /></Td>
              </tr>
            ))}
            {movs41.length === 0 && <EmptyRow colSpan={8} text="No hay movimientos que coincidan con los filtros." />}
          </tbody>
        </DataTable>

        {/* Rotación y antigüedad (análisis derivado de los movimientos) */}
        <div className="mt-4">
          <div className="mb-2 flex items-baseline gap-2">
            <h4 className="text-xs font-semibold text-gray-700">Rotación y antigüedad (últimos 60 días)</h4>
            <span className="text-[11px] text-gray-400">rotación = salidas ÷ stock promedio · cobertura en días</span>
          </div>
          <DataTable footer="Los artículos de rotación baja o antigüedad alta se marcan para revisión de política de inventario.">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Producto</Th>
                <Th>Nombre</Th>
                <Th align="right">Salidas 60 d</Th>
                <Th align="right">Stock promedio</Th>
                <Th align="right">Rotación</Th>
                <Th align="right">Cobertura</Th>
                <Th align="right">Antigüedad</Th>
                <Th align="center">Clasificación</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ROTACION.map(r => {
                const rot = r.stockPromedio > 0 ? r.salidasPeriodo / r.stockPromedio : 0;
                const tono = r.clasificacion === 'Alta' ? 'green' : r.clasificacion === 'Media' ? 'blue' : 'amber';
                return (
                  <tr key={r.producto} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{r.producto}</span></Td>
                    <Td>{r.nombre}</Td>
                    <Td align="right"><span className="font-mono">{fmtNum(r.salidasPeriodo)} {r.udm}</span></Td>
                    <Td align="right"><span className="font-mono">{fmtNum(r.stockPromedio)} {r.udm}</span></Td>
                    <Td align="right"><span className="font-mono">{fmtNum(rot)}×</span></Td>
                    <Td align="right"><span className="font-mono">{fmtNum(r.coberturaDias)} d</span></Td>
                    <Td align="right"><span className="font-mono">{fmtNum(r.antiguedadDias)} d</span></Td>
                    <Td align="center"><StatusBadge label={r.clasificacion} tone={tono} /></Td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-42 Stock por ubicación */}
      <FunctionBlock code="INV-42">
        <Toolbar>
          <select className={INPUT} value={f42Prod} onChange={e => setF42Prod(e.target.value)}>
            <option value="">Producto…</option>
            {PRODUCTOS.map(p => <option key={p.codigo} value={p.codigo}>{p.codigo}</option>)}
          </select>
          <select className={INPUT} value={f42Ubi} onChange={e => setF42Ubi(e.target.value)}>
            <option value="">Ubicación…</option>
            {UBICACIONES.map(u => <option key={u.codigo} value={u.codigo}>{u.codigo}</option>)}
          </select>
          <select className={INPUT} value={f42Prop} onChange={e => setF42Prop(e.target.value)}>
            <option value="">Propietario…</option>
            <option>Propio</option><option>Tercero</option>
          </select>
          <input className={INPUT} placeholder="Lote…" value={f42Lote} onChange={e => setF42Lote(e.target.value)} />
          <button className={BTN_PRIMARY} onClick={() => avisar('INV-42', 'Reporte stock-por-ubicacion-2026-10.csv generado (simulado).')}>Exportar CSV</button>
        </Toolbar>
        {feedback['INV-42'] && <div className="mt-3"><Msg aviso={feedback['INV-42']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${stock42.length} de ${EXISTENCIAS.length} posiciones`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Producto</Th><Th>Ubicación</Th><Th>Lote</Th><Th>Paquete</Th><Th align="center">Propietario</Th>
                <Th align="right">Física</Th><Th align="right">Reservada</Th><Th align="right">Disponible</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stock42.map(e => (
                <tr key={e.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{e.producto}</span></Td>
                  <Td><span className="font-mono">{e.ubicacion}</span></Td>
                  <Td><span className="font-mono">{e.lote}</span></Td>
                  <Td><span className="font-mono">{e.paquete}</span></Td>
                  <Td align="center"><StatusBadge label={e.propietario} tone={e.propietario === 'Propio' ? 'petroleum' : 'amber'} /></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(e.fisica)}</span></Td>
                  <Td align="right"><span className="font-mono text-amber-700">{fmtNum(e.reservada)}</span></Td>
                  <Td align="right"><span className="font-mono font-semibold text-petroleum-700">{fmtNum(e.fisica - e.reservada)}</span></Td>
                </tr>
              ))}
              {stock42.length === 0 && <EmptyRow colSpan={8} text="No hay posiciones que coincidan con los filtros." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-43 Valoración del inventario */}
      <FunctionBlock code="INV-43">
        <Toolbar>
          <select className={INPUT} value={f43Cat} onChange={e => setF43Cat(e.target.value)}>
            <option value="">Todas las categorías</option>
            {[...new Set(PRODUCTOS.map(p => p.categoria))].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className={INPUT} value={periodo} onChange={e => setPeriodo(e.target.value)}>
            <option>Octubre 2026</option><option>Septiembre 2026</option><option>Noviembre 2026</option>
          </select>
          <button className={BTN_PRIMARY} onClick={() => avisar('INV-43', `Valoración de inventario (${periodo}) exportada para contabilidad (simulado).`)}>
            Exportar contable
          </button>
        </Toolbar>
        {feedback['INV-43'] && <div className="mt-3"><Msg aviso={feedback['INV-43']} /></div>}
        <div className="mt-3">
          <DataTable footer={`Valor total (${periodo}): ${fmtMoney(val43.reduce((a, v) => a + v.valor, 0))}`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Producto</Th><Th>Categoría</Th><Th>Ubicación</Th><Th align="center">Método</Th>
                <Th align="right">Costo unitario</Th><Th align="right">Cantidad</Th><Th align="right">Valor</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {val43.map(v => (
                <tr key={v.id} className="hoverable">
                  <Td><span className="font-mono text-gray-600">{v.producto}</span></Td>
                  <Td>{v.categoria}</Td>
                  <Td><span className="font-mono">{EXISTENCIAS.find(e => e.producto === v.producto)?.ubicacion ?? '—'}</span></Td>
                  <Td align="center"><StatusBadge label={v.metodo} tone={TONO_METODO[v.metodo]} /></Td>
                  <Td align="right"><span className="font-mono">{fmtMoney(v.costo)}</span></Td>
                  <Td align="right"><span className="font-mono">{fmtNum(v.cantidad)}</span></Td>
                  <Td align="right"><span className="font-mono font-semibold">{fmtMoney(v.valor)}</span></Td>
                </tr>
              ))}
              {val43.length === 0 && <EmptyRow colSpan={7} text="No hay valoraciones para esa categoría." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>

      {/* INV-44 Trazabilidad */}
      <FunctionBlock code="INV-44">
        <Toolbar>
          <select className={INPUT} value={loteRpt} onChange={e => setLoteRpt(e.target.value)}>
            {LOTES_SERIES.map(l => <option key={l.codigo} value={l.codigo}>{l.codigo} — {l.producto}</option>)}
          </select>
          <button className={BTN_PRIMARY} onClick={() => avisar('INV-44', `Historial completo de ${loteRpt} exportado para auditoría (simulado).`)}>
            Exportar para auditoría
          </button>
        </Toolbar>
        {feedback['INV-44'] && <div className="mt-3"><Msg aviso={feedback['INV-44']} /></div>}
        <div className="mt-3">
          <DataTable footer={`${hist44.length} movimientos del historial de ${loteRpt}`}>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Fecha</Th><Th>Documento</Th><Th>Producto</Th><Th>Origen</Th><Th>Destino</Th>
                <Th align="right">Cantidad</Th><Th>Paquete</Th><Th>Responsable</Th><Th align="center">Tipo</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {hist44.map(m => (
                <tr key={m.id} className="hoverable">
                  <Td>{fmtFecha(m.fecha)}</Td>
                  <Td><span className="font-mono">{m.documento}</span></Td>
                  <Td><span className="font-mono text-gray-600">{m.producto}</span></Td>
                  <Td><span className="font-mono">{m.origen}</span></Td>
                  <Td><span className="font-mono">{m.destino}</span></Td>
                  <Td align="right">
                    <span className={`font-mono ${m.tipo === 'Entrada' ? 'text-green-700' : m.tipo === 'Salida' ? 'text-red-600' : 'text-gray-700'}`}>
                      {m.tipo === 'Salida' ? '−' : '+'}{fmtNum(m.cantidad)} {m.udm}
                    </span>
                  </Td>
                  <Td><span className="font-mono">{m.paquete}</span></Td>
                  <Td>{m.responsable}</Td>
                  <Td align="center"><StatusBadge label={m.tipo} tone={TONO_MOVIMIENTO[m.tipo]} /></Td>
                </tr>
              ))}
              {hist44.length === 0 && <EmptyRow colSpan={9} text="Sin movimientos registrados para este lote o serie." />}
            </tbody>
          </DataTable>
        </div>
      </FunctionBlock>
    </div>
  );
}

/* --------------------------------- página --------------------------------- */

const MOD = MODULOS.find(m => m.id === 'inv')!;

export default function INV() {
  const [tab, setTab] = useState('resumen');
  const [feedback, setFeedback] = useState<Record<string, Aviso>>({});

  const avisar = (clave: string, texto: string, tone?: Aviso['tone']) => {
    window.setTimeout(() => setFeedback(prev => ({ ...prev, [clave]: { texto, tone } })), 400);
  };

  const totalFisica = EXISTENCIAS.reduce((a, e) => a + e.fisica, 0);
  const totalValor = VALORACION.reduce((a, v) => a + v.valor, 0);
  const sugeridas = SUGERENCIAS.filter(s => s.estado === 'Sugerida').length;

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'config', label: 'Configuración', badge: 10 },
    { id: 'operacion', label: 'Operación', badge: 11 },
    { id: 'existencias', label: 'Existencias y ajustes', badge: 9 },
    { id: 'trazabilidad', label: 'Trazabilidad', badge: 5 },
    { id: 'reabastecimiento', label: 'Reabastecimiento', badge: 5 },
    { id: 'reportes', label: 'Reportes', badge: 4 },
  ];

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('inv')} funcionalidades · Fase ${MOD.fase}`}
        actions={
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">Datos de demostración · sin fetch</span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Almacenes" value={fmtNum(ALMACENES.length)} sub={`${UBICACIONES.length} ubicaciones · ${TIPOS_OPERACION.length} tipos de operación`} />
        <StatCard label="Existencias físicas" value={fmtNum(totalFisica)} sub={`${EXISTENCIAS.length} posiciones con stock`} tone="info" />
        <StatCard label="Valor del inventario" value={fmtMoney(totalValor)} sub="Costo estándar, promedio y FIFO" />
        <StatCard label="Reabastecimientos" value={fmtNum(sugeridas)} sub="Productos bajo mínimo o con necesidad" tone="warn" />
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'resumen' && <TabResumen />}
      {tab === 'config' && <TabConfiguracion avisar={avisar} feedback={feedback} />}
      {tab === 'operacion' && <TabOperacion avisar={avisar} feedback={feedback} />}
      {tab === 'existencias' && <TabExistencias avisar={avisar} feedback={feedback} />}
      {tab === 'trazabilidad' && <TabTrazabilidad avisar={avisar} feedback={feedback} />}
      {tab === 'reabastecimiento' && <TabReabastecimiento avisar={avisar} feedback={feedback} />}
      {tab === 'reportes' && <TabReportes avisar={avisar} feedback={feedback} />}
    </div>
  );
}

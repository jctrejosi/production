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
import { fmtNum } from '../lib/format';
import {
  NOMENCLATURAS,
  REGLAS,
  TIPOS_CODIGO,
  AIS_GS1,
  CODIGOS_PRODUCTO,
  CODIGOS_UBICACION,
  LOTES_SERIES,
  PAQUETES_SSCC,
  CODIGOS_CONTACTO,
  REGISTROS_ESCANEO,
  OPERACIONES_CAPTURA,
  PEDIDOS_ENTREGA,
  LINEAS_ENTREGA,
  ORDENES_FABRICACION,
  COMPONENTES_FABRICACION,
  ETIQUETAS,
  DISPOSITIVOS,
  interpretarCodigo,
  validarCodigoBarras,
} from '../data/cap';
import type {
  ReglaCodigo,
  LoteSerieCAP,
  PaqueteSSCC,
  LineaEntrega,
  ComponenteFabricacion,
  ResultadoValidacion,
} from '../data/cap';

const MOD = MODULOS.find(m => m.id === 'cap')!;

const SELECT = 'rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-petroleum-500';
const LABEL = 'block text-[11px] font-medium text-gray-500 mb-1';

interface ValidacionHistorial extends ResultadoValidacion {
  codigo: string;
}

export default function CAP() {
  const [tab, setTab] = useState('resumen');
  const [mensaje, setMensaje] = useState('');
  const avisar = (texto: string) => window.setTimeout(() => setMensaje(texto), 400);

  /* CAP-01/02 */
  const [reglas, setReglas] = useState<ReglaCodigo[]>(REGLAS);
  const [qNom, setQNom] = useState('');
  const [qRegla, setQRegla] = useState('');
  const [modalNuevaNom, setModalNuevaNom] = useState(false);
  const [modalNuevaRegla, setModalNuevaRegla] = useState(false);

  /* CAP-04/05 */
  const [codigoInterpretar, setCodigoInterpretar] = useState('10L-2026-118');
  const [resultadoInterpretar, setResultadoInterpretar] = useState(interpretarCodigo('10L-2026-118'));

  /* CAP-06..10 */
  const [qProd, setQProd] = useState('');
  const [qUbi, setQUbi] = useState('');
  const [filtroLote, setFiltroLote] = useState('Todos');
  const [filtroContacto, setFiltroContacto] = useState('Todos');
  const [lotes, setLotes] = useState<LoteSerieCAP[]>(LOTES_SERIES);
  const [paquetes, setPaquetes] = useState<PaqueteSSCC[]>(PAQUETES_SSCC);
  const [modalNuevoCodigo, setModalNuevoCodigo] = useState(false);
  const [modalPaquete, setModalPaquete] = useState(false);

  /* CAP-11 */
  const [codigoValidar, setCodigoValidar] = useState('7701234000011');
  const [historialValidaciones, setHistorialValidaciones] = useState<ValidacionHistorial[]>([
    { codigo: '003770123456789011', tipo: 'SSCC-18', ok: true, mensaje: 'Formato SSCC-18 válido con dígito de control 1.' },
  ]);

  /* CAP-12 */
  const [recepcionSel, setRecepcionSel] = useState('REC-1048');
  const [lineasRecepcion, setLineasRecepcion] = useState([
    { producto: 'Arepa de maíz x12', cantidad: 240, lote: 'L-2026-118', ubicacion: 'UBI-A-01-03' },
    { producto: 'Queso campesino 500 g', cantidad: 96, lote: 'L-2026-119', ubicacion: 'UBI-B-02-01' },
  ]);

  /* CAP-13 */
  const [origenTrans, setOrigenTrans] = useState('UBI-A-01-03');
  const [destinoTrans, setDestinoTrans] = useState('UBI-B-02-01');
  const [movimientos, setMovimientos] = useState([
    { id: 'MOV-01', producto: 'Arepa de maíz x12', lote: 'L-2026-118', paquete: '003770123456789011', cantidad: 120, estado: 'Validado' },
  ]);

  /* CAP-14 */
  const [pedidoSel, setPedidoSel] = useState('PED-7841');
  const [lineasEntrega, setLineasEntrega] = useState<LineaEntrega[]>(LINEAS_ENTREGA);

  /* CAP-15 */
  const [ubicacionConteo, setUbicacionConteo] = useState('UBI-A-01-03');
  const [productoConteo, setProductoConteo] = useState(CODIGOS_PRODUCTO[0].producto);
  const [cantidadConteo, setCantidadConteo] = useState('');
  const [conteos, setConteos] = useState([
    { ubicacion: 'UBI-A-01-03', producto: 'Arepa de maíz x12', contado: 120, sistema: 124, ajuste: -4 },
  ]);

  /* CAP-17 */
  const [loteNuevo, setLoteNuevo] = useState({ codigo: '', producto: CODIGOS_PRODUCTO[0].producto, vencimiento: '2026-11-30' });

  /* CAP-18 */
  const [ordenFab, setOrdenFab] = useState('OF-3210');
  const [componentes, setComponentes] = useState<ComponenteFabricacion[]>(COMPONENTES_FABRICACION);
  const [produccionFab, setProduccionFab] = useState('');

  const nomsFiltradas = useMemo(
    () => NOMENCLATURAS.filter(n => n.nombre.toLowerCase().includes(qNom.toLowerCase()) || n.planta.toLowerCase().includes(qNom.toLowerCase())),
    [qNom],
  );
  const reglasFiltradas = useMemo(
    () => reglas.filter(r => r.nombre.toLowerCase().includes(qRegla.toLowerCase()) || r.alias.toLowerCase().includes(qRegla.toLowerCase())),
    [reglas, qRegla],
  );
  const productosFiltrados = useMemo(
    () => CODIGOS_PRODUCTO.filter(p => p.producto.toLowerCase().includes(qProd.toLowerCase()) || p.codigo.includes(qProd)),
    [qProd],
  );
  const ubicacionesFiltradas = useMemo(
    () => CODIGOS_UBICACION.filter(u => u.codigo.toLowerCase().includes(qUbi.toLowerCase()) || u.zona.toLowerCase().includes(qUbi.toLowerCase())),
    [qUbi],
  );
  const lotesFiltrados = useMemo(
    () => lotes.filter(l => filtroLote === 'Todos' || l.tipo === filtroLote),
    [lotes, filtroLote],
  );
  const contactosFiltrados = useMemo(
    () => CODIGOS_CONTACTO.filter(c => filtroContacto === 'Todos' || c.tipo === filtroContacto),
    [filtroContacto],
  );
  const recepciones = OPERACIONES_CAPTURA.filter(o => o.tipo === 'Recepción');
  const escaneosRecepcion = REGISTROS_ESCANEO.filter(r => r.operacion.startsWith('Recepción'));
  const lineasPedido = lineasEntrega.filter(l => l.pedido === pedidoSel);
  const componentesOrden = componentes.filter(c => c.orden === ordenFab);

  /* acciones */
  function moverPrioridad(id: string, dir: -1 | 1) {
    setReglas(prev => {
      const ordenadas = [...prev].sort((a, b) => a.prioridad - b.prioridad);
      const i = ordenadas.findIndex(r => r.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= ordenadas.length) return prev;
      [ordenadas[i], ordenadas[j]] = [ordenadas[j], ordenadas[i]];
      return ordenadas.map((r, idx) => ({ ...r, prioridad: idx + 1 }));
    });
    avisar('Prioridad de reglas recalculada. Se evalúan de menor a mayor prioridad.');
  }

  function escanearRecepcion() {
    setLineasRecepcion(prev => [...prev, { producto: 'Panela redonda 400 g', cantidad: 120, lote: 'L-2026-112', ubicacion: ubicacionConteo }]);
    avisar(`Escaneo registrado en ${recepcionSel}: Panela redonda 400 g · 120 un · L-2026-112.`);
  }

  function registrarMovimiento() {
    setMovimientos(prev => [
      ...prev,
      {
        id: `MOV-0${prev.length + 2}`,
        producto: 'Café molido 250 g',
        lote: 'L-2026-101',
        paquete: '003770123456789037',
        cantidad: 180,
        estado: 'Pendiente',
      },
    ]);
    avisar(`Movimiento de ${origenTrans} → ${destinoTrans} registrado y pendiente de validación.`);
  }

  function aplicarConteo() {
    if (!cantidadConteo || Number(cantidadConteo) <= 0) {
      avisar('Ingrese una cantidad contada mayor a cero.');
      return;
    }
    setConteos(prev => [
      ...prev,
      { ubicacion: ubicacionConteo, producto: productoConteo, contado: Number(cantidadConteo), sistema: 110, ajuste: Number(cantidadConteo) - 110 },
    ]);
    setCantidadConteo('');
    avisar(`Ajuste aplicado: ${productoConteo} en ${ubicacionConteo} quedó en ${fmtNum(Number(cantidadConteo))} un.`);
  }

  function crearLote() {
    if (!loteNuevo.codigo.trim()) {
      avisar('Escriba o escanee el código del lote o serie.');
      return;
    }
    setLotes(prev => [
      { codigo: loteNuevo.codigo.trim(), tipo: 'Lote', producto: loteNuevo.producto, vencimiento: loteNuevo.vencimiento, cantidad: 0, estado: 'Disponible' },
      ...prev,
    ]);
    avisar(`Lote ${loteNuevo.codigo.trim()} creado y asignado a ${loteNuevo.producto}.`);
    setLoteNuevo({ ...loteNuevo, codigo: '' });
  }

  function registrarProduccion() {
    if (!produccionFab || Number(produccionFab) <= 0) {
      avisar('Ingrese la cantidad producida para registrar.');
      return;
    }
    avisar(`Producción de ${fmtNum(Number(produccionFab))} un registrada en ${ordenFab} y enlazada al lote L-2026-118.`);
    setProduccionFab('');
  }

  function cerrarOperacion() {
    avisar(`Operación de ${ordenFab} cerrada: consumo, producción y trazabilidad consolidados.`);
  }

  const conectados = DISPOSITIVOS.filter(d => d.estado === 'Conectado').length;

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('cap')} funcionalidades · Fase ${MOD.fase}`}
        actions={<StatusBadge label="Datos de demostración" tone="petroleum" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Reglas activas" value={`${REGLAS.filter(r => r.activa).length}/${REGLAS.length}`} sub="Nomenclatura estándar GS1" tone="info" />
        <StatCard label="Escaneos hoy" value="1.284" sub="98,4 % sin error" tone="ok" />
        <StatCard label="Operaciones abiertas" value={String(OPERACIONES_CAPTURA.filter(o => o.estado === 'Abierta').length)} sub="Recepción, transferencia, entrega y fabricación" />
        <StatCard label="Dispositivos conectados" value={`${conectados}/${DISPOSITIVOS.length}`} sub="Báscula Ohaus en mantenimiento" tone="warn" />
      </div>

      <Tabs
        tabs={[
          { id: 'resumen', label: 'Resumen' },
          { id: 'codigos', label: 'Códigos y nomenclatura', badge: 5 },
          { id: 'catalogos', label: 'Catálogos de códigos', badge: 6 },
          { id: 'operaciones', label: 'Operaciones por escáner', badge: 7 },
          { id: 'impresion', label: 'Etiquetas y configuración', badge: 2 },
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
              Registrar operaciones de almacén y producción mediante escáner, reduciendo errores y tiempos de digitación.
            </p>
          </Card>
          <Card title="Alcance">
            <p className="text-xs leading-relaxed text-gray-600">
              Nomenclaturas, reglas, códigos de producto, ubicación, lote, paquete y contacto, estándar GS1, recepciones,
              transferencias, entregas, conteos, fabricación y etiquetas.
            </p>
          </Card>
          <Card title="Actores">
            <div className="flex flex-wrap gap-1.5">
              {['Almacenista', 'Operario', 'Supervisor', 'Calidad', 'Logística'].map(a => (
                <StatusBadge key={a} label={a} tone="petroleum" />
              ))}
            </div>
          </Card>
          <Card title="Reglas de negocio">
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>Un código desconocido debe generar un error controlado.</li>
              <li>Las reglas se evalúan por prioridad.</li>
              <li>Los códigos deben ser únicos según el tipo.</li>
              <li>La captura debe respetar las validaciones de la operación.</li>
              <li>Toda operación debe quedar asociada a un usuario y fecha.</li>
            </ul>
          </Card>
          <Card title="Integraciones">
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>Inventario: recepciones, entregas, transferencias y conteos.</li>
              <li>Producción: consumo y producción.</li>
              <li>Calidad: controles en línea.</li>
              <li>Compras: recepción de proveedores.</li>
              <li>Dispositivos: lectores, impresoras y básculas.</li>
            </ul>
          </Card>
          <Card title="Criterios de aceptación">
            <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
              <li>El escaneo identifica correctamente producto, ubicación, lote y paquete.</li>
              <li>Las operaciones se validan sin digitación manual.</li>
              <li>Los errores de código se informan y no afectan el stock.</li>
              <li>Las etiquetas impresas son legibles y consistentes.</li>
              <li>La trazabilidad de la operación queda registrada.</li>
            </ul>
          </Card>
        </div>
      )}

      {tab === 'codigos' && (
        <div className="space-y-4">
          <FunctionBlock code="CAP-01">
            <Toolbar>
              <input className={INPUT} placeholder="Buscar nomenclatura o planta..." value={qNom} onChange={e => setQNom(e.target.value)} />
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => setModalNuevaNom(true)}>
                + Nueva nomenclatura
              </button>
            </Toolbar>
            <DataTable footer={`${nomsFiltradas.length} nomenclaturas · la activa se aplica por compañía o planta`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Nombre</Th>
                  <Th>Planta</Th>
                  <Th>Formato de entrada</Th>
                  <Th>Conversión de salida</Th>
                  <Th align="center">Reglas</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {nomsFiltradas.map(n => (
                  <tr key={n.id} className="hoverable">
                    <Td>
                      <span className="font-mono text-gray-600">{n.id}</span>
                      <div className="text-gray-800">{n.nombre}</div>
                    </Td>
                    <Td>{n.planta}</Td>
                    <Td className="font-mono text-gray-600">{n.entrada}</Td>
                    <Td className="font-mono text-gray-600">{n.salida}</Td>
                    <Td align="center" className="font-mono text-gray-600">{n.reglas}</Td>
                    <Td align="center">
                      <StatusBadge label={n.activa ? 'Activa' : 'Inactiva'} tone={n.activa ? 'green' : 'gray'} />
                    </Td>
                  </tr>
                ))}
                {nomsFiltradas.length === 0 && <EmptyRow colSpan={6} text="No hay nomenclaturas que coincidan con la búsqueda." />}
              </tbody>
            </DataTable>
            {modalNuevaNom && (
              <Modal title="Nueva nomenclatura" onClose={() => setModalNuevaNom(false)}>
                <div className="space-y-3 p-5">
                  <div>
                    <label className={LABEL}>Nombre</label>
                    <input className={INPUT} placeholder="Ej. Nomenclatura clientes mayoristas" data-initial-focus />
                  </div>
                  <div>
                    <label className={LABEL}>Planta</label>
                    <select className={`${SELECT} w-full`}>
                      <option>Planta Principal (PLA-01)</option>
                      <option>Centro de Distribución (CDI-01)</option>
                      <option>Todas las plantas</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>Formato de entrada</label>
                      <select className={`${SELECT} w-full`}>
                        <option>GS1-128</option>
                        <option>EAN-13</option>
                        <option>Código interno</option>
                      </select>
                    </div>
                    <div>
                      <label className={LABEL}>Formato de salida</label>
                      <select className={`${SELECT} w-full`}>
                        <option>EAN-13</option>
                        <option>GTIN-14</option>
                        <option>GS1-128</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalNuevaNom(false)}>Cancelar</button>
                    <button
                      className={BTN_PRIMARY}
                      onClick={() => {
                        setModalNuevaNom(false);
                        avisar('Nomenclatura creada para Planta Principal (PLA-01) y asignada a la compañía Mercaldas S.A.S.');
                      }}
                    >
                      Crear nomenclatura
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="CAP-02">
            <Toolbar>
              <input className={INPUT} placeholder="Buscar regla por nombre o alias..." value={qRegla} onChange={e => setQRegla(e.target.value)} />
              <span className="text-xs text-gray-500">Las reglas se evalúan por prioridad (menor = primero)</span>
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => setModalNuevaRegla(true)}>
                + Nueva regla
              </button>
            </Toolbar>
            <DataTable footer={`${reglasFiltradas.length} reglas · ${reglasFiltradas.filter(r => r.activa).length} activas`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th align="center">Prioridad</Th>
                  <Th>Nombre</Th>
                  <Th align="center">Tipo</Th>
                  <Th>Formato</Th>
                  <Th>Patrón</Th>
                  <Th>Alias</Th>
                  <Th align="center">Activa</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reglasFiltradas.map(r => (
                  <tr key={r.id} className="hoverable">
                    <Td align="center">
                      <span className="mr-1.5 font-mono text-gray-600">{r.prioridad}</span>
                      <button className={BTN_GHOST} onClick={() => moverPrioridad(r.id, -1)} aria-label="Subir prioridad">↑</button>
                      <button className={BTN_GHOST} onClick={() => moverPrioridad(r.id, 1)} aria-label="Bajar prioridad">↓</button>
                    </Td>
                    <Td>{r.nombre}</Td>
                    <Td align="center"><StatusBadge label={r.tipo} tone="petroleum" /></Td>
                    <Td className="font-mono text-gray-600">{r.formato}</Td>
                    <Td className="font-mono text-gray-500">{r.patron}</Td>
                    <Td className="font-mono text-gray-600">{r.alias}</Td>
                    <Td align="center">
                      <input
                        type="checkbox"
                        checked={r.activa}
                        onChange={() => {
                          setReglas(prev => prev.map(x => (x.id === r.id ? { ...x, activa: !x.activa } : x)));
                          avisar(`Regla «${r.nombre}» ${r.activa ? 'desactivada' : 'activada'}.`);
                        }}
                      />
                    </Td>
                  </tr>
                ))}
                {reglasFiltradas.length === 0 && <EmptyRow colSpan={7} text="No hay reglas que coincidan con la búsqueda." />}
              </tbody>
            </DataTable>
            {modalNuevaRegla && (
              <Modal title="Nueva regla de interpretación" onClose={() => setModalNuevaRegla(false)}>
                <div className="space-y-3 p-5">
                  <div>
                    <label className={LABEL}>Nombre</label>
                    <input className={INPUT} placeholder="Ej. Fecha de producción (AI 11)" data-initial-focus />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={LABEL}>Prioridad</label>
                      <input className={INPUT} type="number" defaultValue={9} />
                    </div>
                    <div>
                      <label className={LABEL}>Tipo</label>
                      <select className={`${SELECT} w-full`}>
                        <option>Producto</option>
                        <option>Peso</option>
                        <option>Ubicación</option>
                        <option>Lote</option>
                        <option>Serie</option>
                        <option>Paquete</option>
                        <option>Contacto</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>Patrón (expresión regular)</label>
                    <input className={INPUT} placeholder="^11\\d{6}$" />
                  </div>
                  <div>
                    <label className={LABEL}>Alias</label>
                    <input className={INPUT} placeholder="FECHA-PROD" />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalNuevaRegla(false)}>Cancelar</button>
                    <button
                      className={BTN_PRIMARY}
                      onClick={() => {
                        setModalNuevaRegla(false);
                        setReglas(prev => [
                          ...prev,
                          { id: `REG-0${prev.length + 1}`, nombre: 'Fecha de producción (AI 11)', prioridad: prev.length + 1, tipo: 'Producto', formato: 'GS1-128', patron: '^11\\d{6}$', alias: 'FECHA-PROD', activa: true },
                        ]);
                        avisar('Regla «Fecha de producción (AI 11)» creada con prioridad automática.');
                      }}
                    >
                      Crear regla
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="CAP-03">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {TIPOS_CODIGO.map(t => (
                <div key={t.tipo} className="rounded border border-gray-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <StatusBadge label={t.tipo} tone="petroleum" />
                    <span className="font-mono text-[11px] text-gray-400">AI {t.ai}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">{t.descripcion}</p>
                  <p className="mt-2 truncate font-mono text-[11px] text-gray-500">{t.ejemplo}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Además de los tipos base, se soportan tipos GS1 como cantidad (AI 37), fecha (AI 11/17), ubicación destino (AI 414) y tipo de paquete (AI 02).
            </p>
          </FunctionBlock>

          <FunctionBlock code="CAP-04">
            <Toolbar>
              <input className={INPUT} placeholder="Escanee o pegue el código..." value={codigoInterpretar} onChange={e => setCodigoInterpretar(e.target.value)} />
              <button
                className={BTN_PRIMARY}
                onClick={() => setResultadoInterpretar(interpretarCodigo(codigoInterpretar))}
              >
                Interpretar
              </button>
              <span className="flex-1" />
              {['7701234000011', '10L-2026-118', '003770123456789011', '310300054600'].map(c => (
                <button key={c} className={BTN_GHOST} onClick={() => { setCodigoInterpretar(c); setResultadoInterpretar(interpretarCodigo(c)); }}>
                  {c}
                </button>
              ))}
            </Toolbar>
            {resultadoInterpretar.ok ? (
              <div className="mt-3 grid gap-3 rounded border border-gray-200 bg-white p-3 sm:grid-cols-4">
                {[
                  ['Tipo', resultadoInterpretar.tipo ?? ''],
                  ['Valor', resultadoInterpretar.valor ?? ''],
                  ['Código base', resultadoInterpretar.base ?? ''],
                  ['Formato', resultadoInterpretar.formato ?? ''],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[11px] text-gray-400">{k}</div>
                    <div className="mt-0.5 font-mono text-xs text-gray-800">{v}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div role="alert" className="mt-3 rounded border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {resultadoInterpretar.error}
              </div>
            )}
          </FunctionBlock>

          <FunctionBlock code="CAP-05">
            <p className="mb-3 text-xs text-gray-500">
              GS1-128 usa identificadores de aplicación (AI) para interpretar cada segmento. El intérprete del módulo separa los AIs
              y convierte fechas, medidas e identificadores únicos al formato interno.
            </p>
            <DataTable footer={`${AIS_GS1.length} identificadores de aplicación soportados`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th align="center">AI</Th>
                  <Th>Nombre</Th>
                  <Th>Formato</Th>
                  <Th>Ejemplo</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {AIS_GS1.map(a => (
                  <tr key={a.ai} className="hoverable">
                    <Td align="center"><span className="font-mono text-petroleum-700">{a.ai}</span></Td>
                    <Td>{a.nombre}</Td>
                    <Td className="text-gray-500">{a.formato}</Td>
                    <Td className="font-mono text-gray-600">{a.ejemplo}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {tab === 'catalogos' && (
        <div className="space-y-4">
          <FunctionBlock code="CAP-06">
            <Toolbar>
              <input className={INPUT} placeholder="Buscar producto o código..." value={qProd} onChange={e => setQProd(e.target.value)} />
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => setModalNuevoCodigo(true)}>+ Asignar código</button>
            </Toolbar>
            <DataTable footer={`${productosFiltrados.length} productos con código asignado`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Producto</Th>
                  <Th>Código</Th>
                  <Th align="center">Tipo</Th>
                  <Th>Embalaje</Th>
                  <Th align="center">Validación</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {productosFiltrados.map(p => (
                  <tr key={p.codigo} className="hoverable">
                    <Td>{p.producto}</Td>
                    <Td className="font-mono text-gray-600">{p.codigo}</Td>
                    <Td align="center"><StatusBadge label={p.tipo} tone="blue" /></Td>
                    <Td>{p.embalaje}</Td>
                    <Td align="center"><StatusBadge label={p.validado ? 'Validado' : 'Pendiente'} tone={p.validado ? 'green' : 'amber'} /></Td>
                  </tr>
                ))}
                {productosFiltrados.length === 0 && <EmptyRow colSpan={5} text="No hay productos que coincidan con la búsqueda." />}
              </tbody>
            </DataTable>
            {modalNuevoCodigo && (
              <Modal title="Asignar código de producto" onClose={() => setModalNuevoCodigo(false)}>
                <div className="space-y-3 p-5">
                  <div>
                    <label className={LABEL}>Producto</label>
                    <input className={INPUT} placeholder="Ej. Avena en hojuelas 500 g" data-initial-focus />
                  </div>
                  <div>
                    <label className={LABEL}>Código EAN-13 / GTIN-14</label>
                    <input className={INPUT} placeholder="13 o 14 dígitos" />
                  </div>
                  <p className="text-xs text-gray-400">Se validará el formato y la unicidad antes de asignar.</p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalNuevoCodigo(false)}>Cancelar</button>
                    <button
                      className={BTN_PRIMARY}
                      onClick={() => {
                        setModalNuevoCodigo(false);
                        avisar('Código validado como único y asignado al producto. El catálogo quedó actualizado.');
                      }}
                    >
                      Validar y asignar
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="CAP-07">
            <Toolbar>
              <input className={INPUT} placeholder="Buscar ubicación..." value={qUbi} onChange={e => setQUbi(e.target.value)} />
              <span className="flex-1" />
              <button className={BTN_SECONDARY} onClick={() => avisar('Búsqueda por GLN ejecutada: UBI-A-01-03 asignada al almacén central.')}>
                Buscar por GLN
              </button>
            </Toolbar>
            <DataTable footer={`${ubicacionesFiltradas.length} ubicaciones codificadas`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Código</Th>
                  <Th>Almacén</Th>
                  <Th>Zona</Th>
                  <Th>Posición</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ubicacionesFiltradas.map(u => (
                  <tr key={u.codigo} className="hoverable">
                    <Td className="font-mono text-gray-600">{u.codigo}</Td>
                    <Td>{u.almacen}</Td>
                    <Td>{u.zona}</Td>
                    <Td>{u.posicion}</Td>
                    <Td align="center"><StatusBadge label={u.estado} tone={u.estado === 'Activa' ? 'green' : 'red'} /></Td>
                  </tr>
                ))}
                {ubicacionesFiltradas.length === 0 && <EmptyRow colSpan={5} text="No hay ubicaciones que coincidan con la búsqueda." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="CAP-08">
            <Toolbar>
              <select className={SELECT} value={filtroLote} onChange={e => setFiltroLote(e.target.value)}>
                <option>Todos</option>
                <option>Lote</option>
                <option>Serie</option>
              </select>
              <span className="text-xs text-gray-500">Identificación y búsqueda de lotes y números de serie</span>
            </Toolbar>
            <DataTable footer={`${lotesFiltrados.length} registros`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Código</Th>
                  <Th align="center">Tipo</Th>
                  <Th>Producto</Th>
                  <Th>Vencimiento</Th>
                  <Th align="right">Cantidad</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lotesFiltrados.map(l => (
                  <tr key={l.codigo} className="hoverable">
                    <Td className="font-mono text-gray-600">{l.codigo}</Td>
                    <Td align="center"><StatusBadge label={l.tipo} tone="blue" /></Td>
                    <Td>{l.producto}</Td>
                    <Td className="font-mono text-gray-500">{l.vencimiento}</Td>
                    <Td align="right" className="num-col">{fmtNum(l.cantidad)}</Td>
                    <Td align="center">
                      <StatusBadge
                        label={l.estado}
                        tone={l.estado === 'Disponible' ? 'green' : l.estado === 'Reservado' ? 'amber' : 'red'}
                      />
                    </Td>
                  </tr>
                ))}
                {lotesFiltrados.length === 0 && <EmptyRow colSpan={6} text="No hay lotes o series del tipo seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="CAP-09">
            <Toolbar>
              <input className={INPUT} placeholder="SSCC a validar..." defaultValue="003770123456789011" id="sscc-validar" />
              <button
                className={BTN_SECONDARY}
                onClick={() => {
                  const input = document.getElementById('sscc-validar') as HTMLInputElement | null;
                  const r = validarCodigoBarras(input?.value ?? '');
                  avisar(`${r.mensaje} (${r.tipo})`);
                }}
              >
                Validar SSCC
              </button>
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => setModalPaquete(true)}>+ Crear paquete</button>
            </Toolbar>
            <DataTable footer={`${paquetes.length} paquetes SSCC`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>SSCC</Th>
                  <Th>Contenido</Th>
                  <Th align="right">Cantidad</Th>
                  <Th>Ubicación</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paquetes.map(p => (
                  <tr key={p.sscc} className="hoverable">
                    <Td className="font-mono text-gray-600">{p.sscc}</Td>
                    <Td>{p.contenido}</Td>
                    <Td align="right" className="num-col">{fmtNum(p.cantidad)}</Td>
                    <Td className="font-mono text-gray-500">{p.ubicacion}</Td>
                    <Td align="center">
                      <StatusBadge
                        label={p.estado}
                        tone={p.estado === 'Cerrado' ? 'green' : p.estado === 'En tránsito' ? 'amber' : p.estado === 'Asignado' ? 'blue' : 'gray'}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            {modalPaquete && (
              <Modal title="Crear paquete SSCC" onClose={() => setModalPaquete(false)}>
                <div className="space-y-3 p-5">
                  <div>
                    <label className={LABEL}>Contenido</label>
                    <select className={`${SELECT} w-full`} data-initial-focus>
                      {CODIGOS_PRODUCTO.map(p => <option key={p.codigo}>{p.producto}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Cantidad</label>
                    <input className={INPUT} type="number" defaultValue={24} />
                  </div>
                  <div>
                    <label className={LABEL}>Ubicación</label>
                    <select className={`${SELECT} w-full`}>
                      {CODIGOS_UBICACION.map(u => <option key={u.codigo}>{u.codigo} · {u.zona}</option>)}
                    </select>
                  </div>
                  <p className="text-xs text-gray-400">El SSCC se genera con dígito de control GS1 y prefijo de compañía 770.</p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalPaquete(false)}>Cancelar</button>
                    <button
                      className={BTN_PRIMARY}
                      onClick={() => {
                        setModalPaquete(false);
                        setPaquetes(prev => [
                          { sscc: '003770123456789068', contenido: 'Caja arepas x24', cantidad: 24, ubicacion: 'UBI-A-01-03', estado: 'Creado' },
                          ...prev,
                        ]);
                        avisar('Paquete SSCC 003770123456789068 creado con dígito de control válido.');
                      }}
                    >
                      Crear paquete
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="CAP-10">
            <Toolbar>
              <select className={SELECT} value={filtroContacto} onChange={e => setFiltroContacto(e.target.value)}>
                <option>Todos</option>
                <option>Proveedor</option>
                <option>Cliente</option>
              </select>
              <span className="text-xs text-gray-500">Proveedores y clientes identificados por GLN</span>
            </Toolbar>
            <DataTable footer={`${contactosFiltrados.length} contactos`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th align="center">Tipo</Th>
                  <Th>Nombre</Th>
                  <Th>GLN</Th>
                  <Th>NIT</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {contactosFiltrados.map(c => (
                  <tr key={c.gln} className="hoverable">
                    <Td align="center"><StatusBadge label={c.tipo} tone={c.tipo === 'Proveedor' ? 'blue' : 'petroleum'} /></Td>
                    <Td>{c.nombre}</Td>
                    <Td className="font-mono text-gray-600">{c.gln}</Td>
                    <Td className="font-mono text-gray-500">{c.nit}</Td>
                    <Td align="center"><StatusBadge label={c.activo ? 'Activo' : 'Inactivo'} tone={c.activo ? 'green' : 'gray'} /></Td>
                  </tr>
                ))}
                {contactosFiltrados.length === 0 && <EmptyRow colSpan={5} text="No hay contactos del tipo seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="CAP-11">
            <Toolbar>
              <input
                className={INPUT}
                placeholder="Código a validar..."
                value={codigoValidar}
                onChange={e => setCodigoValidar(e.target.value)}
              />
              <button
                className={BTN_PRIMARY}
                onClick={() => {
                  const r = validarCodigoBarras(codigoValidar);
                  setHistorialValidaciones(prev => [{ codigo: codigoValidar, ...r }, ...prev]);
                  if (r.ok) avisar(r.mensaje);
                }}
              >
                Validar formato
              </button>
              <span className="text-xs text-gray-500">EAN-13 · GTIN-14 · SSCC-18 con dígito de control GS1</span>
            </Toolbar>
            <DataTable footer={`${historialValidaciones.length} validaciones en esta sesión`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Código</Th>
                  <Th align="center">Tipo</Th>
                  <Th>Resultado</Th>
                  <Th align="center">Dígito de control</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historialValidaciones.map((h, i) => (
                  <tr key={`${h.codigo}-${i}`} className="hoverable">
                    <Td className="font-mono text-gray-600">{h.codigo}</Td>
                    <Td align="center"><StatusBadge label={h.tipo} tone="blue" /></Td>
                    <Td className={h.ok ? 'text-green-700' : 'text-red-600'}>{h.mensaje}</Td>
                    <Td align="center"><StatusBadge label={h.ok ? 'Válido' : 'Inválido'} tone={h.ok ? 'green' : 'red'} /></Td>
                  </tr>
                ))}
                {historialValidaciones.length === 0 && <EmptyRow colSpan={4} text="Aún no hay validaciones en esta sesión." />}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {tab === 'operaciones' && (
        <div className="space-y-4">
          <FunctionBlock code="CAP-12">
            <Toolbar>
              <select className={SELECT} value={recepcionSel} onChange={e => setRecepcionSel(e.target.value)}>
                {recepciones.map(r => (
                  <option key={r.id} value={r.id}>{r.id} · {r.referencia}</option>
                ))}
              </select>
              <button className={BTN_SECONDARY} onClick={escanearRecepcion}>Escanear producto</button>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Recepción ${recepcionSel} validada: cantidades, lotes y ubicaciones confirmadas sin digitación.`)}>
                Validar recepción
              </button>
            </Toolbar>
            <DataTable footer={`${lineasRecepcion.length} líneas escaneadas en ${recepcionSel}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Producto</Th>
                  <Th align="right">Cantidad</Th>
                  <Th>Lote</Th>
                  <Th>Ubicación</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lineasRecepcion.map((l, i) => (
                  <tr key={`${l.producto}-${i}`} className="hoverable">
                    <Td>{l.producto}</Td>
                    <Td align="right" className="num-col">{fmtNum(l.cantidad)}</Td>
                    <Td className="font-mono text-gray-600">{l.lote}</Td>
                    <Td className="font-mono text-gray-600">{l.ubicacion}</Td>
                    <Td align="center"><StatusBadge label="Escaneado" tone="green" /></Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <div className="mt-3">
              <h4 className="mb-2 text-xs font-semibold text-gray-700">Registros recientes de escaneo</h4>
              <DataTable footer={`${escaneosRecepcion.length} registros de recepción`}>
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <Th>Fecha</Th>
                    <Th>Usuario</Th>
                    <Th>Código</Th>
                    <Th>Detalle</Th>
                    <Th align="center">Resultado</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {escaneosRecepcion.map(r => (
                    <tr key={r.id} className="hoverable">
                      <Td className="font-mono text-gray-500">{r.fechaHora}</Td>
                      <Td>{r.usuario}</Td>
                      <Td className="font-mono text-gray-600">{r.codigo}</Td>
                      <Td>{r.detalle}</Td>
                      <Td align="center"><StatusBadge label={r.resultado} tone={r.resultado === 'OK' ? 'green' : 'red'} /></Td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </div>
          </FunctionBlock>

          <FunctionBlock code="CAP-13">
            <Toolbar>
              <select className={SELECT} value={origenTrans} onChange={e => setOrigenTrans(e.target.value)}>
                {CODIGOS_UBICACION.map(u => <option key={u.codigo}>{u.codigo}</option>)}
              </select>
              <span className="text-xs text-gray-400">→</span>
              <select className={SELECT} value={destinoTrans} onChange={e => setDestinoTrans(e.target.value)}>
                {CODIGOS_UBICACION.map(u => <option key={u.codigo}>{u.codigo}</option>)}
              </select>
              <button className={BTN_SECONDARY} onClick={registrarMovimiento}>Registrar movimiento</button>
              <button className={BTN_PRIMARY} onClick={() => avisar('Transferencia TRF-0152 validada: producto, lote y paquete confirmados en origen y destino.')}>
                Validar transferencia
              </button>
            </Toolbar>
            <DataTable footer={`${movimientos.length} movimientos capturados`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>ID</Th>
                  <Th>Producto</Th>
                  <Th>Lote</Th>
                  <Th>Paquete</Th>
                  <Th align="right">Cantidad</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {movimientos.map(m => (
                  <tr key={m.id} className="hoverable">
                    <Td className="font-mono text-gray-500">{m.id}</Td>
                    <Td>{m.producto}</Td>
                    <Td className="font-mono text-gray-600">{m.lote}</Td>
                    <Td className="font-mono text-gray-600">{m.paquete}</Td>
                    <Td align="right" className="num-col">{fmtNum(m.cantidad)}</Td>
                    <Td align="center"><StatusBadge label={m.estado} tone={m.estado === 'Validado' ? 'green' : 'amber'} /></Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="CAP-14">
            <Toolbar>
              <select className={SELECT} value={pedidoSel} onChange={e => setPedidoSel(e.target.value)}>
                {PEDIDOS_ENTREGA.map(p => (
                  <option key={p.id} value={p.id}>{p.id} · {p.cliente}</option>
                ))}
              </select>
              <button
                className={BTN_PRIMARY}
                disabled={lineasPedido.some(l => !l.escaneado)}
                onClick={() => {
                  setLineasEntrega(prev => prev.map(l => (l.pedido === pedidoSel ? { ...l, escaneado: true } : l)));
                  avisar(`Pedido ${pedidoSel} confirmado: ${lineasPedido.length} línea(s) escaneada(s) y validada(s).`);
                }}
              >
                Confirmar cantidades
              </button>
              <span className="text-xs text-gray-500">{lineasPedido.filter(l => l.escaneado).length}/{lineasPedido.length} líneas escaneadas</span>
            </Toolbar>
            <DataTable footer={`${lineasPedido.length} líneas del pedido ${pedidoSel}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Producto</Th>
                  <Th align="right">Cantidad</Th>
                  <Th>Paquete</Th>
                  <Th align="center">Escaneado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lineasPedido.map(l => (
                  <tr key={l.id} className="hoverable">
                    <Td>{l.producto}</Td>
                    <Td align="right" className="num-col">{fmtNum(l.cantidad)}</Td>
                    <Td className="font-mono text-gray-600">{l.paquete}</Td>
                    <Td align="center">
                      <StatusBadge label={l.escaneado ? 'Sí' : 'Pendiente'} tone={l.escaneado ? 'green' : 'amber'} />
                    </Td>
                  </tr>
                ))}
                {lineasPedido.length === 0 && <EmptyRow colSpan={4} text="El pedido no tiene líneas." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="CAP-15">
            <Toolbar>
              <select className={SELECT} value={ubicacionConteo} onChange={e => setUbicacionConteo(e.target.value)}>
                {CODIGOS_UBICACION.map(u => <option key={u.codigo}>{u.codigo}</option>)}
              </select>
              <select className={SELECT} value={productoConteo} onChange={e => setProductoConteo(e.target.value)}>
                {CODIGOS_PRODUCTO.map(p => <option key={p.codigo}>{p.producto}</option>)}
              </select>
              <input className={INPUT} type="number" placeholder="Cantidad contada" value={cantidadConteo} onChange={e => setCantidadConteo(e.target.value)} />
              <button className={BTN_PRIMARY} onClick={aplicarConteo}>Aplicar ajuste</button>
            </Toolbar>
            <DataTable footer={`${conteos.length} ajustes de conteo aplicados`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Ubicación</Th>
                  <Th>Producto</Th>
                  <Th align="right">Contado</Th>
                  <Th align="right">Sistema</Th>
                  <Th align="right">Ajuste</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {conteos.map((c, i) => (
                  <tr key={`${c.ubicacion}-${i}`} className="hoverable">
                    <Td className="font-mono text-gray-600">{c.ubicacion}</Td>
                    <Td>{c.producto}</Td>
                    <Td align="right" className="num-col">{fmtNum(c.contado)}</Td>
                    <Td align="right" className="num-col">{fmtNum(c.sistema)}</Td>
                    <Td align="right" className={`num-col ${c.ajuste < 0 ? 'text-red-600' : 'text-green-700'}`}>{c.ajuste >= 0 ? '+' : ''}{fmtNum(c.ajuste)}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="CAP-16">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => setModalPaquete(true)}>Crear</button>
              <button className={BTN_SECONDARY} onClick={() => avisar('Paquete 003770123456789024 asignado al pedido PED-7841.')}>Asignar</button>
              <button className={BTN_SECONDARY} onClick={() => avisar('Paquete 003770123456789037 movido a UBI-B-03-02.')}>Mover</button>
              <button className={BTN_SECONDARY} onClick={() => avisar('Paquete anidado dentro de 003770123456789011 (pallet mixto).')}>Anidar</button>
              <button className={BTN_SECONDARY} onClick={() => avisar('Etiqueta SSCC enviada a la impresora Zebra ZT411.')}>Imprimir</button>
            </Toolbar>
            <DataTable footer={`${paquetes.length} paquetes SSCC gestionados por escáner`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>SSCC</Th>
                  <Th>Contenido</Th>
                  <Th align="right">Cantidad</Th>
                  <Th>Ubicación</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paquetes.map(p => (
                  <tr key={p.sscc} className="hoverable">
                    <Td className="font-mono text-gray-600">{p.sscc}</Td>
                    <Td>{p.contenido}</Td>
                    <Td align="right" className="num-col">{fmtNum(p.cantidad)}</Td>
                    <Td className="font-mono text-gray-500">{p.ubicacion}</Td>
                    <Td align="center">
                      <StatusBadge
                        label={p.estado}
                        tone={p.estado === 'Cerrado' ? 'green' : p.estado === 'En tránsito' ? 'amber' : p.estado === 'Asignado' ? 'blue' : 'gray'}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            {modalPaquete && (
              <Modal title="Crear paquete SSCC" onClose={() => setModalPaquete(false)}>
                <div className="space-y-3 p-5">
                  <div>
                    <label className={LABEL}>Contenido</label>
                    <select className={`${SELECT} w-full`} data-initial-focus>
                      {CODIGOS_PRODUCTO.map(p => <option key={p.codigo}>{p.producto}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Cantidad</label>
                    <input className={INPUT} type="number" defaultValue={24} />
                  </div>
                  <div>
                    <label className={LABEL}>Ubicación</label>
                    <select className={`${SELECT} w-full`}>
                      {CODIGOS_UBICACION.map(u => <option key={u.codigo}>{u.codigo} · {u.zona}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className={BTN_SECONDARY} onClick={() => setModalPaquete(false)}>Cancelar</button>
                    <button
                      className={BTN_PRIMARY}
                      onClick={() => {
                        setModalPaquete(false);
                        setPaquetes(prev => [
                          { sscc: '003770123456789075', contenido: 'Yogurt griego 170 g', cantidad: 60, ubicacion: 'UBI-B-03-02', estado: 'Creado' },
                          ...prev,
                        ]);
                        avisar('Paquete SSCC creado y listo para asignar.');
                      }}
                    >
                      Crear paquete
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </FunctionBlock>

          <FunctionBlock code="CAP-17">
            <Toolbar>
              <input
                className={INPUT}
                placeholder="Escanear o escribir lote/serie..."
                value={loteNuevo.codigo}
                onChange={e => setLoteNuevo({ ...loteNuevo, codigo: e.target.value })}
              />
              <select
                className={SELECT}
                value={loteNuevo.producto}
                onChange={e => setLoteNuevo({ ...loteNuevo, producto: e.target.value })}
              >
                {CODIGOS_PRODUCTO.map(p => <option key={p.codigo}>{p.producto}</option>)}
              </select>
              <input
                className={INPUT}
                type="date"
                value={loteNuevo.vencimiento}
                onChange={e => setLoteNuevo({ ...loteNuevo, vencimiento: e.target.value })}
              />
              <button className={BTN_PRIMARY} onClick={crearLote}>Crear y asignar</button>
            </Toolbar>
            <DataTable footer={`${lotes.length} lotes y series activos en planta`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Código</Th>
                  <Th align="center">Tipo</Th>
                  <Th>Producto</Th>
                  <Th>Vencimiento</Th>
                  <Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lotes.map(l => (
                  <tr key={l.codigo} className="hoverable">
                    <Td className="font-mono text-gray-600">{l.codigo}</Td>
                    <Td align="center"><StatusBadge label={l.tipo} tone="blue" /></Td>
                    <Td>{l.producto}</Td>
                    <Td className="font-mono text-gray-500">{l.vencimiento}</Td>
                    <Td align="center">
                      <StatusBadge label={l.estado} tone={l.estado === 'Disponible' ? 'green' : l.estado === 'Reservado' ? 'amber' : 'red'} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="CAP-18">
            <Toolbar>
              <select className={SELECT} value={ordenFab} onChange={e => setOrdenFab(e.target.value)}>
                {ORDENES_FABRICACION.map(o => (
                  <option key={o.id} value={o.id}>{o.id} · {o.producto} · {fmtNum(o.cantidad)} un</option>
                ))}
              </select>
              <input className={INPUT} type="number" placeholder="Cantidad producida" value={produccionFab} onChange={e => setProduccionFab(e.target.value)} />
              <button className={BTN_SECONDARY} onClick={registrarProduccion}>Registrar producción</button>
              <button className={BTN_PRIMARY} onClick={cerrarOperacion}>Cerrar operación</button>
            </Toolbar>
            <DataTable footer={`${componentesOrden.length} componentes de ${ordenFab}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Material</Th>
                  <Th align="right">Cantidad</Th>
                  <Th align="center">Unidad</Th>
                  <Th align="center">Consumo</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {componentesOrden.map(c => (
                  <tr key={c.id} className="hoverable">
                    <Td>{c.material}</Td>
                    <Td align="right" className="num-col">{fmtNum(c.cantidad)}</Td>
                    <Td align="center" className="text-gray-500">{c.unidad}</Td>
                    <Td align="center">
                      {c.escaneado ? (
                        <StatusBadge label="Escaneado" tone="green" />
                      ) : (
                        <button
                          className={BTN_GHOST}
                          onClick={() => {
                            setComponentes(prev => prev.map(x => (x.id === c.id ? { ...x, escaneado: true } : x)));
                            avisar(`Consumo de ${c.material} registrado por escáner en ${ordenFab}.`);
                          }}
                        >
                          Escanear componente
                        </button>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {tab === 'impresion' && (
        <div className="space-y-4">
          <FunctionBlock code="CAP-19">
            <Toolbar>
              <span className="text-xs text-gray-500">Formatos configurables por tipo de etiqueta (ZPL / EPL)</span>
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => avisar('Lote de etiquetas enviado a Zebra ZT411 (línea de empaque).')}>
                Imprimir lote
              </button>
            </Toolbar>
            <DataTable footer={`${ETIQUETAS.length} trabajos de etiquetado`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th align="center">Tipo</Th>
                  <Th>Referencia</Th>
                  <Th>Formato</Th>
                  <Th align="right">Cantidad</Th>
                  <Th>Fecha</Th>
                  <Th align="center">Estado</Th>
                  <Th align="center">Acción</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ETIQUETAS.map(e => (
                  <tr key={e.id} className="hoverable">
                    <Td align="center"><StatusBadge label={e.tipo} tone="petroleum" /></Td>
                    <Td>{e.referencia}</Td>
                    <Td className="text-gray-500">{e.formato}</Td>
                    <Td align="right" className="num-col">{fmtNum(e.cantidad)}</Td>
                    <Td className="font-mono text-gray-500">{e.fecha}</Td>
                    <Td align="center">
                      <StatusBadge
                        label={e.estado}
                        tone={e.estado === 'Impresas' ? 'green' : e.estado === 'Pendientes' ? 'amber' : 'red'}
                      />
                    </Td>
                    <Td align="center">
                      <button className={BTN_GHOST} onClick={() => avisar(`Etiqueta ${e.tipo} «${e.referencia}» reimpresa en formato ${e.formato}.`)}>
                        Imprimir
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="CAP-20">
            <Toolbar>
              {['Nomenclaturas', 'Reglas', 'GS1', 'Operaciones', 'Impresión'].map(area => (
                <button key={area} className={BTN_SECONDARY} onClick={() => avisar(`Configuración de «${area}» guardada para la planta activa.`)}>
                  {area}
                </button>
              ))}
              <span className="flex-1" />
              <button className={BTN_PRIMARY} onClick={() => avisar('Dispositivos sincronizados: configuraciones propagadas a lectores, impresoras y básculas.')}>
                Sincronizar dispositivos
              </button>
            </Toolbar>
            <DataTable footer={`${DISPOSITIVOS.length} dispositivos registrados`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>ID</Th>
                  <Th>Nombre</Th>
                  <Th align="center">Tipo</Th>
                  <Th>Ubicación</Th>
                  <Th align="center">Estado</Th>
                  <Th>Última sincronización</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DISPOSITIVOS.map(d => (
                  <tr key={d.id} className="hoverable">
                    <Td className="font-mono text-gray-500">{d.id}</Td>
                    <Td>{d.nombre}</Td>
                    <Td align="center"><StatusBadge label={d.tipo} tone="blue" /></Td>
                    <Td>{d.ubicacion}</Td>
                    <Td align="center">
                      <StatusBadge
                        label={d.estado}
                        tone={d.estado === 'Conectado' ? 'green' : d.estado === 'Mantenimiento' ? 'amber' : 'red'}
                      />
                    </Td>
                    <Td className="text-gray-500">{d.ultimaSincro}</Td>
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

import { useMemo, useState } from 'react';
import {
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
import { fmtNum, fmtPct } from '../lib/format';
import {
  ALARMAS,
  BASCULAS,
  CAPTURAS,
  CONTROLES_SEGURIDAD,
  MAQUINAS,
  MES_EXTERNOS,
  PLCS,
  REGLAS_IOT,
  SALUD_OT,
  SCADA_NODOS,
  SENSORES,
  SERIES_HISTORIADOR,
  type AlarmaIot,
  type Criticidad,
  type ReglaIot,
} from '../data/iot';

const MOD = MODULOS.find(m => m.id === 'iot')!;

const SELECT =
  'rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-800 outline-none transition focus:border-petroleum-500 focus:ring-2 focus:ring-petroleum-100';

function MensajeOk({ texto }: { texto: string }) {
  return (
    <div role="status" className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      {texto}
    </div>
  );
}

function toneEstado(estado: string): BadgeTone {
  if (['En línea', 'Operando', 'Resuelta', 'Habilitada', 'Cumple', 'Saludable', 'Normal'].includes(estado)) return 'green';
  if (['Degradado', 'En parada', 'Reconocida', 'En revisión', 'Atención'].includes(estado)) return 'amber';
  if (['Desconectado', 'En alarma', 'Activa', 'Crítico', 'Alerta', 'Deshabilitada'].includes(estado)) return 'red';
  return 'gray';
}

function toneCriticidad(c: Criticidad): BadgeTone {
  return c === 'Alta' ? 'red' : c === 'Media' ? 'amber' : 'gray';
}

/* ------------------------------- IOT-01 ---------------------------------- */

function BloquePLC() {
  const [q, setQ] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modal, setModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [protocolo, setProtocolo] = useState('Modbus TCP');
  const [ip, setIp] = useState('');

  const visibles = useMemo(() => {
    const t = q.trim().toLocaleLowerCase('es');
    if (!t) return PLCS;
    return PLCS.filter(p => [p.nombre, p.ip, p.protocolo, p.segmento].join(' ').toLocaleLowerCase('es').includes(t));
  }, [q]);

  function probar(objetivo: string) {
    window.setTimeout(() => setMensaje(`Conexión verificada con ${objetivo}: lectura de tags correcta (simulado).`), 400);
  }

  function guardar() {
    window.setTimeout(() => {
      setMensaje(`Conexión «${nombre}» registrada con protocolo ${protocolo} en ${ip} (simulado).`);
      setModal(false);
      setNombre('');
      setIp('');
    }, 400);
  }

  return (
    <FunctionBlock code="IOT-01">
      <Toolbar>
        <input className={`${INPUT} max-w-xs`} placeholder="Buscar por nombre, IP o protocolo..." value={q} onChange={e => setQ(e.target.value)} />
        <button type="button" className={BTN_SECONDARY} onClick={() => probar('todos los PLC en línea')}>Probar conexión</button>
        <button type="button" className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nueva conexión</button>
        <span className="text-xs text-gray-500">{visibles.length} de {PLCS.length} controladores</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer="Protocolos industriales estándar: Modbus TCP, OPC UA, EtherNet/IP y Profibus.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Controlador</Th>
            <Th>Protocolo</Th>
            <Th>IP</Th>
            <Th>Segmento</Th>
            <Th align="center">Tags</Th>
            <Th align="center">Estado</Th>
            <Th align="right">Última lectura</Th>
            <Th align="center">Acción</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(p => (
            <tr key={p.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{p.id}</span></Td>
              <Td className="font-medium text-gray-800">{p.nombre}</Td>
              <Td>{p.protocolo}</Td>
              <Td className="font-mono text-gray-500">{p.ip}</Td>
              <Td>{p.segmento}</Td>
              <Td align="center"><span className="font-mono">{fmtNum(p.tags)}</span></Td>
              <Td align="center"><StatusBadge label={p.estado} tone={toneEstado(p.estado)} /></Td>
              <Td align="right" className="font-mono text-gray-500">{p.ultimaLectura}</Td>
              <Td align="center">
                <button type="button" className="rounded px-2 py-1 text-xs text-petroleum-600 hover:bg-petroleum-50" onClick={() => probar(p.id)}>Ping</button>
              </Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={9} text="No hay controladores que coincidan con la búsqueda." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nueva conexión PLC" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <label className="block text-xs text-gray-600">
              Nombre del controlador
              <input data-initial-focus className={`${INPUT} mt-1`} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej.: PLC Mezcladora MEZ-02" />
            </label>
            <label className="block text-xs text-gray-600">
              Protocolo
              <select className={`${SELECT} mt-1 w-full`} value={protocolo} onChange={e => setProtocolo(e.target.value)}>
                {['Modbus TCP', 'OPC UA', 'EtherNet/IP', 'Profibus'].map(p => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="block text-xs text-gray-600">
              Dirección IP
              <input className={`${INPUT} mt-1 font-mono`} value={ip} onChange={e => setIp(e.target.value)} placeholder="10.20.x.x" />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="button" className={BTN_PRIMARY} onClick={guardar} disabled={!nombre.trim()}>Guardar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-02 ---------------------------------- */

function BloqueSensores() {
  const [tipo, setTipo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const visibles = useMemo(() => {
    if (!tipo) return SENSORES;
    return SENSORES.filter(s => s.tipo === tipo);
  }, [tipo]);

  function leerAhora() {
    window.setTimeout(() => setMensaje('Lectura forzada de los sensores ejecutada: valores con marca de tiempo registrados (simulado).'), 400);
  }

  return (
    <FunctionBlock code="IOT-02">
      <Toolbar>
        <select className={SELECT} value={tipo} onChange={e => setTipo(e.target.value)} aria-label="Filtrar por tipo de sensor">
          <option value="">Todos los tipos</option>
          {['Temperatura', 'Presión', 'Humedad', 'Vibración', 'Flujo', 'pH'].map(t => <option key={t}>{t}</option>)}
        </select>
        <button type="button" className={BTN_PRIMARY} onClick={leerAhora}>Leer ahora</button>
        <span className="text-xs text-gray-500">{visibles.length} sensores · {SENSORES.filter(s => s.estado === 'Alerta').length} en alerta</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer="Toda lectura se registra con marca de tiempo y origen del dispositivo.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Sensor</Th>
            <Th>Tipo</Th>
            <Th>Equipo</Th>
            <Th align="right">Valor</Th>
            <Th align="right">Rango</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(s => (
            <tr key={s.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{s.id}</span></Td>
              <Td className="font-medium text-gray-800">{s.nombre}</Td>
              <Td>{s.tipo}</Td>
              <Td className="font-mono text-gray-500">{s.equipo}</Td>
              <Td align="right" className="font-mono">{fmtNum(s.valor)} {s.unidad}</Td>
              <Td align="right" className="font-mono text-gray-500">{fmtNum(s.minimo)} – {fmtNum(s.maximo)} {s.unidad}</Td>
              <Td align="center"><StatusBadge label={s.estado} tone={toneEstado(s.estado)} /></Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={7} text="No hay sensores de ese tipo." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-03 ---------------------------------- */

function BloqueBasculas() {
  const [modal, setModal] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [bascula, setBascula] = useState(BASCULAS[0].id);
  const [producto, setProducto] = useState('');
  const [lote, setLote] = useState('');
  const [peso, setPeso] = useState('');

  function registrarPesaje() {
    window.setTimeout(() => {
      setMensaje(`Pesaje de ${peso} kg registrado: ${producto || 'producto'} · ${lote || 'sin lote'} en ${bascula} (simulado).`);
      setModal(false);
      setProducto('');
      setLote('');
      setPeso('');
    }, 400);
  }

  return (
    <FunctionBlock code="IOT-03">
      <Toolbar>
        <button type="button" className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nuevo pesaje</button>
        <span className="text-xs text-gray-500">El peso se asocia a producto, lote y operación de origen.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`${BASCULAS.length} básculas conectadas a la red OT.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Báscula</Th>
            <Th>Ubicación</Th>
            <Th align="right">Capacidad</Th>
            <Th>Producto</Th>
            <Th>Lote</Th>
            <Th align="right">Último pesaje</Th>
            <Th align="right">Fecha</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {BASCULAS.map(b => (
            <tr key={b.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{b.id}</span></Td>
              <Td className="font-medium text-gray-800">{b.nombre}</Td>
              <Td>{b.ubicacion}</Td>
              <Td align="right" className="font-mono">{fmtNum(b.capacidadKg)} kg</Td>
              <Td>{b.producto}</Td>
              <Td><span className="font-mono text-gray-500">{b.lote}</span></Td>
              <Td align="right" className="font-mono">{b.ultimoPesajeKg > 0 ? `${fmtNum(b.ultimoPesajeKg)} kg` : '—'}</Td>
              <Td align="right" className="font-mono text-gray-500">{b.fecha}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nuevo pesaje" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <label className="block text-xs text-gray-600">
              Báscula
              <select data-initial-focus className={`${SELECT} mt-1 w-full`} value={bascula} onChange={e => setBascula(e.target.value)}>
                {BASCULAS.map(b => <option key={b.id} value={b.id}>{b.id} · {b.nombre}</option>)}
              </select>
            </label>
            <label className="block text-xs text-gray-600">
              Producto
              <input className={`${INPUT} mt-1`} value={producto} onChange={e => setProducto(e.target.value)} placeholder="Ej.: Pulpa de mora" />
            </label>
            <label className="block text-xs text-gray-600">
              Lote
              <input className={`${INPUT} mt-1 font-mono`} value={lote} onChange={e => setLote(e.target.value)} placeholder="Ej.: L-2026-118" />
            </label>
            <label className="block text-xs text-gray-600">
              Peso (kg)
              <input className={`${INPUT} mt-1 font-mono`} value={peso} onChange={e => setPeso(e.target.value)} placeholder="0.0" />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="button" className={BTN_PRIMARY} onClick={registrarPesaje} disabled={!producto.trim() || !peso.trim()}>Registrar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-04 ---------------------------------- */

function BloqueMaquinas() {
  const [q, setQ] = useState('');
  const visibles = useMemo(() => {
    const t = q.trim().toLocaleLowerCase('es');
    if (!t) return MAQUINAS;
    return MAQUINAS.filter(m => m.nombre.toLocaleLowerCase('es').includes(t));
  }, [q]);

  return (
    <FunctionBlock code="IOT-04">
      <Toolbar>
        <input className={`${INPUT} max-w-xs`} placeholder="Buscar máquina..." value={q} onChange={e => setQ(e.target.value)} />
        <span className="text-xs text-gray-500">Estados, ciclos y contadores leídos directamente de cada equipo.</span>
      </Toolbar>
      <DataTable footer={`${visibles.length} máquinas · ${MAQUINAS.reduce((a, m) => a + m.alarmasActivas, 0)} alarmas activas en campo`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Máquina</Th>
            <Th align="center">Estado</Th>
            <Th align="right">Ciclos</Th>
            <Th align="right">Contador de piezas</Th>
            <Th align="center">Alarmas activas</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(m => (
            <tr key={m.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{m.id}</span></Td>
              <Td className="font-medium text-gray-800">{m.nombre}</Td>
              <Td align="center"><StatusBadge label={m.estado} tone={toneEstado(m.estado)} /></Td>
              <Td align="right" className="font-mono">{fmtNum(m.ciclos)}</Td>
              <Td align="right" className="font-mono">{fmtNum(m.contadorPiezas)} un</Td>
              <Td align="center">
                {m.alarmasActivas > 0
                  ? <StatusBadge label={String(m.alarmasActivas)} tone="red" />
                  : <span className="text-gray-300">—</span>}
              </Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={6} text="No hay máquinas que coincidan con la búsqueda." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-05 ---------------------------------- */

function BloqueScada() {
  return (
    <FunctionBlock code="IOT-05">
      <DataTable footer="Jerarquía Purdue: nivel 0 campo → 1 control → 2 supervisión → 3 operaciones (MES).">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Nodo SCADA</Th>
            <Th>Protocolo</Th>
            <Th>Nivel de jerarquía</Th>
            <Th align="right">Latencia</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {SCADA_NODOS.map(n => (
            <tr key={n.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{n.id}</span></Td>
              <Td className="font-medium text-gray-800">{n.nombre}</Td>
              <Td>{n.protocolo}</Td>
              <Td>{n.nivel}</Td>
              <Td align="right" className="font-mono">{fmtNum(n.latenciaMs)} ms</Td>
              <Td align="center"><StatusBadge label={n.estado} tone={toneEstado(n.estado)} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-06 ---------------------------------- */

function BloqueMes() {
  const [mensaje, setMensaje] = useState('');
  const [sincronizando, setSincronizando] = useState(false);

  function sincronizar() {
    setSincronizando(true);
    window.setTimeout(() => {
      setSincronizando(false);
      setMensaje('Sincronización con MES externos completada: órdenes, ejecución y trazabilidad actualizadas (simulado).');
    }, 800);
  }

  return (
    <FunctionBlock code="IOT-06">
      <Toolbar>
        <button type="button" className={BTN_PRIMARY} onClick={sincronizar} disabled={sincronizando}>
          {sincronizando ? '⏳ Sincronizando…' : '⇄ Sincronizar ahora'}
        </button>
        <span className="text-xs text-gray-500">Órdenes, ejecución y trazabilidad intercambiadas con cada MES.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`${MES_EXTERNOS.length} sistemas MES externos integrados.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Sistema</Th>
            <Th>Canal</Th>
            <Th>Alcance</Th>
            <Th align="right">Última sincronización</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MES_EXTERNOS.map(m => (
            <tr key={m.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{m.id}</span></Td>
              <Td className="font-medium text-gray-800">{m.nombre}</Td>
              <Td>{m.canal}</Td>
              <Td>{m.alcance}</Td>
              <Td align="right" className="font-mono text-gray-500">{m.ultimaSync}</Td>
              <Td align="center"><StatusBadge label={m.estado} tone={toneEstado(m.estado)} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-07 ---------------------------------- */

function BloqueCaptura() {
  const [auto, setAuto] = useState(true);
  const [origen, setOrigen] = useState('');
  const [mensaje, setMensaje] = useState('');

  const origenes = useMemo(() => [...new Set(CAPTURAS.map(c => c.origen))].sort(), []);
  const visibles = useMemo(() => {
    if (!origen) return CAPTURAS;
    return CAPTURAS.filter(c => c.origen === origen);
  }, [origen]);

  function cambiarAuto(v: boolean) {
    setAuto(v);
    window.setTimeout(() => setMensaje(v ? 'Captura automática habilitada: variables, ciclos y estados se registran sin intervención manual.' : 'Captura automática pausada (simulado).'), 300);
  }

  return (
    <FunctionBlock code="IOT-07">
      <Toolbar>
        <label className="flex items-center gap-2 text-xs text-gray-700">
          <input type="checkbox" className="accent-petroleum-600" checked={auto} onChange={e => cambiarAuto(e.target.checked)} />
          Captura automática habilitada
        </label>
        <select className={SELECT} value={origen} onChange={e => setOrigen(e.target.value)} aria-label="Filtrar por origen">
          <option value="">Todos los orígenes</option>
          {origenes.map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="text-xs text-gray-500">{visibles.length} registros recientes</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer="Cada registro conserva marca de tiempo y origen del dispositivo.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>ID</Th>
            <Th align="right">Fecha</Th>
            <Th align="right">Hora</Th>
            <Th>Origen</Th>
            <Th>Variable</Th>
            <Th align="right">Valor</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(c => (
            <tr key={c.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
              <Td align="right" className="font-mono text-gray-500">{c.fecha.slice(8)}/{c.fecha.slice(5, 7)}</Td>
              <Td align="right" className="font-mono">{c.hora}</Td>
              <Td><span className="font-mono text-gray-600">{c.origen}</span></Td>
              <Td>{c.variable}</Td>
              <Td align="right" className="font-mono">{c.valor}</Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={6} text="Sin registros para ese origen." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-08 ---------------------------------- */

function BloqueAlarmas() {
  const [alarmas, setAlarmas] = useState<AlarmaIot[]>(ALARMAS);
  const [fEstado, setFEstado] = useState('');
  const [fCriticidad, setFCriticidad] = useState('');
  const [mensaje, setMensaje] = useState('');

  const visibles = useMemo(() => alarmas.filter(a =>
    (!fEstado || a.estado === fEstado) && (!fCriticidad || a.criticidad === fCriticidad),
  ), [alarmas, fEstado, fCriticidad]);

  function cambiarEstado(id: string, estado: AlarmaIot['estado'], etiqueta: string) {
    setAlarmas(prev => prev.map(a => (a.id === id ? { ...a, estado } : a)));
    window.setTimeout(() => setMensaje(`Alarma ${id} ${etiqueta} (simulado). El responsable fue notificado por correo y app.`), 400);
  }

  return (
    <FunctionBlock code="IOT-08">
      <Toolbar>
        <select className={SELECT} value={fCriticidad} onChange={e => setFCriticidad(e.target.value)} aria-label="Filtrar por criticidad">
          <option value="">Toda criticidad</option>
          {(['Alta', 'Media', 'Baja'] as Criticidad[]).map(c => <option key={c}>{c}</option>)}
        </select>
        <select className={SELECT} value={fEstado} onChange={e => setFEstado(e.target.value)} aria-label="Filtrar por estado">
          <option value="">Todos los estados</option>
          {(['Activa', 'Reconocida', 'Resuelta'] as AlarmaIot['estado'][]).map(e => <option key={e}>{e}</option>)}
        </select>
        <span className="text-xs text-gray-500">{alarmas.filter(a => a.estado === 'Activa').length} activas de {alarmas.length}</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer="Toda alarma tiene criticidad y responsable; la pérdida de conexión genera alarma automática.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>ID</Th>
            <Th align="right">Fecha</Th>
            <Th align="center">Criticidad</Th>
            <Th>Dispositivo</Th>
            <Th>Mensaje</Th>
            <Th>Responsable</Th>
            <Th align="center">Estado</Th>
            <Th align="center">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(a => (
            <tr key={a.id} className={`hoverable ${a.criticidad === 'Alta' && a.estado === 'Activa' ? 'row-error' : ''}`}>
              <Td><span className="font-mono text-gray-600">{a.id}</span></Td>
              <Td align="right" className="font-mono text-gray-500">{a.fecha.slice(8)}/{a.fecha.slice(5, 7)} {a.hora}</Td>
              <Td align="center"><StatusBadge label={a.criticidad} tone={toneCriticidad(a.criticidad)} /></Td>
              <Td className="font-mono text-gray-600">{a.dispositivo}</Td>
              <Td className="max-w-md">{a.mensaje}</Td>
              <Td>{a.responsable}</Td>
              <Td align="center"><StatusBadge label={a.estado} tone={toneEstado(a.estado)} /></Td>
              <Td align="center">
                {a.estado === 'Activa' && (
                  <button type="button" className="rounded px-2 py-1 text-xs text-petroleum-600 hover:bg-petroleum-50" onClick={() => cambiarEstado(a.id, 'Reconocida', 'reconocida')}>Reconocer</button>
                )}
                {a.estado === 'Reconocida' && (
                  <button type="button" className="rounded px-2 py-1 text-xs text-petroleum-600 hover:bg-petroleum-50" onClick={() => cambiarEstado(a.id, 'Resuelta', 'resuelta')}>Resolver</button>
                )}
                {a.estado === 'Resuelta' && <span className="text-xs text-gray-400">Cerrada</span>}
              </Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={8} text="No hay alarmas que coincidan con los filtros." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-09 ---------------------------------- */

function BloqueHistoriador() {
  const [retencion, setRetencion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [exportando, setExportando] = useState(false);

  const visibles = useMemo(() => {
    if (!retencion) return SERIES_HISTORIADOR;
    return SERIES_HISTORIADOR.filter(s => String(s.retencionMeses) === retencion);
  }, [retencion]);

  function exportar() {
    setExportando(true);
    window.setTimeout(() => {
      setExportando(false);
      setMensaje('Series del historiador exportadas a historico-variables.csv (simulado).');
    }, 800);
  }

  return (
    <FunctionBlock code="IOT-09">
      <Toolbar>
        <select className={SELECT} value={retencion} onChange={e => setRetencion(e.target.value)} aria-label="Filtrar por retención">
          <option value="">Toda retención</option>
          {['6', '12', '24'].map(r => <option key={r} value={r}>{r} meses</option>)}
        </select>
        <button type="button" className={BTN_PRIMARY} onClick={exportar} disabled={exportando}>
          {exportando ? '⏳ Exportando…' : '↓ Exportar CSV'}
        </button>
        <span className="text-xs text-gray-500">Los datos históricos no se eliminan sin política de retención.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`${visibles.length} series · consulta del pasado disponible por variable y período.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Serie</Th>
            <Th>Variable</Th>
            <Th>Dispositivo</Th>
            <Th align="right">Muestras</Th>
            <Th align="right">Retención</Th>
            <Th align="right">Resolución</Th>
            <Th align="right">Última muestra</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(s => (
            <tr key={s.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{s.id}</span></Td>
              <Td className="font-medium text-gray-800">{s.variable}</Td>
              <Td><span className="font-mono text-gray-500">{s.dispositivo}</span></Td>
              <Td align="right" className="font-mono">{fmtNum(s.muestras)}</Td>
              <Td align="right" className="font-mono">{s.retencionMeses} meses</Td>
              <Td align="right" className="font-mono">{fmtNum(s.resolucionS)} s</Td>
              <Td align="right" className="font-mono text-gray-500">{s.ultima}</Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={7} text="No hay series con esa retención." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-10 ---------------------------------- */

function BloqueSeguridad() {
  return (
    <FunctionBlock code="IOT-10">
      <DataTable footer="La seguridad OT debe estar aprobada y documentada por TI/OT.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Control</Th>
            <Th>Detalle</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {CONTROLES_SEGURIDAD.map(c => (
            <tr key={c.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
              <Td className="font-medium text-gray-800">{c.control}</Td>
              <Td className="max-w-xl">{c.detalle}</Td>
              <Td align="center"><StatusBadge label={c.estado} tone={toneEstado(c.estado)} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-11 ---------------------------------- */

function BloqueMonitoreo() {
  return (
    <FunctionBlock code="IOT-11">
      <DataTable footer="Disponibilidad de las últimas 24 horas; la desconexión se registra y alerta.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Dispositivo</Th>
            <Th>Disponibilidad 24 h</Th>
            <Th align="right">Latencia</Th>
            <Th align="center">Errores 24 h</Th>
            <Th align="center">Salud</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {SALUD_OT.map(d => (
            <tr key={d.id} className="hoverable">
              <Td>
                <span className="font-mono text-gray-500">{d.id}</span>
                <span className="ml-2 font-medium text-gray-800">{d.dispositivo}</span>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-full max-w-40 rounded bg-gray-100">
                    <div className={`h-1.5 rounded ${d.salud === 'Saludable' ? 'bg-green-500' : d.salud === 'Atención' ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${d.disponibilidadPct}%` }} />
                  </div>
                  <span className="font-mono text-xs text-gray-600">{fmtPct(d.disponibilidadPct / 100)}</span>
                </div>
              </Td>
              <Td align="right" className="font-mono">{d.latenciaMs > 0 ? `${fmtNum(d.latenciaMs)} ms` : '—'}</Td>
              <Td align="center" className={d.errores24h > 0 ? 'font-mono text-red-600' : 'font-mono text-gray-400'}>{fmtNum(d.errores24h)}</Td>
              <Td align="center"><StatusBadge label={d.salud} tone={toneEstado(d.salud)} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- IOT-12 ---------------------------------- */

function BloqueConfiguracion() {
  const [reglas, setReglas] = useState<ReglaIot[]>(REGLAS_IOT);
  const [fCategoria, setFCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modal, setModal] = useState(false);
  const [categoria, setCategoria] = useState<ReglaIot['categoria']>('Variable');
  const [nombre, setNombre] = useState('');

  const visibles = useMemo(() => {
    if (!fCategoria) return reglas;
    return reglas.filter(r => r.categoria === fCategoria);
  }, [reglas, fCategoria]);

  function alternar(id: string) {
    setReglas(prev => prev.map(r => (r.id === id ? { ...r, estado: r.estado === 'Habilitada' ? 'Deshabilitada' : 'Habilitada' } : r)));
    window.setTimeout(() => setMensaje(`Regla ${id} actualizada (simulado).`), 300);
  }

  function guardar() {
    window.setTimeout(() => {
      setMensaje(`Regla «${nombre}» creada en la categoría ${categoria} (simulado).`);
      setModal(false);
      setNombre('');
    }, 400);
  }

  return (
    <FunctionBlock code="IOT-12">
      <Toolbar>
        <select className={SELECT} value={fCategoria} onChange={e => setFCategoria(e.target.value)} aria-label="Filtrar por categoría">
          <option value="">Todas las categorías</option>
          {(['Protocolo', 'Variable', 'Regla', 'Destino'] as ReglaIot['categoria'][]).map(c => <option key={c}>{c}</option>)}
        </select>
        <button type="button" className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nueva regla</button>
        <span className="text-xs text-gray-500">Dispositivos, protocolos, variables, reglas y destinos de datos.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`${visibles.length} reglas de configuración.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th align="center">Categoría</Th>
            <Th>Regla</Th>
            <Th align="center">Estado</Th>
            <Th align="center">Acción</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(r => (
            <tr key={r.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
              <Td align="center"><StatusBadge label={r.categoria} tone="petroleum" /></Td>
              <Td className="max-w-xl">{r.nombre}</Td>
              <Td align="center"><StatusBadge label={r.estado} tone={toneEstado(r.estado)} /></Td>
              <Td align="center">
                <button type="button" className="rounded px-2 py-1 text-xs text-petroleum-600 hover:bg-petroleum-50" onClick={() => alternar(r.id)}>
                  {r.estado === 'Habilitada' ? 'Deshabilitar' : 'Habilitar'}
                </button>
              </Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={5} text="No hay reglas en esa categoría." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nueva regla de configuración" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <label className="block text-xs text-gray-600">
              Categoría
              <select data-initial-focus className={`${SELECT} mt-1 w-full`} value={categoria} onChange={e => setCategoria(e.target.value as ReglaIot['categoria'])}>
                {(['Protocolo', 'Variable', 'Regla', 'Destino'] as ReglaIot['categoria'][]).map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-xs text-gray-600">
              Descripción de la regla
              <input className={`${INPUT} mt-1`} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej.: Mapeo SEN-02 → HIS.PRES.102" />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="button" className={BTN_PRIMARY} onClick={guardar} disabled={!nombre.trim()}>Guardar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/* -------------------------------- Resumen --------------------------------- */

function Resumen() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Objetivo">
        <p className="text-xs leading-relaxed text-gray-600">
          Conectar el sistema con máquinas, sensores, básculas y sistemas de planta para capturar datos automáticamente y reaccionar a eventos.
        </p>
      </Card>
      <Card title="Alcance">
        <p className="text-xs leading-relaxed text-gray-600">
          PLC, sensores, básculas, máquinas, SCADA, MES externos, captura automática, alarmas, historiador y seguridad.
        </p>
      </Card>
      <Card title="Actores">
        <div className="flex flex-wrap gap-1.5">
          {['Automatización', 'Mantenimiento', 'Producción', 'TI/OT', 'Calidad'].map(a => (
            <span key={a} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{a}</span>
          ))}
        </div>
      </Card>
      <Card title="Reglas de negocio">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          <li>Un dato sin marca de tiempo y origen no es confiable.</li>
          <li>Las alarmas deben tener criticidad y responsable.</li>
          <li>La pérdida de conexión debe registrarse y alertarse.</li>
          <li>Los datos históricos no se eliminan sin política de retención.</li>
          <li>La seguridad OT debe estar aprobada por TI/OT.</li>
        </ul>
      </Card>
      <Card title="Integraciones">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          <li>MES: captura y eventos.</li>
          <li>Producción: consumo y ciclos.</li>
          <li>Calidad: variables de proceso.</li>
          <li>Mantenimiento: condición y fallas.</li>
          <li>Historiador y SCADA externos.</li>
        </ul>
      </Card>
      <Card title="Reportes">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          <li>Disponibilidad de dispositivos.</li>
          <li>Variables por período.</li>
          <li>Alarmas y eventos.</li>
          <li>Pérdida de datos.</li>
          <li>Condición de máquinas.</li>
        </ul>
      </Card>
      <Card title="Criterios de aceptación" className="lg:col-span-2">
        <ul className="grid list-disc gap-1 pl-4 text-xs text-gray-600 sm:grid-cols-2">
          <li>Los datos automáticos llegan con origen y tiempo.</li>
          <li>Las alarmas se notifican.</li>
          <li>La desconexión se detecta.</li>
          <li>El historiador permite consultar el pasado.</li>
          <li>La seguridad está documentada.</li>
        </ul>
      </Card>
    </div>
  );
}

/* --------------------------------- Página --------------------------------- */

export default function IOT() {
  const [tab, setTab] = useState('resumen');

  const enLinea =
    PLCS.filter(d => d.estado === 'En línea').length +
    SENSORES.filter(s => s.estado === 'Normal').length +
    MAQUINAS.filter(m => m.estado === 'Operando').length +
    SCADA_NODOS.filter(n => n.estado === 'En línea').length +
    MES_EXTERNOS.filter(m => m.estado === 'En línea').length;
  const totalDispositivos = PLCS.length + SENSORES.length + MAQUINAS.length + SCADA_NODOS.length + MES_EXTERNOS.length;
  const alarmasActivas = ALARMAS.filter(a => a.estado === 'Activa').length;
  const disponibilidadProm = SALUD_OT.reduce((a, d) => a + d.disponibilidadPct, 0) / SALUD_OT.length;

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('iot')} funcionalidades · Fase ${MOD.fase}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Dispositivos en línea" value={`${fmtNum(enLinea)} / ${fmtNum(totalDispositivos)}`} sub="PLC, sensores, máquinas, SCADA y MES" tone="ok" />
        <StatCard label="Alarmas activas" value={fmtNum(alarmasActivas)} sub="1 de criticidad alta sin reconocer" tone="danger" />
        <StatCard label="Lecturas automáticas (24 h)" value={fmtNum(184320)} sub="variables enviadas al historiador" tone="info" />
        <StatCard label="Disponibilidad OT" value={fmtPct(disponibilidadProm / 100)} sub="promedio de los últimos 7 dispositivos" tone="ok" />
      </div>

      <Tabs
        tabs={[
          { id: 'resumen', label: 'Resumen' },
          { id: 'conectividad', label: 'Conectividad' },
          { id: 'supervision', label: 'Supervisión e integración' },
          { id: 'captura', label: 'Captura y eventos' },
          { id: 'gobierno', label: 'Gobierno y operación' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'resumen' && <Resumen />}
      {tab === 'conectividad' && (
        <div className="space-y-4">
          <BloquePLC />
          <BloqueSensores />
          <BloqueBasculas />
          <BloqueMaquinas />
        </div>
      )}
      {tab === 'supervision' && (
        <div className="space-y-4">
          <BloqueScada />
          <BloqueMes />
        </div>
      )}
      {tab === 'captura' && (
        <div className="space-y-4">
          <BloqueCaptura />
          <BloqueAlarmas />
          <BloqueHistoriador />
        </div>
      )}
      {tab === 'gobierno' && (
        <div className="space-y-4">
          <BloqueSeguridad />
          <BloqueMonitoreo />
          <BloqueConfiguracion />
        </div>
      )}
    </div>
  );
}

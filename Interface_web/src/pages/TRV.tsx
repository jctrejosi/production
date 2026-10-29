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
import { fmtFecha, fmtNum } from '../lib/format';
import {
  AUDITORIA,
  COMPANIAS,
  DATOS_MAESTROS,
  DOCUMENTOS,
  INTEGRACIONES,
  JOBS_DATOS,
  LOCALIZACION,
  MONEDAS,
  NOTIFICACIONES,
  PARAMETROS,
  REPORTES_TRV,
  RESPALDOS,
  ROLES,
  TERMINALES,
  ULTIMA_RESTAURACION,
  UNIDADES_MEDIDA,
  type Notificacion,
  type Parametro,
  type Rol,
} from '../data/trv';

const MOD = MODULOS.find(m => m.id === 'trv')!;

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
  if (['OK', 'Activa', 'Activo', 'Completado', 'En línea', 'Aprobado', 'Disponible'].includes(estado)) return 'green';
  if (['En revisión', 'Degradada', 'Completo con errores', 'Completo con advertencia', 'Pausada'].includes(estado)) return 'amber';
  if (['Fallido', 'Fuera de línea', 'Sin conexión'].includes(estado)) return 'red';
  if (['En uso'].includes(estado)) return 'blue';
  return 'gray';
}

/* ------------------------------- TRV-01 ---------------------------------- */

function BloqueRoles() {
  const [roles, setRoles] = useState<Rol[]>(ROLES);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [permisos, setPermisos] = useState('COS · INV (lectura)');
  const [mensaje, setMensaje] = useState('');

  const visibles = useMemo(() => {
    const t = q.trim().toLocaleLowerCase('es');
    if (!t) return roles;
    return roles.filter(r => [r.nombre, r.permisos, r.segregacion].join(' ').toLocaleLowerCase('es').includes(t));
  }, [roles, q]);

  function guardar() {
    const id = `ROL-${String(roles.length + 1).padStart(2, '0')}`;
    window.setTimeout(() => {
      setRoles(prev => [...prev, { id, nombre, permisos, usuarios: 0, segregacion: 'Por definir' }]);
      setMensaje(`Rol «${nombre}» creado con permisos «${permisos}» (simulado).`);
      setModal(false);
      setNombre('');
    }, 400);
  }

  return (
    <FunctionBlock code="TRV-01">
      <Toolbar>
        <input className={`${INPUT} max-w-xs`} placeholder="Buscar rol o permisos..." value={q} onChange={e => setQ(e.target.value)} />
        <button type="button" className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nuevo rol</button>
        <span className="text-xs text-gray-500">Permisos por módulo, función, compañía, planta y centro de costo, con segregación de funciones.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`${visibles.length} roles · ${roles.reduce((a, r) => a + r.usuarios, 0)} usuarios con acceso`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Rol</Th>
            <Th>Permisos</Th>
            <Th align="center">Usuarios</Th>
            <Th>Segregación</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(r => (
            <tr key={r.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
              <Td className="font-medium text-gray-800">{r.nombre}</Td>
              <Td>{r.permisos}</Td>
              <Td align="center"><span className="font-mono">{fmtNum(r.usuarios)}</span></Td>
              <Td>{r.segregacion}</Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={5} text="No hay roles que coincidan con la búsqueda." />}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nuevo rol" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <label className="block text-xs text-gray-600">
              Nombre del rol
              <input data-initial-focus className={`${INPUT} mt-1`} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej.: Analista de calidad" />
            </label>
            <label className="block text-xs text-gray-600">
              Permisos por módulo
              <select className={`${SELECT} mt-1 w-full`} value={permisos} onChange={e => setPermisos(e.target.value)}>
                {['COS · INV (lectura)', 'CAL · CAP (escritura)', 'IOT · MNT (configuración)', 'PRD · MES · REN (escritura)', 'Todos los módulos · solo lectura'].map(p => <option key={p}>{p}</option>)}
              </select>
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

/* ------------------------------- TRV-02 ---------------------------------- */

function BloqueDatosMaestros() {
  const [mensaje, setMensaje] = useState('');

  function validarTodo() {
    window.setTimeout(() => setMensaje('Validación de datos maestros ejecutada: duplicados, obligatorios y conversiones revisados (simulado).'), 400);
  }

  return (
    <FunctionBlock code="TRV-02">
      <Toolbar>
        <button type="button" className={BTN_PRIMARY} onClick={validarTodo}>Validar todo</button>
        <span className="text-xs text-gray-500">Productos, unidades, categorías, terceros, ubicaciones, recursos y centros de costo con validaciones y versionado.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`${DATOS_MAESTROS.length} entidades · ${fmtNum(DATOS_MAESTROS.reduce((a, d) => a + d.registros, 0))} registros en total`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Entidad</Th>
            <Th align="right">Registros</Th>
            <Th>Versionado</Th>
            <Th>Validación</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {DATOS_MAESTROS.map(d => (
            <tr key={d.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{d.id}</span></Td>
              <Td className="font-medium text-gray-800">{d.entidad}</Td>
              <Td align="right" className="font-mono">{fmtNum(d.registros)}</Td>
              <Td>{d.versionado}</Td>
              <Td>{d.validacion}</Td>
              <Td align="center"><StatusBadge label={d.estado} tone={toneEstado(d.estado)} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-03 ---------------------------------- */

function BloqueMulticompania() {
  return (
    <FunctionBlock code="TRV-03">
      <DataTable footer="Varias compañías, plantas y almacenes con datos separados y consolidación cuando corresponda.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Compañía</Th>
            <Th align="center">Plantas</Th>
            <Th align="center">Almacenes</Th>
            <Th align="center">Moneda</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {COMPANIAS.map(c => (
            <tr key={c.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{c.id}</span></Td>
              <Td className="font-medium text-gray-800">{c.nombre}</Td>
              <Td align="center"><span className="font-mono">{c.plantas}</span></Td>
              <Td align="center"><span className="font-mono">{c.almacenes}</span></Td>
              <Td align="center"><span className="font-mono text-gray-600">{c.moneda}</span></Td>
              <Td align="center"><StatusBadge label={c.estado} tone={toneEstado(c.estado)} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-04 ---------------------------------- */

function BloqueMonedas() {
  const [mensaje, setMensaje] = useState('');

  function actualizarTasas() {
    window.setTimeout(() => setMensaje('Tipos de cambio actualizados con la fuente autorizada del día (simulado).'), 400);
  }

  return (
    <FunctionBlock code="TRV-04">
      <Toolbar>
        <button type="button" className={BTN_PRIMARY} onClick={actualizarTasas}>Actualizar tasas</button>
        <span className="text-xs text-gray-500">Monedas, tipos de cambio, unidades de medida y conversiones.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <div className="grid gap-4 lg:grid-cols-2">
        <DataTable footer={`${MONEDAS.length} monedas · tasa COP base 1`}>
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Código</Th>
              <Th>Moneda</Th>
              <Th align="right">Tasa (COP)</Th>
              <Th align="right">Fecha</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MONEDAS.map(m => (
              <tr key={m.codigo} className="hoverable">
                <Td><span className="font-mono text-gray-600">{m.codigo}</span></Td>
                <Td className="font-medium text-gray-800">{m.nombre}</Td>
                <Td align="right" className="font-mono">{fmtNum(m.tasa)}</Td>
                <Td align="right" className="font-mono text-gray-500">{fmtFecha(m.fecha)}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
        <DataTable footer="Conversiones validadas entre unidades.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Código</Th>
              <Th>Unidad</Th>
              <Th align="right">Factor base</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {UNIDADES_MEDIDA.map(u => (
              <tr key={u.codigo} className="hoverable">
                <Td><span className="font-mono text-gray-600">{u.codigo}</span></Td>
                <Td>{u.nombre}</Td>
                <Td align="right" className="font-mono">{fmtNum(u.factor)}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-05 ---------------------------------- */

function BloqueAuditoria() {
  const [fUsuario, setFUsuario] = useState('');
  const [fModulo, setFModulo] = useState('');
  const [q, setQ] = useState('');

  const usuarios = useMemo(() => [...new Set(AUDITORIA.map(a => a.usuario))].sort(), []);
  const modulos = useMemo(() => [...new Set(AUDITORIA.map(a => a.modulo))].sort(), []);

  const visibles = useMemo(() => AUDITORIA.filter(a =>
    (!fUsuario || a.usuario === fUsuario) &&
    (!fModulo || a.modulo === fModulo) &&
    (!q.trim() || a.detalle.toLocaleLowerCase('es').includes(q.trim().toLocaleLowerCase('es'))),
  ), [fUsuario, fModulo, q]);

  return (
    <FunctionBlock code="TRV-05">
      <Toolbar>
        <input className={`${INPUT} max-w-xs`} placeholder="Buscar en detalle..." value={q} onChange={e => setQ(e.target.value)} />
        <select className={SELECT} value={fUsuario} onChange={e => setFUsuario(e.target.value)} aria-label="Filtrar por usuario">
          <option value="">Todos los usuarios</option>
          {usuarios.map(u => <option key={u}>{u}</option>)}
        </select>
        <select className={SELECT} value={fModulo} onChange={e => setFModulo(e.target.value)} aria-label="Filtrar por módulo">
          <option value="">Todos los módulos</option>
          {modulos.map(m => <option key={m}>{m}</option>)}
        </select>
        <span className="text-xs text-gray-500">Registro de quién creó, modificó, aprobó o eliminó, con fecha y valor anterior.</span>
      </Toolbar>
      <DataTable footer={`${visibles.length} de ${AUDITORIA.length} eventos registrados`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>ID</Th>
            <Th align="right">Fecha</Th>
            <Th align="right">Hora</Th>
            <Th>Usuario</Th>
            <Th>Módulo</Th>
            <Th align="center">Acción</Th>
            <Th>Detalle</Th>
            <Th align="right">Valor anterior</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(a => (
            <tr key={a.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{a.id}</span></Td>
              <Td align="right" className="font-mono text-gray-500">{fmtFecha(a.fecha)}</Td>
              <Td align="right" className="font-mono">{a.hora}</Td>
              <Td className="font-medium text-gray-800">{a.usuario}</Td>
              <Td><span className="font-mono text-gray-600">{a.modulo}</span></Td>
              <Td align="center"><StatusBadge label={a.accion} tone="petroleum" /></Td>
              <Td className="max-w-md">{a.detalle}</Td>
              <Td align="right" className="font-mono text-gray-500">{a.valorAnterior}</Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={8} text="No hay eventos que coincidan con los filtros." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-06 ---------------------------------- */

function BloqueNotificaciones() {
  const [notas, setNotas] = useState<Notificacion[]>(NOTIFICACIONES);
  const [mensaje, setMensaje] = useState('');

  function alternar(id: string) {
    setNotas(prev => prev.map(n => (n.id === id ? { ...n, estado: n.estado === 'Activa' ? 'Pausada' : 'Activa' } : n)));
    window.setTimeout(() => setMensaje(`Regla ${id} actualizada (simulado).`), 300);
  }

  return (
    <FunctionBlock code="TRV-06">
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer="Alertas, correos, actividades y escalamiento configurables por evento.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Evento</Th>
            <Th>Canales</Th>
            <Th>Responsables</Th>
            <Th>Escalamiento</Th>
            <Th align="center">Estado</Th>
            <Th align="center">Acción</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {notas.map(n => (
            <tr key={n.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{n.id}</span></Td>
              <Td className="font-medium text-gray-800">{n.evento}</Td>
              <Td>{n.canales}</Td>
              <Td>{n.responsables}</Td>
              <Td>{n.escalamiento}</Td>
              <Td align="center"><StatusBadge label={n.estado} tone={toneEstado(n.estado)} /></Td>
              <Td align="center">
                <button type="button" className="rounded px-2 py-1 text-xs text-petroleum-600 hover:bg-petroleum-50" onClick={() => alternar(n.id)}>
                  {n.estado === 'Activa' ? 'Pausar' : 'Activar'}
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-07 ---------------------------------- */

function BloqueReporteria() {
  const [mensaje, setMensaje] = useState('');
  const [generando, setGenerando] = useState('');

  function generar(nombre: string) {
    setGenerando(nombre);
    window.setTimeout(() => {
      setGenerando('');
      setMensaje(`Reporte «${nombre}» generado y disponible para exportar (simulado).`);
    }, 700);
  }

  return (
    <FunctionBlock code="TRV-07">
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer="Reportes operativos, tableros e indicadores exportables.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Reporte</Th>
            <Th>Módulo</Th>
            <Th>Formato</Th>
            <Th>Frecuencia</Th>
            <Th align="center">Acción</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {REPORTES_TRV.map(r => (
            <tr key={r.id} className="hoverable">
              <Td className="font-medium text-gray-800">{r.nombre}</Td>
              <Td>{r.modulo}</Td>
              <Td><span className="font-mono text-gray-500">{r.formato}</span></Td>
              <Td>{r.frecuencia}</Td>
              <Td align="center">
                <button type="button" className="rounded px-2 py-1 text-xs text-petroleum-600 hover:bg-petroleum-50" onClick={() => generar(r.nombre)} disabled={generando === r.nombre}>
                  {generando === r.nombre ? '⏳' : 'Generar'}
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-08 ---------------------------------- */

function BloqueIntegraciones() {
  const [mensaje, setMensaje] = useState('');

  function probar(sistema: string) {
    window.setTimeout(() => setMensaje(`Prueba de integración con ${sistema}: handshake y autenticación OK (simulado).`), 400);
  }

  return (
    <FunctionBlock code="TRV-08">
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer="Interfaces seguras y documentadas con otros sistemas.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Sistema</Th>
            <Th>Canal</Th>
            <Th align="center">Estado</Th>
            <Th align="right">Última sincronización</Th>
            <Th align="center">Acción</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {INTEGRACIONES.map(i => (
            <tr key={i.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{i.id}</span></Td>
              <Td className="font-medium text-gray-800">{i.sistema}</Td>
              <Td>{i.canal}</Td>
              <Td align="center"><StatusBadge label={i.estado} tone={toneEstado(i.estado)} /></Td>
              <Td align="right" className="font-mono text-gray-500">{i.ultimaSync}</Td>
              <Td align="center">
                <button type="button" className="rounded px-2 py-1 text-xs text-petroleum-600 hover:bg-petroleum-50" onClick={() => probar(i.sistema)}>Probar</button>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-09 ---------------------------------- */

function BloqueImportExport() {
  const [modal, setModal] = useState(false);
  const [entidad, setEntidad] = useState('Productos');
  const [formato, setFormato] = useState('XLSX');
  const [mensaje, setMensaje] = useState('');

  function iniciar() {
    window.setTimeout(() => {
      setMensaje(`Importación de ${entidad} en ${formato} iniciada: los errores quedarán registrados (simulado).`);
      setModal(false);
    }, 400);
  }

  return (
    <FunctionBlock code="TRV-09">
      <Toolbar>
        <button type="button" className={BTN_PRIMARY} onClick={() => setModal(true)}>+ Nueva importación</button>
        <span className="text-xs text-gray-500">Carga y extracción de datos en formatos estándar con validación y registro de errores.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`${JOBS_DATOS.length} trabajos recientes`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>ID</Th>
            <Th align="center">Tipo</Th>
            <Th>Detalle</Th>
            <Th>Formato</Th>
            <Th align="right">Registros</Th>
            <Th align="right">Errores</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {JOBS_DATOS.map(j => (
            <tr key={j.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{j.id}</span></Td>
              <Td align="center"><StatusBadge label={j.tipo} tone={j.tipo === 'Importación' ? 'blue' : 'petroleum'} /></Td>
              <Td className="font-medium text-gray-800">{j.detalle}</Td>
              <Td><span className="font-mono text-gray-500">{j.formato}</span></Td>
              <Td align="right" className="font-mono">{j.registros > 0 ? fmtNum(j.registros) : '—'}</Td>
              <Td align="right" className={j.errores > 0 ? 'font-mono text-red-600' : 'font-mono text-gray-400'}>{j.errores}</Td>
              <Td align="center"><StatusBadge label={j.estado} tone={toneEstado(j.estado)} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {modal && (
        <Modal title="Nueva importación" onClose={() => setModal(false)}>
          <div className="space-y-3 p-5">
            <label className="block text-xs text-gray-600">
              Entidad
              <select data-initial-focus className={`${SELECT} mt-1 w-full`} value={entidad} onChange={e => setEntidad(e.target.value)}>
                {['Productos', 'Proveedores', 'Clientes', 'Tarifas de costos', 'Ubicaciones'].map(e => <option key={e}>{e}</option>)}
              </select>
            </label>
            <label className="block text-xs text-gray-600">
              Formato
              <select className={`${SELECT} mt-1 w-full`} value={formato} onChange={e => setFormato(e.target.value)}>
                {['XLSX', 'CSV', 'XML'].map(f => <option key={f}>{f}</option>)}
              </select>
            </label>
            <label className="block text-xs text-gray-600">
              Archivo (nombre simulado)
              <input className={`${INPUT} mt-1 font-mono`} readOnly value={`import-${entidad.toLocaleLowerCase('es').replace(/ /g, '-')}.${formato.toLocaleLowerCase('es')}`} />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setModal(false)}>Cancelar</button>
              <button type="button" className={BTN_PRIMARY} onClick={iniciar}>Iniciar importación</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-10 ---------------------------------- */

function BloqueConfiguracion() {
  const [parametros, setParametros] = useState<Parametro[]>(PARAMETROS);
  const [editando, setEditando] = useState<Parametro | null>(null);
  const [valor, setValor] = useState('');
  const [mensaje, setMensaje] = useState('');

  function abrir(p: Parametro) {
    setEditando(p);
    setValor(p.valor);
  }

  function guardar() {
    window.setTimeout(() => {
      if (editando) setParametros(prev => prev.map(p => (p.id === editando.id ? { ...p, valor } : p)));
      setMensaje(`Parámetro «${editando?.nombre}» actualizado a «${valor}» (simulado).`);
      setEditando(null);
    }, 400);
  }

  return (
    <FunctionBlock code="TRV-10">
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer="Políticas, numeraciones, umbrales, calendarios y reglas configurables sin desarrollo.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th align="center">Categoría</Th>
            <Th>Parámetro</Th>
            <Th align="right">Valor</Th>
            <Th align="center">Estado</Th>
            <Th align="center">Acción</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {parametros.map(p => (
            <tr key={p.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{p.id}</span></Td>
              <Td align="center"><StatusBadge label={p.categoria} tone="petroleum" /></Td>
              <Td className="font-medium text-gray-800">{p.nombre}</Td>
              <Td align="right" className="font-mono">{p.valor}</Td>
              <Td align="center"><StatusBadge label={p.estado} tone={toneEstado(p.estado)} /></Td>
              <Td align="center">
                <button type="button" className="rounded px-2 py-1 text-xs text-petroleum-600 hover:bg-petroleum-50" onClick={() => abrir(p)}>Editar</button>
              </Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {editando && (
        <Modal title={`Editar parámetro ${editando.id}`} onClose={() => setEditando(null)}>
          <div className="space-y-3 p-5">
            <p className="text-xs text-gray-600">{editando.nombre}</p>
            <label className="block text-xs text-gray-600">
              Nuevo valor
              <input data-initial-focus className={`${INPUT} mt-1 font-mono`} value={valor} onChange={e => setValor(e.target.value)} />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={BTN_SECONDARY} onClick={() => setEditando(null)}>Cancelar</button>
              <button type="button" className={BTN_PRIMARY} onClick={guardar} disabled={!valor.trim()}>Guardar</button>
            </div>
          </div>
        </Modal>
      )}
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-11 ---------------------------------- */

function BloqueMovilidad() {
  return (
    <FunctionBlock code="TRV-11">
      <DataTable footer="Operación en planta desde terminales y dispositivos móviles cuando el proceso lo requiere.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Equipo</Th>
            <Th>Ubicación</Th>
            <Th>Usuario</Th>
            <Th align="center">Estado</Th>
            <Th>Modo</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {TERMINALES.map(t => (
            <tr key={t.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{t.id}</span></Td>
              <Td className="font-medium text-gray-800">{t.equipo}</Td>
              <Td>{t.ubicacion}</Td>
              <Td>{t.usuario}</Td>
              <Td align="center"><StatusBadge label={t.estado} tone={toneEstado(t.estado)} /></Td>
              <Td>{t.modo}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-12 ---------------------------------- */

function BloqueDocumental() {
  const [mensaje, setMensaje] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  function subir() {
    setSubiendo(true);
    window.setTimeout(() => {
      setSubiendo(false);
      setMensaje('Documento adjuntado y versionado (simulado). Se asoció al registro indicado con control de versiones.');
    }, 700);
  }

  return (
    <FunctionBlock code="TRV-12">
      <Toolbar>
        <button type="button" className={BTN_PRIMARY} onClick={subir} disabled={subiendo}>
          {subiendo ? '⏳ Subiendo…' : '+ Adjuntar documento'}
        </button>
        <span className="text-xs text-gray-500">Adjuntar, versionar y controlar documentos asociados a productos, órdenes, lotes y controles.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`${DOCUMENTOS.length} documentos controlados`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Documento</Th>
            <Th>Asociado a</Th>
            <Th align="center">Versión</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {DOCUMENTOS.map(d => (
            <tr key={d.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{d.id}</span></Td>
              <Td className="font-medium text-gray-800">{d.nombre}</Td>
              <Td>{d.asociadoA}</Td>
              <Td align="center"><span className="font-mono text-gray-600">{d.version}</span></Td>
              <Td align="center"><StatusBadge label={d.estado} tone={toneEstado(d.estado)} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-13 ---------------------------------- */

function BloqueLocalizacion() {
  return (
    <FunctionBlock code="TRV-13">
      <DataTable footer="Idioma, moneda, impuestos y requisitos legales del país.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Aspecto</Th>
            <Th>Valor</Th>
            <Th align="center">Estado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {LOCALIZACION.map(l => (
            <tr key={l.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{l.id}</span></Td>
              <Td className="font-medium text-gray-800">{l.aspecto}</Td>
              <Td>{l.valor}</Td>
              <Td align="center"><StatusBadge label={l.estado} tone={toneEstado(l.estado)} /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- TRV-14 ---------------------------------- */

function BloqueRespaldo() {
  const [ejecutando, setEjecutando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  function ejecutar() {
    setEjecutando(true);
    window.setTimeout(() => {
      setEjecutando(false);
      setMensaje('Respaldo incremental ejecutado y verificado: nube + cinta (simulado).');
    }, 900);
  }

  return (
    <FunctionBlock code="TRV-14">
      <Toolbar>
        <button type="button" className={BTN_PRIMARY} onClick={ejecutar} disabled={ejecutando}>
          {ejecutando ? '⏳ Ejecutando…' : '⚙ Ejecutar respaldo'}
        </button>
        <span className="text-xs text-gray-500">{ULTIMA_RESTAURACION}</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer="Respaldo, recuperación y continuidad operativa según la política de la empresa.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>ID</Th>
            <Th align="right">Fecha</Th>
            <Th align="center">Tipo</Th>
            <Th align="right">Tamaño</Th>
            <Th>Destino</Th>
            <Th align="center">Estado</Th>
            <Th align="right">Verificación</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {RESPALDOS.map(r => (
            <tr key={r.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{r.id}</span></Td>
              <Td align="right" className="font-mono text-gray-500">{r.fecha}</Td>
              <Td align="center"><StatusBadge label={r.tipo} tone={r.tipo === 'Completo' ? 'blue' : 'petroleum'} /></Td>
              <Td align="right" className="font-mono">{r.tamano}</Td>
              <Td>{r.destino}</Td>
              <Td align="center"><StatusBadge label={r.estado} tone={toneEstado(r.estado)} /></Td>
              <Td align="right" className="font-mono text-gray-500">{r.verificacion}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* -------------------------------- Resumen --------------------------------- */

function Resumen() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Objetivo">
        <p className="text-xs leading-relaxed text-gray-600">
          Proporcionar capacidades comunes de seguridad, datos maestros, integración, reportes y gobierno a todos los módulos.
        </p>
      </Card>
      <Card title="Alcance">
        <p className="text-xs leading-relaxed text-gray-600">
          Capacidades transversales a los 14 módulos: roles y permisos, datos maestros, multi-compañía y multi-planta, multi-moneda, auditoría, notificaciones, reportería, integraciones, importación/exportación, configuración, movilidad, documental, localización y continuidad.
        </p>
      </Card>
      <Card title="Actores">
        <div className="flex flex-wrap gap-1.5">
          {['Administración y TI', 'Auditoría', 'Dirección', 'Supervisores', 'Operarios de planta'].map(a => (
            <span key={a} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{a}</span>
          ))}
        </div>
      </Card>
      <Card title="Reglas de negocio">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          <li>Todo registro de auditoría conserva quién, cuándo y el valor anterior.</li>
          <li>Los permisos respetan la segregación de funciones.</li>
          <li>Los datos de cada compañía y planta permanecen separados.</li>
          <li>Las importaciones validan y registran sus errores.</li>
          <li>Los respaldos se verifican según la política de la empresa.</li>
        </ul>
      </Card>
      <Card title="Integraciones">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          <li>ERP financiero.</li>
          <li>Sistema de nómina.</li>
          <li>Básculas de camiones.</li>
          <li>Pasarela de pagos.</li>
          <li>CRM de ventas y MES legado.</li>
        </ul>
      </Card>
      <Card title="Reportes">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          {REPORTES_TRV.map(r => <li key={r.id}>{r.nombre} — {r.modulo} ({r.frecuencia}).</li>)}
        </ul>
      </Card>
      <Card title="Criterios de aceptación" className="lg:col-span-2">
        <ul className="grid list-disc gap-1 pl-4 text-xs text-gray-600 sm:grid-cols-2">
          <li>La auditoría es trazable hasta el valor anterior.</li>
          <li>Los permisos se aplican por módulo, función, compañía, planta y centro de costo.</li>
          <li>Las integraciones usan interfaces seguras y documentadas.</li>
          <li>Las importaciones quedan con registro de errores.</li>
          <li>Un respaldo reciente es restaurable y está verificado.</li>
        </ul>
      </Card>
    </div>
  );
}

/* --------------------------------- Página --------------------------------- */

export default function TRV() {
  const [tab, setTab] = useState('resumen');

  const totalUsuarios = ROLES.reduce((a, r) => a + r.usuarios, 0);
  const integracionesEnLinea = INTEGRACIONES.filter(i => i.estado === 'En línea').length;

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('trv')} funcionalidades · Transversal`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Roles activos" value={fmtNum(ROLES.length)} sub={`${fmtNum(totalUsuarios)} usuarios · segregación de funciones`} tone="default" />
        <StatCard label="Eventos de auditoría (30 días)" value={fmtNum(12840)} sub="registros inmutables con valor anterior" tone="info" />
        <StatCard label="Integraciones en línea" value={`${fmtNum(integracionesEnLinea)} / ${fmtNum(INTEGRACIONES.length)}`} sub="canales seguros y documentados" tone="ok" />
        <StatCard label="Último respaldo" value="Hoy 02:00" sub="incremental 4,2 GB · verificado 03:10" tone="ok" />
      </div>

      <Tabs
        tabs={[
          { id: 'resumen', label: 'Resumen' },
          { id: 'seguridad', label: 'Seguridad y maestros' },
          { id: 'gobierno', label: 'Gobierno y configuración' },
          { id: 'integracion', label: 'Integración e intercambio' },
          { id: 'experiencia', label: 'Analítica y experiencia' },
          { id: 'continuidad', label: 'Documental y continuidad' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'resumen' && <Resumen />}
      {tab === 'seguridad' && (
        <div className="space-y-4">
          <BloqueRoles />
          <BloqueDatosMaestros />
          <BloqueMulticompania />
          <BloqueMonedas />
        </div>
      )}
      {tab === 'gobierno' && (
        <div className="space-y-4">
          <BloqueAuditoria />
          <BloqueNotificaciones />
          <BloqueConfiguracion />
        </div>
      )}
      {tab === 'integracion' && (
        <div className="space-y-4">
          <BloqueIntegraciones />
          <BloqueImportExport />
        </div>
      )}
      {tab === 'experiencia' && (
        <div className="space-y-4">
          <BloqueReporteria />
          <BloqueMovilidad />
          <BloqueLocalizacion />
        </div>
      )}
      {tab === 'continuidad' && (
        <div className="space-y-4">
          <BloqueDocumental />
          <BloqueRespaldo />
        </div>
      )}
    </div>
  );
}

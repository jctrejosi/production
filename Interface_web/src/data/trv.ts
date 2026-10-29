// Datos de demostración del módulo TRV — Funcionalidades transversales.
// Tipos locales a este archivo; no editar archivos compartidos.

export interface Rol {
  id: string;
  nombre: string;
  permisos: string;
  usuarios: number;
  segregacion: string;
}

export const ROLES: Rol[] = [
  { id: 'ROL-01', nombre: 'Administrador del sistema', permisos: 'Todos los módulos · escritura', usuarios: 2, segregacion: 'Segregación completa' },
  { id: 'ROL-02', nombre: 'Jefe de producción', permisos: 'PRD · MES · REN · COS (lectura)', usuarios: 3, segregacion: 'Sin aprobación de costos' },
  { id: 'ROL-03', nombre: 'Supervisor de planta', permisos: 'MES · CAP · CAL (escritura)', usuarios: 8, segregacion: 'Sin acceso a compras' },
  { id: 'ROL-04', nombre: 'Analista de costos', permisos: 'COS · INV (lectura y análisis)', usuarios: 2, segregacion: 'Sin modificar tarifas' },
  { id: 'ROL-05', nombre: 'Automatización / OT', permisos: 'IOT · MNT (configuración)', usuarios: 3, segregacion: 'Sin acceso financiero' },
  { id: 'ROL-06', nombre: 'Auditor externo', permisos: 'Todos los módulos · solo lectura', usuarios: 1, segregacion: 'Solo lectura global' },
];

export interface DatoMaestro {
  id: string;
  entidad: string;
  registros: number;
  versionado: string;
  validacion: string;
  estado: 'OK' | 'En revisión';
}

export const DATOS_MAESTROS: DatoMaestro[] = [
  { id: 'DM-01', entidad: 'Productos', registros: 1240, versionado: 'Por versión de BOM', validacion: 'Campos obligatorios y duplicados', estado: 'OK' },
  { id: 'DM-02', entidad: 'Unidades de medida', registros: 18, versionado: 'Catálogo cerrado', validacion: 'Conversiones validadas', estado: 'OK' },
  { id: 'DM-03', entidad: 'Categorías', registros: 42, versionado: 'Árbol jerárquico', validacion: 'Un solo padre directo', estado: 'OK' },
  { id: 'DM-04', entidad: 'Proveedores', registros: 96, versionado: 'Histórico de cambios', validacion: 'NIT ante DIAN', estado: 'OK' },
  { id: 'DM-05', entidad: 'Clientes', registros: 210, versionado: 'Histórico de cambios', validacion: 'NIT ante DIAN', estado: 'OK' },
  { id: 'DM-06', entidad: 'Ubicaciones y almacenes', registros: 35, versionado: 'Sin versionado', validacion: 'Código único por planta', estado: 'OK' },
  { id: 'DM-07', entidad: 'Centros de costo', registros: 24, versionado: 'Versionado anual', validacion: 'Aprobación de finanzas', estado: 'En revisión' },
  { id: 'DM-08', entidad: 'Recursos (equipos y operarios)', registros: 64, versionado: 'Histórico de cambios', validacion: 'Capacidad y tarifa validadas', estado: 'OK' },
];

export interface Compania {
  id: string;
  nombre: string;
  plantas: number;
  almacenes: number;
  moneda: string;
  estado: 'Activa' | 'Inactiva';
}

export const COMPANIAS: Compania[] = [
  { id: 'CIA-01', nombre: 'Mercaldas Producción S.A.S.', plantas: 2, almacenes: 3, moneda: 'COP', estado: 'Activa' },
  { id: 'CIA-02', nombre: 'Mercaldas Empaques S.A.S.', plantas: 1, almacenes: 1, moneda: 'COP', estado: 'Activa' },
  { id: 'CIA-03', nombre: 'Exportadora Mercaldas', plantas: 1, almacenes: 1, moneda: 'USD', estado: 'Activa' },
];

export interface Moneda {
  codigo: string;
  nombre: string;
  tasa: number;
  fecha: string;
}

export const MONEDAS: Moneda[] = [
  { codigo: 'COP', nombre: 'Peso colombiano', tasa: 1, fecha: '2026-10-28' },
  { codigo: 'USD', nombre: 'Dólar estadounidense', tasa: 4118.5, fecha: '2026-10-28' },
  { codigo: 'EUR', nombre: 'Euro', tasa: 4560.2, fecha: '2026-10-28' },
];

export interface UnidadMedida {
  codigo: string;
  nombre: string;
  factor: number;
}

export const UNIDADES_MEDIDA: UnidadMedida[] = [
  { codigo: 'KG', nombre: 'Kilogramo', factor: 1 },
  { codigo: 'G', nombre: 'Gramo', factor: 0.001 },
  { codigo: 'L', nombre: 'Litro', factor: 1 },
  { codigo: 'ML', nombre: 'Mililitro', factor: 0.001 },
  { codigo: 'UN', nombre: 'Unidad', factor: 1 },
  { codigo: 'CJA', nombre: 'Caja', factor: 12 },
  { codigo: 'PAL', nombre: 'Estiba', factor: 48 },
];

export interface EventoAuditoria {
  id: string;
  fecha: string;
  hora: string;
  usuario: string;
  modulo: string;
  accion: string;
  detalle: string;
  valorAnterior: string;
}

export const AUDITORIA: EventoAuditoria[] = [
  { id: 'AUD-01', fecha: '2026-10-28', hora: '08:40', usuario: 'Juliana Ospina', modulo: 'COS', accion: 'Modificación', detalle: 'Tarifa de MO centro MEZ-01', valorAnterior: '18.000 → 18.500' },
  { id: 'AUD-02', fecha: '2026-10-28', hora: '08:35', usuario: 'Carlos Vélez', modulo: 'MNT', accion: 'Creación', detalle: 'Solicitud de mantenimiento MT-2045', valorAnterior: '—' },
  { id: 'AUD-03', fecha: '2026-10-28', hora: '08:22', usuario: 'Laura Gómez', modulo: 'COS', accion: 'Aprobación', detalle: 'Variación VAR-01 (material OF-1048)', valorAnterior: 'Pendiente → Aprobada' },
  { id: 'AUD-04', fecha: '2026-10-28', hora: '08:10', usuario: 'Sistema', modulo: 'TRV', accion: 'Eliminación', detalle: 'Sesiones expiradas', valorAnterior: '3 sesiones' },
  { id: 'AUD-05', fecha: '2026-10-28', hora: '07:58', usuario: 'Juliana Ospina', modulo: 'INV', accion: 'Modificación', detalle: 'Ajuste de inventario AJ-118', valorAnterior: '+12 kg pulpa de mora' },
  { id: 'AUD-06', fecha: '2026-10-28', hora: '07:45', usuario: 'Pedro Ruiz', modulo: 'TRV', accion: 'Consulta', detalle: 'Descarga de reporte REP-01 (PDF)', valorAnterior: '—' },
  { id: 'AUD-07', fecha: '2026-10-27', hora: '18:20', usuario: 'María Restrepo', modulo: 'TRV', accion: 'Modificación', detalle: 'Permiso «aprobar» en rol Supervisor de planta', valorAnterior: 'Sí → No' },
];

export interface Notificacion {
  id: string;
  evento: string;
  canales: string;
  responsables: string;
  escalamiento: string;
  estado: 'Activa' | 'Pausada';
}

export const NOTIFICACIONES: Notificacion[] = [
  { id: 'NOT-01', evento: 'Alarma industrial de criticidad alta', canales: 'Correo + app', responsables: 'Mantenimiento · Supervisión', escalamiento: '15 min → Jefe de planta', estado: 'Activa' },
  { id: 'NOT-02', evento: 'Orden de compra vencida sin recepción', canales: 'Correo', responsables: 'Compras', escalamiento: '24 h → Gerencia', estado: 'Activa' },
  { id: 'NOT-03', evento: 'Lote liberado de inspección', canales: 'App', responsables: 'Calidad · Producción', escalamiento: 'Sin escalamiento', estado: 'Activa' },
  { id: 'NOT-04', evento: 'Respaldo completado', canales: 'Correo', responsables: 'TI', escalamiento: 'Sin escalamiento', estado: 'Activa' },
  { id: 'NOT-05', evento: 'Desconexión de dispositivo OT > 60 s', canales: 'Correo + app', responsables: 'TI/OT', escalamiento: '30 min → Gerencia de TI', estado: 'Pausada' },
];

export interface ReporteTrv {
  id: string;
  nombre: string;
  modulo: string;
  formato: string;
  frecuencia: string;
}

export const REPORTES_TRV: ReporteTrv[] = [
  { id: 'REP-01', nombre: 'Resumen operativo diario', modulo: 'Producción', formato: 'PDF', frecuencia: 'Diario' },
  { id: 'REP-02', nombre: 'Auditoría por usuario', modulo: 'Auditoría', formato: 'XLSX', frecuencia: 'Mensual' },
  { id: 'REP-03', nombre: 'Estado de integraciones', modulo: 'TI/OT', formato: 'Web', frecuencia: 'Semanal' },
  { id: 'REP-04', nombre: 'Resultados de importaciones', modulo: 'Datos', formato: 'XLSX', frecuencia: 'Bajo demanda' },
  { id: 'REP-05', nombre: 'Indicadores por planta', modulo: 'Dirección', formato: 'Web', frecuencia: 'Semanal' },
];

export interface Integracion {
  id: string;
  sistema: string;
  canal: string;
  estado: 'En línea' | 'Degradada' | 'Fuera de línea';
  ultimaSync: string;
}

export const INTEGRACIONES: Integracion[] = [
  { id: 'INT-01', sistema: 'ERP financiero', canal: 'API REST (TLS 1.3)', estado: 'En línea', ultimaSync: '2026-10-28 07:00' },
  { id: 'INT-02', sistema: 'Sistema de nómina', canal: 'Archivo plano (SFTP)', estado: 'En línea', ultimaSync: '2026-10-27 22:00' },
  { id: 'INT-03', sistema: 'Básculas de camiones', canal: 'TCP directo (red OT)', estado: 'En línea', ultimaSync: '2026-10-28 08:40' },
  { id: 'INT-04', sistema: 'Pasarela de pagos', canal: 'API REST (TLS 1.3)', estado: 'En línea', ultimaSync: '2026-10-27 23:59' },
  { id: 'INT-05', sistema: 'CRM de ventas', canal: 'API REST (TLS 1.3)', estado: 'Degradada', ultimaSync: '2026-10-27 12:30' },
  { id: 'INT-06', sistema: 'MES legado', canal: 'API REST (TLS 1.3)', estado: 'En línea', ultimaSync: '2026-10-28 07:30' },
];

export interface JobDatos {
  id: string;
  tipo: 'Importación' | 'Exportación';
  detalle: string;
  formato: string;
  registros: number;
  errores: number;
  estado: 'Completado' | 'Completo con errores' | 'Fallido';
}

export const JOBS_DATOS: JobDatos[] = [
  { id: 'JOB-01', tipo: 'Importación', detalle: 'Productos', formato: 'XLSX', registros: 1240, errores: 3, estado: 'Completo con errores' },
  { id: 'JOB-02', tipo: 'Importación', detalle: 'Tarifas de costos', formato: 'CSV', registros: 24, errores: 0, estado: 'Completado' },
  { id: 'JOB-03', tipo: 'Exportación', detalle: 'Reporte de variaciones', formato: 'PDF', registros: 0, errores: 0, estado: 'Completado' },
  { id: 'JOB-04', tipo: 'Importación', detalle: 'Proveedores', formato: 'XLSX', registros: 96, errores: 2, estado: 'Completo con errores' },
  { id: 'JOB-05', tipo: 'Exportación', detalle: 'Auditoría período 2026-10', formato: 'XLSX', registros: 0, errores: 0, estado: 'Completado' },
];

export interface Parametro {
  id: string;
  categoria: 'Numeración' | 'Umbral' | 'Calendario' | 'Política';
  nombre: string;
  valor: string;
  estado: 'Activo' | 'Inactivo';
}

export const PARAMETROS: Parametro[] = [
  { id: 'PAR-01', categoria: 'Numeración', nombre: 'Prefijo de órdenes de fabricación', valor: 'OF-{AÑO}-', estado: 'Activo' },
  { id: 'PAR-02', categoria: 'Umbral', nombre: 'Alerta de variación de costo', valor: '10 %', estado: 'Activo' },
  { id: 'PAR-03', categoria: 'Calendario', nombre: 'Días hábiles de planta', valor: 'Lun – Sáb', estado: 'Activo' },
  { id: 'PAR-04', categoria: 'Política', nombre: 'Retención de auditoría', valor: '36 meses', estado: 'Activo' },
  { id: 'PAR-05', categoria: 'Umbral', nombre: 'Parada sin alarma', valor: '15 min', estado: 'Activo' },
  { id: 'PAR-06', categoria: 'Política', nombre: 'Doble aprobación de costos', valor: 'Sí · desde $ 5.000.000', estado: 'Activo' },
];

export interface TerminalMovil {
  id: string;
  equipo: string;
  ubicacion: string;
  usuario: string;
  estado: 'En uso' | 'Disponible' | 'Sin conexión';
  modo: string;
}

export const TERMINALES: TerminalMovil[] = [
  { id: 'MOV-01', equipo: 'Terminal línea 1', ubicacion: 'Empaque', usuario: 'Operario de envasado', estado: 'En uso', modo: 'Modo quiosco' },
  { id: 'MOV-02', equipo: 'Tablet de supervisión', ubicacion: 'Sala de control', usuario: 'Supervisor de planta', estado: 'En uso', modo: 'Web móvil' },
  { id: 'MOV-03', equipo: 'Lector CAP-07', ubicacion: 'Almacén', usuario: 'Auxiliar de bodega', estado: 'En uso', modo: 'App de captura' },
  { id: 'MOV-04', equipo: 'Terminal línea 2', ubicacion: 'Mezclas', usuario: 'Operario de mezcla', estado: 'En uso', modo: 'Modo quiosco' },
  { id: 'MOV-05', equipo: 'PDA de mantenimiento', ubicacion: 'Planta', usuario: '—', estado: 'Disponible', modo: 'App de órdenes de trabajo' },
];

export interface Documento {
  id: string;
  nombre: string;
  asociadoA: string;
  version: string;
  estado: 'Aprobado' | 'En revisión' | 'Borrador';
}

export const DOCUMENTOS: Documento[] = [
  { id: 'DOC-01', nombre: 'Ficha técnica néctar de mora', asociadoA: 'Producto P-101', version: 'v4.2', estado: 'Aprobado' },
  { id: 'DOC-02', nombre: 'Hoja de seguridad azúcar', asociadoA: 'Material MAT-02', version: 'v2.0', estado: 'Aprobado' },
  { id: 'DOC-03', nombre: 'Instructivo operación MEZ-01', asociadoA: 'Recurso MEZ-01', version: 'v1.3', estado: 'En revisión' },
  { id: 'DOC-04', nombre: 'Certificado de análisis lote', asociadoA: 'Lote L-2026-118', version: 'v1.0', estado: 'Aprobado' },
  { id: 'DOC-05', nombre: 'Procedimiento de cierre de costos', asociadoA: 'Proceso COS', version: 'v3.1', estado: 'Aprobado' },
  { id: 'DOC-06', nombre: 'Manual de usuario de captura', asociadoA: 'Módulo CAP', version: 'v1.0', estado: 'Borrador' },
];

export interface Localizacion {
  id: string;
  aspecto: string;
  valor: string;
  estado: 'Activo' | 'Inactivo';
}

export const LOCALIZACION: Localizacion[] = [
  { id: 'LOC-01', aspecto: 'Idioma por defecto', valor: 'Español (Colombia)', estado: 'Activo' },
  { id: 'LOC-02', aspecto: 'Moneda funcional', valor: 'COP — Peso colombiano', estado: 'Activo' },
  { id: 'LOC-03', aspecto: 'Impuesto principal', valor: 'IVA 19 %', estado: 'Activo' },
  { id: 'LOC-04', aspecto: 'Formato de fecha', valor: 'dd/mm/aaaa', estado: 'Activo' },
  { id: 'LOC-05', aspecto: 'Validación de terceros', valor: 'NIT validado ante DIAN', estado: 'Activo' },
  { id: 'LOC-06', aspecto: 'Zona horaria', valor: 'America/Bogota', estado: 'Activo' },
];

export interface Respaldo {
  id: string;
  fecha: string;
  tipo: 'Completo' | 'Incremental';
  tamano: string;
  destino: string;
  estado: 'Completado' | 'Completo con advertencia' | 'Fallido';
  verificacion: string;
}

export const RESPALDOS: Respaldo[] = [
  { id: 'BKP-01', fecha: '2026-10-28 02:00', tipo: 'Incremental', tamano: '4,2 GB', destino: 'Nube + cinta', estado: 'Completado', verificacion: 'Verificado 03:10' },
  { id: 'BKP-02', fecha: '2026-10-27 02:00', tipo: 'Incremental', tamano: '3,8 GB', destino: 'Nube + cinta', estado: 'Completado', verificacion: 'Verificado 03:05' },
  { id: 'BKP-03', fecha: '2026-10-26 02:00', tipo: 'Completo', tamano: '48,6 GB', destino: 'Nube + cinta', estado: 'Completado', verificacion: 'Verificado 05:40' },
  { id: 'BKP-04', fecha: '2026-10-20 02:00', tipo: 'Incremental', tamano: '9,1 GB', destino: 'Nube + cinta', estado: 'Completo con advertencia', verificacion: 'Verificación parcial' },
  { id: 'BKP-05', fecha: '2026-10-13 02:00', tipo: 'Incremental', tamano: '8,7 GB', destino: 'Nube + cinta', estado: 'Fallido', verificacion: '—' },
];

export const ULTIMA_RESTAURACION = 'Prueba de restauración completa: 2026-10-05 · exitosa · tiempo de recuperación 42 min';

// Datos de demostración del módulo Mantenimiento (MNT).
// Entidades: equipos, categorías, equipos de mantenimiento, etapas,
// solicitudes, recurrencias, indicadores de fiabilidad (MTBF/MTTR),
// repuestos y órdenes de reparación.

export type PrioridadSolicitud = 'Alta' | 'Media' | 'Baja';
export type EstadoSolicitud = 'Abierta' | 'Cerrada' | 'Cancelada';

/* ----------------------------------- Equipos ----------------------------------- */

export interface Equipo {
  id: string;
  nombre: string;
  categoria: string;
  propietario: string;
  responsable: string;
  proveedor: string;
  modelo: string;
  serie: string;
  costo: number;
  garantiaHasta: string;
  fechaAsignacion: string;
  fechaBaja: string | null;
  ubicacion: string;
  usuario: string;
  observaciones: string;
}

export const EQUIPOS: Equipo[] = [
  { id: 'EQ-MEZ-01', nombre: 'Mezcladora planetaria MP-120', categoria: 'Maquinaria de proceso', propietario: 'Producción', responsable: 'Juan Pablo Restrepo', proveedor: 'Hobart Colombia', modelo: 'HL-120', serie: 'HB-2201-8841', costo: 48500000, garantiaHasta: '2027-03-15', fechaAsignacion: '2024-03-20', fechaBaja: null, ubicacion: 'Planta · Línea panificación', usuario: 'Línea 2 — Panificación', observaciones: 'Calibración de velocidades cada 6 meses.' },
  { id: 'EQ-HOR-02', nombre: 'Horno rotativo OR-90', categoria: 'Maquinaria de proceso', propietario: 'Producción', responsable: 'Juan Pablo Restrepo', proveedor: 'Termoindustriales SA', modelo: 'OR-90G', serie: 'TI-9012-3371', costo: 96500000, garantiaHasta: '2026-11-30', fechaAsignacion: '2024-01-10', fechaBaja: null, ubicacion: 'Planta · Línea panificación', usuario: 'Línea 2 — Panificación', observaciones: 'Sensor de zona fría reportado en NC-04.' },
  { id: 'EQ-ENV-03', nombre: 'Envasadora al vacío VA-200', categoria: 'Empaque', propietario: 'Producción', responsable: 'Diana Mejía', proveedor: 'Empaques y Tecnología', modelo: 'VA-200S', serie: 'ET-2001-5523', costo: 32100000, garantiaHasta: '2026-12-01', fechaAsignacion: '2024-06-05', fechaBaja: null, ubicacion: 'Planta · Envasado', usuario: 'Envasado', observaciones: 'Cambio de mordaza cada 500 h.' },
  { id: 'EQ-DOS-04', nombre: 'Dosificadora gravimétrica DG-40', categoria: 'Empaque', propietario: 'Producción', responsable: 'Diana Mejía', proveedor: 'Pesaje Industrial', modelo: 'DG-40', serie: 'PI-4410-9021', costo: 18800000, garantiaHasta: '2026-08-15', fechaAsignacion: '2024-08-12', fechaBaja: null, ubicacion: 'Planta · Envasado', usuario: 'Envasado', observaciones: 'Deriva detectada; recalibrada el 2026-10-28.' },
  { id: 'EQ-FRI-05', nombre: 'Cuarto frío CF-01', categoria: 'Infraestructura', propietario: 'Almacén', responsable: 'Luisa Rojas', proveedor: 'Frío Andino', modelo: 'CF-300', serie: 'FA-3001-1144', costo: 72000000, garantiaHasta: '2025-12-31', fechaAsignacion: '2023-11-15', fechaBaja: null, ubicacion: 'Almacén · Recepción', usuario: 'Almacén', observaciones: 'Registro de temperatura continuo.' },
  { id: 'EQ-BAS-06', nombre: 'Báscula de piso BP-500', categoria: 'Instrumentación', propietario: 'Calidad', responsable: 'Carlos Uribe', proveedor: 'Pesaje Industrial', modelo: 'BP-500', serie: 'PI-9011-7788', costo: 9400000, garantiaHasta: '2026-05-20', fechaAsignacion: '2024-05-02', fechaBaja: null, ubicacion: 'Planta · Recepción', usuario: 'Calidad', observaciones: 'Calibración externa anual.' },
  { id: 'EQ-MON-07', nombre: 'Montacargas MC-02', categoria: 'Equipos móviles', propietario: 'Almacén', responsable: 'Óscar Duarte', proveedor: 'Yale Lift', modelo: 'ERP-16', serie: 'YL-1601-2290', costo: 61200000, garantiaHasta: '2024-10-30', fechaAsignacion: '2023-09-01', fechaBaja: null, ubicacion: 'Almacén · Patio', usuario: 'Almacén', observaciones: 'Fuera de garantía desde 2024.' },
];

/* --------------------------------- Categorías ---------------------------------- */

export interface CategoriaEquipo {
  id: string;
  nombre: string;
  responsableDefault: string;
  propiedades: string[];
}

export const CATEGORIAS_EQUIPO: CategoriaEquipo[] = [
  { id: 'CAT-01', nombre: 'Maquinaria de proceso', responsableDefault: 'Juan Pablo Restrepo', propiedades: ['Potencia (kW)', 'Temperatura máx.'] },
  { id: 'CAT-02', nombre: 'Empaque', responsableDefault: 'Diana Mejía', propiedades: ['Velocidad (u/min)', 'Tipo de material'] },
  { id: 'CAT-03', nombre: 'Infraestructura', responsableDefault: 'Luisa Rojas', propiedades: ['Área (m²)', 'Temperatura objetivo'] },
  { id: 'CAT-04', nombre: 'Instrumentación', responsableDefault: 'Carlos Uribe', propiedades: ['Rango de medida', 'Clase de precisión'] },
  { id: 'CAT-05', nombre: 'Equipos móviles', responsableDefault: 'Óscar Duarte', propiedades: ['Horas de uso', 'Última inspección'] },
];

/* ---------------------------- Equipos de mantenimiento -------------------------- */

export interface EquipoMantenimiento {
  id: string;
  nombre: string;
  miembros: string[];
  correo: string;
  carga: number;
}

export const EQUIPOS_MANTENIMIENTO: EquipoMantenimiento[] = [
  { id: 'EM-01', nombre: 'Mecánicos', miembros: ['Juan Pablo Restrepo', 'Óscar Duarte'], correo: 'mant-mecanico@mercaldas.co', carga: 78 },
  { id: 'EM-02', nombre: 'Eléctricos e instrumentación', miembros: ['Pedro Arias', 'Carlos Uribe'], correo: 'mant-electrico@mercaldas.co', carga: 45 },
  { id: 'EM-03', nombre: 'Infraestructura', miembros: ['Luisa Rojas'], correo: 'mant-infra@mercaldas.co', carga: 30 },
];

/* ------------------------------------ Etapas ------------------------------------ */

export interface EtapaMantenimiento {
  id: string;
  nombre: string;
  orden: number;
}

export const ETAPAS_MANTENIMIENTO: EtapaMantenimiento[] = [
  { id: 'ET-01', nombre: 'Nueva', orden: 1 },
  { id: 'ET-02', nombre: 'Asignada', orden: 2 },
  { id: 'ET-03', nombre: 'En curso', orden: 3 },
  { id: 'ET-04', nombre: 'En prueba', orden: 4 },
  { id: 'ET-05', nombre: 'Cerrada', orden: 5 },
];

/* ---------------------------------- Solicitudes --------------------------------- */

export interface Solicitud {
  id: string;
  equipoId: string;
  tipo: 'Correctivo' | 'Preventivo';
  prioridad: PrioridadSolicitud;
  responsable: string;
  tecnico: string;
  equipoMantId: string;
  fecha: string;
  descripcion: string;
  instrucciones: string;
  etapa: string;
  programada: string | null;
  finPrevisto: string | null;
  duracionHoras: number | null;
  cierreReal: string | null;
  estado: EstadoSolicitud;
  cambios: boolean;
}

export const SOLICITUDES: Solicitud[] = [
  { id: 'SM-101', equipoId: 'EQ-HOR-02', tipo: 'Correctivo', prioridad: 'Alta', responsable: 'Juan Pablo Restrepo', tecnico: 'Pedro Arias', equipoMantId: 'EM-02', fecha: '2026-10-28', descripcion: 'Zona fría en horno; humedad de granola fuera de criterio.', instrucciones: 'Verificar sensor de temperatura y distribución de aire.', etapa: 'En curso', programada: '2026-10-28 08:00', finPrevisto: '2026-10-28 16:00', duracionHoras: 4, cierreReal: null, estado: 'Abierta', cambios: false },
  { id: 'SM-102', equipoId: 'EQ-DOS-04', tipo: 'Correctivo', prioridad: 'Alta', responsable: 'Diana Mejía', tecnico: 'Juan Pablo Restrepo', equipoMantId: 'EM-01', fecha: '2026-10-27', descripcion: 'Deriva de peso en dosificadora (NC-01).', instrucciones: 'Recalibrar cabezal y verificar repetibilidad.', etapa: 'Cerrada', programada: '2026-10-27 09:00', finPrevisto: '2026-10-27 12:00', duracionHoras: 3, cierreReal: '2026-10-28 11:30', estado: 'Cerrada', cambios: true },
  { id: 'SM-103', equipoId: 'EQ-MEZ-01', tipo: 'Preventivo', prioridad: 'Media', responsable: 'Juan Pablo Restrepo', tecnico: 'Óscar Duarte', equipoMantId: 'EM-01', fecha: '2026-10-25', descripcion: 'Lubricación y ajuste de engranajes.', instrucciones: 'Usar grasa alimentaria grado H1.', etapa: 'En prueba', programada: '2026-10-30 07:00', finPrevisto: '2026-10-30 09:00', duracionHoras: 2, cierreReal: null, estado: 'Abierta', cambios: false },
  { id: 'SM-104', equipoId: 'EQ-FRI-05', tipo: 'Preventivo', prioridad: 'Alta', responsable: 'Luisa Rojas', tecnico: 'Pedro Arias', equipoMantId: 'EM-02', fecha: '2026-10-24', descripcion: 'Revisión trimestral de compresores y termostato.', instrucciones: 'Verificar carga de refrigerante y calibración.', etapa: 'Asignada', programada: '2026-11-02 08:00', finPrevisto: '2026-11-02 13:00', duracionHoras: 5, cierreReal: null, estado: 'Abierta', cambios: false },
  { id: 'SM-105', equipoId: 'EQ-ENV-03', tipo: 'Correctivo', prioridad: 'Media', responsable: 'Diana Mejía', tecnico: 'Juan Pablo Restrepo', equipoMantId: 'EM-01', fecha: '2026-10-23', descripcion: 'Fuga de vacío en mordaza derecha.', instrucciones: 'Cambiar empaque de mordaza.', etapa: 'Cerrada', programada: '2026-10-23 14:00', finPrevisto: '2026-10-23 16:00', duracionHoras: 2, cierreReal: '2026-10-23 15:40', estado: 'Cerrada', cambios: false },
  { id: 'SM-106', equipoId: 'EQ-MON-07', tipo: 'Preventivo', prioridad: 'Baja', responsable: 'Óscar Duarte', tecnico: 'Óscar Duarte', equipoMantId: 'EM-01', fecha: '2026-10-22', descripcion: 'Inspección de horquillas y frenos.', instrucciones: 'Checklist de seguridad de 12 puntos.', etapa: 'Nueva', programada: null, finPrevisto: null, duracionHoras: null, cierreReal: null, estado: 'Abierta', cambios: false },
  { id: 'SM-107', equipoId: 'EQ-BAS-06', tipo: 'Correctivo', prioridad: 'Baja', responsable: 'Carlos Uribe', tecnico: 'Pedro Arias', equipoMantId: 'EM-02', fecha: '2026-10-20', descripcion: 'Pantalla del indicador intermitente.', instrucciones: 'Revisar conexión y batería del indicador.', etapa: 'Cerrada', programada: '2026-10-21 10:00', finPrevisto: '2026-10-21 11:00', duracionHoras: 1, cierreReal: '2026-10-21 10:50', estado: 'Cerrada', cambios: false },
  { id: 'SM-108', equipoId: 'EQ-MEZ-01', tipo: 'Correctivo', prioridad: 'Alta', responsable: 'Juan Pablo Restrepo', tecnico: 'Juan Pablo Restrepo', equipoMantId: 'EM-01', fecha: '2026-10-28', descripcion: 'Ruido anómalo en reductora.', instrucciones: 'Detener equipo e inspeccionar rodamientos.', etapa: 'Nueva', programada: null, finPrevisto: null, duracionHoras: null, cierreReal: null, estado: 'Abierta', cambios: false },
];

/* ---------------------------------- Recurrencia --------------------------------- */

export interface Recurrencia {
  id: string;
  equipoId: string;
  trabajo: string;
  unidad: 'días' | 'semanas' | 'meses' | 'años';
  intervalo: number;
  fin: string | null;
  proxima: string;
  ultima: string | null;
  activa: boolean;
}

export const RECURRENCIAS: Recurrencia[] = [
  { id: 'RE-01', equipoId: 'EQ-MEZ-01', trabajo: 'Lubricación de engranajes', unidad: 'meses', intervalo: 1, fin: null, proxima: '2026-11-25', ultima: '2026-10-25', activa: true },
  { id: 'RE-02', equipoId: 'EQ-FRI-05', trabajo: 'Revisión de compresores', unidad: 'meses', intervalo: 3, fin: null, proxima: '2027-01-24', ultima: '2026-10-24', activa: true },
  { id: 'RE-03', equipoId: 'EQ-ENV-03', trabajo: 'Cambio de mordazas', unidad: 'días', intervalo: 90, fin: '2026-12-31', proxima: '2026-12-21', ultima: '2026-09-22', activa: true },
  { id: 'RE-04', equipoId: 'EQ-BAS-06', trabajo: 'Calibración externa', unidad: 'años', intervalo: 1, fin: null, proxima: '2027-05-02', ultima: '2026-05-02', activa: true },
  { id: 'RE-05', equipoId: 'EQ-HOR-02', trabajo: 'Revisión de quemadores', unidad: 'meses', intervalo: 6, fin: null, proxima: '2027-04-20', ultima: '2026-10-20', activa: true },
];

/* ------------------------- Fiabilidad (MTBF / MTTR) ----------------------------- */

export interface IndicadorFiabilidad {
  equipoId: string;
  mtbfHoras: number;
  mttrHoras: number;
  ultimaFalla: string;
  proximoFalloEstimado: string;
}

export const FIABILIDAD: IndicadorFiabilidad[] = [
  { equipoId: 'EQ-MEZ-01', mtbfHoras: 820, mttrHoras: 3.2, ultimaFalla: '2026-10-28', proximoFalloEstimado: '2026-12-01' },
  { equipoId: 'EQ-HOR-02', mtbfHoras: 640, mttrHoras: 5.5, ultimaFalla: '2026-10-28', proximoFalloEstimado: '2026-11-24' },
  { equipoId: 'EQ-ENV-03', mtbfHoras: 1120, mttrHoras: 1.8, ultimaFalla: '2026-10-23', proximoFalloEstimado: '2026-12-09' },
  { equipoId: 'EQ-DOS-04', mtbfHoras: 430, mttrHoras: 2.6, ultimaFalla: '2026-10-27', proximoFalloEstimado: '2026-11-14' },
  { equipoId: 'EQ-FRI-05', mtbfHoras: 1980, mttrHoras: 4.1, ultimaFalla: '2026-09-30', proximoFalloEstimado: '2026-12-20' },
  { equipoId: 'EQ-MON-07', mtbfHoras: 760, mttrHoras: 6.4, ultimaFalla: '2026-10-18', proximoFalloEstimado: '2026-11-18' },
];

/* ----------------------------------- Repuestos ---------------------------------- */

export interface Repuesto {
  id: string;
  codigo: string;
  nombre: string;
  stock: number;
  reservado: number;
  ubicacion: string;
  costoUnitario: number;
  solicitudId: string | null;
}

export const REPUESTOS: Repuesto[] = [
  { id: 'RP-01', codigo: 'REP-EMP-001', nombre: 'Empaque mordaza VA-200', stock: 6, reservado: 2, ubicacion: 'ALM-A-02-04', costoUnitario: 185000, solicitudId: 'SM-105' },
  { id: 'RP-02', codigo: 'REP-ELE-014', nombre: 'Sensor PT-100 con vaina', stock: 3, reservado: 1, ubicacion: 'ALM-A-01-07', costoUnitario: 94000, solicitudId: 'SM-101' },
  { id: 'RP-03', codigo: 'REP-MEC-007', nombre: 'Rodamiento 6205-2RS', stock: 12, reservado: 0, ubicacion: 'ALM-A-02-01', costoUnitario: 32000, solicitudId: null },
  { id: 'RP-04', codigo: 'REP-ELE-021', nombre: 'Contactor 9A bobina 24V', stock: 4, reservado: 0, ubicacion: 'ALM-A-01-03', costoUnitario: 58000, solicitudId: null },
  { id: 'RP-05', codigo: 'REP-FRI-003', nombre: 'Filtro deshidratador 3/8', stock: 8, reservado: 0, ubicacion: 'ALM-B-03-02', costoUnitario: 41000, solicitudId: null },
  { id: 'RP-06', codigo: 'REP-MEC-011', nombre: 'Grasa grado alimentario H1 (cartucho)', stock: 20, reservado: 1, ubicacion: 'ALM-A-02-09', costoUnitario: 26500, solicitudId: 'SM-103' },
];

/* ------------------------------ Órdenes de reparación --------------------------- */

export interface OrdenReparacion {
  id: string;
  equipoId: string;
  proveedor: string;
  piezas: string[];
  servicios: string[];
  movimientosStock: string[];
  estado: 'Cotización' | 'En taller' | 'Facturada' | 'Entregada';
  total: number;
}

export const ORDENES_REPARACION: OrdenReparacion[] = [
  { id: 'OR-301', equipoId: 'EQ-ENV-03', proveedor: 'Empaques y Tecnología', piezas: ['Mordaza completa VA-200'], servicios: ['Mano de obra', 'Prueba de vacío'], movimientosStock: ['Salida: mordaza usada (garantía)'], estado: 'En taller', total: 1240000 },
  { id: 'OR-302', equipoId: 'EQ-BAS-06', proveedor: 'Pesaje Industrial', piezas: ['Display indicador'], servicios: ['Reparación en sitio'], movimientosStock: ['Salida: display dañado'], estado: 'Facturada', total: 680000 },
  { id: 'OR-303', equipoId: 'EQ-FRI-05', proveedor: 'Frío Andino', piezas: ['Filtro deshidratador'], servicios: ['Cambio y vacío del sistema'], movimientosStock: ['Salida: filtro usado'], estado: 'Cotización', total: 890000 },
  { id: 'OR-304', equipoId: 'EQ-DOS-04', proveedor: 'Pesaje Industrial', piezas: ['Kit de calibración DG-40'], servicios: ['Calibración certificada'], movimientosStock: ['—'], estado: 'Entregada', total: 420000 },
];

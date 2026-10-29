// Datos de demostración del módulo de Trazabilidad Integral (TRA).
// Todo en estado local: sin fetch y sin librerías externas.

export type EstadoLote = 'Liberado' | 'En proceso' | 'Cuarentena' | 'Rechazado' | 'Retirado' | 'Agotado';
export type TipoLote = 'MP' | 'SEMI' | 'PT';

export interface Lote {
  id: string;
  producto: string;
  tipo: TipoLote;
  fecha: string; // ISO
  cantidad: number;
  unidad: string;
  estado: EstadoLote;
  proveedor?: string;
  orden?: string;
  cliente?: string;
  bodega: string;
}

export const LOTES: Lote[] = [
  { id: 'L-2026-096', producto: 'Caña de azúcar', tipo: 'MP', fecha: '2026-09-28', cantidad: 5200, unidad: 'kg', estado: 'Liberado', proveedor: 'CañaBrava S.A.S.', bodega: 'BOD-01' },
  { id: 'L-2026-098', producto: 'Café pergamino', tipo: 'MP', fecha: '2026-09-30', cantidad: 2400, unidad: 'kg', estado: 'Liberado', proveedor: 'Cooperativa Cafetera del Sur', bodega: 'BOD-01' },
  { id: 'L-2026-099', producto: 'Cacao en grano', tipo: 'MP', fecha: '2026-10-02', cantidad: 1800, unidad: 'kg', estado: 'Liberado', proveedor: 'CacaoAndes S.A.S.', bodega: 'BOD-01' },
  { id: 'L-2026-100', producto: 'Miel de caña', tipo: 'SEMI', fecha: '2026-10-08', cantidad: 900, unidad: 'kg', estado: 'En proceso', orden: 'OF-1038', bodega: 'BOD-02' },
  { id: 'L-2026-101', producto: 'Panela pulverizada 500 g', tipo: 'PT', fecha: '2026-10-12', cantidad: 12500, unidad: 'und', estado: 'Liberado', orden: 'OF-1041', cliente: 'DistriAlimentos', bodega: 'BOD-02' },
  { id: 'L-2026-102', producto: 'Panela pulverizada 500 g', tipo: 'PT', fecha: '2026-10-13', cantidad: 12800, unidad: 'und', estado: 'Cuarentena', orden: 'OF-1042', bodega: 'BOD-CUA' },
  { id: 'L-2026-103', producto: 'Café tostado 250 g', tipo: 'PT', fecha: '2026-10-14', cantidad: 9400, unidad: 'und', estado: 'En proceso', orden: 'OF-1045', bodega: 'BOD-02' },
  { id: 'L-2026-104', producto: 'Chocolate de mesa 80 %', tipo: 'PT', fecha: '2026-10-15', cantidad: 6100, unidad: 'und', estado: 'Retirado', orden: 'OF-1043', cliente: 'SuperMercados Andinos', bodega: 'BOD-DEV' },
];

export type ResultadoControl = 'Aprobado' | 'Aprobado con observación' | 'Rechazado';

export interface Recepcion {
  id: string;
  lote: string;
  proveedor: string;
  fecha: string;
  oc: string;
  cantidad: number;
  unidad: string;
  control: string;
  resultado: ResultadoControl;
}

export const RECEPCIONES: Recepcion[] = [
  { id: 'REC-0914', lote: 'L-2026-096', proveedor: 'CañaBrava S.A.S.', fecha: '2026-09-28', oc: 'OC-0887', cantidad: 5200, unidad: 'kg', control: 'CAL-1207', resultado: 'Aprobado con observación' },
  { id: 'REC-0912', lote: 'L-2026-098', proveedor: 'Cooperativa Cafetera del Sur', fecha: '2026-09-30', oc: 'OC-0881', cantidad: 2400, unidad: 'kg', control: 'CAL-1201', resultado: 'Aprobado' },
  { id: 'REC-0913', lote: 'L-2026-099', proveedor: 'CacaoAndes S.A.S.', fecha: '2026-10-02', oc: 'OC-0884', cantidad: 1800, unidad: 'kg', control: 'CAL-1205', resultado: 'Aprobado' },
  { id: 'REC-0915', lote: 'L-2026-106', proveedor: 'EnvasesFlex Ltda.', fecha: '2026-10-08', oc: 'OC-0890', cantidad: 25000, unidad: 'und', control: 'CAL-1210', resultado: 'Aprobado' },
  { id: 'REC-0916', lote: 'L-2026-107', proveedor: 'EmpaquesBio S.A.S.', fecha: '2026-10-09', oc: 'OC-0892', cantidad: 18000, unidad: 'und', control: 'CAL-1212', resultado: 'Rechazado' },
  { id: 'REC-0918', lote: 'L-2026-109', proveedor: 'EmpaquesBio S.A.S.', fecha: '2026-10-10', oc: 'OC-0893', cantidad: 12000, unidad: 'und', control: 'CAL-1213', resultado: 'Aprobado' },
  { id: 'REC-0919', lote: 'L-2026-110', proveedor: 'CañaBrava S.A.S.', fecha: '2026-10-11', oc: 'OC-0896', cantidad: 1500, unidad: 'kg', control: 'CAL-1216', resultado: 'Aprobado' },
];

/** Genealogía de producto terminado: qué materiales (lote MP/SEMI) componen cada lote PT. */
export interface ComponenteGenealogia {
  pt: string;
  mp: string;
  material: string;
  cantidad: number;
  unidad: string;
  recepcion: string;
}

export const COMPONENTES: ComponenteGenealogia[] = [
  { pt: 'L-2026-101', mp: 'L-2026-100', material: 'Miel de caña', cantidad: 810, unidad: 'kg', recepcion: 'REC-0914' },
  { pt: 'L-2026-101', mp: 'L-2026-106', material: 'Empaque laminado 500 g', cantidad: 12500, unidad: 'und', recepcion: 'REC-0915' },
  { pt: 'L-2026-102', mp: 'L-2026-100', material: 'Miel de caña', cantidad: 830, unidad: 'kg', recepcion: 'REC-0914' },
  { pt: 'L-2026-103', mp: 'L-2026-098', material: 'Café pergamino', cantidad: 1750, unidad: 'kg', recepcion: 'REC-0912' },
  { pt: 'L-2026-103', mp: 'L-2026-109', material: 'Bolsa kraft 250 g', cantidad: 9400, unidad: 'und', recepcion: 'REC-0918' },
  { pt: 'L-2026-104', mp: 'L-2026-099', material: 'Cacao en grano', cantidad: 1320, unidad: 'kg', recepcion: 'REC-0913' },
  { pt: 'L-2026-104', mp: 'L-2026-110', material: 'Azúcar morena', cantidad: 540, unidad: 'kg', recepcion: 'REC-0919' },
];

export interface OperacionTrazada {
  id: string;
  orden: string;
  operacion: string;
  operario: string;
  maquina: string;
  turno: string;
  fecha: string;
  inicio: string;
  fin: string;
  lote: string;
}

export const OPERACIONES: OperacionTrazada[] = [
  { id: 'OP-2207', orden: 'OF-1040', operacion: 'Centrifugado', operario: 'Juliana Ospina', maquina: 'CEN-02', turno: 'T1', fecha: '2026-10-16', inicio: '06:00', fin: '12:00', lote: 'L-2026-096' },
  { id: 'OP-2201', orden: 'OF-1041', operacion: 'Tostado de miel', operario: 'Juliana Ospina', maquina: 'HOR-02', turno: 'T1', fecha: '2026-10-12', inicio: '06:00', fin: '14:00', lote: 'L-2026-100' },
  { id: 'OP-2202', orden: 'OF-1041', operacion: 'Pulverizado', operario: 'Carlos Ríos', maquina: 'MOL-01', turno: 'T1', fecha: '2026-10-12', inicio: '14:30', fin: '21:00', lote: 'L-2026-100' },
  { id: 'OP-2203', orden: 'OF-1041', operacion: 'Empaque', operario: 'Laura Gómez', maquina: 'EMP-03', turno: 'T2', fecha: '2026-10-13', inicio: '06:00', fin: '13:30', lote: 'L-2026-101' },
  { id: 'OP-2204', orden: 'OF-1042', operacion: 'Pulverizado', operario: 'Carlos Ríos', maquina: 'MOL-01', turno: 'T1', fecha: '2026-10-14', inicio: '06:00', fin: '13:00', lote: 'L-2026-100' },
  { id: 'OP-2206', orden: 'OF-1043', operacion: 'Conchado', operario: 'Diana Ruiz', maquina: 'CON-01', turno: 'T1', fecha: '2026-10-15', inicio: '06:00', fin: '15:00', lote: 'L-2026-104' },
  { id: 'OP-2205', orden: 'OF-1045', operacion: 'Tostado', operario: 'Andrés Mora', maquina: 'HOR-02', turno: 'T2', fecha: '2026-10-15', inicio: '14:00', fin: '20:30', lote: 'L-2026-103' },
];

export interface Consumo {
  id: string;
  orden: string;
  lote: string;
  material: string;
  teorico: number;
  real: number;
  merma: number;
  ajuste: number;
  unidad: string;
  fecha: string;
}

export const CONSUMOS: Consumo[] = [
  { id: 'CON-306', orden: 'OF-1040', lote: 'L-2026-096', material: 'Caña de azúcar', teorico: 5000, real: 4980, merma: 20, ajuste: 0, unidad: 'kg', fecha: '2026-10-16' },
  { id: 'CON-301', orden: 'OF-1041', lote: 'L-2026-100', material: 'Miel de caña', teorico: 810, real: 815, merma: 0, ajuste: 5, unidad: 'kg', fecha: '2026-10-12' },
  { id: 'CON-302', orden: 'OF-1041', lote: 'L-2026-101', material: 'Empaque laminado 500 g', teorico: 12500, real: 12480, merma: 20, ajuste: -20, unidad: 'und', fecha: '2026-10-13' },
  { id: 'CON-303', orden: 'OF-1042', lote: 'L-2026-100', material: 'Miel de caña', teorico: 830, real: 828, merma: 2, ajuste: 0, unidad: 'kg', fecha: '2026-10-14' },
  { id: 'CON-304', orden: 'OF-1045', lote: 'L-2026-098', material: 'Café pergamino', teorico: 1750, real: 1735, merma: 15, ajuste: 0, unidad: 'kg', fecha: '2026-10-15' },
  { id: 'CON-305', orden: 'OF-1043', lote: 'L-2026-099', material: 'Cacao en grano', teorico: 1320, real: 1312, merma: 8, ajuste: 0, unidad: 'kg', fecha: '2026-10-15' },
];

export interface DefectoLote {
  id: string;
  lote: string;
  orden: string;
  tipo: string;
  nc: string;
  proceso: string;
  fecha: string;
  estado: 'Abierta' | 'En análisis' | 'Cerrada';
}

export const DEFECTOS: DefectoLote[] = [
  { id: 'DEF-517', lote: 'L-2026-105', orden: 'OF-1040', tipo: 'Color fuera de especificación', nc: 'NC-0446', proceso: 'Centrifugado', fecha: '2026-10-16', estado: 'Abierta' },
  { id: 'DEF-515', lote: 'L-2026-103', orden: 'OF-1045', tipo: 'Grado de tostión alto', nc: 'NC-0443', proceso: 'Tostado', fecha: '2026-10-15', estado: 'En análisis' },
  { id: 'DEF-514', lote: 'L-2026-104', orden: 'OF-1043', tipo: 'Partículas extrañas', nc: 'NC-0445', proceso: 'Conchado', fecha: '2026-10-15', estado: 'Abierta' },
  { id: 'DEF-512', lote: 'L-2026-102', orden: 'OF-1042', tipo: 'Humedad fuera de rango', nc: 'NC-0442', proceso: 'Secado', fecha: '2026-10-13', estado: 'Abierta' },
  { id: 'DEF-513', lote: 'L-2026-101', orden: 'OF-1041', tipo: 'Sello defectuoso', nc: 'NC-0440', proceso: 'Empaque', fecha: '2026-10-13', estado: 'Cerrada' },
  { id: 'DEF-516', lote: 'L-2026-101', orden: 'OF-1041', tipo: 'Peso variable', nc: 'AL-0221', proceso: 'Empaque', fecha: '2026-10-13', estado: 'Cerrada' },
];

export interface ReprocesoLote {
  id: string;
  lote: string;
  orden: string;
  motivo: string;
  responsable: string;
  resultado: 'En proceso' | 'Liberado' | 'Rechazado';
  fecha: string;
  costo: number;
}

export const REPROCESOS: ReprocesoLote[] = [
  { id: 'RPR-115', lote: 'L-2026-105', orden: 'OF-1040', motivo: 'Recristalización', responsable: 'Juliana Ospina', resultado: 'Liberado', fecha: '2026-10-17', costo: 380000 },
  { id: 'RPR-118', lote: 'L-2026-102', orden: 'OF-1042', motivo: 'Re-secado por humedad', responsable: 'Carlos Ríos', resultado: 'En proceso', fecha: '2026-10-16', costo: 420000 },
  { id: 'RPR-114', lote: 'L-2026-104', orden: 'OF-1043', motivo: 'Tamizado por partículas', responsable: 'Diana Ruiz', resultado: 'Rechazado', fecha: '2026-10-16', costo: 450000 },
  { id: 'RPR-116', lote: 'L-2026-103', orden: 'OF-1045', motivo: 'Re-tostado por color', responsable: 'Andrés Mora', resultado: 'Rechazado', fecha: '2026-10-16', costo: 260000 },
  { id: 'RPR-117', lote: 'L-2026-101', orden: 'OF-1041', motivo: 'Re-empaque por sello', responsable: 'Laura Gómez', resultado: 'Liberado', fecha: '2026-10-14', costo: 310000 },
];

export interface Cuarentena {
  id: string;
  lote: string;
  motivo: string;
  fechaInicio: string;
  ubicacion: string;
  decision?: 'Liberado' | 'Rechazado' | 'Pendiente';
  fechaDecision?: string;
  estado: 'En cuarentena' | 'Cerrada';
}

export const CUARENTENAS: Cuarentena[] = [
  { id: 'CUA-031', lote: 'L-2026-102', motivo: 'Humedad 7,8 % (límite 6,5 %)', fechaInicio: '2026-10-13', ubicacion: 'BOD-CUA-A2', decision: 'Pendiente', estado: 'En cuarentena' },
  { id: 'CUA-030', lote: 'L-2026-107', motivo: 'Empaque con defecto de laminado', fechaInicio: '2026-10-09', ubicacion: 'BOD-CUA-A1', decision: 'Rechazado', fechaDecision: '2026-10-10', estado: 'Cerrada' },
  { id: 'CUA-029', lote: 'L-2026-110', motivo: 'Azúcar morena en verificación', fechaInicio: '2026-10-11', ubicacion: 'BOD-CUA-B1', decision: 'Liberado', fechaDecision: '2026-10-12', estado: 'Cerrada' },
  { id: 'CUA-028', lote: 'L-2026-109', motivo: 'Bolsas con olor extraño', fechaInicio: '2026-10-10', ubicacion: 'BOD-CUA-A1', decision: 'Rechazado', fechaDecision: '2026-10-11', estado: 'Cerrada' },
  { id: 'CUA-027', lote: 'L-2026-096', motivo: 'Caña con impurezas altas', fechaInicio: '2026-09-28', ubicacion: 'BOD-CUA-C1', decision: 'Liberado', fechaDecision: '2026-09-29', estado: 'Cerrada' },
];

export interface Retiro {
  id: string;
  producto: string;
  lotes: string;
  alcance: string;
  fecha: string;
  motivo: string;
  criticidad: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  notificados: number;
  devueltos: number;
  total: number;
  estado: 'En curso' | 'Cerrado';
}

export const RETIROS: Retiro[] = [
  { id: 'RET-004', producto: 'Chocolate de mesa 80 %', lotes: 'L-2026-104', alcance: '6.100 und · 1 cliente', fecha: '2026-10-18', motivo: 'Partículas extrañas detectadas en control de calidad', criticidad: 'Crítico', notificados: 2, devueltos: 5800, total: 6100, estado: 'En curso' },
  { id: 'RET-003', producto: 'Panela pulverizada 500 g', lotes: 'L-2026-101', alcance: '12.500 und · 3 clientes', fecha: '2026-10-15', motivo: 'Sello defectuoso en empaque', criticidad: 'Bajo', notificados: 3, devueltos: 12500, total: 12500, estado: 'Cerrado' },
  { id: 'RET-002', producto: 'Azúcar orgánica 1 kg', lotes: 'L-2026-105', alcance: '8.800 und · 2 clientes', fecha: '2026-09-20', motivo: 'Etiquetado incorrecto de lote', criticidad: 'Medio', notificados: 2, devueltos: 8600, total: 8800, estado: 'Cerrado' },
  { id: 'RET-001', producto: 'Café tostado 250 g', lotes: 'L-2026-092', alcance: '7.400 und · 1 cliente', fecha: '2026-08-12', motivo: 'Tostión excesiva', criticidad: 'Medio', notificados: 1, devueltos: 7400, total: 7400, estado: 'Cerrado' },
];

export interface NotificacionTra {
  id: string;
  evento: string;
  destino: string;
  canal: 'Correo' | 'Sistema' | 'SMS' | 'Reporte diario';
  fecha: string;
  criticidad: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  estado: 'Enviada' | 'Leída';
}

export const NOTIFICACIONES: NotificacionTra[] = [
  { id: 'NOT-221', evento: 'Retiro RET-004', destino: 'Cliente: SuperMercados Andinos', canal: 'Correo', fecha: '2026-10-18', criticidad: 'Crítico', estado: 'Enviada' },
  { id: 'NOT-220', evento: 'Cuarentena CUA-031', destino: 'Calidad', canal: 'Sistema', fecha: '2026-10-13', criticidad: 'Alto', estado: 'Enviada' },
  { id: 'NOT-219', evento: 'Liberación CUA-029', destino: 'Almacén', canal: 'Sistema', fecha: '2026-10-12', criticidad: 'Medio', estado: 'Enviada' },
  { id: 'NOT-218', evento: 'Rechazo REC-0916', destino: 'Proveedor: EmpaquesBio S.A.S.', canal: 'Correo', fecha: '2026-10-09', criticidad: 'Alto', estado: 'Enviada' },
  { id: 'NOT-217', evento: 'No conformidad NC-0442', destino: 'Producción', canal: 'Sistema', fecha: '2026-10-13', criticidad: 'Medio', estado: 'Leída' },
  { id: 'NOT-216', evento: 'Defecto DEF-512', destino: 'Dirección', canal: 'Reporte diario', fecha: '2026-10-14', criticidad: 'Bajo', estado: 'Enviada' },
];

/** Periodos de retención/archivo por tipo de registro (TRA-15). */
export const RETENCION = [
  { tipo: 'Expedientes de lote (PT)', periodo: '5 años', destino: 'Archivo digital + físico', politica: 'POL-ARC-04' },
  { tipo: 'Registros de trazabilidad', periodo: '5 años', destino: 'Histórico inmutable', politica: 'POL-ARC-04' },
  { tipo: 'Retiros (recall)', periodo: '10 años', destino: 'Expediente de retiro', politica: 'POL-ARC-07' },
  { tipo: 'Controles de calidad', periodo: '3 años', destino: 'Archivo digital', politica: 'POL-ARC-02' },
  { tipo: 'Notificaciones y auditoría', periodo: '5 años', destino: 'Log de auditoría', politica: 'POL-ARC-04' },
] as const;

/** Reportes disponibles (TRA-14). */
export const REPORTES_TRA = [
  { id: 'REP-TRA-01', nombre: 'Genealogía de lote o serie', periodicidad: 'A demanda' },
  { id: 'REP-TRA-02', nombre: 'Trazabilidad hacia atrás y adelante', periodicidad: 'A demanda' },
  { id: 'REP-TRA-03', nombre: 'Consumos por orden y lote', periodicidad: 'Semanal' },
  { id: 'REP-TRA-04', nombre: 'Defectos y reprocesos por lote', periodicidad: 'Mensual' },
  { id: 'REP-TRA-05', nombre: 'Lotes en cuarentena', periodicidad: 'Diaria' },
  { id: 'REP-TRA-06', nombre: 'Alcance y efectividad de retiros', periodicidad: 'Por evento' },
] as const;

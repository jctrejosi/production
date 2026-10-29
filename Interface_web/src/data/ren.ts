// Datos de demostración del módulo de Rendimiento y Eficiencia (REN).
// Todo en estado local: sin fetch y sin librerías externas.

export interface RegistroOee {
  id: string;
  centro: string;
  equipo: string;
  linea: string;
  fecha: string;
  turno: string;
  disponibilidad: number;
  rendimiento: number;
  calidad: number;
  objetivo: number;
}

/** OEE = disponibilidad × rendimiento × calidad. */
export function calcularOee(r: RegistroOee): number {
  return r.disponibilidad * r.rendimiento * r.calidad;
}

export const OEE: RegistroOee[] = [
  { id: 'OEE-1601', centro: 'Centro 2 – Empaque', equipo: 'EMP-03', linea: 'L2 Empaque', fecha: '2026-10-16', turno: 'T1', disponibilidad: 0.95, rendimiento: 0.93, calidad: 0.992, objetivo: 0.8 },
  { id: 'OEE-1602', centro: 'Centro 5 – Centrifugado', equipo: 'CEN-02', linea: 'L5 Azúcar', fecha: '2026-10-16', turno: 'T1', disponibilidad: 0.93, rendimiento: 0.88, calidad: 0.99, objetivo: 0.75 },
  { id: 'OEE-1603', centro: 'Centro 1 – Molienda', equipo: 'MOL-01', linea: 'L1 Panela', fecha: '2026-10-16', turno: 'T1', disponibilidad: 0.92, rendimiento: 0.87, calidad: 0.985, objetivo: 0.75 },
  { id: 'OEE-1604', centro: 'Centro 3 – Tostión', equipo: 'HOR-02', linea: 'L3 Café', fecha: '2026-10-15', turno: 'T2', disponibilidad: 0.88, rendimiento: 0.9, calidad: 0.978, objetivo: 0.78 },
  { id: 'OEE-1605', centro: 'Centro 4 – Conchado', equipo: 'CON-01', linea: 'L4 Chocolate', fecha: '2026-10-15', turno: 'T1', disponibilidad: 0.9, rendimiento: 0.85, calidad: 0.97, objetivo: 0.78 },
  { id: 'OEE-1606', centro: 'Centro 2 – Empaque', equipo: 'EMP-03', linea: 'L2 Empaque', fecha: '2026-10-15', turno: 'T2', disponibilidad: 0.94, rendimiento: 0.91, calidad: 0.988, objetivo: 0.8 },
  { id: 'OEE-1607', centro: 'Centro 1 – Molienda', equipo: 'MOL-01', linea: 'L1 Panela', fecha: '2026-10-15', turno: 'T2', disponibilidad: 0.89, rendimiento: 0.84, calidad: 0.982, objetivo: 0.75 },
];

export interface Disponibilidad {
  id: string;
  equipo: string;
  fecha: string;
  turno: string;
  planificadoMin: number;
  productivoMin: number;
  paradasMin: number;
  esperasMin: number;
}

/** Disponibilidad = tiempo productivo / tiempo planificado. */
export function pctDisponibilidad(d: Disponibilidad): number {
  return d.productivoMin / d.planificadoMin;
}

export const DISPONIBILIDADES: Disponibilidad[] = [
  { id: 'DIS-201', equipo: 'MOL-01', fecha: '2026-10-16', turno: 'T1', planificadoMin: 480, productivoMin: 442, paradasMin: 28, esperasMin: 10 },
  { id: 'DIS-202', equipo: 'EMP-03', fecha: '2026-10-16', turno: 'T1', planificadoMin: 480, productivoMin: 456, paradasMin: 14, esperasMin: 10 },
  { id: 'DIS-203', equipo: 'HOR-02', fecha: '2026-10-15', turno: 'T2', planificadoMin: 420, productivoMin: 370, paradasMin: 38, esperasMin: 12 },
  { id: 'DIS-204', equipo: 'CON-01', fecha: '2026-10-15', turno: 'T1', planificadoMin: 480, productivoMin: 432, paradasMin: 30, esperasMin: 18 },
  { id: 'DIS-205', equipo: 'CEN-02', fecha: '2026-10-16', turno: 'T1', planificadoMin: 360, productivoMin: 335, paradasMin: 15, esperasMin: 10 },
  { id: 'DIS-206', equipo: 'MOL-01', fecha: '2026-10-15', turno: 'T2', planificadoMin: 480, productivoMin: 427, paradasMin: 41, esperasMin: 12 },
];

export interface Rendimiento {
  id: string;
  equipo: string;
  fecha: string;
  real: number;
  teorico: number;
  unidad: string;
  velocidadStd: string;
  tiempoEfectivoMin: number;
}

/** Rendimiento = producción real / producción teórica. */
export function pctRendimiento(r: Rendimiento): number {
  return r.real / r.teorico;
}

export const RENDIMIENTOS: Rendimiento[] = [
  { id: 'REN-301', equipo: 'MOL-01', fecha: '2026-10-16', real: 8860, teorico: 10180, unidad: 'kg', velocidadStd: '24 kg/min', tiempoEfectivoMin: 424 },
  { id: 'REN-302', equipo: 'EMP-03', fecha: '2026-10-16', real: 11820, teorico: 12710, unidad: 'und', velocidadStd: '28 und/min', tiempoEfectivoMin: 440 },
  { id: 'REN-303', equipo: 'HOR-02', fecha: '2026-10-15', real: 7400, teorico: 8220, unidad: 'kg', velocidadStd: '22 kg/min', tiempoEfectivoMin: 360 },
  { id: 'REN-304', equipo: 'CON-01', fecha: '2026-10-15', real: 5920, teorico: 6960, unidad: 'kg', velocidadStd: '16 kg/min', tiempoEfectivoMin: 425 },
  { id: 'REN-305', equipo: 'CEN-02', fecha: '2026-10-16', real: 9250, teorico: 10510, unidad: 'kg', velocidadStd: '30 kg/min', tiempoEfectivoMin: 330 },
  { id: 'REN-306', equipo: 'MOL-01', fecha: '2026-10-15', real: 8420, teorico: 10020, unidad: 'kg', velocidadStd: '24 kg/min', tiempoEfectivoMin: 415 },
];

export interface Calidad {
  id: string;
  equipo: string;
  fecha: string;
  producidas: number;
  conformes: number;
  rechazos: number;
  reprocesos: number;
}

/** Calidad = unidades conformes / unidades producidas. */
export function pctCalidad(c: Calidad): number {
  return c.conformes / c.producidas;
}

export const CALIDADES: Calidad[] = [
  { id: 'CAL-401', equipo: 'MOL-01', fecha: '2026-10-16', producidas: 8860, conformes: 8728, rechazos: 44, reprocesos: 88 },
  { id: 'CAL-402', equipo: 'EMP-03', fecha: '2026-10-16', producidas: 11820, conformes: 11726, rechazos: 36, reprocesos: 58 },
  { id: 'CAL-403', equipo: 'HOR-02', fecha: '2026-10-15', producidas: 7400, conformes: 7238, rechazos: 96, reprocesos: 66 },
  { id: 'CAL-404', equipo: 'CON-01', fecha: '2026-10-15', producidas: 5920, conformes: 5742, rechazos: 118, reprocesos: 60 },
  { id: 'CAL-405', equipo: 'CEN-02', fecha: '2026-10-16', producidas: 9250, conformes: 9158, rechazos: 28, reprocesos: 64 },
  { id: 'CAL-406', equipo: 'MOL-01', fecha: '2026-10-15', producidas: 8420, conformes: 8268, rechazos: 84, reprocesos: 68 },
];

export interface TiempoCiclo {
  id: string;
  producto: string;
  equipo: string;
  estandar: number;
  real: number;
  unidad: string;
  fecha: string;
}

export const TIEMPOS_CICLO: TiempoCiclo[] = [
  { id: 'TC-501', producto: 'Panela pulverizada 500 g', equipo: 'EMP-03', estandar: 2.5, real: 2.7, unidad: 's/und', fecha: '2026-10-16' },
  { id: 'TC-502', producto: 'Café tostado 250 g', equipo: 'HOR-02', estandar: 18, real: 19.5, unidad: 'min/lote', fecha: '2026-10-15' },
  { id: 'TC-503', producto: 'Chocolate de mesa 80 %', equipo: 'CON-01', estandar: 42, real: 47, unidad: 'min/lote', fecha: '2026-10-15' },
  { id: 'TC-504', producto: 'Azúcar orgánica 1 kg', equipo: 'CEN-02', estandar: 12, real: 12.4, unidad: 'min/lote', fecha: '2026-10-16' },
  { id: 'TC-505', producto: 'Miel de caña', equipo: 'MOL-01', estandar: 6, real: 6.8, unidad: 'min/lote', fecha: '2026-10-16' },
  { id: 'TC-506', producto: 'Panela pulverizada 500 g', equipo: 'EMP-03', estandar: 2.5, real: 2.6, unidad: 's/und', fecha: '2026-10-15' },
];

export interface Setup {
  id: string;
  equipo: string;
  tipo: string;
  detalle: string;
  duracionMin: number;
  estandarMin: number;
  fecha: string;
  responsable: string;
}

export const SETUPS: Setup[] = [
  { id: 'SET-601', equipo: 'MOL-01', tipo: 'Cambio de producto', detalle: 'Miel clara → Miel oscura', duracionMin: 34, estandarMin: 25, fecha: '2026-10-16', responsable: 'Carlos Ríos' },
  { id: 'SET-602', equipo: 'EMP-03', tipo: 'Cambio de formato', detalle: '500 g → 250 g', duracionMin: 48, estandarMin: 30, fecha: '2026-10-16', responsable: 'Laura Gómez' },
  { id: 'SET-603', equipo: 'HOR-02', tipo: 'Limpieza', detalle: 'Café molido → café en grano', duracionMin: 55, estandarMin: 40, fecha: '2026-10-15', responsable: 'Andrés Mora' },
  { id: 'SET-604', equipo: 'CON-01', tipo: 'Cambio de receta', detalle: '70 % → 80 % cacao', duracionMin: 62, estandarMin: 45, fecha: '2026-10-15', responsable: 'Diana Ruiz' },
  { id: 'SET-605', equipo: 'CEN-02', tipo: 'Limpieza CIP', detalle: 'Programa CIP-02', duracionMin: 40, estandarMin: 35, fecha: '2026-10-16', responsable: 'Juliana Ospina' },
  { id: 'SET-606', equipo: 'EMP-03', tipo: 'Cambio de producto', detalle: 'Café → Chocolate', duracionMin: 52, estandarMin: 40, fecha: '2026-10-15', responsable: 'Laura Gómez' },
];

export interface Fpy {
  id: string;
  producto: string;
  linea: string;
  iniciadas: number;
  conformesPrimera: number;
  fecha: string;
}

/** FPY = conformes a la primera / unidades iniciadas. */
export function pctFpy(f: Fpy): number {
  return f.conformesPrimera / f.iniciadas;
}

export const FPY: Fpy[] = [
  { id: 'FPY-701', producto: 'Panela pulverizada 500 g', linea: 'L2 Empaque', iniciadas: 12600, conformesPrimera: 11970, fecha: '2026-10-16' },
  { id: 'FPY-702', producto: 'Café tostado 250 g', linea: 'L3 Café', iniciadas: 7800, conformesPrimera: 7020, fecha: '2026-10-15' },
  { id: 'FPY-703', producto: 'Chocolate de mesa 80 %', linea: 'L4 Chocolate', iniciadas: 6400, conformesPrimera: 5504, fecha: '2026-10-15' },
  { id: 'FPY-704', producto: 'Azúcar orgánica 1 kg', linea: 'L5 Azúcar', iniciadas: 9400, conformesPrimera: 8742, fecha: '2026-10-16' },
  { id: 'FPY-705', producto: 'Miel de caña', linea: 'L1 Panela', iniciadas: 9200, conformesPrimera: 8556, fecha: '2026-10-16' },
  { id: 'FPY-706', producto: 'Panela pulverizada 250 g', linea: 'L2 Empaque', iniciadas: 6100, conformesPrimera: 5795, fecha: '2026-10-15' },
];

export interface DesperdicioRen {
  id: string;
  producto: string;
  proceso: string;
  turno: string;
  causa: string;
  cantidad: number;
  unidad: string;
  costo: number;
  fecha: string;
}

export const DESPERDICIOS: DesperdicioRen[] = [
  { id: 'DES-801', producto: 'Panela pulverizada', proceso: 'Pulverizado', turno: 'T1', causa: 'Finos de molienda', cantidad: 24, unidad: 'kg', costo: 312000, fecha: '2026-10-16' },
  { id: 'DES-802', producto: 'Café tostado', proceso: 'Tostado', turno: 'T2', causa: 'Quemado por sobretostión', cantidad: 96, unidad: 'kg', costo: 1728000, fecha: '2026-10-15' },
  { id: 'DES-803', producto: 'Chocolate de mesa', proceso: 'Conchado', turno: 'T1', causa: 'Merma de conchado', cantidad: 118, unidad: 'kg', costo: 2360000, fecha: '2026-10-15' },
  { id: 'DES-804', producto: 'Panela pulverizada', proceso: 'Empaque', turno: 'T2', causa: 'Sellado defectuoso', cantidad: 36, unidad: 'und', costo: 54000, fecha: '2026-10-16' },
  { id: 'DES-805', producto: 'Azúcar orgánica', proceso: 'Centrifugado', turno: 'T1', causa: 'Miel residual', cantidad: 28, unidad: 'kg', costo: 224000, fecha: '2026-10-16' },
  { id: 'DES-806', producto: 'Miel de caña', proceso: 'Evaporación', turno: 'T1', causa: 'Incrustación en pailas', cantidad: 15, unidad: 'kg', costo: 180000, fecha: '2026-10-16' },
  { id: 'DES-807', producto: 'Café tostado', proceso: 'Empaque', turno: 'T1', causa: 'Rotura de bolsa', cantidad: 44, unidad: 'und', costo: 88000, fecha: '2026-10-15' },
];

export interface ReprocesoRen {
  id: string;
  producto: string;
  lote: string;
  causa: string;
  unidades: number;
  unidad: string;
  tiempoExtra: number;
  costo: number;
  fecha: string;
}

export const REPROCESOS_REN: ReprocesoRen[] = [
  { id: 'RPR-901', producto: 'Panela pulverizada 500 g', lote: 'L-2026-102', causa: 'Re-secado por humedad', unidades: 830, unidad: 'kg', tiempoExtra: 5.2, costo: 420000, fecha: '2026-10-16' },
  { id: 'RPR-902', producto: 'Café tostado 250 g', lote: 'L-2026-103', causa: 'Re-tostado por color', unidades: 96, unidad: 'kg', tiempoExtra: 3.8, costo: 260000, fecha: '2026-10-16' },
  { id: 'RPR-903', producto: 'Chocolate de mesa 80 %', lote: 'L-2026-104', causa: 'Tamizado por partículas', unidades: 610, unidad: 'kg', tiempoExtra: 4.5, costo: 450000, fecha: '2026-10-16' },
  { id: 'RPR-904', producto: 'Panela pulverizada 500 g', lote: 'L-2026-101', causa: 'Re-empaque por sello', unidades: 360, unidad: 'und', tiempoExtra: 2.1, costo: 310000, fecha: '2026-10-14' },
  { id: 'RPR-905', producto: 'Azúcar orgánica 1 kg', lote: 'L-2026-105', causa: 'Recristalización', unidades: 640, unidad: 'kg', tiempoExtra: 3.4, costo: 380000, fecha: '2026-10-17' },
  { id: 'RPR-906', producto: 'Miel de caña', lote: 'L-2026-100', causa: 'Re-evaporación', unidades: 210, unidad: 'kg', tiempoExtra: 2.8, costo: 240000, fecha: '2026-10-15' },
];

export interface CumplimientoPlan {
  id: string;
  periodo: string;
  producto: string;
  centro: string;
  planificado: number;
  real: number;
  unidad: string;
}

/** Cumplimiento = real / planificado. */
export function pctCumplimiento(c: CumplimientoPlan): number {
  return c.real / c.planificado;
}

export const CUMPLIMIENTO: CumplimientoPlan[] = [
  { id: 'CPL-1001', periodo: 'Sem 42', producto: 'Panela pulverizada 500 g', centro: 'Centro 2 – Empaque', planificado: 40000, real: 38200, unidad: 'und' },
  { id: 'CPL-1002', periodo: 'Sem 42', producto: 'Café tostado 250 g', centro: 'Centro 3 – Tostión', planificado: 26000, real: 24800, unidad: 'und' },
  { id: 'CPL-1003', periodo: 'Sem 42', producto: 'Chocolate de mesa 80 %', centro: 'Centro 4 – Conchado', planificado: 18000, real: 16400, unidad: 'und' },
  { id: 'CPL-1004', periodo: 'Sem 42', producto: 'Azúcar orgánica 1 kg', centro: 'Centro 5 – Centrifugado', planificado: 22000, real: 21500, unidad: 'und' },
  { id: 'CPL-1005', periodo: 'Sem 43', producto: 'Panela pulverizada 500 g', centro: 'Centro 2 – Empaque', planificado: 42000, real: 39900, unidad: 'und' },
  { id: 'CPL-1006', periodo: 'Sem 43', producto: 'Café tostado 250 g', centro: 'Centro 3 – Tostión', planificado: 27000, real: 24300, unidad: 'und' },
];

export interface Parada {
  id: string;
  equipo: string;
  causa: string;
  categoria: string;
  fecha: string;
  inicio: string;
  duracionMin: number;
  responsable: string;
  tipo: 'Planeada' | 'Operativa' | 'Emergencia';
}

export const PARADAS: Parada[] = [
  { id: 'PAR-1101', equipo: 'MOL-01', causa: 'Fallo de rodamientos', categoria: 'Mecánica', fecha: '2026-10-16', inicio: '08:15', duracionMin: 28, responsable: 'Mantenimiento', tipo: 'Emergencia' },
  { id: 'PAR-1102', equipo: 'EMP-03', causa: 'Falta de material', categoria: 'Logística', fecha: '2026-10-16', inicio: '10:30', duracionMin: 14, responsable: 'Producción', tipo: 'Planeada' },
  { id: 'PAR-1103', equipo: 'HOR-02', causa: 'Ajuste de temperatura', categoria: 'Proceso', fecha: '2026-10-15', inicio: '15:00', duracionMin: 38, responsable: 'Procesos', tipo: 'Operativa' },
  { id: 'PAR-1104', equipo: 'CON-01', causa: 'Limpieza de concha', categoria: 'Limpieza', fecha: '2026-10-15', inicio: '11:00', duracionMin: 30, responsable: 'Producción', tipo: 'Planeada' },
  { id: 'PAR-1105', equipo: 'CEN-02', causa: 'Fuga en tubería', categoria: 'Mecánica', fecha: '2026-10-16', inicio: '09:45', duracionMin: 15, responsable: 'Mantenimiento', tipo: 'Emergencia' },
  { id: 'PAR-1106', equipo: 'MOL-01', causa: 'Cambio de malla', categoria: 'Preparación', fecha: '2026-10-15', inicio: '13:20', duracionMin: 41, responsable: 'Producción', tipo: 'Planeada' },
  { id: 'PAR-1107', equipo: 'EMP-03', causa: 'Fallo en sensor de peso', categoria: 'Eléctrica', fecha: '2026-10-15', inicio: '16:10', duracionMin: 24, responsable: 'Mantenimiento', tipo: 'Emergencia' },
];

export interface Benchmark {
  id: string;
  alcance: string;
  periodo: string;
  oee: number;
  objetivo: number;
  mejorTurno: string;
}

export const BENCHMARKS: Benchmark[] = [
  { id: 'BM-1201', alcance: 'Planta principal', periodo: 'Sem 43', oee: 0.812, objetivo: 0.78, mejorTurno: 'T1' },
  { id: 'BM-1202', alcance: 'Centro 1 – Molienda', periodo: 'Sem 43', oee: 0.761, objetivo: 0.75, mejorTurno: 'T1' },
  { id: 'BM-1203', alcance: 'Centro 2 – Empaque', periodo: 'Sem 43', oee: 0.86, objetivo: 0.8, mejorTurno: 'T1' },
  { id: 'BM-1204', alcance: 'Centro 3 – Tostión', periodo: 'Sem 43', oee: 0.775, objetivo: 0.78, mejorTurno: 'T2' },
  { id: 'BM-1205', alcance: 'Centro 4 – Conchado', periodo: 'Sem 43', oee: 0.742, objetivo: 0.78, mejorTurno: 'T1' },
];

/** Objetivos versionados (regla de negocio REN: «los objetivos deben ser versionados»). */
export const OBJETIVOS_REN = [
  { version: 'v4', vigencia: 'Sem 43 – Sem 48 · 2026', oeePlanta: 0.78, fpy: 0.92, desperdicioKgMax: 420, aprobadoPor: 'Gerencia de planta' },
  { version: 'v3', vigencia: 'Sem 37 – Sem 42 · 2026', oeePlanta: 0.76, fpy: 0.9, desperdicioKgMax: 480, aprobadoPor: 'Gerencia de planta' },
  { version: 'v2', vigencia: 'Sem 31 – Sem 36 · 2026', oeePlanta: 0.75, fpy: 0.88, desperdicioKgMax: 550, aprobadoPor: 'Dirección' },
] as const;

/** Reportes disponibles (REN-12). */
export const REPORTES_REN = [
  { id: 'REP-REN-01', nombre: 'OEE por centro y período', periodicidad: 'Diaria' },
  { id: 'REP-REN-02', nombre: 'Disponibilidad, rendimiento y calidad', periodicidad: 'Diaria' },
  { id: 'REP-REN-03', nombre: 'FPY y reproceso', periodicidad: 'Semanal' },
  { id: 'REP-REN-04', nombre: 'Desperdicio por causa', periodicidad: 'Semanal' },
  { id: 'REP-REN-05', nombre: 'Cumplimiento del plan', periodicidad: 'Semanal' },
  { id: 'REP-REN-06', nombre: 'Pareto de paradas', periodicidad: 'Mensual' },
] as const;

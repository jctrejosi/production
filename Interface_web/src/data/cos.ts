// Datos de demostración del módulo COS — Costos industriales.
// Tipos locales a este archivo; no editar archivos compartidos.

export interface CostoEstandar {
  sku: string;
  producto: string;
  materiales: number;
  manoObra: number;
  maquina: number;
  indirectos: number;
  total: number;
}

export const COSTOS_ESTANDAR: CostoEstandar[] = [
  { sku: 'P-101', producto: 'Néctar de mora 1 L', materiales: 1850, manoObra: 420, maquina: 310, indirectos: 260, total: 2840 },
  { sku: 'P-102', producto: 'Avena 6×1 L', materiales: 3210, manoObra: 380, maquina: 290, indirectos: 240, total: 4120 },
  { sku: 'P-103', producto: 'Salsa de tomate 500 g', materiales: 1450, manoObra: 350, maquina: 280, indirectos: 210, total: 2290 },
  { sku: 'P-104', producto: 'Mermelada de fresa 300 g', materiales: 1120, manoObra: 300, maquina: 250, indirectos: 190, total: 1860 },
  { sku: 'P-105', producto: 'Queso campesino 500 g', materiales: 2980, manoObra: 460, maquina: 240, indirectos: 310, total: 3990 },
];

export interface OrdenCosto {
  orden: string;
  producto: string;
  estandarUnit: number;
  realUnit: number;
  variacion: number;
  variacionPct: number; // fracción (0.0475 = 4,75 %)
}

export const ORDENES_COSTO: OrdenCosto[] = [
  { orden: 'OF-1046', producto: 'Néctar de mora 1 L', estandarUnit: 2840, realUnit: 2975, variacion: 135, variacionPct: 0.0475 },
  { orden: 'OF-1047', producto: 'Avena 6×1 L', estandarUnit: 4120, realUnit: 4005, variacion: -115, variacionPct: -0.0279 },
  { orden: 'OF-1048', producto: 'Salsa de tomate 500 g', estandarUnit: 2290, realUnit: 2702, variacion: 412, variacionPct: 0.1799 },
  { orden: 'OF-1049', producto: 'Mermelada de fresa 300 g', estandarUnit: 1860, realUnit: 1912, variacion: 52, variacionPct: 0.028 },
  { orden: 'OF-1050', producto: 'Queso campesino 500 g', estandarUnit: 3990, realUnit: 4210, variacion: 220, variacionPct: 0.0551 },
  { orden: 'OF-1051', producto: 'Néctar de mora 1 L', estandarUnit: 2840, realUnit: 2805, variacion: -35, variacionPct: -0.0123 },
];

export interface ConsumoMaterial {
  id: string;
  material: string;
  orden: string;
  teoricoKg: number;
  realKg: number;
  desviacionPct: number; // fracción
  precioKg: number;
}

export const CONSUMOS_MATERIAL: ConsumoMaterial[] = [
  { id: 'MAT-01', material: 'Pulpa de mora', orden: 'OF-1046', teoricoKg: 480, realKg: 512, desviacionPct: 0.067, precioKg: 3200 },
  { id: 'MAT-02', material: 'Azúcar', orden: 'OF-1046', teoricoKg: 380, realKg: 371, desviacionPct: -0.024, precioKg: 2100 },
  { id: 'MAT-03', material: 'Avena en hojuelas', orden: 'OF-1047', teoricoKg: 900, realKg: 884, desviacionPct: -0.018, precioKg: 2800 },
  { id: 'MAT-04', material: 'Tomate chonto', orden: 'OF-1048', teoricoKg: 620, realKg: 698, desviacionPct: 0.126, precioKg: 2400 },
  { id: 'MAT-05', material: 'Fresa congelada', orden: 'OF-1049', teoricoKg: 260, realKg: 268, desviacionPct: 0.031, precioKg: 4300 },
  { id: 'MAT-06', material: 'Leche entera', orden: 'OF-1050', teoricoKg: 1150, realKg: 1210, desviacionPct: 0.052, precioKg: 2600 },
];

export interface ManoObraCosto {
  id: string;
  recurso: string;
  turno: string;
  horas: number;
  tarifa: number;
  costo: number;
}

export const MANO_OBRA: ManoObraCosto[] = [
  { id: 'MO-01', recurso: 'Operario de mezcla', turno: 'Turno A', horas: 42, tarifa: 18500, costo: 777000 },
  { id: 'MO-02', recurso: 'Operario de envasado', turno: 'Turno A', horas: 45, tarifa: 17500, costo: 787500 },
  { id: 'MO-03', recurso: 'Técnico de pasteurización', turno: 'Turno B', horas: 40, tarifa: 22000, costo: 880000 },
  { id: 'MO-04', recurso: 'Auxiliar de empaque', turno: 'Turno B', horas: 48, tarifa: 16500, costo: 792000 },
  { id: 'MO-05', recurso: 'Supervisor de planta', turno: 'Turno único', horas: 44, tarifa: 28000, costo: 1232000 },
];

export interface MaquinaCosto {
  id: string;
  centro: string;
  horas: number;
  tarifa: number;
  costo: number;
}

export const MAQUINAS_COSTO: MaquinaCosto[] = [
  { id: 'MAQ-01', centro: 'MEZ-01 Mezcladora', horas: 36, tarifa: 42000, costo: 1512000 },
  { id: 'MAQ-02', centro: 'PST-01 Pasteurizador', horas: 40, tarifa: 38500, costo: 1540000 },
  { id: 'MAQ-03', centro: 'ENV-02 Envasadora', horas: 33, tarifa: 31000, costo: 1023000 },
  { id: 'MAQ-04', centro: 'HOR-01 Horno', horas: 28, tarifa: 29500, costo: 826000 },
  { id: 'MAQ-05', centro: 'TUN-01 Túnel de enfriamiento', horas: 38, tarifa: 26000, costo: 988000 },
];

export interface Indirecto {
  id: string;
  concepto: string;
  base: 'Horas máquina' | 'Horas mano de obra' | 'Valor de producción' | 'Unidades';
  importe: number;
}

export const INDIRECTOS: Indirecto[] = [
  { id: 'CIF-01', concepto: 'Energía de planta', base: 'Horas máquina', importe: 2140000 },
  { id: 'CIF-02', concepto: 'Supervisión y jefatura', base: 'Horas mano de obra', importe: 1850000 },
  { id: 'CIF-03', concepto: 'Mantenimiento general', base: 'Valor de producción', importe: 960000 },
  { id: 'CIF-04', concepto: 'Depreciación de equipos', base: 'Horas máquina', importe: 1530000 },
  { id: 'CIF-05', concepto: 'Calidad y laboratorio', base: 'Unidades', importe: 720000 },
];

export interface PrevistoVsReal {
  orden: string;
  producto: string;
  previsto: number;
  real: number;
  deltaCantidadPct: number;
  deltaPrecioPct: number;
  deltaMezclaPct: number;
}

export const PREVISTO_VS_REAL: PrevistoVsReal[] = [
  { orden: 'OF-1046', producto: 'Néctar de mora 1 L', previsto: 2840, real: 2975, deltaCantidadPct: 0.067, deltaPrecioPct: 0.012, deltaMezclaPct: 0 },
  { orden: 'OF-1047', producto: 'Avena 6×1 L', previsto: 4120, real: 4005, deltaCantidadPct: -0.018, deltaPrecioPct: 0.004, deltaMezclaPct: 0 },
  { orden: 'OF-1048', producto: 'Salsa de tomate 500 g', previsto: 2290, real: 2702, deltaCantidadPct: 0.126, deltaPrecioPct: 0.021, deltaMezclaPct: 0.033 },
  { orden: 'OF-1049', producto: 'Mermelada de fresa 300 g', previsto: 1860, real: 1912, deltaCantidadPct: 0.031, deltaPrecioPct: 0.009, deltaMezclaPct: 0 },
  { orden: 'OF-1050', producto: 'Queso campesino 500 g', previsto: 3990, real: 4210, deltaCantidadPct: 0.052, deltaPrecioPct: 0.016, deltaMezclaPct: 0 },
  { orden: 'OF-1051', producto: 'Néctar de mora 1 L', previsto: 2840, real: 2805, deltaCantidadPct: -0.024, deltaPrecioPct: 0.002, deltaMezclaPct: 0 },
];

export interface VariacionCosto {
  id: string;
  tipo: 'Material' | 'Precio' | 'Mano de obra' | 'Máquina' | 'Eficiencia';
  orden: string;
  importe: number;
  causa: string;
  resultado: 'Favorable' | 'Desfavorable';
}

export const VARIACIONES: VariacionCosto[] = [
  { id: 'VAR-01', tipo: 'Material', orden: 'OF-1048', importe: 312000, causa: 'Mayor merma de tomate por calidad del lote recibido', resultado: 'Desfavorable' },
  { id: 'VAR-02', tipo: 'Precio', orden: 'OF-1046', importe: 96000, causa: 'Alza de pulpa de mora en proveedor', resultado: 'Desfavorable' },
  { id: 'VAR-03', tipo: 'Mano de obra', orden: 'OF-1050', importe: 148000, causa: 'Horas extra por reproceso de viscosidad', resultado: 'Desfavorable' },
  { id: 'VAR-04', tipo: 'Máquina', orden: 'OF-1047', importe: 72000, causa: 'Menor tiempo de envasado por línea optimizada', resultado: 'Favorable' },
  { id: 'VAR-05', tipo: 'Eficiencia', orden: 'OF-1051', importe: 42000, causa: 'Rendimiento de mezcla superior al estándar', resultado: 'Favorable' },
  { id: 'VAR-06', tipo: 'Precio', orden: 'OF-1049', importe: 52000, causa: 'Fresa importada con mayor costo de compra', resultado: 'Desfavorable' },
];

export interface Desperdicio {
  id: string;
  orden: string;
  producto: string;
  cantidadKg: number;
  mermaPct: number; // fracción
  costo: number;
}

export const DESPERDICIOS: Desperdicio[] = [
  { id: 'DES-01', orden: 'OF-1046', producto: 'Néctar de mora 1 L', cantidadKg: 32, mermaPct: 0.021, costo: 102400 },
  { id: 'DES-02', orden: 'OF-1048', producto: 'Salsa de tomate 500 g', cantidadKg: 78, mermaPct: 0.126, costo: 187200 },
  { id: 'DES-03', orden: 'OF-1050', producto: 'Queso campesino 500 g', cantidadKg: 60, mermaPct: 0.052, costo: 156000 },
  { id: 'DES-04', orden: 'OF-1049', producto: 'Mermelada de fresa 300 g', cantidadKg: 8, mermaPct: 0.031, costo: 34400 },
  { id: 'DES-05', orden: 'OF-1051', producto: 'Néctar de mora 1 L', cantidadKg: 11, mermaPct: 0.009, costo: 35200 },
];

export interface Reproceso {
  id: string;
  orden: string;
  motivo: string;
  horas: number;
  costo: number;
}

export const REPROCESOS: Reproceso[] = [
  { id: 'REP-01', orden: 'OF-1050', motivo: 'Producto fuera de especificación de viscosidad', horas: 6, costo: 148000 },
  { id: 'REP-02', orden: 'OF-1046', motivo: 'Re-etiquetado de lote por error de fecha', horas: 2, costo: 35000 },
  { id: 'REP-03', orden: 'OF-1048', motivo: 'Re-esterilización de envases', horas: 4, costo: 124000 },
  { id: 'REP-04', orden: 'OF-1049', motivo: 'Re-cocción de mermelada', horas: 3, costo: 78000 },
];

export interface TiempoImproductivo {
  id: string;
  centro: string;
  tipo: string;
  horas: number;
  costo: number;
}

export const TIEMPOS_IMPRODUCTIVOS: TiempoImproductivo[] = [
  { id: 'TI-01', centro: 'ENV-02 Envasadora', tipo: 'Parada técnica', horas: 3.5, costo: 108500 },
  { id: 'TI-02', centro: 'MEZ-01 Mezcladora', tipo: 'Espera de material', horas: 1.2, costo: 50400 },
  { id: 'TI-03', centro: 'HOR-01 Horno', tipo: 'Setup / cambio de referencia', horas: 2, costo: 59000 },
  { id: 'TI-04', centro: 'PST-01 Pasteurizador', tipo: 'Falla de equipo', horas: 1.5, costo: 57750 },
  { id: 'TI-05', centro: 'ETQ-01 Etiquetadora', tipo: 'Atasco / ajuste', horas: 0.8, costo: 22000 },
];

export interface Wip {
  orden: string;
  producto: string;
  avancePct: number; // fracción
  valor: number;
}

export const WIP: Wip[] = [
  { orden: 'OF-1046', producto: 'Néctar de mora 1 L', avancePct: 0.7, valor: 1248000 },
  { orden: 'OF-1048', producto: 'Salsa de tomate 500 g', avancePct: 0.45, valor: 756000 },
  { orden: 'OF-1050', producto: 'Queso campesino 500 g', avancePct: 0.85, valor: 3580000 },
  { orden: 'OF-1051', producto: 'Néctar de mora 1 L', avancePct: 0.3, valor: 532000 },
  { orden: 'OF-1052', producto: 'Avena 6×1 L', avancePct: 0.1, valor: 243000 },
];

export interface CostoOrden {
  orden: string;
  lote: string;
  producto: string;
  cliente: string;
  costoUnit: number;
  precioVenta: number;
  margenUnit: number;
  margenPct: number; // fracción
}

export const COSTO_POR_ORDEN: CostoOrden[] = [
  { orden: 'OF-1046', lote: 'L-2026-118', producto: 'Néctar de mora 1 L', cliente: 'Distribuidora Andina', costoUnit: 2975, precioVenta: 3950, margenUnit: 975, margenPct: 0.247 },
  { orden: 'OF-1047', lote: 'L-2026-119', producto: 'Avena 6×1 L', cliente: 'Cadena Mega', costoUnit: 4005, precioVenta: 5250, margenUnit: 1245, margenPct: 0.237 },
  { orden: 'OF-1048', lote: 'L-2026-120', producto: 'Salsa de tomate 500 g', cliente: 'Distribuidora Andina', costoUnit: 2702, precioVenta: 3400, margenUnit: 698, margenPct: 0.205 },
  { orden: 'OF-1049', lote: 'L-2026-121', producto: 'Mermelada de fresa 300 g', cliente: 'Mayorista La 14', costoUnit: 1912, precioVenta: 2600, margenUnit: 688, margenPct: 0.265 },
  { orden: 'OF-1050', lote: 'L-2026-122', producto: 'Queso campesino 500 g', cliente: 'Cadena Mega', costoUnit: 4210, precioVenta: 6100, margenUnit: 1890, margenPct: 0.31 },
  { orden: 'OF-1051', lote: 'L-2026-123', producto: 'Néctar de mora 1 L', cliente: 'Exportaciones Pacífico', costoUnit: 2805, precioVenta: 4100, margenUnit: 1295, margenPct: 0.316 },
];

export interface ReporteCos {
  id: string;
  nombre: string;
  formato: string;
  frecuencia: string;
}

export const REPORTES_COS: ReporteCos[] = [
  { id: 'REP-01', nombre: 'Costo estándar vs real por orden', formato: 'PDF / XLSX', frecuencia: 'Semanal' },
  { id: 'REP-02', nombre: 'Variaciones por recurso y causa', formato: 'PDF', frecuencia: 'Cierre mensual' },
  { id: 'REP-03', nombre: 'Desperdicio y reproceso por línea', formato: 'XLSX', frecuencia: 'Semanal' },
  { id: 'REP-04', nombre: 'WIP y valoración de inventario', formato: 'PDF', frecuencia: 'Cierre mensual' },
  { id: 'REP-05', nombre: 'Margen por producto y cliente', formato: 'XLSX', frecuencia: 'Mensual' },
];

export interface MargenResumen {
  producto: string;
  volumenUnidades: number;
  costoProm: number;
  precioProm: number;
  margenPct: number; // fracción
}

export const MARGENES: MargenResumen[] = [
  { producto: 'Néctar de mora 1 L', volumenUnidades: 12480, costoProm: 2890, precioProm: 4025, margenPct: 0.282 },
  { producto: 'Avena 6×1 L', volumenUnidades: 9840, costoProm: 4005, precioProm: 5250, margenPct: 0.237 },
  { producto: 'Salsa de tomate 500 g', volumenUnidades: 7210, costoProm: 2702, precioProm: 3400, margenPct: 0.205 },
  { producto: 'Mermelada de fresa 300 g', volumenUnidades: 4580, costoProm: 1912, precioProm: 2600, margenPct: 0.265 },
  { producto: 'Queso campesino 500 g', volumenUnidades: 6230, costoProm: 4210, precioProm: 6100, margenPct: 0.31 },
];

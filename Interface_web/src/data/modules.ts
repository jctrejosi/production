// Registro de módulos de la suite de producción.
// Los conteos de funcionalidades se leen del catálogo generado (coverage.ts)
// para que nunca se desincronicen del documento normativo.

import { FUNCIONES_POR_MODULO, TOTAL_FUNCIONES } from './coverage';

export type ModuleId =
  | 'abt'
  | 'inv'
  | 'prd'
  | 'cal'
  | 'mnt'
  | 'plm'
  | 'cap'
  | 'pla'
  | 'mes'
  | 'tra'
  | 'ren'
  | 'exc'
  | 'iot'
  | 'cos'
  | 'trv';

export type NavPage = 'suite' | 'dashboard' | 'espec' | ModuleId;

export interface ModuloInfo {
  id: ModuleId;
  codigo: string;
  nombre: string;
  icono: string;
  /** Fase del roadmap (FUNCIONALIDADES.md §5). 0 = transversal. */
  fase: number;
  descripcion: string;
}

export const MODULOS: ModuloInfo[] = [
  { id: 'abt', codigo: 'ABT', nombre: 'Compras y abastecimiento', icono: '🛒', fase: 1, descripcion: 'Ciclo completo de abastecimiento: necesidades, cotizaciones, órdenes, recepciones y facturación.' },
  { id: 'inv', codigo: 'INV', nombre: 'Inventario y almacenes', icono: '📦', fase: 1, descripcion: 'Ubicaciones, movimientos, existencias, trazabilidad por lote/serie y reabastecimiento.' },
  { id: 'prd', codigo: 'PRD', nombre: 'Producción', icono: '🏭', fase: 1, descripcion: 'BOM, rutas, órdenes de fabricación, operaciones, planificación y costeo.' },
  { id: 'cos', codigo: 'COS', nombre: 'Costos industriales', icono: '💰', fase: 1, descripcion: 'Costo estándar, real, variaciones y valoración de inventarios y órdenes.' },
  { id: 'cal', codigo: 'CAL', nombre: 'Calidad', icono: '✅', fase: 2, descripcion: 'Puntos de control, inspecciones, no conformidades, alertas y acciones.' },
  { id: 'mnt', codigo: 'MNT', nombre: 'Mantenimiento', icono: '🔧', fase: 2, descripcion: 'Equipos, solicitudes, mantenimiento preventivo/correctivo y MTBF/MTTR.' },
  { id: 'cap', codigo: 'CAP', nombre: 'Captura y códigos de barras', icono: '▦', fase: 2, descripcion: 'Nomenclaturas GS1, escaneo de operaciones y registros de planta sin teclado.' },
  { id: 'pla', codigo: 'PLA', nombre: 'Planificación avanzada', icono: '🗓', fase: 3, descripcion: 'MPS, MRP, capacidad finita (APS) y secuenciación de órdenes.' },
  { id: 'mes', codigo: 'MES', nombre: 'Ejecución y supervisión de planta', icono: '📟', fase: 3, descripcion: 'Registro real de operaciones, WIP, paradas y supervisión en tiempo real.' },
  { id: 'ren', codigo: 'REN', nombre: 'Rendimiento y eficiencia', icono: '📈', fase: 3, descripcion: 'OEE (A×P×Q), FPY, desperdicio, reproceso, cumplimiento del plan y paradas.' },
  { id: 'tra', codigo: 'TRA', nombre: 'Trazabilidad integral', icono: '🔍', fase: 4, descripcion: 'Genealogía de lotes, recall, cuarentenas y trazabilidad hacia adelante y atrás.' },
  { id: 'exc', codigo: 'EXC', nombre: 'Control de procesos y excepciones', icono: '⚠️', fase: 4, descripcion: 'Desviaciones, no conformidades, CAPA, alertas y escalamiento.' },
  { id: 'plm', codigo: 'PLM', nombre: 'Ciclo de vida del producto', icono: '🧬', fase: 4, descripcion: 'Versiones de BOM, órdenes de cambio (ECO) y aprobaciones técnicas.' },
  { id: 'iot', codigo: 'IOT', nombre: 'Integración industrial e IoT', icono: '🔌', fase: 5, descripcion: 'PLC, SCADA, sensores, historiador y captura automática de variables.' },
  { id: 'trv', codigo: 'TRV', nombre: 'Funcionalidades transversales', icono: '⊛', fase: 0, descripcion: 'Seguridad, datos maestros, auditoría, notificaciones, reportes, integraciones y continuidad.' },
];

export const FASES: { id: number; nombre: string; descripcion: string; icono: string }[] = [
  { id: 1, nombre: 'Núcleo operativo', descripcion: 'Operación estable y trazable', icono: '🏭' },
  { id: 2, nombre: 'Conformidad y disponibilidad', descripcion: 'Calidad, mantenimiento y captura', icono: '🛡️' },
  { id: 3, nombre: 'Planificación y control de planta', descripcion: 'APS, MES y rendimiento', icono: '📊' },
  { id: 4, nombre: 'Cumplimiento y gobierno', descripcion: 'Trazabilidad, excepciones y PLM', icono: '⚖️' },
  { id: 5, nombre: 'Automatización avanzada', descripcion: 'IoT e integración industrial', icono: '🤖' },
];

export function conteoModulo(id: ModuleId): number {
  const mod = MODULOS.find(m => m.id === id);
  return mod ? (FUNCIONES_POR_MODULO[mod.codigo]?.length ?? 0) : 0;
}

export const TOTAL = TOTAL_FUNCIONES;

/** Suma de funcionalidades de una fase. */
export function conteoFase(fase: number): number {
  return MODULOS.filter(m => m.fase === fase).reduce((acc, m) => acc + conteoModulo(m.id), 0);
}

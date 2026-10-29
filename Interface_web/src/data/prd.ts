// Datos de demostración del módulo de Producción (PRD).
// Sin fetch: todo vive en estado local de las páginas. Tipos locales al
// archivo (no editar src/types.ts).

/* -------------------------------- Productos ------------------------------- */

export type Trazabilidad = 'ninguna' | 'lote' | 'serie';

export type TipoProductoPRD = 'Materia prima' | 'Semielaborado' | 'Terminado' | 'Kit' | 'Subproducto' | 'Servicio';

export interface ProductoPRD {
  id: string;
  nombre: string;
  um: string;
  tipo: TipoProductoPRD;
  trazabilidad: Trazabilidad;
  stock: number;
  costoEstandar: number;
}

export const PRODUCTOS: ProductoPRD[] = [
  { id: 'MP-001', nombre: 'Harina de trigo fortificada', um: 'kg', tipo: 'Materia prima', trazabilidad: 'lote', stock: 12400, costoEstandar: 3850 },
  { id: 'MP-002', nombre: 'Azúcar refinada', um: 'kg', tipo: 'Materia prima', trazabilidad: 'lote', stock: 5600, costoEstandar: 4200 },
  { id: 'MP-003', nombre: 'Aceite vegetal', um: 'L', tipo: 'Materia prima', trazabilidad: 'lote', stock: 2100, costoEstandar: 9800 },
  { id: 'MP-004', nombre: 'Cacao en polvo 22 %', um: 'kg', tipo: 'Materia prima', trazabilidad: 'lote', stock: 830, costoEstandar: 24500 },
  { id: 'MP-005', nombre: 'Levadura fresca', um: 'kg', tipo: 'Materia prima', trazabilidad: 'lote', stock: 145, costoEstandar: 11200 },
  { id: 'MP-006', nombre: 'Empaque bolsa 600 g', um: 'und', tipo: 'Materia prima', trazabilidad: 'ninguna', stock: 28600, costoEstandar: 210 },
  { id: 'SE-001', nombre: 'Masa base panadería', um: 'kg', tipo: 'Semielaborado', trazabilidad: 'lote', stock: 940, costoEstandar: 6200 },
  { id: 'SE-002', nombre: 'Crema pastelera', um: 'kg', tipo: 'Semielaborado', trazabilidad: 'lote', stock: 320, costoEstandar: 7300 },
  { id: 'PT-001', nombre: 'Pan tajado blanco 600 g', um: 'und', tipo: 'Terminado', trazabilidad: 'lote', stock: 1240, costoEstandar: 6900 },
  { id: 'PT-002', nombre: 'Torta de chocolate 1 lb', um: 'und', tipo: 'Terminado', trazabilidad: 'lote', stock: 310, costoEstandar: 18500 },
  { id: 'PT-003', nombre: 'Galleta surtida x 12', um: 'caja', tipo: 'Terminado', trazabilidad: 'serie', stock: 860, costoEstandar: 9400 },
  { id: 'PT-004', nombre: 'Combo regalo panadería', um: 'und', tipo: 'Kit', trazabilidad: 'ninguna', stock: 45, costoEstandar: 24500 },
  { id: 'SP-001', nombre: 'Recortes de masa', um: 'kg', tipo: 'Subproducto', trazabilidad: 'ninguna', stock: 180, costoEstandar: 800 },
];

export const PRODUCTOS_POR_ID = new Map(PRODUCTOS.map(p => [p.id, p]));

export function nombreProducto(id: string): string {
  return PRODUCTOS_POR_ID.get(id)?.nombre ?? id;
}

export function umProducto(id: string): string {
  return PRODUCTOS_POR_ID.get(id)?.um ?? 'und';
}

/* ------------------------- Listas de materiales (BOM) ---------------------- */

export type TipoBOM = 'normal' | 'kit' | 'multinivel';
export type TipoComponente = 'normal' | 'opcional' | 'variante' | 'subproducto';

export interface ComponenteBOM {
  productoId: string;
  cantidad: number;
  um: string;
  mermaPct: number;
  operacion: string;
  tipo: TipoComponente;
  plazoDias?: number;
  /** Participación del subproducto en el costo del lote (%). */
  participacionCostoPct?: number;
  observacion?: string;
}

export interface BOM {
  id: string;
  productoId: string;
  version: string;
  tipo: TipoBOM;
  vigente: boolean;
  vigenciaDesde: string;
  tamanoLote: number;
  componentes: ComponenteBOM[];
  subproductos: ComponenteBOM[];
}

export const BOMS: BOM[] = [
  {
    id: 'BOM-001',
    productoId: 'PT-001',
    version: 'v3',
    tipo: 'normal',
    vigente: true,
    vigenciaDesde: '2026-08-01',
    tamanoLote: 1000,
    componentes: [
      { productoId: 'MP-001', cantidad: 620, um: 'kg', mermaPct: 2, operacion: 'OP-10', tipo: 'normal', observacion: 'Mezcla en húmedo' },
      { productoId: 'MP-002', cantidad: 38, um: 'kg', mermaPct: 1, operacion: 'OP-10', tipo: 'normal' },
      { productoId: 'MP-003', cantidad: 24, um: 'L', mermaPct: 1, operacion: 'OP-10', tipo: 'normal' },
      { productoId: 'MP-005', cantidad: 12, um: 'kg', mermaPct: 0.5, operacion: 'OP-10', tipo: 'normal' },
      { productoId: 'MP-006', cantidad: 1000, um: 'und', mermaPct: 0.5, operacion: 'OP-50', tipo: 'normal' },
    ],
    subproductos: [
      { productoId: 'SP-001', cantidad: 18, um: 'kg', mermaPct: 0, operacion: 'OP-40', tipo: 'subproducto', participacionCostoPct: 2, observacion: 'Recortes del rebanado' },
    ],
  },
  {
    id: 'BOM-002',
    productoId: 'PT-002',
    version: 'v2',
    tipo: 'normal',
    vigente: true,
    vigenciaDesde: '2026-07-15',
    tamanoLote: 100,
    componentes: [
      { productoId: 'MP-001', cantidad: 12, um: 'kg', mermaPct: 2, operacion: 'OP-10', tipo: 'normal' },
      { productoId: 'MP-004', cantidad: 6, um: 'kg', mermaPct: 1.5, operacion: 'OP-20', tipo: 'normal' },
      { productoId: 'SE-002', cantidad: 4, um: 'kg', mermaPct: 1, operacion: 'OP-30', tipo: 'normal', plazoDias: 1, observacion: 'Semielaborado con BOM propia (multinivel)' },
    ],
    subproductos: [
      { productoId: 'SP-001', cantidad: 1.2, um: 'kg', mermaPct: 0, operacion: 'OP-30', tipo: 'subproducto', participacionCostoPct: 1, observacion: 'Recortes de decoración' },
    ],
  },
  {
    id: 'BOM-003',
    productoId: 'PT-003',
    version: 'v1',
    tipo: 'kit',
    vigente: true,
    vigenciaDesde: '2026-09-01',
    tamanoLote: 50,
    componentes: [
      { productoId: 'PT-001', cantidad: 6, um: 'und', mermaPct: 0, operacion: 'OP-50', tipo: 'normal', observacion: 'Se explota sin generar OF propia' },
      { productoId: 'PT-002', cantidad: 3, um: 'und', mermaPct: 0, operacion: 'OP-50', tipo: 'normal' },
      { productoId: 'MP-004', cantidad: 0.5, um: 'kg', mermaPct: 0, operacion: 'OP-50', tipo: 'opcional', observacion: 'Cobertura extra (opcional)' },
    ],
    subproductos: [],
  },
  {
    id: 'BOM-004',
    productoId: 'SE-001',
    version: 'v2',
    tipo: 'normal',
    vigente: true,
    vigenciaDesde: '2026-08-01',
    tamanoLote: 500,
    componentes: [
      { productoId: 'MP-001', cantidad: 310, um: 'kg', mermaPct: 2, operacion: 'OP-10', tipo: 'normal' },
      { productoId: 'MP-003', cantidad: 12, um: 'L', mermaPct: 1, operacion: 'OP-10', tipo: 'normal' },
      { productoId: 'MP-005', cantidad: 6, um: 'kg', mermaPct: 0.5, operacion: 'OP-10', tipo: 'normal' },
    ],
    subproductos: [],
  },
  {
    id: 'BOM-005',
    productoId: 'SE-002',
    version: 'v1',
    tipo: 'normal',
    vigente: true,
    vigenciaDesde: '2026-07-15',
    tamanoLote: 40,
    componentes: [
      { productoId: 'MP-002', cantidad: 9, um: 'kg', mermaPct: 1, operacion: 'OP-20', tipo: 'normal' },
      { productoId: 'MP-003', cantidad: 2.5, um: 'L', mermaPct: 1, operacion: 'OP-20', tipo: 'normal' },
      { productoId: 'MP-004', cantidad: 1.2, um: 'kg', mermaPct: 1, operacion: 'OP-20', tipo: 'normal' },
    ],
    subproductos: [],
  },
  {
    id: 'BOM-006',
    productoId: 'PT-003',
    version: 'v1.1',
    tipo: 'multinivel',
    vigente: false,
    vigenciaDesde: '2026-06-01',
    tamanoLote: 50,
    componentes: [
      { productoId: 'SE-001', cantidad: 20, um: 'kg', mermaPct: 2, operacion: 'OP-10', tipo: 'normal', observacion: 'Versión anterior con masa propia' },
      { productoId: 'MP-004', cantidad: 3, um: 'kg', mermaPct: 1, operacion: 'OP-20', tipo: 'variante', observacion: 'Variante chocolate intenso' },
    ],
    subproductos: [],
  },
  {
    id: 'BOM-007',
    productoId: 'PT-004',
    version: 'v1',
    tipo: 'kit',
    vigente: true,
    vigenciaDesde: '2026-10-20',
    tamanoLote: 10,
    componentes: [
      { productoId: 'PT-001', cantidad: 1, um: 'und', mermaPct: 0, operacion: 'OP-50', tipo: 'normal', observacion: 'Se explota sin generar OF propia' },
      { productoId: 'PT-002', cantidad: 1, um: 'und', mermaPct: 0, operacion: 'OP-50', tipo: 'normal' },
      { productoId: 'MP-004', cantidad: 0.25, um: 'kg', mermaPct: 0, operacion: 'OP-50', tipo: 'normal', observacion: 'Bombón de cortesía' },
    ],
    subproductos: [],
  },
];

/* ------------------------------ Rutas y operaciones ------------------------ */

export type DuracionTipo = 'fija' | 'calculada';
export type CondicionInicio = 'todos los componentes' | 'primera operación';

export interface OperacionRuta {
  codigo: string;
  nombre: string;
  centroId: string;
  duracionTipo: DuracionTipo;
  duracionMin?: number;
  prepMin: number;
  cicloMin: number;
  limpiezaMin: number;
  costoFijo: number;
  piezasPorCiclo?: number;
  dependeDe?: string;
}

export interface Ruta {
  id: string;
  productoId: string;
  version: string;
  vigente: boolean;
  plazoFabricacionDias: number;
  diasPreparacion: number;
  inicioCon: CondicionInicio;
  operaciones: OperacionRuta[];
}

export const RUTAS: Ruta[] = [
  {
    id: 'RUT-001',
    productoId: 'PT-001',
    version: 'v3',
    vigente: true,
    plazoFabricacionDias: 1,
    diasPreparacion: 1,
    inicioCon: 'todos los componentes',
    operaciones: [
      { codigo: 'OP-10', nombre: 'Mezclado', centroId: 'CT-001', duracionTipo: 'calculada', prepMin: 20, cicloMin: 35, limpiezaMin: 15, costoFijo: 0, piezasPorCiclo: 250 },
      { codigo: 'OP-20', nombre: 'Fermentación', centroId: 'CT-005', duracionTipo: 'fija', duracionMin: 120, prepMin: 0, cicloMin: 0, limpiezaMin: 0, costoFijo: 0 },
      { codigo: 'OP-30', nombre: 'Horneado', centroId: 'CT-002', duracionTipo: 'calculada', prepMin: 25, cicloMin: 28, limpiezaMin: 10, costoFijo: 45000, piezasPorCiclo: 120, dependeDe: 'OP-20' },
      { codigo: 'OP-40', nombre: 'Enfriado y rebanado', centroId: 'CT-004', duracionTipo: 'calculada', prepMin: 10, cicloMin: 12, limpiezaMin: 8, costoFijo: 0, piezasPorCiclo: 60, dependeDe: 'OP-30' },
      { codigo: 'OP-50', nombre: 'Empacado', centroId: 'CT-003', duracionTipo: 'calculada', prepMin: 15, cicloMin: 20, limpiezaMin: 5, costoFijo: 0, piezasPorCiclo: 200, dependeDe: 'OP-40' },
    ],
  },
  {
    id: 'RUT-002',
    productoId: 'PT-002',
    version: 'v2',
    vigente: true,
    plazoFabricacionDias: 2,
    diasPreparacion: 1,
    inicioCon: 'primera operación',
    operaciones: [
      { codigo: 'OP-10', nombre: 'Mezclado', centroId: 'CT-001', duracionTipo: 'calculada', prepMin: 20, cicloMin: 30, limpiezaMin: 15, costoFijo: 0, piezasPorCiclo: 20 },
      { codigo: 'OP-20', nombre: 'Horneado', centroId: 'CT-002', duracionTipo: 'calculada', prepMin: 25, cicloMin: 45, limpiezaMin:10, costoFijo: 60000, piezasPorCiclo: 12, dependeDe: 'OP-10' },
      { codigo: 'OP-30', nombre: 'Relleno y decoración', centroId: 'CT-005', duracionTipo: 'calculada', prepMin: 15, cicloMin: 18, limpiezaMin: 10, costoFijo: 0, piezasPorCiclo: 4, dependeDe: 'OP-20' },
      { codigo: 'OP-50', nombre: 'Empacado', centroId: 'CT-003', duracionTipo: 'calculada', prepMin: 10, cicloMin: 8, limpiezaMin: 5, costoFijo: 0, piezasPorCiclo: 10, dependeDe: 'OP-30' },
    ],
  },
  {
    id: 'RUT-003',
    productoId: 'SE-001',
    version: 'v2',
    vigente: true,
    plazoFabricacionDias: 1,
    diasPreparacion: 0,
    inicioCon: 'todos los componentes',
    operaciones: [
      { codigo: 'OP-10', nombre: 'Mezclado', centroId: 'CT-001', duracionTipo: 'calculada', prepMin: 20, cicloMin: 40, limpiezaMin: 15, costoFijo: 0, piezasPorCiclo: 500 },
    ],
  },
];

export const NOMBRES_OPERACION: Record<string, string> = Object.fromEntries(
  RUTAS.flatMap(r => r.operaciones).map(op => [op.codigo, op.nombre]),
);

/* ------------------------------ Centros de trabajo ------------------------- */

export interface CentroTrabajo {
  id: string;
  nombre: string;
  tipo: string;
  eficiencia: number;
  costoHora: number;
  prepMin: number;
  limpiezaMin: number;
  capacidadDia: number;
  calendario: string;
  etiquetas: string[];
  activo: boolean;
}

export const CENTROS: CentroTrabajo[] = [
  { id: 'CT-001', nombre: 'Mezcladora industrial', tipo: 'Máquina', eficiencia: 0.92, costoHora: 48000, prepMin: 20, limpiezaMin: 15, capacidadDia: 16, calendario: 'L-V 06:00–22:00 · S 06:00–14:00', etiquetas: ['amasado', 'mezclas'], activo: true },
  { id: 'CT-002', nombre: 'Horno rotativo 40 bandejas', tipo: 'Máquina', eficiencia: 0.88, costoHora: 95000, prepMin: 25, limpiezaMin: 10, capacidadDia: 14, calendario: 'L-S 04:00–20:00', etiquetas: ['horneado', 'temperatura'], activo: true },
  { id: 'CT-003', nombre: 'Línea de empacado flow-pack', tipo: 'Línea', eficiencia: 0.95, costoHora: 62000, prepMin: 15, limpiezaMin: 5, capacidadDia: 20, calendario: 'L-V 06:00–22:00', etiquetas: ['empacado', 'etiquetado'], activo: true },
  { id: 'CT-004', nombre: 'Molino y rebanadora', tipo: 'Máquina', eficiencia: 0.85, costoHora: 35000, prepMin: 10, limpiezaMin: 8, capacidadDia: 12, calendario: 'L-S 05:00–18:00', etiquetas: ['rebanado'], activo: true },
  { id: 'CT-005', nombre: 'Celda de fermentación y decoración', tipo: 'Celda', eficiencia: 0.8, costoHora: 28000, prepMin: 0, limpiezaMin: 10, capacidadDia: 18, calendario: 'L-D 00:00–24:00', etiquetas: ['fermentación', 'decoración'], activo: true },
  { id: 'CT-006', nombre: 'Banco de reparaciones', tipo: 'Manual', eficiencia: 0.75, costoHora: 22000, prepMin: 5, limpiezaMin: 5, capacidadDia: 10, calendario: 'L-V 08:00–17:00', etiquetas: ['reparación'], activo: true },
];

export const CENTROS_POR_ID = new Map(CENTROS.map(c => [c.id, c]));

export function nombreCentro(id: string): string {
  return CENTROS_POR_ID.get(id)?.nombre ?? id;
}

export const CENTROS_ALTERNATIVOS = [
  { centroId: 'CT-001', alternativas: ['CT-005'] },
  { centroId: 'CT-002', alternativas: ['CT-004'] },
  { centroId: 'CT-003', alternativas: ['CT-005'] },
];

/* --------------------------- Órdenes de fabricación ------------------------ */

export type EstadoOF = 'borrador' | 'confirmada' | 'en_progreso' | 'hecha' | 'cerrada' | 'cancelada';
export type EstadoLista = 'Lista' | 'Esperando material' | 'Esperando operación' | 'Bloqueada';

export interface OrdenFabricacion {
  id: string;
  productoId: string;
  cantidad: number;
  producida: number;
  um: string;
  estado: EstadoOF;
  lista: EstadoLista;
  origen: string;
  fechaCreacion: string;
  fechaInicio: string;
  fechaLimite: string;
  lote: string;
  bomId: string;
  rutaId: string;
  bloqueada: boolean;
  pendiente: number;
  reservado: number;
}

export const ORDENES: OrdenFabricacion[] = [
  { id: 'OF-1041', productoId: 'PT-001', cantidad: 2000, producida: 2000, um: 'und', estado: 'cerrada', lista: 'Lista', origen: 'Venta', fechaCreacion: '2026-10-14', fechaInicio: '2026-10-15', fechaLimite: '2026-10-18', lote: 'L-2026-101', bomId: 'BOM-001', rutaId: 'RUT-001', bloqueada: false, pendiente: 0, reservado: 0 },
  { id: 'OF-1042', productoId: 'PT-002', cantidad: 120, producida: 120, um: 'und', estado: 'hecha', lista: 'Lista', origen: 'Venta', fechaCreacion: '2026-10-16', fechaInicio: '2026-10-17', fechaLimite: '2026-10-20', lote: 'L-2026-102', bomId: 'BOM-002', rutaId: 'RUT-002', bloqueada: false, pendiente: 0, reservado: 0 },
  { id: 'OF-1043', productoId: 'PT-001', cantidad: 1500, producida: 620, um: 'und', estado: 'en_progreso', lista: 'Lista', origen: 'Stock', fechaCreacion: '2026-10-21', fechaInicio: '2026-10-22', fechaLimite: '2026-10-27', lote: 'L-2026-107', bomId: 'BOM-001', rutaId: 'RUT-001', bloqueada: false, pendiente: 0, reservado: 1500 },
  { id: 'OF-1044', productoId: 'PT-002', cantidad: 90, producida: 0, um: 'und', estado: 'confirmada', lista: 'Esperando material', origen: 'Venta', fechaCreacion: '2026-10-23', fechaInicio: '2026-10-26', fechaLimite: '2026-10-30', lote: '', bomId: 'BOM-002', rutaId: 'RUT-002', bloqueada: false, pendiente: 0, reservado: 0 },
  { id: 'OF-1045', productoId: 'SE-001', cantidad: 500, producida: 0, um: 'kg', estado: 'confirmada', lista: 'Lista', origen: 'Subensamble', fechaCreacion: '2026-10-24', fechaInicio: '2026-10-27', fechaLimite: '2026-10-28', lote: '', bomId: 'BOM-004', rutaId: 'RUT-003', bloqueada: false, pendiente: 0, reservado: 0 },
  { id: 'OF-1046', productoId: 'PT-003', cantidad: 100, producida: 0, um: 'caja', estado: 'borrador', lista: 'Bloqueada', origen: 'MPS', fechaCreacion: '2026-10-24', fechaInicio: '2026-10-29', fechaLimite: '2026-11-02', lote: '', bomId: 'BOM-003', rutaId: 'RUT-002', bloqueada: true, pendiente: 0, reservado: 0 },
  { id: 'OF-1047', productoId: 'PT-001', cantidad: 800, producida: 0, um: 'und', estado: 'borrador', lista: 'Esperando material', origen: 'Manual', fechaCreacion: '2026-10-25', fechaInicio: '2026-10-28', fechaLimite: '2026-10-31', lote: '', bomId: 'BOM-001', rutaId: 'RUT-001', bloqueada: false, pendiente: 0, reservado: 0 },
  { id: 'OF-1048', productoId: 'PT-002', cantidad: 60, producida: 42, um: 'und', estado: 'en_progreso', lista: 'Lista', origen: 'Subcontratación', fechaCreacion: '2026-10-22', fechaInicio: '2026-10-23', fechaLimite: '2026-10-26', lote: 'L-2026-110', bomId: 'BOM-002', rutaId: 'RUT-002', bloqueada: true, pendiente: 18, reservado: 60 },
];

/* ------------------------------ Órdenes de trabajo ------------------------- */

export type EstadoOT = 'bloqueada' | 'por hacer' | 'en progreso' | 'hecha' | 'cancelada';

export interface OrdenTrabajo {
  id: string;
  ofId: string;
  operacion: string;
  centroId: string;
  responsable: string;
  estado: EstadoOT;
  inicio?: string;
  fin?: string;
  duracionRealMin?: number;
  duracionEsperadaMin: number;
  bloqueadaPor?: string;
}

export const ORDENES_TRABAJO: OrdenTrabajo[] = [
  { id: 'OT-3001', ofId: 'OF-1043', operacion: 'OP-10', centroId: 'CT-001', responsable: 'Diego Ramírez', estado: 'hecha', inicio: '2026-10-22 06:10', fin: '2026-10-22 07:40', duracionRealMin: 90, duracionEsperadaMin: 100 },
  { id: 'OT-3002', ofId: 'OF-1043', operacion: 'OP-20', centroId: 'CT-005', responsable: 'Diego Ramírez', estado: 'hecha', inicio: '2026-10-22 07:45', fin: '2026-10-22 09:50', duracionRealMin: 125, duracionEsperadaMin: 120 },
  { id: 'OT-3003', ofId: 'OF-1043', operacion: 'OP-30', centroId: 'CT-002', responsable: 'Ana Beltrán', estado: 'en progreso', inicio: '2026-10-22 10:00', duracionEsperadaMin: 180, bloqueadaPor: 'OT-3002' },
  { id: 'OT-3004', ofId: 'OF-1043', operacion: 'OP-40', centroId: 'CT-004', responsable: 'Carlos Mora', estado: 'bloqueada', duracionEsperadaMin: 60, bloqueadaPor: 'OT-3003' },
  { id: 'OT-3005', ofId: 'OF-1043', operacion: 'OP-50', centroId: 'CT-003', responsable: 'Lucía Herrera', estado: 'bloqueada', duracionEsperadaMin: 45, bloqueadaPor: 'OT-3004' },
  { id: 'OT-3006', ofId: 'OF-1048', operacion: 'OP-20', centroId: 'CT-002', responsable: 'Ana Beltrán', estado: 'en progreso', inicio: '2026-10-23 08:30', duracionEsperadaMin: 200 },
  { id: 'OT-3007', ofId: 'OF-1042', operacion: 'OP-50', centroId: 'CT-003', responsable: 'Lucía Herrera', estado: 'hecha', inicio: '2026-10-19 14:00', fin: '2026-10-19 14:50', duracionRealMin: 50, duracionEsperadaMin: 48 },
];

/* ----------------------------- Consumos y desechos ------------------------- */

export interface Consumo {
  id: string;
  ofId: string;
  productoId: string;
  teorico: number;
  real: number;
  um: string;
  justificado: boolean;
  motivo?: string;
}

export const CONSUMOS: Consumo[] = [
  { id: 'CO-01', ofId: 'OF-1043', productoId: 'MP-001', teorico: 930, real: 948, um: 'kg', justificado: true, motivo: 'Merma real de mezcla 2,1 %' },
  { id: 'CO-02', ofId: 'OF-1043', productoId: 'MP-005', teorico: 18, real: 19.2, um: 'kg', justificado: true, motivo: 'Ajuste por humedad del lote' },
  { id: 'CO-03', ofId: 'OF-1048', productoId: 'MP-004', teorico: 2.5, real: 3.1, um: 'kg', justificado: false },
  { id: 'CO-04', ofId: 'OF-1042', productoId: 'MP-001', teorico: 14.4, real: 14.2, um: 'kg', justificado: true, motivo: 'Rendimiento superior al teórico' },
  { id: 'CO-05', ofId: 'OF-1042', productoId: 'SE-002', teorico: 4.8, real: 5.2, um: 'kg', justificado: false },
  { id: 'CO-06', ofId: 'OF-1041', productoId: 'MP-006', teorico: 2000, real: 2005, um: 'und', justificado: true, motivo: 'Bolsas defectuosas repuestas' },
];

export interface Desecho {
  id: string;
  ofId: string;
  productoId: string;
  cantidad: number;
  um: string;
  motivo: string;
  responsable: string;
  fecha: string;
}

export const DESECHOS: Desecho[] = [
  { id: 'DE-01', ofId: 'OF-1043', productoId: 'MP-001', cantidad: 8, um: 'kg', motivo: 'Contaminación cruzada en mezcla', responsable: 'Diego Ramírez', fecha: '2026-10-23' },
  { id: 'DE-02', ofId: 'OF-1048', productoId: 'PT-002', cantidad: 3, um: 'und', motivo: 'Deformación en horneado', responsable: 'Ana Beltrán', fecha: '2026-10-24' },
  { id: 'DE-03', ofId: 'OF-1042', productoId: 'SE-002', cantidad: 0.6, um: 'kg', motivo: 'Caducidad de crema en frío', responsable: 'Lucía Herrera', fecha: '2026-10-18' },
  { id: 'DE-04', ofId: 'OF-1041', productoId: 'MP-005', cantidad: 0.4, um: 'kg', motivo: 'Levadura sin actividad', responsable: 'Diego Ramírez', fecha: '2026-10-15' },
];

/* ------------------------------ Paradas y pérdidas ------------------------- */

export type TipoParada = 'Disponibilidad' | 'Rendimiento' | 'Calidad' | 'Operativa';

export interface Parada {
  id: string;
  centroId: string;
  ofId: string;
  tipo: TipoParada;
  motivo: string;
  inicio: string;
  duracionMin: number;
}

export const PARADAS: Parada[] = [
  { id: 'PA-01', centroId: 'CT-002', ofId: 'OF-1048', tipo: 'Disponibilidad', motivo: 'Falla en quemador', inicio: '2026-10-23 11:20', duracionMin: 45 },
  { id: 'PA-02', centroId: 'CT-003', ofId: 'OF-1043', tipo: 'Rendimiento', motivo: 'Cambio de bobina de film', inicio: '2026-10-22 15:40', duracionMin: 12 },
  { id: 'PA-03', centroId: 'CT-001', ofId: 'OF-1043', tipo: 'Calidad', motivo: 'Revisión de masa con grumos', inicio: '2026-10-22 07:00', duracionMin: 20 },
  { id: 'PA-04', centroId: 'CT-005', ofId: 'OF-1043', tipo: 'Operativa', motivo: 'Ausencia de operario en relevo', inicio: '2026-10-22 08:00', duracionMin: 15 },
  { id: 'PA-05', centroId: 'CT-004', ofId: 'OF-1041', tipo: 'Disponibilidad', motivo: 'Cambio de cuchilla rebanadora', inicio: '2026-10-15 10:10', duracionMin: 30 },
];

/* --------------------------------- Costeo --------------------------------- */

export interface CostoOF {
  ofId: string;
  materiales: number;
  operaciones: number;
  adicionales: number;
  creditoSubproductos: number;
  total: number;
  costoUnitario: number;
  wip: number;
}

export const COSTOS_OF: CostoOF[] = [
  { ofId: 'OF-1041', materiales: 8325000, operaciones: 1480000, adicionales: 210000, creditoSubproductos: 36000, total: 9979000, costoUnitario: 4990, wip: 0 },
  { ofId: 'OF-1042', materiales: 1404000, operaciones: 660000, adicionales: 120000, creditoSubproductos: 0, total: 2184000, costoUnitario: 18200, wip: 0 },
  { ofId: 'OF-1043', materiales: 3310000, operaciones: 940000, adicionales: 0, creditoSubproductos: 0, total: 4250000, costoUnitario: 6855, wip: 2695000 },
  { ofId: 'OF-1044', materiales: 0, operaciones: 0, adicionales: 0, creditoSubproductos: 0, total: 0, costoUnitario: 0, wip: 0 },
  { ofId: 'OF-1048', materiales: 890000, operaciones: 430000, adicionales: 150000, creditoSubproductos: 0, total: 1470000, costoUnitario: 35000, wip: 986000 },
];

/* -------------------------------- Faltantes -------------------------------- */

export interface Faltante {
  productoId: string;
  requerido: number;
  disponible: number;
  faltante: number;
  fechaEsperada: string;
  accion: 'Comprar' | 'Fabricar';
  prioridad: 'Alta' | 'Media' | 'Baja';
  puntoPedido: number;
}

export const FALTANTES: Faltante[] = [
  { productoId: 'MP-004', requerido: 900, disponible: 830, faltante: 70, fechaEsperada: '2026-10-30', accion: 'Comprar', prioridad: 'Alta', puntoPedido: 250 },
  { productoId: 'SE-002', requerido: 340, disponible: 320, faltante: 20, fechaEsperada: '2026-10-28', accion: 'Fabricar', prioridad: 'Alta', puntoPedido: 100 },
  { productoId: 'MP-005', requerido: 160, disponible: 145, faltante: 15, fechaEsperada: '2026-10-29', accion: 'Comprar', prioridad: 'Media', puntoPedido: 80 },
  { productoId: 'MP-006', requerido: 29000, disponible: 28600, faltante: 400, fechaEsperada: '2026-10-31', accion: 'Comprar', prioridad: 'Media', puntoPedido: 5000 },
  { productoId: 'MP-001', requerido: 13000, disponible: 12400, faltante: 600, fechaEsperada: '2026-11-01', accion: 'Comprar', prioridad: 'Baja', puntoPedido: 3000 },
];

/* ------------------------------ Subcontratación ---------------------------- */

export type EstadoSubcontrato = 'Enviado' | 'En proceso' | 'Recibido' | 'Facturado';

export interface Subcontrato {
  id: string;
  proveedor: string;
  productoId: string;
  cantidad: number;
  componentesEnviados: number;
  estado: EstadoSubcontrato;
  costo: number;
  fechaEnvio: string;
  fechaRecepcion?: string;
  trazabilidad: boolean;
}

export const SUBCONTRATOS: Subcontrato[] = [
  { id: 'SC-001', proveedor: 'Panificadora El Trigo SAS', productoId: 'PT-001', cantidad: 500, componentesEnviados: 310, estado: 'En proceso', costo: 620000, fechaEnvio: '2026-10-21', trazabilidad: true },
  { id: 'SC-002', proveedor: 'Horno Andino Ltda.', productoId: 'PT-002', cantidad: 60, componentesEnviados: 0, estado: 'Enviado', costo: 150000, fechaEnvio: '2026-10-24', trazabilidad: true },
  { id: 'SC-003', proveedor: 'Panificadora El Trigo SAS', productoId: 'PT-001', cantidad: 300, componentesEnviados: 186, estado: 'Recibido', costo: 360000, fechaEnvio: '2026-10-10', fechaRecepcion: '2026-10-16', trazabilidad: true },
  { id: 'SC-004', proveedor: 'Empaques y Procesos SA', productoId: 'PT-003', cantidad: 40, componentesEnviados: 0, estado: 'Facturado', costo: 480000, fechaEnvio: '2026-09-28', fechaRecepcion: '2026-10-03', trazabilidad: false },
];

/* -------------------------------- Reparación ------------------------------- */

export type EstadoReparacion = 'Diagnóstico' | 'En reparación' | 'Terminada' | 'Facturada';

export interface Reparacion {
  id: string;
  productoId: string;
  lote: string;
  piezas: string;
  servicios: number;
  costo: number;
  estado: EstadoReparacion;
  factura?: string;
  ofId?: string;
}

export const REPARACIONES: Reparacion[] = [
  { id: 'RE-001', productoId: 'PT-002', lote: 'L-2026-095', piezas: 'Cobertura chocolate 200 g', servicios: 1, costo: 32000, estado: 'En reparación', ofId: 'OF-1048' },
  { id: 'RE-002', productoId: 'PT-003', lote: 'S-2026-031', piezas: 'Tapa de caja + 2 unidades', servicios: 1, costo: 18500, estado: 'Terminada', factura: 'FV-9031' },
  { id: 'RE-003', productoId: 'PT-001', lote: 'L-2026-088', piezas: 'Empaque dañado', servicios: 0, costo: 4200, estado: 'Diagnóstico' },
  { id: 'RE-004', productoId: 'PT-002', lote: 'L-2026-090', piezas: 'Re-decoración completa', servicios: 2, costo: 41000, estado: 'Facturada', factura: 'FV-8977' },
];

/* --------------------------- Compras para producción ----------------------- */

export type EstadoCompra = 'Pedida' | 'Recibida' | 'Consumida';

export interface CompraProduccion {
  id: string;
  ofId: string;
  proveedor: string;
  productoId: string;
  cantidad: number;
  estado: EstadoCompra;
  fechaPedido: string;
  fechaRecepcion?: string;
  costo: number;
}

export const COMPRAS_PRODUCCION: CompraProduccion[] = [
  { id: 'CP-001', ofId: 'OF-1048', proveedor: 'Cacao Andino SAS', productoId: 'MP-004', cantidad: 25, estado: 'Consumida', fechaPedido: '2026-10-20', fechaRecepcion: '2026-10-22', costo: 612500 },
  { id: 'CP-002', ofId: 'OF-1044', proveedor: 'Ingredientes del Valle', productoId: 'MP-001', cantidad: 200, estado: 'Recibida', fechaPedido: '2026-10-23', fechaRecepcion: '2026-10-25', costo: 770000 },
  { id: 'CP-003', ofId: 'OF-1044', proveedor: 'Cacao Andino SAS', productoId: 'MP-004', cantidad: 12, estado: 'Pedida', fechaPedido: '2026-10-24', costo: 294000 },
  { id: 'CP-004', ofId: 'OF-1043', proveedor: 'Empaques Rápidos SA', productoId: 'MP-006', cantidad: 1600, estado: 'Recibida', fechaPedido: '2026-10-21', fechaRecepcion: '2026-10-23', costo: 336000 },
];

/* --------------------------- Capacidad por producto ------------------------ */

export interface CapacidadProducto {
  centroId: string;
  productoId: string;
  piezasPorCiclo: number;
  um: string;
  tiempoInicioMin: number;
  tiempoFinMin: number;
}

export const CAPACIDAD_PRODUCTO: CapacidadProducto[] = [
  { centroId: 'CT-001', productoId: 'PT-001', piezasPorCiclo: 250, um: 'und', tiempoInicioMin: 5, tiempoFinMin: 4 },
  { centroId: 'CT-002', productoId: 'PT-001', piezasPorCiclo: 120, um: 'und', tiempoInicioMin: 8, tiempoFinMin: 6 },
  { centroId: 'CT-002', productoId: 'PT-002', piezasPorCiclo: 12, um: 'und', tiempoInicioMin: 10, tiempoFinMin: 8 },
  { centroId: 'CT-003', productoId: 'PT-001', piezasPorCiclo: 200, um: 'und', tiempoInicioMin: 6, tiempoFinMin: 3 },
  { centroId: 'CT-003', productoId: 'PT-003', piezasPorCiclo: 24, um: 'caja', tiempoInicioMin: 7, tiempoFinMin: 5 },
];

/* ---------------------------- Registro de producción ----------------------- */

export interface RegistroProduccion {
  id: string;
  ofId: string;
  fecha: string;
  cantidad: number;
  lote: string;
  merma: number;
  usuario: string;
}

export const REGISTROS_PRODUCCION: RegistroProduccion[] = [
  { id: 'RG-01', ofId: 'OF-1043', fecha: '2026-10-23', cantidad: 620, lote: 'L-2026-107', merma: 12, usuario: 'Diego Ramírez' },
  { id: 'RG-02', ofId: 'OF-1048', fecha: '2026-10-24', cantidad: 42, lote: 'L-2026-110', merma: 3, usuario: 'Ana Beltrán' },
  { id: 'RG-03', ofId: 'OF-1042', fecha: '2026-10-19', cantidad: 120, lote: 'L-2026-102', merma: 2, usuario: 'Lucía Herrera' },
  { id: 'RG-04', ofId: 'OF-1041', fecha: '2026-10-17', cantidad: 2000, lote: 'L-2026-101', merma: 15, usuario: 'Diego Ramírez' },
];

/* ------------------------------ Variantes (PRD-04) ------------------------- */

export interface ComponenteVariante {
  bomId: string;
  productoId: string;
  variante: string;
  tipo: 'normal' | 'opcional' | 'variante';
  cantidadBase: number;
  cantidadVariable: boolean;
  operacion: string;
}

export const COMPONENTES_VARIANTES: ComponenteVariante[] = [
  { bomId: 'BOM-003', productoId: 'PT-001', variante: 'Pan blanco', tipo: 'normal', cantidadBase: 6, cantidadVariable: false, operacion: 'OP-50' },
  { bomId: 'BOM-003', productoId: 'PT-002', variante: 'Torta chocolate', tipo: 'normal', cantidadBase: 3, cantidadVariable: false, operacion: 'OP-50' },
  { bomId: 'BOM-006', productoId: 'MP-004', variante: 'Cacao intenso 22 %', tipo: 'variante', cantidadBase: 3, cantidadVariable: true, operacion: 'OP-20' },
  { bomId: 'BOM-003', productoId: 'MP-004', variante: 'Cobertura extra (opcional)', tipo: 'opcional', cantidadBase: 0.5, cantidadVariable: true, operacion: 'OP-50' },
  { bomId: 'BOM-002', productoId: 'MP-004', variante: 'Cacao 22 % o 36 %', tipo: 'variante', cantidadBase: 6, cantidadVariable: true, operacion: 'OP-20' },
];

/* --------------------------------- Reportes -------------------------------- */

export const REPORTES_PRD = [
  { id: 'RP-01', nombre: 'Análisis de órdenes de fabricación', descripcion: 'Estado, avance, retrasos y pendientes por orden.' },
  { id: 'RP-02', nombre: 'Operaciones y tiempos', descripcion: 'Duración real vs esperada por operación y centro.' },
  { id: 'RP-03', nombre: 'Eficiencia y pérdidas', descripcion: 'Disponibilidad, rendimiento, calidad y paradas.' },
  { id: 'RP-04', nombre: 'Estructura de materiales', descripcion: 'BOM multinivel con costos por componente.' },
  { id: 'RP-05', nombre: 'Consumo real vs teórico', descripcion: 'Desviaciones de materiales y justificaciones.' },
  { id: 'RP-06', nombre: 'Producción por producto', descripcion: 'Cantidades producidas por período y lote.' },
  { id: 'RP-07', nombre: 'Cumplimiento del plan', descripcion: 'Órdenes a tiempo vs retrasadas por semana.' },
  { id: 'RP-08', nombre: 'Valoración de inventario en proceso', descripcion: 'WIP por orden y centro de costo.' },
] as const;

/* ------------------------------- Configuración ----------------------------- */

export interface ConfiguracionPRD {
  ordenesTrabajo: boolean;
  subproductos: boolean;
  desbloqueoCantidades: boolean;
  subcontratacion: boolean;
  mpsMrp: boolean;
  costeoEstandar: boolean;
}

export const CONFIGURACION_INICIAL: ConfiguracionPRD = {
  ordenesTrabajo: true,
  subproductos: true,
  desbloqueoCantidades: false,
  subcontratacion: true,
  mpsMrp: true,
  costeoEstandar: false,
};

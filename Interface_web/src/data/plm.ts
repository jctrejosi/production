// Datos de demostración del módulo Ciclo de vida del producto (PLM).
// Entidades: productos, tipos de cambio, etapas del cambio, órdenes de cambio
// (ECO), aprobaciones, versiones de BOM (con componentes y operaciones),
// revisiones, análisis de impacto, documentos, eventos de auditoría.

export type PrioridadCambio = 'Alta' | 'Media' | 'Baja';
export type DecisionAprobacion = 'Aprobada' | 'Rechazada' | 'Pendiente';
export type AccionComponente = 'Agregar' | 'Quitar' | 'Modificar' | 'Sin cambio';

/* ----------------------------------- Productos ---------------------------------- */

export interface ProductoPLM {
  id: string;
  codigo: string;
  nombre: string;
  versionVigente: string;
  estado: 'En diseño' | 'En producción' | 'En descontinuación' | 'Obsoleto';
}

export const PRODUCTOS_PLM: ProductoPLM[] = [
  { id: 'PR-01', codigo: 'SKU-1012', nombre: 'Arequipe almendra 250 g', versionVigente: 'B', estado: 'En producción' },
  { id: 'PR-02', codigo: 'SKU-1007', nombre: 'Pan tajado integral 500 g', versionVigente: 'C', estado: 'En producción' },
  { id: 'PR-03', codigo: 'SKU-1044', nombre: 'Café molido 500 g', versionVigente: 'A', estado: 'En producción' },
  { id: 'PR-04', codigo: 'SKU-1089', nombre: 'Granola miel 400 g', versionVigente: 'B', estado: 'En producción' },
  { id: 'PR-05', codigo: 'SKU-1120', nombre: 'Yogur griego fresa 150 g', versionVigente: 'B', estado: 'En producción' },
  { id: 'PR-06', codigo: 'SKU-1201', nombre: 'Galleta avena pasas 300 g', versionVigente: 'A', estado: 'En diseño' },
];

/* -------------------------------- Tipos de cambio ------------------------------- */

export interface TipoCambio {
  id: string;
  nombre: string;
  reglas: string;
  requiereAprobacion: 'Calidad' | 'Compras' | 'Producción' | 'Dirección técnica' | 'Todas las áreas';
}

export const TIPOS_CAMBIO: TipoCambio[] = [
  { id: 'TC-01', nombre: 'Producto', reglas: 'Afecta ficha técnica y etiquetado; exige validación de calidad y rotulado.', requiereAprobacion: 'Calidad' },
  { id: 'TC-02', nombre: 'Materiales', reglas: 'Sustituye o cambia componentes; exige análisis de costo y disponibilidad.', requiereAprobacion: 'Compras' },
  { id: 'TC-03', nombre: 'Operaciones', reglas: 'Cambia ruta, centros o tiempos; exige validación de capacidad.', requiereAprobacion: 'Producción' },
  { id: 'TC-04', nombre: 'Documentación', reglas: 'Actualiza planos o especificaciones; no altera la estructura física.', requiereAprobacion: 'Calidad' },
  { id: 'TC-05', nombre: 'Mixto', reglas: 'Combina dos o más tipos; requiere aprobación de todas las áreas involucradas.', requiereAprobacion: 'Todas las áreas' },
];

/* ------------------------------ Etapas del cambio ------------------------------- */

export interface EtapaCambio {
  id: string;
  nombre: string;
  orden: number;
  responsable: string;
  criterioAvance: string;
}

export const ETAPAS_CAMBIO: EtapaCambio[] = [
  { id: 'EC-01', nombre: 'Borrador', orden: 1, responsable: 'Ingeniería', criterioAvance: 'Documento completo con motivo y alcance.' },
  { id: 'EC-02', nombre: 'Análisis de impacto', orden: 2, responsable: 'Ingeniería + Compras', criterioAvance: 'BOM, órdenes y productos afectados identificados.' },
  { id: 'EC-03', nombre: 'Aprobación', orden: 3, responsable: 'Dirección técnica', criterioAvance: 'Todas las aprobaciones requeridas registradas.' },
  { id: 'EC-04', nombre: 'Aplicación', orden: 4, responsable: 'Ingeniería', criterioAvance: 'Nueva versión de BOM creada y vigente.' },
  { id: 'EC-05', nombre: 'Cierre', orden: 5, responsable: 'Documentación', criterioAvance: 'Documentos actualizados y archivo histórico.' },
];

/* --------------------------- Órdenes de cambio (ECO) ---------------------------- */

export interface ECO {
  id: string;
  tipoId: string;
  productoId: string;
  bom: string;
  etapaId: string;
  responsable: string;
  prioridad: PrioridadCambio;
  motivo: string;
  alcance: string;
  fechaCreacion: string;
  fechaEfectividad: string | null;
  aprobada: boolean;
  versionResultante: string | null;
}

export const ECOS: ECO[] = [
  { id: 'ECO-2026-014', tipoId: 'TC-02', productoId: 'PR-01', bom: 'BOM-ARE-250', etapaId: 'EC-03', responsable: 'Valentina Ortiz', prioridad: 'Alta', motivo: 'Sustituir almendra importada por proveedor nacional certificado.', alcance: 'Componente ALM-01 y costo estándar.', fechaCreacion: '2026-10-20', fechaEfectividad: null, aprobada: false, versionResultante: null },
  { id: 'ECO-2026-013', tipoId: 'TC-03', productoId: 'PR-02', bom: 'BOM-PAN-500', etapaId: 'EC-04', responsable: 'Valentina Ortiz', prioridad: 'Media', motivo: 'Reducir tiempo de fermentación en 20 min.', alcance: 'Operación OP-20 y dependencias.', fechaCreacion: '2026-10-15', fechaEfectividad: '2026-11-01', aprobada: true, versionResultante: 'C' },
  { id: 'ECO-2026-012', tipoId: 'TC-01', productoId: 'PR-05', bom: 'BOM-YOG-150', etapaId: 'EC-05', responsable: 'Sofía Rendón', prioridad: 'Media', motivo: 'Actualizar declaración de alérgenos.', alcance: 'Etiquetado y ficha técnica.', fechaCreacion: '2026-10-08', fechaEfectividad: '2026-10-20', aprobada: true, versionResultante: 'B' },
  { id: 'ECO-2026-011', tipoId: 'TC-02', productoId: 'PR-04', bom: 'BOM-GRA-400', etapaId: 'EC-02', responsable: 'Sofía Rendón', prioridad: 'Baja', motivo: 'Cambiar empaque metalizado por laminado reciclable.', alcance: 'Componente EMP-04 y mermas.', fechaCreacion: '2026-10-27', fechaEfectividad: null, aprobada: false, versionResultante: null },
  { id: 'ECO-2026-010', tipoId: 'TC-04', productoId: 'PR-03', bom: 'BOM-CAF-500', etapaId: 'EC-01', responsable: 'Valentina Ortiz', prioridad: 'Baja', motivo: 'Actualizar plano de tolva de dosificación.', alcance: 'Documentación técnica.', fechaCreacion: '2026-10-28', fechaEfectividad: null, aprobada: false, versionResultante: null },
  { id: 'ECO-2026-009', tipoId: 'TC-05', productoId: 'PR-06', bom: 'BOM-GAL-300', etapaId: 'EC-03', responsable: 'Valentina Ortiz', prioridad: 'Alta', motivo: 'Ajuste de fórmula y empaque para lanzamiento.', alcance: 'Componentes, operaciones y rotulado.', fechaCreacion: '2026-10-25', fechaEfectividad: null, aprobada: false, versionResultante: null },
];

/* --------------------------------- Aprobaciones --------------------------------- */

export interface Aprobacion {
  id: string;
  ecoId: string;
  usuario: string;
  area: string;
  fecha: string;
  decision: DecisionAprobacion;
  comentario: string;
}

export const APROBACIONES: Aprobacion[] = [
  { id: 'AP-01', ecoId: 'ECO-2026-014', usuario: 'Carlos Uribe', area: 'Calidad', fecha: '2026-10-22', decision: 'Aprobada', comentario: 'Proveedor certificado BRC; validar lote inicial.' },
  { id: 'AP-02', ecoId: 'ECO-2026-014', usuario: 'Laura Giraldo', area: 'Compras', fecha: '2026-10-23', decision: 'Aprobada', comentario: 'Costo menor en 4 %; asegurar stock de transición.' },
  { id: 'AP-03', ecoId: 'ECO-2026-014', usuario: 'Jorge Herrera', area: 'Dirección técnica', fecha: '', decision: 'Pendiente', comentario: '' },
  { id: 'AP-04', ecoId: 'ECO-2026-013', usuario: 'Jorge Herrera', area: 'Dirección técnica', fecha: '2026-10-18', decision: 'Aprobada', comentario: 'Aprobado con monitoreo de calidad en fermentación.' },
  { id: 'AP-05', ecoId: 'ECO-2026-009', usuario: 'Carlos Uribe', area: 'Calidad', fecha: '2026-10-26', decision: 'Rechazada', comentario: 'Falta declaración de alérgenos en el rotulado nuevo.' },
  { id: 'AP-06', ecoId: 'ECO-2026-009', usuario: 'Laura Giraldo', area: 'Compras', fecha: '', decision: 'Pendiente', comentario: '' },
];

/* ------------------------------- Versiones de BOM ------------------------------- */

export interface ComponenteBOM {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  variante: string;
  esSubproducto: boolean;
  accion: AccionComponente;
}

export interface OperacionBOM {
  id: string;
  nombre: string;
  centro: string;
  tiempoHoras: number;
  dependencias: string;
  instrucciones: string;
  accion: AccionComponente;
}

export interface VersionBOM {
  id: string;
  productoId: string;
  version: string;
  ecoId: string | null;
  efectividadDesde: string;
  efectividadHasta: string | null;
  vigente: boolean;
  fechaCreacion: string;
  componentes: ComponenteBOM[];
  operaciones: OperacionBOM[];
}

export const VERSIONES_BOM: VersionBOM[] = [
  {
    id: 'VB-01', productoId: 'PR-01', version: 'B', ecoId: null, efectividadDesde: '2026-07-01', efectividadHasta: null, vigente: true, fechaCreacion: '2026-06-28',
    componentes: [
      { id: 'C1', nombre: 'Leche entera UHT', cantidad: 0.6, unidad: 'L', variante: 'Estándar', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C2', nombre: 'Azúcar refinada', cantidad: 0.25, unidad: 'kg', variante: 'Blanca', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C3', nombre: 'Almendra troceada', cantidad: 0.08, unidad: 'kg', variante: 'Nacional certificada', esSubproducto: false, accion: 'Modificar' },
      { id: 'C4', nombre: 'Envase vidrio 250 g', cantidad: 1, unidad: 'u', variante: 'Tapa dorada', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C5', nombre: 'Dulce de leche recuperado', cantidad: 0.02, unidad: 'kg', variante: 'Reproceso', esSubproducto: true, accion: 'Sin cambio' },
    ],
    operaciones: [
      { id: 'O1', nombre: 'Mezclado', centro: 'CC-MEZ', tiempoHoras: 0.5, dependencias: '—', instrucciones: 'Mezclar a 40 rpm hasta homogeneidad.', accion: 'Sin cambio' },
      { id: 'O2', nombre: 'Cocción', centro: 'CC-COC', tiempoHoras: 1.5, dependencias: 'Mezclado', instrucciones: 'Cocer hasta 112 °C.', accion: 'Sin cambio' },
      { id: 'O3', nombre: 'Envasado', centro: 'CC-ENV', tiempoHoras: 0.75, dependencias: 'Cocción', instrucciones: 'Envasar en caliente y sellar.', accion: 'Sin cambio' },
    ],
  },
  {
    id: 'VB-02', productoId: 'PR-01', version: 'A', ecoId: null, efectividadDesde: '2026-01-15', efectividadHasta: '2026-06-30', vigente: false, fechaCreacion: '2026-01-10',
    componentes: [
      { id: 'C1', nombre: 'Leche entera UHT', cantidad: 0.6, unidad: 'L', variante: 'Estándar', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C3', nombre: 'Almendra troceada', cantidad: 0.08, unidad: 'kg', variante: 'Importada', esSubproducto: false, accion: 'Modificar' },
    ],
    operaciones: [
      { id: 'O2', nombre: 'Cocción', centro: 'CC-COC', tiempoHoras: 1.6, dependencias: 'Mezclado', instrucciones: 'Cocer hasta 112 °C.', accion: 'Modificar' },
    ],
  },
  {
    id: 'VB-03', productoId: 'PR-02', version: 'C', ecoId: 'ECO-2026-013', efectividadDesde: '2026-11-01', efectividadHasta: null, vigente: true, fechaCreacion: '2026-10-19',
    componentes: [
      { id: 'C1', nombre: 'Harina integral', cantidad: 0.45, unidad: 'kg', variante: 'Molino propio', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C2', nombre: 'Levadura', cantidad: 0.008, unidad: 'kg', variante: 'Fresca', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C3', nombre: 'Mezcla de semillas', cantidad: 0.04, unidad: 'kg', variante: 'Girasol y linaza', esSubproducto: false, accion: 'Sin cambio' },
    ],
    operaciones: [
      { id: 'O1', nombre: 'Mezclado', centro: 'CC-MEZ', tiempoHoras: 0.3, dependencias: '—', instrucciones: 'Mezclar en espiral 8 min.', accion: 'Sin cambio' },
      { id: 'O2', nombre: 'Fermentación', centro: 'CC-FER', tiempoHoras: 0.75, dependencias: 'Mezclado', instrucciones: 'Reducción de 20 min validada con calidad.', accion: 'Modificar' },
      { id: 'O3', nombre: 'Horneado', centro: 'CC-HOR', tiempoHoras: 0.45, dependencias: 'Fermentación', instrucciones: 'Horno a 190 °C.', accion: 'Sin cambio' },
    ],
  },
  {
    id: 'VB-04', productoId: 'PR-02', version: 'B', ecoId: null, efectividadDesde: '2026-06-01', efectividadHasta: '2026-10-31', vigente: false, fechaCreacion: '2026-05-28',
    componentes: [
      { id: 'C1', nombre: 'Harina integral', cantidad: 0.45, unidad: 'kg', variante: 'Molino propio', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C2', nombre: 'Levadura', cantidad: 0.008, unidad: 'kg', variante: 'Fresca', esSubproducto: false, accion: 'Sin cambio' },
    ],
    operaciones: [
      { id: 'O2', nombre: 'Fermentación', centro: 'CC-FER', tiempoHoras: 1.1, dependencias: 'Mezclado', instrucciones: 'Fermentación estándar.', accion: 'Modificar' },
    ],
  },
  {
    id: 'VB-05', productoId: 'PR-05', version: 'B', ecoId: 'ECO-2026-012', efectividadDesde: '2026-10-20', efectividadHasta: null, vigente: true, fechaCreacion: '2026-10-18',
    componentes: [
      { id: 'C1', nombre: 'Leche fresca', cantidad: 0.12, unidad: 'L', variante: 'Pasteurizada', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C2', nombre: 'Cultivo láctico', cantidad: 0.002, unidad: 'kg', variante: 'YC-380', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C3', nombre: 'Pulpa de fresa', cantidad: 0.03, unidad: 'kg', variante: 'Natural', esSubproducto: false, accion: 'Sin cambio' },
    ],
    operaciones: [
      { id: 'O1', nombre: 'Pasteurización', centro: 'CC-PAS', tiempoHoras: 0.4, dependencias: '—', instrucciones: '85 °C por 30 s.', accion: 'Sin cambio' },
      { id: 'O2', nombre: 'Fermentación', centro: 'CC-FER', tiempoHoras: 4, dependencias: 'Pasteurización', instrucciones: 'Hasta pH 4,5.', accion: 'Sin cambio' },
    ],
  },
  {
    id: 'VB-06', productoId: 'PR-05', version: 'A', ecoId: null, efectividadDesde: '2026-04-01', efectividadHasta: '2026-10-19', vigente: false, fechaCreacion: '2026-03-25',
    componentes: [
      { id: 'C1', nombre: 'Leche fresca', cantidad: 0.12, unidad: 'L', variante: 'Pasteurizada', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C3', nombre: 'Pulpa de fresa', cantidad: 0.035, unidad: 'kg', variante: 'Natural', esSubproducto: false, accion: 'Modificar' },
    ],
    operaciones: [
      { id: 'O2', nombre: 'Fermentación', centro: 'CC-FER', tiempoHoras: 4, dependencias: 'Pasteurización', instrucciones: 'Hasta pH 4,5.', accion: 'Sin cambio' },
    ],
  },
  {
    id: 'VB-07', productoId: 'PR-03', version: 'A', ecoId: null, efectividadDesde: '2026-02-01', efectividadHasta: null, vigente: true, fechaCreacion: '2026-01-20',
    componentes: [
      { id: 'C1', nombre: 'Café verde', cantidad: 0.55, unidad: 'kg', variante: 'Origen Huila', esSubproducto: false, accion: 'Sin cambio' },
      { id: 'C2', nombre: 'Bolsa con válvula', cantidad: 1, unidad: 'u', variante: '500 g', esSubproducto: false, accion: 'Sin cambio' },
    ],
    operaciones: [
      { id: 'O1', nombre: 'Tostión', centro: 'CC-TOS', tiempoHoras: 0.35, dependencias: '—', instrucciones: 'Perfil medio a 210 °C.', accion: 'Sin cambio' },
      { id: 'O2', nombre: 'Molienda y envasado', centro: 'CC-ENV', tiempoHoras: 0.5, dependencias: 'Tostión', instrucciones: 'Molienda media; purga con nitrógeno.', accion: 'Sin cambio' },
    ],
  },
];

/* ----------------------------------- Revisiones --------------------------------- */

export interface Revision {
  id: string;
  versionId: string;
  fecha: string;
  responsable: string;
  cambios: string;
}

export const REVISIONES: Revision[] = [
  { id: 'RV-01', versionId: 'VB-01', fecha: '2026-06-28', responsable: 'Valentina Ortiz', cambios: 'Creación de versión B con ajuste de cantidad de almendra.' },
  { id: 'RV-02', versionId: 'VB-01', fecha: '2026-07-15', responsable: 'Sofía Rendón', cambios: 'Corrección de rendimiento de cocción.' },
  { id: 'RV-03', versionId: 'VB-03', fecha: '2026-10-19', responsable: 'Valentina Ortiz', cambios: 'Aplicación de ECO-2026-013: fermentación 20 min menos.' },
  { id: 'RV-04', versionId: 'VB-04', fecha: '2026-06-02', responsable: 'Sofía Rendón', cambios: 'Ajuste de mezcla de semillas en versión B.' },
  { id: 'RV-05', versionId: 'VB-05', fecha: '2026-10-18', responsable: 'Valentina Ortiz', cambios: 'Aplicación de ECO-2026-012: declaración de alérgenos.' },
  { id: 'RV-06', versionId: 'VB-07', fecha: '2026-03-10', responsable: 'Sofía Rendón', cambios: 'Cambio de bolsa con válvula por nuevo proveedor.' },
];

/* ------------------------------- Análisis de impacto ---------------------------- */

export interface ImpactoCambio {
  id: string;
  ecoId: string;
  tipo: 'BOM' | 'Orden de producción' | 'Producto' | 'Orden de compra';
  referencia: string;
  descripcion: string;
  nivel: 'Alto' | 'Medio' | 'Bajo';
  accion: string;
}

export const IMPACTOS: ImpactoCambio[] = [
  { id: 'IM-01', ecoId: 'ECO-2026-014', tipo: 'BOM', referencia: 'BOM-ARE-250', descripcion: 'Componente ALM-01 sustituido en versión B.', nivel: 'Alto', accion: 'Actualizar costo estándar' },
  { id: 'IM-02', ecoId: 'ECO-2026-014', tipo: 'Orden de producción', referencia: 'OF-1049', descripcion: 'Orden abierta consume la versión B actual.', nivel: 'Medio', accion: 'Replanificar a fecha de efectividad' },
  { id: 'IM-03', ecoId: 'ECO-2026-013', tipo: 'Orden de producción', referencia: 'OF-1044', descripcion: 'Orden abierta con operación OP-20 modificada.', nivel: 'Alto', accion: 'Reprogramar tiempos' },
  { id: 'IM-04', ecoId: 'ECO-2026-011', tipo: 'Producto', referencia: 'Granola miel 400 g', descripcion: 'Cambio de empaque afecta rotulado y merma.', nivel: 'Medio', accion: 'Validar etiquetado' },
  { id: 'IM-05', ecoId: 'ECO-2026-009', tipo: 'Orden de compra', referencia: 'OC-0455', descripcion: 'Compra abierta de envase anterior.', nivel: 'Bajo', accion: 'Negociar sustitución con proveedor' },
];

/* ----------------------------------- Documentos --------------------------------- */

export interface DocumentoPLM {
  id: string;
  nombre: string;
  tipo: 'Plano' | 'Especificación' | 'Certificado' | 'Evidencia';
  vinculado: string;
  version: string;
  acceso: 'Ingeniería' | 'Producción' | 'Público';
  fecha: string;
}

export const DOCUMENTOS_PLM: DocumentoPLM[] = [
  { id: 'DP-01', nombre: 'Plano dosificadora D-02', tipo: 'Plano', vinculado: 'ECO-2026-010', version: 'v3', acceso: 'Ingeniería', fecha: '2026-10-27' },
  { id: 'DP-02', nombre: 'Ficha técnica arequipe almendra', tipo: 'Especificación', vinculado: 'ECO-2026-014', version: 'v2', acceso: 'Público', fecha: '2026-10-21' },
  { id: 'DP-03', nombre: 'Certificado proveedor almendra nacional', tipo: 'Certificado', vinculado: 'ECO-2026-014', version: 'v1', acceso: 'Ingeniería', fecha: '2026-10-19' },
  { id: 'DP-04', nombre: 'Evidencia prueba fermentación 20 min', tipo: 'Evidencia', vinculado: 'ECO-2026-013', version: 'v1', acceso: 'Producción', fecha: '2026-10-16' },
  { id: 'DP-05', nombre: 'Declaración de alérgenos yogur fresa', tipo: 'Especificación', vinculado: 'ECO-2026-012', version: 'v4', acceso: 'Público', fecha: '2026-10-18' },
];

/* ------------------------------ Trazabilidad y auditoría ------------------------- */

export interface EventoPLM {
  id: string;
  ecoId: string;
  accion: 'Creó' | 'Revisó' | 'Aprobó' | 'Aplicó' | 'Rechazó';
  usuario: string;
  fecha: string;
  versionResultante: string | null;
}

export const EVENTOS_PLM: EventoPLM[] = [
  { id: 'EV-01', ecoId: 'ECO-2026-014', accion: 'Creó', usuario: 'Valentina Ortiz', fecha: '2026-10-20 09:15', versionResultante: null },
  { id: 'EV-02', ecoId: 'ECO-2026-014', accion: 'Revisó', usuario: 'Sofía Rendón', fecha: '2026-10-20 14:02', versionResultante: null },
  { id: 'EV-03', ecoId: 'ECO-2026-014', accion: 'Aprobó', usuario: 'Carlos Uribe', fecha: '2026-10-22 10:30', versionResultante: null },
  { id: 'EV-04', ecoId: 'ECO-2026-013', accion: 'Creó', usuario: 'Valentina Ortiz', fecha: '2026-10-15 08:40', versionResultante: null },
  { id: 'EV-05', ecoId: 'ECO-2026-013', accion: 'Aprobó', usuario: 'Jorge Herrera', fecha: '2026-10-18 16:12', versionResultante: null },
  { id: 'EV-06', ecoId: 'ECO-2026-013', accion: 'Aplicó', usuario: 'Valentina Ortiz', fecha: '2026-10-19 11:05', versionResultante: 'C' },
];

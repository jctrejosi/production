// Datos de demostración del módulo Calidad (CAL).
// Entidades: puntos de control, tipos de control, criterios de aceptación,
// controles/inspecciones, no conformidades (alertas), etapas de alerta,
// equipos de calidad, acciones correctivas, hojas de trabajo, documentos
// e integraciones.

export type ModoControl = 'Instrucciones' | 'Aprobado/Rechazado' | 'Medición numérica' | 'Formulario';
export type ResultadoControl = 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Fuera de tolerancia';
export type PrioridadAlerta = 'Alta' | 'Media' | 'Baja';
export type EstadoAlerta = 'En análisis' | 'En verificación' | 'Cerrada';

/* ------------------------------ Tipos de control ------------------------------ */

export interface TipoControl {
  id: string;
  nombre: string;
  modo: ModoControl;
  descripcion: string;
  activo: boolean;
}

export const TIPOS_CONTROL: TipoControl[] = [
  { id: 'TC-01', nombre: 'Verificación de instrucciones', modo: 'Instrucciones', descripcion: 'El inspector confirma que se siguieron las instrucciones de trabajo.', activo: true },
  { id: 'TC-02', nombre: 'Aprobado / Rechazado', modo: 'Aprobado/Rechazado', descripcion: 'Decisión binaria de conformidad, sin medición.', activo: true },
  { id: 'TC-03', nombre: 'Medición numérica', modo: 'Medición numérica', descripcion: 'Registra una medida y la compara contra el criterio de aceptación.', activo: true },
  { id: 'TC-04', nombre: 'Hoja de trabajo', modo: 'Formulario', descripcion: 'Formulario con secciones, campos, firmas, fotos y adjuntos.', activo: true },
];

/* ------------------------------ Puntos de control ----------------------------- */

export interface PuntoControl {
  id: string;
  nombre: string;
  producto: string;
  operacion: string;
  tipoId: string;
  frecuencia: string;
  equipoId: string;
  instruccion: string;
  obligatorio: boolean;
  activo: boolean;
}

export const PUNTOS_CONTROL: PuntoControl[] = [
  { id: 'PC-01', nombre: 'Temperatura de cuarto frío', producto: 'Yogur griego fresa 150 g', operacion: 'Recepción', tipoId: 'TC-03', frecuencia: 'Cada recepción', equipoId: 'EQ-01', instruccion: 'Verificar 2–4 °C con termómetro calibrado y registrar.', obligatorio: true, activo: true },
  { id: 'PC-02', nombre: 'Hermeticidad del sello', producto: 'Arequipe almendra 250 g', operacion: 'Envasado', tipoId: 'TC-02', frecuencia: 'Primera pieza + 1 por hora', equipoId: 'EQ-01', instruccion: 'Comprimir envase 5 s y verificar que no pierda vacío.', obligatorio: true, activo: true },
  { id: 'PC-03', nombre: 'Peso neto', producto: 'Café molido 500 g', operacion: 'Envasado', tipoId: 'TC-03', frecuencia: '1 de cada 30 unidades', equipoId: 'EQ-02', instruccion: 'Pesar en balanza verificada y registrar valor en g.', obligatorio: true, activo: true },
  { id: 'PC-04', nombre: 'Etiquetado y lote', producto: 'Pan tajado integral 500 g', operacion: 'Empaque', tipoId: 'TC-01', frecuencia: 'Cada lote', equipoId: 'EQ-02', instruccion: 'Confirmar fecha de vencimiento, lote y rotulado nutricional.', obligatorio: true, activo: true },
  { id: 'PC-05', nombre: 'Humedad de granola', producto: 'Granola miel 400 g', operacion: 'Horneado', tipoId: 'TC-03', frecuencia: '1 por lote', equipoId: 'EQ-01', instruccion: 'Medir humedad; máximo 6 %.', obligatorio: true, activo: true },
  { id: 'PC-06', nombre: 'Integridad de caja máster', producto: 'Aceite girasol 1 L', operacion: 'Entrega', tipoId: 'TC-01', frecuencia: 'Cada despacho', equipoId: 'EQ-02', instruccion: 'Verificar empaque, cantidad y documentación del despacho.', obligatorio: false, activo: true },
];

/* --------------------------- Criterios de aceptación --------------------------- */

export interface CriterioAceptacion {
  id: string;
  puntoControlId: string;
  nombre: string;
  minimo: number | null;
  maximo: number | null;
  tolerancia: number | null;
  unidad: string;
  valorPredefinido: string | null;
  version: string;
  aprobado: boolean;
}

export const CRITERIOS: CriterioAceptacion[] = [
  { id: 'CA-01', puntoControlId: 'PC-01', nombre: 'Rango de temperatura', minimo: 2, maximo: 4, tolerancia: 0.5, unidad: '°C', valorPredefinido: null, version: 'v2', aprobado: true },
  { id: 'CA-02', puntoControlId: 'PC-03', nombre: 'Peso neto mínimo', minimo: 500, maximo: null, tolerancia: null, unidad: 'g', valorPredefinido: '500', version: 'v1', aprobado: true },
  { id: 'CA-03', puntoControlId: 'PC-05', nombre: 'Humedad máxima', minimo: null, maximo: 6, tolerancia: null, unidad: '%', valorPredefinido: null, version: 'v1', aprobado: true },
  { id: 'CA-04', puntoControlId: 'PC-03', nombre: 'Peso neto máximo', minimo: null, maximo: 510, tolerancia: 2, unidad: 'g', valorPredefinido: null, version: 'v2', aprobado: false },
  { id: 'CA-05', puntoControlId: 'PC-02', nombre: 'Hermeticidad (binario)', minimo: null, maximo: null, tolerancia: null, unidad: '', valorPredefinido: 'Sin fugas', version: 'v1', aprobado: true },
];

/* ------------------------------ Controles (inspecciones) ----------------------- */

export interface Control {
  id: string;
  tipo: 'Recepción' | 'Producción' | 'Entrega' | 'Transferencia';
  puntoControlId: string;
  producto: string;
  lote: string;
  orden: string;
  operacion: string;
  cantidad: number;
  resultado: ResultadoControl;
  responsable: string;
  fecha: string;
  evidencia: string;
  bloqueado: boolean;
}

export const CONTROLES: Control[] = [
  { id: 'CT-101', tipo: 'Recepción', puntoControlId: 'PC-01', producto: 'Yogur griego fresa 150 g', lote: 'L-2026-118', orden: 'OC-0451', operacion: 'Recepción', cantidad: 240, resultado: 'Aprobado', responsable: 'Andrea Salas', fecha: '2026-10-27', evidencia: 'Termógrafo TG-001.pdf', bloqueado: false },
  { id: 'CT-102', tipo: 'Recepción', puntoControlId: 'PC-03', producto: 'Café molido 500 g', lote: 'L-2026-119', orden: 'OC-0452', operacion: 'Recepción', cantidad: 600, resultado: 'Fuera de tolerancia', responsable: 'Andrea Salas', fecha: '2026-10-27', evidencia: 'Balanza B-12.jpg', bloqueado: true },
  { id: 'CT-103', tipo: 'Producción', puntoControlId: 'PC-02', producto: 'Arequipe almendra 250 g', lote: 'L-2026-115', orden: 'OF-1042', operacion: 'Envasado', cantidad: 1200, resultado: 'Aprobado', responsable: 'Mario Vega', fecha: '2026-10-26', evidencia: 'Prueba sello S-04.jpg', bloqueado: false },
  { id: 'CT-104', tipo: 'Producción', puntoControlId: 'PC-05', producto: 'Granola miel 400 g', lote: 'L-2026-116', orden: 'OF-1043', operacion: 'Horneado', cantidad: 800, resultado: 'Pendiente', responsable: 'Mario Vega', fecha: '2026-10-28', evidencia: '', bloqueado: true },
  { id: 'CT-105', tipo: 'Entrega', puntoControlId: 'PC-06', producto: 'Aceite girasol 1 L', lote: 'L-2026-114', orden: 'PE-2201', operacion: 'Despacho', cantidad: 360, resultado: 'Pendiente', responsable: 'Luisa Rojas', fecha: '2026-10-28', evidencia: '', bloqueado: false },
  { id: 'CT-106', tipo: 'Producción', puntoControlId: 'PC-04', producto: 'Pan tajado integral 500 g', lote: 'L-2026-117', orden: 'OF-1044', operacion: 'Empaque', cantidad: 1500, resultado: 'Rechazado', responsable: 'Mario Vega', fecha: '2026-10-27', evidencia: 'Etiqueta E-09.jpg', bloqueado: true },
];

/* ------------------------------ No conformidades (alertas) ---------------------- */

export interface NoConformidad {
  id: string;
  producto: string;
  lote: string;
  cantidad: number;
  origen: string;
  prioridad: PrioridadAlerta;
  causa: string;
  accion: string;
  etapa: string;
  responsable: string;
  fecha: string;
  estado: EstadoAlerta;
}

export const NO_CONFORMIDADES: NoConformidad[] = [
  { id: 'NC-01', producto: 'Café molido 500 g', lote: 'L-2026-119', cantidad: 600, origen: 'Recepción', prioridad: 'Alta', causa: 'Peso neto inferior al criterio por deriva de dosificadora.', accion: 'Ajuste de dosificadora y re-inspección 100 %.', etapa: 'Verificación de eficacia', responsable: 'Carlos Uribe', fecha: '2026-10-27', estado: 'En verificación' },
  { id: 'NC-02', producto: 'Pan tajado integral 500 g', lote: 'L-2026-117', cantidad: 1500, origen: 'Producción', prioridad: 'Alta', causa: 'Fecha de vencimiento ilegible en 3 % de etiquetas.', accion: 'Reimpresión de etiquetas y control de impresora.', etapa: 'Análisis de causa', responsable: 'Diana Mejía', fecha: '2026-10-27', estado: 'En análisis' },
  { id: 'NC-03', producto: 'Yogur griego fresa 150 g', lote: 'L-2026-113', cantidad: 120, origen: 'Almacén', prioridad: 'Media', causa: 'Caja máster con abolladura en esquina.', accion: 'Inspección visual y reempaque.', etapa: 'Cierre', responsable: 'Luisa Rojas', fecha: '2026-10-25', estado: 'Cerrada' },
  { id: 'NC-04', producto: 'Granola miel 400 g', lote: 'L-2026-116', cantidad: 800, origen: 'Producción', prioridad: 'Media', causa: 'Humedad de 6,8 % (criterio: máx. 6 %).', accion: 'Extender horneado 4 min y volver a medir.', etapa: 'Análisis de causa', responsable: 'Carlos Uribe', fecha: '2026-10-28', estado: 'En análisis' },
  { id: 'NC-05', producto: 'Aceite girasol 1 L', lote: 'L-2026-110', cantidad: 90, origen: 'Cliente', prioridad: 'Baja', causa: 'Etiqueta despegada en clima húmedo.', accion: 'Cambio de adhesivo con proveedor.', etapa: 'Cierre', responsable: 'Diana Mejía', fecha: '2026-10-22', estado: 'Cerrada' },
];

/* ------------------------------- Etapas de alerta ------------------------------ */

export interface EtapaAlerta {
  id: string;
  alertaId: string;
  nombre: string;
  responsable: string;
  transicion: string;
  fecha: string | null;
  estado: 'Completada' | 'En curso' | 'Pendiente';
}

export const ETAPAS_ALERTA: EtapaAlerta[] = [
  { id: 'EA-01', alertaId: 'NC-01', nombre: 'Detección', responsable: 'Andrea Salas', transicion: 'Registrar NC con evidencia', fecha: '2026-10-27', estado: 'Completada' },
  { id: 'EA-02', alertaId: 'NC-01', nombre: 'Análisis de causa', responsable: 'Carlos Uribe', transicion: 'Causa raíz documentada', fecha: '2026-10-27', estado: 'Completada' },
  { id: 'EA-03', alertaId: 'NC-01', nombre: 'Corrección', responsable: 'Equipo de mantenimiento', transicion: 'Dosificadora recalibrada', fecha: '2026-10-28', estado: 'Completada' },
  { id: 'EA-04', alertaId: 'NC-01', nombre: 'Verificación de eficacia', responsable: 'Carlos Uribe', transicion: 'Re-inspección 100 % aprobada', fecha: null, estado: 'En curso' },
  { id: 'EA-05', alertaId: 'NC-01', nombre: 'Cierre', responsable: 'Diana Mejía', transicion: 'Cierre formal de la alerta', fecha: null, estado: 'Pendiente' },
  { id: 'EA-06', alertaId: 'NC-02', nombre: 'Detección', responsable: 'Mario Vega', transicion: 'Registrar NC con evidencia', fecha: '2026-10-27', estado: 'Completada' },
  { id: 'EA-07', alertaId: 'NC-02', nombre: 'Análisis de causa', responsable: 'Diana Mejía', transicion: 'Causa raíz documentada', fecha: '2026-10-28', estado: 'En curso' },
  { id: 'EA-08', alertaId: 'NC-02', nombre: 'Corrección', responsable: 'Diana Mejía', transicion: 'Etiquetas reimpresas', fecha: null, estado: 'Pendiente' },
];

/* ------------------------------- Equipos de calidad ---------------------------- */

export interface EquipoCalidad {
  id: string;
  nombre: string;
  responsable: string;
  miembros: string[];
  puntos: string[];
  alertas: string[];
}

export const EQUIPOS_CALIDAD: EquipoCalidad[] = [
  { id: 'EQ-01', nombre: 'Calidad de producto', responsable: 'Carlos Uribe', miembros: ['Andrea Salas', 'Mario Vega'], puntos: ['PC-01', 'PC-02', 'PC-05'], alertas: ['NC-01', 'NC-04'] },
  { id: 'EQ-02', nombre: 'Calidad de empaque', responsable: 'Diana Mejía', miembros: ['Luisa Rojas'], puntos: ['PC-03', 'PC-04', 'PC-06'], alertas: ['NC-02', 'NC-05'] },
  { id: 'EQ-03', nombre: 'Calidad de recepción', responsable: 'Andrea Salas', miembros: ['Luisa Rojas', 'Carlos Uribe'], puntos: ['PC-01', 'PC-06'], alertas: ['NC-03'] },
];

/* ------------------------------ Causa raíz y acciones -------------------------- */

export interface AccionCorrectiva {
  id: string;
  alertaId: string;
  causaRaiz: string;
  accionInmediata: string;
  accionCorrectiva: string;
  accionPreventiva: string;
  verificacion: string | null;
  estado: 'Sin verificar' | 'Verificada' | 'Ineficaz';
}

export const ACCIONES: AccionCorrectiva[] = [
  { id: 'AC-01', alertaId: 'NC-01', causaRaiz: 'Deriva del cabezal dosificador por falta de calibración trimestral.', accionInmediata: 'Bloquear lote y re-inspeccionar 100 %.', accionCorrectiva: 'Calibrar dosificadora y ajustar plan de calibración.', accionPreventiva: 'Control de peso cada 15 min en el turno.', verificacion: 'Pendiente de re-inspección', estado: 'Sin verificar' },
  { id: 'AC-02', alertaId: 'NC-02', causaRaiz: 'Cabezal térmico de impresora desgastado.', accionInmediata: 'Reimpresión de etiquetas del lote.', accionCorrectiva: 'Cambio de cabezal y mantenimiento preventivo mensual.', accionPreventiva: 'Verificación de legibilidad por lote.', verificacion: null, estado: 'Sin verificar' },
  { id: 'AC-03', alertaId: 'NC-03', causaRaiz: 'Manipulación inadecuada en almacén.', accionInmediata: 'Reempaque de unidades dañadas.', accionCorrectiva: 'Capacitación de manipulación de cajas.', accionPreventiva: 'Lista de verificación de apilado.', verificacion: 'Sin repetición en 30 días', estado: 'Verificada' },
  { id: 'AC-04', alertaId: 'NC-04', causaRaiz: 'Horno con zona fría por sensor descalibrado.', accionInmediata: 'Extender tiempo de horneado.', accionCorrectiva: 'Calibrar sensor y revisar convección.', accionPreventiva: 'Medición de humedad por lote.', verificacion: null, estado: 'Sin verificar' },
  { id: 'AC-05', alertaId: 'NC-05', causaRaiz: 'Adhesivo no apto para humedad alta.', accionInmediata: 'Retiro del lote en cliente.', accionCorrectiva: 'Cambio de adhesivo con proveedor.', accionPreventiva: 'Prueba de adherencia en cámara húmeda.', verificacion: 'Prueba superada en laboratorio', estado: 'Verificada' },
];

/* -------------------------------- Hojas de trabajo ----------------------------- */

export interface HojaTrabajo {
  id: string;
  nombre: string;
  puntoControlId: string;
  secciones: string[];
  campos: string[];
  requiereFirma: boolean;
  requiereFoto: boolean;
}

export const HOJAS_TRABAJO: HojaTrabajo[] = [
  { id: 'HT-01', nombre: 'Checklist recepción refrigerados', puntoControlId: 'PC-01', secciones: ['Identificación', 'Temperatura', 'Condición del empaque'], campos: ['Termómetro usado', 'Temperatura °C', 'Observaciones'], requiereFirma: true, requiereFoto: true },
  { id: 'HT-02', nombre: 'Primera pieza de envasado', puntoControlId: 'PC-02', secciones: ['Parámetros de máquina', 'Prueba de sello', 'Aprobación'], campos: ['Velocidad', 'Temperatura de sellado', 'Resultado'], requiereFirma: true, requiereFoto: true },
  { id: 'HT-03', nombre: 'Auditoría de despacho', puntoControlId: 'PC-06', secciones: ['Documentación', 'Cantidad', 'Empaque'], campos: ['Guía', 'Cantidad verificada', 'Firma transportador'], requiereFirma: true, requiereFoto: false },
  { id: 'HT-04', nombre: 'Verificación de etiquetado', puntoControlId: 'PC-04', secciones: ['Rotulado', 'Lote', 'Vencimiento'], campos: ['Revisión de arte', 'Fecha de vencimiento', 'Firma revisor'], requiereFirma: true, requiereFoto: true },
];

/* ---------------------------------- Documentos --------------------------------- */

export interface DocumentoCalidad {
  id: string;
  nombre: string;
  tipo: 'Especificación' | 'Plano' | 'Certificado' | 'Evidencia';
  vinculadoA: string;
  vinculoId: string;
  version: string;
  fecha: string;
  acceso: 'Público' | 'Equipo calidad' | 'Restringido';
}

export const DOCUMENTOS_CALIDAD: DocumentoCalidad[] = [
  { id: 'DOC-01', nombre: 'Ficha técnica yogur fresa', tipo: 'Especificación', vinculadoA: 'Producto', vinculoId: 'Yogur griego fresa 150 g', version: 'v3', fecha: '2026-09-15', acceso: 'Público' },
  { id: 'DOC-02', nombre: 'Certificado de calibración balanza B-12', tipo: 'Certificado', vinculadoA: 'Control', vinculoId: 'CT-102', version: 'v1', fecha: '2026-10-01', acceso: 'Equipo calidad' },
  { id: 'DOC-03', nombre: 'Plano dosificadora D-02', tipo: 'Plano', vinculadoA: 'Alerta', vinculoId: 'NC-01', version: 'v2', fecha: '2026-08-20', acceso: 'Restringido' },
  { id: 'DOC-04', nombre: 'Termógrafo TG-001', tipo: 'Evidencia', vinculadoA: 'Control', vinculoId: 'CT-101', version: 'v1', fecha: '2026-10-27', acceso: 'Equipo calidad' },
  { id: 'DOC-05', nombre: 'Certificado proveedor café verde', tipo: 'Certificado', vinculadoA: 'Lote', vinculoId: 'L-2026-119', version: 'v1', fecha: '2026-10-25', acceso: 'Equipo calidad' },
];

/* --------------------------------- Integraciones ------------------------------- */

export interface IntegracionCalidad {
  sistema: string;
  alcance: string;
  estado: 'Conectado' | 'Degradado' | 'No configurado';
  ultimaSincro: string;
}

export const INTEGRACIONES_CALIDAD: IntegracionCalidad[] = [
  { sistema: 'Inventario', alcance: 'Recepción y cuarentena automática', estado: 'Conectado', ultimaSincro: '2026-10-28 08:12' },
  { sistema: 'Producción', alcance: 'Operaciones y producto terminado', estado: 'Conectado', ultimaSincro: '2026-10-28 07:55' },
  { sistema: 'Mantenimiento', alcance: 'Equipos y fallas', estado: 'Degradado', ultimaSincro: '2026-10-27 18:30' },
  { sistema: 'Trazabilidad', alcance: 'Lote, serie y documento', estado: 'Conectado', ultimaSincro: '2026-10-28 08:12' },
  { sistema: 'Documentos', alcance: 'Especificaciones y certificados', estado: 'Conectado', ultimaSincro: '2026-10-28 08:00' },
];

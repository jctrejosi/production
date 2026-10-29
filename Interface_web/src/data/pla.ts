// Datos de demostración del módulo PLA — Planificación avanzada.
// Tipos locales a este módulo; no editar archivos compartidos.

/* ---------------------- Plan maestro MPS (PLA-01) ------------------------ */

export interface PeriodoMPS {
  id: string;
  semana: string;
  inicio: string;
  fin: string;
  estado: 'Abierto' | 'Congelado' | 'Cerrado';
}

export const PERIODOS_MPS: PeriodoMPS[] = [
  { id: 'S-44', semana: 'Semana 44', inicio: '2026-10-26', fin: '2026-11-01', estado: 'Abierto' },
  { id: 'S-45', semana: 'Semana 45', inicio: '2026-11-02', fin: '2026-11-08', estado: 'Abierto' },
  { id: 'S-46', semana: 'Semana 46', inicio: '2026-11-09', fin: '2026-11-15', estado: 'Congelado' },
  { id: 'S-43', semana: 'Semana 43', inicio: '2026-10-19', fin: '2026-10-25', estado: 'Cerrado' },
  { id: 'S-42', semana: 'Semana 42', inicio: '2026-10-12', fin: '2026-10-18', estado: 'Cerrado' },
];

export interface ItemMPS {
  producto: string;
  familia: string;
  periodo: string;
  prevision: number;
  pedidos: number;
  stockObjetivo: number;
  plan: number;
  aprobado: boolean;
}

export const ITEMS_MPS: ItemMPS[] = [
  { producto: 'Arepa de maíz x12', familia: 'Arepas', periodo: 'S-44', prevision: 3200, pedidos: 2800, stockObjetivo: 900, plan: 3400, aprobado: true },
  { producto: 'Arepa de maíz x12', familia: 'Arepas', periodo: 'S-45', prevision: 3300, pedidos: 1500, stockObjetivo: 900, plan: 3200, aprobado: true },
  { producto: 'Queso campesino 500 g', familia: 'Lácteos', periodo: 'S-44', prevision: 1200, pedidos: 1050, stockObjetivo: 400, plan: 1100, aprobado: true },
  { producto: 'Queso campesino 500 g', familia: 'Lácteos', periodo: 'S-45', prevision: 1250, pedidos: 400, stockObjetivo: 400, plan: 1150, aprobado: false },
  { producto: 'Panela redonda 400 g', familia: 'Endulzantes', periodo: 'S-44', prevision: 800, pedidos: 720, stockObjetivo: 250, plan: 750, aprobado: true },
  { producto: 'Café molido 250 g', familia: 'Café', periodo: 'S-44', prevision: 1500, pedidos: 1340, stockObjetivo: 500, plan: 1450, aprobado: true },
  { producto: 'Yogurt griego 170 g', familia: 'Lácteos', periodo: 'S-45', prevision: 900, pedidos: 620, stockObjetivo: 300, plan: 850, aprobado: false },
  { producto: 'Chocolate de mesa 250 g', familia: 'Chocolates', periodo: 'S-46', prevision: 1100, pedidos: 980, stockObjetivo: 350, plan: 1050, aprobado: true },
];

/* -------------------- Necesidades MRP (PLA-02) ---------------------------- */

export interface NecesidadMRP {
  id: string;
  material: string;
  cantidad: number;
  unidad: string;
  fecha: string;
  origen: string;
  disponible: number;
  recepciones: number;
  sugerido: number;
  estado: 'Cubierto' | 'Faltante';
}

export const NECESIDADES_MRP: NecesidadMRP[] = [
  { id: 'MRP-001', material: 'Harina de maíz precocida', cantidad: 1680, unidad: 'kg', fecha: '2026-10-29', origen: 'OF-3210 (Arepas S-44)', disponible: 540, recepciones: 800, sugerido: 340, estado: 'Faltante' },
  { id: 'MRP-002', material: 'Queso rallado', cantidad: 220, unidad: 'kg', fecha: '2026-10-30', origen: 'OF-3211 (Arepas S-44)', disponible: 260, recepciones: 0, sugerido: 0, estado: 'Cubierto' },
  { id: 'MRP-003', material: 'Leche entera pasteurizada', cantidad: 3600, unidad: 'L', fecha: '2026-10-29', origen: 'OF-3212 (Queso S-44)', disponible: 4100, recepciones: 0, sugerido: 0, estado: 'Cubierto' },
  { id: 'MRP-004', material: 'Cuajo líquido', cantidad: 18, unidad: 'L', fecha: '2026-10-30', origen: 'OF-3212 (Queso S-44)', disponible: 6, recepciones: 12, sugerido: 0, estado: 'Cubierto' },
  { id: 'MRP-005', material: 'Bolsas trilaminadas 250 g', cantidad: 32000, unidad: 'un', fecha: '2026-11-02', origen: 'OF-3214 (Café S-44)', disponible: 14000, recepciones: 20000, sugerido: 0, estado: 'Cubierto' },
  { id: 'MRP-006', material: 'Café tostado en grano', cantidad: 900, unidad: 'kg', fecha: '2026-11-02', origen: 'OF-3214 (Café S-44)', disponible: 320, recepciones: 0, sugerido: 580, estado: 'Faltante' },
  { id: 'MRP-007', material: 'Etiquetas autoadhesivas', cantidad: 24000, unidad: 'un', fecha: '2026-11-04', origen: 'OF-3215 (Yogurt S-45)', disponible: 30000, recepciones: 0, sugerido: 0, estado: 'Cubierto' },
  { id: 'MRP-008', material: 'Envases plásticos 170 g', cantidad: 18000, unidad: 'un', fecha: '2026-11-04', origen: 'OF-3215 (Yogurt S-45)', disponible: 9000, recepciones: 0, sugerido: 9000, estado: 'Faltante' },
];

/* ------------------- Capacidad finita (PLA-04/PLA-08) --------------------- */

export interface CentroTrabajoPLA {
  id: string;
  nombre: string;
  maquinas: number;
  capacidadH: number;
  cargaH: number;
  eficiencia: number;
  turnos: number;
}

export const CENTROS_PLA: CentroTrabajoPLA[] = [
  { id: 'CT-MEZ', nombre: 'Mezclado', maquinas: 2, capacidadH: 240, cargaH: 208, eficiencia: 0.87, turnos: 2 },
  { id: 'CT-HOR', nombre: 'Horneado', maquinas: 3, capacidadH: 360, cargaH: 342, eficiencia: 0.95, turnos: 3 },
  { id: 'CT-EMP', nombre: 'Empaque', maquinas: 4, capacidadH: 480, cargaH: 458, eficiencia: 0.82, turnos: 3 },
  { id: 'CT-REF', nombre: 'Refrigeración', maquinas: 2, capacidadH: 240, cargaH: 251, eficiencia: 0.78, turnos: 2 },
  { id: 'CT-DES', nombre: 'Despacho', maquinas: 1, capacidadH: 120, cargaH: 96, eficiencia: 0.9, turnos: 1 },
];

export interface CargaCapacidad {
  id: string;
  centro: string;
  periodo: string;
  capacidad: number;
  carga: number;
}

export const CARGAS_CAPACIDAD: CargaCapacidad[] = [
  { id: 'CC-01', centro: 'CT-MEZ', periodo: 'S-44', capacidad: 240, carga: 208 },
  { id: 'CC-02', centro: 'CT-MEZ', periodo: 'S-45', capacidad: 240, carga: 226 },
  { id: 'CC-03', centro: 'CT-HOR', periodo: 'S-44', capacidad: 360, carga: 342 },
  { id: 'CC-04', centro: 'CT-HOR', periodo: 'S-45', capacidad: 360, carga: 318 },
  { id: 'CC-05', centro: 'CT-EMP', periodo: 'S-44', capacidad: 480, carga: 458 },
  { id: 'CC-06', centro: 'CT-EMP', periodo: 'S-45', capacidad: 480, carga: 402 },
  { id: 'CC-07', centro: 'CT-REF', periodo: 'S-44', capacidad: 240, carga: 251 },
  { id: 'CC-08', centro: 'CT-DES', periodo: 'S-44', capacidad: 120, carga: 96 },
];

/* ------------------- Secuenciación (PLA-05) ------------------------------- */

export interface SecuenciaPLA {
  id: string;
  orden: string;
  producto: string;
  operacion: string;
  maquina: string;
  inicio: string;
  fin: string;
  prioridad: number;
  bloqueada: boolean;
}

export const SECUENCIAS: SecuenciaPLA[] = [
  { id: 'SEQ-01', orden: 'OF-3210', producto: 'Arepa de maíz x12', operacion: 'Mezclado', maquina: 'MEZ-01', inicio: '2026-10-28 06:00', fin: '2026-10-28 09:20', prioridad: 1, bloqueada: true },
  { id: 'SEQ-02', orden: 'OF-3212', producto: 'Queso campesino 500 g', operacion: 'Pasteurizado', maquina: 'PAS-01', inicio: '2026-10-28 06:30', fin: '2026-10-28 10:00', prioridad: 2, bloqueada: false },
  { id: 'SEQ-03', orden: 'OF-3211', producto: 'Arepa de maíz x12', operacion: 'Horneado', maquina: 'HOR-02', inicio: '2026-10-28 09:40', fin: '2026-10-28 13:00', prioridad: 3, bloqueada: false },
  { id: 'SEQ-04', orden: 'OF-3214', producto: 'Café molido 250 g', operacion: 'Molido', maquina: 'MOL-01', inicio: '2026-10-28 10:20', fin: '2026-10-28 12:10', prioridad: 4, bloqueada: false },
  { id: 'SEQ-05', orden: 'OF-3215', producto: 'Yogurt griego 170 g', operacion: 'Envasado', maquina: 'ENV-02', inicio: '2026-10-28 13:10', fin: '2026-10-28 16:30', prioridad: 5, bloqueada: false },
  { id: 'SEQ-06', orden: 'OF-3213', producto: 'Panela redonda 400 g', operacion: 'Empaque', maquina: 'EMP-01', inicio: '2026-10-28 14:00', fin: '2026-10-28 15:40', prioridad: 6, bloqueada: false },
];

/* ------------------- Escenarios (PLA-06) ---------------------------------- */

export interface EscenarioPLA {
  id: string;
  nombre: string;
  supuestos: string;
  entrega: number;
  utilizacion: number;
  costo: number;
  estado: 'Vigente' | 'Simulado' | 'Descartado';
}

export const ESCENARIOS: EscenarioPLA[] = [
  { id: 'ESC-01', nombre: 'Escenario base S-44', supuestos: 'Demanda prevista · 3 turnos en CT-HOR', entrega: 0.92, utilizacion: 0.86, costo: 48200000, estado: 'Vigente' },
  { id: 'ESC-02', nombre: 'Turno extra empaque', supuestos: '+1 turno en CT-EMP · demanda +10 %', entrega: 0.97, utilizacion: 0.91, costo: 52100000, estado: 'Simulado' },
  { id: 'ESC-03', nombre: 'Retraso café 2 días', supuestos: 'Café en grano llega el 2026-11-04', entrega: 0.81, utilizacion: 0.79, costo: 47100000, estado: 'Simulado' },
  { id: 'ESC-04', nombre: 'Cierre ventas altas', supuestos: 'Pedidos confirmados +25 %', entrega: 0.88, utilizacion: 0.98, costo: 55600000, estado: 'Descartado' },
];

/* ------------------- Excepciones (PLA-10) --------------------------------- */

export interface ExcepcionPLA {
  id: string;
  tipo: 'Sobrecarga' | 'Faltante' | 'Retraso' | 'Recurso' | 'Prioridad';
  descripcion: string;
  responsable: string;
  fecha: string;
  estado: 'Abierta' | 'En gestión' | 'Resuelta';
}

export const EXCEPCIONES_PLA: ExcepcionPLA[] = [
  { id: 'EXC-P01', tipo: 'Sobrecarga', descripcion: 'CT-REF supera su capacidad en 11 h (semana 44)', responsable: 'Juliana Ospina', fecha: '2026-10-28', estado: 'Abierta' },
  { id: 'EXC-P02', tipo: 'Faltante', descripcion: 'Harina de maíz precocida: faltan 340 kg para OF-3210', responsable: 'Compras · Andrés Ríos', fecha: '2026-10-28', estado: 'En gestión' },
  { id: 'EXC-P03', tipo: 'Retraso', descripcion: 'OF-3214 (Café) retrasada 2 días por material', responsable: 'Planificación', fecha: '2026-10-27', estado: 'Abierta' },
  { id: 'EXC-P04', tipo: 'Recurso', descripcion: 'MEZ-03 con mantenimiento preventivo el 29/10', responsable: 'Mantenimiento · Camilo Duarte', fecha: '2026-10-27', estado: 'En gestión' },
  { id: 'EXC-P05', tipo: 'Prioridad', descripcion: 'Pedido VIP Mercaldas La 65 compite con OF-3213', responsable: 'Ventas · Laura Giraldo', fecha: '2026-10-26', estado: 'Resuelta' },
  { id: 'EXC-P06', tipo: 'Faltante', descripcion: 'Envases 170 g: faltan 9.000 un para OF-3215', responsable: 'Compras · Andrés Ríos', fecha: '2026-10-28', estado: 'Abierta' },
  { id: 'EXC-P07', tipo: 'Sobrecarga', descripcion: 'CT-EMP al 95 % de carga con 2 turnos', responsable: 'Juliana Ospina', fecha: '2026-10-25', estado: 'Resuelta' },
];

/* ------------------- Aprobaciones (PLA-11) -------------------------------- */

export interface AprobacionPLA {
  version: string;
  plan: string;
  periodo: string;
  aprobador: string;
  fecha: string;
  comentarios: number;
  estado: 'Borrador' | 'Aprobado' | 'Rechazado';
}

export const APROBACIONES_PLA: AprobacionPLA[] = [
  { version: 'v4', plan: 'MPS Semana 44-46', periodo: 'S-44 a S-46', aprobador: 'Juliana Ospina', fecha: '2026-10-27', comentarios: 3, estado: 'Aprobado' },
  { version: 'v3', plan: 'MPS Semana 44-46', periodo: 'S-44 a S-46', aprobador: 'Carlos Herrera (Gerencia)', fecha: '2026-10-26', comentarios: 5, estado: 'Rechazado' },
  { version: 'v2', plan: 'MPS Semana 43-45', periodo: 'S-43 a S-45', aprobador: 'Juliana Ospina', fecha: '2026-10-19', comentarios: 2, estado: 'Aprobado' },
  { version: 'v1', plan: 'MPS Semana 43-45', periodo: 'S-43 a S-45', aprobador: 'Carlos Herrera (Gerencia)', fecha: '2026-10-18', comentarios: 1, estado: 'Rechazado' },
  { version: 'v0', plan: 'Borrador inicial S-43', periodo: 'S-43', aprobador: '—', fecha: '2026-10-17', comentarios: 0, estado: 'Borrador' },
];

/* ------------------- Configuración (PLA-14) ------------------------------- */

export interface ParametroPLA {
  id: string;
  grupo: string;
  parametro: string;
  valor: string;
  editable: boolean;
}

export const PARAMETROS_PLA: ParametroPLA[] = [
  { id: 'PRM-01', grupo: 'Calendario', parametro: 'Días hábiles de la planta', valor: 'Lunes a sábado', editable: true },
  { id: 'PRM-02', grupo: 'Turnos', parametro: 'Turnos por centro (CT-HOR / CT-EMP)', valor: '3 turnos de 8 h', editable: true },
  { id: 'PRM-03', grupo: 'Horizonte', parametro: 'Horizonte de planificación', valor: '8 semanas', editable: true },
  { id: 'PRM-04', grupo: 'Reglas', parametro: 'Regla de prioridad por defecto', valor: 'Earliest Due Date (EDD)', editable: true },
  { id: 'PRM-05', grupo: 'Congelado', parametro: 'Período congelado', valor: '1 semana (S-46 congelada)', editable: true },
  { id: 'PRM-06', grupo: 'Permisos', parametro: 'Quién puede aprobar el plan', valor: 'Planificador + Gerencia', editable: false },
  { id: 'PRM-07', grupo: 'Auditoría', parametro: 'Registro de cambios del plan', valor: 'Activado (90 días)', editable: false },
];

export interface EventoAuditoriaPLA {
  id: string;
  fecha: string;
  usuario: string;
  accion: string;
  detalle: string;
}

export const AUDITORIA_PLA: EventoAuditoriaPLA[] = [
  { id: 'AUD-01', fecha: '2026-10-27 16:40', usuario: 'Juliana Ospina', accion: 'Aprobación', detalle: 'Plan v4 aprobado para S-44 a S-46' },
  { id: 'AUD-02', fecha: '2026-10-27 15:10', usuario: 'Ricardo Mejía', accion: 'Ajuste', detalle: 'Carga de CT-EMP rebalanceada en S-45' },
  { id: 'AUD-03', fecha: '2026-10-26 11:25', usuario: 'Carlos Herrera', accion: 'Rechazo', detalle: 'Plan v3 rechazado: faltan supuestos de demanda' },
  { id: 'AUD-04', fecha: '2026-10-26 09:05', usuario: 'Juliana Ospina', accion: 'Simulación', detalle: 'Escenario ESC-03 creado (retraso café)' },
];

/* ------------------- Indicadores (PLA-12) --------------------------------- */

export const INDICADORES_PLA = [
  { label: 'Cumplimiento del plan', valor: '92,4 %', estado: 'En meta' },
  { label: 'Utilización de capacidad', valor: '86,2 %', estado: 'CT-REF saturado' },
  { label: 'Backlog de órdenes', valor: '3 órdenes', estado: '1 prioritaria' },
  { label: 'Trabajo en curso (WIP)', valor: '$ 53,4 M', estado: '6 órdenes abiertas' },
  { label: 'Nivel de servicio (OTIF)', valor: '97,8 %', estado: 'Meta ≥ 95 %' },
  { label: 'Estabilidad del plan', valor: '88,1 %', estado: '2 cambios esta semana' },
] as const;

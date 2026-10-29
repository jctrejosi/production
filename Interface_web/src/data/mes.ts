// Datos de demostración del módulo MES — Ejecución y supervisión de planta.
// Tipos locales a este módulo; no editar archivos compartidos.

/* ----------------- Estaciones de trabajo (MES-02/15) ---------------------- */

export interface EstacionMES {
  id: string;
  nombre: string;
  centro: string;
  maquina: string;
  estado: 'Operando' | 'Parada' | 'Inactiva';
  ordenActual: string;
  operario: string;
}

export const ESTACIONES_MES: EstacionMES[] = [
  { id: 'EST-01', nombre: 'Mezcladora', centro: 'CT-MEZ', maquina: 'MEZ-01', estado: 'Operando', ordenActual: 'OF-3210', operario: 'Jorge Blandón' },
  { id: 'EST-02', nombre: 'Mezcladora', centro: 'CT-MEZ', maquina: 'MEZ-02', estado: 'Operando', ordenActual: 'OF-3211', operario: 'Marta Ruiz' },
  { id: 'EST-03', nombre: 'Horno', centro: 'CT-HOR', maquina: 'HOR-02', estado: 'Operando', ordenActual: 'OF-3210', operario: 'Luis Castaño' },
  { id: 'EST-04', nombre: 'Pasteurizador', centro: 'CT-HOR', maquina: 'PAS-01', estado: 'Parada', ordenActual: 'OF-3212', operario: 'Sofía Marín' },
  { id: 'EST-05', nombre: 'Empacadora', centro: 'CT-EMP', maquina: 'EMP-01', estado: 'Operando', ordenActual: 'OF-3213', operario: 'Natalia Rojas' },
  { id: 'EST-06', nombre: 'Envasadora', centro: 'CT-EMP', maquina: 'ENV-02', estado: 'Operando', ordenActual: 'OF-3215', operario: 'Óscar Pulgarín' },
  { id: 'EST-07', nombre: 'Molino', centro: 'CT-EMP', maquina: 'MOL-01', estado: 'Inactiva', ordenActual: '—', operario: '—' },
  { id: 'EST-08', nombre: 'Túnel de frío', centro: 'CT-REF', maquina: 'REF-01', estado: 'Operando', ordenActual: 'OF-3212', operario: 'Yessica López' },
];

/* -------------------- Órdenes de trabajo (MES-01/16) ---------------------- */

export interface OrdenMES {
  id: string;
  producto: string;
  cantidad: number;
  centro: string;
  estado: 'Planificada' | 'Liberada' | 'En proceso' | 'Pausada' | 'Cerrada';
  fechaLiberacion: string | null;
  prioridad: 'Alta' | 'Media' | 'Baja';
}

export const ORDENES_MES: OrdenMES[] = [
  { id: 'OF-3210', producto: 'Arepa de maíz x12', cantidad: 3400, centro: 'CT-MEZ', estado: 'En proceso', fechaLiberacion: '2026-10-28', prioridad: 'Alta' },
  { id: 'OF-3211', producto: 'Arepa de maíz x12', cantidad: 3200, centro: 'CT-MEZ', estado: 'En proceso', fechaLiberacion: '2026-10-28', prioridad: 'Media' },
  { id: 'OF-3212', producto: 'Queso campesino 500 g', cantidad: 1100, centro: 'CT-HOR', estado: 'Pausada', fechaLiberacion: '2026-10-28', prioridad: 'Alta' },
  { id: 'OF-3213', producto: 'Panela redonda 400 g', cantidad: 750, centro: 'CT-EMP', estado: 'En proceso', fechaLiberacion: '2026-10-28', prioridad: 'Baja' },
  { id: 'OF-3214', producto: 'Café molido 250 g', cantidad: 1450, centro: 'CT-EMP', estado: 'Liberada', fechaLiberacion: '2026-10-28', prioridad: 'Media' },
  { id: 'OF-3215', producto: 'Yogurt griego 170 g', cantidad: 850, centro: 'CT-EMP', estado: 'Liberada', fechaLiberacion: '2026-10-28', prioridad: 'Media' },
  { id: 'OF-3216', producto: 'Chocolate de mesa 250 g', cantidad: 1050, centro: 'CT-EMP', estado: 'Planificada', fechaLiberacion: null, prioridad: 'Baja' },
  { id: 'OF-3217', producto: 'Arepa de maíz x12', cantidad: 2900, centro: 'CT-MEZ', estado: 'Cerrada', fechaLiberacion: '2026-10-24', prioridad: 'Alta' },
];

/* --------------- Ciclo de vida y trazabilidad (MES-03/10) ----------------- */

export interface RegistroOperacionMES {
  id: string;
  orden: string;
  operacion: string;
  estacion: string;
  operario: string;
  turno: string;
  lote: string;
  evento: 'Inicio' | 'Pausa' | 'Reanudación' | 'Fin';
  fechaHora: string;
  motivo: string;
}

export const REGISTROS_OPERACION: RegistroOperacionMES[] = [
  { id: 'ROP-01', orden: 'OF-3210', operacion: 'Mezclado', estacion: 'MEZ-01', operario: 'Jorge Blandón', turno: 'Turno A', lote: 'L-2026-118', evento: 'Inicio', fechaHora: '2026-10-28 06:02', motivo: '—' },
  { id: 'ROP-02', orden: 'OF-3210', operacion: 'Mezclado', estacion: 'MEZ-01', operario: 'Jorge Blandón', turno: 'Turno A', lote: 'L-2026-118', evento: 'Pausa', fechaHora: '2026-10-28 08:15', motivo: 'Ajuste de receta' },
  { id: 'ROP-03', orden: 'OF-3210', operacion: 'Mezclado', estacion: 'MEZ-01', operario: 'Jorge Blandón', turno: 'Turno A', lote: 'L-2026-118', evento: 'Reanudación', fechaHora: '2026-10-28 08:31', motivo: '—' },
  { id: 'ROP-04', orden: 'OF-3212', operacion: 'Pasteurizado', estacion: 'PAS-01', operario: 'Sofía Marín', turno: 'Turno A', lote: 'L-2026-119', evento: 'Inicio', fechaHora: '2026-10-28 06:35', motivo: '—' },
  { id: 'ROP-05', orden: 'OF-3212', operacion: 'Pasteurizado', estacion: 'PAS-01', operario: 'Sofía Marín', turno: 'Turno A', lote: 'L-2026-119', evento: 'Pausa', fechaHora: '2026-10-28 09:10', motivo: 'Falla de válvula' },
  { id: 'ROP-06', orden: 'OF-3213', operacion: 'Empaque', estacion: 'EMP-01', operario: 'Natalia Rojas', turno: 'Turno A', lote: 'L-2026-112', evento: 'Inicio', fechaHora: '2026-10-28 07:48', motivo: '—' },
  { id: 'ROP-07', orden: 'OF-3215', operacion: 'Envasado', estacion: 'ENV-02', operario: 'Óscar Pulgarín', turno: 'Turno B', lote: 'L-2026-120', evento: 'Inicio', fechaHora: '2026-10-28 14:12', motivo: '—' },
  { id: 'ROP-08', orden: 'OF-3217', operacion: 'Mezclado', estacion: 'MEZ-01', operario: 'Jorge Blandón', turno: 'Turno A', lote: 'L-2026-110', evento: 'Fin', fechaHora: '2026-10-25 15:40', motivo: '—' },
];

/* ---------------- Cantidades producidas (MES-04) -------------------------- */

export interface CapturaCantidadMES {
  id: string;
  orden: string;
  producidas: number;
  rechazadas: number;
  pendientes: number;
  motivoRechazo: string;
  fechaHora: string;
  operario: string;
}

export const CAPTURAS_CANTIDAD: CapturaCantidadMES[] = [
  { id: 'CPT-01', orden: 'OF-3210', producidas: 1250, rechazadas: 18, pendientes: 2150, motivoRechazo: 'Masa con grumos', fechaHora: '2026-10-28 09:45', operario: 'Jorge Blandón' },
  { id: 'CPT-02', orden: 'OF-3211', producidas: 860, rechazadas: 4, pendientes: 2340, motivoRechazo: 'Deformación', fechaHora: '2026-10-28 10:02', operario: 'Marta Ruiz' },
  { id: 'CPT-03', orden: 'OF-3212', producidas: 420, rechazadas: 0, pendientes: 680, motivoRechazo: '—', fechaHora: '2026-10-28 09:58', operario: 'Sofía Marín' },
  { id: 'CPT-04', orden: 'OF-3213', producidas: 300, rechazadas: 6, pendientes: 450, motivoRechazo: 'Etiqueta torcida', fechaHora: '2026-10-28 11:10', operario: 'Natalia Rojas' },
  { id: 'CPT-05', orden: 'OF-3215', producidas: 210, rechazadas: 3, pendientes: 640, motivoRechazo: 'Sello defectuoso', fechaHora: '2026-10-28 15:20', operario: 'Óscar Pulgarín' },
  { id: 'CPT-06', orden: 'OF-3217', producidas: 2900, rechazadas: 34, pendientes: 0, motivoRechazo: 'Defectos varios', fechaHora: '2026-10-25 15:38', operario: 'Jorge Blandón' },
];

/* ------------------- Tiempos reales (MES-05) ------------------------------ */

export interface TiempoMES {
  id: string;
  orden: string;
  operacion: string;
  tipo: 'Preparación' | 'Ciclo' | 'Espera' | 'Pausa' | 'Limpieza';
  real: number;
  estandar: number;
}

export const TIEMPOS_MES: TiempoMES[] = [
  { id: 'TMP-01', orden: 'OF-3210', operacion: 'Mezclado', tipo: 'Preparación', real: 0.4, estandar: 0.5 },
  { id: 'TMP-02', orden: 'OF-3210', operacion: 'Mezclado', tipo: 'Ciclo', real: 2.9, estandar: 2.5 },
  { id: 'TMP-03', orden: 'OF-3210', operacion: 'Mezclado', tipo: 'Pausa', real: 0.27, estandar: 0.2 },
  { id: 'TMP-04', orden: 'OF-3212', operacion: 'Pasteurizado', tipo: 'Preparación', real: 0.8, estandar: 0.6 },
  { id: 'TMP-05', orden: 'OF-3212', operacion: 'Pasteurizado', tipo: 'Pausa', real: 1.4, estandar: 0.4 },
  { id: 'TMP-06', orden: 'OF-3213', operacion: 'Empaque', tipo: 'Ciclo', real: 1.9, estandar: 2.0 },
  { id: 'TMP-07', orden: 'OF-3213', operacion: 'Empaque', tipo: 'Limpieza', real: 0.5, estandar: 0.45 },
];

/* ------------------- Paradas y causas (MES-06) ---------------------------- */

export interface ParadaMES {
  id: string;
  estacion: string;
  tipo: 'Disponibilidad' | 'Rendimiento' | 'Calidad' | 'Otra';
  causa: string;
  inicio: string;
  fin: string | null;
  duracionMin: number;
  responsable: string;
  estado: 'Abierta' | 'Cerrada';
}

export const PARADAS_MES: ParadaMES[] = [
  { id: 'PAR-01', estacion: 'PAS-01', tipo: 'Disponibilidad', causa: 'Falla de válvula de paso', inicio: '2026-10-28 09:10', fin: null, duracionMin: 65, responsable: 'Camilo Duarte (Mantenimiento)', estado: 'Abierta' },
  { id: 'PAR-02', estacion: 'MEZ-01', tipo: 'Rendimiento', causa: 'Espera de harina (reabastecimiento)', inicio: '2026-10-28 07:40', fin: '2026-10-28 08:02', duracionMin: 22, responsable: 'Andrés Ríos (Almacén)', estado: 'Cerrada' },
  { id: 'PAR-03', estacion: 'HOR-02', tipo: 'Calidad', causa: 'Temperatura fuera de rango', inicio: '2026-10-27 13:20', fin: '2026-10-27 13:45', duracionMin: 25, responsable: 'Luis Castaño (Producción)', estado: 'Cerrada' },
  { id: 'PAR-04', estacion: 'EMP-01', tipo: 'Otra', causa: 'Cambio de formato de etiqueta', inicio: '2026-10-28 11:30', fin: '2026-10-28 11:55', duracionMin: 25, responsable: 'Natalia Rojas (Producción)', estado: 'Cerrada' },
  { id: 'PAR-05', estacion: 'REF-01', tipo: 'Disponibilidad', causa: 'Sensor de temperatura intermitente', inicio: '2026-10-27 06:50', fin: '2026-10-27 08:10', duracionMin: 80, responsable: 'Técnico externo (IOT)', estado: 'Cerrada' },
  { id: 'PAR-06', estacion: 'ENV-02', tipo: 'Calidad', causa: 'Sello defectuoso en lote piloto', inicio: '2026-10-28 14:55', fin: null, duracionMin: 30, responsable: 'Verónica Salas (Calidad)', estado: 'Abierta' },
];

/* ------------------------ WIP (MES-09) ------------------------------------ */

export interface WipMES {
  orden: string;
  producto: string;
  producidas: number;
  pendientes: number;
  estacion: string;
  valor: number;
}

export const WIP_MES: WipMES[] = [
  { orden: 'OF-3210', producto: 'Arepa de maíz x12', producidas: 1250, pendientes: 2150, estacion: 'CT-MEZ', valor: 8400000 },
  { orden: 'OF-3211', producto: 'Arepa de maíz x12', producidas: 860, pendientes: 2340, estacion: 'CT-MEZ', valor: 7200000 },
  { orden: 'OF-3212', producto: 'Queso campesino 500 g', producidas: 420, pendientes: 680, estacion: 'CT-HOR', valor: 12400000 },
  { orden: 'OF-3213', producto: 'Panela redonda 400 g', producidas: 300, pendientes: 450, estacion: 'CT-EMP', valor: 3600000 },
  { orden: 'OF-3214', producto: 'Café molido 250 g', producidas: 0, pendientes: 1450, estacion: 'CT-EMP', valor: 11200000 },
  { orden: 'OF-3215', producto: 'Yogurt griego 170 g', producidas: 210, pendientes: 640, estacion: 'CT-EMP', valor: 5800000 },
  { orden: 'OF-3216', producto: 'Chocolate de mesa 250 g', producidas: 0, pendientes: 1050, estacion: '—', valor: 6400000 },
];

/* ------------------- Turnos y relevos (MES-11) ---------------------------- */

export interface TurnoMES {
  id: string;
  nombre: string;
  inicio: string;
  fin: string;
  supervisor: string;
  operarios: number;
}

export const TURNOS_MES: TurnoMES[] = [
  { id: 'T1', nombre: 'Turno A (mañana)', inicio: '06:00', fin: '14:00', supervisor: 'Juliana Ospina', operarios: 12 },
  { id: 'T2', nombre: 'Turno B (tarde)', inicio: '14:00', fin: '22:00', supervisor: 'Ricardo Mejía', operarios: 10 },
  { id: 'T3', nombre: 'Turno C (noche)', inicio: '22:00', fin: '06:00', supervisor: 'Diana Cárdenas', operarios: 6 },
];

/* ------------------- Alertas (MES-12) ------------------------------------- */

export interface AlertaMES {
  id: string;
  tipo: 'Retraso' | 'Parada' | 'Material' | 'Calidad' | 'Saturación';
  texto: string;
  fechaHora: string;
  estado: 'Activa' | 'Confirmada' | 'Escalada';
}

export const ALERTAS_MES: AlertaMES[] = [
  { id: 'AL-M01', tipo: 'Parada', texto: 'PAS-01 detenida desde las 09:10 (falla de válvula)', fechaHora: '2026-10-28 09:10', estado: 'Escalada' },
  { id: 'AL-M02', tipo: 'Retraso', texto: 'OF-3210 lleva 25 min de retraso frente al plan', fechaHora: '2026-10-28 10:05', estado: 'Activa' },
  { id: 'AL-M03', tipo: 'Material', texto: 'Harina precocida: faltan 340 kg para OF-3210', fechaHora: '2026-10-28 08:40', estado: 'Confirmada' },
  { id: 'AL-M04', tipo: 'Calidad', texto: 'Temperatura de HOR-02 fuera de rango (183 °C)', fechaHora: '2026-10-28 10:12', estado: 'Activa' },
  { id: 'AL-M05', tipo: 'Saturación', texto: 'CT-REF al 104 % de carga · revisar secuencia', fechaHora: '2026-10-28 07:30', estado: 'Confirmada' },
  { id: 'AL-M06', tipo: 'Parada', texto: 'ENV-02 detenida por sello defectuoso', fechaHora: '2026-10-28 14:55', estado: 'Activa' },
];

/* ------------------- Calidad en línea (MES-13) ---------------------------- */

export interface ControlCalidadMES {
  id: string;
  orden: string;
  operacion: string;
  parametro: string;
  especificacion: string;
  resultado: string;
  estado: 'Conforme' | 'No conforme';
}

export const CONTROLES_CALIDAD: ControlCalidadMES[] = [
  { id: 'CC-M01', orden: 'OF-3210', operacion: 'Mezclado', parametro: 'Humedad de masa', especificacion: '42–46 %', resultado: '43,8 %', estado: 'Conforme' },
  { id: 'CC-M02', orden: 'OF-3210', operacion: 'Horneado', parametro: 'Temperatura de horno', especificacion: '175–195 °C', resultado: '183 °C', estado: 'Conforme' },
  { id: 'CC-M03', orden: 'OF-3212', operacion: 'Pasteurizado', parametro: 'Tiempo de retención', especificacion: '≥ 15 min', resultado: '13,2 min', estado: 'No conforme' },
  { id: 'CC-M04', orden: 'OF-3213', operacion: 'Empaque', parametro: 'Peso neto', especificacion: '400 ± 5 g', resultado: '398 g', estado: 'Conforme' },
  { id: 'CC-M05', orden: 'OF-3215', operacion: 'Envasado', parametro: 'Hermeticidad del sello', especificacion: 'Sin fugas', resultado: 'Fuga detectada', estado: 'No conforme' },
  { id: 'CC-M06', orden: 'OF-3214', operacion: 'Molido', parametro: 'Granulometría', especificacion: 'Malla 40', resultado: 'Malla 40', estado: 'Conforme' },
];

/* ------------------- Instrucciones digitales (MES-07) --------------------- */

export interface InstruccionMES {
  id: string;
  orden: string;
  operacion: string;
  documento: string;
  revision: string;
  pasos: number;
  estado: 'Vigente' | 'Obsoleta';
}

export const INSTRUCCIONES_MES: InstruccionMES[] = [
  { id: 'INS-01', orden: 'OF-3210', operacion: 'Mezclado', documento: 'IT-MEZ-001 Preparación de masa de arepa', revision: 'R4', pasos: 8, estado: 'Vigente' },
  { id: 'INS-02', orden: 'OF-3212', operacion: 'Pasteurizado', documento: 'IT-HOR-004 Pasteurización de leche', revision: 'R2', pasos: 6, estado: 'Vigente' },
  { id: 'INS-03', orden: 'OF-3213', operacion: 'Empaque', documento: 'IT-EMP-002 Empaque de panela', revision: 'R1', pasos: 5, estado: 'Obsoleta' },
  { id: 'INS-04', orden: 'OF-3215', operacion: 'Envasado', documento: 'IT-EMP-005 Envasado de yogurt', revision: 'R3', pasos: 7, estado: 'Vigente' },
];

export const PASOS_INSTRUCCION: string[] = [
  'Verificar lote de harina y pesar 156 kg por bache.',
  'Agregar agua a 45 °C y mezclar 4 min a velocidad media.',
  'Incorporar queso rallado y sal según receta IT-MEZ-001.',
  'Medir humedad de la masa: rango 42–46 %.',
  'Descargar a tolva de horneado y confirmar cantidad.',
];

/* ------------------- Consumo (MES-08) ------------------------------------- */

export interface ConsumoMES {
  id: string;
  orden: string;
  material: string;
  planificado: number;
  consumido: number;
  unidad: string;
  estado: 'Pendiente' | 'Confirmado';
}

export const CONSUMOS_MES: ConsumoMES[] = [
  { id: 'CSM-01', orden: 'OF-3210', material: 'Harina de maíz precocida', planificado: 1560, consumido: 1180, unidad: 'kg', estado: 'Pendiente' },
  { id: 'CSM-02', orden: 'OF-3210', material: 'Queso rallado', planificado: 210, consumido: 180, unidad: 'kg', estado: 'Pendiente' },
  { id: 'CSM-03', orden: 'OF-3212', material: 'Leche entera pasteurizada', planificado: 3200, consumido: 2950, unidad: 'L', estado: 'Pendiente' },
  { id: 'CSM-04', orden: 'OF-3212', material: 'Cuajo líquido', planificado: 16, consumido: 15, unidad: 'L', estado: 'Confirmado' },
  { id: 'CSM-05', orden: 'OF-3213', material: 'Bolsas 400 g', planificado: 760, consumido: 320, unidad: 'un', estado: 'Pendiente' },
  { id: 'CSM-06', orden: 'OF-3215', material: 'Envases 170 g', planificado: 860, consumido: 240, unidad: 'un', estado: 'Pendiente' },
];

/* ------------------- Dispositivos (MES-14) -------------------------------- */

export interface DispositivoMES {
  id: string;
  nombre: string;
  tipo: 'Báscula' | 'Lector' | 'Sensor' | 'Terminal' | 'PLC';
  estacion: string;
  estado: 'Conectado' | 'Intermitente' | 'Desconectado';
  ultimoDato: string;
}

export const DISPOSITIVOS_MES: DispositivoMES[] = [
  { id: 'DIS-01', nombre: 'Báscula BAS-01', tipo: 'Báscula', estacion: 'CT-MEZ', estado: 'Conectado', ultimoDato: 'Hace 12 s' },
  { id: 'DIS-02', nombre: 'Lector LEC-04', tipo: 'Lector', estacion: 'CT-EMP', estado: 'Conectado', ultimoDato: 'Hace 5 s' },
  { id: 'DIS-03', nombre: 'Sensor TEM-11', tipo: 'Sensor', estacion: 'CT-HOR', estado: 'Conectado', ultimoDato: 'Hace 8 s' },
  { id: 'DIS-04', nombre: 'Terminal TER-02', tipo: 'Terminal', estacion: 'CT-EMP', estado: 'Intermitente', ultimoDato: 'Hace 4 min' },
  { id: 'DIS-05', nombre: 'PLC HOR-02', tipo: 'PLC', estacion: 'CT-HOR', estado: 'Conectado', ultimoDato: 'Hace 2 s' },
  { id: 'DIS-06', nombre: 'Sensor REF-07', tipo: 'Sensor', estacion: 'CT-REF', estado: 'Desconectado', ultimoDato: 'Hace 3 h' },
];

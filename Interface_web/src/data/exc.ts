// Datos de demostración del módulo de Control de Procesos y Excepciones (EXC).
// Todo en estado local: sin fetch y sin librerías externas.

export type Criticidad = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export interface NoConformidad {
  id: string;
  producto: string;
  lote: string;
  cantidad: number;
  unidad: string;
  proceso: string;
  origen: string;
  evidencia: string;
  responsable: string;
  fecha: string;
  criticidad: Criticidad;
  estado: 'Abierta' | 'En análisis' | 'En CAPA' | 'Cerrada' | 'Escalada';
}

export const NO_CONFORMIDADES: NoConformidad[] = [
  { id: 'NC-0446', producto: 'Azúcar orgánica 1 kg', lote: 'L-2026-105', cantidad: 28, unidad: 'kg', proceso: 'Centrifugado', origen: 'Control de proceso', evidencia: 'FOT-3315.jpg', responsable: 'Juliana Ospina', fecha: '2026-10-16', criticidad: 'Baja', estado: 'Abierta' },
  { id: 'NC-0445', producto: 'Chocolate de mesa 80 %', lote: 'L-2026-104', cantidad: 610, unidad: 'kg', proceso: 'Conchado', origen: 'Queja de cliente', evidencia: 'IMG-5510.jpg', responsable: 'Diana Ruiz', fecha: '2026-10-16', criticidad: 'Crítica', estado: 'Escalada' },
  { id: 'NC-0443', producto: 'Café tostado 250 g', lote: 'L-2026-103', cantidad: 96, unidad: 'kg', proceso: 'Tostado', origen: 'Control de calidad', evidencia: 'LAB-2210.pdf', responsable: 'Andrés Mora', fecha: '2026-10-15', criticidad: 'Media', estado: 'En análisis' },
  { id: 'NC-0442', producto: 'Panela pulverizada 500 g', lote: 'L-2026-102', cantidad: 830, unidad: 'kg', proceso: 'Secado', origen: 'Control de proceso', evidencia: 'FOT-3312.jpg', responsable: 'Carlos Ríos', fecha: '2026-10-13', criticidad: 'Alta', estado: 'En CAPA' },
  { id: 'NC-0440', producto: 'Panela pulverizada 500 g', lote: 'L-2026-101', cantidad: 360, unidad: 'und', proceso: 'Empaque', origen: 'Auditoría interna', evidencia: 'AUD-2211.pdf', responsable: 'Laura Gómez', fecha: '2026-10-13', criticidad: 'Media', estado: 'Cerrada' },
  { id: 'NC-0436', producto: 'Miel de caña', lote: 'L-2026-100', cantidad: 210, unidad: 'kg', proceso: 'Evaporación', origen: 'Control de proceso', evidencia: 'FOT-3301.jpg', responsable: 'Carlos Ríos', fecha: '2026-10-15', criticidad: 'Media', estado: 'En CAPA' },
  { id: 'NC-0438', producto: 'Café tostado 250 g', lote: 'L-2026-092', cantidad: 7400, unidad: 'und', proceso: 'Tostado', origen: 'Queja de cliente', evidencia: 'IMG-5480.jpg', responsable: 'Andrés Mora', fecha: '2026-08-12', criticidad: 'Alta', estado: 'Cerrada' },
];

export interface Desviacion {
  id: string;
  parametro: string;
  receta: string;
  esperado: string;
  real: string;
  fecha: string;
  orden: string;
  resultado: 'Dentro' | 'Fuera';
  estado: 'Registrada' | 'Corregida' | 'En análisis' | 'En CAPA';
}

export const DESVIACIONES: Desviacion[] = [
  { id: 'DES-2210', parametro: 'Humedad de secado', receta: 'R-118', esperado: '6,5 %', real: '7,8 %', fecha: '2026-10-13', orden: 'OF-1042', resultado: 'Fuera', estado: 'En análisis' },
  { id: 'DES-2209', parametro: 'Temperatura de tostión', receta: 'R-104', esperado: '185 °C', real: '192 °C', fecha: '2026-10-15', orden: 'OF-1045', resultado: 'Fuera', estado: 'Corregida' },
  { id: 'DES-2208', parametro: 'Tiempo de conchado', receta: 'R-201', esperado: '42 min', real: '47 min', fecha: '2026-10-15', orden: 'OF-1043', resultado: 'Fuera', estado: 'En análisis' },
  { id: 'DES-2207', parametro: 'pH de miel', receta: 'R-112', esperado: '5,2', real: '5,1', fecha: '2026-10-16', orden: 'OF-1038', resultado: 'Dentro', estado: 'Registrada' },
  { id: 'DES-2206', parametro: 'Velocidad de molienda', receta: 'R-118', esperado: '24 kg/min', real: '23,5 kg/min', fecha: '2026-10-16', orden: 'OF-1041', resultado: 'Dentro', estado: 'Registrada' },
  { id: 'DES-2205', parametro: 'Peso unitario', receta: 'R-119', esperado: '500 g ± 5', real: '502 g', fecha: '2026-10-16', orden: 'OF-1041', resultado: 'Dentro', estado: 'Registrada' },
  { id: 'DES-2204', parametro: 'Temperatura de cristalización', receta: 'R-205', esperado: '60 °C', real: '64 °C', fecha: '2026-10-16', orden: 'OF-1040', resultado: 'Fuera', estado: 'En CAPA' },
];

export interface Tolerancia {
  id: string;
  parametro: string;
  producto: string;
  min: string;
  max: string;
  unidad: string;
  criticidad: Criticidad;
}

export const TOLERANCIAS: Tolerancia[] = [
  { id: 'TOL-331', parametro: 'Humedad de secado', producto: 'Panela pulverizada', min: '4,5', max: '6,5', unidad: '%', criticidad: 'Alta' },
  { id: 'TOL-332', parametro: 'Temperatura de tostión', producto: 'Café tostado', min: '180', max: '190', unidad: '°C', criticidad: 'Media' },
  { id: 'TOL-333', parametro: 'Tiempo de conchado', producto: 'Chocolate de mesa', min: '38', max: '44', unidad: 'min', criticidad: 'Media' },
  { id: 'TOL-334', parametro: 'pH de miel', producto: 'Miel de caña', min: '4,8', max: '5,4', unidad: '—', criticidad: 'Baja' },
  { id: 'TOL-335', parametro: 'Peso unitario 500 g', producto: 'Panela pulverizada', min: '495', max: '505', unidad: 'g', criticidad: 'Alta' },
  { id: 'TOL-336', parametro: 'Temperatura de cristalización', producto: 'Azúcar orgánica', min: '58', max: '62', unidad: '°C', criticidad: 'Alta' },
  { id: 'TOL-337', parametro: 'Velocidad de molienda', producto: 'Miel de caña', min: '22', max: '26', unidad: 'kg/min', criticidad: 'Baja' },
];

export interface Bloqueo {
  id: string;
  tipo: 'Orden' | 'Lote' | 'Operación';
  referencia: string;
  motivo: string;
  fecha: string;
  responsable: string;
  estado: 'Bloqueado' | 'Liberado';
}

export const BLOQUEOS: Bloqueo[] = [
  { id: 'BLQ-501', tipo: 'Lote', referencia: 'L-2026-102', motivo: 'Humedad fuera de rango (NC-0442)', fecha: '2026-10-13', responsable: 'Carlos Ríos', estado: 'Bloqueado' },
  { id: 'BLQ-502', tipo: 'Lote', referencia: 'L-2026-104', motivo: 'Partículas extrañas (NC-0445)', fecha: '2026-10-16', responsable: 'Diana Ruiz', estado: 'Bloqueado' },
  { id: 'BLQ-506', tipo: 'Orden', referencia: 'OF-1042', motivo: 'En espera de decisión de cuarentena', fecha: '2026-10-14', responsable: 'Carlos Ríos', estado: 'Bloqueado' },
  { id: 'BLQ-504', tipo: 'Operación', referencia: 'OP-2207', motivo: 'Esperando verificación de centrifugado', fecha: '2026-10-16', responsable: 'Juliana Ospina', estado: 'Bloqueado' },
  { id: 'BLQ-503', tipo: 'Orden', referencia: 'OF-1045', motivo: 'Desviación de tostión (DES-2209)', fecha: '2026-10-15', responsable: 'Andrés Mora', estado: 'Liberado' },
  { id: 'BLQ-505', tipo: 'Lote', referencia: 'L-2026-107', motivo: 'Empaque rechazado en recepción', fecha: '2026-10-09', responsable: 'Laura Gómez', estado: 'Liberado' },
];

export interface ReprocesoExc {
  id: string;
  lote: string;
  producto: string;
  motivo: string;
  autorizadoPor: string;
  costo: number;
  resultado: 'En proceso' | 'Liberado' | 'Rechazado';
  fecha: string;
}

export const REPROCESOS_EXC: ReprocesoExc[] = [
  { id: 'RPR-118', lote: 'L-2026-102', producto: 'Panela pulverizada 500 g', motivo: 'Re-secado por humedad', autorizadoPor: 'Juliana Ospina', costo: 420000, resultado: 'En proceso', fecha: '2026-10-16' },
  { id: 'RPR-117', lote: 'L-2026-101', producto: 'Panela pulverizada 500 g', motivo: 'Re-empaque por sello', autorizadoPor: 'Laura Gómez', costo: 310000, resultado: 'Liberado', fecha: '2026-10-14' },
  { id: 'RPR-116', lote: 'L-2026-103', producto: 'Café tostado 250 g', motivo: 'Re-tostado por color', autorizadoPor: 'Rechazado por Calidad', costo: 260000, resultado: 'Rechazado', fecha: '2026-10-16' },
  { id: 'RPR-115', lote: 'L-2026-105', producto: 'Azúcar orgánica 1 kg', motivo: 'Recristalización', autorizadoPor: 'Juliana Ospina', costo: 380000, resultado: 'Liberado', fecha: '2026-10-17' },
  { id: 'RPR-114', lote: 'L-2026-104', producto: 'Chocolate de mesa 80 %', motivo: 'Tamizado por partículas', autorizadoPor: 'Rechazado por Calidad', costo: 450000, resultado: 'Rechazado', fecha: '2026-10-16' },
  { id: 'RPR-113', lote: 'L-2026-100', producto: 'Miel de caña', motivo: 'Re-evaporación', autorizadoPor: 'Carlos Ríos', costo: 240000, resultado: 'Liberado', fecha: '2026-10-15' },
];

export interface DesperdicioExc {
  id: string;
  producto: string;
  lote: string;
  proceso: string;
  causa: string;
  cantidad: number;
  unidad: string;
  costo: number;
  fecha: string;
}

export const DESPERDICIOS_EXC: DesperdicioExc[] = [
  { id: 'DES-801', producto: 'Panela pulverizada', lote: 'L-2026-102', proceso: 'Pulverizado', causa: 'Finos de molienda', cantidad: 24, unidad: 'kg', costo: 312000, fecha: '2026-10-16' },
  { id: 'DES-802', producto: 'Café tostado', lote: 'L-2026-103', proceso: 'Tostado', causa: 'Quemado por sobretostión', cantidad: 96, unidad: 'kg', costo: 1728000, fecha: '2026-10-15' },
  { id: 'DES-803', producto: 'Chocolate de mesa', lote: 'L-2026-104', proceso: 'Conchado', causa: 'Merma de conchado', cantidad: 118, unidad: 'kg', costo: 2360000, fecha: '2026-10-15' },
  { id: 'DES-804', producto: 'Panela pulverizada', lote: 'L-2026-101', proceso: 'Empaque', causa: 'Sellado defectuoso', cantidad: 36, unidad: 'und', costo: 54000, fecha: '2026-10-16' },
  { id: 'DES-805', producto: 'Azúcar orgánica', lote: 'L-2026-105', proceso: 'Centrifugado', causa: 'Miel residual', cantidad: 28, unidad: 'kg', costo: 224000, fecha: '2026-10-16' },
  { id: 'DES-806', producto: 'Miel de caña', lote: 'L-2026-100', proceso: 'Evaporación', causa: 'Incrustación en pailas', cantidad: 15, unidad: 'kg', costo: 180000, fecha: '2026-10-16' },
];

export interface CausaRaiz {
  id: string;
  nc: string;
  metodo: string;
  causa: string;
  evidencia: string;
  responsable: string;
  fecha: string;
}

export const CAUSAS_RAIZ: CausaRaiz[] = [
  { id: 'RCA-118', nc: 'NC-0442', metodo: '5 porqués', causa: 'Malla del secador obstruida por falta de limpieza preventiva', evidencia: 'FOT-3312 + bitácora MNT-2241', responsable: 'Carlos Ríos', fecha: '2026-10-15' },
  { id: 'RCA-117', nc: 'NC-0440', metodo: 'Ishikawa', causa: 'Rodillo sellador desgastado sin reemplazo programado', evidencia: 'AUD-2211 + OT-5531', responsable: 'Laura Gómez', fecha: '2026-10-14' },
  { id: 'RCA-116', nc: 'NC-0445', metodo: '5 porqués', causa: 'Tamiz del conchador con rotura no detectada', evidencia: 'IMG-5510 + inspección', responsable: 'Diana Ruiz', fecha: '2026-10-17' },
  { id: 'RCA-115', nc: 'NC-0438', metodo: 'Ishikawa', causa: 'Perfil de temperatura mal calibrado', evidencia: 'LAB-2210 + certificado', responsable: 'Andrés Mora', fecha: '2026-08-14' },
  { id: 'RCA-114', nc: 'NC-0436', metodo: '5 porqués', causa: 'Presión de vapor inestable en paila 2', evidencia: 'FOT-3301 + SCADA', responsable: 'Carlos Ríos', fecha: '2026-10-16' },
];

export interface Capa {
  id: string;
  nc: string;
  tipo: 'Correctiva' | 'Preventiva';
  accion: string;
  responsable: string;
  fechaLimite: string;
  verificacion: string;
  eficacia: string;
  estado: 'Abierta' | 'En curso' | 'Cerrada';
}

export const CAPAS: Capa[] = [
  { id: 'CAPA-331', nc: 'NC-0442', tipo: 'Correctiva', accion: 'Limpieza semanal de mallas del secador', responsable: 'Carlos Ríos', fechaLimite: '2026-10-22', verificacion: 'Pendiente', eficacia: '—', estado: 'Abierta' },
  { id: 'CAPA-330', nc: 'NC-0440', tipo: 'Correctiva', accion: 'Reemplazo de rodillo sellador EMP-03', responsable: 'Laura Gómez', fechaLimite: '2026-10-20', verificacion: 'Verificada', eficacia: 'Eficaz', estado: 'Cerrada' },
  { id: 'CAPA-329', nc: 'NC-0445', tipo: 'Correctiva', accion: 'Inspección diaria de tamices del conchador', responsable: 'Diana Ruiz', fechaLimite: '2026-10-25', verificacion: 'Pendiente', eficacia: '—', estado: 'En curso' },
  { id: 'CAPA-328', nc: 'NC-0438', tipo: 'Preventiva', accion: 'Calibración semestral de perfiles de temperatura', responsable: 'Andrés Mora', fechaLimite: '2026-09-30', verificacion: 'Verificada', eficacia: 'Eficaz', estado: 'Cerrada' },
  { id: 'CAPA-327', nc: 'NC-0436', tipo: 'Correctiva', accion: 'Mantenimiento de válvula de vapor paila 2', responsable: 'Carlos Ríos', fechaLimite: '2026-10-18', verificacion: 'Verificada', eficacia: 'Parcialmente eficaz', estado: 'Cerrada' },
  { id: 'CAPA-326', nc: 'NC-0446', tipo: 'Preventiva', accion: 'Ajuste de velocidad de centrifugado', responsable: 'Juliana Ospina', fechaLimite: '2026-10-24', verificacion: 'Pendiente', eficacia: '—', estado: 'Abierta' },
];

export interface Aprobacion {
  id: string;
  tipo: string;
  referencia: string;
  nivel: string;
  responsable: string;
  fecha: string;
  decision: 'Aprobada' | 'Rechazada' | 'Pendiente' | 'En revisión';
}

export const APROBACIONES: Aprobacion[] = [
  { id: 'APR-101', tipo: 'Liberación de cuarentena', referencia: 'CUA-029', nivel: 'Nivel 1 · Calidad', responsable: 'Laura Gómez', fecha: '2026-10-12', decision: 'Aprobada' },
  { id: 'APR-102', tipo: 'Reproceso', referencia: 'RPR-118', nivel: 'Nivel 2 · Calidad + Producción', responsable: 'Juliana Ospina', fecha: '2026-10-16', decision: 'Pendiente' },
  { id: 'APR-103', tipo: 'Reproceso', referencia: 'RPR-117', nivel: 'Nivel 1 · Calidad', responsable: 'Laura Gómez', fecha: '2026-10-14', decision: 'Aprobada' },
  { id: 'APR-104', tipo: 'Excepción temporal', referencia: 'EXT-2211', nivel: 'Nivel 3 · Dirección', responsable: 'Miguel Torres', fecha: '2026-10-15', decision: 'En revisión' },
  { id: 'APR-105', tipo: 'Liberación de bloqueo', referencia: 'BLQ-503', nivel: 'Nivel 1 · Calidad', responsable: 'Laura Gómez', fecha: '2026-10-15', decision: 'Aprobada' },
  { id: 'APR-106', tipo: 'Destrucción de desperdicio', referencia: 'DES-803', nivel: 'Nivel 2 · Calidad + Ambiente', responsable: 'Juliana Ospina', fecha: '2026-10-16', decision: 'Aprobada' },
];

export interface ExcepcionTemporal {
  id: string;
  parametro: string;
  alcance: string;
  vigenciaInicio: string;
  vigenciaFin: string;
  condiciones: string;
  estado: 'Vigente' | 'Caducada' | 'Cerrada';
}

export const EXCEPCIONES_TEMPORALES: ExcepcionTemporal[] = [
  { id: 'EXT-2211', parametro: 'Temperatura de tostión hasta 192 °C', alcance: 'L3 Café · semana 43', vigenciaInicio: '2026-10-15', vigenciaFin: '2026-10-22', condiciones: 'Resultado validado por Calidad antes del cierre', estado: 'Vigente' },
  { id: 'EXT-2209', parametro: 'Conchado extendido a 48 min', alcance: 'L4 Chocolate', vigenciaInicio: '2026-10-01', vigenciaFin: '2026-10-31', condiciones: 'Solo receta R-201', estado: 'Vigente' },
  { id: 'EXT-2210', parametro: 'Humedad de secado hasta 7 %', alcance: 'L1 Panela', vigenciaInicio: '2026-10-06', vigenciaFin: '2026-10-13', condiciones: 'Solo producto para reproceso', estado: 'Caducada' },
  { id: 'EXT-2208', parametro: 'Peso unitario 495–510 g', alcance: 'L2 Empaque', vigenciaInicio: '2026-09-15', vigenciaFin: '2026-09-30', condiciones: 'Empaques del lote L-2026-099', estado: 'Cerrada' },
  { id: 'EXT-2207', parametro: 'Velocidad de molienda 20 kg/min', alcance: 'L1 Panela', vigenciaInicio: '2026-09-01', vigenciaFin: '2026-09-14', condiciones: 'Mantenimiento de MOL-01', estado: 'Cerrada' },
];

export interface Escalamiento {
  id: string;
  origen: string;
  criticidad: Criticidad;
  motivo: string;
  fecha: string;
  destino: string;
  estado: 'Activo' | 'Resuelto';
}

export const ESCALAMIENTOS: Escalamiento[] = [
  { id: 'ESC-411', origen: 'NC-0445', criticidad: 'Crítica', motivo: 'Superó 24 h sin plan de acción', fecha: '2026-10-17', destino: 'Dirección', estado: 'Activo' },
  { id: 'ESC-410', origen: 'NC-0442', criticidad: 'Alta', motivo: 'Sin cierre en 72 h', fecha: '2026-10-16', destino: 'Gerencia de planta', estado: 'Activo' },
  { id: 'ESC-408', origen: 'DES-2204', criticidad: 'Media', motivo: 'Desviación repetida 2 veces', fecha: '2026-10-17', destino: 'Ingeniería de procesos', estado: 'Activo' },
  { id: 'ESC-409', origen: 'NC-0440', criticidad: 'Media', motivo: 'Acumulación de 3 NC del mismo equipo', fecha: '2026-10-13', destino: 'Calidad', estado: 'Resuelto' },
  { id: 'ESC-407', origen: 'NC-0436', criticidad: 'Media', motivo: 'Impacto en costo > $ 500.000', fecha: '2026-10-15', destino: 'Gerencia de planta', estado: 'Resuelto' },
];

/** Reportes disponibles (EXC-12). */
export const REPORTES_EXC = [
  { id: 'REP-EXC-01', nombre: 'No conformidades por producto, proceso y causa', periodicidad: 'Mensual' },
  { id: 'REP-EXC-02', nombre: 'Desviaciones y tolerancias fuera de rango', periodicidad: 'Diaria' },
  { id: 'REP-EXC-03', nombre: 'Reprocesos y desperdicio', periodicidad: 'Semanal' },
  { id: 'REP-EXC-04', nombre: 'Acciones correctivas y eficacia', periodicidad: 'Mensual' },
  { id: 'REP-EXC-05', nombre: 'Excepciones abiertas y vencidas', periodicidad: 'Diaria' },
  { id: 'REP-EXC-06', nombre: 'Pareto de causas', periodicidad: 'Mensual' },
] as const;

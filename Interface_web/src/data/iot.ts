// Datos de demostración del módulo IOT — Integración industrial e IoT.
// Tipos locales a este archivo; no editar archivos compartidos.

export type EstadoDispositivo = 'En línea' | 'Degradado' | 'Desconectado';
export type Criticidad = 'Alta' | 'Media' | 'Baja';
export type EstadoAlarma = 'Activa' | 'Reconocida' | 'Resuelta';

export interface DispositivoPLC {
  id: string;
  nombre: string;
  protocolo: 'Modbus TCP' | 'OPC UA' | 'EtherNet/IP' | 'Profibus';
  ip: string;
  segmento: string;
  tags: number;
  estado: EstadoDispositivo;
  ultimaLectura: string;
}

export const PLCS: DispositivoPLC[] = [
  { id: 'PLC-01', nombre: 'Mezcladora MEZ-01', protocolo: 'Modbus TCP', ip: '10.20.1.11', segmento: 'OT-1 Producción', tags: 124, estado: 'En línea', ultimaLectura: '2026-10-28 08:42:11' },
  { id: 'PLC-02', nombre: 'Pasteurizador PST-01', protocolo: 'OPC UA', ip: '10.20.1.12', segmento: 'OT-1 Producción', tags: 96, estado: 'En línea', ultimaLectura: '2026-10-28 08:42:07' },
  { id: 'PLC-03', nombre: 'Envasadora ENV-02', protocolo: 'EtherNet/IP', ip: '10.20.2.21', segmento: 'OT-3 Empaque', tags: 88, estado: 'Degradado', ultimaLectura: '2026-10-28 08:41:58' },
  { id: 'PLC-04', nombre: 'Horno HOR-01', protocolo: 'Modbus TCP', ip: '10.20.1.13', segmento: 'OT-1 Producción', tags: 64, estado: 'En línea', ultimaLectura: '2026-10-28 08:42:03' },
  { id: 'PLC-05', nombre: 'Caldera CAL-01', protocolo: 'Profibus', ip: '10.20.2.10', segmento: 'OT-2 Servicios', tags: 52, estado: 'En línea', ultimaLectura: '2026-10-28 08:41:49' },
  { id: 'PLC-06', nombre: 'Transportadora CT-05', protocolo: 'EtherNet/IP', ip: '10.20.2.25', segmento: 'OT-3 Empaque', tags: 41, estado: 'Desconectado', ultimaLectura: '2026-10-28 07:59:04' },
];

export interface SensorIot {
  id: string;
  nombre: string;
  tipo: 'Temperatura' | 'Presión' | 'Humedad' | 'Vibración' | 'Flujo' | 'pH';
  equipo: string;
  unidad: string;
  valor: number;
  minimo: number;
  maximo: number;
  estado: 'Normal' | 'Alerta';
}

export const SENSORES: SensorIot[] = [
  { id: 'SEN-01', nombre: 'Temperatura túnel de pasteurización', tipo: 'Temperatura', equipo: 'PST-01', unidad: '°C', valor: 82.4, minimo: 75, maximo: 85, estado: 'Normal' },
  { id: 'SEN-02', nombre: 'Presión de caldera', tipo: 'Presión', equipo: 'CAL-01', unidad: 'bar', valor: 8.6, minimo: 6, maximo: 10, estado: 'Normal' },
  { id: 'SEN-03', nombre: 'Humedad bodega materia prima', tipo: 'Humedad', equipo: 'ALM-01', unidad: '%HR', valor: 58.2, minimo: 40, maximo: 65, estado: 'Normal' },
  { id: 'SEN-04', nombre: 'Vibración motor MEZ-01', tipo: 'Vibración', equipo: 'MEZ-01', unidad: 'mm/s', valor: 7.8, minimo: 0, maximo: 4.5, estado: 'Alerta' },
  { id: 'SEN-05', nombre: 'Flujo línea de néctar', tipo: 'Flujo', equipo: 'ENV-02', unidad: 'L/min', valor: 120.5, minimo: 90, maximo: 140, estado: 'Normal' },
  { id: 'SEN-06', nombre: 'pH producto en proceso', tipo: 'pH', equipo: 'TQ-02', unidad: 'pH', valor: 6.4, minimo: 5.8, maximo: 6.8, estado: 'Normal' },
  { id: 'SEN-07', nombre: 'Temperatura cámara fría', tipo: 'Temperatura', equipo: 'CAM-01', unidad: '°C', valor: 4.8, minimo: 2, maximo: 7, estado: 'Normal' },
];

export interface Bascula {
  id: string;
  nombre: string;
  ubicacion: string;
  capacidadKg: number;
  producto: string;
  lote: string;
  ultimoPesajeKg: number;
  fecha: string;
}

export const BASCULAS: Bascula[] = [
  { id: 'BAS-01', nombre: 'Báscula recepción MP', ubicacion: 'Muelle 1', capacidadKg: 5000, producto: 'Pulpa de mora', lote: 'L-2026-118', ultimoPesajeKg: 1240.5, fecha: '2026-10-28 08:15' },
  { id: 'BAS-02', nombre: 'Báscula dosificación', ubicacion: 'Sala de mezclas', capacidadKg: 1000, producto: 'Azúcar', lote: 'L-2026-118', ultimoPesajeKg: 250, fecha: '2026-10-28 08:41' },
  { id: 'BAS-03', nombre: 'Báscula producto terminado', ubicacion: 'Empaque', capacidadKg: 300, producto: 'Avena 6×1 L', lote: 'L-2026-119', ultimoPesajeKg: 284.7, fecha: '2026-10-28 08:40' },
  { id: 'BAS-04', nombre: 'Báscula de camiones', ubicacion: 'Patio de maniobras', capacidadKg: 40000, producto: '—', lote: '—', ultimoPesajeKg: 0, fecha: '2026-10-27 16:30' },
  { id: 'BAS-05', nombre: 'Báscula de laboratorio', ubicacion: 'Control de calidad', capacidadKg: 30, producto: 'Muestra QC-118', lote: 'L-2026-118', ultimoPesajeKg: 1.2, fecha: '2026-10-28 07:50' },
];

export interface MaquinaIot {
  id: string;
  nombre: string;
  estado: 'Operando' | 'En parada' | 'En alarma';
  ciclos: number;
  contadorPiezas: number;
  alarmasActivas: number;
}

export const MAQUINAS: MaquinaIot[] = [
  { id: 'MQ-01', nombre: 'Mezcladora MEZ-01', estado: 'Operando', ciclos: 1842, contadorPiezas: 128740, alarmasActivas: 0 },
  { id: 'MQ-02', nombre: 'Pasteurizador PST-01', estado: 'Operando', ciclos: 963, contadorPiezas: 214500, alarmasActivas: 0 },
  { id: 'MQ-03', nombre: 'Envasadora ENV-02', estado: 'En parada', ciclos: 2215, contadorPiezas: 186340, alarmasActivas: 2 },
  { id: 'MQ-04', nombre: 'Horno HOR-01', estado: 'Operando', ciclos: 540, contadorPiezas: 32680, alarmasActivas: 0 },
  { id: 'MQ-05', nombre: 'Túnel de enfriamiento TUN-01', estado: 'Operando', ciclos: 1210, contadorPiezas: 145210, alarmasActivas: 0 },
  { id: 'MQ-06', nombre: 'Etiquetadora ETQ-01', estado: 'En alarma', ciclos: 890, contadorPiezas: 98740, alarmasActivas: 1 },
];

export interface NodoScada {
  id: string;
  nombre: string;
  protocolo: string;
  nivel: string;
  estado: EstadoDispositivo;
  latenciaMs: number;
}

export const SCADA_NODOS: NodoScada[] = [
  { id: 'SCADA-01', nombre: 'Supervisión central de planta', protocolo: 'OPC UA', nivel: 'Nivel 2 · Supervisión', estado: 'En línea', latenciaMs: 12 },
  { id: 'SCADA-02', nombre: 'HMI sala de mezclas', protocolo: 'Modbus TCP', nivel: 'Nivel 1 · Control', estado: 'En línea', latenciaMs: 8 },
  { id: 'SCADA-03', nombre: 'Gateway OPC UA zona empaque', protocolo: 'OPC UA', nivel: 'Nivel 1 · Control', estado: 'Degradado', latenciaMs: 145 },
  { id: 'SCADA-04', nombre: 'Historiador externo (Historian)', protocolo: 'OPC UA', nivel: 'Nivel 3 · Operaciones', estado: 'En línea', latenciaMs: 20 },
];

export interface MesExterno {
  id: string;
  nombre: string;
  canal: string;
  alcance: string;
  ultimaSync: string;
  estado: EstadoDispositivo;
}

export const MES_EXTERNOS: MesExterno[] = [
  { id: 'MES-01', nombre: 'MES legado de producción', canal: 'API REST (TLS)', alcance: 'Órdenes y ejecución', ultimaSync: '2026-10-28 07:30', estado: 'En línea' },
  { id: 'MES-02', nombre: 'MES de calidad de laboratorio', canal: 'Archivos CSV (SFTP)', alcance: 'Resultados y trazabilidad de lotes', ultimaSync: '2026-10-27 18:00', estado: 'En línea' },
  { id: 'MES-03', nombre: 'MES de empaque', canal: 'API REST (TLS)', alcance: 'Producción de empaque', ultimaSync: '2026-10-28 06:00', estado: 'Degradado' },
  { id: 'MES-04', nombre: 'MES de mantenimiento', canal: 'API REST (TLS)', alcance: 'Paradas y fallas de equipos', ultimaSync: '2026-10-27 22:00', estado: 'En línea' },
];

export interface Captura {
  id: string;
  fecha: string;
  hora: string;
  origen: string;
  variable: string;
  valor: string;
}

export const CAPTURAS: Captura[] = [
  { id: 'CAP-001', fecha: '2026-10-28', hora: '08:42:11', origen: 'PLC-01', variable: 'Ciclos mezcladora', valor: '1842 ciclos' },
  { id: 'CAP-002', fecha: '2026-10-28', hora: '08:42:07', origen: 'SEN-01', variable: 'Temperatura túnel', valor: '82,4 °C' },
  { id: 'CAP-003', fecha: '2026-10-28', hora: '08:41:58', origen: 'BAS-02', variable: 'Peso dosificación', valor: '250,0 kg' },
  { id: 'CAP-004', fecha: '2026-10-28', hora: '08:41:50', origen: 'MQ-03', variable: 'Estado ENV-02', valor: 'Parada' },
  { id: 'CAP-005', fecha: '2026-10-28', hora: '08:41:32', origen: 'SEN-04', variable: 'Vibración MEZ-01', valor: '7,8 mm/s' },
  { id: 'CAP-006', fecha: '2026-10-28', hora: '08:41:10', origen: 'PLC-03', variable: 'Contador ENV-02', valor: '186340 un' },
  { id: 'CAP-007', fecha: '2026-10-28', hora: '08:40:55', origen: 'SEN-06', variable: 'pH tanque TQ-02', valor: '6,4 pH' },
  { id: 'CAP-008', fecha: '2026-10-28', hora: '08:40:40', origen: 'BAS-03', variable: 'Peso producto terminado', valor: '284,7 kg' },
];

export interface AlarmaIot {
  id: string;
  fecha: string;
  hora: string;
  criticidad: Criticidad;
  dispositivo: string;
  mensaje: string;
  responsable: string;
  estado: EstadoAlarma;
}

export const ALARMAS: AlarmaIot[] = [
  { id: 'ALM-01', fecha: '2026-10-28', hora: '08:41:50', criticidad: 'Alta', dispositivo: 'MQ-03 · ENV-02', mensaje: 'Parada no programada por fallo en tapadora', responsable: 'Carlos Vélez (Mantenimiento)', estado: 'Activa' },
  { id: 'ALM-02', fecha: '2026-10-28', hora: '08:41:32', criticidad: 'Media', dispositivo: 'SEN-04 · MEZ-01', mensaje: 'Vibración sobre umbral en motor mezcladora', responsable: 'Carlos Vélez (Mantenimiento)', estado: 'Activa' },
  { id: 'ALM-03', fecha: '2026-10-28', hora: '07:59:04', criticidad: 'Alta', dispositivo: 'PLC-06 · CT-05', mensaje: 'Pérdida de comunicación con transportadora', responsable: 'Juliana Ospina (Producción)', estado: 'Activa' },
  { id: 'ALM-04', fecha: '2026-10-27', hora: '23:15', criticidad: 'Media', dispositivo: 'SEN-07 · CAM-01', mensaje: 'Temperatura de cámara fría fuera de rango', responsable: 'Supervisor turno noche', estado: 'Resuelta' },
  { id: 'ALM-05', fecha: '2026-10-27', hora: '16:40', criticidad: 'Baja', dispositivo: 'SEN-03 · ALM-01', mensaje: 'Humedad de bodega sobre 60 %HR', responsable: 'Juliana Ospina (Producción)', estado: 'Reconocida' },
  { id: 'ALM-06', fecha: '2026-10-27', hora: '14:05', criticidad: 'Alta', dispositivo: 'SCADA-03 · Gateway', mensaje: 'Latencia elevada en gateway de empaque', responsable: 'TI/OT', estado: 'Resuelta' },
  { id: 'ALM-07', fecha: '2026-10-27', hora: '11:20', criticidad: 'Media', dispositivo: 'MQ-06 · ETQ-01', mensaje: 'Atasco en etiquetadora', responsable: 'Operador de empaque', estado: 'Reconocida' },
];

export interface SerieHistoriador {
  id: string;
  variable: string;
  dispositivo: string;
  muestras: number;
  retencionMeses: number;
  resolucionS: number;
  ultima: string;
}

export const SERIES_HISTORIADOR: SerieHistoriador[] = [
  { id: 'HIS-01', variable: 'Temperatura túnel', dispositivo: 'SEN-01', muestras: 12840, retencionMeses: 12, resolucionS: 1, ultima: '2026-10-28 08:42' },
  { id: 'HIS-02', variable: 'Presión caldera', dispositivo: 'SEN-02', muestras: 22110, retencionMeses: 12, resolucionS: 5, ultima: '2026-10-28 08:42' },
  { id: 'HIS-03', variable: 'Vibración MEZ-01', dispositivo: 'SEN-04', muestras: 31120, retencionMeses: 24, resolucionS: 10, ultima: '2026-10-28 08:41' },
  { id: 'HIS-04', variable: 'Ciclos mezcladora', dispositivo: 'PLC-01', muestras: 8440, retencionMeses: 24, resolucionS: 1, ultima: '2026-10-28 08:42' },
  { id: 'HIS-05', variable: 'pH tanque TQ-02', dispositivo: 'SEN-06', muestras: 4210, retencionMeses: 6, resolucionS: 60, ultima: '2026-10-28 08:40' },
];

export interface ControlSeguridad {
  id: string;
  control: string;
  detalle: string;
  estado: 'Cumple' | 'En revisión' | 'Pendiente';
}

export const CONTROLES_SEGURIDAD: ControlSeguridad[] = [
  { id: 'SEG-01', control: 'Segmentación de red', detalle: 'Red OT segregada de la red corporativa por firewall (Purdue nivel 0-2)', estado: 'Cumple' },
  { id: 'SEG-02', control: 'Autenticación de dispositivos', detalle: 'Certificados X.509 por dispositivo en gateway OPC UA', estado: 'Cumple' },
  { id: 'SEG-03', control: 'Cifrado en tránsito', detalle: 'TLS 1.3 en canales MES y réplicas al historiador', estado: 'Cumple' },
  { id: 'SEG-04', control: 'Registro de accesos', detalle: 'Bitácora de accesos OT con revisión mensual de TI/OT', estado: 'En revisión' },
  { id: 'SEG-05', control: 'Segmentación VLAN por zona', detalle: 'VLAN separada para zona de empaque (OT-3)', estado: 'Pendiente' },
  { id: 'SEG-06', control: 'Actualización de firmware', detalle: 'Ventana de parcheo trimestral aprobada por TI/OT', estado: 'Cumple' },
];

export interface SaludDispositivo {
  id: string;
  dispositivo: string;
  disponibilidadPct: number;
  latenciaMs: number;
  errores24h: number;
  salud: 'Saludable' | 'Atención' | 'Crítico';
}

export const SALUD_OT: SaludDispositivo[] = [
  { id: 'PLC-01', dispositivo: 'Mezcladora MEZ-01', disponibilidadPct: 100, latenciaMs: 9, errores24h: 0, salud: 'Saludable' },
  { id: 'PLC-02', dispositivo: 'Pasteurizador PST-01', disponibilidadPct: 100, latenciaMs: 11, errores24h: 0, salud: 'Saludable' },
  { id: 'PLC-03', dispositivo: 'Envasadora ENV-02', disponibilidadPct: 98.4, latenciaMs: 88, errores24h: 4, salud: 'Atención' },
  { id: 'PLC-04', dispositivo: 'Horno HOR-01', disponibilidadPct: 100, latenciaMs: 10, errores24h: 0, salud: 'Saludable' },
  { id: 'PLC-05', dispositivo: 'Caldera CAL-01', disponibilidadPct: 100, latenciaMs: 14, errores24h: 0, salud: 'Saludable' },
  { id: 'SCADA-03', dispositivo: 'Gateway empaque', disponibilidadPct: 91.2, latenciaMs: 145, errores24h: 12, salud: 'Atención' },
  { id: 'PLC-06', dispositivo: 'Transportadora CT-05', disponibilidadPct: 76.5, latenciaMs: 0, errores24h: 31, salud: 'Crítico' },
];

export interface ReglaIot {
  id: string;
  categoria: 'Protocolo' | 'Variable' | 'Regla' | 'Destino';
  nombre: string;
  estado: 'Habilitada' | 'Deshabilitada';
}

export const REGLAS_IOT: ReglaIot[] = [
  { id: 'CFG-01', categoria: 'Protocolo', nombre: 'Gateway OPC UA empaque — suscripción segura con certificados', estado: 'Habilitada' },
  { id: 'CFG-02', categoria: 'Variable', nombre: 'Mapeo SEN-01 → CAL.TEMP.101 (registro de proceso)', estado: 'Habilitada' },
  { id: 'CFG-03', categoria: 'Regla', nombre: 'Alarma: vibración > 4,5 mm/s durante más de 10 s', estado: 'Habilitada' },
  { id: 'CFG-04', categoria: 'Destino', nombre: 'Réplica de series HIS-* al historiador externo (lote 5 min)', estado: 'Habilitada' },
  { id: 'CFG-05', categoria: 'Regla', nombre: 'Notificar pérdida de conexión > 60 s a TI/OT', estado: 'Habilitada' },
  { id: 'CFG-06', categoria: 'Protocolo', nombre: 'Modbus TCP PLC-06 — reintentos cada 30 s', estado: 'Deshabilitada' },
];

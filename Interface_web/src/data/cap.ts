// Datos de demostración del módulo CAP — Captura y códigos de barras.
// Tipos locales a este módulo; no editar archivos compartidos.

import { fmtNum } from '../lib/format';

export type TipoCodigoCAP = 'Producto' | 'Peso' | 'Ubicación' | 'Lote' | 'Serie' | 'Paquete' | 'Contacto';

/* ------------------------- Nomenclaturas (CAP-01) ------------------------- */

export interface NomenclaturaGS1 {
  id: string;
  nombre: string;
  empresa: string;
  planta: string;
  entrada: string;
  salida: string;
  reglas: number;
  activa: boolean;
}

export const NOMENCLATURAS: NomenclaturaGS1[] = [
  { id: 'NOM-01', nombre: 'Nomenclatura estándar GS1', empresa: 'Mercaldas S.A.S.', planta: 'Planta Principal (PLA-01)', entrada: 'GS1-128 · EAN-13', salida: 'EAN-13 · ITF-14 · GS1-128', reglas: 14, activa: true },
  { id: 'NOM-02', nombre: 'Nomenclatura proveedores', empresa: 'Mercaldas S.A.S.', planta: 'Todas las plantas', entrada: 'EAN-13 de proveedor', salida: 'GTIN-14 interno', reglas: 6, activa: true },
  { id: 'NOM-03', nombre: 'Nomenclatura interna antigua', empresa: 'Mercaldas S.A.S.', planta: 'Planta Principal (PLA-01)', entrada: 'Código interno de 12 dígitos', salida: 'GS1-128', reglas: 4, activa: false },
  { id: 'NOM-04', nombre: 'Nomenclatura básculas', empresa: 'Mercaldas S.A.S.', planta: 'Centro de Distribución (CDI-01)', entrada: 'Peso bruto + tara', salida: 'GS1-128 (AI 310x)', reglas: 3, activa: true },
  { id: 'NOM-05', nombre: 'Nomenclatura puntos de venta', empresa: 'Mercaldas S.A.S.', planta: 'Red de tiendas', entrada: 'EAN-13', salida: 'EAN-13', reglas: 2, activa: true },
];

/* ---------------------------- Reglas (CAP-02) ----------------------------- */

export interface ReglaCodigo {
  id: string;
  nombre: string;
  prioridad: number;
  tipo: TipoCodigoCAP;
  formato: string;
  patron: string;
  alias: string;
  activa: boolean;
}

export const REGLAS: ReglaCodigo[] = [
  { id: 'REG-01', nombre: 'GTIN-14 empaque', prioridad: 1, tipo: 'Paquete', formato: 'GTIN-14', patron: '^01\\d{14}$', alias: 'GTIN14', activa: true },
  { id: 'REG-02', nombre: 'GTIN-13 producto', prioridad: 2, tipo: 'Producto', formato: 'EAN-13', patron: '^\\d{13}$', alias: 'EAN13', activa: true },
  { id: 'REG-03', nombre: 'Lote GS1 (AI 10)', prioridad: 3, tipo: 'Lote', formato: 'GS1-128', patron: '^10[A-Za-z0-9]{1,20}$', alias: 'LOTE', activa: true },
  { id: 'REG-04', nombre: 'Serie (AI 21)', prioridad: 4, tipo: 'Serie', formato: 'GS1-128', patron: '^21[A-Za-z0-9]{1,20}$', alias: 'SERIE', activa: true },
  { id: 'REG-05', nombre: 'Ubicación GLN-13', prioridad: 5, tipo: 'Ubicación', formato: 'GLN-13', patron: '^414\\d{10,13}$', alias: 'UBI', activa: true },
  { id: 'REG-06', nombre: 'SSCC-18', prioridad: 6, tipo: 'Paquete', formato: 'SSCC-18', patron: '^00\\d{18}$', alias: 'SSCC', activa: true },
  { id: 'REG-07', nombre: 'Peso neto (AI 310x)', prioridad: 7, tipo: 'Peso', formato: 'GS1-128', patron: '^310[0-5]\\d{6}$', alias: 'PESO', activa: true },
  { id: 'REG-08', nombre: 'Contacto GLN', prioridad: 8, tipo: 'Contacto', formato: 'GLN-13', patron: '^417\\d{10,13}$', alias: 'CONTACTO', activa: false },
];

/* ----------------------- Tipos de código (CAP-03) ------------------------- */

export interface TipoCodigoDef {
  tipo: TipoCodigoCAP;
  descripcion: string;
  ai: string;
  ejemplo: string;
}

export const TIPOS_CODIGO: TipoCodigoDef[] = [
  { tipo: 'Producto', descripcion: 'Identifica el artículo comercial (GTIN/EAN)', ai: '01', ejemplo: '017701234123456789' },
  { tipo: 'Peso', descripcion: 'Peso neto o bruto del ítem pesado', ai: '310x / 320x', ejemplo: '310300054600' },
  { tipo: 'Ubicación', descripcion: 'Ubicación física (GLN) del almacén', ai: '414', ejemplo: '4147701234567894' },
  { tipo: 'Lote', descripcion: 'Lote de fabricación del producto', ai: '10', ejemplo: '10L-2026-118' },
  { tipo: 'Serie', descripcion: 'Número de serie único del activo', ai: '21', ejemplo: '21SN-77421' },
  { tipo: 'Paquete', descripcion: 'Unidad logística seriada (SSCC)', ai: '00', ejemplo: '003770123456789011' },
  { tipo: 'Contacto', descripcion: 'Proveedor o cliente identificado por GLN', ai: '417', ejemplo: '4177701234567896' },
];

/* ------------------------- GS1 — AIs (CAP-05) ----------------------------- */

export interface AiGS1 {
  ai: string;
  nombre: string;
  formato: string;
  ejemplo: string;
}

export const AIS_GS1: AiGS1[] = [
  { ai: '00', nombre: 'SSCC (número seriado de unidad logística)', formato: '18 dígitos', ejemplo: '003770123456789011' },
  { ai: '01', nombre: 'GTIN de artículo', formato: '14 dígitos', ejemplo: '017701234123456789' },
  { ai: '02', nombre: 'GTIN de artículos contenidos', formato: '14 dígitos', ejemplo: '027701234123456789' },
  { ai: '10', nombre: 'Lote o partida', formato: 'Alfanumérico ≤ 20', ejemplo: '10L-2026-118' },
  { ai: '11', nombre: 'Fecha de producción', formato: 'AAMMDD', ejemplo: '11261028' },
  { ai: '17', nombre: 'Fecha de vencimiento', formato: 'AAMMDD', ejemplo: '17270430' },
  { ai: '21', nombre: 'Número de serie', formato: 'Alfanumérico ≤ 20', ejemplo: '21SN-77421' },
  { ai: '310x', nombre: 'Peso neto (kg)', formato: '6 dígitos + decimales', ejemplo: '310300054600' },
  { ai: '37', nombre: 'Cantidad de unidades', formato: '≤ 8 dígitos', ejemplo: '3712' },
  { ai: '414', nombre: 'Ubicación de destino (GLN)', formato: '13 dígitos', ejemplo: '4147701234567894' },
  { ai: '91-99', nombre: 'Uso interno de la compañía', formato: 'Variable', ejemplo: '9185OBS' },
];

/* --------------------- Códigos de producto (CAP-06) ----------------------- */

export interface CodigoProducto {
  producto: string;
  codigo: string;
  tipo: string;
  embalaje: string;
  validado: boolean;
}

export const CODIGOS_PRODUCTO: CodigoProducto[] = [
  { producto: 'Arepa de maíz x12', codigo: '7701234000011', tipo: 'EAN-13', embalaje: 'Bolsa 12 un', validado: true },
  { producto: 'Queso campesino 500 g', codigo: '7701234000028', tipo: 'EAN-13', embalaje: 'Empaque al vacío', validado: true },
  { producto: 'Panela redonda 400 g', codigo: '7701234000035', tipo: 'EAN-13', embalaje: 'Bolsa', validado: true },
  { producto: 'Café molido 250 g', codigo: '7701234000042', tipo: 'EAN-13', embalaje: 'Bolsa trilaminada', validado: true },
  { producto: 'Yogurt griego 170 g', codigo: '7701234000059', tipo: 'EAN-13', embalaje: 'Vaso + tapa foil', validado: true },
  { producto: 'Chocolate de mesa 250 g', codigo: '7701234000066', tipo: 'EAN-13', embalaje: 'Tableta + caja', validado: false },
  { producto: 'Caja arepas x24', codigo: '17701234000016', tipo: 'GTIN-14', embalaje: 'Caja corrugada', validado: true },
];

/* -------------------- Códigos de ubicación (CAP-07) ----------------------- */

export interface CodigoUbicacion {
  codigo: string;
  almacen: string;
  zona: string;
  posicion: string;
  estado: 'Activa' | 'Bloqueada';
}

export const CODIGOS_UBICACION: CodigoUbicacion[] = [
  { codigo: 'UBI-A-01-03', almacen: 'Almacén Central', zona: 'A · Materias primas', posicion: 'Estante 01 · Nivel 03', estado: 'Activa' },
  { codigo: 'UBI-A-02-05', almacen: 'Almacén Central', zona: 'A · Materias primas', posicion: 'Estante 02 · Nivel 05', estado: 'Activa' },
  { codigo: 'UBI-B-02-01', almacen: 'Almacén Central', zona: 'B · Producto terminado', posicion: 'Estante 02 · Nivel 01', estado: 'Activa' },
  { codigo: 'UBI-B-03-02', almacen: 'Almacén Central', zona: 'B · Producto terminado', posicion: 'Estante 03 · Nivel 02', estado: 'Activa' },
  { codigo: 'UBI-C-01-01', almacen: 'Almacén Central', zona: 'C · Cuarentena', posicion: 'Estante 01 · Nivel 01', estado: 'Bloqueada' },
  { codigo: 'UBI-D-04-01', almacen: 'Almacén Central', zona: 'D · Devoluciones', posicion: 'Estante 04 · Nivel 01', estado: 'Activa' },
];

/* --------------------- Lotes y series (CAP-08/CAP-17) --------------------- */

export interface LoteSerieCAP {
  codigo: string;
  tipo: 'Lote' | 'Serie';
  producto: string;
  vencimiento: string;
  cantidad: number;
  estado: 'Disponible' | 'Reservado' | 'Vencido';
}

export const LOTES_SERIES: LoteSerieCAP[] = [
  { codigo: 'L-2026-118', tipo: 'Lote', producto: 'Arepa de maíz x12', vencimiento: '2026-11-30', cantidad: 1240, estado: 'Disponible' },
  { codigo: 'L-2026-119', tipo: 'Lote', producto: 'Queso campesino 500 g', vencimiento: '2026-11-05', cantidad: 320, estado: 'Disponible' },
  { codigo: 'L-2026-120', tipo: 'Lote', producto: 'Yogurt griego 170 g', vencimiento: '2026-11-10', cantidad: 640, estado: 'Disponible' },
  { codigo: 'L-2026-112', tipo: 'Lote', producto: 'Panela redonda 400 g', vencimiento: '2027-10-15', cantidad: 850, estado: 'Reservado' },
  { codigo: 'L-2026-101', tipo: 'Lote', producto: 'Café molido 250 g', vencimiento: '2026-10-02', cantidad: 40, estado: 'Vencido' },
  { codigo: 'SN-77421', tipo: 'Serie', producto: 'Máquina empacadora MEZ-03', vencimiento: '—', cantidad: 1, estado: 'Disponible' },
  { codigo: 'SN-77422', tipo: 'Serie', producto: 'Máquina empacadora MEZ-03', vencimiento: '—', cantidad: 1, estado: 'Disponible' },
];

/* ----------------- Paquetes SSCC (CAP-09/CAP-16) -------------------------- */

export interface PaqueteSSCC {
  sscc: string;
  contenido: string;
  cantidad: number;
  ubicacion: string;
  estado: 'Creado' | 'Asignado' | 'En tránsito' | 'Cerrado';
}

export const PAQUETES_SSCC: PaqueteSSCC[] = [
  { sscc: '003770123456789011', contenido: 'Caja arepas x24', cantidad: 24, ubicacion: 'UBI-A-01-03', estado: 'Cerrado' },
  { sscc: '003770123456789024', contenido: 'Queso campesino 500 g', cantidad: 12, ubicacion: 'UBI-B-02-01', estado: 'Asignado' },
  { sscc: '003770123456789037', contenido: 'Café molido 250 g', cantidad: 48, ubicacion: 'UBI-A-02-05', estado: 'En tránsito' },
  { sscc: '003770123456789040', contenido: 'Yogurt griego 170 g', cantidad: 60, ubicacion: 'UBI-B-03-02', estado: 'Creado' },
  { sscc: '003770123456789053', contenido: 'Panela redonda 400 g', cantidad: 36, ubicacion: 'UBI-B-02-01', estado: 'Asignado' },
];

/* ----------------------- Códigos de contacto (CAP-10) --------------------- */

export interface CodigoContacto {
  tipo: 'Proveedor' | 'Cliente';
  nombre: string;
  gln: string;
  nit: string;
  activo: boolean;
}

export const CODIGOS_CONTACTO: CodigoContacto[] = [
  { tipo: 'Proveedor', nombre: 'Lácteos El Recreo S.A.S.', gln: '7701234567894', nit: '900.123.456-7', activo: true },
  { tipo: 'Proveedor', nombre: 'Café del Huila Ltda.', gln: '7701234567900', nit: '901.234.567-8', activo: true },
  { tipo: 'Proveedor', nombre: 'Empaques Flexibles de Colombia', gln: '7701234567917', nit: '902.345.678-9', activo: true },
  { tipo: 'Cliente', nombre: 'Mercaldas La 65', gln: '7701234567924', nit: '901.987.654-3', activo: true },
  { tipo: 'Cliente', nombre: 'Mercaldas Laureles', gln: '7701234567931', nit: '901.987.654-3', activo: true },
  { tipo: 'Proveedor', nombre: 'Panela La Esperanza', gln: '7701234567948', nit: '903.456.789-0', activo: false },
];

/* ----------------- Registros de escaneo (CAP-12..18) ---------------------- */

export interface RegistroEscaneo {
  id: string;
  fechaHora: string;
  usuario: string;
  operacion: string;
  codigo: string;
  resultado: 'OK' | 'Error';
  detalle: string;
}

export const REGISTROS_ESCANEO: RegistroEscaneo[] = [
  { id: 'SC-1281', fechaHora: '2026-10-28 10:12', usuario: 'Andrés Ríos', operacion: 'Recepción REC-1048', codigo: '017701234123456789', resultado: 'OK', detalle: 'Arepa de maíz x12 · Cant. 240' },
  { id: 'SC-1280', fechaHora: '2026-10-28 10:11', usuario: 'Andrés Ríos', operacion: 'Recepción REC-1048', codigo: '003770123456789011', resultado: 'OK', detalle: 'SSCC validado con dígito de control' },
  { id: 'SC-1279', fechaHora: '2026-10-28 09:58', usuario: 'Juliana Ospina', operacion: 'Conteo CNT-0921', codigo: '4147701234567894', resultado: 'OK', detalle: 'UBI-A-01-03 · 120 un contadas' },
  { id: 'SC-1278', fechaHora: '2026-10-28 09:41', usuario: 'Juliana Ospina', operacion: 'Conteo CNT-0921', codigo: '7701234000059', resultado: 'Error', detalle: 'Código no asignado al catálogo' },
  { id: 'SC-1277', fechaHora: '2026-10-28 08:52', usuario: 'Andrés Ríos', operacion: 'Transferencia TRF-0152', codigo: '10L-2026-119', resultado: 'OK', detalle: 'Lote hacia UBI-B-02-01' },
  { id: 'SC-1276', fechaHora: '2026-10-28 07:20', usuario: 'Verónica Salas', operacion: 'Fabricación OF-3210', codigo: '21SN-77421', resultado: 'OK', detalle: 'Serie MEZ-03 registrada' },
  { id: 'SC-1275', fechaHora: '2026-10-28 06:55', usuario: 'Andrés Ríos', operacion: 'Entrega PED-7842', codigo: '003770123456789037', resultado: 'OK', detalle: 'Paquete asignado al pedido' },
];

/* -------------------- Operaciones capturadas (CAP-12..18) ----------------- */

export interface OperacionCaptura {
  id: string;
  tipo: 'Recepción' | 'Transferencia' | 'Entrega' | 'Conteo' | 'Fabricación';
  referencia: string;
  estado: 'Abierta' | 'Validada' | 'Aplicada';
  lineas: number;
  escaneos: number;
  usuario: string;
  fecha: string;
}

export const OPERACIONES_CAPTURA: OperacionCaptura[] = [
  { id: 'REC-1048', tipo: 'Recepción', referencia: 'OC-2214 · Lácteos El Recreo', estado: 'Abierta', lineas: 6, escaneos: 14, usuario: 'Andrés Ríos', fecha: '2026-10-28' },
  { id: 'REC-1047', tipo: 'Recepción', referencia: 'OC-2212 · Café del Huila', estado: 'Validada', lineas: 4, escaneos: 9, usuario: 'Andrés Ríos', fecha: '2026-10-27' },
  { id: 'TRF-0152', tipo: 'Transferencia', referencia: 'Almacén Central → CT-MEZ', estado: 'Abierta', lineas: 3, escaneos: 5, usuario: 'Andrés Ríos', fecha: '2026-10-28' },
  { id: 'ENT-4510', tipo: 'Entrega', referencia: 'PED-7842 · Mercaldas Laureles', estado: 'Abierta', lineas: 2, escaneos: 1, usuario: 'Juliana Ospina', fecha: '2026-10-28' },
  { id: 'CNT-0921', tipo: 'Conteo', referencia: 'Cíclico zona UBI-A-01', estado: 'Aplicada', lineas: 12, escaneos: 28, usuario: 'Juliana Ospina', fecha: '2026-10-28' },
  { id: 'FAB-3210', tipo: 'Fabricación', referencia: 'OF-3210 · Arepas', estado: 'Abierta', lineas: 3, escaneos: 7, usuario: 'Verónica Salas', fecha: '2026-10-28' },
];

/* ------------------- Entregas por escáner (CAP-14) ------------------------ */

export interface PedidoEntrega {
  id: string;
  cliente: string;
  fecha: string;
  lineas: number;
  estado: 'En preparación' | 'Confirmado' | 'Despachado';
}

export const PEDIDOS_ENTREGA: PedidoEntrega[] = [
  { id: 'PED-7841', cliente: 'Mercaldas La 65', fecha: '2026-10-28', lineas: 3, estado: 'En preparación' },
  { id: 'PED-7842', cliente: 'Mercaldas Laureles', fecha: '2026-10-28', lineas: 1, estado: 'En preparación' },
  { id: 'PED-7843', cliente: 'Mercaldas Itagüí', fecha: '2026-10-28', lineas: 2, estado: 'En preparación' },
  { id: 'PED-7839', cliente: 'Mercaldas Envigado', fecha: '2026-10-27', lineas: 3, estado: 'Despachado' },
];

export interface LineaEntrega {
  id: string;
  pedido: string;
  producto: string;
  cantidad: number;
  paquete: string;
  escaneado: boolean;
}

export const LINEAS_ENTREGA: LineaEntrega[] = [
  { id: 'LIN-01', pedido: 'PED-7841', producto: 'Arepa de maíz x12', cantidad: 240, paquete: '003770123456789011', escaneado: true },
  { id: 'LIN-02', pedido: 'PED-7841', producto: 'Queso campesino 500 g', cantidad: 96, paquete: '003770123456789024', escaneado: false },
  { id: 'LIN-03', pedido: 'PED-7841', producto: 'Panela redonda 400 g', cantidad: 120, paquete: '—', escaneado: false },
  { id: 'LIN-04', pedido: 'PED-7842', producto: 'Café molido 250 g', cantidad: 180, paquete: '003770123456789037', escaneado: true },
  { id: 'LIN-05', pedido: 'PED-7843', producto: 'Yogurt griego 170 g', cantidad: 300, paquete: '—', escaneado: false },
  { id: 'LIN-06', pedido: 'PED-7843', producto: 'Chocolate de mesa 250 g', cantidad: 150, paquete: '—', escaneado: false },
];

/* ------------------- Fabricación por escáner (CAP-18) --------------------- */

export interface OrdenFabricacionCAP {
  id: string;
  producto: string;
  cantidad: number;
  estado: 'Planificada' | 'Liberada' | 'En proceso' | 'Cerrada';
}

export const ORDENES_FABRICACION: OrdenFabricacionCAP[] = [
  { id: 'OF-3210', producto: 'Arepa de maíz x12', cantidad: 3400, estado: 'En proceso' },
  { id: 'OF-3212', producto: 'Queso campesino 500 g', cantidad: 1100, estado: 'En proceso' },
  { id: 'OF-3214', producto: 'Café molido 250 g', cantidad: 1450, estado: 'Liberada' },
  { id: 'OF-3216', producto: 'Chocolate de mesa 250 g', cantidad: 1050, estado: 'Planificada' },
];

export interface ComponenteFabricacion {
  id: string;
  orden: string;
  material: string;
  cantidad: number;
  unidad: string;
  escaneado: boolean;
}

export const COMPONENTES_FABRICACION: ComponenteFabricacion[] = [
  { id: 'COM-01', orden: 'OF-3210', material: 'Harina de maíz precocida', cantidad: 1560, unidad: 'kg', escaneado: true },
  { id: 'COM-02', orden: 'OF-3210', material: 'Queso rallado', cantidad: 210, unidad: 'kg', escaneado: true },
  { id: 'COM-03', orden: 'OF-3210', material: 'Sal yodada', cantidad: 32, unidad: 'kg', escaneado: false },
  { id: 'COM-04', orden: 'OF-3212', material: 'Leche entera pasteurizada', cantidad: 3200, unidad: 'L', escaneado: true },
  { id: 'COM-05', orden: 'OF-3212', material: 'Cuajo líquido', cantidad: 16, unidad: 'L', escaneado: false },
  { id: 'COM-06', orden: 'OF-3214', material: 'Café tostado en grano', cantidad: 900, unidad: 'kg', escaneado: false },
];

/* --------------------------- Etiquetas (CAP-19) --------------------------- */

export interface EtiquetaCAP {
  id: string;
  tipo: 'Producto' | 'Lote' | 'Serie' | 'Paquete' | 'Ubicación';
  referencia: string;
  formato: string;
  cantidad: number;
  fecha: string;
  estado: 'Impresas' | 'Pendientes' | 'Error';
}

export const ETIQUETAS: EtiquetaCAP[] = [
  { id: 'ETQ-01', tipo: 'Producto', referencia: 'Arepa de maíz x12 (7701234000011)', formato: 'EAN-13 60×40 mm', cantidad: 1500, fecha: '2026-10-28', estado: 'Impresas' },
  { id: 'ETQ-02', tipo: 'Lote', referencia: 'L-2026-118', formato: 'Lote 50×30 mm', cantidad: 240, fecha: '2026-10-28', estado: 'Impresas' },
  { id: 'ETQ-03', tipo: 'Paquete', referencia: 'SSCC 003770123456789011', formato: 'SSCC-18 100×150 mm', cantidad: 12, fecha: '2026-10-28', estado: 'Pendientes' },
  { id: 'ETQ-04', tipo: 'Ubicación', referencia: 'UBI-A-01-03', formato: 'Ubicación 40×25 mm', cantidad: 60, fecha: '2026-10-27', estado: 'Impresas' },
  { id: 'ETQ-05', tipo: 'Serie', referencia: 'SN-77421 (MEZ-03)', formato: 'Serie 30×15 mm', cantidad: 1, fecha: '2026-10-27', estado: 'Error' },
];

/* ------------------------ Dispositivos (CAP-20) --------------------------- */

export interface DispositivoCAP {
  id: string;
  nombre: string;
  tipo: 'Escáner' | 'Impresora' | 'Báscula' | 'Terminal';
  ubicacion: string;
  estado: 'Conectado' | 'Desconectado' | 'Mantenimiento';
  ultimaSincro: string;
}

export const DISPOSITIVOS: DispositivoCAP[] = [
  { id: 'DSV-01', nombre: 'Escáner Zebra DS2208', tipo: 'Escáner', ubicacion: 'Almacén Central', estado: 'Conectado', ultimaSincro: 'Hace 1 min' },
  { id: 'DSV-02', nombre: 'Impresora Zebra ZT411', tipo: 'Impresora', ubicacion: 'Línea de empaque', estado: 'Conectado', ultimaSincro: 'Hace 4 min' },
  { id: 'DSV-03', nombre: 'Báscula Mettler ICS425', tipo: 'Báscula', ubicacion: 'Recepción', estado: 'Conectado', ultimaSincro: 'Hace 30 s' },
  { id: 'DSV-04', nombre: 'Terminal Honeywell CT40', tipo: 'Terminal', ubicacion: 'CT-REF', estado: 'Desconectado', ultimaSincro: 'Hace 2 h' },
  { id: 'DSV-05', nombre: 'Báscula Ohaus Defender', tipo: 'Báscula', ubicacion: 'CT-MEZ', estado: 'Mantenimiento', ultimaSincro: 'Hace 5 h' },
];

/* ------------------- Interpretación de códigos (CAP-04/05) ---------------- */

export interface ResultadoInterpretacion {
  ok: boolean;
  tipo?: string;
  valor?: string;
  base?: string;
  formato?: string;
  error?: string;
}

function fechaGs1(aammdd: string): string {
  const aa = aammdd.slice(0, 2);
  const mm = aammdd.slice(2, 4);
  const dd = aammdd.slice(4, 6);
  return `${dd}/${mm}/20${aa}`;
}

/** Convierte un código escaneado en tipo, valor, base y formato (CAP-04). */
export function interpretarCodigo(codigo: string): ResultadoInterpretacion {
  const c = codigo.trim();
  if (!c) return { ok: false, error: 'Ingrese un código para interpretar.' };
  if (/^01\d{14}$/.test(c)) return { ok: true, tipo: 'Producto', valor: c.slice(2), base: 'GTIN-14', formato: 'GS1-128 · AI 01' };
  if (/^\d{13}$/.test(c)) return { ok: true, tipo: 'Producto', valor: c, base: 'EAN-13', formato: 'EAN-13' };
  if (/^00\d{18}$/.test(c)) return { ok: true, tipo: 'Paquete', valor: c.slice(2), base: 'SSCC-18', formato: 'GS1-128 · AI 00' };
  if (/^10[A-Za-z0-9]{1,20}$/.test(c)) return { ok: true, tipo: 'Lote', valor: c.slice(2), base: c.slice(2), formato: 'GS1-128 · AI 10' };
  if (/^21[A-Za-z0-9]{1,20}$/.test(c)) return { ok: true, tipo: 'Serie', valor: c.slice(2), base: c.slice(2), formato: 'GS1-128 · AI 21' };
  if (/^414\d{10,13}$/.test(c)) return { ok: true, tipo: 'Ubicación', valor: c.slice(3), base: 'GLN-13', formato: 'GS1-128 · AI 414' };
  if (/^417\d{10,13}$/.test(c)) return { ok: true, tipo: 'Contacto', valor: c.slice(3), base: 'GLN-13', formato: 'GS1-128 · AI 417' };
  if (/^310[0-5]\d{6}$/.test(c)) {
    const dec = Number(c[3]);
    const peso = Number(c.slice(4)) / 10 ** dec;
    return { ok: true, tipo: 'Peso', valor: `${fmtNum(peso)} kg`, base: 'Peso neto', formato: 'GS1-128 · AI 310x' };
  }
  if (/^11\d{6}$/.test(c)) return { ok: true, tipo: 'Fecha', valor: fechaGs1(c.slice(2)), base: 'Fecha de producción', formato: 'GS1-128 · AI 11' };
  if (/^17\d{6}$/.test(c)) return { ok: true, tipo: 'Fecha', valor: fechaGs1(c.slice(2)), base: 'Fecha de vencimiento', formato: 'GS1-128 · AI 17' };
  if (/^37\d{1,8}$/.test(c)) return { ok: true, tipo: 'Cantidad', valor: c.slice(2), base: 'Unidades', formato: 'GS1-128 · AI 37' };
  return { ok: false, error: `El código «${c}» no coincide con ninguna regla de la nomenclatura activa. Revise el patrón o agregue una regla.` };
}

/* ------------------- Validación de formatos (CAP-11) ---------------------- */

/** Dígito de control GS1: alterna pesos 1/3 desde la izquierda del cuerpo. */
export function digitoControl(body: string): number {
  let suma = 0;
  for (let i = 0; i < body.length; i++) {
    suma += Number(body[i]) * (i % 2 === 0 ? 1 : 3);
  }
  // El dígito de control continúa la alternancia en la posición siguiente.
  return body.length % 2 === 0 ? (10 - (suma % 10)) % 10 : (10 - ((suma * 7) % 10)) % 10;
}

export interface ResultadoValidacion {
  ok: boolean;
  tipo: string;
  mensaje: string;
}

/** Valida EAN-13, GTIN-14 y SSCC-18 incluyendo su dígito de control. */
export function validarCodigoBarras(codigo: string): ResultadoValidacion {
  const limpio = codigo.trim();
  if (!/^\d+$/.test(limpio)) return { ok: false, tipo: '—', mensaje: 'El código debe contener solo dígitos.' };
  if (limpio.length !== 13 && limpio.length !== 14 && limpio.length !== 18) {
    return { ok: false, tipo: '—', mensaje: `Longitud ${limpio.length} no corresponde a EAN-13, GTIN-14 ni SSCC-18.` };
  }
  const tipo = limpio.length === 13 ? 'EAN-13' : limpio.length === 14 ? 'GTIN-14' : 'SSCC-18';
  const body = limpio.slice(0, -1);
  const leido = Number(limpio[limpio.length - 1]);
  const esperado = digitoControl(body);
  if (esperado !== leido) {
    return { ok: false, tipo, mensaje: `Dígito de control inválido: se esperaba ${esperado} y se leyó ${leido}.` };
  }
  return { ok: true, tipo, mensaje: `Formato ${tipo} válido con dígito de control ${leido}.` };
}

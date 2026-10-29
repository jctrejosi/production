// Datos de demostración del módulo INV (Inventario y almacenes).
// Sin fetch: la página trabaja con estas listas en estado local.

/* ------------------------------ Configuración ------------------------------ */

export interface Almacen {
  id: string;
  codigo: string;
  nombre: string;
  direccion: string;
  calendario: string;
  pasosRecepcion: string;
  pasosEntrega: string;
  rutaDefecto: string;
  estado: 'Activo' | 'Inactivo';
}

export const ALMACENES: Almacen[] = [
  { id: 'A1', codigo: 'ALM-CEN', nombre: 'Central de Manizales', direccion: 'Cra. 23 # 65-08, Manizales', calendario: 'L-V 6:00-22:00 · S 7:00-14:00', pasosRecepcion: 'Recibir → Control de calidad → Almacenar', pasosEntrega: 'Preparar → Empacar → Despachar', rutaDefecto: 'R-COM', estado: 'Activo' },
  { id: 'A2', codigo: 'ALM-MAT', nombre: 'Materias primas', direccion: 'Zona Industrial Juanchito, Km 2', calendario: 'L-S 5:30-21:00', pasosRecepcion: 'Recibir → Inspección → Ubicar', pasosEntrega: 'Reservar → Entregar', rutaDefecto: 'R-COM', estado: 'Activo' },
  { id: 'A3', codigo: 'ALM-PT', nombre: 'Producto terminado', direccion: 'Bodega Norte, Av. Santander # 44-12', calendario: 'L-D 6:00-20:00', pasosRecepcion: 'Recibir de producción → Ubicar por fecha', pasosEntrega: 'Picking → Empacar → Despachar', rutaDefecto: 'R-FAB', estado: 'Activo' },
  { id: 'A4', codigo: 'ALM-DEV', nombre: 'Devoluciones y cuarentena', direccion: 'Bodega Central, sótano 1', calendario: 'L-V 8:00-18:00', pasosRecepcion: 'Recibir → Clasificar → Cuarentena', pasosEntrega: 'Reintegrar → Liberar', rutaDefecto: 'R-RES', estado: 'Activo' },
  { id: 'A5', codigo: 'ALM-TRA', nombre: 'Tránsito (virtual)', direccion: 'No físico — mercancía en ruta', calendario: '24/7', pasosRecepcion: 'Registrar salida en origen', pasosEntrega: 'Registrar llegada a destino', rutaDefecto: 'R-EDI', estado: 'Activo' },
];

export const TIPOS_UBICACION = ['Interna', 'Virtual', 'Proveedor', 'Cliente', 'Pérdidas', 'Producción', 'Tránsito'] as const;
export type TipoUbicacion = (typeof TIPOS_UBICACION)[number];

export interface Ubicacion {
  id: string;
  codigo: string;
  nombre: string;
  tipo: TipoUbicacion;
  almacen: string;
  capacidad: number;
  estrategia: string;
  frecuenciaInventario: string;
}

export const UBICACIONES: Ubicacion[] = [
  { id: 'U1', codigo: 'EST-01', nombre: 'Estantería A1 — sólidos', tipo: 'Interna', almacen: 'ALM-CEN', capacidad: 500, estrategia: 'FIFO', frecuenciaInventario: 'Mensual' },
  { id: 'U2', codigo: 'EST-02', nombre: 'Estantería A2 — graneles', tipo: 'Interna', almacen: 'ALM-CEN', capacidad: 400, estrategia: 'FEFO', frecuenciaInventario: 'Mensual' },
  { id: 'U3', codigo: 'ZFR-01', nombre: 'Zona fría 1 (2-8 °C)', tipo: 'Interna', almacen: 'ALM-MAT', capacidad: 300, estrategia: 'FEFO', frecuenciaInventario: 'Semanal' },
  { id: 'U4', codigo: 'EST-03', nombre: 'Estantería B1 — terminados', tipo: 'Interna', almacen: 'ALM-PT', capacidad: 800, estrategia: 'FIFO', frecuenciaInventario: 'Semanal' },
  { id: 'U5', codigo: 'PRD-01', nombre: 'Salida de producción', tipo: 'Producción', almacen: 'ALM-PT', capacidad: 1000, estrategia: 'FIFO', frecuenciaInventario: '—' },
  { id: 'U6', codigo: 'PRV-01', nombre: 'Ubicación proveedor (virtual)', tipo: 'Proveedor', almacen: 'ALM-TRA', capacidad: 0, estrategia: '—', frecuenciaInventario: '—' },
  { id: 'U7', codigo: 'CLI-01', nombre: 'Ubicación cliente (virtual)', tipo: 'Cliente', almacen: 'ALM-TRA', capacidad: 0, estrategia: '—', frecuenciaInventario: '—' },
  { id: 'U8', codigo: 'PER-01', nombre: 'Pérdidas y mermas', tipo: 'Pérdidas', almacen: 'ALM-CEN', capacidad: 100, estrategia: 'LIFO', frecuenciaInventario: 'Mensual' },
  { id: 'U9', codigo: 'TRA-01', nombre: 'En tránsito', tipo: 'Tránsito', almacen: 'ALM-TRA', capacidad: 0, estrategia: '—', frecuenciaInventario: '—' },
];

export interface TipoOperacion {
  id: string;
  codigo: string;
  nombre: string;
  prefijo: string;
  ubicacionDefecto: string;
  politicaReserva: string;
  etiqueta: string;
  impresion: 'Automática' | 'Manual';
}

export const TIPOS_OPERACION: TipoOperacion[] = [
  { id: 'T1', codigo: 'REC', nombre: 'Recepción', prefijo: 'REC-', ubicacionDefecto: 'EST-01', politicaReserva: 'Ninguna', etiqueta: 'Informe de recepción', impresion: 'Automática' },
  { id: 'T2', codigo: 'ENT', nombre: 'Entrega', prefijo: 'ENT-', ubicacionDefecto: 'CLI-01', politicaReserva: 'Reservar al confirmar', etiqueta: 'Albarán', impresion: 'Manual' },
  { id: 'T3', codigo: 'TRA', nombre: 'Transferencia interna', prefijo: 'TRA-', ubicacionDefecto: 'EST-01', politicaReserva: 'Manual', etiqueta: 'Ubicación', impresion: 'Manual' },
  { id: 'T4', codigo: 'PRD', nombre: 'Producción', prefijo: 'PRD-', ubicacionDefecto: 'PRD-01', politicaReserva: 'Ninguna', etiqueta: 'Lote', impresion: 'Automática' },
  { id: 'T5', codigo: 'EDI', nombre: 'Entrega directa', prefijo: 'EDI-', ubicacionDefecto: 'PRV-01', politicaReserva: 'Sin reserva', etiqueta: 'Albarán', impresion: 'Automática' },
  { id: 'T6', codigo: 'AJU', nombre: 'Ajuste de inventario', prefijo: 'AJU-', ubicacionDefecto: 'PER-01', politicaReserva: 'Ninguna', etiqueta: 'Informe de conteo', impresion: 'Manual' },
];

export interface Ruta {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'Compra' | 'Fabricación' | 'Fabricación bajo pedido' | 'Entrega directa' | 'Reabastecimiento entre almacenes';
  aplicaA: string;
  pasos: string;
}

export const RUTAS: Ruta[] = [
  { id: 'R1', codigo: 'R-COM', nombre: 'Compra', tipo: 'Compra', aplicaA: 'Categoría Materias primas', pasos: 'Compra → Recepción → Almacenar' },
  { id: 'R2', codigo: 'R-FAB', nombre: 'Fabricación', tipo: 'Fabricación', aplicaA: 'Categoría Producto terminado', pasos: 'Producción → Almacenar → Entregar' },
  { id: 'R3', codigo: 'R-MTO', nombre: 'Fabricación bajo pedido', tipo: 'Fabricación bajo pedido', aplicaA: 'Productos especiales', pasos: 'Venta → OP → Almacenar → Entregar' },
  { id: 'R4', codigo: 'R-EDI', nombre: 'Entrega directa', tipo: 'Entrega directa', aplicaA: 'Proveedores homologados', pasos: 'Compra → Proveedor → Cliente' },
  { id: 'R5', codigo: 'R-RES', nombre: 'Reabastecimiento entre almacenes', tipo: 'Reabastecimiento entre almacenes', aplicaA: 'ALM-CEN, ALM-MAT y ALM-PT', pasos: 'Extracción → Tránsito → Recepción' },
];

export interface ReglaAbastecimiento {
  id: string;
  tipo: 'Extracción' | 'Empuje' | 'Combinación';
  metodo: string;
  plazoDias: number;
  origen: string;
  destino: string;
  tipoOperacion: string;
}

export const REGLAS_ABASTECIMIENTO: ReglaAbastecimiento[] = [
  { id: 'RA1', tipo: 'Extracción', metodo: 'Tomar de stock', plazoDias: 0, origen: 'ALM-CEN', destino: 'EST-01', tipoOperacion: 'ENT' },
  { id: 'RA2', tipo: 'Empuje', metodo: 'Generar otra operación', plazoDias: 2, origen: 'PRV-01', destino: 'ALM-MAT', tipoOperacion: 'REC' },
  { id: 'RA3', tipo: 'Combinación', metodo: 'Tomar de stock y generar si no hay disponibilidad', plazoDias: 1, origen: 'ALM-MAT', destino: 'PRD-01', tipoOperacion: 'TRA' },
  { id: 'RA4', tipo: 'Extracción', metodo: 'Tomar de stock', plazoDias: 0, origen: 'ALM-PT', destino: 'CLI-01', tipoOperacion: 'ENT' },
  { id: 'RA5', tipo: 'Empuje', metodo: 'Generar otra operación', plazoDias: 3, origen: 'ALM-MAT', destino: 'ALM-CEN', tipoOperacion: 'TRA' },
  { id: 'RA6', tipo: 'Combinación', metodo: 'Tomar de stock y generar si no hay disponibilidad', plazoDias: 1, origen: 'ALM-CEN', destino: 'ALM-DEV', tipoOperacion: 'TRA' },
];

export interface ReglaUbicacion {
  id: string;
  criterio: string;
  valor: string;
  empaque: string;
  destino: string;
  sububicacion: string;
}

export const REGLAS_UBICACION: ReglaUbicacion[] = [
  { id: 'RU1', criterio: 'Producto', valor: 'MP-001', empaque: 'Caja', destino: 'EST-01', sububicacion: 'Por lote' },
  { id: 'RU2', criterio: 'Categoría', valor: 'Lácteos', empaque: 'Palé', destino: 'ZFR-01', sububicacion: 'Por caducidad' },
  { id: 'RU3', criterio: 'Producto', valor: 'MP-004', empaque: 'Saco', destino: 'EST-02', sububicacion: 'Por lote' },
  { id: 'RU4', criterio: 'Producto', valor: 'PT-101', empaque: 'Caja', destino: 'EST-03', sububicacion: 'Por fecha' },
  { id: 'RU5', criterio: 'Categoría', valor: 'Empaques', empaque: 'Caja', destino: 'EST-02', sububicacion: 'Por SKU' },
];

export interface CategoriaAlmacenamiento {
  id: string;
  codigo: string;
  nombre: string;
  pesoMaxKg: number;
  volumenMaxM3: number;
  mezclar: boolean;
}

export const CATEGORIAS_ALMACENAMIENTO: CategoriaAlmacenamiento[] = [
  { id: 'C1', codigo: 'CAT-01', nombre: 'Líquidos', pesoMaxKg: 800, volumenMaxM3: 2.5, mezclar: false },
  { id: 'C2', codigo: 'CAT-02', nombre: 'Sólidos a granel', pesoMaxKg: 2000, volumenMaxM3: 8, mezclar: false },
  { id: 'C3', codigo: 'CAT-03', nombre: 'Fríos (2-8 °C)', pesoMaxKg: 500, volumenMaxM3: 3, mezclar: true },
  { id: 'C4', codigo: 'CAT-04', nombre: 'Empaques', pesoMaxKg: 300, volumenMaxM3: 4, mezclar: true },
  { id: 'C5', codigo: 'CAT-05', nombre: 'Producto terminado', pesoMaxKg: 1200, volumenMaxM3: 10, mezclar: true },
];

export interface TipoPaquete {
  id: string;
  codigo: string;
  nombre: string;
  dimensiones: string;
  pesoKg: number;
  pesoMaxKg: number;
  uso: string;
}

export const TIPOS_PAQUETE: TipoPaquete[] = [
  { id: 'P1', codigo: 'CJ', nombre: 'Caja estándar', dimensiones: '40×30×25 cm', pesoKg: 0.4, pesoMaxKg: 15, uso: 'Unidad de picking' },
  { id: 'P2', codigo: 'SC', nombre: 'Saco 25 kg', dimensiones: '60×90 cm', pesoKg: 0.1, pesoMaxKg: 25, uso: 'Granel' },
  { id: 'P3', codigo: 'PL', nombre: 'Palé europeo', dimensiones: '120×100×15 cm', pesoKg: 22, pesoMaxKg: 1000, uso: 'Almacenamiento' },
  { id: 'P4', codigo: 'CN', nombre: 'Contenedor 20 ft', dimensiones: '590×235×239 cm', pesoKg: 2200, pesoMaxKg: 24000, uso: 'Tránsito y exportación' },
  { id: 'P5', codigo: 'BN', nombre: 'Bolsa de detalle', dimensiones: '20×30 cm', pesoKg: 0.01, pesoMaxKg: 5, uso: 'Empaque final' },
];

export interface EstrategiaRetiro {
  id: string;
  nombre: string;
  descripcion: string;
  ambitos: string;
  activa: boolean;
}

export const ESTRATEGIAS_RETIRO: EstrategiaRetiro[] = [
  { id: 'E1', nombre: 'FIFO', descripcion: 'Primero en entrar, primero en salir', ambitos: 'EST-01, EST-03', activa: true },
  { id: 'E2', nombre: 'LIFO', descripcion: 'Último en entrar, primero en salir', ambitos: 'PER-01', activa: true },
  { id: 'E3', nombre: 'FEFO', descripcion: 'Primero en caducar, primero en salir', ambitos: 'ZFR-01, EST-02', activa: true },
  { id: 'E4', nombre: 'Ubicación más cercana', descripcion: 'Retira de la ubicación más próxima al picking', ambitos: 'ALM-CEN', activa: true },
  { id: 'E5', nombre: 'Menor cantidad de paquetes', descripcion: 'Retira donde haya menos paquetes abiertos', ambitos: 'ALM-MAT', activa: false },
];

export interface Nomenclatura {
  id: string;
  tipo: string;
  patron: string;
  prioridad: number;
  validacion: string;
  ejemplo: string;
}

export const NOMENCLATURAS: Nomenclatura[] = [
  { id: 'N1', tipo: 'Producto', patron: 'MP-\\d{3} | PT-\\d{3}', prioridad: 1, validacion: 'Existe en catálogo', ejemplo: 'MP-001' },
  { id: 'N2', tipo: 'Peso', patron: '(24|25|26)\\d{12}', prioridad: 2, validacion: 'Checksum GS1 EAN-13', ejemplo: '2500000001234' },
  { id: 'N3', tipo: 'Ubicación', patron: '[A-Z]{3}-\\d{2}', prioridad: 3, validacion: 'Ubicación activa', ejemplo: 'EST-01' },
  { id: 'N4', tipo: 'Lote', patron: 'L\\d{6}', prioridad: 4, validacion: 'Fecha del lote (YYMM)', ejemplo: 'L2503A' },
  { id: 'N5', tipo: 'Paquete', patron: 'PK\\d{6}', prioridad: 5, validacion: 'Código único', ejemplo: 'PK000123' },
  { id: 'N6', tipo: 'Contacto (SSCC)', patron: '(00)\\d{18}', prioridad: 6, validacion: 'Dígito verificador', ejemplo: '00377001234567890123' },
];

/* -------------------------------- Operación -------------------------------- */

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  udm: string;
  costo: number;
  trazado: 'Lote' | 'Serie' | 'Ninguno';
}

export const PRODUCTOS: Producto[] = [
  { id: 'PR1', codigo: 'MP-001', nombre: 'Harina de trigo', categoria: 'Materias primas', udm: 'kg', costo: 2850, trazado: 'Lote' },
  { id: 'PR2', codigo: 'MP-002', nombre: 'Azúcar refinada', categoria: 'Materias primas', udm: 'kg', costo: 3400, trazado: 'Lote' },
  { id: 'PR3', codigo: 'MP-003', nombre: 'Leche entera UHT', categoria: 'Lácteos', udm: 'L', costo: 2200, trazado: 'Lote' },
  { id: 'PR4', codigo: 'MP-004', nombre: 'Cacao en polvo', categoria: 'Materias primas', udm: 'kg', costo: 18500, trazado: 'Lote' },
  { id: 'PR5', codigo: 'PT-101', nombre: 'Pan tajado blanco 500 g', categoria: 'Panadería', udm: 'un', costo: 4800, trazado: 'Lote' },
  { id: 'PR6', codigo: 'PT-102', nombre: 'Galletas de soda 250 g', categoria: 'Galletería', udm: 'un', costo: 3900, trazado: 'Lote' },
  { id: 'PR7', codigo: 'PT-103', nombre: 'Chocolate de mesa 60 %', categoria: 'Confitería', udm: 'un', costo: 7200, trazado: 'Lote' },
  { id: 'PR8', codigo: 'EQ-101', nombre: 'Motor bomba 2 HP', categoria: 'Equipos', udm: 'un', costo: 1250000, trazado: 'Serie' },
];

export interface Proveedor {
  id: string;
  nombre: string;
  nit: string;
  ciudad: string;
  plazoPago: string;
  productos: string[];
  calificacion: number;
}

export const PROVEEDORES: Proveedor[] = [
  { id: 'PV1', nombre: 'Proinsumos Andinos', nit: '900.123.456-7', ciudad: 'Bogotá', plazoPago: '30 días', productos: ['MP-001', 'MP-004'], calificacion: 4.6 },
  { id: 'PV2', nombre: 'Azúcar del Valle', nit: '890.234.567-8', ciudad: 'Cali', plazoPago: '15 días', productos: ['MP-002'], calificacion: 4.8 },
  { id: 'PV3', nombre: 'Lácteos La Pradera', nit: '901.345.678-9', ciudad: 'Medellín', plazoPago: '8 días', productos: ['MP-003'], calificacion: 4.2 },
  { id: 'PV4', nombre: 'Cacao Selva SAS', nit: '900.456.789-0', ciudad: 'Villavicencio', plazoPago: '30 días', productos: ['MP-004'], calificacion: 4.4 },
  { id: 'PV5', nombre: 'Empaques Flexibles', nit: '890.567.890-1', ciudad: 'Manizales', plazoPago: '15 días', productos: ['Empaques'], calificacion: 4.7 },
];

export interface Recepcion {
  id: string;
  numero: string;
  proveedor: string;
  fecha: string;
  ubicacion: string;
  lineas: number;
  cantidad: number;
  udm: string;
  estado: 'Pendiente' | 'Parcial' | 'Recibida' | 'Control de calidad';
}

export const RECEPCIONES: Recepcion[] = [
  { id: 'RC1', numero: 'REC-00091', proveedor: 'Proinsumos Andinos', fecha: '2026-10-21', ubicacion: 'EST-01', lineas: 4, cantidad: 1250, udm: 'kg', estado: 'Recibida' },
  { id: 'RC2', numero: 'REC-00092', proveedor: 'Azúcar del Valle', fecha: '2026-10-22', ubicacion: 'EST-01', lineas: 2, cantidad: 840, udm: 'kg', estado: 'Recibida' },
  { id: 'RC3', numero: 'REC-00093', proveedor: 'Lácteos La Pradera', fecha: '2026-10-23', ubicacion: 'ZFR-01', lineas: 3, cantidad: 450, udm: 'L', estado: 'Parcial' },
  { id: 'RC4', numero: 'REC-00094', proveedor: 'Cacao Selva SAS', fecha: '2026-10-24', ubicacion: 'EST-02', lineas: 1, cantidad: 100, udm: 'kg', estado: 'Control de calidad' },
  { id: 'RC5', numero: 'REC-00095', proveedor: 'Empaques Flexibles', fecha: '2026-10-25', ubicacion: 'EST-02', lineas: 5, cantidad: 320, udm: 'un', estado: 'Pendiente' },
  { id: 'RC6', numero: 'REC-00096', proveedor: 'Proinsumos Andinos', fecha: '2026-10-26', ubicacion: 'EST-01', lineas: 2, cantidad: 150, udm: 'kg', estado: 'Pendiente' },
];

export interface Entrega {
  id: string;
  numero: string;
  cliente: string;
  fecha: string;
  cantidad: number;
  udm: string;
  estado: 'Reservada' | 'Preparada' | 'Empacada' | 'Entregada' | 'Parcial';
}

export const ENTREGAS: Entrega[] = [
  { id: 'EN1', numero: 'ENT-00510', cliente: 'Supermercados La 14', fecha: '2026-10-27', cantidad: 350, udm: 'un', estado: 'Parcial' },
  { id: 'EN2', numero: 'ENT-00511', cliente: 'Tiendas Ara', fecha: '2026-10-27', cantidad: 1200, udm: 'un', estado: 'Empacada' },
  { id: 'EN3', numero: 'ENT-00512', cliente: 'Éxito Manizales', fecha: '2026-10-28', cantidad: 200, udm: 'un', estado: 'Preparada' },
  { id: 'EN4', numero: 'ENT-00513', cliente: 'Distribuidora Andina', fecha: '2026-10-28', cantidad: 500, udm: 'un', estado: 'Reservada' },
  { id: 'EN5', numero: 'ENT-00514', cliente: 'Panadería La Espiga', fecha: '2026-10-29', cantidad: 80, udm: 'un', estado: 'Reservada' },
  { id: 'EN6', numero: 'ENT-00515', cliente: 'Tiendas D1', fecha: '2026-10-29', cantidad: 1500, udm: 'un', estado: 'Reservada' },
];

export interface Transferencia {
  id: string;
  numero: string;
  origen: string;
  destino: string;
  producto: string;
  cantidad: number;
  udm: string;
  lote: string;
  paquete: string;
  responsable: string;
  estado: 'Borrador' | 'Preparada' | 'En tránsito' | 'Hecha';
}

export const TRANSFERENCIAS: Transferencia[] = [
  { id: 'TR1', numero: 'TRA-00320', origen: 'EST-01', destino: 'ZFR-01', producto: 'MP-003', cantidad: 120, udm: 'L', lote: 'L2505C', paquete: 'PK000125', responsable: 'Diego Salazar', estado: 'En tránsito' },
  { id: 'TR2', numero: 'TRA-00321', origen: 'ZFR-01', destino: 'EST-01', producto: 'MP-001', cantidad: 300, udm: 'kg', lote: 'L2503A', paquete: 'PK000123', responsable: 'Diego Salazar', estado: 'Preparada' },
  { id: 'TR3', numero: 'TRA-00322', origen: 'EST-03', destino: 'CLI-01', producto: 'PT-101', cantidad: 350, udm: 'un', lote: 'L2510E', paquete: 'PK000127', responsable: 'Laura Cano', estado: 'Hecha' },
  { id: 'TR4', numero: 'TRA-00323', origen: 'EST-01', destino: 'PRD-01', producto: 'MP-001', cantidad: 500, udm: 'kg', lote: 'L2503A', paquete: 'PK000123', responsable: 'Mateo Ríos', estado: 'Borrador' },
  { id: 'TR5', numero: 'TRA-00324', origen: 'ZFR-01', destino: 'PRD-01', producto: 'MP-003', cantidad: 250, udm: 'L', lote: 'L2505C', paquete: 'PK000125', responsable: 'Mateo Ríos', estado: 'Borrador' },
  { id: 'TR6', numero: 'TRA-00325', origen: 'EST-02', destino: 'PER-01', producto: 'MP-004', cantidad: 12, udm: 'kg', lote: 'L2502D', paquete: 'PK000126', responsable: 'Camila Vargas', estado: 'Hecha' },
];

export interface TransferenciaAgrupada {
  id: string;
  numero: string;
  transferencias: string[];
  responsable: string;
  creada: string;
  avance: number;
  estado: 'En preparación' | 'Lista' | 'Ejecutada';
}

export const TRANSFERENCIAS_AGRUPADAS: TransferenciaAgrupada[] = [
  { id: 'GR1', numero: 'GRP-0007', transferencias: ['TRA-00321', 'TRA-00323'], responsable: 'Diego Salazar', creada: '2026-10-27', avance: 50, estado: 'En preparación' },
  { id: 'GR2', numero: 'GRP-0008', transferencias: ['TRA-00324'], responsable: 'Mateo Ríos', creada: '2026-10-27', avance: 100, estado: 'Lista' },
  { id: 'GR3', numero: 'GRP-0009', transferencias: ['TRA-00322', 'TRA-00325'], responsable: 'Camila Vargas', creada: '2026-10-26', avance: 100, estado: 'Ejecutada' },
  { id: 'GR4', numero: 'GRP-0010', transferencias: ['TRA-00320'], responsable: 'Diego Salazar', creada: '2026-10-28', avance: 25, estado: 'En preparación' },
];

export interface Reserva {
  id: string;
  producto: string;
  fisica: number;
  reservada: number;
  comprometida: number;
  fechaPrometida: string;
  documento: string;
}

export const RESERVAS: Reserva[] = [
  { id: 'RS1', producto: 'PT-101', fisica: 2300, reservada: 350, comprometida: 120, fechaPrometida: '2026-10-29', documento: 'ENT-00510' },
  { id: 'RS2', producto: 'PT-102', fisica: 1150, reservada: 0, comprometida: 300, fechaPrometida: '2026-10-30', documento: 'ENT-00511' },
  { id: 'RS3', producto: 'MP-001', fisica: 1250, reservada: 200, comprometida: 60, fechaPrometida: '2026-10-28', documento: 'PRD-014' },
  { id: 'RS4', producto: 'MP-002', fisica: 520, reservada: 120, comprometida: 0, fechaPrometida: '—', documento: '—' },
  { id: 'RS5', producto: 'MP-003', fisica: 300, reservada: 60, comprometida: 40, fechaPrometida: '2026-10-28', documento: 'PRD-014' },
  { id: 'RS6', producto: 'PT-103', fisica: 400, reservada: 0, comprometida: 25, fechaPrometida: '2026-11-02', documento: 'ENT-00512' },
];

export interface Pendiente {
  id: string;
  numero: string;
  documento: string;
  producto: string;
  demanda: number;
  atendido: number;
  fechaLimite: string;
  estado: 'Abierto' | 'Cerrado';
}

export const PENDIENTES: Pendiente[] = [
  { id: 'PN1', numero: 'PEN-00012', documento: 'ENT-00510', producto: 'PT-101', demanda: 500, atendido: 350, fechaLimite: '2026-10-30', estado: 'Abierto' },
  { id: 'PN2', numero: 'PEN-00013', documento: 'REC-00093', producto: 'MP-003', demanda: 700, atendido: 450, fechaLimite: '2026-10-31', estado: 'Abierto' },
  { id: 'PN3', numero: 'PEN-00014', documento: 'ENT-00512', producto: 'PT-103', demanda: 200, atendido: 100, fechaLimite: '2026-11-02', estado: 'Abierto' },
  { id: 'PN4', numero: 'PEN-00015', documento: 'ENT-00511', producto: 'PT-102', demanda: 1200, atendido: 1200, fechaLimite: '2026-10-30', estado: 'Cerrado' },
  { id: 'PN5', numero: 'PEN-00016', documento: 'ENT-00513', producto: 'PT-101', demanda: 500, atendido: 0, fechaLimite: '2026-11-01', estado: 'Abierto' },
];

export interface Devolucion {
  id: string;
  numero: string;
  documento: string;
  origen: 'Cliente' | 'Proveedor';
  producto: string;
  cantidad: number;
  udm: string;
  motivo: string;
  intercambio: boolean;
  estado: 'Recibida' | 'En tránsito' | 'Aplicada';
}

export const DEVOLUCIONES: Devolucion[] = [
  { id: 'DV1', numero: 'DEV-00021', documento: 'ENT-00514', origen: 'Cliente', producto: 'PT-101', cantidad: 12, udm: 'un', motivo: 'Producto aplastado', intercambio: true, estado: 'Recibida' },
  { id: 'DV2', numero: 'DEV-00022', documento: 'REC-00092', origen: 'Proveedor', producto: 'MP-002', cantidad: 40, udm: 'kg', motivo: 'Humedad en sacos', intercambio: false, estado: 'En tránsito' },
  { id: 'DV3', numero: 'DEV-00023', documento: 'ENT-00510', origen: 'Cliente', producto: 'PT-102', cantidad: 8, udm: 'un', motivo: 'Embalaje roto', intercambio: true, estado: 'Recibida' },
  { id: 'DV4', numero: 'DEV-00024', documento: 'ENT-00515', origen: 'Cliente', producto: 'PT-101', cantidad: 60, udm: 'un', motivo: 'Fecha corta', intercambio: false, estado: 'Aplicada' },
  { id: 'DV5', numero: 'DEV-00025', documento: 'REC-00094', origen: 'Proveedor', producto: 'MP-004', cantidad: 15, udm: 'kg', motivo: 'Fuera de especificación', intercambio: false, estado: 'Aplicada' },
];

export interface Division {
  id: string;
  numero: string;
  origenTransferencia: string;
  producto: string;
  cantidad: number;
  udm: string;
  motivo: string;
  estado: 'Borrador' | 'Preparada';
}

export const DIVISIONES: Division[] = [
  { id: 'DI1', numero: 'TRA-00326', origenTransferencia: 'TRA-00323', producto: 'MP-001', cantidad: 300, udm: 'kg', motivo: 'Prioridad panadería', estado: 'Preparada' },
  { id: 'DI2', numero: 'TRA-00327', origenTransferencia: 'TRA-00323', producto: 'MP-001', cantidad: 200, udm: 'kg', motivo: 'Reposición galletería', estado: 'Borrador' },
  { id: 'DI3', numero: 'TRA-00328', origenTransferencia: 'TRA-00324', producto: 'MP-003', cantidad: 150, udm: 'L', motivo: 'Pedido UHT urgente', estado: 'Preparada' },
  { id: 'DI4', numero: 'TRA-00329', origenTransferencia: 'TRA-00324', producto: 'MP-003', cantidad: 100, udm: 'L', motivo: 'Stock de respaldo', estado: 'Borrador' },
];

export interface Paquete {
  id: string;
  codigo: string;
  tipo: string;
  contenido: string;
  cantidad: number;
  udm: string;
  ubicacion: string;
  anidadoEn: string;
  estado: 'Abierto' | 'Cerrado' | 'En tránsito';
}

export const PAQUETES: Paquete[] = [
  { id: 'PK1', codigo: 'PK000123', tipo: 'CJ', contenido: 'MP-001', cantidad: 240, udm: 'kg', ubicacion: 'EST-01', anidadoEn: '—', estado: 'Cerrado' },
  { id: 'PK2', codigo: 'PK000124', tipo: 'SC', contenido: 'MP-002', cantidad: 25, udm: 'kg', ubicacion: 'EST-01', anidadoEn: '—', estado: 'Cerrado' },
  { id: 'PK3', codigo: 'PK000125', tipo: 'CJ', contenido: 'MP-003', cantidad: 48, udm: 'L', ubicacion: 'ZFR-01', anidadoEn: '—', estado: 'Abierto' },
  { id: 'PK4', codigo: 'PK000126', tipo: 'SC', contenido: 'MP-004', cantidad: 25, udm: 'kg', ubicacion: 'EST-02', anidadoEn: '—', estado: 'Cerrado' },
  { id: 'PK5', codigo: 'PK000127', tipo: 'PL', contenido: 'PT-101', cantidad: 420, udm: 'un', ubicacion: 'EST-03', anidadoEn: 'PK000130', estado: 'Cerrado' },
  { id: 'PK6', codigo: 'PK000130', tipo: 'CN', contenido: 'PT-103', cantidad: 320, udm: 'un', ubicacion: 'TRA-01', anidadoEn: '—', estado: 'En tránsito' },
];

export interface Movimiento {
  id: string;
  fecha: string;
  producto: string;
  cantidad: number;
  udm: string;
  origen: string;
  destino: string;
  lote: string;
  paquete: string;
  propietario: 'Propio' | 'Tercero';
  documento: string;
  responsable: string;
  tipo: 'Entrada' | 'Salida' | 'Interno';
}

export const MOVIMIENTOS: Movimiento[] = [
  { id: 'M1', fecha: '2026-10-21', producto: 'MP-001', cantidad: 1250, udm: 'kg', origen: 'PRV-01', destino: 'EST-01', lote: 'L2503A', paquete: 'PK000123', propietario: 'Propio', documento: 'REC-00091', responsable: 'Diego Salazar', tipo: 'Entrada' },
  { id: 'M2', fecha: '2026-10-22', producto: 'MP-002', cantidad: 840, udm: 'kg', origen: 'PRV-01', destino: 'EST-01', lote: 'L2504B', paquete: 'PK000124', propietario: 'Propio', documento: 'REC-00092', responsable: 'Laura Cano', tipo: 'Entrada' },
  { id: 'M3', fecha: '2026-10-23', producto: 'MP-003', cantidad: 450, udm: 'L', origen: 'PRV-01', destino: 'ZFR-01', lote: 'L2505C', paquete: 'PK000125', propietario: 'Propio', documento: 'REC-00093', responsable: 'Laura Cano', tipo: 'Entrada' },
  { id: 'M4', fecha: '2026-10-24', producto: 'PT-101', cantidad: 350, udm: 'un', origen: 'EST-03', destino: 'CLI-01', lote: 'L2510E', paquete: 'PK000127', propietario: 'Propio', documento: 'ENT-00510', responsable: 'Mateo Ríos', tipo: 'Salida' },
  { id: 'M5', fecha: '2026-10-25', producto: 'MP-001', cantidad: 500, udm: 'kg', origen: 'EST-01', destino: 'PRD-01', lote: 'L2503A', paquete: 'PK000123', propietario: 'Propio', documento: 'PRD-014', responsable: 'Mateo Ríos', tipo: 'Salida' },
  { id: 'M6', fecha: '2026-10-26', producto: 'PT-101', cantidad: 620, udm: 'un', origen: 'PRD-01', destino: 'EST-03', lote: 'L2510E', paquete: 'PK000127', propietario: 'Propio', documento: 'PRD-014', responsable: 'Camila Vargas', tipo: 'Entrada' },
  { id: 'M7', fecha: '2026-10-27', producto: 'MP-004', cantidad: 12, udm: 'kg', origen: 'EST-02', destino: 'PER-01', lote: 'L2502D', paquete: 'PK000126', propietario: 'Propio', documento: 'AJU-00018', responsable: 'Camila Vargas', tipo: 'Salida' },
  { id: 'M8', fecha: '2026-10-27', producto: 'PT-102', cantidad: 8, udm: 'un', origen: 'EST-03', destino: 'EST-03', lote: 'L2510F', paquete: 'PK000128', propietario: 'Propio', documento: 'DEV-00023', responsable: 'Laura Cano', tipo: 'Interno' },
];

export interface EtiquetaDoc {
  id: string;
  tipo: string;
  descripcion: string;
  impresionAutomatica: boolean;
}

export const ETIQUETAS: EtiquetaDoc[] = [
  { id: 'ET1', tipo: 'Producto', descripcion: 'Código + descripción comercial', impresionAutomatica: true },
  { id: 'ET2', tipo: 'Lote', descripcion: 'Lote + fecha de caducidad', impresionAutomatica: true },
  { id: 'ET3', tipo: 'Serie', descripcion: 'Número de serie único', impresionAutomatica: true },
  { id: 'ET4', tipo: 'Paquete', descripcion: 'SSCC + contenido del paquete', impresionAutomatica: false },
  { id: 'ET5', tipo: 'Ubicación', descripcion: 'Código + tipo de ubicación', impresionAutomatica: false },
  { id: 'ET6', tipo: 'Albarán', descripcion: 'Documento de entrega o recepción', impresionAutomatica: true },
  { id: 'ET7', tipo: 'Informe de recepción', descripcion: 'Cantidades recibidas vs. pedidas', impresionAutomatica: true },
];

/* ------------------------ Existencias y ajustes ------------------------ */

export interface Existencia {
  id: string;
  producto: string;
  ubicacion: string;
  lote: string;
  paquete: string;
  propietario: 'Propio' | 'Tercero';
  fisica: number;
  reservada: number;
}

export const EXISTENCIAS: Existencia[] = [
  { id: 'EX1', producto: 'MP-001', ubicacion: 'EST-01', lote: 'L2503A', paquete: 'PK000123', propietario: 'Propio', fisica: 1250, reservada: 200 },
  { id: 'EX2', producto: 'MP-002', ubicacion: 'EST-01', lote: 'L2504B', paquete: 'PK000124', propietario: 'Propio', fisica: 520, reservada: 120 },
  { id: 'EX3', producto: 'MP-003', ubicacion: 'ZFR-01', lote: 'L2505C', paquete: 'PK000125', propietario: 'Propio', fisica: 300, reservada: 60 },
  { id: 'EX4', producto: 'MP-004', ubicacion: 'EST-02', lote: 'L2502D', paquete: 'PK000126', propietario: 'Propio', fisica: 95, reservada: 0 },
  { id: 'EX5', producto: 'PT-101', ubicacion: 'EST-03', lote: 'L2510E', paquete: 'PK000127', propietario: 'Propio', fisica: 2300, reservada: 350 },
  { id: 'EX6', producto: 'PT-102', ubicacion: 'EST-03', lote: 'L2510F', paquete: 'PK000128', propietario: 'Propio', fisica: 1150, reservada: 0 },
  { id: 'EX7', producto: 'PT-103', ubicacion: 'EST-03', lote: 'L2511G', paquete: 'PK000129', propietario: 'Tercero', fisica: 400, reservada: 0 },
  { id: 'EX8', producto: 'EQ-101', ubicacion: 'EST-02', lote: 'SN-0041', paquete: 'PK000130', propietario: 'Propio', fisica: 3, reservada: 1 },
];

export interface InventarioFisico {
  id: string;
  numero: string;
  ubicacion: string;
  fecha: string;
  responsable: string;
  sistema: number;
  contado: number;
  estado: 'Abierto' | 'Ajustado' | 'Cerrado';
}

export const INVENTARIOS_FISICOS: InventarioFisico[] = [
  { id: 'IF1', numero: 'INV-00031', ubicacion: 'EST-01', fecha: '2026-10-15', responsable: 'Laura Cano', sistema: 1250, contado: 1248, estado: 'Ajustado' },
  { id: 'IF2', numero: 'INV-00032', ubicacion: 'ZFR-01', fecha: '2026-10-16', responsable: 'Laura Cano', sistema: 620, contado: 620, estado: 'Cerrado' },
  { id: 'IF3', numero: 'INV-00033', ubicacion: 'EST-02', fecha: '2026-10-18', responsable: 'Diego Salazar', sistema: 95, contado: 92, estado: 'Abierto' },
  { id: 'IF4', numero: 'INV-00034', ubicacion: 'EST-03', fecha: '2026-10-20', responsable: 'Camila Vargas', sistema: 3450, contado: 3447, estado: 'Ajustado' },
];

export interface InventarioCiclico {
  id: string;
  ubicacion: string;
  frecuencia: string;
  dias: number;
  ultima: string;
  proxima: string;
  responsable: string;
  estado: 'Al día' | 'Por contar' | 'Atrasado';
}

export const INVENTARIOS_CICLICOS: InventarioCiclico[] = [
  { id: 'IC1', ubicacion: 'EST-01', frecuencia: 'Mensual', dias: 30, ultima: '2026-10-15', proxima: '2026-11-14', responsable: 'Laura Cano', estado: 'Al día' },
  { id: 'IC2', ubicacion: 'EST-02', frecuencia: 'Mensual', dias: 30, ultima: '2026-10-18', proxima: '2026-11-17', responsable: 'Diego Salazar', estado: 'Al día' },
  { id: 'IC3', ubicacion: 'ZFR-01', frecuencia: 'Semanal', dias: 7, ultima: '2026-10-23', proxima: '2026-10-30', responsable: 'Laura Cano', estado: 'Por contar' },
  { id: 'IC4', ubicacion: 'EST-03', frecuencia: 'Semanal', dias: 7, ultima: '2026-10-20', proxima: '2026-10-27', responsable: 'Camila Vargas', estado: 'Atrasado' },
  { id: 'IC5', ubicacion: 'PRD-01', frecuencia: 'Anual (respaldo)', dias: 365, ultima: '2026-01-05', proxima: '2027-01-05', responsable: 'Mateo Ríos', estado: 'Al día' },
];

export interface Reubicacion {
  id: string;
  numero: string;
  producto: string;
  cantidad: number;
  udm: string;
  desde: string;
  hacia: string;
  motivo: string;
  responsable: string;
  fecha: string;
}

export const REUBICACIONES: Reubicacion[] = [
  { id: 'RE1', numero: 'REU-00141', producto: 'MP-001', cantidad: 180, udm: 'kg', desde: 'EST-01', hacia: 'EST-02', motivo: 'Consolidación de lote', responsable: 'Diego Salazar', fecha: '2026-10-25' },
  { id: 'RE2', numero: 'REU-00142', producto: 'MP-003', cantidad: 90, udm: 'L', desde: 'ZFR-01', hacia: 'EST-02', motivo: 'Optimización de frío', responsable: 'Laura Cano', fecha: '2026-10-26' },
  { id: 'RE3', numero: 'REU-00143', producto: 'MP-004', cantidad: 30, udm: 'kg', desde: 'EST-02', hacia: 'PER-01', motivo: 'Sacos dañados', responsable: 'Camila Vargas', fecha: '2026-10-27' },
  { id: 'RE4', numero: 'REU-00144', producto: 'PT-101', cantidad: 300, udm: 'un', desde: 'EST-03', hacia: 'EST-01', motivo: 'Picking rápido', responsable: 'Mateo Ríos', fecha: '2026-10-28' },
];

export interface Desecho {
  id: string;
  numero: string;
  producto: string;
  cantidad: number;
  udm: string;
  lote: string;
  motivo: string;
  reponer: boolean;
  responsable: string;
  fecha: string;
  estado: 'Registrado' | 'Aprobado' | 'Repuesto';
}

export const DESECHOS: Desecho[] = [
  { id: 'DE1', numero: 'DES-00021', producto: 'MP-004', cantidad: 12, udm: 'kg', lote: 'L2502D', motivo: 'Fuera de especificación', reponer: true, responsable: 'Camila Vargas', fecha: '2026-10-27', estado: 'Aprobado' },
  { id: 'DE2', numero: 'DES-00022', producto: 'PT-101', cantidad: 18, udm: 'un', lote: 'L2510E', motivo: 'Aplastado en bodega', reponer: false, responsable: 'Mateo Ríos', fecha: '2026-10-25', estado: 'Registrado' },
  { id: 'DE3', numero: 'DES-00023', producto: 'MP-003', cantidad: 25, udm: 'L', lote: 'L2505C', motivo: 'Caducado', reponer: true, responsable: 'Laura Cano', fecha: '2026-10-26', estado: 'Aprobado' },
  { id: 'DE4', numero: 'DES-00024', producto: 'MP-001', cantidad: 10, udm: 'kg', lote: 'L2503A', motivo: 'Contaminación cruzada', reponer: true, responsable: 'Diego Salazar', fecha: '2026-10-28', estado: 'Registrado' },
];

export interface Valoracion {
  id: string;
  producto: string;
  metodo: 'Estándar' | 'Promedio' | 'FIFO';
  costo: number;
  cantidad: number;
  valor: number;
}

export const VALORACION: Valoracion[] = [
  { id: 'VA1', producto: 'MP-001', metodo: 'Promedio', costo: 2850, cantidad: 1250, valor: 3562500 },
  { id: 'VA2', producto: 'MP-002', metodo: 'Promedio', costo: 3400, cantidad: 520, valor: 1768000 },
  { id: 'VA3', producto: 'MP-003', metodo: 'FIFO', costo: 2200, cantidad: 300, valor: 660000 },
  { id: 'VA4', producto: 'MP-004', metodo: 'FIFO', costo: 18500, cantidad: 95, valor: 1757500 },
  { id: 'VA5', producto: 'PT-101', metodo: 'Estándar', costo: 4800, cantidad: 2300, valor: 11040000 },
  { id: 'VA6', producto: 'PT-102', metodo: 'Estándar', costo: 3900, cantidad: 1150, valor: 4485000 },
  { id: 'VA7', producto: 'PT-103', metodo: 'Estándar', costo: 7200, cantidad: 400, valor: 2880000 },
  { id: 'VA8', producto: 'EQ-101', metodo: 'Promedio', costo: 1250000, cantidad: 3, valor: 3750000 },
];

export interface CostoImportacion {
  id: string;
  recepcion: string;
  proveedor: string;
  valorBase: number;
  flete: number;
  seguro: number;
  arancel: number;
  otros: number;
  metodoReparto: 'Igual' | 'Cantidad' | 'Costo actual' | 'Peso' | 'Volumen' | '—';
  estado: 'Pendiente' | 'Repartido';
}

export const COSTOS_IMPORTACION: CostoImportacion[] = [
  { id: 'CI1', recepcion: 'REC-00091', proveedor: 'Proinsumos Andinos', valorBase: 8900000, flete: 450000, seguro: 120000, arancel: 890000, otros: 60000, metodoReparto: 'Cantidad', estado: 'Repartido' },
  { id: 'CI2', recepcion: 'REC-00094', proveedor: 'Cacao Selva SAS', valorBase: 1850000, flete: 380000, seguro: 90000, arancel: 220000, otros: 0, metodoReparto: 'Peso', estado: 'Pendiente' },
  { id: 'CI3', recepcion: 'REC-00092', proveedor: 'Azúcar del Valle', valorBase: 2856000, flete: 210000, seguro: 55000, arancel: 0, otros: 25000, metodoReparto: 'Igual', estado: 'Repartido' },
  { id: 'CI4', recepcion: 'REC-00093', proveedor: 'Lácteos La Pradera', valorBase: 1540000, flete: 0, seguro: 0, arancel: 0, otros: 0, metodoReparto: '—', estado: 'Pendiente' },
];

export interface EntregaDirecta {
  id: string;
  numero: string;
  proveedor: string;
  cliente: string;
  producto: string;
  cantidad: number;
  udm: string;
  fecha: string;
  estado: 'Programada' | 'Confirmada' | 'Facturada';
}

export const ENTREGAS_DIRECTAS: EntregaDirecta[] = [
  { id: 'ED1', numero: 'EDI-00012', proveedor: 'Empaques Flexibles', cliente: 'Panadería La Espiga', producto: 'Bolsa laminada 500 g', cantidad: 5000, udm: 'un', fecha: '2026-10-26', estado: 'Confirmada' },
  { id: 'ED2', numero: 'EDI-00013', proveedor: 'Cacao Selva SAS', cliente: 'Chocolates La Cima', producto: 'Cacao en polvo 60 %', cantidad: 300, udm: 'kg', fecha: '2026-10-29', estado: 'Programada' },
  { id: 'ED3', numero: 'EDI-00014', proveedor: 'Lácteos La Pradera', cliente: 'Cafetería Alma', producto: 'Leche UHT 1 L', cantidad: 240, udm: 'L', fecha: '2026-10-27', estado: 'Facturada' },
  { id: 'ED4', numero: 'EDI-00015', proveedor: 'Azúcar del Valle', cliente: 'Dulces Andinos', producto: 'Azúcar refinada', cantidad: 500, udm: 'kg', fecha: '2026-11-02', estado: 'Programada' },
];

export interface Consignacion {
  id: string;
  propietario: string;
  producto: string;
  cantidad: number;
  udm: string;
  ubicacion: string;
  valor: number;
  estado: 'En consignación' | 'Vendida' | 'Devuelta';
}

export const CONSIGNACIONES: Consignacion[] = [
  { id: 'CN1', propietario: 'Chocolates La Cima', producto: 'PT-103', cantidad: 400, udm: 'un', ubicacion: 'EST-03', valor: 2880000, estado: 'En consignación' },
  { id: 'CN2', propietario: 'Distribuidora Andina', producto: 'PT-102', cantidad: 600, udm: 'un', ubicacion: 'EST-03', valor: 2340000, estado: 'En consignación' },
  { id: 'CN3', propietario: 'Empaques Flexibles', producto: 'Bolsa laminada', cantidad: 25000, udm: 'un', ubicacion: 'EST-02', valor: 1250000, estado: 'En consignación' },
  { id: 'CN4', propietario: 'Panadería La Espiga', producto: 'PT-101', cantidad: 150, udm: 'un', ubicacion: 'EST-01', valor: 720000, estado: 'Vendida' },
];

/* ------------------------------ Trazabilidad ------------------------------ */

export interface LoteSerie {
  id: string;
  codigo: string;
  tipo: 'Lote' | 'Serie';
  producto: string;
  origen: string;
  caducidad: string;
  consumoPreferente: string;
  retirada: string;
  alertaDias: number;
  ubicacion: string;
  cantidad: number;
  udm: string;
  estado: 'Disponible' | 'Reservado' | 'Cuarentena' | 'Vencido';
}

export const LOTES_SERIES: LoteSerie[] = [
  { id: 'LS1', codigo: 'L2503A', tipo: 'Lote', producto: 'MP-001', origen: 'REC-00091', caducidad: '2026-12-21', consumoPreferente: '2026-11-21', retirada: '2026-12-14', alertaDias: 30, ubicacion: 'EST-01', cantidad: 1250, udm: 'kg', estado: 'Disponible' },
  { id: 'LS2', codigo: 'L2504B', tipo: 'Lote', producto: 'MP-002', origen: 'REC-00092', caducidad: '2027-03-15', consumoPreferente: '2027-02-15', retirada: '2027-03-08', alertaDias: 60, ubicacion: 'EST-01', cantidad: 520, udm: 'kg', estado: 'Disponible' },
  { id: 'LS3', codigo: 'L2505C', tipo: 'Lote', producto: 'MP-003', origen: 'REC-00093', caducidad: '2026-11-05', consumoPreferente: '2026-10-30', retirada: '2026-10-29', alertaDias: 15, ubicacion: 'ZFR-01', cantidad: 300, udm: 'L', estado: 'Disponible' },
  { id: 'LS4', codigo: 'L2502D', tipo: 'Lote', producto: 'MP-004', origen: 'REC-00094', caducidad: '2026-11-20', consumoPreferente: '2026-10-20', retirada: '2026-11-13', alertaDias: 20, ubicacion: 'EST-02', cantidad: 95, udm: 'kg', estado: 'Cuarentena' },
  { id: 'LS5', codigo: 'L2510E', tipo: 'Lote', producto: 'PT-101', origen: 'PRD-014', caducidad: '2026-11-18', consumoPreferente: '2026-11-10', retirada: '2026-11-11', alertaDias: 7, ubicacion: 'EST-03', cantidad: 2300, udm: 'un', estado: 'Disponible' },
  { id: 'LS6', codigo: 'L2510F', tipo: 'Lote', producto: 'PT-102', origen: 'PRD-015', caducidad: '2026-12-05', consumoPreferente: '2026-11-28', retirada: '2026-11-28', alertaDias: 7, ubicacion: 'EST-03', cantidad: 1150, udm: 'un', estado: 'Disponible' },
  { id: 'LS7', codigo: 'L2511G', tipo: 'Lote', producto: 'PT-103', origen: 'PRD-016', caducidad: '2026-12-30', consumoPreferente: '2026-12-20', retirada: '2026-12-23', alertaDias: 15, ubicacion: 'EST-03', cantidad: 400, udm: 'un', estado: 'Disponible' },
  { id: 'LS8', codigo: 'SN-0041', tipo: 'Serie', producto: 'EQ-101', origen: 'REC-00095', caducidad: '—', consumoPreferente: '—', retirada: '—', alertaDias: 0, ubicacion: 'EST-02', cantidad: 1, udm: 'un', estado: 'Reservado' },
];

export interface ReferenciaDocumental {
  id: string;
  codigo: string;
  nombre: string;
  documentos: string[];
  proposito: string;
  creada: string;
}

export const REFERENCIAS_DOCUMENTALES: ReferenciaDocumental[] = [
  { id: 'RF1', codigo: 'REF-AUD-018', nombre: 'Auditoría inventario octubre', documentos: ['INV-00031', 'INV-00034', 'AJU-00018'], proposito: 'Soporte de auditoría externa', creada: '2026-10-21' },
  { id: 'RF2', codigo: 'REF-PRD-014', nombre: 'Consumo OP-014', documentos: ['PRD-014', 'TRA-00323', 'REC-00091'], proposito: 'Trazabilidad de consumo', creada: '2026-10-25' },
  { id: 'RF3', codigo: 'REF-ENT-0510', nombre: 'Entrega parcial ENT-00510', documentos: ['ENT-00510', 'DEV-00023', 'PEN-00012'], proposito: 'Seguimiento de pendientes', creada: '2026-10-27' },
  { id: 'RF4', codigo: 'REF-REC-0093', nombre: 'Recepción parcial Lácteos', documentos: ['REC-00093', 'PEN-00013'], proposito: 'Reclamación a proveedor', creada: '2026-10-24' },
];

/* ---------------------------- Reabastecimiento ---------------------------- */

export interface PuntoPedido {
  id: string;
  producto: string;
  ubicacion: string;
  minimo: number;
  maximo: number;
  consumoDiario: number;
  plazoDias: number;
  ruta: string;
  cantidadPedir: number;
}

export const PUNTOS_PEDIDO: PuntoPedido[] = [
  { id: 'PP1', producto: 'MP-001', ubicacion: 'EST-01', minimo: 500, maximo: 2000, consumoDiario: 85, plazoDias: 3, ruta: 'R-COM', cantidadPedir: 255 },
  { id: 'PP2', producto: 'MP-002', ubicacion: 'EST-01', minimo: 400, maximo: 1500, consumoDiario: 55, plazoDias: 2, ruta: 'R-COM', cantidadPedir: 110 },
  { id: 'PP3', producto: 'MP-003', ubicacion: 'ZFR-01', minimo: 250, maximo: 900, consumoDiario: 40, plazoDias: 2, ruta: 'R-COM', cantidadPedir: 80 },
  { id: 'PP4', producto: 'MP-004', ubicacion: 'EST-02', minimo: 150, maximo: 400, consumoDiario: 12, plazoDias: 5, ruta: 'R-COM', cantidadPedir: 60 },
  { id: 'PP5', producto: 'PT-101', ubicacion: 'EST-03', minimo: 600, maximo: 3000, consumoDiario: 180, plazoDias: 1, ruta: 'R-FAB', cantidadPedir: 180 },
  { id: 'PP6', producto: 'PT-102', ubicacion: 'EST-03', minimo: 300, maximo: 1500, consumoDiario: 90, plazoDias: 1, ruta: 'R-FAB', cantidadPedir: 90 },
  { id: 'PP7', producto: 'PT-103', ubicacion: 'EST-03', minimo: 500, maximo: 1200, consumoDiario: 60, plazoDias: 1, ruta: 'R-RES', cantidadPedir: 60 },
  { id: 'PP8', producto: 'EQ-101', ubicacion: 'EST-02', minimo: 5, maximo: 20, consumoDiario: 0.5, plazoDias: 10, ruta: 'R-COM', cantidadPedir: 5 },
];

export interface Sugerencia {
  id: string;
  producto: string;
  disponible: number;
  minimo: number;
  sugerida: number;
  origen: string;
  accion: 'Comprar' | 'Fabricar' | 'Transferir';
  estado: 'Sugerida' | 'Aplicada';
}

export const SUGERENCIAS: Sugerencia[] = [
  { id: 'SG1', producto: 'MP-004', disponible: 95, minimo: 150, sugerida: 60, origen: 'Punto de pedido', accion: 'Comprar', estado: 'Sugerida' },
  { id: 'SG2', producto: 'MP-003', disponible: 240, minimo: 250, sugerida: 80, origen: 'Transferencia desde ALM-CEN', accion: 'Transferir', estado: 'Sugerida' },
  { id: 'SG3', producto: 'EQ-101', disponible: 2, minimo: 5, sugerida: 3, origen: 'Mantenimiento MNT-023', accion: 'Comprar', estado: 'Sugerida' },
  { id: 'SG4', producto: 'PT-101', disponible: 1950, minimo: 600, sugerida: 400, origen: 'Pedido ENT-00515', accion: 'Fabricar', estado: 'Sugerida' },
  { id: 'SG5', producto: 'PT-103', disponible: 400, minimo: 500, sugerida: 120, origen: 'Punto de pedido', accion: 'Transferir', estado: 'Aplicada' },
];

export interface Prevision {
  id: string;
  producto: string;
  fecha: string;
  entradas: number;
  salidas: number;
  stockProyectado: number;
  estado: 'OK' | 'Faltante' | 'Exceso';
}

export const PREVISION: Prevision[] = [
  { id: 'PV1', producto: 'MP-001', fecha: '2026-10-29', entradas: 0, salidas: 200, stockProyectado: 850, estado: 'OK' },
  { id: 'PV2', producto: 'MP-001', fecha: '2026-11-05', entradas: 500, salidas: 300, stockProyectado: 1050, estado: 'OK' },
  { id: 'PV3', producto: 'MP-003', fecha: '2026-10-30', entradas: 0, salidas: 250, stockProyectado: -10, estado: 'Faltante' },
  { id: 'PV4', producto: 'PT-101', fecha: '2026-10-30', entradas: 0, salidas: 1500, stockProyectado: 450, estado: 'OK' },
  { id: 'PV5', producto: 'PT-102', fecha: '2026-11-02', entradas: 600, salidas: 400, stockProyectado: 1350, estado: 'Exceso' },
  { id: 'PV6', producto: 'PT-103', fecha: '2026-11-04', entradas: 120, salidas: 200, stockProyectado: 320, estado: 'OK' },
];

export interface ReabastecimientoInterno {
  id: string;
  numero: string;
  origen: string;
  destino: string;
  producto: string;
  cantidad: number;
  udm: string;
  ruta: string;
  estado: 'Programado' | 'En tránsito' | 'Completado';
}

export const REABASTECIMIENTO_INTERNO: ReabastecimientoInterno[] = [
  { id: 'RI1', numero: 'RBA-00031', origen: 'ALM-CEN', destino: 'ALM-MAT', producto: 'MP-001', cantidad: 400, udm: 'kg', ruta: 'R-RES', estado: 'Programado' },
  { id: 'RI2', numero: 'RBA-00032', origen: 'ALM-CEN', destino: 'ALM-MAT', producto: 'MP-002', cantidad: 250, udm: 'kg', ruta: 'R-RES', estado: 'En tránsito' },
  { id: 'RI3', numero: 'RBA-00033', origen: 'ALM-PT', destino: 'ALM-CEN', producto: 'PT-101', cantidad: 300, udm: 'un', ruta: 'R-RES', estado: 'Completado' },
  { id: 'RI4', numero: 'RBA-00034', origen: 'ALM-MAT', destino: 'ALM-CEN', producto: 'MP-003', cantidad: 120, udm: 'L', ruta: 'R-RES', estado: 'Programado' },
];

export interface BajoPedido {
  id: string;
  documento: string;
  producto: string;
  cantidad: number;
  udm: string;
  fechaNecesidad: string;
  accion: 'Compra' | 'Producción';
  estado: 'Por disparar' | 'Disparada' | 'Recibida';
  referencia: string;
}

export const BAJO_PEDIDO: BajoPedido[] = [
  { id: 'BP1', documento: 'ENT-00515', producto: 'PT-101', cantidad: 1500, udm: 'un', fechaNecesidad: '2026-10-29', accion: 'Producción', estado: 'Disparada', referencia: 'OP-0142' },
  { id: 'BP2', documento: 'ENT-00512', producto: 'PT-103', cantidad: 200, udm: 'un', fechaNecesidad: '2026-10-28', accion: 'Compra', estado: 'Por disparar', referencia: '—' },
  { id: 'BP3', documento: 'MNT-023', producto: 'EQ-101', cantidad: 3, udm: 'un', fechaNecesidad: '2026-11-05', accion: 'Compra', estado: 'Disparada', referencia: 'OC-00331' },
  { id: 'BP4', documento: 'ENT-00513', producto: 'PT-101', cantidad: 500, udm: 'un', fechaNecesidad: '2026-11-01', accion: 'Producción', estado: 'Por disparar', referencia: '—' },
];

/* Rotación y antigüedad (análisis de movimientos, INV-41) */
export interface RotacionArticulo {
  producto: string;
  nombre: string;
  salidasPeriodo: number;
  stockPromedio: number;
  udm: string;
  coberturaDias: number;
  antiguedadDias: number;
  clasificacion: 'Alta' | 'Media' | 'Baja';
}

export const ROTACION: RotacionArticulo[] = [
  { producto: 'MP-001', nombre: 'Harina de trigo', salidasPeriodo: 4800, stockPromedio: 1200, udm: 'kg', coberturaDias: 9, antiguedadDias: 6, clasificacion: 'Alta' },
  { producto: 'MP-002', nombre: 'Azúcar refinada', salidasPeriodo: 2100, stockPromedio: 900, udm: 'kg', coberturaDias: 13, antiguedadDias: 11, clasificacion: 'Media' },
  { producto: 'MP-003', nombre: 'Leche entera UHT', salidasPeriodo: 850, stockPromedio: 640, udm: 'L', coberturaDias: 22, antiguedadDias: 19, clasificacion: 'Media' },
  { producto: 'MP-004', nombre: 'Cacao en polvo', salidasPeriodo: 260, stockPromedio: 210, udm: 'kg', coberturaDias: 24, antiguedadDias: 21, clasificacion: 'Baja' },
  { producto: 'PT-101', nombre: 'Pan tajado blanco 500 g', salidasPeriodo: 3200, stockPromedio: 460, udm: 'un', coberturaDias: 5, antiguedadDias: 3, clasificacion: 'Alta' },
  { producto: 'PT-102', nombre: 'Galletas de soda 250 g', salidasPeriodo: 980, stockPromedio: 520, udm: 'un', coberturaDias: 16, antiguedadDias: 14, clasificacion: 'Media' },
  { producto: 'PT-103', nombre: 'Chocolate de mesa 60 %', salidasPeriodo: 540, stockPromedio: 410, udm: 'un', coberturaDias: 28, antiguedadDias: 26, clasificacion: 'Baja' },
];

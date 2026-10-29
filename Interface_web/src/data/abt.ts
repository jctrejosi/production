// Datos de demostración del módulo ABT — Compras y abastecimiento.
// Tipos locales a este archivo (no editar src/types.ts). Todo en COP salvo
// indicación contraria. Fecha de referencia de la demo: 2026-10-28.

/* --------------------------------- Proveedores --------------------------------- */

export interface EvaluacionProveedor {
  entrega: number; // cumplimiento de entrega 0..1
  calidad: number; // 0..1
  precio: number; // 0..1
  respuesta: number; // capacidad de respuesta 0..1
}

export interface Proveedor {
  id: string;
  nit: string;
  nombre: string;
  ciudad: string;
  contacto: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
  evaluacion: EvaluacionProveedor;
}

export const PROVEEDORES: Proveedor[] = [
  { id: 'PRO-001', nit: '900.123.456-7', nombre: 'Harineras del Valle S.A.S.', ciudad: 'Cali', contacto: 'Andrés Caicedo', email: 'compras@harinerasdelvalle.co', telefono: '+57 300 123 4567', estado: 'Activo', evaluacion: { entrega: 0.92, calidad: 0.95, precio: 0.8, respuesta: 0.9 } },
  { id: 'PRO-002', nit: '901.234.567-8', nombre: 'Ingenio Risaralda S.A.', ciudad: 'Pereira', contacto: 'Lucía Marín', email: 'ventas@ingeniorisaralda.com', telefono: '+57 310 234 5678', estado: 'Activo', evaluacion: { entrega: 0.78, calidad: 0.9, precio: 0.85, respuesta: 0.82 } },
  { id: 'PRO-003', nit: '800.345.678-9', nombre: 'Grasas y Aceites del Cauca S.A.', ciudad: 'Popayán', contacto: 'Jorge Zúñiga', email: 'pedidos@grasasdelcauca.com', telefono: '+57 320 345 6789', estado: 'Activo', evaluacion: { entrega: 0.85, calidad: 0.82, precio: 0.88, respuesta: 0.75 } },
  { id: 'PRO-004', nit: '890.456.789-0', nombre: 'Convertidora Andina S.A.S.', ciudad: 'Medellín', contacto: 'Paula Escobar', email: 'comercial@convertidoraandina.co', telefono: '+57 300 456 7890', estado: 'Activo', evaluacion: { entrega: 0.95, calidad: 0.93, precio: 0.79, respuesta: 0.91 } },
  { id: 'PRO-005', nit: '901.567.890-1', nombre: 'Rodamientos Industriales Bogotá Ltda.', ciudad: 'Bogotá D.C.', contacto: 'Hernán Silva', email: 'ventas@rodindustriales.com', telefono: '+57 310 567 8901', estado: 'Activo', evaluacion: { entrega: 0.96, calidad: 0.97, precio: 0.74, respuesta: 0.88 } },
  { id: 'PRO-006', nit: '900.678.901-2', nombre: 'Logística Fría Express S.A.S.', ciudad: 'Barranquilla', contacto: 'María Torres', email: 'operaciones@friaexpress.co', telefono: '+57 315 678 9012', estado: 'Activo', evaluacion: { entrega: 0.81, calidad: 0.86, precio: 0.77, respuesta: 0.93 } },
  { id: 'PRO-007', nit: '805.789.012-3', nombre: 'Técnicos Industriales S.A.S.', ciudad: 'Bucaramanga', contacto: 'Óscar León', email: 'servicios@tecnicosindustriales.com', telefono: '+57 318 789 0123', estado: 'Inactivo', evaluacion: { entrega: 0.62, calidad: 0.58, precio: 0.7, respuesta: 0.55 } },
];

/* --------------------------- Catálogo de productos ---------------------------- */

export type ControlArticulo = 'Cantidad' | 'Lote' | 'Serie';
export type PoliticaFacturacion = 'Por recepción' | 'Por pedido' | 'Sin recepción';

export interface ProductoComprable {
  id: string;
  codigo: string;
  nombre: string;
  um: string;
  empaque: string;
  categoria: string;
  control: ControlArticulo;
  recepcionObligatoria: boolean;
  politicaFacturacion: PoliticaFacturacion;
  proveedoresAdmitidos: string[];
}

export const PRODUCTOS_COMPRABLES: ProductoComprable[] = [
  { id: 'MP-0001', codigo: 'MP-0001', nombre: 'Harina de trigo panadera', um: 'Bulto', empaque: 'Bulto 50 kg', categoria: 'Materia prima', control: 'Lote', recepcionObligatoria: true, politicaFacturacion: 'Por recepción', proveedoresAdmitidos: ['PRO-001', 'PRO-002'] },
  { id: 'MP-0002', codigo: 'MP-0002', nombre: 'Azúcar refinada', um: 'Bulto', empaque: 'Bulto 50 kg', categoria: 'Materia prima', control: 'Lote', recepcionObligatoria: true, politicaFacturacion: 'Por recepción', proveedoresAdmitidos: ['PRO-002', 'PRO-003'] },
  { id: 'MP-0003', codigo: 'MP-0003', nombre: 'Manteca vegetal', um: 'Caja', empaque: 'Caja 20 kg', categoria: 'Materia prima', control: 'Lote', recepcionObligatoria: true, politicaFacturacion: 'Por recepción', proveedoresAdmitidos: ['PRO-003'] },
  { id: 'IN-0001', codigo: 'IN-0001', nombre: 'Etiquetas adhesivas 80 g', um: 'Rollo', empaque: 'Rollo 1.000 etq.', categoria: 'Insumo de empaque', control: 'Cantidad', recepcionObligatoria: true, politicaFacturacion: 'Por recepción', proveedoresAdmitidos: ['PRO-004'] },
  { id: 'IN-0002', codigo: 'IN-0002', nombre: 'Empaque laminado BOPP', um: 'Rollo', empaque: 'Rollo 40 kg', categoria: 'Insumo de empaque', control: 'Cantidad', recepcionObligatoria: true, politicaFacturacion: 'Por recepción', proveedoresAdmitidos: ['PRO-004'] },
  { id: 'RP-0001', codigo: 'RP-0001', nombre: 'Rodamiento 6204-2RS', um: 'Unidad', empaque: 'Caja 10 und', categoria: 'Repuestos', control: 'Cantidad', recepcionObligatoria: true, politicaFacturacion: 'Por recepción', proveedoresAdmitidos: ['PRO-005'] },
  { id: 'SV-0001', codigo: 'SV-0001', nombre: 'Transporte refrigerado', um: 'Servicio', empaque: 'Viaje', categoria: 'Servicios', control: 'Cantidad', recepcionObligatoria: false, politicaFacturacion: 'Por pedido', proveedoresAdmitidos: ['PRO-006'] },
  { id: 'SV-0002', codigo: 'SV-0002', nombre: 'Mantenimiento preventivo compresor', um: 'Servicio', empaque: 'Visita', categoria: 'Servicios', control: 'Cantidad', recepcionObligatoria: false, politicaFacturacion: 'Por pedido', proveedoresAdmitidos: ['PRO-007'] },
];

/* --------------------------- Condiciones y tarifas ----------------------------- */

export interface CondicionTarifa {
  id: string;
  proveedorId: string;
  productoId: string;
  precio: number;
  cantidadMinima: number;
  plazoEntregaDias: number;
  moneda: 'COP' | 'USD';
  vigenciaDesde: string;
  vigenciaHasta: string;
  descuentoPct: number;
  codigoProveedor: string;
  prioridad: number; // 1 = mayor prioridad
}

export const CONDICIONES_TARIFAS: CondicionTarifa[] = [
  { id: 'CT-0001', proveedorId: 'PRO-001', productoId: 'MP-0001', precio: 87000, cantidadMinima: 50, plazoEntregaDias: 12, moneda: 'COP', vigenciaDesde: '2026-01-01', vigenciaHasta: '2026-12-31', descuentoPct: 2, codigoProveedor: 'HAR-50', prioridad: 1 },
  { id: 'CT-0002', proveedorId: 'PRO-002', productoId: 'MP-0001', precio: 89000, cantidadMinima: 40, plazoEntregaDias: 18, moneda: 'COP', vigenciaDesde: '2026-01-01', vigenciaHasta: '2026-12-31', descuentoPct: 1.5, codigoProveedor: 'HT-PAN', prioridad: 2 },
  { id: 'CT-0003', proveedorId: 'PRO-002', productoId: 'MP-0002', precio: 118000, cantidadMinima: 30, plazoEntregaDias: 10, moneda: 'COP', vigenciaDesde: '2026-06-01', vigenciaHasta: '2026-11-30', descuentoPct: 3, codigoProveedor: 'AZU-50', prioridad: 1 },
  { id: 'CT-0004', proveedorId: 'PRO-003', productoId: 'MP-0002', precio: 121000, cantidadMinima: 25, plazoEntregaDias: 14, moneda: 'COP', vigenciaDesde: '2026-01-01', vigenciaHasta: '2026-12-31', descuentoPct: 2, codigoProveedor: 'AZ-REF', prioridad: 2 },
  { id: 'CT-0005', proveedorId: 'PRO-003', productoId: 'MP-0003', precio: 79500, cantidadMinima: 40, plazoEntregaDias: 9, moneda: 'COP', vigenciaDesde: '2026-01-01', vigenciaHasta: '2026-12-31', descuentoPct: 2.5, codigoProveedor: 'MAN-20', prioridad: 1 },
  { id: 'CT-0006', proveedorId: 'PRO-004', productoId: 'IN-0002', precio: 420000, cantidadMinima: 10, plazoEntregaDias: 15, moneda: 'COP', vigenciaDesde: '2026-08-01', vigenciaHasta: '2027-01-31', descuentoPct: 4, codigoProveedor: 'BOPP-40', prioridad: 1 },
  { id: 'CT-0007', proveedorId: 'PRO-004', productoId: 'IN-0001', precio: 96000, cantidadMinima: 20, plazoEntregaDias: 15, moneda: 'COP', vigenciaDesde: '2026-08-01', vigenciaHasta: '2027-01-31', descuentoPct: 4, codigoProveedor: 'ETQ-80', prioridad: 1 },
  { id: 'CT-0008', proveedorId: 'PRO-005', productoId: 'RP-0001', precio: 350000, cantidadMinima: 6, plazoEntregaDias: 8, moneda: 'COP', vigenciaDesde: '2026-01-01', vigenciaHasta: '2026-12-31', descuentoPct: 5, codigoProveedor: '6204-2RS', prioridad: 1 },
];

/* ----------------------------- Solicitudes de cotización ------------------------ */

export interface LineaSolicitud {
  productoId: string;
  producto: string;
  cantidad: number;
  um: string;
}

export interface SolicitudCotizacion {
  id: string;
  fecha: string;
  comprador: string;
  fechaRequerida: string;
  lugarEntrega: string;
  condicionesPago: string;
  moneda: 'COP' | 'USD';
  impuestos: string;
  centroCosto: string;
  estado: 'Borrador' | 'Enviada' | 'Con ofertas' | 'Seleccionada' | 'Cerrada';
  proveedorIds: string[];
  lineas: LineaSolicitud[];
}

export const SOLICITUDES_COTIZACION: SolicitudCotizacion[] = [
  { id: 'SQC-2026-0101', fecha: '2026-10-15', comprador: 'Carolina Ríos', fechaRequerida: '2026-11-02', lugarEntrega: 'Planta Manizales', condicionesPago: '30 días', moneda: 'COP', impuestos: 'IVA 0 % (excluido)', centroCosto: 'PRD-01', estado: 'Con ofertas', proveedorIds: ['PRO-001', 'PRO-002'], lineas: [{ productoId: 'MP-0001', producto: 'Harina de trigo panadera', cantidad: 210, um: 'Bulto' }] },
  { id: 'SQC-2026-0102', fecha: '2026-10-16', comprador: 'Carolina Ríos', fechaRequerida: '2026-11-05', lugarEntrega: 'Planta Manizales', condicionesPago: '45 días', moneda: 'COP', impuestos: 'IVA 0 % (excluido)', centroCosto: 'PRD-01', estado: 'Enviada', proveedorIds: ['PRO-002', 'PRO-003'], lineas: [{ productoId: 'MP-0002', producto: 'Azúcar refinada', cantidad: 100, um: 'Bulto' }] },
  { id: 'SQC-2026-0103', fecha: '2026-10-17', comprador: 'Diego Ocampo', fechaRequerida: '2026-11-01', lugarEntrega: 'Almacén central', condicionesPago: '15 días', moneda: 'COP', impuestos: 'IVA 19 %', centroCosto: 'MNT-02', estado: 'Seleccionada', proveedorIds: ['PRO-005'], lineas: [{ productoId: 'RP-0001', producto: 'Rodamiento 6204-2RS', cantidad: 24, um: 'Unidad' }] },
  { id: 'SQC-2026-0104', fecha: '2026-10-20', comprador: 'Carolina Ríos', fechaRequerida: '2026-11-12', lugarEntrega: 'Planta Manizales', condicionesPago: '30 días', moneda: 'COP', impuestos: 'IVA 19 %', centroCosto: 'PRD-01', estado: 'Con ofertas', proveedorIds: ['PRO-004'], lineas: [{ productoId: 'IN-0002', producto: 'Empaque laminado BOPP', cantidad: 40, um: 'Rollo' }, { productoId: 'IN-0001', producto: 'Etiquetas adhesivas 80 g', cantidad: 60, um: 'Rollo' }] },
  { id: 'SQC-2026-0105', fecha: '2026-10-22', comprador: 'Diego Ocampo', fechaRequerida: '2026-11-08', lugarEntrega: 'Planta Manizales', condicionesPago: 'Contado', moneda: 'COP', impuestos: 'IVA 19 %', centroCosto: 'PRD-02', estado: 'Cerrada', proveedorIds: ['PRO-004'], lineas: [{ productoId: 'IN-0001', producto: 'Etiquetas adhesivas 80 g', cantidad: 80, um: 'Rollo' }] },
  { id: 'SQC-2026-0106', fecha: '2026-10-26', comprador: 'Carolina Ríos', fechaRequerida: '2026-11-03', lugarEntrega: 'Planta Manizales', condicionesPago: '15 días', moneda: 'COP', impuestos: 'IVA 19 %', centroCosto: 'LOG-01', estado: 'Borrador', proveedorIds: ['PRO-006'], lineas: [{ productoId: 'SV-0001', producto: 'Transporte refrigerado', cantidad: 4, um: 'Viaje' }] },
];

/* --------------------- Necesidades automáticas de compra ------------------------ */

export interface NecesidadCompra {
  id: string;
  origen: 'Inventario' | 'Orden de producción' | 'Consumo histórico' | 'Ventas comprometidas' | 'Plan de demanda';
  productoId: string;
  producto: string;
  cantidadSugerida: number;
  um: string;
  fechaRequerida: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  estado: 'Pendiente' | 'Convertida';
}

export const NECESIDADES_COMPRA: NecesidadCompra[] = [
  { id: 'NEC-2026-0001', origen: 'Orden de producción', productoId: 'MP-0001', producto: 'Harina de trigo panadera', cantidadSugerida: 150, um: 'Bulto', fechaRequerida: '2026-11-02', prioridad: 'Alta', estado: 'Convertida' },
  { id: 'NEC-2026-0002', origen: 'Inventario', productoId: 'MP-0002', producto: 'Azúcar refinada', cantidadSugerida: 80, um: 'Bulto', fechaRequerida: '2026-11-05', prioridad: 'Media', estado: 'Convertida' },
  { id: 'NEC-2026-0003', origen: 'Consumo histórico', productoId: 'MP-0003', producto: 'Manteca vegetal', cantidadSugerida: 120, um: 'Caja', fechaRequerida: '2026-11-10', prioridad: 'Baja', estado: 'Pendiente' },
  { id: 'NEC-2026-0004', origen: 'Ventas comprometidas', productoId: 'IN-0001', producto: 'Etiquetas adhesivas 80 g', cantidadSugerida: 60, um: 'Rollo', fechaRequerida: '2026-11-03', prioridad: 'Alta', estado: 'Convertida' },
  { id: 'NEC-2026-0005', origen: 'Plan de demanda', productoId: 'IN-0002', producto: 'Empaque laminado BOPP', cantidadSugerida: 40, um: 'Rollo', fechaRequerida: '2026-11-08', prioridad: 'Media', estado: 'Convertida' },
  { id: 'NEC-2026-0006', origen: 'Orden de producción', productoId: 'RP-0001', producto: 'Rodamiento 6204-2RS', cantidadSugerida: 24, um: 'Unidad', fechaRequerida: '2026-11-01', prioridad: 'Alta', estado: 'Convertida' },
];

/* ------------------------- Envío y comunicación con proveedores ------------------ */

export interface ComunicacionProveedor {
  id: string;
  fecha: string;
  tipoDocumento: 'Solicitud' | 'Orden' | 'Factura';
  referencia: string;
  proveedorId: string;
  canal: 'Correo' | 'Portal' | 'PDF';
  estado: 'Enviado' | 'Acuse recibido' | 'Contraoferta' | 'Sin respuesta';
  detalle: string;
}

export const COMUNICACIONES: ComunicacionProveedor[] = [
  { id: 'COM-0001', fecha: '2026-10-16', tipoDocumento: 'Solicitud', referencia: 'SQC-2026-0102', proveedorId: 'PRO-002', canal: 'Correo', estado: 'Enviado', detalle: 'Correo entregado al contacto comercial.' },
  { id: 'COM-0002', fecha: '2026-10-17', tipoDocumento: 'Solicitud', referencia: 'SQC-2026-0102', proveedorId: 'PRO-002', canal: 'Portal', estado: 'Acuse recibido', detalle: 'El proveedor abrió la solicitud en el portal.' },
  { id: 'COM-0003', fecha: '2026-10-18', tipoDocumento: 'Solicitud', referencia: 'SQC-2026-0101', proveedorId: 'PRO-002', canal: 'Correo', estado: 'Contraoferta', detalle: 'Propone $ 88.500/bulto si la cantidad sube a 300 unidades.' },
  { id: 'COM-0004', fecha: '2026-10-20', tipoDocumento: 'Orden', referencia: 'OC-2026-0078', proveedorId: 'PRO-001', canal: 'Correo', estado: 'Acuse recibido', detalle: 'Confirmación de recepción de la orden por parte del proveedor.' },
  { id: 'COM-0005', fecha: '2026-10-21', tipoDocumento: 'Orden', referencia: 'OC-2026-0078', proveedorId: 'PRO-001', canal: 'PDF', estado: 'Enviado', detalle: 'PDF de la orden adjunto al correo de confirmación.' },
  { id: 'COM-0006', fecha: '2026-10-22', tipoDocumento: 'Solicitud', referencia: 'SQC-2026-0104', proveedorId: 'PRO-004', canal: 'Correo', estado: 'Sin respuesta', detalle: 'Vence plazo de respuesta el 2026-11-01.' },
];

/* -------------------------- Comparación de ofertas ------------------------------ */

export interface OfertaProveedor {
  id: string;
  solicitudId: string;
  proveedorId: string;
  fecha: string;
  precioTotal: number;
  plazoDias: number;
  condicionesPago: string;
  calidad: number; // 0..1
  desempeno: number; // 0..1
  seleccionada: boolean;
}

export const OFERTAS: OfertaProveedor[] = [
  { id: 'OF-0001', solicitudId: 'SQC-2026-0101', proveedorId: 'PRO-001', fecha: '2026-10-18', precioTotal: 17835000, plazoDias: 12, condicionesPago: '30 días', calidad: 0.95, desempeno: 0.92, seleccionada: false },
  { id: 'OF-0002', solicitudId: 'SQC-2026-0101', proveedorId: 'PRO-002', fecha: '2026-10-19', precioTotal: 18585000, plazoDias: 18, condicionesPago: '45 días', calidad: 0.9, desempeno: 0.78, seleccionada: false },
  { id: 'OF-0003', solicitudId: 'SQC-2026-0103', proveedorId: 'PRO-005', fecha: '2026-10-19', precioTotal: 7980000, plazoDias: 8, condicionesPago: '15 días', calidad: 0.97, desempeno: 0.96, seleccionada: true },
  { id: 'OF-0004', solicitudId: 'SQC-2026-0104', proveedorId: 'PRO-004', fecha: '2026-10-23', precioTotal: 21600000, plazoDias: 15, condicionesPago: '30 días', calidad: 0.93, desempeno: 0.95, seleccionada: true },
  { id: 'OF-0005', solicitudId: 'SQC-2026-0102', proveedorId: 'PRO-002', fecha: '2026-10-20', precioTotal: 11446000, plazoDias: 10, condicionesPago: '45 días', calidad: 0.9, desempeno: 0.82, seleccionada: false },
  { id: 'OF-0006', solicitudId: 'SQC-2026-0102', proveedorId: 'PRO-003', fecha: '2026-10-21', precioTotal: 11858000, plazoDias: 14, condicionesPago: '30 días', calidad: 0.82, desempeno: 0.85, seleccionada: false },
];

/* --------------------------- Consolidación de solicitudes ------------------------ */

export interface Consolidacion {
  id: string;
  proveedorId: string;
  solicitudIds: string[];
  fecha: string;
  ahorroEstimado: number;
  estado: 'Propuesta' | 'Confirmada';
}

export const CONSOLIDACIONES: Consolidacion[] = [
  { id: 'CON-2026-0001', proveedorId: 'PRO-002', solicitudIds: ['SQC-2026-0101', 'SQC-2026-0102'], fecha: '2026-10-18', ahorroEstimado: 1450000, estado: 'Propuesta' },
  { id: 'CON-2026-0002', proveedorId: 'PRO-004', solicitudIds: ['SQC-2026-0104', 'SQC-2026-0105'], fecha: '2026-10-21', ahorroEstimado: 980000, estado: 'Confirmada' },
  { id: 'CON-2026-0003', proveedorId: 'PRO-006', solicitudIds: ['SQC-2026-0106'], fecha: '2026-10-26', ahorroEstimado: 320000, estado: 'Propuesta' },
  { id: 'CON-2026-0004', proveedorId: 'PRO-001', solicitudIds: ['SQC-2026-0101'], fecha: '2026-10-17', ahorroEstimado: 0, estado: 'Propuesta' },
];

/* ----------------------------- Acuerdos marco ----------------------------------- */

export interface AcuerdoMarco {
  id: string;
  proveedorId: string;
  articulo: string;
  precioUnitario: number;
  um: string;
  cantidadComprometida: number;
  cantidadConsumida: number;
  importeMaximo: number;
  vigenciaDesde: string;
  vigenciaHasta: string;
  estado: 'Vigente' | 'Próximo a agotar' | 'Agotado' | 'Vencido';
}

export const ACUERDOS_MARCO: AcuerdoMarco[] = [
  { id: 'AM-2026-0001', proveedorId: 'PRO-001', articulo: 'Harina de trigo panadera', precioUnitario: 84500, um: 'Bulto', cantidadComprometida: 1200, cantidadConsumida: 780, importeMaximo: 110000000, vigenciaDesde: '2026-01-01', vigenciaHasta: '2026-12-31', estado: 'Vigente' },
  { id: 'AM-2026-0002', proveedorId: 'PRO-004', articulo: 'Empaques y etiquetas', precioUnitario: 400000, um: 'Rollo', cantidadComprometida: 300, cantidadConsumida: 276, importeMaximo: 130000000, vigenciaDesde: '2026-02-01', vigenciaHasta: '2026-12-31', estado: 'Próximo a agotar' },
  { id: 'AM-2026-0003', proveedorId: 'PRO-005', articulo: 'Rodamientos serie 6200', precioUnitario: 340000, um: 'Unidad', cantidadComprometida: 80, cantidadConsumida: 80, importeMaximo: 30000000, vigenciaDesde: '2026-01-01', vigenciaHasta: '2026-12-31', estado: 'Agotado' },
  { id: 'AM-2026-0004', proveedorId: 'PRO-002', articulo: 'Azúcar refinada', precioUnitario: 115000, um: 'Bulto', cantidadComprometida: 600, cantidadConsumida: 512, importeMaximo: 75000000, vigenciaDesde: '2026-01-01', vigenciaHasta: '2026-10-31', estado: 'Vencido' },
  { id: 'AM-2026-0005', proveedorId: 'PRO-003', articulo: 'Manteca vegetal', precioUnitario: 78000, um: 'Caja', cantidadComprometida: 800, cantidadConsumida: 320, importeMaximo: 68000000, vigenciaDesde: '2026-08-01', vigenciaHasta: '2027-01-31', estado: 'Vigente' },
];

export interface PlantillaPedido {
  id: string;
  nombre: string;
  proveedorId: string;
  lineas: number;
  ultimoUso: string;
  productos: string;
}

export const PLANTILLAS_PEDIDO: PlantillaPedido[] = [
  { id: 'PLT-0001', nombre: 'Pedido semanal de harina', proveedorId: 'PRO-001', lineas: 2, ultimoUso: '2026-10-27', productos: 'Harina, afrecho' },
  { id: 'PLT-0002', nombre: 'Repuestos críticos', proveedorId: 'PRO-005', lineas: 6, ultimoUso: '2026-10-20', productos: 'Rodamientos, retenedores, bandas' },
  { id: 'PLT-0003', nombre: 'Empaques mensuales', proveedorId: 'PRO-004', lineas: 4, ultimoUso: '2026-10-05', productos: 'BOPP, etiquetas, cajas corrugadas' },
  { id: 'PLT-0004', nombre: 'Transporte refrigerado', proveedorId: 'PRO-006', lineas: 1, ultimoUso: '2026-09-28', productos: 'Fletes Manizales–Bogotá' },
];

/* ------------------------ Aprobaciones por importe y nivel ----------------------- */

export interface UmbralAprobacion {
  id: string;
  desde: number;
  hasta: number | null; // null = sin tope
  nivel: string;
  ambito: string;
  activo: boolean;
}

export const UMBRALES_APROBACION: UmbralAprobacion[] = [
  { id: 'UMB-0001', desde: 0, hasta: 5000000, nivel: 'Comprador', ambito: 'Categoría: Repuestos', activo: true },
  { id: 'UMB-0002', desde: 5000001, hasta: 20000000, nivel: 'Jefe de compras', ambito: 'General', activo: true },
  { id: 'UMB-0003', desde: 20000001, hasta: 50000000, nivel: 'Gerencia de operaciones', ambito: 'General', activo: true },
  { id: 'UMB-0004', desde: 50000001, hasta: null, nivel: 'Junta directiva', ambito: 'Proyecto: CAPEX', activo: true },
  { id: 'UMB-0005', desde: 0, hasta: 10000000, nivel: 'Responsable de centro de costo', ambito: 'Centro de costo: PL-01', activo: false },
];

export interface RegistroAprobacion {
  id: string;
  ordenId: string;
  nivel: string;
  aprobador: string;
  fecha: string;
  estado: 'Aprobada' | 'Rechazada';
  observaciones: string;
}

export const APROBACIONES: RegistroAprobacion[] = [
  { id: 'APR-0001', ordenId: 'OC-2026-0078', nivel: 'Jefe de compras', aprobador: 'Marta Gil', fecha: '2026-10-20 14:05', estado: 'Aprobada', observaciones: 'Precio dentro de condición vigente CT-0001.' },
  { id: 'APR-0002', ordenId: 'OC-2026-0080', nivel: 'Jefe de compras', aprobador: 'Marta Gil', fecha: '2026-10-08 09:12', estado: 'Aprobada', observaciones: 'Urgente para OP-2026-0142.' },
  { id: 'APR-0003', ordenId: 'OC-2026-0079', nivel: 'Gerencia de operaciones', aprobador: '—', fecha: '—', estado: 'Aprobada', observaciones: '—' },
];

/* -------------------------------- Órdenes de compra ----------------------------- */

export type EstadoOrden =
  | 'Borrador'
  | 'En aprobación'
  | 'Confirmada'
  | 'Parcialmente recibida'
  | 'Recibida'
  | 'Facturada'
  | 'Cerrada'
  | 'Cancelada';

export interface LineaOrden {
  id: string;
  productoId: string;
  producto: string;
  descripcion: string;
  cantidad: number;
  um: string;
  precio: number;
  descuentoPct: number;
  impuestoPct: number;
  fechaPrevista: string;
  centroCosto: string;
  proyecto: string;
  cuentaAnalitica: string;
  recibida: number;
  facturada: number;
}

export interface OrdenCompra {
  id: string;
  proveedorId: string;
  fecha: string;
  fechaEntrega: string;
  estado: EstadoOrden;
  bloqueada: boolean;
  moneda: 'COP';
  aprobador?: string;
  fechaAprobacion?: string;
  lineas: LineaOrden[];
}

export const ORDENES_COMPRA: OrdenCompra[] = [
  {
    id: 'OC-2026-0078', proveedorId: 'PRO-001', fecha: '2026-10-20', fechaEntrega: '2026-11-05', estado: 'Confirmada', bloqueada: true, moneda: 'COP', aprobador: 'Marta Gil', fechaAprobacion: '2026-10-20 14:05',
    lineas: [
      { id: 'L01', productoId: 'MP-0001', producto: 'Harina de trigo panadera', descripcion: 'Harina de trigo fortificada 50 kg', cantidad: 200, um: 'Bulto', precio: 87000, descuentoPct: 2, impuestoPct: 0, fechaPrevista: '2026-11-05', centroCosto: 'PRD-01', proyecto: 'LÍNEA-PAN', cuentaAnalitica: '610505', recibida: 0, facturada: 0 },
      { id: 'L02', productoId: 'MP-0001', producto: 'Harina de trigo panadera', descripcion: 'Harina integral 25 kg', cantidad: 30, um: 'Bulto', precio: 47000, descuentoPct: 2, impuestoPct: 0, fechaPrevista: '2026-11-05', centroCosto: 'PRD-01', proyecto: 'LÍNEA-PAN', cuentaAnalitica: '610505', recibida: 0, facturada: 0 },
    ],
  },
  {
    id: 'OC-2026-0079', proveedorId: 'PRO-004', fecha: '2026-10-24', fechaEntrega: '2026-11-12', estado: 'En aprobación', bloqueada: false, moneda: 'COP',
    lineas: [
      { id: 'L01', productoId: 'IN-0002', producto: 'Empaque laminado BOPP', descripcion: 'Laminado BOPP metalizado 40 kg', cantidad: 40, um: 'Rollo', precio: 420000, descuentoPct: 4, impuestoPct: 19, fechaPrevista: '2026-11-12', centroCosto: 'PRD-01', proyecto: 'EMPAQUE-26', cuentaAnalitica: '610510', recibida: 0, facturada: 0 },
      { id: 'L02', productoId: 'IN-0001', producto: 'Etiquetas adhesivas 80 g', descripcion: 'Etiqueta marca premium', cantidad: 60, um: 'Rollo', precio: 96000, descuentoPct: 4, impuestoPct: 19, fechaPrevista: '2026-11-12', centroCosto: 'PRD-02', proyecto: 'EMPAQUE-26', cuentaAnalitica: '610510', recibida: 0, facturada: 0 },
    ],
  },
  {
    id: 'OC-2026-0080', proveedorId: 'PRO-002', fecha: '2026-10-08', fechaEntrega: '2026-10-24', estado: 'Confirmada', bloqueada: true, moneda: 'COP', aprobador: 'Marta Gil', fechaAprobacion: '2026-10-08 09:12',
    lineas: [
      { id: 'L01', productoId: 'MP-0002', producto: 'Azúcar refinada', descripcion: 'Azúcar blanca refinada 50 kg', cantidad: 100, um: 'Bulto', precio: 118000, descuentoPct: 3, impuestoPct: 0, fechaPrevista: '2026-10-24', centroCosto: 'PRD-01', proyecto: 'LÍNEA-PAN', cuentaAnalitica: '610505', recibida: 0, facturada: 0 },
    ],
  },
  {
    id: 'OC-2026-0081', proveedorId: 'PRO-005', fecha: '2026-10-02', fechaEntrega: '2026-10-20', estado: 'Parcialmente recibida', bloqueada: true, moneda: 'COP', aprobador: 'Marta Gil', fechaAprobacion: '2026-10-02 11:30',
    lineas: [
      { id: 'L01', productoId: 'RP-0001', producto: 'Rodamiento 6204-2RS', descripcion: 'Rodamiento rígido de bolas sellado', cantidad: 24, um: 'Unidad', precio: 350000, descuentoPct: 5, impuestoPct: 19, fechaPrevista: '2026-10-20', centroCosto: 'MNT-02', proyecto: 'MTTO-COMP', cuentaAnalitica: '610515', recibida: 24, facturada: 14 },
    ],
  },
  {
    id: 'OC-2026-0082', proveedorId: 'PRO-006', fecha: '2026-10-27', fechaEntrega: '2026-11-03', estado: 'Borrador', bloqueada: false, moneda: 'COP',
    lineas: [
      { id: 'L01', productoId: 'SV-0001', producto: 'Transporte refrigerado', descripcion: 'Flete Manizales–Bogotá con termo registro', cantidad: 4, um: 'Viaje', precio: 1250000, descuentoPct: 0, impuestoPct: 19, fechaPrevista: '2026-11-03', centroCosto: 'LOG-01', proyecto: 'DIST-26', cuentaAnalitica: '613505', recibida: 0, facturada: 0 },
    ],
  },
  {
    id: 'OC-2026-0083', proveedorId: 'PRO-003', fecha: '2026-10-01', fechaEntrega: '2026-10-15', estado: 'Recibida', bloqueada: true, moneda: 'COP', aprobador: 'Marta Gil', fechaAprobacion: '2026-10-01 08:45',
    lineas: [
      { id: 'L01', productoId: 'MP-0003', producto: 'Manteca vegetal', descripcion: 'Manteca de palma refinada caja 20 kg', cantidad: 120, um: 'Caja', precio: 79500, descuentoPct: 2.5, impuestoPct: 0, fechaPrevista: '2026-10-15', centroCosto: 'PRD-01', proyecto: 'LÍNEA-PAN', cuentaAnalitica: '610505', recibida: 120, facturada: 120 },
    ],
  },
  {
    id: 'OC-2026-0084', proveedorId: 'PRO-001', fecha: '2026-09-15', fechaEntrega: '2026-09-30', estado: 'Facturada', bloqueada: true, moneda: 'COP', aprobador: 'Marta Gil', fechaAprobacion: '2026-09-15 10:20',
    lineas: [
      { id: 'L01', productoId: 'MP-0001', producto: 'Harina de trigo panadera', descripcion: 'Harina de trigo fortificada 50 kg', cantidad: 160, um: 'Bulto', precio: 87000, descuentoPct: 2, impuestoPct: 0, fechaPrevista: '2026-09-30', centroCosto: 'PRD-01', proyecto: 'LÍNEA-PAN', cuentaAnalitica: '610505', recibida: 160, facturada: 160 },
    ],
  },
  {
    id: 'OC-2026-0085', proveedorId: 'PRO-003', fecha: '2026-09-10', fechaEntrega: '2026-09-25', estado: 'Cerrada', bloqueada: true, moneda: 'COP', aprobador: 'Marta Gil', fechaAprobacion: '2026-09-10 09:00',
    lineas: [
      { id: 'L01', productoId: 'MP-0003', producto: 'Manteca vegetal', descripcion: 'Manteca de palma refinada caja 20 kg', cantidad: 60, um: 'Caja', precio: 81000, descuentoPct: 0, impuestoPct: 0, fechaPrevista: '2026-09-25', centroCosto: 'PRD-01', proyecto: 'LÍNEA-PAN', cuentaAnalitica: '610505', recibida: 60, facturada: 60 },
    ],
  },
];

export function importeOrden(o: OrdenCompra): number {
  return o.lineas.reduce(
    (acc, l) => acc + l.cantidad * l.precio * (1 - l.descuentoPct / 100) * (1 + l.impuestoPct / 100),
    0
  );
}

/* ------------------------------ Recepciones ------------------------------------- */

export interface LineaRecepcion {
  productoId: string;
  producto: string;
  cantidad: number;
  um: string;
}

export interface Recepcion {
  id: string;
  ordenId: string;
  fecha: string;
  tipo: 'Total' | 'Parcial';
  ubicacion: string;
  loteSerie: string;
  controlCalidad: 'Aprobada' | 'Rechazada' | 'Pendiente';
  estado: 'Abierta' | 'Cerrada' | 'Con devolución';
  lineas: LineaRecepcion[];
}

export const RECEPCIONES: Recepcion[] = [
  { id: 'REC-2026-0001', ordenId: 'OC-2026-0081', fecha: '2026-10-21', tipo: 'Parcial', ubicacion: 'ALM-01 · Estante B3', loteSerie: 'LT-2610-A', controlCalidad: 'Aprobada', estado: 'Cerrada', lineas: [{ productoId: 'RP-0001', producto: 'Rodamiento 6204-2RS', cantidad: 14, um: 'Unidad' }] },
  { id: 'REC-2026-0002', ordenId: 'OC-2026-0083', fecha: '2026-10-15', tipo: 'Total', ubicacion: 'ALM-02 · Zona fría', loteSerie: 'LT-2610-B', controlCalidad: 'Aprobada', estado: 'Cerrada', lineas: [{ productoId: 'MP-0003', producto: 'Manteca vegetal', cantidad: 120, um: 'Caja' }] },
  { id: 'REC-2026-0003', ordenId: 'OC-2026-0084', fecha: '2026-09-30', tipo: 'Total', ubicacion: 'ALM-01 · Estante A1', loteSerie: 'LT-2609-F', controlCalidad: 'Aprobada', estado: 'Cerrada', lineas: [{ productoId: 'MP-0001', producto: 'Harina de trigo panadera', cantidad: 160, um: 'Bulto' }] },
  { id: 'REC-2026-0004', ordenId: 'OC-2026-0081', fecha: '2026-10-26', tipo: 'Parcial', ubicacion: 'ALM-01 · Estante B3', loteSerie: 'LT-2610-C', controlCalidad: 'Pendiente', estado: 'Abierta', lineas: [{ productoId: 'RP-0001', producto: 'Rodamiento 6204-2RS', cantidad: 10, um: 'Unidad' }] },
  { id: 'REC-2026-0005', ordenId: 'OC-2026-0083', fecha: '2026-10-16', tipo: 'Parcial', ubicacion: 'ALM-02 · Zona fría', loteSerie: 'LT-2610-D', controlCalidad: 'Rechazada', estado: 'Con devolución', lineas: [{ productoId: 'MP-0003', producto: 'Manteca vegetal', cantidad: 120, um: 'Caja' }] },
];

/* ------------------------- Facturación y conciliación triple --------------------- */

export interface Factura {
  id: string;
  numero: string;
  proveedorId: string;
  ordenId: string;
  fecha: string;
  importeFactura: number;
  importeOrden: number;
  importeRecibido: number;
  difCantidad: boolean;
  difPrecio: boolean;
  difImpuestos: boolean;
  estado: 'Pendiente' | 'Conciliada' | 'Con diferencias' | 'Bloqueada';
  responsable?: string;
  resolucion?: string;
}

export const FACTURAS: Factura[] = [
  { id: 'FAP-2026-0001', numero: 'FAP-9001', proveedorId: 'PRO-003', ordenId: 'OC-2026-0083', fecha: '2026-10-17', importeFactura: 9301500, importeOrden: 9301500, importeRecibido: 9301500, difCantidad: false, difPrecio: false, difImpuestos: false, estado: 'Conciliada', responsable: 'Carolina Ríos', resolucion: 'Sin diferencias.' },
  { id: 'FAP-2026-0002', numero: 'FAP-9002', proveedorId: 'PRO-001', ordenId: 'OC-2026-0084', fecha: '2026-10-02', importeFactura: 13641600, importeOrden: 13641600, importeRecibido: 13641600, difCantidad: false, difPrecio: false, difImpuestos: false, estado: 'Conciliada', responsable: 'Carolina Ríos', resolucion: 'Sin diferencias.' },
  { id: 'FAP-2026-0003', numero: 'FAP-9003', proveedorId: 'PRO-005', ordenId: 'OC-2026-0081', fecha: '2026-10-24', importeFactura: 5586000, importeOrden: 7980000, importeRecibido: 5586000, difCantidad: false, difPrecio: false, difImpuestos: false, estado: 'Conciliada', responsable: 'Diego Ocampo', resolucion: 'Factura parcial por recepción (14 und).' },
  { id: 'FAP-2026-0004', numero: 'FAP-9004', proveedorId: 'PRO-002', ordenId: 'OC-2026-0080', fecha: '2026-10-26', importeFactura: 11446000, importeOrden: 11446000, importeRecibido: 0, difCantidad: true, difPrecio: false, difImpuestos: false, estado: 'Bloqueada', responsable: 'Diego Ocampo', resolucion: 'Factura sin recepción: la política exige facturar por recepción.' },
  { id: 'FAP-2026-0005', numero: 'FAP-9005', proveedorId: 'PRO-006', ordenId: 'OC-2026-0085', fecha: '2026-09-27', importeFactura: 5100000, importeOrden: 4860000, importeRecibido: 4860000, difCantidad: false, difPrecio: true, difImpuestos: false, estado: 'Con diferencias', responsable: 'Carolina Ríos', resolucion: 'Diferencia de tarifa $ 240.000; en gestión con el proveedor.' },
  { id: 'FAP-2026-0006', numero: 'FAP-9006', proveedorId: 'PRO-003', ordenId: 'OC-2026-0083', fecha: '2026-10-18', importeFactura: 7900000, importeOrden: 7900000, importeRecibido: 7900000, difCantidad: false, difPrecio: false, difImpuestos: true, estado: 'Pendiente', responsable: '—', resolucion: 'Base de IVA recalculada por el proveedor.' },
];

/* ---------------------- Devoluciones, cancelaciones y pendientes ------------------ */

export interface Devolucion {
  id: string;
  ordenId: string;
  fecha: string;
  tipo: 'Total' | 'Parcial';
  motivo: string;
  estado: 'Pendiente' | 'En tránsito' | 'Completada';
  movimientoInventario: string;
  documentoAjuste: string;
}

export const DEVOLUCIONES: Devolucion[] = [
  { id: 'DEV-2026-0001', ordenId: 'OC-2026-0084', fecha: '2026-10-06', tipo: 'Parcial', motivo: 'Bultos con humedad detectada en transporte', estado: 'Completada', movimientoInventario: 'INV-DEV-0041', documentoAjuste: 'NC-2026-0033' },
  { id: 'DEV-2026-0002', ordenId: 'OC-2026-0081', fecha: '2026-10-25', tipo: 'Parcial', motivo: 'Rodamiento con ruido anormal (2 und)', estado: 'En tránsito', movimientoInventario: 'INV-DEV-0042', documentoAjuste: 'NC-2026-0038' },
  { id: 'DEV-2026-0003', ordenId: 'OC-2026-0083', fecha: '2026-10-16', tipo: 'Total', motivo: 'Lote con fecha de vencimiento próxima', estado: 'Completada', movimientoInventario: 'INV-DEV-0039', documentoAjuste: 'NC-2026-0029' },
  { id: 'DEV-2026-0004', ordenId: 'OC-2026-0080', fecha: '2026-10-28', tipo: 'Parcial', motivo: 'Diferencia de peso en bultos', estado: 'Pendiente', movimientoInventario: '—', documentoAjuste: '—' },
];

/* ----------------------------- Recordatorios y seguimiento ------------------------ */

export interface Recordatorio {
  id: string;
  ordenId: string;
  proveedorId: string;
  tipo: 'Recordatorio de recepción' | 'Recordatorio de envío de orden' | 'Alerta de retraso' | 'Escalamiento' | 'Actividad de seguimiento';
  fechaProgramada: string;
  diasRetraso: number;
  vencida: boolean;
  estado: 'Pendiente' | 'Atendido';
}

export const RECORDATORIOS: Recordatorio[] = [
  { id: 'RCD-0001', ordenId: 'OC-2026-0080', proveedorId: 'PRO-002', tipo: 'Alerta de retraso', fechaProgramada: '2026-10-25', diasRetraso: 4, vencida: true, estado: 'Pendiente' },
  { id: 'RCD-0002', ordenId: 'OC-2026-0080', proveedorId: 'PRO-002', tipo: 'Escalamiento', fechaProgramada: '2026-10-27', diasRetraso: 2, vencida: true, estado: 'Pendiente' },
  { id: 'RCD-0003', ordenId: 'OC-2026-0078', proveedorId: 'PRO-001', tipo: 'Recordatorio de recepción', fechaProgramada: '2026-11-05', diasRetraso: 0, vencida: false, estado: 'Pendiente' },
  { id: 'RCD-0004', ordenId: 'OC-2026-0081', proveedorId: 'PRO-005', tipo: 'Actividad de seguimiento', fechaProgramada: '2026-10-22', diasRetraso: 0, vencida: false, estado: 'Atendido' },
  { id: 'RCD-0005', ordenId: 'OC-2026-0083', proveedorId: 'PRO-003', tipo: 'Recordatorio de recepción', fechaProgramada: '2026-10-14', diasRetraso: 0, vencida: false, estado: 'Atendido' },
  { id: 'RCD-0006', ordenId: 'OC-2026-0082', proveedorId: 'PRO-006', tipo: 'Recordatorio de envío de orden', fechaProgramada: '2026-10-28', diasRetraso: 0, vencida: false, estado: 'Pendiente' },
];

/* ------------------ Compras vinculadas a producción y subcontratación ------------- */

export interface CompraProduccion {
  id: string;
  ordenProduccion: string;
  productoFaltante: string;
  cantidadFaltante: number;
  um: string;
  ordenCompraId: string;
  proveedorId: string;
  fechaLimite: string;
  tipo: 'Componente' | 'Kit' | 'Subcontratación';
  estado: 'En proceso' | 'Crítico' | 'Atendido';
}

export const COMPRAS_PRODUCCION: CompraProduccion[] = [
  { id: 'CPR-0001', ordenProduccion: 'OP-2026-0142', productoFaltante: 'Harina de trigo panadera', cantidadFaltante: 150, um: 'Bulto', ordenCompraId: 'OC-2026-0078', proveedorId: 'PRO-001', fechaLimite: '2026-11-02', tipo: 'Componente', estado: 'En proceso' },
  { id: 'CPR-0002', ordenProduccion: 'OP-2026-0142', productoFaltante: 'Azúcar refinada', cantidadFaltante: 80, um: 'Bulto', ordenCompraId: 'OC-2026-0080', proveedorId: 'PRO-002', fechaLimite: '2026-10-24', tipo: 'Componente', estado: 'Crítico' },
  { id: 'CPR-0003', ordenProduccion: 'OP-2026-0145', productoFaltante: 'Rodamiento 6204-2RS', cantidadFaltante: 24, um: 'Unidad', ordenCompraId: 'OC-2026-0081', proveedorId: 'PRO-005', fechaLimite: '2026-10-20', tipo: 'Componente', estado: 'Atendido' },
  { id: 'CPR-0004', ordenProduccion: 'OP-2026-0148', productoFaltante: 'Kit de empaque promocional', cantidadFaltante: 500, um: 'Kit', ordenCompraId: 'OC-2026-0079', proveedorId: 'PRO-004', fechaLimite: '2026-11-12', tipo: 'Kit', estado: 'En proceso' },
  { id: 'CPR-0005', ordenProduccion: 'OP-2026-0150', productoFaltante: 'Corte y confección de bolsas', cantidadFaltante: 2000, um: 'Unidad', ordenCompraId: 'OC-2026-0085', proveedorId: 'PRO-003', fechaLimite: '2026-11-06', tipo: 'Subcontratación', estado: 'En proceso' },
];

/* ------------------------ Intercambio electrónico de documentos ------------------- */

export interface DocumentoElectronico {
  id: string;
  fecha: string;
  tipo: 'Orden' | 'Factura' | 'Cotización';
  formato: 'UBL 2.1' | 'EDIFACT' | 'XML FE' | 'PDF' | 'JSON';
  direccion: 'Importación' | 'Exportación';
  archivo: string;
  estado: 'Validado' | 'Con errores' | 'Enviado' | 'Recibido';
  errores: number;
  detalle: string;
}

export const DOCUMENTOS_ELECTRONICOS: DocumentoElectronico[] = [
  { id: 'EDI-0001', fecha: '2026-10-24', tipo: 'Orden', formato: 'UBL 2.1', direccion: 'Exportación', archivo: 'OC-2026-0079.xml', estado: 'Validado', errores: 0, detalle: 'Estructura UBL 2.1 válida; lista para envío.' },
  { id: 'EDI-0002', fecha: '2026-10-25', tipo: 'Factura', formato: 'XML FE', direccion: 'Importación', archivo: 'FAP-9003.xml', estado: 'Con errores', errores: 2, detalle: 'NIT del emisor no coincide con el maestro; IVA mal calculado.' },
  { id: 'EDI-0003', fecha: '2026-10-25', tipo: 'Factura', formato: 'UBL 2.1', direccion: 'Importación', archivo: 'FAP-9004.xml', estado: 'Validado', errores: 0, detalle: 'Factura importada y vinculada a OC-2026-0080.' },
  { id: 'EDI-0004', fecha: '2026-10-26', tipo: 'Cotización', formato: 'JSON', direccion: 'Importación', archivo: 'oferta-pro-004.json', estado: 'Recibido', errores: 0, detalle: 'Oferta recibida por canal electrónico.' },
  { id: 'EDI-0005', fecha: '2026-10-26', tipo: 'Orden', formato: 'EDIFACT', direccion: 'Exportación', archivo: 'OC-2026-0080.edi', estado: 'Enviado', errores: 0, detalle: 'Enviado al buzón EDI del proveedor.' },
  { id: 'EDI-0006', fecha: '2026-10-27', tipo: 'Factura', formato: 'PDF', direccion: 'Importación', archivo: 'FAP-9005.pdf', estado: 'Recibido', errores: 0, detalle: 'Adjunto de correo del proveedor, pendiente de OCR.' },
];

/* ------------------------------ Reportes (ABT-21) -------------------------------- */

export interface ReporteABT {
  id: string;
  nombre: string;
  descripcion: string;
  grupo: 'Gasto' | 'Órdenes' | 'Proveedores' | 'Conciliación' | 'Analítica';
}

export const REPORTES_ABT: ReporteABT[] = [
  { id: 'RPT-01', nombre: 'Gasto por proveedor', descripcion: 'Compras acumuladas por proveedor y período.', grupo: 'Gasto' },
  { id: 'RPT-02', nombre: 'Gasto por producto y categoría', descripcion: 'Análisis ABC del gasto por artículo y categoría.', grupo: 'Gasto' },
  { id: 'RPT-03', nombre: 'Evolución de precios', descripcion: 'Variación de precios por producto en el tiempo.', grupo: 'Gasto' },
  { id: 'RPT-04', nombre: 'Órdenes abiertas y retrasadas', descripcion: 'Detalle de órdenes pendientes de recepción.', grupo: 'Órdenes' },
  { id: 'RPT-05', nombre: 'Cumplimiento de entrega por proveedor', descripcion: 'OTIF por proveedor con tendencia 12 meses.', grupo: 'Proveedores' },
  { id: 'RPT-06', nombre: 'Comparación de precios y ahorro', descripcion: 'Ahorro obtenido frente a precio de referencia.', grupo: 'Proveedores' },
  { id: 'RPT-07', nombre: 'Diferencias de conciliación', descripcion: 'Facturas con diferencias de cantidad, precio o impuestos.', grupo: 'Conciliación' },
  { id: 'RPT-08', nombre: 'Compras por centro de costo o proyecto', descripcion: 'Gasto asignado a centros de costo y proyectos.', grupo: 'Analítica' },
];

/* ------------------------- Configuración (ABT-22) -------------------------------- */

export interface PermisoCompra {
  rol: string;
  crearSolicitudes: boolean;
  crearOrdenes: boolean;
  aprobar: boolean;
  recibir: boolean;
  conciliar: boolean;
  configurar: boolean;
}

export const CONFIG_ABT = {
  politicaFacturacion: 'Por recepción' as const,
  permitirRecepcionSinAprobacion: false,
  bloquearOrdenesConfirmadas: true,
  diasRecordatorioRecepcion: 3,
  diasAlertaRetraso: 2,
  escalamientoAutomatico: true,
  monedaDefecto: 'COP' as const,
  formatoElectronico: 'UBL 2.1' as const,
  toleranciaConciliacionPct: 0.05,
  unidadesMedida: ['Unidad', 'Bulto', 'Caja', 'Rollo', 'Kilogramo', 'Litro', 'Servicio'] as const,
  empaques: ['Bulto 50 kg', 'Caja 20 kg', 'Rollo 1.000 etq.', 'Tambor 200 L', 'Estiba'] as const,
  permisos: [
    { rol: 'Comprador', crearSolicitudes: true, crearOrdenes: true, aprobar: false, recibir: true, conciliar: true, configurar: false },
    { rol: 'Jefe de compras', crearSolicitudes: true, crearOrdenes: true, aprobar: true, recibir: true, conciliar: true, configurar: false },
    { rol: 'Almacenista', crearSolicitudes: false, crearOrdenes: false, aprobar: false, recibir: true, conciliar: false, configurar: false },
    { rol: 'Responsable de calidad', crearSolicitudes: false, crearOrdenes: false, aprobar: false, recibir: false, conciliar: false, configurar: false },
    { rol: 'Finanzas', crearSolicitudes: false, crearOrdenes: false, aprobar: false, recibir: false, conciliar: true, configurar: false },
  ] as PermisoCompra[],
};

/* ------------------------------- Helpers comunes --------------------------------- */

export function nombreProveedor(id: string): string {
  return PROVEEDORES.find(p => p.id === id)?.nombre ?? id;
}

export const HOY = '2026-10-28';

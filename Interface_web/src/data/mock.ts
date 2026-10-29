// Datos de sesión simulados (sin backend todavía).

export const PLANTA = {
  codigo: 'PLA-01',
  nombre: 'Planta Principal',
  almacen: 'Almacén Central',
};

export const PERIODO = {
  anio: 2026,
  nombre: 'Semana 44 · Oct 26 – Nov 01',
  estado: 'Abierto' as const,
};

export const USUARIO = {
  nombre: 'Juliana Ospina',
  rol: 'Supervisora de producción',
  iniciales: 'JO',
};

export const ALERTAS = [
  { id: 'A1', tipo: 'error' as const, texto: 'OF-1048 excedió el costo estimado en 18 %', hace: 'Hace 2 horas' },
  { id: 'A2', tipo: 'warn' as const, texto: '3 órdenes de compra vencidas sin recepción', hace: 'Hace 5 horas' },
  { id: 'A3', tipo: 'warn' as const, texto: 'Equipo MEZ-03 con mantenimiento preventivo vencido', hace: 'Ayer' },
  { id: 'A4', tipo: 'info' as const, texto: 'Lote L-2026-118 en inspección de calidad (CAL-007)', hace: 'Hoy' },
];

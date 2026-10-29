/** Formateadores comunes de la suite de producción. */

const fmtCant = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });
const fmtMon = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

/** Número con separadores colombianos: 1234.56 → «1.234,56». */
export function fmtNum(n: number): string {
  return fmtCant.format(n);
}

/** Importe en COP: 1234 → «$ 1.234». */
export function fmtMoney(n: number): string {
  return fmtMon.format(n);
}

/** Porcentaje: 0.856 → «85,6 %». */
export function fmtPct(n: number, digits = 1): string {
  return `${(n * 100).toLocaleString('es-CO', { maximumFractionDigits: digits })} %`;
}

/** Horas con 2 decimales: 3.25 → «3,25 h». */
export function fmtHoras(n: number): string {
  return `${fmtCant.format(n)} h`;
}

/** Fecha ISO → dd/mm/aaaa. */
export function fmtFecha(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

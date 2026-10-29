// Componentes compartidos de la suite de producción.
// Convenciones tomadas de la suite financiera: tablas text-xs, badges
// rounded-full, tarjetas con borde gray-200 y paleta «petroleum».

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { FUNCIONES_POR_MODULO } from '../data/coverage';

/* ------------------------------ clases base ------------------------------ */

export const INPUT =
  'min-w-0 w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-800 outline-none transition focus:border-petroleum-500 focus:ring-2 focus:ring-petroleum-100 aria-[invalid=true]:border-red-400';
export const BTN_PRIMARY =
  'rounded bg-petroleum-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-petroleum-600 disabled:opacity-50 disabled:cursor-not-allowed';
export const BTN_SECONDARY =
  'rounded border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed';
export const BTN_DANGER =
  'rounded border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed';
export const BTN_GHOST = 'rounded px-2 py-1 text-xs text-petroleum-600 hover:bg-petroleum-50';

/* ------------------------------- PageHeader ------------------------------ */

export function PageHeader({
  breadcrumb,
  title,
  description,
  pill,
  actions,
}: {
  breadcrumb: string;
  title: string;
  description?: string;
  pill?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="mb-1 text-xs text-gray-400">{breadcrumb}</div>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-xs text-gray-500">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {pill && (
          <span className="rounded-full border border-petroleum-100 bg-petroleum-50 px-3 py-1 text-xs font-medium text-petroleum-700">
            {pill}
          </span>
        )}
        {actions}
      </div>
    </div>
  );
}

/* ------------------------------ StatusBadge ------------------------------ */

export type BadgeTone = 'green' | 'amber' | 'red' | 'blue' | 'gray' | 'petroleum';

const TONOS: Record<BadgeTone, string> = {
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  gray: 'bg-gray-100 text-gray-600',
  petroleum: 'bg-petroleum-50 text-petroleum-700',
};

export function StatusBadge({ label, tone = 'gray' }: { label: string; tone?: BadgeTone }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${TONOS[tone]}`}>{label}</span>;
}

/* -------------------------------- StatCard ------------------------------- */

export function StatCard({
  label,
  value,
  sub,
  tone = 'default',
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'default' | 'ok' | 'warn' | 'danger' | 'info';
}) {
  const color =
    tone === 'ok'
      ? 'text-green-700'
      : tone === 'warn'
        ? 'text-amber-600'
        : tone === 'danger'
          ? 'text-red-600'
          : tone === 'info'
            ? 'text-petroleum-700'
            : 'text-gray-800';
  return (
    <div className="rounded border border-gray-200 bg-white px-4 py-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`mt-1 text-xl font-semibold tabular ${color}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

/* ---------------------------------- Tabs --------------------------------- */

export interface TabDef {
  id: string;
  label: string;
  badge?: number;
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
            active === tab.id
              ? 'border-petroleum-500 text-petroleum-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/* --------------------------------- Toolbar -------------------------------- */

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3 rounded border border-gray-200 bg-white p-3">{children}</div>;
}

/* ---------------------------------- Card --------------------------------- */

export function Card({
  title,
  action,
  children,
  className = '',
  pad = true,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div className={`overflow-hidden rounded border border-gray-200 bg-white ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-2.5">
          {title && <h2 className="text-sm font-semibold text-gray-800">{title}</h2>}
          {action}
        </div>
      )}
      <div className={pad ? 'p-4' : ''}>{children}</div>
    </div>
  );
}

/* ------------------------------ FunctionBlock ----------------------------- */

/**
 * Bloque de UI correspondiente a UNA funcionalidad del documento normativo.
 * El título y la descripción se toman del catálogo generado (coverage.ts),
 * así el código `ABT-01` queda siempre sincronizado con FUNCIONALIDADES.md.
 */
export function FunctionBlock({
  code,
  children,
  descripcion = true,
}: {
  code: string;
  children: ReactNode;
  /** Muestra la descripción normativa bajo el título. */
  descripcion?: boolean;
}) {
  const func = FUNCIONES_POR_MODULO[code.slice(0, 3)]?.find(f => f.code === code);
  return (
    <section className="rounded border border-gray-200 bg-white">
      <header className="border-b border-gray-100 bg-gray-50/60 px-4 py-2">
        <h3 className="text-xs font-semibold text-gray-800">
          <span className="mr-1.5 font-mono text-petroleum-600">{code}</span>
          {func?.title ?? code}
        </h3>
        {descripcion && func && <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">{func.description}</p>}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

/* ------------------------------- SectionTitle ----------------------------- */

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-sm font-semibold text-gray-700">{children}</h2>;
}

/* ---------------------------------- Modal --------------------------------- */

export function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    dialog?.querySelector<HTMLElement>('[data-initial-focus]')?.focus();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={e => {
        e.preventDefault();
        onClose();
      }}
      className={`fixed inset-0 m-auto rounded-lg border border-gray-200 bg-white p-0 shadow-2xl backdrop:bg-black/40 ${
        wide ? 'w-[calc(100%_-_2rem)] max-w-3xl' : 'w-[calc(100%_-_2rem)] max-w-lg'
      }`}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 id={titleId} className="text-sm font-semibold text-gray-800">
          {title}
        </h2>
        <button type="button" onClick={onClose} aria-label="Cerrar diálogo" className="rounded px-2 text-xl text-gray-500 hover:bg-gray-100">
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}

/* --------------------------------- EmptyRow ------------------------------- */

export function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-gray-500">
        {text}
      </td>
    </tr>
  );
}

/* ------------------------------- Table wrapper ---------------------------- */

export function DataTable({ children, footer }: { children: ReactNode; footer?: string }) {
  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white">
      <div className="table-fixed-header overflow-x-auto">
        <table className="w-full text-xs">{children}</table>
      </div>
      {footer && <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">{footer}</div>}
    </div>
  );
}

export function Th({ children, align = 'left' }: { children?: ReactNode; align?: 'left' | 'center' | 'right' }) {
  const cls = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return <th className={`px-3 py-2.5 font-semibold text-gray-600 ${cls}`}>{children}</th>;
}

export function Td({
  children,
  align = 'left',
  className = '',
}: {
  children?: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}) {
  const cls = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return <td className={`px-3 py-2.5 text-gray-700 ${cls} ${className}`}>{children}</td>;
}

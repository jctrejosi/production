import { MODULOS, FASES, TOTAL, conteoModulo, conteoFase, type NavPage } from '../data/modules';
import { PageHeader, StatCard, Card, StatusBadge } from '../components/ui';
import { fmtMoney, fmtNum, fmtPct } from '../lib/format';

const FLUJOS = [
  { id: '4.1', nombre: 'Procure-to-pay', descripcion: 'Necesidad → cotización → orden → recepción → factura → pago' },
  { id: '4.2', nombre: 'Plan-to-produce', descripcion: 'Demanda → plan maestro → MRP → capacidad → liberación' },
  { id: '4.3', nombre: 'Execute-to-complete', descripcion: 'Liberación → operaciones → consumo → cierre → costeo' },
  { id: '4.4', nombre: 'Quality-to-release', descripcion: 'Control → inspección → aprobación o no conformidad → liberación' },
  { id: '4.5', nombre: 'Maintain-to-availability', descripcion: 'Equipo → preventivo/correctivo → cierre → indicadores' },
  { id: '4.6', nombre: 'Change-to-production', descripcion: 'ECO → análisis de impacto → aprobación → nueva versión' },
  { id: '4.7', nombre: 'Trace-to-recall', descripcion: 'Lote → genealogía → cuarentena → notificación → retiro' },
];

export default function Dashboard({ onNavigate }: { onNavigate: (p: NavPage) => void }) {
  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb="Inicio"
        title="Panel de producción"
        description="Estado global de la planta: órdenes, inventario, calidad, mantenimiento y desempeño (datos de demostración)."
        pill="Planta Principal · Semana 44"
      />

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard label="Órdenes de producción activas" value="14" sub="3 atrasadas" tone="warn" />
        <StatCard label="OEE promedio (semana)" value={fmtPct(0.742)} sub="Meta 80 %" tone="info" />
        <StatCard label="Órdenes de compra abiertas" value="9" sub="2 vencidas" tone="warn" />
        <StatCard label="Valor inventario" value={fmtMoney(184_500_000)} sub="46 % materias primas" />
        <StatCard label="No conformidades abiertas" value="5" sub="1 crítica" tone="danger" />
        <StatCard label="Preventivos vencidos" value="2" sub="Equipo MEZ-03" tone="danger" />
      </div>

      {/* Roadmap */}
      <Card title="Roadmap de implementación (5 fases)" pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Fase</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Objetivo</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Módulos</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600">Funciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {FASES.map(fase => (
                <tr key={fase.id} className="hoverable">
                  <td className="px-3 py-2.5"><StatusBadge label={`Fase ${fase.id}`} tone={fase.id === 1 ? 'green' : fase.id === 5 ? 'petroleum' : 'gray'} /></td>
                  <td className="px-3 py-2.5 text-gray-700">{fase.descripcion}</td>
                  <td className="px-3 py-2.5 text-gray-600">{MODULOS.filter(m => m.fase === fase.id).map(m => m.nombre).join(' · ')}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-gray-600">{conteoFase(fase.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Módulos */}
        <Card title={`Módulos y cobertura funcional (${TOTAL})`} className="lg:col-span-2" pad={false}>
          <div className="divide-y divide-gray-50">
            {MODULOS.map(mod => (
              <button
                key={mod.id}
                type="button"
                onClick={() => onNavigate(mod.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50"
              >
                <span className="text-lg" aria-hidden="true">{mod.icono}</span>
                <span className="min-w-14 font-mono text-[10px] text-petroleum-600">{mod.codigo}</span>
                <span className="flex-1 text-xs font-medium text-gray-800">{mod.nombre}</span>
                <span className="min-w-16 text-right font-mono text-xs text-gray-600">{conteoModulo(mod.id)}/{conteoModulo(mod.id)}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Flujos */}
        <Card title="Flujos end-to-end">
          <div className="space-y-3">
            {FLUJOS.map(flujo => (
              <button
                key={flujo.id}
                type="button"
                onClick={() => onNavigate('espec')}
                className="w-full rounded border border-gray-100 bg-gray-50/50 px-3 py-2 text-left transition hover:border-petroleum-200 hover:bg-petroleum-50/40"
              >
                <div className="text-xs font-semibold text-gray-800">
                  <span className="mr-1.5 font-mono text-petroleum-600">{flujo.id}</span>
                  {flujo.nombre}
                </div>
                <div className="mt-0.5 text-[11px] text-gray-500">{flujo.descripcion}</div>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => onNavigate('espec')} className="mt-3 w-full rounded border border-gray-200 px-3 py-1.5 text-xs text-petroleum-600 hover:bg-petroleum-50">
            Ver especificación funcional completa →
          </button>
        </Card>
      </div>

      {/* Métricas rápidas */}
      <Card title="Indicadores de la semana" pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Indicador</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600">Valor</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600">Meta</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hoverable">
                <td className="px-3 py-2.5 text-gray-700">Disponibilidad de equipos</td>
                <td className="px-3 py-2.5 text-right font-mono">{fmtPct(0.88)}</td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-400">≥ 90 %</td>
                <td className="px-3 py-2.5"><StatusBadge label="Aceptable" tone="amber" /></td>
              </tr>
              <tr className="hoverable">
                <td className="px-3 py-2.5 text-gray-700">Cumplimiento del plan</td>
                <td className="px-3 py-2.5 text-right font-mono">{fmtPct(0.93)}</td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-400">≥ 95 %</td>
                <td className="px-3 py-2.5"><StatusBadge label="En meta" tone="green" /></td>
              </tr>
              <tr className="hoverable">
                <td className="px-3 py-2.5 text-gray-700">FPY (primera pasada)</td>
                <td className="px-3 py-2.5 text-right font-mono">{fmtPct(0.964)}</td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-400">≥ 97 %</td>
                <td className="px-3 py-2.5"><StatusBadge label="Bajo meta" tone="amber" /></td>
              </tr>
              <tr className="hoverable">
                <td className="px-3 py-2.5 text-gray-700">Órdenes cerradas a tiempo</td>
                <td className="px-3 py-2.5 text-right font-mono">{fmtNum(38)}/{fmtNum(45)}</td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-400">100 %</td>
                <td className="px-3 py-2.5"><StatusBadge label="Revisar" tone="amber" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

import { FASES, MODULOS, TOTAL, conteoModulo, type NavPage } from '../data/modules';
import { PageHeader } from '../components/ui';

export default function SuiteHome({ onNavigate }: { onNavigate: (p: NavPage) => void }) {
  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb="Suite Producción"
        title="PRODDSI · Módulos de producción y abastecimiento"
        description="Suite de producción inspirada en la especificación funcional neutral a proveedor: 15 módulos, 293 funcionalidades, 7 flujos end-to-end y un roadmap de 5 fases."
        pill={`${TOTAL} funcionalidades · ${MODULOS.length} módulos`}
        actions={
          <button
            type="button"
            onClick={() => onNavigate('espec')}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            📋 Especificación funcional
          </button>
        }
      />

      {FASES.map(fase => {
        const modulos = MODULOS.filter(m => m.fase === fase.id);
        if (modulos.length === 0) return null;
        const total = modulos.reduce((acc, m) => acc + conteoModulo(m.id), 0);
        return (
          <section key={fase.id}>
            <div className="flex items-baseline gap-2 mb-2">
              <h2 className="text-sm font-semibold text-gray-700">{fase.nombre}</h2>
              <span className="text-xs text-gray-400">· {fase.descripcion} · {total} funciones</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {modulos.map(mod => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => onNavigate(mod.id)}
                  className="group rounded border border-gray-200 bg-white p-4 text-left transition hover:border-petroleum-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl" aria-hidden="true">{mod.icono}</span>
                    <span className="rounded-full bg-petroleum-50 px-2 py-0.5 font-mono text-[10px] text-petroleum-700">{mod.codigo}</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-gray-800 group-hover:text-petroleum-700">{mod.nombre}</div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{mod.descripcion}</p>
                  <div className="mt-2 text-xs text-gray-400">{conteoModulo(mod.id)} funcionalidades →</div>
                </button>
              ))}
            </div>
          </section>
        );
      })}

      {/* Transversales (fase 0) */}
      {MODULOS.filter(m => m.fase === 0).length > 0 && (
        <section>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-petroleum-600">Transversal</span>
            <h2 className="text-sm font-semibold text-gray-700">Capacidades transversales</h2>
            <span className="text-xs text-gray-400">· comunes a todos los módulos</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MODULOS.filter(m => m.fase === 0).map(mod => (
              <button
                key={mod.id}
                type="button"
                onClick={() => onNavigate(mod.id)}
                className="group rounded border border-gray-200 bg-white p-4 text-left transition hover:border-petroleum-300 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl" aria-hidden="true">{mod.icono}</span>
                  <span className="rounded-full bg-petroleum-50 px-2 py-0.5 font-mono text-[10px] text-petroleum-700">{mod.codigo}</span>
                </div>
                <div className="mt-2 text-sm font-semibold text-gray-800 group-hover:text-petroleum-700">{mod.nombre}</div>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{mod.descripcion}</p>
                <div className="mt-2 text-xs text-gray-400">{conteoModulo(mod.id)} funcionalidades →</div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

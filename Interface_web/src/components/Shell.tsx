import { useState, useMemo, type ReactNode } from 'react';
import { FASES, MODULOS, conteoModulo, type ModuleId, type NavPage } from '../data/modules';
import { FUNCIONES } from '../data/coverage';
import { ALERTAS, PERIODO, PLANTA, USUARIO } from '../data/mock';

interface ShellProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  children: ReactNode;
}

const FASE_MODULOS = (fase: number) => MODULOS.filter(m => m.fase === fase);
const TRANSVERSALES = MODULOS.filter(m => m.fase === 0);

export default function Shell({ currentPage, onNavigate, children }: ShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([1]));
  const [showNotif, setShowNotif] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [focoBusqueda, setFocoBusqueda] = useState(false);

  const esSuite = currentPage === 'suite';
  const alertas = ALERTAS.filter(a => a.tipo === 'error').length;
  const faseActiva = (fase: number) => FASE_MODULOS(fase).some(m => m.id === currentPage);

  // Búsqueda global: módulos y funcionalidades del catálogo normativo.
  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase('es');
    if (termino.length < 2) return [];
    const porModulo: { modulo: ModuleId; nombre: string; resultados: { codigo: string; titulo: string }[] }[] = [];
    for (const mod of MODULOS) {
      const modCoincide = mod.nombre.toLocaleLowerCase('es').includes(termino) || mod.codigo.toLocaleLowerCase('es').includes(termino);
      const funciones = FUNCIONES.filter(
        f => f.module === mod.codigo && (f.code.toLocaleLowerCase('es').includes(termino) || f.title.toLocaleLowerCase('es').includes(termino)),
      ).slice(0, 4);
      if (modCoincide || funciones.length > 0) {
        porModulo.push({ modulo: mod.id, nombre: mod.nombre, resultados: funciones.map(f => ({ codigo: f.code, titulo: f.title })) });
      }
    }
    return porModulo.slice(0, 5);
  }, [busqueda]);

  function toggleGroup(id: number) {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`flex flex-col shrink-0 transition-all duration-200 sidebar-scroll overflow-y-auto ${collapsed ? 'w-16' : 'w-64'}`}
        style={{ backgroundColor: '#001F4C', color: '#C8F0FD' }}
      >
        {/* Brand */}
        <div className={`flex flex-col items-center shrink-0 border-b ${collapsed ? 'px-2 py-4' : 'gap-3 px-4 py-4'}`} style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className={`flex items-center justify-center bg-white shadow-sm ${collapsed ? 'h-10 w-12 rounded-md px-1' : 'w-full rounded-lg px-4 py-3'}`}>
            <img
              src={`${import.meta.env.BASE_URL}dsi-logo.svg`}
              alt="DSI S.A."
              width={176}
              height={51}
              className={`block h-auto object-contain ${collapsed ? 'w-10' : 'w-44 max-w-full'}`}
            />
          </div>
          {!collapsed && (
            <div className="w-full min-w-0 text-center">
              <div className="text-white font-semibold text-sm leading-tight">PRODDSI</div>
              <div className="text-xs mt-1" style={{ color: '#7BDCFB' }}>Suite Producción</div>
            </div>
          )}
        </div>

        {/* Planta */}
        {!collapsed && (
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
            <div className="text-xs font-medium text-white truncate">{PLANTA.nombre}</div>
            <div className="text-xs mt-0.5 truncate" style={{ color: '#7BDCFB' }}>{PLANTA.almacen}</div>
          </div>
        )}

        {/* Suite */}
        <div className="px-3 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => onNavigate('suite')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors hover:bg-white/10 ${collapsed ? 'justify-center' : ''}`}
            style={{ backgroundColor: esSuite ? 'rgba(0,176,242,0.14)' : 'rgba(255,255,255,0.05)', color: '#C8F0FD' }}
            title={collapsed ? 'Todos los módulos' : undefined}
          >
            <span aria-hidden="true">⊞</span>
            {!collapsed && <span className="flex-1 text-left">Todos los módulos</span>}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 overflow-y-auto">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              currentPage === 'dashboard' ? 'text-white font-medium' : 'hover:bg-white/5'
            }`}
            style={currentPage === 'dashboard' ? { backgroundColor: '#0073C0', color: '#fff' } : {}}
          >
            <span className="text-base w-5 text-center shrink-0">⌂</span>
            {!collapsed && <span>Inicio producción</span>}
          </button>

          <button
            onClick={() => onNavigate('espec')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors ${
              currentPage === 'espec' ? 'text-white font-medium' : 'hover:bg-white/5'
            }`}
            style={currentPage === 'espec' ? { backgroundColor: '#0073C0' } : {}}
          >
            <span className="text-base w-5 text-center shrink-0" aria-hidden="true">📋</span>
            {!collapsed && <span>Especificación funcional</span>}
          </button>

          {FASES.map(fase => {
            const modulos = FASE_MODULOS(fase.id);
            const abierto = expandedGroups.has(fase.id);
            return (
              <div key={fase.id}>
                <button
                  onClick={() => (collapsed ? undefined : toggleGroup(fase.id))}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${faseActiva(fase.id) ? 'text-white' : ''}`}
                >
                  <span className="text-base w-5 text-center shrink-0" aria-hidden="true">{fase.icono}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{fase.nombre}</span>
                      <span className="text-xs opacity-60">{abierto ? '▾' : '▸'}</span>
                    </>
                  )}
                </button>
                {!collapsed && abierto && (
                  <div className="ml-8 border-l" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    {modulos.map(mod => {
                      const activo = currentPage === mod.id;
                      const conteo = conteoModulo(mod.id);
                      return (
                        <button
                          key={mod.id}
                          onClick={() => onNavigate(mod.id)}
                          className={`w-full flex items-center gap-2 py-2 pl-3 pr-4 text-left text-xs transition-colors ${
                            activo ? 'font-medium' : 'hover:bg-white/5 hover:text-white'
                          }`}
                          style={activo ? { borderLeft: '2px solid #00B0F2', color: '#fff', backgroundColor: 'rgba(0,176,242,0.14)' } : {}}
                        >
                          <span aria-hidden="true">{mod.icono}</span>
                          <span className="flex-1 leading-tight">{mod.nombre}</span>
                          <span className="text-[10px] opacity-60 font-mono">{conteo}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Transversales */}
          <div className={collapsed ? 'sr-only' : 'px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest'} style={{ color: '#7BDCFB' }}>
            Transversales
          </div>
          {TRANSVERSALES.map(mod => (
            <button
              key={mod.id}
              onClick={() => onNavigate(mod.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-xs transition-colors ${currentPage === mod.id ? 'text-white font-medium' : 'hover:bg-white/5'}`}
              style={currentPage === mod.id ? { backgroundColor: '#0073C0' } : {}}
            >
              <span aria-hidden="true">{mod.icono}</span>
              {!collapsed && <span className="flex-1 text-left">{mod.nombre}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse */}
        <div className="shrink-0 border-t p-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-full flex items-center justify-center gap-2 py-1.5 text-xs rounded transition-colors hover:bg-white/10"
            style={{ color: '#7BDCFB' }}
          >
            <span>{collapsed ? '»' : '«'}</span>
            {!collapsed && <span>Contraer</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <header className="shrink-0 bg-white border-b border-gray-200 flex items-center gap-3 px-4 h-14 z-20">
          <span className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium" style={{ backgroundColor: '#EFFAFF', color: '#001F4C' }}>
            <span className="font-semibold">{PLANTA.codigo}</span>
            <span className="text-gray-400">|</span>
            <span className="truncate max-w-40">{PLANTA.nombre}</span>
          </span>

          <div className="text-gray-300 text-xs">|</div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-700">{PERIODO.anio}</span>
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-xs text-gray-600">{PERIODO.nombre}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">{PERIODO.estado}</span>
          </div>

          <div className="flex-1 max-w-xs ml-2 relative">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">⌕</span>
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                onFocus={() => setFocoBusqueda(true)}
                onBlur={() => window.setTimeout(() => setFocoBusqueda(false), 150)}
                placeholder="Buscar orden, producto, lote, proveedor..."
                className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:border-petroleum-500"
              />
            </div>
            {focoBusqueda && resultados.length > 0 && (
              <div className="absolute left-0 right-0 top-9 z-50 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
                {resultados.map(grupo => (
                  <div key={grupo.modulo}>
                    <button
                      type="button"
                      onMouseDown={() => { onNavigate(grupo.modulo); setBusqueda(''); }}
                      className="flex w-full items-center gap-2 border-b border-gray-50 bg-gray-50/70 px-3 py-2 text-left text-xs font-semibold text-petroleum-700 hover:bg-petroleum-50"
                    >
                      <span aria-hidden="true">{MODULOS.find(m => m.id === grupo.modulo)?.icono}</span>
                      <span className="flex-1">{grupo.nombre}</span>
                      <span className="text-[10px] font-normal text-gray-400">ir al módulo →</span>
                    </button>
                    {grupo.resultados.map(fn => (
                      <button
                        key={fn.codigo}
                        type="button"
                        onMouseDown={() => { onNavigate(grupo.modulo); setBusqueda(''); }}
                        className="flex w-full items-center gap-2 border-b border-gray-50 px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                      >
                        <span className="font-mono text-[10px] text-petroleum-600">{fn.codigo}</span>
                        <span className="flex-1 truncate">{fn.titulo}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1" />

          <div className="relative">
            <button
              onClick={() => setShowNotif(v => !v)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              <span className="text-base">🔔</span>
              {alertas > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {alertas}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-10 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-800">Notificaciones</span>
                </div>
                <div className="py-1 max-h-60 overflow-y-auto">
                  {ALERTAS.map(a => (
                    <div key={a.id} className="px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50">
                      <div className={`text-xs font-medium ${a.tipo === 'error' ? 'text-red-600' : a.tipo === 'warn' ? 'text-amber-600' : 'text-blue-600'}`}>{a.texto}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{a.hace}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: '#0073C0' }}>
              {USUARIO.iniciales}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-medium text-gray-800 leading-tight">{USUARIO.nombre}</div>
              <div className="text-xs text-gray-400">{USUARIO.rol}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {showNotif && <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />}
    </div>
  );
}

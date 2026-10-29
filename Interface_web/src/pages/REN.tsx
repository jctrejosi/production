import { useMemo, useState } from 'react';
import {
  BTN_PRIMARY, BTN_SECONDARY, Card, DataTable, EmptyRow, FunctionBlock,
  INPUT, PageHeader, StatCard, StatusBadge, Tabs, Td, Th, Toolbar,
} from '../components/ui';
import { MODULOS, conteoModulo } from '../data/modules';
import { fmtFecha, fmtMoney, fmtNum, fmtPct } from '../lib/format';
import {
  BENCHMARKS, CALIDADES, CUMPLIMIENTO, DESPERDICIOS, DISPONIBILIDADES, FPY,
  OBJETIVOS_REN, OEE, PARADAS, RENDIMIENTOS, REPORTES_REN, REPROCESOS_REN, SETUPS,
  TIEMPOS_CICLO, calcularOee, pctCalidad, pctCumplimiento, pctDisponibilidad, pctFpy, pctRendimiento,
} from '../data/ren';

const MOD = MODULOS.find(m => m.id === 'ren')!;

const PESTANAS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'oee', label: 'OEE y factores' },
  { id: 'ciclo', label: 'Ciclo y preparación' },
  { id: 'calidad', label: 'Calidad y pérdidas' },
  { id: 'plan', label: 'Plan, paradas y tableros' },
];

function toneOee(oee: number, objetivo: number) {
  return oee >= objetivo ? 'green' as const : 'red' as const;
}

function tonePct(v: number, meta: number) {
  return v >= meta ? 'green' as const : 'amber' as const;
}

export default function REN() {
  const [tab, setTab] = useState('resumen');
  const [mensaje, setMensaje] = useState('');

  const avisar = (texto: string) => {
    window.setTimeout(() => setMensaje(texto), 400);
    window.setTimeout(() => setMensaje(''), 4200);
  };

  /* ------------------------------ filtros ------------------------------ */
  const [fCentro, setFCentro] = useState('');
  const [fEquipoSetup, setFEquipoSetup] = useState('');
  const [fProductoDesp, setFProductoDesp] = useState('');
  const [fPeriodoPlan, setFPeriodoPlan] = useState('');
  const [fCategoriaPar, setFCategoriaPar] = useState('');
  const [periodoBench, setPeriodoBench] = useState('Sem 43');

  const centros = Array.from(new Set(OEE.map(r => r.centro))).sort();

  const oeeVisibles = useMemo(() => OEE.filter(r => !fCentro || r.centro === fCentro), [fCentro]);
  const setupsVisibles = useMemo(() => SETUPS.filter(s => !fEquipoSetup || s.equipo === fEquipoSetup), [fEquipoSetup]);
  const desperdiciosVisibles = useMemo(() => DESPERDICIOS.filter(d => !fProductoDesp || d.producto === fProductoDesp), [fProductoDesp]);
  const cumplimientoVisibles = useMemo(() => CUMPLIMIENTO.filter(c => !fPeriodoPlan || c.periodo === fPeriodoPlan), [fPeriodoPlan]);
  const paradasVisibles = useMemo(() => PARADAS.filter(p => !fCategoriaPar || p.categoria === fCategoriaPar), [fCategoriaPar]);

  const equiposSetup = Array.from(new Set(SETUPS.map(s => s.equipo))).sort();
  const productosDesp = Array.from(new Set(DESPERDICIOS.map(d => d.producto))).sort();
  const periodosPlan = Array.from(new Set(CUMPLIMIENTO.map(c => c.periodo))).sort();
  const categoriasPar = Array.from(new Set(PARADAS.map(p => p.categoria))).sort();

  /** Pareto de paradas: minutos por categoría, ordenado de mayor a menor. */
  const pareto = useMemo(() => {
    const porCategoria = new Map<string, number>();
    for (const p of PARADAS) porCategoria.set(p.categoria, (porCategoria.get(p.categoria) ?? 0) + p.duracionMin);
    return Array.from(porCategoria.entries())
      .map(([categoria, minutos]) => ({ categoria, minutos }))
      .sort((a, b) => b.minutos - a.minutos);
  }, []);
  const maxPareto = pareto.length > 0 ? pareto[0].minutos : 1;

  /* ------------------------------ indicadores ------------------------------ */
  const oeePromedio = OEE.reduce((a, r) => a + calcularOee(r), 0) / OEE.length;
  const dispPromedio = DISPONIBILIDADES.reduce((a, d) => a + pctDisponibilidad(d), 0) / DISPONIBILIDADES.length;
  const fpyPromedio = FPY.reduce((a, f) => a + pctFpy(f), 0) / FPY.length;
  const costoDesperdicio = DESPERDICIOS.reduce((a, d) => a + d.costo, 0);
  const costoReproceso = REPROCESOS_REN.reduce((a, r) => a + r.costo, 0);
  const tiempoReproceso = REPROCESOS_REN.reduce((a, r) => a + r.tiempoExtra, 0);

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('ren')} funcionalidades · Fase ${MOD.fase}`}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="OEE planta (Sem 43)" value={fmtPct(oeePromedio)} sub={`Objetivo ${fmtPct(OBJETIVOS_REN[0].oeePlanta, 0)} · v4`} tone={oeePromedio >= OBJETIVOS_REN[0].oeePlanta ? 'ok' : 'warn'} />
        <StatCard label="Disponibilidad promedio" value={fmtPct(dispPromedio)} sub="Tiempo productivo / planificado" tone="info" />
        <StatCard label="FPY promedio" value={fmtPct(fpyPromedio)} sub={`Objetivo ${fmtPct(OBJETIVOS_REN[0].fpy, 0)}`} tone={fpyPromedio >= OBJETIVOS_REN[0].fpy ? 'ok' : 'warn'} />
        <StatCard label="Desperdicio de la semana" value={fmtMoney(costoDesperdicio)} sub={`+ reprocesos ${fmtMoney(costoReproceso)}`} tone="danger" />
      </div>

      {mensaje && (
        <div role="status" className="rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
          {mensaje}
        </div>
      )}

      <Tabs tabs={PESTANAS} active={tab} onChange={setTab} />

      {/* ------------------------------ Resumen ------------------------------ */}
      {tab === 'resumen' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Objetivo y alcance">
            <p className="text-xs leading-relaxed text-gray-700">
              Medir el desempeño real de la planta y detectar oportunidades de mejora con definiciones
              consistentes.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Incluye OEE, disponibilidad, rendimiento, calidad, tiempos de ciclo y preparación, FPY,
              desperdicio, reproceso, cumplimiento del plan y análisis de paradas.
            </p>
          </Card>
          <Card title="Actores">
            <p className="text-xs leading-relaxed text-gray-700">
              Gerencia de planta, supervisores, ingeniería de procesos, mantenimiento y calidad.
            </p>
          </Card>
          <Card title="Reglas de negocio">
            <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
              <li>Las fórmulas deben estar documentadas y ser consistentes.</li>
              <li>Los datos deben provenir de registros reales, no de carga manual agregada.</li>
              <li>Los indicadores deben poder auditarse hasta el registro fuente.</li>
              <li>Las paradas deben tener causa clasificada.</li>
              <li>Los objetivos deben ser versionados.</li>
            </ul>
          </Card>
          <Card title="Integraciones">
            <ul className="grid gap-1 text-xs text-gray-700 sm:grid-cols-2">
              <li>📟 MES: tiempos, cantidades y paradas</li>
              <li>✅ Calidad: conformidad y rechazos</li>
              <li>🏭 Producción: órdenes y estándares</li>
              <li>🔧 Mantenimiento: disponibilidad y fallas</li>
              <li>💰 Costos: impacto de pérdidas</li>
            </ul>
          </Card>
          <Card title="Reportes">
            <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
              <li>OEE por centro y período.</li>
              <li>Disponibilidad, rendimiento y calidad.</li>
              <li>FPY y reproceso.</li>
              <li>Desperdicio por causa.</li>
              <li>Cumplimiento del plan.</li>
              <li>Pareto de paradas.</li>
            </ul>
          </Card>
          <Card title="Criterios de aceptación">
            <ul className="list-disc space-y-1 pl-5 text-xs text-gray-700">
              <li>El OEE se calcula con la fórmula acordada.</li>
              <li>Los indicadores son trazables a datos reales.</li>
              <li>Las paradas se clasifican y analizan.</li>
              <li>Los tableros permiten comparar períodos.</li>
              <li>Las metas y definiciones están documentadas.</li>
            </ul>
          </Card>
        </div>
      )}

      {/* ------------------------------ OEE y factores ------------------------------ */}
      {tab === 'oee' && (
        <div className="space-y-4">
          <FunctionBlock code="REN-01">
            <Toolbar>
              <select className={INPUT} value={fCentro} onChange={e => setFCentro(e.target.value)}>
                <option value="">Todos los centros</option>
                {centros.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar(`OEE recalculado con datos reales de MES: A × P × Q en ${oeeVisibles.length} registros auditables.`)}>
                Recalcular OEE
              </button>
              <span className="ml-auto text-xs text-gray-500">Fórmula: OEE = Disponibilidad × Rendimiento × Calidad</span>
            </Toolbar>
            <DataTable footer={`${oeeVisibles.length} registros · OEE promedio: ${fmtPct(oeeVisibles.reduce((a, r) => a + calcularOee(r), 0) / Math.max(oeeVisibles.length, 1))}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Centro</Th><Th>Equipo</Th><Th>Línea</Th><Th>Fecha</Th><Th align="center">Turno</Th>
                  <Th align="right">Disponibilidad</Th><Th align="right">Rendimiento</Th><Th align="right">Calidad</Th>
                  <Th align="right">OEE</Th><Th align="right">Objetivo</Th><Th align="center">Vs. objetivo</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {oeeVisibles.map(r => {
                  const oee = calcularOee(r);
                  return (
                    <tr key={r.id} className="hoverable">
                      <Td>{r.centro}</Td>
                      <Td><span className="font-mono text-gray-600">{r.equipo}</span></Td>
                      <Td className="text-gray-500">{r.linea}</Td>
                      <Td>{fmtFecha(r.fecha)}</Td>
                      <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{r.turno}</span></Td>
                      <Td align="right"><span className="num-col">{fmtPct(r.disponibilidad)}</span></Td>
                      <Td align="right"><span className="num-col">{fmtPct(r.rendimiento)}</span></Td>
                      <Td align="right"><span className="num-col">{fmtPct(r.calidad)}</span></Td>
                      <Td align="right"><span className="num-col font-semibold">{fmtPct(oee)}</span></Td>
                      <Td align="right"><span className="num-col text-gray-500">{fmtPct(r.objetivo, 0)}</span></Td>
                      <Td align="center"><StatusBadge label={oee >= r.objetivo ? 'Cumple' : 'Bajo meta'} tone={toneOee(oee, r.objetivo)} /></Td>
                    </tr>
                  );
                })}
                {oeeVisibles.length === 0 && <EmptyRow colSpan={11} text="No hay registros para el centro seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="REN-02">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Disponibilidad exportada: ${DISPONIBILIDADES.length} registros con paradas y esperas descontadas.`)}>
                Exportar disponibilidad
              </button>
              <span className="ml-auto text-xs text-gray-500">Disponibilidad = tiempo productivo ÷ tiempo planificado</span>
            </Toolbar>
            <DataTable footer={`Promedio: ${fmtPct(dispPromedio)} · Los tiempos provienen del registro real de MES`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Equipo</Th><Th>Fecha</Th><Th align="center">Turno</Th><Th align="right">Planificado</Th><Th align="right">Productivo</Th>
                  <Th align="right">Paradas</Th><Th align="right">Esperas</Th><Th align="right">Disponibilidad</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DISPONIBILIDADES.map(d => (
                  <tr key={d.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{d.equipo}</span></Td>
                    <Td>{fmtFecha(d.fecha)}</Td>
                    <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{d.turno}</span></Td>
                    <Td align="right"><span className="num-col">{fmtNum(d.planificadoMin)} min</span></Td>
                    <Td align="right"><span className="num-col">{fmtNum(d.productivoMin)} min</span></Td>
                    <Td align="right"><span className="num-col text-red-600">{fmtNum(d.paradasMin)} min</span></Td>
                    <Td align="right"><span className="num-col text-amber-600">{fmtNum(d.esperasMin)} min</span></Td>
                    <Td align="right"><span className="num-col font-semibold">{fmtPct(pctDisponibilidad(d))}</span></Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="REN-03">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Rendimiento exportado: producción real vs. teórica según velocidad estándar en ${RENDIMIENTOS.length} registros.`)}>
                Exportar rendimiento
              </button>
              <span className="ml-auto text-xs text-gray-500">Rendimiento = producción real ÷ producción teórica</span>
            </Toolbar>
            <DataTable footer={`Promedio: ${fmtPct(RENDIMIENTOS.reduce((a, r) => a + pctRendimiento(r), 0) / RENDIMIENTOS.length)}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Equipo</Th><Th>Fecha</Th><Th align="right">Real</Th><Th align="right">Teórico</Th><Th align="center">Velocidad estándar</Th>
                  <Th align="right">Tiempo efectivo</Th><Th align="right">Rendimiento</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RENDIMIENTOS.map(r => (
                  <tr key={r.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{r.equipo}</span></Td>
                    <Td>{fmtFecha(r.fecha)}</Td>
                    <Td align="right"><span className="num-col">{fmtNum(r.real)} {r.unidad}</span></Td>
                    <Td align="right"><span className="num-col text-gray-500">{fmtNum(r.teorico)} {r.unidad}</span></Td>
                    <Td align="center"><span className="font-mono text-gray-500">{r.velocidadStd}</span></Td>
                    <Td align="right"><span className="num-col">{fmtNum(r.tiempoEfectivoMin)} min</span></Td>
                    <Td align="right"><span className="num-col font-semibold">{fmtPct(pctRendimiento(r))}</span></Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="REN-04">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Calidad exportada: ${CALIDADES.length} registros integrando rechazos y reprocesos desde el módulo CAL.`)}>
                Exportar calidad
              </button>
              <span className="ml-auto text-xs text-gray-500">Calidad = unidades conformes ÷ unidades producidas</span>
            </Toolbar>
            <DataTable footer={`Promedio: ${fmtPct(CALIDADES.reduce((a, c) => a + pctCalidad(c), 0) / CALIDADES.length)}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Equipo</Th><Th>Fecha</Th><Th align="right">Producidas</Th><Th align="right">Conformes</Th>
                  <Th align="right">Rechazos</Th><Th align="right">Reprocesos</Th><Th align="right">Calidad</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CALIDADES.map(c => (
                  <tr key={c.id} className="hoverable">
                    <Td><span className="font-mono text-gray-600">{c.equipo}</span></Td>
                    <Td>{fmtFecha(c.fecha)}</Td>
                    <Td align="right"><span className="num-col">{fmtNum(c.producidas)}</span></Td>
                    <Td align="right"><span className="num-col">{fmtNum(c.conformes)}</span></Td>
                    <Td align="right"><span className="num-col text-red-600">{fmtNum(c.rechazos)}</span></Td>
                    <Td align="right"><span className="num-col text-amber-600">{fmtNum(c.reprocesos)}</span></Td>
                    <Td align="right"><span className="num-col font-semibold">{fmtPct(pctCalidad(c))}</span></Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {/* ------------------------------ Ciclo y preparación ------------------------------ */}
      {tab === 'ciclo' && (
        <div className="space-y-4">
          <FunctionBlock code="REN-05">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Tiempos de ciclo analizados: ${TIEMPOS_CICLO.length} productos con comparación real vs. estándar.`)}>
                Analizar tiempos de ciclo
              </button>
              <span className="ml-auto text-xs text-gray-500">Desviación = (real − estándar) ÷ estándar</span>
            </Toolbar>
            <DataTable footer={`${TIEMPOS_CICLO.length} productos comparados contra su estándar de ruta (PRD)`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Producto</Th><Th>Equipo</Th><Th align="right">Estándar</Th><Th align="right">Real</Th><Th align="right">Desviación</Th><Th>Fecha</Th><Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TIEMPOS_CICLO.map(t => {
                  const desv = (t.real - t.estandar) / t.estandar;
                  return (
                    <tr key={t.id} className="hoverable">
                      <Td>{t.producto}</Td>
                      <Td><span className="font-mono text-gray-600">{t.equipo}</span></Td>
                      <Td align="right"><span className="num-col text-gray-500">{fmtNum(t.estandar)} {t.unidad}</span></Td>
                      <Td align="right"><span className="num-col">{fmtNum(t.real)} {t.unidad}</span></Td>
                      <Td align="right"><span className={`num-col ${desv > 0.05 ? 'text-red-600' : 'text-green-700'}`}>{desv >= 0 ? '+' : ''}{fmtPct(desv)}</span></Td>
                      <Td>{fmtFecha(t.fecha)}</Td>
                      <Td align="center"><StatusBadge label={desv > 0.05 ? 'Sobre estándar' : 'Dentro del estándar'} tone={desv > 0.05 ? 'red' : 'green'} /></Td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="REN-06">
            <Toolbar>
              <select className={INPUT} value={fEquipoSetup} onChange={e => setFEquipoSetup(e.target.value)}>
                <option value="">Todos los equipos</option>
                {equiposSetup.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Setups analizados: ${SETUPS.reduce((a, s) => a + (s.duracionMin - s.estandarMin), 0)} min por encima del estándar acumulados.`)}>
                Analizar setups
              </button>
            </Toolbar>
            <DataTable footer={`${setupsVisibles.length} preparaciones entre cambio de producto, formato y limpieza`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Equipo</Th><Th>Tipo</Th><Th>Detalle</Th><Th align="right">Duración</Th><Th align="right">Estándar</Th><Th align="right">Exceso</Th><Th>Responsable</Th><Th>Fecha</Th><Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {setupsVisibles.map(s => {
                  const exceso = s.duracionMin - s.estandarMin;
                  return (
                    <tr key={s.id} className="hoverable">
                      <Td><span className="font-mono text-gray-600">{s.equipo}</span></Td>
                      <Td>{s.tipo}</Td>
                      <Td className="text-gray-500">{s.detalle}</Td>
                      <Td align="right"><span className="num-col">{fmtNum(s.duracionMin)} min</span></Td>
                      <Td align="right"><span className="num-col text-gray-500">{fmtNum(s.estandarMin)} min</span></Td>
                      <Td align="right"><span className={`num-col ${exceso > 0 ? 'text-red-600' : 'text-green-700'}`}>{exceso > 0 ? `+${fmtNum(exceso)}` : fmtNum(exceso)} min</span></Td>
                      <Td>{s.responsable}</Td>
                      <Td>{fmtFecha(s.fecha)}</Td>
                      <Td align="center"><StatusBadge label={exceso > 0 ? 'Sobre el estándar' : 'OK'} tone={exceso > 0 ? 'red' : 'green'} /></Td>
                    </tr>
                  );
                })}
                {setupsVisibles.length === 0 && <EmptyRow colSpan={9} text="No hay setups para el equipo seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {/* ------------------------------ Calidad y pérdidas ------------------------------ */}
      {tab === 'calidad' && (
        <div className="space-y-4">
          <FunctionBlock code="REN-07">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => avisar(`FPY recalculado: promedio ${fmtPct(fpyPromedio)} contra objetivo ${fmtPct(OBJETIVOS_REN[0].fpy, 0)}.`)}>
                Recalcular FPY
              </button>
              <span className="ml-auto text-xs text-gray-500">FPY = conformes a la primera ÷ unidades iniciadas</span>
            </Toolbar>
            <DataTable footer={`${FPY.length} productos · sin contar reprocesos en la primera pasada`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Producto</Th><Th>Línea</Th><Th align="right">Iniciadas</Th><Th align="right">Conformes 1ª</Th><Th align="right">FPY</Th><Th>Fecha</Th><Th align="center">Vs. meta 92 %</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {FPY.map(f => {
                  const fpy = pctFpy(f);
                  return (
                    <tr key={f.id} className="hoverable">
                      <Td>{f.producto}</Td>
                      <Td className="text-gray-500">{f.linea}</Td>
                      <Td align="right"><span className="num-col">{fmtNum(f.iniciadas)}</span></Td>
                      <Td align="right"><span className="num-col">{fmtNum(f.conformesPrimera)}</span></Td>
                      <Td align="right"><span className="num-col font-semibold">{fmtPct(fpy)}</span></Td>
                      <Td>{fmtFecha(f.fecha)}</Td>
                      <Td align="center"><StatusBadge label={fpy >= 0.92 ? 'Cumple' : 'Bajo meta'} tone={tonePct(fpy, 0.92)} /></Td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="REN-08">
            <Toolbar>
              <select className={INPUT} value={fProductoDesp} onChange={e => setFProductoDesp(e.target.value)}>
                <option value="">Todos los productos</option>
                {productosDesp.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar('Desperdicio analizado por producto, proceso, turno y causa. Top causa: quemado por sobretostión.')}>
                Analizar por causa
              </button>
            </Toolbar>
            <DataTable footer={`Costo total de desperdicio: ${fmtMoney(costoDesperdicio)}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Producto</Th><Th>Proceso</Th><Th align="center">Turno</Th><Th>Causa</Th><Th align="right">Cantidad</Th><Th align="right">Costo</Th><Th>Fecha</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {desperdiciosVisibles.map(d => (
                  <tr key={d.id} className="hoverable">
                    <Td>{d.producto}</Td>
                    <Td>{d.proceso}</Td>
                    <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{d.turno}</span></Td>
                    <Td className="text-gray-500">{d.causa}</Td>
                    <Td align="right"><span className="num-col text-red-600">{fmtNum(d.cantidad)} {d.unidad}</span></Td>
                    <Td align="right"><span className="num-col">{fmtMoney(d.costo)}</span></Td>
                    <Td>{fmtFecha(d.fecha)}</Td>
                  </tr>
                ))}
                {desperdiciosVisibles.length === 0 && <EmptyRow colSpan={7} text="No hay desperdicio para el producto seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="REN-09">
            <Toolbar>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Reprocesos costeados: ${fmtMoney(costoReproceso)} y ${fmtNum(tiempoReproceso)} h de capacidad perdida.`)}>
                Costear reprocesos
              </button>
              <span className="ml-auto text-xs text-gray-500">Impacto en tiempo y costo</span>
            </Toolbar>
            <DataTable footer={`${REPROCESOS_REN.length} reprocesos · costo ${fmtMoney(costoReproceso)} · ${fmtNum(tiempoReproceso)} h extra`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Producto</Th><Th>Lote</Th><Th>Causa</Th><Th align="right">Unidades</Th><Th align="right">Tiempo extra</Th><Th align="right">Costo</Th><Th>Fecha</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {REPROCESOS_REN.map(r => (
                  <tr key={r.id} className="hoverable">
                    <Td>{r.producto}</Td>
                    <Td><span className="font-mono text-gray-500">{r.lote}</span></Td>
                    <Td className="text-gray-500">{r.causa}</Td>
                    <Td align="right"><span className="num-col text-amber-600">{fmtNum(r.unidades)} {r.unidad}</span></Td>
                    <Td align="right"><span className="num-col">{fmtNum(r.tiempoExtra)} h</span></Td>
                    <Td align="right"><span className="num-col">{fmtMoney(r.costo)}</span></Td>
                    <Td>{fmtFecha(r.fecha)}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </FunctionBlock>
        </div>
      )}

      {/* ------------------------------ Plan, paradas y tableros ------------------------------ */}
      {tab === 'plan' && (
        <div className="space-y-4">
          <FunctionBlock code="REN-10">
            <Toolbar>
              <select className={INPUT} value={fPeriodoPlan} onChange={e => setFPeriodoPlan(e.target.value)}>
                <option value="">Todos los períodos</option>
                {periodosPlan.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Cumplimiento del plan comparado: real vs. planificado en ${cumplimientoVisibles.length} filas.`)}>
                Comparar contra el plan
              </button>
            </Toolbar>
            <DataTable footer={`Cumplimiento promedio: ${fmtPct(cumplimientoVisibles.reduce((a, c) => a + pctCumplimiento(c), 0) / Math.max(cumplimientoVisibles.length, 1), 0)}`}>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <Th>Período</Th><Th>Producto</Th><Th>Centro</Th><Th align="right">Planificado</Th><Th align="right">Real</Th><Th align="right">Cumplimiento</Th><Th align="center">Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cumplimientoVisibles.map(c => {
                  const cumpl = pctCumplimiento(c);
                  return (
                    <tr key={c.id} className="hoverable">
                      <Td><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{c.periodo}</span></Td>
                      <Td>{c.producto}</Td>
                      <Td className="text-gray-500">{c.centro}</Td>
                      <Td align="right"><span className="num-col text-gray-500">{fmtNum(c.planificado)} {c.unidad}</span></Td>
                      <Td align="right"><span className="num-col">{fmtNum(c.real)} {c.unidad}</span></Td>
                      <Td align="right"><span className="num-col font-semibold">{fmtPct(cumpl)}</span></Td>
                      <Td align="center"><StatusBadge label={cumpl >= 0.95 ? 'En plan' : cumpl >= 0.9 ? 'Leve atraso' : 'Atrasado'} tone={cumpl >= 0.95 ? 'green' : cumpl >= 0.9 ? 'amber' : 'red'} /></Td>
                    </tr>
                  );
                })}
                {cumplimientoVisibles.length === 0 && <EmptyRow colSpan={7} text="No hay plan para el período seleccionado." />}
              </tbody>
            </DataTable>
          </FunctionBlock>

          <FunctionBlock code="REN-11">
            <Toolbar>
              <select className={INPUT} value={fCategoriaPar} onChange={e => setFCategoriaPar(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categoriasPar.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Pareto de paradas calculado: ${pareto.length} causas clasificadas por duración, frecuencia y responsabilidad.`)}>
                Calcular Pareto
              </button>
            </Toolbar>
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DataTable footer={`${paradasVisibles.length} paradas clasificadas por causa, duración y responsabilidad`}>
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <Th>Equipo</Th><Th>Causa</Th><Th align="center">Categoría</Th><Th>Inicio</Th><Th align="right">Duración</Th><Th>Responsable</Th><Th align="center">Tipo</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paradasVisibles.map(p => (
                      <tr key={p.id} className="hoverable">
                        <Td><span className="font-mono text-gray-600">{p.equipo}</span></Td>
                        <Td>{p.causa}</Td>
                        <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{p.categoria}</span></Td>
                        <Td><span className="font-mono text-gray-500">{p.fecha.slice(5)} {p.inicio}</span></Td>
                        <Td align="right"><span className="num-col text-red-600">{fmtNum(p.duracionMin)} min</span></Td>
                        <Td className="text-gray-500">{p.responsable}</Td>
                        <Td align="center"><StatusBadge label={p.tipo} tone={p.tipo === 'Emergencia' ? 'red' : p.tipo === 'Operativa' ? 'amber' : 'blue'} /></Td>
                      </tr>
                    ))}
                    {paradasVisibles.length === 0 && <EmptyRow colSpan={7} text="No hay paradas en la categoría seleccionada." />}
                  </tbody>
                </DataTable>
              </div>
              <Card title="Pareto de paradas (minutos por categoría)">
                <ul className="space-y-2">
                  {pareto.map(p => (
                    <li key={p.categoria}>
                      <div className="flex items-center justify-between text-xs text-gray-700">
                        <span>{p.categoria}</span>
                        <span className="font-mono text-gray-500">{fmtNum(p.minutos)} min</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded bg-gray-100">
                        <div className="h-full rounded bg-petroleum-500" style={{ width: `${Math.max((p.minutos / maxPareto) * 100, 4)}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </FunctionBlock>

          <FunctionBlock code="REN-12">
            <Toolbar>
              <select className={INPUT} value={periodoBench} onChange={e => setPeriodoBench(e.target.value)}>
                <option value="Sem 42">Sem 42</option>
                <option value="Sem 43">Sem 43</option>
              </select>
              <button className={BTN_PRIMARY} onClick={() => avisar(`Tablero ${periodoBench} comparado contra objetivos v4: brechas identificadas en Tostión y Conchado.`)}>
                Comparar contra objetivos
              </button>
            </Toolbar>
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DataTable footer={`Benchmarks por planta, centro, turno, producto y período (${periodoBench})`}>
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <Th>Alcance</Th><Th align="center">Período</Th><Th align="right">OEE</Th><Th align="right">Objetivo</Th><Th align="right">Brecha</Th><Th align="center">Mejor turno</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {BENCHMARKS.map(b => {
                      const brecha = b.oee - b.objetivo;
                      return (
                        <tr key={b.id} className="hoverable">
                          <Td>{b.alcance}</Td>
                          <Td align="center"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{b.periodo}</span></Td>
                          <Td align="right"><span className="num-col font-semibold">{fmtPct(b.oee)}</span></Td>
                          <Td align="right"><span className="num-col text-gray-500">{fmtPct(b.objetivo, 0)}</span></Td>
                          <Td align="right"><span className={`num-col ${brecha >= 0 ? 'text-green-700' : 'text-red-600'}`}>{brecha >= 0 ? '+' : ''}{fmtPct(brecha)}</span></Td>
                          <Td align="center"><span className="rounded-full bg-petroleum-50 px-2 py-0.5 text-xs text-petroleum-700">{b.mejorTurno}</span></Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </DataTable>
              </div>
              <div className="space-y-3">
                <Card title="Objetivos versionados">
                  <ul className="space-y-2">
                    {OBJETIVOS_REN.map(o => (
                      <li key={o.version} className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-semibold text-petroleum-700">{o.version}</span>
                          <span className="text-gray-400">{o.vigencia}</span>
                        </div>
                        <div className="mt-1 text-gray-700">OEE {fmtPct(o.oeePlanta, 0)} · FPY {fmtPct(o.fpy, 0)} · Desperdicio máx. {fmtNum(o.desperdicioKgMax)} kg</div>
                        <div className="text-gray-400">{o.aprobadoPor}</div>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card title="Reportes del tablero">
                  <ul className="space-y-1 text-xs text-gray-700">
                    {REPORTES_REN.map(r => (
                      <li key={r.id} className="flex items-center justify-between gap-2">
                        <span>{r.nombre}</span>
                        <button className={BTN_SECONDARY} onClick={() => avisar(`Reporte «${r.nombre}» generado para ${periodoBench}.`)}>Generar</button>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </FunctionBlock>
        </div>
      )}
    </div>
  );
}

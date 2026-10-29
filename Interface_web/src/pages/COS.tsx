import { useMemo, useState } from 'react';
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  Card,
  DataTable,
  EmptyRow,
  FunctionBlock,
  INPUT,
  PageHeader,
  StatCard,
  StatusBadge,
  Tabs,
  Td,
  Th,
  Toolbar,
  type BadgeTone,
} from '../components/ui';
import { MODULOS, conteoModulo } from '../data/modules';
import { fmtHoras, fmtMoney, fmtNum, fmtPct } from '../lib/format';
import {
  CONSUMOS_MATERIAL,
  COSTOS_ESTANDAR,
  COSTO_POR_ORDEN,
  DESPERDICIOS,
  INDIRECTOS,
  MANO_OBRA,
  MAQUINAS_COSTO,
  MARGENES,
  ORDENES_COSTO,
  PREVISTO_VS_REAL,
  REPORTES_COS,
  REPROCESOS,
  TIEMPOS_IMPRODUCTIVOS,
  VARIACIONES,
  WIP,
  type Indirecto,
  type VariacionCosto,
} from '../data/cos';

const MOD = MODULOS.find(m => m.id === 'cos')!;

const SELECT =
  'rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-800 outline-none transition focus:border-petroleum-500 focus:ring-2 focus:ring-petroleum-100';

function MensajeOk({ texto }: { texto: string }) {
  return (
    <div role="status" className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      {texto}
    </div>
  );
}

function toneResultado(r: VariacionCosto['resultado']): BadgeTone {
  return r === 'Favorable' ? 'green' : 'red';
}

function toneVariacion(n: number): BadgeTone {
  if (n < -0.001) return 'green';
  if (n > 0.001) return 'red';
  return 'gray';
}

/* ------------------------------- COS-01 ---------------------------------- */

function BloqueCostoEstandar() {
  const [q, setQ] = useState('');
  const [mensaje, setMensaje] = useState('');

  const visibles = useMemo(() => {
    const t = q.trim().toLocaleLowerCase('es');
    if (!t) return COSTOS_ESTANDAR;
    return COSTOS_ESTANDAR.filter(p => [p.sku, p.producto].join(' ').toLocaleLowerCase('es').includes(t));
  }, [q]);

  function recalcular() {
    window.setTimeout(() => setMensaje('Costos estándar recalculados a partir de BOM, rutas, tarifas y costos adicionales vigentes (simulado).'), 400);
  }

  return (
    <FunctionBlock code="COS-01">
      <Toolbar>
        <input className={`${INPUT} max-w-xs`} placeholder="Buscar producto o SKU..." value={q} onChange={e => setQ(e.target.value)} />
        <button type="button" className={BTN_PRIMARY} onClick={recalcular}>Recalcular estándar</button>
        <span className="text-xs text-gray-500">Base: lista de materiales, rutas, tarifas y costos adicionales.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`${visibles.length} productos con costo estándar vigente (COP por unidad).`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>SKU</Th>
            <Th>Producto</Th>
            <Th align="right">Materiales</Th>
            <Th align="right">Mano de obra</Th>
            <Th align="right">Máquina</Th>
            <Th align="right">Indirectos</Th>
            <Th align="right">Total estándar</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(p => (
            <tr key={p.sku} className="hoverable">
              <Td><span className="font-mono text-gray-600">{p.sku}</span></Td>
              <Td className="font-medium text-gray-800">{p.producto}</Td>
              <Td align="right" className="font-mono">{fmtMoney(p.materiales)}</Td>
              <Td align="right" className="font-mono">{fmtMoney(p.manoObra)}</Td>
              <Td align="right" className="font-mono">{fmtMoney(p.maquina)}</Td>
              <Td align="right" className="font-mono">{fmtMoney(p.indirectos)}</Td>
              <Td align="right" className="font-mono font-semibold text-gray-800">{fmtMoney(p.total)}</Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={7} text="No hay productos que coincidan con la búsqueda." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-02 ---------------------------------- */

function BloqueCostoReal() {
  const [q, setQ] = useState('');
  const visibles = useMemo(() => {
    const t = q.trim().toLocaleLowerCase('es');
    if (!t) return ORDENES_COSTO;
    return ORDENES_COSTO.filter(o => [o.orden, o.producto].join(' ').toLocaleLowerCase('es').includes(t));
  }, [q]);

  return (
    <FunctionBlock code="COS-02">
      <Toolbar>
        <input className={`${INPUT} max-w-xs`} placeholder="Buscar orden o producto..." value={q} onChange={e => setQ(e.target.value)} />
        <span className="text-xs text-gray-500">Costo real con materiales consumidos, tiempos reales y tarifas.</span>
      </Toolbar>
      <DataTable footer={`${visibles.length} órdenes con costo real calculado.`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Orden</Th>
            <Th>Producto</Th>
            <Th align="right">Estándar unit.</Th>
            <Th align="right">Real unit.</Th>
            <Th align="right">Variación</Th>
            <Th align="center">%</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(o => (
            <tr key={o.orden} className="hoverable">
              <Td><span className="font-mono text-gray-600">{o.orden}</span></Td>
              <Td>{o.producto}</Td>
              <Td align="right" className="font-mono">{fmtMoney(o.estandarUnit)}</Td>
              <Td align="right" className="font-mono">{fmtMoney(o.realUnit)}</Td>
              <Td align="right" className={`font-mono ${o.variacion >= 0 ? 'text-red-600' : 'text-green-600'}`}>{o.variacion >= 0 ? '+' : ''}{fmtMoney(o.variacion)}</Td>
              <Td align="center"><StatusBadge label={fmtPct(Math.abs(o.variacionPct))} tone={toneVariacion(o.variacionPct)} /></Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={6} text="No hay órdenes que coincidan con la búsqueda." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-03 ---------------------------------- */

function BloqueMateriales() {
  return (
    <FunctionBlock code="COS-03">
      <DataTable footer="Consumo real valorizado y comparado contra el consumo teórico de la BOM.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Material</Th>
            <Th>Orden</Th>
            <Th align="right">Teórico (kg)</Th>
            <Th align="right">Real (kg)</Th>
            <Th align="center">Desviación</Th>
            <Th align="right">Precio/kg</Th>
            <Th align="right">Valor real</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {CONSUMOS_MATERIAL.map(m => (
            <tr key={m.id} className="hoverable">
              <Td className="font-medium text-gray-800">{m.material}</Td>
              <Td><span className="font-mono text-gray-600">{m.orden}</span></Td>
              <Td align="right" className="font-mono">{fmtNum(m.teoricoKg)}</Td>
              <Td align="right" className="font-mono">{fmtNum(m.realKg)}</Td>
              <Td align="center">
                <span className={`font-mono ${m.desviacionPct > 0 ? 'text-red-600' : m.desviacionPct < 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  {m.desviacionPct > 0 ? '+' : ''}{fmtPct(m.desviacionPct)}
                </span>
              </Td>
              <Td align="right" className="font-mono">{fmtMoney(m.precioKg)}</Td>
              <Td align="right" className="font-mono">{fmtMoney(m.realKg * m.precioKg)}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-04 ---------------------------------- */

function BloqueManoObra() {
  return (
    <FunctionBlock code="COS-04">
      <DataTable footer="Horas reales valorizadas por operario, turno y centro de trabajo.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Recurso</Th>
            <Th>Turno</Th>
            <Th align="right">Horas</Th>
            <Th align="right">Tarifa</Th>
            <Th align="right">Costo</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MANO_OBRA.map(m => (
            <tr key={m.id} className="hoverable">
              <Td className="font-medium text-gray-800">{m.recurso}</Td>
              <Td>{m.turno}</Td>
              <Td align="right" className="font-mono">{fmtHoras(m.horas)}</Td>
              <Td align="right" className="font-mono">{fmtMoney(m.tarifa)}/h</Td>
              <Td align="right" className="font-mono">{fmtMoney(m.costo)}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-05 ---------------------------------- */

function BloqueMaquina() {
  return (
    <FunctionBlock code="COS-05">
      <DataTable footer="Uso de máquinas y centros valorizado según tarifa horaria y tiempo registrado.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Centro</Th>
            <Th align="right">Horas</Th>
            <Th align="right">Tarifa</Th>
            <Th align="right">Costo</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {MAQUINAS_COSTO.map(m => (
            <tr key={m.id} className="hoverable">
              <Td className="font-medium text-gray-800">{m.centro}</Td>
              <Td align="right" className="font-mono">{fmtHoras(m.horas)}</Td>
              <Td align="right" className="font-mono">{fmtMoney(m.tarifa)}/h</Td>
              <Td align="right" className="font-mono">{fmtMoney(m.costo)}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-06 ---------------------------------- */

function BloqueIndirectos() {
  const [bases, setBases] = useState<Record<string, Indirecto['base']>>(
    Object.fromEntries(INDIRECTOS.map(i => [i.id, i.base])),
  );
  const [mensaje, setMensaje] = useState('');

  function guardar() {
    window.setTimeout(() => setMensaje('Bases de distribución de indirectos guardadas: la distribución se aplica al cierre (simulado).'), 400);
  }

  return (
    <FunctionBlock code="COS-06">
      <Toolbar>
        <button type="button" className={BTN_PRIMARY} onClick={guardar}>Guardar distribución</button>
        <span className="text-xs text-gray-500">Bases configurables: horas, consumo, unidades o valor. Cada base debe quedar documentada.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`${INDIRECTOS.length} conceptos · total ${fmtMoney(INDIRECTOS.reduce((a, i) => a + i.importe, 0))}`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Código</Th>
            <Th>Concepto</Th>
            <Th>Base de distribución</Th>
            <Th align="right">Importe</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {INDIRECTOS.map(i => (
            <tr key={i.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{i.id}</span></Td>
              <Td className="font-medium text-gray-800">{i.concepto}</Td>
              <Td>
                <select
                  className={SELECT}
                  value={bases[i.id]}
                  onChange={e => setBases(prev => ({ ...prev, [i.id]: e.target.value as Indirecto['base'] }))}
                  aria-label={`Base de distribución de ${i.concepto}`}
                >
                  {(['Horas máquina', 'Horas mano de obra', 'Valor de producción', 'Unidades'] as Indirecto['base'][]).map(b => <option key={b}>{b}</option>)}
                </select>
              </Td>
              <Td align="right" className="font-mono">{fmtMoney(i.importe)}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-07 ---------------------------------- */

function BloquePrevistoReal() {
  return (
    <FunctionBlock code="COS-07">
      <DataTable footer="Diferencias de cantidad, precio y mezcla por orden y producto (COP por unidad).">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Orden</Th>
            <Th>Producto</Th>
            <Th align="right">Previsto</Th>
            <Th align="right">Real</Th>
            <Th align="center">Δ Cantidad</Th>
            <Th align="center">Δ Precio</Th>
            <Th align="center">Δ Mezcla</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {PREVISTO_VS_REAL.map(p => (
            <tr key={p.orden} className="hoverable">
              <Td><span className="font-mono text-gray-600">{p.orden}</span></Td>
              <Td>{p.producto}</Td>
              <Td align="right" className="font-mono">{fmtMoney(p.previsto)}</Td>
              <Td align="right" className="font-mono">{fmtMoney(p.real)}</Td>
              <Td align="center"><span className={`font-mono ${p.deltaCantidadPct > 0 ? 'text-red-600' : p.deltaCantidadPct < 0 ? 'text-green-600' : 'text-gray-500'}`}>{p.deltaCantidadPct > 0 ? '+' : ''}{fmtPct(p.deltaCantidadPct)}</span></Td>
              <Td align="center"><span className={`font-mono ${p.deltaPrecioPct > 0 ? 'text-red-600' : p.deltaPrecioPct < 0 ? 'text-green-600' : 'text-gray-500'}`}>{p.deltaPrecioPct > 0 ? '+' : ''}{fmtPct(p.deltaPrecioPct)}</span></Td>
              <Td align="center"><span className={`font-mono ${p.deltaMezclaPct > 0 ? 'text-red-600' : p.deltaMezclaPct < 0 ? 'text-green-600' : 'text-gray-500'}`}>{p.deltaMezclaPct > 0 ? '+' : ''}{fmtPct(p.deltaMezclaPct)}</span></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-08 ---------------------------------- */

function BloqueVariaciones() {
  const [tipo, setTipo] = useState('');

  const visibles = useMemo(() => {
    if (!tipo) return VARIACIONES;
    return VARIACIONES.filter(v => v.tipo === tipo);
  }, [tipo]);

  return (
    <FunctionBlock code="COS-08">
      <Toolbar>
        <select className={SELECT} value={tipo} onChange={e => setTipo(e.target.value)} aria-label="Filtrar por tipo de variación">
          <option value="">Todos los tipos</option>
          {(['Material', 'Precio', 'Mano de obra', 'Máquina', 'Eficiencia'] as VariacionCosto['tipo'][]).map(t => <option key={t}>{t}</option>)}
        </select>
        <span className="text-xs text-gray-500">Toda variación debe explicarse por causa y quedar documentada.</span>
      </Toolbar>
      <DataTable footer={`${visibles.length} variaciones · neto ${fmtMoney(visibles.reduce((a, v) => a + (v.resultado === 'Desfavorable' ? v.importe : -v.importe), 0))}`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>ID</Th>
            <Th align="center">Tipo</Th>
            <Th>Orden</Th>
            <Th align="right">Importe</Th>
            <Th>Causa</Th>
            <Th align="center">Resultado</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {visibles.map(v => (
            <tr key={v.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{v.id}</span></Td>
              <Td align="center"><StatusBadge label={v.tipo} tone="petroleum" /></Td>
              <Td><span className="font-mono text-gray-600">{v.orden}</span></Td>
              <Td align="right" className={`font-mono ${v.resultado === 'Desfavorable' ? 'text-red-600' : 'text-green-600'}`}>{v.resultado === 'Desfavorable' ? '+' : '−'}{fmtMoney(v.importe)}</Td>
              <Td className="max-w-md">{v.causa}</Td>
              <Td align="center"><StatusBadge label={v.resultado} tone={toneResultado(v.resultado)} /></Td>
            </tr>
          ))}
          {visibles.length === 0 && <EmptyRow colSpan={6} text="No hay variaciones de ese tipo." />}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-09 ---------------------------------- */

function BloqueDesperdicio() {
  return (
    <FunctionBlock code="COS-09">
      <DataTable footer={`Merma total ${fmtPct(DESPERDICIOS.reduce((a, d) => a + d.mermaPct, 0) / DESPERDICIOS.length)} promedio · impacto ${fmtMoney(DESPERDICIOS.reduce((a, d) => a + d.costo, 0))}`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Orden</Th>
            <Th>Producto</Th>
            <Th align="right">Cantidad</Th>
            <Th align="center">Merma</Th>
            <Th align="right">Costo del desperdicio</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {DESPERDICIOS.map(d => (
            <tr key={d.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{d.orden}</span></Td>
              <Td>{d.producto}</Td>
              <Td align="right" className="font-mono">{fmtNum(d.cantidadKg)} kg</Td>
              <Td align="center"><StatusBadge label={fmtPct(d.mermaPct)} tone={d.mermaPct > 0.05 ? 'red' : 'amber'} /></Td>
              <Td align="right" className="font-mono text-red-600">{fmtMoney(d.costo)}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-10 ---------------------------------- */

function BloqueReproceso() {
  return (
    <FunctionBlock code="COS-10">
      <DataTable footer={`Reprocesos y retrabajos del período: ${fmtMoney(REPROCESOS.reduce((a, r) => a + r.costo, 0))}`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Orden</Th>
            <Th>Motivo</Th>
            <Th align="right">Horas</Th>
            <Th align="right">Costo</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {REPROCESOS.map(r => (
            <tr key={r.id} className="hoverable">
              <Td><span className="font-mono text-gray-600">{r.orden}</span></Td>
              <Td>{r.motivo}</Td>
              <Td align="right" className="font-mono">{fmtHoras(r.horas)}</Td>
              <Td align="right" className="font-mono text-red-600">{fmtMoney(r.costo)}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-11 ---------------------------------- */

function BloqueImproductivos() {
  return (
    <FunctionBlock code="COS-11">
      <DataTable footer={`Paradas, esperas y pérdidas de eficiencia: ${fmtMoney(TIEMPOS_IMPRODUCTIVOS.reduce((a, t) => a + t.costo, 0))}`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Centro</Th>
            <Th>Tipo de parada</Th>
            <Th align="right">Horas</Th>
            <Th align="right">Costo</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {TIEMPOS_IMPRODUCTIVOS.map(t => (
            <tr key={t.id} className="hoverable">
              <Td>{t.centro}</Td>
              <Td>{t.tipo}</Td>
              <Td align="right" className="font-mono">{fmtHoras(t.horas)}</Td>
              <Td align="right" className="font-mono text-red-600">{fmtMoney(t.costo)}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-12 ---------------------------------- */

function BloqueWip() {
  const [mensaje, setMensaje] = useState('');

  function conciliar() {
    window.setTimeout(() => setMensaje('WIP conciliado con contabilidad: el valor del trabajo en curso cuadra por orden y período (simulado).'), 400);
  }

  return (
    <FunctionBlock code="COS-12">
      <Toolbar>
        <button type="button" className={BTN_PRIMARY} onClick={conciliar}>Conciliar con contabilidad</button>
        <span className="text-xs text-gray-500">Valor del trabajo en curso por orden, actualizado con cada registro de planta.</span>
      </Toolbar>
      {mensaje && <MensajeOk texto={mensaje} />}
      <DataTable footer={`WIP total ${fmtMoney(WIP.reduce((a, w) => a + w.valor, 0))}`}>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Orden</Th>
            <Th>Producto</Th>
            <Th>Avance</Th>
            <Th align="right">Valor WIP</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {WIP.map(w => (
            <tr key={w.orden} className="hoverable">
              <Td><span className="font-mono text-gray-600">{w.orden}</span></Td>
              <Td>{w.producto}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-full max-w-40 rounded bg-gray-100">
                    <div className="h-1.5 rounded bg-petroleum-500" style={{ width: `${w.avancePct * 100}%` }} />
                  </div>
                  <span className="font-mono text-xs text-gray-600">{fmtPct(w.avancePct)}</span>
                </div>
              </Td>
              <Td align="right" className="font-mono">{fmtMoney(w.valor)}</Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-13 ---------------------------------- */

function BloqueCostoOrden() {
  return (
    <FunctionBlock code="COS-13">
      <DataTable footer="Costo consolidado por orden, lote, producto y cliente. El costo por lote es trazable hasta el documento fuente.">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <Th>Orden</Th>
            <Th>Lote</Th>
            <Th>Producto</Th>
            <Th>Cliente</Th>
            <Th align="right">Costo unit.</Th>
            <Th align="right">Precio venta</Th>
            <Th align="right">Margen</Th>
            <Th align="center">Margen %</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {COSTO_POR_ORDEN.map(c => (
            <tr key={c.orden} className="hoverable">
              <Td><span className="font-mono text-gray-600">{c.orden}</span></Td>
              <Td><span className="font-mono text-gray-500">{c.lote}</span></Td>
              <Td>{c.producto}</Td>
              <Td>{c.cliente}</Td>
              <Td align="right" className="font-mono">{fmtMoney(c.costoUnit)}</Td>
              <Td align="right" className="font-mono">{fmtMoney(c.precioVenta)}</Td>
              <Td align="right" className="font-mono text-green-700">{fmtMoney(c.margenUnit)}</Td>
              <Td align="center"><StatusBadge label={fmtPct(c.margenPct)} tone="green" /></Td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </FunctionBlock>
  );
}

/* ------------------------------- COS-14 ---------------------------------- */

function BloqueReportes() {
  const [mensaje, setMensaje] = useState('');
  const [generando, setGenerando] = useState('');

  function generar(nombre: string) {
    setGenerando(nombre);
    window.setTimeout(() => {
      setGenerando('');
      setMensaje(`Reporte «${nombre}» generado y exportable (simulado).`);
    }, 700);
  }

  return (
    <FunctionBlock code="COS-14">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <DataTable footer="Reportes de costo estándar vs real, variaciones, margen, desperdicio y reproceso.">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <Th>Reporte</Th>
                <Th>Formato</Th>
                <Th>Frecuencia</Th>
                <Th align="center">Acción</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {REPORTES_COS.map(r => (
                <tr key={r.id} className="hoverable">
                  <Td className="font-medium text-gray-800">{r.nombre}</Td>
                  <Td><span className="font-mono text-gray-500">{r.formato}</span></Td>
                  <Td>{r.frecuencia}</Td>
                  <Td align="center">
                    <button type="button" className="rounded px-2 py-1 text-xs text-petroleum-600 hover:bg-petroleum-50" onClick={() => generar(r.nombre)} disabled={generando === r.nombre}>
                      {generando === r.nombre ? '⏳' : 'Generar'}
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          {mensaje && <MensajeOk texto={mensaje} />}
        </div>
        <DataTable footer="Margen por producto para decisiones de precio y mezcla.">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <Th>Producto</Th>
              <Th align="right">Volumen</Th>
              <Th align="right">Costo prom.</Th>
              <Th align="right">Precio prom.</Th>
              <Th align="center">Margen %</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MARGENES.map(m => (
              <tr key={m.producto} className="hoverable">
                <Td>{m.producto}</Td>
                <Td align="right" className="font-mono">{fmtNum(m.volumenUnidades)} un</Td>
                <Td align="right" className="font-mono">{fmtMoney(m.costoProm)}</Td>
                <Td align="right" className="font-mono">{fmtMoney(m.precioProm)}</Td>
                <Td align="center"><StatusBadge label={fmtPct(m.margenPct)} tone={m.margenPct > 0.25 ? 'green' : 'amber'} /></Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </FunctionBlock>
  );
}

/* -------------------------------- Resumen --------------------------------- */

function Resumen() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Objetivo">
        <p className="text-xs leading-relaxed text-gray-600">
          Conocer el costo estándar y real de fabricación, explicar sus variaciones y apoyar decisiones de precio, mezcla y eficiencia.
        </p>
      </Card>
      <Card title="Alcance">
        <p className="text-xs leading-relaxed text-gray-600">
          Costo estándar y real, materiales, mano de obra, máquina, indirectos, consumo previsto versus real, variaciones, desperdicio, reproceso, tiempos improductivos, WIP y costo por orden o lote.
        </p>
      </Card>
      <Card title="Actores">
        <div className="flex flex-wrap gap-1.5">
          {['Finanzas', 'Control de gestión', 'Producción', 'Compras', 'Dirección'].map(a => (
            <span key={a} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{a}</span>
          ))}
        </div>
      </Card>
      <Card title="Reglas de negocio">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          <li>El costo debe basarse en consumos y tiempos reales.</li>
          <li>Las variaciones deben explicarse por causa.</li>
          <li>Los costos indirectos deben tener base documentada.</li>
          <li>Los costos no se modifican sin autorización.</li>
          <li>El WIP debe conciliar con contabilidad.</li>
          <li>Los reportes deben poder auditarse hasta el documento fuente.</li>
        </ul>
      </Card>
      <Card title="Integraciones">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          <li>Producción: consumo, tiempos y producción.</li>
          <li>Inventario: valoración y movimientos.</li>
          <li>Compras: precios y facturas.</li>
          <li>Mantenimiento: costo de fallas.</li>
          <li>Finanzas: asientos, centros de costo y márgenes.</li>
        </ul>
      </Card>
      <Card title="Reportes">
        <ul className="list-disc space-y-1 pl-4 text-xs text-gray-600">
          <li>Costo estándar versus real.</li>
          <li>Variación por material, mano de obra y máquina.</li>
          <li>Costo por orden, lote y producto.</li>
          <li>Desperdicio y reproceso.</li>
          <li>WIP y producción en proceso.</li>
          <li>Margen por producto o cliente.</li>
        </ul>
      </Card>
      <Card title="Criterios de aceptación" className="lg:col-span-2">
        <ul className="grid list-disc gap-1 pl-4 text-xs text-gray-600 sm:grid-cols-2">
          <li>El costo real de la orden cuadra con consumos y tiempos.</li>
          <li>Las variaciones son explicables.</li>
          <li>El WIP concilia con contabilidad.</li>
          <li>El costo por lote es trazable.</li>
          <li>Los reportes permiten decisiones de precio y mezcla.</li>
        </ul>
      </Card>
    </div>
  );
}

/* --------------------------------- Página --------------------------------- */

export default function COS() {
  const [tab, setTab] = useState('resumen');

  const variacionNeta = VARIACIONES.reduce((a, v) => a + (v.resultado === 'Desfavorable' ? v.importe : -v.importe), 0);
  const desperdicioReproceso =
    DESPERDICIOS.reduce((a, d) => a + d.costo, 0) + REPROCESOS.reduce((a, r) => a + r.costo, 0);
  const wipTotal = WIP.reduce((a, w) => a + w.valor, 0);
  const margenProm = COSTO_POR_ORDEN.reduce((a, c) => a + c.margenPct, 0) / COSTO_POR_ORDEN.length;

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb={`Módulos / ${MOD.nombre}`}
        title={MOD.nombre}
        description={MOD.descripcion}
        pill={`${conteoModulo('cos')} funcionalidades · Fase ${MOD.fase}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Variación neta del período" value={fmtMoney(variacionNeta)} sub={`${VARIACIONES.length} variaciones explicadas por causa`} tone={variacionNeta > 0 ? 'danger' : 'ok'} />
        <StatCard label="Desperdicio + reproceso" value={fmtMoney(desperdicioReproceso)} sub={`${DESPERDICIOS.length} desperdicios · ${REPROCESOS.length} reprocesos`} tone="warn" />
        <StatCard label="Producción en proceso (WIP)" value={fmtMoney(wipTotal)} sub={`${WIP.length} órdenes en curso`} tone="info" />
        <StatCard label="Margen promedio" value={fmtPct(margenProm)} sub="sobre precio de venta por orden" tone="ok" />
      </div>

      <Tabs
        tabs={[
          { id: 'resumen', label: 'Resumen' },
          { id: 'costeo', label: 'Costeo' },
          { id: 'recursos', label: 'Recursos' },
          { id: 'desviaciones', label: 'Desviaciones' },
          { id: 'consolidacion', label: 'Consolidación y reportes' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'resumen' && <Resumen />}
      {tab === 'costeo' && (
        <div className="space-y-4">
          <BloqueCostoEstandar />
          <BloqueCostoReal />
          <BloqueIndirectos />
        </div>
      )}
      {tab === 'recursos' && (
        <div className="space-y-4">
          <BloqueMateriales />
          <BloqueManoObra />
          <BloqueMaquina />
        </div>
      )}
      {tab === 'desviaciones' && (
        <div className="space-y-4">
          <BloquePrevistoReal />
          <BloqueVariaciones />
          <BloqueDesperdicio />
          <BloqueReproceso />
          <BloqueImproductivos />
        </div>
      )}
      {tab === 'consolidacion' && (
        <div className="space-y-4">
          <BloqueWip />
          <BloqueCostoOrden />
          <BloqueReportes />
        </div>
      )}
    </div>
  );
}

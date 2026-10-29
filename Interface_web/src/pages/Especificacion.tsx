// Página «Especificación funcional»: reflejo de las secciones 4–8 del
// documento normativo FUNCIONALIDADES.md (flujos end-to-end, priorización,
// criterios globales, glosario, supuestos, exclusiones y decisiones pendientes).

import { useState } from 'react';
import { Card, PageHeader, StatusBadge } from '../components/ui';
import { FASES, MODULOS, conteoFase, type NavPage } from '../data/modules';

interface Flujo {
  id: string;
  nombre: string;
  descripcion: string;
  pasos: string[];
}

const FLUJOS: Flujo[] = [
  {
    id: '4.1',
    nombre: 'Procure-to-pay',
    descripcion: 'Abastecimiento',
    pasos: [
      'Se detecta la necesidad por stock, producción, venta o plan.',
      'Se crea la solicitud de cotización y se envían alternativas.',
      'Se comparan precios, plazos y desempeño.',
      'Se aprueba y confirma la orden.',
      'Se recibe, inspecciona y almacena.',
      'Se factura y concilia con orden y recepción.',
      'Se paga y se cierra el ciclo.',
    ],
  },
  {
    id: '4.2',
    nombre: 'Plan-to-produce',
    descripcion: 'Planificación',
    pasos: [
      'Se consolida la demanda y el stock objetivo.',
      'Se calcula el plan maestro.',
      'Se explotan materiales y se calculan necesidades.',
      'Se valida capacidad finita.',
      'Se secuencian órdenes y se congelan períodos.',
      'Se liberan órdenes a producción.',
      'Se replantea ante desviaciones.',
    ],
  },
  {
    id: '4.3',
    nombre: 'Execute-to-complete',
    descripcion: 'Producción y MES',
    pasos: [
      'Se libera la orden y se asigna a centro y operario.',
      'Se inicia la operación y se registran tiempos.',
      'Se consume material y se captura producción.',
      'Se registran paradas, rechazos y calidad.',
      'Se confirma el avance y el WIP.',
      'Se cierra la orden y se generan pendientes.',
      'Se actualiza inventario y costo.',
    ],
  },
  {
    id: '4.4',
    nombre: 'Quality-to-release',
    descripcion: 'Calidad',
    pasos: [
      'Se define el punto de control y el criterio.',
      'Se inspecciona el material, proceso o producto.',
      'Se aprueba, rechaza o mide.',
      'Si falla, se bloquea y se genera no conformidad.',
      'Se analiza la causa y se define acción.',
      'Se verifica la eficacia y se libera o rechaza.',
    ],
  },
  {
    id: '4.5',
    nombre: 'Maintain-to-availability',
    descripcion: 'Mantenimiento',
    pasos: [
      'Se registra el equipo y su criticidad.',
      'Se planifica mantenimiento preventivo.',
      'Se atienden solicitudes correctivas.',
      'Se registran tiempos, repuestos y causas.',
      'Se cierra y se actualizan indicadores.',
      'Se ajusta el plan preventivo.',
    ],
  },
  {
    id: '4.6',
    nombre: 'Change-to-production',
    descripcion: 'PLM',
    pasos: [
      'Se detecta la necesidad de cambio.',
      'Se crea la orden de cambio y se analiza el impacto.',
      'Se revisa y aprueba.',
      'Se aplican cambios a materiales y operaciones.',
      'Se genera la nueva versión con vigencia.',
      'Se comunica a compras y producción.',
      'Se archiva la versión anterior.',
    ],
  },
  {
    id: '4.7',
    nombre: 'Trace-to-recall',
    descripcion: 'Trazabilidad y retiro',
    pasos: [
      'Se identifica el lote o producto afectado.',
      'Se reconstruye su genealogía.',
      'Se determina el alcance hacia adelante.',
      'Se bloquea y se pone en cuarentena.',
      'Se notifica a los afectados.',
      'Se recupera o corrige el producto.',
      'Se documenta y se mide la efectividad.',
    ],
  },
];

const CRITERIOS = [
  'Los módulos comparten datos maestros únicos.',
  'Toda operación crítica deja trazabilidad de usuario, fecha y documento.',
  'Los estados reflejan la realidad y no se editan manualmente sin control.',
  'Los indicadores se calculan con datos reales y fórmulas documentadas.',
  'Las excepciones tienen responsable, motivo y cierre.',
  'Los reportes cuadran con los documentos de origen.',
  'Las integraciones son seguras, idempotentes y monitoreadas.',
  'Los roles y permisos respetan la segregación de funciones.',
];

const GLOSARIO: [string, string][] = [
  ['MPS', 'Plan maestro de producción; define qué y cuánto producir por período.'],
  ['MRP', 'Planificación de necesidades de materiales; calcula materiales y fechas.'],
  ['APS', 'Planificación y programación avanzada de capacidad finita.'],
  ['MES', 'Sistema de ejecución y supervisión de planta.'],
  ['OEE', 'Efectividad global del equipo: disponibilidad × rendimiento × calidad.'],
  ['FPY', 'Rendimiento de primera pasada; unidades conformes sin reproceso.'],
  ['WIP', 'Trabajo en curso; producción iniciada y no terminada.'],
  ['BOM', 'Lista de materiales; componentes y cantidades de un producto.'],
  ['Ruta', 'Secuencia de operaciones y recursos para fabricar.'],
  ['Lote', 'Conjunto de unidades producidas o recibidas en condiciones comunes.'],
  ['Serie', 'Identificador único de una unidad.'],
  ['Cuarentena', 'Estado que impide usar o entregar un material hasta su liberación.'],
  ['Recall', 'Retiro de producto del mercado o de clientes.'],
  ['CAPA', 'Acción correctiva y preventiva.'],
  ['ATP', 'Disponible para prometer.'],
  ['CTP', 'Capaz para prometer; considera capacidad.'],
  ['SCADA', 'Supervisión y control de procesos industriales.'],
  ['PLC', 'Controlador lógico programable.'],
  ['Historiador', 'Almacén de variables industriales en el tiempo.'],
  ['Costo estándar', 'Costo planificado o normativo de un producto.'],
  ['Costo real', 'Costo efectivamente incurrido en una orden o período.'],
  ['Variación', 'Diferencia entre costo o consumo estándar y real.'],
  ['ECO', 'Orden de cambio de ingeniería.'],
];

const SUPUESTOS = [
  'La empresa tiene procesos definidos y datos maestros confiables.',
  'Existe al menos un almacén y un proceso productivo.',
  'Los usuarios están capacitados en el registro de datos.',
  'La dirección apoya la disciplina operativa.',
  'Las integraciones se planifican con TI/OT.',
];

const EXCLUSIONES = [
  'Este documento no define la tecnología, el proveedor ni la arquitectura de implementación.',
  'No incluye precios, licencias ni cronograma.',
  'No sustituye procedimientos legales, contables o de calidad específicos.',
  'No garantiza que todos los módulos se implementen en la primera fase.',
];

const DECISIONES = [
  '¿La capacidad finita y la secuenciación automática son requisito obligatorio?',
  '¿La planta registrará en papel, terminal o captura automática?',
  '¿Hay regulación que exija recall, firmas electrónicas o auditoría validada?',
  '¿Se integrará con PLC, SCADA o MES existente?',
  '¿Se requiere multi-planta o multi-compañía?',
  '¿Cuál es el volumen de órdenes, lotes y SKU?',
  '¿Qué módulos se implementarán en cada fase?',
  '¿Quién será el dueño de los datos y de los indicadores?',
];

export default function Especificacion({ onNavigate }: { onNavigate: (p: NavPage) => void }) {
  const [flujoActivo, setFlujoActivo] = useState<string>(FLUJOS[0].id);

  const flujo = FLUJOS.find(f => f.id === flujoActivo) ?? FLUJOS[0];

  return (
    <div className="max-w-screen-2xl space-y-4 p-4">
      <PageHeader
        breadcrumb="Suite Producción / Especificación funcional"
        title="Especificación funcional del sistema"
        description="Flujos de negocio end-to-end, priorización por fases, criterios de aceptación globales, glosario y decisiones pendientes (secciones 4–8 del documento normativo)."
        pill="7 flujos · 5 fases · 23 términos"
      />

      {/* Flujos end-to-end */}
      <Card title="Flujos de negocio end-to-end" pad={false}>
        <div className="grid lg:grid-cols-4">
          <div className="border-b border-gray-100 p-3 lg:border-b-0 lg:border-r">
            <div className="space-y-1">
              {FLUJOS.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFlujoActivo(f.id)}
                  className={`w-full rounded px-3 py-2 text-left text-xs transition ${
                    flujoActivo === f.id ? 'bg-petroleum-50 font-medium text-petroleum-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-1.5 font-mono text-[10px] text-gray-400">{f.id}</span>
                  {f.nombre}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 lg:col-span-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-800">{flujo.nombre}</h3>
              <StatusBadge label={flujo.descripcion} tone="petroleum" />
            </div>
            <ol className="mt-3 space-y-2">
              {flujo.pasos.map((paso, i) => (
                <li key={i} className="flex items-start gap-3 rounded border border-gray-100 bg-gray-50/60 px-3 py-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-petroleum-500 font-mono text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-gray-700">{paso}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Card>

      {/* Fases */}
      <Card title="Priorización y fases sugeridas" pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Fase</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Módulos</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600">Objetivo</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600">Funciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {FASES.map(fase => {
                const modulos = MODULOS.filter(m => m.fase === fase.id);
                return (
                  <tr key={fase.id} className="hoverable">
                    <td className="px-3 py-2.5"><StatusBadge label={`Fase ${fase.id}`} tone={fase.id === 1 ? 'green' : 'gray'} /></td>
                    <td className="px-3 py-2.5 text-gray-700">
                      {modulos.map(m => (
                        <button key={m.id} type="button" onClick={() => onNavigate(m.id)} className="mr-1.5 rounded bg-petroleum-50 px-1.5 py-0.5 font-mono text-[10px] text-petroleum-700 hover:bg-petroleum-100">
                          {m.codigo}
                        </button>
                      ))}
                    </td>
                    <td className="px-3 py-2.5 text-gray-600">{fase.descripcion}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-gray-600">{conteoFase(fase.id)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
          Regla de decisión: no avanzar a un módulo superior sin datos maestros confiables, procesos definidos y usuarios capacitados.
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Criterios globales */}
        <Card title="Criterios de aceptación globales">
          <ul className="space-y-2">
            {CRITERIOS.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-gray-700">
                <span className="mt-0.5 text-green-600" aria-hidden="true">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </Card>

        {/* Glosario */}
        <Card title="Glosario">
          <dl className="divide-y divide-gray-50">
            {GLOSARIO.map(([termino, definicion]) => (
              <div key={termino} className="flex gap-3 py-1.5">
                <dt className="w-32 shrink-0 font-mono text-xs font-semibold text-petroleum-700">{termino}</dt>
                <dd className="text-xs leading-relaxed text-gray-600">{definicion}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Supuestos */}
        <Card title="Supuestos">
          <ul className="space-y-2">
            {SUPUESTOS.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-gray-700">
                <span className="mt-0.5 text-gray-300" aria-hidden="true">•</span>
                {s}
              </li>
            ))}
          </ul>
        </Card>

        {/* Exclusiones */}
        <Card title="Exclusiones">
          <ul className="space-y-2">
            {EXCLUSIONES.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-gray-700">
                <span className="mt-0.5 text-red-300" aria-hidden="true">✗</span>
                {e}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Decisiones pendientes */}
      <Card title="Decisiones pendientes (definen el camino de implementación)">
        <ol className="grid gap-2 sm:grid-cols-2">
          {DECISIONES.map((d, i) => (
            <li key={i} className="flex items-start gap-3 rounded border border-amber-100 bg-amber-50/50 px-3 py-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 font-mono text-[10px] font-bold text-amber-700">
                {i + 1}
              </span>
              <span className="text-xs leading-relaxed text-gray-700">{d}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

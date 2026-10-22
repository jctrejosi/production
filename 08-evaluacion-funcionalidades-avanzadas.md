# Evaluación de funcionalidades avanzadas (8–14)

**Pregunta:** ¿hacen falta las capacidades de planificación avanzada, MES, trazabilidad integral, OEE, control de excepciones, IoT y costos industriales para complementar los 7 módulos ya contemplados?

**Respuesta corta:** **sí, hacen falta en el alcance conceptual**, pero **no todas se cubren nativamente con Odoo**. La decisión depende de tres ejes:

1. **¿La planta es manual o automatizada?**
2. **¿Es una industria regulada (alimentos, farmacéutica, electrónica, dispositivos médicos)?**
3. **¿La capacidad finita y la secuenciación automática son un requisito real o un “nice to have”?**

Odoo cubre bien el **ERP + MRP de materiales + ejecución básica de planta + trazabilidad por lote/serie + costos**. Las brechas principales son **APS de capacidad finita, simulación de escenarios, MES completo, IoT/SCADA y gestión de recall/cuarentena regulada**.

---

## 1. Veredicto ejecutivo

| Bloque | ¿Hace falta? | Cobertura Odoo | Recomendación |
|--------|--------------|----------------|---------------|
| 8. Planificación avanzada | **Sí, por fases** | MRP de materiales ✅; MPS 🔶 Enterprise; capacidad finita/secuenciación/escenarios/cuellos de botella ⚠️ parcial o ausente | Incluir MPS y planificación por capacidad; evaluar APS externo si la capacidad finita es crítica |
| 9. MES / ejecución de planta | **Sí, al menos nivel básico** | Órdenes de trabajo y tiempos ✅; Shop Floor 🔶 Enterprise; MES completo ⚠️ parcial | Odoo Shop Floor como MES ligero; MES externo si se requiere SPC, trazabilidad de proceso o integración profunda |
| 10. Trazabilidad integral | **Sí, crítico si es regulado** | Lotes/series, genealogía y trazabilidad ✅; operario/máquina ⚠️ parcial; cuarentena/recall ⚠️ parcial | Incluir; Quality 🔶 Enterprise para defectos; QMS/recall externo si hay regulación estricta |
| 11. Rendimiento y eficiencia | **Sí** | Tiempos, paradas y performance ✅; OEE ⚠️ simplificado; FPY ❌ no nativo | Incluir con definiciones formales y capa de BI/reportes |
| 12. Control de procesos y excepciones | **Sí si hay calidad regulada** | No conformidades, CAPA y tolerancias 🔶 Enterprise; bloqueos y reprocesos ✅ parcial | Quality Enterprise; sin regulación puede resolverse con proceso manual |
| 13. Integración industrial e IoT | **Opcional** | IoT Box 🔶 Enterprise para periféricos; PLC/SCADA/historiador ❌ no nativo | Solo si la automatización lo exige; middleware/integración a medida |
| 14. Costos industriales | **Sí, al menos costeo básico** | Costo estándar/real, materiales, mano de obra/máquina, WIP ✅; indirectos y variaciones ⚠️ parcial | Incluir; complementar con BI/desarrollo para variaciones e indirectos |

**Conclusión:** los bloques **10, 11 y 14** son extensiones naturales de los 7 módulos y deberían estar en el alcance. Los bloques **8 y 9** deben incluirse con un alcance explícito (Odoo + complementos), no asumiendo que Odoo es un APS/MES completo. El bloque **12** es obligatorio si hay regulación. El bloque **13** es opcional y depende de la planta.

---

## 2. Distinción conceptual: MRP vs. APS vs. MES

Antes de evaluar, conviene separar tres cosas que suelen confundirse:

| Concepto | Pregunta que responde | Función |
|----------|----------------------|---------|
| **MRP** (Material Requirements Planning) | ¿Qué materiales necesito, cuánto y para cuándo? | Explosión de BOM, necesidades, compras/fabricación |
| **APS** (Advanced Planning & Scheduling) | ¿Cómo programo capacidad finita, máquinas y secuencia? | Programación, secuenciación, simulación, cuellos de botella |
| **MES** (Manufacturing Execution System) | ¿Qué está pasando ahora en la planta? | Liberación, ejecución, tiempos, cantidades, calidad, trazabilidad |
| **ERP** | ¿Cómo integro y contabilizo todo? | Compras, inventario, costos, finanzas |

**Odoo cubre:**

- **MRP de materiales**: sí, vía orderpoints, previsión, explosión de BOM y reglas de aprovisionamiento.
- **APS**: solo planificación básica por capacidad; **no** un APS de capacidad finita con optimización.
- **MES**: ejecución básica con órdenes de trabajo; **Shop Floor** es un MES ligero, no un MES completo.
- **ERP**: sí, con contabilidad, compras, inventario y costos.

---

## 3. Evaluación detallada

### 3.1 Bloque 8 — Planificación avanzada de producción

#### 8.1 Plan maestro de producción (MPS)

- **Odoo:** 🔶 Enterprise (`mrp_mps`). No está en Community.
- **Qué cubre:** planificación de demanda independiente, sugerencias de fabricación/compra, horizontes y ajustes de demanda.
- **Brecha:** no es un S&OP completo ni un planificador colaborativo multi-planta.
- **Recomendación:** incluirlo si se produce contra previsión y se necesita anticipar capacidad/materiales. Si el negocio es make-to-order puro, puede no ser prioritario.

#### 8.2 Planificación de necesidades de materiales (MRP)

- **Odoo:** ✅ Community, mediante:
  - Orderpoints y reglas de reabastecimiento.
  - Previsión de stock.
  - Explosión de BOM y generación de compras/MO.
  - Rutas Buy/Manufacture/MTO.
- **Brecha:** no es un MRP II clásico con cubos de tiempo, mensajes de excepción y regeneración net-change. El cálculo es operativo y orientado a documentos.
- **Recomendación:** cubierto para una PyME; si se requiere MRP II formal, evaluar un módulo/ERP especializado o desarrollo.

#### 8.3 Planificación de capacidad finita por máquina y centro

- **Odoo:** ⚠️ Parcial.
  - Community: capacidad por producto, calendario, carga y planificación manual.
  - Enterprise: planificación por centro y vista Gantt (Shop Floor/Planning).
  - **No hay optimizador de capacidad finita** que reasigne automáticamente carga, máquinas y secuencia.
- **Brecha:** la capacidad se visualiza y se ajusta manualmente; no se resuelve como un problema de scheduling.
- **Recomendación:** si la capacidad finita es un requisito duro, **integrar un APS** (Preactor, Ortems, PlanetTogether, etc.) o desarrollar un motor de scheduling. Si la planta es flexible y de baja complejidad, la planificación manual por centro puede ser suficiente.

#### 8.4 Secuenciación y priorización de órdenes

- **Odoo:** ⚠️ Parcial.
  - Prioridad de MO, secuencia de operaciones, dependencias y fechas.
  - Planificación manual y arrastre en Gantt (Enterprise).
  - **No hay secuenciación automática** por reglas (setup mínimo, cuello de botella, fecha de entrega, etc.).
- **Brecha:** la secuencia se define manualmente o por reglas simples.
- **Recomendación:** incluir reglas de priorización y capacitación; para secuenciación automática, APS o desarrollo.

#### 8.5 Simulación de escenarios y replanificación

- **Odoo:** ⚠️ Muy limitado.
  - Previsión de stock y fechas.
  - Replanificación manual de MO/órdenes de trabajo.
  - **No hay simulación multi-escenario** (“qué pasa si retraso esta máquina”, “qué pasa si sube la demanda”).
- **Brecha:** no hay motor de simulación ni comparación de escenarios.
- **Recomendación:** si es requisito, APS o herramienta de simulación externa. Si no, reportes de previsión y reuniones de planificación.

#### 8.6 Identificación de cuellos de botella

- **Odoo:** ⚠️ Parcial.
  - Carga por centro (`workcenter_load`).
  - OEE y pérdidas.
  - Órdenes retrasadas/bloqueadas.
  - **No hay detección automática de cuello de botella** ni análisis de teoría de restricciones.
- **Brecha:** el cuello de botella se interpreta a partir de reportes, no se calcula automáticamente.
- **Recomendación:** reporte/BI con carga vs. capacidad y OEE; si se requiere optimización, APS.

**Veredicto del bloque 8:** incluir **MPS + planificación por capacidad + reportes de carga**. No prometer un APS de capacidad finita si no se integra uno.

---

### 3.2 Bloque 9 — Ejecución y supervisión de planta (MES)

#### 9.1 Liberación y asignación de órdenes de trabajo

- **Odoo:** ✅/🔶.
  - Community: `mrp.workorder`, asignación a centro y usuario, estados.
  - Enterprise: Shop Floor con liberación y asignación visual.
- **Brecha:** no hay una cola de despacho MES con reglas de asignación automática.
- **Recomendación:** suficiente para planta pequeña; MES externo si se requiere despacho avanzado.

#### 9.2 Inicio, pausa, reanudación y finalización

- **Odoo:** ✅ Community (backend) y 🔶 Enterprise (Shop Floor).
  - `button_start`, `button_pending`, `button_finish`, estados blocked/ready/progress/done/cancel.
- **Brecha:** la experiencia táctil y la operación en planta son Enterprise.
- **Recomendación:** incluir Shop Floor si los operarios registran en planta.

#### 9.3 Cantidades producidas, rechazadas y pendientes

- **Odoo:** ⚠️ Parcial.
  - Producidas: `qty_produced`.
  - Pendientes: `qty_remaining` / backorder.
  - Rechazadas: **no hay un campo nativo específico**; se modela con scrap, calidad o ajuste.
- **Brecha:** el rechazo no está integrado como cantidad MES; requiere proceso.
- **Recomendación:** definir si el rechazo se registra como scrap, control de calidad o desarrollo.

#### 9.4 Registro de tiempos reales y paradas

- **Odoo:** ✅.
  - `mrp.workcenter.productivity`: inicio, fin, duración, usuario.
  - Pérdidas por categoría: disponibilidad, performance, calidad, productivo.
- **Brecha:** depende de la disciplina de registro; no hay captura automática sin IoT.
- **Recomendación:** incluir; definir catálogo de causas de parada.

#### 9.5 Instrucciones de trabajo digitales

- **Odoo:** ⚠️ Parcial.
  - Notas en BOM, MO y centro de trabajo.
  - Enterprise: Shop Floor y worksheets.
  - **No hay un gestor documental de instrucciones por operación** en Community.
- **Brecha:** las instrucciones son texto/HTML, no un sistema de contenido estructurado.
- **Recomendación:** usar notas + documentos; Enterprise worksheets si se necesita formulario; MES/documentos si es crítico.

#### 9.6 Seguimiento del trabajo en curso (WIP)

- **Odoo:** ⚠️ Parcial.
  - `mrp_account`: asientos WIP (`wip_move_ids`), costo de producción en proceso.
  - Vista de resumen de MO.
  - **No hay un tablero MES en tiempo real por operación** en Community.
- **Brecha:** el WIP financiero está, el WIP operativo en tiempo real es limitado.
- **Recomendación:** reportes/BI; Shop Floor para avance; MES si se requiere tiempo real.

**Veredicto del bloque 9:** Odoo Shop Floor es un **MES ligero**. Cubre ejecución básica, tiempos y avance. No cubre SPC, integración profunda con máquinas, despacho avanzado ni WIP en tiempo real completo. Si el requisito es “saber qué está pasando en la planta” a nivel básico, es suficiente; si es un MES formal, integrar.

---

### 3.3 Bloque 10 — Trazabilidad integral

#### 10.1 Genealogía de materias primas, lotes y productos terminados

- **Odoo:** ✅.
  - Lotes/series (`stock.lot`).
  - Movimientos (`stock.move`, `stock.move.line`).
  - Consumo y producción en MO.
  - Reporte de trazabilidad (`stock.traceability.report`).

#### 10.2 Relación entre órdenes, operaciones, operarios y máquinas

- **Odoo:** ⚠️ Parcial.
  - MO ↔ orden de trabajo ↔ centro.
  - Operario y tiempo vía `mrp.workcenter.productivity`.
  - **No hay genealogía de proceso parámetro a parámetro** (temperatura, presión, etc.) sin IoT/custom.
- **Brecha:** se vincula quién/cuándo/máquina a nivel de operación, no el detalle de variables.
- **Recomendación:** suficiente para trazabilidad de lote; para proceso regulado, capturar variables con IoT/MES.

#### 10.3 Trazabilidad hacia atrás y hacia adelante

- **Odoo:** ✅.
  - Reporte de trazabilidad hacia adelante/atrás.
  - Vínculo con recepciones, entregas, MO y lotes.

#### 10.4 Historial de consumos, defectos y reprocesos

- **Odoo:** ⚠️ Parcial.
  - Consumos: movimientos de componentes.
  - Defectos: Quality 🔶 Enterprise.
  - Reprocesos: reparación (`repair`/`mrp_repair`) y desensamblado (`mrp.unbuild`).
  - **No hay un historial único de reproceso** asociado al lote.
- **Brecha:** se reconstruye con documentos; no hay un modelo de “rework history”.
- **Recomendación:** Quality + repair + reportes; desarrollo si se requiere un expediente único.

#### 10.5 Cuarentenas y retiradas de producto (recall)

- **Odoo:** ⚠️ Parcial.
  - Ubicaciones de cuarentena/calidad.
  - Bloqueo de stock y alertas de calidad.
  - **No hay gestión nativa de recall** (notificación, alcance, retiro, efectividad).
- **Brecha:** el recall se gestiona con procesos y reportes, no con un módulo dedicado.
- **Recomendación:** si es industria regulada, evaluar QMS/recall externo o desarrollo; Odoo puede ser el ERP de registro.

**Veredicto del bloque 10:** la trazabilidad **lote/serie** es fuerte y nativa. La trazabilidad **regulada** (variables de proceso, recall, firmas, auditoría validada) requiere Quality Enterprise y, en muchos casos, un QMS/MES complementario.

---

### 3.4 Bloque 11 — Rendimiento y eficiencia operacional

#### 11.1 OEE (disponibilidad × rendimiento × calidad)

- **Odoo:** ⚠️ Parcial y con matiz importante.
  - Community calcula `oee` a nivel de centro como **tiempo productivo / (tiempo productivo + tiempo bloqueado)**.
  - Calcula `performance` por separado (duración esperada vs. real).
  - **No es la fórmula OEE completa A × P × Q**; la calidad no entra en ese cálculo.
- **Brecha:** el indicador nativo es más una disponibilidad/efectividad que un OEE formal.
- **Recomendación:** definir la fórmula objetivo y calcularla en BI/reportes con datos de tiempos, producción y calidad. No asumir que el campo `oee` es el OEE corporativo.

#### 11.2 Tiempo de ciclo y tiempo de preparación (setup)

- **Odoo:** ✅.
  - `time_cycle`, `time_cycle_manual`.
  - `time_start` (setup) y `time_stop` (cleanup) del centro.
  - Duración esperada y real.

#### 11.3 Rendimiento de primera pasada (FPY)

- **Odoo:** ❌ No nativo.
  - Se puede derivar de controles de calidad y cantidades producidas/rechazadas, pero no hay un campo FPY.
- **Brecha:** requiere cálculo/reporting.
- **Recomendación:** definir FPY y calcularlo con Quality + producción.

#### 11.4 Tasas de desperdicio y reproceso

- **Odoo:** ⚠️ Parcial.
  - Scrap (`stock.move.is_scrap`) y motivos.
  - Reparación/reproceso.
  - Reportes de movimientos.
- **Brecha:** no hay una tasa consolidada de reproceso.
- **Recomendación:** reportes/BI con motivos y cantidades.

#### 11.5 Cumplimiento del plan de producción

- **Odoo:** ⚠️ Parcial.
  - Fechas planificadas vs. reales, estados, retrasos.
  - No hay un indicador “plan adherence” nativo.
- **Brecha:** cálculo manual/BI.
- **Recomendación:** reporte de cumplimiento por período.

#### 11.6 Análisis de causas de paradas y pérdidas

- **Odoo:** ✅.
  - `mrp.workcenter.productivity.loss` con categorías y motivos.
  - Reporte de pérdidas por centro.

**Veredicto del bloque 11:** incluir, pero **no confiar en el OEE nativo como OEE completo**. Definir métricas, fuentes y responsabilidad; usar BI para A×P×Q, FPY y cumplimiento.

---

### 3.5 Bloque 12 — Control de procesos y gestión de excepciones

#### 12.1 Gestión de no conformidades

- **Odoo:** 🔶 Enterprise (`quality` / `quality_control`).
- **Community:** no hay módulo de calidad nativo.

#### 12.2 Análisis de causa raíz y acciones correctivas/preventivas

- **Odoo:** 🔶 Enterprise (alertas de calidad, etapas, causa, acción correctiva).
- **Brecha:** no es un CAPA completo con eficacia, verificación y auditoría formal.

#### 12.3 Desviaciones respecto a recetas, parámetros o tolerancias

- **Odoo:** ⚠️ Parcial.
  - Tolerancias en controles de calidad.
  - Parámetros de proceso (temperatura, presión) requieren IoT/custom.
- **Brecha:** sin captura automática, la desviación se registra manualmente.

#### 12.4 Reprocesos, desperdicios y órdenes bloqueadas

- **Odoo:** ✅ Parcial.
  - Scrap, reparación, bloqueo de MO (`is_locked`), bloqueo de operaciones.
  - No hay un flujo único de “orden bloqueada por excepción” con aprobación.

#### 12.5 Flujos de aprobación para excepciones

- **Odoo:** ⚠️ Parcial.
  - Aprobaciones de compra, etapas de calidad y aprobaciones de ECO.
  - No es un motor BPM genérico.

**Veredicto del bloque 12:** si la industria es regulada, **Quality Enterprise es necesario** y probablemente un QMS complementario. Si no, se puede gestionar con procesos, scrap y bloqueos.

---

### 3.6 Bloque 13 — Integración industrial e IoT

#### 13.1 Conexión con PLC, sensores, básculas y máquinas

- **Odoo:** ❌ No nativo en Community.
  - Enterprise IoT Box cubre periféricos (impresoras, básculas, cámaras, algunos dispositivos).
  - **No es un gateway industrial PLC/SCADA.**
- **Brecha:** requiere middleware (OPC-UA, MQTT, Modbus) y desarrollo.

#### 13.2 Integración con SCADA y MES externos

- **Odoo:** ❌ No nativo.
  - Se puede integrar vía API/connectors.
- **Brecha:** proyecto de integración.

#### 13.3 Captura automática de cantidades, ciclos, temperaturas y estados

- **Odoo:** ❌/⚠️.
  - Captura manual en Shop Floor.
  - Automática solo con IoT/middleware.

#### 13.4 Gestión de eventos y alarmas

- **Odoo:** ❌ No nativo como sistema de alarmas industriales.
  - Se puede modelar con actividades/alertas, pero no es un SCADA.

#### 13.5 Almacenamiento histórico de variables industriales

- **Odoo:** ❌ No es un historiador.
  - Requiere base de datos de series temporales/historiador externo.

**Veredicto del bloque 13:** **opcional**. Si la planta es manual, no hace falta. Si hay automatización, Odoo debe ser el ERP y la capa MES/IoT debe ser externa o desarrollada.

---

### 3.7 Bloque 14 — Costos industriales y rendimiento económico

#### 14.1 Costos estándar y reales de fabricación

- **Odoo:** ✅ Parcial.
  - Costo estándar (`standard_price`) y costo de BOM.
  - Costo real de MO (`mrp_account`): materiales + operaciones + costo extra.
- **Brecha:** no hay un módulo de variance analysis formal.

#### 14.2 Consumo previsto frente al real

- **Odoo:** ✅ Parcial.
  - Movimientos de consumo y advertencias de diferencias.
  - Reportes de consumo.
- **Brecha:** variación consolidada requiere reporte/BI.

#### 14.3 Costos de mano de obra y uso de máquinas

- **Odoo:** ✅.
  - `workcenter.costs_hour`.
  - Duración de órdenes de trabajo.
  - Costo de operación.
  - `extra_cost` para mano de obra/energía/empaque.

#### 14.4 Distribución de costos indirectos

- **Odoo:** ⚠️ Parcial.
  - `extra_cost` y distribución analítica.
  - No hay costeo ABC ni prorrateo avanzado de indirectos.
- **Brecha:** requiere configuración/desarrollo/BI.

#### 14.5 Variaciones de producción y desperdicio

- **Odoo:** ⚠️ Parcial.
  - Scrap, consumo real vs. teórico, costo de MO.
  - No hay reporte nativo de variación presupuesto/real.
- **Brecha:** BI/desarrollo.

#### 14.6 Costos de reprocesos y tiempos improductivos

- **Odoo:** ⚠️ Parcial.
  - Reparación, pérdidas de productividad, costo de operación.
  - No hay un costo consolidado de reproceso.
- **Brecha:** reporte/BI.

**Veredicto del bloque 14:** Odoo cubre el **costeo básico y real de la MO**. Para **costos industriales avanzados** (indirectos, variaciones, reproceso, ABC) se requiere configuración, BI o desarrollo.

---

## 4. Matriz de brechas

| Capacidad | Community | Enterprise | Externo / desarrollo | Prioridad |
|-----------|-----------|------------|----------------------|-----------|
| MPS | ❌ | ✅ `mrp_mps` | — | Media/Alta |
| MRP de materiales | ✅ | ✅ | — | Alta |
| Capacidad finita | ⚠️ manual | ⚠️ visual/Gantt | APS | Alta si es requisito |
| Secuenciación automática | ❌ | ⚠️ manual | APS | Media/Alta |
| Simulación de escenarios | ❌ | ⚠️ limitada | APS/BI | Media |
| Cuellos de botella | ⚠️ reportes | ⚠️ reportes | BI/APS | Media |
| MES básico | ✅ backend | ✅ Shop Floor | MES | Alta |
| MES completo | ❌ | ⚠️ ligero | MES | Según planta |
| Trazabilidad lote/serie | ✅ | ✅ | — | Alta |
| Trazabilidad de proceso | ⚠️ | ⚠️ | MES/IoT | Regulada |
| Recall/cuarentena | ⚠️ | ⚠️ | QMS | Regulada |
| OEE | ⚠️ simplificado | ⚠️ simplificado | BI | Alta |
| FPY | ❌ | ❌ | BI/Quality | Media |
| No conformidades/CAPA | ❌ | ✅ Quality | QMS | Regulada |
| IoT/PLC/SCADA | ❌ | ⚠️ IoT Box | Middleware | Opcional |
| Costo estándar/real | ✅ | ✅ | — | Alta |
| Variaciones/indirectos | ⚠️ | ⚠️ | BI/desarrollo | Media |

---

## 5. Recomendación según escenario

### Escenario A — PyME manufacturera manual, sin regulación estricta

**Incluir:**

- 1–7 (base).
- 9 en nivel básico (órdenes de trabajo y tiempos).
- 10 con lotes/series.
- 11 con reportes de tiempos, paradas y OEE definido.
- 14 con costeo de MO.

**Opcional:** MPS, capacidad finita, IoT.

**No prioritario:** MES completo, QMS, recall.

### Escenario B — Fabricación discreta con restricciones de capacidad

**Incluir:**

- 1–7.
- 8 con MPS y planificación por capacidad.
- 9 con Shop Floor.
- 11 con OEE/BI.
- 14 con costos.

**Evaluar:** APS externo si la secuenciación y la capacidad finita son críticas.

### Escenario C — Industria regulada (alimentos, farmacéutica, dispositivos, electrónica)

**Incluir:**

- 1–7.
- 10 completo (trazabilidad, genealogía, cuarentena).
- 12 con Quality Enterprise.
- 11 con métricas auditables.
- 14 con costos.

**Evaluar:** QMS/recall/serialización, firmas electrónicas, validación GxP, auditoría.

### Escenario D — Planta automatizada

**Incluir:**

- 1–7.
- 9 MES.
- 13 IoT/SCADA.
- 8 APS.

**Recomendación:** Odoo como ERP; MES/APS/IoT como sistemas especializados integrados.

---

## 6. Roadmap sugerido

| Fase | Alcance | Objetivo |
|------|---------|----------|
| 1 | 1–7 + trazabilidad + costeo básico | Operación estable |
| 2 | MPS + capacidad + OEE/BI | Planificación y visibilidad |
| 3 | Quality + CAPA + cuarentena/recall | Calidad y cumplimiento |
| 4 | Shop Floor + MES + IoT/APS | Excelencia operacional |

**Regla de decisión:** no incorporar un APS o MES externo hasta demostrar que la planificación manual y el Shop Floor no cubren el volumen/complejidad. La integración tiene costo y requiere datos maestros confiables.

---

## 7. Impacto en el alcance actual

- Los **7 módulos base siguen siendo el núcleo**.
- Los bloques **8–14 no reemplazan** los módulos: los **extienden**.
- Se recomienda agregar al documento maestro una sección de **“capacidades avanzadas”** con el estado de cobertura y la decisión de incluir/excluir.
- Las funcionalidades marcadas como **Enterprise** deben presupuestarse como licencias adicionales.
- Las marcadas como **externas** deben tratarse como proyectos de integración, no como configuración.

---

## 8. Preguntas para cerrar el alcance

1. ¿La capacidad finita y la secuenciación automática son un requisito contractual o un deseo?
2. ¿La planta registra en papel, en terminal o con captura automática?
3. ¿Hay regulación que exija recall, firmas electrónicas, auditoría validada o trazabilidad de parámetros?
4. ¿Cuántos centros de trabajo, máquinas y turnos se van a planificar?
5. ¿Se produce contra stock, contra pedido o contra previsión?
6. ¿Se requiere integración con PLC/SCADA/MES existente?
7. ¿Se acepta un MES ligero (Odoo) o se requiere un MES dedicado?
8. ¿Quién es el dueño de los datos de tiempos, paradas y calidad?
9. ¿Se necesita simulación de escenarios o solo reportes de capacidad?
10. ¿Cuál es el presupuesto/plazo para licencias Enterprise e integraciones?

---

## 9. Conclusión

**Sí, hacen falta considerar las funcionalidades 8–14**, pero con un alcance realista:

- **Odoo cubre bien:** MRP de materiales, ejecución básica, trazabilidad lote/serie, costos de MO, tiempos y paradas.
- **Odoo cubre parcialmente:** MPS (Enterprise), capacidad, OEE, WIP, excepciones, costos indirectos.
- **Odoo no cubre nativamente:** APS de capacidad finita, simulación de escenarios, MES completo, IoT/SCADA/historiador, recall/QMS regulado.
- **La decisión clave:** definir si el software será un **ERP con MES ligero** o un **ERP integrado con APS/MES/QMS**. Intentar cubrir todo solo con Odoo generaría expectativas incorrectas y desarrollos costosos.

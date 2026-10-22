# Documentación — Producción y Abastecimiento en Odoo

Esta carpeta reúne la investigación funcional y técnica de los módulos de producción y abastecimiento de Odoo, detallados **función por función**.

**Base analizada:** repositorio local `odoo` — Odoo 20.0 (Community), commit `2b504bcb3b4` (2026-08-10).
**Método:** inspección de manifiestos, modelos, campos, vistas, acciones y menús en `addons/`.

---

## Especificación funcional del software

**[`FUNCIONALIDADES.md`](FUNCIONALIDADES.md)** es el documento normativo y **neutral respecto a proveedor**: define el alcance funcional completo del sistema de producción y abastecimiento, sin referencias a soluciones comerciales ni a su implementación técnica.

Contiene 15 módulos con **293 funcionalidades codificadas**, cada una con objetivo, alcance, actores, reglas de negocio, integraciones, reportes y criterios de aceptación:

| Código | Módulo | Funciones |
|--------|--------|-----------|
| `ABT` | Compras y abastecimiento | 22 |
| `INV` | Inventario y almacenes | 44 |
| `PRD` | Producción (MRP) | 41 |
| `CAL` | Calidad | 18 |
| `MNT` | Mantenimiento | 23 |
| `PLM` | Ciclo de vida del producto | 16 |
| `CAP` | Captura y códigos de barras | 20 |
| `PLA` | Planificación avanzada | 14 |
| `MES` | Ejecución y supervisión de planta | 16 |
| `TRA` | Trazabilidad integral | 15 |
| `REN` | Rendimiento y eficiencia (OEE) | 12 |
| `EXC` | Control de procesos y excepciones | 12 |
| `IOT` | Integración industrial e IoT | 12 |
| `COS` | Costos industriales | 14 |
| `TRV` | Funcionalidades transversales | 14 |

Además incluye 7 flujos end-to-end, priorización por fases, criterios de aceptación globales, glosario y supuestos/exclusiones.

> **Nota:** este documento describe *qué debe hacer el sistema*. Los documentos 00–08 describen la investigación sobre una plataforma de referencia concreta y su mapeo técnico; no forman parte de la especificación funcional.

---

## Documento consolidado de la investigación

**[`RESUMEN_FUNCIONALIDADES.md`](RESUMEN_FUNCIONALIDADES.md)** contiene las **184 funciones** de los 7 módulos base en un solo archivo: catálogo por módulo, flujos, matriz de ediciones, datos maestros, glosario y checklist de alcance.

## Documentos de detalle

| Documento | Contenido |
|-----------|-----------|
| [`00-vision-general.md`](00-vision-general.md) | Resumen ejecutivo, arquitectura, dependencias, cobertura y recomendaciones |
| [`01-compras-purchase.md`](01-compras-purchase.md) | Purchase: RFQ, órdenes, proveedores, recepciones, acuerdos, facturación |
| [`02-inventario-inventory.md`](02-inventario-inventory.md) | Inventory: almacenes, ubicaciones, movimientos, trazabilidad, reabastecimiento |
| [`03-fabricacion-mrp.md`](03-fabricacion-mrp.md) | Manufacturing: BOM, órdenes, operaciones, planificación, consumo y costeo |
| [`04-calidad-quality.md`](04-calidad-quality.md) | Quality (Enterprise): puntos de control, inspecciones, alertas |
| [`05-mantenimiento-maintenance.md`](05-mantenimiento-maintenance.md) | Maintenance: equipos, solicitudes, preventivo, MTBF/MTTR |
| [`06-plm.md`](06-plm.md) | PLM (Enterprise): ECOs, versiones de BOM, aprobaciones |
| [`07-codigos-barras-barcode.md`](07-codigos-barras-barcode.md) | Barcode: nomenclaturas, GS1 y app de escaneo |
| [`08-evaluacion-funcionalidades-avanzadas.md`](08-evaluacion-funcionalidades-avanzadas.md) | Evaluación de planificación avanzada, MES, trazabilidad, OEE, excepciones, IoT y costos |

---

## Estados de edición

| Módulo | Community | Enterprise |
|--------|-----------|------------|
| Purchase | ✅ | — |
| Inventory | ✅ | — |
| Manufacturing (MRP) | ✅ | Complementos (Shop Floor, MPS) |
| Quality | ❌ | ✅ |
| Maintenance | ✅ | Integración con MRP |
| PLM | ❌ | ✅ |
| Barcode | Base `barcodes` | App `stock_barcode` |

---

## Cómo leer cada documento

Cada documento de módulo sigue la misma estructura:

1. **Ficha del módulo**: propósito, edición, dependencias, modelos y menús.
2. **Mapa de funciones**: tabla con todas las funciones y su resultado.
3. **Detalle función por función**: qué hace, dónde se usa, objetos/campos, requisitos, resultado y límites.
4. **Flujo operativo**.
5. **Configuración inicial**.
6. **Reportes**.
7. **Límites y buenas prácticas**.

---

## Advertencia sobre Quality, PLM y Barcode

Estos módulos **no están presentes** en el repositorio local porque son **Enterprise**. Sus documentos se basan en la funcionalidad estándar documentada de Odoo Enterprise y se marcan como tales. Todo lo relativo a Purchase, Inventory, Manufacturing y Maintenance fue verificado contra el código local.

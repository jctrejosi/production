# Documentación — Producción y Abastecimiento en Odoo

Esta carpeta reúne la investigación funcional y técnica de los módulos de producción y abastecimiento de Odoo, detallados **función por función**.

**Base analizada:** repositorio local `odoo` — Odoo 20.0 (Community), commit `2b504bcb3b4` (2026-08-10).
**Método:** inspección de manifiestos, modelos, campos, vistas, acciones y menús en `addons/`.

---

## Documento único consolidado

**[`FUNCIONALIDADES_COMPLETAS.md`](FUNCIONALIDADES_COMPLETAS.md)** contiene **todas las funcionalidades contempladas** (184 funciones) en un solo archivo: catálogo por módulo, flujos, matriz Community/Enterprise, datos maestros, glosario y checklist de alcance.

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

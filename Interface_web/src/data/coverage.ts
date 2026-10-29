// GENERADO por scripts/verify-coverage.mjs — NO editar a mano.
// Catálogo extraído del documento normativo ../FUNCIONALIDADES.md.

export interface FuncionCatalog {
  module: string;
  code: string;
  title: string;
  description: string;
}

export const FUNCIONES: FuncionCatalog[] = [
  {
    "module": "ABT",
    "code": "ABT-01",
    "title": "Catálogo de productos comprables",
    "description": "El sistema debe permitir definir qué productos o servicios pueden comprarse, su unidad de medida, empaque, proveedores admitidos y política de facturación. Cada artículo debe indicar si se controla por cantidad, lote o serie, y si su recepción es obligatoria antes de facturar."
  },
  {
    "module": "ABT",
    "code": "ABT-02",
    "title": "Condiciones y tarifas de proveedor",
    "description": "Debe registrar, por proveedor y producto, el precio, la cantidad mínima, el plazo de entrega, la moneda, la vigencia, el descuento y el código o nombre que usa el proveedor. El sistema debe seleccionar automáticamente la condición vigente y prioritaria al crear una solicitud u orden."
  },
  {
    "module": "ABT",
    "code": "ABT-03",
    "title": "Gestión de proveedores",
    "description": "Debe permitir alta, modificación e inactivación de proveedores con datos fiscales, contactos, condiciones comerciales, avisos y evaluación de desempeño. La evaluación debe considerar al menos cumplimiento de entrega, calidad, precio y capacidad de respuesta."
  },
  {
    "module": "ABT",
    "code": "ABT-04",
    "title": "Solicitud de cotización",
    "description": "Debe permitir crear solicitudes con una o varias líneas, producto, cantidad, fecha requerida, lugar de entrega, condiciones de pago, moneda, impuestos y centro de costo. La solicitud debe poder enviarse a uno o varios proveedores y conservar el historial de comunicaciones."
  },
  {
    "module": "ABT",
    "code": "ABT-05",
    "title": "Generación automática de necesidades de compra",
    "description": "El sistema debe generar sugerencias de compra a partir de necesidades de inventario, consumo histórico, órdenes de producción, ventas comprometidas o planes de demanda. Cada sugerencia debe indicar origen, cantidad sugerida, fecha requerida y prioridad."
  },
  {
    "module": "ABT",
    "code": "ABT-06",
    "title": "Envío y comunicación con proveedores",
    "description": "Debe permitir enviar solicitudes y órdenes por correo, generar documentos en PDF y habilitar un portal o canal de consulta para el proveedor. Debe registrarse el envío, el acuse de recibo y cualquier respuesta o contraoferta."
  },
  {
    "module": "ABT",
    "code": "ABT-07",
    "title": "Comparación de ofertas y alternativas",
    "description": "El sistema debe permitir crear varias solicitudes para la misma necesidad, comparar precios, plazos, condiciones, calidad y desempeño de los proveedores, y seleccionar la mejor combinación por línea o por proveedor. La decisión debe quedar documentada con su justificación."
  },
  {
    "module": "ABT",
    "code": "ABT-08",
    "title": "Consolidación de solicitudes",
    "description": "Debe permitir agrupar solicitudes compatibles del mismo proveedor o de la misma necesidad para reducir el número de órdenes y mejorar la negociación."
  },
  {
    "module": "ABT",
    "code": "ABT-09",
    "title": "Acuerdos marco y plantillas",
    "description": "Debe permitir definir acuerdos de compra con precios y cantidades comprometidas por un período, así como plantillas reutilizables para pedidos recurrentes. El sistema debe controlar el consumo del acuerdo y alertar cuando se alcance el límite."
  },
  {
    "module": "ABT",
    "code": "ABT-10",
    "title": "Aprobaciones por importe y nivel",
    "description": "Debe permitir configurar niveles de aprobación por importe, categoría, centro de costo o proyecto. Toda orden que supere el umbral debe quedar pendiente de aprobación y registrar quién aprobó, cuándo y con qué observaciones."
  },
  {
    "module": "ABT",
    "code": "ABT-11",
    "title": "Confirmación de la orden",
    "description": "Al confirmar, el sistema debe generar el compromiso con el proveedor, las recepciones previstas y los movimientos de inventario correspondientes. La orden debe tener un identificador único y un estado verificable."
  },
  {
    "module": "ABT",
    "code": "ABT-12",
    "title": "Bloqueo y control de cambios",
    "description": "Debe permitir bloquear órdenes confirmadas para impedir modificaciones no autorizadas. Cualquier cambio posterior debe requerir desbloqueo, motivo y trazabilidad."
  },
  {
    "module": "ABT",
    "code": "ABT-13",
    "title": "Líneas, impuestos, descuentos y analítica",
    "description": "Cada línea debe soportar producto, descripción, cantidad, unidad, precio, descuento, impuestos, fecha prevista, centro de costo, proyecto y cuenta analítica. El sistema debe calcular subtotales, impuestos y totales con precisión."
  },
  {
    "module": "ABT",
    "code": "ABT-14",
    "title": "Recepción y seguimiento",
    "description": "Debe permitir recepciones totales o parciales, selección de ubicación, registro de lote o serie, control de calidad y generación de pendientes. La recepción debe actualizar el inventario y el estado de la orden."
  },
  {
    "module": "ABT",
    "code": "ABT-15",
    "title": "Control de cantidades y estados",
    "description": "El sistema debe mostrar, por orden y por línea, cantidad pedida, recibida, facturada, pendiente de recepción y pendiente de facturación. Los estados deben reflejar la realidad del documento y no solo una marca manual."
  },
  {
    "module": "ABT",
    "code": "ABT-16",
    "title": "Facturación y conciliación triple",
    "description": "Debe permitir generar la factura del proveedor y conciliarla con la orden y la recepción. El sistema debe detectar diferencias de cantidad, precio o impuestos y bloquear o alertar según la política definida."
  },
  {
    "module": "ABT",
    "code": "ABT-17",
    "title": "Devoluciones, cancelaciones y pendientes",
    "description": "Debe permitir devolver total o parcialmente una recepción, cancelar órdenes con las validaciones correspondientes y gestionar entregas pendientes o saldos abiertos. Toda devolución debe generar el movimiento inverso y el documento de ajuste."
  },
  {
    "module": "ABT",
    "code": "ABT-18",
    "title": "Recordatorios y seguimiento",
    "description": "Debe generar recordatorios de recepción, alertas de retraso, actividades de seguimiento y escalamiento. El comprador debe poder consultar qué órdenes están vencidas y qué acciones están pendientes."
  },
  {
    "module": "ABT",
    "code": "ABT-19",
    "title": "Compras vinculadas a producción y subcontratación",
    "description": "El sistema debe vincular la compra de componentes a órdenes de producción, kits o servicios de subcontratación. Debe informar qué material falta, para qué orden y con qué fecha límite."
  },
  {
    "module": "ABT",
    "code": "ABT-20",
    "title": "Intercambio electrónico de documentos",
    "description": "Debe permitir importar y exportar órdenes, facturas y documentos comerciales en formatos electrónicos estándar, con validación de estructura y registro de errores."
  },
  {
    "module": "ABT",
    "code": "ABT-21",
    "title": "Reportes y análisis",
    "description": "Debe ofrecer análisis de gasto por proveedor, producto, categoría, centro de costo y período; evolución de precios; cumplimiento de entrega; ahorro obtenido; órdenes abiertas y retrasos."
  },
  {
    "module": "ABT",
    "code": "ABT-22",
    "title": "Configuración y parámetros",
    "description": "Debe permitir configurar políticas de compra, umbrales de aprobación, bloqueo de órdenes, avisos, recordatorios, acuerdos, alternativas, unidades de medida, empaques y permisos."
  },
  {
    "module": "INV",
    "code": "INV-01",
    "title": "Almacén",
    "description": "El sistema debe permitir definir uno o varios almacenes con su código, dirección, calendario, pasos de recepción y pasos de entrega. Cada almacén debe tener rutas por defecto y reglas de reabastecimiento."
  },
  {
    "module": "INV",
    "code": "INV-02",
    "title": "Ubicaciones",
    "description": "Debe permitir crear una jerarquía de ubicaciones con tipos: internas, virtuales, de proveedor, de cliente, de pérdidas, de producción y de tránsito. Cada ubicación debe tener código, capacidad, estrategia de retiro y, si aplica, frecuencia de inventario."
  },
  {
    "module": "INV",
    "code": "INV-03",
    "title": "Tipos de operación",
    "description": "Debe permitir configurar tipos de operación para recepciones, entregas, transferencias internas, producción y entrega directa. Cada tipo debe definir ubicaciones por defecto, numeración, política de reserva, etiquetas e impresión."
  },
  {
    "module": "INV",
    "code": "INV-04",
    "title": "Rutas de abastecimiento",
    "description": "Debe permitir definir rutas de compra, fabricación, fabricación bajo pedido, entrega directa y reabastecimiento entre almacenes. Las rutas deben poder asignarse a productos, categorías, almacenes o tipos de empaque."
  },
  {
    "module": "INV",
    "code": "INV-05",
    "title": "Reglas de abastecimiento",
    "description": "Debe permitir configurar reglas de extracción, empuje y combinación, con métodos de suministro: tomar de stock, generar otra operación o tomar de stock y generar otra operación si no hay disponibilidad. Cada regla debe tener plazo, origen, destino y tipo de operación."
  },
  {
    "module": "INV",
    "code": "INV-06",
    "title": "Reglas de ubicación",
    "description": "Debe permitir definir dónde almacenar cada producto al recibirlo, considerando producto, categoría, tipo de empaque, capacidad y sububicación."
  },
  {
    "module": "INV",
    "code": "INV-07",
    "title": "Categorías de almacenamiento",
    "description": "Debe permitir definir capacidad máxima por peso, volumen, producto o tipo de paquete, y si se permite mezclar productos en una ubicación."
  },
  {
    "module": "INV",
    "code": "INV-08",
    "title": "Tipos de paquete",
    "description": "Debe permitir definir cajas, palés y contenedores con dimensiones, peso, peso máximo, código y uso previsto. El sistema debe poder calcular el peso y validar la capacidad."
  },
  {
    "module": "INV",
    "code": "INV-09",
    "title": "Estrategias de retiro",
    "description": "Debe permitir seleccionar la existencia a retirar según FIFO, LIFO, FEFO, ubicación más cercana o menor cantidad de paquetes. La estrategia debe poder definirse por ubicación o categoría."
  },
  {
    "module": "INV",
    "code": "INV-10",
    "title": "Nomenclaturas de captura",
    "description": "Debe permitir configurar reglas de interpretación de códigos para producto, peso, ubicación, lote, paquete y contacto, con patrones, prioridades y validaciones."
  },
  {
    "module": "INV",
    "code": "INV-11",
    "title": "Recepciones",
    "description": "Debe permitir recibir total o parcialmente, seleccionar ubicación, registrar lote o serie, crear paquetes, aplicar reglas de ubicación y generar pendientes. La recepción debe actualizar existencias y estados."
  },
  {
    "module": "INV",
    "code": "INV-12",
    "title": "Entregas",
    "description": "Debe permitir reservar, preparar, empacar y entregar productos, con control de disponibilidad, documentación y trazabilidad. Debe soportar entregas parciales y pendientes."
  },
  {
    "module": "INV",
    "code": "INV-13",
    "title": "Transferencias internas",
    "description": "Debe permitir mover productos entre ubicaciones internas con origen, destino, cantidad, lote, paquete y responsable."
  },
  {
    "module": "INV",
    "code": "INV-14",
    "title": "Transferencias agrupadas",
    "description": "Debe permitir agrupar varias transferencias para prepararlas y ejecutarlas en conjunto, asignar un responsable y controlar su avance."
  },
  {
    "module": "INV",
    "code": "INV-15",
    "title": "Reserva y disponibilidad",
    "description": "Debe permitir reservar existencias al confirmar, antes de la fecha programada o de forma manual. El sistema debe mostrar cantidad física, reservada, disponible y comprometida."
  },
  {
    "module": "INV",
    "code": "INV-16",
    "title": "Pendientes y entregas parciales",
    "description": "Cuando no se atienda toda la cantidad, el sistema debe generar un pendiente con la demanda restante y conservar la trazabilidad con el documento original."
  },
  {
    "module": "INV",
    "code": "INV-17",
    "title": "Devoluciones e intercambios",
    "description": "Debe permitir devolver total o parcialmente una entrega o recepción, generar el movimiento inverso y, si corresponde, crear una nueva entrega de intercambio."
  },
  {
    "module": "INV",
    "code": "INV-18",
    "title": "División de transferencias",
    "description": "Debe permitir separar una transferencia en varias para atender prioridades, clientes o fechas distintas."
  },
  {
    "module": "INV",
    "code": "INV-19",
    "title": "Paquetes",
    "description": "Debe permitir crear paquetes, asignar contenido, mover paquetes completos, anidar contenedores, imprimir etiquetas y consultar su historial."
  },
  {
    "module": "INV",
    "code": "INV-20",
    "title": "Operaciones detalladas",
    "description": "Cada movimiento debe poder registrarse con producto, cantidad, unidad, ubicación de origen y destino, lote o serie, paquete y propietario."
  },
  {
    "module": "INV",
    "code": "INV-21",
    "title": "Etiquetas e impresión",
    "description": "Debe permitir imprimir etiquetas de producto, lote, serie, paquete y ubicación, además de albaranes e informes de recepción. La impresión debe poder automatizarse por tipo de operación."
  },
  {
    "module": "INV",
    "code": "INV-22",
    "title": "Existencias por ubicación",
    "description": "El sistema debe mostrar la existencia física, reservada y disponible por producto, ubicación, lote, paquete y propietario."
  },
  {
    "module": "INV",
    "code": "INV-23",
    "title": "Inventario físico",
    "description": "Debe permitir contar existencias, ingresar la cantidad contada, calcular la diferencia, aplicar el ajuste y conservar el historial."
  },
  {
    "module": "INV",
    "code": "INV-24",
    "title": "Inventario cíclico",
    "description": "Debe permitir programar conteos periódicos por ubicación, calcular la próxima fecha y asignar la fecha a las existencias. Debe existir un inventario anual de respaldo para ubicaciones sin frecuencia."
  },
  {
    "module": "INV",
    "code": "INV-25",
    "title": "Reubicación",
    "description": "Debe permitir mover existencia de una ubicación a otra sin crear una transferencia formal, registrando el motivo y el responsable."
  },
  {
    "module": "INV",
    "code": "INV-26",
    "title": "Desecho",
    "description": "Debe permitir retirar material dañado, obsoleto o no conforme, indicando producto, cantidad, lote, motivo y si corresponde reponerlo."
  },
  {
    "module": "INV",
    "code": "INV-27",
    "title": "Valoración",
    "description": "Debe permitir valorar el inventario por costo estándar, costo promedio ponderado o FIFO, con posibilidad de valoración por lote. Debe generar los asientos contables correspondientes y permitir ajustes de valoración."
  },
  {
    "module": "INV",
    "code": "INV-28",
    "title": "Costos de importación",
    "description": "Debe permitir incorporar fletes, seguros, aranceles y otros costos al valor de los productos recibidos, con reparto por igual, cantidad, costo actual, peso o volumen."
  },
  {
    "module": "INV",
    "code": "INV-29",
    "title": "Entrega directa",
    "description": "Debe permitir que un proveedor entregue directamente al cliente sin pasar por el almacén, generando la documentación y la trazabilidad correspondientes."
  },
  {
    "module": "INV",
    "code": "INV-30",
    "title": "Consignación",
    "description": "Debe permitir controlar existencias de propiedad de terceros, separarlas de las propias y reportar por propietario."
  },
  {
    "module": "INV",
    "code": "INV-31",
    "title": "Lotes y números de serie",
    "description": "Debe permitir identificar productos por lote o número de serie, asignarlos en recepción, transferencia y producción, y consultar su existencia y movimientos."
  },
  {
    "module": "INV",
    "code": "INV-32",
    "title": "Fechas de caducidad",
    "description": "Debe permitir registrar fecha de caducidad, consumo preferente, retirada y alerta, y emitir avisos antes del vencimiento."
  },
  {
    "module": "INV",
    "code": "INV-33",
    "title": "FEFO",
    "description": "Debe permitir retirar primero el lote con fecha de retirada más próxima, cuando la estrategia esté configurada."
  },
  {
    "module": "INV",
    "code": "INV-34",
    "title": "Reporte de trazabilidad",
    "description": "Debe reconstruir la historia de un lote o serie hacia atrás y hacia adelante, mostrando movimientos, documentos, proveedores y clientes."
  },
  {
    "module": "INV",
    "code": "INV-35",
    "title": "Referencias documentales",
    "description": "Debe permitir agrupar movimientos de distintos documentos bajo una referencia común para auditoría y seguimiento."
  },
  {
    "module": "INV",
    "code": "INV-36",
    "title": "Puntos de pedido",
    "description": "Debe permitir definir mínimo, máximo, consumo diario, plazo, ruta y cantidad a pedir por producto y ubicación. El sistema debe calcular la necesidad y generar sugerencias."
  },
  {
    "module": "INV",
    "code": "INV-37",
    "title": "Informe de reabastecimiento",
    "description": "Debe mostrar productos bajo mínimo, cantidad sugerida, origen de la necesidad y acción recomendada (comprar, fabricar o transferir)."
  },
  {
    "module": "INV",
    "code": "INV-38",
    "title": "Previsión de existencias",
    "description": "Debe proyectar entradas, salidas y stock futuro por fecha, y alertar sobre faltantes o excesos."
  },
  {
    "module": "INV",
    "code": "INV-39",
    "title": "Reabastecimiento entre almacenes",
    "description": "Debe permitir abastecer un almacén desde otro mediante rutas y transferencias automáticas."
  },
  {
    "module": "INV",
    "code": "INV-40",
    "title": "Producción o compra bajo pedido",
    "description": "Debe permitir que una necesidad concreta dispare una compra o una orden de producción sin tomar stock disponible."
  },
  {
    "module": "INV",
    "code": "INV-41",
    "title": "Análisis de movimientos",
    "description": "Debe permitir analizar entradas y salidas por producto, ubicación, fecha, documento, lote y responsable."
  },
  {
    "module": "INV",
    "code": "INV-42",
    "title": "Stock por ubicación",
    "description": "Debe mostrar existencias detalladas con filtros por producto, ubicación, lote, paquete y propietario."
  },
  {
    "module": "INV",
    "code": "INV-43",
    "title": "Valoración del inventario",
    "description": "Debe mostrar el valor por producto, categoría, ubicación y período, y permitir exportar la información contable."
  },
  {
    "module": "INV",
    "code": "INV-44",
    "title": "Trazabilidad",
    "description": "Debe permitir consultar el historial completo de un lote o serie y exportarlo para auditoría."
  },
  {
    "module": "PRD",
    "code": "PRD-01",
    "title": "Lista de materiales normal",
    "description": "Debe permitir definir los componentes y cantidades necesarios para fabricar un producto, con unidad de medida, merma, operación de consumo, subproductos, plazos y observaciones."
  },
  {
    "module": "PRD",
    "code": "PRD-02",
    "title": "Lista de materiales tipo kit",
    "description": "Debe permitir definir productos compuestos que se explotan en componentes sin generar una orden de fabricación propia."
  },
  {
    "module": "PRD",
    "code": "PRD-03",
    "title": "Lista de materiales multinivel",
    "description": "Debe permitir que un componente tenga su propia lista de materiales y que el sistema explote la estructura completa, generando órdenes hijas cuando corresponda."
  },
  {
    "module": "PRD",
    "code": "PRD-04",
    "title": "Componentes y variantes",
    "description": "Debe permitir definir componentes por variante de producto, componentes opcionales, cantidades variables y componentes asignados a una operación específica."
  },
  {
    "module": "PRD",
    "code": "PRD-05",
    "title": "Subproductos",
    "description": "Debe permitir registrar productos adicionales generados en el proceso, con cantidad, unidad, operación y participación en el costo."
  },
  {
    "module": "PRD",
    "code": "PRD-06",
    "title": "Operaciones y rutas",
    "description": "Debe permitir definir la secuencia de operaciones, centro de trabajo, duración fija o calculada, tiempo de preparación, tiempo de ciclo, limpieza y costo."
  },
  {
    "module": "PRD",
    "code": "PRD-07",
    "title": "Dependencias entre operaciones",
    "description": "Debe permitir indicar qué operación debe terminar antes de iniciar otra, validando ciclos y respetando la secuencia."
  },
  {
    "module": "PRD",
    "code": "PRD-08",
    "title": "Tamaño de lote y producción continua",
    "description": "Debe permitir definir el tamaño de lote y, si aplica, desbloquear automáticamente la siguiente operación al registrar producción."
  },
  {
    "module": "PRD",
    "code": "PRD-09",
    "title": "Plazos y preparación",
    "description": "Debe permitir definir el plazo de fabricación, los días de preparación y la condición para iniciar: con todos los componentes o con los de la primera operación."
  },
  {
    "module": "PRD",
    "code": "PRD-10",
    "title": "Creación de órdenes",
    "description": "Debe permitir crear órdenes manualmente o a partir de una necesidad de stock, venta, plan maestro, subensamble o subcontratación."
  },
  {
    "module": "PRD",
    "code": "PRD-11",
    "title": "Confirmación",
    "description": "Al confirmar, el sistema debe explotar la lista de materiales, generar la demanda de componentes, crear los movimientos de producto terminado y disparar el abastecimiento."
  },
  {
    "module": "PRD",
    "code": "PRD-12",
    "title": "Reserva y disponibilidad",
    "description": "Debe permitir reservar componentes, liberar reservas y mostrar si la orden está lista, esperando material o esperando otra operación."
  },
  {
    "module": "PRD",
    "code": "PRD-13",
    "title": "Capacidad de producción",
    "description": "Debe calcular cuánto se puede producir con el stock actual de componentes y mostrar las restricciones."
  },
  {
    "module": "PRD",
    "code": "PRD-14",
    "title": "Registro de producción",
    "description": "Debe permitir registrar cantidad producida, lote o serie, subproductos, mermas y movimientos de terminado."
  },
  {
    "module": "PRD",
    "code": "PRD-15",
    "title": "Consumo y advertencias",
    "description": "Debe comparar consumo real con teórico, alertar diferencias y permitir su justificación o ajuste según permisos."
  },
  {
    "module": "PRD",
    "code": "PRD-16",
    "title": "Pendientes y producción parcial",
    "description": "Debe permitir cerrar una orden con cantidad menor y generar un pendiente con la demanda restante."
  },
  {
    "module": "PRD",
    "code": "PRD-17",
    "title": "División y fusión de órdenes",
    "description": "Debe permitir separar o unir órdenes compatibles para ajustar la planificación."
  },
  {
    "module": "PRD",
    "code": "PRD-18",
    "title": "Bloqueo de cantidades",
    "description": "Debe permitir bloquear cantidades para impedir cambios durante la ejecución y requerir autorización para modificarlas."
  },
  {
    "module": "PRD",
    "code": "PRD-19",
    "title": "Desecho",
    "description": "Debe permitir desechar componentes o producto terminado con motivo, cantidad y responsable."
  },
  {
    "module": "PRD",
    "code": "PRD-20",
    "title": "Cierre",
    "description": "Debe permitir finalizar la orden, consolidar consumo y producción, calcular costos y generar el pendiente si corresponde."
  },
  {
    "module": "PRD",
    "code": "PRD-21",
    "title": "Desensamblado",
    "description": "Debe permitir descomponer un producto terminado en sus componentes, recuperando stock y trazabilidad."
  },
  {
    "module": "PRD",
    "code": "PRD-22",
    "title": "Órdenes de trabajo",
    "description": "Debe permitir crear una orden por operación, asignarla a un centro y a un responsable, y controlar su estado: bloqueada, por hacer, en progreso, hecha o cancelada."
  },
  {
    "module": "PRD",
    "code": "PRD-23",
    "title": "Centros de trabajo",
    "description": "Debe permitir definir máquinas, celdas o recursos con calendario, eficiencia, costo por hora, tiempos de preparación y limpieza, capacidad y etiquetas."
  },
  {
    "module": "PRD",
    "code": "PRD-24",
    "title": "Capacidad por producto",
    "description": "Debe permitir definir cuántas piezas se procesan por ciclo según producto o unidad, con tiempos de inicio y fin."
  },
  {
    "module": "PRD",
    "code": "PRD-25",
    "title": "Tiempos y productividad",
    "description": "Debe registrar inicio, pausa, reanudación y fin de cada operación, con usuario, duración real y duración esperada."
  },
  {
    "module": "PRD",
    "code": "PRD-26",
    "title": "Pérdidas y eficiencia",
    "description": "Debe permitir registrar paradas y pérdidas por disponibilidad, rendimiento, calidad o tiempo productivo, y calcular indicadores de eficiencia."
  },
  {
    "module": "PRD",
    "code": "PRD-27",
    "title": "Dependencias y bloqueos",
    "description": "Debe permitir bloquear una orden de trabajo hasta que termine su predecesora y desbloquearla automáticamente."
  },
  {
    "module": "PRD",
    "code": "PRD-28",
    "title": "Centros alternativos",
    "description": "Debe permitir sustituir un centro por otro cuando haya saturación, mantenimiento o avería."
  },
  {
    "module": "PRD",
    "code": "PRD-29",
    "title": "Fechas y calendario",
    "description": "Debe permitir programar inicio, fin y fecha límite, visualizar las órdenes en calendario y alertar retrasos."
  },
  {
    "module": "PRD",
    "code": "PRD-30",
    "title": "Planificación de capacidad",
    "description": "Debe mostrar la carga por centro, las órdenes listas, en progreso, bloqueadas y retrasadas, y permitir ajustar la programación."
  },
  {
    "module": "PRD",
    "code": "PRD-31",
    "title": "Necesidades de componentes",
    "description": "Debe calcular faltantes, fechas esperadas de llegada y acciones de compra o fabricación."
  },
  {
    "module": "PRD",
    "code": "PRD-32",
    "title": "Reabastecimiento",
    "description": "Debe generar compras u órdenes de fabricación según puntos de pedido, rutas y prioridades."
  },
  {
    "module": "PRD",
    "code": "PRD-33",
    "title": "Costo de la orden",
    "description": "Debe calcular el costo de materiales, operaciones, costos adicionales y subproductos, y registrar el valor del producto terminado."
  },
  {
    "module": "PRD",
    "code": "PRD-34",
    "title": "Costo de operaciones",
    "description": "Debe valorizar el tiempo real o estimado de cada operación según la tarifa del centro."
  },
  {
    "module": "PRD",
    "code": "PRD-35",
    "title": "Distribución analítica",
    "description": "Debe permitir imputar costos a centros de costo, proyectos o cuentas analíticas."
  },
  {
    "module": "PRD",
    "code": "PRD-36",
    "title": "Producción en proceso (WIP)",
    "description": "Debe permitir contabilizar el trabajo en curso y consultar su valor por orden o período."
  },
  {
    "module": "PRD",
    "code": "PRD-37",
    "title": "Subcontratación",
    "description": "Debe permitir delegar total o parcialmente la fabricación, enviar componentes al subcontratista, recibir el producto terminado y controlar costos y trazabilidad."
  },
  {
    "module": "PRD",
    "code": "PRD-38",
    "title": "Reparación",
    "description": "Debe permitir crear órdenes de reparación con producto, lote, piezas, servicios, movimientos de stock, facturación y vínculo con producción."
  },
  {
    "module": "PRD",
    "code": "PRD-39",
    "title": "Compras para producción",
    "description": "Debe permitir comprar componentes y kits para una orden de fabricación, con vínculo entre necesidad, compra y consumo."
  },
  {
    "module": "PRD",
    "code": "PRD-40",
    "title": "Reportes de producción",
    "description": "Debe ofrecer análisis de órdenes, operaciones, eficiencia, pérdidas, estructura de materiales, consumo, producción y cumplimiento."
  },
  {
    "module": "PRD",
    "code": "PRD-41",
    "title": "Configuración",
    "description": "Debe permitir activar órdenes de trabajo, subproductos, desbloqueo de cantidades, subcontratación y parámetros de planificación y costeo."
  },
  {
    "module": "CAL",
    "code": "CAL-01",
    "title": "Puntos de control",
    "description": "Debe permitir definir qué producto, operación o tipo de movimiento debe inspeccionarse, con qué frecuencia, por qué equipo y con qué instrucciones."
  },
  {
    "module": "CAL",
    "code": "CAL-02",
    "title": "Tipos de control",
    "description": "Debe permitir controles de instrucciones, aprobado/rechazado, medición numérica y formularios o hojas de trabajo."
  },
  {
    "module": "CAL",
    "code": "CAL-03",
    "title": "Criterios de aceptación",
    "description": "Debe permitir definir valores mínimos, máximos, tolerancias, unidades y valores predefinidos para aprobar o rechazar."
  },
  {
    "module": "CAL",
    "code": "CAL-04",
    "title": "Controles en recepción",
    "description": "Debe generar controles al recibir mercancía, permitir aprobar, rechazar o medir, y bloquear el ingreso si el resultado no es conforme."
  },
  {
    "module": "CAL",
    "code": "CAL-05",
    "title": "Controles en entrega y transferencia",
    "description": "Debe permitir verificar producto, cantidad, empaque, etiquetado o documentación antes de la salida."
  },
  {
    "module": "CAL",
    "code": "CAL-06",
    "title": "Controles en producción",
    "description": "Debe permitir controles por operación, primera pieza, proceso o producto final, bloqueando la operación hasta el resultado."
  },
  {
    "module": "CAL",
    "code": "CAL-07",
    "title": "Hojas de trabajo",
    "description": "Debe permitir formularios configurables con secciones, campos, firmas, fotos y documentos adjuntos."
  },
  {
    "module": "CAL",
    "code": "CAL-08",
    "title": "Ejecución de controles",
    "description": "Debe mostrar los controles pendientes, las instrucciones, el formulario, el responsable y la evidencia."
  },
  {
    "module": "CAL",
    "code": "CAL-09",
    "title": "Resultado y bloqueo",
    "description": "Debe registrar aprobado, rechazado o fuera de tolerancia, y bloquear la operación, lote o documento cuando corresponda."
  },
  {
    "module": "CAL",
    "code": "CAL-10",
    "title": "Alertas de calidad",
    "description": "Debe permitir crear alertas por no conformidad con producto, lote, cantidad, origen, prioridad, causa y acción."
  },
  {
    "module": "CAL",
    "code": "CAL-11",
    "title": "Etapas de alerta",
    "description": "Debe permitir configurar un flujo de etapas, responsables, transiciones y fechas para gestionar la alerta."
  },
  {
    "module": "CAL",
    "code": "CAL-12",
    "title": "Equipos de calidad",
    "description": "Debe permitir definir equipos, miembros, responsables y asignación de puntos de control y alertas."
  },
  {
    "module": "CAL",
    "code": "CAL-13",
    "title": "Causa raíz y acciones",
    "description": "Debe permitir documentar el análisis de causa, la acción inmediata, la acción correctiva, la acción preventiva y la verificación de eficacia."
  },
  {
    "module": "CAL",
    "code": "CAL-14",
    "title": "Trazabilidad de la inspección",
    "description": "Debe vincular cada control con producto, lote, orden, operación, responsable, fecha y evidencia."
  },
  {
    "module": "CAL",
    "code": "CAL-15",
    "title": "Reportes",
    "description": "Debe ofrecer controles por producto, tasa de aprobación y rechazo, alertas por etapa, defectos por causa y evolución temporal."
  },
  {
    "module": "CAL",
    "code": "CAL-16",
    "title": "Configuración",
    "description": "Debe permitir activar el módulo, definir equipos, etapas, puntos de control, tipos de control y criterios."
  },
  {
    "module": "CAL",
    "code": "CAL-17",
    "title": "Integraciones",
    "description": "Debe integrarse con inventario, producción, mantenimiento, documentos y captura por escáner."
  },
  {
    "module": "CAL",
    "code": "CAL-18",
    "title": "Gestión documental",
    "description": "Debe permitir adjuntar especificaciones, planos, certificados y evidencias a controles, alertas y lotes."
  },
  {
    "module": "MNT",
    "code": "MNT-01",
    "title": "Ficha de equipo",
    "description": "Debe permitir registrar nombre, categoría, propietario, responsable, proveedor, modelo, número de serie, costo, garantía, fecha de asignación, fecha de baja, ubicación y observaciones."
  },
  {
    "module": "MNT",
    "code": "MNT-02",
    "title": "Categorías de equipo",
    "description": "Debe permitir agrupar equipos, definir responsable por defecto y propiedades personalizadas."
  },
  {
    "module": "MNT",
    "code": "MNT-03",
    "title": "Equipos de mantenimiento",
    "description": "Debe permitir definir equipos de trabajo, miembros, correo de recepción de solicitudes y carga de trabajo."
  },
  {
    "module": "MNT",
    "code": "MNT-04",
    "title": "Etapas",
    "description": "Debe permitir configurar un flujo visual de etapas para las solicitudes."
  },
  {
    "module": "MNT",
    "code": "MNT-05",
    "title": "Solicitudes",
    "description": "Debe permitir crear solicitudes con equipo obligatorio, tipo, prioridad, responsable, fecha, descripción, instrucciones y propiedades."
  },
  {
    "module": "MNT",
    "code": "MNT-06",
    "title": "Mantenimiento correctivo",
    "description": "Debe permitir registrar fallas no planificadas, diagnosticar, reparar, documentar y cerrar."
  },
  {
    "module": "MNT",
    "code": "MNT-07",
    "title": "Mantenimiento preventivo",
    "description": "Debe permitir planificar trabajos periódicos, asignar recursos y registrar su ejecución."
  },
  {
    "module": "MNT",
    "code": "MNT-08",
    "title": "Recurrencia",
    "description": "Debe permitir definir intervalos en días, semanas, meses o años, con duración indefinida o hasta una fecha, generando la siguiente solicitud."
  },
  {
    "module": "MNT",
    "code": "MNT-09",
    "title": "Programación",
    "description": "Debe permitir definir fecha y hora planificada, fin previsto, duración y fecha real de cierre, con vista de calendario."
  },
  {
    "module": "MNT",
    "code": "MNT-10",
    "title": "Tablero visual",
    "description": "Debe permitir gestionar solicitudes por etapa, prioridad, responsable y equipo mediante un tablero."
  },
  {
    "module": "MNT",
    "code": "MNT-11",
    "title": "Prioridad y asignación",
    "description": "Debe permitir priorizar y asignar técnicos, equipos y responsables."
  },
  {
    "module": "MNT",
    "code": "MNT-12",
    "title": "Instrucciones y notas",
    "description": "Debe permitir documentar instrucciones de trabajo, observaciones y adjuntos."
  },
  {
    "module": "MNT",
    "code": "MNT-13",
    "title": "Cierre, cancelación y reapertura",
    "description": "Debe permitir cerrar, cancelar y reabrir solicitudes, conservando el historial y deteniendo o reactivando la recurrencia."
  },
  {
    "module": "MNT",
    "code": "MNT-14",
    "title": "MTBF y MTTR",
    "description": "Debe calcular tiempo medio entre fallas, tiempo medio de reparación, última falla y próximo fallo estimado."
  },
  {
    "module": "MNT",
    "code": "MNT-15",
    "title": "Asignación y ubicación",
    "description": "Debe permitir indicar quién usa el equipo y dónde está ubicado, incluyendo equipos por ubicación."
  },
  {
    "module": "MNT",
    "code": "MNT-16",
    "title": "Garantía y costo",
    "description": "Debe registrar costo, proveedor, vencimiento de garantía y fecha de baja."
  },
  {
    "module": "MNT",
    "code": "MNT-17",
    "title": "Propiedades personalizadas",
    "description": "Debe permitir definir campos adicionales por categoría de equipo y por solicitud."
  },
  {
    "module": "MNT",
    "code": "MNT-18",
    "title": "Dashboard",
    "description": "Debe mostrar solicitudes pendientes, programadas, prioritarias, con cambios solicitados y sin programar."
  },
  {
    "module": "MNT",
    "code": "MNT-19",
    "title": "Reportes",
    "description": "Debe analizar solicitudes por equipo, técnico, etapa, tipo y período."
  },
  {
    "module": "MNT",
    "code": "MNT-20",
    "title": "Integración con inventario",
    "description": "Debe vincular equipos con ubicaciones, lotes y números de serie, y permitir consultar equipos por ubicación."
  },
  {
    "module": "MNT",
    "code": "MNT-21",
    "title": "Integración con reparaciones",
    "description": "Debe permitir crear órdenes de reparación con piezas, servicios, movimientos de stock y facturación."
  },
  {
    "module": "MNT",
    "code": "MNT-22",
    "title": "Configuración",
    "description": "Debe permitir configurar equipos, categorías, etapas, alias de correo y permisos."
  },
  {
    "module": "MNT",
    "code": "MNT-23",
    "title": "Gestión de repuestos",
    "description": "Debe permitir consultar y reservar repuestos del inventario para una solicitud o reparación, dejando trazabilidad del consumo."
  },
  {
    "module": "PLM",
    "code": "PLM-01",
    "title": "Orden de cambio de ingeniería",
    "description": "Debe permitir crear un documento de cambio con tipo, producto, lista de materiales, etapa, responsable, prioridad, motivo, alcance y fechas."
  },
  {
    "module": "PLM",
    "code": "PLM-02",
    "title": "Tipos de cambio",
    "description": "Debe permitir clasificar los cambios (producto, materiales, operaciones, documentación) y aplicar reglas distintas según el tipo."
  },
  {
    "module": "PLM",
    "code": "PLM-03",
    "title": "Etapas del cambio",
    "description": "Debe permitir configurar un flujo de etapas, responsables y criterios de avance."
  },
  {
    "module": "PLM",
    "code": "PLM-04",
    "title": "Aprobaciones",
    "description": "Debe permitir aprobar o rechazar un cambio, registrar usuario, fecha y comentarios, y exigir aprobación antes de aplicar."
  },
  {
    "module": "PLM",
    "code": "PLM-05",
    "title": "Versiones de lista de materiales",
    "description": "Debe permitir crear una nueva versión al aplicar el cambio, conservando la anterior y asociándola al documento de cambio."
  },
  {
    "module": "PLM",
    "code": "PLM-06",
    "title": "Revisiones",
    "description": "Debe mantener el historial de revisiones con fecha, responsable y cambios realizados."
  },
  {
    "module": "PLM",
    "code": "PLM-07",
    "title": "Cambios en componentes",
    "description": "Debe permitir agregar, quitar o modificar componentes, cantidades, unidades, variantes y subproductos."
  },
  {
    "module": "PLM",
    "code": "PLM-08",
    "title": "Cambios en operaciones",
    "description": "Debe permitir agregar, quitar o modificar operaciones, centros, tiempos, dependencias e instrucciones."
  },
  {
    "module": "PLM",
    "code": "PLM-09",
    "title": "Fechas de efectividad",
    "description": "Debe permitir definir desde y hasta cuándo aplica una versión, y seleccionar la versión vigente según la fecha de producción."
  },
  {
    "module": "PLM",
    "code": "PLM-10",
    "title": "Archivo de versiones",
    "description": "Debe conservar versiones anteriores, permitir consultarlas y reactivarlas de forma controlada."
  },
  {
    "module": "PLM",
    "code": "PLM-11",
    "title": "Análisis de impacto",
    "description": "Debe identificar listas de materiales, órdenes y productos afectados, y estimar el impacto del cambio."
  },
  {
    "module": "PLM",
    "code": "PLM-12",
    "title": "Gestión documental",
    "description": "Debe permitir adjuntar planos, especificaciones, certificados y evidencias, con control de versiones y acceso."
  },
  {
    "module": "PLM",
    "code": "PLM-13",
    "title": "Trazabilidad y auditoría",
    "description": "Debe registrar quién creó, revisó, aprobó y aplicó cada cambio, con fecha y versión resultante."
  },
  {
    "module": "PLM",
    "code": "PLM-14",
    "title": "Reportes",
    "description": "Debe analizar cambios por etapa, tipo, responsable, producto y tiempo de ciclo."
  },
  {
    "module": "PLM",
    "code": "PLM-15",
    "title": "Configuración",
    "description": "Debe permitir configurar tipos, etapas, secuencias, permisos y reglas de efectividad."
  },
  {
    "module": "PLM",
    "code": "PLM-16",
    "title": "Integración con producción y compras",
    "description": "Debe asegurar que producción y compras usen la versión vigente y alertar si una orden abierta queda afectada por un cambio."
  },
  {
    "module": "CAP",
    "code": "CAP-01",
    "title": "Nomenclatura",
    "description": "Debe permitir definir conjuntos de reglas para interpretar códigos, con conversión de formatos y asignación por compañía o planta."
  },
  {
    "module": "CAP",
    "code": "CAP-02",
    "title": "Reglas",
    "description": "Debe permitir definir nombre, prioridad, formato, tipo, patrón y alias de cada regla."
  },
  {
    "module": "CAP",
    "code": "CAP-03",
    "title": "Tipos de código",
    "description": "Debe soportar producto, peso, ubicación, lote, serie, paquete y contacto; y tipos GS1 como cantidad, fecha, ubicación destino y tipo de paquete."
  },
  {
    "module": "CAP",
    "code": "CAP-04",
    "title": "Interpretación",
    "description": "Debe convertir el código en tipo, valor, código base y formato, e informar error si no coincide con ninguna regla."
  },
  {
    "module": "CAP",
    "code": "CAP-05",
    "title": "GS1",
    "description": "Debe interpretar GS1-128, separadores, identificadores de aplicación, fechas, medidas y identificadores únicos."
  },
  {
    "module": "CAP",
    "code": "CAP-06",
    "title": "Código de producto",
    "description": "Debe permitir asignar y buscar productos por código, validando formato y unicidad."
  },
  {
    "module": "CAP",
    "code": "CAP-07",
    "title": "Código de ubicación",
    "description": "Debe permitir asignar y buscar ubicaciones por código único."
  },
  {
    "module": "CAP",
    "code": "CAP-08",
    "title": "Código de lote o serie",
    "description": "Debe permitir identificar y buscar lotes y números de serie."
  },
  {
    "module": "CAP",
    "code": "CAP-09",
    "title": "Código de paquete",
    "description": "Debe permitir identificar paquetes y validar el formato SSCC."
  },
  {
    "module": "CAP",
    "code": "CAP-10",
    "title": "Código de contacto",
    "description": "Debe permitir identificar proveedores y clientes por código."
  },
  {
    "module": "CAP",
    "code": "CAP-11",
    "title": "Validación de formatos",
    "description": "Debe validar EAN, GTIN, SSCC y dígito de control."
  },
  {
    "module": "CAP",
    "code": "CAP-12",
    "title": "Recepción por escáner",
    "description": "Debe permitir seleccionar la recepción, escanear producto, cantidad, lote y ubicación, y validar."
  },
  {
    "module": "CAP",
    "code": "CAP-13",
    "title": "Transferencias por escáner",
    "description": "Debe permitir escanear origen, destino, producto, lote y paquete, y validar el movimiento."
  },
  {
    "module": "CAP",
    "code": "CAP-14",
    "title": "Entregas y preparación por escáner",
    "description": "Debe permitir preparar pedidos, escanear producto y paquete, confirmar cantidades y validar."
  },
  {
    "module": "CAP",
    "code": "CAP-15",
    "title": "Conteo por escáner",
    "description": "Debe permitir escanear ubicación y producto, ingresar cantidad contada y aplicar el ajuste."
  },
  {
    "module": "CAP",
    "code": "CAP-16",
    "title": "Paquetes por escáner",
    "description": "Debe permitir crear, asignar, mover, anidar e imprimir paquetes."
  },
  {
    "module": "CAP",
    "code": "CAP-17",
    "title": "Lotes y series por escáner",
    "description": "Debe permitir escanear o crear lotes y series durante la operación."
  },
  {
    "module": "CAP",
    "code": "CAP-18",
    "title": "Fabricación por escáner",
    "description": "Debe permitir seleccionar la orden, escanear componentes, registrar consumo y producción, y cerrar la operación."
  },
  {
    "module": "CAP",
    "code": "CAP-19",
    "title": "Etiquetas",
    "description": "Debe permitir imprimir etiquetas de producto, lote, serie, paquete y ubicación, con formatos configurables."
  },
  {
    "module": "CAP",
    "code": "CAP-20",
    "title": "Configuración",
    "description": "Debe permitir configurar nomenclaturas, reglas, GS1, operaciones, impresión y dispositivos."
  },
  {
    "module": "PLA",
    "code": "PLA-01",
    "title": "Plan maestro de producción (MPS)",
    "description": "Debe permitir construir un plan de producción a partir de la previsión de demanda, pedidos confirmados y stock objetivo, con horizontes y períodos configurables. El plan debe generar sugerencias de fabricación y compra, y permitir su aprobación y versionado."
  },
  {
    "module": "PLA",
    "code": "PLA-02",
    "title": "Planificación de necesidades de materiales (MRP)",
    "description": "Debe calcular las necesidades netas de materiales a partir de la explosión de listas de materiales, el stock disponible, las recepciones previstas, el stock de seguridad y los plazos. Debe mostrar el origen de cada necesidad y su vínculo con la orden que la genera."
  },
  {
    "module": "PLA",
    "code": "PLA-03",
    "title": "Separación entre materiales y capacidad",
    "description": "El sistema debe calcular primero las necesidades de materiales y después programar la capacidad. Ambos resultados deben poder compararse y reconciliarse, informando si el plan es viable en materiales, en capacidad o en ambos."
  },
  {
    "module": "PLA",
    "code": "PLA-04",
    "title": "Capacidad finita por máquina y centro de trabajo",
    "description": "Debe permitir programar órdenes considerando calendarios, turnos, eficiencia, tiempos de preparación, capacidad por producto y disponibilidad de centros alternativos. La programación debe respetar la capacidad finita y alertar cuando no sea posible."
  },
  {
    "module": "PLA",
    "code": "PLA-05",
    "title": "Secuenciación y priorización de órdenes",
    "description": "Debe permitir ordenar las operaciones según prioridad, fecha de entrega, dependencia, minimización de preparación, restricciones de máquina y reglas configurables. El planificador debe poder bloquear una secuencia y evitar su reprogramación automática."
  },
  {
    "module": "PLA",
    "code": "PLA-06",
    "title": "Simulación de escenarios",
    "description": "Debe permitir crear escenarios con cambios de demanda, capacidad, turnos, retrasos o disponibilidad de materiales, comparar sus indicadores y guardar la versión elegida sin afectar el plan vigente."
  },
  {
    "module": "PLA",
    "code": "PLA-07",
    "title": "Replanificación ante retrasos",
    "description": "Ante un retraso de material, una avería o una orden prioritaria, el sistema debe recalcular el plan, propagar el impacto a las órdenes afectadas, proponer alternativas y alertar a los responsables."
  },
  {
    "module": "PLA",
    "code": "PLA-08",
    "title": "Identificación de cuellos de botella",
    "description": "Debe comparar carga contra capacidad por centro y período, identificar recursos saturados, colas y órdenes retrasadas, y señalar el recurso que limita el plan."
  },
  {
    "module": "PLA",
    "code": "PLA-09",
    "title": "Fechas de entrega y compromiso",
    "description": "Debe calcular fechas de entrega realistas a partir de materiales y capacidad, y ofrecer mecanismos de disponible para prometer (ATP) y capaz para prometer (CTP)."
  },
  {
    "module": "PLA",
    "code": "PLA-10",
    "title": "Gestión de excepciones de plan",
    "description": "Debe detectar y gestionar sobrecargas, faltantes de material, órdenes retrasadas, recursos no disponibles y conflictos de prioridad, con acciones sugeridas y responsables."
  },
  {
    "module": "PLA",
    "code": "PLA-11",
    "title": "Colaboración y aprobación del plan",
    "description": "Debe permitir revisar, comentar y aprobar el plan, con versiones, responsables y períodos congelados para evitar cambios no coordinados."
  },
  {
    "module": "PLA",
    "code": "PLA-12",
    "title": "Indicadores de planificación",
    "description": "Debe medir cumplimiento del plan, utilización de capacidad, backlog, trabajo en curso, nivel de servicio y estabilidad del plan."
  },
  {
    "module": "PLA",
    "code": "PLA-13",
    "title": "Integración con compras, producción, mantenimiento y ventas",
    "description": "El plan debe generar necesidades de compra, órdenes de producción, reservas de capacidad y avisos a mantenimiento, y considerar la disponibilidad de recursos."
  },
  {
    "module": "PLA",
    "code": "PLA-14",
    "title": "Configuración y gobierno",
    "description": "Debe permitir configurar calendarios, turnos, horizontes, reglas de prioridad, períodos congelados, permisos y auditoría de cambios."
  },
  {
    "module": "MES",
    "code": "MES-01",
    "title": "Liberación de órdenes de trabajo",
    "description": "Debe permitir liberar órdenes a la planta una vez validadas las condiciones de material, capacidad y documentación."
  },
  {
    "module": "MES",
    "code": "MES-02",
    "title": "Asignación de recursos y operarios",
    "description": "Debe permitir asignar órdenes a máquinas, centros y operarios, considerando disponibilidad, habilidades y carga."
  },
  {
    "module": "MES",
    "code": "MES-03",
    "title": "Inicio, pausa, reanudación y finalización",
    "description": "Debe registrar el ciclo de vida de cada operación con fecha, hora, usuario y motivo de pausa."
  },
  {
    "module": "MES",
    "code": "MES-04",
    "title": "Captura de cantidades producidas, rechazadas y pendientes",
    "description": "Debe permitir registrar cantidad producida, cantidad rechazada con motivo y cantidad pendiente, manteniendo la relación con la orden."
  },
  {
    "module": "MES",
    "code": "MES-05",
    "title": "Registro de tiempos reales",
    "description": "Debe registrar tiempo de preparación, ciclo, espera, pausa y limpieza, comparándolos con los tiempos estándar."
  },
  {
    "module": "MES",
    "code": "MES-06",
    "title": "Registro de paradas y causas",
    "description": "Debe permitir registrar paradas por disponibilidad, rendimiento, calidad u otra causa, con inicio, fin, duración y responsable."
  },
  {
    "module": "MES",
    "code": "MES-07",
    "title": "Instrucciones de trabajo digitales",
    "description": "Debe mostrar al operario instrucciones, especificaciones, planos y listas de verificación asociadas a la operación."
  },
  {
    "module": "MES",
    "code": "MES-08",
    "title": "Confirmación de operaciones y consumo",
    "description": "Debe permitir confirmar el consumo de materiales, la producción y el avance de la operación, actualizando inventario y trazabilidad."
  },
  {
    "module": "MES",
    "code": "MES-09",
    "title": "Seguimiento del trabajo en curso (WIP)",
    "description": "Debe mostrar órdenes en curso, cantidad producida, cantidad pendiente, ubicación y valor del trabajo en proceso."
  },
  {
    "module": "MES",
    "code": "MES-10",
    "title": "Trazabilidad operario-máquina-orden",
    "description": "Debe vincular cada registro con la orden, operación, operario, máquina, turno y lote."
  },
  {
    "module": "MES",
    "code": "MES-11",
    "title": "Turnos y relevos",
    "description": "Debe permitir gestionar turnos, relevos, traspaso de trabajo y continuidad de la operación."
  },
  {
    "module": "MES",
    "code": "MES-12",
    "title": "Alertas y gestión visual",
    "description": "Debe mostrar alertas de retraso, parada, falta de material, calidad o saturación, con escalamiento y confirmación."
  },
  {
    "module": "MES",
    "code": "MES-13",
    "title": "Calidad en línea",
    "description": "Debe permitir ejecutar controles de calidad durante la operación y bloquear el avance si el resultado no es conforme."
  },
  {
    "module": "MES",
    "code": "MES-14",
    "title": "Integración con dispositivos",
    "description": "Debe permitir capturar datos de básculas, lectores, sensores y terminales de planta cuando estén disponibles."
  },
  {
    "module": "MES",
    "code": "MES-15",
    "title": "Tableros de planta",
    "description": "Debe ofrecer tableros de avance, carga, eficiencia, paradas, calidad y WIP por centro, turno y orden."
  },
  {
    "module": "MES",
    "code": "MES-16",
    "title": "Cierre y pendientes",
    "description": "Debe permitir cerrar operaciones y órdenes, generar pendientes y consolidar la información para costos y trazabilidad."
  },
  {
    "module": "TRA",
    "code": "TRA-01",
    "title": "Identificación única",
    "description": "Debe asignar identificadores únicos a lotes, series, paquetes y órdenes, y conservarlos en todos los movimientos."
  },
  {
    "module": "TRA",
    "code": "TRA-02",
    "title": "Genealogía de materias primas",
    "description": "Debe registrar qué proveedor, lote, recepción y control de calidad originaron cada material consumido."
  },
  {
    "module": "TRA",
    "code": "TRA-03",
    "title": "Genealogía de producto terminado",
    "description": "Debe registrar qué materiales, operaciones, máquinas, operarios y controles intervinieron en cada lote o unidad producida."
  },
  {
    "module": "TRA",
    "code": "TRA-04",
    "title": "Relación orden-operación-operario-máquina",
    "description": "Debe vincular cada operación con la orden, el operario, la máquina, el turno y el tiempo real."
  },
  {
    "module": "TRA",
    "code": "TRA-05",
    "title": "Trazabilidad hacia atrás",
    "description": "Dado un producto o lote, debe reconstruir sus componentes, proveedores, recepciones y controles."
  },
  {
    "module": "TRA",
    "code": "TRA-06",
    "title": "Trazabilidad hacia adelante",
    "description": "Dado un lote o material, debe identificar a qué productos, clientes o entregas fue destinado."
  },
  {
    "module": "TRA",
    "code": "TRA-07",
    "title": "Historial de consumos",
    "description": "Debe conservar consumo real, teórico, mermas y ajustes por orden y lote."
  },
  {
    "module": "TRA",
    "code": "TRA-08",
    "title": "Historial de defectos",
    "description": "Debe vincular no conformidades, rechazos y alertas con el lote, la orden y el proceso."
  },
  {
    "module": "TRA",
    "code": "TRA-09",
    "title": "Historial de reprocesos",
    "description": "Debe registrar reprocesos, reparaciones y desensamblados, con motivo, responsable y resultado."
  },
  {
    "module": "TRA",
    "code": "TRA-10",
    "title": "Cuarentena",
    "description": "Debe permitir bloquear y ubicar lotes en cuarentena, impedir su uso y registrar la decisión de liberación o rechazo."
  },
  {
    "module": "TRA",
    "code": "TRA-11",
    "title": "Retiro de producto (recall)",
    "description": "Debe permitir iniciar un retiro, identificar el alcance, notificar a los afectados, registrar devoluciones y medir la efectividad."
  },
  {
    "module": "TRA",
    "code": "TRA-12",
    "title": "Notificaciones y comunicación",
    "description": "Debe generar avisos a calidad, producción, logística y clientes según el evento y el nivel de criticidad."
  },
  {
    "module": "TRA",
    "code": "TRA-13",
    "title": "Expediente de lote",
    "description": "Debe consolidar en una vista única toda la información del lote: origen, materiales, proceso, controles, movimientos, defectos y destino."
  },
  {
    "module": "TRA",
    "code": "TRA-14",
    "title": "Reportes y auditoría",
    "description": "Debe ofrecer reportes de trazabilidad, genealogía, consumos, retiros y evidencia para auditoría."
  },
  {
    "module": "TRA",
    "code": "TRA-15",
    "title": "Retención y archivo",
    "description": "Debe conservar la información durante el período definido por la política y permitir su consulta posterior."
  },
  {
    "module": "REN",
    "code": "REN-01",
    "title": "OEE",
    "description": "Debe calcular la efectividad global de los equipos como disponibilidad × rendimiento × calidad, con fórmulas documentadas y datos reales."
  },
  {
    "module": "REN",
    "code": "REN-02",
    "title": "Disponibilidad",
    "description": "Debe medir tiempo productivo sobre tiempo planificado, descontando paradas y esperas."
  },
  {
    "module": "REN",
    "code": "REN-03",
    "title": "Rendimiento",
    "description": "Debe comparar producción real con producción teórica según velocidad estándar y tiempo efectivo."
  },
  {
    "module": "REN",
    "code": "REN-04",
    "title": "Calidad",
    "description": "Debe medir unidades conformes sobre unidades producidas, integrando rechazos y reprocesos."
  },
  {
    "module": "REN",
    "code": "REN-05",
    "title": "Tiempo de ciclo",
    "description": "Debe medir tiempo real por unidad o lote y compararlo con el estándar."
  },
  {
    "module": "REN",
    "code": "REN-06",
    "title": "Tiempo de preparación (setup)",
    "description": "Debe registrar y analizar tiempos de preparación, cambios de producto y limpieza."
  },
  {
    "module": "REN",
    "code": "REN-07",
    "title": "Rendimiento de primera pasada (FPY)",
    "description": "Debe calcular unidades conformes a la primera sobre unidades iniciadas, sin reproceso."
  },
  {
    "module": "REN",
    "code": "REN-08",
    "title": "Tasa de desperdicio",
    "description": "Debe medir desperdicio por producto, proceso, turno y causa."
  },
  {
    "module": "REN",
    "code": "REN-09",
    "title": "Tasa de reproceso",
    "description": "Debe medir unidades reprocesadas y su impacto en tiempo y costo."
  },
  {
    "module": "REN",
    "code": "REN-10",
    "title": "Cumplimiento del plan",
    "description": "Debe comparar producción real con planificada por período, producto y centro."
  },
  {
    "module": "REN",
    "code": "REN-11",
    "title": "Análisis de paradas",
    "description": "Debe clasificar paradas por causa, duración, frecuencia y responsabilidad."
  },
  {
    "module": "REN",
    "code": "REN-12",
    "title": "Tableros y benchmarks",
    "description": "Debe ofrecer tableros por planta, centro, turno, producto y período, y comparar contra objetivos."
  },
  {
    "module": "EXC",
    "code": "EXC-01",
    "title": "No conformidades",
    "description": "Debe permitir registrar una no conformidad con producto, lote, cantidad, proceso, origen, evidencia y responsable."
  },
  {
    "module": "EXC",
    "code": "EXC-02",
    "title": "Desviaciones de receta o parámetros",
    "description": "Debe detectar y registrar desviaciones respecto a la receta, especificación o parámetro de proceso, con valor esperado y real."
  },
  {
    "module": "EXC",
    "code": "EXC-03",
    "title": "Tolerancias",
    "description": "Debe permitir definir tolerancias y evaluar automáticamente si un valor está dentro o fuera de rango."
  },
  {
    "module": "EXC",
    "code": "EXC-04",
    "title": "Bloqueo de órdenes y lotes",
    "description": "Debe permitir bloquear órdenes, operaciones o lotes hasta que la excepción se resuelva."
  },
  {
    "module": "EXC",
    "code": "EXC-05",
    "title": "Reprocesos",
    "description": "Debe permitir autorizar, registrar y costear reprocesos, con motivo y resultado."
  },
  {
    "module": "EXC",
    "code": "EXC-06",
    "title": "Desperdicio",
    "description": "Debe registrar desperdicio por causa, producto, lote y proceso."
  },
  {
    "module": "EXC",
    "code": "EXC-07",
    "title": "Análisis de causa raíz",
    "description": "Debe permitir documentar el análisis, la causa identificada y la evidencia."
  },
  {
    "module": "EXC",
    "code": "EXC-08",
    "title": "Acciones correctivas y preventivas (CAPA)",
    "description": "Debe permitir definir acciones, responsables, fechas, verificación de eficacia y cierre."
  },
  {
    "module": "EXC",
    "code": "EXC-09",
    "title": "Flujos de aprobación",
    "description": "Debe permitir aprobar excepciones, reprocesos, liberaciones y cambios con niveles y responsables definidos."
  },
  {
    "module": "EXC",
    "code": "EXC-10",
    "title": "Excepciones temporales",
    "description": "Debe permitir autorizar desviaciones temporales con vigencia, alcance y condiciones de cierre."
  },
  {
    "module": "EXC",
    "code": "EXC-11",
    "title": "Notificaciones y escalamiento",
    "description": "Debe notificar a los responsables y escalar cuando una excepción supere el tiempo o la criticidad definida."
  },
  {
    "module": "EXC",
    "code": "EXC-12",
    "title": "Reportes y auditoría",
    "description": "Debe ofrecer reportes de no conformidades, causas, acciones, reprocesos y efectividad, con trazabilidad completa."
  },
  {
    "module": "IOT",
    "code": "IOT-01",
    "title": "Conexión con PLC",
    "description": "Debe permitir intercambiar datos con controladores lógicos programables mediante protocolos industriales estándar."
  },
  {
    "module": "IOT",
    "code": "IOT-02",
    "title": "Sensores",
    "description": "Debe permitir capturar variables de temperatura, presión, humedad, vibración u otras, con marca de tiempo."
  },
  {
    "module": "IOT",
    "code": "IOT-03",
    "title": "Básculas",
    "description": "Debe permitir leer peso y asociarlo a producto, lote y operación."
  },
  {
    "module": "IOT",
    "code": "IOT-04",
    "title": "Máquinas y CNC",
    "description": "Debe permitir obtener estados, ciclos, contadores y alarmas de máquinas y centros de mecanizado."
  },
  {
    "module": "IOT",
    "code": "IOT-05",
    "title": "SCADA",
    "description": "Debe permitir intercambiar datos con sistemas de supervisión y control, respetando la jerarquía de seguridad."
  },
  {
    "module": "IOT",
    "code": "IOT-06",
    "title": "MES externo",
    "description": "Debe permitir integrarse con un MES existente para órdenes, ejecución y trazabilidad."
  },
  {
    "module": "IOT",
    "code": "IOT-07",
    "title": "Captura automática",
    "description": "Debe registrar cantidades, ciclos, temperaturas, estados y eventos sin intervención manual."
  },
  {
    "module": "IOT",
    "code": "IOT-08",
    "title": "Eventos y alarmas",
    "description": "Debe detectar eventos, generar alarmas y notificar a los responsables según reglas."
  },
  {
    "module": "IOT",
    "code": "IOT-09",
    "title": "Historiador",
    "description": "Debe almacenar variables industriales con retención, consulta y exportación."
  },
  {
    "module": "IOT",
    "code": "IOT-10",
    "title": "Seguridad",
    "description": "Debe segmentar redes, autenticar dispositivos, cifrar comunicaciones y registrar accesos."
  },
  {
    "module": "IOT",
    "code": "IOT-11",
    "title": "Monitoreo y diagnóstico",
    "description": "Debe mostrar estado de conectividad, latencia, errores y salud de los dispositivos."
  },
  {
    "module": "IOT",
    "code": "IOT-12",
    "title": "Configuración",
    "description": "Debe permitir configurar dispositivos, protocolos, variables, reglas y destinos de datos."
  },
  {
    "module": "COS",
    "code": "COS-01",
    "title": "Costo estándar",
    "description": "Debe calcular el costo estándar por producto a partir de la lista de materiales, rutas, tarifas y costos adicionales."
  },
  {
    "module": "COS",
    "code": "COS-02",
    "title": "Costo real",
    "description": "Debe calcular el costo real de cada orden con materiales consumidos, tiempos reales, tarifas y costos adicionales."
  },
  {
    "module": "COS",
    "code": "COS-03",
    "title": "Costo de materiales",
    "description": "Debe valorizar el consumo real y compararlo con el consumo teórico."
  },
  {
    "module": "COS",
    "code": "COS-04",
    "title": "Costo de mano de obra",
    "description": "Debe valorizar horas reales por operario, turno o centro."
  },
  {
    "module": "COS",
    "code": "COS-05",
    "title": "Costo de máquina",
    "description": "Debe valorizar el uso de máquinas y centros según tarifa y tiempo."
  },
  {
    "module": "COS",
    "code": "COS-06",
    "title": "Costos indirectos",
    "description": "Debe permitir distribuir costos indirectos según bases configurables (horas, consumo, unidades, valor)."
  },
  {
    "module": "COS",
    "code": "COS-07",
    "title": "Consumo previsto versus real",
    "description": "Debe mostrar diferencias de cantidad, precio y mezcla por orden y producto."
  },
  {
    "module": "COS",
    "code": "COS-08",
    "title": "Variaciones",
    "description": "Debe calcular y explicar variaciones de material, mano de obra, máquina, eficiencia y precio."
  },
  {
    "module": "COS",
    "code": "COS-09",
    "title": "Costo del desperdicio",
    "description": "Debe valorizar el desperdicio y su impacto en el costo."
  },
  {
    "module": "COS",
    "code": "COS-10",
    "title": "Costo del reproceso",
    "description": "Debe valorizar reprocesos, reparaciones y retrabajos."
  },
  {
    "module": "COS",
    "code": "COS-11",
    "title": "Costo de tiempos improductivos",
    "description": "Debe valorizar paradas, esperas y pérdidas de eficiencia."
  },
  {
    "module": "COS",
    "code": "COS-12",
    "title": "Producción en proceso (WIP)",
    "description": "Debe valorizar el trabajo en curso por orden y período."
  },
  {
    "module": "COS",
    "code": "COS-13",
    "title": "Costo por orden y lote",
    "description": "Debe consolidar el costo por orden, lote, producto y cliente."
  },
  {
    "module": "COS",
    "code": "COS-14",
    "title": "Reportes y análisis",
    "description": "Debe ofrecer reportes de costo estándar versus real, variaciones, margen, desperdicio y reproceso."
  },
  {
    "module": "TRV",
    "code": "TRV-01",
    "title": "Seguridad y roles",
    "description": "Debe permitir definir roles, permisos por módulo, función, compañía, planta y centro de costo, con segregación de funciones."
  },
  {
    "module": "TRV",
    "code": "TRV-02",
    "title": "Datos maestros",
    "description": "Debe permitir gestionar productos, unidades, categorías, proveedores, clientes, ubicaciones, recursos y centros de costo con validaciones y versionado."
  },
  {
    "module": "TRV",
    "code": "TRV-03",
    "title": "Multi-compañía y multi-planta",
    "description": "Debe permitir operar varias compañías, plantas o almacenes con datos separados y consolidación cuando corresponda."
  },
  {
    "module": "TRV",
    "code": "TRV-04",
    "title": "Multi-moneda y unidades",
    "description": "Debe soportar monedas, tipos de cambio, unidades de medida y conversiones."
  },
  {
    "module": "TRV",
    "code": "TRV-05",
    "title": "Auditoría",
    "description": "Debe registrar quién creó, modificó, aprobó o eliminó cada registro, con fecha y valor anterior."
  },
  {
    "module": "TRV",
    "code": "TRV-06",
    "title": "Notificaciones",
    "description": "Debe permitir configurar alertas, correos, actividades y escalamiento por evento."
  },
  {
    "module": "TRV",
    "code": "TRV-07",
    "title": "Reportería y analítica",
    "description": "Debe ofrecer reportes operativos, tableros e indicadores exportables."
  },
  {
    "module": "TRV",
    "code": "TRV-08",
    "title": "Integraciones y API",
    "description": "Debe permitir integraciones con otros sistemas mediante interfaces seguras y documentadas."
  },
  {
    "module": "TRV",
    "code": "TRV-09",
    "title": "Importación y exportación",
    "description": "Debe permitir cargar y extraer datos en formatos estándar con validación y registro de errores."
  },
  {
    "module": "TRV",
    "code": "TRV-10",
    "title": "Configuración",
    "description": "Debe permitir parametrizar políticas, numeraciones, umbrales, calendarios y reglas sin desarrollo."
  },
  {
    "module": "TRV",
    "code": "TRV-11",
    "title": "Movilidad y experiencia de usuario",
    "description": "Debe permitir operar en planta desde terminales o dispositivos móviles cuando el proceso lo requiera."
  },
  {
    "module": "TRV",
    "code": "TRV-12",
    "title": "Gestión documental",
    "description": "Debe permitir adjuntar, versionar y controlar documentos asociados a productos, órdenes, lotes y controles."
  },
  {
    "module": "TRV",
    "code": "TRV-13",
    "title": "Localización",
    "description": "Debe soportar idioma, moneda, impuestos y requisitos legales del país."
  },
  {
    "module": "TRV",
    "code": "TRV-14",
    "title": "Continuidad y respaldo",
    "description": "Debe permitir respaldo, recuperación y continuidad operativa según la política de la empresa."
  }
];

export const FUNCIONES_POR_MODULO: Record<string, FuncionCatalog[]> = {
  "ABT": [
    {
      "module": "ABT",
      "code": "ABT-01",
      "title": "Catálogo de productos comprables",
      "description": "El sistema debe permitir definir qué productos o servicios pueden comprarse, su unidad de medida, empaque, proveedores admitidos y política de facturación. Cada artículo debe indicar si se controla por cantidad, lote o serie, y si su recepción es obligatoria antes de facturar."
    },
    {
      "module": "ABT",
      "code": "ABT-02",
      "title": "Condiciones y tarifas de proveedor",
      "description": "Debe registrar, por proveedor y producto, el precio, la cantidad mínima, el plazo de entrega, la moneda, la vigencia, el descuento y el código o nombre que usa el proveedor. El sistema debe seleccionar automáticamente la condición vigente y prioritaria al crear una solicitud u orden."
    },
    {
      "module": "ABT",
      "code": "ABT-03",
      "title": "Gestión de proveedores",
      "description": "Debe permitir alta, modificación e inactivación de proveedores con datos fiscales, contactos, condiciones comerciales, avisos y evaluación de desempeño. La evaluación debe considerar al menos cumplimiento de entrega, calidad, precio y capacidad de respuesta."
    },
    {
      "module": "ABT",
      "code": "ABT-04",
      "title": "Solicitud de cotización",
      "description": "Debe permitir crear solicitudes con una o varias líneas, producto, cantidad, fecha requerida, lugar de entrega, condiciones de pago, moneda, impuestos y centro de costo. La solicitud debe poder enviarse a uno o varios proveedores y conservar el historial de comunicaciones."
    },
    {
      "module": "ABT",
      "code": "ABT-05",
      "title": "Generación automática de necesidades de compra",
      "description": "El sistema debe generar sugerencias de compra a partir de necesidades de inventario, consumo histórico, órdenes de producción, ventas comprometidas o planes de demanda. Cada sugerencia debe indicar origen, cantidad sugerida, fecha requerida y prioridad."
    },
    {
      "module": "ABT",
      "code": "ABT-06",
      "title": "Envío y comunicación con proveedores",
      "description": "Debe permitir enviar solicitudes y órdenes por correo, generar documentos en PDF y habilitar un portal o canal de consulta para el proveedor. Debe registrarse el envío, el acuse de recibo y cualquier respuesta o contraoferta."
    },
    {
      "module": "ABT",
      "code": "ABT-07",
      "title": "Comparación de ofertas y alternativas",
      "description": "El sistema debe permitir crear varias solicitudes para la misma necesidad, comparar precios, plazos, condiciones, calidad y desempeño de los proveedores, y seleccionar la mejor combinación por línea o por proveedor. La decisión debe quedar documentada con su justificación."
    },
    {
      "module": "ABT",
      "code": "ABT-08",
      "title": "Consolidación de solicitudes",
      "description": "Debe permitir agrupar solicitudes compatibles del mismo proveedor o de la misma necesidad para reducir el número de órdenes y mejorar la negociación."
    },
    {
      "module": "ABT",
      "code": "ABT-09",
      "title": "Acuerdos marco y plantillas",
      "description": "Debe permitir definir acuerdos de compra con precios y cantidades comprometidas por un período, así como plantillas reutilizables para pedidos recurrentes. El sistema debe controlar el consumo del acuerdo y alertar cuando se alcance el límite."
    },
    {
      "module": "ABT",
      "code": "ABT-10",
      "title": "Aprobaciones por importe y nivel",
      "description": "Debe permitir configurar niveles de aprobación por importe, categoría, centro de costo o proyecto. Toda orden que supere el umbral debe quedar pendiente de aprobación y registrar quién aprobó, cuándo y con qué observaciones."
    },
    {
      "module": "ABT",
      "code": "ABT-11",
      "title": "Confirmación de la orden",
      "description": "Al confirmar, el sistema debe generar el compromiso con el proveedor, las recepciones previstas y los movimientos de inventario correspondientes. La orden debe tener un identificador único y un estado verificable."
    },
    {
      "module": "ABT",
      "code": "ABT-12",
      "title": "Bloqueo y control de cambios",
      "description": "Debe permitir bloquear órdenes confirmadas para impedir modificaciones no autorizadas. Cualquier cambio posterior debe requerir desbloqueo, motivo y trazabilidad."
    },
    {
      "module": "ABT",
      "code": "ABT-13",
      "title": "Líneas, impuestos, descuentos y analítica",
      "description": "Cada línea debe soportar producto, descripción, cantidad, unidad, precio, descuento, impuestos, fecha prevista, centro de costo, proyecto y cuenta analítica. El sistema debe calcular subtotales, impuestos y totales con precisión."
    },
    {
      "module": "ABT",
      "code": "ABT-14",
      "title": "Recepción y seguimiento",
      "description": "Debe permitir recepciones totales o parciales, selección de ubicación, registro de lote o serie, control de calidad y generación de pendientes. La recepción debe actualizar el inventario y el estado de la orden."
    },
    {
      "module": "ABT",
      "code": "ABT-15",
      "title": "Control de cantidades y estados",
      "description": "El sistema debe mostrar, por orden y por línea, cantidad pedida, recibida, facturada, pendiente de recepción y pendiente de facturación. Los estados deben reflejar la realidad del documento y no solo una marca manual."
    },
    {
      "module": "ABT",
      "code": "ABT-16",
      "title": "Facturación y conciliación triple",
      "description": "Debe permitir generar la factura del proveedor y conciliarla con la orden y la recepción. El sistema debe detectar diferencias de cantidad, precio o impuestos y bloquear o alertar según la política definida."
    },
    {
      "module": "ABT",
      "code": "ABT-17",
      "title": "Devoluciones, cancelaciones y pendientes",
      "description": "Debe permitir devolver total o parcialmente una recepción, cancelar órdenes con las validaciones correspondientes y gestionar entregas pendientes o saldos abiertos. Toda devolución debe generar el movimiento inverso y el documento de ajuste."
    },
    {
      "module": "ABT",
      "code": "ABT-18",
      "title": "Recordatorios y seguimiento",
      "description": "Debe generar recordatorios de recepción, alertas de retraso, actividades de seguimiento y escalamiento. El comprador debe poder consultar qué órdenes están vencidas y qué acciones están pendientes."
    },
    {
      "module": "ABT",
      "code": "ABT-19",
      "title": "Compras vinculadas a producción y subcontratación",
      "description": "El sistema debe vincular la compra de componentes a órdenes de producción, kits o servicios de subcontratación. Debe informar qué material falta, para qué orden y con qué fecha límite."
    },
    {
      "module": "ABT",
      "code": "ABT-20",
      "title": "Intercambio electrónico de documentos",
      "description": "Debe permitir importar y exportar órdenes, facturas y documentos comerciales en formatos electrónicos estándar, con validación de estructura y registro de errores."
    },
    {
      "module": "ABT",
      "code": "ABT-21",
      "title": "Reportes y análisis",
      "description": "Debe ofrecer análisis de gasto por proveedor, producto, categoría, centro de costo y período; evolución de precios; cumplimiento de entrega; ahorro obtenido; órdenes abiertas y retrasos."
    },
    {
      "module": "ABT",
      "code": "ABT-22",
      "title": "Configuración y parámetros",
      "description": "Debe permitir configurar políticas de compra, umbrales de aprobación, bloqueo de órdenes, avisos, recordatorios, acuerdos, alternativas, unidades de medida, empaques y permisos."
    }
  ],
  "INV": [
    {
      "module": "INV",
      "code": "INV-01",
      "title": "Almacén",
      "description": "El sistema debe permitir definir uno o varios almacenes con su código, dirección, calendario, pasos de recepción y pasos de entrega. Cada almacén debe tener rutas por defecto y reglas de reabastecimiento."
    },
    {
      "module": "INV",
      "code": "INV-02",
      "title": "Ubicaciones",
      "description": "Debe permitir crear una jerarquía de ubicaciones con tipos: internas, virtuales, de proveedor, de cliente, de pérdidas, de producción y de tránsito. Cada ubicación debe tener código, capacidad, estrategia de retiro y, si aplica, frecuencia de inventario."
    },
    {
      "module": "INV",
      "code": "INV-03",
      "title": "Tipos de operación",
      "description": "Debe permitir configurar tipos de operación para recepciones, entregas, transferencias internas, producción y entrega directa. Cada tipo debe definir ubicaciones por defecto, numeración, política de reserva, etiquetas e impresión."
    },
    {
      "module": "INV",
      "code": "INV-04",
      "title": "Rutas de abastecimiento",
      "description": "Debe permitir definir rutas de compra, fabricación, fabricación bajo pedido, entrega directa y reabastecimiento entre almacenes. Las rutas deben poder asignarse a productos, categorías, almacenes o tipos de empaque."
    },
    {
      "module": "INV",
      "code": "INV-05",
      "title": "Reglas de abastecimiento",
      "description": "Debe permitir configurar reglas de extracción, empuje y combinación, con métodos de suministro: tomar de stock, generar otra operación o tomar de stock y generar otra operación si no hay disponibilidad. Cada regla debe tener plazo, origen, destino y tipo de operación."
    },
    {
      "module": "INV",
      "code": "INV-06",
      "title": "Reglas de ubicación",
      "description": "Debe permitir definir dónde almacenar cada producto al recibirlo, considerando producto, categoría, tipo de empaque, capacidad y sububicación."
    },
    {
      "module": "INV",
      "code": "INV-07",
      "title": "Categorías de almacenamiento",
      "description": "Debe permitir definir capacidad máxima por peso, volumen, producto o tipo de paquete, y si se permite mezclar productos en una ubicación."
    },
    {
      "module": "INV",
      "code": "INV-08",
      "title": "Tipos de paquete",
      "description": "Debe permitir definir cajas, palés y contenedores con dimensiones, peso, peso máximo, código y uso previsto. El sistema debe poder calcular el peso y validar la capacidad."
    },
    {
      "module": "INV",
      "code": "INV-09",
      "title": "Estrategias de retiro",
      "description": "Debe permitir seleccionar la existencia a retirar según FIFO, LIFO, FEFO, ubicación más cercana o menor cantidad de paquetes. La estrategia debe poder definirse por ubicación o categoría."
    },
    {
      "module": "INV",
      "code": "INV-10",
      "title": "Nomenclaturas de captura",
      "description": "Debe permitir configurar reglas de interpretación de códigos para producto, peso, ubicación, lote, paquete y contacto, con patrones, prioridades y validaciones."
    },
    {
      "module": "INV",
      "code": "INV-11",
      "title": "Recepciones",
      "description": "Debe permitir recibir total o parcialmente, seleccionar ubicación, registrar lote o serie, crear paquetes, aplicar reglas de ubicación y generar pendientes. La recepción debe actualizar existencias y estados."
    },
    {
      "module": "INV",
      "code": "INV-12",
      "title": "Entregas",
      "description": "Debe permitir reservar, preparar, empacar y entregar productos, con control de disponibilidad, documentación y trazabilidad. Debe soportar entregas parciales y pendientes."
    },
    {
      "module": "INV",
      "code": "INV-13",
      "title": "Transferencias internas",
      "description": "Debe permitir mover productos entre ubicaciones internas con origen, destino, cantidad, lote, paquete y responsable."
    },
    {
      "module": "INV",
      "code": "INV-14",
      "title": "Transferencias agrupadas",
      "description": "Debe permitir agrupar varias transferencias para prepararlas y ejecutarlas en conjunto, asignar un responsable y controlar su avance."
    },
    {
      "module": "INV",
      "code": "INV-15",
      "title": "Reserva y disponibilidad",
      "description": "Debe permitir reservar existencias al confirmar, antes de la fecha programada o de forma manual. El sistema debe mostrar cantidad física, reservada, disponible y comprometida."
    },
    {
      "module": "INV",
      "code": "INV-16",
      "title": "Pendientes y entregas parciales",
      "description": "Cuando no se atienda toda la cantidad, el sistema debe generar un pendiente con la demanda restante y conservar la trazabilidad con el documento original."
    },
    {
      "module": "INV",
      "code": "INV-17",
      "title": "Devoluciones e intercambios",
      "description": "Debe permitir devolver total o parcialmente una entrega o recepción, generar el movimiento inverso y, si corresponde, crear una nueva entrega de intercambio."
    },
    {
      "module": "INV",
      "code": "INV-18",
      "title": "División de transferencias",
      "description": "Debe permitir separar una transferencia en varias para atender prioridades, clientes o fechas distintas."
    },
    {
      "module": "INV",
      "code": "INV-19",
      "title": "Paquetes",
      "description": "Debe permitir crear paquetes, asignar contenido, mover paquetes completos, anidar contenedores, imprimir etiquetas y consultar su historial."
    },
    {
      "module": "INV",
      "code": "INV-20",
      "title": "Operaciones detalladas",
      "description": "Cada movimiento debe poder registrarse con producto, cantidad, unidad, ubicación de origen y destino, lote o serie, paquete y propietario."
    },
    {
      "module": "INV",
      "code": "INV-21",
      "title": "Etiquetas e impresión",
      "description": "Debe permitir imprimir etiquetas de producto, lote, serie, paquete y ubicación, además de albaranes e informes de recepción. La impresión debe poder automatizarse por tipo de operación."
    },
    {
      "module": "INV",
      "code": "INV-22",
      "title": "Existencias por ubicación",
      "description": "El sistema debe mostrar la existencia física, reservada y disponible por producto, ubicación, lote, paquete y propietario."
    },
    {
      "module": "INV",
      "code": "INV-23",
      "title": "Inventario físico",
      "description": "Debe permitir contar existencias, ingresar la cantidad contada, calcular la diferencia, aplicar el ajuste y conservar el historial."
    },
    {
      "module": "INV",
      "code": "INV-24",
      "title": "Inventario cíclico",
      "description": "Debe permitir programar conteos periódicos por ubicación, calcular la próxima fecha y asignar la fecha a las existencias. Debe existir un inventario anual de respaldo para ubicaciones sin frecuencia."
    },
    {
      "module": "INV",
      "code": "INV-25",
      "title": "Reubicación",
      "description": "Debe permitir mover existencia de una ubicación a otra sin crear una transferencia formal, registrando el motivo y el responsable."
    },
    {
      "module": "INV",
      "code": "INV-26",
      "title": "Desecho",
      "description": "Debe permitir retirar material dañado, obsoleto o no conforme, indicando producto, cantidad, lote, motivo y si corresponde reponerlo."
    },
    {
      "module": "INV",
      "code": "INV-27",
      "title": "Valoración",
      "description": "Debe permitir valorar el inventario por costo estándar, costo promedio ponderado o FIFO, con posibilidad de valoración por lote. Debe generar los asientos contables correspondientes y permitir ajustes de valoración."
    },
    {
      "module": "INV",
      "code": "INV-28",
      "title": "Costos de importación",
      "description": "Debe permitir incorporar fletes, seguros, aranceles y otros costos al valor de los productos recibidos, con reparto por igual, cantidad, costo actual, peso o volumen."
    },
    {
      "module": "INV",
      "code": "INV-29",
      "title": "Entrega directa",
      "description": "Debe permitir que un proveedor entregue directamente al cliente sin pasar por el almacén, generando la documentación y la trazabilidad correspondientes."
    },
    {
      "module": "INV",
      "code": "INV-30",
      "title": "Consignación",
      "description": "Debe permitir controlar existencias de propiedad de terceros, separarlas de las propias y reportar por propietario."
    },
    {
      "module": "INV",
      "code": "INV-31",
      "title": "Lotes y números de serie",
      "description": "Debe permitir identificar productos por lote o número de serie, asignarlos en recepción, transferencia y producción, y consultar su existencia y movimientos."
    },
    {
      "module": "INV",
      "code": "INV-32",
      "title": "Fechas de caducidad",
      "description": "Debe permitir registrar fecha de caducidad, consumo preferente, retirada y alerta, y emitir avisos antes del vencimiento."
    },
    {
      "module": "INV",
      "code": "INV-33",
      "title": "FEFO",
      "description": "Debe permitir retirar primero el lote con fecha de retirada más próxima, cuando la estrategia esté configurada."
    },
    {
      "module": "INV",
      "code": "INV-34",
      "title": "Reporte de trazabilidad",
      "description": "Debe reconstruir la historia de un lote o serie hacia atrás y hacia adelante, mostrando movimientos, documentos, proveedores y clientes."
    },
    {
      "module": "INV",
      "code": "INV-35",
      "title": "Referencias documentales",
      "description": "Debe permitir agrupar movimientos de distintos documentos bajo una referencia común para auditoría y seguimiento."
    },
    {
      "module": "INV",
      "code": "INV-36",
      "title": "Puntos de pedido",
      "description": "Debe permitir definir mínimo, máximo, consumo diario, plazo, ruta y cantidad a pedir por producto y ubicación. El sistema debe calcular la necesidad y generar sugerencias."
    },
    {
      "module": "INV",
      "code": "INV-37",
      "title": "Informe de reabastecimiento",
      "description": "Debe mostrar productos bajo mínimo, cantidad sugerida, origen de la necesidad y acción recomendada (comprar, fabricar o transferir)."
    },
    {
      "module": "INV",
      "code": "INV-38",
      "title": "Previsión de existencias",
      "description": "Debe proyectar entradas, salidas y stock futuro por fecha, y alertar sobre faltantes o excesos."
    },
    {
      "module": "INV",
      "code": "INV-39",
      "title": "Reabastecimiento entre almacenes",
      "description": "Debe permitir abastecer un almacén desde otro mediante rutas y transferencias automáticas."
    },
    {
      "module": "INV",
      "code": "INV-40",
      "title": "Producción o compra bajo pedido",
      "description": "Debe permitir que una necesidad concreta dispare una compra o una orden de producción sin tomar stock disponible."
    },
    {
      "module": "INV",
      "code": "INV-41",
      "title": "Análisis de movimientos",
      "description": "Debe permitir analizar entradas y salidas por producto, ubicación, fecha, documento, lote y responsable."
    },
    {
      "module": "INV",
      "code": "INV-42",
      "title": "Stock por ubicación",
      "description": "Debe mostrar existencias detalladas con filtros por producto, ubicación, lote, paquete y propietario."
    },
    {
      "module": "INV",
      "code": "INV-43",
      "title": "Valoración del inventario",
      "description": "Debe mostrar el valor por producto, categoría, ubicación y período, y permitir exportar la información contable."
    },
    {
      "module": "INV",
      "code": "INV-44",
      "title": "Trazabilidad",
      "description": "Debe permitir consultar el historial completo de un lote o serie y exportarlo para auditoría."
    }
  ],
  "PRD": [
    {
      "module": "PRD",
      "code": "PRD-01",
      "title": "Lista de materiales normal",
      "description": "Debe permitir definir los componentes y cantidades necesarios para fabricar un producto, con unidad de medida, merma, operación de consumo, subproductos, plazos y observaciones."
    },
    {
      "module": "PRD",
      "code": "PRD-02",
      "title": "Lista de materiales tipo kit",
      "description": "Debe permitir definir productos compuestos que se explotan en componentes sin generar una orden de fabricación propia."
    },
    {
      "module": "PRD",
      "code": "PRD-03",
      "title": "Lista de materiales multinivel",
      "description": "Debe permitir que un componente tenga su propia lista de materiales y que el sistema explote la estructura completa, generando órdenes hijas cuando corresponda."
    },
    {
      "module": "PRD",
      "code": "PRD-04",
      "title": "Componentes y variantes",
      "description": "Debe permitir definir componentes por variante de producto, componentes opcionales, cantidades variables y componentes asignados a una operación específica."
    },
    {
      "module": "PRD",
      "code": "PRD-05",
      "title": "Subproductos",
      "description": "Debe permitir registrar productos adicionales generados en el proceso, con cantidad, unidad, operación y participación en el costo."
    },
    {
      "module": "PRD",
      "code": "PRD-06",
      "title": "Operaciones y rutas",
      "description": "Debe permitir definir la secuencia de operaciones, centro de trabajo, duración fija o calculada, tiempo de preparación, tiempo de ciclo, limpieza y costo."
    },
    {
      "module": "PRD",
      "code": "PRD-07",
      "title": "Dependencias entre operaciones",
      "description": "Debe permitir indicar qué operación debe terminar antes de iniciar otra, validando ciclos y respetando la secuencia."
    },
    {
      "module": "PRD",
      "code": "PRD-08",
      "title": "Tamaño de lote y producción continua",
      "description": "Debe permitir definir el tamaño de lote y, si aplica, desbloquear automáticamente la siguiente operación al registrar producción."
    },
    {
      "module": "PRD",
      "code": "PRD-09",
      "title": "Plazos y preparación",
      "description": "Debe permitir definir el plazo de fabricación, los días de preparación y la condición para iniciar: con todos los componentes o con los de la primera operación."
    },
    {
      "module": "PRD",
      "code": "PRD-10",
      "title": "Creación de órdenes",
      "description": "Debe permitir crear órdenes manualmente o a partir de una necesidad de stock, venta, plan maestro, subensamble o subcontratación."
    },
    {
      "module": "PRD",
      "code": "PRD-11",
      "title": "Confirmación",
      "description": "Al confirmar, el sistema debe explotar la lista de materiales, generar la demanda de componentes, crear los movimientos de producto terminado y disparar el abastecimiento."
    },
    {
      "module": "PRD",
      "code": "PRD-12",
      "title": "Reserva y disponibilidad",
      "description": "Debe permitir reservar componentes, liberar reservas y mostrar si la orden está lista, esperando material o esperando otra operación."
    },
    {
      "module": "PRD",
      "code": "PRD-13",
      "title": "Capacidad de producción",
      "description": "Debe calcular cuánto se puede producir con el stock actual de componentes y mostrar las restricciones."
    },
    {
      "module": "PRD",
      "code": "PRD-14",
      "title": "Registro de producción",
      "description": "Debe permitir registrar cantidad producida, lote o serie, subproductos, mermas y movimientos de terminado."
    },
    {
      "module": "PRD",
      "code": "PRD-15",
      "title": "Consumo y advertencias",
      "description": "Debe comparar consumo real con teórico, alertar diferencias y permitir su justificación o ajuste según permisos."
    },
    {
      "module": "PRD",
      "code": "PRD-16",
      "title": "Pendientes y producción parcial",
      "description": "Debe permitir cerrar una orden con cantidad menor y generar un pendiente con la demanda restante."
    },
    {
      "module": "PRD",
      "code": "PRD-17",
      "title": "División y fusión de órdenes",
      "description": "Debe permitir separar o unir órdenes compatibles para ajustar la planificación."
    },
    {
      "module": "PRD",
      "code": "PRD-18",
      "title": "Bloqueo de cantidades",
      "description": "Debe permitir bloquear cantidades para impedir cambios durante la ejecución y requerir autorización para modificarlas."
    },
    {
      "module": "PRD",
      "code": "PRD-19",
      "title": "Desecho",
      "description": "Debe permitir desechar componentes o producto terminado con motivo, cantidad y responsable."
    },
    {
      "module": "PRD",
      "code": "PRD-20",
      "title": "Cierre",
      "description": "Debe permitir finalizar la orden, consolidar consumo y producción, calcular costos y generar el pendiente si corresponde."
    },
    {
      "module": "PRD",
      "code": "PRD-21",
      "title": "Desensamblado",
      "description": "Debe permitir descomponer un producto terminado en sus componentes, recuperando stock y trazabilidad."
    },
    {
      "module": "PRD",
      "code": "PRD-22",
      "title": "Órdenes de trabajo",
      "description": "Debe permitir crear una orden por operación, asignarla a un centro y a un responsable, y controlar su estado: bloqueada, por hacer, en progreso, hecha o cancelada."
    },
    {
      "module": "PRD",
      "code": "PRD-23",
      "title": "Centros de trabajo",
      "description": "Debe permitir definir máquinas, celdas o recursos con calendario, eficiencia, costo por hora, tiempos de preparación y limpieza, capacidad y etiquetas."
    },
    {
      "module": "PRD",
      "code": "PRD-24",
      "title": "Capacidad por producto",
      "description": "Debe permitir definir cuántas piezas se procesan por ciclo según producto o unidad, con tiempos de inicio y fin."
    },
    {
      "module": "PRD",
      "code": "PRD-25",
      "title": "Tiempos y productividad",
      "description": "Debe registrar inicio, pausa, reanudación y fin de cada operación, con usuario, duración real y duración esperada."
    },
    {
      "module": "PRD",
      "code": "PRD-26",
      "title": "Pérdidas y eficiencia",
      "description": "Debe permitir registrar paradas y pérdidas por disponibilidad, rendimiento, calidad o tiempo productivo, y calcular indicadores de eficiencia."
    },
    {
      "module": "PRD",
      "code": "PRD-27",
      "title": "Dependencias y bloqueos",
      "description": "Debe permitir bloquear una orden de trabajo hasta que termine su predecesora y desbloquearla automáticamente."
    },
    {
      "module": "PRD",
      "code": "PRD-28",
      "title": "Centros alternativos",
      "description": "Debe permitir sustituir un centro por otro cuando haya saturación, mantenimiento o avería."
    },
    {
      "module": "PRD",
      "code": "PRD-29",
      "title": "Fechas y calendario",
      "description": "Debe permitir programar inicio, fin y fecha límite, visualizar las órdenes en calendario y alertar retrasos."
    },
    {
      "module": "PRD",
      "code": "PRD-30",
      "title": "Planificación de capacidad",
      "description": "Debe mostrar la carga por centro, las órdenes listas, en progreso, bloqueadas y retrasadas, y permitir ajustar la programación."
    },
    {
      "module": "PRD",
      "code": "PRD-31",
      "title": "Necesidades de componentes",
      "description": "Debe calcular faltantes, fechas esperadas de llegada y acciones de compra o fabricación."
    },
    {
      "module": "PRD",
      "code": "PRD-32",
      "title": "Reabastecimiento",
      "description": "Debe generar compras u órdenes de fabricación según puntos de pedido, rutas y prioridades."
    },
    {
      "module": "PRD",
      "code": "PRD-33",
      "title": "Costo de la orden",
      "description": "Debe calcular el costo de materiales, operaciones, costos adicionales y subproductos, y registrar el valor del producto terminado."
    },
    {
      "module": "PRD",
      "code": "PRD-34",
      "title": "Costo de operaciones",
      "description": "Debe valorizar el tiempo real o estimado de cada operación según la tarifa del centro."
    },
    {
      "module": "PRD",
      "code": "PRD-35",
      "title": "Distribución analítica",
      "description": "Debe permitir imputar costos a centros de costo, proyectos o cuentas analíticas."
    },
    {
      "module": "PRD",
      "code": "PRD-36",
      "title": "Producción en proceso (WIP)",
      "description": "Debe permitir contabilizar el trabajo en curso y consultar su valor por orden o período."
    },
    {
      "module": "PRD",
      "code": "PRD-37",
      "title": "Subcontratación",
      "description": "Debe permitir delegar total o parcialmente la fabricación, enviar componentes al subcontratista, recibir el producto terminado y controlar costos y trazabilidad."
    },
    {
      "module": "PRD",
      "code": "PRD-38",
      "title": "Reparación",
      "description": "Debe permitir crear órdenes de reparación con producto, lote, piezas, servicios, movimientos de stock, facturación y vínculo con producción."
    },
    {
      "module": "PRD",
      "code": "PRD-39",
      "title": "Compras para producción",
      "description": "Debe permitir comprar componentes y kits para una orden de fabricación, con vínculo entre necesidad, compra y consumo."
    },
    {
      "module": "PRD",
      "code": "PRD-40",
      "title": "Reportes de producción",
      "description": "Debe ofrecer análisis de órdenes, operaciones, eficiencia, pérdidas, estructura de materiales, consumo, producción y cumplimiento."
    },
    {
      "module": "PRD",
      "code": "PRD-41",
      "title": "Configuración",
      "description": "Debe permitir activar órdenes de trabajo, subproductos, desbloqueo de cantidades, subcontratación y parámetros de planificación y costeo."
    }
  ],
  "CAL": [
    {
      "module": "CAL",
      "code": "CAL-01",
      "title": "Puntos de control",
      "description": "Debe permitir definir qué producto, operación o tipo de movimiento debe inspeccionarse, con qué frecuencia, por qué equipo y con qué instrucciones."
    },
    {
      "module": "CAL",
      "code": "CAL-02",
      "title": "Tipos de control",
      "description": "Debe permitir controles de instrucciones, aprobado/rechazado, medición numérica y formularios o hojas de trabajo."
    },
    {
      "module": "CAL",
      "code": "CAL-03",
      "title": "Criterios de aceptación",
      "description": "Debe permitir definir valores mínimos, máximos, tolerancias, unidades y valores predefinidos para aprobar o rechazar."
    },
    {
      "module": "CAL",
      "code": "CAL-04",
      "title": "Controles en recepción",
      "description": "Debe generar controles al recibir mercancía, permitir aprobar, rechazar o medir, y bloquear el ingreso si el resultado no es conforme."
    },
    {
      "module": "CAL",
      "code": "CAL-05",
      "title": "Controles en entrega y transferencia",
      "description": "Debe permitir verificar producto, cantidad, empaque, etiquetado o documentación antes de la salida."
    },
    {
      "module": "CAL",
      "code": "CAL-06",
      "title": "Controles en producción",
      "description": "Debe permitir controles por operación, primera pieza, proceso o producto final, bloqueando la operación hasta el resultado."
    },
    {
      "module": "CAL",
      "code": "CAL-07",
      "title": "Hojas de trabajo",
      "description": "Debe permitir formularios configurables con secciones, campos, firmas, fotos y documentos adjuntos."
    },
    {
      "module": "CAL",
      "code": "CAL-08",
      "title": "Ejecución de controles",
      "description": "Debe mostrar los controles pendientes, las instrucciones, el formulario, el responsable y la evidencia."
    },
    {
      "module": "CAL",
      "code": "CAL-09",
      "title": "Resultado y bloqueo",
      "description": "Debe registrar aprobado, rechazado o fuera de tolerancia, y bloquear la operación, lote o documento cuando corresponda."
    },
    {
      "module": "CAL",
      "code": "CAL-10",
      "title": "Alertas de calidad",
      "description": "Debe permitir crear alertas por no conformidad con producto, lote, cantidad, origen, prioridad, causa y acción."
    },
    {
      "module": "CAL",
      "code": "CAL-11",
      "title": "Etapas de alerta",
      "description": "Debe permitir configurar un flujo de etapas, responsables, transiciones y fechas para gestionar la alerta."
    },
    {
      "module": "CAL",
      "code": "CAL-12",
      "title": "Equipos de calidad",
      "description": "Debe permitir definir equipos, miembros, responsables y asignación de puntos de control y alertas."
    },
    {
      "module": "CAL",
      "code": "CAL-13",
      "title": "Causa raíz y acciones",
      "description": "Debe permitir documentar el análisis de causa, la acción inmediata, la acción correctiva, la acción preventiva y la verificación de eficacia."
    },
    {
      "module": "CAL",
      "code": "CAL-14",
      "title": "Trazabilidad de la inspección",
      "description": "Debe vincular cada control con producto, lote, orden, operación, responsable, fecha y evidencia."
    },
    {
      "module": "CAL",
      "code": "CAL-15",
      "title": "Reportes",
      "description": "Debe ofrecer controles por producto, tasa de aprobación y rechazo, alertas por etapa, defectos por causa y evolución temporal."
    },
    {
      "module": "CAL",
      "code": "CAL-16",
      "title": "Configuración",
      "description": "Debe permitir activar el módulo, definir equipos, etapas, puntos de control, tipos de control y criterios."
    },
    {
      "module": "CAL",
      "code": "CAL-17",
      "title": "Integraciones",
      "description": "Debe integrarse con inventario, producción, mantenimiento, documentos y captura por escáner."
    },
    {
      "module": "CAL",
      "code": "CAL-18",
      "title": "Gestión documental",
      "description": "Debe permitir adjuntar especificaciones, planos, certificados y evidencias a controles, alertas y lotes."
    }
  ],
  "MNT": [
    {
      "module": "MNT",
      "code": "MNT-01",
      "title": "Ficha de equipo",
      "description": "Debe permitir registrar nombre, categoría, propietario, responsable, proveedor, modelo, número de serie, costo, garantía, fecha de asignación, fecha de baja, ubicación y observaciones."
    },
    {
      "module": "MNT",
      "code": "MNT-02",
      "title": "Categorías de equipo",
      "description": "Debe permitir agrupar equipos, definir responsable por defecto y propiedades personalizadas."
    },
    {
      "module": "MNT",
      "code": "MNT-03",
      "title": "Equipos de mantenimiento",
      "description": "Debe permitir definir equipos de trabajo, miembros, correo de recepción de solicitudes y carga de trabajo."
    },
    {
      "module": "MNT",
      "code": "MNT-04",
      "title": "Etapas",
      "description": "Debe permitir configurar un flujo visual de etapas para las solicitudes."
    },
    {
      "module": "MNT",
      "code": "MNT-05",
      "title": "Solicitudes",
      "description": "Debe permitir crear solicitudes con equipo obligatorio, tipo, prioridad, responsable, fecha, descripción, instrucciones y propiedades."
    },
    {
      "module": "MNT",
      "code": "MNT-06",
      "title": "Mantenimiento correctivo",
      "description": "Debe permitir registrar fallas no planificadas, diagnosticar, reparar, documentar y cerrar."
    },
    {
      "module": "MNT",
      "code": "MNT-07",
      "title": "Mantenimiento preventivo",
      "description": "Debe permitir planificar trabajos periódicos, asignar recursos y registrar su ejecución."
    },
    {
      "module": "MNT",
      "code": "MNT-08",
      "title": "Recurrencia",
      "description": "Debe permitir definir intervalos en días, semanas, meses o años, con duración indefinida o hasta una fecha, generando la siguiente solicitud."
    },
    {
      "module": "MNT",
      "code": "MNT-09",
      "title": "Programación",
      "description": "Debe permitir definir fecha y hora planificada, fin previsto, duración y fecha real de cierre, con vista de calendario."
    },
    {
      "module": "MNT",
      "code": "MNT-10",
      "title": "Tablero visual",
      "description": "Debe permitir gestionar solicitudes por etapa, prioridad, responsable y equipo mediante un tablero."
    },
    {
      "module": "MNT",
      "code": "MNT-11",
      "title": "Prioridad y asignación",
      "description": "Debe permitir priorizar y asignar técnicos, equipos y responsables."
    },
    {
      "module": "MNT",
      "code": "MNT-12",
      "title": "Instrucciones y notas",
      "description": "Debe permitir documentar instrucciones de trabajo, observaciones y adjuntos."
    },
    {
      "module": "MNT",
      "code": "MNT-13",
      "title": "Cierre, cancelación y reapertura",
      "description": "Debe permitir cerrar, cancelar y reabrir solicitudes, conservando el historial y deteniendo o reactivando la recurrencia."
    },
    {
      "module": "MNT",
      "code": "MNT-14",
      "title": "MTBF y MTTR",
      "description": "Debe calcular tiempo medio entre fallas, tiempo medio de reparación, última falla y próximo fallo estimado."
    },
    {
      "module": "MNT",
      "code": "MNT-15",
      "title": "Asignación y ubicación",
      "description": "Debe permitir indicar quién usa el equipo y dónde está ubicado, incluyendo equipos por ubicación."
    },
    {
      "module": "MNT",
      "code": "MNT-16",
      "title": "Garantía y costo",
      "description": "Debe registrar costo, proveedor, vencimiento de garantía y fecha de baja."
    },
    {
      "module": "MNT",
      "code": "MNT-17",
      "title": "Propiedades personalizadas",
      "description": "Debe permitir definir campos adicionales por categoría de equipo y por solicitud."
    },
    {
      "module": "MNT",
      "code": "MNT-18",
      "title": "Dashboard",
      "description": "Debe mostrar solicitudes pendientes, programadas, prioritarias, con cambios solicitados y sin programar."
    },
    {
      "module": "MNT",
      "code": "MNT-19",
      "title": "Reportes",
      "description": "Debe analizar solicitudes por equipo, técnico, etapa, tipo y período."
    },
    {
      "module": "MNT",
      "code": "MNT-20",
      "title": "Integración con inventario",
      "description": "Debe vincular equipos con ubicaciones, lotes y números de serie, y permitir consultar equipos por ubicación."
    },
    {
      "module": "MNT",
      "code": "MNT-21",
      "title": "Integración con reparaciones",
      "description": "Debe permitir crear órdenes de reparación con piezas, servicios, movimientos de stock y facturación."
    },
    {
      "module": "MNT",
      "code": "MNT-22",
      "title": "Configuración",
      "description": "Debe permitir configurar equipos, categorías, etapas, alias de correo y permisos."
    },
    {
      "module": "MNT",
      "code": "MNT-23",
      "title": "Gestión de repuestos",
      "description": "Debe permitir consultar y reservar repuestos del inventario para una solicitud o reparación, dejando trazabilidad del consumo."
    }
  ],
  "PLM": [
    {
      "module": "PLM",
      "code": "PLM-01",
      "title": "Orden de cambio de ingeniería",
      "description": "Debe permitir crear un documento de cambio con tipo, producto, lista de materiales, etapa, responsable, prioridad, motivo, alcance y fechas."
    },
    {
      "module": "PLM",
      "code": "PLM-02",
      "title": "Tipos de cambio",
      "description": "Debe permitir clasificar los cambios (producto, materiales, operaciones, documentación) y aplicar reglas distintas según el tipo."
    },
    {
      "module": "PLM",
      "code": "PLM-03",
      "title": "Etapas del cambio",
      "description": "Debe permitir configurar un flujo de etapas, responsables y criterios de avance."
    },
    {
      "module": "PLM",
      "code": "PLM-04",
      "title": "Aprobaciones",
      "description": "Debe permitir aprobar o rechazar un cambio, registrar usuario, fecha y comentarios, y exigir aprobación antes de aplicar."
    },
    {
      "module": "PLM",
      "code": "PLM-05",
      "title": "Versiones de lista de materiales",
      "description": "Debe permitir crear una nueva versión al aplicar el cambio, conservando la anterior y asociándola al documento de cambio."
    },
    {
      "module": "PLM",
      "code": "PLM-06",
      "title": "Revisiones",
      "description": "Debe mantener el historial de revisiones con fecha, responsable y cambios realizados."
    },
    {
      "module": "PLM",
      "code": "PLM-07",
      "title": "Cambios en componentes",
      "description": "Debe permitir agregar, quitar o modificar componentes, cantidades, unidades, variantes y subproductos."
    },
    {
      "module": "PLM",
      "code": "PLM-08",
      "title": "Cambios en operaciones",
      "description": "Debe permitir agregar, quitar o modificar operaciones, centros, tiempos, dependencias e instrucciones."
    },
    {
      "module": "PLM",
      "code": "PLM-09",
      "title": "Fechas de efectividad",
      "description": "Debe permitir definir desde y hasta cuándo aplica una versión, y seleccionar la versión vigente según la fecha de producción."
    },
    {
      "module": "PLM",
      "code": "PLM-10",
      "title": "Archivo de versiones",
      "description": "Debe conservar versiones anteriores, permitir consultarlas y reactivarlas de forma controlada."
    },
    {
      "module": "PLM",
      "code": "PLM-11",
      "title": "Análisis de impacto",
      "description": "Debe identificar listas de materiales, órdenes y productos afectados, y estimar el impacto del cambio."
    },
    {
      "module": "PLM",
      "code": "PLM-12",
      "title": "Gestión documental",
      "description": "Debe permitir adjuntar planos, especificaciones, certificados y evidencias, con control de versiones y acceso."
    },
    {
      "module": "PLM",
      "code": "PLM-13",
      "title": "Trazabilidad y auditoría",
      "description": "Debe registrar quién creó, revisó, aprobó y aplicó cada cambio, con fecha y versión resultante."
    },
    {
      "module": "PLM",
      "code": "PLM-14",
      "title": "Reportes",
      "description": "Debe analizar cambios por etapa, tipo, responsable, producto y tiempo de ciclo."
    },
    {
      "module": "PLM",
      "code": "PLM-15",
      "title": "Configuración",
      "description": "Debe permitir configurar tipos, etapas, secuencias, permisos y reglas de efectividad."
    },
    {
      "module": "PLM",
      "code": "PLM-16",
      "title": "Integración con producción y compras",
      "description": "Debe asegurar que producción y compras usen la versión vigente y alertar si una orden abierta queda afectada por un cambio."
    }
  ],
  "CAP": [
    {
      "module": "CAP",
      "code": "CAP-01",
      "title": "Nomenclatura",
      "description": "Debe permitir definir conjuntos de reglas para interpretar códigos, con conversión de formatos y asignación por compañía o planta."
    },
    {
      "module": "CAP",
      "code": "CAP-02",
      "title": "Reglas",
      "description": "Debe permitir definir nombre, prioridad, formato, tipo, patrón y alias de cada regla."
    },
    {
      "module": "CAP",
      "code": "CAP-03",
      "title": "Tipos de código",
      "description": "Debe soportar producto, peso, ubicación, lote, serie, paquete y contacto; y tipos GS1 como cantidad, fecha, ubicación destino y tipo de paquete."
    },
    {
      "module": "CAP",
      "code": "CAP-04",
      "title": "Interpretación",
      "description": "Debe convertir el código en tipo, valor, código base y formato, e informar error si no coincide con ninguna regla."
    },
    {
      "module": "CAP",
      "code": "CAP-05",
      "title": "GS1",
      "description": "Debe interpretar GS1-128, separadores, identificadores de aplicación, fechas, medidas y identificadores únicos."
    },
    {
      "module": "CAP",
      "code": "CAP-06",
      "title": "Código de producto",
      "description": "Debe permitir asignar y buscar productos por código, validando formato y unicidad."
    },
    {
      "module": "CAP",
      "code": "CAP-07",
      "title": "Código de ubicación",
      "description": "Debe permitir asignar y buscar ubicaciones por código único."
    },
    {
      "module": "CAP",
      "code": "CAP-08",
      "title": "Código de lote o serie",
      "description": "Debe permitir identificar y buscar lotes y números de serie."
    },
    {
      "module": "CAP",
      "code": "CAP-09",
      "title": "Código de paquete",
      "description": "Debe permitir identificar paquetes y validar el formato SSCC."
    },
    {
      "module": "CAP",
      "code": "CAP-10",
      "title": "Código de contacto",
      "description": "Debe permitir identificar proveedores y clientes por código."
    },
    {
      "module": "CAP",
      "code": "CAP-11",
      "title": "Validación de formatos",
      "description": "Debe validar EAN, GTIN, SSCC y dígito de control."
    },
    {
      "module": "CAP",
      "code": "CAP-12",
      "title": "Recepción por escáner",
      "description": "Debe permitir seleccionar la recepción, escanear producto, cantidad, lote y ubicación, y validar."
    },
    {
      "module": "CAP",
      "code": "CAP-13",
      "title": "Transferencias por escáner",
      "description": "Debe permitir escanear origen, destino, producto, lote y paquete, y validar el movimiento."
    },
    {
      "module": "CAP",
      "code": "CAP-14",
      "title": "Entregas y preparación por escáner",
      "description": "Debe permitir preparar pedidos, escanear producto y paquete, confirmar cantidades y validar."
    },
    {
      "module": "CAP",
      "code": "CAP-15",
      "title": "Conteo por escáner",
      "description": "Debe permitir escanear ubicación y producto, ingresar cantidad contada y aplicar el ajuste."
    },
    {
      "module": "CAP",
      "code": "CAP-16",
      "title": "Paquetes por escáner",
      "description": "Debe permitir crear, asignar, mover, anidar e imprimir paquetes."
    },
    {
      "module": "CAP",
      "code": "CAP-17",
      "title": "Lotes y series por escáner",
      "description": "Debe permitir escanear o crear lotes y series durante la operación."
    },
    {
      "module": "CAP",
      "code": "CAP-18",
      "title": "Fabricación por escáner",
      "description": "Debe permitir seleccionar la orden, escanear componentes, registrar consumo y producción, y cerrar la operación."
    },
    {
      "module": "CAP",
      "code": "CAP-19",
      "title": "Etiquetas",
      "description": "Debe permitir imprimir etiquetas de producto, lote, serie, paquete y ubicación, con formatos configurables."
    },
    {
      "module": "CAP",
      "code": "CAP-20",
      "title": "Configuración",
      "description": "Debe permitir configurar nomenclaturas, reglas, GS1, operaciones, impresión y dispositivos."
    }
  ],
  "PLA": [
    {
      "module": "PLA",
      "code": "PLA-01",
      "title": "Plan maestro de producción (MPS)",
      "description": "Debe permitir construir un plan de producción a partir de la previsión de demanda, pedidos confirmados y stock objetivo, con horizontes y períodos configurables. El plan debe generar sugerencias de fabricación y compra, y permitir su aprobación y versionado."
    },
    {
      "module": "PLA",
      "code": "PLA-02",
      "title": "Planificación de necesidades de materiales (MRP)",
      "description": "Debe calcular las necesidades netas de materiales a partir de la explosión de listas de materiales, el stock disponible, las recepciones previstas, el stock de seguridad y los plazos. Debe mostrar el origen de cada necesidad y su vínculo con la orden que la genera."
    },
    {
      "module": "PLA",
      "code": "PLA-03",
      "title": "Separación entre materiales y capacidad",
      "description": "El sistema debe calcular primero las necesidades de materiales y después programar la capacidad. Ambos resultados deben poder compararse y reconciliarse, informando si el plan es viable en materiales, en capacidad o en ambos."
    },
    {
      "module": "PLA",
      "code": "PLA-04",
      "title": "Capacidad finita por máquina y centro de trabajo",
      "description": "Debe permitir programar órdenes considerando calendarios, turnos, eficiencia, tiempos de preparación, capacidad por producto y disponibilidad de centros alternativos. La programación debe respetar la capacidad finita y alertar cuando no sea posible."
    },
    {
      "module": "PLA",
      "code": "PLA-05",
      "title": "Secuenciación y priorización de órdenes",
      "description": "Debe permitir ordenar las operaciones según prioridad, fecha de entrega, dependencia, minimización de preparación, restricciones de máquina y reglas configurables. El planificador debe poder bloquear una secuencia y evitar su reprogramación automática."
    },
    {
      "module": "PLA",
      "code": "PLA-06",
      "title": "Simulación de escenarios",
      "description": "Debe permitir crear escenarios con cambios de demanda, capacidad, turnos, retrasos o disponibilidad de materiales, comparar sus indicadores y guardar la versión elegida sin afectar el plan vigente."
    },
    {
      "module": "PLA",
      "code": "PLA-07",
      "title": "Replanificación ante retrasos",
      "description": "Ante un retraso de material, una avería o una orden prioritaria, el sistema debe recalcular el plan, propagar el impacto a las órdenes afectadas, proponer alternativas y alertar a los responsables."
    },
    {
      "module": "PLA",
      "code": "PLA-08",
      "title": "Identificación de cuellos de botella",
      "description": "Debe comparar carga contra capacidad por centro y período, identificar recursos saturados, colas y órdenes retrasadas, y señalar el recurso que limita el plan."
    },
    {
      "module": "PLA",
      "code": "PLA-09",
      "title": "Fechas de entrega y compromiso",
      "description": "Debe calcular fechas de entrega realistas a partir de materiales y capacidad, y ofrecer mecanismos de disponible para prometer (ATP) y capaz para prometer (CTP)."
    },
    {
      "module": "PLA",
      "code": "PLA-10",
      "title": "Gestión de excepciones de plan",
      "description": "Debe detectar y gestionar sobrecargas, faltantes de material, órdenes retrasadas, recursos no disponibles y conflictos de prioridad, con acciones sugeridas y responsables."
    },
    {
      "module": "PLA",
      "code": "PLA-11",
      "title": "Colaboración y aprobación del plan",
      "description": "Debe permitir revisar, comentar y aprobar el plan, con versiones, responsables y períodos congelados para evitar cambios no coordinados."
    },
    {
      "module": "PLA",
      "code": "PLA-12",
      "title": "Indicadores de planificación",
      "description": "Debe medir cumplimiento del plan, utilización de capacidad, backlog, trabajo en curso, nivel de servicio y estabilidad del plan."
    },
    {
      "module": "PLA",
      "code": "PLA-13",
      "title": "Integración con compras, producción, mantenimiento y ventas",
      "description": "El plan debe generar necesidades de compra, órdenes de producción, reservas de capacidad y avisos a mantenimiento, y considerar la disponibilidad de recursos."
    },
    {
      "module": "PLA",
      "code": "PLA-14",
      "title": "Configuración y gobierno",
      "description": "Debe permitir configurar calendarios, turnos, horizontes, reglas de prioridad, períodos congelados, permisos y auditoría de cambios."
    }
  ],
  "MES": [
    {
      "module": "MES",
      "code": "MES-01",
      "title": "Liberación de órdenes de trabajo",
      "description": "Debe permitir liberar órdenes a la planta una vez validadas las condiciones de material, capacidad y documentación."
    },
    {
      "module": "MES",
      "code": "MES-02",
      "title": "Asignación de recursos y operarios",
      "description": "Debe permitir asignar órdenes a máquinas, centros y operarios, considerando disponibilidad, habilidades y carga."
    },
    {
      "module": "MES",
      "code": "MES-03",
      "title": "Inicio, pausa, reanudación y finalización",
      "description": "Debe registrar el ciclo de vida de cada operación con fecha, hora, usuario y motivo de pausa."
    },
    {
      "module": "MES",
      "code": "MES-04",
      "title": "Captura de cantidades producidas, rechazadas y pendientes",
      "description": "Debe permitir registrar cantidad producida, cantidad rechazada con motivo y cantidad pendiente, manteniendo la relación con la orden."
    },
    {
      "module": "MES",
      "code": "MES-05",
      "title": "Registro de tiempos reales",
      "description": "Debe registrar tiempo de preparación, ciclo, espera, pausa y limpieza, comparándolos con los tiempos estándar."
    },
    {
      "module": "MES",
      "code": "MES-06",
      "title": "Registro de paradas y causas",
      "description": "Debe permitir registrar paradas por disponibilidad, rendimiento, calidad u otra causa, con inicio, fin, duración y responsable."
    },
    {
      "module": "MES",
      "code": "MES-07",
      "title": "Instrucciones de trabajo digitales",
      "description": "Debe mostrar al operario instrucciones, especificaciones, planos y listas de verificación asociadas a la operación."
    },
    {
      "module": "MES",
      "code": "MES-08",
      "title": "Confirmación de operaciones y consumo",
      "description": "Debe permitir confirmar el consumo de materiales, la producción y el avance de la operación, actualizando inventario y trazabilidad."
    },
    {
      "module": "MES",
      "code": "MES-09",
      "title": "Seguimiento del trabajo en curso (WIP)",
      "description": "Debe mostrar órdenes en curso, cantidad producida, cantidad pendiente, ubicación y valor del trabajo en proceso."
    },
    {
      "module": "MES",
      "code": "MES-10",
      "title": "Trazabilidad operario-máquina-orden",
      "description": "Debe vincular cada registro con la orden, operación, operario, máquina, turno y lote."
    },
    {
      "module": "MES",
      "code": "MES-11",
      "title": "Turnos y relevos",
      "description": "Debe permitir gestionar turnos, relevos, traspaso de trabajo y continuidad de la operación."
    },
    {
      "module": "MES",
      "code": "MES-12",
      "title": "Alertas y gestión visual",
      "description": "Debe mostrar alertas de retraso, parada, falta de material, calidad o saturación, con escalamiento y confirmación."
    },
    {
      "module": "MES",
      "code": "MES-13",
      "title": "Calidad en línea",
      "description": "Debe permitir ejecutar controles de calidad durante la operación y bloquear el avance si el resultado no es conforme."
    },
    {
      "module": "MES",
      "code": "MES-14",
      "title": "Integración con dispositivos",
      "description": "Debe permitir capturar datos de básculas, lectores, sensores y terminales de planta cuando estén disponibles."
    },
    {
      "module": "MES",
      "code": "MES-15",
      "title": "Tableros de planta",
      "description": "Debe ofrecer tableros de avance, carga, eficiencia, paradas, calidad y WIP por centro, turno y orden."
    },
    {
      "module": "MES",
      "code": "MES-16",
      "title": "Cierre y pendientes",
      "description": "Debe permitir cerrar operaciones y órdenes, generar pendientes y consolidar la información para costos y trazabilidad."
    }
  ],
  "TRA": [
    {
      "module": "TRA",
      "code": "TRA-01",
      "title": "Identificación única",
      "description": "Debe asignar identificadores únicos a lotes, series, paquetes y órdenes, y conservarlos en todos los movimientos."
    },
    {
      "module": "TRA",
      "code": "TRA-02",
      "title": "Genealogía de materias primas",
      "description": "Debe registrar qué proveedor, lote, recepción y control de calidad originaron cada material consumido."
    },
    {
      "module": "TRA",
      "code": "TRA-03",
      "title": "Genealogía de producto terminado",
      "description": "Debe registrar qué materiales, operaciones, máquinas, operarios y controles intervinieron en cada lote o unidad producida."
    },
    {
      "module": "TRA",
      "code": "TRA-04",
      "title": "Relación orden-operación-operario-máquina",
      "description": "Debe vincular cada operación con la orden, el operario, la máquina, el turno y el tiempo real."
    },
    {
      "module": "TRA",
      "code": "TRA-05",
      "title": "Trazabilidad hacia atrás",
      "description": "Dado un producto o lote, debe reconstruir sus componentes, proveedores, recepciones y controles."
    },
    {
      "module": "TRA",
      "code": "TRA-06",
      "title": "Trazabilidad hacia adelante",
      "description": "Dado un lote o material, debe identificar a qué productos, clientes o entregas fue destinado."
    },
    {
      "module": "TRA",
      "code": "TRA-07",
      "title": "Historial de consumos",
      "description": "Debe conservar consumo real, teórico, mermas y ajustes por orden y lote."
    },
    {
      "module": "TRA",
      "code": "TRA-08",
      "title": "Historial de defectos",
      "description": "Debe vincular no conformidades, rechazos y alertas con el lote, la orden y el proceso."
    },
    {
      "module": "TRA",
      "code": "TRA-09",
      "title": "Historial de reprocesos",
      "description": "Debe registrar reprocesos, reparaciones y desensamblados, con motivo, responsable y resultado."
    },
    {
      "module": "TRA",
      "code": "TRA-10",
      "title": "Cuarentena",
      "description": "Debe permitir bloquear y ubicar lotes en cuarentena, impedir su uso y registrar la decisión de liberación o rechazo."
    },
    {
      "module": "TRA",
      "code": "TRA-11",
      "title": "Retiro de producto (recall)",
      "description": "Debe permitir iniciar un retiro, identificar el alcance, notificar a los afectados, registrar devoluciones y medir la efectividad."
    },
    {
      "module": "TRA",
      "code": "TRA-12",
      "title": "Notificaciones y comunicación",
      "description": "Debe generar avisos a calidad, producción, logística y clientes según el evento y el nivel de criticidad."
    },
    {
      "module": "TRA",
      "code": "TRA-13",
      "title": "Expediente de lote",
      "description": "Debe consolidar en una vista única toda la información del lote: origen, materiales, proceso, controles, movimientos, defectos y destino."
    },
    {
      "module": "TRA",
      "code": "TRA-14",
      "title": "Reportes y auditoría",
      "description": "Debe ofrecer reportes de trazabilidad, genealogía, consumos, retiros y evidencia para auditoría."
    },
    {
      "module": "TRA",
      "code": "TRA-15",
      "title": "Retención y archivo",
      "description": "Debe conservar la información durante el período definido por la política y permitir su consulta posterior."
    }
  ],
  "REN": [
    {
      "module": "REN",
      "code": "REN-01",
      "title": "OEE",
      "description": "Debe calcular la efectividad global de los equipos como disponibilidad × rendimiento × calidad, con fórmulas documentadas y datos reales."
    },
    {
      "module": "REN",
      "code": "REN-02",
      "title": "Disponibilidad",
      "description": "Debe medir tiempo productivo sobre tiempo planificado, descontando paradas y esperas."
    },
    {
      "module": "REN",
      "code": "REN-03",
      "title": "Rendimiento",
      "description": "Debe comparar producción real con producción teórica según velocidad estándar y tiempo efectivo."
    },
    {
      "module": "REN",
      "code": "REN-04",
      "title": "Calidad",
      "description": "Debe medir unidades conformes sobre unidades producidas, integrando rechazos y reprocesos."
    },
    {
      "module": "REN",
      "code": "REN-05",
      "title": "Tiempo de ciclo",
      "description": "Debe medir tiempo real por unidad o lote y compararlo con el estándar."
    },
    {
      "module": "REN",
      "code": "REN-06",
      "title": "Tiempo de preparación (setup)",
      "description": "Debe registrar y analizar tiempos de preparación, cambios de producto y limpieza."
    },
    {
      "module": "REN",
      "code": "REN-07",
      "title": "Rendimiento de primera pasada (FPY)",
      "description": "Debe calcular unidades conformes a la primera sobre unidades iniciadas, sin reproceso."
    },
    {
      "module": "REN",
      "code": "REN-08",
      "title": "Tasa de desperdicio",
      "description": "Debe medir desperdicio por producto, proceso, turno y causa."
    },
    {
      "module": "REN",
      "code": "REN-09",
      "title": "Tasa de reproceso",
      "description": "Debe medir unidades reprocesadas y su impacto en tiempo y costo."
    },
    {
      "module": "REN",
      "code": "REN-10",
      "title": "Cumplimiento del plan",
      "description": "Debe comparar producción real con planificada por período, producto y centro."
    },
    {
      "module": "REN",
      "code": "REN-11",
      "title": "Análisis de paradas",
      "description": "Debe clasificar paradas por causa, duración, frecuencia y responsabilidad."
    },
    {
      "module": "REN",
      "code": "REN-12",
      "title": "Tableros y benchmarks",
      "description": "Debe ofrecer tableros por planta, centro, turno, producto y período, y comparar contra objetivos."
    }
  ],
  "EXC": [
    {
      "module": "EXC",
      "code": "EXC-01",
      "title": "No conformidades",
      "description": "Debe permitir registrar una no conformidad con producto, lote, cantidad, proceso, origen, evidencia y responsable."
    },
    {
      "module": "EXC",
      "code": "EXC-02",
      "title": "Desviaciones de receta o parámetros",
      "description": "Debe detectar y registrar desviaciones respecto a la receta, especificación o parámetro de proceso, con valor esperado y real."
    },
    {
      "module": "EXC",
      "code": "EXC-03",
      "title": "Tolerancias",
      "description": "Debe permitir definir tolerancias y evaluar automáticamente si un valor está dentro o fuera de rango."
    },
    {
      "module": "EXC",
      "code": "EXC-04",
      "title": "Bloqueo de órdenes y lotes",
      "description": "Debe permitir bloquear órdenes, operaciones o lotes hasta que la excepción se resuelva."
    },
    {
      "module": "EXC",
      "code": "EXC-05",
      "title": "Reprocesos",
      "description": "Debe permitir autorizar, registrar y costear reprocesos, con motivo y resultado."
    },
    {
      "module": "EXC",
      "code": "EXC-06",
      "title": "Desperdicio",
      "description": "Debe registrar desperdicio por causa, producto, lote y proceso."
    },
    {
      "module": "EXC",
      "code": "EXC-07",
      "title": "Análisis de causa raíz",
      "description": "Debe permitir documentar el análisis, la causa identificada y la evidencia."
    },
    {
      "module": "EXC",
      "code": "EXC-08",
      "title": "Acciones correctivas y preventivas (CAPA)",
      "description": "Debe permitir definir acciones, responsables, fechas, verificación de eficacia y cierre."
    },
    {
      "module": "EXC",
      "code": "EXC-09",
      "title": "Flujos de aprobación",
      "description": "Debe permitir aprobar excepciones, reprocesos, liberaciones y cambios con niveles y responsables definidos."
    },
    {
      "module": "EXC",
      "code": "EXC-10",
      "title": "Excepciones temporales",
      "description": "Debe permitir autorizar desviaciones temporales con vigencia, alcance y condiciones de cierre."
    },
    {
      "module": "EXC",
      "code": "EXC-11",
      "title": "Notificaciones y escalamiento",
      "description": "Debe notificar a los responsables y escalar cuando una excepción supere el tiempo o la criticidad definida."
    },
    {
      "module": "EXC",
      "code": "EXC-12",
      "title": "Reportes y auditoría",
      "description": "Debe ofrecer reportes de no conformidades, causas, acciones, reprocesos y efectividad, con trazabilidad completa."
    }
  ],
  "IOT": [
    {
      "module": "IOT",
      "code": "IOT-01",
      "title": "Conexión con PLC",
      "description": "Debe permitir intercambiar datos con controladores lógicos programables mediante protocolos industriales estándar."
    },
    {
      "module": "IOT",
      "code": "IOT-02",
      "title": "Sensores",
      "description": "Debe permitir capturar variables de temperatura, presión, humedad, vibración u otras, con marca de tiempo."
    },
    {
      "module": "IOT",
      "code": "IOT-03",
      "title": "Básculas",
      "description": "Debe permitir leer peso y asociarlo a producto, lote y operación."
    },
    {
      "module": "IOT",
      "code": "IOT-04",
      "title": "Máquinas y CNC",
      "description": "Debe permitir obtener estados, ciclos, contadores y alarmas de máquinas y centros de mecanizado."
    },
    {
      "module": "IOT",
      "code": "IOT-05",
      "title": "SCADA",
      "description": "Debe permitir intercambiar datos con sistemas de supervisión y control, respetando la jerarquía de seguridad."
    },
    {
      "module": "IOT",
      "code": "IOT-06",
      "title": "MES externo",
      "description": "Debe permitir integrarse con un MES existente para órdenes, ejecución y trazabilidad."
    },
    {
      "module": "IOT",
      "code": "IOT-07",
      "title": "Captura automática",
      "description": "Debe registrar cantidades, ciclos, temperaturas, estados y eventos sin intervención manual."
    },
    {
      "module": "IOT",
      "code": "IOT-08",
      "title": "Eventos y alarmas",
      "description": "Debe detectar eventos, generar alarmas y notificar a los responsables según reglas."
    },
    {
      "module": "IOT",
      "code": "IOT-09",
      "title": "Historiador",
      "description": "Debe almacenar variables industriales con retención, consulta y exportación."
    },
    {
      "module": "IOT",
      "code": "IOT-10",
      "title": "Seguridad",
      "description": "Debe segmentar redes, autenticar dispositivos, cifrar comunicaciones y registrar accesos."
    },
    {
      "module": "IOT",
      "code": "IOT-11",
      "title": "Monitoreo y diagnóstico",
      "description": "Debe mostrar estado de conectividad, latencia, errores y salud de los dispositivos."
    },
    {
      "module": "IOT",
      "code": "IOT-12",
      "title": "Configuración",
      "description": "Debe permitir configurar dispositivos, protocolos, variables, reglas y destinos de datos."
    }
  ],
  "COS": [
    {
      "module": "COS",
      "code": "COS-01",
      "title": "Costo estándar",
      "description": "Debe calcular el costo estándar por producto a partir de la lista de materiales, rutas, tarifas y costos adicionales."
    },
    {
      "module": "COS",
      "code": "COS-02",
      "title": "Costo real",
      "description": "Debe calcular el costo real de cada orden con materiales consumidos, tiempos reales, tarifas y costos adicionales."
    },
    {
      "module": "COS",
      "code": "COS-03",
      "title": "Costo de materiales",
      "description": "Debe valorizar el consumo real y compararlo con el consumo teórico."
    },
    {
      "module": "COS",
      "code": "COS-04",
      "title": "Costo de mano de obra",
      "description": "Debe valorizar horas reales por operario, turno o centro."
    },
    {
      "module": "COS",
      "code": "COS-05",
      "title": "Costo de máquina",
      "description": "Debe valorizar el uso de máquinas y centros según tarifa y tiempo."
    },
    {
      "module": "COS",
      "code": "COS-06",
      "title": "Costos indirectos",
      "description": "Debe permitir distribuir costos indirectos según bases configurables (horas, consumo, unidades, valor)."
    },
    {
      "module": "COS",
      "code": "COS-07",
      "title": "Consumo previsto versus real",
      "description": "Debe mostrar diferencias de cantidad, precio y mezcla por orden y producto."
    },
    {
      "module": "COS",
      "code": "COS-08",
      "title": "Variaciones",
      "description": "Debe calcular y explicar variaciones de material, mano de obra, máquina, eficiencia y precio."
    },
    {
      "module": "COS",
      "code": "COS-09",
      "title": "Costo del desperdicio",
      "description": "Debe valorizar el desperdicio y su impacto en el costo."
    },
    {
      "module": "COS",
      "code": "COS-10",
      "title": "Costo del reproceso",
      "description": "Debe valorizar reprocesos, reparaciones y retrabajos."
    },
    {
      "module": "COS",
      "code": "COS-11",
      "title": "Costo de tiempos improductivos",
      "description": "Debe valorizar paradas, esperas y pérdidas de eficiencia."
    },
    {
      "module": "COS",
      "code": "COS-12",
      "title": "Producción en proceso (WIP)",
      "description": "Debe valorizar el trabajo en curso por orden y período."
    },
    {
      "module": "COS",
      "code": "COS-13",
      "title": "Costo por orden y lote",
      "description": "Debe consolidar el costo por orden, lote, producto y cliente."
    },
    {
      "module": "COS",
      "code": "COS-14",
      "title": "Reportes y análisis",
      "description": "Debe ofrecer reportes de costo estándar versus real, variaciones, margen, desperdicio y reproceso."
    }
  ],
  "TRV": [
    {
      "module": "TRV",
      "code": "TRV-01",
      "title": "Seguridad y roles",
      "description": "Debe permitir definir roles, permisos por módulo, función, compañía, planta y centro de costo, con segregación de funciones."
    },
    {
      "module": "TRV",
      "code": "TRV-02",
      "title": "Datos maestros",
      "description": "Debe permitir gestionar productos, unidades, categorías, proveedores, clientes, ubicaciones, recursos y centros de costo con validaciones y versionado."
    },
    {
      "module": "TRV",
      "code": "TRV-03",
      "title": "Multi-compañía y multi-planta",
      "description": "Debe permitir operar varias compañías, plantas o almacenes con datos separados y consolidación cuando corresponda."
    },
    {
      "module": "TRV",
      "code": "TRV-04",
      "title": "Multi-moneda y unidades",
      "description": "Debe soportar monedas, tipos de cambio, unidades de medida y conversiones."
    },
    {
      "module": "TRV",
      "code": "TRV-05",
      "title": "Auditoría",
      "description": "Debe registrar quién creó, modificó, aprobó o eliminó cada registro, con fecha y valor anterior."
    },
    {
      "module": "TRV",
      "code": "TRV-06",
      "title": "Notificaciones",
      "description": "Debe permitir configurar alertas, correos, actividades y escalamiento por evento."
    },
    {
      "module": "TRV",
      "code": "TRV-07",
      "title": "Reportería y analítica",
      "description": "Debe ofrecer reportes operativos, tableros e indicadores exportables."
    },
    {
      "module": "TRV",
      "code": "TRV-08",
      "title": "Integraciones y API",
      "description": "Debe permitir integraciones con otros sistemas mediante interfaces seguras y documentadas."
    },
    {
      "module": "TRV",
      "code": "TRV-09",
      "title": "Importación y exportación",
      "description": "Debe permitir cargar y extraer datos en formatos estándar con validación y registro de errores."
    },
    {
      "module": "TRV",
      "code": "TRV-10",
      "title": "Configuración",
      "description": "Debe permitir parametrizar políticas, numeraciones, umbrales, calendarios y reglas sin desarrollo."
    },
    {
      "module": "TRV",
      "code": "TRV-11",
      "title": "Movilidad y experiencia de usuario",
      "description": "Debe permitir operar en planta desde terminales o dispositivos móviles cuando el proceso lo requiera."
    },
    {
      "module": "TRV",
      "code": "TRV-12",
      "title": "Gestión documental",
      "description": "Debe permitir adjuntar, versionar y controlar documentos asociados a productos, órdenes, lotes y controles."
    },
    {
      "module": "TRV",
      "code": "TRV-13",
      "title": "Localización",
      "description": "Debe soportar idioma, moneda, impuestos y requisitos legales del país."
    },
    {
      "module": "TRV",
      "code": "TRV-14",
      "title": "Continuidad y respaldo",
      "description": "Debe permitir respaldo, recuperación y continuidad operativa según la política de la empresa."
    }
  ]
};

export const TOTAL_FUNCIONES = FUNCIONES.length;

const db = require('../../shared/database/db');

function getRangos(periodo) {
  const ahora = new Date();
  let inicio, fin, inicioAnterior, finAnterior;

  if (periodo === 'diario') {
    inicio = new Date(ahora); inicio.setHours(0, 0, 0, 0);
    fin    = new Date(ahora); fin.setHours(23, 59, 59, 999);
    inicioAnterior = new Date(inicio); inicioAnterior.setDate(inicio.getDate() - 1);
    finAnterior    = new Date(fin);    finAnterior.setDate(fin.getDate() - 1);

  } else if (periodo === 'semanal') {
    inicio = new Date(ahora); inicio.setDate(ahora.getDate() - 6); inicio.setHours(0, 0, 0, 0);
    fin    = new Date(ahora); fin.setHours(23, 59, 59, 999);
    inicioAnterior = new Date(inicio); inicioAnterior.setDate(inicio.getDate() - 7);
    finAnterior    = new Date(inicio); finAnterior.setMilliseconds(-1);

  } else {
    inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    fin    = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);
    inicioAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    finAnterior    = new Date(inicio.getTime() - 1);
  }

  return { inicio, fin, inicioAnterior, finAnterior };
}

async function calcularMetricas(inicio, fin) {
  const ingresosResult = await db.query(
    `SELECT COALESCE(SUM(total), 0) AS ingresos
     FROM pedidos
     WHERE estado = 'COMPLETADO' AND fecha BETWEEN $1 AND $2`,
    [inicio, fin]
  );

  const costoProduccionResult = await db.query(
    `SELECT COALESCE(SUM(pi.cantidad * p.costo_produccion), 0) AS costo_produccion
     FROM pedido_items pi
     JOIN productos p   ON pi.producto_id = p.id
     JOIN pedidos ped   ON pi.pedido_id   = ped.id
     WHERE ped.estado = 'COMPLETADO'
       AND ped.fecha BETWEEN $1 AND $2
       AND p.costo_produccion IS NOT NULL`,
    [inicio, fin]
  );

  const costoInventarioResult = await db.query(
    `SELECT COALESCE(SUM(cantidad * costo_unitario), 0) AS costo_inventario
     FROM stock_movimientos
     WHERE tipo = 'ENTRADA'
       AND fecha BETWEEN $1 AND $2
       AND costo_unitario IS NOT NULL`,
    [inicio, fin]
  );

  const ingresos        = parseFloat(ingresosResult.rows[0].ingresos);
  const costoProduccion = parseFloat(costoProduccionResult.rows[0].costo_produccion);
  const costoInventario = parseFloat(costoInventarioResult.rows[0].costo_inventario);
  const costoTotal      = costoProduccion + costoInventario;
  const utilidad        = ingresos - costoTotal;
  const margen          = ingresos > 0 ? parseFloat(((utilidad / ingresos) * 100).toFixed(2)) : 0;

  return { ingresos, costo_produccion: costoProduccion, costo_inventario: costoInventario, costo_total: costoTotal, utilidad, margen };
}

class ReportesService {
  async getResumen(periodo = 'mensual') {
    const { inicio, fin, inicioAnterior, finAnterior } = getRangos(periodo);

    const [actual, anterior] = await Promise.all([
      calcularMetricas(inicio, fin),
      calcularMetricas(inicioAnterior, finAnterior)
    ]);

    let variacion_utilidad = null;
    if (anterior.utilidad !== 0) {
      variacion_utilidad = parseFloat((((actual.utilidad - anterior.utilidad) / Math.abs(anterior.utilidad)) * 100).toFixed(2));
    }

    return {
      periodo,
      fecha_inicio: inicio,
      fecha_fin: fin,
      ...actual,
      utilidad_positiva: actual.utilidad > 0,
      periodo_anterior: {
        ...anterior,
        variacion_utilidad
      }
    };
  }

  async getTurnoEmpleado(empleado_id) {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

    const pedidosResult = await db.query(
      `SELECT
         COUNT(*)                                               AS total_pedidos,
         COUNT(CASE WHEN estado = 'COMPLETADO'  THEN 1 END)   AS completados,
         COUNT(CASE WHEN estado = 'EN_PROCESO'  THEN 1 END)   AS en_proceso,
         COUNT(CASE WHEN estado = 'PENDIENTE'   THEN 1 END)   AS pendientes
       FROM pedidos
       WHERE empleado_id = $1 AND fecha >= $2`,
      [empleado_id, hoy]
    );

    const topProductosResult = await db.query(
      `SELECT p.nombre, SUM(pi.cantidad) AS total_vendido
       FROM pedido_items pi
       JOIN productos p ON pi.producto_id = p.id
       JOIN pedidos ped ON pi.pedido_id = ped.id
       WHERE ped.estado = 'COMPLETADO' AND ped.fecha >= $1
       GROUP BY p.id, p.nombre
       ORDER BY total_vendido DESC
       LIMIT 3`,
      [hoy]
    );

    const conteo = pedidosResult.rows[0];
    return {
      turno_fecha: hoy,
      total_pedidos: parseInt(conteo.total_pedidos),
      completados:   parseInt(conteo.completados),
      en_proceso:    parseInt(conteo.en_proceso),
      pendientes:    parseInt(conteo.pendientes),
      top_productos: topProductosResult.rows
    };
  }
}

module.exports = new ReportesService();

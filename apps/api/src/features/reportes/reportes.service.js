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

async function calcularMetricas(inicio, fin, local_id) {
  const ingresosResult = await db.query(
    `SELECT COALESCE(SUM(total), 0) AS ingresos
     FROM pedidos
     WHERE estado::text = 'completado' AND local_id = $3 AND created_at BETWEEN $1 AND $2`,
    [inicio, fin, local_id]
  );

  const costoProduccionResult = await db.query(
    `SELECT COALESCE(SUM(pi.cantidad * p.costo_produccion), 0) AS costo_produccion
     FROM pedido_items pi
     JOIN productos p   ON pi.producto_id = p.id
     JOIN pedidos ped   ON pi.pedido_id   = ped.id
     WHERE ped.estado::text = 'completado'
       AND ped.local_id = $3
       AND ped.created_at BETWEEN $1 AND $2
       AND p.costo_produccion IS NOT NULL`,
    [inicio, fin, local_id]
  );

  const costoInventarioResult = await db.query(
    `SELECT COALESCE(SUM(sm.cantidad * sm.costo_unitario), 0) AS costo_inventario
     FROM stock_movimientos sm
     JOIN insumos i ON sm.insumo_id = i.id
     WHERE sm.tipo = 'entrada'
       AND i.local_id = $3
       AND sm.created_at BETWEEN $1 AND $2
       AND sm.costo_unitario IS NOT NULL`,
    [inicio, fin, local_id]
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
  async getResumen(periodo = 'mensual', local_id) {
    const { inicio, fin, inicioAnterior, finAnterior } = getRangos(periodo);

    const [actual, anterior] = await Promise.all([
      calcularMetricas(inicio, fin, local_id),
      calcularMetricas(inicioAnterior, finAnterior, local_id)
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

  async getTurnoEmpleado(empleado_id, local_id) {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

    const pedidosResult = await db.query(
      `SELECT
         COUNT(*)                                                     AS total_pedidos,
         COUNT(CASE WHEN estado::text = 'completado' THEN 1 END)    AS completados,
         COUNT(CASE WHEN estado::text = 'preparando' THEN 1 END)    AS en_proceso,
         COUNT(CASE WHEN estado::text = 'pendiente'  THEN 1 END)    AS pendientes
       FROM pedidos
       WHERE empleado_id = $1 AND local_id = $2 AND created_at >= $3`,
      [empleado_id, local_id, hoy]
    );

    const topProductosResult = await db.query(
      `SELECT p.nombre, SUM(pi.cantidad) AS total_vendido
       FROM pedido_items pi
       JOIN productos p ON pi.producto_id = p.id
       JOIN pedidos ped ON pi.pedido_id = ped.id
       WHERE ped.estado::text = 'completado' AND ped.local_id = $2 AND ped.created_at >= $1
       GROUP BY p.id, p.nombre
       ORDER BY total_vendido DESC
       LIMIT 3`,
      [hoy, local_id]
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

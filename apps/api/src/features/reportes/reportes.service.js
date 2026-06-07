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

    // Pedidos completados en el período
    const pedidosResult = await db.query(
      `SELECT COUNT(*) AS cantidad FROM pedidos
       WHERE estado::text = 'completado' AND local_id = $1 AND created_at BETWEEN $2 AND $3`,
      [local_id, inicio, fin]
    );
    const cantidad_pedidos = parseInt(pedidosResult.rows[0].cantidad) || 0;
    const ticket_promedio  = cantidad_pedidos > 0
      ? parseFloat((actual.ingresos / cantidad_pedidos).toFixed(0))
      : 0;

    let variacion_utilidad = null;
    if (anterior.utilidad !== 0) {
      variacion_utilidad = parseFloat((((actual.utilidad - anterior.utilidad) / Math.abs(anterior.utilidad)) * 100).toFixed(2));
    }

    return {
      periodo,
      fecha_inicio: inicio,
      fecha_fin: fin,
      ...actual,
      cantidad_pedidos,
      ticket_promedio,
      utilidad_positiva: actual.utilidad > 0,
      periodo_anterior: {
        ...anterior,
        variacion_utilidad
      }
    };
  }

  async getProyecciones(local_id) {
    const ahora = new Date();
    const anio  = ahora.getFullYear();

    const ingresosResult = await db.query(
      `SELECT
         EXTRACT(MONTH FROM created_at)::int   AS mes,
         COALESCE(SUM(total), 0)::float        AS ingresos
       FROM pedidos
       WHERE estado::text = 'completado'
         AND local_id = $1
         AND EXTRACT(YEAR FROM created_at) = $2
       GROUP BY mes
       ORDER BY mes`,
      [local_id, anio]
    );

    const costosResult = await db.query(
      `SELECT
         EXTRACT(MONTH FROM ped.created_at)::int                    AS mes,
         COALESCE(SUM(pi.cantidad * p.costo_produccion), 0)::float  AS costos
       FROM pedido_items pi
       JOIN productos p ON pi.producto_id = p.id
       JOIN pedidos ped ON pi.pedido_id   = ped.id
       WHERE ped.estado::text = 'completado'
         AND ped.local_id = $1
         AND EXTRACT(YEAR FROM ped.created_at) = $2
         AND p.costo_produccion IS NOT NULL
       GROUP BY mes
       ORDER BY mes`,
      [local_id, anio]
    );

    const ingresosMap = {};
    for (const r of ingresosResult.rows) ingresosMap[r.mes] = r.ingresos;

    const costosMap = {};
    for (const r of costosResult.rows) costosMap[r.mes] = r.costos;

    const mesesConDatos = ingresosResult.rows.filter(r => r.ingresos > 0);

    // Tasa de crecimiento mensual compuesta (CAGR); 7 % por defecto si hay < 2 meses reales
    let tasaCrecimiento = 0.07;
    if (mesesConDatos.length >= 2) {
      const primero   = mesesConDatos[0].ingresos;
      const ultimo    = mesesConDatos[mesesConDatos.length - 1].ingresos;
      const n         = mesesConDatos.length - 1;
      const calculada = Math.pow(ultimo / primero, 1 / n) - 1;
      tasaCrecimiento = Math.min(Math.max(calculada, -0.20), 0.30);
    }

    const ultimoMesReal = mesesConDatos.length > 0
      ? mesesConDatos[mesesConDatos.length - 1].mes
      : (ahora.getMonth() + 1);
    const baseIngresos  = ingresosMap[ultimoMesReal] || 0;
    const baseCostos    = costosMap[ultimoMesReal]   || 0;
    const ratioCosto    = baseIngresos > 0 ? baseCostos / baseIngresos : 0.40;

    const NOMBRES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

    const meses = [];
    for (let m = 1; m <= 12; m++) {
      if (ingresosMap[m] !== undefined) {
        meses.push({ mes: m, nombre: NOMBRES[m - 1], ingresos: ingresosMap[m], costos: costosMap[m] || 0, tipo: 'real' });
      } else {
        const distancia    = m - ultimoMesReal;
        const ingresosProy = baseIngresos * Math.pow(1 + tasaCrecimiento, distancia);
        meses.push({ mes: m, nombre: NOMBRES[m - 1], ingresos: Math.round(ingresosProy), costos: Math.round(ingresosProy * ratioCosto), tipo: 'proyectado' });
      }
    }

    const totalIngresos = meses.reduce((s, m) => s + m.ingresos, 0);
    const totalCostos   = meses.reduce((s, m) => s + m.costos,   0);
    const margenPct     = totalIngresos > 0
      ? ((totalIngresos - totalCostos) / totalIngresos) * 100
      : 0;

    return {
      anio,
      tasa_crecimiento_mensual: parseFloat((tasaCrecimiento * 100).toFixed(2)),
      meses,
      resumen: {
        ingreso_total_potencial: totalIngresos,
        costo_total_produccion:  totalCostos,
        margen_promedio_pct:     parseFloat(margenPct.toFixed(2)),
      },
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
  async getResumenPagos(local_id, periodo = 'mensual') {
    const { inicio, fin } = getRangos(periodo);

    const result = await db.query(
      `SELECT
         COALESCE(metodo_pago, 'efectivo')            AS metodo_pago,
         COUNT(*)                                      AS cantidad_pedidos,
         COALESCE(SUM(total), 0)::float               AS total_recaudado,
         -- Si monto_efectivo no está registrado, usar total cuando el método es efectivo
         COALESCE(SUM(
           CASE
             WHEN monto_efectivo > 0 THEN monto_efectivo
             WHEN metodo_pago IS NULL OR metodo_pago = 'efectivo' THEN total
             ELSE 0
           END
         ), 0)::float AS total_efectivo,
         COALESCE(SUM(
           CASE
             WHEN monto_transferencia > 0 THEN monto_transferencia
             WHEN metodo_pago = 'transferencia' THEN total
             ELSE 0
           END
         ), 0)::float AS total_transferencia
       FROM pedidos
       WHERE estado::text = 'completado'
         AND local_id = $1
         AND created_at BETWEEN $2 AND $3
       GROUP BY COALESCE(metodo_pago, 'efectivo')
       ORDER BY total_recaudado DESC`,
      [local_id, inicio, fin]
    );

    const rows = result.rows;
    const totalEfectivo      = rows.reduce((s, r) => s + (parseFloat(r.total_efectivo) || 0), 0);
    const totalTransferencia = rows.reduce((s, r) => s + (parseFloat(r.total_transferencia) || 0), 0);
    const totalGeneral       = rows.reduce((s, r) => s + (parseFloat(r.total_recaudado) || 0), 0);

    return {
      periodo,
      total_general: totalGeneral,
      total_efectivo: totalEfectivo,
      total_transferencia: totalTransferencia,
      por_metodo: rows.map(r => ({
        metodo:       r.metodo_pago || 'sin_registrar',
        pedidos:      parseInt(r.cantidad_pedidos),
        total:        parseFloat(r.total_recaudado),
        efectivo:     parseFloat(r.total_efectivo),
        transferencia: parseFloat(r.total_transferencia),
      })),
    };
  }
  async getTopProductos(local_id, periodo = 'mensual') {
    const { inicio, fin } = getRangos(periodo);

    const result = await db.query(
      `SELECT
         p.id,
         p.nombre,
         p.precio_venta,
         COALESCE(p.costo_produccion, 0)                          AS costo_produccion,
         SUM(pi.cantidad)::int                                     AS cantidad_vendida,
         COALESCE(SUM(pi.cantidad * pi.precio_unitario), 0)::float AS total_generado,
         COALESCE(SUM(pi.cantidad * (pi.precio_unitario - COALESCE(p.costo_produccion, 0))), 0)::float AS ganancia_generada
       FROM pedido_items pi
       JOIN productos p  ON pi.producto_id = p.id
       JOIN pedidos ped  ON pi.pedido_id   = ped.id
       WHERE ped.estado::text = 'completado'
         AND ped.local_id = $1
         AND ped.created_at BETWEEN $2 AND $3
       GROUP BY p.id, p.nombre, p.precio_venta, p.costo_produccion
       ORDER BY cantidad_vendida DESC
       LIMIT 8`,
      [local_id, inicio, fin]
    );

    return result.rows.map(r => ({
      id:               r.id,
      nombre:           r.nombre,
      precio_venta:     parseFloat(r.precio_venta) || 0,
      costo_produccion: parseFloat(r.costo_produccion) || 0,
      cantidad_vendida: r.cantidad_vendida,
      total_generado:   r.total_generado,
      ganancia_generada: r.ganancia_generada,
    }));
  }
}

module.exports = new ReportesService();

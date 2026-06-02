export const TIPOS_ACCION = ['CREAR', 'EDITAR', 'ELIMINAR', 'LOGIN', 'LOGOUT', 'COMPLETAR', 'CANCELAR'];

export const historyViewConfig = {
  ADMIN: {
    filters:   ['usuario_id', 'accion', 'entidad', 'fecha_inicio', 'fecha_fin'],
    columns:   ['id', 'usuario', 'accion', 'entidad', 'entidad_id', 'detalle', 'created_at'],
    entidades: ['productos', 'pedidos', 'carnes', 'insumos', 'inventario', 'usuarios', 'auth'],
    emptyMessage: 'No hay acciones registradas.',
  },
  JEFE: {
    filters:   ['accion', 'entidad', 'fecha_inicio', 'fecha_fin'],
    columns:   ['id', 'usuario', 'accion', 'entidad', 'entidad_id', 'detalle', 'created_at'],
    entidades: ['pedidos', 'inventario', 'carnes', 'insumos', 'productos'],
    emptyMessage: 'No hay acciones operativas registradas.',
  },
  EMPLEADO: {
    filters:   ['accion', 'fecha_inicio', 'fecha_fin'],
    columns:   ['id', 'accion', 'entidad', 'detalle', 'created_at'],
    entidades: [],
    emptyMessage: 'Aún no tienes acciones registradas en tu historial.',
  },
};

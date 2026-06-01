export const TIPOS_ACCION = ['CREAR', 'EDITAR', 'ELIMINAR', 'LOGIN', 'LOGOUT', 'COMPLETAR', 'CANCELAR'];

export const historyViewConfig = {
  ADMIN: {
    filters:  ['usuario_id', 'rol', 'tipo_accion', 'entidad', 'fecha_inicio', 'fecha_fin'],
    columns:  ['usuario', 'rol', 'tipo_accion', 'entidad', 'entidad_id', 'descripcion', 'fecha'],
    entidades: ['productos', 'pedidos', 'carnes', 'insumos', 'inventario', 'usuarios', 'auth'],
    emptyMessage: 'No hay acciones registradas.',
  },
  JEFE: {
    filters:  ['tipo_accion', 'entidad', 'fecha_inicio', 'fecha_fin'],
    columns:  ['usuario', 'tipo_accion', 'entidad', 'entidad_id', 'descripcion', 'fecha'],
    entidades: ['pedidos', 'inventario', 'carnes', 'insumos', 'productos'],
    emptyMessage: 'No hay acciones operativas registradas.',
  },
  EMPLEADO: {
    filters:  ['tipo_accion', 'fecha_inicio', 'fecha_fin'],
    columns:  ['tipo_accion', 'entidad', 'descripcion', 'fecha'],
    entidades: [],
    emptyMessage: 'Aún no tienes acciones registradas en tu historial.',
  },
};

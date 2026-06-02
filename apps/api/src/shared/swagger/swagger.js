const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Brasas OS API',
      version: '1.0.0',
      description: 'API REST para gestión gastronómica — Brasas OS',
    },
    servers: [{ url: 'http://localhost:3000/api/v1', description: 'Servidor local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido en /auth/login o /auth/register',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error interno del servidor' },
          },
        },
        Usuario: {
          type: 'object',
          properties: {
            id:       { type: 'string', format: 'uuid' },
            nombre:   { type: 'string', example: 'David García' },
            email:    { type: 'string', example: 'david@gmail.com' },
            rol:      { type: 'string', example: 'JEFE' },
            local_id: { type: 'string', format: 'uuid' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'Token JWT — copialo y pegalo en Authorize 🔓',
            },
            user: { $ref: '#/components/schemas/Usuario' },
          },
        },
        Insumo: {
          type: 'object',
          properties: {
            id:                 { type: 'string', format: 'uuid' },
            nombre:             { type: 'string', example: 'Carne de res' },
            tipo:               { type: 'string', enum: ['insumo', 'carne'], example: 'carne' },
            unidad_medida:      { type: 'string', example: 'kg' },
            stock_actual:       { type: 'number', example: 10.5 },
            stock_minimo:       { type: 'number', example: 2 },
            costo_unitario_prom:{ type: 'number', example: 8500 },
            activo:             { type: 'boolean', example: true },
          },
        },
        Producto: {
          type: 'object',
          properties: {
            id:               { type: 'string', format: 'uuid' },
            nombre:           { type: 'string', example: 'Hamburguesa Clásica' },
            precio_venta:     { type: 'number', example: 12000 },
            costo_produccion: { type: 'number', example: 4500 },
            margen:           { type: 'number', example: 7500 },
            categoria:        { type: 'string', example: 'Hamburguesas' },
            activo:           { type: 'boolean', example: true },
          },
        },
      },
    },
  },
  apis: [
    './src/features/auth/routes.js',
    './src/features/inventario/inventario.routes.js',
    './src/features/productos/productos.routes.js',
    './src/features/pedidos/pedidos.routes.js',
    './src/features/users/users.routes.js',
    './src/features/historial/historial.routes.js',
    './src/features/reportes/reportes.routes.js',
  ],
};

module.exports = swaggerJsdoc(options);

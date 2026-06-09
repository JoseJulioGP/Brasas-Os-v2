# Brasas OS v2

Sistema de gestión operativa para locales de comida. Permite administrar pedidos, inventario, menú, usuarios y analítica financiera desde una sola plataforma web.

---

## Estructura del proyecto

```
Brasas-Os-v2/
├── apps/
│   ├── api/          # Backend — Node.js + Express
│   └── web/          # Frontend — React + Vite
```

Monorepo con dos aplicaciones independientes.

---

## Stack tecnológico

### Backend (`apps/api`)
| Tecnología | Uso |
|---|---|
| Node.js + Express 5 | Servidor HTTP |
| PostgreSQL (Supabase) | Base de datos |
| JWT (jsonwebtoken) | Autenticación stateless |
| bcrypt | Hashing de contraseñas |
| Swagger UI | Documentación de la API (`/api-docs`) |
| Helmet + CORS | Seguridad HTTP |
| Nodemon | Hot reload en desarrollo |

### Frontend (`apps/web`)
| Tecnología | Uso |
|---|---|
| React 19 | UI |
| Vite 8 | Bundler |
| Tailwind CSS 4 | Estilos |
| HeroUI | Componentes de UI |
| Zustand | Estado global |
| React Router 7 | Enrutamiento |
| Axios | Llamadas HTTP |
| React Icons | Iconografía |

---

## Instalación y ejecución

### Requisitos previos
- Node.js 18+
- Cuenta en Supabase (o PostgreSQL local)

### Backend

```bash
cd apps/api
npm install
```

Crear archivo `.env` en `apps/api/`:


```bash
npm run dev    # desarrollo con nodemon
npm start      # producción
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

---

## Arquitectura del backend

### Estructura de carpetas

```
src/
├── app.js                    # Configuración de Express, middlewares, rutas
├── server.js                 # Arranque del servidor
├── features/                 # Módulos por dominio
│   ├── auth/                 # Autenticación (login, register, /me)
│   ├── usuarios/             # Gestión de usuarios
│   ├── productos/            # Menú y categorías
│   ├── inventario/           # Insumos y movimientos de stock
│   ├── pedidos/              # Órdenes
│   ├── reportes/             # Resumen financiero y proyecciones
│   └── historial/            # Auditoría de acciones
├── services/                 # Servicios legacy (carpeta en transición)
└── shared/
    ├── database/db.js        # Pool de conexión a Supabase
    ├── middlewares/
    │   ├── auth.middleware.js    # verifyToken, requireRole, requireAnyRole
    │   └── audit.middleware.js   # Registro automático de acciones POST/PUT/DELETE
    ├── constants/audit.js    # Tipos de acción y entidades del historial
    └── swagger/swagger.js    # Configuración de Swagger
```

Cada módulo sigue el patrón `controller → service → db`.

### Middleware de auditoría

Cada mutación exitosa (POST, PUT, PATCH, DELETE con status 2xx) se registra automáticamente en la tabla `historial` con: usuario, local, tipo de acción, entidad y entidad_id. Las rutas `/auth` e `/historial` están excluidas.

---

## Autenticación y roles

JWT stateless con expiración de **8 horas**. El token se firma con `JWT_SECRET` y contiene: `id`, `rol`, `rol_id`, `local_id`, `email`.

### Roles

| Rol | Acceso |
|---|---|
| `ADMIN` | Acceso total: CRUD de usuarios, todos los pedidos, todas las rutas |
| `JEFE` | Gestión de su local: menú, inventario, pedidos, equipo, reportes |
| `EMPLEADO` | Solo sus pedidos del turno actual |

### Flujo de registro

- **JEFE**: registro libre → se crea automáticamente un `local` asociado al usuario.
- **EMPLEADO**: requiere `codigo_invitacion` generado por un JEFE → hereda el `local_id` del JEFE.

---

## API REST — Endpoints

Base URL: `http://localhost:3000/api/v1`

Documentación interactiva: `http://localhost:3000/api-docs`

### Auth

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/register` | Público | Registrar usuario (JEFE o EMPLEADO) |
| POST | `/auth/login` | Público | Login → retorna JWT |
| GET | `/auth/me` | 🔒 Token | Datos del usuario autenticado |

### Usuarios

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/usuarios` | ADMIN | Listar todos los usuarios |
| POST | `/usuarios` | ADMIN | Crear usuario |
| GET | `/usuarios/:id` | ADMIN | Obtener usuario por ID |
| PUT | `/usuarios/:id` | ADMIN | Actualizar usuario |
| DELETE | `/usuarios/:id` | ADMIN | Desactivar usuario |
| GET | `/usuarios/mis-empleados` | JEFE/ADMIN | Empleados del local propio |
| GET | `/usuarios/codigo-invitacion` | JEFE/ADMIN | Ver código de invitación activo |
| POST | `/usuarios/codigo-invitacion` | JEFE/ADMIN | Generar nuevo código |

### Productos (Menú)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/productos` | 🔒 Token | Listar productos del local |
| POST | `/productos` | JEFE/ADMIN | Crear producto |
| GET | `/productos/:id` | 🔒 Token | Obtener producto con insumos |
| PUT | `/productos/:id` | JEFE/ADMIN | Actualizar producto |
| DELETE | `/productos/:id` | JEFE/ADMIN | Soft delete |
| GET | `/productos/categorias` | 🔒 Token | Listar categorías |
| POST | `/productos/categorias` | JEFE/ADMIN | Crear categoría |
| DELETE | `/productos/categorias/:id` | JEFE/ADMIN | Eliminar categoría |
| GET | `/productos/costos` | JEFE/ADMIN | Productos con margen y análisis de costos |

### Inventario

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/inventario/insumos` | JEFE/ADMIN | Listar insumos |
| POST | `/inventario/insumos` | JEFE/ADMIN | Crear insumo |
| GET | `/inventario/insumos/:id` | JEFE/ADMIN | Insumo por ID |
| PUT | `/inventario/insumos/:id` | JEFE/ADMIN | Actualizar insumo |
| DELETE | `/inventario/insumos/:id` | JEFE/ADMIN | Eliminar insumo |
| PATCH | `/inventario/insumos/:id/stock-minimo` | ADMIN | Actualizar stock mínimo |
| GET | `/inventario/movimientos` | JEFE/ADMIN | Historial de movimientos |
| POST | `/inventario/entrada` | JEFE/ADMIN | Registrar entrada de stock |
| POST | `/inventario/salida` | JEFE/ADMIN | Registrar salida de stock |

### Pedidos

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/pedidos` | 🔒 Token | Pedidos propios (empleado) o del local |
| POST | `/pedidos` | 🔒 Token | Crear pedido |
| GET | `/pedidos/:id` | 🔒 Token | Pedido por ID |
| PUT | `/pedidos/:id/estado` | 🔒 Token | Actualizar estado del pedido |
| PUT | `/pedidos/:id` | ADMIN | Editar pedido completo |
| DELETE | `/pedidos/:id` | 🔒 Token | Cancelar pedido |
| GET | `/pedidos/todos` | JEFE/ADMIN | Todos los pedidos del local |

### Reportes

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/reportes/resumen?periodo=diario\|semanal\|mensual` | JEFE/ADMIN | Resumen financiero con comparativa período anterior |
| GET | `/reportes/turno` | 🔒 Token | Resumen del turno del empleado actual |
| GET | `/reportes/proyecciones` | JEFE/ADMIN | Proyecciones financieras a 12 meses (CAGR) |

### Historial

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/historial` | 🔒 Token | Historial de acciones del local |

---

## Arquitectura del frontend

### Estructura de carpetas

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── routes/router.jsx          # Rutas con protección por rol
├── layout/
│   ├── DashboardLayout.jsx    # Layout principal con sidebar
│   └── Sidebar.jsx
├── services/api.js            # Instancia de Axios con interceptores
├── lib/heroui-shim.js
└── features/
    ├── auth/                  # Login, Register, store de sesión
    ├── landing/               # Página pública de presentación
    ├── dashboard/             # Resumen financiero y KPIs
    ├── menu/                  # Gestión de productos y categorías
    ├── inventory/             # Gestión de insumos y stock
    ├── orders/                # Creación y seguimiento de pedidos
    ├── history/               # Auditoría de acciones
    ├── analytics/             # Gráficos de tendencias y proyecciones
    └── users/                 # Gestión de usuarios y equipo
```

Cada feature sigue la estructura: `components/`, `services/`, `stores/`.

### Estado global (Zustand)

Cada feature tiene su propio store:
- `useAuthStore` — sesión del usuario (token, user, isAuthenticated)
- `useDashboardStore` — métricas del dashboard
- `useMenuStore` — productos y categorías
- `useInventoryStore` — insumos
- `useOrdersStore` — pedidos activos
- `useHistoryStore` — historial de acciones
- `useAnalyticsStore` — datos de analítica
- `useUsersStore` — usuarios y empleados

### Rutas y protección por rol

| Ruta | Roles permitidos |
|---|---|
| `/` | Público (landing) |
| `/login`, `/register` | Público (redirige si ya autenticado) |
| `/dashboard` | ADMIN, JEFE |
| `/inventory` | ADMIN, JEFE |
| `/menu` | ADMIN, JEFE |
| `/pedidos` | ADMIN, JEFE |
| `/analisis` | ADMIN, JEFE |
| `/historial` | ADMIN, JEFE |
| `/jefe/equipo` | JEFE, ADMIN |
| `/admin/usuarios` | ADMIN |
| `/empleado/pedidos` | EMPLEADO |

---

## Módulos funcionales

### Dashboard
Resumen financiero con KPIs del período seleccionado (diario/semanal/mensual): ingresos, costos, utilidad, margen. Incluye comparativa con el período anterior, productos más vendidos y acceso rápido a pedidos recientes.

### Menú (Productos)
CRUD completo de productos del local con categorías personalizadas. Cada producto puede tener insumos vinculados, costo de producción y precio de venta. Vista de análisis de costos y márgenes.

### Inventario
Gestión de insumos con control de stock. Registra entradas (compras a proveedores) y salidas (uso en producción). Alertas de stock mínimo. Solo ADMIN puede modificar el umbral mínimo.

### Pedidos
Creación de pedidos con selección de productos del menú. Estados: `pendiente → preparando → completado`. El EMPLEADO gestiona sus propios pedidos; JEFE/ADMIN ven todos.

### Analítica
Gráficos de ventas por período, tabla de márgenes por producto y proyecciones a 12 meses basadas en tasa de crecimiento mensual compuesta (CAGR) calculada desde datos históricos reales.

### Historial
Registro automático de todas las acciones de mutación (crear, editar, eliminar) con filtros por fecha, tipo de acción y entidad.

### Usuarios
ADMIN gestiona todos los usuarios. JEFE ve y gestiona su equipo, genera códigos de invitación para registrar empleados en su local.

---

## Variables de entorno

### Backend (`apps/api/.env`)

### Frontend
Sin variables de entorno requeridas en desarrollo. La URL base de la API está en `apps/web/src/services/api.js`.

---

## Ramas del repositorio

| Rama | Propósito |
|---|---|
| `main` | Producción estable |
| `feature/frontend` | Desarrollo de UI |
| `feature/backend` | Desarrollo de API |

---

## Base de datos

PostgreSQL alojado en **Supabase** (free tier).

Tablas principales inferidas del código:
- `locales` — locales de negocio (uno por JEFE registrado)
- `roles` — roles del sistema (admin, jefe, empleado)
- `usuarios` — usuarios con `local_id`, `rol_id`, `codigo_invitacion`
- `productos` — menú del local con `costo_produccion` y `precio_venta`
- `categorias` — categorías de productos
- `producto_insumos` — relación productos ↔ insumos con `cantidad_requerida`
- `insumos` — insumos del inventario con stock y tipo (insumo/carne)
- `stock_movimientos` — entradas y salidas de inventario
- `pedidos` — órdenes con `estado`, `total`, `empleado_id`, `local_id`
- `pedido_items` — detalle de productos por pedido
- `historial` — log de auditoría de acciones

Pool de conexión limitado a **3 conexiones máximas** para respetar el límite del tier gratuito de Supabase (15 conexiones totales). Reconexión automática con reintentos cada 5 segundos.

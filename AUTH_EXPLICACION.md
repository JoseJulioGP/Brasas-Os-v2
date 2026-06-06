# Autenticación — Brasas OS

---

## FRONTEND

---

### authService.js
`apps/web/src/features/auth/services/authService.js`

Objeto con 5 funciones. Es el único que habla directamente con la API.

---

**login(email, password)**

- Llama a `POST /auth/login`
- Normaliza el rol a mayúsculas (`"jefe"` → `"JEFE"`)
- Guarda el token en `localStorage` como `brasas_token`
- Guarda los datos del usuario como `brasas_user`
- Retorna el usuario

---

**register(nombre, email, password)**

- Igual que login pero llama a `POST /auth/register`
- Guarda token y usuario en `localStorage`

> ⚠️ Bug activo: no envía `tipo_registro` ni `codigo_invitacion`, por lo que el registro de empleados con código de invitación no funciona desde este archivo.

---

**getCurrentUser()**

- Lee token y usuario del `localStorage`
- Decodifica el JWT manualmente con `atob()` para revisar si expiró
- Si expiró → llama a `logout()` y retorna `null`
- Si está vigente → retorna el objeto usuario

---

**logout()**

- Borra `brasas_token` y `brasas_user` del `localStorage`
- No llama al backend porque el JWT es stateless

---

**getToken()**

- Retorna el token crudo del `localStorage`
- Lo usa `api.js` para adjuntarlo en cada request como `Authorization: Bearer <token>`

---

**isAuthenticated()**

- Llama a `getCurrentUser()` y lo convierte en booleano
- `true` si hay usuario válido, `false` si no

---

### useAuthStore.js
`apps/web/src/features/auth/stores/useAuthStore.js`

Estado global de autenticación hecho con Zustand. Cualquier componente puede leerlo sin pasar props.

---

**Estado inicial**

```
user: null
isAuthenticated: false
isLoading: false
error: null
```

---

**login(email, password)**

1. Activa `isLoading` y limpia errores
2. Llama a `authService.login()`
3. Si tiene éxito → guarda usuario, marca `isAuthenticated: true`
4. Si falla → guarda el mensaje de error del backend

---

**register(nombre, email, password)**

- Igual que login pero llama a `authService.register()`

> ⚠️ Bug activo: no acepta `tipo_registro` ni `codigo_invitacion`

---

**logout()**

1. Llama a `authService.logout()` → limpia `localStorage`
2. Limpia el estado en memoria → `user: null`, `isAuthenticated: false`

---

**checkAuth()**

- Se ejecuta al cargar la app para restaurar la sesión
- Lee el usuario de `localStorage`
- Si existe y el token es válido → restaura el estado
- Si no → limpia todo

---

**clearError()**

- Limpia el error del estado
- Los formularios lo llaman al inicio de cada intento

---

**¿Cómo se conecta con el resto?**

```
main.jsx
  → checkAuth() al cargar

LoginPage / RegisterPage
  → login() / register()

ProtectedRoute
  → isAuthenticated

Sidebar
  → user.rol

Cualquier componente
  → user.local_id (multitenancy)
```

---

---

## BACKEND

---

### routes.js
`apps/api/src/features/auth/routes.js`

Define 3 endpoints:

```
POST /auth/register  → público
POST /auth/login     → público
GET  /auth/me        → requiere token
```

Solo `/me` tiene `verifyToken` porque los otros dos son para usuarios que todavía no tienen token.

También tiene la documentación Swagger que genera la UI interactiva en `/api-docs`.

---

### controller.js
`apps/api/src/features/auth/controller.js`

Recibe el request HTTP, valida el formato y llama al service. No toca la base de datos.

---

**login**

- Valida que vengan `email` y `password` → si faltan: 400
- Llama a `authService.login()`
- Si el service lanza `CREDENTIALS_INVALID` → 401
- Otro error → 500

---

**register**

- Valida `nombre`, `email`, `password`
- Valida mínimo 6 caracteres en la contraseña
- Si `tipo_registro === 'empleado'` y no hay `codigo_invitacion` → 400
- Llama a `authService.register()`
- Errores específicos:
  - `EMAIL_EXISTS` → 409
  - `CODIGO_INVALIDO` → 400
  - `ROLE_NOT_FOUND` → 500

---

**me**

- Devuelve `req.user`
- Ese objeto lo inyectó `verifyToken` al decodificar el JWT

---

### service.js
`apps/api/src/features/auth/service.js`

Aquí vive toda la lógica. Dos métodos principales.

---

**login(email, password)**

1. Busca el usuario en BD con JOIN a `roles`
2. Si no existe → lanza `CREDENTIALS_INVALID`
3. Si está inactivo → lanza `USER_INACTIVE`
4. Compara la contraseña con `bcrypt.compare()` contra el hash en BD
5. Actualiza `ultimo_acceso` en BD
6. Normaliza el rol a mayúsculas
7. Genera JWT con: `id`, `rol`, `rol_id`, `local_id`, `email` — expira en 8 horas
8. Registra el evento LOGIN en el historial (silencioso, no bloquea si falla)
9. Retorna `{ token, user }`

---

**register({ nombre, email, password, tipo_registro, codigo_invitacion })**

Tiene dos caminos:

**Si tipo_registro === 'empleado':**

1. Verifica que el email no exista
2. Hashea la contraseña con bcrypt
3. Busca un jefe con ese `codigo_invitacion` activo
4. Si no existe → lanza `CODIGO_INVALIDO`
5. Hereda el `local_id` del jefe
6. Inserta el usuario con rol EMPLEADO
7. Genera JWT con rol `'EMPLEADO'` y `local_id` heredado

**Si tipo_registro === 'jefe':**

1. Verifica que el email no exista
2. Hashea la contraseña
3. Crea un nuevo registro en tabla `locales`
4. Inserta el usuario con rol JEFE y el nuevo `local_id`
5. Genera JWT con rol `'JEFE'` y el nuevo `local_id`

---

**Flujo completo de un login:**

```
Frontend
  → POST /auth/login
    → routes.js: pasa sin middleware
      → controller.js: valida campos
        → service.js: busca usuario, bcrypt, JWT
          → controller.js: responde { token, user }
            → authService.js: guarda en localStorage
              → useAuthStore: guarda en memoria
```

---

*Brasas OS — Documentación interna*

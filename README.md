# Brasas-OS v2 🥩🔥

Sistema integral de gestión para restaurantes diseñado para optimizar el flujo de pedidos, el control de inventario y la administración de usuarios. Este proyecto utiliza una arquitectura moderna basada en el **Stack PERN** para ofrecer una experiencia rápida, segura y escalable [6, 7].

## 🚀 Descripción del Proyecto
Brasas-OS v2 soluciona los problemas comunes de coordinación en establecimientos gastronómicos mediante una interfaz reactiva que conecta el salón con la cocina en tiempo real [8]. El sistema permite:
- **Gestión de Pedidos:** Registro completo de comandas con detalles específicos por plato [9].
- **Control de Stock:** Actualización automática del inventario al procesar ventas [10, 11].
- **Autenticación:** Sistema de registro e inicio de sesión para diferentes roles de usuario [12].

## 🛠️ Tecnologías Principales
- **Frontend:** [React.js](https://reactjs.org/) para una interfaz de usuario modular basada en componentes [13, 14].
- **Backend:** [Node.js](https://nodejs.org/) y [Express.js](https://expressjs.com/) para la lógica del servidor y la creación de una API RESTful [15, 16].
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) gestionado a través de [Supabase](https://supabase.com/) para una persistencia de datos relacional y segura [17, 18].
- **Control de Versiones:** [Git](https://git-scm.com/) para la gestión de cambios y colaboración en GitHub [4, 19].

## 🏗️ Arquitectura del Sistema
El software está estructurado bajo una **Arquitectura en Capas**, lo que facilita el mantenimiento y el bajo acoplamiento entre componentes [20, 21]:

1.  **Capa de Presentación (Frontend):** Interfaces construidas en React que consumen la API mediante peticiones asíncronas (fetch/promises) [22, 23].
2.  **Capa de Lógica de Negocio (Backend):** Servidor Express que procesa las reglas del restaurante, validaciones y rutas de la API [24, 25].
3.  **Capa de Datos:** PostgreSQL para el almacenamiento estructurado de productos, categorías, usuarios y pedidos [26, 27].

## 📦 Instalación y Configuración

### Requisitos
- **Node.js** (Versión LTS instalada) [17, 28].
- Cuenta activa en **Supabase** para la base de datos [29].

### Pasos para levantar el proyecto
1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/JoseJulioGP/Brasas-Os-v2.git
    cd Brasas-Os-v2
    ```

2.  **Instalar dependencias:**
    Ejecuta el comando en la raíz y en las carpetas de las aplicaciones:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Envorno:**
    Crea un archivo `.env` en la **raíz del proyecto** (al mismo nivel que el `.gitignore`) con tus credenciales. Este archivo está protegido por el `.gitignore` para no subir llaves privadas a GitHub [30-32].
    ```env
    SUPABASE_URL=tu_url_del_proyecto
    SUPABASE_KEY=tu_anon_key_publica
    ```

4.  **Iniciar el entorno de desarrollo:**
    ```bash
    npm run dev
    ```

## 📂 Estructura del Repositorio
- `apps/`: Contenedor de las aplicaciones de Frontend y Backend [32, 33].
- `BrasasOS/`: Núcleo y archivos base del sistema [33].
- `package.json`: Configuración de dependencias y scripts del proyecto [34, 35].
- `.gitignore`: Archivos y carpetas excluidos del control de versiones (como `node_modules` y `.env`) [31, 36, 37].

## ✨ Buenas Prácticas Aplicadas
- **Clean Code:** Código legible con nombres descriptivos y funciones de responsabilidad única [9, 38, 39].
- **SOLID:** Principios de diseño para garantizar la escalabilidad del software [9].
- **CORS:** Middleware configurado para permitir la comunicación segura entre el dominio del frontend y el backend [40, 41].
- **Manejo de Errores:** Implementación de bloques `try-catch` para asegurar la estabilidad de la API [10, 42].

-----------------------------------------------------------

by: Jose Gomez, Jhon Bermudez, Joannes Gutierrez, Hector Rios

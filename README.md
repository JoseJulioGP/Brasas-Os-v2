Brasas-OS v2 🥩🔥
Sistema integral de gestión para restaurantes diseñado para optimizar el flujo de pedidos, el control de inventario y la administración de usuarios. Este proyecto utiliza una arquitectura moderna basada en el Stack PERN para ofrecer una experiencia rápida, segura y escalable
.
🚀 Descripción del Proyecto
Brasas-OS v2 soluciona los problemas comunes de coordinación en establecimientos gastronómicos mediante una interfaz reactiva que conecta el salón con la cocina en tiempo real
. El sistema permite:
Gestión de Pedidos: Registro completo de comandas con detalles específicos por plato
.
Control de Stock: Actualización automática del inventario al procesar ventas
.
Autenticación: Sistema de registro e inicio de sesión para diferentes roles de usuario
.
🛠️ Tecnologías Principales
Frontend: React.js con Vite para una interfaz de usuario modular y eficiente
.
Backend: Node.js y Express.js para la lógica del servidor y la creación de una API RESTful
.
Base de Datos: PostgreSQL gestionado a través de Supabase para una persistencia de datos relacional y segura
.
Control de Versiones: Git para la gestión de cambios y colaboración en GitHub
.
🏗️ Arquitectura del Sistema
El software está estructurado bajo una Arquitectura en Capas, lo que facilita el mantenimiento y el bajo acoplamiento entre componentes
:
Capa de Presentación (Frontend): Interfaces construidas en React que consumen la API mediante peticiones asíncronas
.
Capa de Lógica de Negocio (Backend): Servidor Express que procesa las reglas del restaurante (validaciones, cálculos y rutas de API)
.
Capa de Datos: PostgreSQL para el almacenamiento estructurado de productos, categorías, usuarios y pedidos
.
📦 Instalación y Configuración
Requisitos
Node.js (Versión LTS instalada)
.
Cuenta activa en Supabase para la base de datos
.
Pasos para levantar el proyecto
Clonar el repositorio:
Instalar dependencias: Ejecuta el comando en la raíz y en las carpetas de las aplicaciones (frontend/backend):
Configurar Variables de Entorno: Crea un archivo .env en la raíz del proyecto (al mismo nivel que el .gitignore) con tus credenciales de Supabase
:
Iniciar el entorno de desarrollo:
📂 Estructura del Repositorio
apps/: Carpeta contenedora de las aplicaciones de Frontend y Backend
.
BrasasOS/: Núcleo y archivos base del sistema.
package.json: Archivo de configuración con todas las dependencias del stack
.
.gitignore: Configuración para excluir archivos sensibles (como el .env) del repositorio público
.
✨ Buenas Prácticas Aplicadas
Clean Code: Código legible con nombres descriptivos y funciones de responsabilidad única (SRP)
.
SOLID: Principios de diseño para garantizar la escalabilidad del software
.
CORS: Middleware configurado para permitir la comunicación segura entre el dominio del frontend y el backend
.
Manejo de Errores: Implementación de bloques try-catch para asegurar la estabilidad de la API
.

--------------------------------------------------------------------------------
Desarrollado por Jose Gomez, Jhon Bermudez, Joannes Gutierrez y Hector Rios 

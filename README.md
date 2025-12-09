# Task Management System - Frontend

Sistema de gestión de tareas desarrollado con React + TypeScript como parte de la prueba técnica para Desarrollador Semi Senior/Senior.

## Descripción

Aplicación frontend que permite gestionar tareas y estados, con autenticación JWT, filtros avanzados, paginación y detección de conflictos de concurrencia optimista.

## Tecnologías Utilizadas

- **React 19** con TypeScript
- **Vite** como build tool
- **React Router DOM 7** para navegación
- **Axios** para comunicación HTTP
- **CSS Vanilla** para estilos (sin frameworks externos)
- **JWT** para autenticación

## Arquitectura y Decisiones Técnicas

### Estructura del Proyecto

```
src/
├── App.tsx              # Punto de entrada, login y rutas
├── Layout.tsx           # Layout principal con navbar
├── Tasks.tsx            # Lista de tareas con filtros y paginación
├── TaskForm.tsx         # Formulario crear/editar tarea
├── States.tsx           # Lista de estados
├── StateForm.tsx        # Formulario crear/editar estado
├── Modal.tsx            # Modal reutilizable para confirmaciones
├── api.ts               # Cliente HTTP con interceptores JWT
└── styles.css           # Estilos centralizados
```

### Decisiones Técnicas

1. **Sin Redux Toolkit**: Se optó por mantener el estado local en cada componente para simplicidad. Las peticiones HTTP se manejan directamente con Axios.

2. **CSS Vanilla**: Se implementó un sistema de diseño centralizado en `styles.css` con clases reutilizables, evitando dependencias de frameworks CSS pesados.

3. **Componentes Funcionales**: Todo el código usa hooks de React (useState, useEffect) siguiendo las mejores prácticas modernas.

4. **Axios Interceptors**: Se implementaron interceptores para:
   - Agregar automáticamente el token JWT a cada petición
   - Detectar errores 401 y redirigir al login
   - Manejo centralizado de errores HTTP

5. **Modal Personalizado**: Se creó un componente Modal reutilizable con animaciones CSS para reemplazar los alerts/confirms nativos del navegador.

6. **Validaciones del Lado del Cliente**: 
   - Fechas mínimas = hoy
   - Campos requeridos marcados visualmente
   - Estados requeridos antes de crear tareas

## Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Backend API corriendo en http://localhost:5016

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd TaskManagementFrontend

# Instalar dependencias
npm install
```

### Configuración de Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# URL de la API backend
VITE_API_URL=http://localhost:5016/api

# Credenciales para autenticación con la API (obtener del equipo backend)
VITE_API_USER=your_encrypted_api_user
VITE_API_PASSWORD=your_encrypted_api_password

# Credenciales del usuario final para login
VITE_LOGIN_USER=admin
VITE_LOGIN_PASSWORD=secure_password
```

**Importante:**
- `VITE_API_USER` y `VITE_API_PASSWORD` son credenciales encriptadas. Solicitar al equipo backend.
- `VITE_LOGIN_USER` y `VITE_LOGIN_PASSWORD` definen las credenciales del usuario final. Cambiar aquí para crear nuevos usuarios.

### Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Build para Producción

```bash
npm run build
npm run preview
```

## Funcionalidades Implementadas

### Autenticación
- Login con validación local de credenciales
- Obtención automática de token JWT
- Almacenamiento seguro en localStorage
- Redirección automática al expirar sesión

### Gestión de Tareas
- **Listar tareas** con paginación (10 por página)
- **Filtros avanzados**: Título, Estado, Fecha Desde, Fecha Hasta
- **Crear tarea** con validaciones
- **Editar tarea** con detección de conflictos de concurrencia
- **Eliminar tarea** con confirmación mediante modal
- **Visualización clara** del estado de cada tarea

### Gestión de Estados
- **Listar estados** disponibles
- **Crear nuevo estado** con validación de duplicados
- **Editar estado** existente
- **Eliminar estado** con protección (no permite si tiene tareas asociadas)

### Control de Concurrencia Optimista (Bonus Point)
Cuando dos usuarios intentan editar la misma tarea:
1. El sistema detecta el conflicto mediante `RowVersion`
2. Muestra modal informativo: "Another user modified this task. The page will reload with the latest data."
3. Recarga automáticamente los datos actualizados

## Uso del Sistema

### 1. Login
- Acceder a http://localhost:5173
- Ingresar credenciales configuradas en `.env`
- El sistema valida y obtiene token JWT automáticamente

### 2. Navegación
- **Search Tasks**: Lista y filtra tareas existentes
- **Add Task**: Crea una nueva tarea
- **States**: Gestiona los estados disponibles
- **Logout**: Cierra sesión y limpia el token

### 3. Crear Tarea
- Ingresar título (requerido)
- Descripción opcional
- Seleccionar estado (requerido)
- Fecha de vencimiento (opcional, debe ser futura)

### 4. Filtrar Tareas
- Por título (búsqueda parcial)
- Por estado (dropdown)
- Por rango de fechas (desde/hasta)
- Resultados con paginación automática

### 5. Editar/Eliminar
- Cada tarea muestra botones "Edit" y "Delete"
- Edit carga los datos en formulario
- Delete solicita confirmación mediante modal
- Sistema detecta si otro usuario modificó la tarea

## Pruebas de Concurrencia

Para probar la concurrencia optimista:

1. Abrir dos pestañas en http://localhost:5173
2. Iniciar sesión en ambas
3. Navegar a "Search Tasks" en ambas
4. Hacer clic en "Edit" de la misma tarea en ambas pestañas
5. En pestaña 1: Modificar y guardar (éxito)
6. En pestaña 2: Modificar y guardar (detecta conflicto, muestra modal, recarga)

## Diseño y UX

### Paleta de Colores
- **Primario**: #3498db (azul)
- **Éxito**: #27ae60 (verde)
- **Peligro**: #e74c3c (rojo)
- **Secundario**: #95a5a6 (gris)
- **Fondo**: #ecf0f1 (gris claro)

### Características de Diseño
- Responsive para desktop, tablet y móvil
- Cards con efecto hover
- Modales con animaciones suaves
- Botones con estados disabled durante carga
- Iconos de calendario visibles en inputs de fecha
- Navbar fija con navegación clara

## Integración con Backend

### Endpoints Consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/token/authentication | Obtiene token JWT |
| GET | /api/tasks | Lista tareas con filtros y paginación |
| GET | /api/tasks/{id} | Obtiene tarea específica |
| POST | /api/tasks | Crea nueva tarea |
| PUT | /api/tasks/{id} | Actualiza tarea |
| DELETE | /api/tasks/{id} | Elimina tarea |
| GET | /api/states | Lista estados |
| GET | /api/states/{id} | Obtiene estado específico |
| POST | /api/states | Crea nuevo estado |
| PUT | /api/states/{id} | Actualiza estado |
| DELETE | /api/states/{id} | Elimina estado |

### Manejo de Errores

- **401 Unauthorized**: Redirección automática a login
- **404 Not Found**: Mensaje "No encontrado" y recarga de lista
- **409 Conflict**: Modal de concurrencia y recarga de datos
- **400 Bad Request**: Muestra mensaje de error del servidor

## Solución de Problemas

### El servidor no inicia
```bash
rm -rf node_modules
npm install
npm run dev
```

### Error 401 en todas las peticiones
- Verificar que la API backend esté corriendo
- Verificar `VITE_API_URL` en `.env`
- Verificar `VITE_API_USER` y `VITE_API_PASSWORD`

### No puedo iniciar sesión
- Verificar `VITE_LOGIN_USER` y `VITE_LOGIN_PASSWORD` en `.env`
- Reiniciar el servidor después de cambiar `.env`

### Los cambios en .env no se reflejan
```bash
# Detener el servidor (Ctrl+C) y reiniciar
npm run dev
```

## Cumplimiento de Requerimientos

### Requerimientos Obligatorios
- React + TypeScript
- Enrutamiento con react-router-dom
- Componentes reutilizables (Modal, Layout, etc.)
- Formularios con validación
- Estilos responsivos
- Listado con filtros y paginación
- Manejo de errores de la API
- Estados de carga (loading)

### Bonus Points Implementados
- **Concurrencia Optimista**: Detección y notificación de conflictos mediante RowVersion

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Vista previa del build
npm run lint     # Ejecutar linter
```

## Notas de Seguridad

- Token JWT almacenado en localStorage
- Credenciales de API encriptadas en .env
- No se exponen credenciales en el código fuente
- Validación en cliente y servidor
- CORS configurado en backend

## Autor

Desarrollado como parte de la prueba técnica para Desarrollador Semi Senior/Senior.

## Licencia

Este proyecto es de uso educativo y de evaluación técnica.

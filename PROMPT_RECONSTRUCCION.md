# Prompt para Reconstruir "Gestor de Flota GPS"

## Resumen del Proyecto

Aplicación web monolítica (HTML/CSS/JS vanilla) para monitoreo de flota de vehículos en tiempo real, conectada a un servidor Traccar GPS. Sirve mediante un proxy Node.js que reenvía peticiones API.

---

## Arquitectura

```
fleet-manager/
├── index.html              # HTML principal con todas las secciones
├── proxy-server.js         # Proxy Node.js (puerto 3000 → Traccar 8082)
├── iniciar-flota.bat       # Script de inicio Windows
├── instalar-en-otro-equipo.bat  # Script de instalación en nueva máquina
└── assets/
    ├── css/
    │   └── main.css        # Todos los estilos (light + dark mode)
    └── js/
        └── app.js          # Toda la lógica de la aplicación
```

---

## Variables Globales

```javascript
// Configuración
const config = {
  baseUrl: "",        // URL del servidor Traccar
  user: "",           // Usuario Traccar
  password: "",       // Contraseña Traccar
  token: "",          // Token de autenticación
  intervalo: 15,      // Intervalo de actualización en segundos
  lat: 6.2442,        // Latitud inicial del mapa
  lng: -75.5812,      // Longitud inicial del mapa
  zoom: 12,           // Nivel de zoom del mapa
  radioAlertas: 2000, // Radio para alertas en metros
  consumoEstimado: 8, // Consumo estimado en litros/100km
  velMaxima: 80       // Velocidad máxima permitida en km/h
};

// Estado
let posicionActual = {};
let idSeleccionado = null;
let segundosRestantes = 0;
let timer = null;
let mapa = null;
let.polylines = [];
let marcadorVehiculo = {};
let marcadorUsuario = null;
let geozonas = [];
let geozoneEditando = null;
let dibujandoGeozona = false;
let dibujarCircle = null;
let poiEditando = null;
let listaConductores = [];
let modoDibujo = null;
let modoOscuro = false;
let alarmaVelocidadActiva = false;
let overlayRuta = null;
let marcadorInicio = null;
let marcadorFin = null;
let rutaHistorial = [];
let posiciones = [];
let conductores = [];
let alarmas = [];
let eventos = [];
let ultimoTiempo = {};
let maxVelocidades = {};
let sumaVelocidades = {};
let cuentaVelocidades = {};
let tiemposQuieto = {};
let tiemposMovimiento = {};
```

---

## Estructura HTML (index.html)

### Topbar (barra superior)
- Logo "Fleet Manager" con icono
- Botón usuario
- Selector de servidor (dropdown)
- Botón conexión
- Botón modo oscuro (🌙/☀️)

### Sidebar (navegación lateral)
- Panel de control
- Alarmas y eventos
- Configuración
- Geozonas
- Historial de rutas
- POIs (Puntos de interés)
- Gestión de conductores
- Fuera de servicio
- Datos de prueba
- Acerca de
- Cerrar sesión

### Sección Principal

#### 1. Panel de control
- Estadísticas: Total, En movimiento, Detenidos, Sin datos
- Filtros de búsqueda (nombre, estado, conductor)
- Grid de vehículos con tarjetas

#### 2. Tarjeta de vehículo (cada una)
- Nombre y ID
- Badge de estado (Movimiento/Detenido/Offline/Sin datos)
- Coordenadas GPS
- Velocidad actual
- Dirección
- Altitud
- Última actualización
- Tiempo quieto (si está detenido)
- Barra de velocidad máxima con estadísticas (máx/promedio)
- Conductor asignado (select)
- Selectores de consumo (diario/semanal/mensual)
- Botón detalle
- Botón historial de ruta

#### 3. Mapa (Leaflet)
- Mapa con OpenStreetMap tiles
- Marcadores de vehículos con iconos coloreados según estado
- Círculos de geozonas
- Marcadores de POIs con iconos personalizados
- Líneas de ruta (polyline)
- Marcador de usuario (posición actual)
- Click en mapa para crear geozona (radio)
- Popup con info del vehículo al hacer click

#### 4. Alarmas y eventos
- Lista de eventos con iconos y colores
- Filtros por tipo
- Exportar eventos
- Alarmas de velocidad excedida

#### 5. Configuración
- URL del servidor
- Usuario/Contraseña
- Intervalo de actualización
- Latitud/Longitud inicial
- Zoom del mapa
- Radio de alertas
- Consumo estimado
- Velocidad máxima

#### 6. Geozonas
- Crear geozona (click en mapa → arrastrar radio → confirmar)
- Editar nombre
- Eliminar geozona
- Ver geozonas en mapa (círculos)

#### 7. POIs (Puntos de interés)
- Crear POI (click en mapa)
- Tipos: Pin, Bodega, Cliente, Gasolinera, Taller, Oficina
- Iconos personalizados por tipo
- Eliminar POI

#### 8. Gestión de conductores
- Agregar conductor (nombre + ID)
- Editar conductor
- Eliminar conductor
- Asignar conductor a vehículo

#### 9. Historial de rutas
- Selector de vehículo
- Fecha/hora inicio
- Fecha/hora fin
- Botón "Cargar ruta"
- Dibuja polylínea en mapa
- Marcador verde = inicio
- Marcador rojo = fin
- Estadísticas: posiciones, distancia, horario

---

## Funcionalidades JavaScript (app.js)

### API / Conexión
```javascript
// Autenticación con token o usuario/contraseña
function authHeaders() {
  // Si hay token: { "Authorization": "Bearer " + token }
  // Si no: { "Authorization": "Basic " + btoa(user + ":" + password) }
}

// GET request a Traccar API
function api(path) {
  // fetch(baseUrl + "/api" + path, { headers: authHeaders() })
}

// POST request
function apiPost(path, body) {
  // fetch(baseUrl + "/api" + path, { method: "POST", headers, body: JSON.stringify(body) })
}

// DELETE request
function apiDelete(path) {
  // fetch(baseUrl + "/api" + path, { method: "DELETE", headers })
}
```

### Gestión de UI
```javascript
function $(sel) { return document.querySelector(sel) }
function $$(sel) { return document.querySelectorAll(sel) }
function show(el) { el.hidden = false }
function hide(el) { el.hidden = true }
function showSection(id) {
  // Ocultar todas las secciones
  // Mostrar solo la seleccionada
}
```

### Persistencia (localStorage)
```javascript
const STORAGE_KEYS = {
  config: "flota_config_v1",
  consumos: "flota_consumos_v1",
  conductores: "flota_conductores_v1",
  velocidades: "flota_velocidades_v1",
  oscuro: "flota_modo_oscuro",
  pois: "flota_pois",
  listaConductores: "flota_lista_conductores"
};

function guardar(key, data) { localStorage.setItem(key, JSON.stringify(data)) }
function cargar(key) { return JSON.parse(localStorage.getItem(key)) }
```

### Conexión y polling
```javascript
function iniciarConexion() {
  // Cargar configuración
  // Iniciar timer de actualización
  // Primera carga de datos
}

function actualizar() {
  // GET /api/devices
  // GET /api/positions (últimas por dispositivo)
  // Actualizar UI
  // Detectar alarmas
  // Actualizar mapa
}
```

### Tarjetas de vehículos
```javascript
function pintarVehiculos() {
  // Para cada dispositivo:
  //   - Determinar estado (moving/stopped/offline/nodata)
  //   - Obtener posición más reciente
  //   - Calcular tiempo quieto
  //   - Renderizar tarjeta HTML
}

function estadoEquipo(d, pos) {
  // "En movimiento" si lastUpdate < 5min && speed > 0
  // "Detenido" si lastUpdate < 5min && speed == 0
  // "Sin datos" si no hay posición
  // "Sin conexión" si lastUpdate > 5min
}

function tiempoQuieto(segundos) {
  // Formatear HH:MM:SS o "En movimiento"
}
```

### Mapa (Leaflet)
```javascript
function iniciarMapa() {
  // L.map("mapa").setView([lat, lng], zoom)
  // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
}

function pintarMapa() {
  // Para cada vehículo con posición:
  //   - Crear/actualizar marcador con icono coloreado
  //   - Popup con info del vehículo
}

function actualizarPosicionMapa(deviceId, pos) {
  // Mover marcador del vehículo
  // Actualizar popup
}

function ajustarVista() {
  // Ajustar zoom para ver todos los marcadores
}

// Iconos coloreados según estado
function iconoVehiculo(estado) {
  // Verde = movimiento
  // Azul = detenido
  // Amarillo = offline
  // Gris = sin datos
}
```

### Geozonas
```javascript
function renderGeozonas() {
  // Renderizar lista de geozonas en el panel
}

function dibujarGeozonas() {
  // Para cada geozona: dibujar círculo en mapa
  // L.circle([lat, lng], { radius, color, fillOpacity })
}

function crearGeozona(lat, lng, radio) {
  // Abrir modal con coordenadas pre-rellenadas
}

function guardarGeozona() {
  // Guardar en array geozonas[]
  // Persistir en localStorage
}

function eliminarGeozona(id) {
  // Eliminar del array
  // Redibujar mapa
}

// Modo dibujo en mapa
function activarModoDibujo() {
  // Al hacer click en mapa:
  //   - Punto central = click
  //   - Arrastrar = radio
  //   - Soltar = confirmar
}
```

### POIs (Puntos de interés)
```javascript
function renderPois() {
  // Renderizar lista de POIs en el panel
}

function dibujarPois() {
  // Para cada POI: crear marcador con icono personalizado
  // L.marker([lat, lng], { icon: L.divIcon({ className: "poi-icon", html: icono }) })
}

function abrirModalPoi(lat, lng) {
  // Mostrar modal con coordenadas
  // Selector de tipo
}

function guardarPoi() {
  // Agregar a array pois[]
  // Persistir
  // Redibujar
}

function eliminarPoi(id) {
  // Eliminar del array
  // Redibujar
}

// Iconos por tipo:
const ICONOS_POI = {
  pin: "📍",
  bodega: "🏭",
  cliente: "👤",
  gasolinera: "⛽",
  taller: "🔧",
  oficina: "🏢"
};
```

### Conductores
```javascript
function rellenarSelectoresConductores() {
  // Llenar select de conductores en tarjetas de vehículo
}

function asignarConductor(deviceId, conductorId) {
  // Asignar conductor al vehículo
  // Persistir en localStorage
}

function renderConductores() {
  // Renderizar lista de conductores en panel
}

function agregarConductor() {
  // Abrir modal
}

function guardarConductor() {
  // Agregar a listaConductores[]
  // Persistir
}

function editarConductor(id) {
  // Cargar datos en modal
}

function eliminarConductor(id) {
  // Eliminar de la lista
  // Persistir
}
```

### Historial de rutas
```javascript
function rellenarSelectorHistorial() {
  // Llenar select de vehículos en sección historial
}

function cargarHistorial() {
  // Obtener vehículo, fecha inicio, fecha fin
  // GET /api/positions?deviceId=X&from=ISO&to=ISO
  // Dibujar polylínea en mapa
  // Marcador verde = inicio
  // Marcador rojo = fin
  // Calcular distancia
  // Mostrar estadísticas
}

function limpiarHistorial() {
  // Eliminar polyline y marcadores del mapa
}
```

### Estadísticas de velocidad
```javascript
function detectarExcesoVelocidad() {
  // Para cada vehículo:
  //   - Si velocidad > velMaxima: mostrar alerta
  //   - Actualizar maxVelocidades[deviceId]
  //   - Acumular sumaVelocidades[deviceId]
  //   - Incrementar cuentaVelocidades[deviceId]
}

function mostrarEstadisticaVelocidad(deviceId) {
  // Mostrar max y promedio en tarjeta
}
```

### Tiempo quieto
```javascript
function actualizarTiempoQuieto() {
  // Para cada vehículo:
  //   - Si está detenido: incrementar tiempo
  //   - Si se mueve: reiniciar tiempo
}

function tiempoQuieto(segundos) {
  // Formatear: "1h 23min" o "En movimiento"
}
```

### Alarms
```javascript
function renderAlarmas() {
  // Renderizar lista de eventos/alarmas
}

function setAlerta(tipo, titulo, mensaje) {
  // Agregar a array alarmas[]
  // Mostrar toast
}

function detectarAlarmaVelocidad(deviceId, velocidad) {
  // Si velocidad > velMaxima:
  //   - Crear alarma
  //   - Mostrar toast
  //   - Agregar a eventos
}

function exportarEventos() {
  // Descargar como CSV
}
```

### Consumo de combustible
```javascript
function calcularConsumo(distancia, periodo) {
  // distancia * (consumoEstimado / 100)
  // Retornar litros estimados
}

function renderConsumo(deviceId, periodo) {
  // Mostrar litros calculados
}
```

### Modo oscuro
```javascript
function toggleModoOscuro() {
  // Cambiar clase "modo-oscuro" en body
  // Actualizar botón 🌙/☀️
  // Persistir en localStorage
}
```

### Filtros
```javascript
function filtrarVehiculos() {
  // Obtener valores de filtros
  // Filtrar array dispositivos[]
  // Repintar tarjetas
}
```

---

## Estilos CSS (main.css)

### Variables (CSS Custom Properties)
```css
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #eff6ff;
  --bg: #f1f5f9;
  --surface: #ffffff;
  --surface-2: #f8fafc;
  --text: #0f172a;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --success: #16a34a;
  --warning: #d97706;
  --danger: #dc2626;
  --info: #2563eb;
  --neutral: #64748b;
  --sidebar-bg: #0f172a;
  --sidebar-text: #cbd5e1;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 1px 3px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.05);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.18);
  --transition: 0.2s ease;
}

.modo-oscuro {
  --primary: #3b82f6;
  --primary-dark: #60a5fa;
  --primary-light: #1e3a5f;
  --bg: #0f172a;
  --surface: #1e293b;
  --surface-2: #334155;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --border: #334155;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;
  --neutral: #94a3b8;
  --sidebar-bg: #020617;
  --sidebar-text: #e2e8f0;
}
```

### Componentes principales
- `.app-shell` - Layout flex
- `.topbar` - Barra superior sticky
- `.sidebar` - Panel lateral sticky
- `.page` - Contenido principal
- `.card` - Tarjetas genéricas
- `.vehicle` - Tarjeta de vehículo con borde superior de color
- `.badge` - Badges de estado (pill)
- `.modal-overlay` + `.modal` - Modales con backdrop blur
- `.toast` - Notificaciones
- `.map-wrap` - Contenedor del mapa
- `.field` - Campos de formulario
- `.button` - Botones (filled, outlined, icon)

### Responsive
```css
@media (max-width: 900px) {
  .sidebar → horizontal scroll
  .page → padding reducido
}

@media (max-width: 640px) {
  .form-grid → 1 columna
  .vehicle__stats → 1 columna
}
```

---

## Proxy Server (proxy-server.js)

```javascript
const http = require("http");
const httpProxy = require("http-proxy");
const fs = require("fs");
const path = require("path");

// Proxy a Traccar
const proxy = httpProxy.createProxyServer({
  target: "http://localhost:8082",
  changeOrigin: true
});

const server = http.createServer((req, res) => {
  // Si es /api → proxy a Traccar
  if (req.url.startsWith("/api")) {
    return proxy.web(req, res);
  }
  // Si no → servir archivos estáticos
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
  let ext = path.extname(filePath);
  let contentType = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml"
  }[ext] || "text/plain";
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

server.listen(3000, () => {
  console.log("Proxy en http://localhost:3000");
});
```

---

## Scripts de Inicio (iniciar-flota.bat)

```batch
@echo off
title Gestor de Flota - Iniciando...

:: Verificar Traccar
sc query TraccarService | find "RUNNING" >nul
if errorlevel 1 (
    echo Iniciando Traccar...
    net start TraccarService
)

:: Verificar Tailscale
tailscale status >nul 2>&1
if errorlevel 1 (
    echo Tailscale no está conectado
)

:: Iniciar proxy
echo Iniciando proxy...
start /min node proxy-server.js

:: Abrir navegador
timeout /t 2 >nul
start http://localhost:3000

echo.
echo ========================================
echo   Gestor de Flota iniciado
echo   http://localhost:3000
echo ========================================
pause
```

---

## Script de Instalación (instalar-en-otro-equipo.bat)

```batch
@echo off
title Instalador de Gestor de Flota

:: 1. Instalar Node.js
echo Instalando Node.js...
winget install OpenJS.NodeJS.LTS

:: 2. Instalar dependencias del proxy
echo Instalando dependencias...
cd /d "%~dp0"
npm init -y
npm install http-proxy

:: 3. Instalar Traccar
echo Descargando Traccar...
:: (URL de descarga de Traccar para Windows)
:: Ejecutar instalador

:: 4. Instalar Tailscale
echo Instalando Tailscale...
winget install Tailscale.Tailscale

:: 5. Copiar archivos
echo Copiando archivos...
xcopy /E /I /Y "%~dp0" "C:\FleetManager"

:: 6. Crear acceso directo en escritorio
echo Creando acceso directo...
echo @echo off > "%USERPROFILE%\Desktop\Gestor de Flota.bat"
echo cd /d "C:\FleetManager" >> "%USERPROFILE%\Desktop\Gestor de Flota.bat"
echo call iniciar-flota.bat >> "%USERPROFILE%\Desktop\Gestor de Flota.bat"

echo.
echo ========================================
echo   Instalación completada
echo   Reinicie el equipo
echo ========================================
pause
```

---

## Funcionalidades Clave a Implementar

### 1. Conexión a Traccar API
- Autenticación con token Bearer o Basic Auth
- Endpoints: /api/devices, /api/positions, /api/events
- Polling con intervalo configurable

### 2. Tarjetas de Vehículos
- Badge de estado con color
- Coordenadas, velocidad, dirección, altitud
- Tiempo quieto formateado
- Estadísticas de velocidad (máx/promedio)
- Selector de conductor
- Consumo de combustible estimado

### 3. Mapa Leaflet
- Marcadores de vehículos con iconos coloreados
- Popups con información
- Círculos de geozonas
- Marcadores de POIs con iconos personalizados
- Polylíneas de historial de rutas
- Click para crear geozona/POI

### 4. Geozonas
- Crear con click y arrastrar (radio)
- Editar nombre
- Eliminar
- Persistir en localStorage

### 5. POIs
- Crear con click en mapa
- Tipos: pin, bodega, cliente, gasolinera, taller, oficina
- Iconos personalizados
- Eliminar

### 6. Conductores
- CRUD completo
- Asignar a vehículo
- Persistir en localStorage

### 7. Historial de Rutas
- Seleccionar vehículo y rango de tiempo
- Dibujar polylínea
- Marcadores inicio/fin
- Estadísticas (distancia, posiciones, horario)

### 8. Alarms
- Detección de exceso de velocidad
- Toast de notificación
- Lista de eventos
- Exportar a CSV

### 9. Modo Oscuro
- Toggle en header
- Persistir en localStorage
- Variables CSS adaptadas

### 10. Filtros
- Por nombre/ID
- Por estado (movimiento/detenido/offline)
- Por conductor

---

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3 (Custom Properties), JavaScript ES5 (sin frameworks)
- **Mapa**: Leaflet.js con OpenStreetMap tiles
- **Backend**: Node.js con http-proxy
- **GPS Server**: Traccar
- **Persistencia**: localStorage
- **Red**: Tailscale (acceso remoto)
- **OS**: Windows

---

## Datos de Prueba

```javascript
// Coordenadas iniciales (Medellín, Colombia)
lat: 6.2442
lng: -75.5812

// Credenciales Traccar
user: jhoncalderonvargas@gmail.com
password: 2095
```

---

## Notas Importantes

1. **Sin dependencias externas** - Todo vanilla JS, sin frameworks
2. **Responsive** - Funciona en desktop y móvil
3. **Offline** - Persiste datos en localStorage
4. **Proxy** - Reenvía /api a Traccar (CORS)
5. **Tailscale** - Acceso remoto sin port forwarding
6. **Modo oscuro** - Variables CSS dinámicas
7. **Toasts** - Notificaciones feedback
8. **Modales** - Formularios CRUD

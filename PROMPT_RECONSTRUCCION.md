# Prompt Maestro — Gestor de Flota GPS (FLOTA)

## Resumen del Proyecto

Aplicación web monolítica (HTML/CSS/JS vanilla, sin frameworks) para monitoreo de flota de vehículos en tiempo real, conectada a un servidor **Traccar GPS**. Se sirve mediante un proxy Node.js que reenvía peticiones API y evita CORS. Ubicación base: Medellín, Colombia.

---

## Arquitectura de Archivos

```
fleet-manager/
├── index.html                    # HTML principal con todas las secciones y modales
├── icono-flota.svg               # Icono SVG de la marca (pin + vehículo)
├── proxy-server.js               # Proxy Node.js (puerto 3000 → Traccar 8082)
├── iniciar-flota.bat             # Script de inicio Windows
├── instalar-en-otro-equipo.bat   # Script de instalación en nueva máquina
├── PROMPT_RECONSTRUCCION.md      # Este documento
└── assets/
    ├── css/
    │   └── main.css              # Todos los estilos (light + dark mode, responsive)
    └── js/
        └── app.js                # Toda la lógica de la aplicación (IIFE "use strict")
```

---

## Variables Globales (localStorage)

| Clave | Uso |
|---|---|
| `flota_config_v1` | Configuración de conexión (URL, auth, intervalo, límites) |
| `flota_consumos_v1` | Consumo L/100km personalizado por vehículo |
| `flota_conductores_v1` | Mapa vehicleId → nombre del conductor |
| `flota_velocidades_v1` | Historial de velocidades (máx/prom) por vehículo |
| `flota_modo_oscuro` | Booleano para modo oscuro |
| `flota_pois` | Array de puntos de interés guardados |
| `flota_hospitales_editados` | Coordenadas editadas de hospitales |
| `flota_lista_conductores` | Lista de nombres de conductores disponibles |

### Configuración por defecto

```javascript
var CONFIG_POR_DEFECTO = {
  baseUrl: "http://localhost:3000",
  authType: "basic",       // "basic" | "token"
  token: "",
  user: "",
  password: "",
  deviceIds: [],           // Vacío = todos los dispositivos
  refreshSec: 15,
  consumoMedio: 7,         // L/100km
  precioCombustible: 16000,// COP/L
  limiteVelocidad: 80      // km/h
};
```

---

## Estructura HTML (index.html)

### Topbar (barra superior sticky)
- **Logo**: SVG `icono-flota.svg` (pin de ubicación con vehículo) + texto "FLOTA" + subtítulo "Gestor de flota · GPS Traccar"
- **Usuario**: Botón modo oscuro (🌙), avatar "OP", nombre "Operador de flota", rol "Administrador"

### Sidebar (navegación lateral sticky, 232px)
10 secciones con iconos:
- ⌂ Panel
- ◈ Vehículos
- ⌖ Mapa
- ▶ Historial
- ⚠ Alarmas
- 📊 Reportes
- ◎ Geozonas
- 🏥 Hospitales
- ⚙ Configuración (abre modal)
- 👤 Conductores (abre modal)

### Main Content (.page, max-width: 1250px)

**Separación entre secciones**: `.page > section + section` tiene `border-top: 1px solid var(--border)` + `padding-top: 2rem` + `margin-top: 0.5rem`

#### 1. Panel de flota (header)
- Título "Panel de flota" + descripción
- Indicador de conexión (dot animado + texto)
- Botón "Actualizar" + Botón "Configuración"

#### 2. Alerta inicial
- Alerta warning oculta por defecto, se muestra si no hay configuración

#### 3. Stats Grid (5 cards auto-fit, min 180px)
- Vehículos (total + IDs)
- En línea
- En movimiento
- Distancia de hoy (km)
- Combustible hoy (L)

#### 4. Sección Vehículos
- Filtros: búsqueda por texto, select de estado, select de conductor
- Grid responsive (`minmax(280px, 1fr)`) de tarjetas de vehículo

#### 5. Tarjeta de vehículo (cada una)
- **Header**: Nombre del vehículo + badges en línea (estado, SOS, velocidad excesiva)
  - Badges con `flex-wrap: nowrap`, `gap: 0.3rem`, `font-size: 0.65rem`
  - Badge estado (`.badge--estado`): `font-size: 0.8125rem` (25% más grande)
- **POI cercano**: Chip con POI más cercano y distancia
- **Stats compactos**: Velocidad + Conductor (grid 2 columnas)
- **Acciones**: Botón "＋ Ver detalles" (abre modal) + "Ver en mapa"
- **Borde de estado**: `border-left: 7px solid` con color según estado
- **Gradiente de fondo** según estado:
  - `--moving` / `--stopped`: verde con `::before` "ONLINE"
  - `--offline`: rojo con `::before` "OFFLINE"
  - `--nodata`: gris

#### 6. Sección Mapa
- Leaflet 1.9.4 con OpenStreetMap
- Control de capas (posición absoluta, top-right):
  - 🚗 Vehículos (checked)
  - ◎ Geozonas (checked)
  - 📍 POIs (checked)
  - 🏥 Hospitales
  - ⭕ Cobertura
  - 🛤️ Historial (checked)
- Altura fija: 420px

#### 7. Sección Historial
- Card con formulario: selector vehículo, datetime-local desde/hasta, botón "Cargar ruta"
- Barra de reproducción: play/pause, slider, velocidad (1x-20x)
- Muestra info de la ruta (distancia, posiciones, duración)

#### 8. Sección Alarmas
- Badge con contador de alarmas
- Botón "Limpiar"
- Lista de eventos en `.stack-eventos`
- Cada evento: badge de tipo + texto + timestamp ("hace 5 min · 15/09/26 14:30")
- **Auto-eliminación**: Eventos con más de 2 horas se filtran en cada render
- **Acumulación**: Los eventos se acumulan entre refreshes (no se reemplazan)

#### 9. Sección Reportes
- Formulario: datetime-local desde/hasta, select tipo (resumen/trayectos/velocidad/paradas)
- Botones: Generar, CSV, PDF
- Tabla de resultados con `table-report`

#### 10. Sección Geozonas
- Botón "+ Nueva geozona"
- Grid de cards de geozonas

#### 11. Sección POIs
- Botón "+ Nuevo POI"
- Grid de cards de POIs

#### 12. Sección Hospitales
- **Header en línea**: Título + botón "Mostrar en mapa" + select radio cobertura (3-15 km)
- **Resumen compacto** (`.hospital-summary`): Card blanca con borde `var(--border)`
  - Contenido: Total sedes + Total camas + Chips por tipo
  - Botón ＋ a la derecha para expandir/colapsar lista completa
- **Lista expandible**: Grid de cards de hospitales (oculto por defecto)

### Modales

1. **Configuración** (`#modal`): URL, auth (basic/token), IDs, intervalo, consumo, precio, velocidad
2. **Geozona** (`#modal-geozona`): Nombre, descripción, posición, radio, aplicar a
3. **Conductores** (`#modal-conductores`): Lista CRUD de conductores
4. **POI** (`#modal-poi`): Nombre, tipo, coordenadas
5. **Hospital** (`#modal-hospital`): Nombre, tipo, dirección, teléfono, coordenadas
6. **Detalles vehículo** (`#modal-vehiculo`, max-width 640px): Grid 3 columnas de stats + metadata + referencias cercanas

### Toast
- Posición: bottom-right, z-index 70
- Variantes: error (rojo), success (verde), info (azul)
- Animación: slide up

---

## Lógica JavaScript (app.js)

### Estructura
- IIFE con `"use strict"`
- Variables de estado globales dentro de la IIFE
- Helper `$ = (s) => document.querySelector(s)`

### Funciones Principales

#### API / Conexión
- `llamarApi(path)`: GET a `config.baseUrl + "/api" + path` con headers (Basic auth o Bearer token)
- `authHeaders()`: Retorna headers de autenticación según `config.authType`

#### Ciclo de vida
- `iniciar()`: Se llama en `DOMContentLoaded`, configura event listeners
- `refrescar()`: Ciclo principal cada `config.refreshSec` segundos
  1. `Promise.all([/devices, /positions])`
  2. Para cada dispositivo: `llamarApi(/reports/route)` para calcular distancia del día
  3. `enriquecer()` para cada vehículo con posición
  4. `detectarSos(posiciones)`
  5. `Promise.allSettled([cargarGeozonas(), cargarEventos()])`
  6. `mostrarResultados()`

#### Enriquecimiento de vehículos
- `enriquecer(dispositivo, posicion, distanciaMetros)`: Retorna objeto con:
  - id, nombre, uniqueId, estado, velocidad (nudos→km/h × 1.852), encendido, sos, consumo, litros, costo, lat/lon, curso, dirección, hora, distancia, tienePosicion
- `estadoVehiculo(d, p)`: Determina tipo (moving/stopped/offline/nodata) basado en:
  - Sin posición → nodata/offline
  - Posición > 5 min → offline
  - Velocidad > 1 km/h → moving
  - Velocidad ≤ 1 km/h → stopped

#### Renderizado
- `pintarEstadisticas()`: Actualiza los 5 cards de stats
- `pintarVehiculos()`: Genera HTML de tarjetas con `filtrarVehiculos()` → `tarjeta(v)`
- `pintarMapa()`: Actualiza marcadores Leaflet, popups, ajusta vista
- `renderAlarmas()`: Filtra eventos > 2h, concatena `eventosSos + eventos`, renderiza
- `renderHospitales()`: Genera resumen (sedes, camas, tipos) + lista expandible

#### Funciones de tiempo
- `horaLocal(iso)`: HH:MM
- `fechaHoraLocal(iso)`: DD/MM/YY HH:MM
- `desdeHace(iso)`: "hace X min/horas"
- `tiempoQuietoHtml(id)`: Tiempo que lleva detenido un vehículo

#### Velocidad
- `registrarVelocidad(id, vel)`: Acumula máx y promedio en `historialVelocidades`
- `estadisticasVelocidad(id)`: Retorna `{ max, promedio }`
- `detectarExcesoVelocidad()`: Toast si supera `config.limiteVelocidad`

#### Mapa
- `inicializarMapa()`: Leaflet con OpenStreetMap
- `pintarMarcadores()`: Crea/actualiza marcadores con iconos coloreados por estado
- `ajustarVista()`: Fit bounds de todos los marcadores
- Marcadores de geozonas (círculos), POIs (divIcon con emoji), hospitales, cobertura

#### Geozonas
- Persistencia en localStorage
- Crear con modal o dibujar en mapa
- Dibujar como `L.circle` en mapa
- Toggle de visibilidad por capa

#### POIs
- Persistencia en localStorage
- Tipos con iconos: pin 📍, bodega 🏭, cliente 👤, gasolinera ⛽, taller 🔧, oficina 🏢
- Marcadores con `L.divIcon`

#### Hospitales
- Array hardcoded con 15+ hospitales de Medellín
- Cada hospital: id, nombre, tipo, dirección, teléfono, camas, lat, lon, especialidades
- Edición de coordenadas guardada en localStorage
- Cobertura por radio configurable (3-15 km)
- Resumen: sedes, camas, tipos con chips

#### Conductores
- CRUD completo con modales
- Asignación a vehículos via select en tarjeta
- Persistencia en localStorage

#### Historial de rutas
- Selector de vehículo + rango de tiempo
- Dibuja polylínea en mapa
- Marcador verde (inicio) + rojo (fin)
- Barra de reproducción con velocidad ajustable (1x-20x)

#### Reportes
- 4 tipos: resumen, trayectos, velocidad, paradas
- **Trayectos**: Tabla con #, Inicio (fecha+hora), Fin (fecha+hora), Duración, Distancia, Vel máx/prom, Paradas
- Exportación a CSV

#### Alarms y Eventos
- `cargarEventos()`: Consulta API `/reports/events`, **acumula** eventos nuevos sin reemplazar
- `eventosSos`: Detectados de `attributes.alarm` en posiciones
- Filtrado automático: eventos > 2 horas se eliminan en cada render
- Botón "Limpiar": Resetea `eventos`, `eventosSos` e `idsVistos`

#### Notificaciones
- `mostrarToast(msg, tipo)`: Muestra toast con auto-hide
- `notificarEvento(e)`: Toast para eventos nuevos (geofence/SOS)
- `setAlerta(tipo, titulo, msg, btnTexto, btnAccion)`: Alerta inline

#### Persistencia
- `cargarConfig()` / `guardarConfig(cfg)`: JSON en localStorage
- `cargarConsumos()` / `guardarConsumos()`: Mapa id→consumo
- `cargarConductores()` / `guardarConductores()`: Mapa id→nombre
- `cargarVelocidades()` / `guardarVelocidades()`: Historial de vel
- `cargarPois()` / `guardarPois()`: Array de POIs

#### Modo Oscuro
- Toggle clase `.modo-oscuro` en `<body>`
- Persistencia en localStorage
- Botón 🌙/☀️ en topbar

#### Filtros
- `filtrarVehiculos()`: Filtra por nombre/ID, estado, conductor
- Actualiza grid en tiempo real

---

## Estilos CSS (main.css)

### Variables CSS (Custom Properties)

**Tema claro** (`:root`):
```css
--primary: #2563eb;        --primary-dark: #1d4ed8;    --primary-light: #eff6ff;
--bg: #f1f5f9;             --surface: #ffffff;          --surface-2: #f8fafc;
--text: #0f172a;           --text-muted: #64748b;       --border: #e2e8f0;
--success: #16a34a;        --success-light: #dcfce7;
--warning: #d97706;        --warning-light: #fef3c7;
--danger: #dc2626;         --danger-light: #fee2e2;
--info: #2563eb;           --info-light: #dbeafe;
--neutral: #64748b;        --neutral-light: #f1f5f9;
--sidebar-bg: #0f172a;     --sidebar-text: #cbd5e1;    --sidebar-muted: #64748b;
--radius: 12px;            --radius-sm: 8px;
--shadow: 0 1px 3px rgba(15,23,42,.08), 0 4px 12px rgba(15,23,42,.05);
--shadow-lg: 0 12px 32px rgba(15,23,42,.18);
--transition: 0.2s ease;
```

**Tema oscuro** (`.modo-oscuro`):
```css
--primary: #3b82f6;        --primary-dark: #60a5fa;    --primary-light: #1e3a5f;
--bg: #0f172a;             --surface: #1e293b;          --surface-2: #334155;
--text: #f1f5f9;           --text-muted: #94a3b8;       --border: #334155;
--success: #22c55e;        --success-light: #14532d;
--warning: #f59e0b;        --warning-light: #78350f;
--danger: #ef4444;         --danger-light: #7f1d1d;
--info: #3b82f6;           --info-light: #1e3a5f;
--neutral: #94a3b8;        --neutral-light: #334155;
--sidebar-bg: #020617;     --sidebar-text: #e2e8f0;    --sidebar-muted: #94a3b8;
--shadow: 0 1px 3px rgba(0,0,0,.3), 0 4px 12px rgba(0,0,0,.2);
--shadow-lg: 0 12px 32px rgba(0,0,0,.4);
```

### Componentes Principales

| Clase | Uso |
|---|---|
| `.app-shell` | Layout flex columna, min-height 100vh |
| `.topbar` | Sticky top, z-index 30, flex between |
| `.brand` | Logo + texto, inline-flex |
| `.brand__icon` | SVG 40×40, border-radius 10px |
| `.sidebar` | 232px, sticky, bg oscuro, nav vertical |
| `.nav-link` | Flex, gap 0.7rem, radius-sm, hover bg blanco 8% |
| `.nav-link[aria-current="page"]` | bg primary, color white |
| `.page` | Flex 1, padding 1.5rem 2rem, max-width 1250px |
| `.page > section + section` | border-top + padding-top para separación |
| `.card` | bg surface, border, radius 12px, shadow, hover shadow-lg |
| `.stat-card` | Padding 1rem, label uppercase, value 1.9rem |
| `.vehicle` | flex column, gap 0.4rem, border-left según estado |
| `.vehicle__head` | flex between, badges nowrap |
| `.badge` | Pill, radius 999px, font 0.72rem |
| `.badge--estado` | Font 0.8125rem (25% más grande) |
| `.modal-overlay` | Fixed, backdrop blur 4px, z-index 60 |
| `.modal` | bg surface, radius 16px, max-width 560px, animación scale+fade |
| `.modal--vehiculo` | max-width 640px |
| `.toast` | Fixed bottom-right, z-index 70, animación slide-up |
| `.hospital-summary` | Flex, bg surface, border, shadow, padding 0.85rem |
| `.hospital-summary__expand` | Botón primary 2.4rem, +/− toggle |
| `.vehiculo-modal-grid` | Grid 3 columnas para stats del modal |
| `.layer-control` | Absolute top-right sobre mapa, z-index 1000 |
| `.map-wrap` | Relative, height 420px, overflow hidden |
| `.filtros-bar` | Flex, gap 0.75rem, wrap |
| `.table-report` | Width 100%, border-collapse, sticky header |
| `.playback-bar` | Flex, range input customizado |

### Responsive

```css
@media (max-width: 900px) {
  .app-body → flex-direction: column
  .sidebar → width 100%, position static, nav horizontal scroll
  .page → padding 1rem
}

@media (max-width: 640px) {
  .form-grid → 1 columna
  .vehicle__stats → 1 columna
  .stats-grid → 2 columnas
  .page-header → flex-direction column
}
```

---

## Proxy Server (proxy-server.js)

```javascript
// Proxy a Traccar
const proxy = httpProxy.createProxyServer({ target: "http://localhost:8082", changeOrigin: true });
// /api/* → proxy a Traccar
// Resto → archivos estáticos (index.html, CSS, JS, SVG)
// Puerto: 3000
```

---

## Datos de Prueba

```javascript
// Coordenadas iniciales (Medellín, Colombia)
lat: 6.2442
lng: -75.5812

// Hospitales hardcoded: 15+ en Medellín con nombre, tipo, dirección, teléfono, camas, lat/lon, especialidades
```

---

## Tecnologías

- **Frontend**: HTML5, CSS3 (Custom Properties), JavaScript ES5 (sin frameworks, IIFE estricto)
- **Mapa**: Leaflet.js 1.9.4 con OpenStreetMap tiles
- **Backend**: Node.js con http-proxy
- **GPS Server**: Traccar
- **Persistencia**: localStorage
- **Red**: Tailscale (acceso remoto)
- **OS**: Windows (.bat scripts)

---

## Funcionalidades Clave

1. **Conexión**: Token Bearer o Basic Auth, proxy evita CORS, polling configurable
2. **Tarjetas**: Estado visual (borde + gradiente + badge), POI cercano, velocidad, conductor
3. **Modal detalles**: Grid 3 columnas, stats completos, metadata, referencias cercanas, no se cierra con refresh
4. **Mapa**: Marcadores coloreados, geozonas, POIs, hospitales con cobertura, polylíneas de ruta
5. **Geozonas**: Crear con modal o dibujar en mapa, persistencia
6. **POIs**: 6 tipos con iconos, persistencia
7. **Conductores**: CRUD, asignación a vehículos, persistencia
8. **Historial**: Ruta con reproducción animada (play/pause, velocidad 1x-20x)
9. **Reportes**: 4 tipos, exportación CSV, fechas por trayecto
10. **Alarmas**: Acumulación entre refreshes, auto-eliminación > 2h, SOS con toast
11. **Hospitales**: Resumen compacto expandible, cobertura por radio
12. **Modo oscuro**: Toggle con persistencia
13. **Filtros**: Por nombre, estado, conductor
14. **Responsive**: Desktop y móvil

---

## Notas Importantes

1. **Sin dependencias externas** — Todo vanilla JS, sin frameworks
2. **Velocidad**: Traccar devuelve nudos, la app convierte a km/h (× 1.852)
3. **Eventos acumulativos**: `cargarEventos()` acumula eventos nuevos sin reemplazar los existentes
4. **Eventos auto-limpieza**: Se filtran los > 2 horas en cada render de alarmas
5. **Modal persistente**: El modal de detalles del vehículo no se cierra con el auto-refresh
6. **Badges nowrap**: Los badges del header de tarjeta nunca saltan de línea
7. **Hospitales resumen**: Muestra total sedes/camas/chips, lista completa oculta con toggle ＋/−
8. **Icono SVG**: `icono-flota.svg` en raíz del proyecto, se muestra en topbar

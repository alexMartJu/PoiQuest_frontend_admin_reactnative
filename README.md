# PoiQuest — Frontend Admin (React Native / Expo)

Panel de administración móvil y tablet para la plataforma **PoiQuest**, desarrollado con **React Native**, **Expo SDK 54** y **TypeScript**. Permite a los administradores gestionar eventos, puntos de interés (POIs), usuarios y visualizar analíticas desde cualquier dispositivo.

---

## 📑 Índice

1. [Descripción general](#-descripción-general)
2. [Tecnologías principales](#-tecnologías-principales)
3. [Estructura del proyecto](#-estructura-del-proyecto)
4. [Requisitos previos](#-requisitos-previos)
5. [Backend](#-backend)
6. [Instalación y ejecución](#-instalación-y-ejecución)
7. [Variables de entorno](#-variables-de-entorno)
8. [Funcionalidades](#-funcionalidades)
9. [Navegación](#-navegación)
10. [Arquitectura y patrones](#-arquitectura-y-patrones)
11. [Sistema de temas](#-sistema-de-temas)
12. [Licencia](#-licencia)

---

## 📝 Descripción general

PoiQuest es una aplicación orientada a eventos geolocalizados con puntos de interés asociados. El ecosistema se compone de:

| Proyecto | Tecnología | Rol |
|---|---|---|
| **Backend** | NestJS | API REST, autenticación, lógica de negocio |
| **Frontend usuarios** | Flutter | App móvil para usuarios finales |
| **Frontend admin** *(este repo)* | React Native / Expo | Panel de gestión para administradores |

Este repositorio contiene exclusivamente el **frontend de administración**.

---

## 🛠 Tecnologías principales

| Categoría | Librería / Herramienta |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Lenguaje | TypeScript 5.9 |
| Navegación | Expo Router 6 (file-based routing) |
| Componentes UI | React Native Paper 5 (Material Design 3) |
| Estado global | Zustand 5 |
| Estado servidor | TanStack React Query 5 |
| Formularios | React Hook Form 7 + Zod 3 |
| HTTP Client | Axios |
| Mapas | React Native Maps + MapTiler |
| Gráficas | React Native Chart Kit + React Native SVG |
| Animaciones | React Native Reanimated 4 + Moti |
| Almacenamiento | Expo Secure Store + Async Storage |
| Fuentes | Google Fonts (Roboto 400 / 500 / 700) |

---

## 📂 Estructura del proyecto

```
src/
├── app/                          # Pantallas (file-based routing)
│   ├── _layout.tsx               # Layout raíz
│   ├── login.tsx                 # Pantalla de inicio de sesión
│   └── (protected)/              # Rutas protegidas (requieren auth)
│       ├── _layout.tsx           # Guard de autenticación
│       ├── preferences.tsx       # Preferencias (tema oscuro/claro)
│       └── (drawer)/             # Navegación lateral (drawer)
│           ├── _layout.tsx       # Configuración del drawer
│           ├── index.tsx         # Dashboard con analíticas
│           ├── events/           # CRUD de Eventos
│           │   ├── index.tsx     # Listado paginado (infinite scroll)
│           │   ├── create.tsx    # Crear evento
│           │   ├── [uuid].tsx    # Detalle de evento
│           │   └── [uuid]/
│           │       └── edit.tsx  # Editar evento
│           ├── pois/             # Gestión de Puntos de Interés
│           │   ├── index.tsx     # Listado de eventos con POIs
│           │   ├── _layout.tsx
│           │   └── [eventUuid]/
│           │       ├── index.tsx     # POIs de un evento
│           │       ├── create.tsx    # Crear POI
│           │       ├── [poiUuid].tsx # Detalle de POI
│           │       └── [poiUuid]/
│           │           └── edit.tsx  # Editar POI
│           └── users/            # Gestión de Usuarios
│               ├── index.tsx     # Listado (activos / deshabilitados)
│               └── create.tsx    # Registrar validador
├── components/
│   ├── analytics/                # Gráficas del dashboard
│   ├── common/                   # Componentes reutilizables (Button, Chip, Dialog…)
│   ├── events/                   # Tarjeta y formulario de eventos
│   ├── pois/                     # Tarjeta, formulario y mapa de POIs
│   └── users/                    # Tarjeta y formulario de usuarios
├── hooks/
│   ├── events/                   # useEventDetail
│   ├── pois/                     # usePoiDetail
│   └── queries/                  # React Query hooks (queries + mutations)
│       ├── analytics/
│       ├── events/
│       ├── pois/
│       ├── users/
│       └── queryKeys.ts
├── providers/
│   ├── AuthProvider.tsx          # Contexto de autenticación + redirect guard
│   ├── QueryProvider.tsx         # TanStack Query client
│   └── ThemeProvider.tsx         # Contexto de tema claro/oscuro
├── schemas/                      # Esquemas Zod de validación
├── services/                     # Capa de servicios (llamadas HTTP)
├── stores/                       # Stores Zustand (user, snackbar, theme)
├── styles/                       # Estilos por pantalla
├── types/                        # Tipos e interfaces TypeScript
├── utils/                        # Utilidades (pick image, pick document)
├── constants.ts                  # URLs, endpoints, claves de storage
└── theme.ts                      # Paleta de colores y tema MD3
```

---

## ✅ Requisitos previos

- **Node.js** ≥ 18
- **npm** o **yarn**
- **Expo CLI** (`npx expo` incluido con el SDK)
- **Android Studio** (emulador Android) o dispositivo físico con **Expo Go**
- **Docker** y **Docker Compose** (para levantar el backend)

---

## 🖥 Backend

El backend de este proyecto está en un repositorio separado:

🔗 **[https://github.com/alexMartJu/PoiQuest_backend_nestjs](https://github.com/alexMartJu/PoiQuest_backend_nestjs)**

### Levantar el backend

```bash
# 1. Clonar el repositorio del backend
git clone https://github.com/alexMartJu/PoiQuest_backend_nestjs.git
cd PoiQuest_backend_nestjs

# 2. Levantar todos los servicios (API, base de datos, MinIO, etc.)
docker-compose up -d

# 3. (Opcional) Poblar la base de datos con datos de prueba
#    ⚠️  Esperar a que el servicio "webserver" esté completamente levantado
#    antes de ejecutar el seed.
docker-compose logs -f webserver   # Verificar que el servicio está listo
npm run seed                        # Ejecutar seeds una vez esté levantado
```

> **Nota:** El servicio `webserver` del `docker-compose.yml` es el que expone la API de NestJS. Asegúrate de que esté en estado *healthy* o que los logs indiquen que está escuchando en el puerto configurado antes de lanzar `npm run seed`.

---

## 🚀 Instalación y ejecución

```bash
# 1. Clonar este repositorio
git clone <url-de-este-repo>
cd poiquest_frontend_admin_reactnative

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu clave de MapTiler (ver sección Variables de entorno)

# 4. Iniciar el servidor de desarrollo
npm start

# — o directamente en un dispositivo/emulador —
npm run android    # Android (puerto 8082)
npm run ios        # iOS
npm run web        # Web
```

---

## 🔐 Variables de entorno

Crear un archivo `.env` en la raíz a partir de `.env.example`:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `EXPO_PUBLIC_MAPTILER_KEY` | API key de [MapTiler](https://www.maptiler.com/) para los mapas | `your_maptiler_api_key_here` |

La URL del backend se configura automáticamente en `src/constants.ts` según la plataforma y el entorno (`__DEV__`):

- **Android emulator:** `http://10.0.2.2:8000`
- **iOS simulator / Web:** `http://localhost:8000`
- **Producción:** Configurable en `constants.ts`

---

## ⚡ Funcionalidades

### Autenticación
- Inicio de sesión con email y contraseña
- Tokens JWT con refresh automático (interceptor Axios)
- Cierre de sesión individual y en todos los dispositivos
- Guard de rutas protegidas

### Dashboard
- Estadísticas generales (usuarios totales, activos, eventos, POIs)
- Gráfica de eventos por categoría
- Gráfica de registros de usuarios por mes
- Diseño responsivo (columnas adaptativas en tablet)

### Gestión de Eventos
- Listado paginado con infinite scroll (cursor-based)
- Creación, edición y eliminación de eventos
- Subida de imágenes múltiples
- Vista de detalle completa

### Gestión de Puntos de Interés (POIs)
- Listado de POIs agrupados por evento
- Creación, edición y eliminación de POIs
- Selección de ubicación en mapa interactivo (MapTiler)
- Visor de mapa en modo lectura
- Subida de imágenes y modelos 3D

### Gestión de Usuarios
- Listado filtrable por estado (activos / deshabilitados)
- Activar y desactivar usuarios
- Registro de nuevos validadores (rol especial)
- Badges de estado y rol

### Preferencias
- Cambio de tema claro / oscuro con persistencia

### UX General
- Snackbar global para notificaciones (éxito, error, info, warning)
- Diálogos de confirmación reutilizables
- FAB animado para acciones principales
- Soporte responsivo (móvil y tablet con drawer permanente)

---

## 🗺 Navegación

La app utiliza **Expo Router** con file-based routing y la siguiente jerarquía:

```
/login                              → Inicio de sesión
/(protected)
  ├── /preferences                  → Ajustes de tema
  └── /(drawer)
        ├── /                       → Dashboard
        ├── /events                 → Listado de eventos
        ├── /events/create          → Crear evento
        ├── /events/[uuid]          → Detalle de evento
        ├── /events/[uuid]/edit     → Editar evento
        ├── /pois                   → Eventos con POIs
        ├── /pois/[eventUuid]       → POIs de un evento
        ├── /pois/[eventUuid]/create          → Crear POI
        ├── /pois/[eventUuid]/[poiUuid]       → Detalle de POI
        ├── /pois/[eventUuid]/[poiUuid]/edit  → Editar POI
        ├── /users                  → Listado de usuarios
        └── /users/create           → Registrar validador
```

- Las rutas bajo `(protected)` requieren autenticación; si no hay sesión, redirige a `/login`.
- En tablets (≥ 768px), el drawer es permanente; en móviles, se despliega con gesto o botón.

---

## 🏗 Arquitectura y patrones

| Patrón | Implementación |
|---|---|
| **File-based routing** | Expo Router con layouts anidados y grupos de rutas |
| **Server state** | TanStack React Query (queries, mutations, cache, invalidación) |
| **Client state** | Zustand con persistencia en AsyncStorage / SecureStore |
| **Formularios** | React Hook Form + Zod (validación declarativa con schemas) |
| **Componentes UI** | Librería propia de wrappers sobre React Native Paper (sufijo `App`) |
| **Estilos** | `StyleSheet.create` estáticos + funciones dinámicas basadas en tema |
| **Servicios** | Capa de abstracción sobre Axios con interceptores de auth |
| **Custom hooks** | Separación de lógica de negocio en hooks reutilizables |

---

## 🎨 Sistema de temas

Basado en **Material Design 3** con React Native Paper. Se definen dos paletas completas:

| Token | Light | Dark |
|---|---|---|
| Primary | `#111827` | `#FFFFFF` |
| Secondary | `#16A34A` | `#4ADE80` |
| Warning | `#FACC15` | `#EAB308` |
| Danger | `#DC2626` | `#F87171` |
| Background | `#F9FAFB` | `#111827` |
| Surface | `#FFFFFF` | `#1F2937` |

El tema se persiste con Zustand + AsyncStorage y se propaga mediante `ThemeProvider`.

---

## 📄 Licencia

Este proyecto está bajo la licencia incluida en el archivo [LICENSE](LICENSE).


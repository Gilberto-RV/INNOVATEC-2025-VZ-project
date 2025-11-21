# App móvil - INNOVATEC-2025-VZ

App Expo/React Native que consume la API (`http://localhost:5000/api`) y permite visualizar mapas, eventos y métricas desde el celular o navegador.

## Tecnologías clave

- **Expo Router + React Native 0.79**
- **Leaflet** para mapas interactivos en la versión web
- **Expo Location / Camera / Blur / Linking** para funcionalidades móviles
- **React Navigation (drawer, tabs)** para la navegación del shell principal
- **Axios** para comunicarse con la API

## Requisitos

- Node.js 18+ (por compatibilidad con Expo SDK 53)
- npm o yarn
- Dispositivo móvil con Expo Go o un navegador moderno
- Backend corriendo en `http://localhost:5000/api`

## Instalación y desarrollo

```powershell
cd project
npm install
npm run dev
```

El comando arranca Expo en modo desarrollo. Escanea el QR que aparece en la terminal o en el dashboard de Expo Go para abrirlo en tu teléfono. Si necesitas un túnel (mismo Wi‑Fi no disponible), usa:

```powershell
npx expo start --tunnel --clear
```

## Construcción y pruebas

- `npm run build:web` → exporta la versión web (por ejemplo para pruebas locales o hosting estático).
- `npm run lint` → ejecuta `expo lint`.

## Configuración

1. Verifica que `project/src/core/config/api.js` tenga la URL correcta en `baseURL`.
2. Alternativamente, configura la variable `EXPO_PUBLIC_API_URL` antes de arrancar Expo para sobrescribir la URL base.

## Estructura destacada

- `src/core/config` → configuración de API y constantes globales.
- `src/core/entities`, `usecases` → lógica de dominio y repositorios.
- `src/presentation/components` → componentes reutilizables.
- `src/presentation/pages` → pantallas (perfil, ajustes, etc.).
- `src/hook` → ganchos personalizados (`useAuth`, `useFrameworkReady`).

## Notas

- Mantén el backend levantado en el puerto 5000 o actualiza `baseURL`.
- Expo Router genera automáticamente los endpoints desde `app/(main)` y `app/auth`.
- Este README se complementa con la guía general en la raíz del repositorio (`README.md`).


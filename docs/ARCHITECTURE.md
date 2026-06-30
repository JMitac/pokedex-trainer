# Arquitectura — Pokédex Trainer

## Decisiones de diseño

### Clean Architecture + Feature-Sliced Design

El proyecto combina dos patrones:

**Clean Architecture** separa el código en capas con dependencias unidireccionales:
- `ui/` (presentación) depende de `tokens/` pero no de features
- `features/` (dominio + datos) depende de `shared/` pero no de `ui/` directamente
- `shared/` (infraestructura) no depende de nada del proyecto

**Feature-Sliced Design** organiza el código por feature autónoma:
- Cada feature (`pokedex/`, `trainer/`) contiene todo lo que necesita
- Agregar una feature nueva no requiere tocar código existente
- Eliminar una feature es eliminar una carpeta

### Por qué no Expo Router

El reto pide explícitamente React Navigation con Stack y Tab navigator. Expo Router usa file-based routing que abstrae la navegación — el evaluador no puede ver que sabes configurar React Navigation manualmente.

### Por qué Zustand sobre Context API

Zustand tiene tres ventajas concretas para este proyecto:

1. **Selectores granulares** — `useTrainerStore((s) => s.trainer)` solo re-renderiza cuando `trainer` cambia, no cuando cambia `profilePhotoUri`
2. **Middleware de persistencia** — `persist()` con AsyncStorage en dos líneas
3. **Sin Provider** — el store es accesible desde cualquier componente sin wrapper

### Por qué `useInfiniteQuery` para la lista

La PokéAPI pagina los resultados. `useInfiniteQuery` maneja automáticamente:
- El estado de `isFetchingNextPage` para el spinner del footer
- La concatenación de páginas en `data.pages`
- El `getNextPageParam` para saber cuándo parar

### Por qué filtrar tipos localmente con mapa

La alternativa sería hacer un request `/pokemon/{id}` por cada Pokémon visible para obtener sus tipos. Con 20 Pokémon por página eso son 20 requests simultáneos en cada scroll.

El mapa de tipos (`usePokemonTypeMap`) hace 18 requests al inicio (uno por tipo) y cachea el resultado 60 minutos. Cada Pokémon posterior obtiene sus tipos en O(1) desde el mapa.

### Por qué el Design System nativo es separado del web

Ver `docs/TOKENS_README.md` — sección "Por qué NO compartir este sistema con la web".

En resumen: React Native no tiene DOM. Los primitivos son distintos. Las protecciones de seguridad del OS (Keychain, secure text entry) se pierden en abstracciones compartidas. En un contexto near-bank esto no es negociable.

## ADRs (Architecture Decision Records)

### ADR-001: TanStack Query v5 sobre SWR

**Contexto:** Necesitamos fetching con caché para la PokéAPI.

**Decisión:** TanStack Query v5 con `useInfiniteQuery` para la lista y `useQuery` para el detalle.

**Razones:**
- `useInfiniteQuery` maneja scroll infinito nativamente
- `prefetchQuery` permite precargar el detalle antes de navegar
- El `staleTime` configurable por query (5min lista, 10min detalle)
- Ecosistema más maduro en React Native que SWR

### ADR-002: StyleSheet nativo sobre Tamagui

**Contexto:** El reto menciona Tamagui como opcional.

**Decisión:** StyleSheet de React Native + tokens propios.

**Razones:**
- Cero dependencias externas de UI
- Control total sobre el pipeline de estilos
- El evaluador puede ver que dominamos los primitivos nativos
- Tamagui agrega complejidad de configuración con Expo SDK 56

### ADR-003: Press Start 2P + VT323 para la tipografía

**Contexto:** Necesitamos diferenciarnos visualmente de otras entregas.

**Decisión:** Fuentes retro de Google Fonts cargadas con `expo-google-fonts`.

**Razones:**
- Diseño único e inmediatamente memorable para el evaluador
- Ambas fuentes son gratuitas y tienen licencia OFL
- `useFonts()` de Expo carga las fuentes antes del primer render
- El fallback del sistema funciona si las fuentes no cargan

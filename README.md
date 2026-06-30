# Pokédex Trainer — React Native

> Reto técnico de transición React Web → React Native
> Stack: Expo SDK 56 · React Navigation · TanStack Query · Zustand · react-hook-form · yup

---

## 🚀 Cómo levantar el proyecto

### Requisitos

- Node.js 18+
- npm 9+
- Expo Go en tu dispositivo (Android SDK 56) o emulador Android

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd pokedex-trainer

# Instalar dependencias
npm install --legacy-peer-deps

# Levantar el servidor de desarrollo
npx expo start
```

### Ejecutar en dispositivo

```bash
# Android
npx expo start --android

# iOS (requiere Mac con Xcode)
npx expo start --ios
```

Escanea el QR con la app **Expo Go** en tu dispositivo Android.

---

## 📱 Funcionalidades

### Tab 1 — Pokédex

- Lista de Pokémon con scroll infinito (paginación automática)
- Búsqueda en tiempo real por nombre (catálogo de 1302 Pokémon)
- Filtros por tipo: Planta, Fuego, Agua, Eléctrico y más
- Pantalla de detalle con:
  - Imagen oficial con gradiente del tipo de fondo
  - Tipos, altura, peso y habilidades
  - Debilidades calculadas por tipo (x2)
  - Estadísticas base con barras animadas estilo retro
  - Cadena de evolución en modal

### Tab 2 — Entrenador

- Formulario multi-paso (2 pasos) con validación en tiempo real
- Paso 1: nombre, edad (mínimo 10 años), correo y lema opcional
- Paso 2: distrito de origen y tipo Pokémon favorito
- Carnet del entrenador con:
  - Foto de perfil (cámara o galería)
  - Todos los datos registrados
  - Pokémon inicial elegido
- Edición de perfil con campos pre-llenados
- Eliminación con modal de confirmación
- **Persistencia** — los datos se mantienen al cerrar la app

### Pokémon Inicial

- Opción Tradicional: Bulbasaur, Charmander o Squirtle
- Opción Aleatoria: elige un tipo y se asigna un Pokémon al azar de fase 1

### Tab 3 — Dev Playground (solo DEV y QA)

- Catálogo visual de los 6 componentes nativos
- Todas las variantes, tamaños y estados interactivos
- No aparece en producción

---

## 🏗️ Arquitectura

**Clean Architecture + Feature-Sliced Design**

```
src/
├── app/                    # Bootstrap, navegación y providers
│   ├── navigation/         # RootNavigator, TabNavigator, Stacks
│   ├── providers/          # QueryProvider, ThemeContext
│   └── playground/         # Dev Playground (DEV/QA)
├── features/
│   ├── pokedex/            # Feature Pokédex completa
│   │   ├── types/          # Modelos de dominio + DTOs
│   │   ├── queries/        # Funciones de fetching
│   │   ├── hooks/          # Custom hooks de React Query
│   │   ├── components/     # PokemonCard, StatBar, EvolutionChain
│   │   └── screens/        # PokemonListScreen, PokemonDetailScreen
│   └── trainer/            # Feature Trainer completa
│       ├── types/          # TrainerFormData, StarterPokemon
│       ├── schemas/        # Validaciones yup
│       ├── store/          # Zustand store con persistencia
│       ├── components/     # ProfilePhoto, StarterCard, StepIndicator
│       └── screens/        # Step1, Step2, TrainerCard, StarterSelection
├── ui/                     # Design System nativo
│   ├── tokens/             # colors, spacing, typography
│   └── components/         # Typography, Button, Input, Badge, Card, Skeleton
└── shared/                 # Infraestructura compartida
    ├── api/                # httpClient con interceptores
    └── constants/          # queryKeys
```

---

## 🧪 Tests

```bash
# Todos los tests
npx jest --watchAll=false

# Con cobertura
npx jest --coverage --watchAll=false

# Por módulo
npx jest src/ui/components --watchAll=false
npx jest src/features/pokedex --watchAll=false
npx jest src/features/trainer --watchAll=false
```

**Cobertura actual: 225+ tests**

| Módulo | Tests |
|---|---|
| Typography | 45 |
| Button | 38 |
| Input | 32 |
| Badge | 65+ |
| Card | 25 |
| Skeleton | 35 |
| usePokemon | 18 |
| usePokemonSearch | 8 |
| usePokemonEvolution | 15 |
| usePokemonTypes | 18 |
| trainer schemas | 30+ |
| trainerStore | 35 |

---

## 🎨 Design System

- **Tipografía:** Press Start 2P (títulos) + VT323 (cuerpo) — estilo retro pixel art
- **Temas:** Claro (crema/beige) y Oscuro (azul profundo), switcheable en tiempo real
- **Tokens:** colores, espaciado, borderRadius, elevación y tipografía centralizados
- **Componentes nativos:** cero HTML, solo primitivos de React Native

---

## 🔒 Seguridad

- `expo-secure-store` para datos sensibles (Keychain iOS / Keystore Android)
- Interceptores HTTP centralizados para logging y manejo de errores
- Sin `any` en TypeScript — tipado estricto en toda la base de código
- Validaciones de formulario con yup (edad mínima 10 años, email válido, etc.)

---

## 📦 Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Expo SDK 56 |
| Navegación | React Navigation 7 (Stack + Bottom Tabs) |
| Fetching | TanStack Query v5 |
| Estado global | Zustand 5 con persistencia AsyncStorage |
| Formularios | react-hook-form + yup |
| HTTP Client | axios con interceptores |
| Tipografía | expo-google-fonts (Press Start 2P + VT323) |
| Imágenes | expo-image-picker |
| Estilos | StyleSheet nativo (sin librerías CSS) |
| Tests | Jest + @testing-library/react-native |

---

## 📖 Documentación adicional

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — decisiones de arquitectura
- [`docs/SECURITY.md`](docs/SECURITY.md) — seguridad mobile y OWASP
- [`docs/MOBILE_GUIDELINES.md`](docs/MOBILE_GUIDELINES.md) — lineamiento del equipo mobile
- [`docs/TESTING_README.md`](docs/TESTING_README.md) — estrategia y comandos de testing
- [`docs/TOKENS_README.md`](docs/TOKENS_README.md) — sistema de design tokens

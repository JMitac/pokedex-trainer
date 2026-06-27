# Navigation — Arquitectura de Rutas

> **Ubicación:** `src/app/navigation/`
> **Capa:** App / Navegación
> **Depende de:** `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`

---

## Estructura de navegación

```
RootNavigator (NavigationContainer)
└── TabNavigator (Bottom Tabs)
    ├── PokedexTab → PokedexStack
    │   ├── PokemonList        ← pantalla inicial
    │   └── PokemonDetail      ← recibe { id, name }
    ├── TrainerTab → TrainerStack
    │   ├── Step1PersonalData  ← paso 1, sin back
    │   ├── Step2Preferences   ← paso 2
    │   └── TrainerCard        ← resultado, sin back ni swipe
    └── [DEV/QA] PlaygroundTab → PlaygroundStack
        ├── PlaygroundHome     ← lista de componentes
        └── ComponentDetail    ← recibe { component }
```

---

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `types.ts` | Tipos de parámetros de todas las rutas |
| `RootNavigator.tsx` | Contenedor raíz con `NavigationContainer` |
| `TabNavigator.tsx` | Bottom tabs con control de ambiente |
| `PokedexStack.tsx` | Stack de lista → detalle |
| `TrainerStack.tsx` | Stack del formulario multi-paso |
| `PlaygroundStack.tsx` | Stack del Dev Playground (DEV/QA) |
| `index.ts` | Barrel export |

---

## Tipos de rutas — `types.ts`

Todas las rutas están tipadas. TypeScript verificará en compile time
que los parámetros son correctos en cada `navigation.navigate()`.

```tsx
// ✅ Correcto — TypeScript valida que id es number y name es string
navigation.navigate('PokemonDetail', { id: 1, name: 'bulbasaur' });

// ❌ Error en compile time — falta el parámetro name
navigation.navigate('PokemonDetail', { id: 1 });

// ❌ Error en compile time — id debe ser number, no string
navigation.navigate('PokemonDetail', { id: '1', name: 'bulbasaur' });
```

### Cómo usar los tipos en una screen

```tsx
import type { PokedexNavigationProp } from '@/app/navigation';

// En PokemonListScreen
const PokemonListScreen: React.FC<PokedexNavigationProp<'PokemonList'>> = ({
  navigation,
}) => {
  const handlePress = (id: number, name: string) => {
    navigation.navigate('PokemonDetail', { id, name });
  };

  return (/* ... */);
};

// En PokemonDetailScreen
const PokemonDetailScreen: React.FC<PokedexNavigationProp<'PokemonDetail'>> = ({
  route,
  navigation,
}) => {
  const { id, name } = route.params; // ← TypeScript sabe los tipos exactos
  return (/* ... */);
};
```

---

## Control de ambiente del Playground

El Playground se muestra bajo dos condiciones:

```ts
const isPlaygroundEnabled = __DEV__ || appEnv !== 'production';
```

| Variable | Valor | Playground |
|---|---|---|
| `__DEV__` | `true` | ✅ Visible |
| `appEnv` | `'development'` | ✅ Visible |
| `appEnv` | `'qa'` | ✅ Visible |
| `appEnv` | `'staging'` | ✅ Visible |
| `appEnv` | `'production'` | ❌ Oculto |

### Configurar `appEnv` en `app.config.js`

```js
// app.config.js
module.exports = {
  expo: {
    // ...
    extra: {
      appEnv: process.env.APP_ENV ?? 'development',
    },
  },
};
```

### Lanzar en cada ambiente

```bash
# Development (default)
npx expo start

# QA — el Playground sigue visible
APP_ENV=qa npx expo start

# Production — Playground eliminado del bundle
APP_ENV=production npx expo start
```

---

## Decisiones de diseño del TrainerStack

### `headerLeft: () => null` en Step1 y TrainerCard

El paso 1 del formulario no permite volver porque no hay pantalla anterior. La `TrainerCard` no permite volver porque completar el formulario es una acción final — el flujo correcto es usar el botón "Nuevo entrenador" para resetear el store.

### `gestureEnabled: false` en TrainerCard

En iOS el swipe back es un gesto nativo que React Navigation respeta por defecto. En la `TrainerCard` lo deshabilitamos porque hacer swipe accidental podría llevar al usuario de vuelta al paso 2 con el formulario vacío, lo cual es confuso.

---

## Cómo agregar una nueva pantalla

### 1. Agregar el tipo en `types.ts`

```ts
export type PokedexStackParamList = {
  PokemonList: undefined;
  PokemonDetail: { id: number; name: string };
  PokemonEvolutions: { id: number }; // ← nueva pantalla
};
```

### 2. Registrar en el Stack correspondiente

```tsx
// PokedexStack.tsx
<Stack.Screen
  name="PokemonEvolutions"
  component={PokemonEvolutionsScreen}
  options={{ title: 'Evoluciones' }}
/>
```

### 3. Navegar desde cualquier pantalla del mismo Stack

```tsx
navigation.navigate('PokemonEvolutions', { id: pokemon.id });
```

TypeScript validará que `id` es `number` automáticamente.

---

## Instalación de dependencias de navegación

```bash
npx expo install \
  @react-navigation/native \
  @react-navigation/native-stack \
  @react-navigation/bottom-tabs \
  react-native-screens \
  react-native-safe-area-context
```

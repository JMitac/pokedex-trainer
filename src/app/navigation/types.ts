/**
 * @file types.ts
 * @layer App / Navigation
 *
 * Tipos de parámetros de todas las rutas de la aplicación.
 *
 * REGLA: Cada ruta que recibe parámetros debe estar tipada aquí.
 * Nunca usar `any` en los parámetros de navegación.
 * TypeScript verificará en compile time que los parámetros
 * son correctos en cada navigation.navigate().
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

// ---------------------------------------------------------------------------
// Pokédex Stack
// ---------------------------------------------------------------------------

export type PokedexStackParamList = {
  /** Lista principal de Pokémon */
  PokemonList: undefined;

  /** Detalle de un Pokémon — recibe el ID y nombre para el header */
  PokemonDetail: {
    id: number;
    name: string;
  };
};

// ---------------------------------------------------------------------------
// Trainer Stack
// ---------------------------------------------------------------------------

export type TrainerStackParamList = {
  /** Paso 1 — Datos personales */
  Step1PersonalData: undefined;

  /** Paso 2 — Preferencias */
  Step2Preferences: undefined;

  /** Pantalla final — Carnet del entrenador */
  TrainerCard: undefined;
};

// ---------------------------------------------------------------------------
// Dev Playground Stack (solo en desarrollo y QA)
// ---------------------------------------------------------------------------

export type PlaygroundStackParamList = {
  /** Home del playground — lista de componentes */
  PlaygroundHome: undefined;

  /** Pantalla de un componente específico */
  ComponentDetail: {
    component: string;
  };
};

// ---------------------------------------------------------------------------
// Bottom Tab Navigator
// ---------------------------------------------------------------------------

export type TabParamList = {
  /** Tab del Pokédex */
  PokedexTab: NavigatorScreenParams<PokedexStackParamList>;

  /** Tab del Trainer */
  TrainerTab: NavigatorScreenParams<TrainerStackParamList>;

  /** Tab del Playground — solo en DEV y QA */
  PlaygroundTab?: NavigatorScreenParams<PlaygroundStackParamList>;
};

// ---------------------------------------------------------------------------
// Root Navigator
// ---------------------------------------------------------------------------

export type RootStackParamList = {
  /** Navegación principal con tabs */
  Main: NavigatorScreenParams<TabParamList>;
};

// ---------------------------------------------------------------------------
// Tipos de utilidad para usar en screens
// ---------------------------------------------------------------------------

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';

/** Props de navegación para pantallas del Pokédex Stack */
export type PokedexNavigationProp<T extends keyof PokedexStackParamList> =
  NativeStackScreenProps<PokedexStackParamList, T>;

/** Props de navegación para pantallas del Trainer Stack */
export type TrainerNavigationProp<T extends keyof TrainerStackParamList> =
  NativeStackScreenProps<TrainerStackParamList, T>;

/**
 * Prop de navegación compuesta para screens que necesitan
 * acceder tanto al Stack como al Tab navigator.
 *
 * Uso:
 *   const navigation = useNavigation<CompositePokedexNavProp>();
 */
export type CompositePokedexNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<PokedexStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;
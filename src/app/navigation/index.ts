/**
 * @file index.ts
 * @layer App / Navigation
 *
 * Punto de entrada único del módulo de navegación.
 *
 * Uso:
 *   import { RootNavigator } from '@/app/navigation';
 *   import type { PokedexStackParamList } from '@/app/navigation';
 */

export { RootNavigator } from './RootNavigator';
export { TabNavigator } from './TabNavigator';
export { PokedexStack } from './PokedexStack';
export { TrainerStack } from './TrainerStack';

export type {
  RootStackParamList,
  TabParamList,
  PokedexStackParamList,
  TrainerStackParamList,
  PlaygroundStackParamList,
  PokedexNavigationProp,
  TrainerNavigationProp,
  CompositePokedexNavProp,
} from './types';

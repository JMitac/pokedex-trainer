/**
 * @file types.ts
 * @layer App / Navigation
 *
 * Tipos de parámetros de todas las rutas de la aplicación.
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

export type PokedexStackParamList = {
  PokemonList: undefined;
  PokemonDetail: { id: number; name: string };
};

export type TrainerStackParamList = {
  Step1PersonalData: undefined;
  Step2Preferences: undefined;
  TrainerCard: undefined;
  StarterSelection: undefined;
};

export type PlaygroundStackParamList = {
  PlaygroundHome: undefined;
  ComponentDetail: { component: string };
};

export type TabParamList = {
  PokedexTab: NavigatorScreenParams<PokedexStackParamList>;
  TrainerTab: NavigatorScreenParams<TrainerStackParamList>;
  PlaygroundTab?: NavigatorScreenParams<PlaygroundStackParamList>;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
};

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';

export type PokedexNavigationProp<T extends keyof PokedexStackParamList> =
  NativeStackScreenProps<PokedexStackParamList, T>;

export type TrainerNavigationProp<T extends keyof TrainerStackParamList> =
  NativeStackScreenProps<TrainerStackParamList, T>;

export type CompositePokedexNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<PokedexStackParamList>,
  BottomTabNavigationProp<TabParamList>
>;

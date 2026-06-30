/**
 * @file PokedexStack.tsx
 * @layer App / Navigation
 *
 * Stack navigator para el flujo del Pokédex.
 * Maneja la transición entre la lista y el detalle de un Pokémon.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, textStyles } from '@/ui/tokens';
import type { PokedexStackParamList } from './types';

// Screens — se importarán cuando existan
// Por ahora usamos placeholders para que la navegación compile
import { PokemonListScreen } from '@/features/pokedex/screens/PokemonListScreen';
import { PokemonDetailScreen } from '@/features/pokedex/screens/PokemonDetailScreen';

const Stack = createNativeStackNavigator<PokedexStackParamList>();

export const PokedexStack: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PokemonList"
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.surface,
      },
      headerTitleStyle: {
        ...textStyles.headingSM,
        color: colors.textPrimary,
      },
      headerTintColor: colors.primary,
      headerShadowVisible: false,
      contentStyle: {
        backgroundColor: colors.background,
      },
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name="PokemonList"
      component={PokemonListScreen}
      options={{
        title: 'Pokédex',
        //headerLargeTitle: true,
        headerRight: () => null,
      }}
    />
    <Stack.Screen
      name="PokemonDetail"
      component={PokemonDetailScreen}
      options={({ route }) => ({
        title: route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1),
        headerBackTitle: 'Pokédex',
      })}
    />
  </Stack.Navigator>
);

/**
 * @file RootNavigator.tsx
 * @layer App / Navigation
 *
 * ⚠️ VERSIÓN DE DEBUG TEMPORAL ⚠️
 *
 * Reemplaza TabNavigator por PokedexStack directo, SIN tabs,
 * para aislar si el hueco inferior en iOS lo genera el
 * Bottom Tab Navigator o algo en otra parte (StatusBar,
 * NavigationContainer, SafeAreaProvider, etc.).
 *
 * Si el hueco DESAPARECE con este cambio → el bug está
 * confirmado en TabNavigator (su cálculo de tabBarStyle).
 *
 * Si el hueco SIGUE apareciendo → el bug está en otro lugar
 * (probablemente App.tsx, SafeAreaProvider, o el propio
 * PokemonListScreen con algo no relacionado al tab bar).
 *
 * Revertir a la versión normal después de la prueba.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { colors } from '@/ui/tokens';
import type { RootStackParamList } from './types';

// 🔧 DEBUG: importamos PokedexStack directo, sin pasar por TabNavigator
import { PokedexStack } from './PokedexStack';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => (
  <NavigationContainer>
    <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* 🔧 DEBUG: Main ahora apunta a PokedexStack, no a TabNavigator */}
      <RootStack.Screen name="Main" component={PokedexStack} />
    </RootStack.Navigator>
  </NavigationContainer>
);

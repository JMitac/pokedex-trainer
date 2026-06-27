/**
 * @file RootNavigator.tsx
 * @layer App / Navigation
 *
 * Navegador raíz de la aplicación.
 * Punto de entrada de toda la estructura de navegación.
 *
 * Estructura:
 *   RootNavigator
 *   └── TabNavigator
 *       ├── PokedexStack (Tab 1)
 *       │   ├── PokemonListScreen
 *       │   └── PokemonDetailScreen
 *       ├── TrainerStack (Tab 2)
 *       │   ├── Step1PersonalData
 *       │   ├── Step2Preferences
 *       │   └── TrainerCardScreen
 *       └── PlaygroundStack (Tab 3 — solo DEV/QA)
 *           ├── PlaygroundHomeScreen
 *           └── ComponentDetailScreen
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { colors } from '@/ui/tokens';
import type { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => (
  <NavigationContainer>
    <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Main" component={TabNavigator} />
    </RootStack.Navigator>
  </NavigationContainer>
);

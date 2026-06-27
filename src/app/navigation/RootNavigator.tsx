/**
 * @file RootNavigator.tsx
 * @layer App / Navigation
 *
 * Navegador raíz con redirección inteligente.
 * Si el entrenador ya está registrado (datos en store),
 * la app abre directamente en TrainerCard en vez del Step1.
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

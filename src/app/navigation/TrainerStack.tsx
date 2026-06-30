/**
 * @file TrainerStack.tsx
 * @layer App / Navigation
 *
 * Stack navigator del Trainer con pantalla de selección de starter.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, textStyles } from '@/ui/tokens';
import type { TrainerStackParamList } from './types';

import { Step1PersonalData } from '@/features/trainer/screens/Step1PersonalData';
import { Step2Preferences } from '@/features/trainer/screens/Step2Preferences';
import { TrainerCardScreen } from '@/features/trainer/screens/TrainerCardScreen';
import { StarterSelectionScreen } from '@/features/trainer/screens/StarterSelectionScreen';

const Stack = createNativeStackNavigator<TrainerStackParamList>();

export const TrainerStack: React.FC = () => (
  <Stack.Navigator
    initialRouteName="Step1PersonalData"
    screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTitleStyle: {
        ...textStyles.headingSM,
        color: colors.textPrimary,
      },
      headerTintColor: colors.primary,
      headerShadowVisible: false,
      contentStyle: { backgroundColor: colors.background },
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name="Step1PersonalData"
      component={Step1PersonalData}
      options={{
        title: 'Datos Personales',
        headerLeft: () => null,
      }}
    />
    <Stack.Screen
      name="Step2Preferences"
      component={Step2Preferences}
      options={{ title: 'Preferencias', headerBackTitle: 'Atrás' }}
    />
    <Stack.Screen
      name="TrainerCard"
      component={TrainerCardScreen}
      options={{
        title: 'Mi Carnet',
        headerLeft: () => null,
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name="StarterSelection"
      component={StarterSelectionScreen}
      options={{ title: 'Pokémon Inicial', headerBackTitle: 'Volver' }}
    />
  </Stack.Navigator>
);

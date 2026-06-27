/**
 * @file TrainerStack.tsx
 * @layer App / Navigation
 *
 * Stack navigator para el flujo del Trainer.
 * Maneja el formulario multi-paso y la pantalla de carnet.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, textStyles } from '@/ui/tokens';
import type { TrainerStackParamList } from './types';

import { Step1PersonalData } from '@/features/trainer/screens/Step1PersonalData';
import { Step2Preferences } from '@/features/trainer/screens/Step2Preferences';
import { TrainerCardScreen } from '@/features/trainer/screens/TrainerCardScreen';

const Stack = createNativeStackNavigator<TrainerStackParamList>();

export const TrainerStack: React.FC = () => (
  <Stack.Navigator
    initialRouteName="Step1PersonalData"
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
      name="Step1PersonalData"
      component={Step1PersonalData}
      options={{
        title: 'Datos Personales',
        headerLeft: () => null, // No permite volver al paso anterior desde el paso 1
      }}
    />
    <Stack.Screen
      name="Step2Preferences"
      component={Step2Preferences}
      options={{
        title: 'Preferencias',
        headerBackTitle: 'Atrás',
      }}
    />
    <Stack.Screen
      name="TrainerCard"
      component={TrainerCardScreen}
      options={{
        title: 'Mi Carnet',
        headerLeft: () => null, // No permite volver desde el carnet
        gestureEnabled: false,  // Deshabilita swipe back
      }}
    />
  </Stack.Navigator>
);

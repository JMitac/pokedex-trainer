/**
 * @file PlaygroundStack.tsx
 * @layer App / Navigation
 *
 * Stack navigator del Dev Playground.
 * Solo visible en ambientes Development y QA.
 * En producción este módulo no se incluye en el bundle.
 *
 * Control de visibilidad:
 *   - __DEV__ === true  → Development local
 *   - APP_ENV !== 'production' → QA / Staging
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, textStyles } from '@/ui/tokens';
import type { PlaygroundStackParamList } from './types';

import { PlaygroundHomeScreen } from '@/app/playground/PlaygroundHomeScreen';
import { ComponentDetailScreen } from '@/app/playground/ComponentDetailScreen';

const Stack = createNativeStackNavigator<PlaygroundStackParamList>();

export const PlaygroundStack: React.FC = () => (
  <Stack.Navigator
    initialRouteName="PlaygroundHome"
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.palette.purple900,
      },
      headerTitleStyle: {
        ...textStyles.headingSM,
        color: colors.textInverse,
      },
      headerTintColor: colors.textInverse,
      headerShadowVisible: false,
      contentStyle: {
        backgroundColor: colors.background,
      },
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name="PlaygroundHome"
      component={PlaygroundHomeScreen}
      options={{
        title: '🧪 Dev Playground',
      }}
    />
    <Stack.Screen
      name="ComponentDetail"
      component={ComponentDetailScreen}
      options={({ route }) => ({
        title: route.params.component,
        headerBackTitle: 'Playground',
      })}
    />
  </Stack.Navigator>
);

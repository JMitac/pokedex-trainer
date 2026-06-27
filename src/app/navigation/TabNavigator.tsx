/**
 * @file TabNavigator.tsx
 * @layer App / Navigation
 *
 * Bottom Tab Navigator principal de la aplicación.
 * Contiene el tab del Pokédex, el tab del Trainer
 * y condicionalmente el tab del Dev Playground.
 *
 * El Playground solo se muestra cuando:
 *   - __DEV__ === true (desarrollo local), O
 *   - APP_ENV !== 'production' (QA / Staging)
 *
 * En producción el código del Playground es eliminado
 * del bundle por dead code elimination del Metro bundler.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text } from 'react-native';
import Constants from 'expo-constants';
import { colors, spacing, textStyles } from '@/ui/tokens';
import type { TabParamList } from './types';
import { PokedexStack } from './PokedexStack';
import { TrainerStack } from './TrainerStack';

// El PlaygroundStack solo se importa fuera de producción
let PlaygroundStack: React.FC | null = null;
const appEnv = Constants.expoConfig?.extra?.appEnv ?? 'development';
const isPlaygroundEnabled = __DEV__ || appEnv !== 'production';

if (isPlaygroundEnabled) {
  // Import dinámico condicional — no entra al bundle de producción
  PlaygroundStack = require('./PlaygroundStack').PlaygroundStack;
}

const Tab = createBottomTabNavigator<TabParamList>();

// ---------------------------------------------------------------------------
// Iconos inline simples (Text) — se reemplazarán con @expo/vector-icons
// cuando se instale la librería de iconos
// ---------------------------------------------------------------------------

const TabIcon = ({
  emoji,
  focused,
}: {
  emoji: string;
  focused: boolean;
}) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  </View>
);

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const TabNavigator: React.FC = () => (
  <Tab.Navigator
    initialRouteName="PokedexTab"
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 0.5,
        paddingBottom: Platform.OS === 'ios' ? spacing.xs : spacing.xxs,
        paddingTop: spacing.xxs,
        height: Platform.OS === 'ios' ? 84 : 60,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: {
        ...textStyles.caption,
        marginTop: 2,
      },
    }}
  >
    {/* Tab 1 — Pokédex */}
    <Tab.Screen
      name="PokedexTab"
      component={PokedexStack}
      options={{
        tabBarLabel: 'Pokédex',
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="📖" focused={focused} />
        ),
        tabBarAccessibilityLabel: 'Pokédex — Lista de Pokémon',
      }}
    />

    {/* Tab 2 — Trainer */}
    <Tab.Screen
      name="TrainerTab"
      component={TrainerStack}
      options={{
        tabBarLabel: 'Entrenador',
        tabBarIcon: ({ focused }) => (
          <TabIcon emoji="🎒" focused={focused} />
        ),
        tabBarAccessibilityLabel: 'Perfil de Entrenador',
      }}
    />

    {/* Tab 3 — Dev Playground (solo en DEV y QA) */}
    {isPlaygroundEnabled && PlaygroundStack && (
      <Tab.Screen
        name="PlaygroundTab"
        component={PlaygroundStack}
        options={{
          tabBarLabel: 'Dev',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🧪" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Dev Playground — Solo en desarrollo',
          tabBarBadge: 'DEV',
          tabBarBadgeStyle: {
            backgroundColor: colors.palette.purple500,
            color: colors.textInverse,
            fontSize: 8,
          },
        }}
      />
    )}
  </Tab.Navigator>
);

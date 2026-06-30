/**
 * @file App.tsx
 * @layer Root
 *
 * Punto de entrada con carga de fuentes retro y providers.
 *
 * IMPORTANTE — SafeAreaProvider:
 * Debe envolver TODA la aplicación, en el nivel más alto posible,
 * antes que cualquier NavigationContainer o SafeAreaView.
 *
 * Sin este Provider, react-native-safe-area-context no tiene un
 * contexto real del que leer los insets del dispositivo. Esto afecta
 * tanto a los <SafeAreaView> que usamos en las screens como al cálculo
 * INTERNO que hace @react-navigation/bottom-tabs para su tabBarStyle —
 * causando que cada uno calcule (o adivine) el safe area por su cuenta,
 * generando paddings duplicados o inconsistentes como el hueco visto
 * en iOS debajo del tab bar.
 */

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PressStart2P_400Regular,
} from '@expo-google-fonts/press-start-2p';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { QueryProvider } from '@/app/providers';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { RootNavigator } from '@/app/navigation';

export default function App() {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    VT323_400Regular,
  });

  // Esperar a que las fuentes carguen antes de renderizar.
  // También envuelto en SafeAreaProvider para que el spinner
  // de carga respete el safe area si llegara a necesitarlo.
  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#CC3333" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryProvider>
          <RootNavigator />
        </QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

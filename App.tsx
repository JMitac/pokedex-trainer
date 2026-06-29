/**
 * @file App.tsx
 * @layer Root
 *
 * Punto de entrada con carga de fuentes retro y providers.
 */

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
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

  // Esperar a que las fuentes carguen antes de renderizar
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#CC3333" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <QueryProvider>
        <RootNavigator />
      </QueryProvider>
    </ThemeProvider>
  );
}

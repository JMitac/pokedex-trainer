/**
 * @file App.tsx
 * @layer Root
 *
 * Punto de entrada de la aplicación.
 * Envuelve la navegación con todos los providers necesarios.
 *
 * Orden de providers (de afuera hacia adentro):
 * 1. QueryProvider  → React Query disponible en toda la app
 * 2. RootNavigator  → Navegación con NavigationContainer
 */

import React from 'react';
import { QueryProvider } from '@/app/providers';
import { RootNavigator } from '@/app/navigation';

export default function App() {
  return (
    <QueryProvider>
      <RootNavigator />
    </QueryProvider>
  );
}

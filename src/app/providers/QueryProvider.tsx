/**
 * @file QueryProvider.tsx
 * @layer App / Providers
 *
 * Proveedor de React Query (TanStack Query v5).
 * Configura el QueryClient con estrategias de caché, retry y stale time
 * óptimas para el consumo de la PokéAPI.
 *
 * Configuración:
 * - staleTime: 5 minutos — los datos de Pokémon no cambian frecuentemente
 * - gcTime: 10 minutos — mantiene el caché en memoria antes de limpiar
 * - retry: 2 intentos — en caso de error de red
 * - refetchOnWindowFocus: false — evita re-fetches innecesarios en mobile
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ---------------------------------------------------------------------------
// Configuración del QueryClient
// ---------------------------------------------------------------------------

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * staleTime: 5 minutos
       * Los datos de la PokéAPI son estáticos — los Pokémon no cambian.
       * No necesitamos re-fetchear en cada montaje del componente.
       */
      staleTime: 5 * 60 * 1000,

      /**
       * gcTime: 10 minutos (antes llamado cacheTime en v4)
       * Tiempo que los datos permanecen en memoria después de que
       * el componente se desmonta. Si el usuario navega de vuelta,
       * los datos están disponibles inmediatamente.
       */
      gcTime: 10 * 60 * 1000,

      /**
       * retry: 2
       * En caso de error de red, reintenta 2 veces antes de
       * mostrar el estado de error al usuario.
       */
      retry: 2,

      /**
       * retryDelay: backoff exponencial
       * 1er reintento: 1s, 2do reintento: 2s
       * Evita saturar la API con reintentos inmediatos.
       */
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),

      /**
       * refetchOnWindowFocus: false
       * En mobile no existe el concepto de "window focus" como en web.
       * Desactivar evita re-fetches innecesarios al volver a la app.
       */
      refetchOnWindowFocus: false,

      /**
       * refetchOnReconnect: true
       * Cuando el dispositivo recupera conexión a internet,
       * re-fetchea los datos desactualizados automáticamente.
       */
      refetchOnReconnect: true,
    },
    mutations: {
      /**
       * retry: 0 para mutations
       * Las mutaciones no deben reintentarse automáticamente
       * para evitar acciones duplicadas (ej: guardar dos veces).
       */
      retry: 0,
    },
  },
});

// ---------------------------------------------------------------------------
// Componente Provider
// ---------------------------------------------------------------------------

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

// Exportar el queryClient para uso en tests y casos especiales
export { queryClient };

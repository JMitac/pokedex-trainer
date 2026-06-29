/**
 * @file usePokemonTypes.test.ts
 * @layer Features / Pokédex / Hooks / Tests
 *
 * Pruebas unitarias del hook usePokemonTypeMap.
 * Cubre: construcción del mapa, tipos múltiples, caché y errores.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePokemonTypeMap } from './usePokemonTypes';

// ---------------------------------------------------------------------------
// Mock del httpClient
// ---------------------------------------------------------------------------

jest.mock('@/shared/api', () => ({
  httpClient: { get: jest.fn() },
}));

import { httpClient } from '@/shared/api';
const mockGet = httpClient.get as jest.Mock;

// ---------------------------------------------------------------------------
// Datos mock — respuestas de la PokéAPI por tipo
// ---------------------------------------------------------------------------

const mockGrassResponse = {
  data: {
    name: 'grass',
    pokemon: [
      { pokemon: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' } },
      { pokemon: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' } },
      { pokemon: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' } },
      { pokemon: { name: 'oddish', url: 'https://pokeapi.co/api/v2/pokemon/43/' } },
    ],
  },
};

const mockPoisonResponse = {
  data: {
    name: 'poison',
    pokemon: [
      { pokemon: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' } },
      { pokemon: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' } },
      { pokemon: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' } },
      { pokemon: { name: 'ekans', url: 'https://pokeapi.co/api/v2/pokemon/23/' } },
    ],
  },
};

const mockFireResponse = {
  data: {
    name: 'fire',
    pokemon: [
      { pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
      { pokemon: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' } },
    ],
  },
};

// Respuesta vacía para los tipos restantes
const emptyTypeResponse = {
  data: { name: 'type', pokemon: [] },
};

// ---------------------------------------------------------------------------
// Wrapper con QueryClient
// ---------------------------------------------------------------------------

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('usePokemonTypeMap', () => {
  beforeEach(() => {
    // Por defecto todos los tipos devuelven vacío
    mockGet.mockResolvedValue(emptyTypeResponse);

    // Configurar respuestas específicas por tipo
    mockGet.mockImplementation((url: string) => {
      if (url.includes('/type/grass')) return Promise.resolve(mockGrassResponse);
      if (url.includes('/type/poison')) return Promise.resolve(mockPoisonResponse);
      if (url.includes('/type/fire')) return Promise.resolve(mockFireResponse);
      return Promise.resolve(emptyTypeResponse);
    });
  });

  afterEach(() => jest.clearAllMocks());

  // -------------------------------------------------------------------------
  // Estado inicial
  // -------------------------------------------------------------------------

  describe('estado inicial', () => {
    it('devuelve mapa vacío mientras carga', () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Construcción del mapa
  // -------------------------------------------------------------------------

  describe('construcción del mapa', () => {
    it('construye el mapa correctamente después de cargar', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
    });

    it('asigna tipo grass al id 1 (bulbasaur)', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[1]).toContain('grass');
    });

    it('asigna tipo fire al id 4 (charmander)', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[4]).toContain('fire');
    });

    it('asigna tipo fire al id 5 (charmeleon)', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[5]).toContain('fire');
    });

    it('asigna tipo grass a oddish (id 43)', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[43]).toContain('grass');
    });
  });

  // -------------------------------------------------------------------------
  // Pokémon con múltiples tipos
  // -------------------------------------------------------------------------

  describe('pokémon con múltiples tipos', () => {
    it('bulbasaur tiene grass Y poison', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const bulbasaurTypes = result.current.data?.[1] ?? [];
      expect(bulbasaurTypes).toContain('grass');
      expect(bulbasaurTypes).toContain('poison');
    });

    it('ivysaur tiene grass Y poison', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const ivysaurTypes = result.current.data?.[2] ?? [];
      expect(ivysaurTypes).toContain('grass');
      expect(ivysaurTypes).toContain('poison');
    });

    it('venusaur tiene grass Y poison', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const venusaurTypes = result.current.data?.[3] ?? [];
      expect(venusaurTypes).toContain('grass');
      expect(venusaurTypes).toContain('poison');
    });

    it('ekans solo tiene poison', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const ekansTypes = result.current.data?.[23] ?? [];
      expect(ekansTypes).toContain('poison');
      expect(ekansTypes).not.toContain('grass');
    });

    it('charmander solo tiene fire', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const charmanderTypes = result.current.data?.[4] ?? [];
      expect(charmanderTypes).toContain('fire');
      expect(charmanderTypes).not.toContain('grass');
      expect(charmanderTypes).not.toContain('poison');
    });
  });

  // -------------------------------------------------------------------------
  // Llamadas a la API
  // -------------------------------------------------------------------------

  describe('llamadas a la API', () => {
    it('hace requests para los 18 tipos en paralelo', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockGet).toHaveBeenCalledTimes(18);
    });

    it('hace request al endpoint /type/grass', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockGet).toHaveBeenCalledWith('/type/grass');
    });

    it('hace request al endpoint /type/fire', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockGet).toHaveBeenCalledWith('/type/fire');
    });

    it('hace request al endpoint /type/water', async () => {
      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockGet).toHaveBeenCalledWith('/type/water');
    });
  });

  // -------------------------------------------------------------------------
  // Manejo de errores
  // -------------------------------------------------------------------------

  describe('manejo de errores', () => {
    it('devuelve isError cuando la API falla', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('no devuelve datos cuando hay error', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePokemonTypeMap(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.data).toBeUndefined();
    });
  });
});
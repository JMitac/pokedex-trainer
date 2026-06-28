/**
 * @file usePokemonEvolution.test.ts
 * @layer Features / Pokédex / Hooks / Tests
 *
 * Pruebas unitarias del hook usePokemonEvolution.
 * Cubre: cadena de evolución, debilidades, estados de carga y error.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePokemonEvolution } from './usePokemonEvolution';
import type { PokemonDetail } from '../types/pokemon.types';

// ---------------------------------------------------------------------------
// Mock del httpClient
// ---------------------------------------------------------------------------

jest.mock('@/shared/api', () => ({
  httpClient: { get: jest.fn() },
}));

import { httpClient } from '@/shared/api';
const mockGet = httpClient.get as jest.Mock;

// ---------------------------------------------------------------------------
// Datos mock
// ---------------------------------------------------------------------------

const mockPokemon: PokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  heightM: 0.7,
  weightKg: 6.9,
  officialArtwork: 'https://artwork/1.png',
  sprite: 'https://sprites/1.png',
  types: ['grass', 'poison'],
  stats: [],
  abilities: ['overgrow'],
};

const mockSpeciesResponse = {
  data: {
    id: 1,
    name: 'bulbasaur',
    evolution_chain: {
      url: 'https://pokeapi.co/api/v2/evolution-chain/1/',
    },
  },
};

const mockEvolutionChainResponse = {
  data: {
    id: 1,
    chain: {
      species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
      evolution_details: [],
      evolves_to: [
        {
          species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
          evolution_details: [
            { min_level: 16, trigger: { name: 'level-up', url: '' }, item: null },
          ],
          evolves_to: [
            {
              species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' },
              evolution_details: [
                { min_level: 32, trigger: { name: 'level-up', url: '' }, item: null },
              ],
              evolves_to: [],
            },
          ],
        },
      ],
    },
  },
};

const mockGrassTypeResponse = {
  data: {
    id: 12,
    name: 'grass',
    damage_relations: {
      double_damage_from: [
        { name: 'fire', url: '' },
        { name: 'ice', url: '' },
        { name: 'poison', url: '' },
        { name: 'flying', url: '' },
        { name: 'bug', url: '' },
      ],
      half_damage_from: [],
      no_damage_from: [],
      double_damage_to: [],
      half_damage_to: [],
      no_damage_to: [],
    },
  },
};

const mockPoisonTypeResponse = {
  data: {
    id: 4,
    name: 'poison',
    damage_relations: {
      double_damage_from: [
        { name: 'ground', url: '' },
        { name: 'psychic', url: '' },
      ],
      half_damage_from: [],
      no_damage_from: [],
      double_damage_to: [],
      half_damage_to: [],
      no_damage_to: [],
    },
  },
};

// ---------------------------------------------------------------------------
// Wrapper
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

describe('usePokemonEvolution', () => {
  afterEach(() => jest.clearAllMocks());

  // -------------------------------------------------------------------------
  // Estado inicial sin datos
  // -------------------------------------------------------------------------

  describe('sin pokemon', () => {
    it('devuelve arrays vacíos cuando pokemon es undefined', () => {
      const { result } = renderHook(
        () => usePokemonEvolution(undefined),
        { wrapper: createWrapper() }
      );

      expect(result.current.evolutionChain).toHaveLength(0);
      expect(result.current.weaknesses).toHaveLength(0);
      expect(result.current.isLoading).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // Cadena de evolución
  // -------------------------------------------------------------------------

  describe('evolutionChain', () => {
    beforeEach(() => {
      mockGet.mockImplementation((url: string) => {
        if (url.includes('pokemon-species')) return Promise.resolve(mockSpeciesResponse);
        if (url.includes('evolution-chain')) return Promise.resolve(mockEvolutionChainResponse);
        if (url.includes('/type/grass')) return Promise.resolve(mockGrassTypeResponse);
        if (url.includes('/type/poison')) return Promise.resolve(mockPoisonTypeResponse);
        return Promise.resolve({ data: {} });
      });
    });

    it('devuelve los 3 eslabones de bulbasaur', async () => {
      const { result } = renderHook(
        () => usePokemonEvolution(mockPokemon),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.evolutionChain).toHaveLength(3);
    });

    it('el primer eslabón es bulbasaur', async () => {
      const { result } = renderHook(
        () => usePokemonEvolution(mockPokemon),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.evolutionChain[0].name).toBe('bulbasaur');
      expect(result.current.evolutionChain[0].id).toBe(1);
    });

    it('el segundo eslabón es ivysaur con nivel 16', async () => {
      const { result } = renderHook(
        () => usePokemonEvolution(mockPokemon),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.evolutionChain[1].name).toBe('ivysaur');
      expect(result.current.evolutionChain[1].minLevel).toBe(16);
    });

    it('el tercer eslabón es venusaur con nivel 32', async () => {
      const { result } = renderHook(
        () => usePokemonEvolution(mockPokemon),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.evolutionChain[2].name).toBe('venusaur');
      expect(result.current.evolutionChain[2].minLevel).toBe(32);
    });

    it('cada eslabón tiene sprite generado correctamente', async () => {
      const { result } = renderHook(
        () => usePokemonEvolution(mockPokemon),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.evolutionChain[0].sprite).toContain('1.png');
      expect(result.current.evolutionChain[1].sprite).toContain('2.png');
      expect(result.current.evolutionChain[2].sprite).toContain('3.png');
    });
  });

  // -------------------------------------------------------------------------
  // Debilidades
  // -------------------------------------------------------------------------

  describe('weaknesses', () => {
    beforeEach(() => {
      mockGet.mockImplementation((url: string) => {
        if (url.includes('pokemon-species')) return Promise.resolve(mockSpeciesResponse);
        if (url.includes('evolution-chain')) return Promise.resolve(mockEvolutionChainResponse);
        if (url.includes('/type/grass')) return Promise.resolve(mockGrassTypeResponse);
        if (url.includes('/type/poison')) return Promise.resolve(mockPoisonTypeResponse);
        return Promise.resolve({ data: {} });
      });
    });

    it('calcula las debilidades de bulbasaur (grass + poison)', async () => {
      const { result } = renderHook(
        () => usePokemonEvolution(mockPokemon),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Grass es débil a: fire, ice, poison, flying, bug
      // Poison es débil a: ground, psychic
      // Resultado combinado (x2 o más)
      expect(result.current.weaknesses.length).toBeGreaterThan(0);
    });

    it('incluye fire como debilidad', async () => {
      const { result } = renderHook(
        () => usePokemonEvolution(mockPokemon),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.weaknesses).toContain('fire');
    });

    it('incluye ice como debilidad', async () => {
      const { result } = renderHook(
        () => usePokemonEvolution(mockPokemon),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.weaknesses).toContain('ice');
    });

    it('incluye psychic como debilidad', async () => {
      const { result } = renderHook(
        () => usePokemonEvolution(mockPokemon),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.weaknesses).toContain('psychic');
    });
  });

  // -------------------------------------------------------------------------
  // Estado de error
  // -------------------------------------------------------------------------

  describe('manejo de errores', () => {
    it('devuelve isError cuando species falla', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(
        () => usePokemonEvolution(mockPokemon),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.evolutionChain).toHaveLength(0);
      expect(result.current.weaknesses).toHaveLength(0);
    });
  });
});
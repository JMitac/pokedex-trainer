/**
 * @file usePokemon.test.ts
 * @layer Features / Pokédex / Hooks / Tests
 *
 * Pruebas unitarias de los custom hooks del Pokédex.
 * Usan MSW para mockear la PokéAPI sin hacer requests reales.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePokemonList, usePokemonDetail, usePokemonInfiniteList } from './usePokemon';

// ---------------------------------------------------------------------------
// Mock del httpClient para no hacer requests reales en tests
// ---------------------------------------------------------------------------

jest.mock('@/shared/api', () => ({
  httpClient: {
    get: jest.fn(),
  },
}));

import { httpClient } from '@/shared/api';
const mockGet = httpClient.get as jest.Mock;

// ---------------------------------------------------------------------------
// Datos mock
// ---------------------------------------------------------------------------

const mockListResponse = {
  data: {
    count: 1302,
    next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
    previous: null,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
    ],
  },
};

const mockDetailResponse = {
  data: {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    base_experience: 64,
    sprites: {
      front_default: 'https://sprites/1.png',
      front_shiny: null,
      other: {
        'official-artwork': { front_default: 'https://artwork/1.png', front_shiny: null },
        dream_world: { front_default: null },
      },
    },
    types: [
      { slot: 1, type: { name: 'grass', url: '' } },
      { slot: 2, type: { name: 'poison', url: '' } },
    ],
    stats: [
      { base_stat: 45, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 49, effort: 0, stat: { name: 'attack', url: '' } },
    ],
    abilities: [
      { ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helper: wrapper con QueryClient para los hooks
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
// Tests: usePokemonList
// ---------------------------------------------------------------------------

describe('usePokemonList', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue(mockListResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devuelve isLoading en el estado inicial', () => {
    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('devuelve los datos correctamente', async () => {
    const { result } = renderHook(() => usePokemonList({ page: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(3);
    expect(result.current.data?.items[0].name).toBe('bulbasaur');
    expect(result.current.data?.items[0].id).toBe(1);
  });

  it('calcula el total correctamente', async () => {
    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.total).toBe(1302);
  });

  it('detecta que hay página siguiente', async () => {
    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.nextPage).toBe(2);
  });

  it('devuelve previousPage null en la primera página', async () => {
    const { result } = renderHook(() => usePokemonList({ page: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.previousPage).toBeNull();
  });

  it('no hace fetch cuando enabled es false', () => {
    const { result } = renderHook(
      () => usePokemonList({ enabled: false }),
      { wrapper: createWrapper() }
    );
    expect(mockGet).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('devuelve isError cuando la API falla', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePokemonList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ---------------------------------------------------------------------------
// Tests: usePokemonDetail
// ---------------------------------------------------------------------------

describe('usePokemonDetail', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue(mockDetailResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devuelve isLoading en el estado inicial', () => {
    const { result } = renderHook(
      () => usePokemonDetail({ id: 1 }),
      { wrapper: createWrapper() }
    );
    expect(result.current.isLoading).toBe(true);
  });

  it('devuelve el detalle transformado correctamente', async () => {
    const { result } = renderHook(
      () => usePokemonDetail({ id: 1 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.id).toBe(1);
    expect(result.current.data?.name).toBe('bulbasaur');
    expect(result.current.data?.types).toEqual(['grass', 'poison']);
  });

  it('convierte altura de decímetros a metros', async () => {
    const { result } = renderHook(
      () => usePokemonDetail({ id: 1 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.heightM).toBe(0.7); // 7 decímetros = 0.7 metros
  });

  it('convierte peso de hectogramos a kilogramos', async () => {
    const { result } = renderHook(
      () => usePokemonDetail({ id: 1 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.weightKg).toBe(6.9);
  });

  it('mapea los stats con labels en español', async () => {
    const { result } = renderHook(
      () => usePokemonDetail({ id: 1 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const hpStat = result.current.data?.stats.find((s) => s.name === 'hp');
    expect(hpStat?.label).toBe('PS');
    expect(hpStat?.value).toBe(45);
  });

  it('no hace fetch cuando id es 0', () => {
    renderHook(
      () => usePokemonDetail({ id: 0 }),
      { wrapper: createWrapper() }
    );
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('no hace fetch cuando enabled es false', () => {
    renderHook(
      () => usePokemonDetail({ id: 1, enabled: false }),
      { wrapper: createWrapper() }
    );
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('devuelve isError cuando la API falla', async () => {
    mockGet.mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(
      () => usePokemonDetail({ id: 9999 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

// ---------------------------------------------------------------------------
// Tests: usePokemonInfiniteList
// ---------------------------------------------------------------------------

describe('usePokemonInfiniteList', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue(mockListResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devuelve isLoading en el estado inicial', () => {
    const { result } = renderHook(
      () => usePokemonInfiniteList(),
      { wrapper: createWrapper() }
    );
    expect(result.current.isLoading).toBe(true);
  });

  it('devuelve la primera página correctamente', async () => {
    const { result } = renderHook(
      () => usePokemonInfiniteList(),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].items).toHaveLength(3);
  });

  it('detecta que hay más páginas', async () => {
    const { result } = renderHook(
      () => usePokemonInfiniteList(),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);
  });
});
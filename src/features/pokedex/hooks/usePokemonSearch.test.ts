/**
 * @file usePokemonSearch.test.ts
 * @layer Features / Pokédex / Hooks / Tests
 */

import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePokemonSearch } from './usePokemonSearch';

jest.mock('@/shared/api', () => ({
  httpClient: { get: jest.fn() },
}));

import { httpClient } from '@/shared/api';
const mockGet = httpClient.get as jest.Mock;

const mockCatalogResponse = {
  data: {
    count: 5,
    next: null,
    previous: null,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
      { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
    ],
  },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('usePokemonSearch', () => {
  beforeEach(() => {
    mockGet.mockResolvedValue(mockCatalogResponse);
  });

  afterEach(() => jest.clearAllMocks());

  it('inicia con búsqueda vacía', () => {
    const { result } = renderHook(() => usePokemonSearch(), {
      wrapper: createWrapper(),
    });
    expect(result.current.searchQuery).toBe('');
    expect(result.current.isSearching).toBe(false);
  });

  it('devuelve resultados vacíos cuando no hay búsqueda', async () => {
    const { result } = renderHook(() => usePokemonSearch(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoadingCatalog).toBe(false));
    expect(result.current.results).toHaveLength(0);
  });

  it('filtra por nombre parcial correctamente', async () => {
    const { result } = renderHook(() => usePokemonSearch(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoadingCatalog).toBe(false));

    act(() => {
      result.current.setSearchQuery('char');
    });

    expect(result.current.results).toHaveLength(2);
    expect(result.current.results[0].name).toBe('charmander');
    expect(result.current.results[1].name).toBe('charmeleon');
  });

  it('es insensible a mayúsculas', async () => {
    const { result } = renderHook(() => usePokemonSearch(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoadingCatalog).toBe(false));

    act(() => {
      result.current.setSearchQuery('BULBA');
    });

    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].name).toBe('bulbasaur');
  });

  it('devuelve vacío cuando no hay coincidencias', async () => {
    const { result } = renderHook(() => usePokemonSearch(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoadingCatalog).toBe(false));

    act(() => {
      result.current.setSearchQuery('pikachu');
    });

    expect(result.current.results).toHaveLength(0);
  });

  it('limpia la búsqueda correctamente', async () => {
    const { result } = renderHook(() => usePokemonSearch(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoadingCatalog).toBe(false));

    act(() => {
      result.current.setSearchQuery('char');
    });
    expect(result.current.isSearching).toBe(true);

    act(() => {
      result.current.clearSearch();
    });
    expect(result.current.searchQuery).toBe('');
    expect(result.current.isSearching).toBe(false);
    expect(result.current.results).toHaveLength(0);
  });

  it('activa isSearching cuando hay texto', async () => {
    const { result } = renderHook(() => usePokemonSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSearchQuery('bul');
    });

    expect(result.current.isSearching).toBe(true);
  });

  it('no activa isSearching con solo espacios', async () => {
    const { result } = renderHook(() => usePokemonSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSearchQuery('   ');
    });

    expect(result.current.isSearching).toBe(false);
  });
});
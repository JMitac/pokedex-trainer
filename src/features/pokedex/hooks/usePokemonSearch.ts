/**
 * @file usePokemonSearch.ts
 * @layer Features / Pokédex / Hooks
 *
 * Hook de búsqueda de Pokémon por nombre.
 *
 * Estrategia:
 * 1. Carga el catálogo completo de nombres una sola vez (límite 2000)
 *    — es muy liviano porque solo devuelve name + url, sin sprites ni stats
 * 2. Filtra localmente en tiempo real mientras el usuario escribe
 * 3. El caché de React Query mantiene el catálogo en memoria
 *    — no se vuelve a pedir mientras la app está abierta
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useCallback } from 'react';
import { httpClient } from '@/shared/api';
import { extractIdFromUrl, getSpriteUrl } from '../types/pokemon.types';
import type { PokemonListResponse, PokemonListItem } from '../types/pokemon.types';

// ---------------------------------------------------------------------------
// Query key
// ---------------------------------------------------------------------------

export const SEARCH_CATALOG_KEY = ['pokemon', 'catalog'] as const;

// ---------------------------------------------------------------------------
// Fetch del catálogo completo
// ---------------------------------------------------------------------------

const fetchPokemonCatalog = async (): Promise<PokemonListItem[]> => {
  const { data } = await httpClient.get<PokemonListResponse>('/pokemon', {
    params: { limit: 2000, offset: 0 },
  });

  return data.results.map((result) => {
    const id = extractIdFromUrl(result.url);
    return {
      id,
      name: result.name,
      sprite: getSpriteUrl(id),
      types: [],
    };
  });
};

// ---------------------------------------------------------------------------
// Hook principal
// ---------------------------------------------------------------------------

export interface UsePokemonSearchReturn {
  /** Texto actual del campo de búsqueda */
  searchQuery: string;
  /** Actualiza el texto de búsqueda */
  setSearchQuery: (query: string) => void;
  /** Limpia la búsqueda */
  clearSearch: () => void;
  /** Resultados filtrados */
  results: PokemonListItem[];
  /** Si hay una búsqueda activa */
  isSearching: boolean;
  /** Si el catálogo está cargando */
  isLoadingCatalog: boolean;
  /** Si el catálogo tuvo un error */
  isCatalogError: boolean;
}

export const usePokemonSearch = (): UsePokemonSearchReturn => {
  const [searchQuery, setSearchQueryState] = useState('');

  // Cargar catálogo completo — se cachea por 30 minutos
  const { data: catalog = [], isLoading, isError } = useQuery({
    queryKey: SEARCH_CATALOG_KEY,
    queryFn: fetchPokemonCatalog,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  // Filtrar localmente — useMemo evita re-calcular en cada render
  const results = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return [];

    return catalog.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(trimmed)
    ).slice(0, 30); // Limitar a 30 resultados para rendimiento
  }, [searchQuery, catalog]);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQueryState('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    results,
    isSearching: searchQuery.trim().length > 0,
    isLoadingCatalog: isLoading,
    isCatalogError: isError,
  };
};
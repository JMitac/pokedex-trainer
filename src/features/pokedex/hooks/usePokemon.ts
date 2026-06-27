/**
 * @file usePokemon.ts
 * @layer Features / Pokédex / Hooks
 *
 * Custom hooks que encapsulan React Query para el Pokédex.
 * Son la única forma en que los componentes acceden a los datos.
 *
 * REGLA: Los componentes nunca llaman queryFn directamente.
 * Siempre usan estos hooks para beneficiarse del caché,
 * los estados de carga y los reintentos automáticos.
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { pokemonKeys } from '@/shared/constants/queryKeys';
import {
  fetchPokemonList,
  fetchPokemonDetail,
  POKEMON_PAGE_SIZE,
} from '../queries/pokemon.queries';
import type { PokemonListPage } from '../queries/pokemon.queries';

// ---------------------------------------------------------------------------
// Hook: Lista de Pokémon (paginación simple)
// ---------------------------------------------------------------------------

export interface UsePokemonListOptions {
  page?: number;
  enabled?: boolean;
}

/**
 * Obtiene una página de la lista de Pokémon.
 * Usa paginación simple (una página a la vez).
 *
 * Uso:
 *   const { data, isLoading, isError, refetch } = usePokemonList({ page: 1 });
 */
export const usePokemonList = ({ page = 1, enabled = true }: UsePokemonListOptions = {}) => {
  return useQuery({
    queryKey: pokemonKeys.list(page),
    queryFn: () => fetchPokemonList({ page }),
    enabled,
    placeholderData: (previousData) => previousData,
  });
};

// ---------------------------------------------------------------------------
// Hook: Lista infinita de Pokémon (scroll infinito)
// ---------------------------------------------------------------------------

/**
 * Obtiene la lista de Pokémon con scroll infinito.
 * Carga más Pokémon automáticamente al hacer scroll hasta el final.
 *
 * Uso:
 *   const {
 *     data,
 *     isLoading,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 *   } = usePokemonInfiniteList();
 */
export const usePokemonInfiniteList = () => {
  return useInfiniteQuery({
    queryKey: pokemonKeys.lists(),
    queryFn: ({ pageParam }) =>
      fetchPokemonList({ page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PokemonListPage) => lastPage.nextPage,
    getPreviousPageParam: (firstPage: PokemonListPage) => firstPage.previousPage,
    staleTime: 5 * 60 * 1000,
  });
};

// ---------------------------------------------------------------------------
// Hook: Detalle de un Pokémon
// ---------------------------------------------------------------------------

export interface UsePokemonDetailOptions {
  id: number;
  enabled?: boolean;
}

/**
 * Obtiene el detalle completo de un Pokémon por ID.
 *
 * Uso:
 *   const { data, isLoading, isError } = usePokemonDetail({ id: 1 });
 */
export const usePokemonDetail = ({ id, enabled = true }: UsePokemonDetailOptions) => {
  return useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: () => fetchPokemonDetail(id),
    enabled: enabled && id > 0,
    staleTime: 10 * 60 * 1000, // El detalle es más estático — 10 min
  });
};

// ---------------------------------------------------------------------------
// Hook: Prefetch del detalle (para precargar al hover/tap en la lista)
// ---------------------------------------------------------------------------

import { useQueryClient } from '@tanstack/react-query';

/**
 * Precarga el detalle de un Pokémon en el caché antes de navegar.
 * Se llama cuando el usuario hace tap en una card de la lista,
 * para que la pantalla de detalle cargue instantáneamente.
 *
 * Uso:
 *   const prefetchPokemon = usePrefetchPokemon();
 *   <PokemonCard onPress={() => prefetchPokemon(pokemon.id)} />
 */
export const usePrefetchPokemon = () => {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: pokemonKeys.detail(id),
      queryFn: () => fetchPokemonDetail(id),
      staleTime: 10 * 60 * 1000,
    });
  };
};
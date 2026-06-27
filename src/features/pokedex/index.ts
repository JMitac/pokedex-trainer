/**
 * @file index.ts
 * @layer Features / Pokédex
 *
 * Barrel exports de la feature Pokédex.
 */

// Tipos
export * from './types/pokemon.types';

// Queries
export { fetchPokemonList, fetchPokemonDetail, POKEMON_PAGE_SIZE } from './queries/pokemon.queries';
export type { FetchPokemonListParams, PokemonListPage } from './queries/pokemon.queries';

// Hooks
export {
  usePokemonList,
  usePokemonDetail,
  usePokemonInfiniteList,
  usePrefetchPokemon,
} from './hooks/usePokemon';
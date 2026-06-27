/**
 * @file pokemon.queries.ts
 * @layer Features / Pokédex / Queries
 *
 * Funciones de fetching para la PokéAPI.
 * Se usan como queryFn en los hooks de React Query.
 *
 * REGLA: Las queries solo hacen fetching y transformación de datos.
 * No tienen lógica de negocio ni estado — eso va en los hooks.
 */

import { httpClient } from '@/shared/api';
import {
  PokemonListResponse,
  PokemonDetailResponse,
  PokemonListItem,
  PokemonDetail,
  extractIdFromUrl,
  getSpriteUrl,
  mapToPokemonDetail,
} from '../types/pokemon.types';

// ---------------------------------------------------------------------------
// Configuración de paginación
// ---------------------------------------------------------------------------

export const POKEMON_PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Query: Lista de Pokémon
// ---------------------------------------------------------------------------

export interface FetchPokemonListParams {
  page: number;
  limit?: number;
}

export interface PokemonListPage {
  items: PokemonListItem[];
  total: number;
  nextPage: number | null;
  previousPage: number | null;
}

/**
 * Obtiene una página de Pokémon de la PokéAPI.
 * Transforma la respuesta al formato que necesita la UI.
 */
export const fetchPokemonList = async ({
  page,
  limit = POKEMON_PAGE_SIZE,
}: FetchPokemonListParams): Promise<PokemonListPage> => {
  const offset = (page - 1) * limit;

  const { data } = await httpClient.get<PokemonListResponse>('/pokemon', {
    params: { limit, offset },
  });

  // Transformar los resultados al formato de lista
  const items: PokemonListItem[] = data.results.map((result) => {
    const id = extractIdFromUrl(result.url);
    return {
      id,
      name: result.name,
      sprite: getSpriteUrl(id),
      // Los tipos se cargan en el detalle — en la lista usamos sprite + nombre
      types: [],
    };
  });

  return {
    items,
    total: data.count,
    nextPage: data.next ? page + 1 : null,
    previousPage: data.previous ? page - 1 : null,
  };
};

// ---------------------------------------------------------------------------
// Query: Detalle de un Pokémon
// ---------------------------------------------------------------------------

/**
 * Obtiene el detalle completo de un Pokémon por ID.
 * Transforma la respuesta raw al DTO de PokemonDetail.
 */
export const fetchPokemonDetail = async (id: number): Promise<PokemonDetail> => {
  const { data } = await httpClient.get<PokemonDetailResponse>(`/pokemon/${id}`);
  return mapToPokemonDetail(data);
};
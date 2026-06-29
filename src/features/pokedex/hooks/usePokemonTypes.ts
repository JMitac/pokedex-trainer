/**
 * @file usePokemonTypes.ts
 * @layer Features / Pokédex / Hooks
 *
 * Hook que construye un mapa de ID → tipos para enriquecer la lista.
 *
 * Estrategia:
 * Carga los 18 tipos de la PokéAPI en paralelo una sola vez.
 * Construye un mapa { pokemonId: ['grass', 'poison'] } que se usa
 * para mostrar los tipos en la lista sin hacer un request por Pokémon.
 *
 * Se cachea 60 minutos — los tipos no cambian.
 */

import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/shared/api';
import { extractIdFromUrl } from '../types/pokemon.types';

// ---------------------------------------------------------------------------
// Tipos de la API
// ---------------------------------------------------------------------------

const ALL_TYPES = [
  'grass', 'fire', 'water', 'electric', 'psychic',
  'ice', 'dragon', 'dark', 'fairy', 'normal',
  'fighting', 'flying', 'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
] as const;

type TypeMap = Record<number, string[]>;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const usePokemonTypeMap = () => {
  return useQuery({
    queryKey: ['pokemon', 'type-map'],
    queryFn: async (): Promise<TypeMap> => {
      // Cargar todos los tipos en paralelo
      const responses = await Promise.all(
        ALL_TYPES.map((type) =>
          httpClient
            .get(`/type/${type}`)
            .then((r) => ({ type, pokemon: r.data.pokemon }))
        )
      );

      // Construir mapa id → tipos
      const typeMap: TypeMap = {};

      responses.forEach(({ type, pokemon }) => {
        pokemon.forEach(({ pokemon: p }: { pokemon: { url: string } }) => {
          const id = extractIdFromUrl(p.url);
          if (!typeMap[id]) typeMap[id] = [];
          typeMap[id].push(type);
        });
      });

      return typeMap;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 120 * 60 * 1000,
  });
};
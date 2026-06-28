/**
 * @file usePokemonEvolution.ts
 * @layer Features / Pokédex / Hooks
 *
 * Hook que obtiene la cadena de evolución y las debilidades
 * de un Pokémon combinando tres endpoints de la PokéAPI.
 */

import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/shared/api';
import {
  flattenEvolutionChain,
  calculateWeaknesses,
} from '../types/pokemon.evolution.types';
import type {
  PokemonSpeciesResponse,
  EvolutionChainResponse,
  TypeResponse,
  EvolutionStep,
} from '../types/pokemon.evolution.types';
import { extractIdFromUrl } from '../types/pokemon.types';
import type { PokemonDetail } from '../types/pokemon.types';

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const evolutionKeys = {
  species: (id: number) => ['pokemon', 'species', id] as const,
  chain: (id: number) => ['pokemon', 'evolution-chain', id] as const,
  weaknesses: (types: string[]) => ['pokemon', 'weaknesses', ...types] as const,
};

// ---------------------------------------------------------------------------
// Hook principal
// ---------------------------------------------------------------------------

export interface UsePokemonEvolutionReturn {
  evolutionChain: EvolutionStep[];
  weaknesses: string[];
  isLoading: boolean;
  isError: boolean;
}

export const usePokemonEvolution = (
  pokemon: PokemonDetail | undefined
): UsePokemonEvolutionReturn => {
  const pokemonId = pokemon?.id ?? 0;
  const types = pokemon?.types ?? [];
  const enabled = pokemonId > 0;

  // -------------------------------------------------------------------------
  // Step 1: Obtener species para conseguir la URL de la cadena de evolución
  // -------------------------------------------------------------------------

  const {
    data: species,
    isLoading: isLoadingSpecies,
    isError: isErrorSpecies,
  } = useQuery({
    queryKey: evolutionKeys.species(pokemonId),
    queryFn: () =>
      httpClient
        .get<PokemonSpeciesResponse>(`/pokemon-species/${pokemonId}`)
        .then((r) => r.data),
    enabled,
    staleTime: 10 * 60 * 1000,
  });

  // -------------------------------------------------------------------------
  // Step 2: Obtener la cadena de evolución
  // -------------------------------------------------------------------------

  const chainId = species?.evolution_chain?.url
    ? extractIdFromUrl(species.evolution_chain.url)
    : 0;

  const {
    data: evolutionData,
    isLoading: isLoadingChain,
    isError: isErrorChain,
  } = useQuery({
    queryKey: evolutionKeys.chain(chainId),
    queryFn: () =>
      httpClient
        .get<EvolutionChainResponse>(`/evolution-chain/${chainId}`)
        .then((r) => r.data),
    enabled: chainId > 0,
    staleTime: 10 * 60 * 1000,
  });

  // -------------------------------------------------------------------------
  // Step 3: Obtener debilidades por tipo
  // -------------------------------------------------------------------------

  const {
    data: typeData,
    isLoading: isLoadingTypes,
    isError: isErrorTypes,
  } = useQuery({
    queryKey: evolutionKeys.weaknesses(types),
    queryFn: async () => {
      const responses = await Promise.all(
        types.map((type) =>
          httpClient
            .get<TypeResponse>(`/type/${type}`)
            .then((r) => r.data.damage_relations)
        )
      );
      return responses;
    },
    enabled: enabled && types.length > 0,
    staleTime: 30 * 60 * 1000,
  });

  // -------------------------------------------------------------------------
  // Transformación de datos
  // -------------------------------------------------------------------------

  const evolutionChain = evolutionData
    ? flattenEvolutionChain(evolutionData.chain)
    : [];

  const weaknesses = typeData ? calculateWeaknesses(typeData) : [];

  return {
    evolutionChain,
    weaknesses,
    isLoading: isLoadingSpecies || isLoadingChain || isLoadingTypes,
    isError: isErrorSpecies || isErrorChain || isErrorTypes,
  };
};
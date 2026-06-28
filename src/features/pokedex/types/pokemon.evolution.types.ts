/**
 * @file pokemon.evolution.types.ts
 * @layer Features / Pokédex / Types
 *
 * Tipos para cadenas de evolución y relaciones de daño (debilidades).
 */

// ---------------------------------------------------------------------------
// Species — para obtener la evolution_chain url
// ---------------------------------------------------------------------------

export interface PokemonSpeciesResponse {
  id: number;
  name: string;
  evolution_chain: {
    url: string;
  };
}

// ---------------------------------------------------------------------------
// Evolution Chain
// ---------------------------------------------------------------------------

export interface EvolutionDetail {
  min_level: number | null;
  trigger: { name: string; url: string };
  item: { name: string } | null;
}

export interface ChainLink {
  species: { name: string; url: string };
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface EvolutionChainResponse {
  id: number;
  chain: ChainLink;
}

// ---------------------------------------------------------------------------
// DTO — Eslabón de evolución simplificado para la UI
// ---------------------------------------------------------------------------

export interface EvolutionStep {
  id: number;
  name: string;
  sprite: string;
  /** Nivel mínimo de evolución (null si es por objeto o trueque) */
  minLevel: number | null;
  /** Método de evolución legible */
  trigger: string;
}

// ---------------------------------------------------------------------------
// Type damage relations — para debilidades
// ---------------------------------------------------------------------------

export interface DamageRelation {
  name: string;
  url: string;
}

export interface TypeDamageRelations {
  double_damage_from: DamageRelation[];
  half_damage_from: DamageRelation[];
  no_damage_from: DamageRelation[];
  double_damage_to: DamageRelation[];
  half_damage_to: DamageRelation[];
  no_damage_to: DamageRelation[];
}

export interface TypeResponse {
  id: number;
  name: string;
  damage_relations: TypeDamageRelations;
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

import { extractIdFromUrl, getSpriteUrl } from './pokemon.types';

/**
 * Extrae la cadena lineal de evoluciones desde el árbol de la API.
 * Toma el primer camino de evolución (ignora bifurcaciones como Eevee).
 */
export const flattenEvolutionChain = (chain: ChainLink): EvolutionStep[] => {
  const steps: EvolutionStep[] = [];

  const traverse = (link: ChainLink) => {
    const id = extractIdFromUrl(link.species.url);
    const detail = link.evolution_details[0];

    steps.push({
      id,
      name: link.species.name,
      sprite: getSpriteUrl(id),
      minLevel: detail?.min_level ?? null,
      trigger: detail?.trigger?.name ?? 'base',
    });

    if (link.evolves_to.length > 0) {
      traverse(link.evolves_to[0]);
    }
  };

  traverse(chain);
  return steps;
};

/**
 * Calcula las debilidades reales considerando múltiples tipos.
 * Un Pokémon es débil a un tipo si recibe x2 o más de daño.
 * Cancela si uno de sus tipos es inmune (x0).
 */
export const calculateWeaknesses = (
  typeRelations: TypeDamageRelations[]
): string[] => {
  const multipliers: Record<string, number> = {};

  typeRelations.forEach((relations) => {
    relations.double_damage_from.forEach(({ name }) => {
      multipliers[name] = (multipliers[name] ?? 1) * 2;
    });
    relations.half_damage_from.forEach(({ name }) => {
      multipliers[name] = (multipliers[name] ?? 1) * 0.5;
    });
    relations.no_damage_from.forEach(({ name }) => {
      multipliers[name] = 0;
    });
  });

  return Object.entries(multipliers)
    .filter(([, mult]) => mult >= 2)
    .map(([name]) => name);
};

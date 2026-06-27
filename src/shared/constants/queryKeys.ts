/**
 * @file queryKeys.ts
 * @layer Shared / Constants
 *
 * Query keys centralizadas para React Query.
 *
 * REGLA: Nunca escribir query keys como strings sueltos en los hooks.
 * Siempre importar desde aquí para garantizar consistencia
 * e invalidación correcta del caché.
 *
 * Patrón: array factory para keys jerarquicas.
 * Permite invalidar por prefijo: queryClient.invalidateQueries({ queryKey: pokemonKeys.all })
 */

export const pokemonKeys = {
  /** Prefijo raíz — invalida todo el caché de Pokémon */
  all: ['pokemon'] as const,

  /** Lista de Pokémon con paginación */
  lists: () => [...pokemonKeys.all, 'list'] as const,
  list: (page: number) => [...pokemonKeys.lists(), { page }] as const,

  /** Detalle de un Pokémon por ID */
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (id: number) => [...pokemonKeys.details(), id] as const,
} as const;
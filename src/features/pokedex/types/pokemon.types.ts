/**
 * @file pokemon.types.ts
 * @layer Features / Pokédex / Types
 *
 * Modelos de dominio para el Pokédex.
 * Tipan exactamente lo que devuelve la PokéAPI y lo que
 * necesitan los componentes — nada más, nada menos.
 */

// ---------------------------------------------------------------------------
// Respuesta de la lista de Pokémon — GET /pokemon?limit=20&offset=0
// ---------------------------------------------------------------------------

export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

// ---------------------------------------------------------------------------
// Pokémon simplificado para la lista
// Se construye a partir de la URL que devuelve la lista
// ---------------------------------------------------------------------------

export interface PokemonListItem {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

// ---------------------------------------------------------------------------
// Respuesta del detalle de un Pokémon — GET /pokemon/{id}
// ---------------------------------------------------------------------------

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

// ---------------------------------------------------------------------------
// DTO — lo que los componentes consumen (simplificado y normalizado)
// ---------------------------------------------------------------------------

export interface StatItem {
  name: string;
  value: number;
  /** Nombre legible para mostrar en UI */
  label: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  /** Altura en metros (la API devuelve decímetros) */
  heightM: number;
  /** Peso en kilogramos (la API devuelve hectogramos) */
  weightKg: number;
  /** Sprite oficial para la pantalla de detalle */
  officialArtwork: string;
  /** Sprite pequeño para la lista */
  sprite: string;
  types: string[];
  stats: StatItem[];
  abilities: string[];
}

// ---------------------------------------------------------------------------
// Utilidades de transformación
// ---------------------------------------------------------------------------

/**
 * Extrae el ID de Pokémon desde la URL de la PokéAPI.
 * Ej: "https://pokeapi.co/api/v2/pokemon/1/" → 1
 */
export const extractIdFromUrl = (url: string): number => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

/**
 * Genera la URL del sprite desde el ID del Pokémon.
 * Usa los sprites oficiales hosteados en GitHub de PokeAPI.
 */
export const getSpriteUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

/**
 * Genera la URL del artwork oficial desde el ID.
 */
export const getOfficialArtworkUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

/**
 * Mapas de nombres de stats a labels legibles en español.
 */
export const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};

/**
 * Transforma la respuesta raw de la API al DTO de PokemonDetail.
 */
export const mapToPokemonDetail = (raw: PokemonDetailResponse): PokemonDetail => ({
  id: raw.id,
  name: raw.name,
  heightM: raw.height / 10,
  weightKg: raw.weight / 10,
  officialArtwork:
    raw.sprites.other['official-artwork'].front_default ??
    getOfficialArtworkUrl(raw.id),
  sprite: raw.sprites.front_default ?? getSpriteUrl(raw.id),
  types: raw.types.map((t) => t.type.name),
  stats: raw.stats.map((s) => ({
    name: s.stat.name,
    value: s.base_stat,
    label: STAT_LABELS[s.stat.name] ?? s.stat.name,
  })),
  abilities: raw.abilities.map((a) => a.ability.name),
});

/**
 * @file starter.types.ts
 * @layer Features / Trainer / Types
 *
 * Tipos para el Pokémon inicial del entrenador.
 */

// ---------------------------------------------------------------------------
// Pokémon inicial guardado
// ---------------------------------------------------------------------------

export interface StarterPokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  level: number;
}

// ---------------------------------------------------------------------------
// Tipos disponibles para selección aleatoria
// ---------------------------------------------------------------------------

export const STARTER_RANDOM_TYPES = [
  { key: 'fire',     label: 'Fuego',     emoji: '🔥' },
  { key: 'water',    label: 'Agua',      emoji: '💧' },
  { key: 'grass',    label: 'Planta',    emoji: '🌿' },
  { key: 'electric', label: 'Eléctrico', emoji: '⚡' },
  { key: 'psychic',  label: 'Psíquico',  emoji: '🔮' },
  { key: 'ice',      label: 'Hielo',     emoji: '❄️' },
  { key: 'dragon',   label: 'Dragón',    emoji: '🐉' },
  { key: 'ghost',    label: 'Fantasma',  emoji: '👻' },
  { key: 'fighting', label: 'Lucha',     emoji: '🥊' },
  { key: 'poison',   label: 'Veneno',    emoji: '☠️' },
  { key: 'bug',      label: 'Bicho',     emoji: '🐛' },
  { key: 'normal',   label: 'Normal',    emoji: '⭐' },
] as const;

// ---------------------------------------------------------------------------
// Los 3 starters clásicos
// ---------------------------------------------------------------------------

export const CLASSIC_STARTERS = [
  {
    id: 1,
    name: 'bulbasaur',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    officialArt: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    types: ['grass', 'poison'],
    description: 'Planta / Veneno',
  },
  {
    id: 4,
    name: 'charmander',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    officialArt: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    types: ['fire'],
    description: 'Fuego',
  },
  {
    id: 7,
    name: 'squirtle',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    officialArt: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    types: ['water'],
    description: 'Agua',
  },
] as const;

/**
 * @file colors.ts
 * @layer UI / Tokens
 *
 * Paleta de colores del Design System retro Pokémon.
 * Inspirado en la GameBoy Color y los juegos clásicos de Pokémon.
 *
 * Dos temas: light (crema/beige) y dark (azul oscuro).
 */

// ---------------------------------------------------------------------------
// Paleta base — valores primitivos
// ---------------------------------------------------------------------------

const palette = {
  // Cremas y beiges — tema claro
  cream50: '#F5F0E8',
  cream100: '#EDE8DC',
  cream200: '#DDD8CC',
  cream300: '#C8C3B8',

  // Grises retro
  retroGray100: '#C8C8A0',
  retroGray200: '#A8A890',
  retroGray300: '#888878',
  retroGray400: '#686858',
  retroGray500: '#484840',

  // Azules oscuros — tema dark
  darkBg: '#1a1a2e',
  darkSurface: '#16213e',
  darkCard: '#0f3460',
  darkBorder: '#2a2a4e',
  darkBorderLight: '#3a3a5e',

  // Rojos Pokémon
  pokeRed: '#CC3333',
  pokeRedLight: '#FF5555',
  pokeRedDark: '#AA2222',

  // Verdes
  green400: '#44AA44',
  green500: '#228B22',
  green600: '#1A6B1A',

  // Amarillos
  yellow400: '#DDAA00',
  yellow500: '#BB8800',

  // Pokémon — tipos (mismos colores oficiales)
  pokemonFire: '#FF6B35',
  pokemonWater: '#4D9DE0',
  pokemonGrass: '#57CC99',
  pokemonElectric: '#F7B731',
  pokemonPsychic: '#F72585',
  pokemonIce: '#72EFDD',
  pokemonDragon: '#7B2FBE',
  pokemonDark: '#3D2C8D',
  pokemonFairy: '#FF85A1',
  pokemonNormal: '#A8A8A8',
  pokemonFighting: '#C77DFF',
  pokemonFlying: '#90E0EF',
  pokemonPoison: '#9B5DE5',
  pokemonGround: '#C9A84C',
  pokemonRock: '#8B7355',
  pokemonBug: '#70A741',
  pokemonGhost: '#4A4E69',
  pokemonSteel: '#B0B8C1',

  // Neutros
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// ---------------------------------------------------------------------------
// Tema claro — estilo GameBoy Color / retro beige
// ---------------------------------------------------------------------------

export const lightColors = {
  // Backgrounds
  background: palette.cream100,
  surface: palette.cream50,
  surfaceElevated: palette.white,
  surfaceMuted: palette.cream200,

  // Texto
  textPrimary: '#1a1a1a',
  textSecondary: palette.retroGray400,
  textMuted: palette.retroGray300,
  textInverse: palette.white,
  textDisabled: palette.retroGray200,
  textAccent: palette.pokeRed,

  // Bordes — estilo pixel art con borde negro grueso
  border: '#000000',
  borderStrong: '#000000',
  borderFocus: palette.pokeRed,
  borderLight: palette.cream300,

  // Marca
  primary: palette.pokeRed,
  primaryLight: '#FFE5E5',
  primaryDark: palette.pokeRedDark,

  // Estados
  success: palette.green500,
  successLight: '#E5FFE5',
  successDark: palette.green600,
  warning: palette.yellow400,
  warningLight: '#FFF8E5',
  warningDark: palette.yellow500,
  error: palette.pokeRed,
  errorLight: '#FFE5E5',
  errorDark: palette.pokeRedDark,
  info: '#4D9DE0',
  infoLight: '#E5F4FF',
  infoDark: '#3A7AB8',

  // UI
  overlay: 'rgba(0, 0, 0, 0.6)',
  skeleton: palette.cream200,
  skeletonHighlight: palette.cream100,
  disabled: palette.cream300,
  disabledText: palette.retroGray300,
  transparent: palette.transparent,
  black: palette.black,
  white: palette.white,

  // Pokémon tipos
  pokemonTypes: {
    fire: palette.pokemonFire,
    water: palette.pokemonWater,
    grass: palette.pokemonGrass,
    electric: palette.pokemonElectric,
    psychic: palette.pokemonPsychic,
    ice: palette.pokemonIce,
    dragon: palette.pokemonDragon,
    dark: palette.pokemonDark,
    fairy: palette.pokemonFairy,
    normal: palette.pokemonNormal,
    fighting: palette.pokemonFighting,
    flying: palette.pokemonFlying,
    poison: palette.pokemonPoison,
    ground: palette.pokemonGround,
    rock: palette.pokemonRock,
    bug: palette.pokemonBug,
    ghost: palette.pokemonGhost,
    steel: palette.pokemonSteel,
  },

  palette,
} as const;

// ---------------------------------------------------------------------------
// Tema oscuro — estilo azul profundo
// ---------------------------------------------------------------------------

export const darkColors = {
  background: palette.darkBg,
  surface: palette.darkSurface,
  surfaceElevated: palette.darkCard,
  surfaceMuted: palette.darkBorder,

  textPrimary: '#E8E8FF',
  textSecondary: '#A8A8CC',
  textMuted: '#686888',
  textInverse: '#1a1a2e',
  textDisabled: '#444466',
  textAccent: '#FF6B6B',

  border: palette.darkBorderLight,
  borderStrong: '#5a5a8e',
  borderFocus: '#FF6B6B',
  borderLight: palette.darkBorder,

  primary: '#FF6B6B',
  primaryLight: '#3a1a1a',
  primaryDark: '#CC3333',

  success: '#44AA44',
  successLight: '#1a3a1a',
  successDark: '#228B22',
  warning: '#DDAA00',
  warningLight: '#3a2a00',
  warningDark: '#BB8800',
  error: '#FF6B6B',
  errorLight: '#3a1a1a',
  errorDark: '#CC3333',
  info: '#4D9DE0',
  infoLight: '#1a2a3a',
  infoDark: '#3A7AB8',

  overlay: 'rgba(0, 0, 0, 0.8)',
  skeleton: palette.darkBorder,
  skeletonHighlight: palette.darkSurface,
  disabled: palette.darkBorder,
  disabledText: '#444466',
  transparent: palette.transparent,
  black: palette.black,
  white: palette.white,

  pokemonTypes: {
    fire: palette.pokemonFire,
    water: palette.pokemonWater,
    grass: palette.pokemonGrass,
    electric: palette.pokemonElectric,
    psychic: palette.pokemonPsychic,
    ice: palette.pokemonIce,
    dragon: palette.pokemonDragon,
    dark: palette.pokemonDark,
    fairy: palette.pokemonFairy,
    normal: palette.pokemonNormal,
    fighting: palette.pokemonFighting,
    flying: palette.pokemonFlying,
    poison: palette.pokemonPoison,
    ground: palette.pokemonGround,
    rock: palette.pokemonRock,
    bug: palette.pokemonBug,
    ghost: palette.pokemonGhost,
    steel: palette.pokemonSteel,
  },

  palette,
} as const;

// Por defecto exportamos el tema claro
export const colors = lightColors;
export type ColorToken = keyof Omit<typeof lightColors, 'palette' | 'pokemonTypes'>;
export type PokemonType = keyof typeof lightColors.pokemonTypes;
export type AppColors = typeof lightColors;
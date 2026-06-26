/**
 * @file colors.ts
 * @layer UI / Tokens
 *
 * Paleta de colores del Design System nativo.
 * Fuente de verdad única para todos los colores de la aplicación.
 *
 * REGLA: Ningún componente, screen o estilo debe usar un valor
 * hexadecimal hardcodeado. Siempre se importa desde aquí.
 */

// ---------------------------------------------------------------------------
// Paleta base — valores primitivos, no se usan directamente en componentes
// ---------------------------------------------------------------------------

const palette = {
  // Rojos
  red50: '#FFF5F5',
  red100: '#FED7D7',
  red200: '#FC8181',
  red500: '#E53E3E',
  red600: '#C53030',
  red900: '#63171B',

  // Verdes
  green50: '#F0FFF4',
  green100: '#C6F6D5',
  green200: '#9AE6B4',
  green500: '#38A169',
  green600: '#276749',
  green900: '#1C4532',

  // Azules
  blue50: '#EBF8FF',
  blue100: '#BEE3F8',
  blue200: '#90CDF4',
  blue500: '#3182CE',
  blue600: '#2B6CB0',
  blue900: '#1A365D',

  // Amarillos / Warnings
  yellow50: '#FFFFF0',
  yellow100: '#FEFCBF',
  yellow200: '#FAF089',
  yellow500: '#D69E2E',
  yellow600: '#B7791F',
  yellow900: '#744210',

  // Púrpuras
  purple50: '#FAF5FF',
  purple100: '#E9D8FD',
  purple200: '#D6BCFA',
  purple500: '#805AD5',
  purple600: '#6B46C1',
  purple900: '#322659',

  // Grises neutros
  gray50: '#F7F8FA',
  gray100: '#EDF0F4',
  gray200: '#E2E8F0',
  gray300: '#CBD5E0',
  gray400: '#A0AEC0',
  gray500: '#718096',
  gray600: '#4A5568',
  gray700: '#2D3748',
  gray800: '#1A202C',
  gray900: '#171923',

  // Pokémon — colores de tipos
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

  // Blancos y negros puros
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// ---------------------------------------------------------------------------
// Tokens semánticos — estos SÍ se usan en los componentes
// Cada token tiene un significado claro: para qué sirve, no qué color es
// ---------------------------------------------------------------------------

export const colors = {
  // --- Marca ---
  primary: palette.red500,
  primaryLight: palette.red100,
  primaryDark: palette.red600,

  // --- Superficies (backgrounds) ---
  background: palette.gray50,
  surface: palette.white,
  surfaceElevated: palette.white,
  surfaceMuted: palette.gray100,

  // --- Texto ---
  textPrimary: palette.gray900,
  textSecondary: palette.gray600,
  textMuted: palette.gray400,
  textInverse: palette.white,
  textDisabled: palette.gray300,

  // --- Bordes ---
  border: palette.gray200,
  borderStrong: palette.gray300,
  borderFocus: palette.blue500,

  // --- Estados semánticos ---
  success: palette.green500,
  successLight: palette.green50,
  successDark: palette.green600,

  warning: palette.yellow500,
  warningLight: palette.yellow50,
  warningDark: palette.yellow600,

  error: palette.red500,
  errorLight: palette.red50,
  errorDark: palette.red600,

  info: palette.blue500,
  infoLight: palette.blue50,
  infoDark: palette.blue600,

  // --- UI general ---
  overlay: 'rgba(0, 0, 0, 0.5)',
  skeleton: palette.gray200,
  skeletonHighlight: palette.gray100,
  disabled: palette.gray200,
  disabledText: palette.gray400,

  // --- Pokémon types ---
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

  // Acceso a paleta base si se necesita en casos excepcionales
  palette,
} as const;

// Tipo derivado automáticamente — no se mantiene a mano
export type ColorToken = keyof Omit<typeof colors, 'palette' | 'pokemonTypes'>;
export type PokemonType = keyof typeof colors.pokemonTypes;

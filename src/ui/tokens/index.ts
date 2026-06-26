/**
 * @file index.ts
 * @layer UI / Tokens
 *
 * Punto de entrada único del sistema de tokens.
 *
 * Uso:
 *   import { colors, spacing, typography } from '@/ui/tokens';
 *
 * Nunca importar directamente de colors.ts, spacing.ts, etc.
 * Siempre desde este barrel para mantener una sola ruta de importación.
 */

export { colors } from './colors';
export type { ColorToken, PokemonType } from './colors';

export {
  spacing,
  borderRadius,
  borderWidth,
  elevation,
} from './spacing';
export type { SpacingToken, BorderRadiusToken } from './spacing';

export {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  textStyles,
} from './typography';
export type { TextStyleToken } from './typography';

// ---------------------------------------------------------------------------
// Objeto theme — acceso unificado a todos los tokens en un solo objeto.
// Útil para pasar el tema completo a través de Context si se necesita
// soporte de temas dinámicos (dark mode) en el futuro.
// ---------------------------------------------------------------------------

import { colors } from './colors';
import { spacing, borderRadius, borderWidth, elevation } from './spacing';
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  textStyles,
} from './typography';

export const theme = {
  colors,
  spacing,
  borderRadius,
  borderWidth,
  elevation,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  textStyles,
} as const;

export type Theme = typeof theme;

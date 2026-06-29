/**
 * @file typography.ts
 * @layer UI / Tokens
 *
 * Sistema tipográfico retro Pokémon.
 *
 * Press Start 2P — títulos, nombres, números, encabezados
 * VT323           — cuerpo, valores, texto secundario
 *
 * IMPORTANTE: Las fuentes se cargan con useFonts() en App.tsx
 * antes de renderizar la navegación.
 */

import { TextStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Familias tipográficas
// ---------------------------------------------------------------------------

export const fontFamily = {
  /** Fuente pixelada 8-bit — títulos y elementos destacados */
  pixel: 'PressStart2P_400Regular',

  /** Fuente monoespaciada retro — texto de cuerpo y valores */
  mono: 'VT323_400Regular',

  /** Fallback del sistema */
  system: undefined,
} as const;

// ---------------------------------------------------------------------------
// Escala de tamaños
// ---------------------------------------------------------------------------

export const fontSize = {
  xxs: 8,
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 26,
  display: 32,
} as const;

// ---------------------------------------------------------------------------
// Pesos tipográficos
// ---------------------------------------------------------------------------

export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

// ---------------------------------------------------------------------------
// Altura de línea
// ---------------------------------------------------------------------------

export const lineHeight = {
  tight: 1.4,
  normal: 1.6,
  relaxed: 2.0,
} as const;

// ---------------------------------------------------------------------------
// Estilos predefinidos
// ---------------------------------------------------------------------------

export const textStyles = {
  // Títulos con fuente pixel
  headingXL: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xxxl,
    lineHeight: fontSize.xxxl * lineHeight.tight,
    color: '#1a1a1a',
  } as TextStyle,

  headingLG: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xxl,
    lineHeight: fontSize.xxl * lineHeight.tight,
    color: '#1a1a1a',
  } as TextStyle,

  headingMD: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.tight,
    color: '#1a1a1a',
  } as TextStyle,

  headingSM: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.tight,
    color: '#1a1a1a',
  } as TextStyle,

  // Cuerpo con fuente mono retro
  bodyLG: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.normal,
  } as TextStyle,

  bodyMD: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.normal,
  } as TextStyle,

  bodySM: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  } as TextStyle,

  // Labels
  labelLG: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.tight,
  } as TextStyle,

  labelMD: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.tight,
  } as TextStyle,

  labelSM: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.tight,
  } as TextStyle,

  // Caption
  caption: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
  } as TextStyle,

  // Mono
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  } as TextStyle,

  // Pokémon específicos — pixel font
  pokemonName: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.tight,
  } as TextStyle,

  pokemonNumber: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.tight,
  } as TextStyle,

  statValue: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.tight,
  } as TextStyle,

  displayLarge: {
    fontFamily: fontFamily.pixel,
    fontSize: fontSize.display,
    lineHeight: fontSize.display * lineHeight.tight,
  } as TextStyle,
} as const;

export type TextStyleToken = keyof typeof textStyles;
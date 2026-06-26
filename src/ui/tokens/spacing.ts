/**
 * @file spacing.ts
 * @layer UI / Tokens
 *
 * Sistema de espaciado basado en una escala de 4px.
 * Todos los márgenes, paddings, gaps y tamaños de layout
 * deben derivarse de estos valores.
 *
 * REGLA: Prohibido usar números mágicos como margin: 13 o padding: 7.
 * Si un valor no existe en la escala, usar el más cercano
 * o solicitar agregar uno nuevo aquí con su justificación.
 */

// ---------------------------------------------------------------------------
// Escala base — múltiplos de 4px (estándar de la industria mobile)
// ---------------------------------------------------------------------------

export const spacing = {
  /** 0px — sin espacio */
  none: 0,

  /** 2px — separación mínima, casi invisible */
  xxxs: 2,

  /** 4px — separación entre elementos muy cercanos (ej: icono y texto) */
  xxs: 4,

  /** 8px — espacio pequeño (ej: padding de un badge, gap en chips) */
  xs: 8,

  /** 12px — espacio compacto (ej: padding interno de botones pequeños) */
  sm: 12,

  /** 16px — espacio base (ej: padding horizontal de cards, separación entre campos) */
  md: 16,

  /** 20px — espacio medio-grande */
  lg: 20,

  /** 24px — espacio grande (ej: padding de secciones, separación entre cards) */
  xl: 24,

  /** 32px — espacio muy grande (ej: separación entre secciones de una pantalla) */
  xxl: 32,

  /** 40px — espacio extra grande (ej: padding top de pantallas con safe area) */
  xxxl: 40,

  /** 48px — altura estándar de controles táctiles (mínimo recomendado por Apple HIG y Material) */
  touchTarget: 48,

  /** 56px — altura de botones primarios y barras de acción */
  controlHeight: 56,

  /** 64px — altura de headers y elementos de navegación */
  headerHeight: 64,

  /** 80px — altura de cards de Pokémon en lista */
  pokemonCardHeight: 80,

  /** 120px — tamaño del sprite de Pokémon en la pantalla de lista */
  pokemonSpriteSmall: 80,

  /** 200px — tamaño del sprite oficial en pantalla de detalle */
  pokemonSpriteLarge: 200,
} as const;

// ---------------------------------------------------------------------------
// Border radius — consistencia en bordes redondeados
// ---------------------------------------------------------------------------

export const borderRadius = {
  /** Sin redondeo */
  none: 0,

  /** 4px — redondeo sutil, para inputs y chips pequeños */
  xs: 4,

  /** 8px — redondeo estándar, para cards y botones */
  sm: 8,

  /** 12px — redondeo medio, para cards grandes */
  md: 12,

  /** 16px — redondeo pronunciado, para modales y bottom sheets */
  lg: 16,

  /** 24px — redondeo muy pronunciado, para badges de tipo Pokémon */
  xl: 24,

  /** 9999px — píldora completa, para tags y badges */
  full: 9999,
} as const;

// ---------------------------------------------------------------------------
// Border width
// ---------------------------------------------------------------------------

export const borderWidth = {
  none: 0,
  thin: 0.5,
  base: 1,
  medium: 1.5,
  thick: 2,
} as const;

// ---------------------------------------------------------------------------
// Elevación (shadows) — solo para Android; iOS usa shadow* props
// ---------------------------------------------------------------------------

export const elevation = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
} as const;

// Tipos derivados
export type SpacingToken = keyof typeof spacing;
export type BorderRadiusToken = keyof typeof borderRadius;

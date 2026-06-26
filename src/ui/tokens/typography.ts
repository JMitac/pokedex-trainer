/**
 * @file typography.ts
 * @layer UI / Tokens
 *
 * Sistema tipográfico de la aplicación.
 * Define la escala de tamaños, pesos, alturas de línea
 * y estilos de texto predefinidos listos para usar.
 *
 * REGLA: No usar fontSize, fontWeight o lineHeight sueltos
 * en componentes. Siempre usar los estilos predefinidos de
 * `textStyles` o los tokens individuales de esta escala.
 */

import { Platform, TextStyle } from 'react-native';

// ---------------------------------------------------------------------------
// Familias tipográficas
// React Native usa las fuentes del sistema por plataforma por defecto.
// Si se integra una fuente custom, se reemplaza aquí y se propaga sola.
// ---------------------------------------------------------------------------

export const fontFamily = {
  /**
   * Fuente principal — San Francisco en iOS, Roboto en Android.
   * undefined en RN significa "fuente del sistema", que es lo correcto.
   */
  regular: Platform.select({
    ios: undefined,
    android: undefined,
  }),

  /**
   * Fuente monoespaciada — para IDs de Pokémon, códigos, etc.
   */
  mono: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
  }),
} as const;

// ---------------------------------------------------------------------------
// Escala de tamaños — basada en escala tipográfica modular
// ---------------------------------------------------------------------------

export const fontSize = {
  /** 10px — etiquetas muy pequeñas, superíndices */
  xxs: 10,

  /** 12px — captions, ayudas de formulario, metadatos */
  xs: 12,

  /** 14px — texto de apoyo, labels de campos, badges */
  sm: 14,

  /** 16px — cuerpo de texto principal */
  md: 16,

  /** 18px — texto destacado, subtítulos */
  lg: 18,

  /** 20px — títulos de sección */
  xl: 20,

  /** 24px — títulos de pantalla */
  xxl: 24,

  /** 28px — nombre del Pokémon en detalle */
  xxxl: 28,

  /** 36px — números grandes (stats, número de Pokémon) */
  display: 36,
} as const;

// ---------------------------------------------------------------------------
// Pesos tipográficos
// ---------------------------------------------------------------------------

export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
} as const;

// ---------------------------------------------------------------------------
// Altura de línea — valores que respiran bien en mobile
// ---------------------------------------------------------------------------

export const lineHeight = {
  tight: 1.2,   // Para títulos grandes — menos espacio vertical
  normal: 1.5,  // Para cuerpo de texto — cómodo de leer
  relaxed: 1.75, // Para texto largo — máxima legibilidad
} as const;

// ---------------------------------------------------------------------------
// Estilos de texto predefinidos (text styles)
// Listos para usar con spread en StyleSheet
// ---------------------------------------------------------------------------

export const textStyles = {
  // Displays — números o texto muy grande
  displayLarge: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.display * lineHeight.tight,
  } as TextStyle,

  // Títulos de pantalla
  headingXL: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * lineHeight.tight,
  } as TextStyle,

  headingLG: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
  } as TextStyle,

  headingMD: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xl * lineHeight.tight,
  } as TextStyle,

  headingSM: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg * lineHeight.normal,
  } as TextStyle,

  // Cuerpo de texto
  bodyLG: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
  } as TextStyle,

  bodyMD: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  } as TextStyle,

  bodySM: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
  } as TextStyle,

  // Labels — para campos de formulario, navegación
  labelLG: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.md * lineHeight.tight,
  } as TextStyle,

  labelMD: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.tight,
  } as TextStyle,

  labelSM: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xs * lineHeight.tight,
  } as TextStyle,

  // Caption — texto de apoyo muy pequeño
  caption: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xxs * lineHeight.normal,
  } as TextStyle,

  // Mono — IDs de Pokémon, números de pokedex
  mono: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.mono ?? undefined,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  } as TextStyle,

  // Pokemon number — #0001 en la lista
  pokemonNumber: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.mono ?? undefined,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xs * lineHeight.tight,
  } as TextStyle,

  // Pokemon name — en la card de lista
  pokemonName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.md * lineHeight.tight,
  } as TextStyle,

  // Stat value — número de las estadísticas base
  statValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.sm * lineHeight.tight,
    fontFamily: fontFamily.mono ?? undefined,
  } as TextStyle,
} as const;

export type TextStyleToken = keyof typeof textStyles;

/**
 * @file Badge.tsx
 * @layer UI / Components / Badge
 *
 * Componente de etiqueta visual para tipos de Pokémon y estados semánticos.
 *
 * REGLA: Los colores de tipos Pokémon siempre deben venir de
 * colors.pokemonTypes — nunca hardcodear valores hexadecimales
 * para los tipos directamente en los componentes de feature.
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, textStyles } from '@/ui/tokens';
import { Typography } from '@/ui/components/Typography';
import type { PokemonType } from '@/ui/tokens';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type BadgeVariant =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'pokemon';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /**
   * Texto que se muestra dentro del badge.
   */
  label: string;

  /**
   * Variante semántica del badge.
   * - neutral: gris — etiquetas genéricas
   * - success: verde — estados positivos
   * - warning: amarillo — estados de advertencia
   * - error: rojo — estados de error
   * - info: azul — información
   * - pokemon: usa pokemonType para el color
   * @default 'neutral'
   */
  variant?: BadgeVariant;

  /**
   * Tipo de Pokémon — solo se aplica cuando variant="pokemon".
   * Determina el color de fondo del badge.
   */
  pokemonType?: PokemonType;

  /**
   * Tamaño del badge.
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Estilo visual del badge.
   * - solid: fondo de color sólido, texto blanco
   * - outline: solo borde, texto del color del variant
   * - subtle: fondo muy suave, texto del color del variant
   * @default 'solid'
   */
  appearance?: 'solid' | 'outline' | 'subtle';

  /**
   * Estilos adicionales del contenedor.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * ID para pruebas automatizadas.
   */
  testID?: string;
}

// ---------------------------------------------------------------------------
// Configuración de colores por variante
// ---------------------------------------------------------------------------

const VARIANT_COLORS: Record<
  Exclude<BadgeVariant, 'pokemon'>,
  { bg: string; text: string; border: string; subtleBg: string }
> = {
  neutral: {
    bg: colors.textSecondary,
    text: colors.textInverse,
    border: colors.textSecondary,
    subtleBg: colors.surfaceMuted,
  },
  success: {
    bg: colors.success,
    text: colors.textInverse,
    border: colors.success,
    subtleBg: colors.successLight,
  },
  warning: {
    bg: colors.warning,
    text: colors.textInverse,
    border: colors.warning,
    subtleBg: colors.warningLight,
  },
  error: {
    bg: colors.error,
    text: colors.textInverse,
    border: colors.error,
    subtleBg: colors.errorLight,
  },
  info: {
    bg: colors.info,
    text: colors.textInverse,
    border: colors.info,
    subtleBg: colors.infoLight,
  },
};

// ---------------------------------------------------------------------------
// Configuración de tamaños
// ---------------------------------------------------------------------------

const SIZE_STYLES: Record<
  BadgeSize,
  { paddingHorizontal: number; paddingVertical: number; textStyle: object }
> = {
  sm: {
    paddingHorizontal: spacing.xxs,
    paddingVertical: 2,
    textStyle: textStyles.caption,
  },
  md: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxxs,
    textStyle: textStyles.labelSM,
  },
  lg: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    textStyle: textStyles.labelMD,
  },
};

// ---------------------------------------------------------------------------
// Helper: obtener colores según variante y pokemonType
// ---------------------------------------------------------------------------

function getBadgeColors(
  variant: BadgeVariant,
  pokemonType?: PokemonType
): { bg: string; text: string; border: string; subtleBg: string } {
  if (variant === 'pokemon') {
    const typeColor =
      pokemonType && colors.pokemonTypes[pokemonType]
        ? colors.pokemonTypes[pokemonType]
        : colors.textSecondary;

    return {
      bg: typeColor,
      text: colors.textInverse,
      border: typeColor,
      subtleBg: `${typeColor}22`, // 13% de opacidad
    };
  }

  return VARIANT_COLORS[variant];
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  pokemonType,
  size = 'md',
  appearance = 'solid',
  style,
  testID,
}) => {
  const badgeColors = getBadgeColors(variant, pokemonType);
  const sizeStyle = SIZE_STYLES[size];

  const containerStyle = {
    paddingHorizontal: sizeStyle.paddingHorizontal,
    paddingVertical: sizeStyle.paddingVertical,
    backgroundColor:
      appearance === 'solid'
        ? badgeColors.bg
        : appearance === 'subtle'
        ? badgeColors.subtleBg
        : colors.transparent,
    borderWidth: appearance === 'outline' ? 1 : 0,
    borderColor: badgeColors.border,
  };

  const textColor =
    appearance === 'solid' ? badgeColors.text : badgeColors.bg;

  return (
    <View
      style={[styles.base, containerStyle, style]}
      testID={testID}
      accessibilityLabel={label}
    >
      <Typography
        style={[sizeStyle.textStyle, { color: textColor }]}
        testID={testID ? `${testID}-label` : undefined}
        uppercase={variant === 'pokemon'}
      >
        {label}
      </Typography>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Sub-componente de conveniencia: TypeBadge
// Para los tipos de Pokémon — el caso de uso más frecuente en el proyecto
// ---------------------------------------------------------------------------

export interface TypeBadgeProps {
  /**
   * Tipo de Pokémon — determina el color y el texto del badge.
   */
  type: PokemonType;

  /**
   * Tamaño del badge.
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Estilos adicionales.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * ID para pruebas automatizadas.
   */
  testID?: string;
}

/**
 * Badge especializado para tipos de Pokémon.
 * Muestra el nombre del tipo en mayúsculas con el color oficial.
 *
 * Uso:
 *   <TypeBadge type="fire" />   → badge naranja "FIRE"
 *   <TypeBadge type="water" />  → badge azul "WATER"
 */
export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  size = 'md',
  style,
  testID,
}) => (
  <Badge
    label={type}
    variant="pokemon"
    pokemonType={type}
    size={size}
    appearance="solid"
    style={style}
    testID={testID ?? `badge-type-${type}`}
  />
);

// ---------------------------------------------------------------------------
// Estilos base
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

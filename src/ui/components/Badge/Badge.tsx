/**
 * @file Badge.tsx
 * @layer UI / Components / Badge
 *
 * Componente de etiqueta visual con estilo retro pixel art.
 * Los tipos Pokémon se muestran en español y en mayúsculas.
 */

import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { borderRadius, textStyles } from '@/ui/tokens';
import type { PokemonType } from '@/ui/tokens';

// ---------------------------------------------------------------------------
// Mapa de tipo en inglés → español
// ---------------------------------------------------------------------------

export const POKEMON_TYPE_NAMES_ES: Record<string, string> = {
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  psychic: 'Psíquico',
  ice: 'Hielo',
  dragon: 'Dragón',
  dark: 'Siniestro',
  fairy: 'Hada',
  normal: 'Normal',
  fighting: 'Lucha',
  flying: 'Volador',
  poison: 'Veneno',
  ground: 'Tierra',
  rock: 'Roca',
  bug: 'Bicho',
  ghost: 'Fantasma',
  steel: 'Acero',
};

// Colores oficiales por tipo
const TYPE_COLORS: Record<string, string> = {
  fire: '#FF6B35',
  water: '#4D9DE0',
  grass: '#57CC99',
  electric: '#F7B731',
  psychic: '#F72585',
  ice: '#72EFDD',
  dragon: '#7B2FBE',
  dark: '#3D2C8D',
  fairy: '#FF85A1',
  normal: '#A8A8A8',
  fighting: '#C77DFF',
  flying: '#90E0EF',
  poison: '#9B5DE5',
  ground: '#C9A84C',
  rock: '#8B7355',
  bug: '#70A741',
  ghost: '#4A4E69',
  steel: '#B0B8C1',
};

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'pokemon';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  pokemonType?: PokemonType;
  size?: BadgeSize;
  appearance?: 'solid' | 'outline' | 'subtle';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// Colores semánticos
const VARIANT_COLORS: Record<
  Exclude<BadgeVariant, 'pokemon'>,
  { bg: string; text: string }
> = {
  neutral: { bg: '#718096', text: '#FFFFFF' },
  success: { bg: '#38A169', text: '#FFFFFF' },
  warning: { bg: '#D69E2E', text: '#FFFFFF' },
  error:   { bg: '#E53E3E', text: '#FFFFFF' },
  info:    { bg: '#3182CE', text: '#FFFFFF' },
};

// Tamaños
const SIZE_STYLES: Record<BadgeSize, {
  paddingH: number;
  paddingV: number;
  fontSize: number;
}> = {
  sm: { paddingH: 4,  paddingV: 3, fontSize: 7 },
  md: { paddingH: 8,  paddingV: 3, fontSize: 11 },
  lg: { paddingH: 12, paddingV: 4, fontSize: 12 },
};

// ---------------------------------------------------------------------------
// Componente Badge
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
  const sizeStyle = SIZE_STYLES[size];

  let bgColor: string;
  let textColor: string;

  if (variant === 'pokemon' && pokemonType) {
    bgColor = TYPE_COLORS[pokemonType] ?? '#A8A8A8';
    textColor = '#FFFFFF';
  } else if (variant !== 'pokemon') {
    bgColor = VARIANT_COLORS[variant].bg;
    textColor = VARIANT_COLORS[variant].text;
  } else {
    bgColor = '#A8A8A8';
    textColor = '#FFFFFF';
  }

  const containerBg =
    appearance === 'solid'
      ? bgColor
      : appearance === 'subtle'
      ? `${bgColor}33`
      : 'transparent';

  const textCol =
    appearance === 'solid' ? textColor : bgColor;

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: containerBg,
          borderWidth: appearance === 'outline' ? 1.5 : 1.5,
          borderColor: appearance === 'outline' ? bgColor : '#000000',
          paddingHorizontal: sizeStyle.paddingH,
          paddingTop: sizeStyle.paddingV,
          //paddingVertical: sizeStyle.paddingV,
        },
        style,
      ]}
      testID={testID}
      accessibilityLabel={label}
    >
      <Text
        style={[
          styles.text,
          {
            color: textCol,
            fontSize: sizeStyle.fontSize,
          },
        ]}
        testID={testID ? `${testID}-label` : undefined}
      >
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </Text>
    </View>
  );
};

// ---------------------------------------------------------------------------
// TypeBadge — badge especializado para tipos Pokémon en español
// ---------------------------------------------------------------------------

export interface TypeBadgeProps {
  type: PokemonType;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  size = 'md',
  style,
  testID,
}) => {
  const labelEs = POKEMON_TYPE_NAMES_ES[type] ?? type;

  return (
    <Badge
      label={labelEs}
      variant="pokemon"
      pokemonType={type}
      size={size}
      appearance="solid"
      style={style}
      testID={testID ?? `badge-type-${type}`}
    />
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: 0,
    //borderRadius: borderRadius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'PressStart2P_400Regular',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});

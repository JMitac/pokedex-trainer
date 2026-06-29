/**
 * @file PokemonCard.tsx
 * @layer Features / Pokédex / Components
 *
 * Card de Pokémon con estilo retro pixel art.
 * Barra de color del tipo a la izquierda, tipografía pixel.
 */

import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/app/providers/ThemeContext';
import { TypeBadge } from '@/ui/components/Badge';
import { spacing, borderRadius } from '@/ui/tokens';
import { textStyles } from '@/ui/tokens/typography';
import { Text } from 'react-native';
import type { PokemonListItem } from '../types/pokemon.types';
import type { PokemonType } from '@/ui/tokens';

// Colores de tipo para la barra lateral
const TYPE_COLORS: Record<string, string> = {
  grass: '#57CC99',
  fire: '#FF6B35',
  water: '#4D9DE0',
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

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onPress: () => void;
  testID?: string;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onPress,
  testID,
}) => {
  const { colors } = useTheme();
  const primaryType = pokemon.types[0] ?? 'normal';
  const typeColor = TYPE_COLORS[primaryType] ?? '#A8A8A8';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      accessibilityLabel={`Pokémon ${pokemon.name}, número ${pokemon.id}`}
      accessibilityHint="Toca para ver el detalle completo"
      testID={testID ?? `pokemon-card-${pokemon.id}`}
    >
      {/* Barra de color del tipo a la izquierda */}
      <View style={[styles.typeBar, { backgroundColor: typeColor }]} />

      {/* Contenido */}
      <View style={[styles.spriteContainer, { backgroundColor: typeColor + '22' }]}>
        <Image
          source={{ uri: pokemon.sprite }}
          style={styles.sprite}
          resizeMode="contain"
          testID={`${testID ?? `pokemon-card-${pokemon.id}`}-sprite`}
        />
      </View>

      <View style={styles.info}>
        {/* Número */}
        <Text
          style={[textStyles.pokemonNumber, { color: colors.textSecondary }]}
          testID={`${testID ?? `pokemon-card-${pokemon.id}`}-number`}
        >
          #{String(pokemon.id).padStart(4, '0')}
        </Text>

        {/* Nombre */}
        <Text
          style={[textStyles.pokemonName, { color: colors.textPrimary, marginTop: 4 }]}
          numberOfLines={1}
          testID={`${testID ?? `pokemon-card-${pokemon.id}`}-name`}
        >
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </Text>

        {/* Badges de tipos */}
        {pokemon.types.length > 0 && (
          <View style={styles.types}>
            {pokemon.types.map((type) => (
              <TypeBadge
                key={type}
                type={type as PokemonType}
                size="sm"
                testID={`${testID ?? `pokemon-card-${pokemon.id}`}-type-${type}`}
              />
            ))}
          </View>
        )}
      </View>

      {/* Ícono Pokébola derecha */}
      <View style={styles.pokeballContainer}>
        <Text style={[styles.pokeball, { color: colors.textMuted }]}>⊙</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginVertical: 3,
    borderWidth: 2,
    borderRadius: 0, // Estilo pixel art — sin redondeo
    overflow: 'hidden',
  },
  typeBar: {
    width: 6,
    alignSelf: 'stretch',
  },
  spriteContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    width: 72,
    height: 72,
  },
  info: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  types: {
    flexDirection: 'row',
    gap: spacing.xxs,
    marginTop: spacing.xxs,
  },
  pokeballContainer: {
    paddingRight: spacing.sm,
  },
  pokeball: {
    fontSize: 28,
  },
});

/**
 * @file PokemonCard.tsx
 * @layer Features / Pokédex / Components
 *
 * Card de Pokémon para la lista principal.
 * Muestra sprite, número, nombre y tipos.
 */

import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Card } from '@/ui/components/Card';
import { TypeBadge } from '@/ui/components/Badge';
import { PokemonNumber, PokemonName } from '@/ui/components/Typography';
import { spacing } from '@/ui/tokens';
import type { PokemonListItem } from '../types/pokemon.types';
import type { PokemonType } from '@/ui/tokens';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onPress: () => void;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onPress,
  testID,
}) => (
  <Card
    variant="elevated"
    onPress={onPress}
    accessibilityLabel={`Pokémon ${pokemon.name}, número ${pokemon.id}`}
    accessibilityHint="Toca para ver el detalle completo"
    testID={testID ?? `pokemon-card-${pokemon.id}`}
    style={styles.card}
    padding={spacing.sm}
  >
    <View style={styles.content}>
      {/* Sprite */}
      <Image
        source={{ uri: pokemon.sprite }}
        style={styles.sprite}
        resizeMode="contain"
        accessibilityLabel={`Sprite de ${pokemon.name}`}
        testID={`${testID ?? `pokemon-card-${pokemon.id}`}-sprite`}
      />

      {/* Info */}
      <View style={styles.info}>
        <PokemonNumber testID={`${testID ?? `pokemon-card-${pokemon.id}`}-number`}>
          #{String(pokemon.id).padStart(4, '0')}
        </PokemonNumber>

        <PokemonName
          numberOfLines={1}
          style={styles.name}
          testID={`${testID ?? `pokemon-card-${pokemon.id}`}-name`}
        >
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </PokemonName>

        {/* Tipos */}
        {pokemon.types.length > 0 && (
          <View style={styles.types}>
            {pokemon.types.map((type) => (
              <TypeBadge
                key={type}
                type={type as PokemonType}
                size="sm"
                style={styles.badge}
                testID={`${testID ?? `pokemon-card-${pokemon.id}`}-type-${type}`}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  </Card>
);

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xxs,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sprite: {
    width: 80,
    height: 80,
  },
  info: {
    flex: 1,
    gap: spacing.xxxs,
  },
  name: {
    textTransform: 'capitalize',
  },
  types: {
    flexDirection: 'row',
    gap: spacing.xxs,
    marginTop: spacing.xxs,
  },
  badge: {
    marginRight: spacing.xxxs,
  },
});

/**
 * @file StarterCard.tsx
 * @layer Features / Trainer / Components
 *
 * Card del Pokémon inicial del entrenador.
 * Sprite más grande con fondo suave para mejor visibilidad.
 */

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import { useTheme } from '@/app/providers/ThemeContext';
import { TypeBadge } from '@/ui/components/Badge';
import { textStyles, spacing, borderRadius } from '@/ui/tokens';
import type { PokemonType } from '@/ui/tokens';
import type { StarterPokemon } from '../types/starter.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface StarterCardProps {
  starter: StarterPokemon | null;
  onChooseStarter: () => void;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const StarterCard: React.FC<StarterCardProps> = ({
  starter,
  onChooseStarter,
  testID,
}) => {
  const { colors } = useTheme();

  // Sin starter — botón para elegir
  if (!starter) {
    return (
      <Pressable
        onPress={onChooseStarter}
        style={[
          styles.emptyCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        testID={testID ?? 'starter-card-empty'}
      >
        <Text style={styles.pokeball}>⊙</Text>
        <Text style={[textStyles.headingSM, { color: colors.textPrimary, textAlign: 'center' }]}>
          Pokémon Inicial
        </Text>
        <Text style={[textStyles.bodyMD, { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs }]}>
          ¡Elige tu compañero de aventura!
        </Text>
        <View style={[styles.chooseBtn, { backgroundColor: colors.primary, borderColor: '#000' }]}>
          <Text style={[textStyles.labelSM, { color: colors.textInverse }]}>
            Elegir Pokémon
          </Text>
        </View>
      </Pressable>
    );
  }

  // Con starter
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      testID={testID ?? 'starter-card'}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <Text style={[textStyles.headingSM, { color: colors.textPrimary }]}>
          Pokémon Inicial
        </Text>
        <Pressable
          onPress={onChooseStarter}
          style={[styles.changeBtn, { borderColor: colors.border }]}
          testID="starter-change-btn"
        >
          <Text style={[textStyles.caption, { color: colors.textSecondary }]}>
            Cambiar
          </Text>
        </Pressable>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {/* Sprite con fondo */}
        <View style={[styles.spriteContainer, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
          <Image
            source={{ uri: starter.sprite }}
            style={styles.sprite}
            resizeMode="contain"
            testID="starter-sprite"
          />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text
            style={[textStyles.pokemonNumber, { color: colors.textSecondary }]}
            testID="starter-number"
          >
            #{String(starter.id).padStart(4, '0')}
          </Text>
          <Text
            style={[
              textStyles.pokemonName,
              { color: colors.textPrimary, textTransform: 'capitalize', marginTop: 4 },
            ]}
            testID="starter-name"
          >
            {starter.name}
          </Text>

          {/* Tipos */}
          <View style={styles.types}>
            {starter.types.map((type) => (
              <TypeBadge
                key={type}
                type={type as PokemonType}
                size="sm"
                testID={`starter-type-${type}`}
              />
            ))}
          </View>

          {/* Nivel */}
          <View style={[
            styles.levelBadge,
            { backgroundColor: colors.primaryLight, borderColor: colors.primary },
          ]}>
            <Text style={[textStyles.caption, { color: colors.primary }]}>
              Nv. {starter.level}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  emptyCard: {
    borderWidth: 2,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  pokeball: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  chooseBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderWidth: 2,
  },
  card: {
    borderWidth: 2,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
  },
  changeBtn: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  spriteContainer: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: borderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    width: 88,
    height: 88,
  },
  info: {
    flex: 1,
    gap: spacing.xxs,
  },
  types: {
    flexDirection: 'row',
    gap: spacing.xxs,
    marginTop: spacing.xxs,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderWidth: 1,
    marginTop: spacing.xxs,
    borderRadius: borderRadius.xs,
  },
});

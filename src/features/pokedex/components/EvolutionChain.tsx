/**
 * @file EvolutionChain.tsx
 * @layer Features / Pokédex / Components
 *
 * Muestra la cadena de evolución de un Pokémon.
 * Cada eslabón es presionable y navega al detalle de ese Pokémon.
 */

import React from 'react';
import {
  View,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors, spacing, fontSize } from '@/ui/tokens';
import { PokemonName, PokemonNumber, Caption } from '@/ui/components/Typography';
import type { EvolutionStep } from '../types/pokemon.evolution.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EvolutionChainProps {
  chain: EvolutionStep[];
  currentId: number;
  onPokemonPress: (id: number, name: string) => void;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const EvolutionChain: React.FC<EvolutionChainProps> = ({
  chain,
  currentId,
  onPokemonPress,
  testID,
}) => {
  if (chain.length <= 1) {
    return (
      <View style={styles.noEvolution} testID={`${testID}-no-evolution`}>
        <Caption color="textMuted" align="center">
          Este Pokémon no evoluciona
        </Caption>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      testID={testID}
    >
      {chain.map((step, index) => {
        const isCurrentPokemon = step.id === currentId;
        const isLast = index === chain.length - 1;

        return (
          <View key={step.id} style={styles.stepWrapper}>
            {/* Eslabón de evolución */}
            <Pressable
              onPress={() => {
                if (!isCurrentPokemon) {
                  onPokemonPress(step.id, step.name);
                }
              }}
              style={[
                styles.pokemonItem,
                isCurrentPokemon && styles.pokemonItemCurrent,
              ]}
              disabled={isCurrentPokemon}
              accessibilityRole="button"
              accessibilityLabel={`Ver detalle de ${step.name}`}
              accessibilityState={{ selected: isCurrentPokemon }}
              testID={`${testID}-step-${step.id}`}
            >
              <Image
                source={{ uri: step.sprite }}
                style={styles.sprite}
                resizeMode="contain"
                testID={`${testID}-sprite-${step.id}`}
              />
              <PokemonNumber testID={`${testID}-number-${step.id}`}>
                #{String(step.id).padStart(4, '0')}
              </PokemonNumber>
              <PokemonName
                numberOfLines={1}
                style={styles.name}
                testID={`${testID}-name-${step.id}`}
              >
                {step.name.charAt(0).toUpperCase() + step.name.slice(1)}
              </PokemonName>

              {/* Nivel de evolución */}
              {step.minLevel && (
                <Caption color="textMuted" testID={`${testID}-level-${step.id}`}>
                  Nv. {step.minLevel}
                </Caption>
              )}
            </Pressable>

            {/* Flecha entre eslabones */}
            {!isLast && (
              <View style={styles.arrowContainer} testID={`${testID}-arrow-${index}`}>
                <Caption style={styles.arrow}>→</Caption>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pokemonItem: {
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: 12,
    minWidth: 80,
  },
  pokemonItemCurrent: {
    backgroundColor: colors.primaryLight,
  },
  sprite: {
    width: 72,
    height: 72,
  },
  name: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  arrowContainer: {
    paddingHorizontal: spacing.xxs,
  },
  arrow: {
    fontSize: fontSize.xl,
    color: colors.textMuted,
  },
  noEvolution: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});

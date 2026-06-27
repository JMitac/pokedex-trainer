/**
 * @file PokemonDetailScreen.tsx
 * @layer Features / Pokédex / Screens
 *
 * Pantalla de detalle de un Pokémon.
 * Muestra imagen oficial, tipos, estadísticas base y habilidades.
 */

import React from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePokemonDetail } from '../hooks/usePokemon';
import { StatBar } from '../components/StatBar';
import { TypeBadge } from '@/ui/components/Badge';
import { PokemonDetailSkeleton } from '@/ui/components/Skeleton';
import { Heading, Body, Label, Caption } from '@/ui/components/Typography';
import { Button } from '@/ui/components/Button';
import { colors, spacing } from '@/ui/tokens';
import type { PokemonType } from '@/ui/tokens';
import type { PokedexNavigationProp } from '@/app/navigation';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type Props = PokedexNavigationProp<'PokemonDetail'>;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const PokemonDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, name } = route.params;

  const { data: pokemon, isLoading, isError, refetch } = usePokemonDetail({ id });

  // ---------------------------------------------------------------------------
  // Estado de carga
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <PokemonDetailSkeleton testID="detail-skeleton" />
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // Estado de error
  // ---------------------------------------------------------------------------

  if (isError || !pokemon) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centered} testID="detail-error">
          <Heading size="md" align="center" color="textSecondary">
            No encontramos a {name}
          </Heading>
          <Body align="center" color="textMuted" style={styles.errorText}>
            Hubo un problema al cargar los datos del Pokémon.
          </Body>
          <Button
            label="Reintentar"
            variant="primary"
            onPress={() => refetch()}
            testID="detail-retry-button"
            style={styles.retryButton}
          />
          <Button
            label="Volver al Pokédex"
            variant="ghost"
            onPress={() => navigation.goBack()}
            testID="detail-back-button"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // Render principal
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        testID="detail-scroll"
      >
        {/* Imagen oficial */}
        <View style={styles.imageContainer} testID="detail-image-container">
          <Image
            source={{ uri: pokemon.officialArtwork }}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={`Artwork oficial de ${pokemon.name}`}
            testID="detail-image"
          />
        </View>

        {/* Número y nombre */}
        <View style={styles.header} testID="detail-header">
          <Caption testID="detail-number">
            #{String(pokemon.id).padStart(4, '0')}
          </Caption>
          <Heading
            size="xl"
            align="center"
            style={styles.pokemonName}
            testID="detail-name"
          >
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Heading>
        </View>

        {/* Tipos */}
        <View style={styles.typesRow} testID="detail-types">
          {pokemon.types.map((type) => (
            <TypeBadge
              key={type}
              type={type as PokemonType}
              size="lg"
              testID={`detail-type-${type}`}
            />
          ))}
        </View>

        {/* Medidas */}
        <View style={styles.measureRow} testID="detail-measures">
          <View style={styles.measureItem}>
            <Label color="textSecondary">Altura</Label>
            <Body testID="detail-height">{pokemon.heightM} m</Body>
          </View>
          <View style={styles.measureDivider} />
          <View style={styles.measureItem}>
            <Label color="textSecondary">Peso</Label>
            <Body testID="detail-weight">{pokemon.weightKg} kg</Body>
          </View>
        </View>

        {/* Estadísticas base */}
        <View style={styles.section} testID="detail-stats">
          <Heading size="sm" style={styles.sectionTitle}>
            Estadísticas Base
          </Heading>
          {pokemon.stats.map((stat) => (
            <StatBar
              key={stat.name}
              label={stat.label}
              value={stat.value}
              testID={`detail-stat-${stat.name}`}
            />
          ))}
        </View>

        {/* Habilidades */}
        <View style={styles.section} testID="detail-abilities">
          <Heading size="sm" style={styles.sectionTitle}>
            Habilidades
          </Heading>
          <View style={styles.abilitiesRow}>
            {pokemon.abilities.map((ability) => (
              <View key={ability} style={styles.abilityChip}>
                <Body size="sm" style={styles.abilityText}>
                  {ability.replace('-', ' ')}
                </Body>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    paddingVertical: spacing.xl,
  },
  image: {
    width: 220,
    height: 220,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  pokemonName: {
    textTransform: 'capitalize',
    marginTop: spacing.xxs,
  },
  typesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  measureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  measureItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxxs,
  },
  measureDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  abilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  abilityChip: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 20,
  },
  abilityText: {
    textTransform: 'capitalize',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  retryButton: {
    minWidth: 160,
    marginBottom: spacing.xs,
  },
  backButton: {
    minWidth: 160,
  },
});

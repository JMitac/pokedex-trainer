/**
 * @file PokemonDetailScreen.tsx
 * @layer Features / Pokédex / Screens
 *
 * Detalle de Pokémon con diseño retro pixel art.
 * El gradiente del header combina los colores de todos los tipos del Pokémon.
 */

import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  Pressable,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/app/providers/ThemeContext';
import { usePokemonDetail } from '../hooks/usePokemon';
import { usePokemonEvolution } from '../hooks/usePokemonEvolution';
import { EvolutionChain } from '../components/EvolutionChain';
import { TypeBadge } from '@/ui/components/Badge';
import { PokemonDetailSkeleton } from '@/ui/components/Skeleton';
import { spacing, textStyles } from '@/ui/tokens';
import type { PokemonType } from '@/ui/tokens';
import type { PokedexNavigationProp } from '@/app/navigation';

// ---------------------------------------------------------------------------
// Colores de fondo por tipo — tonos suaves para el gradiente
// ---------------------------------------------------------------------------

const TYPE_BG_COLORS: Record<string, string> = {
  grass:    '#A8D8A8',
  fire:     '#FFB8A8',
  water:    '#A8C8FF',
  electric: '#FFE888',
  psychic:  '#FFB8D8',
  ice:      '#C8F0F0',
  dragon:   '#9898E8',
  dark:     '#888898',
  fairy:    '#FFD8E8',
  normal:   '#C8C8B8',
  fighting: '#E8A8C8',
  flying:   '#C8D8F8',
  poison:   '#C8A8E8',
  ground:   '#E8D8A8',
  rock:     '#C8B898',
  bug:      '#C8D898',
  ghost:    '#A8A8C8',
  steel:    '#C8D0D8',
};

// Color crema neutro para cuando hay un solo tipo
const CREAM = '#F0EDE8';

// ---------------------------------------------------------------------------
// Función para obtener colores del gradiente según los tipos
// ---------------------------------------------------------------------------

const getGradientColors = (types: string[]): [string, string, ...string[]] => {
  if (types.length === 0) {
    return ['#C8C8B8', CREAM];
  }
  if (types.length === 1) {
    const color = TYPE_BG_COLORS[types[0]] ?? '#C8C8B8';
    return [color, CREAM];
  }
  // Dos o más tipos — combina todos los colores
  const colors = types.map((t) => TYPE_BG_COLORS[t] ?? '#C8C8B8');
  return colors as [string, string, ...string[]];
};

// ---------------------------------------------------------------------------
// Colores de stats segmentadas
// ---------------------------------------------------------------------------

const getStatColor = (value: number): string => {
  if (value >= 100) return '#44AA44';
  if (value >= 60) return '#DDAA00';
  return '#CC3333';
};

// ---------------------------------------------------------------------------
// Componente: StatBar segmentada estilo retro
// ---------------------------------------------------------------------------

const RetroStatBar: React.FC<{
  label: string;
  value: number;
  appColors: ReturnType<typeof useTheme>['colors'];
}> = ({ label, value, appColors }) => {
  const MAX = 15;
  const filled = Math.round((value / 255) * MAX);
  const statColor = getStatColor(value);

  return (
    <View style={statStyles.row}>
      <Text
        style={[
          textStyles.labelSM,
          { color: appColors.textSecondary, width: 68, textAlign: 'right' },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          textStyles.statValue,
          {
            color: appColors.textPrimary,
            width: 32,
            textAlign: 'right',
            marginHorizontal: 6,
          },
        ]}
      >
        {value}
      </Text>
      <View style={statStyles.barContainer}>
        {Array.from({ length: MAX }).map((_, i) => (
          <View
            key={i}
            style={[
              statStyles.segment,
              {
                backgroundColor:
                  i < filled ? statColor : appColors.surfaceMuted,
                borderColor: appColors.border,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const statStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
  },
  segment: {
    flex: 1,
    height: 14,
    borderWidth: 1,
  },
});

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type Props = PokedexNavigationProp<'PokemonDetail'>;

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export const PokemonDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, name } = route.params;
  const { colors } = useTheme();
  const [isCaptured, setIsCaptured] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);

  const { data: pokemon, isLoading, isError, refetch } = usePokemonDetail({ id });
  const {
    evolutionChain,
    weaknesses,
    isLoading: isLoadingExtra,
  } = usePokemonEvolution(pokemon);

  // ---------------------------------------------------------------------------
  // Estado de carga
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['bottom']}
      >
        <PokemonDetailSkeleton testID="detail-skeleton" />
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // Estado de error
  // ---------------------------------------------------------------------------

  if (isError || !pokemon) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['bottom']}
      >
        <View style={styles.centered}>
          <Text style={[textStyles.headingSM, { color: colors.textPrimary }]}>
            No encontramos a {name}
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.primary, borderColor: colors.border },
            ]}
          >
            <Text style={[textStyles.labelMD, { color: colors.textInverse }]}>
              Reintentar
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[
              styles.actionBtn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                marginTop: spacing.xs,
              },
            ]}
          >
            <Text style={[textStyles.labelMD, { color: colors.textPrimary }]}>
              Volver
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // Gradiente multi-tipo
  // ---------------------------------------------------------------------------

  const gradientColors = getGradientColors(pokemon.types);

  // ---------------------------------------------------------------------------
  // Render principal
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        testID="detail-scroll"
      >
        {/* Header con gradiente combinado de todos los tipos */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
          testID="detail-image-container"
        >
          {/* Número grande semitransparente en el fondo */}
          <Text style={styles.bgNumber}>
            #{String(pokemon.id).padStart(4, '0')}
          </Text>

          {/* Sprite del Pokémon */}
          <Image
            source={{ uri: pokemon.sprite }}
            style={styles.sprite}
            resizeMode="contain"
            testID="detail-image"
          />
        </LinearGradient>

        {/* Contenido principal */}
        <View style={[styles.content, { backgroundColor: colors.background }]}>

          {/* Número y nombre */}
          <Text
            style={[
              textStyles.pokemonNumber,
              { color: colors.textSecondary, textAlign: 'center', marginBottom: 4 },
            ]}
            testID="detail-number"
          >
            #{String(pokemon.id).padStart(4, '0')}
          </Text>
          <Text
            style={[
              textStyles.headingLG,
              {
                color: colors.textPrimary,
                textAlign: 'center',
                textTransform: 'capitalize',
              },
            ]}
            testID="detail-name"
          >
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>

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

          {/* Botón Capturar / Capturado */}
          <Pressable
            onPress={() => setIsCaptured(!isCaptured)}
            style={[
              styles.captureBtn,
              {
                backgroundColor: isCaptured
                  ? colors.surfaceMuted
                  : '#44AA44',
                borderColor: '#000000',
              },
            ]}
            testID="capture-btn"
          >
            <Text style={styles.captureBtnText}>
              ⊙ {isCaptured ? 'Capturado' : 'Capturar'}
            </Text>
          </Pressable>

          {/* Medidas */}
          <View style={styles.measuresRow} testID="detail-measures">
            <View
              style={[
                styles.measureBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[textStyles.labelSM, { color: colors.textSecondary }]}
              >
                Altura
              </Text>
              <Text
                style={[textStyles.bodyLG, { color: colors.textPrimary }]}
                testID="detail-height"
              >
                {pokemon.heightM} m
              </Text>
            </View>
            <View
              style={[
                styles.measureBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[textStyles.labelSM, { color: colors.textSecondary }]}
              >
                Peso
              </Text>
              <Text
                style={[textStyles.bodyLG, { color: colors.textPrimary }]}
                testID="detail-weight"
              >
                {pokemon.weightKg} kg
              </Text>
            </View>
          </View>

          {/* Debilidades */}
          <View
            style={[
              styles.section,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            testID="detail-weaknesses"
          >
            <Text
              style={[
                textStyles.headingSM,
                { color: colors.textPrimary, marginBottom: spacing.sm },
              ]}
            >
              Debilidades
            </Text>
            {isLoadingExtra ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                testID="weaknesses-loading"
              />
            ) : weaknesses.length > 0 ? (
              <View style={styles.weakGrid}>
                {weaknesses.map((type) => (
                  <View key={type} style={styles.weakBadgeWrapper}>
                    <TypeBadge
                      type={type as PokemonType}
                      size="sm"
                      testID={`weakness-${type}`}
                    />
                    <Text
                      style={[
                        textStyles.caption,
                        { color: colors.textSecondary, marginLeft: 2 },
                      ]}
                    >
                      x2
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[textStyles.bodyMD, { color: colors.textMuted }]}>
                Sin debilidades
              </Text>
            )}
          </View>

          {/* Estadísticas Base */}
          <View
            style={[
              styles.section,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            testID="detail-stats"
          >
            <Text
              style={[
                textStyles.headingSM,
                { color: colors.textPrimary, marginBottom: spacing.sm },
              ]}
            >
              Estadísticas Base
            </Text>
            {pokemon.stats.map((stat) => (
              <RetroStatBar
                key={stat.name}
                label={stat.label}
                value={stat.value}
                appColors={colors}
              />
            ))}
          </View>

          {/* Habilidades */}
          <View
            style={[
              styles.section,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            testID="detail-abilities"
          >
            <Text
              style={[
                textStyles.headingSM,
                { color: colors.textPrimary, marginBottom: spacing.sm },
              ]}
            >
              Habilidades
            </Text>
            <View style={styles.abilitiesRow}>
              {pokemon.abilities.map((ability) => (
                <View
                  key={ability}
                  style={[
                    styles.abilityChip,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  <Text
                    style={[
                      textStyles.bodyMD,
                      {
                        color: colors.textPrimary,
                        textTransform: 'capitalize',
                      },
                    ]}
                  >
                    {ability.replace('-', ' ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Botón Cadena de Evolución */}
          <Pressable
            onPress={() => setShowEvolution(true)}
            style={[
              styles.evolutionBtn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            testID="evolution-btn"
          >
            <Text style={styles.evolutionEmoji}>🧬</Text>
            <Text
              style={[
                textStyles.headingSM,
                { color: colors.textPrimary, flex: 1 },
              ]}
            >
              Cadena de Evolución
            </Text>
            <Text style={[textStyles.bodyLG, { color: colors.textMuted }]}>
              ▶
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal Cadena de Evolución */}
      <Modal
        visible={showEvolution}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEvolution(false)}
        testID="evolution-modal"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowEvolution(false)}
        >
          <Pressable
            style={[
              styles.evolutionPanel,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.evolutionEmoji}>🧬</Text>
              <Text
                style={[
                  textStyles.headingSM,
                  { color: colors.textPrimary, flex: 1 },
                ]}
              >
                Cadena de Evolución
              </Text>
              <Pressable
                onPress={() => setShowEvolution(false)}
                testID="evolution-modal-close"
              >
                <Text
                  style={[textStyles.headingSM, { color: colors.textPrimary }]}
                >
                  ✕
                </Text>
              </Pressable>
            </View>

            {/* Contenido */}
            {isLoadingExtra ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{ marginVertical: spacing.lg }}
              />
            ) : (
              <EvolutionChain
                chain={evolutionChain}
                currentId={pokemon.id}
                onPokemonPress={(evoId, evoName) => {
                  setShowEvolution(false);
                  navigation.push('PokemonDetail', {
                    id: evoId,
                    name: evoName,
                  });
                }}
                testID="evolution-chain"
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bgNumber: {
    position: 'absolute',
    fontSize: 80,
    fontFamily: 'PressStart2P_400Regular',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },
  sprite: {
    width: 140,
    height: 140,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  typesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
  captureBtn: {
    paddingVertical: spacing.sm,
    borderWidth: 2,
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  captureBtnText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
  measuresRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  measureBox: {
    flex: 1,
    padding: spacing.md,
    borderWidth: 2,
    alignItems: 'center',
    gap: 4,
  },
  section: {
    padding: spacing.md,
    borderWidth: 2,
  },
  weakGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  weakBadgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  abilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  abilityChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderWidth: 2,
  },
  evolutionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 2,
    gap: spacing.xs,
  },
  evolutionEmoji: {
    fontSize: 18,
    marginRight: spacing.xxs,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: 100,
  },
  actionBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs,
    borderWidth: 2,
    marginTop: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  evolutionPanel: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
});

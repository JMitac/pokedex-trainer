/**
 * @file Skeleton.tsx
 * @layer UI / Components / Skeleton
 *
 * Componente de estado de carga con efecto shimmer animado.
 * Replica la forma del contenido que va a aparecer para reducir
 * la percepción de tiempo de espera (skeleton loading pattern).
 *
 * REGLA: Nunca usar <ActivityIndicator> como estado de carga
 * para listas o cards completas. Usar Skeleton para replicar
 * la forma del contenido esperado.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius } from '@/ui/tokens';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface SkeletonProps {
  /**
   * Ancho del bloque skeleton.
   * Acepta número (px) o string ('100%', '50%').
   * @default '100%'
   */
  width?: number | string;

  /**
   * Alto del bloque skeleton.
   * @default 16
   */
  height?: number;

  /**
   * Radio de borde del bloque.
   * @default borderRadius.sm (8px)
   */
  radius?: number;

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
// Componente base: Skeleton con efecto shimmer
// ---------------------------------------------------------------------------

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  radius = borderRadius.sm,
  style,
  testID,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  const staticStyle: ViewStyle = {
    width: width as ViewStyle['width'],
    height,
    borderRadius: radius,
  };

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.base,
        staticStyle,
        { opacity },
        style,
      ]}
    />
  );
};

// ---------------------------------------------------------------------------
// Sub-componente: PokemonCardSkeleton
// Réplica exacta de PokemonCard en estado de carga
// ---------------------------------------------------------------------------

export interface PokemonCardSkeletonProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export const PokemonCardSkeleton: React.FC<PokemonCardSkeletonProps> = ({
  testID,
  style,
}) => (
  <View
    style={[styles.cardContainer, style]}
    testID={testID ?? 'skeleton-pokemon-card'}
  >
    {/* Sprite del Pokémon */}
    <Skeleton
      width={80}
      height={80}
      radius={borderRadius.full}
      testID={testID ? `${testID}-sprite` : 'skeleton-pokemon-sprite'}
    />

    {/* Info derecha */}
    <View style={styles.cardInfo}>
      {/* Número #0001 */}
      <Skeleton
        width={40}
        height={12}
        radius={borderRadius.xs}
        testID={testID ? `${testID}-number` : 'skeleton-pokemon-number'}
      />

      {/* Nombre */}
      <Skeleton
        width={100}
        height={16}
        radius={borderRadius.xs}
        style={styles.cardName}
        testID={testID ? `${testID}-name` : 'skeleton-pokemon-name'}
      />

      {/* Badges de tipos */}
      <View style={styles.cardTypes}>
        <Skeleton
          width={56}
          height={22}
          radius={borderRadius.full}
          testID={testID ? `${testID}-type1` : 'skeleton-pokemon-type1'}
        />
        <Skeleton
          width={56}
          height={22}
          radius={borderRadius.full}
          style={styles.typeGap}
          testID={testID ? `${testID}-type2` : 'skeleton-pokemon-type2'}
        />
      </View>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// Sub-componente: PokemonListSkeleton
// Lista de PokemonCardSkeleton para la pantalla de lista completa
// ---------------------------------------------------------------------------

export interface PokemonListSkeletonProps {
  /**
   * Número de cards skeleton a mostrar.
   * @default 8
   */
  count?: number;
  testID?: string;
}

export const PokemonListSkeleton: React.FC<PokemonListSkeletonProps> = ({
  count = 8,
  testID,
}) => (
  <View
    testID={testID ?? 'skeleton-pokemon-list'}
    style={styles.listContainer}
  >
    {Array.from({ length: count }).map((_, index) => (
      <PokemonCardSkeleton
        key={index}
        testID={`skeleton-pokemon-card-${index}`}
        style={styles.listItem}
      />
    ))}
  </View>
);

// ---------------------------------------------------------------------------
// Sub-componente: DetailSkeleton
// Skeleton para la pantalla de detalle del Pokémon
// ---------------------------------------------------------------------------

export const PokemonDetailSkeleton: React.FC<{ testID?: string }> = ({
  testID,
}) => (
  <View
    testID={testID ?? 'skeleton-pokemon-detail'}
    style={styles.detailContainer}
  >
    {/* Sprite grande */}
    <Skeleton
      width={200}
      height={200}
      radius={borderRadius.full}
      style={styles.detailSprite}
      testID="skeleton-detail-sprite"
    />

    {/* Número */}
    <Skeleton
      width={60}
      height={14}
      radius={borderRadius.xs}
      style={styles.detailItem}
      testID="skeleton-detail-number"
    />

    {/* Nombre */}
    <Skeleton
      width={160}
      height={28}
      radius={borderRadius.sm}
      style={styles.detailItem}
      testID="skeleton-detail-name"
    />

    {/* Tipos */}
    <View style={styles.detailTypes}>
      <Skeleton
        width={72}
        height={28}
        radius={borderRadius.full}
        testID="skeleton-detail-type1"
      />
      <Skeleton
        width={72}
        height={28}
        radius={borderRadius.full}
        style={styles.typeGap}
        testID="skeleton-detail-type2"
      />
    </View>

    {/* Stats */}
    {Array.from({ length: 6 }).map((_, i) => (
      <View key={i} style={styles.statRow}>
        <Skeleton
          width={80}
          height={12}
          radius={borderRadius.xs}
          testID={`skeleton-detail-stat-label-${i}`}
        />
        <Skeleton
          width={120}
          height={12}
          radius={borderRadius.xs}
          testID={`skeleton-detail-stat-bar-${i}`}
        />
      </View>
    ))}
  </View>
);

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.skeleton,
  },
  // PokemonCardSkeleton
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  cardInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  cardName: {
    marginTop: spacing.xxs,
  },
  cardTypes: {
    flexDirection: 'row',
    marginTop: spacing.xxs,
    gap: spacing.xxs,
  },
  typeGap: {
    marginLeft: spacing.xxs,
  },
  // PokemonListSkeleton
  listContainer: {
    gap: spacing.xs,
    padding: spacing.md,
  },
  listItem: {
    marginBottom: spacing.xxs,
  },
  // PokemonDetailSkeleton
  detailContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.xs,
  },
  detailSprite: {
    marginBottom: spacing.md,
  },
  detailItem: {
    marginTop: spacing.xxs,
  },
  detailTypes: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.xs,
    gap: spacing.md,
  },
});

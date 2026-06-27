/**
 * @file PokemonListScreen.tsx
 * @layer Features / Pokédex / Screens
 *
 * Pantalla principal del Pokédex.
 * Muestra la lista de Pokémon con scroll infinito,
 * estados de carga (Skeleton) y error.
 */

import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePokemonInfiniteList, usePrefetchPokemon } from '../hooks/usePokemon';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonListSkeleton } from '@/ui/components/Skeleton';
import { Heading, Body } from '@/ui/components/Typography';
import { Button } from '@/ui/components/Button';
import { colors, spacing } from '@/ui/tokens';
import type { PokemonListItem } from '../types/pokemon.types';
import type { PokedexNavigationProp } from '@/app/navigation';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type Props = PokedexNavigationProp<'PokemonList'>;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const PokemonListScreen: React.FC<Props> = ({ navigation }) => {
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePokemonInfiniteList();

  const prefetchPokemon = usePrefetchPokemon();

  // Aplanar todas las páginas en un solo array
  const pokemonList = data?.pages.flatMap((page) => page.items) ?? [];

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handlePokemonPress = useCallback(
    (pokemon: PokemonListItem) => {
      // Precarga el detalle antes de navegar
      prefetchPokemon(pokemon.id);
      navigation.navigate('PokemonDetail', {
        id: pokemon.id,
        name: pokemon.name,
      });
    },
    [navigation, prefetchPokemon]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ---------------------------------------------------------------------------
  // Estados visuales
  // ---------------------------------------------------------------------------

  // Estado de carga inicial
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <PokemonListSkeleton count={10} testID="list-skeleton" />
      </SafeAreaView>
    );
  }

  // Estado de error
  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centered} testID="error-state">
          <Heading size="md" align="center" color="textSecondary">
            Algo salió mal
          </Heading>
          <Body align="center" color="textMuted" style={styles.errorText}>
            No pudimos cargar los Pokémon. Verifica tu conexión a internet.
          </Body>
          <Button
            label="Reintentar"
            variant="primary"
            onPress={() => refetch()}
            testID="retry-button"
            style={styles.retryButton}
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
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={() => handlePokemonPress(item)}
            testID={`pokemon-card-${item.id}`}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        // Footer con spinner de carga de siguiente página
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer} testID="loading-more">
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />
            </View>
          ) : null
        }
        // Separador entre cards
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        testID="pokemon-list"
      />
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
  listContent: {
    paddingVertical: spacing.xs,
    paddingBottom: spacing.xxl,
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
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  separator: {
    height: spacing.xxs,
  },
});

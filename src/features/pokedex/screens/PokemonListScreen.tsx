/**
 * @file PokemonListScreen.tsx
 * @layer Features / Pokédex / Screens
 *
 * Pantalla principal del Pokédex con búsqueda integrada.
 *
 * Dos modos:
 * - Normal: lista paginada con scroll infinito
 * - Búsqueda: resultados filtrados del catálogo completo
 */

import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePokemonInfiniteList, usePrefetchPokemon } from '../hooks/usePokemon';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import { PokemonCard } from '../components/PokemonCard';
import { SearchBar } from '../components/SearchBar';
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

  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
    results: searchResults,
    isSearching,
    isLoadingCatalog,
  } = usePokemonSearch();

  const prefetchPokemon = usePrefetchPokemon();

  // Lista normal aplanada de todas las páginas
  const pokemonList = data?.pages.flatMap((page) => page.items) ?? [];

  // Datos a mostrar según el modo
  const displayList = isSearching ? searchResults : pokemonList;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handlePokemonPress = useCallback(
    (pokemon: PokemonListItem) => {
      prefetchPokemon(pokemon.id);
      navigation.navigate('PokemonDetail', {
        id: pokemon.id,
        name: pokemon.name,
      });
    },
    [navigation, prefetchPokemon]
  );

  const handleEndReached = useCallback(() => {
    if (!isSearching && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isSearching, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ---------------------------------------------------------------------------
  // Estado de carga inicial (solo para la lista normal)
  // ---------------------------------------------------------------------------

  if (isLoading && !isSearching) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={clearSearch}
          testID="search-bar"
        />
        <PokemonListSkeleton count={10} testID="list-skeleton" />
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // Estado de error
  // ---------------------------------------------------------------------------

  if (isError && !isSearching) {
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
  // Estado vacío en búsqueda
  // ---------------------------------------------------------------------------

  const showEmptySearch =
    isSearching && searchResults.length === 0 && !isLoadingCatalog;

  // ---------------------------------------------------------------------------
  // Render principal
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={displayList}
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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        // SearchBar pegado al tope de la lista
        ListHeaderComponent={
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={clearSearch}
            testID="search-bar"
          />
        }
        // Estado vacío en búsqueda
        ListEmptyComponent={
          showEmptySearch ? (
            <View style={styles.emptySearch} testID="empty-search">
              <Body align="center" style={styles.emptyEmoji}>
                🔍
              </Body>
              <Heading size="sm" align="center" color="textSecondary">
                Sin resultados
              </Heading>
              <Body align="center" color="textMuted" style={styles.emptyText}>
                No encontramos ningún Pokémon con "{searchQuery}"
              </Body>
            </View>
          ) : null
        }
        // Footer con spinner de carga de siguiente página
        ListFooterComponent={
          isFetchingNextPage && !isSearching ? (
            <View style={styles.footer} testID="loading-more">
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl,
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
  emptySearch: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    marginTop: spacing.xs,
  },
});

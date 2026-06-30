/**
 * @file PokemonListScreen.tsx
 * @layer Features / Pokédex / Screens
 *
 * Lista de Pokémon con búsqueda, filtros por tipo y diseño retro.
 * Los tipos se muestran en todas las cards gracias al mapa de tipos.
 *
 * IMPORTANTE — Workaround de bug en react-native-safe-area-context:
 * El prop `edges` de <SafeAreaView> no se está aplicando correctamente
 * en esta combinación de Expo SDK 56 + RN 0.85 + New Architecture +
 * react-native-safe-area-context 5.7.0 — el componente nativo ignora
 * `edges={['top']}` y sigue aplicando un padding-bottom de ~116px
 * (confirmado con el Element Inspector de React Native).
 *
 * Mientras no se actualice la librería con el fix, evitamos el
 * <SafeAreaView> de 'react-native-safe-area-context' por completo
 * en esta pantalla. Usamos un <View> normal + useSafeAreaInsets()
 * para aplicar manualmente SOLO el padding-top necesario.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  Pressable,
  Modal,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/app/providers/ThemeContext';
import { usePokemonInfiniteList, usePrefetchPokemon } from '../hooks/usePokemon';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import { usePokemonTypeMap } from '../hooks/usePokemonTypes';
import { PokemonCard } from '../components/PokemonCard';
import { SearchBar } from '../components/SearchBar';
import { PokemonListSkeleton } from '@/ui/components/Skeleton';
import { spacing, textStyles } from '@/ui/tokens';
import { httpClient } from '@/shared/api';
import { extractIdFromUrl, getSpriteUrl } from '../types/pokemon.types';
import type { PokemonListItem } from '../types/pokemon.types';
import type { PokedexNavigationProp } from '@/app/navigation';

// ---------------------------------------------------------------------------
// Filtros de tipo disponibles
// ---------------------------------------------------------------------------

const TYPE_FILTERS = [
  'Todos', 'Planta', 'Veneno', 'Fuego', 'Agua',
  'Volador', 'Psíquico', 'Bicho', 'Normal', 'Eléctrico',
  'Tierra', 'Hada', 'Lucha', 'Roca', 'Fantasma',
] as const;

const TYPE_FILTER_MAP: Record<string, string> = {
  'Todos': '',
  'Planta': 'grass',
  'Veneno': 'poison',
  'Fuego': 'fire',
  'Agua': 'water',
  'Volador': 'flying',
  'Psíquico': 'psychic',
  'Bicho': 'bug',
  'Normal': 'normal',
  'Eléctrico': 'electric',
  'Tierra': 'ground',
  'Hada': 'fairy',
  'Lucha': 'fighting',
  'Roca': 'rock',
  'Fantasma': 'ghost',
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type Props = PokedexNavigationProp<'PokemonList'>;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const PokemonListScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [showSettings, setShowSettings] = useState(false);

  // Lista principal paginada
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePokemonInfiniteList();

  // Mapa de tipos para enriquecer la lista en modo "Todos"
  const { data: typeMap = {} } = usePokemonTypeMap();

  // Búsqueda por nombre
  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
    results: searchResults,
    isSearching,
  } = usePokemonSearch();

  const prefetchPokemon = usePrefetchPokemon();

  // Tipo activo para filtrar
  const filterType = TYPE_FILTER_MAP[activeFilter] ?? '';

  // Query de filtro por tipo — usa /type/{name} de la PokéAPI
  const {
    data: typeFilterData,
    isLoading: isLoadingTypeFilter,
  } = useQuery({
    queryKey: ['pokemon', 'type-filter', filterType],
    queryFn: async (): Promise<PokemonListItem[]> => {
      if (!filterType) return [];
      const { data: typeData } = await httpClient.get(`/type/${filterType}`);
      return typeData.pokemon
        .slice(0, 60)
        .map(({ pokemon }: { pokemon: { name: string; url: string } }) => {
          const id = extractIdFromUrl(pokemon.url);
          return {
            id,
            name: pokemon.name,
            sprite: getSpriteUrl(id),
            types: typeMap[id] ?? [filterType],
          };
        });
    },
    enabled: Boolean(filterType),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  // Lista normal aplanada — enriquecida con tipos del mapa
  const pokemonList = (data?.pages.flatMap((page) => page.items) ?? []).map(
    (pokemon) => ({
      ...pokemon,
      types: typeMap[pokemon.id] ?? pokemon.types,
    })
  );

  // Resultados de búsqueda enriquecidos con tipos
  const enrichedSearchResults = searchResults.map((pokemon) => ({
    ...pokemon,
    types: typeMap[pokemon.id] ?? pokemon.types,
  }));

  // Lista a mostrar según el modo activo
  const displayList: PokemonListItem[] = isSearching
    ? enrichedSearchResults
    : filterType
    ? (typeFilterData ?? [])
    : pokemonList;

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
    if (!isSearching && !filterType && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isSearching, filterType, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ---------------------------------------------------------------------------
  // Estados de carga y error
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <PokemonListSkeleton count={10} />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={styles.centered}>
          <Text style={[textStyles.headingSM, { color: colors.textPrimary }]}>
            Error al cargar
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={[
              styles.retryBtn,
              { backgroundColor: colors.primary, borderColor: colors.border },
            ]}
          >
            <Text style={[textStyles.labelMD, { color: colors.textInverse }]}>
              Reintentar
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Render principal
  // ---------------------------------------------------------------------------

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <FlatList
        data={displayList}
        keyExtractor={(item) => `${item.id}-${activeFilter}`}
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
        ListHeaderComponent={
          <View>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={clearSearch}
              testID="search-bar"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContent}
              style={styles.filters}
            >
              {TYPE_FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => {
                      setActiveFilter(filter);
                      clearSearch();
                    }}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                    testID={`filter-${filter}`}
                  >
                    <Text
                      style={[
                        textStyles.labelSM,
                        {
                          color: isActive
                            ? colors.textInverse
                            : colors.textPrimary,
                        },
                      ]}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          isLoadingTypeFilter ? (
            <View style={styles.loadingFilter}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={[
                  textStyles.bodyMD,
                  { color: colors.textMuted, marginTop: spacing.sm },
                ]}
              >
                Cargando {activeFilter}...
              </Text>
            </View>
          ) : isSearching && enrichedSearchResults.length === 0 ? (
            <View style={styles.empty}>
              <Text
                style={[textStyles.headingSM, { color: colors.textSecondary }]}
              >
                Sin resultados
              </Text>
              <Text
                style={[
                  textStyles.bodyMD,
                  { color: colors.textMuted, marginTop: spacing.xs },
                ]}
              >
                No hay Pokémon con "{searchQuery}"
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage && !filterType && !isSearching ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        testID="pokemon-list"
      />

      {/* Modal de ajustes */}
      <Modal
        visible={showSettings}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSettings(false)}
        >
          <Pressable
            style={[
              styles.settingsPanel,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.settingsHeader}>
              <Text style={[textStyles.headingSM, { color: colors.textPrimary }]}>
                ⚙ Ajustes
              </Text>
              <Pressable onPress={() => setShowSettings(false)}>
                <Text style={[textStyles.headingSM, { color: colors.textPrimary }]}>
                  ✕
                </Text>
              </Pressable>
            </View>

            <View style={[styles.settingsRow, { borderColor: colors.borderLight }]}>
              <Text style={[textStyles.bodyMD, { color: colors.textPrimary }]}>
                🌙 Modo oscuro
              </Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.disabled, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>

            <View style={styles.settingsRow}>
              <Text style={[textStyles.bodyMD, { color: colors.textPrimary }]}>
                🌐 Idioma
              </Text>
              <View style={styles.langButtons}>
                <Pressable style={[styles.langBtn, { backgroundColor: colors.primary }]}>
                  <Text style={[textStyles.labelSM, { color: colors.textInverse }]}>ES</Text>
                </Pressable>
                <Pressable style={[styles.langBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 2 }]}>
                  <Text style={[textStyles.labelSM, { color: colors.textPrimary }]}>EN</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: spacing.sm },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: 100,
  },
  retryBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs,
    borderWidth: 2,
  },
  filters: { marginBottom: spacing.xs },
  filtersContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderWidth: 2,
    marginRight: spacing.xxs,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  loadingFilter: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  settingsPanel: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  langButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  langBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
});

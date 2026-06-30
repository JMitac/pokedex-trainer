/**
 * @file StarterSelectionScreen.tsx
 * @layer Features / Trainer / Screens
 *
 * Pantalla de selección del Pokémon inicial.
 * Usa ConfirmModal y el sprite directo de la API.
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/app/providers/ThemeContext';
import { useTrainerStore } from '../store/trainerStore';
import { ConfirmModal } from '../components/ConfirmModal';
import { TypeBadge } from '@/ui/components/Badge';
import { textStyles, spacing } from '@/ui/tokens';
import { httpClient } from '@/shared/api';
import {
  CLASSIC_STARTERS,
  STARTER_RANDOM_TYPES,
} from '../types/starter.types';
import type { PokemonType } from '@/ui/tokens';
import type { StarterPokemon } from '../types/starter.types';
import type { TrainerNavigationProp } from '@/app/navigation';
import { extractIdFromUrl, getSpriteUrl } from '@/features/pokedex/types/pokemon.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type Props = TrainerNavigationProp<'StarterSelection'>;

// ---------------------------------------------------------------------------
// Estado del modal
// ---------------------------------------------------------------------------

interface ModalState {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  pendingStarter: StarterPokemon | null;
  retryType: string | null;
}

const INITIAL_MODAL: ModalState = {
  visible: false,
  title: '',
  message: '',
  confirmLabel: '',
  cancelLabel: 'Cancelar',
  pendingStarter: null,
  retryType: null,
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const StarterSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const saveStarterPokemon = useTrainerStore((s) => s.saveStarterPokemon);

  const [mode, setMode] = useState<'choose' | 'traditional' | 'random'>('choose');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const [modalState, setModalState] = useState<ModalState>(INITIAL_MODAL);

  // -------------------------------------------------------------------------
  // Confirmar selección
  // -------------------------------------------------------------------------

  const handleConfirm = () => {
    if (modalState.pendingStarter) {
      saveStarterPokemon(modalState.pendingStarter);
    }
    setModalState(INITIAL_MODAL);
    navigation.goBack();
  };

  const handleCancel = () => {
    if (modalState.retryType) {
      const retryType = modalState.retryType;
      setModalState(INITIAL_MODAL);
      handleRandomByType(retryType);
    } else {
      setModalState(INITIAL_MODAL);
    }
  };

  // -------------------------------------------------------------------------
  // Handler: starter clásico
  // -------------------------------------------------------------------------

  const handleClassicSelect = (starter: typeof CLASSIC_STARTERS[number]) => {
    const pendingStarter: StarterPokemon = {
      id: starter.id,
      name: starter.name,
      sprite: starter.sprite,
      types: [...starter.types],
      level: 1,
    };

    setModalState({
      visible: true,
      title: '¿Elegir este Pokémon?',
      message: `${starter.name.charAt(0).toUpperCase() + starter.name.slice(1)} será tu compañero de aventura. ¡Cuídalo bien!`,
      confirmLabel: '¡Sí, lo elijo!',
      cancelLabel: 'Cancelar',
      pendingStarter,
      retryType: null,
    });
  };

  // -------------------------------------------------------------------------
  // Handler: starter aleatorio por tipo
  // -------------------------------------------------------------------------

  const handleRandomByType = async (typeName: string) => {
    setSelectedType(typeName);
    setIsLoadingRandom(true);

    try {
      const { data } = await httpClient.get(`/type/${typeName}`);

      const candidates = data.pokemon
        .map(({ pokemon }: { pokemon: { name: string; url: string } }) => ({
          name: pokemon.name,
          id: extractIdFromUrl(pokemon.url),
        }))
        .filter(({ id }: { id: number }) => id > 0 && id <= 300)
        .slice(0, 20);

      if (candidates.length === 0) {
        setModalState({
          visible: true,
          title: 'Sin resultados',
          message: 'No encontramos Pokémon de ese tipo. Prueba con otro.',
          confirmLabel: 'Entendido',
          cancelLabel: '',
          pendingStarter: null,
          retryType: null,
        });
        return;
      }

      const randomIndex = Math.floor(Math.random() * candidates.length);
      const chosen = candidates[randomIndex];

      // Obtener datos completos — sprite y tipos reales desde la API
      const { data: pokeData } = await httpClient.get(`/pokemon/${chosen.id}`);
      const types = pokeData.types.map(
        (t: { type: { name: string } }) => t.type.name
      );

      // Usar el sprite que devuelve la API directamente
      const spriteUrl: string =
        pokeData.sprites?.front_default ?? getSpriteUrl(chosen.id);

      const starter: StarterPokemon = {
        id: chosen.id,
        name: chosen.name,
        sprite: spriteUrl,
        types,
        level: 1,
      };

      const pokemonName =
        chosen.name.charAt(0).toUpperCase() + chosen.name.slice(1);

      setModalState({
        visible: true,
        title: `¡Te tocó ${pokemonName}!`,
        message: `Tu compañero aleatorio es ${pokemonName}. ¿Lo aceptas o prefieres otro?`,
        confirmLabel: '¡Lo acepto!',
        cancelLabel: 'Otro Pokémon',
        pendingStarter: starter,
        retryType: typeName,
      });
    } catch {
      setModalState({
        visible: true,
        title: 'Error de conexión',
        message: 'No pudimos obtener el Pokémon. Verifica tu conexión e intenta de nuevo.',
        confirmLabel: 'Entendido',
        cancelLabel: '',
        pendingStarter: null,
        retryType: null,
      });
    } finally {
      setIsLoadingRandom(false);
      setSelectedType(null);
    }
  };

  // -------------------------------------------------------------------------
  // Render: elegir modo
  // -------------------------------------------------------------------------

  if (mode === 'choose') {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[textStyles.headingLG, { color: colors.textPrimary, textAlign: 'center' }]}>
            Elige tu Pokémon Inicial
          </Text>
          <Text style={[textStyles.bodyMD, { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs }]}>
            ¿Cómo quieres elegir tu compañero?
          </Text>

          <Pressable
            onPress={() => setMode('traditional')}
            style={[styles.modeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            testID="mode-traditional"
          >
            <Text style={styles.modeEmoji}>🏆</Text>
            <Text style={[textStyles.headingSM, { color: colors.textPrimary }]}>
              Tradicional
            </Text>
            <Text style={[textStyles.bodyMD, { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxs }]}>
              Elige entre los 3 starters clásicos de Kanto
            </Text>
            <View style={styles.starterPreviews}>
              {CLASSIC_STARTERS.map((s) => (
                <Image
                  key={s.id}
                  source={{ uri: s.sprite }}
                  style={styles.previewSprite}
                  resizeMode="contain"
                />
              ))}
            </View>
          </Pressable>

          <Pressable
            onPress={() => setMode('random')}
            style={[styles.modeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            testID="mode-random"
          >
            <Text style={styles.modeEmoji}>🎲</Text>
            <Text style={[textStyles.headingSM, { color: colors.textPrimary }]}>
              Aleatoria
            </Text>
            <Text style={[textStyles.bodyMD, { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxs }]}>
              Elige un tipo y te asignamos un Pokémon al azar
            </Text>
          </Pressable>
        </ScrollView>

        <ConfirmModal
          visible={modalState.visible}
          title={modalState.title}
          message={modalState.message}
          confirmLabel={modalState.confirmLabel}
          cancelLabel={modalState.cancelLabel || 'Cerrar'}
          confirmVariant="primary"
          onConfirm={handleConfirm}
          onCancel={() => setModalState(INITIAL_MODAL)}
          testID="starter-modal"
        />
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------------------
  // Render: selección tradicional
  // -------------------------------------------------------------------------

  if (mode === 'traditional') {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[textStyles.headingLG, { color: colors.textPrimary, textAlign: 'center' }]}>
            Starters Clásicos
          </Text>
          <Text style={[textStyles.bodyMD, { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs }]}>
            ¿Cuál será tu compañero?
          </Text>

          {CLASSIC_STARTERS.map((starter) => (
            <Pressable
              key={starter.id}
              onPress={() => handleClassicSelect(starter)}
              style={[styles.starterCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              testID={`starter-${starter.name}`}
            >
              <Image
                source={{ uri: starter.officialArt }}
                style={styles.starterArt}
                resizeMode="contain"
              />
              <Text style={[
                textStyles.pokemonName,
                { color: colors.textPrimary, textTransform: 'capitalize', marginTop: spacing.xs },
              ]}>
                {starter.name}
              </Text>
              <View style={styles.starterTypes}>
                {starter.types.map((type) => (
                  <TypeBadge key={type} type={type as PokemonType} size="sm" />
                ))}
              </View>
            </Pressable>
          ))}

          <Pressable
            onPress={() => setMode('choose')}
            style={[styles.backBtn, { borderColor: colors.border }]}
          >
            <Text style={[textStyles.labelMD, { color: colors.textSecondary }]}>
              ← Volver
            </Text>
          </Pressable>
        </ScrollView>

        <ConfirmModal
          visible={modalState.visible}
          title={modalState.title}
          message={modalState.message}
          confirmLabel={modalState.confirmLabel}
          cancelLabel={modalState.cancelLabel}
          confirmVariant="primary"
          onConfirm={handleConfirm}
          onCancel={() => setModalState(INITIAL_MODAL)}
          testID="starter-modal"
        />
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------------------
  // Render: selección aleatoria por tipo
  // -------------------------------------------------------------------------

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[textStyles.headingLG, { color: colors.textPrimary, textAlign: 'center' }]}>
          Pokémon Aleatorio
        </Text>
        <Text style={[textStyles.bodyMD, { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs }]}>
          Elige un tipo y te sorprendemos
        </Text>

        <View style={styles.typesGrid}>
          {STARTER_RANDOM_TYPES.map((typeOption) => {
            const isSelected = selectedType === typeOption.key;
            return (
              <Pressable
                key={typeOption.key}
                onPress={() => handleRandomByType(typeOption.key)}
                disabled={isLoadingRandom}
                style={[
                  styles.typeOption,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                    opacity: isLoadingRandom && !isSelected ? 0.5 : 1,
                  },
                ]}
                testID={`random-type-${typeOption.key}`}
              >
                {isSelected && isLoadingRandom ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.typeEmoji}>{typeOption.emoji}</Text>
                )}
                <Text style={[textStyles.labelSM, { color: colors.textPrimary, marginTop: spacing.xxs }]}>
                  {typeOption.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => setMode('choose')}
          style={[styles.backBtn, { borderColor: colors.border }]}
        >
          <Text style={[textStyles.labelMD, { color: colors.textSecondary }]}>
            ← Volver
          </Text>
        </Pressable>
      </ScrollView>

      <ConfirmModal
        visible={modalState.visible}
        title={modalState.title}
        message={modalState.message}
        confirmLabel={modalState.confirmLabel}
        cancelLabel={modalState.cancelLabel}
        confirmVariant="primary"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        testID="starter-modal"
      />
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  modeCard: {
    borderWidth: 2,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  modeEmoji: { fontSize: 48 },
  starterPreviews: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  previewSprite: {
    width: 56,
    height: 56,
  },
  starterCard: {
    borderWidth: 2,
    padding: spacing.lg,
    alignItems: 'center',
  },
  starterArt: {
    width: 140,
    height: 140,
  },
  starterTypes: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  typeOption: {
    width: '28%',
    aspectRatio: 1,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  typeEmoji: { fontSize: 28 },
  backBtn: {
    borderWidth: 1,
    padding: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});

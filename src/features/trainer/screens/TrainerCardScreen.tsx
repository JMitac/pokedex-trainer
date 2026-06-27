/**
 * @file TrainerCardScreen.tsx
 * @layer Features / Trainer / Screens
 *
 * Pantalla del carnet del Entrenador.
 * Lee del store de Zustand (persistido en AsyncStorage).
 *
 * Acciones disponibles:
 * - Editar perfil → vuelve al Step1 con campos pre-llenados
 * - Eliminar registro → modal de confirmación → resetTrainer()
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrainerStore } from '../store/trainerStore';
import { ConfirmModal } from '../components/ConfirmModal';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import {
  Heading,
  Body,
  Label,
  Caption,
} from '@/ui/components/Typography';
import { colors, spacing, borderRadius } from '@/ui/tokens';
import type { PokemonType } from '@/ui/tokens';
import type { TrainerNavigationProp } from '@/app/navigation';

// ---------------------------------------------------------------------------
// Mapa tipo favorito → PokemonType del catálogo
// ---------------------------------------------------------------------------

const TYPE_MAP: Record<string, PokemonType> = {
  Fuego: 'fire',
  Agua: 'water',
  Planta: 'grass',
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type Props = TrainerNavigationProp<'TrainerCard'>;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const TrainerCardScreen: React.FC<Props> = ({ navigation }) => {
  const trainer = useTrainerStore((state) => state.trainer);
  const resetTrainer = useTrainerStore((state) => state.resetTrainer);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleEdit = () => {
    // Navega al Step1 — los datos pre-llenados se pasan como params
    navigation.navigate('Step1PersonalData');
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    resetTrainer();
    navigation.navigate('Step1PersonalData');
  };

  // ---------------------------------------------------------------------------
  // Guard: sin datos
  // ---------------------------------------------------------------------------

  if (!trainer) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centered} testID="card-no-data">
          <Heading size="md" align="center" color="textSecondary">
            No hay datos de entrenador
          </Heading>
          <Body align="center" color="textMuted" style={styles.noDataText}>
            Completa el formulario de registro primero.
          </Body>
          <Button
            label="Registrarme"
            variant="primary"
            onPress={handleEdit}
            testID="btn-go-to-form"
          />
        </View>
      </SafeAreaView>
    );
  }

  const pokemonType = TYPE_MAP[trainer.favoritePokemonType];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="trainer-card-scroll"
      >
        {/* Encabezado */}
        <View style={styles.headerSection}>
          <Heading size="xl" align="center" testID="card-title">
            Carnet de Entrenador
          </Heading>
          <Caption align="center" color="textMuted">
            Pokédex Trainer App
          </Caption>
        </View>

        {/* Tarjeta principal */}
        <Card
          variant="elevated"
          style={styles.card}
          testID="trainer-card"
        >
          {/* Insignia */}
          <View style={styles.badgeContainer}>
            <View style={styles.trainerBadge} testID="trainer-badge">
              <Heading size="xl" align="center" style={styles.badgeEmoji}>
                🎒
              </Heading>
            </View>
            <Badge
              label="ENTRENADOR POKÉMON"
              variant="success"
              size="sm"
              style={styles.registeredBadge}
              testID="registered-badge"
            />
          </View>

          <Card.Body>
            {/* Nombre */}
            <View style={styles.dataRow} testID="card-fullname-row">
              <Label color="textSecondary" style={styles.dataLabel}>
                Nombre
              </Label>
              <Body style={styles.dataValue} testID="card-fullname">
                {trainer.fullName}
              </Body>
            </View>

            <View style={styles.divider} />

            {/* Edad */}
            <View style={styles.dataRow} testID="card-age-row">
              <Label color="textSecondary" style={styles.dataLabel}>
                Edad
              </Label>
              <Body testID="card-age">{trainer.age} años</Body>
            </View>

            <View style={styles.divider} />

            {/* Email */}
            <View style={styles.dataRow} testID="card-email-row">
              <Label color="textSecondary" style={styles.dataLabel}>
                Correo
              </Label>
              <Body
                size="sm"
                numberOfLines={1}
                testID="card-email"
                style={styles.dataValue}
              >
                {trainer.email}
              </Body>
            </View>

            <View style={styles.divider} />

            {/* Distrito */}
            <View style={styles.dataRow} testID="card-district-row">
              <Label color="textSecondary" style={styles.dataLabel}>
                Distrito
              </Label>
              <Body testID="card-district">{trainer.district}</Body>
            </View>

            <View style={styles.divider} />

            {/* Tipo favorito */}
            <View style={styles.dataRow} testID="card-type-row">
              <Label color="textSecondary" style={styles.dataLabel}>
                Tipo favorito
              </Label>
              <Badge
                label={trainer.favoritePokemonType}
                variant="pokemon"
                pokemonType={pokemonType}
                size="md"
                testID="card-favorite-type"
              />
            </View>
          </Card.Body>
        </Card>

        {/* Acciones */}
        <View style={styles.actions}>
          <Button
            label="Editar perfil"
            variant="secondary"
            fullWidth
            onPress={handleEdit}
            accessibilityHint="Actualiza tus datos de entrenador"
            testID="btn-edit-trainer"
          />
          <Button
            label="Eliminar registro"
            variant="danger"
            fullWidth
            onPress={() => setShowDeleteModal(true)}
            accessibilityHint="Elimina permanentemente tu carnet de entrenador"
            testID="btn-delete-trainer"
          />
        </View>
      </ScrollView>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        visible={showDeleteModal}
        title="¿Eliminar tu carnet?"
        message="Esta acción no se puede deshacer. Perderás todos tus datos de entrenador."
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        testID="delete-modal"
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
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xxs,
  },
  card: {
    marginBottom: spacing.md,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  trainerBadge: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: {
    fontSize: 36,
  },
  registeredBadge: {
    alignSelf: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  dataLabel: {
    flex: 1,
  },
  dataValue: {
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
  },
  actions: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  noDataText: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
});

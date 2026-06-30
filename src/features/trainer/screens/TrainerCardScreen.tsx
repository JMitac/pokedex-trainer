/**
 * @file TrainerCardScreen.tsx
 * @layer Features / Trainer / Screens
 *
 * Carnet del entrenador con foto, lema y Pokémon inicial.
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/app/providers/ThemeContext';
import { useTrainerStore } from '../store/trainerStore';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { StarterCard } from '../components/StarterCard';
import { ConfirmModal } from '../components/ConfirmModal';
import { Badge } from '@/ui/components/Badge';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Label, Caption } from '@/ui/components/Typography';
import { textStyles, spacing, borderRadius } from '@/ui/tokens';
import type { PokemonType } from '@/ui/tokens';
import type { TrainerNavigationProp } from '@/app/navigation';

const TYPE_MAP: Record<string, PokemonType> = {
  Fuego: 'fire',
  Agua: 'water',
  Planta: 'grass',
};

type Props = TrainerNavigationProp<'TrainerCard'>;

export const TrainerCardScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const trainer = useTrainerStore((s) => s.trainer);
  const profilePhotoUri = useTrainerStore((s) => s.profilePhotoUri);
  const starterPokemon = useTrainerStore((s) => s.starterPokemon);
  const saveProfilePhoto = useTrainerStore((s) => s.saveProfilePhoto);
  const resetTrainer = useTrainerStore((s) => s.resetTrainer);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => navigation.navigate('Step1PersonalData');
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    resetTrainer();
    navigation.navigate('Step1PersonalData');
  };

  if (!trainer) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <View style={styles.centered} testID="card-no-data">
          <Text style={[textStyles.headingSM, { color: colors.textSecondary, textAlign: 'center' }]}>
            No hay datos de entrenador
          </Text>
          <Button label="Registrarme" variant="primary" onPress={handleEdit} testID="btn-go-to-form" style={{ marginTop: spacing.xl }} />
        </View>
      </SafeAreaView>
    );
  }

  const pokemonType = TYPE_MAP[trainer.favoritePokemonType];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} testID="trainer-card-scroll">

        {/* Encabezado */}
        <View style={styles.headerSection}>
          <Text style={[textStyles.headingLG, { color: colors.textPrimary, textAlign: 'center' }]} testID="card-title">
            Carnet de Entrenador
          </Text>
          <Caption color="textMuted" align="center">Pokédex Trainer App</Caption>
        </View>

        {/* Tarjeta principal */}
        <Card variant="elevated" style={styles.card} testID="trainer-card">

          {/* Foto de perfil */}
          <View style={styles.photoSection}>
            <ProfilePhoto
              photoUri={profilePhotoUri}
              showEditButton={true}
              onPhotoSelected={saveProfilePhoto}
              testID="profile-photo"
            />
            <Badge label="ENTRENADOR POKÉMON" variant="success" size="sm" style={styles.registeredBadge} testID="registered-badge" />
          </View>

          <Card.Body>
            {/* Nombre */}
            <View style={styles.dataRow} testID="card-fullname-row">
              <Label color="textSecondary" style={styles.dataLabel}>Nombre</Label>
              <Text style={[textStyles.bodyMD, { color: colors.textPrimary, flex: 2, textAlign: 'right' }]} testID="card-fullname">
                {trainer.fullName}
              </Text>
            </View>
            <View style={styles.divider} />

            {/* Lema */}
            {trainer.motto ? (
              <>
                <View style={styles.mottoRow} testID="card-motto-row">
                  <Text style={[textStyles.bodyMD, { color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center' }]} testID="card-motto">
                    "{trainer.motto}"
                  </Text>
                </View>
                <View style={styles.divider} />
              </>
            ) : null}

            {/* Edad */}
            <View style={styles.dataRow} testID="card-age-row">
              <Label color="textSecondary" style={styles.dataLabel}>Edad</Label>
              <Text style={[textStyles.bodyMD, { color: colors.textPrimary }]} testID="card-age">
                {trainer.age} años
              </Text>
            </View>
            <View style={styles.divider} />

            {/* Email */}
            <View style={styles.dataRow} testID="card-email-row">
              <Label color="textSecondary" style={styles.dataLabel}>Correo</Label>
              <Text style={[textStyles.bodyMD, { color: colors.textPrimary, flex: 2, textAlign: 'right' }]} numberOfLines={1} testID="card-email">
                {trainer.email}
              </Text>
            </View>
            <View style={styles.divider} />

            {/* Distrito */}
            <View style={styles.dataRow} testID="card-district-row">
              <Label color="textSecondary" style={styles.dataLabel}>Distrito</Label>
              <Text style={[textStyles.bodyMD, { color: colors.textPrimary }]} testID="card-district">
                {trainer.district}
              </Text>
            </View>
            <View style={styles.divider} />

            {/* Tipo favorito */}
            <View style={styles.dataRow} testID="card-type-row">
              <Label color="textSecondary" style={styles.dataLabel}>Tipo favorito</Label>
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

        {/* Card del Pokémon Inicial */}
        <StarterCard
          starter={starterPokemon}
          onChooseStarter={() => navigation.navigate('StarterSelection')}
          testID="starter-section"
        />

        {/* Acciones */}
        <View style={styles.actions}>
          <Button label="Editar perfil" variant="secondary" fullWidth onPress={handleEdit} testID="btn-edit-trainer" />
          <Button label="Eliminar registro" variant="danger" fullWidth onPress={() => setShowDeleteModal(true)} testID="btn-delete-trainer" />
        </View>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  headerSection: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.xxs },
  card: { marginBottom: spacing.xs },
  photoSection: { alignItems: 'center', marginBottom: spacing.lg, gap: spacing.xs },
  registeredBadge: { alignSelf: 'center' },
  mottoRow: { paddingVertical: spacing.xs, alignItems: 'center' },
  dataRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs },
  dataLabel: { flex: 1 },
  divider: { height: 0.5, backgroundColor: '#00000020' },
  actions: { gap: spacing.xs, marginTop: spacing.sm },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
});

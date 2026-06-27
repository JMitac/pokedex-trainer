/**
 * @file Step2Preferences.tsx
 * @layer Features / Trainer / Screens
 *
 * Paso 2 del formulario — Preferencias.
 * Funciona tanto para registro nuevo como para edición.
 * Si hay datos en el store, las opciones aparecen pre-seleccionadas.
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/ui/components/Button';
import { Heading, Body, Label, Caption } from '@/ui/components/Typography';
import { colors, spacing, borderRadius, borderWidth } from '@/ui/tokens';
import { step2Schema } from '../schemas/trainer.schemas';
import { useTrainerStore } from '../store/trainerStore';
import { StepIndicator } from '../components/StepIndicator';
import { DISTRICTS, POKEMON_TYPES } from '../types/trainer.types';
import type { Step2FormValues } from '../schemas/trainer.schemas';
import type { District, FavoritePokemonType, Step1Data } from '../types/trainer.types';
import type { TrainerNavigationProp } from '@/app/navigation';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type Props = TrainerNavigationProp<'Step2Preferences'>;

// ---------------------------------------------------------------------------
// Sub-componente: OptionSelector
// ---------------------------------------------------------------------------

interface OptionSelectorProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T | undefined;
  onChange: (value: T) => void;
  error?: string;
  testID?: string;
}

function OptionSelector<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  testID,
}: OptionSelectorProps<T>) {
  return (
    <View testID={testID}>
      <Label color={error ? 'error' : 'textSecondary'} style={styles.selectorLabel}>
        {label} *
      </Label>
      <View style={styles.optionsGrid}>
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                error && !isSelected && styles.optionError,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={option}
              testID={`${testID}-option-${option}`}
            >
              <Body
                size="sm"
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option}
              </Body>
            </Pressable>
          );
        })}
      </View>
      {error && (
        <Caption color="error" testID={`${testID}-error`}>
          {error}
        </Caption>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Pantalla principal
// ---------------------------------------------------------------------------

export const Step2Preferences: React.FC<Props> = ({ route, navigation }) => {
  const step1Data = route.params as unknown as Step1Data;

  // Leer datos existentes del store para pre-llenar en modo edición
  const trainer = useTrainerStore((state) => state.trainer);
  const saveTrainer = useTrainerStore((state) => state.saveTrainer);
  const isEditing = trainer !== null;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step2FormValues>({
    resolver: yupResolver(step2Schema),
    mode: 'onChange',
    // Pre-llenar con datos del store si estamos editando
    defaultValues: {
      district: trainer?.district ?? undefined,
      favoritePokemonType: trainer?.favoritePokemonType ?? undefined,
    },
  });

  const onSubmit = (data: Step2FormValues) => {
    saveTrainer({
      ...step1Data,
      district: data.district as District,
      favoritePokemonType: data.favoritePokemonType as FavoritePokemonType,
    });
    navigation.navigate('TrainerCard');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StepIndicator
        currentStep={2}
        totalSteps={2}
        testID="step-indicator"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Heading size="lg" testID="step2-title">
            {isEditing ? 'Editar Preferencias' : 'Preferencias'}
          </Heading>
          <Body color="textSecondary" style={styles.subtitle}>
            {isEditing
              ? 'Actualiza tus preferencias como entrenador'
              : 'Cuéntanos sobre tus preferencias como entrenador'}
          </Body>
        </View>

        <View style={styles.form}>
          {/* Distrito de origen */}
          <Controller
            control={control}
            name="district"
            render={({ field: { onChange, value } }) => (
              <OptionSelector
                label="Distrito de origen"
                options={DISTRICTS}
                value={value as District}
                onChange={onChange}
                error={errors.district?.message}
                testID="selector-district"
              />
            )}
          />

          {/* Tipo de Pokémon favorito */}
          <Controller
            control={control}
            name="favoritePokemonType"
            render={({ field: { onChange, value } }) => (
              <OptionSelector
                label="Tipo de Pokémon favorito"
                options={POKEMON_TYPES}
                value={value as FavoritePokemonType}
                onChange={onChange}
                error={errors.favoritePokemonType?.message}
                testID="selector-type"
              />
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={isEditing ? 'Guardar cambios' : 'Finalizar registro'}
          size="lg"
          fullWidth
          disabled={!isValid}
          onPress={handleSubmit(onSubmit)}
          accessibilityHint={
            isEditing
              ? 'Guarda los cambios de tu perfil'
              : 'Completa el registro y ve tu carnet'
          }
          testID="btn-finish"
        />
      </View>
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
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.xl,
  },
  selectorLabel: {
    marginBottom: spacing.xs,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: borderWidth.base,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionError: {
    borderColor: colors.errorLight,
  },
  optionText: {
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
});

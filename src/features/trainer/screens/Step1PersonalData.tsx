/**
 * @file Step1PersonalData.tsx
 * @layer Features / Trainer / Screens
 *
 * Paso 1 — Datos Personales.
 * Incluye el campo opcional de lema del entrenador.
 *
 * IMPORTANTE — Workaround de bug en react-native-safe-area-context:
 * Ver nota completa en PokemonListScreen.tsx. Usamos <View> simple
 * en lugar de <SafeAreaView edges={['top']}> para evitar el bug de
 * layout que genera padding-bottom fantasma de ~116px en iOS.
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/ui/components/Input';
import { Button } from '@/ui/components/Button';
import { Heading, Body, Caption } from '@/ui/components/Typography';
import { colors, spacing } from '@/ui/tokens';
import { step1Schema } from '../schemas/trainer.schemas';
import { useTrainerStore } from '../store/trainerStore';
import { StepIndicator } from '../components/StepIndicator';
import type { Step1FormValues } from '../schemas/trainer.schemas';
import type { TrainerNavigationProp } from '@/app/navigation';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type Props = TrainerNavigationProp<'Step1PersonalData'>;

// ---------------------------------------------------------------------------
// Sub-componente AgeInput (evita useState en render prop)
// ---------------------------------------------------------------------------

interface AgeInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur: () => void;
  error?: string;
  inputRef: React.Ref<TextInput>;
}

const AgeInput: React.FC<AgeInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  inputRef,
}) => {
  const [inputText, setInputText] = useState(
    value !== undefined && !isNaN(value) ? String(value) : ''
  );

  return (
    <Input
      ref={inputRef}
      label="Edad"
      required
      placeholder="10"
      value={inputText}
      onChangeText={(text) => {
        const digitsOnly = text.replace(/[^0-9]/g, '');
        setInputText(digitsOnly);
        if (digitsOnly === '') {
          onChange(undefined);
          return;
        }
        const num = parseInt(digitsOnly, 10);
        if (!isNaN(num)) onChange(num);
      }}
      onBlur={onBlur}
      error={error}
      hint="Entre 10 y 99 años"
      keyboardType="numeric"
      maxLength={2}
      returnKeyType="next"
      testID="input-age"
    />
  );
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export const Step1PersonalData: React.FC<Props> = ({ navigation }) => {
  const trainer = useTrainerStore((state) => state.trainer);
  const isEditing = trainer !== null;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step1FormValues>({
    resolver: yupResolver(step1Schema) as unknown as Resolver<Step1FormValues>,
    mode: 'onChange',
    defaultValues: {
      fullName: trainer?.fullName ?? '',
      age: trainer?.age ?? undefined,
      email: trainer?.email ?? '',
      motto: trainer?.motto ?? '',
    },
  });

  const mottoValue = watch('motto') ?? '';

  const onSubmit: SubmitHandler<Step1FormValues> = (data) => {
    navigation.navigate('Step2Preferences', data as never);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StepIndicator currentStep={1} totalSteps={2} testID="step-indicator" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Heading size="lg" testID="step1-title">
              {isEditing ? 'Editar Perfil' : 'Datos Personales'}
            </Heading>
            <Body color="textSecondary" style={styles.subtitle}>
              {isEditing
                ? 'Actualiza tu información de entrenador'
                : 'Completa tu información para crear tu carnet de entrenador'}
            </Body>
          </View>

          <View style={styles.form}>
            {/* Nombre completo */}
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  ref={ref}
                  label="Nombre completo"
                  required
                  placeholder="Ash Ketchum"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
                  hint="Este nombre aparecerá en tu carnet"
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                  testID="input-fullname"
                />
              )}
            />

            {/* Edad */}
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <AgeInput
                  inputRef={ref}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errors.age?.message}
                />
              )}
            />

            {/* Correo electrónico */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  ref={ref}
                  label="Correo electrónico"
                  required
                  placeholder="ash@pokemon.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  testID="input-email"
                />
              )}
            />

            {/* Lema del entrenador — opcional */}
            <Controller
              control={control}
              name="motto"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <View>
                  <Input
                    ref={ref}
                    label="Lema de entrenador"
                    placeholder="¡Voy a ser el mejor!"
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.motto?.message}
                    hint="Opcional · Aparecerá en tu carnet"
                    autoCapitalize="sentences"
                    maxLength={60}
                    returnKeyType="done"
                    testID="input-motto"
                  />
                  {/* Contador de caracteres */}
                  <Caption
                    color={mottoValue.length >= 55 ? 'error' : 'textMuted'}
                    style={styles.charCount}
                  >
                    {mottoValue.length}/60
                  </Caption>
                </View>
              )}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Siguiente"
            size="lg"
            fullWidth
            disabled={!isValid}
            onPress={handleSubmit(onSubmit)}
            accessibilityHint={
              isEditing
                ? 'Continúa editando tus preferencias'
                : 'Avanza al paso 2 de registro'
            }
            testID="btn-next-step1"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
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
  flex: {
    flex: 1,
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
    gap: spacing.md,
  },
  charCount: {
    textAlign: 'right',
    marginTop: spacing.xxxs,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
});

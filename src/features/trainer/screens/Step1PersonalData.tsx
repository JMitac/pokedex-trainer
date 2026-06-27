/**
 * @file Step1PersonalData.tsx
 * @layer Features / Trainer / Screens
 *
 * Paso 1 del formulario — Datos Personales.
 * Funciona tanto para registro nuevo como para edición.
 * Si hay datos en el store, los campos aparecen pre-llenados.
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/ui/components/Input';
import { Button } from '@/ui/components/Button';
import { Heading, Body } from '@/ui/components/Typography';
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
// Componente
// ---------------------------------------------------------------------------

export const Step1PersonalData: React.FC<Props> = ({ navigation }) => {
  // Si hay datos en el store, es modo edición
  const trainer = useTrainerStore((state) => state.trainer);
  const isEditing = trainer !== null;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1FormValues>({
    resolver: yupResolver(step1Schema),
    mode: 'onChange',
    // Pre-llenar con datos existentes si estamos editando
    defaultValues: {
      fullName: trainer?.fullName ?? '',
      age: trainer?.age ?? undefined,
      email: trainer?.email ?? '',
    },
  });

  const onSubmit = (data: Step1FormValues) => {
    navigation.navigate('Step2Preferences', data as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StepIndicator
          currentStep={1}
          totalSteps={2}
          testID="step-indicator"
        />

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

            <Controller
                control={control}
                name="age"
                render={({ field: { onChange, onBlur, value, ref } }) => {
                    const [inputText, setInputText] = React.useState(
                    value !== undefined && !isNaN(value) ? String(value) : ''
                    );

                    return (
                    <Input
                        ref={ref}
                        label="Edad"
                        required
                        placeholder="10"
                        value={inputText}
                        onChangeText={(text) => {
                        // Solo permitir dígitos
                        const digitsOnly = text.replace(/[^0-9]/g, '');
                        setInputText(digitsOnly);

                        if (digitsOnly === '') {
                            onChange(undefined);
                            return;
                        }
                        const num = parseInt(digitsOnly, 10);
                        if (!isNaN(num)) {
                            onChange(num);
                        }
                        }}
                        onBlur={onBlur}
                        error={errors.age?.message}
                        hint="Entre 10 y 99 años"
                        keyboardType="numeric"
                        maxLength={2}
                        returnKeyType="next"
                        testID="input-age"
                    />
                    );
                }}
            />

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
                  returnKeyType="done"
                  testID="input-email"
                />
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
    </SafeAreaView>
  );
};

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
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
});

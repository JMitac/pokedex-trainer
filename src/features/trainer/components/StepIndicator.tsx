/**
 * @file StepIndicator.tsx
 * @layer Features / Trainer / Components
 *
 * Indicador de progreso para el formulario multi-paso.
 * Muestra en qué paso se encuentra el usuario.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, borderWidth } from '@/ui/tokens';
import { Caption } from '@/ui/components/Typography';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  testID?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  testID,
}) => (
  <View style={styles.container} testID={testID}>
    {Array.from({ length: totalSteps }).map((_, index) => {
      const stepNumber = index + 1;
      const isCompleted = stepNumber < currentStep;
      const isActive = stepNumber === currentStep;

      return (
        <View key={stepNumber} style={styles.stepWrapper}>
          {/* Círculo del paso */}
          <View
            style={[
              styles.circle,
              isActive && styles.circleActive,
              isCompleted && styles.circleCompleted,
            ]}
            testID={`${testID}-step-${stepNumber}`}
          >
            <Caption
              style={[
                styles.stepNumber,
                (isActive || isCompleted) && styles.stepNumberActive,
              ]}
            >
              {isCompleted ? '✓' : String(stepNumber)}
            </Caption>
          </View>

          {/* Línea conectora (excepto en el último paso) */}
          {index < totalSteps - 1 && (
            <View
              style={[
                styles.connector,
                isCompleted && styles.connectorCompleted,
              ]}
            />
          )}
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  circleCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  stepNumber: {
    color: colors.textMuted,
    lineHeight: 14,
  },
  stepNumberActive: {
    color: colors.textInverse,
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xxs,
  },
  connectorCompleted: {
    backgroundColor: colors.success,
  },
});

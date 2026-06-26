/**
 * @file Button.tsx
 * @layer UI / Components / Button
 *
 * Componente de botón nativo para toda la aplicación.
 *
 * REGLA: Ningún componente de la app debe usar <Pressable> o <TouchableOpacity>
 * directamente para acciones principales. Siempre usar <Button> del catálogo
 * para garantizar consistencia visual, accesibilidad y estados correctos.
 */

import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, borderWidth, textStyles } from '@/ui/tokens';
import { Typography } from '@/ui/components/Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /**
   * Texto que se muestra en el botón.
   */
  label: string;

  /**
   * Variante visual del botón.
   * - primary: fondo rojo de marca, texto blanco — acción principal
   * - secondary: borde rojo, fondo transparente — acción alternativa
   * - ghost: sin borde ni fondo — acción terciaria o cancelar
   * - danger: fondo rojo oscuro — acciones destructivas
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Tamaño del botón.
   * - sm: compacto, para acciones secundarias en espacios reducidos
   * - md: tamaño estándar
   * - lg: prominente, para CTAs principales de pantalla
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Ocupa el 100% del ancho del contenedor.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Desactiva el botón — no responde a interacciones.
   * @default false
   */
  disabled?: boolean;

  /**
   * Muestra un spinner y desactiva el botón.
   * Usar durante operaciones asíncronas.
   * @default false
   */
  loading?: boolean;

  /**
   * Icono opcional a la izquierda del texto.
   * Acepta cualquier componente React (ej: de @expo/vector-icons).
   */
  leftIcon?: React.ReactNode;

  /**
   * Icono opcional a la derecha del texto.
   */
  rightIcon?: React.ReactNode;

  /**
   * Callback al presionar el botón.
   */
  onPress?: () => void;

  /**
   * Estilos adicionales para el contenedor del botón.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * ID para pruebas automatizadas.
   */
  testID?: string;

  /**
   * Etiqueta de accesibilidad para lectores de pantalla.
   * Si no se provee, usa el `label` del botón.
   */
  accessibilityLabel?: string;

  /**
   * Hint de accesibilidad — describe qué hace el botón.
   */
  accessibilityHint?: string;
}

// ---------------------------------------------------------------------------
// Constantes de estilos por variante y tamaño
// ---------------------------------------------------------------------------

const VARIANT_STYLES: Record<
  ButtonVariant,
  { container: ViewStyle; labelColor: string }
> = {
  primary: {
    container: {
      backgroundColor: colors.primary,
      borderWidth: 0,
    },
    labelColor: colors.textInverse,
  },
  secondary: {
    container: {
      backgroundColor: colors.transparent,
      borderWidth: borderWidth.medium,
      borderColor: colors.primary,
    },
    labelColor: colors.primary,
  },
  ghost: {
    container: {
      backgroundColor: colors.transparent,
      borderWidth: 0,
    },
    labelColor: colors.primary,
  },
  danger: {
    container: {
      backgroundColor: colors.errorDark,
      borderWidth: 0,
    },
    labelColor: colors.textInverse,
  },
};

const SIZE_STYLES: Record<
  ButtonSize,
  { container: ViewStyle; fontSize: typeof textStyles[keyof typeof textStyles] }
> = {
  sm: {
    container: {
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.sm,
      minHeight: 36,
      borderRadius: borderRadius.sm,
    },
    fontSize: textStyles.labelMD,
  },
  md: {
    container: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      minHeight: spacing.touchTarget,
      borderRadius: borderRadius.sm,
    },
    fontSize: textStyles.labelLG,
  },
  lg: {
    container: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xl,
      minHeight: spacing.controlHeight,
      borderRadius: borderRadius.md,
    },
    fontSize: textStyles.labelLG,
  },
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onPress,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const isDisabled = disabled || loading;

  const handlePress = useCallback(() => {
    if (!isDisabled && onPress) {
      onPress();
    }
  }, [isDisabled, onPress]);

  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        {/* Icono izquierdo */}
        {!loading && leftIcon && (
          <View style={styles.iconLeft} testID={`${testID}-icon-left`}>
            {leftIcon}
          </View>
        )}

        {/* Spinner de carga */}
        {loading && (
          <ActivityIndicator
            size="small"
            color={variantStyle.labelColor}
            style={styles.spinner}
            testID={`${testID}-spinner`}
          />
        )}

        {/* Texto */}
        <Typography
          style={[
            sizeStyle.fontSize,
            { color: isDisabled ? colors.disabledText : variantStyle.labelColor },
          ]}
          testID={`${testID}-label`}
        >
          {label}
        </Typography>

        {/* Icono derecho */}
        {!loading && rightIcon && (
          <View style={styles.iconRight} testID={`${testID}-icon-right`}>
            {rightIcon}
          </View>
        )}
      </View>
    </Pressable>
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.xxs,
  },
  iconRight: {
    marginLeft: spacing.xxs,
  },
  spinner: {
    marginRight: spacing.xxs,
  },
});

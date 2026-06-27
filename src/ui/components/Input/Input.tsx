/**
 * @file Input.tsx
 * @layer UI / Components / Input
 *
 * Campo de texto nativo para formularios.
 * Diseñado para integrarse con react-hook-form mediante el patrón Controller.
 *
 * REGLA: Ningún componente de la app debe usar <TextInput> de React Native
 * directamente en screens o features. Siempre usar <Input> del catálogo
 * para garantizar consistencia visual, accesibilidad y manejo de errores.
 */

import React, { forwardRef, useState, useCallback } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
  Pressable,
  Platform,
} from 'react-native';
import {
  colors,
  spacing,
  borderRadius,
  borderWidth,
  textStyles,
  fontSize,
} from '@/ui/tokens';
import { Typography, Label, Caption } from '@/ui/components/Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type InputVariant = 'default' | 'filled';

export interface InputProps
  extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  /**
   * Label que aparece encima del campo.
   */
  label?: string;

  /**
   * Marca el campo como requerido — agrega asterisco al label.
   * @default false
   */
  required?: boolean;

  /**
   * Mensaje de error — activa el estado de error visualmente.
   * Recibe directamente el mensaje de react-hook-form.
   */
  error?: string;

  /**
   * Texto de ayuda que aparece debajo del campo cuando no hay error.
   */
  hint?: string;

  /**
   * Variante visual del campo.
   * - default: borde visible, fondo transparente
   * - filled: sin borde, fondo gris suave
   * @default 'default'
   */
  variant?: InputVariant;

  /**
   * Icono o elemento a la izquierda del input.
   */
  leftElement?: React.ReactNode;

  /**
   * Icono o elemento a la derecha del input.
   * Se oculta automáticamente cuando showPasswordToggle es true.
   */
  rightElement?: React.ReactNode;

  /**
   * Agrega botón para mostrar/ocultar contraseña.
   * Activa secureTextEntry automáticamente.
   * @default false
   */
  showPasswordToggle?: boolean;

  /**
   * Deshabilita el campo.
   * @default false
   */
  disabled?: boolean;

  /**
   * Estilos adicionales para el contenedor externo.
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * ID para pruebas automatizadas.
   * Genera IDs derivados para label, input, error y hint.
   */
  testID?: string;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      required = false,
      error,
      hint,
      variant = 'default',
      leftElement,
      rightElement,
      showPasswordToggle = false,
      disabled = false,
      containerStyle,
      testID,
      secureTextEntry,
      onFocus,
      onBlur,
      ...textInputProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const hasError = Boolean(error);
    const isSecure =
      showPasswordToggle ? !isPasswordVisible : secureTextEntry;

    // -----------------------------------------------------------------------
    // Handlers
    // -----------------------------------------------------------------------

    const handleFocus = useCallback(
      (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    const togglePasswordVisibility = useCallback(() => {
      setIsPasswordVisible((prev) => !prev);
    }, []);

    // -----------------------------------------------------------------------
    // Estilos dinámicos
    // -----------------------------------------------------------------------

    const containerBorderColor = hasError
      ? colors.error
      : isFocused
      ? colors.borderFocus
      : colors.border;

    const inputContainerStyle: ViewStyle =
      variant === 'filled'
        ? {
            backgroundColor: colors.surfaceMuted,
            borderWidth: 0,
            borderBottomWidth: borderWidth.medium,
            borderBottomColor: containerBorderColor,
            borderRadius: borderRadius.sm,
          }
        : {
            backgroundColor: colors.transparent,
            borderWidth: borderWidth.base,
            borderColor: containerBorderColor,
            borderRadius: borderRadius.sm,
          };

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------

    return (
      <View style={[styles.wrapper, containerStyle]} testID={testID}>
        {/* Label */}
        {label && (
          <View style={styles.labelRow}>
            <Label
              testID={testID ? `${testID}-label` : undefined}
              color={hasError ? 'error' : 'textSecondary'}
            >
              {label}
            </Label>
            {required && (
              <Typography
                variant="labelMD"
                color="error"
                style={styles.asterisk}
                testID={testID ? `${testID}-required` : undefined}
              >
                *
              </Typography>
            )}
          </View>
        )}

        {/* Campo de texto */}
        <View
          style={[
            styles.inputContainer,
            inputContainerStyle,
            disabled && styles.disabledContainer,
          ]}
          testID={testID ? `${testID}-container` : undefined}
        >
          {/* Elemento izquierdo */}
          {leftElement && (
            <View
              style={styles.leftElement}
              testID={testID ? `${testID}-left` : undefined}
            >
              {leftElement}
            </View>
          )}

          {/* TextInput nativo */}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              disabled && styles.disabledText,
            ]}
            placeholderTextColor={colors.textMuted}
            editable={!disabled}
            secureTextEntry={isSecure}
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessibilityLabel={label}
            accessibilityState={{
              disabled,
              ...(hasError && { selected: false }),
            }}
            accessibilityHint={hint}
            testID={testID ? `${testID}-input` : undefined}
            {...textInputProps}
          />

          {/* Toggle de contraseña */}
          {showPasswordToggle && (
            <Pressable
              onPress={togglePasswordVisibility}
              style={styles.rightElement}
              accessibilityLabel={
                isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
              accessibilityRole="button"
              testID={testID ? `${testID}-password-toggle` : undefined}
            >
              <Typography variant="labelSM" color="textSecondary">
                {isPasswordVisible ? 'Ocultar' : 'Ver'}
              </Typography>
            </Pressable>
          )}

          {/* Elemento derecho (solo si no hay toggle de contraseña) */}
          {!showPasswordToggle && rightElement && (
            <View
              style={styles.rightElement}
              testID={testID ? `${testID}-right` : undefined}
            >
              {rightElement}
            </View>
          )}
        </View>

        {/* Error o hint */}
        {hasError ? (
          <Caption
            color="error"
            testID={testID ? `${testID}-error` : undefined}
          >
            {error}
          </Caption>
        ) : hint ? (
          <Caption
            color="textMuted"
            testID={testID ? `${testID}-hint` : undefined}
          >
            {hint}
          </Caption>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: spacing.xxs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxxs,
    marginBottom: spacing.xxs,
  },
  asterisk: {
    lineHeight: fontSize.sm * 1.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: spacing.touchTarget,
    paddingHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    ...textStyles.bodyLG,
    color: colors.textPrimary,
    paddingVertical: Platform.OS === 'ios' ? spacing.xs : spacing.xxs,
    // Elimina el padding interno de Android que desalinea el texto
    paddingLeft: 0,
    includeFontPadding: false,
  },
  disabledContainer: {
    backgroundColor: colors.disabled,
    borderColor: colors.border,
    opacity: 0.6,
  },
  disabledText: {
    color: colors.disabledText,
  },
  leftElement: {
    marginRight: spacing.xs,
  },
  rightElement: {
    marginLeft: spacing.xs,
    padding: spacing.xxs,
  },
});

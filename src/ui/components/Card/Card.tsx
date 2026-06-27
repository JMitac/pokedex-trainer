/**
 * @file Card.tsx
 * @layer UI / Components / Card
 *
 * Contenedor base para cards de Pokémon, trainer y contenido general.
 * Soporta composición mediante sub-componentes Card.Header, Card.Body, Card.Footer.
 *
 * REGLA: Ningún componente de feature debe definir sus propios estilos
 * de contenedor con sombra, borde y radio. Siempre usar <Card> del catálogo.
 */

import React, { useCallback } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import {
  colors,
  spacing,
  borderRadius,
  borderWidth,
  elevation,
} from '@/ui/tokens';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type CardVariant = 'elevated' | 'outlined' | 'flat';

export interface CardProps {
  /**
   * Variante visual del contenedor.
   * - elevated: sombra nativa por plataforma (iOS shadow / Android elevation)
   * - outlined: borde visible sin sombra
   * - flat: sin sombra ni borde — solo fondo blanco
   * @default 'elevated'
   */
  variant?: CardVariant;

  /**
   * Hace la card presionable completa.
   * Cuando se provee onPress, el contenedor usa Pressable con feedback táctil.
   */
  onPress?: () => void;

  /**
   * Deshabilita la interacción cuando onPress está definido.
   * @default false
   */
  disabled?: boolean;

  /**
   * Color de fondo de la card.
   * @default colors.surface (blanco)
   */
  backgroundColor?: string;

  /**
   * Padding interno de la card.
   * @default spacing.md (16px)
   */
  padding?: number;

  /**
   * Estilos adicionales del contenedor.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Contenido de la card.
   */
  children: React.ReactNode;

  /**
   * ID para pruebas automatizadas.
   */
  testID?: string;

  /**
   * Etiqueta de accesibilidad cuando la card es presionable.
   */
  accessibilityLabel?: string;

  /**
   * Hint de accesibilidad.
   */
  accessibilityHint?: string;
}

// ---------------------------------------------------------------------------
// Estilos por variante
// ---------------------------------------------------------------------------

const VARIANT_STYLES: Record<CardVariant, ViewStyle> = {
  elevated: {
    backgroundColor: colors.surface,
    borderWidth: 0,
    // iOS
    shadowColor: colors.palette.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Android
    elevation: elevation.sm,
  },
  outlined: {
    backgroundColor: colors.surface,
    borderWidth: borderWidth.base,
    borderColor: colors.border,
    elevation: elevation.none,
  },
  flat: {
    backgroundColor: colors.surface,
    borderWidth: 0,
    elevation: elevation.none,
  },
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({
  variant = 'elevated',
  onPress,
  disabled = false,
  backgroundColor,
  padding = spacing.md,
  style,
  children,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const handlePress = useCallback(() => {
    if (!disabled && onPress) onPress();
  }, [disabled, onPress]);

  const variantStyle = VARIANT_STYLES[variant];

  const containerStyle: ViewStyle = {
    ...variantStyle,
    borderRadius: borderRadius.md,
    padding,
    ...(backgroundColor ? { backgroundColor } : {}),
  };

  // Card presionable
  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        testID={testID}
        style={({ pressed }) => [
          styles.base,
          containerStyle,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  // Card estática
  return (
    <View
      style={[styles.base, containerStyle, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Sub-componentes de composición
// ---------------------------------------------------------------------------

export interface CardSectionProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Sección de encabezado de la card.
 * Agrega padding inferior y separador visual.
 */
const CardHeader: React.FC<CardSectionProps> = ({ children, style, testID }) => (
  <View
    style={[styles.header, style]}
    testID={testID}
  >
    {children}
  </View>
);

/**
 * Cuerpo principal de la card.
 * Área de contenido principal.
 */
const CardBody: React.FC<CardSectionProps> = ({ children, style, testID }) => (
  <View
    style={[styles.body, style]}
    testID={testID}
  >
    {children}
  </View>
);

/**
 * Pie de la card.
 * Para acciones, metadata o información adicional.
 */
const CardFooter: React.FC<CardSectionProps> = ({ children, style, testID }) => (
  <View
    style={[styles.footer, style]}
    testID={testID}
  >
    {children}
  </View>
);

// Asignar sub-componentes al componente principal
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  header: {
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.border,
  },
  body: {
    flex: 1,
  },
  footer: {
    paddingTop: spacing.xs,
    marginTop: spacing.xs,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.border,
  },
});

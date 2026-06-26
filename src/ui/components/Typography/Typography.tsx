/**
 * @file Typography.tsx
 * @layer UI / Components / Typography
 *
 * Componente base para todo el texto de la aplicación.
 *
 * REGLA: Ningún componente de la app debe usar <Text> de React Native
 * directamente. Siempre usar <Typography> para garantizar consistencia
 * visual y accesibilidad en toda la aplicación.
 */

import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { colors, textStyles } from '@/ui/tokens';
import type { TextStyleToken, ColorToken } from '@/ui/tokens';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type TypographyVariant = TextStyleToken;

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export interface TypographyProps {
  /**
   * Variante tipográfica — define tamaño, peso y altura de línea.
   * Mapea directamente a los textStyles del sistema de tokens.
   * @default 'bodyLG'
   */
  variant?: TypographyVariant;

  /**
   * Token de color del sistema de diseño.
   * @default 'textPrimary'
   */
  color?: ColorToken;

  /**
   * Alineación del texto.
   * @default 'left'
   */
  align?: TypographyAlign;

  /**
   * Número máximo de líneas antes de truncar con "...".
   * undefined = sin límite.
   */
  numberOfLines?: number;

  /**
   * Estilos adicionales para casos excepcionales.
   * Usar con moderación — preferir siempre las props de la API.
   */
  style?: StyleProp<TextStyle>;

  /**
   * Texto que se renderiza.
   */
  children: React.ReactNode;

  /**
   * Etiqueta de accesibilidad para lectores de pantalla.
   * Requerida cuando el texto visual no describe suficientemente el elemento.
   */
  accessibilityLabel?: string;

  /**
   * Rol de accesibilidad.
   */
  accessibilityRole?: 'text' | 'header' | 'summary' | 'link' | 'none';

  /**
   * Permite seleccionar el texto con long press.
   * @default false
   */
  selectable?: boolean;

  /**
   * Callback para cuando el texto es presionado.
   */
  onPress?: () => void;

  /**
   * Aplica decoración de texto tachado.
   * Útil para precios o elementos eliminados.
   * @default false
   */
  strikethrough?: boolean;

  /**
   * Aplica subrayado al texto.
   * @default false
   */
  underline?: boolean;

  /**
   * Convierte el texto a mayúsculas.
   * @default false
   */
  uppercase?: boolean;

  /**
   * ID para pruebas automatizadas.
   */
  testID?: string;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyLG',
  color = 'textPrimary',
  align = 'left',
  numberOfLines,
  style,
  children,
  accessibilityLabel,
  accessibilityRole = 'text',
  selectable = false,
  onPress,
  strikethrough = false,
  underline = false,
  uppercase = false,
  testID,
}) => {
  const resolvedColor = colors[color];

  const decorationStyle: TextStyle = {
    textDecorationLine:
      strikethrough && underline
        ? 'underline line-through'
        : strikethrough
        ? 'line-through'
        : underline
        ? 'underline'
        : 'none',
  };

  return (
    <Text
      style={[
        styles.base,
        textStyles[variant],
        { color: resolvedColor, textAlign: align },
        decorationStyle,
        uppercase && styles.uppercase,
        style,
      ]}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      selectable={selectable}
      onPress={onPress}
      testID={testID}
    >
      {children}
    </Text>
  );
};

// ---------------------------------------------------------------------------
// Estilos base
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    // Incluido para garantizar que el texto no herede estilos inesperados
    // en contextos de navegación o modales
    includeFontPadding: false, // Android: elimina padding interno del texto
    textAlignVertical: 'center', // Android: alineación vertical consistente
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});

// ---------------------------------------------------------------------------
// Sub-componentes de conveniencia
// Atajos semánticos para los casos de uso más frecuentes
// ---------------------------------------------------------------------------

/**
 * Título principal de una pantalla.
 * Equivale a <Typography variant="headingLG" />
 */
export const Heading: React.FC<Omit<TypographyProps, 'variant'> & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ size = 'lg', ...props }) => {
  const variantMap = {
    sm: 'headingSM',
    md: 'headingMD',
    lg: 'headingLG',
    xl: 'headingXL',
  } as const;

  return (
    <Typography
      variant={variantMap[size]}
      accessibilityRole="header"
      {...props}
    />
  );
};

/**
 * Texto de cuerpo estándar.
 * Equivale a <Typography variant="bodyLG" />
 */
export const Body: React.FC<Omit<TypographyProps, 'variant'> & {
  size?: 'sm' | 'md' | 'lg';
}> = ({ size = 'lg', ...props }) => {
  const variantMap = {
    sm: 'bodySM',
    md: 'bodyMD',
    lg: 'bodyLG',
  } as const;

  return <Typography variant={variantMap[size]} {...props} />;
};

/**
 * Label de campo de formulario.
 * Equivale a <Typography variant="labelMD" />
 */
export const Label: React.FC<Omit<TypographyProps, 'variant'> & {
  size?: 'sm' | 'md' | 'lg';
}> = ({ size = 'md', ...props }) => {
  const variantMap = {
    sm: 'labelSM',
    md: 'labelMD',
    lg: 'labelLG',
  } as const;

  return <Typography variant={variantMap[size]} {...props} />;
};

/**
 * Texto de apoyo muy pequeño — captions, fechas, metadata.
 * Equivale a <Typography variant="caption" />
 */
export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" color="textSecondary" {...props} />
);

/**
 * Número de Pokémon en formato monoespaciado — #0001
 * Equivale a <Typography variant="pokemonNumber" />
 */
export const PokemonNumber: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="pokemonNumber" color="textMuted" {...props} />
);

/**
 * Nombre del Pokémon en la card de lista y pantalla de detalle.
 * Equivale a <Typography variant="pokemonName" />
 */
export const PokemonName: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="pokemonName" color="textPrimary" {...props} />
);

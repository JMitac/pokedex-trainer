/**
 * @file SearchBar.tsx
 * @layer Features / Pokédex / Components
 *
 * Barra de búsqueda nativa para el Pokédex.
 * Incluye ícono de lupa, campo de texto y botón de limpiar.
 *
 * IMPORTANTE — Centrado vertical del texto en iOS:
 * El contenedor tiene una altura FIJA (SEARCH_BAR_HEIGHT) en iOS.
 * Sin una altura fija, `alignItems: 'center'` no tiene una caja
 * de referencia estable y el texto del TextInput queda descentrado.
 * `includeFontPadding` es una propiedad EXCLUSIVA de Android —
 * aplicarla en iOS no tiene efecto pero la aislamos por claridad.
 */

import React, { useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '@/ui/tokens';
import { Caption } from '@/ui/components/Typography';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Buscar Pokémon...',
  testID,
}) => {
  const inputRef = useRef<TextInput>(null);

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container} testID={testID}>
      {/* Ícono lupa */}
      <Caption style={styles.searchIcon}>🔍</Caption>

      {/* Campo de texto */}
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel="Buscar Pokémon"
        accessibilityHint="Escribe el nombre del Pokémon que quieres encontrar"
        testID={`${testID}-input`}
      />

      {/* Botón limpiar — solo aparece cuando hay texto */}
      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          style={styles.clearButton}
          accessibilityLabel="Limpiar búsqueda"
          accessibilityRole="button"
          testID={`${testID}-clear`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Caption style={styles.clearIcon}>✕</Caption>
        </Pressable>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

// Altura fija del contenedor en iOS — necesaria para que
// alignItems: 'center' centre el texto correctamente.
const SEARCH_BAR_HEIGHT = 44;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    // iOS: altura fija para centrado correcto.
    // Android: altura definida por el padding del contenido.
    ...(Platform.OS === 'ios'
      ? { height: SEARCH_BAR_HEIGHT }
      : { paddingVertical: spacing.xxs }),
  },
  searchIcon: {
    fontSize: fontSize.md,
    marginRight: spacing.xs,
    lineHeight: fontSize.md * 1.4,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    paddingVertical: 0,
    textAlignVertical: 'center',
    // includeFontPadding es EXCLUSIVO de Android.
    // Nunca debe aplicarse en iOS — no tiene efecto pero
    // lo aislamos para que quede explícito en el código.
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  clearButton: {
    marginLeft: spacing.xs,
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    backgroundColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    color: colors.textInverse,
    fontSize: 10,
    lineHeight: 12,
  },
});

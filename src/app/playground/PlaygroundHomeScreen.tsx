/**
 * @file PlaygroundHomeScreen.tsx
 * @layer App / Playground
 *
 * Catálogo visual de componentes nativos.
 * Solo visible en ambientes DEV y QA.
 */

import React from 'react';
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/app/providers/ThemeContext';
import { textStyles, spacing } from '@/ui/tokens';
import type { PlaygroundStackParamList } from '@/app/navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// ---------------------------------------------------------------------------
// Componentes disponibles en el catálogo
// ---------------------------------------------------------------------------

const COMPONENTS = [
  {
    name: 'Typography',
    description: 'Títulos, cuerpo, labels, captions y variantes de texto',
    emoji: '🔤',
  },
  {
    name: 'Button',
    description: 'Variantes primary, secondary, ghost, danger y estados',
    emoji: '🔘',
  },
  {
    name: 'Input',
    description: 'Campos de texto, estados de error, hints y password toggle',
    emoji: '✏️',
  },
  {
    name: 'Badge',
    description: 'Badges semánticos y TypeBadge con los 18 tipos Pokémon',
    emoji: '🏷️',
  },
  {
    name: 'Card',
    description: 'Contenedores elevated, outlined, flat y composición',
    emoji: '🃏',
  },
  {
    name: 'Skeleton',
    description: 'Estados de carga: base, PokemonCard, lista y detalle',
    emoji: '💀',
  },
] as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type Props = NativeStackScreenProps<PlaygroundStackParamList, 'PlaygroundHome'>;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const PlaygroundHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[textStyles.headingLG, { color: colors.textPrimary }]}>
            🧪 Dev Playground
          </Text>
          <Text style={[textStyles.bodyMD, { color: colors.textMuted, marginTop: spacing.xs }]}>
            Catálogo de componentes nativos. Solo visible en DEV y QA.
          </Text>
        </View>

        {/* Lista de componentes */}
        {COMPONENTS.map((component) => (
          <Pressable
            key={component.name}
            onPress={() =>
              navigation.navigate('ComponentDetail', {
                component: component.name,
              })
            }
            style={({ pressed }) => [
              styles.componentCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            testID={`playground-${component.name.toLowerCase()}`}
          >
            <Text style={styles.componentEmoji}>{component.emoji}</Text>
            <View style={styles.componentInfo}>
              <Text style={[textStyles.headingSM, { color: colors.textPrimary }]}>
                {component.name}
              </Text>
              <Text style={[textStyles.bodyMD, { color: colors.textMuted, marginTop: 2 }]}>
                {component.description}
              </Text>
            </View>
            <Text style={[textStyles.bodyLG, { color: colors.textMuted }]}>▶</Text>
          </Pressable>
        ))}

        {/* Footer info */}
        <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[textStyles.caption, { color: colors.textMuted, textAlign: 'center' }]}>
            Este tab no aparece en producción.{'\n'}
            Controlado por APP_ENV y __DEV__
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xs,
  },
  componentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    padding: spacing.md,
    gap: spacing.sm,
  },
  componentEmoji: {
    fontSize: 28,
    width: 40,
    textAlign: 'center',
  },
  componentInfo: {
    flex: 1,
  },
  infoBox: {
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.md,
  },
});

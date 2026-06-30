/**
 * @file ComponentDetailScreen.tsx
 * @layer App / Playground
 *
 * Pantalla de detalle de un componente del catálogo.
 * Muestra todas sus variantes e interacciones en el dispositivo real.
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/app/providers/ThemeContext';
import { textStyles, spacing } from '@/ui/tokens';

// Componentes del catálogo
import { Typography, Heading, Body, Label, Caption, PokemonName, PokemonNumber } from '@/ui/components/Typography';
import { Button } from '@/ui/components/Button';
import { Input } from '@/ui/components/Input';
import { Badge, TypeBadge } from '@/ui/components/Badge';
import { Card } from '@/ui/components/Card';
import { Skeleton, PokemonCardSkeleton, PokemonListSkeleton } from '@/ui/components/Skeleton';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PlaygroundStackParamList } from '@/app/navigation/types';
import type { PokemonType } from '@/ui/tokens';

type Props = NativeStackScreenProps<PlaygroundStackParamList, 'ComponentDetail'>;

// ---------------------------------------------------------------------------
// Helper: sección con título
// ---------------------------------------------------------------------------

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const { colors } = useTheme();
  return (
    <View style={sectionStyles.container}>
      <Text style={[textStyles.labelMD, { color: colors.textMuted, marginBottom: spacing.xs }]}>
        {title.toUpperCase()}
      </Text>
      <View style={[sectionStyles.content, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
};

const sectionStyles = StyleSheet.create({
  container: { gap: spacing.xxs },
  content: {
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
});

// ---------------------------------------------------------------------------
// Pantallas por componente
// ---------------------------------------------------------------------------

const TypographyPlayground = () => {
  const { colors } = useTheme();
  return (
    <>
      <Section title="Headings">
        <Heading size="xl">Heading XL</Heading>
        <Heading size="lg">Heading LG</Heading>
        <Heading size="md">Heading MD</Heading>
        <Heading size="sm">Heading SM</Heading>
      </Section>
      <Section title="Body">
        <Body size="lg">Body LG — Texto principal</Body>
        <Body size="md">Body MD — Texto secundario</Body>
        <Body size="sm">Body SM — Texto pequeño</Body>
      </Section>
      <Section title="Labels y Caption">
        <Label size="lg">Label LG</Label>
        <Label size="md">Label MD</Label>
        <Label size="sm">Label SM</Label>
        <Caption>Caption — texto muy pequeño</Caption>
      </Section>
      <Section title="Pokémon específicos">
        <PokemonNumber>#0001</PokemonNumber>
        <PokemonName>Bulbasaur</PokemonName>
      </Section>
      <Section title="Colores">
        <Typography variant="bodyLG" color="textPrimary">textPrimary</Typography>
        <Typography variant="bodyLG" color="textSecondary">textSecondary</Typography>
        <Typography variant="bodyLG" color="textMuted">textMuted</Typography>
        <Typography variant="bodyLG" color="error">error</Typography>
        <Typography variant="bodyLG" color="success">success</Typography>
      </Section>
    </>
  );
};

const ButtonPlayground = () => {
  const [loading, setLoading] = useState(false);

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <Section title="Variantes">
        <Button label="Primary" variant="primary" onPress={() => {}} />
        <Button label="Secondary" variant="secondary" onPress={() => {}} />
        <Button label="Ghost" variant="ghost" onPress={() => {}} />
        <Button label="Danger" variant="danger" onPress={() => {}} />
      </Section>
      <Section title="Tamaños">
        <Button label="Small" size="sm" onPress={() => {}} />
        <Button label="Medium" size="md" onPress={() => {}} />
        <Button label="Large" size="lg" onPress={() => {}} />
      </Section>
      <Section title="Estados">
        <Button label="Disabled" disabled onPress={() => {}} />
        <Button
          label={loading ? 'Cargando...' : 'Probar Loading'}
          loading={loading}
          onPress={handleLoading}
        />
        <Button label="Full Width" fullWidth onPress={() => {}} />
      </Section>
    </>
  );
};

const InputPlayground = () => {
  const [value, setValue] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <>
      <Section title="Default">
        <Input
          label="Campo de texto"
          placeholder="Escribe algo..."
          value={value}
          onChangeText={setValue}
          testID="playground-input"
        />
      </Section>
      <Section title="Con error">
        <Input
          label="Email"
          placeholder="ash@pokemon.com"
          value={email}
          onChangeText={setEmail}
          error="El correo no es válido"
          keyboardType="email-address"
          testID="playground-input-error"
        />
      </Section>
      <Section title="Con hint">
        <Input
          label="Usuario"
          placeholder="ash_ketchum"
          value={value}
          onChangeText={setValue}
          hint="Entre 3 y 20 caracteres"
          testID="playground-input-hint"
        />
      </Section>
      <Section title="Password toggle">
        <Input
          label="Contraseña"
          value={pass}
          onChangeText={setPass}
          showPasswordToggle
          testID="playground-input-pass"
        />
      </Section>
      <Section title="Disabled">
        <Input
          label="Campo deshabilitado"
          value="No editable"
          disabled
          testID="playground-input-disabled"
        />
      </Section>
    </>
  );
};

const BadgePlayground = () => (
  <>
    <Section title="Variantes semánticas">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
        <Badge label="Neutral" variant="neutral" />
        <Badge label="Success" variant="success" />
        <Badge label="Warning" variant="warning" />
        <Badge label="Error" variant="error" />
        <Badge label="Info" variant="info" />
      </View>
    </Section>
    <Section title="Appearances">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
        <Badge label="Solid" variant="success" appearance="solid" />
        <Badge label="Outline" variant="success" appearance="outline" />
        <Badge label="Subtle" variant="success" appearance="subtle" />
      </View>
    </Section>
    <Section title="Tamaños">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
        <Badge label="SM" variant="info" size="sm" />
        <Badge label="MD" variant="info" size="md" />
        <Badge label="LG" variant="info" size="lg" />
      </View>
    </Section>
    <Section title="TypeBadge — 18 tipos Pokémon">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
        {(['fire','water','grass','electric','psychic','ice',
          'dragon','dark','fairy','normal','fighting','flying',
          'poison','ground','rock','bug','ghost','steel'] as PokemonType[]).map((type) => (
          <TypeBadge key={type} type={type} size="sm" />
        ))}
      </View>
    </Section>
  </>
);

const CardPlayground = () => {
  const { colors } = useTheme();
  return (
    <>
      <Section title="Variantes">
        <Card variant="elevated" padding={spacing.sm}>
          <Body>Card Elevated</Body>
        </Card>
        <Card variant="outlined" padding={spacing.sm}>
          <Body>Card Outlined</Body>
        </Card>
        <Card variant="flat" padding={spacing.sm}>
          <Body>Card Flat</Body>
        </Card>
      </Section>
      <Section title="Presionable">
        <Card
          variant="elevated"
          onPress={() => {}}
          padding={spacing.sm}
          accessibilityLabel="Card presionable"
        >
          <Body>Tap aquí — Card presionable</Body>
        </Card>
      </Section>
      <Section title="Composición Header + Body + Footer">
        <Card variant="elevated">
          <Card.Header>
            <Heading size="sm">Encabezado</Heading>
          </Card.Header>
          <Card.Body>
            <Body>Contenido principal de la card</Body>
          </Card.Body>
          <Card.Footer>
            <Caption>Pie de la card</Caption>
          </Card.Footer>
        </Card>
      </Section>
    </>
  );
};

const SkeletonPlayground = () => (
  <>
    <Section title="Skeleton base — formas">
      <Skeleton width="100%" height={16} testID="sk-line" />
      <Skeleton width="60%" height={16} testID="sk-line-short" />
      <Skeleton width={80} height={80} radius={9999} testID="sk-circle" />
      <Skeleton width="100%" height={120} radius={8} testID="sk-block" />
    </Section>
    <Section title="PokemonCardSkeleton">
      <PokemonCardSkeleton testID="sk-card" />
    </Section>
    <Section title="PokemonListSkeleton (3 cards)">
      <PokemonListSkeleton count={3} testID="sk-list" />
    </Section>
  </>
);

// ---------------------------------------------------------------------------
// Mapa de componente → pantalla
// ---------------------------------------------------------------------------

const COMPONENT_SCREENS: Record<string, React.FC> = {
  Typography: TypographyPlayground,
  Button: ButtonPlayground,
  Input: InputPlayground,
  Badge: BadgePlayground,
  Card: CardPlayground,
  Skeleton: SkeletonPlayground,
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export const ComponentDetailScreen: React.FC<Props> = ({ route }) => {
  const { component } = route.params;
  const { colors } = useTheme();
  const ComponentScreen = COMPONENT_SCREENS[component];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {ComponentScreen ? (
          <ComponentScreen />
        ) : (
          <View style={styles.notFound}>
            <Text style={[textStyles.headingSM, { color: colors.textMuted }]}>
              Componente no encontrado
            </Text>
          </View>
        )}
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
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
});

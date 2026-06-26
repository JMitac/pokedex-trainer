# Typography — Componente de Texto Nativo

> **Ubicación:** `src/ui/components/Typography/`
> **Capa:** UI / Catálogo de componentes nativos
> **Depende de:** `@/ui/tokens` (colors, textStyles)

---

## ¿Por qué existe este componente?

React Native provee un componente `<Text>` primitivo que funciona, pero no garantiza nada: cualquier desarrollador puede escribir `fontSize: 15`, `color: '#333'`, o `fontWeight: '600'` directamente en cualquier pantalla. Con el tiempo, la aplicación acumula decenas de variaciones tipográficas inconsistentes que son imposibles de mantener y actualizar.

`Typography` resuelve esto siendo la **única forma de renderizar texto en la aplicación**. Encapsula el sistema de tokens de tipografía y color, expone una API clara con props tipadas, y garantiza que cada texto de la app comparte las mismas decisiones de diseño.

### El problema que evita

```tsx
// ❌ Sin Typography — decisiones aisladas, imposibles de mantener
<Text style={{ fontSize: 16, fontWeight: '600', color: '#1A202C' }}>
  Bulbasaur
</Text>

// ✅ Con Typography — decisión centralizada, actualizable desde tokens
<PokemonName>Bulbasaur</PokemonName>
```

Si mañana el equipo de diseño decide que los nombres de Pokémon deben ser `fontSize: 18`, se cambia un valor en `typography.ts` y se actualiza en toda la aplicación automáticamente.

---

## API del componente

### `<Typography>` — Componente base

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `TextStyleToken` | `'bodyLG'` | Estilo tipográfico del sistema de tokens |
| `color` | `ColorToken` | `'textPrimary'` | Color del sistema de tokens |
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` | `'left'` | Alineación del texto |
| `numberOfLines` | `number` | `undefined` | Trunca con "..." después de N líneas |
| `strikethrough` | `boolean` | `false` | Texto tachado |
| `underline` | `boolean` | `false` | Texto subrayado |
| `uppercase` | `boolean` | `false` | Convierte a mayúsculas |
| `selectable` | `boolean` | `false` | Permite selección con long press |
| `onPress` | `() => void` | — | Callback de presión |
| `accessibilityLabel` | `string` | — | Etiqueta para lectores de pantalla |
| `accessibilityRole` | `string` | `'text'` | Rol de accesibilidad |
| `testID` | `string` | — | ID para pruebas automatizadas |
| `style` | `StyleProp<TextStyle>` | — | Estilos adicionales (usar con moderación) |
| `children` | `React.ReactNode` | — | Contenido de texto |

---

## Variantes disponibles

Las variantes mapean directamente a los `textStyles` del sistema de tokens:

### Títulos (Headings)
```tsx
<Typography variant="headingXL">Título muy grande — 28px bold</Typography>
<Typography variant="headingLG">Título de pantalla — 24px bold</Typography>
<Typography variant="headingMD">Título de sección — 20px semibold</Typography>
<Typography variant="headingSM">Subtítulo — 18px semibold</Typography>
```

### Cuerpo (Body)
```tsx
<Typography variant="bodyLG">Texto principal — 16px regular</Typography>
<Typography variant="bodyMD">Texto secundario — 14px regular</Typography>
<Typography variant="bodySM">Texto pequeño — 12px regular</Typography>
```

### Labels
```tsx
<Typography variant="labelLG">Label grande — 16px medium</Typography>
<Typography variant="labelMD">Label estándar — 14px medium</Typography>
<Typography variant="labelSM">Label pequeño — 12px medium</Typography>
```

### Específicos del dominio (Pokédex)
```tsx
<Typography variant="pokemonName">#0001 — Bulbasaur</Typography>
<Typography variant="pokemonNumber">#0001</Typography>
<Typography variant="statValue">90</Typography>
<Typography variant="caption">Texto de ayuda muy pequeño</Typography>
<Typography variant="mono">Texto monoespaciado</Typography>
```

---

## Sub-componentes de conveniencia

Para los casos más frecuentes existen atajos semánticos que hacen el código más legible:

### `<Heading>`
```tsx
import { Heading } from '@/ui/components/Typography';

// Tamaños disponibles: 'sm' | 'md' | 'lg' (default) | 'xl'
<Heading>Título principal</Heading>
<Heading size="xl">Título muy grande</Heading>
<Heading size="sm">Título pequeño</Heading>

// Aplica automáticamente accessibilityRole="header"
// para que los lectores de pantalla lo anuncien como encabezado
```

### `<Body>`
```tsx
import { Body } from '@/ui/components/Typography';

// Tamaños disponibles: 'sm' | 'md' | 'lg' (default)
<Body>Párrafo de texto normal</Body>
<Body size="sm">Texto más pequeño</Body>
```

### `<Label>`
```tsx
import { Label } from '@/ui/components/Typography';

// Para labels de campos en formularios del Trainer
<Label>Nombre completo *</Label>
<Label size="sm">Texto de ayuda del campo</Label>
```

### `<Caption>`
```tsx
import { Caption } from '@/ui/components/Typography';

// Usa color textSecondary automáticamente
<Caption>Última actualización: hace 2 minutos</Caption>
```

### `<PokemonNumber>` y `<PokemonName>`
```tsx
import { PokemonNumber, PokemonName } from '@/ui/components/Typography';

// Para la card de Pokémon en la lista
<PokemonNumber>#0001</PokemonNumber>
<PokemonName>Bulbasaur</PokemonName>
```

---

## Ejemplos de uso en el proyecto

### En `PokemonCard.tsx`
```tsx
import { PokemonNumber, PokemonName } from '@/ui/components/Typography';

const PokemonCard = ({ pokemon }) => (
  <View style={styles.card}>
    <PokemonNumber>#{String(pokemon.id).padStart(4, '0')}</PokemonNumber>
    <PokemonName numberOfLines={1}>{pokemon.name}</PokemonName>
  </View>
);
```

### En `PokemonDetailScreen.tsx`
```tsx
import { Heading, Body, Typography } from '@/ui/components/Typography';

const PokemonDetailScreen = ({ pokemon }) => (
  <View>
    <Heading size="xl" align="center">
      {pokemon.name}
    </Heading>
    <Body color="textSecondary">
      Altura: {pokemon.height / 10}m · Peso: {pokemon.weight / 10}kg
    </Body>
    <Typography variant="statValue" color="primary">
      {pokemon.stats[0].base_stat}
    </Typography>
  </View>
);
```

### En `Step1PersonalData.tsx` (formulario del Trainer)
```tsx
import { Heading, Label, Caption } from '@/ui/components/Typography';

const Step1PersonalData = () => (
  <View>
    <Heading size="md">Datos Personales</Heading>
    <Label>Nombre completo *</Label>
    {/* ... Input ... */}
    <Caption>Este nombre aparecerá en tu carnet de entrenador</Caption>
  </View>
);
```

---

## Accesibilidad

El componente fue diseñado con accesibilidad mobile como prioridad:

- **`accessibilityRole="header"`** se aplica automáticamente en `<Heading>` para que VoiceOver (iOS) y TalkBack (Android) anuncien los títulos correctamente en la navegación por pantalla.
- **`accessibilityLabel`** permite sobrescribir el texto visible cuando el contexto del lector de pantalla lo requiere.
- **`numberOfLines`** con texto truncado: siempre proporcionar `accessibilityLabel` con el texto completo cuando se use truncamiento, para que los usuarios de lectores de pantalla escuchen el contenido completo.

```tsx
// ✅ Buena práctica con truncamiento
<PokemonName
  numberOfLines={1}
  accessibilityLabel={`Pokémon número 1: Bulbasaur`}
>
  Bulbasaur
</PokemonName>
```

---

## Reglas del equipo

1. **Prohibido usar `<Text>` de React Native directamente** en pantallas o features. Solo se permite dentro de `src/ui/components/`.
2. **No hardcodear colores ni tamaños de fuente** en el prop `style`. Si el diseño necesita algo que no existe, proponer un nuevo token.
3. **Siempre usar sub-componentes semánticos** cuando existan: `<Heading>` en lugar de `<Typography variant="headingLG">`, `<Body>` en lugar de `<Typography variant="bodyLG">`.
4. **Agregar `testID`** en cualquier texto que sea verificado por pruebas automatizadas o E2E.

---

## Testing

Las pruebas se encuentran en `Typography.test.tsx` y cubren:

- Renderizado básico de texto
- Todas las variantes tipográficas disponibles
- Todas las alineaciones
- Decoraciones: `strikethrough`, `underline`, `uppercase`
- Props de accesibilidad: `accessibilityLabel`, `accessibilityRole`, `numberOfLines`, `selectable`
- Sub-componentes: `Heading`, `Body`, `Label`, `Caption`, `PokemonNumber`, `PokemonName`

Para correr las pruebas:
```bash
npx jest src/ui/components/Typography
```

---

## Próximo componente

Con `Typography` en su lugar, el siguiente componente del catálogo es **`Button`**, que lo usa internamente para el texto de las acciones.

# Card — Componente Contenedor Nativo

> **Ubicación:** `src/ui/components/Card/`
> **Capa:** UI / Catálogo de componentes nativos
> **Depende de:** `@/ui/tokens`

---

## ¿Por qué existe este componente?

En una aplicación con listas de Pokémon y formularios multi-paso, los contenedores con sombra, borde y radio de borde se repiten constantemente. Sin un componente centralizado, cada pantalla define sus propios estilos de contenedor, generando inconsistencias en sombras, radios y colores de borde entre plataformas.

`Card` resuelve esto siendo el único contenedor con estilos decorativos en la aplicación. Maneja las diferencias entre iOS (shadow props) y Android (elevation) automáticamente, expone una API de composición clara con `Card.Header`, `Card.Body` y `Card.Footer`, y soporta interacción táctil completa cuando se necesita.

---

## API

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `'elevated' \| 'outlined' \| 'flat'` | `'elevated'` | Estilo visual del contenedor |
| `onPress` | `() => void` | — | Hace la card presionable |
| `disabled` | `boolean` | `false` | Deshabilita la interacción |
| `backgroundColor` | `string` | `colors.surface` | Color de fondo |
| `padding` | `number` | `spacing.md` (16px) | Padding interno |
| `style` | `StyleProp<ViewStyle>` | — | Estilos adicionales |
| `children` | `React.ReactNode` | — | Contenido (**requerido**) |
| `testID` | `string` | — | ID para pruebas |
| `accessibilityLabel` | `string` | — | Etiqueta para lectores de pantalla |
| `accessibilityHint` | `string` | — | Hint de accesibilidad |

---

## Variantes

### `elevated` — Con sombra (default)
Sombra nativa por plataforma. iOS usa `shadow*` props, Android usa `elevation`. El resultado visual es consistente en ambas plataformas.

```tsx
<Card variant="elevated">
  <Text>Card con sombra</Text>
</Card>
```

### `outlined` — Con borde
Sin sombra, borde de `1px` en `colors.border`. Para listas densas donde la sombra acumula demasiado peso visual.

```tsx
<Card variant="outlined">
  <Text>Card con borde</Text>
</Card>
```

### `flat` — Sin decoración
Sin sombra ni borde. Para contenedores que necesitan fondo blanco pero sin separación visual del fondo.

```tsx
<Card variant="flat" backgroundColor={colors.surfaceMuted}>
  <Text>Card plana</Text>
</Card>
```

---

## Composición con sub-componentes

```tsx
import { Card } from '@/ui/components/Card';

<Card variant="elevated" testID="pokemon-card">
  <Card.Header testID="pokemon-card-header">
    <PokemonNumber>#0001</PokemonNumber>
    <PokemonName>Bulbasaur</PokemonName>
  </Card.Header>

  <Card.Body testID="pokemon-card-body">
    <Image source={{ uri: sprite }} />
    <View style={styles.types}>
      <TypeBadge type="grass" />
      <TypeBadge type="poison" />
    </View>
  </Card.Body>

  <Card.Footer testID="pokemon-card-footer">
    <Caption>Toca para ver detalles</Caption>
  </Card.Footer>
</Card>
```

`Card.Header` agrega un separador inferior. `Card.Footer` agrega un separador superior. `Card.Body` es el área de contenido principal sin separadores.

---

## Card presionable — Para la lista de Pokémon

Cuando se provee `onPress`, el contenedor cambia internamente de `View` a `Pressable` con feedback táctil (escala y opacidad).

```tsx
import { Card } from '@/ui/components/Card';

const PokemonCard = ({ pokemon, onPress }) => (
  <Card
    variant="elevated"
    onPress={() => onPress(pokemon.id)}
    accessibilityLabel={`Pokémon ${pokemon.name}`}
    accessibilityHint="Toca para ver el detalle completo"
    testID={`pokemon-card-${pokemon.id}`}
  >
    <Card.Body>
      <Image source={{ uri: pokemon.sprites.front_default }} />
      <PokemonNumber>#{String(pokemon.id).padStart(4, '0')}</PokemonNumber>
      <PokemonName>{pokemon.name}</PokemonName>
      <View style={styles.types}>
        {pokemon.types.map(({ type }) => (
          <TypeBadge key={type.name} type={type.name} size="sm" />
        ))}
      </View>
    </Card.Body>
  </Card>
);
```

---

## Uso en la pantalla de Trainer

```tsx
import { Card } from '@/ui/components/Card';

// TrainerCardScreen.tsx — el carnet del entrenador
const TrainerCardScreen = () => {
  const { fullName, age, email, district, favoritePokemonType } = useTrainerStore();

  return (
    <Card
      variant="elevated"
      testID="trainer-card"
      style={styles.trainerCard}
    >
      <Card.Header testID="trainer-card-header">
        <Heading size="md" align="center">Carnet de Entrenador</Heading>
      </Card.Header>

      <Card.Body testID="trainer-card-body">
        <Label>Nombre</Label>
        <Body>{fullName}</Body>

        <Label>Edad</Label>
        <Body>{age} años</Body>

        <Label>Correo</Label>
        <Body>{email}</Body>

        <Label>Distrito</Label>
        <Body>{district}</Body>

        <Label>Tipo favorito</Label>
        <TypeBadge type={favoritePokemonType} size="lg" />
      </Card.Body>
    </Card>
  );
};
```

---

## Diferencias entre plataformas

El componente maneja automáticamente las diferencias nativas:

**iOS — Shadow props:**
```
shadowColor: gray900
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.08
shadowRadius: 8
```

**Android — Elevation:**
```
elevation: 2
overflow: 'hidden'  ← necesario para que borderRadius funcione con elevation
```

En iOS `overflow: 'visible'` permite que la sombra se vea fuera del contenedor. En Android `overflow: 'hidden'` es necesario para que el `borderRadius` recorte correctamente el contenido con `elevation`.

---

## TestIDs

Con `testID="card"`:

| TestID | Elemento |
|---|---|
| `card` | Contenedor raíz (`View` o `Pressable`) |

Con sub-componentes (testID manual):

```tsx
<Card.Header testID="card-header">...</Card.Header>
<Card.Body testID="card-body">...</Card.Body>
<Card.Footer testID="card-footer">...</Card.Footer>
```

---

## Reglas del equipo

1. **Prohibido usar `View` con `shadowColor`, `elevation`, `borderRadius` y `borderWidth` simultáneamente** fuera de `src/ui/components/`. Siempre usar `<Card>`.
2. **No mezclar `Card.Header`/`Card.Footer` con contenido directo** — elegir una sola estructura por card.
3. **Siempre pasar `accessibilityLabel` y `accessibilityHint`** cuando la card es presionable.
4. **Usar `padding={0}` y manejar el padding internamente** en `Card.Body` cuando el contenido tiene imagen que debe tocar los bordes (ej: banner de Pokémon).

---

## Testing

Las pruebas en `Card.test.tsx` cubren **25 casos**:

- Renderizado básico y children
- Las 3 variantes
- Card presionable vs estática (`accessibilityRole`)
- Interacciones — `onPress`, `disabled`, sin handler
- Accesibilidad — `accessibilityLabel`, `accessibilityHint`, `accessibilityState`
- Sub-componentes — `Header`, `Body`, `Footer` individuales y en composición
- Props de estilo — `backgroundColor`, `padding`

```bash
npx jest src/ui/components/Card --watchAll=false
```

---

## Próximo componente

Con `Card` en su lugar, el último componente del catálogo es **`Skeleton`** — el estado de carga animado que se muestra mientras React Query trae los datos de la PokéAPI.

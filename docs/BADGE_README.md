# Badge — Componente de Etiqueta Nativo

> **Ubicación:** `src/ui/components/Badge/`
> **Capa:** UI / Catálogo de componentes nativos
> **Depende de:** `@/ui/tokens`, `@/ui/components/Typography`

---

## ¿Por qué existe este componente?

Los badges son elementos visuales que comunican categorías, estados o clasificaciones de forma compacta. En el contexto del Pokédex, los tipos de Pokémon (Fuego, Agua, Planta, etc.) son el caso de uso principal — cada tipo tiene un color oficial que debe ser consistente en toda la aplicación.

Sin un componente centralizado, cada desarrollador buscaría el color del tipo manualmente, lo hardcodearía en el componente de turno, y la aplicación terminaría con inconsistencias visuales difíciles de rastrear.

`Badge` resuelve esto siendo la fuente única de renderizado de etiquetas. Consume los colores directamente de `colors.pokemonTypes` en los tokens, garantizando que cambiar el color de un tipo en un solo archivo se propague a toda la aplicación.

---

## Componentes exportados

### `<Badge>` — Componente base
Etiqueta genérica para cualquier tipo de clasificación visual.

### `<TypeBadge>` — Sub-componente especializado
Atajo semántico para los tipos de Pokémon. El más usado en el proyecto.

---

## API — `Badge`

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | — | Texto del badge (**requerido**) |
| `variant` | `'neutral' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'pokemon'` | `'neutral'` | Variante semántica |
| `pokemonType` | `PokemonType` | — | Tipo Pokémon (solo con `variant="pokemon"`) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del badge |
| `appearance` | `'solid' \| 'outline' \| 'subtle'` | `'solid'` | Estilo visual |
| `style` | `StyleProp<ViewStyle>` | — | Estilos adicionales |
| `testID` | `string` | — | ID para pruebas |

## API — `TypeBadge`

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `type` | `PokemonType` | — | Tipo de Pokémon (**requerido**) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del badge |
| `style` | `StyleProp<ViewStyle>` | — | Estilos adicionales |
| `testID` | `string` | `badge-type-{type}` | ID para pruebas |

---

## Variantes semánticas

```tsx
// neutral — etiquetas genéricas, categorías sin carga semántica
<Badge label="Normal" variant="neutral" />

// success — estados positivos, confirmaciones
<Badge label="Registrado" variant="success" />

// warning — advertencias, estados intermedios
<Badge label="Pendiente" variant="warning" />

// error — errores, estados críticos
<Badge label="Inválido" variant="error" />

// info — información contextual
<Badge label="Nuevo" variant="info" />

// pokemon — tipos de Pokémon con color oficial
<Badge label="fire" variant="pokemon" pokemonType="fire" />
```

---

## Appearances (estilos visuales)

Cada variante soporta tres appearances:

```tsx
// solid — fondo de color sólido, texto blanco (default)
<Badge label="Fuego" variant="success" appearance="solid" />

// outline — solo borde, texto del color del variant
<Badge label="Fuego" variant="success" appearance="outline" />

// subtle — fondo muy suave (13% de opacidad), texto del color del variant
<Badge label="Fuego" variant="success" appearance="subtle" />
```

---

## TypeBadge — Para los tipos Pokémon

```tsx
import { TypeBadge } from '@/ui/components/Badge';

// Los 18 tipos disponibles
<TypeBadge type="fire" />      // 🟠 Naranja
<TypeBadge type="water" />     // 🔵 Azul
<TypeBadge type="grass" />     // 🟢 Verde
<TypeBadge type="electric" />  // 🟡 Amarillo
<TypeBadge type="psychic" />   // 🩷 Rosa
<TypeBadge type="ice" />       // 🩵 Celeste
<TypeBadge type="dragon" />    // 🟣 Púrpura
<TypeBadge type="dark" />      // 🟤 Azul oscuro
<TypeBadge type="fairy" />     // 🌸 Rosa claro
<TypeBadge type="normal" />    // ⚪ Gris
<TypeBadge type="fighting" />  // 🟣 Violeta
<TypeBadge type="flying" />    // 🩵 Celeste claro
<TypeBadge type="poison" />    // 🟣 Morado
<TypeBadge type="ground" />    // 🟤 Tierra
<TypeBadge type="rock" />      // 🟤 Marrón
<TypeBadge type="bug" />       // 🟢 Verde oliva
<TypeBadge type="ghost" />     // 🟣 Índigo
<TypeBadge type="steel" />     // ⚪ Plateado

// Con tamaños
<TypeBadge type="fire" size="sm" />
<TypeBadge type="fire" size="md" />
<TypeBadge type="fire" size="lg" />
```

---

## Uso en el proyecto

### `PokemonCard.tsx` — Tipos en la lista
```tsx
import { TypeBadge } from '@/ui/components/Badge';

const PokemonCard = ({ pokemon }) => (
  <View style={styles.card}>
    <Image source={{ uri: pokemon.sprites.front_default }} />
    <PokemonName>{pokemon.name}</PokemonName>

    {/* Fila de tipos — un Pokémon puede tener 1 o 2 tipos */}
    <View style={styles.types}>
      {pokemon.types.map(({ type }) => (
        <TypeBadge
          key={type.name}
          type={type.name as PokemonType}
          size="sm"
        />
      ))}
    </View>
  </View>
);
```

### `PokemonDetailScreen.tsx` — Tipos en el detalle
```tsx
<View style={styles.typesRow}>
  {pokemon.types.map(({ type }) => (
    <TypeBadge
      key={type.name}
      type={type.name as PokemonType}
      size="lg"
      testID={`detail-type-${type.name}`}
    />
  ))}
</View>
```

### `TrainerCardScreen.tsx` — Tipo favorito del entrenador
```tsx
import { Badge } from '@/ui/components/Badge';

// El tipo favorito viene del store de Zustand
const { favoritePokemonType } = useTrainerStore();

<Badge
  label={favoritePokemonType}
  variant="pokemon"
  pokemonType={favoritePokemonType as PokemonType}
  size="lg"
  testID="trainer-favorite-type"
/>
```

---

## TestIDs

Con `testID="badge"`:

| TestID | Elemento |
|---|---|
| `badge` | Contenedor `View` raíz |
| `badge-label` | Texto del label |

Con `TypeBadge` sin testID personalizado:

| TestID | Descripción |
|---|---|
| `badge-type-fire` | TypeBadge de tipo fire |
| `badge-type-water` | TypeBadge de tipo water |
| `badge-type-{type}` | Patrón general |

---

## Accesibilidad

- `accessibilityLabel` se aplica automáticamente con el valor del `label`
- El badge es un elemento visual no interactivo — no requiere `accessibilityRole`
- Si el badge forma parte de información crítica (ej: el tipo de un Pokémon en detalle), considera envolver la sección con un `accessibilityLabel` más descriptivo en el contenedor padre

```tsx
// ✅ Buena práctica — contexto descriptivo en el padre
<View accessibilityLabel={`Tipos: ${types.join(' y ')}`}>
  {types.map(type => <TypeBadge key={type} type={type} />)}
</View>
```

---

## Reglas del equipo

1. **Siempre usar `TypeBadge`** para tipos de Pokémon en lugar de `Badge` con `variant="pokemon"` — es más semántico y legible.
2. **Nunca hardcodear colores de tipos Pokémon** — siempre vienen de `colors.pokemonTypes` a través del componente.
3. **Pasar `testID`** en badges verificados por pruebas o flujos E2E.

---

## Testing

Las pruebas en `Badge.test.tsx` cubren **50+ casos**:

- Renderizado básico, testIDs y accesibilidad
- Las 6 variantes semánticas
- Los 3 tamaños
- Los 3 appearances
- Los 18 tipos Pokémon con `variant="pokemon"`
- `TypeBadge` — todos los tipos, tamaños, testID automático y personalizado
- Combinaciones de variante + appearance + tamaño

```bash
npx jest src/ui/components/Badge --watchAll=false
```

---

## Próximo componente

Con `Badge` en su lugar, el siguiente es **`Card`** — el contenedor base para las cards de Pokémon en la lista y el detalle, que usa `Typography`, `Badge` y los tokens de espaciado.

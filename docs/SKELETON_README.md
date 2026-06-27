# Skeleton — Componente de Estado de Carga Nativo

> **Ubicación:** `src/ui/components/Skeleton/`
> **Capa:** UI / Catálogo de componentes nativos
> **Depende de:** `@/ui/tokens`

---

## ¿Por qué existe este componente?

Cuando React Query hace una petición a la PokéAPI, hay un tiempo de espera antes de que los datos lleguen. La forma en que una aplicación maneja ese tiempo define directamente la percepción de calidad del usuario.

Hay dos enfoques:

**Spinner genérico** — Un `ActivityIndicator` en el centro de la pantalla. El usuario ve una pantalla vacía con un círculo girando. No sabe qué va a aparecer ni cuánto esperar.

**Skeleton loading** — Bloques animados que replican exactamente la forma del contenido que va a aparecer. El usuario ve la estructura de la pantalla inmediatamente, y los datos "llenan" esa estructura cuando llegan.

El skeleton loading reduce la percepción de tiempo de espera porque el cerebro procesa el layout antes de que los datos lleguen. Es el estándar en apps como Twitter, LinkedIn, YouTube y Pokémon GO.

`Skeleton` implementa este patrón con animación shimmer nativa (usando `Animated.loop` de React Native, sin librerías externas) y sub-componentes especializados para cada pantalla del proyecto.

---

## Componentes exportados

| Componente | Descripción |
|---|---|
| `Skeleton` | Bloque base animado con efecto shimmer |
| `PokemonCardSkeleton` | Réplica de `PokemonCard` en estado de carga |
| `PokemonListSkeleton` | Lista de `PokemonCardSkeleton` para la pantalla de lista |
| `PokemonDetailSkeleton` | Skeleton para la pantalla de detalle completa |

---

## API — `Skeleton` base

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `width` | `number \| string` | `'100%'` | Ancho del bloque |
| `height` | `number` | `16` | Alto del bloque |
| `radius` | `number` | `borderRadius.sm` | Radio de borde |
| `style` | `StyleProp<ViewStyle>` | — | Estilos adicionales |
| `testID` | `string` | — | ID para pruebas |

---

## Animación shimmer

El efecto shimmer es una animación de opacidad que oscila entre `0.4` y `0.9` en un loop continuo de 1 segundo por ciclo. Usa `useNativeDriver: true` para que la animación corra en el hilo nativo de la UI — esto garantiza 60fps sin bloquear el hilo de JavaScript.

```
Opacidad 0.4 → 0.9 → 0.4 → 0.9 → ... (loop infinito)
Duración:  1s    1s    1s    1s
```

El `useEffect` limpia la animación al desmontar el componente para evitar memory leaks.

---

## Uso en el proyecto

### `PokemonListScreen.tsx` — Estado de carga de la lista

```tsx
import { PokemonListSkeleton } from '@/ui/components/Skeleton';

const PokemonListScreen = () => {
  const { data, isLoading, isError } = usePokemonList();

  // Estado de carga — mostrar skeleton
  if (isLoading) {
    return <PokemonListSkeleton count={10} />;
  }

  // Estado de error
  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  // Estado de éxito
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <PokemonCard pokemon={item} />}
    />
  );
};
```

### `PokemonDetailScreen.tsx` — Estado de carga del detalle

```tsx
import { PokemonDetailSkeleton } from '@/ui/components/Skeleton';

const PokemonDetailScreen = ({ route }) => {
  const { id } = route.params;
  const { data, isLoading } = usePokemonDetail(id);

  if (isLoading) {
    return <PokemonDetailSkeleton testID="detail-skeleton" />;
  }

  return (
    <ScrollView>
      <Image source={{ uri: data.sprites.other['official-artwork'].front_default }} />
      <Heading>{data.name}</Heading>
      {data.types.map(({ type }) => (
        <TypeBadge key={type.name} type={type.name} />
      ))}
      {/* stats... */}
    </ScrollView>
  );
};
```

### Skeleton personalizado para otros componentes

```tsx
import { Skeleton } from '@/ui/components/Skeleton';

// Texto de una línea
<Skeleton width="60%" height={14} />

// Texto de dos líneas
<Skeleton width="100%" height={14} />
<Skeleton width="80%" height={14} style={{ marginTop: 6 }} />

// Avatar circular
<Skeleton width={48} height={48} radius={9999} />

// Imagen rectangular
<Skeleton width="100%" height={200} radius={12} />

// Badge pill
<Skeleton width={64} height={24} radius={9999} />
```

---

## Por qué `Animated` nativo en lugar de librerías

En React Native hay dos formas de animar:

**JavaScript-driven (NO usar):** La animación pasa por el bridge JS→Native en cada frame. En dispositivos lentos o cuando el JS thread está ocupado (cargando datos de la API), la animación se congela exactamente cuando más se necesita — durante la carga.

**Native-driven con `useNativeDriver: true` (lo que usamos):** La animación se serializa al hilo nativo una sola vez y corre ahí independientemente del JS thread. Garantiza 60fps incluso mientras React Query está procesando la respuesta de la API.

La opción de opacidad fue elegida específicamente porque `opacity` es una de las propiedades que soporta `useNativeDriver`. Las propiedades como `width`, `height` o `backgroundColor` NO soportan driver nativo.

---

## TestIDs automáticos

### `PokemonCardSkeleton` con `testID="card"`

| TestID | Elemento |
|---|---|
| `card` | Contenedor de la card |
| `card-sprite` | Skeleton del sprite |
| `card-number` | Skeleton del número |
| `card-name` | Skeleton del nombre |
| `card-type1` | Skeleton del primer tipo |
| `card-type2` | Skeleton del segundo tipo |

### `PokemonListSkeleton`

| TestID | Elemento |
|---|---|
| `skeleton-pokemon-list` | Contenedor de la lista |
| `skeleton-pokemon-card-0` | Primera card |
| `skeleton-pokemon-card-N` | Card N (0-indexed) |

### `PokemonDetailSkeleton`

| TestID | Elemento |
|---|---|
| `skeleton-pokemon-detail` | Contenedor |
| `skeleton-detail-sprite` | Sprite grande |
| `skeleton-detail-number` | Número |
| `skeleton-detail-name` | Nombre |
| `skeleton-detail-type1/2` | Tipos |
| `skeleton-detail-stat-label-N` | Label de stat N |
| `skeleton-detail-stat-bar-N` | Barra de stat N |

---

## Reglas del equipo

1. **Nunca usar `ActivityIndicator` para listas o pantallas completas.** Solo para acciones puntuales dentro de botones (`Button` ya lo maneja internamente).
2. **Siempre usar el skeleton especializado** que coincide con la pantalla — `PokemonListSkeleton` para la lista, `PokemonDetailSkeleton` para el detalle.
3. **El count de `PokemonListSkeleton`** debe coincidir con el `pageSize` de la paginación de React Query para que la transición de skeleton a contenido real no cambie el alto de la lista.

---

## Testing

Las pruebas en `Skeleton.test.tsx` cubren **35 casos**:

- `Skeleton` base — props de width, height, radius, estilos
- `PokemonCardSkeleton` — todos los elementos internos, testIDs derivados
- `PokemonListSkeleton` — count por defecto (8), count personalizado, límites
- `PokemonDetailSkeleton` — sprite, número, nombre, tipos, 6 filas de stats

```bash
npx jest src/ui/components/Skeleton --watchAll=false
```

---

## Catálogo completo — Estado final

Con `Skeleton` completado, el catálogo nativo está completo:

| Componente | Responsabilidad |
|---|---|
| `Typography` | Todo el texto de la app |
| `Button` | Todas las acciones interactivas |
| `Input` | Todos los campos de formulario |
| `Badge` + `TypeBadge` | Etiquetas y tipos Pokémon |
| `Card` | Contenedores con decoración |
| `Skeleton` | Estados de carga |

El siguiente paso es el barrel export principal en `src/ui/components/index.ts` que centraliza todas las importaciones del catálogo.

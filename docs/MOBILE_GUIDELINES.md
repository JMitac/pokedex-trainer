# Mobile Guidelines — Lineamiento del Equipo React Native

> Propuesta de lineamiento para el equipo mobile.
> Basado en las decisiones de arquitectura del proyecto Pokédex Trainer.

---

## 1. Primitivos nativos — regla fundamental

**Prohibido usar elementos HTML en React Native.**

```tsx
// ❌ Incorrecto
<div style={{ padding: 16 }}>
  <p>Texto</p>
</div>

// ✅ Correcto
<View style={{ padding: 16 }}>
  <Text>Texto</Text>
</View>
```

Más específicamente, en este proyecto:
- Usar `<Typography>` en lugar de `<Text>` directamente
- Usar `<Button>` en lugar de `<Pressable>` para acciones principales
- Usar `<Input>` en lugar de `<TextInput>` directamente
- Usar `<Card>` en lugar de `<View>` con sombra y borde

---

## 2. Tokens de diseño — fuente de verdad única

Ningún valor hardcodeado en componentes.

```tsx
// ❌ Incorrecto
<View style={{ padding: 16, backgroundColor: '#E53E3E' }} />

// ✅ Correcto
import { colors, spacing } from '@/ui/tokens';
<View style={{ padding: spacing.md, backgroundColor: colors.primary }} />
```

Si necesitas un valor que no existe en los tokens, agrégalo ahí primero y documenta por qué.

---

## 3. Estructura de carpetas por feature

Cada feature es autónoma:

```
features/mi-feature/
├── types/       # Modelos de dominio y DTOs
├── schemas/     # Validaciones yup
├── queries/     # Funciones de fetching (sin estado)
├── hooks/       # Custom hooks con React Query / lógica
├── store/       # Zustand store si hay estado global
├── components/  # Componentes específicos de la feature
└── screens/     # Pantallas de la feature
```

---

## 4. Formularios — siempre react-hook-form + yup

```tsx
// Siempre usar Controller
<Controller
  control={control}
  name="email"
  render={({ field: { onChange, onBlur, value, ref } }) => (
    <Input
      ref={ref}
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      error={errors.email?.message}
    />
  )}
/>
```

Nunca manejar el estado del formulario con `useState` directamente en la pantalla.

---

## 5. Naming conventions

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `PokemonCard.tsx` |
| Hooks | camelCase con `use` | `usePokemonList.ts` |
| Stores | camelCase con `Store` | `trainerStore.ts` |
| Schemas | camelCase con `Schema` | `step1Schema` |
| Types | PascalCase con `.types.ts` | `pokemon.types.ts` |
| Tests | mismo nombre + `.test` | `Button.test.tsx` |
| Query keys | objeto factory | `pokemonKeys.detail(id)` |

---

## 6. Testing — cobertura mínima

| Capa | Cobertura mínima |
|---|---|
| Componentes UI | 80% |
| Custom hooks | 80% |
| Schemas de validación | 100% |
| Stores Zustand | 90% |
| Screens | Integration tests |

Correr antes de cada PR:
```bash
npx jest --coverage --watchAll=false
```

---

## 7. Commits — Conventional Commits

```
feat(pokedex): add pokemon search by name
fix(trainer): fix age input restore bug
refactor(ui): extract AgeInput component
test(store): add starterPokemon tests
docs(readme): update installation instructions
```

Formato: `tipo(scope): descripción en minúsculas`

---

## 8. Performance — reglas básicas

- **FlatList siempre sobre ScrollView** para listas largas
- **`useCallback`** en handlers que se pasan como props
- **`useMemo`** en cálculos derivados de listas grandes
- **`React.memo`** en componentes de lista que reciben props estables
- **`useNativeDriver: true`** en animaciones que no usen `width`/`height`
- **Prefetch** de datos antes de navegar con `queryClient.prefetchQuery`

---

## 9. Accesibilidad — requisitos mínimos

Todos los elementos interactivos deben tener:
- `accessibilityLabel` — descripción del elemento
- `accessibilityRole` — tipo de elemento (`button`, `header`, `text`)
- `accessibilityState` — estado actual (`disabled`, `selected`, `busy`)

```tsx
<Pressable
  accessibilityLabel="Ver detalle de Bulbasaur"
  accessibilityRole="button"
  accessibilityHint="Abre la pantalla de detalle del Pokémon"
>
```

---

## 10. Design System — web vs native

**No compartir componentes de UI entre web y native.**

Compartir: `@empresa/tokens` (colores, espaciado, tipografía)
No compartir: componentes React que usen `div`, `span`, o CSS

Ver `docs/TOKENS_README.md` para la arquitectura completa.

# Button — Componente de Acción Nativo

> **Ubicación:** `src/ui/components/Button/`
> **Capa:** UI / Catálogo de componentes nativos
> **Depende de:** `@/ui/tokens`, `@/ui/components/Typography`

---

## ¿Por qué existe este componente?

React Native ofrece `Pressable`, `TouchableOpacity` y `TouchableHighlight` para manejar interacciones táctiles. El problema es que usarlos directamente en pantallas genera inconsistencias: cada desarrollador toma decisiones diferentes sobre el padding, el radio de borde, el feedback visual al presionar, y el manejo de estados como `loading` o `disabled`.

`Button` encapsula todas esas decisiones en un solo lugar. Garantiza que cada acción de la aplicación se vea y se comporte de manera consistente, incluyendo los estados de accesibilidad que los lectores de pantalla de iOS y Android necesitan para funcionar correctamente.

### El problema que evita

```tsx
// ❌ Sin Button — inconsistente, sin estados, sin accesibilidad
<TouchableOpacity
  style={{ backgroundColor: '#E53E3E', padding: 12, borderRadius: 8 }}
  onPress={handleSubmit}
>
  <Text style={{ color: 'white', fontWeight: '600' }}>Confirmar</Text>
</TouchableOpacity>

// ✅ Con Button — consistente, con estados, con accesibilidad completa
<Button
  label="Confirmar"
  onPress={handleSubmit}
  loading={isSubmitting}
  fullWidth
/>
```

---

## API del componente

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | — | Texto del botón (**requerido**) |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del botón |
| `fullWidth` | `boolean` | `false` | Ocupa el 100% del ancho |
| `disabled` | `boolean` | `false` | Deshabilita el botón |
| `loading` | `boolean` | `false` | Muestra spinner, bloquea interacción |
| `leftIcon` | `React.ReactNode` | — | Icono a la izquierda del texto |
| `rightIcon` | `React.ReactNode` | — | Icono a la derecha del texto |
| `onPress` | `() => void` | — | Callback al presionar |
| `style` | `StyleProp<ViewStyle>` | — | Estilos adicionales del contenedor |
| `testID` | `string` | — | ID para pruebas automatizadas |
| `accessibilityLabel` | `string` | `label` | Etiqueta para lectores de pantalla |
| `accessibilityHint` | `string` | — | Describe qué hace el botón |

---

## Variantes

### `primary` — Acción principal
Fondo rojo de marca, texto blanco. Para la CTA más importante de cada pantalla.

```tsx
<Button label="Siguiente paso" variant="primary" onPress={handleNext} />
```

### `secondary` — Acción alternativa
Borde rojo, fondo transparente. Para opciones secundarias junto a un botón primary.

```tsx
<Button label="Ver detalles" variant="secondary" onPress={handleDetails} />
```

### `ghost` — Acción terciaria
Sin borde ni fondo. Para acciones de bajo peso visual como "Cancelar" o "Omitir".

```tsx
<Button label="Cancelar" variant="ghost" onPress={handleCancel} />
```

### `danger` — Acción destructiva
Fondo rojo oscuro. Para acciones irreversibles como eliminar o resetear.

```tsx
<Button label="Eliminar cuenta" variant="danger" onPress={handleDelete} />
```

---

## Tamaños

```tsx
// sm — compacto, para espacios reducidos o acciones secundarias en cards
<Button label="Ver más" size="sm" />

// md — tamaño estándar (default)
<Button label="Confirmar" size="md" />

// lg — prominente, para CTAs principales de pantalla completa
<Button label="Comenzar aventura" size="lg" fullWidth />
```

---

## Estados

### `loading`
Muestra un `ActivityIndicator` y bloquea la interacción. Usar durante operaciones asíncronas para prevenir doble envío.

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  setIsSubmitting(true);
  await saveTrainerData();
  setIsSubmitting(false);
};

<Button
  label="Guardar entrenador"
  loading={isSubmitting}
  onPress={handleSubmit}
  fullWidth
/>
```

### `disabled`
Bloquea la interacción y aplica estilos visuales atenuados. Usar cuando la acción no está disponible aún (ej: formulario con campos inválidos).

```tsx
<Button
  label="Siguiente"
  disabled={!isStepValid}
  onPress={handleNext}
  fullWidth
/>
```

---

## Ejemplos de uso en el proyecto

### En `Step1PersonalData.tsx` — Botón de avance del formulario
```tsx
import { Button } from '@/ui/components/Button';

const Step1PersonalData = () => {
  const { handleSubmit, formState: { isValid } } = useForm();

  return (
    <View style={styles.footer}>
      <Button
        label="Siguiente"
        size="lg"
        fullWidth
        disabled={!isValid}
        onPress={handleSubmit(onSubmit)}
        accessibilityHint="Avanza al paso 2 de registro del entrenador"
      />
    </View>
  );
};
```

### En `TrainerCardScreen.tsx` — Botón de reinicio
```tsx
<Button
  label="Nuevo entrenador"
  variant="secondary"
  fullWidth
  onPress={handleReset}
/>
```

### En `PokemonDetailScreen.tsx` — Botón de regreso
```tsx
<Button
  label="Volver a la lista"
  variant="ghost"
  size="sm"
  leftIcon={<ArrowLeftIcon />}
  onPress={navigation.goBack}
/>
```

---

## TestIDs generados automáticamente

Cuando pasas `testID="btn"`, el componente genera los siguientes IDs derivados:

| TestID | Elemento |
|---|---|
| `btn` | Pressable raíz |
| `btn-label` | Texto del botón |
| `btn-spinner` | ActivityIndicator (solo cuando `loading=true`) |
| `btn-icon-left` | Contenedor del icono izquierdo |
| `btn-icon-right` | Contenedor del icono derecho |

Esto permite verificar estados internos en los tests sin depender del texto visible:

```tsx
// Verificar que el spinner aparece durante loading
expect(screen.getByTestId('btn-spinner')).toBeTruthy();

// Verificar que el spinner desaparece después
expect(screen.queryByTestId('btn-spinner')).toBeNull();
```

---

## Accesibilidad

El componente implementa el estándar **WCAG 2.1 nivel AA** para controles interactivos:

- **`accessibilityRole="button"`** — TalkBack y VoiceOver anuncian el elemento como botón
- **`accessibilityState.disabled`** — El lector de pantalla anuncia "deshabilitado" cuando corresponde
- **`accessibilityState.busy`** — El lector de pantalla anuncia "ocupado" durante el loading
- **`accessibilityLabel`** — Por defecto usa el `label` visible; se puede sobrescribir para contextos más descriptivos
- **`minHeight: 48px`** en tamaño `md` y `56px` en `lg` — Cumple el mínimo de área táctil recomendado por Apple HIG y Material Design

```tsx
// ✅ Buena práctica — accessibilityHint describe el resultado
<Button
  label="Siguiente"
  accessibilityHint="Avanza al paso 2 de 3 del registro"
  onPress={handleNext}
/>
```

---

## Reglas del equipo

1. **Prohibido usar `Pressable`, `TouchableOpacity` o `TouchableHighlight` directamente** en screens o features para acciones que el usuario debe identificar como botones. Solo dentro de `src/ui/components/`.
2. **Siempre pasar `loading` durante operaciones asíncronas** para prevenir doble envío del formulario.
3. **Siempre pasar `testID`** en cualquier botón que sea verificado por pruebas o flujos E2E.
4. **No combinar `disabled` y `loading`** — `loading` ya implica `disabled` internamente.

---

## Testing

Las pruebas en `Button.test.tsx` cubren **38 casos**:

- Renderizado básico y testIDs derivados
- Las 4 variantes visuales
- Los 3 tamaños
- Estado `fullWidth`
- Estado `disabled` — no llama `onPress`, `accessibilityState` correcto
- Estado `loading` — muestra spinner, bloquea `onPress`, `accessibilityState.busy`
- Interacciones — `onPress` se llama correctamente, no lanza error sin handler
- Iconos — izquierdo, derecho, ocultos durante loading
- Accesibilidad — `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`

```bash
npx jest src/ui/components/Button --watchAll=false
```

---

## Próximo componente

Con `Button` en su lugar, el siguiente es **`Input`** — el campo de texto nativo para el formulario multi-paso del Trainer, con soporte para labels, mensajes de error, estados de foco y validación integrada con `react-hook-form`.

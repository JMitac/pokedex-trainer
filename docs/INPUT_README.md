# Input — Campo de Texto Nativo

> **Ubicación:** `src/ui/components/Input/`
> **Capa:** UI / Catálogo de componentes nativos
> **Depende de:** `@/ui/tokens`, `@/ui/components/Typography`

---

## ¿Por qué existe este componente?

React Native provee `TextInput` como primitivo base para campos de texto. Usarlo directamente en formularios genera tres problemas recurrentes:

1. **Inconsistencia visual** — cada campo tiene sus propios estilos de borde, padding y color de placeholder.
2. **Estados no manejados** — el foco, el error y el estado deshabilitado requieren lógica repetida en cada pantalla.
3. **Accesibilidad ausente** — `accessibilityLabel`, `accessibilityHint` y `accessibilityState` se olvidan con frecuencia.

`Input` resuelve los tres problemas. Encapsula `TextInput` con label, mensajes de error, hint, estados visuales de foco y error, toggle de contraseña, y accesibilidad completa. Se integra nativamente con `react-hook-form` mediante `forwardRef` y el patrón `Controller`.

---

## Integración con react-hook-form

La integración principal del proyecto es a través del patrón `Controller`:

```tsx
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/ui/components/Input';

const { control, formState: { errors } } = useForm();

<Controller
  control={control}
  name="fullName"
  render={({ field: { onChange, onBlur, value, ref } }) => (
    <Input
      ref={ref}
      label="Nombre completo"
      required
      placeholder="Ash Ketchum"
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      error={errors.fullName?.message}
      hint="Este nombre aparecerá en tu carnet de entrenador"
      testID="input-fullname"
    />
  )}
/>
```

El `ref` del `Controller` se pasa directamente al `Input` gracias a `forwardRef` — esto permite que react-hook-form enfoque automáticamente el primer campo con error al intentar avanzar de paso.

---

## API del componente

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | — | Label encima del campo |
| `required` | `boolean` | `false` | Agrega asterisco rojo al label |
| `error` | `string` | — | Mensaje de error (de yup/react-hook-form) |
| `hint` | `string` | — | Texto de ayuda cuando no hay error |
| `variant` | `'default' \| 'filled'` | `'default'` | Estilo visual del campo |
| `leftElement` | `React.ReactNode` | — | Icono o elemento a la izquierda |
| `rightElement` | `React.ReactNode` | — | Icono o elemento a la derecha |
| `showPasswordToggle` | `boolean` | `false` | Botón Ver/Ocultar contraseña |
| `disabled` | `boolean` | `false` | Deshabilita el campo |
| `containerStyle` | `StyleProp<ViewStyle>` | — | Estilos del contenedor externo |
| `testID` | `string` | — | ID base para pruebas |
| `...TextInputProps` | — | — | Todas las props nativas de TextInput |

---

## Variantes

### `default` — Borde visible
Borde de `1px` que cambia de color según el estado. El más usado en formularios.

```tsx
<Input
  label="Nombre completo"
  variant="default"
  placeholder="Ash Ketchum"
/>
```

### `filled` — Fondo gris suave
Sin borde completo, solo línea inferior. Para formularios con fondo blanco donde el borde completo es muy pesado visualmente.

```tsx
<Input
  label="Correo electrónico"
  variant="filled"
  placeholder="ash@pokemon.com"
  keyboardType="email-address"
/>
```

---

## Estados visuales

El borde del campo cambia de color automáticamente:

| Estado | Color del borde |
|---|---|
| Default | `colors.border` (gris claro) |
| Focused | `colors.borderFocus` (azul) |
| Error | `colors.error` (rojo) |
| Disabled | `colors.disabled` (gris, opacidad 60%) |

---

## Ejemplos de uso en el proyecto

### `Step1PersonalData.tsx` — Datos del entrenador

```tsx
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/ui/components/Input';
import { step1Schema } from '@/features/trainer/schemas/trainer.schemas';

const Step1PersonalData = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(step1Schema),
  });

  return (
    <View style={styles.form}>
      {/* Nombre completo */}
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            ref={ref}
            label="Nombre completo"
            required
            placeholder="Ash Ketchum"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.fullName?.message}
            autoCapitalize="words"
            testID="input-fullname"
          />
        )}
      />

      {/* Edad */}
      <Controller
        control={control}
        name="age"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            ref={ref}
            label="Edad"
            required
            placeholder="10"
            value={value?.toString()}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.age?.message}
            hint="Debes tener más de 10 años para ser entrenador"
            keyboardType="numeric"
            testID="input-age"
          />
        )}
      />

      {/* Correo electrónico */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            ref={ref}
            label="Correo electrónico"
            required
            placeholder="ash@pokemon.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            testID="input-email"
          />
        )}
      />
    </View>
  );
};
```

### Campo de contraseña con toggle

```tsx
<Controller
  control={control}
  name="password"
  render={({ field: { onChange, onBlur, value, ref } }) => (
    <Input
      ref={ref}
      label="Contraseña"
      required
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      error={errors.password?.message}
      showPasswordToggle
      autoComplete="password"
      testID="input-password"
    />
  )}
/>
```

---

## TestIDs generados automáticamente

Con `testID="inp"` el componente genera:

| TestID | Elemento |
|---|---|
| `inp` | Contenedor raíz (`View`) |
| `inp-label` | Texto del label |
| `inp-required` | Asterisco de requerido |
| `inp-container` | Contenedor del TextInput |
| `inp-input` | `TextInput` nativo |
| `inp-error` | Mensaje de error |
| `inp-hint` | Texto de hint |
| `inp-left` | Contenedor del leftElement |
| `inp-right` | Contenedor del rightElement |
| `inp-password-toggle` | Botón Ver/Ocultar |

---

## Seguridad — Consideraciones para contextos financieros

En aplicaciones near-bank, los campos de texto tienen implicaciones de seguridad directas:

**`secureTextEntry`** — Activa el modo de escritura segura del OS. En iOS usa el Secure Input del sistema, que previene capturas de pantalla del contenido. En Android activa el modo de teclado seguro en dispositivos compatibles.

**`autoComplete`** — Controla el autocompletado del sistema. Para campos sensibles usar `autoComplete="off"` o valores específicos como `"email"`, `"password"`. Nunca dejar el default en campos que no deberían autocompletarse.

**`showPasswordToggle`** — El toggle de contraseña implementado aquí es local al componente. La contraseña nunca sale del `TextInput` nativo. No se almacena en estado global.

```tsx
// ✅ Campo de PIN seguro
<Input
  label="PIN"
  secureTextEntry
  keyboardType="numeric"
  maxLength={6}
  autoComplete="off"
  testID="input-pin"
/>
```

---

## Accesibilidad

- **`accessibilityLabel`** se asigna automáticamente con el valor del `label` — el lector de pantalla anuncia el nombre del campo
- **`accessibilityHint`** recibe el `hint` — describe qué se espera en el campo
- **`accessibilityState.disabled`** se activa correctamente cuando el campo está deshabilitado
- El **toggle de contraseña** tiene `accessibilityRole="button"` y `accessibilityLabel` dinámico que cambia entre "Mostrar contraseña" y "Ocultar contraseña"

---

## Reglas del equipo

1. **Prohibido usar `TextInput` directamente** en screens o features. Solo dentro de `src/ui/components/`.
2. **Siempre integrar con `Controller` de react-hook-form** — nunca manejar el estado del campo de forma local en la pantalla.
3. **Siempre pasar `error={errors.campo?.message}`** para que el estado de error sea manejado por yup.
4. **Siempre pasar `testID`** en campos verificados por pruebas o flujos E2E.
5. **Usar `autoComplete` apropiado** según el tipo de dato para no comprometer la seguridad.

---

## Testing

Las pruebas en `Input.test.tsx` cubren **32 casos**:

- Renderizado básico, label y asterisco de requerido
- Las 2 variantes visuales
- Estado de error — mensaje visible, hint oculto
- Estado de hint — visible sin error
- Estado disabled — `editable`, `accessibilityState`
- Toggle de contraseña — alternancia de `secureTextEntry`, textos Ver/Ocultar
- Elementos laterales — left, right, ocultamiento con toggle
- Interacciones — `onChangeText`, `onFocus`, `onBlur`
- Accesibilidad — `accessibilityLabel`, `accessibilityHint`, role del toggle

```bash
npx jest src/ui/components/Input --watchAll=false
```

---

## Próximo componente

Con `Input` en su lugar, el siguiente es **`Badge`** — el componente de etiqueta para los tipos de Pokémon (`TypeBadge`) y otros indicadores visuales de la aplicación.

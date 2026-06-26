# 🎨 UI Tokens — Design System Nativo

> **Capa:** `src/ui/tokens/`  
> **Responsabilidad:** Fuente de verdad única para todos los valores visuales de la aplicación.

---

## ¿Por qué existe este módulo?

Cuando un equipo construye una aplicación sin un sistema de tokens, ocurre algo predecible: cada desarrollador toma decisiones visuales en el momento. Un `fontSize: 15` aquí, un `color: '#e74c3c'` allá, un `padding: 13` en otro componente. Con el tiempo, la aplicación se convierte en una colección de decisiones aisladas que nadie puede mantener con confianza.

Este módulo existe para **eliminar ese problema desde el inicio**. Define los valores visuales una sola vez, les da nombres con significado, y los hace disponibles en toda la aplicación a través de una importación única.

---

## ¿Qué es un Design Token?

Un design token es una variable con nombre que almacena una decisión de diseño. En lugar de escribir:

```typescript
// ❌ Sin tokens — número mágico, sin contexto
<View style={{ padding: 16, backgroundColor: '#E53E3E' }}>
  <Text style={{ fontSize: 14, color: '#FFFFFF' }}>Error</Text>
</View>
```

Se escribe:

```typescript
// ✅ Con tokens — intención clara, mantenible
import { colors, spacing, textStyles } from '@/ui/tokens';

<View style={{ padding: spacing.md, backgroundColor: colors.error }}>
  <Text style={[textStyles.labelMD, { color: colors.textInverse }]}>Error</Text>
</View>
```

La diferencia no es solo estética. El segundo ejemplo te dice **qué** estás haciendo y **por qué**.

---

## Estructura del módulo

```
src/ui/tokens/
├── colors.ts       → Paleta base + tokens semánticos de color
├── spacing.ts      → Escala de espaciado, border radius, elevación
├── typography.ts   → Familia tipográfica, tamaños, pesos, estilos predefinidos
└── index.ts        → Barrel export + objeto theme unificado
```

---

## Archivos y su responsabilidad

### `colors.ts` — El lenguaje del color

Define dos capas de colores:

**Paleta base (`palette`):** Los colores primitivos con su valor hexadecimal. `red500`, `gray200`, `blue100`. Estos valores **no se usan directamente** en componentes.

**Tokens semánticos (`colors`):** El significado de cada color. `error`, `textPrimary`, `surface`, `border`. Estos **sí se usan** en componentes.

Esta separación es la clave. Si mañana el equipo decide que el color de error cambia de rojo a naranja, se cambia un valor en `palette` y `colors.error` apunta al nuevo color automáticamente. Sin tocar ningún componente.

```typescript
import { colors } from '@/ui/tokens';

// Colores semánticos — siempre preferir estos
colors.primary        // Color de marca principal
colors.error          // Rojo de error
colors.textPrimary    // Texto principal
colors.surface        // Fondo de cards
colors.border         // Bordes

// Colores de tipos Pokémon — para los badges de tipo
colors.pokemonTypes.fire    // #FF6B35
colors.pokemonTypes.water   // #4D9DE0
colors.pokemonTypes.grass   // #57CC99
```

### `spacing.ts` — El ritmo del espacio

Define una escala de espaciado basada en múltiplos de **4px**. Este es el estándar de la industria tanto en Material Design (Google) como en Human Interface Guidelines (Apple).

```typescript
import { spacing, borderRadius } from '@/ui/tokens';

// Espaciado con nombres descriptivos
spacing.xxs   // 4px  — separación mínima
spacing.xs    // 8px  — espacio pequeño
spacing.sm    // 12px — espacio compacto
spacing.md    // 16px — espacio base (el más usado)
spacing.lg    // 20px — espacio medio
spacing.xl    // 24px — espacio grande
spacing.xxl   // 32px — separación entre secciones

// Valores específicos del dominio
spacing.touchTarget         // 48px — altura mínima de elementos táctiles
spacing.pokemonSpriteSmall  // 80px — sprite en la lista
spacing.pokemonSpriteLarge  // 200px — sprite en detalle

// Bordes redondeados
borderRadius.sm   // 8px  — cards y botones
borderRadius.md   // 12px — cards grandes
borderRadius.full // 9999 — badges/pills (TypeBadge de Pokémon)
```

### `typography.ts` — La jerarquía del texto

Define tres cosas: las familias tipográficas (fuentes del sistema por plataforma), la escala de tamaños, y lo más importante: **estilos de texto predefinidos** listos para usar con spread.

```typescript
import { textStyles, colors } from '@/ui/tokens';

// Títulos
textStyles.headingLG    // Título de pantalla — 24px bold
textStyles.headingMD    // Título de sección — 20px semibold
textStyles.headingSM    // Subtítulo — 18px semibold

// Cuerpo
textStyles.bodyLG       // Texto principal — 16px regular
textStyles.bodyMD       // Texto de apoyo — 14px regular

// Labels
textStyles.labelMD      // Label de campo — 14px medium

// Específicos del dominio
textStyles.pokemonName     // Nombre en la card — 16px semibold
textStyles.pokemonNumber   // #0001 en mono — 12px bold
textStyles.statValue       // 90 en estadísticas — mono bold

// Uso en StyleSheet
const styles = StyleSheet.create({
  name: {
    ...textStyles.pokemonName,
    color: colors.textPrimary,
  }
});
```

### `index.ts` — La puerta de entrada única

Todos los tokens se exportan desde un solo punto. Nunca importar desde los archivos individuales directamente.

```typescript
// ✅ Correcto — importación única
import { colors, spacing, textStyles, theme } from '@/ui/tokens';

// ❌ Incorrecto — importación directa al archivo
import { colors } from '@/ui/tokens/colors';
```

El objeto `theme` agrupa todos los tokens y es útil para implementar temas dinámicos (dark mode) en el futuro usando React Context.

---

## Cómo usar los tokens en un componente

```typescript
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, textStyles } from '@/ui/tokens';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...textStyles.headingSM,
    color: colors.textPrimary,
  },
  subtitle: {
    ...textStyles.bodyMD,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
});
```

---

## Por qué NO compartir este sistema con la web

Este es uno de los puntos de mayor impacto para una empresa que opera tanto en web como en mobile.

### El problema del Design System compartido web/native

Es tentador pensar que si los colores y espaciados son los mismos, se puede compartir un solo paquete de componentes. En la práctica, esto genera tres problemas:

**1. React Native no tiene DOM.** Un componente web usa `<div>`, `<span>`, `className`, CSS. React Native usa `<View>`, `<Text>`, `StyleSheet`. Son plataformas con primitivos completamente diferentes. Cualquier componente web que intente correr en RN necesita una capa de traducción que eventualmente se rompe.

**2. Pérdida de las protecciones nativas del OS.** En contextos financieros o de alta seguridad, los inputs nativos (`TextInput` de React Native) tienen protecciones que el OS aplica automáticamente: integración con el Keychain para autocompletado seguro, `secureTextEntry` respaldado por hardware, protección contra capturas de pantalla en campos sensibles. Un input web envuelto en una abstracción compartida pierde acceso a estas protecciones.

**3. Regresiones de rendimiento.** Las listas de React Native (`FlatList`, `FlashList`) tienen un pipeline de renderizado completamente diferente al DOM virtual de React web. Forzar una abstracción compartida obliga a hacer compromisos que degradan el rendimiento en una de las dos plataformas.

### La arquitectura correcta para una empresa near-bank

```
@empresa/tokens          ← Solo valores: colores, espaciado, tipografía
                            Este SÍ se puede compartir

@empresa/ui-web          ← Componentes React/HTML
                            Importa @empresa/tokens

@empresa/ui-native       ← Componentes React Native puros
                            Importa @empresa/tokens
```

Los tokens son la fuente de verdad compartida. La implementación de UI es separada e independiente por plataforma. Cambiar el color primario de la marca actualiza automáticamente tanto la web como la app mobile, sin comprometer las protecciones nativas de ninguna plataforma.

---

## Beneficios concretos

| Problema sin tokens | Solución con tokens |
|---|---|
| `fontSize: 15` en un componente, `fontSize: 16` en otro — inconsistencia | `textStyles.bodyLG` en ambos — siempre el mismo valor |
| Cambiar el color de marca requiere buscar y reemplazar en toda la app | Cambiar `palette.red500` actualiza todos los componentes |
| Un developer nuevo no sabe qué valor usar para el padding de una card | `spacing.md` (16px) es el valor estándar documentado |
| Dark mode implica duplicar todos los estilos | Reemplazar `colors.surface` con un valor condicional actualiza toda la UI |
| Code review: "¿por qué `borderRadius: 13`?" — nadie sabe | `borderRadius.md` (12px) — decisión documentada y justificada |

---

## Convenciones

- Todos los tokens son `as const` — TypeScript infiere los tipos exactos, no genéricos como `string` o `number`
- Todos los tipos derivados se exportan — `ColorToken`, `SpacingToken`, `TextStyleToken`
- Ningún componente en `src/` fuera de `ui/tokens/` debe contener un valor hexadecimal, un número de fontSize, o un valor de padding que no venga de estos tokens
- Los tokens de dominio (`pokemonSpriteSmall`, `pokemonTypes`) se incluyen aquí porque son decisiones de diseño del proyecto, aunque sean específicos del negocio

---

## Próximo paso

Con los tokens en su lugar, el siguiente módulo a construir es `src/ui/components/` — el catálogo de componentes nativos que consumen estos tokens: `Button`, `Card`, `Input`, `Badge`, `Skeleton`, `Typography`.

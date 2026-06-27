# Testing — Guía de Comandos y Estrategia

> **Proyecto:** Pokédex Trainer
> **Stack de testing:** Jest + jest-expo + @testing-library/react-native
> **Ubicación de tests:** `src/__tests__/` y co-located junto a cada componente

---

## Comandos principales

### Correr todos los tests del proyecto

```bash
npx jest --watchAll=false
```

### Correr tests en modo watch (re-ejecuta al guardar)

```bash
npx jest --watch
```

### Correr tests con reporte de cobertura

```bash
npx jest --coverage --watchAll=false
```

---

## Comandos por capa

### Catálogo de componentes UI — todos juntos

```bash
npx jest src/ui/components --watchAll=false
```

### Componente individual

```bash
# Typography
npx jest src/ui/components/Typography --watchAll=false

# Button
npx jest src/ui/components/Button --watchAll=false

# Input
npx jest src/ui/components/Input --watchAll=false

# Badge y TypeBadge
npx jest src/ui/components/Badge --watchAll=false

# Card
npx jest src/ui/components/Card --watchAll=false

# Skeleton
npx jest src/ui/components/Skeleton --watchAll=false
```

### Features

```bash
# Pokédex — hooks, queries y componentes
npx jest src/features/pokedex --watchAll=false

# Trainer — schemas, store y hooks
npx jest src/features/trainer --watchAll=false
```

### Por tipo de prueba

```bash
# Solo pruebas unitarias
npx jest src/__tests__/unit --watchAll=false

# Solo pruebas de integración
npx jest src/__tests__/integration --watchAll=false

# Solo snapshots
npx jest src/__tests__/snapshot --watchAll=false
```

---

## Comandos de cobertura por módulo

```bash
# Cobertura solo del catálogo UI
npx jest src/ui --coverage --watchAll=false

# Cobertura de una feature específica
npx jest src/features/trainer --coverage --watchAll=false

# Cobertura completa con reporte HTML
npx jest --coverage --coverageReporters=html --watchAll=false
# → El reporte se genera en coverage/lcov-report/index.html
```

---

## Comandos útiles de diagnóstico

### Correr un test específico por nombre

```bash
# Correr solo los tests que coincidan con el texto
npx jest --testNamePattern="Button — loading" --watchAll=false

# Correr solo los tests de accesibilidad
npx jest --testNamePattern="Accesibilidad" --watchAll=false
```

### Correr un archivo de test exacto

```bash
npx jest src/ui/components/Button/Button.test.tsx --watchAll=false
```

### Ver los tests sin ejecutarlos (dry run)

```bash
npx jest --listTests
```

### Limpiar caché de Jest y re-ejecutar

```bash
npx jest --clearCache && npx jest --watchAll=false
```

### Ver output detallado (verbose)

```bash
npx jest --verbose --watchAll=false
```

---

## Estrategia de testing del proyecto

El proyecto implementa una pirámide de testing en 4 niveles:

```
        ▲
       / \
      / E2E \          ← Maestro — flujos completos en dispositivo real
     /--------\
    / Snapshot  \      ← Jest — regresiones visuales de componentes UI
   /------------\
  / Integration  \     ← Jest + MSW — flujos de pantalla con API mockeada
 /----------------\
/      Unit        \   ← Jest + RNTL — hooks, stores, schemas, componentes
/------------------\
```

### Nivel 1 — Unitarias (Jest + @testing-library/react-native)

**Qué se prueba:**
- Componentes del catálogo UI (`Typography`, `Button`, `Input`, `Badge`, `Card`, `Skeleton`)
- Custom hooks (`usePokemonList`, `usePokemonDetail`, `useTrainerForm`)
- Schemas de validación yup (`trainer.schemas.ts`)
- Stores de Zustand (`trainerStore.ts`)
- Funciones utilitarias (`formatters.ts`, `validators.ts`)

**Dónde viven:** Co-located junto al archivo que prueban (`Button.test.tsx` junto a `Button.tsx`)

**Comando:**
```bash
npx jest src/ui/components --watchAll=false
npx jest src/features/trainer/schemas --watchAll=false
npx jest src/features/trainer/store --watchAll=false
```

---

### Nivel 2 — Integración (Jest + MSW)

**Qué se prueba:**
- Flujo completo de la lista de Pokémon con API mockeada
- Flujo multi-paso del formulario del Trainer de punta a punta
- Store de Zustand leyendo datos correctamente en la pantalla de resumen

**Dónde viven:** `src/__tests__/integration/`

**Comando:**
```bash
npx jest src/__tests__/integration --watchAll=false
```

---

### Nivel 3 — Snapshot (Jest)

**Qué se prueba:**
- Componentes del catálogo UI para detectar regresiones visuales
- La `TrainerCard` con datos del store de Zustand

**Dónde viven:** `src/__tests__/snapshot/`

**Comando:**
```bash
npx jest src/__tests__/snapshot --watchAll=false
```

**Actualizar snapshots cuando el cambio es intencional:**
```bash
npx jest src/__tests__/snapshot --updateSnapshot --watchAll=false
# o con el alias corto:
npx jest src/__tests__/snapshot -u --watchAll=false
```

---

### Nivel 4 — E2E (Maestro)

**Qué se prueba:**
- Flujo completo: abrir app → navegar al Pokédex → tap en un Pokémon → verificar detalle
- Flujo completo: completar formulario de entrenador en 3 pasos → verificar tarjeta

**Dónde viven:** `src/__tests__/e2e/` (archivos `.yaml` de Maestro)

**Comando:**
```bash
# Requiere Maestro CLI instalado y emulador corriendo
maestro test src/__tests__/e2e/pokedex.yaml
maestro test src/__tests__/e2e/trainerFlow.yaml

# Correr todos los flujos E2E
maestro test src/__tests__/e2e/
```

**Instalar Maestro CLI:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

---

## Resumen de tests actuales

| Módulo | Archivo | Tests |
|---|---|---|
| Typography | `Typography.test.tsx` | 45 |
| Button | `Button.test.tsx` | 38 |
| Input | `Input.test.tsx` | 32 |
| Badge + TypeBadge | `Badge.test.tsx` | 50+ |
| Card | `Card.test.tsx` | 25 |
| Skeleton | `Skeleton.test.tsx` | 35 |
| **Total catálogo UI** | | **225+** |

---

## Configuración de Jest

El archivo `jest.config.js` en la raíz del proyecto contiene la configuración completa:

```js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^test-renderer$': 'react-test-renderer',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};
```

**Puntos clave de la configuración:**

- `preset: 'jest-expo'` — usa el preset oficial de Expo que configura Babel, transforms y el entorno correcto para React Native
- `transformIgnorePatterns` — le dice a Jest qué paquetes de `node_modules` deben ser transformados (los que usan ESM en lugar de CJS)
- `moduleNameMapper` — resuelve el alias `@/` al directorio `src/` y el alias `test-renderer` al paquete correcto
- `collectCoverageFrom` — define qué archivos se incluyen en el reporte de cobertura, excluyendo tests, tipos y barrels

---

## Dependencias de testing instaladas

```json
{
  "devDependencies": {
    "@react-native/jest-preset": "^0.85.3",
    "@testing-library/react-native": "^12.9.0",
    "@types/jest": "^29.5.14",
    "jest": "^29.7.0",
    "jest-expo": "^56.0.5",
    "msw": "^2.x",
    "react-test-renderer": "^19.2.3"
  }
}
```

---

## Convenciones del equipo

1. **Nombre de archivos** — `ComponentName.test.tsx` co-located junto al componente. Tests de integración en `src/__tests__/integration/`.

2. **Estructura de un test:**
```tsx
describe('ComponentName — Sección', () => {
  it('describe el comportamiento esperado en español', () => {
    // Arrange
    const onPress = jest.fn();

    // Act
    render(<Button label="OK" onPress={onPress} testID="btn" />);
    fireEvent.press(screen.getByTestId('btn'));

    // Assert
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

3. **Siempre usar `testID`** en elementos verificados por tests — nunca buscar por texto en componentes que pueden cambiar su contenido.

4. **Preferir `screen.getByTestId`** sobre `screen.getByText` para elementos de UI — el texto puede cambiar, el testID es un contrato estable.

5. **Un `describe` por sección funcional** — Renderizado básico, Variantes, Estados, Interacciones, Accesibilidad.

6. **Prohibido usar `any` en tests** — si un tipo no está disponible, importarlo o derivarlo del componente bajo prueba.
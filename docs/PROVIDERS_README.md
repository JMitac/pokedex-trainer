# Providers & HTTP Client

> **Ubicación:** `src/app/providers/` y `src/shared/api/`
> **Capa:** App / Infraestructura

---

## QueryProvider

Configura React Query con estrategias óptimas para la PokéAPI:

| Configuración | Valor | Razón |
|---|---|---|
| `staleTime` | 5 minutos | Los Pokémon no cambian — no re-fetchear en cada montaje |
| `gcTime` | 10 minutos | Mantiene caché en memoria para navegación instantánea |
| `retry` | 2 | Reintenta en errores de red antes de mostrar error |
| `retryDelay` | Exponencial (1s, 2s) | Evita saturar la API |
| `refetchOnWindowFocus` | `false` | No aplica en mobile |
| `refetchOnReconnect` | `true` | Re-fetchea al recuperar conexión |

### Uso en `App.tsx`

```tsx
import { QueryProvider } from '@/app/providers';
import { RootNavigator } from '@/app/navigation';

export default function App() {
  return (
    <QueryProvider>
      <RootNavigator />
    </QueryProvider>
  );
}
```

---

## HTTP Client

Cliente axios centralizado en `src/shared/api/httpClient.ts`.

**Base URL:** `https://pokeapi.co/api/v2`
**Timeout:** 10 segundos

### Uso en queries

```ts
import { httpClient } from '@/shared/api';

const fetchPokemonList = async (limit: number, offset: number) => {
  const { data } = await httpClient.get('/pokemon', {
    params: { limit, offset },
  });
  return data;
};
```

### Interceptores

**Request** — logging en DEV, punto de extensión para tokens de auth.

**Response** — logging en DEV, normalización de errores para React Query.

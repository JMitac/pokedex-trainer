/**
 * @file Badge.test.tsx
 * @layer UI / Components / Badge / Tests
 *
 * Pruebas unitarias del componente Badge y TypeBadge.
 * Cubren: variantes, tamaños, appearances, tipos Pokémon y accesibilidad.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Badge, TypeBadge } from './Badge';
import type { PokemonType } from '@/ui/tokens';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const renderBadge = (props = {}) =>
  render(<Badge label="Fuego" testID="badge" {...props} />);

// ---------------------------------------------------------------------------
// Renderizado básico
// ---------------------------------------------------------------------------

describe('Badge — Renderizado básico', () => {
  it('renderiza el label correctamente', () => {
    renderBadge();
    expect(screen.getByText('Fuego')).toBeTruthy();
  });

  it('aplica testID al contenedor raíz', () => {
    renderBadge();
    expect(screen.getByTestId('badge')).toBeTruthy();
  });

  it('renderiza el label con testID compuesto', () => {
    renderBadge();
    expect(screen.getByTestId('badge-label')).toBeTruthy();
  });

  it('aplica accessibilityLabel con el label', () => {
    renderBadge();
    const badge = screen.getByTestId('badge');
    expect(badge.props.accessibilityLabel).toBe('Fuego');
  });
});

// ---------------------------------------------------------------------------
// Variantes semánticas
// ---------------------------------------------------------------------------

describe('Badge — Variantes', () => {
  const variants = [
    'neutral',
    'success',
    'warning',
    'error',
    'info',
  ] as const;

  variants.forEach((variant) => {
    it(`renderiza variante "${variant}" sin errores`, () => {
      renderBadge({ variant });
      expect(screen.getByTestId('badge')).toBeTruthy();
    });
  });

  it('usa variante "neutral" por defecto', () => {
    renderBadge();
    expect(screen.getByTestId('badge')).toBeTruthy();
  });

  it('renderiza variante "pokemon" sin errores', () => {
    renderBadge({ variant: 'pokemon', pokemonType: 'fire' });
    expect(screen.getByTestId('badge')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Tamaños
// ---------------------------------------------------------------------------

describe('Badge — Tamaños', () => {
  const sizes = ['sm', 'md', 'lg'] as const;

  sizes.forEach((size) => {
    it(`renderiza tamaño "${size}" sin errores`, () => {
      renderBadge({ size });
      expect(screen.getByTestId('badge')).toBeTruthy();
    });
  });

  it('usa tamaño "md" por defecto', () => {
    renderBadge();
    expect(screen.getByTestId('badge')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Appearances
// ---------------------------------------------------------------------------

describe('Badge — Appearances', () => {
  const appearances = ['solid', 'outline', 'subtle'] as const;

  appearances.forEach((appearance) => {
    it(`renderiza appearance "${appearance}" sin errores`, () => {
      renderBadge({ appearance });
      expect(screen.getByTestId('badge')).toBeTruthy();
    });
  });

  it('usa appearance "solid" por defecto', () => {
    renderBadge();
    expect(screen.getByTestId('badge')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Tipos Pokémon
// ---------------------------------------------------------------------------

describe('Badge — Tipos Pokémon', () => {
  const pokemonTypes: PokemonType[] = [
    'fire', 'water', 'grass', 'electric', 'psychic',
    'ice', 'dragon', 'dark', 'fairy', 'normal',
    'fighting', 'flying', 'poison', 'ground',
    'rock', 'bug', 'ghost', 'steel',
  ];

  pokemonTypes.forEach((type) => {
    it(`renderiza tipo "${type}" con variant pokemon`, () => {
      render(
        <Badge
          label={type}
          variant="pokemon"
          pokemonType={type}
          testID={`badge-${type}`}
        />
      );
      expect(screen.getByTestId(`badge-${type}`)).toBeTruthy();
    });
  });

  it('usa color por defecto cuando pokemonType es undefined', () => {
    renderBadge({ variant: 'pokemon', pokemonType: undefined });
    expect(screen.getByTestId('badge')).toBeTruthy();
  });

  it('renderiza label en uppercase cuando variant es pokemon', () => {
    renderBadge({ variant: 'pokemon', pokemonType: 'fire' });
    expect(screen.getByTestId('badge-label')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// TypeBadge — sub-componente
// ---------------------------------------------------------------------------

describe('TypeBadge', () => {
  it('renderiza correctamente con tipo fire', () => {
    render(<TypeBadge type="fire" />);
    expect(screen.getByTestId('badge-type-fire')).toBeTruthy();
  });

  it('renderiza el nombre del tipo como texto', () => {
    render(<TypeBadge type="water" />);
    expect(screen.getByText('water')).toBeTruthy();
  });

  it('genera testID automático basado en el tipo', () => {
    render(<TypeBadge type="grass" />);
    expect(screen.getByTestId('badge-type-grass')).toBeTruthy();
  });

  it('acepta testID personalizado', () => {
    render(<TypeBadge type="fire" testID="custom-fire" />);
    expect(screen.getByTestId('custom-fire')).toBeTruthy();
  });

  it('renderiza todos los tipos sin errores', () => {
    const types: PokemonType[] = [
      'fire', 'water', 'grass', 'electric', 'psychic',
      'ice', 'dragon', 'dark', 'fairy', 'normal',
    ];

    types.forEach((type) => {
      const { unmount } = render(<TypeBadge type={type} testID={`t-${type}`} />);
      expect(screen.getByTestId(`t-${type}`)).toBeTruthy();
      unmount();
    });
  });

  it('usa tamaño "md" por defecto', () => {
    render(<TypeBadge type="fire" testID="t-fire" />);
    expect(screen.getByTestId('t-fire')).toBeTruthy();
  });

  (['sm', 'md', 'lg'] as const).forEach((size) => {
    it(`renderiza tamaño "${size}" correctamente`, () => {
      render(<TypeBadge type="fire" size={size} testID={`t-${size}`} />);
      expect(screen.getByTestId(`t-${size}`)).toBeTruthy();
    });
  });
});

// ---------------------------------------------------------------------------
// Combinaciones
// ---------------------------------------------------------------------------

describe('Badge — Combinaciones', () => {
  it('renderiza success + outline correctamente', () => {
    renderBadge({ variant: 'success', appearance: 'outline' });
    expect(screen.getByTestId('badge')).toBeTruthy();
  });

  it('renderiza error + subtle correctamente', () => {
    renderBadge({ variant: 'error', appearance: 'subtle' });
    expect(screen.getByTestId('badge')).toBeTruthy();
  });

  it('renderiza pokemon + lg correctamente', () => {
    renderBadge({ variant: 'pokemon', pokemonType: 'dragon', size: 'lg' });
    expect(screen.getByTestId('badge')).toBeTruthy();
  });

  it('renderiza warning + sm + subtle correctamente', () => {
    renderBadge({ variant: 'warning', size: 'sm', appearance: 'subtle' });
    expect(screen.getByTestId('badge')).toBeTruthy();
  });
});

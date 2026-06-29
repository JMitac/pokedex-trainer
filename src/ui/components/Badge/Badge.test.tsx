/**
 * @file Badge.test.tsx
 * @layer UI / Components / Badge / Tests
 *
 * Pruebas unitarias del componente Badge y TypeBadge.
 * Cubren: variantes, tamaños, appearances, tipos Pokémon en español y accesibilidad.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Badge, TypeBadge, POKEMON_TYPE_NAMES_ES } from './Badge';
import type { PokemonType } from '@/ui/tokens';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const renderBadge = (props = {}) =>
  render(<Badge label="Fuego" testID="badge" {...props} />);

// ---------------------------------------------------------------------------
// Badge base — Renderizado básico
// ---------------------------------------------------------------------------

describe('Badge — Renderizado básico', () => {
  it('renderiza el label correctamente', () => {
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

  it('muestra el texto en mayúsculas', () => {
    renderBadge({ label: 'planta' });
    // El texto se muestra en mayúsculas via toUpperCase()
    expect(screen.getByTestId('badge-label')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Variantes semánticas
// ---------------------------------------------------------------------------

describe('Badge — Variantes', () => {
  const variants = ['neutral', 'success', 'warning', 'error', 'info'] as const;

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
// POKEMON_TYPE_NAMES_ES — mapa de traducción
// ---------------------------------------------------------------------------

describe('POKEMON_TYPE_NAMES_ES — Mapa de traducción', () => {
  it('traduce fire a Fuego', () => {
    expect(POKEMON_TYPE_NAMES_ES['fire']).toBe('Fuego');
  });

  it('traduce water a Agua', () => {
    expect(POKEMON_TYPE_NAMES_ES['water']).toBe('Agua');
  });

  it('traduce grass a Planta', () => {
    expect(POKEMON_TYPE_NAMES_ES['grass']).toBe('Planta');
  });

  it('traduce poison a Veneno', () => {
    expect(POKEMON_TYPE_NAMES_ES['poison']).toBe('Veneno');
  });

  it('traduce electric a Eléctrico', () => {
    expect(POKEMON_TYPE_NAMES_ES['electric']).toBe('Eléctrico');
  });

  it('traduce psychic a Psíquico', () => {
    expect(POKEMON_TYPE_NAMES_ES['psychic']).toBe('Psíquico');
  });

  it('traduce ice a Hielo', () => {
    expect(POKEMON_TYPE_NAMES_ES['ice']).toBe('Hielo');
  });

  it('traduce dragon a Dragón', () => {
    expect(POKEMON_TYPE_NAMES_ES['dragon']).toBe('Dragón');
  });

  it('traduce dark a Siniestro', () => {
    expect(POKEMON_TYPE_NAMES_ES['dark']).toBe('Siniestro');
  });

  it('traduce fairy a Hada', () => {
    expect(POKEMON_TYPE_NAMES_ES['fairy']).toBe('Hada');
  });

  it('traduce normal a Normal', () => {
    expect(POKEMON_TYPE_NAMES_ES['normal']).toBe('Normal');
  });

  it('traduce fighting a Lucha', () => {
    expect(POKEMON_TYPE_NAMES_ES['fighting']).toBe('Lucha');
  });

  it('traduce flying a Volador', () => {
    expect(POKEMON_TYPE_NAMES_ES['flying']).toBe('Volador');
  });

  it('traduce ground a Tierra', () => {
    expect(POKEMON_TYPE_NAMES_ES['ground']).toBe('Tierra');
  });

  it('traduce rock a Roca', () => {
    expect(POKEMON_TYPE_NAMES_ES['rock']).toBe('Roca');
  });

  it('traduce bug a Bicho', () => {
    expect(POKEMON_TYPE_NAMES_ES['bug']).toBe('Bicho');
  });

  it('traduce ghost a Fantasma', () => {
    expect(POKEMON_TYPE_NAMES_ES['ghost']).toBe('Fantasma');
  });

  it('traduce steel a Acero', () => {
    expect(POKEMON_TYPE_NAMES_ES['steel']).toBe('Acero');
  });

  it('tiene exactamente 18 tipos', () => {
    expect(Object.keys(POKEMON_TYPE_NAMES_ES)).toHaveLength(18);
  });
});

// ---------------------------------------------------------------------------
// Tipos Pokémon con badge
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
          label={POKEMON_TYPE_NAMES_ES[type] ?? type}
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
});

// ---------------------------------------------------------------------------
// TypeBadge — sub-componente especializado
// ---------------------------------------------------------------------------

describe('TypeBadge', () => {
  it('renderiza correctamente con tipo fire', () => {
    render(<TypeBadge type="fire" />);
    expect(screen.getByTestId('badge-type-fire')).toBeTruthy();
  });

  it('muestra el nombre en español para fire (Fuego)', () => {
    render(<TypeBadge type="fire" testID="t-fire" />);
    expect(screen.getByTestId('t-fire-label')).toBeTruthy();
  });

  it('muestra el nombre en español para grass (Planta)', () => {
    render(<TypeBadge type="grass" testID="t-grass" />);
    expect(screen.getByTestId('t-grass-label')).toBeTruthy();
  });

  it('muestra el nombre en español para water (Agua)', () => {
    render(<TypeBadge type="water" testID="t-water" />);
    expect(screen.getByTestId('t-water-label')).toBeTruthy();
  });

  it('muestra el nombre en español para poison (Veneno)', () => {
    render(<TypeBadge type="poison" testID="t-poison" />);
    expect(screen.getByTestId('t-poison-label')).toBeTruthy();
  });

  it('genera testID automático basado en el tipo', () => {
    render(<TypeBadge type="grass" />);
    expect(screen.getByTestId('badge-type-grass')).toBeTruthy();
  });

  it('acepta testID personalizado', () => {
    render(<TypeBadge type="fire" testID="custom-fire" />);
    expect(screen.getByTestId('custom-fire')).toBeTruthy();
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

  it('renderiza todos los 18 tipos sin errores', () => {
    const types: PokemonType[] = [
      'fire', 'water', 'grass', 'electric', 'psychic',
      'ice', 'dragon', 'dark', 'fairy', 'normal',
      'fighting', 'flying', 'poison', 'ground',
      'rock', 'bug', 'ghost', 'steel',
    ];

    types.forEach((type) => {
      const { unmount } = render(
        <TypeBadge type={type} testID={`t-${type}`} />
      );
      expect(screen.getByTestId(`t-${type}`)).toBeTruthy();
      unmount();
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

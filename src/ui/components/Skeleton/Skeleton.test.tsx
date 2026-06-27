/**
 * @file Skeleton.test.tsx
 * @layer UI / Components / Skeleton / Tests
 *
 * Pruebas unitarias de Skeleton y sus sub-componentes.
 * Cubren: renderizado, props, conteo de elementos y testIDs.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import {
  Skeleton,
  PokemonCardSkeleton,
  PokemonListSkeleton,
  PokemonDetailSkeleton,
} from './Skeleton';

// ---------------------------------------------------------------------------
// Skeleton base
// ---------------------------------------------------------------------------

describe('Skeleton — Base', () => {
  it('renderiza correctamente con props por defecto', () => {
    render(<Skeleton testID="sk" />);
    expect(screen.getByTestId('sk')).toBeTruthy();
  });

  it('acepta width numérico', () => {
    render(<Skeleton testID="sk" width={120} />);
    expect(screen.getByTestId('sk')).toBeTruthy();
  });

  it('acepta width como string porcentaje', () => {
    render(<Skeleton testID="sk" width="80%" />);
    expect(screen.getByTestId('sk')).toBeTruthy();
  });

  it('acepta height personalizado', () => {
    render(<Skeleton testID="sk" height={32} />);
    expect(screen.getByTestId('sk')).toBeTruthy();
  });

  it('acepta radius personalizado', () => {
    render(<Skeleton testID="sk" radius={9999} />);
    expect(screen.getByTestId('sk')).toBeTruthy();
  });

  it('acepta estilos adicionales', () => {
    render(<Skeleton testID="sk" style={{ marginTop: 8 }} />);
    expect(screen.getByTestId('sk')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// PokemonCardSkeleton
// ---------------------------------------------------------------------------

describe('PokemonCardSkeleton', () => {
  it('renderiza con testID por defecto', () => {
    render(<PokemonCardSkeleton />);
    expect(screen.getByTestId('skeleton-pokemon-card')).toBeTruthy();
  });

  it('renderiza con testID personalizado', () => {
    render(<PokemonCardSkeleton testID="custom-card" />);
    expect(screen.getByTestId('custom-card')).toBeTruthy();
  });

  it('renderiza el skeleton del sprite', () => {
    render(<PokemonCardSkeleton />);
    expect(screen.getByTestId('skeleton-pokemon-sprite')).toBeTruthy();
  });

  it('renderiza el skeleton del número', () => {
    render(<PokemonCardSkeleton />);
    expect(screen.getByTestId('skeleton-pokemon-number')).toBeTruthy();
  });

  it('renderiza el skeleton del nombre', () => {
    render(<PokemonCardSkeleton />);
    expect(screen.getByTestId('skeleton-pokemon-name')).toBeTruthy();
  });

  it('renderiza los skeletons de tipos', () => {
    render(<PokemonCardSkeleton />);
    expect(screen.getByTestId('skeleton-pokemon-type1')).toBeTruthy();
    expect(screen.getByTestId('skeleton-pokemon-type2')).toBeTruthy();
  });

  it('usa testIDs derivados cuando se pasa testID personalizado', () => {
    render(<PokemonCardSkeleton testID="pk" />);
    expect(screen.getByTestId('pk-sprite')).toBeTruthy();
    expect(screen.getByTestId('pk-number')).toBeTruthy();
    expect(screen.getByTestId('pk-name')).toBeTruthy();
    expect(screen.getByTestId('pk-type1')).toBeTruthy();
    expect(screen.getByTestId('pk-type2')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// PokemonListSkeleton
// ---------------------------------------------------------------------------

describe('PokemonListSkeleton', () => {
  it('renderiza con testID por defecto', () => {
    render(<PokemonListSkeleton />);
    expect(screen.getByTestId('skeleton-pokemon-list')).toBeTruthy();
  });

  it('renderiza 8 cards por defecto', () => {
    render(<PokemonListSkeleton />);
    for (let i = 0; i < 8; i++) {
      expect(screen.getByTestId(`skeleton-pokemon-card-${i}`)).toBeTruthy();
    }
  });

  it('renderiza el número de cards especificado', () => {
    render(<PokemonListSkeleton count={3} />);
    expect(screen.getByTestId('skeleton-pokemon-card-0')).toBeTruthy();
    expect(screen.getByTestId('skeleton-pokemon-card-1')).toBeTruthy();
    expect(screen.getByTestId('skeleton-pokemon-card-2')).toBeTruthy();
    expect(screen.queryByTestId('skeleton-pokemon-card-3')).toBeNull();
  });

  it('renderiza con testID personalizado', () => {
    render(<PokemonListSkeleton testID="my-list" />);
    expect(screen.getByTestId('my-list')).toBeTruthy();
  });

  it('renderiza 1 card cuando count es 1', () => {
    render(<PokemonListSkeleton count={1} />);
    expect(screen.getByTestId('skeleton-pokemon-card-0')).toBeTruthy();
    expect(screen.queryByTestId('skeleton-pokemon-card-1')).toBeNull();
  });

  it('renderiza 20 cards sin errores', () => {
    render(<PokemonListSkeleton count={20} />);
    expect(screen.getByTestId('skeleton-pokemon-card-19')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// PokemonDetailSkeleton
// ---------------------------------------------------------------------------

describe('PokemonDetailSkeleton', () => {
  it('renderiza con testID por defecto', () => {
    render(<PokemonDetailSkeleton />);
    expect(screen.getByTestId('skeleton-pokemon-detail')).toBeTruthy();
  });

  it('renderiza con testID personalizado', () => {
    render(<PokemonDetailSkeleton testID="my-detail" />);
    expect(screen.getByTestId('my-detail')).toBeTruthy();
  });

  it('renderiza el skeleton del sprite grande', () => {
    render(<PokemonDetailSkeleton />);
    expect(screen.getByTestId('skeleton-detail-sprite')).toBeTruthy();
  });

  it('renderiza el skeleton del número', () => {
    render(<PokemonDetailSkeleton />);
    expect(screen.getByTestId('skeleton-detail-number')).toBeTruthy();
  });

  it('renderiza el skeleton del nombre', () => {
    render(<PokemonDetailSkeleton />);
    expect(screen.getByTestId('skeleton-detail-name')).toBeTruthy();
  });

  it('renderiza los skeletons de tipos', () => {
    render(<PokemonDetailSkeleton />);
    expect(screen.getByTestId('skeleton-detail-type1')).toBeTruthy();
    expect(screen.getByTestId('skeleton-detail-type2')).toBeTruthy();
  });

  it('renderiza 6 filas de estadísticas', () => {
    render(<PokemonDetailSkeleton />);
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`skeleton-detail-stat-label-${i}`)).toBeTruthy();
      expect(screen.getByTestId(`skeleton-detail-stat-bar-${i}`)).toBeTruthy();
    }
  });
});

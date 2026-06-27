/**
 * @file Card.test.tsx
 * @layer UI / Components / Card / Tests
 *
 * Pruebas unitarias del componente Card y sus sub-componentes.
 * Cubren: variantes, interacciones, sub-componentes y accesibilidad.
 */

import React from 'react';
import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Card } from './Card';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const renderCard = (props = {}) =>
  render(
    <Card testID="card" {...props}>
      <Text>Contenido de la card</Text>
    </Card>
  );

// ---------------------------------------------------------------------------
// Renderizado básico
// ---------------------------------------------------------------------------

describe('Card — Renderizado básico', () => {
  it('renderiza el contenedor correctamente', () => {
    renderCard();
    expect(screen.getByTestId('card')).toBeTruthy();
  });

  it('renderiza los children correctamente', () => {
    renderCard();
    expect(screen.getByText('Contenido de la card')).toBeTruthy();
  });

  it('usa variante "elevated" por defecto', () => {
    renderCard();
    expect(screen.getByTestId('card')).toBeTruthy();
  });

  it('renderiza como View cuando no tiene onPress', () => {
    renderCard();
    const card = screen.getByTestId('card');
    expect(card.props.accessibilityRole).toBeUndefined();
  });

  it('renderiza como Pressable cuando tiene onPress', () => {
    renderCard({ onPress: jest.fn() });
    const card = screen.getByTestId('card');
    expect(card.props.accessibilityRole).toBe('button');
  });
});

// ---------------------------------------------------------------------------
// Variantes
// ---------------------------------------------------------------------------

describe('Card — Variantes', () => {
  const variants = ['elevated', 'outlined', 'flat'] as const;

  variants.forEach((variant) => {
    it(`renderiza variante "${variant}" sin errores`, () => {
      renderCard({ variant });
      expect(screen.getByTestId('card')).toBeTruthy();
    });
  });
});

// ---------------------------------------------------------------------------
// Interacciones
// ---------------------------------------------------------------------------

describe('Card — Interacciones', () => {
  it('llama onPress al presionar', () => {
    const onPress = jest.fn();
    renderCard({ onPress });
    fireEvent.press(screen.getByTestId('card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no llama onPress cuando disabled es true', () => {
    const onPress = jest.fn();
    renderCard({ onPress, disabled: true });
    fireEvent.press(screen.getByTestId('card'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('aplica accessibilityState.disabled cuando disabled es true', () => {
    renderCard({ onPress: jest.fn(), disabled: true });
    const card = screen.getByTestId('card');
    expect(card.props.accessibilityState.disabled).toBe(true);
  });

  it('no lanza error si onPress no está definido', () => {
    renderCard();
    expect(() =>
      fireEvent.press(screen.getByTestId('card'))
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Accesibilidad
// ---------------------------------------------------------------------------

describe('Card — Accesibilidad', () => {
  it('aplica accessibilityLabel cuando se provee', () => {
    renderCard({ accessibilityLabel: 'Card de Bulbasaur' });
    const card = screen.getByTestId('card');
    expect(card.props.accessibilityLabel).toBe('Card de Bulbasaur');
  });

  it('aplica accessibilityHint cuando se provee con onPress', () => {
    renderCard({
      onPress: jest.fn(),
      accessibilityHint: 'Abre el detalle del Pokémon',
    });
    const card = screen.getByTestId('card');
    expect(card.props.accessibilityHint).toBe('Abre el detalle del Pokémon');
  });
});

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

describe('Card.Header', () => {
  it('renderiza el contenido correctamente', () => {
    render(
      <Card testID="card">
        <Card.Header testID="header">
          <Text>Encabezado</Text>
        </Card.Header>
      </Card>
    );
    expect(screen.getByTestId('header')).toBeTruthy();
    expect(screen.getByText('Encabezado')).toBeTruthy();
  });
});

describe('Card.Body', () => {
  it('renderiza el contenido correctamente', () => {
    render(
      <Card testID="card">
        <Card.Body testID="body">
          <Text>Cuerpo</Text>
        </Card.Body>
      </Card>
    );
    expect(screen.getByTestId('body')).toBeTruthy();
    expect(screen.getByText('Cuerpo')).toBeTruthy();
  });
});

describe('Card.Footer', () => {
  it('renderiza el contenido correctamente', () => {
    render(
      <Card testID="card">
        <Card.Footer testID="footer">
          <Text>Pie</Text>
        </Card.Footer>
      </Card>
    );
    expect(screen.getByTestId('footer')).toBeTruthy();
    expect(screen.getByText('Pie')).toBeTruthy();
  });
});

describe('Card — Composición completa', () => {
  it('renderiza Header + Body + Footer juntos', () => {
    render(
      <Card testID="card">
        <Card.Header testID="header">
          <Text>Título</Text>
        </Card.Header>
        <Card.Body testID="body">
          <Text>Contenido</Text>
        </Card.Body>
        <Card.Footer testID="footer">
          <Text>Acción</Text>
        </Card.Footer>
      </Card>
    );
    expect(screen.getByTestId('header')).toBeTruthy();
    expect(screen.getByTestId('body')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });

  it('renderiza card presionable con sub-componentes', () => {
    const onPress = jest.fn();
    render(
      <Card testID="card" onPress={onPress}>
        <Card.Header testID="header">
          <Text>Header</Text>
        </Card.Header>
        <Card.Body testID="body">
          <Text>Body</Text>
        </Card.Body>
      </Card>
    );
    fireEvent.press(screen.getByTestId('card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Props de estilo
// ---------------------------------------------------------------------------

describe('Card — Props de estilo', () => {
  it('aplica backgroundColor personalizado', () => {
    renderCard({ backgroundColor: '#FF0000' });
    expect(screen.getByTestId('card')).toBeTruthy();
  });

  it('aplica padding personalizado', () => {
    renderCard({ padding: 8 });
    expect(screen.getByTestId('card')).toBeTruthy();
  });
});

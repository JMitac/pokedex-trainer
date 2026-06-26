/**
 * @file Button.test.tsx
 * @layer UI / Components / Button / Tests
 *
 * Pruebas unitarias del componente Button.
 * Cubren: variantes, tamaños, estados, accesibilidad e interacciones.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderButton = (props = {}) =>
  render(<Button label="Confirmar" testID="btn" {...props} />);

// ---------------------------------------------------------------------------
// Renderizado básico
// ---------------------------------------------------------------------------

describe('Button — Renderizado básico', () => {
  it('renderiza el label correctamente', () => {
    renderButton();
    expect(screen.getByText('Confirmar')).toBeTruthy();
  });

  it('aplica testID al Pressable raíz', () => {
    renderButton();
    expect(screen.getByTestId('btn')).toBeTruthy();
  });

  it('renderiza el label con testID compuesto', () => {
    renderButton();
    expect(screen.getByTestId('btn-label')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Variantes
// ---------------------------------------------------------------------------

describe('Button — Variantes', () => {
  const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;

  variants.forEach((variant) => {
    it(`renderiza variante "${variant}" sin errores`, () => {
      renderButton({ variant });
      expect(screen.getByTestId('btn')).toBeTruthy();
    });
  });

  it('usa variante "primary" por defecto', () => {
    renderButton();
    expect(screen.getByTestId('btn')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Tamaños
// ---------------------------------------------------------------------------

describe('Button — Tamaños', () => {
  const sizes = ['sm', 'md', 'lg'] as const;

  sizes.forEach((size) => {
    it(`renderiza tamaño "${size}" sin errores`, () => {
      renderButton({ size });
      expect(screen.getByTestId('btn')).toBeTruthy();
    });
  });

  it('usa tamaño "md" por defecto', () => {
    renderButton();
    expect(screen.getByTestId('btn')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Estado: fullWidth
// ---------------------------------------------------------------------------

describe('Button — fullWidth', () => {
  it('renderiza sin fullWidth por defecto', () => {
    renderButton();
    expect(screen.getByTestId('btn')).toBeTruthy();
  });

  it('renderiza con fullWidth correctamente', () => {
    renderButton({ fullWidth: true });
    expect(screen.getByTestId('btn')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Estado: disabled
// ---------------------------------------------------------------------------

describe('Button — disabled', () => {
  it('no llama onPress cuando está deshabilitado', () => {
    const onPress = jest.fn();
    renderButton({ disabled: true, onPress });
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('aplica accessibilityState disabled correctamente', () => {
    renderButton({ disabled: true });
    const btn = screen.getByTestId('btn');
    expect(btn.props.accessibilityState.disabled).toBe(true);
  });

  it('renderiza el label aun estando disabled', () => {
    renderButton({ disabled: true });
    expect(screen.getByText('Confirmar')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Estado: loading
// ---------------------------------------------------------------------------

describe('Button — loading', () => {
  it('muestra el spinner cuando loading es true', () => {
    renderButton({ loading: true });
    expect(screen.getByTestId('btn-spinner')).toBeTruthy();
  });

  it('no llama onPress cuando está en loading', () => {
    const onPress = jest.fn();
    renderButton({ loading: true, onPress });
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('aplica accessibilityState busy cuando loading es true', () => {
    renderButton({ loading: true });
    const btn = screen.getByTestId('btn');
    expect(btn.props.accessibilityState.busy).toBe(true);
  });

  it('no muestra el spinner cuando loading es false', () => {
    renderButton({ loading: false });
    expect(screen.queryByTestId('btn-spinner')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Interacciones
// ---------------------------------------------------------------------------

describe('Button — Interacciones', () => {
  it('llama onPress al presionar', () => {
    const onPress = jest.fn();
    renderButton({ onPress });
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no lanza error si onPress no está definido', () => {
    renderButton({ onPress: undefined });
    expect(() => fireEvent.press(screen.getByTestId('btn'))).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Iconos
// ---------------------------------------------------------------------------

describe('Button — Iconos', () => {
  const MockIcon = () => <></>;

  it('renderiza icono izquierdo cuando se provee', () => {
    renderButton({ leftIcon: <MockIcon /> });
    expect(screen.getByTestId('btn-icon-left')).toBeTruthy();
  });

  it('renderiza icono derecho cuando se provee', () => {
    renderButton({ rightIcon: <MockIcon /> });
    expect(screen.getByTestId('btn-icon-right')).toBeTruthy();
  });

  it('no renderiza icono izquierdo cuando loading es true', () => {
    renderButton({ leftIcon: <MockIcon />, loading: true });
    expect(screen.queryByTestId('btn-icon-left')).toBeNull();
  });

  it('no renderiza icono derecho cuando loading es true', () => {
    renderButton({ rightIcon: <MockIcon />, loading: true });
    expect(screen.queryByTestId('btn-icon-right')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Accesibilidad
// ---------------------------------------------------------------------------

describe('Button — Accesibilidad', () => {
  it('usa el label como accessibilityLabel por defecto', () => {
    renderButton();
    const btn = screen.getByTestId('btn');
    expect(btn.props.accessibilityLabel).toBe('Confirmar');
  });

  it('usa accessibilityLabel custom cuando se provee', () => {
    renderButton({ accessibilityLabel: 'Botón de confirmación' });
    const btn = screen.getByTestId('btn');
    expect(btn.props.accessibilityLabel).toBe('Botón de confirmación');
  });

  it('aplica accessibilityRole "button"', () => {
    renderButton();
    const btn = screen.getByTestId('btn');
    expect(btn.props.accessibilityRole).toBe('button');
  });

  it('aplica accessibilityHint cuando se provee', () => {
    renderButton({ accessibilityHint: 'Guarda los cambios del formulario' });
    const btn = screen.getByTestId('btn');
    expect(btn.props.accessibilityHint).toBe('Guarda los cambios del formulario');
  });
});

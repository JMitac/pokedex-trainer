/**
 * @file Input.test.tsx
 * @layer UI / Components / Input / Tests
 *
 * Pruebas unitarias del componente Input.
 * Cubren: renderizado, estados, validación, accesibilidad e interacciones.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Input } from './Input';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

const renderInput = (props = {}) =>
  render(
    <Input
      testID="inp"
      placeholder="Escribe aquí"
      {...props}
    />
  );

// ---------------------------------------------------------------------------
// Renderizado básico
// ---------------------------------------------------------------------------

describe('Input — Renderizado básico', () => {
  it('renderiza el TextInput nativo', () => {
    renderInput();
    expect(screen.getByTestId('inp-input')).toBeTruthy();
  });

  it('renderiza el contenedor raíz con testID', () => {
    renderInput();
    expect(screen.getByTestId('inp')).toBeTruthy();
  });

  it('renderiza sin label cuando no se provee', () => {
    renderInput();
    expect(screen.queryByTestId('inp-label')).toBeNull();
  });

  it('renderiza el label cuando se provee', () => {
    renderInput({ label: 'Nombre completo' });
    expect(screen.getByTestId('inp-label')).toBeTruthy();
    expect(screen.getByText('Nombre completo')).toBeTruthy();
  });

  it('renderiza el asterisco cuando required es true', () => {
    renderInput({ label: 'Email', required: true });
    expect(screen.getByTestId('inp-required')).toBeTruthy();
    expect(screen.getByText('*')).toBeTruthy();
  });

  it('no renderiza asterisco cuando required es false', () => {
    renderInput({ label: 'Email', required: false });
    expect(screen.queryByTestId('inp-required')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Variantes
// ---------------------------------------------------------------------------

describe('Input — Variantes', () => {
  it('renderiza variante "default" sin errores', () => {
    renderInput({ variant: 'default' });
    expect(screen.getByTestId('inp-input')).toBeTruthy();
  });

  it('renderiza variante "filled" sin errores', () => {
    renderInput({ variant: 'filled' });
    expect(screen.getByTestId('inp-input')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Estado: error
// ---------------------------------------------------------------------------

describe('Input — Estado de error', () => {
  it('muestra el mensaje de error cuando se provee', () => {
    renderInput({ error: 'El nombre es requerido' });
    expect(screen.getByTestId('inp-error')).toBeTruthy();
    expect(screen.getByText('El nombre es requerido')).toBeTruthy();
  });

  it('no muestra error cuando error es undefined', () => {
    renderInput();
    expect(screen.queryByTestId('inp-error')).toBeNull();
  });

  it('no muestra hint cuando hay error', () => {
    renderInput({
      error: 'Campo requerido',
      hint: 'Ingresa tu nombre completo',
    });
    expect(screen.getByTestId('inp-error')).toBeTruthy();
    expect(screen.queryByTestId('inp-hint')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Estado: hint
// ---------------------------------------------------------------------------

describe('Input — Hint', () => {
  it('muestra el hint cuando se provee y no hay error', () => {
    renderInput({ hint: 'Mínimo 3 caracteres' });
    expect(screen.getByTestId('inp-hint')).toBeTruthy();
    expect(screen.getByText('Mínimo 3 caracteres')).toBeTruthy();
  });

  it('no muestra hint cuando no se provee', () => {
    renderInput();
    expect(screen.queryByTestId('inp-hint')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Estado: disabled
// ---------------------------------------------------------------------------

describe('Input — disabled', () => {
  it('aplica editable=false cuando disabled es true', () => {
    renderInput({ disabled: true });
    const input = screen.getByTestId('inp-input');
    expect(input.props.editable).toBe(false);
  });

  it('aplica editable=true cuando disabled es false', () => {
    renderInput({ disabled: false });
    const input = screen.getByTestId('inp-input');
    expect(input.props.editable).toBe(true);
  });

  it('aplica accessibilityState.disabled correctamente', () => {
    renderInput({ disabled: true });
    const input = screen.getByTestId('inp-input');
    expect(input.props.accessibilityState.disabled).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Toggle de contraseña
// ---------------------------------------------------------------------------

describe('Input — Password toggle', () => {
  it('muestra el toggle cuando showPasswordToggle es true', () => {
    renderInput({ showPasswordToggle: true });
    expect(screen.getByTestId('inp-password-toggle')).toBeTruthy();
  });

  it('no muestra el toggle cuando showPasswordToggle es false', () => {
    renderInput({ showPasswordToggle: false });
    expect(screen.queryByTestId('inp-password-toggle')).toBeNull();
  });

  it('el input es secureTextEntry por defecto con toggle activo', () => {
    renderInput({ showPasswordToggle: true });
    const input = screen.getByTestId('inp-input');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('alterna secureTextEntry al presionar el toggle', () => {
    renderInput({ showPasswordToggle: true });
    const toggle = screen.getByTestId('inp-password-toggle');

    // Inicialmente oculto
    expect(screen.getByTestId('inp-input').props.secureTextEntry).toBe(true);

    // Presionar para mostrar
    fireEvent.press(toggle);
    expect(screen.getByTestId('inp-input').props.secureTextEntry).toBe(false);

    // Presionar para ocultar de nuevo
    fireEvent.press(toggle);
    expect(screen.getByTestId('inp-input').props.secureTextEntry).toBe(true);
  });

  it('muestra texto "Ver" cuando la contraseña está oculta', () => {
    renderInput({ showPasswordToggle: true });
    expect(screen.getByText('Ver')).toBeTruthy();
  });

  it('muestra texto "Ocultar" cuando la contraseña está visible', () => {
    renderInput({ showPasswordToggle: true });
    fireEvent.press(screen.getByTestId('inp-password-toggle'));
    expect(screen.getByText('Ocultar')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Elementos laterales
// ---------------------------------------------------------------------------

describe('Input — Elementos laterales', () => {
  const MockIcon = () => <></>;

  it('renderiza leftElement cuando se provee', () => {
    renderInput({ leftElement: <MockIcon /> });
    expect(screen.getByTestId('inp-left')).toBeTruthy();
  });

  it('renderiza rightElement cuando se provee', () => {
    renderInput({ rightElement: <MockIcon /> });
    expect(screen.getByTestId('inp-right')).toBeTruthy();
  });

  it('no renderiza rightElement cuando showPasswordToggle es true', () => {
    renderInput({
      rightElement: <MockIcon />,
      showPasswordToggle: true,
    });
    expect(screen.queryByTestId('inp-right')).toBeNull();
    expect(screen.getByTestId('inp-password-toggle')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Interacciones y eventos
// ---------------------------------------------------------------------------

describe('Input — Interacciones', () => {
  it('llama onChangeText cuando el usuario escribe', () => {
    const onChangeText = jest.fn();
    renderInput({ onChangeText });
    fireEvent.changeText(screen.getByTestId('inp-input'), 'Ash Ketchum');
    expect(onChangeText).toHaveBeenCalledWith('Ash Ketchum');
  });

  it('llama onFocus cuando el input recibe foco', () => {
    const onFocus = jest.fn();
    renderInput({ onFocus });
    fireEvent(screen.getByTestId('inp-input'), 'focus');
    expect(onFocus).toHaveBeenCalled();
  });

  it('llama onBlur cuando el input pierde foco', () => {
    const onBlur = jest.fn();
    renderInput({ onBlur });
    fireEvent(screen.getByTestId('inp-input'), 'blur');
    expect(onBlur).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Accesibilidad
// ---------------------------------------------------------------------------

describe('Input — Accesibilidad', () => {
  it('aplica accessibilityLabel con el valor del label', () => {
    renderInput({ label: 'Correo electrónico' });
    const input = screen.getByTestId('inp-input');
    expect(input.props.accessibilityLabel).toBe('Correo electrónico');
  });

  it('aplica accessibilityHint con el hint', () => {
    renderInput({ hint: 'Ingresa un correo válido' });
    const input = screen.getByTestId('inp-input');
    expect(input.props.accessibilityHint).toBe('Ingresa un correo válido');
  });

  it('el toggle de contraseña tiene accessibilityRole button', () => {
    renderInput({ showPasswordToggle: true });
    const toggle = screen.getByTestId('inp-password-toggle');
    expect(toggle.props.accessibilityRole).toBe('button');
  });
});

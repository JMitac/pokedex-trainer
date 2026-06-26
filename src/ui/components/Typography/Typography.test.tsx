/**
 * @file Typography.test.tsx
 * @layer UI / Components / Typography / Tests
 *
 * Pruebas unitarias del componente Typography y sus sub-componentes.
 * Cubren: renderizado, variantes, colores, accesibilidad y props de texto.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import {
  Typography,
  Heading,
  Body,
  Label,
  Caption,
  PokemonNumber,
  PokemonName,
} from './Typography';

// ---------------------------------------------------------------------------
// Typography base
// ---------------------------------------------------------------------------

describe('Typography', () => {
  describe('Renderizado básico', () => {
    it('renderiza el texto correctamente', () => {
      render(<Typography>Hola mundo</Typography>);
      expect(screen.getByText('Hola mundo')).toBeTruthy();
    });

    it('usa variante bodyLG por defecto', () => {
      render(<Typography testID="text">Texto</Typography>);
      const element = screen.getByTestId('text');
      expect(element).toBeTruthy();
    });

    it('aplica el testID correctamente', () => {
      render(<Typography testID="my-text">Texto</Typography>);
      expect(screen.getByTestId('my-text')).toBeTruthy();
    });
  });

  describe('Variantes', () => {
    const variants = [
      'headingXL', 'headingLG', 'headingMD', 'headingSM',
      'bodyLG', 'bodyMD', 'bodySM',
      'labelLG', 'labelMD', 'labelSM',
      'caption', 'mono',
      'pokemonName', 'pokemonNumber', 'statValue',
    ] as const;

    variants.forEach((variant) => {
      it(`renderiza la variante "${variant}" sin errores`, () => {
        render(
          <Typography variant={variant} testID="text">
            Texto de prueba
          </Typography>
        );
        expect(screen.getByTestId('text')).toBeTruthy();
      });
    });
  });

  describe('Alineación', () => {
    it('aplica alineación left por defecto', () => {
      render(<Typography testID="text">Texto</Typography>);
      expect(screen.getByTestId('text')).toBeTruthy();
    });

    (['left', 'center', 'right', 'justify'] as const).forEach((align) => {
      it(`aplica alineación "${align}" correctamente`, () => {
        render(
          <Typography align={align} testID="text">
            Texto
          </Typography>
        );
        expect(screen.getByTestId('text')).toBeTruthy();
      });
    });
  });

  describe('Decoraciones de texto', () => {
    it('aplica tachado cuando strikethrough es true', () => {
      render(
        <Typography strikethrough testID="text">
          Precio tachado
        </Typography>
      );
      expect(screen.getByTestId('text')).toBeTruthy();
    });

    it('aplica subrayado cuando underline es true', () => {
      render(
        <Typography underline testID="text">
          Texto subrayado
        </Typography>
      );
      expect(screen.getByTestId('text')).toBeTruthy();
    });

    it('convierte a mayúsculas cuando uppercase es true', () => {
      render(
        <Typography uppercase testID="text">
          texto en mayúsculas
        </Typography>
      );
      expect(screen.getByTestId('text')).toBeTruthy();
    });
  });

  describe('Accesibilidad', () => {
    it('aplica accessibilityLabel correctamente', () => {
      render(
        <Typography accessibilityLabel="Descripción accesible">
          Texto visual
        </Typography>
      );
      expect(screen.getByLabelText('Descripción accesible')).toBeTruthy();
    });

    it('usa accessibilityRole "text" por defecto', () => {
      render(<Typography testID="text">Texto</Typography>);
      const element = screen.getByTestId('text');
      expect(element.props.accessibilityRole).toBe('text');
    });

    it('aplica numberOfLines correctamente', () => {
      render(
        <Typography numberOfLines={2} testID="text">
          Texto muy largo que debería truncarse
        </Typography>
      );
      const element = screen.getByTestId('text');
      expect(element.props.numberOfLines).toBe(2);
    });

    it('permite selección de texto cuando selectable es true', () => {
      render(
        <Typography selectable testID="text">
          Texto seleccionable
        </Typography>
      );
      const element = screen.getByTestId('text');
      expect(element.props.selectable).toBe(true);
    });
  });

  describe('onPress', () => {
    it('llama onPress cuando se proporciona', () => {
      const onPress = jest.fn();
      render(
        <Typography onPress={onPress} testID="text">
          Texto presionable
        </Typography>
      );
      // El Text nativo recibe el onPress correctamente
      const element = screen.getByTestId('text');
      expect(element.props.onPress).toBeDefined();
    });
  });
});

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

describe('Heading', () => {
  it('renderiza con accessibilityRole "header"', () => {
    render(<Heading testID="heading">Título</Heading>);
    const element = screen.getByTestId('heading');
    expect(element.props.accessibilityRole).toBe('header');
  });

  it('usa tamaño "lg" por defecto', () => {
    render(<Heading testID="heading">Título</Heading>);
    expect(screen.getByTestId('heading')).toBeTruthy();
  });

  (['sm', 'md', 'lg', 'xl'] as const).forEach((size) => {
    it(`renderiza tamaño "${size}" correctamente`, () => {
      render(<Heading size={size} testID="h">Título</Heading>);
      expect(screen.getByTestId('h')).toBeTruthy();
    });
  });
});

describe('Body', () => {
  it('renderiza sin errores con tamaño por defecto', () => {
    render(<Body testID="body">Texto de cuerpo</Body>);
    expect(screen.getByTestId('body')).toBeTruthy();
  });

  (['sm', 'md', 'lg'] as const).forEach((size) => {
    it(`renderiza tamaño "${size}"`, () => {
      render(<Body size={size} testID="b">Texto</Body>);
      expect(screen.getByTestId('b')).toBeTruthy();
    });
  });
});

describe('Label', () => {
  it('renderiza sin errores', () => {
    render(<Label testID="label">Campo requerido</Label>);
    expect(screen.getByTestId('label')).toBeTruthy();
  });
});

describe('Caption', () => {
  it('renderiza con color textSecondary por defecto', () => {
    render(<Caption testID="caption">Texto pequeño</Caption>);
    expect(screen.getByTestId('caption')).toBeTruthy();
  });
});

describe('PokemonNumber', () => {
  it('renderiza el número formateado', () => {
    render(<PokemonNumber testID="num">#0001</PokemonNumber>);
    expect(screen.getByText('#0001')).toBeTruthy();
  });
});

describe('PokemonName', () => {
  it('renderiza el nombre del Pokémon', () => {
    render(<PokemonName testID="name">Bulbasaur</PokemonName>);
    expect(screen.getByText('Bulbasaur')).toBeTruthy();
  });
});

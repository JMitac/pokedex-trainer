/**
 * @file trainerStore.test.ts
 * @layer Features / Trainer / Store / Tests
 *
 * Pruebas unitarias del store de Zustand del Trainer.
 */

import { act } from '@testing-library/react-native';
import { useTrainerStore } from './trainerStore';
import type { TrainerFormData } from '../types/trainer.types';

// ---------------------------------------------------------------------------
// Datos mock
// ---------------------------------------------------------------------------

const mockTrainerData: TrainerFormData = {
  fullName: 'Ash Ketchum',
  age: 10,
  email: 'ash@pokemon.com',
  district: 'Kanto',
  favoritePokemonType: 'Fuego',
};

// ---------------------------------------------------------------------------
// Reset del store antes de cada test
// ---------------------------------------------------------------------------

beforeEach(() => {
  act(() => {
    useTrainerStore.getState().resetTrainer();
  });
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('trainerStore — estado inicial', () => {
  it('trainer es null inicialmente', () => {
    expect(useTrainerStore.getState().trainer).toBeNull();
  });

  it('isRegistered es false inicialmente', () => {
    expect(useTrainerStore.getState().isRegistered).toBe(false);
  });
});

describe('trainerStore — saveTrainer', () => {
  it('guarda los datos del trainer correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
    });

    expect(useTrainerStore.getState().trainer).toEqual(mockTrainerData);
  });

  it('actualiza isRegistered a true al guardar', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
    });

    expect(useTrainerStore.getState().isRegistered).toBe(true);
  });

  it('guarda el nombre correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
    });

    expect(useTrainerStore.getState().trainer?.fullName).toBe('Ash Ketchum');
  });

  it('guarda la edad correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
    });

    expect(useTrainerStore.getState().trainer?.age).toBe(10);
  });

  it('guarda el email correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
    });

    expect(useTrainerStore.getState().trainer?.email).toBe('ash@pokemon.com');
  });

  it('guarda el distrito correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
    });

    expect(useTrainerStore.getState().trainer?.district).toBe('Kanto');
  });

  it('guarda el tipo favorito correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
    });

    expect(useTrainerStore.getState().trainer?.favoritePokemonType).toBe('Fuego');
  });

  it('sobreescribe datos anteriores al guardar de nuevo', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
    });

    const newData: TrainerFormData = {
      ...mockTrainerData,
      fullName: 'Misty',
      district: 'Miraflores',
    };

    act(() => {
      useTrainerStore.getState().saveTrainer(newData);
    });

    expect(useTrainerStore.getState().trainer?.fullName).toBe('Misty');
    expect(useTrainerStore.getState().trainer?.district).toBe('Miraflores');
  });
});

describe('trainerStore — resetTrainer', () => {
  it('resetea trainer a null', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
      useTrainerStore.getState().resetTrainer();
    });

    expect(useTrainerStore.getState().trainer).toBeNull();
  });

  it('resetea isRegistered a false', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
      useTrainerStore.getState().resetTrainer();
    });

    expect(useTrainerStore.getState().isRegistered).toBe(false);
  });

  it('puede guardar datos nuevamente después del reset', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
      useTrainerStore.getState().resetTrainer();
      useTrainerStore.getState().saveTrainer({
        ...mockTrainerData,
        fullName: 'Brock',
      });
    });

    expect(useTrainerStore.getState().trainer?.fullName).toBe('Brock');
    expect(useTrainerStore.getState().isRegistered).toBe(true);
  });
});
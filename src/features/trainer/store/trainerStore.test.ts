/**
 * @file trainerStore.test.ts
 * @layer Features / Trainer / Store / Tests
 *
 * Pruebas unitarias del store de Zustand con persistencia.
 * Cubre: trainer data, foto de perfil, Pokémon inicial y reset.
 */

import { act } from '@testing-library/react-native';
import { useTrainerStore } from './trainerStore';
import type { TrainerFormData } from '../types/trainer.types';
import type { StarterPokemon } from '../types/starter.types';

// ---------------------------------------------------------------------------
// Mock de AsyncStorage
// ---------------------------------------------------------------------------

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
}));

// ---------------------------------------------------------------------------
// Datos mock
// ---------------------------------------------------------------------------

const mockTrainerData: TrainerFormData = {
  fullName: 'Ash Ketchum',
  age: 10,
  email: 'ash@pokemon.com',
  district: 'Kanto',
  favoritePokemonType: 'Fuego',
  motto: '¡Voy a ser el mejor!',
};

const mockStarterPokemon: StarterPokemon = {
  id: 4,
  name: 'charmander',
  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
  types: ['fire'],
  level: 1,
};

const mockStarterBulbasaur: StarterPokemon = {
  id: 1,
  name: 'bulbasaur',
  sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  types: ['grass', 'poison'],
  level: 1,
};

// ---------------------------------------------------------------------------
// Reset antes de cada test
// ---------------------------------------------------------------------------

beforeEach(() => {
  act(() => {
    useTrainerStore.getState().resetTrainer();
  });
});

// ---------------------------------------------------------------------------
// Estado inicial
// ---------------------------------------------------------------------------

describe('trainerStore — estado inicial', () => {
  it('trainer es null inicialmente', () => {
    expect(useTrainerStore.getState().trainer).toBeNull();
  });

  it('isRegistered es false inicialmente', () => {
    expect(useTrainerStore.getState().isRegistered).toBe(false);
  });

  it('profilePhotoUri es null inicialmente', () => {
    expect(useTrainerStore.getState().profilePhotoUri).toBeNull();
  });

  it('starterPokemon es null inicialmente', () => {
    expect(useTrainerStore.getState().starterPokemon).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// saveTrainer
// ---------------------------------------------------------------------------

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

  it('guarda el lema correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
    });
    expect(useTrainerStore.getState().trainer?.motto).toBe('¡Voy a ser el mejor!');
  });

  it('guarda sin lema cuando motto es undefined', () => {
    const { motto, ...withoutMotto } = mockTrainerData;
    act(() => {
      useTrainerStore.getState().saveTrainer(withoutMotto as TrainerFormData);
    });
    expect(useTrainerStore.getState().trainer?.motto).toBeUndefined();
  });

  it('sobreescribe datos anteriores al guardar de nuevo', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
    });
    act(() => {
      useTrainerStore.getState().saveTrainer({
        ...mockTrainerData,
        fullName: 'Misty',
        district: 'Miraflores',
      });
    });
    expect(useTrainerStore.getState().trainer?.fullName).toBe('Misty');
    expect(useTrainerStore.getState().trainer?.district).toBe('Miraflores');
  });
});

// ---------------------------------------------------------------------------
// saveProfilePhoto
// ---------------------------------------------------------------------------

describe('trainerStore — saveProfilePhoto', () => {
  it('guarda la URI de la foto correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveProfilePhoto('file:///path/to/photo.jpg');
    });
    expect(useTrainerStore.getState().profilePhotoUri).toBe('file:///path/to/photo.jpg');
  });

  it('sobreescribe la foto anterior', () => {
    act(() => {
      useTrainerStore.getState().saveProfilePhoto('file:///old-photo.jpg');
    });
    act(() => {
      useTrainerStore.getState().saveProfilePhoto('file:///new-photo.jpg');
    });
    expect(useTrainerStore.getState().profilePhotoUri).toBe('file:///new-photo.jpg');
  });

  it('no afecta el estado de trainer al guardar foto', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
      useTrainerStore.getState().saveProfilePhoto('file:///photo.jpg');
    });
    expect(useTrainerStore.getState().trainer?.fullName).toBe('Ash Ketchum');
    expect(useTrainerStore.getState().profilePhotoUri).toBe('file:///photo.jpg');
  });
});

// ---------------------------------------------------------------------------
// saveStarterPokemon
// ---------------------------------------------------------------------------

describe('trainerStore — saveStarterPokemon', () => {
  it('guarda el Pokémon inicial correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
    });
    expect(useTrainerStore.getState().starterPokemon).toEqual(mockStarterPokemon);
  });

  it('guarda el id del starter correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
    });
    expect(useTrainerStore.getState().starterPokemon?.id).toBe(4);
  });

  it('guarda el nombre del starter correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
    });
    expect(useTrainerStore.getState().starterPokemon?.name).toBe('charmander');
  });

  it('guarda los tipos del starter correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
    });
    expect(useTrainerStore.getState().starterPokemon?.types).toEqual(['fire']);
  });

  it('guarda el nivel inicial como 1', () => {
    act(() => {
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
    });
    expect(useTrainerStore.getState().starterPokemon?.level).toBe(1);
  });

  it('guarda starter con múltiples tipos correctamente', () => {
    act(() => {
      useTrainerStore.getState().saveStarterPokemon(mockStarterBulbasaur);
    });
    expect(useTrainerStore.getState().starterPokemon?.types).toEqual(['grass', 'poison']);
  });

  it('sobreescribe el starter anterior', () => {
    act(() => {
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
    });
    act(() => {
      useTrainerStore.getState().saveStarterPokemon(mockStarterBulbasaur);
    });
    expect(useTrainerStore.getState().starterPokemon?.name).toBe('bulbasaur');
    expect(useTrainerStore.getState().starterPokemon?.id).toBe(1);
  });

  it('no afecta el estado de trainer al guardar starter', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
    });
    expect(useTrainerStore.getState().trainer?.fullName).toBe('Ash Ketchum');
    expect(useTrainerStore.getState().starterPokemon?.name).toBe('charmander');
  });

  it('puede guardar starter sin tener trainer registrado', () => {
    act(() => {
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
    });
    expect(useTrainerStore.getState().starterPokemon?.name).toBe('charmander');
    expect(useTrainerStore.getState().trainer).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// resetTrainer
// ---------------------------------------------------------------------------

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

  it('resetea profilePhotoUri a null', () => {
    act(() => {
      useTrainerStore.getState().saveProfilePhoto('file:///photo.jpg');
      useTrainerStore.getState().resetTrainer();
    });
    expect(useTrainerStore.getState().profilePhotoUri).toBeNull();
  });

  it('resetea starterPokemon a null', () => {
    act(() => {
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
      useTrainerStore.getState().resetTrainer();
    });
    expect(useTrainerStore.getState().starterPokemon).toBeNull();
  });

  it('resetea todos los campos simultáneamente', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
      useTrainerStore.getState().saveProfilePhoto('file:///photo.jpg');
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
      useTrainerStore.getState().resetTrainer();
    });
    const state = useTrainerStore.getState();
    expect(state.trainer).toBeNull();
    expect(state.profilePhotoUri).toBeNull();
    expect(state.starterPokemon).toBeNull();
    expect(state.isRegistered).toBe(false);
  });

  it('puede guardar datos nuevamente después del reset', () => {
    act(() => {
      useTrainerStore.getState().saveTrainer(mockTrainerData);
      useTrainerStore.getState().saveStarterPokemon(mockStarterPokemon);
      useTrainerStore.getState().resetTrainer();
      useTrainerStore.getState().saveTrainer({ ...mockTrainerData, fullName: 'Brock' });
      useTrainerStore.getState().saveStarterPokemon(mockStarterBulbasaur);
    });
    expect(useTrainerStore.getState().trainer?.fullName).toBe('Brock');
    expect(useTrainerStore.getState().starterPokemon?.name).toBe('bulbasaur');
    expect(useTrainerStore.getState().isRegistered).toBe(true);
  });
});

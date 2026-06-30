/**
 * @file trainerStore.ts
 * @layer Features / Trainer / Store
 *
 * Store de Zustand con persistencia.
 * Incluye el Pokémon inicial del entrenador.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TrainerFormData } from '../types/trainer.types';
import type { StarterPokemon } from '../types/starter.types';

// ---------------------------------------------------------------------------
// Tipos del store
// ---------------------------------------------------------------------------

export interface TrainerStoreState {
  trainer: TrainerFormData | null;
  profilePhotoUri: string | null;
  isRegistered: boolean;
  /** Pokémon inicial elegido por el entrenador */
  starterPokemon: StarterPokemon | null;

  saveTrainer: (data: TrainerFormData) => void;
  saveProfilePhoto: (uri: string) => void;
  saveStarterPokemon: (pokemon: StarterPokemon) => void;
  resetTrainer: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useTrainerStore = create<TrainerStoreState>()(
  persist(
    (set) => ({
      trainer: null,
      profilePhotoUri: null,
      isRegistered: false,
      starterPokemon: null,

      saveTrainer: (data: TrainerFormData) =>
        set({ trainer: data, isRegistered: true }),

      saveProfilePhoto: (uri: string) =>
        set({ profilePhotoUri: uri }),

      saveStarterPokemon: (pokemon: StarterPokemon) =>
        set({ starterPokemon: pokemon }),

      resetTrainer: () =>
        set({
          trainer: null,
          profilePhotoUri: null,
          isRegistered: false,
          starterPokemon: null,
        }),
    }),
    {
      name: 'trainer-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        trainer: state.trainer,
        profilePhotoUri: state.profilePhotoUri,
        isRegistered: state.isRegistered,
        starterPokemon: state.starterPokemon,
      }),
    }
  )
);

// Selectores
export const selectTrainer = (state: TrainerStoreState) => state.trainer;
export const selectIsRegistered = (state: TrainerStoreState) => state.isRegistered;
export const selectProfilePhotoUri = (state: TrainerStoreState) => state.profilePhotoUri;
export const selectStarterPokemon = (state: TrainerStoreState) => state.starterPokemon;
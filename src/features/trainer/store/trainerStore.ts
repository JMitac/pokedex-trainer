/**
 * @file trainerStore.ts
 * @layer Features / Trainer / Store
 *
 * Store de Zustand con persistencia mediante AsyncStorage.
 * Los datos del entrenador sobreviven entre sesiones de la app.
 *
 * Flujo:
 * - Al guardar → persiste en AsyncStorage automáticamente
 * - Al abrir la app → Zustand rehidrata el store desde AsyncStorage
 * - Al eliminar → borra del store y de AsyncStorage
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TrainerState, TrainerFormData } from '../types/trainer.types';

// ---------------------------------------------------------------------------
// Store con middleware de persistencia
// ---------------------------------------------------------------------------

export const useTrainerStore = create<TrainerState>()(
  persist(
    (set) => ({
      // -----------------------------------------------------------------------
      // Estado inicial
      // -----------------------------------------------------------------------
      trainer: null,
      isRegistered: false,

      // -----------------------------------------------------------------------
      // Acciones
      // -----------------------------------------------------------------------

      /**
       * Guarda o actualiza los datos del entrenador.
       * Se llama al completar el Step2 (registro o edición).
       * Persiste automáticamente en AsyncStorage.
       */
      saveTrainer: (data: TrainerFormData) =>
        set({
          trainer: data,
          isRegistered: true,
        }),

      /**
       * Elimina el registro del entrenador.
       * Se llama desde el modal de confirmación en TrainerCard.
       * Borra tanto del store como de AsyncStorage.
       */
      resetTrainer: () =>
        set({
          trainer: null,
          isRegistered: false,
        }),
    }),
    {
      name: 'trainer-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir trainer e isRegistered, no las acciones
      partialize: (state) => ({
        trainer: state.trainer,
        isRegistered: state.isRegistered,
      }),
    }
  )
);

// ---------------------------------------------------------------------------
// Selectores
// ---------------------------------------------------------------------------

export const selectTrainer = (state: TrainerState) => state.trainer;
export const selectIsRegistered = (state: TrainerState) => state.isRegistered;
export const selectSaveTrainer = (state: TrainerState) => state.saveTrainer;
export const selectResetTrainer = (state: TrainerState) => state.resetTrainer;

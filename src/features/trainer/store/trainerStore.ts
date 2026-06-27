/**
 * @file trainerStore.ts
 * @layer Features / Trainer / Store
 *
 * Store de Zustand para el carnet del Entrenador.
 * Persiste los datos del formulario multi-paso y
 * los distribuye a la pantalla de resumen (TrainerCard).
 *
 * REGLA: Este es el único store de estado global del Trainer.
 * Las pantallas del formulario leen y escriben aquí.
 * Nunca pasar datos del trainer por parámetros de navegación.
 */

import { create } from 'zustand';
import type { TrainerState, TrainerFormData } from '../types/trainer.types';

export const useTrainerStore = create<TrainerState>((set) => ({
  // ---------------------------------------------------------------------------
  // Estado inicial
  // ---------------------------------------------------------------------------
  trainer: null,
  isRegistered: false,

  // ---------------------------------------------------------------------------
  // Acciones
  // ---------------------------------------------------------------------------

  /**
   * Guarda los datos completos del entrenador.
   * Se llama al completar el Step2 del formulario.
   */
  saveTrainer: (data: TrainerFormData) =>
    set({
      trainer: data,
      isRegistered: true,
    }),

  /**
   * Resetea el store para registrar un nuevo entrenador.
   * Se llama desde el botón "Nuevo entrenador" en TrainerCard.
   */
  resetTrainer: () =>
    set({
      trainer: null,
      isRegistered: false,
    }),
}));

// ---------------------------------------------------------------------------
// Selectores — para acceder a partes específicas del store
// sin re-renders innecesarios
// ---------------------------------------------------------------------------

/** Selector para los datos del trainer */
export const selectTrainer = (state: TrainerState) => state.trainer;

/** Selector para el estado de registro */
export const selectIsRegistered = (state: TrainerState) => state.isRegistered;

/** Selector para la acción de guardar */
export const selectSaveTrainer = (state: TrainerState) => state.saveTrainer;

/** Selector para la acción de reset */
export const selectResetTrainer = (state: TrainerState) => state.resetTrainer;
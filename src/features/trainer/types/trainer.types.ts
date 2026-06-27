/**
 * @file trainer.types.ts
 * @layer Features / Trainer / Types
 *
 * Modelos de dominio para el registro del Entrenador.
 */

// ---------------------------------------------------------------------------
// Opciones del formulario
// ---------------------------------------------------------------------------

export const DISTRICTS = [
  'Ate',
  'Breña',
  'Miraflores',
  'Kanto',
  'Johto',
] as const;

export const POKEMON_TYPES = [
  'Fuego',
  'Agua',
  'Planta',
] as const;

export type District = typeof DISTRICTS[number];
export type FavoritePokemonType = typeof POKEMON_TYPES[number];

// ---------------------------------------------------------------------------
// Datos del formulario por paso
// ---------------------------------------------------------------------------

export interface Step1Data {
  fullName: string;
  age: number;
  email: string;
}

export interface Step2Data {
  district: District;
  favoritePokemonType: FavoritePokemonType;
}

// ---------------------------------------------------------------------------
// Datos completos del Trainer (unión de pasos)
// ---------------------------------------------------------------------------

export interface TrainerFormData extends Step1Data, Step2Data {}

// ---------------------------------------------------------------------------
// Estado del store de Zustand
// ---------------------------------------------------------------------------

export interface TrainerState {
  /** Datos del entrenador guardados al completar el formulario */
  trainer: TrainerFormData | null;

  /** Indica si el carnet ha sido completado */
  isRegistered: boolean;

  /** Guarda los datos del entrenador en el store */
  saveTrainer: (data: TrainerFormData) => void;

  /** Resetea el store para registrar un nuevo entrenador */
  resetTrainer: () => void;
}
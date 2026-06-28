/**
 * @file trainer.types.ts
 * @layer Features / Trainer / Types
 */

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

export interface Step1Data {
  fullName: string;
  age: number;
  email: string;
  /** Lema personal del entrenador — opcional */
  motto?: string;
}

export interface Step2Data {
  district: District;
  favoritePokemonType: FavoritePokemonType;
}

export interface TrainerFormData extends Step1Data, Step2Data {}

export interface TrainerState {
  trainer: TrainerFormData | null;
  /** URI local de la foto de perfil del entrenador */
  profilePhotoUri: string | null;
  isRegistered: boolean;
  saveTrainer: (data: TrainerFormData) => void;
  saveProfilePhoto: (uri: string) => void;
  resetTrainer: () => void;
}
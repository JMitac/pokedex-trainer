/**
 * @file trainer.schemas.ts
 * @layer Features / Trainer / Schemas
 */

import * as yup from 'yup';
import { DISTRICTS, POKEMON_TYPES } from '../types/trainer.types';
import type { District, FavoritePokemonType } from '../types/trainer.types';

export const step1Schema = yup.object({
  fullName: yup
    .string()
    .required('El nombre completo es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    ),

  age: yup
    .number()
    .typeError('La edad debe ser un número')
    .required('La edad es requerida')
    .integer('La edad debe ser un número entero')
    .min(10, 'Debes tener al menos 10 años para ser entrenador')
    .max(99, 'Ingresa una edad válida (máximo 99 años)'),

  email: yup
    .string()
    .required('El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido')
    .max(100, 'El correo no puede exceder 100 caracteres'),

  motto: yup
    .string()
    .optional()
    .max(60, 'El lema no puede exceder 60 caracteres'),
});

export const step2Schema = yup.object({
  district: yup
    .mixed<District>()
    .required('El distrito de origen es requerido')
    .oneOf(
      [...DISTRICTS],
      `El distrito debe ser uno de: ${DISTRICTS.join(', ')}`
    ),

  favoritePokemonType: yup
    .mixed<FavoritePokemonType>()
    .required('El tipo de Pokémon favorito es requerido')
    .oneOf(
      [...POKEMON_TYPES],
      `El tipo debe ser uno de: ${POKEMON_TYPES.join(', ')}`
    ),
});

export const trainerSchema = step1Schema.concat(step2Schema);

export type Step1FormValues = yup.InferType<typeof step1Schema>;
export type Step2FormValues = yup.InferType<typeof step2Schema>;
export type TrainerFormValues = yup.InferType<typeof trainerSchema>;
/**
 * @file trainerStore.ts
 * @layer Features / Trainer / Store
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TrainerState, TrainerFormData } from '../types/trainer.types';

export const useTrainerStore = create<TrainerState>()(
  persist(
    (set) => ({
      trainer: null,
      profilePhotoUri: null,
      isRegistered: false,

      saveTrainer: (data: TrainerFormData) =>
        set({ trainer: data, isRegistered: true }),

      saveProfilePhoto: (uri: string) =>
        set({ profilePhotoUri: uri }),

      resetTrainer: () =>
        set({
          trainer: null,
          profilePhotoUri: null,
          isRegistered: false,
        }),
    }),
    {
      name: 'trainer-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        trainer: state.trainer,
        profilePhotoUri: state.profilePhotoUri,
        isRegistered: state.isRegistered,
      }),
    }
  )
);

export const selectTrainer = (state: TrainerState) => state.trainer;
export const selectIsRegistered = (state: TrainerState) => state.isRegistered;
export const selectProfilePhotoUri = (state: TrainerState) => state.profilePhotoUri;
export const selectSaveTrainer = (state: TrainerState) => state.saveTrainer;
export const selectSaveProfilePhoto = (state: TrainerState) => state.saveProfilePhoto;
export const selectResetTrainer = (state: TrainerState) => state.resetTrainer;
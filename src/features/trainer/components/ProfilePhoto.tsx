/**
 * @file ProfilePhoto.tsx
 * @layer Features / Trainer / Components
 *
 * Avatar del entrenador con botón de edición (ícono lápiz).
 * El ícono de lápiz solo se muestra cuando el entrenador
 * ya tiene sus datos registrados (isRegistered === true).
 *
 * Permite seleccionar foto desde galería o cámara.
 */

import React, { useState } from 'react';
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, borderWidth } from '@/ui/tokens';
import { Body, Caption } from '@/ui/components/Typography';
import { Button } from '@/ui/components/Button';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProfilePhotoProps {
  /** URI de la foto actual */
  photoUri: string | null;
  /** Si es true muestra el ícono de lápiz para editar */
  showEditButton: boolean;
  /** Callback cuando se selecciona una nueva foto */
  onPhotoSelected: (uri: string) => void;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  photoUri,
  showEditButton,
  onPhotoSelected,
  testID,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  // -------------------------------------------------------------------------
  // Permisos y selección de imagen
  // -------------------------------------------------------------------------

  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'Necesitamos acceso a tu cámara para tomar una foto de perfil.',
        [{ text: 'Entendido' }]
      );
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'Necesitamos acceso a tu galería para seleccionar una foto de perfil.',
        [{ text: 'Entendido' }]
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    setShowOptions(false);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images' as const,
        allowsEditing: true,
        aspect: [1, 1] as [number, number],
        quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  const handlePickFromGallery = async () => {
    setShowOptions(false);
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images' as const,
        allowsEditing: true,
        aspect: [1, 1] as [number, number],
        quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <>
      <View style={styles.container} testID={testID}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.avatar}
              resizeMode="cover"
              testID={`${testID}-image`}
            />
          ) : (
            <View style={styles.avatarPlaceholder} testID={`${testID}-placeholder`}>
              <Body style={styles.avatarEmoji}>🧢</Body>
            </View>
          )}

          {/* Botón lápiz — solo si el entrenador está registrado */}
          {showEditButton && (
            <Pressable
              style={styles.editButton}
              onPress={() => setShowOptions(true)}
              accessibilityLabel="Cambiar foto de perfil"
              accessibilityRole="button"
              testID={`${testID}-edit-btn`}
            >
              <Caption style={styles.editIcon}>✏️</Caption>
            </Pressable>
          )}
        </View>
      </View>

      {/* Modal de opciones — cámara o galería */}
      <Modal
        visible={showOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
        testID={`${testID}-options-modal`}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowOptions(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Body style={styles.modalTitle}>Foto de perfil</Body>

            <Button
              label="📷  Tomar foto"
              variant="secondary"
              fullWidth
              onPress={handleTakePhoto}
              testID={`${testID}-camera-btn`}
            />

            <Button
              label="🖼️  Elegir de galería"
              variant="secondary"
              fullWidth
              onPress={handlePickFromGallery}
              style={styles.galleryBtn}
              testID={`${testID}-gallery-btn`}
            />

            <Button
              label="Cancelar"
              variant="ghost"
              fullWidth
              onPress={() => setShowOptions(false)}
              testID={`${testID}-cancel-btn`}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const AVATAR_SIZE = 90;
const EDIT_BTN_SIZE = 28;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: borderRadius.full,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    borderWidth: borderWidth.medium,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: EDIT_BTN_SIZE,
    height: EDIT_BTN_SIZE,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borderWidth.medium,
    borderColor: colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  editIcon: {
    fontSize: 12,
    lineHeight: 14,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.xs,
  },
  modalTitle: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  galleryBtn: {
    marginTop: spacing.xxs,
  },
});

/**
 * @file ConfirmModal.tsx
 * @layer Features / Trainer / Components
 *
 * Modal de confirmación para acciones destructivas.
 * Usado para confirmar la eliminación del carnet.
 */

import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Heading, Body } from '@/ui/components/Typography';
import { Button } from '@/ui/components/Button';
import { colors, spacing, borderRadius } from '@/ui/tokens';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ConfirmModalProps {
  /** Controla la visibilidad del modal */
  visible: boolean;

  /** Título del modal */
  title: string;

  /** Mensaje descriptivo de la acción */
  message: string;

  /** Texto del botón de confirmación */
  confirmLabel: string;

  /** Texto del botón de cancelar */
  cancelLabel?: string;

  /** Variante del botón de confirmación */
  confirmVariant?: 'primary' | 'danger';

  /** Callback al confirmar */
  onConfirm: () => void;

  /** Callback al cancelar o cerrar */
  onCancel: () => void;

  /** ID para pruebas */
  testID?: string;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  testID,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onCancel}
    testID={testID}
    accessibilityViewIsModal
  >
    {/* Overlay oscuro */}
    <Pressable
      style={styles.overlay}
      onPress={onCancel}
      accessibilityLabel="Cerrar modal"
      testID={`${testID}-overlay`}
    >
      {/* Contenido del modal — stopPropagation para no cerrar al tocar adentro */}
      <Pressable
        style={styles.container}
        onPress={(e) => e.stopPropagation()}
        testID={`${testID}-content`}
      >
        {/* Título */}
        <Heading
          size="md"
          align="center"
          style={styles.title}
          testID={`${testID}-title`}
        >
          {title}
        </Heading>

        {/* Mensaje */}
        <Body
          align="center"
          color="textSecondary"
          style={styles.message}
          testID={`${testID}-message`}
        >
          {message}
        </Body>

        {/* Botones */}
        <View style={styles.buttons}>
          <Button
            label={cancelLabel}
            variant="ghost"
            fullWidth
            onPress={onCancel}
            testID={`${testID}-cancel`}
          />
          <Button
            label={confirmLabel}
            variant={confirmVariant}
            fullWidth
            onPress={onConfirm}
            testID={`${testID}-confirm`}
          />
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    marginBottom: spacing.xs,
  },
  message: {
    marginBottom: spacing.xl,
  },
  buttons: {
    gap: spacing.xs,
  },
});

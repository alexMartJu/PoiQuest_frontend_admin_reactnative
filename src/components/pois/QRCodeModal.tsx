import React, { useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Portal, Modal, Divider } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useSnackbarStore } from '@/stores/snackbar.store';
import { ButtonApp } from '@/components/common';
import type { AppTheme } from '@/theme';

interface QRCodeModalProps {
  visible: boolean;
  qrCode: string;
  poiTitle?: string;
  onDismiss: () => void;
}

export function QRCodeModal({ visible, qrCode, poiTitle, onDismiss }: QRCodeModalProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getQRCodeStyles(theme), [theme]);
  const showSnackbar = useSnackbarStore((state) => state.show);
  const qrRef = useRef<any>(null);
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      if (!qrRef.current) {
        throw new Error('No se pudo acceder al componente QR');
      }
      qrRef.current.toDataURL(async (dataURL: string) => {
        try {
          const safeTitle = (poiTitle || 'poi').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
          const fileName = `qr_${safeTitle}_${Date.now()}.png`;
          const filePath = `${FileSystem.cacheDirectory}${fileName}`;
          await FileSystem.writeAsStringAsync(filePath, dataURL, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const canShare = await Sharing.isAvailableAsync();
          if (!canShare) {
            throw new Error('La opción de compartir no está disponible en este dispositivo');
          }
          await Sharing.shareAsync(filePath, {
            mimeType: 'image/png',
            dialogTitle: `QR de ${poiTitle || 'POI'}`,
          });
          showSnackbar({ message: 'QR listo para guardar o compartir', variant: 'success' });
        } catch (err: any) {
          showSnackbar({ message: err?.message || 'No se pudo descargar el QR', variant: 'error' });
        } finally {
          setDownloading(false);
        }
      });
    } catch (error: any) {
      showSnackbar({ message: error?.message || 'No se pudo descargar el QR', variant: 'error' });
      setDownloading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[staticStyles.modal, themed.modal]}
      >
        <View style={[staticStyles.header, themed.header]}>
          <Text variant="titleMedium" style={[staticStyles.headerTitle, themed.headerTitle]} numberOfLines={1}>
            Código QR{poiTitle ? ` — ${poiTitle}` : ''}
          </Text>
          <IconButton
            icon="close"
            size={22}
            onPress={onDismiss}
            iconColor={theme.colors.onSurface}
          />
        </View>

        <View style={staticStyles.body}>
          <View style={[staticStyles.qrContainer, themed.qrContainer]}>
            <QRCode
              value={qrCode}
              size={220}
              color={theme.colors.onBackground}
              backgroundColor={theme.colors.background}
              getRef={(ref) => { qrRef.current = ref; }}
            />
          </View>

          <Divider style={{ marginVertical: 16, width: '100%' }} />

          <Text variant="bodySmall" style={[staticStyles.hint, themed.hint]}>
            Escanea este código con la app de PoiQuest para visualizar el punto de interés en Realidad Aumentada.
          </Text>

          <Text
            variant="labelSmall"
            style={[staticStyles.qrValue, themed.qrValue]}
            numberOfLines={2}
            selectable
          >
            {qrCode}
          </Text>

          <ButtonApp
            mode="contained"
            icon="download"
            onPress={handleDownload}
            loading={downloading}
            disabled={downloading}
            style={staticStyles.downloadButton}
            buttonColor={theme.colors.secondary}
            textColor={theme.colors.onPrimary}
          >
            Descargar QR
          </ButtonApp>
        </View>
      </Modal>
    </Portal>
  );
}

const staticStyles = StyleSheet.create({
  modal: {
    margin: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 6,
  },
  headerTitle: {
    flex: 1,
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
  qrContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
  },
  hint: {
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  qrValue: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.6,
    fontFamily: 'monospace',
  },
  downloadButton: {
    width: '100%',
  },
});

const getQRCodeStyles = (theme: AppTheme) => ({
  modal: {
    backgroundColor: theme.colors.surface,
  },
  header: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  headerTitle: {
    color: theme.colors.onSurface,
    fontWeight: theme.fonts.titleMedium.fontWeight as any,
  },
  qrContainer: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.outlineVariant,
  },
  hint: {
    color: theme.colors.onSurfaceVariant,
  },
  qrValue: {
    color: theme.colors.onSurfaceVariant,
  },
});

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, IconButton, Portal, Modal } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

interface ARViewerModalProps {
  visible: boolean;
  modelUrl: string;
  title?: string;
  onDismiss: () => void;
}

const { width, height } = Dimensions.get('window');

function buildARHtml(modelUrl: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
  <title>Visor 3D</title>
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1a1a2e; height: 100vh; }
    model-viewer {
      width: 100vw;
      height: 100vh;
      background-color: #1a1a2e;
    }
  </style>
</head>
<body>
  <model-viewer
    src="${modelUrl}"
    alt="Modelo 3D del punto de interés"
    camera-controls
    auto-rotate
    shadow-intensity="1"
    environment-image="neutral"
    loading="eager"
    reveal="auto"
  ></model-viewer>
</body>
</html>`;
}

export function ARViewerModal({ visible, modelUrl, title, onDismiss }: ARViewerModalProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getARViewerStyles(theme), [theme]);
  const html = useMemo(() => buildARHtml(modelUrl), [modelUrl]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[staticStyles.modal, themed.modal]}
      >
        <View style={[staticStyles.header, themed.header]}>
          <Text variant="titleMedium" style={[staticStyles.headerTitle, themed.headerTitle]} numberOfLines={1}>
            {title || 'Vista AR'}
          </Text>
          <IconButton
            icon="close"
            size={22}
            onPress={onDismiss}
            iconColor={theme.colors.onSurface}
          />
        </View>
        <View style={staticStyles.webviewContainer}>
          <WebView
            source={{ html }}
            style={staticStyles.webview}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            mixedContentMode="always"
          />
        </View>
      </Modal>
    </Portal>
  );
}

const MODAL_HEIGHT = height * 0.85;

const staticStyles = StyleSheet.create({
  modal: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: MODAL_HEIGHT,
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
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});

const getARViewerStyles = (theme: AppTheme) => ({
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
});

import * as DocumentPicker from 'expo-document-picker';

/**
 * Helper para seleccionar un modelo 3D (.glb o .gltf) desde el dispositivo
 * 
 * @returns El documento seleccionado o null si el usuario canceló
 */
export async function pickModel(): Promise<DocumentPicker.DocumentPickerAsset | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['model/gltf-binary', 'model/gltf+json'], // .glb y .gltf
      copyToCacheDirectory: true,
      multiple: false,
    });

    // El usuario puede cancelar la selección
    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    // Devuelve el documento seleccionado
    return result.assets[0]; // { uri, name, size, mimeType, ... }
  } catch (error) {
    console.error('Error al seleccionar modelo:', error);
    throw new Error('No se pudo seleccionar el archivo');
  }
}

/**
 * Helper genérico para seleccionar cualquier tipo de documento
 * 
 * @param options - Opciones de selección de documento
 * @returns El documento seleccionado o null si el usuario canceló
 */
export async function pickDocument(
  options?: {
    type?: string | string[];
    multiple?: boolean;
  }
): Promise<DocumentPicker.DocumentPickerAsset | DocumentPicker.DocumentPickerAsset[] | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: options?.type || '*/*',
      copyToCacheDirectory: true,
      multiple: options?.multiple || false,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    return options?.multiple ? result.assets : result.assets[0];
  } catch (error) {
    console.error('Error al seleccionar documento:', error);
    throw new Error('No se pudo seleccionar el archivo');
  }
}

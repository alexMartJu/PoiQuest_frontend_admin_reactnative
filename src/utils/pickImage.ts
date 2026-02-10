import * as ImagePicker from 'expo-image-picker';

/**
 * Helper para seleccionar una imagen desde la galería del dispositivo
 * 
 * @returns La imagen seleccionada o null si el usuario canceló
 * @throws Error si no se conceden permisos
 */
export async function pickImageFromLibrary(): Promise<ImagePicker.ImagePickerAsset | null> {
  // Solicita permiso para acceder a la galería
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Se necesitan permisos para acceder a la galería de imágenes');
  }

  // Abre el selector de imágenes del sistema
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.85, // Compresión para reducir tamaño
  });

  // El usuario puede cancelar la selección
  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  // Devuelve la imagen seleccionada
  return result.assets[0]; // { uri, width, height, fileName, ... }
}

/**
 * Helper para tomar una foto con la cámara del dispositivo
 * 
 * @returns La foto tomada o null si el usuario canceló
 * @throws Error si no se conceden permisos
 */
export async function takePhotoWithCamera(): Promise<ImagePicker.ImagePickerAsset | null> {
  // Solicita permiso para acceder a la cámara
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Se necesitan permisos para acceder a la cámara');
  }

  // Abre la cámara
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.85,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return result.assets[0];
}

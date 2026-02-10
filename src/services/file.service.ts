import apiClient from './api.client';
import { FILE_ENDPOINTS } from '@/constants';

// ================== FILE SERVICE ==================

export interface UploadFileResponse {
  message: string;
  fileName: string;
  bucket: string;
  url: string; // Presigned URL válida por 24 horas
}

/**
 * Sube una imagen al backend (MinIO)
 * 
 * @param uri - URI local de la imagen
 * @param fileName - Nombre del archivo (opcional, se genera automáticamente si no se proporciona)
 * @returns Respuesta con fileName, bucket y URL presigned
 */
export async function uploadImage(uri: string, fileName?: string): Promise<UploadFileResponse> {
  const formData = new FormData();

  // Extraer extensión del URI
  const uriParts = uri.split('.');
  const fileExtension = uriParts[uriParts.length - 1]?.toLowerCase() || 'jpg';

  // Determinar el tipo MIME
  let mimeType = 'image/jpeg';
  if (fileExtension === 'png') mimeType = 'image/png';
  else if (fileExtension === 'webp') mimeType = 'image/webp';
  else if (fileExtension === 'gif') mimeType = 'image/gif';

  // Crear el objeto de archivo para FormData
  const file: any = {
    uri,
    name: fileName || `image-${Date.now()}.${fileExtension}`,
    type: mimeType,
  };

  formData.append('file', file);

  // Enviar al backend
  const response = await apiClient.post<UploadFileResponse>(
    FILE_ENDPOINTS.UPLOAD('image'),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Timeout más largo para uploads
      timeout: 60000, // 60 segundos
    }
  );

  return response.data;
}

/**
 * Sube un modelo 3D (.glb o .gltf) al backend (MinIO)
 * 
 * @param uri - URI local del modelo
 * @param fileName - Nombre del archivo
 * @returns Respuesta con fileName, bucket y URL presigned
 */
export async function uploadModel(uri: string, fileName: string): Promise<UploadFileResponse> {
  const formData = new FormData();

  // Determinar tipo MIME según extensión
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'glb';
  const mimeType = fileExtension === 'gltf' ? 'model/gltf+json' : 'model/gltf-binary';

  const file: any = {
    uri,
    name: fileName,
    type: mimeType,
  };

  formData.append('file', file);

  const response = await apiClient.post<UploadFileResponse>(
    FILE_ENDPOINTS.UPLOAD('model'),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 120 segundos (los modelos pueden ser grandes)
    }
  );

  return response.data;
}

/**
 * Elimina una imagen del backend (MinIO)
 * 
 * @param fileName - Nombre del archivo a eliminar
 */
export async function deleteImage(fileName: string): Promise<void> {
  await apiClient.delete(FILE_ENDPOINTS.DELETE('image', fileName));
}

/**
 * Elimina un modelo 3D del backend (MinIO)
 * 
 * @param fileName - Nombre del archivo a eliminar
 */
export async function deleteModel(fileName: string): Promise<void> {
  await apiClient.delete(FILE_ENDPOINTS.DELETE('model', fileName));
}

/**
 * Función genérica para subir cualquier tipo de archivo
 * 
 * @param uri - URI local del archivo
 * @param fileType - Tipo de archivo ('image' o 'model')
 * @param fileName - Nombre del archivo
 * @returns Respuesta con fileName, bucket y URL presigned
 */
export async function uploadFile(
  uri: string,
  fileType: 'image' | 'model',
  fileName?: string
): Promise<UploadFileResponse> {
  if (fileType === 'image') {
    return uploadImage(uri, fileName);
  } else {
    if (!fileName) {
      throw new Error('fileName es requerido para subir modelos');
    }
    return uploadModel(uri, fileName);
  }
}

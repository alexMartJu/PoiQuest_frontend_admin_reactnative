import { z } from 'zod';

// ================== POINT OF INTEREST SCHEMAS ==================

// Schema para crear POI
export const createPoiSchema = z.object({
  eventUuid: z
    .string({ required_error: 'El evento es obligatorio' })
    .uuid('UUID de evento inválido'),
  title: z
    .string({ required_error: 'El título es obligatorio' })
    .min(1, 'El título no puede estar vacío')
    .max(255, 'El título no puede tener más de 255 caracteres')
    .trim(),
  author: z.string().max(255, 'El autor no puede tener más de 255 caracteres').optional().nullable(),
  description: z.string().optional().nullable(),
  interestingData: z
    .string({ required_error: 'Los datos interesantes son obligatorios' })
    .min(1, 'Los datos interesantes no pueden estar vacíos'),
  modelFileName: z
    .string({ required_error: 'El modelo 3D (.glb) es obligatorio' })
    .min(1, 'El modelo 3D (.glb) es obligatorio')
    .max(500),
  coordX: z.number().optional().nullable(),
  coordY: z.number().optional().nullable(),
  imageFileNames: z
    .array(z.string().min(1, 'El nombre de archivo no puede estar vacío'))
    .min(1, 'Debe proporcionar al menos 1 imagen')
    .max(2, 'No puede proporcionar más de 2 imágenes'),
});

export type CreatePoiFormValues = z.infer<typeof createPoiSchema>;

// Schema para editar POI
export const updatePoiSchema = z.object({
  title: z
    .string()
    .min(1, 'El título no puede estar vacío')
    .max(255, 'El título no puede tener más de 255 caracteres')
    .trim()
    .optional(),
  author: z.string().max(255, 'El autor no puede tener más de 255 caracteres').optional().nullable(),
  description: z.string().optional().nullable(),
  interestingData: z
    .string({ required_error: 'Los datos interesantes son obligatorios' })
    .min(1, 'Los datos interesantes no pueden estar vacíos'),
  modelFileName: z
    .string({ required_error: 'El modelo 3D (.glb) es obligatorio' })
    .min(1, 'El modelo 3D (.glb) es obligatorio')
    .max(500),
  coordX: z.number().optional().nullable(),
  coordY: z.number().optional().nullable(),
  imageFileNames: z
    .array(z.string().min(1, 'El nombre de archivo no puede estar vacío'))
    .max(2, 'No puede proporcionar más de 2 imágenes')
    .optional(),
});

export type UpdatePoiFormValues = z.infer<typeof updatePoiSchema>;

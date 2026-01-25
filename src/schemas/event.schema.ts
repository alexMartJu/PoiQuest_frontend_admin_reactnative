import { z } from 'zod';

// ================== EVENT SCHEMAS ==================

// Helper para validar formato de fecha YYYY-MM-DD
const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (debe ser YYYY-MM-DD)');

// Schema para crear evento
export const createEventSchema = z
  .object({
    name: z
      .string({ required_error: 'El nombre es obligatorio' })
      .min(1, 'El nombre no puede estar vacío')
      .max(150, 'El nombre no puede tener más de 150 caracteres')
      .trim(),
    description: z.string().optional().nullable(),
    categoryUuid: z
      .string({ required_error: 'La categoría es obligatoria' })
      .uuid('UUID de categoría inválido'),
    location: z.string().max(255, 'La ubicación no puede tener más de 255 caracteres').optional().nullable(),
    startDate: dateStringSchema,
    endDate: dateStringSchema.optional().nullable(),
    imageUrls: z
      .array(z.string().url('Cada imagen debe ser una URL válida'))
      .min(1, 'Debe proporcionar al menos 1 imagen')
      .max(2, 'No puede proporcionar más de 2 imágenes'),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return data.startDate <= data.endDate;
    },
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      path: ['endDate'],
    },
  );

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

// Schema para editar evento
export const updateEventSchema = z
  .object({
    name: z.string().min(1, 'El nombre no puede estar vacío').max(150, 'El nombre no puede tener más de 150 caracteres').trim().optional(),
    description: z.string().optional().nullable(),
    categoryUuid: z.string().uuid('UUID de categoría inválido').optional(),
    location: z.string().max(255, 'La ubicación no puede tener más de 255 caracteres').optional().nullable(),
    startDate: dateStringSchema.optional(),
    endDate: dateStringSchema.optional().nullable(),
    imageUrls: z
      .array(z.string().url('Cada imagen debe ser una URL válida'))
      .max(2, 'No puede proporcionar más de 2 imágenes')
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.startDate <= data.endDate;
    },
    {
      message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      path: ['endDate'],
    },
  );

export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;

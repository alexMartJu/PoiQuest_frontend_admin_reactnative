import { z } from 'zod';

// ================== ROUTE SCHEMAS ==================

// Schema para crear ruta
export const createRouteSchema = z.object({
  eventUuid: z
    .string({ required_error: 'El evento es obligatorio' })
    .uuid('UUID de evento inválido'),
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío')
    .max(255, 'El nombre no puede tener más de 255 caracteres')
    .trim(),
  description: z.string().optional().nullable(),
  poiUuids: z
    .array(z.string().uuid('UUID de POI inválido'))
    .min(2, 'La ruta debe tener al menos 2 puntos de interés'),
});

export type CreateRouteFormValues = z.infer<typeof createRouteSchema>;

// Schema para editar ruta
export const updateRouteSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre no puede estar vacío')
    .max(255, 'El nombre no puede tener más de 255 caracteres')
    .trim()
    .optional(),
  description: z.string().optional().nullable(),
  poiUuids: z
    .array(z.string().uuid('UUID de POI inválido'))
    .min(2, 'La ruta debe tener al menos 2 puntos de interés')
    .optional(),
});

export type UpdateRouteFormValues = z.infer<typeof updateRouteSchema>;

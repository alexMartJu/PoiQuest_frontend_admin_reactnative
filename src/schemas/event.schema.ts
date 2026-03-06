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
    cityUuid: z
      .string({ required_error: 'La ciudad es obligatoria' })
      .uuid('UUID de ciudad inválido'),
    organizerUuid: z
      .string({ required_error: 'El organizador es obligatorio' })
      .uuid('UUID de organizador inválido'),
    sponsorUuid: z.preprocess(
      (v) => (v === '' ? null : v),
      z.string().uuid('UUID de patrocinador inválido').nullable().optional(),
    ),
    isPremium: z.boolean({ required_error: 'Indica si el evento es premium' }),
    price: z.preprocess(
      (v) => (v == null || v === '' ? null : Number(v)),
      z.number().min(0, 'El precio no puede ser negativo').nullable().optional(),
    ),
    capacityPerDay: z.preprocess(
      (v) => (v == null || v === '' ? null : Number(v)),
      z.number().int().positive('La capacidad debe ser un entero positivo').nullable().optional(),
    ),
    startDate: dateStringSchema,
    endDate: dateStringSchema.optional().nullable(),
    imageFileNames: z
      .array(z.string().min(1, 'El nombre de archivo no puede estar vacío'))
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
  )
  .refine(
    (data) => {
      if (!data.isPremium) return true;
      return data.price != null && data.price >= 0;
    },
    {
      message: 'Los eventos premium deben tener un precio',
      path: ['price'],
    },
  );

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

// Schema para editar evento
export const updateEventSchema = z
  .object({
    name: z.string().min(1, 'El nombre no puede estar vacío').max(150, 'El nombre no puede tener más de 150 caracteres').trim().optional(),
    description: z.string().optional().nullable(),
    categoryUuid: z.string().uuid('UUID de categoría inválido').optional(),
    cityUuid: z.string().uuid('UUID de ciudad inválido').optional(),
    organizerUuid: z.string().uuid('UUID de organizador inválido').optional(),
    sponsorUuid: z.preprocess(
      (v) => (v === '' ? null : v),
      z.string().uuid('UUID de patrocinador inválido').nullable().optional(),
    ),
    isPremium: z.boolean().optional(),
    price: z.preprocess(
      (v) => (v == null || v === '' ? null : Number(v)),
      z.number().min(0, 'El precio no puede ser negativo').nullable().optional(),
    ),
    capacityPerDay: z.preprocess(
      (v) => (v == null || v === '' ? null : Number(v)),
      z.number().int().positive('La capacidad debe ser un entero positivo').nullable().optional(),
    ),
    startDate: dateStringSchema.optional(),
    endDate: dateStringSchema.optional().nullable(),
    imageFileNames: z
      .array(z.string().min(1, 'El nombre de archivo no puede estar vacío'))
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


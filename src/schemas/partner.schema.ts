import { z } from 'zod';
import { OrganizerType } from '@/types/Partner';

// ================== CITY SCHEMAS ==================

export const createCitySchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío')
    .max(150, 'El nombre no puede tener más de 150 caracteres')
    .trim(),
  country: z
    .string({ required_error: 'El país es obligatorio' })
    .min(1, 'El país no puede estar vacío')
    .max(100, 'El país no puede tener más de 100 caracteres')
    .trim(),
  region: z.string().max(150, 'La región no puede tener más de 150 caracteres').optional().nullable(),
  description: z.string().optional().nullable(),
});

export type CreateCityFormValues = z.infer<typeof createCitySchema>;

export const updateCitySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre no puede estar vacío')
    .max(150, 'El nombre no puede tener más de 150 caracteres')
    .trim()
    .optional(),
  country: z
    .string()
    .min(1, 'El país no puede estar vacío')
    .max(100, 'El país no puede tener más de 100 caracteres')
    .trim()
    .optional(),
  region: z.string().max(150, 'La región no puede tener más de 150 caracteres').optional().nullable(),
  description: z.string().optional().nullable(),
});

export type UpdateCityFormValues = z.infer<typeof updateCitySchema>;

// ================== ORGANIZER SCHEMAS ==================

export const createOrganizerSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío')
    .max(200, 'El nombre no puede tener más de 200 caracteres')
    .trim(),
  type: z.nativeEnum(OrganizerType, { required_error: 'El tipo es obligatorio' }),
  contactEmail: z
    .string({ required_error: 'El email de contacto es obligatorio' })
    .email('Email de contacto inválido'),
  contactPhone: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  imageFileNames: z
    .array(z.string().min(1))
    .min(1, 'Debe proporcionar al menos 1 imagen')
    .max(2, 'No puede proporcionar más de 2 imágenes'),
});

export type CreateOrganizerFormValues = z.infer<typeof createOrganizerSchema>;

export const updateOrganizerSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre no puede estar vacío')
    .max(200, 'El nombre no puede tener más de 200 caracteres')
    .trim()
    .optional(),
  type: z.nativeEnum(OrganizerType).optional(),
  contactEmail: z.string().email('Email de contacto inválido').optional(),
  contactPhone: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  imageFileNames: z
    .array(z.string().min(1))
    .max(2, 'No puede proporcionar más de 2 imágenes')
    .optional(),
});

export type UpdateOrganizerFormValues = z.infer<typeof updateOrganizerSchema>;

// ================== SPONSOR SCHEMAS ==================

export const createSponsorSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío')
    .max(200, 'El nombre no puede tener más de 200 caracteres')
    .trim(),
  websiteUrl: z
    .string()
    .url('URL de sitio web inválida')
    .optional()
    .nullable()
    .or(z.literal('')),
  contactEmail: z.string().email('Email de contacto inválido').optional().nullable(),
  description: z.string().optional().nullable(),
  imageFileNames: z
    .array(z.string().min(1))
    .min(1, 'Debe proporcionar al menos 1 imagen')
    .max(2, 'No puede proporcionar más de 2 imágenes'),
});

export type CreateSponsorFormValues = z.infer<typeof createSponsorSchema>;

export const updateSponsorSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre no puede estar vacío')
    .max(200, 'El nombre no puede tener más de 200 caracteres')
    .trim()
    .optional(),
  websiteUrl: z
    .string()
    .url('URL de sitio web inválida')
    .optional()
    .nullable()
    .or(z.literal('')),
  contactEmail: z.string().email('Email de contacto inválido').optional().nullable(),
  description: z.string().optional().nullable(),
  imageFileNames: z
    .array(z.string().min(1))
    .max(2, 'No puede proporcionar más de 2 imágenes')
    .optional(),
});

export type UpdateSponsorFormValues = z.infer<typeof updateSponsorSchema>;

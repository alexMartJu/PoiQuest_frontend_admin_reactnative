import { z } from 'zod';

// ================== AUTH SCHEMAS ==================

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('Email no válido')
    .trim(),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(12, 'La contraseña debe tener al menos 12 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

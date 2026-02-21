import { z } from 'zod';

// ================== USER SCHEMAS ==================

// Schema para registrar un ticket_validator (solo admin)
export const registerValidatorSchema = z
  .object({
    name: z
      .string({ required_error: 'El nombre es obligatorio' })
      .min(1, 'El nombre no puede estar vacío')
      .max(100, 'El nombre no puede tener más de 100 caracteres')
      .trim(),
    lastname: z
      .string({ required_error: 'Los apellidos son obligatorios' })
      .min(1, 'Los apellidos no pueden estar vacíos')
      .max(150, 'Los apellidos no pueden tener más de 150 caracteres')
      .trim(),
    email: z
      .string({ required_error: 'El email es obligatorio' })
      .email('Introduce un email válido')
      .trim(),
    password: z
      .string({ required_error: 'La contraseña es obligatoria' })
      .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string({ required_error: 'Confirma la contraseña' }),
    avatarUrl: z
      .string()
      .url('Introduce una URL de avatar válida')
      .max(255, 'La URL no puede tener más de 255 caracteres')
      .optional()
      .or(z.literal('')),
    bio: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterValidatorFormValues = z.infer<typeof registerValidatorSchema>;

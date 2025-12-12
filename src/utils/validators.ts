// ================== VALIDADORES ==================

/**
 * Valida el formato de un email
 */
export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return 'El email es obligatorio';
  if (!emailRegex.test(email)) return 'El formato del email no es válido';
  return '';
};

/**
 * Valida que la contraseña cumpla los requisitos mínimos
 */
export const validatePassword = (password: string): string => {
  if (!password.trim()) return 'La contraseña es obligatoria';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return '';
};

/**
 * Valida que la contraseña sea fuerte (mayúsculas, minúsculas y números)
 */
export const validateStrongPassword = (password: string): boolean => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasMinLength = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumbers && hasMinLength;
};

/**
 * Valida los datos del formulario de login
 */
export const validateLoginForm = (email: string, password: string): {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
} => {
  const errors: { email?: string; password?: string } = {};

  // Validar email y contraseña usando validadores que devuelven mensajes
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitiza el input del usuario
 */
export const sanitizeInput = (input: string): string => {
  return input.trim();
};

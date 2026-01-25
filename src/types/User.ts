// ================== USER TYPES ==================

export interface User {
  userId: number;
  name: string;
  lastname: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  roles: string[];
}

export interface AuthResponse {
  accessToken?: string | null;
  refreshToken?: string | null;
  userId: number;
  name: string;
  lastname: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  roles: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

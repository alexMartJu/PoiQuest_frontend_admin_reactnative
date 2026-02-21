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

// ================== BACKEND USER TYPES (Admin) ==================

export enum UserStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export interface ProfileSummary {
  uuid: string;
  name: string | null;
  lastname: string | null;
  avatarUrl: string | null;
  level: number;
  totalPoints: number;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface BackendUser {
  id: number;
  email: string;
  status: UserStatus;
  roles: UserRole[];
  profile: ProfileSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterValidatorDto {
  name: string;
  lastname: string;
  email: string;
  password: string;
  avatarUrl?: string;
  bio?: string;
}

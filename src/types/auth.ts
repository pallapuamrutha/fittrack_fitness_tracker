/**
 * Authentication and User Types for FitTrack
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string; // ISO string
  avatarColor?: string;
}

export interface UserRecord extends User {
  passwordHash: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

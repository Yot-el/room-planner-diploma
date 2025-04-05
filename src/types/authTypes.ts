// src/types/authTypes.ts
export interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
    role: string;
    createdAt: Date
  }

export interface FormData {
  name: string;
  email: string;
  photo?: string;
  role: 'user' | 'admin';
  password: string;
  passwordConfirmation: string;
}

export interface AuthToken {
    token: string;
  }

export interface SignupData {
    name: string;
    email: string;
    password: string;
    role: string;
    passwordConfirmation: string;
    photo?: File | null;
  }

export interface LoginCredentials {
    email: string;
    password: string;
  }

export interface PasswordResetData {
    password: string;
    passwordConfirmation: string;
  }

export interface PasswordUpdateData {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
  }
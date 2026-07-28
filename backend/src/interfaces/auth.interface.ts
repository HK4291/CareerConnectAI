import { Role } from "@prisma/client";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
  companyId?: string;
}

export interface VerifyEmailDto {
  email: string;
  otp: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface LogoutDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  otp: string;
  newPassword: string;
}

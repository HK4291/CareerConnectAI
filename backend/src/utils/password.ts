import bcrypt from "bcrypt";
import { env } from "../config/env";

/**
 * Hash a plain text password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
};

/**
 * Compare password with stored hash
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const compareOtp = async (
  otp: string,
  newotp: string,
): Promise<boolean> => {
  return otp === newotp;
};

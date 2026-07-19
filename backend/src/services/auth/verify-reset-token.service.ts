import ApiError from "../../utils/ApiError";
import { authRepository } from "../../repositories/auth.repository";

class VerifyResetTokenService {
  async execute(token: string) {
    const resetToken = await authRepository.findPasswordResetToken(token);

    if (!resetToken) {
      throw new ApiError(400, "Invalid reset token");
    }

    if (resetToken.expiresAt < new Date()) {
      throw new ApiError(400, "Reset token has expired");
    }

    return {
      valid: true,
      email: resetToken.user.email,
    };
  }
}

export const verifyResetTokenService = new VerifyResetTokenService();

import { compareOtp, hashPassword } from "../../utils/password";
import ApiError from "../../utils/ApiError";
import { authRepository } from "../../repositories/auth.repository";
import { ResetPasswordDto } from "../../interfaces/auth.interface";
import { OTPPurpose } from "@prisma/client";

class ResetPasswordService {
  async execute(data: ResetPasswordDto) {
    const resetToken = await authRepository.findPasswordResetToken(data.token);

    if (!resetToken) {
      throw new ApiError(400, "Invalid reset token");
    }

    if (resetToken.expiresAt < new Date()) {
      throw new ApiError(400, "Reset token has expired");
    }

    const user = resetToken.user;

    const otpRecord = await authRepository.findOTP(
      user.id,
      OTPPurpose.PASSWORD_RESET,
    );

    if (!otpRecord) {
      throw new ApiError(400, "OTP not found");
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new ApiError(400, "OTP has expired");
    }

    if (otpRecord.verified) {
      throw new ApiError(400, "OTP already used");
    }

    const isOtpValid = await compareOtp(data.otp, otpRecord.otp);

    if (!isOtpValid) {
      throw new ApiError(400, "Invalid OTP");
    }

    // 3. Hash New Password
    const passwordHash = await hashPassword(data.newPassword);

    // 4. Update Password
    await authRepository.updatePassword(user.id, passwordHash);

    // 5. Mark OTP Verified
    await authRepository.verifyOTP(otpRecord.id);

    // 6. Delete Reset Token
    await authRepository.deletePasswordResetToken(resetToken.id);

    // 7. Logout From Every Device
    await authRepository.revokeAllRefreshTokens(user.id);

    return {
      message: "Password reset successfully.",
    };
  }
}

export const resetPasswordService = new ResetPasswordService();

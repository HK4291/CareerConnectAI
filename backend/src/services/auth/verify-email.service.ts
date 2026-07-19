import { OTPPurpose } from "@prisma/client";
import ApiError from "../../utils/ApiError";
import { authRepository } from "../../repositories/auth.repository";
import { VerifyEmailDto } from "../../interfaces/auth.interface";
import { emailService, EmailSubject, EmailTemplates } from "../email";
import { authTokenService } from "./auth-token.service";

class VerifyEmailService {
  async execute(data: VerifyEmailDto) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400, "Email already verified");
    }

    const otpRecord = await authRepository.findOTP(
      user.id,
      OTPPurpose.EMAIL_VERIFICATION,
    );

    if (!otpRecord) {
      throw new ApiError(404, "OTP not found");
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new ApiError(400, "OTP has expired");
    }

    if (otpRecord.otp !== data.otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    await authRepository.verifyOTP(otpRecord.id);

    await authRepository.markUserVerified(user.id);

    const { accessToken, refreshToken } = await authTokenService.generate(user);

    await emailService.sendMail({
      to: user.email,

      subject: EmailSubject.ACCOUNT_CREATED,

      html: EmailTemplates.welcome(user.name),
    });

    return {
      message: "Email verified successfully",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export const verifyEmailService = new VerifyEmailService();

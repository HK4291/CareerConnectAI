import crypto from "crypto";

import { ForgotPasswordDto } from "../../interfaces/auth.interface";
import { authRepository } from "../../repositories/auth.repository";
import { emailService } from "../email/email.service";
import { EmailSubject } from "../../constants/email.constants";
import { EmailTemplates } from "../email/email.template";
import { OTPPurpose } from "@prisma/client";

class ForgotPasswordService {
  async execute(data: ForgotPasswordDto) {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      return {
        message: "No such account exists, Please sign up.",
      };
    }

    const existingToken = await authRepository.findPasswordResetTokenByUserId(
      user.id,
    );

    if (existingToken) {
      await authRepository.deletePasswordResetToken(existingToken.id);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await authRepository.createPasswordResetToken({
      token: resetToken,
      expiresAt,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    const otp = crypto.randomInt(100000, 999999).toString();

    await authRepository.createOTP({
      otp,
      purpose: OTPPurpose.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    await emailService.sendMail({
      to: user.email,

      subject: EmailSubject.RESET_PASSWORD,

      html: EmailTemplates.resetPassword(user.name, otp),
    });

    return {
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  }
}

export const forgotPasswordService = new ForgotPasswordService();

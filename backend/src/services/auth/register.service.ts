import crypto from "crypto";
import { Role } from "@prisma/client";

import { authRepository } from "../../repositories/auth.repository";
import { hashPassword } from "../../utils/password";
import ApiError from "../../utils/ApiError";
import { RegisterDto } from "../../interfaces/auth.interface";
import { OTPPurpose } from "@prisma/client";
import { EmailTemplates } from "../email/email.template";
import { emailService } from "../email/email.service";
import { EmailSubject } from "../../constants/email.constants";

export class RegisterService {
  async execute(data: RegisterDto) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "Email already registered");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await authRepository.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: data.role ?? Role.CANDIDATE,
    });

    if (user.role === Role.CANDIDATE) {
      await authRepository.createCandidate(user.id);
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await authRepository.createOTP({
      otp,
      purpose: OTPPurpose.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    await emailService.sendMail({
      to: user.email,

      subject: EmailSubject.ACCOUNT_CREATED,

      html: EmailTemplates.otp(user.name, otp),
    });

    return {
      userId: user.id,
      email: user.email,
      message: "Registration successful. Please verify your email.",
    };
  }
}

export const registerService = new RegisterService();

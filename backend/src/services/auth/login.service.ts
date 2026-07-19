import { UserStatus } from "@prisma/client";

import { LoginDto } from "../../interfaces/auth.interface";
import { authRepository } from "../../repositories/auth.repository";
import { comparePassword } from "../../utils/password";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import ApiError from "../../utils/ApiError";
import { authTokenService } from "./auth-token.service";

class LoginService {
  async execute(data: LoginDto) {
    const user = await authRepository.findUserByEmail(data.email);
    console.log(user);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.passwordHash) {
      throw new ApiError(400, "Please login using Google");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ApiError(403, "Account is inactive");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please verify your email first");
    }

    const isPasswordCorrect = await comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await authTokenService.generate(user);

    return {
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

export const loginService = new LoginService();

import { User } from "@prisma/client";

import { authRepository } from "../../repositories/auth.repository";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

class AuthTokenService {
  async generate(user: User) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    await authRepository.createRefreshToken({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    await authRepository.updateLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }
}

export const authTokenService = new AuthTokenService();

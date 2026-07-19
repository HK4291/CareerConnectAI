import { RefreshTokenDto } from "../../interfaces/auth.interface";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { authRepository } from "../../repositories/auth.repository";
import ApiError from "../../utils/ApiError";

class RefreshTokenService {
  async execute(data: RefreshTokenDto) {
    const payload = verifyRefreshToken(data.refreshToken);

    const storedToken = await authRepository.findRefreshToken(
      data.refreshToken,
    );

    if (!storedToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (storedToken.revoked) {
      throw new ApiError(401, "Refresh token revoked");
    }

    if (storedToken.expiresAt < new Date()) {
      throw new ApiError(401, "Refresh token expired");
    }

    const newPayload = {
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    };

    const accessToken = generateAccessToken(newPayload);

    const refreshToken = generateRefreshToken(newPayload);

    await authRepository.revokeRefreshToken(data.refreshToken);

    await authRepository.createRefreshToken({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user: {
        connect: {
          id: storedToken.user.id,
        },
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export const refreshTokenService = new RefreshTokenService();

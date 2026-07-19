import { LogoutDto } from "../../interfaces/auth.interface";
import ApiError from "../../utils/ApiError";
import { authRepository } from "../../repositories/auth.repository";

class LogoutService {
  async execute(data: LogoutDto) {
    const token = await authRepository.findRefreshToken(data.refreshToken);

    if (!token) {
      throw new ApiError(404, "Refresh token not found");
    }

    if (token.revoked) {
      throw new ApiError(400, "Already logged out");
    }

    await authRepository.revokeRefreshToken(data.refreshToken);

    return {
      message: "Logout successful",
    };
  }
}

export const logoutService = new LogoutService();

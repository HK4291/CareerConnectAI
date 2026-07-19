import { Prisma, User, OTPPurpose } from "@prisma/client";
import { prisma } from "../config/prisma";

class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findUserByGoogleId(googleId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        googleId,
      },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });
  }

  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findOTP(userId: string, purpose: OTPPurpose) {
    return prisma.oTPVerification.findFirst({
      where: {
        userId,
        purpose,
        verified: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async verifyOTP(id: string) {
    return prisma.oTPVerification.update({
      where: {
        id,
      },
      data: {
        verified: true,
      },
    });
  }

  async markUserVerified(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
      },
    });
  }

  async createOTP(data: Prisma.OTPVerificationCreateInput) {
    return prisma.oTPVerification.create({
      data,
    });
  }

  async createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    return prisma.refreshToken.create({
      data,
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: {
        token,
      },

      include: {
        user: true,
      },
    });
  }

  async revokeRefreshToken(token: string) {
    return prisma.refreshToken.update({
      where: {
        token,
      },

      data: {
        revoked: true,
      },
    });
  }

  async revokeAllRefreshTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
      },

      data: {
        revoked: true,
      },
    });
  }

  async createPasswordResetToken(data: Prisma.PasswordResetTokenCreateInput) {
    return prisma.passwordResetToken.create({
      data,
    });
  }

  async findPasswordResetToken(token: string) {
    return prisma.passwordResetToken.findUnique({
      where: {
        token,
      },

      include: {
        user: true,
      },
    });
  }

  async deletePasswordResetToken(token: string) {
    return prisma.passwordResetToken.delete({
      where: {
        token,
      },
    });
  }

  async findPasswordResetTokenByUserId(userId: string) {
    return prisma.passwordResetToken.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createCandidate(userId: string) {
    return prisma.candidate.create({
      data: {
        userId,
        profileCompletion: 0,
      },
    });
  }
}

export const authRepository = new AuthRepository();

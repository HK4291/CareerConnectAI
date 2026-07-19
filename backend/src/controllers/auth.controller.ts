import asyncHandler from "../middlewares/asyncHandler";
import { registerService } from "../services/auth/register.service";
import { verifyEmailService } from "../services/auth/verify-email.service";
import { loginService } from "../services/auth/login.service";
import { refreshTokenService } from "../services/auth/refresh.service";
import sendResponse from "../utils/sendResponse";
import { logoutService } from "../services/auth/logout.service";
import { resetPasswordService } from "../services/auth/reset-password.service";
import { verifyResetTokenService } from "../services/auth/verify-reset-token.service";
import { forgotPasswordService } from "../services/auth/forgot-password.service";

export const register = asyncHandler(async (req, res) => {
  const result = await registerService.execute(req.body);

  return sendResponse(res, {
    statusCode: 201,
    message: result.message,
    data: result,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await verifyEmailService.execute(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, {
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginService.execute(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, {
    statusCode: 200,
    message: "Login Successful",
    data: result.user,
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const result = await refreshTokenService.execute(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, {
    statusCode: 200,
    message: "Token Refreshed",
    data: result,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const result = await logoutService.execute(req.body);

  return sendResponse(res, {
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await forgotPasswordService.execute(req.body);

  // return res.status(200).json(new ApiResponse(true, result.message, null));
  return sendResponse(res, {
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await resetPasswordService.execute(req.body);

  // return res.status(200).json(new ApiResponse(true, result.message, null));
  return sendResponse(res, {
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

export const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const result = await verifyResetTokenService.execute(token as string);

  return sendResponse(res, {
    statusCode: 200,
    message: "token succesfully verified",
    data: null,
  });
});

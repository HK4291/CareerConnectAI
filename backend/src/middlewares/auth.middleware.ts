import { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../utils/jwt";
import { authRepository } from "../repositories/auth.repository";
import ApiError from "../utils/ApiError";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ApiError(401, "Authorization header missing"));
  }

  if (!authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Invalid authorization header"));
  }

  const token = authHeader.split(" ")[1];

  const payload = verifyAccessToken(token);

  const user = await authRepository.findUserById(payload.userId);

  if (!user) {
    return next(new ApiError(401, "User not found"));
  }

  req.user = user;

  next();
};

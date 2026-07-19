import { Response } from "express";
import { ApiResponse } from "../types/apiResponse";

interface SendResponseOptions<T> {
  statusCode: number;
  message: string;
  data?: T;
}

const sendResponse = <T>(
  res: Response,
  options: SendResponseOptions<T>,
): Response<ApiResponse<T | null>> => {
  const { statusCode, message, data } = options;

  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data: data ?? null,
  });
};

export default sendResponse;

import asyncHandler from "../middlewares/asyncHandler";

import sendResponse from "../utils/sendResponse";

import { candidateService } from "../services/candidate/candidate.service";

import { updateCandidateSchema } from "../dto/candidate.dto";
import ApiError from "../utils/ApiError";

/**
 * GET /candidate/me
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const profile = await candidateService.getMyProfile(req.user.id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Candidate profile fetched successfully.",
    data: profile,
  });
});

/**
 * PATCH /candidate
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const validatedData = updateCandidateSchema.parse(req.body);
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const profile = await candidateService.updateProfile(
    req.user.id,
    validatedData,
  );

  return sendResponse(res, {
    statusCode: 200,
    message: "Candidate profile updated successfully.",
    data: profile,
  });
});

/**
 * DELETE /candidate
 */
export const deleteProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  await candidateService.deleteProfile(req.user.id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Candidate profile deleted successfully.",
    data: null,
  });
});

/**
 * GET /candidate/stats
 */
export const getProfileStats = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const stats = await candidateService.getProfileStats(req.user.id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Candidate statistics fetched successfully.",
    data: stats,
  });
});

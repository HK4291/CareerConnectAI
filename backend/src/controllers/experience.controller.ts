import asyncHandler from "../middlewares/asyncHandler";

import sendResponse from "../utils/sendResponse";

import { experienceService } from "../services/experience/experience.service";

import {
  createExperienceSchema,
  updateExperienceSchema,
  experienceIdParamSchema,
} from "../dto/experience.dto";

/**
 * POST /experience
 */
export const createExperience = asyncHandler(async (req, res) => {
  const validatedData = createExperienceSchema.parse(req.body);

  const experience = await experienceService.createExperience(
    req.user!.id,
    validatedData,
  );

  return sendResponse(res, {
    statusCode: 201,
    message: "Experience added successfully.",
    data: experience,
  });
});

/**
 * GET /experience
 */
export const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await experienceService.getExperiences(req.user!.id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Experiences fetched successfully.",
    data: experiences,
  });
});

/**
 * PATCH /experience/:id
 */
export const updateExperience = asyncHandler(async (req, res) => {
  const { id } = experienceIdParamSchema.parse(req.params);

  const validatedData = updateExperienceSchema.parse(req.body);

  const experience = await experienceService.updateExperience(
    req.user!.id,
    id,
    validatedData,
  );

  return sendResponse(res, {
    statusCode: 200,
    message: "Experience updated successfully.",
    data: experience,
  });
});

/**
 * DELETE /experience/:id
 */
export const deleteExperience = asyncHandler(async (req, res) => {
  const { id } = experienceIdParamSchema.parse(req.params);

  await experienceService.deleteExperience(req.user!.id, id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Experience deleted successfully.",
    data: null,
  });
});

import asyncHandler from "../middlewares/asyncHandler";

import sendResponse from "../utils/sendResponse";

import { educationService } from "../services/education/education.service";

import {
  createEducationSchema,
  updateEducationSchema,
  educationIdParamSchema,
} from "../dto/education.dto";

/**
 * POST /education
 */
export const createEducation = asyncHandler(async (req, res) => {
  const validatedData = createEducationSchema.parse(req.body);

  const education = await educationService.createEducation(
    req.user!.id,
    validatedData,
  );

  return sendResponse(res, {
    statusCode: 201,
    message: "Education added successfully.",
    data: education,
  });
});

/**
 * GET /education
 */
export const getEducations = asyncHandler(async (req, res) => {
  const educations = await educationService.getEducations(req.user!.id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Education records fetched successfully.",
    data: educations,
  });
});

/**
 * PATCH /education/:id
 */
export const updateEducation = asyncHandler(async (req, res) => {
  const { id } = educationIdParamSchema.parse(req.params);

  const validatedData = updateEducationSchema.parse(req.body);

  const education = await educationService.updateEducation(
    req.user!.id,
    id,
    validatedData,
  );

  return sendResponse(res, {
    statusCode: 200,
    message: "Education updated successfully.",
    data: education,
  });
});

/**
 * DELETE /education/:id
 */
export const deleteEducation = asyncHandler(async (req, res) => {
  const { id } = educationIdParamSchema.parse(req.params);

  await educationService.deleteEducation(req.user!.id, id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Education deleted successfully.",
    data: null,
  });
});

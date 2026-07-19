import asyncHandler from "../middlewares/asyncHandler";

import sendResponse from "../utils/sendResponse";

import { skillService } from "../services/skills/skills.service";

import {
  createSkillSchema,
  updateSkillSchema,
  skillIdSchema,
} from "../dto/skills.dto";

/**
 * POST /skills
 */
export const createSkill = asyncHandler(async (req, res) => {
  const validatedData = createSkillSchema.parse(req.body);

  const skill = await skillService.createSkill(req.user!.id, validatedData);

  return sendResponse(res, {
    statusCode: 201,
    message: "Skill added successfully.",
    data: skill,
  });
});

/**
 * GET /skills
 */
export const getSkills = asyncHandler(async (req, res) => {
  const skills = await skillService.getSkills(req.user!.id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Skills fetched successfully.",
    data: skills,
  });
});

/**
 * PATCH /skills/:id
 */
export const updateSkill = asyncHandler(async (req, res) => {
  const { id } = skillIdSchema.parse(req.params);
  console.log("fetched id", id);

  const validatedData = updateSkillSchema.parse(req.body);

  const skill = await skillService.updateSkill(req.user!.id, id, validatedData);

  return sendResponse(res, {
    statusCode: 200,
    message: "Skill updated successfully.",
    data: skill,
  });
});

/**
 * DELETE /skills/:id
 */
export const deleteSkill = asyncHandler(async (req, res) => {
  const { id } = skillIdSchema.parse(req.params);

  await skillService.deleteSkill(req.user!.id, id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Skill deleted successfully.",
    data: null,
  });
});

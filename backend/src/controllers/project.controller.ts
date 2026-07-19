import asyncHandler from "../middlewares/asyncHandler";

import sendResponse from "../utils/sendResponse";

import { projectService } from "../services/project/project.service";

import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
} from "../dto/project.dto";

/**
 * POST /projects
 */
export const createProject = asyncHandler(async (req, res) => {
  const validatedData = createProjectSchema.parse(req.body);

  const project = await projectService.createProject(
    req.user!.id,
    validatedData,
  );

  return sendResponse(res, {
    statusCode: 201,
    message: "Project added successfully.",
    data: project,
  });
});

/**
 * GET /projects
 */
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getProjects(req.user!.id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Projects fetched successfully.",
    data: projects,
  });
});

/**
 * PATCH /projects/:id
 */
export const updateProject = asyncHandler(async (req, res) => {
  const { id } = projectIdParamSchema.parse(req.params);

  const validatedData = updateProjectSchema.parse(req.body);

  const project = await projectService.updateProject(
    req.user!.id,
    id,
    validatedData,
  );

  return sendResponse(res, {
    statusCode: 200,
    message: "Project updated successfully.",
    data: project,
  });
});

/**
 * DELETE /projects/:id
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = projectIdParamSchema.parse(req.params);

  await projectService.deleteProject(req.user!.id, id);

  return sendResponse(res, {
    statusCode: 200,
    message: "Project deleted successfully.",
    data: null,
  });
});

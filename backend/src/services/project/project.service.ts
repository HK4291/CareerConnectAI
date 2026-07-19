import { Project } from "@prisma/client";

import ApiError from "../../utils/ApiError";

import { CreateProjectDto, UpdateProjectDto } from "../../dto/project.dto";

import { IProjectService } from "../../interfaces/project.interface";

import { candidateRepository } from "../../repositories/candidate.repositoy";
import { projectRepository } from "../../repositories/project.repository";
import { profileCompletionService } from "../profile/profile-Completion.service";

class ProjectService implements IProjectService {
  /**
   * Create Project
   */
  async createProject(
    userId: string,
    data: CreateProjectDto,
  ): Promise<Project> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const projects = await projectRepository.create(candidate.id, data);

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return projects;
  }

  /**
   * Get All Projects
   */
  async getProjects(userId: string): Promise<Project[]> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    return projectRepository.findAllByCandidate(candidate.id);
  }

  /**
   * Update Project
   */
  async updateProject(
    userId: string,
    projectId: string,
    data: UpdateProjectDto,
  ): Promise<Project> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const project = await projectRepository.findByIdOrCandidate(
      candidate.id,
      projectId,
    );

    if (!project) {
      throw new ApiError(404, "Project not found.");
    }

    const ownsProject = await projectRepository.belongsToCandidate(
      project.id,
      candidate.id,
    );

    if (!ownsProject) {
      throw new ApiError(403, "You are not authorized to update this project.");
    }

    const projects = await projectRepository.update(project.id, data);

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return projects;
  }

  /**
   * Delete Project
   */
  async deleteProject(userId: string, projectId: string): Promise<Project> {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const project = await projectRepository.findByIdOrCandidate(
      candidate.id,
      projectId,
    );

    if (!project) {
      throw new ApiError(404, "Project not found.");
    }

    const ownsProject = await projectRepository.belongsToCandidate(
      project.id,
      candidate.id,
    );

    if (!ownsProject) {
      throw new ApiError(403, "You are not authorized to delete this project.");
    }

    const projects = await projectRepository.delete(project.id);

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return projects;
  }
}

export const projectService = new ProjectService();

import { Project } from "@prisma/client";

import { CreateProjectDto, UpdateProjectDto } from "../dto/project.dto";

export interface IProjectService {
  /**
   * Create Project
   */
  createProject(userId: string, data: CreateProjectDto): Promise<Project>;

  /**
   * Get Projects
   */
  getProjects(userId: string): Promise<Project[]>;

  /**
   * Update Project
   */
  updateProject(
    userId: string,
    projectId: string,
    data: UpdateProjectDto,
  ): Promise<Project>;

  /**
   * Delete Project
   */
  deleteProject(userId: string, projectId: string): Promise<Project>;
}

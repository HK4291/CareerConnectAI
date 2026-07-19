import { Project } from "@prisma/client";

import { prisma } from "../config/prisma";

import { CreateProjectDto, UpdateProjectDto } from "../dto/project.dto";

class ProjectRepository {
  /**
   * Create Project
   */
  async create(candidateId: string, data: CreateProjectDto): Promise<Project> {
    return prisma.project.create({
      data: {
        candidateId,
        ...data,
      },
    });
  }

  /**
   * Get Projects By Candidate
   */
  async findAllByCandidate(candidateId: string): Promise<Project[]> {
    return prisma.project.findMany({
      where: {
        candidateId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Find Project By Id
   */
  async findById(projectId: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
  }

  async findByIdOrCandidate(
    candidateId: string,
    projectId: string,
  ): Promise<Project | null> {
    return prisma.project.findFirst({
      where: {
        OR: [{ id: projectId }, { candidateId: projectId }],
        candidateId,
      },
    });
  }

  /**
   * Update Project
   */
  async update(projectId: string, data: UpdateProjectDto): Promise<Project> {
    return prisma.project.update({
      where: {
        id: projectId,
      },
      data,
    });
  }

  /**
   * Delete Project
   */
  async delete(projectId: string): Promise<Project> {
    return prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  }

  /**
   * Verify Ownership
   */
  async belongsToCandidate(
    projectId: string,
    candidateId: string,
  ): Promise<boolean> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        candidateId,
      },
      select: {
        id: true,
      },
    });

    return !!project;
  }

  /**
   * Count Projects
   */
  async count(candidateId: string): Promise<number> {
    return prisma.project.count({
      where: {
        candidateId,
      },
    });
  }
}

export const projectRepository = new ProjectRepository();

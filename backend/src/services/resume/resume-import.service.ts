import { Prisma, SkillLevel } from "@prisma/client";

import { prisma } from "../../config/prisma";

import ApiError from "../../utils/ApiError";

import { candidateRepository } from "../../repositories/candidate.repositoy";
import { resumeRepository } from "../../repositories/resume.repository";

import { profileCompletionService } from "../profile/profile-Completion.service";

import { ImportResumeDto } from "../../dto/import-resume.dto";
import { ParsedResume } from "../../types/parsed-resume";

class ResumeImportService {
  /**
   * Import Parsed Resume
   */
  async importResume(
    userId: string,
    resumeId: string,
    options: ImportResumeDto,
  ) {
    const candidate = await candidateRepository.findByUserId(userId);

    if (!candidate) {
      throw new ApiError(404, "Candidate profile not found.");
    }

    const resume = await resumeRepository.findById(resumeId);

    if (!resume) {
      throw new ApiError(404, "Resume not found.");
    }

    if (resume.candidateId !== candidate.id) {
      throw new ApiError(403, "You are not authorized to import this resume.");
    }

    if (!resume.parsedData) {
      throw new ApiError(400, "Resume has not been parsed yet.");
    }

    const parsedData = resume.parsedData as unknown as ParsedResume;

    const result = await prisma.$transaction(async (tx) => {
      const summary = {
        skills: 0,
        education: 0,
        experience: 0,
        projects: 0,
        certificates: 0,
      };

      if (options.skills !== false) {
        summary.skills = await this.importSkills(candidate.id, parsedData, tx);
      }

      if (options.education !== false) {
        summary.education = await this.importEducation(
          candidate.id,
          parsedData,
          tx,
        );
      }

      if (options.experience !== false) {
        summary.experience = await this.importExperience(
          candidate.id,
          parsedData,
          tx,
        );
      }

      if (options.projects !== false) {
        summary.projects = await this.importProjects(
          candidate.id,
          parsedData,
          tx,
        );
      }

      if (options.certificates !== false) {
        summary.certificates = await this.importCertificates(
          candidate.id,
          parsedData,
          tx,
        );
      }

      return summary;
    });

    await profileCompletionService.updateProfileCompletion(candidate.id);

    return {
      message: "Resume imported successfully.",
      imported: result,
    };
  }

  /**
   * Import Skills
   */
  private async importSkills(
    candidateId: string,
    parsedResume: ParsedResume,
    tx: Prisma.TransactionClient,
  ): Promise<number> {
    if (!parsedResume.skills?.length) {
      return 0;
    }

    let importedCount = 0;

    for (const parsedSkill of parsedResume.skills) {
      const skillName = parsedSkill.name.trim();

      if (!skillName) {
        continue;
      }

      /**
       * Find existing master skill
       */
      let skill = await tx.skill.findUnique({
        where: {
          name: skillName,
        },
      });

      /**
       * Create master skill if it doesn't exist
       */
      if (!skill) {
        skill = await tx.skill.create({
          data: {
            name: skillName,
          },
        });
      }

      /**
       * Check duplicate candidate skill
       */
      const existingCandidateSkill = await tx.candidateSkill.findUnique({
        where: {
          candidateId_skillId: {
            candidateId,
            skillId: skill.id,
          },
        },
      });

      if (existingCandidateSkill) {
        continue;
      }

      /**
       * Import skill
       */
      await tx.candidateSkill.create({
        data: {
          candidateId,
          skillId: skill.id,
          level: parsedSkill.level as SkillLevel,
          experienceYears: parsedSkill.experienceYears,
        },
      });

      importedCount++;
    }

    return importedCount;
  }

  /**
   * Import Education
   */
  private async importEducation(
    candidateId: string,
    parsedResume: ParsedResume,
    tx: Prisma.TransactionClient,
  ): Promise<number> {
    if (!parsedResume.education?.length) {
      return 0;
    }

    let importedCount = 0;

    for (const education of parsedResume.education) {
      if (!education.institution || !education.degree) {
        continue;
      }

      /**
       * Duplicate Detection
       */
      const exists = await tx.education.findFirst({
        where: {
          candidateId,
          institution: education.institution,
          degree: education.degree,
        },
      });

      if (exists) {
        continue;
      }

      await tx.education.create({
        data: {
          candidateId,
          institution: education.institution,
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy,
          startDate: education.startDate ? new Date(education.startDate) : "",
          endDate: education.endDate ? new Date(education.endDate) : null,
          grade: education.grade,
          description: education.description,
        },
      });

      importedCount++;
    }

    return importedCount;
  }

  /**
   * Import Experience
   */
  private async importExperience(
    candidateId: string,
    parsedResume: ParsedResume,
    tx: Prisma.TransactionClient,
  ): Promise<number> {
    if (!parsedResume.experience?.length) {
      return 0;
    }

    let importedCount = 0;

    for (const experience of parsedResume.experience) {
      if (!experience.company || !experience.position) {
        continue;
      }

      /**
       * Duplicate Detection
       */
      const exists = await tx.experience.findFirst({
        where: {
          candidateId,
          company: experience.company,
          position: experience.position,
        },
      });

      if (exists) {
        continue;
      }

      await tx.experience.create({
        data: {
          candidateId,
          company: experience.company,
          designation: experience.position,
          startDate: experience.startDate ? new Date(experience.startDate) : "",
          endDate: experience.isCurrent
            ? null
            : experience.endDate
              ? new Date(experience.endDate)
              : null,
          isCurrent: experience.isCurrent,
          description: experience.description,
        },
      });

      importedCount++;
    }

    return importedCount;
  }

  /**
   * Import Projects
   */
  private async importProjects(
    candidateId: string,
    parsedResume: ParsedResume,
    tx: Prisma.TransactionClient,
  ): Promise<number> {
    if (!parsedResume.projects?.length) {
      return 0;
    }

    let importedCount = 0;

    for (const project of parsedResume.projects) {
      if (!project.title) {
        continue;
      }

      /**
       * Duplicate Detection
       */
      const exists = await tx.project.findFirst({
        where: {
          candidateId,
          title: project.title,
        },
      });

      if (exists) {
        continue;
      }

      await tx.project.create({
        data: {
          candidateId,

          title: project.title,

          description: project.description,

          technologies: project.technologies,

          githubUrl: project.githubUrl,

          liveUrl: project.liveUrl,
        },
      });

      importedCount++;
    }

    return importedCount;
  }

  /**
   * Import Certificates
   */
  private async importCertificates(
    candidateId: string,
    parsedResume: ParsedResume,
    tx: Prisma.TransactionClient,
  ): Promise<number> {
    if (!parsedResume.certifications?.length) {
      return 0;
    }

    let importedCount = 0;

    for (const certificate of parsedResume.certifications) {
      if (!certificate.name) {
        continue;
      }

      /**
       * Duplicate Detection
       */
      const exists = await tx.certificate.findFirst({
        where: {
          candidateId,
          name: certificate.name,
          issuer: certificate.issuer,
        },
      });

      if (exists) {
        continue;
      }

      await tx.certificate.create({
        data: {
          candidateId,

          name: certificate.name,

          issuer: certificate.issuer as string,

          issueDate: certificate.issueDate
            ? new Date(certificate.issueDate)
            : "",

          credentialId: certificate.credentialId,
        },
      });

      importedCount++;
    }

    return importedCount;
  }
}

export const resumeImportService = new ResumeImportService();

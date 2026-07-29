import { Application } from "@prisma/client";

class ApplicationMapper {
  toResponse(application: Application) {
    return {
      id: application.id,
      jobId: application.jobId,
      candidateId: application.candidateId,
      status: application.status,
      resumeVersion: application.resumeVersion,
      coverLetter: application.coverLetter,
      appliedAt: application.appliedAt,
      updatedAt: application.updatedAt,
    };
  }

  toResponseList(applications: Application[]) {
    return applications.map((application) => this.toResponse(application));
  }
}

export default new ApplicationMapper();

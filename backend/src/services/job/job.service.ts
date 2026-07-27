import { Job, Prisma } from "@prisma/client";
import jobRepository from "../../repositories/job.repository";

class JobService {
  async createJob(data: Prisma.JobCreateInput): Promise<Job> {
    return await jobRepository.create(data);
  }
}

export default new JobService();

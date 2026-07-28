import ApiError from "../../utils/ApiError";
import {
  CreateRecruiterDto,
  UpdateRecruiterDto,
} from "../../dto/recruiter.dto";
import { recruiterRepository } from "../../repositories/recruiter.repository";

class RecruiterService {
  async createProfile(userId: string, data: CreateRecruiterDto) {
    const recruiter = await recruiterRepository.findByUserId(userId);

    if (recruiter) {
      throw new ApiError(409, "Recruiter profile already exists");
    }

    return recruiterRepository.create(userId, data.companyId);
  }

  async getProfile(userId: string) {
    const recruiter = await recruiterRepository.findByUserId(userId);

    if (!recruiter) {
      throw new ApiError(404, "Recruiter profile not found");
    }

    return recruiter;
  }

  async updateProfile(userId: string, data: UpdateRecruiterDto) {
    await this.getProfile(userId);

    return recruiterRepository.update(userId, data);
  }
}

export const recruiterService = new RecruiterService();

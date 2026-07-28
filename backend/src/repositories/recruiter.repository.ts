import { Recruiter } from "@prisma/client";
import { prisma } from "../config/prisma";
import { CreateRecruiterDto, UpdateRecruiterDto } from "../dto/recruiter.dto";
import { IRecruiterRepository } from "../interfaces/recruiter.interface";

class RecruiterRepository implements IRecruiterRepository {
  async create(userId: string, companyId: string): Promise<Recruiter> {
    return prisma.recruiter.create({
      data: {
        userId,
        companyId,
      },
    });
  }

  async findByUserId(userId: string): Promise<Recruiter | null> {
    return prisma.recruiter.findUnique({
      where: {
        userId,
      },
      include: {
        company: true,
        user: true,
      },
    });
  }

  async findById(id: string): Promise<Recruiter | null> {
    return prisma.recruiter.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        user: true,
      },
    });
  }

  async update(userId: string, data: UpdateRecruiterDto): Promise<Recruiter> {
    return prisma.recruiter.update({
      where: {
        userId,
      },
      data,
    });
  }
}

export const recruiterRepository = new RecruiterRepository();

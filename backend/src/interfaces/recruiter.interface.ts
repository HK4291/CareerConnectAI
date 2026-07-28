import { Recruiter } from "@prisma/client";

export interface IRecruiterRepository {
  create(userId: string, companyId: string): Promise<Recruiter>;
  findByUserId(userId: string): Promise<Recruiter | null>;
  findById(id: string): Promise<Recruiter | null>;
  update(
    userId: string,
    data: {
      designation?: string;
      companyId?: string;
      verified?: boolean;
    },
  ): Promise<Recruiter>;
}

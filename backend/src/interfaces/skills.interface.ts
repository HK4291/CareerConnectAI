import { CandidateSkill } from "@prisma/client";

import { CreateSkillDto, UpdateSkillDto } from "../dto/skills.dto";

export interface ISkillService {
  createSkill(userId: string, data: CreateSkillDto): Promise<CandidateSkill>;

  getSkills(userId: string): Promise<CandidateSkill[]>;

  updateSkill(
    userId: string,
    candidateSkillId: string,
    data: UpdateSkillDto,
  ): Promise<CandidateSkill>;

  deleteSkill(
    userId: string,
    candidateSkillId: string,
  ): Promise<CandidateSkill>;
}

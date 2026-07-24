import { IsBoolean, IsOptional } from "class-validator";

export class ImportResumeDto {
  @IsOptional()
  @IsBoolean()
  skills?: boolean = true;

  @IsOptional()
  @IsBoolean()
  education?: boolean = true;

  @IsOptional()
  @IsBoolean()
  experience?: boolean = true;

  @IsOptional()
  @IsBoolean()
  projects?: boolean = true;

  @IsOptional()
  @IsBoolean()
  certificates?: boolean = true;
}

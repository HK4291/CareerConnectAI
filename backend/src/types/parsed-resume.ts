export interface ParsedResume {
  rawText: string;

  personal: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };

  summary?: string;

  skills: ParsedSkill[];

  education: ParsedEducation[];

  experience: ParsedExperience[];

  projects: ParsedProject[];

  certifications: ParsedCertification[];

  languages: string[];

  achievements: string[];
}

export interface ParsedSkill {
  name: string;
  level?: string;
  experienceYears?: number;
}

export interface ParsedEducation {
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

export interface ParsedExperience {
  company: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface ParsedProject {
  title: string;
  description?: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface ParsedCertification {
  name: string;
  issuer?: string;
  issueDate?: string;
  credentialId?: string;
}
